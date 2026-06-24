import fs from "node:fs";
import { Pool } from "pg";

const editableDefaults = {
  shortDescription: "Catalog item imported from Vial.",
  researchOverview: "Catalog item imported from Vial.",
  purityLabel: "See current lot documentation",
  storageLabel: "See supplier documentation",
  molecularWeight: "See supplier documentation",
  sequence: "See supplier documentation",
};

function loadDotEnv() {
  if (!fs.existsSync(".env")) {
    return;
  }

  const lines = fs.readFileSync(".env", "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");

    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    process.env[key] ??= value;
  }
}

function cleanEnv(value) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : "";
}

function cleanBaseUrl(value) {
  return value.replace(/\/+$/, "");
}

function getVialConfig() {
  return {
    apiKey: cleanEnv(process.env.VIAL_API_KEY || process.env.PEPTIDE_AMERICA_VIALAPI_KEY),
    apiKeyHeader: cleanEnv(process.env.VIAL_AUTH_HEADER) || "Authorization",
    authScheme: process.env.VIAL_AUTH_SCHEME ?? "Bearer",
    baseUrl: cleanBaseUrl(cleanEnv(process.env.VIAL_API_BASE_URL) || "https://vialapi.com"),
    inventoryPath: cleanEnv(process.env.VIAL_INVENTORY_PATH) || "/api/v1/inventory",
    productsPath: cleanEnv(process.env.VIAL_PRODUCTS_PATH) || "/api/v1/products",
  };
}

function getDatabaseUrl() {
  const value = cleanEnv(process.env.DATABASE_URL);

  if (!value) {
    return null;
  }

  const url = new URL(value);

  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error("DATABASE_URL must use postgres:// or postgresql://.");
  }

  if (url.hostname.endsWith(".railway.internal") && !isRailwayRuntime()) {
    return null;
  }

  return { connectionString: value, url };
}

function isRailwayRuntime() {
  return Boolean(
    process.env.RAILWAY_ENVIRONMENT ||
      process.env.RAILWAY_ENVIRONMENT_ID ||
      process.env.RAILWAY_PROJECT_ID ||
      process.env.RAILWAY_SERVICE_ID,
  );
}

function shouldUseSsl(connectionString) {
  if (process.env.DATABASE_SSL === "true" || process.env.PGSSLMODE === "require") {
    return true;
  }

  return new URL(connectionString).searchParams.get("sslmode") === "require";
}

function joinUrl(baseUrl, path) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(cleanPath, baseUrl).toString();
}

function authValue(config) {
  const scheme = config.authScheme.trim();
  return scheme ? `${scheme} ${config.apiKey}` : config.apiKey;
}

async function requestVialJson(config, path) {
  if (!config.apiKey) {
    throw new Error("VIAL_API_KEY is not configured.");
  }

  const headers = new Headers();
  headers.set("Accept", "application/json");
  headers.set(config.apiKeyHeader, authValue(config));

  const response = await fetch(joinUrl(config.baseUrl, path), {
    cache: "no-store",
    headers,
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      typeof payload?.message === "string"
        ? payload.message
        : `Vial API request failed with ${response.status}.`;
    throw new Error(message);
  }

  return payload;
}

function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function firstRecord(value) {
  if (Array.isArray(value)) {
    return value.find(isRecord) ?? null;
  }

  return isRecord(value) ? value : null;
}

function extractCollection(payload) {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const key of ["products", "inventory", "items", "data", "results", "catalog"]) {
    const value = payload[key];

    if (Array.isArray(value)) {
      return value.filter(isRecord);
    }
  }

  return [];
}

function getValue(source, keys) {
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) {
      return source[key];
    }
  }

  return undefined;
}

function getText(source, keys, fallback = "") {
  const value = getValue(source, keys);

  if (typeof value === "string") {
    return value.trim() || fallback;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function getNestedProductRecord(source) {
  return firstRecord(source.product) ?? firstRecord(source.item) ?? source;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferSizeLabel(...values) {
  const source = values.filter(Boolean).join(" ");
  const match = source.match(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|iu)\b/i);

  return match ? match[0].replace(/\s+/g, " ") : "";
}

function parsePriceCents(source) {
  const cents = getValue(source, [
    "priceCents",
    "price_cents",
    "unitPriceCents",
    "unit_price_cents",
  ]);

  if (typeof cents === "number" && Number.isFinite(cents)) {
    return Math.max(0, Math.round(cents));
  }

  const dollars = getValue(source, [
    "price",
    "unitPrice",
    "unit_price",
    "retailPrice",
    "retail_price",
    "msrp",
  ]);
  const parsed =
    typeof dollars === "number"
      ? dollars
      : typeof dollars === "string"
        ? Number(dollars.replace(/[$,]/g, ""))
        : null;

  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed * 100)) : null;
}

function parseStockStatus(source) {
  const status = getText(source, [
    "stockStatus",
    "stock_status",
    "availability",
    "status",
  ]).toLowerCase();

  if (status.includes("out") || status.includes("unavailable") || status.includes("sold")) {
    return "out_of_stock";
  }

  const quantity = getValue(source, [
    "inventoryQuantity",
    "inventory_quantity",
    "quantity",
    "availableQuantity",
    "available_quantity",
    "stock",
  ]);

  if (typeof quantity === "number") {
    if (quantity <= 0) {
      return "out_of_stock";
    }

    if (quantity <= 5) {
      return "low_stock";
    }
  }

  if (status.includes("low")) {
    return "low_stock";
  }

  return "in_stock";
}

function parseTags(source) {
  const value = getValue(source, ["tags", "labels"]);

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function parseImages(source) {
  const value = getValue(source, ["images", "imageUrls", "image_urls"]);

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return isRecord(item) ? getText(item, ["url", "src"]) : "";
      })
      .filter(Boolean);
  }

  const image = getText(source, ["image", "imageUrl", "image_url"]);
  return image ? [image] : [];
}

function parseTechnicalSpecs(source) {
  const specs = getValue(source, ["technicalSpecs", "technical_specs", "specifications", "specs"]);

  if (Array.isArray(specs)) {
    return specs
      .map((item) => {
        if (!isRecord(item)) {
          return null;
        }

        const label = getText(item, ["label", "name", "key"]);
        const value = getText(item, ["value", "displayValue", "display_value"]);

        return label && value ? { label, value } : null;
      })
      .filter(Boolean);
  }

  if (isRecord(specs)) {
    return Object.entries(specs)
      .map(([label, value]) => ({ label, value: String(value) }))
      .filter((item) => item.label && item.value);
  }

  return [];
}

function mapVialProduct(source, inventoryBySku) {
  const product = getNestedProductRecord(source);
  const name = getText(product, ["name", "title", "productName", "product_name"], "Untitled product");
  const sku = getText(
    product,
    ["sku", "SKU", "itemSku", "item_sku"],
    getText(source, ["sku", "SKU"], slugify(name).toUpperCase()),
  ).toUpperCase();
  const inventory = inventoryBySku.get(sku);
  const stockSource = inventory ?? product;
  const slug = getText(product, ["slug", "handle", "permalink"], slugify(`${name}-${sku}`));
  const sizeLabel =
    getText(product, ["sizeLabel", "size_label", "size", "amount", "variantTitle", "variant_title"]) ||
    inferSizeLabel(name, sku) ||
    "See details";

  return {
    sku,
    productName: name,
    productSlug: slug,
    stockStatus: parseStockStatus(stockSource),
    priceCents: parsePriceCents(product),
    category: getText(product, ["category", "categoryName", "category_name", "collection", "type"], "Catalog"),
    sizeLabel,
    shortDescription: getText(
      product,
      ["shortDescription", "short_description", "summary", "description"],
      editableDefaults.shortDescription,
    ),
    researchOverview: getText(
      product,
      ["researchOverview", "research_overview", "description", "summary"],
      editableDefaults.researchOverview,
    ),
    purityLabel: getText(product, ["purityLabel", "purity_label", "purity"], editableDefaults.purityLabel),
    storageLabel: getText(product, ["storageLabel", "storage_label", "storage"], editableDefaults.storageLabel),
    molecularWeight: getText(product, ["molecularWeight", "molecular_weight", "mw"], editableDefaults.molecularWeight),
    sequence: getText(product, ["sequence"], editableDefaults.sequence),
    tags: parseTags(product),
    images: parseImages(product),
    technicalSpecs: parseTechnicalSpecs(product),
  };
}

async function ensureCatalogSchema(pool) {
  await pool.query(`
    create table if not exists catalog_product_overrides (
      sku text primary key,
      product_name text,
      product_slug text,
      stock_status text,
      primary_image_file uuid,
      secondary_image_file uuid,
      tertiary_image_file uuid,
      price_dollars numeric(10, 2),
      cost_dollars numeric(10, 2),
      price_cents integer,
      cost_cents integer,
      category text,
      size_label text,
      short_description text,
      research_overview text,
      purity_label text,
      storage_label text,
      molecular_weight text,
      sequence text,
      tags text[],
      images text[],
      technical_specs jsonb,
      is_featured boolean not null default false,
      is_hidden boolean not null default false,
      notes text,
      updated_by text,
      vial_last_synced_at timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);

  await pool.query(`
    alter table catalog_product_overrides
    add column if not exists product_name text,
    add column if not exists product_slug text,
    add column if not exists stock_status text,
    add column if not exists vial_last_synced_at timestamptz,
    add column if not exists primary_image_file uuid,
    add column if not exists secondary_image_file uuid,
    add column if not exists tertiary_image_file uuid,
    add column if not exists price_dollars numeric(10, 2),
    add column if not exists cost_dollars numeric(10, 2),
    add column if not exists cost_cents integer,
    add column if not exists is_featured boolean not null default false,
    add column if not exists is_hidden boolean not null default false,
    add column if not exists notes text,
    add column if not exists updated_by text,
    add column if not exists created_at timestamptz not null default now(),
    add column if not exists updated_at timestamptz not null default now()
  `);

  await pool.query(`
    create table if not exists catalog_product_images (
      id bigserial primary key,
      sku text not null references catalog_product_overrides(sku) on delete cascade,
      image_url text not null,
      alt_text text,
      sort_order integer not null default 0,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);

  await pool.query(
    "create index if not exists catalog_product_images_sku_idx on catalog_product_images (sku, sort_order, id)",
  );
  await pool.query(
    "create unique index if not exists catalog_product_images_sku_url_idx on catalog_product_images (sku, image_url)",
  );
}

async function upsertProduct(pool, product) {
  await pool.query(
    `
      insert into catalog_product_overrides (
        sku,
        product_name,
        product_slug,
        stock_status,
        price_cents,
        category,
        size_label,
        short_description,
        research_overview,
        purity_label,
        storage_label,
        molecular_weight,
        sequence,
        tags,
        images,
        technical_specs,
        vial_last_synced_at
      )
      values (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14::text[], $15::text[], $16::jsonb, now()
      )
      on conflict (sku) do update set
        product_name = excluded.product_name,
        product_slug = excluded.product_slug,
        stock_status = excluded.stock_status,
        category = coalesce(catalog_product_overrides.category, excluded.category),
        size_label = coalesce(catalog_product_overrides.size_label, excluded.size_label),
        price_cents = coalesce(catalog_product_overrides.price_cents, excluded.price_cents),
        short_description = coalesce(catalog_product_overrides.short_description, excluded.short_description),
        research_overview = coalesce(catalog_product_overrides.research_overview, excluded.research_overview),
        purity_label = coalesce(catalog_product_overrides.purity_label, excluded.purity_label),
        storage_label = coalesce(catalog_product_overrides.storage_label, excluded.storage_label),
        molecular_weight = coalesce(catalog_product_overrides.molecular_weight, excluded.molecular_weight),
        sequence = coalesce(catalog_product_overrides.sequence, excluded.sequence),
        tags = case
          when catalog_product_overrides.tags is null or cardinality(catalog_product_overrides.tags) = 0
          then excluded.tags
          else catalog_product_overrides.tags
        end,
        images = case
          when catalog_product_overrides.images is null or cardinality(catalog_product_overrides.images) = 0
          then excluded.images
          else catalog_product_overrides.images
        end,
        technical_specs = coalesce(catalog_product_overrides.technical_specs, excluded.technical_specs),
        vial_last_synced_at = now(),
        updated_at = now()
    `,
    [
      product.sku,
      product.productName,
      product.productSlug,
      product.stockStatus,
      product.priceCents,
      product.category,
      product.sizeLabel,
      product.shortDescription,
      product.researchOverview,
      product.purityLabel,
      product.storageLabel,
      product.molecularWeight,
      product.sequence,
      product.tags,
      product.images,
      JSON.stringify(product.technicalSpecs),
    ],
  );
}

async function upsertImages(pool, product) {
  for (const [index, imageUrl] of product.images.entries()) {
    await pool.query(
      `
        insert into catalog_product_images (sku, image_url, alt_text, sort_order)
        values ($1, $2, $3, $4)
        on conflict (sku, image_url) do update set
          alt_text = coalesce(catalog_product_images.alt_text, excluded.alt_text),
          sort_order = least(catalog_product_images.sort_order, excluded.sort_order),
          updated_at = now()
      `,
      [product.sku, imageUrl, product.productName, index],
    );
  }
}

export async function syncVialCatalog({ log = console.log } = {}) {
  loadDotEnv();

  const database = getDatabaseUrl();

  if (!database) {
    log("Skipping Vial catalog sync: DATABASE_URL is not available in this runtime.");
    return { skipped: true, products: 0 };
  }

  const vialConfig = getVialConfig();

  if (!vialConfig.apiKey) {
    log("Skipping Vial catalog sync: VIAL_API_KEY is not configured.");
    return { skipped: true, products: 0 };
  }

  const pool = new Pool({
    connectionString: database.connectionString,
    max: 2,
    ssl: shouldUseSsl(database.connectionString) ? { rejectUnauthorized: false } : undefined,
  });

  try {
    await ensureCatalogSchema(pool);

    const [productsPayload, inventoryPayload] = await Promise.all([
      requestVialJson(vialConfig, vialConfig.productsPath),
      requestVialJson(vialConfig, vialConfig.inventoryPath).catch(() => null),
    ]);
    const inventoryBySku = new Map(
      extractCollection(inventoryPayload).map((item) => [
        getText(item, ["sku", "SKU"]).toUpperCase(),
        item,
      ]),
    );
    const products = extractCollection(productsPayload)
      .map((item) => mapVialProduct(item, inventoryBySku))
      .filter((product) => product.sku);

    for (const product of products) {
      await upsertProduct(pool, product);
      await upsertImages(pool, product);
    }

    log(`Synced ${products.length} Vial catalog products into Directus tables.`);

    return { skipped: false, products: products.length };
  } finally {
    await pool.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncVialCatalog().catch((error) => {
    console.error("Vial catalog sync failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    process.exitCode = 1;
  });
}

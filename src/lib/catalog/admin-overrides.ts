import type { Product, TechnicalSpec } from "@/lib/commerce/types";
import { dbQuery, isDatabaseConfigured } from "@/lib/db/postgres";
import {
  type CatalogOverrides,
  type CatalogProductOverride,
  applyCatalogOverrides,
} from "@/lib/catalog/overrides";

type CatalogAdminOverrideRow = {
  sku: string;
  product_name: string | null;
  product_slug: string | null;
  stock_status: string | null;
  primary_image_file: string | null;
  secondary_image_file: string | null;
  tertiary_image_file: string | null;
  price_dollars: string | number | null;
  cost_dollars: string | number | null;
  price_cents: number | null;
  cost_cents: number | null;
  category: string | null;
  size_label: string | null;
  short_description: string | null;
  research_overview: string | null;
  purity_label: string | null;
  storage_label: string | null;
  molecular_weight: string | null;
  sequence: string | null;
  tags: string[] | null;
  images: string[] | null;
  technical_specs: unknown;
  is_featured: boolean;
  is_hidden: boolean;
  notes: string | null;
  updated_by: string | null;
  vial_last_synced_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

type CatalogProductImageRow = {
  sku: string;
  image_url: string;
};

function parseDollarCents(value: string | number | null) {
  if (value === null) {
    return null;
  }

  const parsed =
    typeof value === "number" ? value : Number(value.replace(/[$,]/g, ""));

  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed * 100)) : null;
}

function getDirectusPublicUrl() {
  const value =
    process.env.DIRECTUS_PUBLIC_URL?.trim() ||
    process.env.DIRECTUS_ADMIN_URL?.trim() ||
    "";

  return value.replace(/\/+$/, "");
}

function directusAssetUrl(fileId: string | null) {
  const directusUrl = getDirectusPublicUrl();
  const cleanFileId = fileId?.trim();

  return directusUrl && cleanFileId ? `${directusUrl}/assets/${cleanFileId}` : null;
}

function getAttachedImageUrls(row: CatalogAdminOverrideRow) {
  return [
    directusAssetUrl(row.primary_image_file),
    directusAssetUrl(row.secondary_image_file),
    directusAssetUrl(row.tertiary_image_file),
  ].filter((url): url is string => Boolean(url));
}

export type CatalogAdminOverride = {
  sku: string;
  priceCents: number | null;
  costCents: number | null;
  category: string | null;
  sizeLabel: string | null;
  shortDescription: string | null;
  researchOverview: string | null;
  purityLabel: string | null;
  storageLabel: string | null;
  molecularWeight: string | null;
  sequence: string | null;
  tags: string[];
  images: string[];
  technicalSpecs: TechnicalSpec[];
  isFeatured: boolean;
  isHidden: boolean;
  notes: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
};

let ensureCatalogTablesPromise: Promise<void> | null = null;

function normalizeSku(sku: string) {
  return sku.trim().toUpperCase();
}

function parseTechnicalSpecs(value: unknown): TechnicalSpec[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }

      const record = item as Record<string, unknown>;
      const label = typeof record.label === "string" ? record.label.trim() : "";
      const specValue = typeof record.value === "string" ? record.value.trim() : "";

      return label && specValue ? { label, value: specValue } : null;
    })
    .filter((item): item is TechnicalSpec => Boolean(item));
}

function rowToAdminOverride(row: CatalogAdminOverrideRow): CatalogAdminOverride {
  const priceDollarCents = parseDollarCents(row.price_dollars);
  const costDollarCents = parseDollarCents(row.cost_dollars);

  return {
    sku: row.sku,
    priceCents: priceDollarCents ?? row.price_cents,
    costCents: costDollarCents ?? row.cost_cents,
    category: row.category,
    sizeLabel: row.size_label,
    shortDescription: row.short_description,
    researchOverview: row.research_overview,
    purityLabel: row.purity_label,
    storageLabel: row.storage_label,
    molecularWeight: row.molecular_weight,
    sequence: row.sequence,
    tags: row.tags ?? [],
    images: [...getAttachedImageUrls(row), ...(row.images ?? [])],
    technicalSpecs: parseTechnicalSpecs(row.technical_specs),
    isFeatured: row.is_featured,
    isHidden: row.is_hidden,
    notes: row.notes,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function applyImageRows(
  overrides: CatalogAdminOverride[],
  imageRows: CatalogProductImageRow[],
) {
  const imagesBySku = new Map<string, string[]>();

  for (const row of imageRows) {
    const sku = normalizeSku(row.sku);
    const imageUrl = row.image_url.trim();

    if (!sku || !imageUrl) {
      continue;
    }

    const existing = imagesBySku.get(sku) ?? [];
    existing.push(imageUrl);
    imagesBySku.set(sku, existing);
  }

  return overrides.map((override) => {
    const images = imagesBySku.get(normalizeSku(override.sku));

    return images && images.length > 0 ? { ...override, images } : override;
  });
}


function toPublicCatalogOverrides(rows: CatalogAdminOverride[]): CatalogOverrides {
  return Object.fromEntries(
    rows.map((row) => {
      const override: CatalogProductOverride = {};

      if (row.priceCents !== null) override.priceCents = row.priceCents;
      if (row.category) override.category = row.category;
      if (row.sizeLabel) override.sizeLabel = row.sizeLabel;
      if (row.shortDescription) override.shortDescription = row.shortDescription;
      if (row.researchOverview) override.researchOverview = row.researchOverview;
      if (row.purityLabel) override.purityLabel = row.purityLabel;
      if (row.storageLabel) override.storageLabel = row.storageLabel;
      if (row.molecularWeight) override.molecularWeight = row.molecularWeight;
      if (row.sequence) override.sequence = row.sequence;
      if (row.tags.length > 0) override.tags = row.tags;
      if (row.images.length > 0) override.images = row.images;
      if (row.technicalSpecs.length > 0) override.technicalSpecs = row.technicalSpecs;

      return [row.sku, override];
    }),
  );
}

export function isCatalogAdminConfigured() {
  return isDatabaseConfigured();
}

export async function ensureCatalogAdminTables() {
  if (!ensureCatalogTablesPromise) {
    ensureCatalogTablesPromise = (async () => {
      await dbQuery(`
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

      await dbQuery(`
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

      await dbQuery(`
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

      await dbQuery(
        "create index if not exists catalog_product_images_sku_idx on catalog_product_images (sku, sort_order, id)",
      );
      await dbQuery(
        "create unique index if not exists catalog_product_images_sku_url_idx on catalog_product_images (sku, image_url)",
      );
      await dbQuery(`
        update catalog_product_overrides
        set price_dollars = round(price_cents::numeric / 100, 2)
        where price_dollars is null
          and price_cents is not null
      `);
      await dbQuery(`
        update catalog_product_overrides
        set cost_dollars = round(cost_cents::numeric / 100, 2)
        where cost_dollars is null
          and cost_cents is not null
      `);
    })();
  }

  return ensureCatalogTablesPromise;
}

export async function listCatalogAdminOverrides() {
  await ensureCatalogAdminTables();

  const [overrideResult, imageResult] = await Promise.all([
    dbQuery<CatalogAdminOverrideRow>(`
      select *
      from catalog_product_overrides
      order by sku
    `),
    dbQuery<CatalogProductImageRow>(`
      select sku, image_url
      from catalog_product_images
      order by sku, sort_order, id
    `),
  ]);

  return applyImageRows(overrideResult.rows.map(rowToAdminOverride), imageResult.rows);
}

export async function applyDatabaseCatalogOverrides(products: Product[]) {
  if (!isCatalogAdminConfigured()) {
    return products;
  }

  const rows = await listCatalogAdminOverrides();
  const hiddenSkus = new Set(
    rows.filter((row) => row.isHidden).map((row) => normalizeSku(row.sku)),
  );
  const featuredSkus = new Set(
    rows.filter((row) => row.isFeatured).map((row) => normalizeSku(row.sku)),
  );
  const merged = applyCatalogOverrides(products, toPublicCatalogOverrides(rows));

  return merged
    .filter((product) => !hiddenSkus.has(normalizeSku(product.sku)))
    .map((product) => {
      if (!featuredSkus.has(normalizeSku(product.sku)) || product.tags.includes("featured")) {
        return product;
      }

      return {
        ...product,
        tags: [...product.tags, "featured"],
      };
    });
}

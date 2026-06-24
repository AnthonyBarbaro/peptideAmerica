import type { CoaBatch, CoaBatchStatus, Product, StockStatus, TechnicalSpec } from "@/lib/commerce/types";

type JsonRecord = Record<string, unknown>;

const textKeys = {
  id: ["id", "uuid", "productId", "product_id"],
  slug: ["slug", "handle", "permalink"],
  name: ["name", "title", "productName", "product_name"],
  sku: ["sku", "SKU", "itemSku", "item_sku"],
  category: ["category", "categoryName", "category_name", "collection", "type"],
  sizeLabel: ["sizeLabel", "size_label", "size", "amount", "variantTitle", "variant_title"],
  shortDescription: ["shortDescription", "short_description", "summary", "description"],
  researchOverview: ["researchOverview", "research_overview", "description", "summary"],
  purityLabel: ["purityLabel", "purity_label", "purity"],
  storageLabel: ["storageLabel", "storage_label", "storage"],
  molecularWeight: ["molecularWeight", "molecular_weight", "mw"],
  sequence: ["sequence"],
};

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function firstRecord(value: unknown): JsonRecord | null {
  if (Array.isArray(value)) {
    return value.find(isRecord) ?? null;
  }

  return isRecord(value) ? value : null;
}

function getValue(source: JsonRecord, keys: string[]) {
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) {
      return source[key];
    }
  }

  return undefined;
}

function getText(source: JsonRecord, keys: string[], fallback = "") {
  const value = getValue(source, keys);

  if (typeof value === "string") {
    return value.trim() || fallback;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function getNestedProductRecord(source: JsonRecord) {
  return firstRecord(source.product) ?? firstRecord(source.item) ?? source;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferSizeLabel(...values: string[]) {
  const source = values.filter(Boolean).join(" ");
  const match = source.match(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|iu)\b/i);

  return match ? match[0].replace(/\s+/g, " ") : "";
}

function parsePriceCents(source: JsonRecord) {
  const cents = getValue(source, ["priceCents", "price_cents", "unitPriceCents", "unit_price_cents"]);

  if (typeof cents === "number" && Number.isFinite(cents)) {
    return Math.max(0, Math.round(cents));
  }

  const dollars = getValue(source, ["price", "unitPrice", "unit_price", "retailPrice", "retail_price", "msrp"]);
  const parsed =
    typeof dollars === "number"
      ? dollars
      : typeof dollars === "string"
        ? Number(dollars.replace(/[$,]/g, ""))
        : 0;

  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed * 100)) : 0;
}

function parseStockStatus(source: JsonRecord): StockStatus {
  const status = getText(source, ["stockStatus", "stock_status", "availability", "status"]).toLowerCase();

  if (status.includes("out") || status.includes("unavailable") || status.includes("sold")) {
    return "out_of_stock";
  }

  const quantity = getValue(source, ["inventoryQuantity", "inventory_quantity", "quantity", "availableQuantity", "available_quantity", "stock"]);

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

function parseTags(source: JsonRecord) {
  const value = getValue(source, ["tags", "labels"]);

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function parseImages(source: JsonRecord) {
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

function parseTechnicalSpecs(source: JsonRecord): TechnicalSpec[] {
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
      .filter((item): item is TechnicalSpec => Boolean(item));
  }

  if (isRecord(specs)) {
    return Object.entries(specs)
      .map(([label, value]) => ({ label, value: String(value) }))
      .filter((item) => item.label && item.value);
  }

  return [];
}

function parseCoaStatus(source: JsonRecord): CoaBatchStatus {
  const status = getText(source, ["status", "coaStatus", "coa_status"]).toLowerCase();
  return status.includes("verified") || status.includes("approved") ? "verified" : "pending";
}

function parsePurityPercent(source: JsonRecord) {
  const value = getValue(source, ["purityPercent", "purity_percent", "purity"]);

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace("%", ""));
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function parseCoaBatches(source: JsonRecord, productSlug: string, sku: string): CoaBatch[] {
  const value = getValue(source, ["coaBatches", "coa_batches", "coas", "coaDocuments", "coa_documents", "lots", "batches"]);

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isRecord)
    .map((batch, index) => {
      const batchNumber =
        getText(batch, ["batchNumber", "batch_number", "lotNumber", "lot_number", "lot", "number"]) ||
        `${sku}-${index + 1}`;

      return {
        id: getText(batch, ["id", "uuid"], `${productSlug}-${batchNumber}`),
        productSlug,
        sku: getText(batch, ["sku"], sku),
        batchNumber,
        labName: getText(batch, ["labName", "lab_name", "lab"], "Pending lab"),
        testedAt: getText(batch, ["testedAt", "tested_at", "reportedAt", "reported_at", "date"], "Pending"),
        purityPercent: parsePurityPercent(batch),
        status: parseCoaStatus(batch),
        documentUrl: getText(batch, ["documentUrl", "document_url", "publicUrl", "public_url", "url"]),
        notes: getText(batch, ["notes", "description"], "COA record imported from Vial."),
      };
    })
    .filter((batch) => batch.documentUrl);
}

export function extractVialCollection(payload: unknown): JsonRecord[] {
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

export function mergeVialInventory(products: Product[], payload: unknown): Product[] {
  const inventoryBySku = new Map(
    extractVialCollection(payload).map((item) => [getText(item, ["sku", "SKU"]), item]),
  );

  return products.map((product) => {
    const inventory = inventoryBySku.get(product.sku);

    if (!inventory) {
      return product;
    }

    return {
      ...product,
      name: product.name || getText(inventory, textKeys.name, product.name),
      stockStatus: parseStockStatus(inventory),
      technicalSpecs: [
        ...product.technicalSpecs,
        ...[
          getText(inventory, ["inventorySyncedAt", "inventory_synced_at"])
            ? {
                label: "Inventory synced",
                value: getText(inventory, ["inventorySyncedAt", "inventory_synced_at"]),
              }
            : null,
        ].filter((item): item is TechnicalSpec => Boolean(item)),
      ],
    };
  });
}

export function mapVialProduct(source: JsonRecord): Product {
  const product = getNestedProductRecord(source);
  const name = getText(product, textKeys.name, "Untitled product");
  const sku = getText(product, textKeys.sku, getText(source, textKeys.sku, slugify(name).toUpperCase()));
  const slug = getText(product, textKeys.slug, slugify(`${name}-${sku}`));
  const sizeLabel =
    getText(product, textKeys.sizeLabel) || inferSizeLabel(name, sku) || "See details";

  return {
    id: getText(product, textKeys.id, sku || slug),
    slug,
    name,
    sku,
    category: getText(product, textKeys.category, "Catalog"),
    priceCents: parsePriceCents(product),
    sizeLabel,
    stockStatus: parseStockStatus(product),
    shortDescription: getText(product, textKeys.shortDescription, "Catalog item imported from Vial."),
    researchOverview: getText(product, textKeys.researchOverview, "Catalog item imported from Vial."),
    technicalSpecs: parseTechnicalSpecs(product),
    purityLabel: getText(product, textKeys.purityLabel, "See current lot documentation"),
    storageLabel: getText(product, textKeys.storageLabel, "See supplier documentation"),
    molecularWeight: getText(product, textKeys.molecularWeight, "See supplier documentation"),
    sequence: getText(product, textKeys.sequence, "See supplier documentation"),
    tags: parseTags(product),
    images: parseImages(product),
    coaBatches: parseCoaBatches(product, slug, sku),
  };
}

export function mapVialProducts(payload: unknown): Product[] {
  const collection = extractVialCollection(payload);

  if (collection.length > 0) {
    return collection.map(mapVialProduct);
  }

  return isRecord(payload) ? [mapVialProduct(payload)] : [];
}

import type { CommerceProvider, Product, ProductQuery, StockStatus } from "@/lib/commerce/types";
import { applyDatabaseCatalogOverrides } from "@/lib/catalog/admin-overrides";
import {
  applyApprovedCoaDocuments,
  mergeApprovedCoaBatches,
} from "@/lib/catalog/approved-coas";
import { applyCatalogOverrides } from "@/lib/catalog/overrides";
import { getVialConfig, isVialCatalogConfigured } from "./config";
import { VialClient } from "./client";
import { mapVialProducts, mergeVialInventory } from "./mapper";

let loggedCatalogOverrideWarning = false;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function productMatches(product: Product, search: string) {
  const term = normalize(search);

  if (!term) {
    return true;
  }

  return [
    product.name,
    product.sku,
    product.category,
    product.shortDescription,
    ...product.tags,
  ].some((value) => normalize(value).includes(term));
}

function compareStockStatus(a: StockStatus, b: StockStatus) {
  const rank: Record<StockStatus, number> = {
    in_stock: 0,
    low_stock: 1,
    out_of_stock: 2,
  };

  return rank[a] - rank[b];
}

function sortProducts(products: Product[], sort: ProductQuery["sort"] = "featured") {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.priceCents - b.priceCents);
    case "price-desc":
      return sorted.sort((a, b) => b.priceCents - a.priceCents);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
    default:
      return sorted.sort((a, b) => {
        const stockOrder = compareStockStatus(a.stockStatus, b.stockStatus);
        const aFeatured = a.tags.includes("featured") ? 0 : 1;
        const bFeatured = b.tags.includes("featured") ? 0 : 1;

        return stockOrder || aFeatured - bFeatured || a.name.localeCompare(b.name);
      });
  }
}

async function fetchVialProducts(): Promise<Product[]> {
  const config = getVialConfig();

  if (!isVialCatalogConfigured(config)) {
    return [];
  }

  const client = new VialClient(config);
  const [productsPayload, inventoryPayload] = await Promise.all([
    client.requestJson<unknown>(config.productsPath),
    client.requestJson<unknown>(config.inventoryPath).catch(() => null),
  ]);
  const products = mapVialProducts(productsPayload);
  const staticProducts = applyCatalogOverrides(
    inventoryPayload ? mergeVialInventory(products, inventoryPayload) : products,
  );

  try {
    return applyApprovedCoaDocuments(await applyDatabaseCatalogOverrides(staticProducts));
  } catch (error) {
    if (!loggedCatalogOverrideWarning) {
      loggedCatalogOverrideWarning = true;
      console.warn(
        `Using Vial catalog without database overrides: ${
          error instanceof Error ? error.message : "Unknown database error"
        }`,
      );
    }

    return applyApprovedCoaDocuments(staticProducts);
  }
}

// Short-lived in-memory cache so a single page render (and bursts of requests)
// don't refetch the Vial catalog on every call. Stock still updates within
// VIAL_CATALOG_TTL_MS (default 30s). Set to 0 to disable.
const CATALOG_TTL_MS = Number(process.env.VIAL_CATALOG_TTL_MS ?? "30000");
let catalogCache: { at: number; products: Product[] } | null = null;

async function listVialProducts(): Promise<Product[]> {
  if (
    CATALOG_TTL_MS > 0 &&
    catalogCache &&
    Date.now() - catalogCache.at < CATALOG_TTL_MS
  ) {
    return catalogCache.products;
  }

  const products = await fetchVialProducts();
  catalogCache = { at: Date.now(), products };

  return products;
}

// When true, out-of-stock products are hidden from customer-facing listings
// (homepage, shop, search). Direct product pages and the COA library still
// resolve so existing links and documentation keep working.
const hideOutOfStock = process.env.HIDE_OUT_OF_STOCK === "true";

export const vialCommerceProvider: CommerceProvider = {
  name: "vial",
  async listProducts(query = {}) {
    const products = await listVialProducts();
    const filtered = products.filter((product) => {
      if (hideOutOfStock && product.stockStatus === "out_of_stock") {
        return false;
      }

      const categoryMatches = !query.category || product.category === query.category;
      const searchMatches = !query.search || productMatches(product, query.search);

      return categoryMatches && searchMatches;
    });
    const sorted = sortProducts(filtered, query.sort);

    return typeof query.first === "number" ? sorted.slice(0, query.first) : sorted;
  },
  async getProduct(slug) {
    // Use the raw list (not the hide-out-of-stock filtered one) so direct
    // product links keep working even when out-of-stock items are hidden.
    const listedProduct = (await listVialProducts()).find(
      (product) => product.slug === slug,
    );

    if (listedProduct) {
      return listedProduct;
    }

    const config = getVialConfig();

    if (isVialCatalogConfigured(config) && config.productPath) {
      const path = config.productPath.replace(":slug", encodeURIComponent(slug));
      const products = applyApprovedCoaDocuments(
        mapVialProducts(await new VialClient(config).requestJson<unknown>(path)),
      );
      const directMatch = products.find((product) => product.slug === slug);

      if (directMatch) {
        return directMatch;
      }
    }

    return null;
  },
  async searchProducts(query) {
    return (await vialCommerceProvider.listProducts()).filter((product) => productMatches(product, query));
  },
  async listCategories() {
    return Array.from(
      new Set((await vialCommerceProvider.listProducts()).map((product) => product.category)),
    ).sort();
  },
  async listCoaBatches(productSlug) {
    // COA documentation stays available regardless of stock, so use the raw list.
    const products = await listVialProducts();
    const batches = products.flatMap((product) => product.coaBatches);

    return mergeApprovedCoaBatches(batches, products, productSlug);
  },
};

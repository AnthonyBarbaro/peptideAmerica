import type { CommerceProvider, Product, ProductQuery } from "@/lib/commerce/types";
import { applyCatalogOverrides } from "@/lib/catalog/overrides";
import { getVialConfig, isVialCatalogConfigured } from "./config";
import { VialClient } from "./client";
import { mapVialProducts, mergeVialInventory } from "./mapper";

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
        const aFeatured = a.tags.includes("featured") ? 0 : 1;
        const bFeatured = b.tags.includes("featured") ? 0 : 1;
        return aFeatured - bFeatured || a.name.localeCompare(b.name);
      });
  }
}

async function listVialProducts() {
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

  return applyCatalogOverrides(
    inventoryPayload ? mergeVialInventory(products, inventoryPayload) : products,
  );
}

export const vialCommerceProvider: CommerceProvider = {
  name: "vial",
  async listProducts(query = {}) {
    const products = await listVialProducts();
    const filtered = products.filter((product) => {
      const categoryMatches = !query.category || product.category === query.category;
      const searchMatches = !query.search || productMatches(product, query.search);

      return categoryMatches && searchMatches;
    });
    const sorted = sortProducts(filtered, query.sort);

    return typeof query.first === "number" ? sorted.slice(0, query.first) : sorted;
  },
  async getProduct(slug) {
    const config = getVialConfig();

    if (isVialCatalogConfigured(config) && config.productPath) {
      const path = config.productPath.replace(":slug", encodeURIComponent(slug));
      const products = mapVialProducts(await new VialClient(config).requestJson<unknown>(path));
      const directMatch = products.find((product) => product.slug === slug);

      if (directMatch) {
        return directMatch;
      }
    }

    return (await vialCommerceProvider.listProducts()).find((product) => product.slug === slug) ?? null;
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
    const batches = (await vialCommerceProvider.listProducts()).flatMap((product) => product.coaBatches);

    return productSlug
      ? batches.filter((batch) => batch.productSlug === productSlug)
      : batches;
  },
};

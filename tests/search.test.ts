import { describe, expect, it } from "vitest";
import { researchArticles } from "../src/lib/research/articles";
import {
  buildSearchResults,
  searchArticles,
  searchCoaBatches,
  searchProducts,
} from "../src/lib/search";
import { productFixtures } from "./fixtures/products";

describe("search helpers", () => {
  it("filters products by name, SKU, category, and tags", () => {
    expect(searchProducts(productFixtures, "alpha")).toHaveLength(1);
    expect(searchProducts(productFixtures, "PA-BETA")).toHaveLength(1);
    expect(searchProducts(productFixtures, "specialty")).toHaveLength(1);
  });

  it("filters COA batches by batch fields and product name", () => {
    const batches = productFixtures.flatMap((product) => product.coaBatches);

    expect(searchCoaBatches(batches, productFixtures, "ALP-001")).toHaveLength(1);
    expect(searchCoaBatches(batches, productFixtures, "Alpha")).toHaveLength(1);
  });

  it("filters articles by title and body content", () => {
    expect(searchArticles(researchArticles, "Understanding COA")).toHaveLength(1);
    expect(searchArticles(researchArticles, "Storage Labels")).toHaveLength(1);
  });

  it("builds mixed search results", () => {
    const results = buildSearchResults({
      products: productFixtures,
      batches: productFixtures.flatMap((product) => product.coaBatches),
      articles: researchArticles,
      query: "batch",
    });

    expect(results.some((result) => result.type === "product")).toBe(true);
    expect(results.some((result) => result.type === "coa")).toBe(true);
    expect(results.some((result) => result.type === "article")).toBe(true);
  });
});

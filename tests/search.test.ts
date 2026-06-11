import { describe, expect, it } from "vitest";
import { mockProducts } from "../src/lib/commerce/mock-provider";
import { researchArticles } from "../src/lib/research/articles";
import {
  buildSearchResults,
  searchArticles,
  searchCoaBatches,
  searchProducts,
} from "../src/lib/search";

describe("search helpers", () => {
  it("filters products by name, SKU, category, and tags", () => {
    expect(searchProducts(mockProducts, "alpha")).toHaveLength(1);
    expect(searchProducts(mockProducts, "PA-BETA")).toHaveLength(1);
    expect(searchProducts(mockProducts, "specialty")).toHaveLength(1);
  });

  it("filters COA batches by batch fields and product name", () => {
    const batches = mockProducts.flatMap((product) => product.coaBatches);

    expect(searchCoaBatches(batches, mockProducts, "ALP-SAMPLE")).toHaveLength(2);
    expect(searchCoaBatches(batches, mockProducts, "Gamma")).toHaveLength(1);
  });

  it("filters articles by title and body content", () => {
    expect(searchArticles(researchArticles, "Understanding COA")).toHaveLength(1);
    expect(searchArticles(researchArticles, "Storage Labels")).toHaveLength(1);
  });

  it("builds mixed search results", () => {
    const results = buildSearchResults({
      products: mockProducts,
      batches: mockProducts.flatMap((product) => product.coaBatches),
      articles: researchArticles,
      query: "sample",
    });

    expect(results.some((result) => result.type === "product")).toBe(true);
    expect(results.some((result) => result.type === "coa")).toBe(true);
    expect(results.some((result) => result.type === "article")).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { mockCommerceProvider } from "../src/lib/commerce/mock-provider";

describe("mockCommerceProvider", () => {
  it("returns products and COA batches from the same data set", async () => {
    const products = await mockCommerceProvider.listProducts();
    const batches = await mockCommerceProvider.listCoaBatches();

    expect(products).toHaveLength(4);
    expect(batches.length).toBeGreaterThan(0);
    expect(products.every((product) => product.coaBatches.length > 0)).toBe(true);
  });
});

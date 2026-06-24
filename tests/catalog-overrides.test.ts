import { describe, expect, it } from "vitest";
import { applyCatalogOverrides } from "../src/lib/catalog/overrides";
import { productFixtures } from "./fixtures/products";

describe("catalog overrides", () => {
  it("overlays approved storefront fields by SKU", () => {
    const [product] = applyCatalogOverrides(productFixtures, {
      [productFixtures[0].sku]: {
        priceCents: 12900,
        category: "Reference Materials",
        sizeLabel: "10mg",
        shortDescription: "Updated storefront description.",
        tags: ["featured"],
      },
    });

    expect(product).toMatchObject({
      priceCents: 12900,
      category: "Reference Materials",
      sizeLabel: "10mg",
      shortDescription: "Updated storefront description.",
      tags: ["featured"],
    });
  });

  it("ignores invalid override prices", () => {
    const [product] = applyCatalogOverrides(productFixtures, {
      [productFixtures[0].sku]: {
        priceCents: Number.NaN,
      },
    });

    expect(product.priceCents).toBe(productFixtures[0].priceCents);
  });
});

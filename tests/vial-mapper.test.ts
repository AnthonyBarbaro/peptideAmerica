import { describe, expect, it } from "vitest";
import { mapVialProducts } from "../src/lib/vial/mapper";

describe("Vial product mapper", () => {
  it("maps common catalog payloads into storefront products", () => {
    const products = mapVialProducts({
      products: [
        {
          id: "vial_1",
          name: "Retatrutide",
          sku: "RET-10",
          category: "Reference Peptides",
          price: "129.00",
          size: "10 mg",
          inventory_quantity: 3,
          description: "Catalog description.",
          tags: ["featured"],
          coa_documents: [
            {
              id: "coa_1",
              lot_number: "RET-001",
              lab: "Third Party Lab",
              reported_at: "2026-06-01",
              purity: "99.1%",
              status: "approved",
              public_url: "https://example.com/ret-001.pdf",
            },
          ],
        },
      ],
    });

    expect(products).toHaveLength(1);
    expect(products[0]).toMatchObject({
      id: "vial_1",
      slug: "retatrutide-ret-10",
      name: "Retatrutide",
      sku: "RET-10",
      priceCents: 12900,
      stockStatus: "low_stock",
    });
    expect(products[0].coaBatches[0]).toMatchObject({
      batchNumber: "RET-001",
      status: "verified",
      purityPercent: 99.1,
    });
  });

  it("infers size labels from Vial names when no size field exists", () => {
    const products = mapVialProducts({
      products: [
        {
          name: "AOD 9604 10mg",
          sku: "AOD9604-10MG",
          status: "active",
        },
      ],
    });

    expect(products[0].sizeLabel).toBe("10mg");
  });
});

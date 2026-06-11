import { describe, expect, it } from "vitest";
import { mockProducts } from "../src/lib/commerce/mock-provider";
import { createCheckoutSession } from "../src/lib/payment/checkout-provider";

const product = mockProducts[0];

describe("checkout provider", () => {
  it("blocks checkout without attestation", async () => {
    const response = await createCheckoutSession({
      attestationAccepted: false,
      items: [
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          sku: product.sku,
          priceCents: product.priceCents,
          quantity: 1,
        },
      ],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/attestation/i);
  });

  it("does not create a payment session in Phase 1", async () => {
    const response = await createCheckoutSession({
      attestationAccepted: true,
      items: [
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          sku: product.sku,
          priceCents: product.priceCents,
          quantity: 1,
        },
      ],
    });

    expect(response.ok).toBe(true);
    expect(response.checkoutMode).toBe("disabled");
    expect(response.redirectUrl).toBeUndefined();
  });
});

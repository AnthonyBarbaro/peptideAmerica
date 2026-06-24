import { afterEach, describe, expect, it } from "vitest";
import { createCheckoutSession } from "../src/lib/payment/checkout-provider";
import { productFixtures } from "./fixtures/products";

const product = productFixtures[0];
const originalCheckoutMode = process.env.CHECKOUT_MODE;
const originalAllowUnpaidOrders = process.env.VIAL_ALLOW_UNPAID_ORDERS;
const originalPaymentProvider = process.env.PAYMENT_PROVIDER;

afterEach(() => {
  process.env.CHECKOUT_MODE = originalCheckoutMode;
  process.env.VIAL_ALLOW_UNPAID_ORDERS = originalAllowUnpaidOrders;
  process.env.PAYMENT_PROVIDER = originalPaymentProvider;
});

const contact = {
  customer: {
    email: "orders@example.com",
    firstName: "Ada",
    lastName: "Lovelace",
  },
  shippingAddress: {
    line1: "1 Research Way",
    city: "Austin",
    region: "TX",
    postalCode: "78701",
    country: "US",
  },
};

describe("checkout provider", () => {
  it("blocks checkout without attestation", async () => {
    const response = await createCheckoutSession({
      attestationAccepted: false,
      ...contact,
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

  it("does not submit an order when checkout mode is disabled", async () => {
    process.env.CHECKOUT_MODE = "disabled";
    process.env.VIAL_ALLOW_UNPAID_ORDERS = "false";
    process.env.PAYMENT_PROVIDER = "disabled";

    const response = await createCheckoutSession({
      attestationAccepted: true,
      ...contact,
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
    expect(response.checkoutMode).toBe("disabled");
    expect(response.redirectUrl).toBeUndefined();
  });

  it("blocks Vial order submission until explicitly approved", async () => {
    process.env.CHECKOUT_MODE = "vial_order";
    process.env.VIAL_ALLOW_UNPAID_ORDERS = "false";
    process.env.PAYMENT_PROVIDER = "disabled";

    const response = await createCheckoutSession({
      attestationAccepted: true,
      ...contact,
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
    expect(response.checkoutMode).toBe("vial_order");
    expect(response.message).toMatch(/not enabled/i);
  });

  it("blocks Authorize.Net payment sessions until configured", async () => {
    process.env.PAYMENT_PROVIDER = "authorize_net";

    const response = await createCheckoutSession({
      attestationAccepted: true,
      ...contact,
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
    expect(response.checkoutMode).toBe("authorize_net_hosted");
    expect(response.message).toMatch(/Authorize\.Net/i);
  });
});

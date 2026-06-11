import { mockCommerceProvider } from "./mock-provider";
import type { CommerceProvider } from "./types";

export function getCommerceProvider(): CommerceProvider {
  const provider = process.env.COMMERCE_PROVIDER ?? "mock";

  if (provider !== "mock") {
    // Phase 1 intentionally keeps the storefront offline from WooCommerce.
    return mockCommerceProvider;
  }

  return mockCommerceProvider;
}

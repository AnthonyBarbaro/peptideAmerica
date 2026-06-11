import type { Metadata } from "next";
import { CheckoutPageClient } from "@/components/checkout-page-client";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Validate the checkout flow with required catalog attestation.",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <CheckoutPageClient />
    </div>
  );
}

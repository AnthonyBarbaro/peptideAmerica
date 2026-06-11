import type { Metadata } from "next";
import { PolicyShell } from "@/components/policy-shell";

export const metadata: Metadata = {
  title: "Shipping and Delivery Policy",
  description: "Placeholder shipping and delivery policy page for Peptide America.",
};

export default function ShippingReturnsPage() {
  return (
    <PolicyShell title="Shipping and Delivery Policy">
      <p>
        This placeholder page reserves space for shipping workflow, carrier timing,
        packaging review, and delivery-status language.
      </p>
      <p>
        ShipStation is not connected yet. Fulfillment details should be added after
        WooCommerce order flow is active.
      </p>
      <p>Replace this placeholder with reviewed policy copy before launch.</p>
    </PolicyShell>
  );
}

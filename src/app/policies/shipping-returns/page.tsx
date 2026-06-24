import type { Metadata } from "next";
import { PolicyShell } from "@/components/policy-shell";

export const metadata: Metadata = {
  title: "Shipping and Delivery Policy",
  description: "Shipping and delivery policy page for Peptide America.",
};

export default function ShippingReturnsPage() {
  return (
    <PolicyShell title="Shipping and Delivery Policy">
      <p>
        Shipping workflow, carrier timing, packaging review, and delivery-status language
        should match the active fulfillment setup.
      </p>
      <p>
        Fulfillment details should be verified against the live Vial order workflow before
        accepting orders.
      </p>
      <p>Final policy review is required before accepting live customer orders.</p>
    </PolicyShell>
  );
}

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
        Shipping options, carrier details, and estimated delivery timing are presented
        during checkout when available.
      </p>
      <p>
        Order status and tracking details are provided after fulfillment updates are
        available for the order.
      </p>
      <p>
        Contact support with questions about shipping eligibility, delivery status, or
        order documentation.
      </p>
    </PolicyShell>
  );
}

import type { Metadata } from "next";
import { PolicyShell } from "@/components/policy-shell";

export const metadata: Metadata = {
  title: "Return and Refund Policy",
  description: "Return and refund policy page for Peptide America.",
};

export default function ReturnRefundPolicyPage() {
  return (
    <PolicyShell title="Return and Refund Policy">
      <p>
        Return authorization, order review, refund timing, and support workflows are
        handled through Peptide America support.
      </p>
      <p>
        Eligibility may depend on order status, product condition, documentation, and
        fulfillment progress.
      </p>
      <p>
        Contact support before sending back any order materials or requesting a refund
        review.
      </p>
    </PolicyShell>
  );
}

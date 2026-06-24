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
        Eligibility, documentation requirements, inspection steps, and support response
        timing should be reviewed before live fulfillment is enabled.
      </p>
      <p>Final legal review is required before accepting live customer orders.</p>
    </PolicyShell>
  );
}

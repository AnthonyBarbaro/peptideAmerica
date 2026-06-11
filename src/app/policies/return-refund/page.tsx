import type { Metadata } from "next";
import { PolicyShell } from "@/components/policy-shell";

export const metadata: Metadata = {
  title: "Return and Refund Policy",
  description: "Placeholder return and refund policy page for Peptide America.",
};

export default function ReturnRefundPolicyPage() {
  return (
    <PolicyShell title="Return and Refund Policy">
      <p>
        This placeholder page reserves space for return authorization, order review,
        refund timing, and support workflows.
      </p>
      <p>
        Future policy copy should define eligibility, documentation requirements,
        inspection steps, and support response timing.
      </p>
      <p>Replace this placeholder with reviewed policy copy before launch.</p>
    </PolicyShell>
  );
}

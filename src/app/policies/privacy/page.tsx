import type { Metadata } from "next";
import { PolicyShell } from "@/components/policy-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy page for Peptide America.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyShell title="Privacy Policy">
      <p>
        This site may use browser storage for cart state and accessibility preferences.
      </p>
      <p>
        Account data, order data, support requests, cookies, analytics, and retention
        practices should be reviewed against the active production configuration.
      </p>
      <p>Final legal review is required before accepting live customer orders.</p>
    </PolicyShell>
  );
}

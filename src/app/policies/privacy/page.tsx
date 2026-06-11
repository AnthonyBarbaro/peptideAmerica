import type { Metadata } from "next";
import { PolicyShell } from "@/components/policy-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Placeholder privacy policy page for Peptide America.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyShell title="Privacy Policy">
      <p>
        This placeholder explains that the site may use browser storage for cart
        state and accessibility preferences. No production analytics plan is active yet.
      </p>
      <p>
        Future integrations should document account data, order data, support
        requests, cookies, analytics, and retention practices.
      </p>
      <p>Replace this placeholder with reviewed policy copy before launch.</p>
    </PolicyShell>
  );
}

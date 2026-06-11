import type { Metadata } from "next";
import { PolicyShell } from "@/components/policy-shell";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Placeholder terms and conditions page for Peptide America.",
};

export default function TermsPage() {
  return (
    <PolicyShell title="Terms and Conditions">
      <p>
        These placeholder terms outline the need for approved ordering, account,
        catalog, documentation, and site-use language before production launch.
      </p>
      <p>
        Buyers should confirm they are authorized to request research catalog items
        and assume responsibility for lawful ordering, storage, and handling.
      </p>
      <p>
        Checkout is currently disabled for payment processing and validates only the
        storefront request flow.
      </p>
      <p>Replace this placeholder with reviewed policy copy before launch.</p>
    </PolicyShell>
  );
}

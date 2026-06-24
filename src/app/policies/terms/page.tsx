import type { Metadata } from "next";
import { PolicyShell } from "@/components/policy-shell";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions page for Peptide America.",
};

export default function TermsPage() {
  return (
    <PolicyShell title="Terms and Conditions">
      <p>
        These terms outline the need for approved ordering, account, catalog,
        documentation, and site-use language.
      </p>
      <p>
        Buyers should confirm they are authorized to request research catalog items
        and assume responsibility for lawful ordering, storage, and handling.
      </p>
      <p>
        Checkout does not collect card information in this Next.js storefront.
      </p>
      <p>Final legal review is required before accepting live customer orders.</p>
    </PolicyShell>
  );
}

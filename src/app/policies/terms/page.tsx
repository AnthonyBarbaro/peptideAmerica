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
        These terms cover account access, catalog browsing, ordering, documentation,
        and site use.
      </p>
      <p>
        Buyers should confirm they are authorized to request research catalog items
        and assume responsibility for lawful ordering, storage, and handling.
      </p>
      <p>
        Payment details are handled through a hosted payment page and are not stored by
        this storefront.
      </p>
      <p>
        By using the site, buyers agree to follow applicable laws, policies, and
        account requirements.
      </p>
    </PolicyShell>
  );
}

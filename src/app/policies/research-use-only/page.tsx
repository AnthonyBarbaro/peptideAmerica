import type { Metadata } from "next";
import { PolicyShell } from "@/components/policy-shell";

export const metadata: Metadata = {
  title: "Research Use Policy",
  description: "Research-use policy page for Peptide America.",
};

export default function ResearchUsePolicyPage() {
  return (
    <PolicyShell title="Research Use Policy">
      <p>
        This policy describes the intended catalog framing for Peptide America products.
        Items are presented for laboratory research and development procurement,
        documentation review, and batch record workflows.
      </p>
      <p>
        Products are not consumer goods, dietary products, or personal-use items. All
        buyers should be qualified researchers or institutions and should follow all
        applicable laws and internal handling requirements.
      </p>
      <p>
        Product pages, COA records, and checkout copy should remain aligned with
        approved catalog language. Not for human or animal consumption.
      </p>
      <p>
        Final legal review is required before accepting live customer orders. This page is
        not legal advice.
      </p>
    </PolicyShell>
  );
}

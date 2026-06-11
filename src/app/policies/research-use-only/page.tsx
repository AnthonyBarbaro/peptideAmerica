import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Use Policy",
  description: "Placeholder research-use policy page for Peptide America.",
};

export default function ResearchUsePolicyPage() {
  return (
    <PolicyShell title="Research Use Policy">
      <p>
        This placeholder policy describes the intended catalog framing for Peptide
        America products. Items are presented for research procurement, documentation
        review, and batch record workflows.
      </p>
      <p>
        Product pages, COA records, and checkout copy should remain aligned with
        approved catalog language. Not for human or animal use.
      </p>
      <p>
        Replace this placeholder with reviewed policy copy before launch. This page is
        not legal advice.
      </p>
    </PolicyShell>
  );
}

function PolicyShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
        Policies
      </p>
      <h1 className="mt-2 text-4xl font-black text-slate-950">{title}</h1>
      <div className="mt-8 space-y-5 rounded-lg border border-slate-200 bg-white p-6 leading-7 text-slate-600 shadow-sm">
        {children}
      </div>
    </div>
  );
}

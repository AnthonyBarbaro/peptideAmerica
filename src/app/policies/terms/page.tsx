import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Placeholder terms page for Peptide America.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
        Policies
      </p>
      <h1 className="mt-2 text-4xl font-black text-slate-950">Terms</h1>
      <div className="mt-8 space-y-5 rounded-lg border border-slate-200 bg-white p-6 leading-7 text-slate-600 shadow-sm">
        <p>
          These placeholder terms outline the need for approved ordering, account,
          catalog, documentation, and site-use language before production launch.
        </p>
        <p>
          Phase 1 checkout is disabled for payment processing and validates only the
          storefront flow.
        </p>
        <p>Replace this placeholder with reviewed policy copy before launch.</p>
      </div>
    </div>
  );
}

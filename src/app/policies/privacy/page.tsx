import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Placeholder privacy policy page for Peptide America.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
        Policies
      </p>
      <h1 className="mt-2 text-4xl font-black text-slate-950">Privacy Policy</h1>
      <div className="mt-8 space-y-5 rounded-lg border border-slate-200 bg-white p-6 leading-7 text-slate-600 shadow-sm">
        <p>
          This placeholder explains that the site may use browser storage for cart
          state and accessibility preferences. No production analytics plan is active yet.
        </p>
        <p>
          Future integrations should document account data, order data, support
          requests, cookies, analytics, and retention practices.
        </p>
        <p>Replace this placeholder with reviewed policy copy before launch.</p>
      </div>
    </div>
  );
}

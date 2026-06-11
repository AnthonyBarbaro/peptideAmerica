import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping and Returns",
  description: "Placeholder shipping and returns page for Peptide America.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
        Policies
      </p>
      <h1 className="mt-2 text-4xl font-black text-slate-950">Shipping and Returns</h1>
      <div className="mt-8 space-y-5 rounded-lg border border-slate-200 bg-white p-6 leading-7 text-slate-600 shadow-sm">
        <p>
          This placeholder page reserves space for shipping workflow, carrier timing,
          packaging review, and return authorization language.
        </p>
        <p>
          ShipStation is not connected yet. Fulfillment details should be added after
          WooCommerce order flow is active.
        </p>
        <p>Replace this placeholder with reviewed policy copy before launch.</p>
      </div>
    </div>
  );
}

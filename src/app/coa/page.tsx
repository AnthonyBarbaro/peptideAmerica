import type { Metadata } from "next";
import { CoaClient } from "@/components/coa-client";
import { getCommerceProvider } from "@/lib/commerce/provider";

export const metadata: Metadata = {
  title: "COA Library",
  description: "Search sample batch and COA records for the Peptide America mock catalog.",
};

export default async function CoaPage() {
  const commerce = getCommerceProvider();
  const [products, batches] = await Promise.all([
    commerce.listProducts(),
    commerce.listCoaBatches(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          COA library
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Batch documents</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Search product, SKU, batch, and lab fields from the mock provider.
        </p>
      </div>
      <div className="mt-8">
        <CoaClient products={products} batches={batches} />
      </div>
    </div>
  );
}

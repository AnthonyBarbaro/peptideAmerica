import type { Metadata } from "next";
import { ShopClient } from "@/components/shop-client";
import { getCommerceProvider } from "@/lib/commerce/provider";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the Peptide America mock catalog with search, filters, and sorting.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const commerce = getCommerceProvider();
  const [products, categories] = await Promise.all([
    commerce.listProducts(),
    commerce.listCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          Catalog
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Shop products</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Browse placeholder product data with category filters, sorting, cart actions,
          and COA-aware product cards.
        </p>
      </div>
      <div className="mt-8">
        <ShopClient products={products} categories={categories} initialQuery={params.q ?? ""} />
      </div>
    </div>
  );
}

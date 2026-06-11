import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getCommerceProvider } from "@/lib/commerce/provider";
import { researchArticles } from "@/lib/research/articles";
import { buildSearchResults } from "@/lib/search";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search products, sample COA batch records, and research library articles.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const commerce = getCommerceProvider();
  const [products, batches] = await Promise.all([
    commerce.listProducts(),
    commerce.listCoaBatches(),
  ]);
  const results = q.trim()
    ? buildSearchResults({ products, batches, articles: researchArticles, query: q })
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          Site search
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Search Peptide America</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Search product names, SKUs, sample batch records, and library articles.
        </p>
      </div>
      <form action="/search" className="mt-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Search query</span>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search products, batch records, or articles"
              className="min-h-11 flex-1 rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
            />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              <Search aria-hidden="true" size={18} />
              Search
            </button>
          </div>
        </label>
      </form>
      <section className="mt-8">
        {q.trim() ? (
          <p className="text-sm font-medium text-slate-600">
            {results.length} result{results.length === 1 ? "" : "s"} for{" "}
            <span className="font-bold text-slate-950">{q}</span>
          </p>
        ) : (
          <p className="text-sm font-medium text-slate-600">
            Enter a query to search the catalog.
          </p>
        )}
        <div className="mt-5 grid gap-4">
          {results.map((result) => (
            <Link
              key={`${result.type}-${result.href}-${result.title}`}
              href={result.href}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-red-200 hover:shadow-lg"
            >
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">
                {result.type}
              </div>
              <h2 className="mt-2 text-xl font-black text-slate-950">{result.title}</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">{result.eyebrow}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{result.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

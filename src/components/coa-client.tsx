"use client";

import { FileCheck2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { CoaBatch, Product } from "@/lib/commerce/types";

type CoaClientProps = {
  products: Product[];
  batches: CoaBatch[];
};

export function CoaClient({ products, batches }: CoaClientProps) {
  const [query, setQuery] = useState("");
  const [productSlug, setProductSlug] = useState("all");

  const productBySlug = useMemo(
    () => new Map(products.map((product) => [product.slug, product])),
    [products],
  );

  const filteredBatches = useMemo(() => {
    const term = query.trim().toLowerCase();

    return batches.filter((batch) => {
      const product = productBySlug.get(batch.productSlug);
      const productMatches = productSlug === "all" || batch.productSlug === productSlug;
      const queryMatches =
        !term ||
        [
          batch.batchNumber,
          batch.sku,
          batch.labName,
          product?.name ?? "",
          batch.notes,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      return productMatches && queryMatches;
    });
  }, [batches, productBySlug, productSlug, query]);

  return (
    <div>
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_16rem]">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Search COA records</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Product, SKU, batch, lab"
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Product</span>
            <select
              value={productSlug}
              onChange={(event) => setProductSlug(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
            >
              <option value="all">All products</option>
              {products.map((product) => (
                <option key={product.id} value={product.slug}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>
      <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-950">
        Sample/mock COA data is shown for Phase 1. Replace records with supplier documents before launch.
      </div>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {filteredBatches.map((batch) => {
          const product = productBySlug.get(batch.productSlug);

          return (
            <article
              key={batch.id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    {product?.name ?? batch.productSlug}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{batch.sku}</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
                  <FileCheck2 aria-hidden="true" size={15} />
                  {batch.status}
                </span>
              </div>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-slate-500">Batch</dt>
                  <dd className="mt-1 font-semibold text-slate-950">{batch.batchNumber}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Tested</dt>
                  <dd className="mt-1 font-semibold text-slate-950">{batch.testedAt}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Lab</dt>
                  <dd className="mt-1 font-semibold text-slate-950">{batch.labName}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Purity</dt>
                  <dd className="mt-1 font-semibold text-slate-950">
                    {batch.purityPercent ? `${batch.purityPercent}% sample` : "Pending"}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-sm leading-6 text-slate-600">{batch.notes}</p>
              <a
                href={batch.documentUrl}
                className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                View placeholder document
              </a>
            </article>
          );
        })}
      </section>
    </div>
  );
}

"use client";

import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "@/components/product-card";

type ShopClientProps = {
  products: Product[];
  categories: string[];
  initialQuery?: string;
};

type SortOption = "featured" | "price-asc" | "price-desc" | "name";

export function ShopClient({ products, categories, initialQuery = "" }: ShopClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("featured");

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const categoryMatches = category === "all" || product.category === category;
      const queryMatches =
        !term ||
        [product.name, product.sku, product.category, product.shortDescription, ...product.tags]
          .join(" ")
          .toLowerCase()
          .includes(term);

      return categoryMatches && queryMatches;
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.priceCents - b.priceCents;
        case "price-desc":
          return b.priceCents - a.priceCents;
        case "name":
          return a.name.localeCompare(b.name);
        case "featured":
        default:
          return Number(!a.tags.includes("featured")) - Number(!b.tags.includes("featured"));
      }
    });
  }, [category, products, query, sort]);

  return (
    <div>
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_13rem_13rem]">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Search products</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, SKU, category"
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
            >
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price low to high</option>
              <option value="price-desc">Price high to low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
      </section>
      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-600">
          {visibleProducts.length} catalog {visibleProducts.length === 1 ? "item" : "items"}
        </p>
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
          <SlidersHorizontal aria-hidden="true" size={18} />
          Filters active
        </div>
      </div>
      <section className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
      {visibleProducts.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-950">No products found</h2>
          <p className="mt-2 text-sm text-slate-600">Adjust search or filters.</p>
        </div>
      ) : null}
    </div>
  );
}

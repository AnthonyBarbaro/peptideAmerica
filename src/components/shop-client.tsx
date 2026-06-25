"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product, StockStatus } from "@/lib/commerce/types";
import { ProductCard } from "@/components/product-card";
import { formatStockStatus, stockStatusBadgeClassName } from "@/lib/format";

type ShopClientProps = {
  products: Product[];
  categories: string[];
  initialQuery?: string;
};

type SortOption = "featured" | "price-asc" | "price-desc" | "name";
type AvailabilityOption = "all" | StockStatus;

const availabilityOptions: AvailabilityOption[] = [
  "all",
  "in_stock",
  "low_stock",
  "out_of_stock",
];

export function ShopClient({ products, categories, initialQuery = "" }: ShopClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState<AvailabilityOption>("all");
  const [sort, setSort] = useState<SortOption>("featured");

  const researchAreas = useMemo(
    () => [...new Set(categories.filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [categories],
  );
  const meaningfulResearchAreas = useMemo(
    () => researchAreas.filter((area) => area.trim().toLowerCase() !== "catalog"),
    [researchAreas],
  );
  const showResearchAreaFilters = meaningfulResearchAreas.length > 1;

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const product of products) {
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
    }

    return counts;
  }, [products]);

  const availabilityCounts = useMemo(() => {
    const counts = new Map<StockStatus, number>();

    for (const product of products) {
      counts.set(product.stockStatus, (counts.get(product.stockStatus) ?? 0) + 1);
    }

    return counts;
  }, [products]);

  const activeFilterCount =
    Number(query.trim().length > 0) +
    Number(showResearchAreaFilters && category !== "all") +
    Number(availability !== "all");
  const hasActiveFilters = activeFilterCount > 0;

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const categoryMatches = category === "all" || product.category === category;
      const availabilityMatches =
        availability === "all" || product.stockStatus === availability;
      const queryMatches =
        !term ||
        [
          product.name,
          product.sku,
          product.category,
          product.shortDescription,
          product.researchOverview,
          ...product.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      return categoryMatches && availabilityMatches && queryMatches;
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
  }, [availability, category, products, query, sort]);

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setAvailability("all");
  }

  return (
    <div>
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <label className="block min-w-0">
            <span className="text-sm font-semibold text-slate-700">Search catalog</span>
            <span className="relative mt-2 block">
              <Search
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, SKU, research area"
                className="min-h-11 w-full rounded-md border border-slate-300 px-10 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                  aria-label="Clear search"
                >
                  <X aria-hidden="true" size={16} />
                </button>
              ) : null}
            </span>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
            >
              <option value="featured">Featured first</option>
              <option value="price-asc">Price low to high</option>
              <option value="price-desc">Price high to low</option>
              <option value="name">Name A to Z</option>
            </select>
          </label>
        </div>

        {showResearchAreaFilters ? (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Research area
              </h2>
              {category !== "all" ? (
                <button
                  type="button"
                  onClick={() => setCategory("all")}
                  className="text-sm font-semibold text-red-700 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                >
                  Clear area
                </button>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategory("all")}
                className={filterPillClassName(category === "all")}
              >
                All areas
                <span className={filterCountClassName(category === "all")}>{products.length}</span>
              </button>
              {meaningfulResearchAreas.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={filterPillClassName(category === item)}
                >
                  <span className="truncate">{item}</span>
                  <span className={filterCountClassName(category === item)}>
                    {categoryCounts.get(item) ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5 border-t border-slate-100 pt-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            Availability
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {availabilityOptions.map((option) => {
              const selected = availability === option;
              const label = option === "all" ? "All" : formatStockStatus(option);
              const count =
                option === "all" ? products.length : availabilityCounts.get(option) ?? 0;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAvailability(option)}
                  className={availabilityPillClassName(option, selected)}
                >
                  {label}
                  <span className={filterCountClassName(selected)}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {hasActiveFilters ? (
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
            <span className="text-sm font-semibold text-slate-600">Active</span>
            {query.trim() ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="inline-flex min-h-8 items-center gap-1 rounded-full bg-slate-100 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                Search: {query.trim()}
                <X aria-hidden="true" size={14} />
              </button>
            ) : null}
            {showResearchAreaFilters && category !== "all" ? (
              <button
                type="button"
                onClick={() => setCategory("all")}
                className="inline-flex min-h-8 items-center gap-1 rounded-full bg-red-50 px-3 text-sm font-semibold text-red-700 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                {category}
                <X aria-hidden="true" size={14} />
              </button>
            ) : null}
            {availability !== "all" ? (
              <button
                type="button"
                onClick={() => setAvailability("all")}
                className={`inline-flex min-h-8 items-center gap-1 rounded-full px-3 text-sm font-semibold hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${stockStatusBadgeClassName(availability)}`}
              >
                {formatStockStatus(availability)}
                <X aria-hidden="true" size={14} />
              </button>
            ) : null}
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto inline-flex min-h-8 items-center justify-center rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              Clear all
            </button>
          </div>
        ) : null}
      </section>
      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-600">
          {visibleProducts.length} catalog {visibleProducts.length === 1 ? "item" : "items"}
        </p>
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
          <SlidersHorizontal aria-hidden="true" size={18} />
          {hasActiveFilters ? `${activeFilterCount} active` : "Filters"}
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

function filterPillClassName(selected: boolean) {
  return `inline-flex min-h-9 max-w-full items-center gap-2 rounded-full border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${
    selected
      ? "border-red-700 bg-red-700 text-white shadow-sm"
      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
  }`;
}

function availabilityPillClassName(option: AvailabilityOption, selected: boolean) {
  if (!selected) {
    return "inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600";
  }

  if (option === "all") {
    return "inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-900 bg-slate-950 px-3 text-sm font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600";
  }

  return `inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 ${stockStatusBadgeClassName(option)}`;
}

function filterCountClassName(selected: boolean) {
  return `rounded-full px-1.5 text-xs ${
    selected ? "bg-white/20 text-current" : "bg-slate-100 text-slate-500"
  }`;
}

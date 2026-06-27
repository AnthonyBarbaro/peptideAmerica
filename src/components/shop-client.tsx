"use client";

import { LayoutGrid, Rows3, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product, StockStatus } from "@/lib/commerce/types";
import { ProductCard } from "@/components/product-card";
import {
  getProductResearchArea,
  getResearchAreaDetails,
} from "@/lib/catalog/research-areas";
import { getCatalogPriceCents } from "@/lib/format";

type ShopClientProps = {
  products: Product[];
  initialQuery?: string;
};

type SortOption = "featured" | "stock" | "price-asc" | "price-desc" | "coa" | "name";
type AvailabilityOption = "all" | "available" | "out_of_stock";
type DocumentationOption = "all" | "coa";
type MobileCatalogView = "grid" | "single";

const availabilityFilterOptions: Exclude<AvailabilityOption, "all">[] = [
  "available",
  "out_of_stock",
];
const researchAreaOrder = new Map([
  ["Cellular", 0],
  ["Copper Complex", 1],
  ["Metabolic", 2],
  ["Glycoprotein", 3],
  ["Cofactor", 4],
  ["Peptide Blend", 5],
]);

export function ShopClient({ products, initialQuery = "" }: ShopClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState<AvailabilityOption>("all");
  const [priceLimitCents, setPriceLimitCents] = useState<number | null>(null);
  const [documentation, setDocumentation] = useState<DocumentationOption>("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileView, setMobileView] = useState<MobileCatalogView>("grid");

  const researchAreas = useMemo(
    () =>
      [...new Set(products.map((product) => getProductResearchArea(product)))]
        .filter(Boolean)
        .sort(compareResearchAreas),
    [products],
  );
  const meaningfulResearchAreas = useMemo(
    () => researchAreas.filter((area) => area.trim().toLowerCase() !== "catalog"),
    [researchAreas],
  );
  const showResearchAreaFilters = meaningfulResearchAreas.length > 1;
  const highestPriceCents = useMemo(() => getHighestProductPriceCents(products), [products]);
  const hasPriceRange = highestPriceCents > 0;
  const maxPriceCents = hasPriceRange
    ? Math.min(priceLimitCents ?? highestPriceCents, highestPriceCents)
    : 0;
  const priceFilterActive =
    hasPriceRange && priceLimitCents !== null && maxPriceCents < highestPriceCents;

  const availabilityCounts = useMemo(() => {
    const counts = new Map<AvailabilityOption, number>([
      ["all", products.length],
      ["available", 0],
      ["out_of_stock", 0],
    ]);

    for (const product of products) {
      const status = product.stockStatus === "out_of_stock" ? "out_of_stock" : "available";
      counts.set(status, (counts.get(status) ?? 0) + 1);
    }

    return counts;
  }, [products]);
  const coaCount = useMemo(
    () => products.filter((product) => product.coaBatches.length > 0).length,
    [products],
  );

  const activeFilterCount =
    Number(query.trim().length > 0) +
    Number(showResearchAreaFilters && category !== "all") +
    Number(availability !== "all") +
    Number(priceFilterActive) +
    Number(documentation !== "all");
  const hasActiveFilters = activeFilterCount > 0;

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const researchArea = getProductResearchArea(product);
      const categoryMatches = category === "all" || researchArea === category;
      const availabilityMatches = availabilityMatchesStock(product.stockStatus, availability);
      const productPriceCents = getCatalogPriceCents(product.priceCents);
      const priceFilterMatches =
        !priceFilterActive || productPriceCents <= maxPriceCents;
      const documentationMatches =
        documentation === "all" || product.coaBatches.length > 0;
      const queryMatches =
        !term ||
        [
          product.name,
          product.sku,
          researchArea,
          product.sizeLabel,
          product.shortDescription,
          product.researchOverview,
          product.coaBatches.length > 0 ? "COA available" : "",
          ...product.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      return (
        categoryMatches &&
        availabilityMatches &&
        priceFilterMatches &&
        documentationMatches &&
        queryMatches
      );
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "stock":
          return compareStockStatus(a.stockStatus, b.stockStatus) || a.name.localeCompare(b.name);
        case "price-asc":
          return comparePriceAscending(a, b);
        case "price-desc":
          return comparePriceDescending(a, b);
        case "coa":
          return (
            Number(b.coaBatches.length > 0) - Number(a.coaBatches.length > 0) ||
            a.name.localeCompare(b.name)
          );
        case "name":
          return a.name.localeCompare(b.name);
        case "featured":
        default:
          return (
            compareStockStatus(a.stockStatus, b.stockStatus) ||
            Number(!a.tags.includes("featured")) - Number(!b.tags.includes("featured")) ||
            a.name.localeCompare(b.name)
          );
      }
    });
  }, [
    availability,
    category,
    documentation,
    maxPriceCents,
    priceFilterActive,
    products,
    query,
    sort,
  ]);

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setAvailability("all");
    setPriceLimitCents(null);
    setDocumentation("all");
    setFiltersOpen(false);
  }

  return (
    <div>
      <section className="rounded-md border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <label className="block min-w-0">
            <span className="text-sm font-semibold text-slate-700">Search catalog</span>
            <span className="relative mt-1.5 block">
              <Search
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, SKU, product group"
                className="min-h-10 w-full rounded-md border border-slate-300 px-10 text-sm text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20 sm:min-h-11 sm:text-base"
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
          <button
            type="button"
            aria-controls="shop-filter-controls"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((currentValue) => !currentValue)}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-950 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 sm:w-auto sm:min-w-32 sm:self-end"
          >
            <SlidersHorizontal aria-hidden="true" size={17} />
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>
        </div>

        {filtersOpen ? (
          <div
            id="shop-filter-controls"
            className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 sm:grid-cols-3 lg:grid-cols-6"
          >
            <label className="block min-w-0">
              <span className={filterLabelClassName()}>Sort</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className={filterSelectClassName()}
              >
                <option value="featured">Featured first</option>
                <option value="stock">In stock first</option>
                <option value="price-asc">Price low to high</option>
                <option value="price-desc">Price high to low</option>
                <option value="coa">COA first</option>
                <option value="name">Name A to Z</option>
              </select>
            </label>
            {showResearchAreaFilters ? (
              <div className="col-span-2 min-w-0 sm:col-span-3 lg:col-span-6">
                <span className={filterLabelClassName()}>Category</span>
                <div className="-mx-1 mt-1 flex gap-2 overflow-x-auto px-1 pb-1">
                  {meaningfulResearchAreas.map((item) => {
                    const details = getResearchAreaDetails(item);
                    const selected = category === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setCategory((currentValue) => (currentValue === item ? "all" : item))
                        }
                        className={categoryPillClassName(selected)}
                      >
                        {details.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="col-span-2 block min-w-0 sm:col-span-1 lg:col-span-2">
              <span className={filterLabelClassName()}>Availability</span>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {availabilityFilterOptions.map((option) => {
                  const selected = availability === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setAvailability((currentValue) =>
                          currentValue === option ? "all" : option,
                        )
                      }
                      className={filterToggleClassName(selected)}
                    >
                      <span>{formatAvailabilityOption(option)}</span>
                      <span
                        className={
                          selected
                            ? "rounded-full bg-white/20 px-1.5 text-xs text-white"
                            : "rounded-full bg-slate-100 px-1.5 text-xs text-slate-500"
                        }
                      >
                        {availabilityCounts.get(option) ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-span-2 block min-w-0 sm:col-span-3 lg:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <span className={filterLabelClassName()}>Max price</span>
                <span className="text-xs font-semibold text-slate-500">
                  {hasPriceRange ? formatCurrency(maxPriceCents) : "No prices"}
                </span>
              </div>
              <div className="mt-1 flex min-h-9 items-center gap-3 rounded-md border border-slate-300 bg-white px-3 text-sm transition focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-600/20 sm:min-h-10">
                <input
                  type="range"
                  min={0}
                  max={highestPriceCents}
                  step={100}
                  value={hasPriceRange ? maxPriceCents : 0}
                  disabled={!hasPriceRange}
                  onChange={(event) => setPriceLimitCents(Number(event.target.value))}
                  aria-label="Maximum product price"
                  className="h-2 min-w-0 flex-1 accent-red-600 disabled:opacity-40"
                />
                <span className="w-20 text-right text-sm font-semibold text-slate-950">
                  {hasPriceRange ? formatCurrency(maxPriceCents) : "N/A"}
                </span>
              </div>
            </div>

            <div className="block min-w-0">
              <span className={filterLabelClassName()}>Documents</span>
              <button
                type="button"
                aria-pressed={documentation === "coa"}
                onClick={() =>
                  setDocumentation((currentValue) => (currentValue === "coa" ? "all" : "coa"))
                }
                className={`${filterToggleClassName(documentation === "coa")} mt-1`}
              >
                <span>COA Available</span>
                <span
                  className={
                    documentation === "coa"
                      ? "rounded-full bg-white/20 px-1.5 text-xs text-white"
                      : "rounded-full bg-slate-100 px-1.5 text-xs text-slate-500"
                  }
                >
                  {coaCount}
                </span>
              </button>
            </div>
          </div>
        ) : null}

        {hasActiveFilters ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
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
                {getResearchAreaDetails(category).group}
                <X aria-hidden="true" size={14} />
              </button>
            ) : null}
            {availability !== "all" ? (
              <button
                type="button"
                onClick={() => setAvailability("all")}
                className="inline-flex min-h-8 items-center gap-1 rounded-full bg-slate-100 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                {formatAvailabilityOption(availability)}
                <X aria-hidden="true" size={14} />
              </button>
            ) : null}
            {priceFilterActive ? (
              <button
                type="button"
                onClick={() => setPriceLimitCents(null)}
                className="inline-flex min-h-8 items-center gap-1 rounded-full bg-slate-100 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                Up to {formatCurrency(maxPriceCents)}
                <X aria-hidden="true" size={14} />
              </button>
            ) : null}
            {documentation !== "all" ? (
              <button
                type="button"
                onClick={() => setDocumentation("all")}
                className="inline-flex min-h-8 items-center gap-1 rounded-full bg-blue-50 px-3 text-sm font-semibold text-blue-800 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                COA available
                <X aria-hidden="true" size={14} />
              </button>
            ) : null}
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto inline-flex min-h-8 items-center justify-center rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </section>
      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-600">
          {visibleProducts.length} catalog {visibleProducts.length === 1 ? "item" : "items"}
        </p>
        <div className="flex items-center gap-2">
          {hasActiveFilters ? (
            <p className="hidden text-sm font-semibold text-slate-700 sm:block">
              {activeFilterCount} active {activeFilterCount === 1 ? "filter" : "filters"}
            </p>
          ) : null}
          <div
            className="inline-flex rounded-md border border-slate-300 bg-white p-0.5 sm:hidden"
            aria-label="Mobile product layout"
          >
            <button
              type="button"
              aria-pressed={mobileView === "grid"}
              onClick={() => setMobileView("grid")}
              className={mobileViewButtonClassName(mobileView === "grid")}
            >
              <LayoutGrid aria-hidden="true" size={16} />
              <span className="sr-only">Grid view</span>
            </button>
            <button
              type="button"
              aria-pressed={mobileView === "single"}
              onClick={() => setMobileView("single")}
              className={mobileViewButtonClassName(mobileView === "single")}
            >
              <Rows3 aria-hidden="true" size={16} />
              <span className="sr-only">Single column view</span>
            </button>
          </div>
        </div>
      </div>
      <section
        className={`mt-6 grid ${
          mobileView === "grid"
            ? "grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
        }`}
      >
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} compactMobile={mobileView === "grid"} />
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

function filterLabelClassName() {
  return "block text-xs font-semibold text-slate-600";
}

function filterSelectClassName() {
  return "mt-1 min-h-9 w-full truncate rounded-md border border-slate-300 bg-white px-2 text-sm font-medium text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20 sm:min-h-10 sm:px-3";
}

function categoryPillClassName(selected: boolean) {
  return `inline-flex min-h-9 shrink-0 items-center justify-center rounded-full px-4 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-red-600 ${
    selected
      ? "bg-red-700 text-white hover:bg-red-800"
      : "bg-slate-100 text-slate-950 hover:bg-slate-200"
  }`;
}

function filterToggleClassName(selected: boolean) {
  return `inline-flex min-h-9 w-full items-center justify-between gap-2 rounded-md border px-2 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-red-600 sm:min-h-10 sm:px-3 ${
    selected
      ? "border-red-700 bg-red-700 text-white hover:border-red-800 hover:bg-red-800"
      : "border-slate-300 bg-white text-slate-950 hover:border-slate-400 hover:bg-slate-50"
  }`;
}

function mobileViewButtonClassName(selected: boolean) {
  return `inline-flex h-9 w-9 items-center justify-center rounded text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-red-600 ${
    selected ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
  }`;
}

function availabilityMatchesStock(stockStatus: StockStatus, option: AvailabilityOption) {
  switch (option) {
    case "available":
      return stockStatus !== "out_of_stock";
    case "out_of_stock":
      return stockStatus === "out_of_stock";
    case "all":
    default:
      return true;
  }
}

function formatAvailabilityOption(option: AvailabilityOption) {
  switch (option) {
    case "available":
      return "In stock";
    case "out_of_stock":
      return "Out of stock";
    case "all":
    default:
      return "All availability";
  }
}

function getHighestProductPriceCents(products: Product[]) {
  return products.reduce(
    (highestPrice, product) =>
      getCatalogPriceCents(product.priceCents) > highestPrice
        ? getCatalogPriceCents(product.priceCents)
        : highestPrice,
    0,
  );
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

function compareStockStatus(a: StockStatus, b: StockStatus) {
  const rank: Record<StockStatus, number> = {
    in_stock: 0,
    low_stock: 1,
    out_of_stock: 2,
  };

  return rank[a] - rank[b];
}

function comparePriceAscending(a: Product, b: Product) {
  return (
    getCatalogPriceCents(a.priceCents) - getCatalogPriceCents(b.priceCents) ||
    a.name.localeCompare(b.name)
  );
}

function comparePriceDescending(a: Product, b: Product) {
  return (
    getCatalogPriceCents(b.priceCents) - getCatalogPriceCents(a.priceCents) ||
    a.name.localeCompare(b.name)
  );
}

function compareResearchAreas(a: string, b: string) {
  const rankA = researchAreaOrder.get(a) ?? Number.MAX_SAFE_INTEGER;
  const rankB = researchAreaOrder.get(b) ?? Number.MAX_SAFE_INTEGER;

  return rankA - rankB || getResearchAreaDetails(a).label.localeCompare(getResearchAreaDetails(b).label);
}

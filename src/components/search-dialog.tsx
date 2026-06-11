"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/commerce/types";

type SearchDialogProps = {
  products: Product[];
};

export function SearchDialog({ products }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return products.slice(0, 4);
    }

    return products
      .filter((product) =>
        [product.name, product.sku, product.category, ...product.tags].some((value) =>
          value.toLowerCase().includes(term),
        ),
      )
      .slice(0, 6);
  }, [products, query]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-medium text-white/90 transition hover:border-white/35 hover:text-white"
        >
          <Search aria-hidden="true" size={18} />
          Search
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-20 z-50 w-[min(calc(100vw-2rem),42rem)] -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-4 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <Dialog.Title className="text-lg font-semibold text-slate-950">
              Product search
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                aria-label="Close search"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </Dialog.Close>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-md border border-slate-300 px-3 py-2 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-600/20">
            <Search aria-hidden="true" size={18} className="text-slate-500" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products or SKU"
              className="min-h-10 flex-1 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {results.map((product) => (
              <Dialog.Close asChild key={product.id}>
                <Link
                  href={`/shop/${product.slug}`}
                  className="flex items-center justify-between gap-4 rounded-md px-3 py-3 hover:bg-slate-50"
                >
                  <span>
                    <span className="block font-semibold text-slate-950">{product.name}</span>
                    <span className="text-sm text-slate-500">{product.sku}</span>
                  </span>
                  <span className="text-sm font-medium text-red-700">View</span>
                </Link>
              </Dialog.Close>
            ))}
            {results.length === 0 ? (
              <p className="px-3 py-6 text-sm text-slate-500">No matching products.</p>
            ) : null}
          </div>
          <Dialog.Close asChild>
            <Link
              href={`/shop${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Search shop
            </Link>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

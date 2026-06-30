"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { trackEvent } from "@/lib/analytics";
import { ProductCard } from "@/components/product-card";

type RecentlyViewedProps = {
  product: Product;
  catalog: Product[];
};

const STORAGE_KEY = "pa:recently-viewed";
const MAX_TRACKED = 8;
const MAX_SHOWN = 4;

function readHistory(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/**
 * Records the current product in localStorage, emits a `view_product` event,
 * and renders previously viewed catalog items. Renders nothing until there is
 * real history to show.
 */
export function RecentlyViewed({ product, catalog }: RecentlyViewedProps) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    trackEvent("view_product", { sku: product.sku, name: product.name, slug: product.slug });

    const previous = readHistory();
    const next = [product.slug, ...previous.filter((slug) => slug !== product.slug)].slice(
      0,
      MAX_TRACKED,
    );

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage failures (private mode, quota, etc.).
    }

    // Intentional: history lives in localStorage (external store) and is only
    // available on the client, so we start empty to match SSR and hydrate it
    // here on mount. This avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(previous);
  }, [product.slug, product.sku, product.name]);

  const items = history
    .filter((slug) => slug !== product.slug)
    .map((slug) => catalog.find((item) => item.slug === slug))
    .filter((item): item is Product => Boolean(item))
    .slice(0, MAX_SHOWN);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-14">
      <h2 className="text-2xl font-black text-slate-950">Recently viewed</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <ProductCard key={item.id} product={item} compactMobile />
        ))}
      </div>
    </section>
  );
}

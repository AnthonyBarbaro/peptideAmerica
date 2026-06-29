"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/commerce/types";

type FeaturedProductRailProps = {
  products: Product[];
};

export function FeaturedProductRail({ products }: FeaturedProductRailProps) {
  const railRef = useRef<HTMLDivElement>(null);

  function scrollRail(direction: "back" | "forward") {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    rail.scrollBy({
      left: direction === "forward" ? rail.clientWidth * 0.72 : rail.clientWidth * -0.72,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative mt-6 sm:mt-8">
      <div className="mb-3 flex justify-end gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => scrollRail("back")}
          aria-label="Previous featured products"
          className="grid h-9 w-9 place-items-center rounded-full border border-blue-100 bg-white text-blue-950 shadow-sm transition hover:border-blue-300"
        >
          <ChevronLeft aria-hidden="true" size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollRail("forward")}
          aria-label="Next featured products"
          className="grid h-9 w-9 place-items-center rounded-full bg-blue-950 text-white shadow-sm transition hover:bg-blue-900"
        >
          <ChevronRight aria-hidden="true" size={18} />
        </button>
      </div>
      <div
        ref={railRef}
        className="-mx-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden"
        aria-label="Featured products"
      >
        <div className="flex snap-x snap-mandatory gap-3 sm:gap-4 lg:gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[53vw] min-w-[11.75rem] max-w-[13.75rem] shrink-0 snap-start min-[520px]:w-[38vw] sm:w-[18rem] sm:max-w-none lg:w-[calc((100%_-_5rem)/5)]"
            >
              <ProductCard product={product} compactMobile />
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-12 right-0 hidden w-16 bg-gradient-to-l from-slate-50 to-transparent sm:block xl:hidden" />
    </div>
  );
}

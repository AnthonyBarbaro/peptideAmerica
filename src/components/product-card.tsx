"use client";

import Link from "next/link";
import { FileCheck2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/lib/commerce/types";
import { formatCatalogPrice, formatStockStatus, stockStatusBadgeClassName } from "@/lib/format";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductImage } from "@/components/product-image";
import {
  getProductResearchArea,
  getResearchAreaDetails,
} from "@/lib/catalog/research-areas";

type ProductCardProps = {
  product: Product;
  compactMobile?: boolean;
};

export function ProductCard({ product, compactMobile = false }: ProductCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const researchArea = getProductResearchArea(product);
  const researchDetails = getResearchAreaDetails(researchArea);
  const hasCoaRecords = product.coaBatches.length > 0;
  const contentClassName = compactMobile ? "flex flex-1 flex-col p-3 sm:p-5" : "flex flex-1 flex-col p-5";
  const imageClassName = compactMobile ? "aspect-square sm:aspect-[4/3]" : "aspect-[4/5] sm:aspect-square";
  const titleClassName = compactMobile
    ? "truncate text-sm font-black text-slate-950 sm:text-lg"
    : "truncate text-lg font-black text-slate-950";
  const stockClassName = compactMobile
    ? "rounded-full px-2 py-0.5 text-[11px] font-semibold shadow-sm ring-1 sm:px-3 sm:py-1 sm:text-xs"
    : "shrink-0 rounded-full px-3 py-1 text-xs font-semibold";

  return (
    <motion.article
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-red-200 hover:shadow-md"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Link
        href={`/shop/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="relative block border-b border-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
      >
        <ProductImage product={product} className={imageClassName} />
        <div className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)]">
          <span className="inline-flex max-w-full truncate rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-sm ring-1 ring-slate-200 backdrop-blur">
            {researchDetails.group}
          </span>
        </div>
        <div className="absolute right-3 top-3">
          <span
            className={`${stockClassName} ${stockStatusBadgeClassName(product.stockStatus)}`}
          >
            {formatStockStatus(product.stockStatus)}
          </span>
        </div>
      </Link>
      <div className={contentClassName}>
        <div className="min-w-0">
          <Link
            href={`/shop/${product.slug}`}
            className={`${titleClassName} block hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600`}
          >
            {product.name}
          </Link>
        </div>

        {hasCoaRecords ? (
          <div className="mt-2 hidden flex-wrap items-center gap-2 sm:mt-4 sm:flex">
            <span className="hidden items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 sm:inline-flex">
              <FileCheck2 aria-hidden="true" size={14} />
              COA Available
            </span>
          </div>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4 sm:pt-5">
          <div className="min-w-0">
            <div className="truncate text-xl font-black text-slate-950 sm:text-2xl">
              {formatCatalogPrice(product.priceCents)}
            </div>
          </div>
          <AddToCartButton
            product={product}
            label="Quick add"
            iconOnly
            className="shrink-0"
          />
        </div>
      </div>
    </motion.article>
  );
}

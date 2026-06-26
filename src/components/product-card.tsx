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
  const imageClassName = compactMobile ? "aspect-square sm:aspect-[4/3]" : "aspect-[4/3]";
  const labelClassName = compactMobile
    ? "truncate text-xs font-semibold text-slate-950 sm:text-sm"
    : "truncate text-sm font-semibold text-slate-950";
  const stockClassName = compactMobile
    ? "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold sm:px-3 sm:py-1 sm:text-xs"
    : "shrink-0 rounded-full px-3 py-1 text-xs font-semibold";

  return (
    <motion.article
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Link
        href={`/shop/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
      >
        <ProductImage product={product} className={imageClassName} />
      </Link>
      <div className={contentClassName}>
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <Link
              href={`/shop/${product.slug}`}
              className="sr-only"
            >
              {product.name}
            </Link>
            <p className={labelClassName}>
              {researchDetails.label}
            </p>
            <p className="mt-1 truncate text-[11px] font-medium text-slate-500 sm:text-xs">
              {product.sku}
            </p>
          </div>
          <span
            className={`${stockClassName} ${stockStatusBadgeClassName(product.stockStatus)}`}
          >
            {formatStockStatus(product.stockStatus)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 sm:px-3">
            {product.sizeLabel}
          </span>
          {hasCoaRecords ? (
            <span className="hidden items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 sm:inline-flex">
              <FileCheck2 aria-hidden="true" size={14} />
              COA Available
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex flex-col items-stretch gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-end sm:justify-between sm:pt-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Price
            </div>
            <div className="mt-1 text-lg font-black text-slate-950 sm:text-xl">
              {formatCatalogPrice(product.priceCents)}
            </div>
          </div>
          <AddToCartButton product={product} label="Quick add" className="w-full shrink-0 sm:w-auto" />
        </div>
      </div>
    </motion.article>
  );
}

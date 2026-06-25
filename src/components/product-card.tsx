"use client";

import Link from "next/link";
import { FileCheck2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/lib/commerce/types";
import { formatCatalogPrice, formatStockStatus, stockStatusBadgeClassName } from "@/lib/format";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductVisual } from "@/components/product-visual";
import {
  getProductResearchArea,
  getResearchAreaDetails,
} from "@/lib/catalog/research-areas";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const researchArea = getProductResearchArea(product);
  const researchDetails = getResearchAreaDetails(researchArea);
  const hasCoaRecords = product.coaBatches.length > 0;

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
        <ProductVisual product={product} className="aspect-[4/3] rounded-none border-0" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/shop/${product.slug}`}
              className="sr-only"
            >
              {product.name}
            </Link>
            <p className="truncate text-sm font-semibold text-slate-950">
              {researchDetails.label}
            </p>
            <p className="mt-1 truncate text-xs font-medium text-slate-500">{product.sku}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${stockStatusBadgeClassName(product.stockStatus)}`}
          >
            {formatStockStatus(product.stockStatus)}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {product.sizeLabel}
          </span>
          {hasCoaRecords ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
              <FileCheck2 aria-hidden="true" size={14} />
              COA Available
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Price
            </div>
            <div className="mt-1 text-xl font-black text-slate-950">
              {formatCatalogPrice(product.priceCents)}
            </div>
          </div>
          <AddToCartButton product={product} label="Quick add" className="shrink-0" />
        </div>
      </div>
    </motion.article>
  );
}

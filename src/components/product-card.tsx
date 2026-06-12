"use client";

import Link from "next/link";
import { FileCheck2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/lib/commerce/types";
import { formatMoney, formatStockStatus } from "@/lib/format";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductVisual } from "@/components/product-visual";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Link href={`/shop/${product.slug}`} className="block focus-visible:outline-none">
        <ProductVisual product={product} className="aspect-[4/3] rounded-none border-0" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/shop/${product.slug}`}
              className="text-lg font-semibold text-slate-950 underline-offset-4 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              {product.name}
            </Link>
            <p className="mt-1 text-sm text-slate-500">{product.sku}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {formatStockStatus(product.stockStatus)}
          </span>
        </div>
        <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
          {product.shortDescription}
        </p>
        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-700">
          <FileCheck2 aria-hidden="true" size={18} className="text-red-600" />
          COA available
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-xl font-bold text-slate-950">
              {formatMoney(product.priceCents)}
            </div>
            <div className="text-xs text-slate-500">{product.sizeLabel}</div>
          </div>
          <AddToCartButton product={product} label="Quick add" />
        </div>
      </div>
    </motion.article>
  );
}

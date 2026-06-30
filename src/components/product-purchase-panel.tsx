"use client";

import Link from "next/link";
import { Ban, Check, FileCheck2, Minus, Plus, ShieldAlert, ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { trackEvent } from "@/lib/analytics";
import { complianceCopy } from "@/lib/compliance/copy";
import { useCartStore } from "@/lib/cart-store";
import { formatCatalogPrice, getCatalogPriceCents } from "@/lib/format";

type ProductPurchasePanelProps = {
  product: Product;
};

const MAX_QUANTITY = 99;

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const disabled = product.stockStatus === "out_of_stock";

  function handleAdd() {
    if (disabled) {
      return;
    }

    addItem(
      {
        ...product,
        priceCents: getCatalogPriceCents(product.priceCents),
      },
      quantity,
    );
    setAdded(true);
    trackEvent("add_to_cart", {
      sku: product.sku,
      name: product.name,
      quantity,
      priceCents: getCatalogPriceCents(product.priceCents),
    });
    window.setTimeout(() => setAdded(false), 1600);
  }

  const buttonLabel = disabled ? "Unavailable" : added ? "Added to cart" : "Add to cart";
  const ButtonIcon = disabled ? Ban : added ? Check : ShoppingCart;

  return (
    <div className="mt-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <span className="text-sm font-semibold text-slate-700">Quantity</span>
            <div className="inline-flex items-center rounded-md border border-slate-300">
              <button
                type="button"
                className="grid h-11 w-11 place-items-center text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={disabled || quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus aria-hidden="true" size={16} />
              </button>
              <span
                className="min-w-12 text-center text-sm font-bold text-slate-950"
                aria-live="polite"
              >
                {quantity}
              </span>
              <button
                type="button"
                className="grid h-11 w-11 place-items-center text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => setQuantity((value) => Math.min(MAX_QUANTITY, value + 1))}
                disabled={disabled || quantity >= MAX_QUANTITY}
                aria-label="Increase quantity"
              >
                <Plus aria-hidden="true" size={16} />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={disabled}
            className={`subtle-shine inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md px-5 text-sm font-bold text-white shadow-lg shadow-blue-950/20 transition disabled:cursor-not-allowed disabled:bg-slate-500 disabled:shadow-none ${
              added ? "bg-emerald-600" : "bg-blue-950 hover:bg-blue-900"
            }`}
          >
            <ButtonIcon aria-hidden="true" size={18} />
            {buttonLabel}
          </button>
        </div>
        <Link
          href="/coa"
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          <FileCheck2 aria-hidden="true" size={18} />
          View COA library
        </Link>
      </div>

      <div className="mt-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
        <ShieldAlert aria-hidden="true" className="mt-0.5 shrink-0 text-red-700" size={20} />
        <p className="text-sm font-medium leading-6 text-red-950">
          {complianceCopy.productNotice}
        </p>
      </div>

      {/* Sticky mobile purchase bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-black text-slate-950">
              {formatCatalogPrice(product.priceCents)}
            </div>
            <div className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              {complianceCopy.cardMicrocopy}
            </div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={disabled}
            className={`inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md px-4 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:bg-slate-500 ${
              added ? "bg-emerald-600" : "bg-red-600 hover:bg-red-500"
            }`}
          >
            <ButtonIcon aria-hidden="true" size={18} />
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

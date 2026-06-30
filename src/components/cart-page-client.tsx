"use client";

import Link from "next/link";
import { FileCheck2, Minus, Plus, ShieldAlert, ShoppingBag, Trash2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { complianceCopy } from "@/lib/compliance/copy";
import { getCartTotal, useCartStore } from "@/lib/cart-store";
import { formatDisplaySku, formatMoney } from "@/lib/format";

export function CartPageClient() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = getCartTotal(items);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  function handleRemove(productId: string, sku: string) {
    removeItem(productId);
    trackEvent("remove_from_cart", { sku });
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
        <ShoppingBag aria-hidden="true" className="mx-auto text-red-600" size={42} />
        <h1 className="mt-4 text-3xl font-bold text-slate-950">Your cart is empty</h1>
        <p className="mt-3 text-slate-600">Browse the catalog and add products.</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Shop catalog
          </Link>
          <Link
            href="/coa"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            <FileCheck2 aria-hidden="true" size={18} />
            Browse COA library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-slate-200 p-5">
          <h1 className="text-3xl font-bold text-slate-950">Cart</h1>
          <p className="text-sm font-medium text-slate-500">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="divide-y divide-slate-200">
          {items.map((item) => (
            <div key={item.product.id} className="grid gap-4 p-5 sm:grid-cols-[1fr_auto]">
              <div>
                <Link
                  href={`/shop/${item.product.slug}`}
                  className="text-lg font-semibold text-slate-950 hover:text-red-700"
                >
                  {item.product.name}
                </Link>
                <p className="mt-1 text-sm text-slate-500">
                  {formatDisplaySku(item.product.sku)} · {item.product.sizeLabel}
                </p>
                <p className="mt-2 text-base font-semibold text-slate-950">
                  {formatMoney(item.product.priceCents)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center rounded-md border border-slate-300">
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center text-slate-700 hover:bg-slate-50"
                    onClick={() =>
                      item.quantity === 1
                        ? removeItem(item.product.id)
                        : updateQuantity(item.product.id, item.quantity - 1)
                    }
                    aria-label={`Decrease ${item.product.name} quantity`}
                  >
                    <Minus aria-hidden="true" size={16} />
                  </button>
                  <span className="min-w-10 text-center text-sm font-semibold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center text-slate-700 hover:bg-slate-50"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    aria-label={`Increase ${item.product.name} quantity`}
                  >
                    <Plus aria-hidden="true" size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-red-700"
                  onClick={() => handleRemove(item.product.id, item.product.sku)}
                  aria-label={`Remove ${item.product.name}`}
                >
                  <Trash2 aria-hidden="true" size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Summary</h2>
        <div className="mt-5 space-y-3 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-950">{formatMoney(total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-semibold text-slate-950">Calculated later</span>
          </div>
        </div>
        <div className="mt-5 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3.5">
          <ShieldAlert aria-hidden="true" className="mt-0.5 shrink-0 text-red-700" size={18} />
          <p className="text-xs font-medium leading-5 text-red-950">
            {complianceCopy.cartNotice}
          </p>
        </div>
        <Link
          href="/checkout"
          onClick={() => trackEvent("begin_checkout", { itemCount, totalCents: total })}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          Continue to checkout
        </Link>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          {complianceCopy.hostedCheckout}
        </p>
        <div className="mt-4 grid gap-2 border-t border-slate-200 pt-4">
          <Link
            href="/shop"
            className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Continue shopping
          </Link>
          <Link
            href="/coa"
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            <FileCheck2 aria-hidden="true" size={17} />
            Browse COA library
          </Link>
        </div>
      </aside>
    </div>
  );
}

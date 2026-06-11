"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { getCartTotal, useCartStore } from "@/lib/cart-store";
import { formatMoney } from "@/lib/format";

export function CheckoutPageClient() {
  const [attestationAccepted, setAttestationAccepted] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const items = useCartStore((state) => state.items);
  const total = getCartTotal(items);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const response = await fetch("/api/commerce/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        attestationAccepted,
        items: items.map((item) => ({
          productId: item.product.id,
          slug: item.product.slug,
          name: item.product.name,
          sku: item.product.sku,
          priceCents: item.product.priceCents,
          quantity: item.quantity,
        })),
      }),
    });

    const data = (await response.json()) as { message?: string };
    setStatus(data.message ?? "Checkout request received.");
    setSubmitting(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-3xl font-bold text-slate-950">Checkout</h1>
        <p className="mt-3 text-slate-600">
          Phase 1 validates the cart and prepares the later checkout handoff.
        </p>
        <label className="mt-8 block">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="orders@example.com"
            className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
          />
        </label>
        <label className="mt-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <input
            type="checkbox"
            checked={attestationAccepted}
            onChange={(event) => setAttestationAccepted(event.target.checked)}
            className="mt-1 h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-600"
            required
          />
          <span className="text-sm font-medium leading-6 text-slate-900">
            I confirm these materials are for research use only and not for human or animal use.
          </span>
        </label>
        <button
          type="submit"
          disabled={!attestationAccepted || items.length === 0 || submitting}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {submitting ? "Validating..." : "Validate checkout"}
        </button>
        {status ? (
          <div className="mt-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900">
            <CheckCircle2 aria-hidden="true" size={20} />
            {status}
          </div>
        ) : null}
      </form>
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">Order summary</h2>
        {items.length === 0 ? (
          <div className="mt-5 rounded-md bg-slate-50 p-4 text-sm text-slate-600">
            Cart is empty. <Link href="/shop" className="font-semibold text-red-700">Shop catalog</Link>.
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between gap-4 text-sm">
                <div>
                  <div className="font-semibold text-slate-950">{item.product.name}</div>
                  <div className="text-slate-500">Qty {item.quantity}</div>
                </div>
                <div className="font-semibold text-slate-950">
                  {formatMoney(item.product.priceCents * item.quantity)}
                </div>
              </div>
            ))}
            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between text-base font-bold text-slate-950">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

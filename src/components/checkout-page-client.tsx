"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { complianceCopy } from "@/lib/compliance/copy";
import { getCartTotal, useCartStore } from "@/lib/cart-store";
import { formatMoney } from "@/lib/format";

type CheckoutApiResponse = {
  ok?: boolean;
  message?: string;
  orderId?: string;
  paymentToken?: string;
  paymentFormUrl?: string;
};

function submitAuthorizeNetHostedPayment(paymentFormUrl: string, paymentToken: string) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentFormUrl;

  const tokenInput = document.createElement("input");
  tokenInput.type = "hidden";
  tokenInput.name = "token";
  tokenInput.value = paymentToken;

  form.appendChild(tokenInput);
  document.body.appendChild(form);
  form.submit();
}

export function CheckoutPageClient() {
  const clientRequestId = useMemo(() => crypto.randomUUID(), []);
  const [attestationAccepted, setAttestationAccepted] = useState(false);
  const [customer, setCustomer] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [shippingAddress, setShippingAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "US",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = getCartTotal(items);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const response = await fetch("/api/commerce/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientRequestId,
        customer,
        shippingAddress,
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

    const data = (await response.json()) as CheckoutApiResponse;

    if (response.ok && data.ok && data.paymentToken && data.paymentFormUrl) {
      setStatus(data.message ?? "Opening secure payment.");
      submitAuthorizeNetHostedPayment(data.paymentFormUrl, data.paymentToken);
      return;
    }

    setStatus(
      data.orderId
        ? `${data.message ?? "Order submitted."} Order ${data.orderId}.`
        : data.message ?? "Checkout request received.",
    );
    if (response.ok && data.ok && data.orderId) {
      clearCart();
    }
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
          Enter shipping details to prepare your order. {complianceCopy.hostedCheckout}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">First name</span>
            <input
              value={customer.firstName}
              onChange={(event) =>
                setCustomer((current) => ({ ...current, firstName: event.target.value }))
              }
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Last name</span>
            <input
              value={customer.lastName}
              onChange={(event) =>
                setCustomer((current) => ({ ...current, lastName: event.target.value }))
              }
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
              required
            />
          </label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              type="email"
              value={customer.email}
              onChange={(event) =>
                setCustomer((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="orders@example.com"
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Phone</span>
            <input
              type="tel"
              value={customer.phone}
              onChange={(event) =>
                setCustomer((current) => ({ ...current, phone: event.target.value }))
              }
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
            />
          </label>
        </div>
        <div className="mt-8 grid gap-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Address line 1</span>
            <input
              value={shippingAddress.line1}
              onChange={(event) =>
                setShippingAddress((current) => ({ ...current, line1: event.target.value }))
              }
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Address line 2</span>
            <input
              value={shippingAddress.line2}
              onChange={(event) =>
                setShippingAddress((current) => ({ ...current, line2: event.target.value }))
              }
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
            />
          </label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_8rem_10rem_7rem]">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">City</span>
            <input
              value={shippingAddress.city}
              onChange={(event) =>
                setShippingAddress((current) => ({ ...current, city: event.target.value }))
              }
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">State</span>
            <input
              value={shippingAddress.region}
              onChange={(event) =>
                setShippingAddress((current) => ({ ...current, region: event.target.value }))
              }
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Postal code</span>
            <input
              value={shippingAddress.postalCode}
              onChange={(event) =>
                setShippingAddress((current) => ({ ...current, postalCode: event.target.value }))
              }
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Country</span>
            <input
              value={shippingAddress.country}
              onChange={(event) =>
                setShippingAddress((current) => ({ ...current, country: event.target.value }))
              }
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
              required
            />
          </label>
        </div>
        {/*
          Purchaser attestation gate. The accepted value is sent to
          /api/commerce/checkout, which requires `attestationAccepted: true`
          (Zod literal) and forwards it into the order record, so the
          attestation is persisted with each order. If the order backend is
          ever swapped out, keep that server-side enforcement in place.
        */}
        <label className="mt-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <input
            type="checkbox"
            checked={attestationAccepted}
            onChange={(event) => setAttestationAccepted(event.target.checked)}
            className="mt-1 h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-600"
            required
          />
          <span className="text-sm font-medium leading-6 text-slate-900">
            {complianceCopy.attestationCheckbox}
          </span>
        </label>
        <button
          type="submit"
          disabled={!attestationAccepted || items.length === 0 || submitting}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-slate-500"
        >
          {submitting ? "Submitting..." : "Submit order"}
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

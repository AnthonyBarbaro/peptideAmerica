"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, PackageSearch, Truck } from "lucide-react";
import { formatMoney } from "@/lib/format";

type TrackingResponse = {
  ok?: boolean;
  message?: string;
  order?: {
    externalOrderId: string;
    status: string;
    amountCents: number;
    paymentTransactionId?: string | null;
    vialOrderId?: string | null;
    vialStatus?: string | null;
    tracking?: {
      trackingNumber?: string;
      carrier?: string;
      service?: string;
      trackingUrl?: string;
      shippedAt?: string;
    } | null;
    items: Array<{
      name: string;
      sku: string;
      quantity: number;
    }>;
  };
};

function labelForStatus(status: string) {
  return status.replace(/^vial_/, "").replace(/_/g, " ");
}

export function TrackOrderClient() {
  const [externalOrderId, setExternalOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResponse | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    const params = new URLSearchParams({
      externalOrderId,
      email,
    });
    const response = await fetch(`/api/orders/track?${params.toString()}`);
    const data = (await response.json()) as TrackingResponse;

    setResult(data);
    setLoading(false);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <PackageSearch aria-hidden="true" className="text-red-600" size={34} />
      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
        Track order
      </p>
      <h1 className="mt-2 text-4xl font-black text-slate-950">Order tracking</h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">
        Look up payment, fulfillment, and shipment status from the live order ledger.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Order number</span>
          <input
            value={externalOrderId}
            onChange={(event) => setExternalOrderId(event.target.value)}
            placeholder="PA-10001"
            className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="orders@example.com"
            className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base text-slate-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="subtle-shine inline-flex min-h-11 items-center justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-slate-500 sm:col-span-2"
        >
          {loading ? "Checking..." : "Track order"}
        </button>
      </form>

      {result?.ok && result.order ? (
        <section className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                {result.order.externalOrderId}
              </h2>
              <p className="mt-1 text-sm font-semibold capitalize text-red-700">
                {labelForStatus(result.order.vialStatus ?? result.order.status)}
              </p>
            </div>
            <div className="text-right text-sm font-semibold text-slate-700">
              {formatMoney(result.order.amountCents)}
            </div>
          </div>

          {result.order.tracking?.trackingNumber ? (
            <div className="mt-5 flex gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
              <Truck aria-hidden="true" size={20} />
              <div>
                <div className="font-bold">
                  {result.order.tracking.carrier ?? "Carrier"}{" "}
                  {result.order.tracking.trackingNumber}
                </div>
                {result.order.tracking.trackingUrl ? (
                  <a
                    href={result.order.tracking.trackingUrl}
                    className="mt-1 inline-block font-semibold text-emerald-800 underline-offset-4 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open tracking
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
            {result.order.items.map((item) => (
              <div key={`${item.sku}-${item.name}`} className="flex justify-between gap-4 py-3 text-sm">
                <div>
                  <div className="font-semibold text-slate-950">{item.name}</div>
                  <div className="text-slate-500">{item.sku}</div>
                </div>
                <div className="font-semibold text-slate-700">Qty {item.quantity}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {result && !result.ok ? (
        <div className="mt-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-950">
          <AlertCircle aria-hidden="true" size={20} />
          {result.message ?? "Unable to find that order."}
        </div>
      ) : null}
    </div>
  );
}

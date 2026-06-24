import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PrintInvoiceButton } from "@/components/print-invoice-button";
import { getClerkAccountIdentity } from "@/lib/clerk/account";
import {
  getOrderForAccount,
  isOrderLedgerConfigured,
} from "@/lib/orders/order-ledger";
import { formatMoney } from "@/lib/format";

type InvoicePageProps = {
  params: Promise<{ externalOrderId: string }>;
};

export const metadata: Metadata = {
  title: "Invoice",
  description: "Account invoice and order status.",
};

function formatDate(value: Date | null) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function formatStatus(value: string | null) {
  return (value || "pending").replace(/^vial_/, "").replace(/_/g, " ");
}

function getTracking(order: Awaited<ReturnType<typeof getOrderForAccount>>) {
  const tracking = order?.tracking ?? {};
  return {
    trackingNumber:
      typeof tracking.trackingNumber === "string" ? tracking.trackingNumber : "",
    trackingUrl: typeof tracking.trackingUrl === "string" ? tracking.trackingUrl : "",
    carrier: typeof tracking.carrier === "string" ? tracking.carrier : "",
  };
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const identity = await getClerkAccountIdentity();

  if (!identity.signedIn) {
    redirect("/my-account");
  }

  if (!isOrderLedgerConfigured()) {
    return (
      <InvoiceShell>
        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-black text-slate-950">
            Invoice history is unavailable
          </h1>
          <p className="mt-3 text-slate-600">
            Account invoices are temporarily unavailable. Please check back soon.
          </p>
        </div>
      </InvoiceShell>
    );
  }

  const { externalOrderId } = await params;
  const order = await getOrderForAccount({
    externalOrderId: decodeURIComponent(externalOrderId),
    clerkUserId: identity.userId,
    emails: identity.emails,
  });

  if (!order) {
    notFound();
  }

  const tracking = getTracking(order);
  const subtotal = order.checkoutRequest.items.reduce(
    (total, item) => total + item.priceCents * item.quantity,
    0,
  );
  const shippingAddress = order.checkoutRequest.shippingAddress;
  const customer = order.checkoutRequest.customer;

  return (
    <InvoiceShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/my-account"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-700"
        >
          <ArrowLeft aria-hidden="true" size={18} />
          Back to account
        </Link>
        <PrintInvoiceButton />
      </div>

      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
              Invoice
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">
              {order.externalOrderId}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              Status
            </div>
            <div className="mt-1 text-xl font-black capitalize text-slate-950">
              {formatStatus(order.vialStatus ?? order.status)}
            </div>
          </div>
        </div>

        <section className="grid gap-6 border-b border-slate-200 py-6 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
              Customer
            </h2>
            <div className="mt-3 text-sm leading-6 text-slate-700">
              <div className="font-semibold text-slate-950">
                {[customer?.firstName, customer?.lastName].filter(Boolean).join(" ")}
              </div>
              <div>{customer?.email}</div>
              {customer?.phone ? <div>{customer.phone}</div> : null}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
              Ship to
            </h2>
            <div className="mt-3 text-sm leading-6 text-slate-700">
              <div>{shippingAddress?.line1}</div>
              {shippingAddress?.line2 ? <div>{shippingAddress.line2}</div> : null}
              <div>
                {shippingAddress?.city}, {shippingAddress?.region}{" "}
                {shippingAddress?.postalCode}
              </div>
              <div>{shippingAddress?.country}</div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 py-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
            Items
          </h2>
          <div className="mt-4 divide-y divide-slate-200">
            {order.checkoutRequest.items.map((item) => (
              <div
                key={`${order.externalOrderId}-${item.sku}`}
                className="grid gap-3 py-4 text-sm sm:grid-cols-[1fr_5rem_7rem_7rem]"
              >
                <div>
                  <div className="font-semibold text-slate-950">{item.name}</div>
                  <div className="text-slate-500">{item.sku}</div>
                </div>
                <div className="text-slate-700">Qty {item.quantity}</div>
                <div className="text-slate-700">{formatMoney(item.priceCents)}</div>
                <div className="font-semibold text-slate-950">
                  {formatMoney(item.priceCents * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 py-6 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
              Tracking
            </h2>
            {tracking.trackingNumber ? (
              <div className="mt-3 text-sm leading-6 text-slate-700">
                <div className="font-semibold text-slate-950">
                  {tracking.carrier || "Carrier"} {tracking.trackingNumber}
                </div>
                {tracking.trackingUrl ? (
                  <a
                    href={tracking.trackingUrl}
                    className="font-semibold text-red-700 underline-offset-4 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open tracking
                  </a>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">Tracking is pending.</p>
            )}
          </div>
          <div className="sm:text-right">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
              Total
            </h2>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <div className="flex justify-between gap-4 sm:justify-end">
                <span>Subtotal</span>
                <span className="min-w-24 font-semibold text-slate-950">
                  {formatMoney(subtotal)}
                </span>
              </div>
              <div className="flex justify-between gap-4 sm:justify-end">
                <span>Order total</span>
                <span className="min-w-24 text-xl font-black text-slate-950">
                  {formatMoney(order.amountCents)}
                </span>
              </div>
            </div>
            {order.paymentTransactionId ? (
              <p className="mt-3 text-xs text-slate-500">
                Payment transaction {order.paymentTransactionId}
              </p>
            ) : null}
          </div>
        </section>
      </article>
    </InvoiceShell>
  );
}

function InvoiceShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 print:max-w-none print:px-0">
      {children}
    </div>
  );
}

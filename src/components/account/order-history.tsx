import Link from "next/link";
import { FileText, PackageCheck, Truck } from "lucide-react";
import type { LedgerOrder } from "@/lib/orders/order-ledger";
import type { ClerkAccountIdentity } from "@/lib/clerk/account";
import { formatMoney } from "@/lib/format";

type AccountOrderHistoryProps = {
  identity: ClerkAccountIdentity;
  databaseConfigured: boolean;
  orders: LedgerOrder[];
};

function formatDate(value: Date | null) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function formatStatus(value: string | null) {
  return (value || "pending").replace(/^vial_/, "").replace(/_/g, " ");
}

function getTracking(order: LedgerOrder) {
  const tracking = order.tracking ?? {};
  const trackingNumber =
    typeof tracking.trackingNumber === "string" ? tracking.trackingNumber : "";
  const trackingUrl = typeof tracking.trackingUrl === "string" ? tracking.trackingUrl : "";
  const carrier = typeof tracking.carrier === "string" ? tracking.carrier : "";

  return { trackingNumber, trackingUrl, carrier };
}

export function AccountOrderHistory({
  identity,
  databaseConfigured,
  orders,
}: AccountOrderHistoryProps) {
  if (!identity.clerkEnabled) {
    return (
      <HistoryShell>
        <EmptyState
          title="Account history unavailable"
          body="Order history is temporarily unavailable. Please check back soon."
        />
      </HistoryShell>
    );
  }

  if (!identity.signedIn) {
    return (
      <HistoryShell>
        <EmptyState
          title="Sign in to view order history"
          body="Order status, tracking, and invoices appear here after account sign-in."
        />
      </HistoryShell>
    );
  }

  if (!databaseConfigured) {
    return (
      <HistoryShell>
        <EmptyState
          title="Order history unavailable"
          body="We couldn't load tracking and invoice details right now. Please try again soon."
        />
      </HistoryShell>
    );
  }

  return (
    <HistoryShell>
      {orders.length === 0 ? (
        <EmptyState
          title="No orders found"
          body="No checkout orders are linked to this account yet."
        />
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => {
            const tracking = getTracking(order);
            const status = formatStatus(order.vialStatus ?? order.status);

            return (
              <article
                key={order.externalOrderId}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
                      <PackageCheck aria-hidden="true" size={18} />
                      <span className="capitalize">{status}</span>
                    </div>
                    <h3 className="mt-2 text-xl font-black text-slate-950">
                      {order.externalOrderId}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Placed {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-950">
                      {formatMoney(order.amountCents)}
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      {order.checkoutRequest.items.length} item
                      {order.checkoutRequest.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 border-y border-slate-200 py-4 sm:grid-cols-2">
                  {order.checkoutRequest.items.slice(0, 4).map((item) => (
                    <div key={`${order.externalOrderId}-${item.sku}`} className="text-sm">
                      <div className="font-semibold text-slate-950">{item.name}</div>
                      <div className="text-slate-500">
                        {item.sku} · Qty {item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {tracking.trackingNumber ? (
                    tracking.trackingUrl ? (
                      <a
                        href={tracking.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        <Truck aria-hidden="true" size={18} />
                        Track {tracking.carrier || "shipment"}
                      </a>
                    ) : (
                      <span className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
                        <Truck aria-hidden="true" size={18} />
                        {tracking.trackingNumber}
                      </span>
                    )
                  ) : null}
                  <Link
                    href={`/my-account/orders/${encodeURIComponent(order.externalOrderId)}/invoice`}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    <FileText aria-hidden="true" size={18} />
                    Invoice
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </HistoryShell>
  );
}

function HistoryShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white/70 p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          Orders
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">
          Tracking and invoices
        </h2>
      </div>
      {children}
    </section>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

import type { Metadata } from "next";
import { AccountOrderHistory } from "@/components/account/order-history";
import { AccountPortal } from "@/components/account/account-portal";
import { MotionReveal } from "@/components/motion-reveal";
import { getClerkAccountIdentity } from "@/lib/clerk/account";
import {
  type LedgerOrder,
  isOrderLedgerConfigured,
  listOrdersForAccount,
} from "@/lib/orders/order-ledger";

export const metadata: Metadata = {
  title: "My Account",
  description: "Login and account access for Peptide America.",
};

export default async function MyAccountPage() {
  const identity = await getClerkAccountIdentity();
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const databaseConfigured = isOrderLedgerConfigured();
  let orderHistoryAvailable = databaseConfigured;
  let orders: LedgerOrder[] = [];

  if (identity.signedIn && databaseConfigured) {
    try {
      orders = await listOrdersForAccount({
          clerkUserId: identity.userId,
          emails: identity.emails,
        });
    } catch (error) {
      orderHistoryAvailable = false;
      console.error("Unable to load account order history", {
        message: error instanceof Error ? error.message : "Unknown database error",
      });
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          My account
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">
          {identity.signedIn ? "Orders and account" : "Sign in"}
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          {identity.signedIn
            ? "View order history, tracking, invoices, and account settings."
            : "Sign in to view order history, tracking, and invoices."}
        </p>
      </section>
      <div className="mt-8 grid gap-6 lg:grid-cols-[20rem_1fr]">
        <MotionReveal y={14}>
          <AccountPortal clerkEnabled={clerkEnabled} />
        </MotionReveal>
        <MotionReveal y={14} delay={0.04}>
          <AccountOrderHistory
            identity={identity}
            databaseConfigured={orderHistoryAvailable}
            orders={orders}
          />
        </MotionReveal>
      </div>
    </div>
  );
}

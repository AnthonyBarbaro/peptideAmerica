import type { Metadata } from "next";
import { LockKeyhole, PlugZap, ShieldCheck, type LucideIcon } from "lucide-react";
import { AccountPortal } from "@/components/account/account-portal";
import { MotionReveal } from "@/components/motion-reveal";

export const metadata: Metadata = {
  title: "My Account",
  description: "Login and account access for Peptide America.",
};

export default function MyAccountPage() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          My account
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Account access</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Login and registration are handled through Clerk. The storefront does not store
          passwords or payment details.
        </p>
        <div className="mt-8 grid gap-4">
          {[
            {
              icon: PlugZap,
              title: clerkEnabled ? "Clerk connected" : "Clerk not configured",
              body: clerkEnabled
                ? "Account actions are handled by Clerk-hosted authentication components."
                : "Set Clerk publishable and secret keys to enable live account actions.",
            },
            {
              icon: LockKeyhole,
              title: "Credential handling",
              body: "Passwords and OAuth flows are handled by Clerk, not by custom storefront code.",
            },
            {
              icon: ShieldCheck,
              title: "Checkout alignment",
              body: "Account access is separate from payment processing and Vial fulfillment approval.",
            },
          ].map((item, index) => (
            <MotionReveal key={item.title} delay={index * 0.06} y={12}>
              <InfoCard icon={item.icon} title={item.title} body={item.body} />
            </MotionReveal>
          ))}
        </div>
      </section>
      <MotionReveal y={14}>
        <AccountPortal clerkEnabled={clerkEnabled} />
      </MotionReveal>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Icon aria-hidden="true" className="text-red-600" size={24} />
      <h2 className="mt-3 text-lg font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

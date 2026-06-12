import type { Metadata } from "next";
import { LockKeyhole, PlugZap, ShieldCheck, type LucideIcon } from "lucide-react";
import { AccountPortal } from "@/components/account/account-portal";
import { MotionReveal } from "@/components/motion-reveal";
import { getAccountIntegration } from "@/lib/account/provider";

export const metadata: Metadata = {
  title: "My Account",
  description:
    "Login and registration surface prepared for WordPress/WooCommerce account handoff.",
};

export default function MyAccountPage() {
  const integration = getAccountIntegration();

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          My account
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Account access</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Login and registration are ready for a WordPress/WooCommerce account
          portal. The storefront does not store passwords or payment details.
        </p>
        <div className="mt-8 grid gap-4">
          {[
            {
              icon: PlugZap,
              title: integration.connected ? "Portal connected" : "Portal not connected yet",
              body: integration.connected
                ? "Account actions hand off to the configured WordPress/WooCommerce portal."
                : "Set WORDPRESS_ACCOUNT_URL or WOOCOMMERCE_URL to enable live account handoff.",
            },
            {
              icon: LockKeyhole,
              title: "Credential handling",
              body: "Credentials are not proxied through this Next.js frontend. The connected account portal should handle authentication.",
            },
            {
              icon: ShieldCheck,
              title: "Checkout alignment",
              body: "Account access is separate from payment processing, which remains disabled until a hosted checkout flow is connected.",
            },
          ].map((item, index) => (
            <MotionReveal key={item.title} delay={index * 0.06} y={12}>
              <InfoCard icon={item.icon} title={item.title} body={item.body} />
            </MotionReveal>
          ))}
        </div>
      </section>
      <MotionReveal y={14}>
        <AccountPortal integration={integration} />
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

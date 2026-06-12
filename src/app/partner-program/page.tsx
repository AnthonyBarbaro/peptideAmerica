import type { Metadata } from "next";
import Link from "next/link";
import { Handshake, LineChart, ShieldCheck } from "lucide-react";
import { MotionReveal } from "@/components/motion-reveal";

export const metadata: Metadata = {
  title: "Partner Program",
  description: "Placeholder partner program page for future affiliate and institutional workflows.",
};

const partnerItems = [
  {
    title: "Institutional inquiries",
    body: "Reserve space for lab, procurement, and repeat-order account workflows.",
    icon: Handshake,
  },
  {
    title: "Program controls",
    body: "Future partner terms should define approval, content standards, and reporting before launch.",
    icon: ShieldCheck,
  },
  {
    title: "Reporting readiness",
    body: "Analytics and attribution can be connected later without changing the public storefront structure.",
    icon: LineChart,
  },
];

export default function PartnerProgramPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          Partner program
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">
          Partner and institutional access
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          This placeholder keeps a future partner program discoverable while approval,
          terms, and reporting systems are still pending.
        </p>
      </div>
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {partnerItems.map((item, index) => (
          <MotionReveal key={item.title} delay={index * 0.06}>
            <article className="h-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <item.icon aria-hidden="true" className="text-red-600" size={28} />
              <h2 className="mt-4 text-xl font-black text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
            </article>
          </MotionReveal>
        ))}
      </section>
      <Link
        href="/contact"
        className="subtle-shine mt-8 inline-flex min-h-11 items-center justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500"
      >
        Contact support
      </Link>
    </div>
  );
}

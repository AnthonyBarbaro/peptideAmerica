import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, FileCheck2, FlaskConical } from "lucide-react";
import { MotionReveal } from "@/components/motion-reveal";

export const metadata: Metadata = {
  title: "Quality Documentation",
  description:
    "How Peptide America presents sample COA records, batch identifiers, and future quality documentation workflows.",
};

const items = [
  {
    title: "Batch records",
    body: "Product pages and the COA library organize records by SKU, batch number, lab name, date, and document status.",
    icon: ClipboardCheck,
  },
  {
    title: "COA access",
    body: "Every sample product includes placeholder COA records so the storefront is ready for supplier document import.",
    icon: FileCheck2,
  },
  {
    title: "Supplier data readiness",
    body: "Purity labels, technical specifications, and document links should be replaced with approved supplier data before launch.",
    icon: FlaskConical,
  },
];

export default function QualityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          Quality documentation
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">
          Verification workflows without unsupported claims
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Peptide America is built around batch documentation, clear product identifiers,
          and COA access. Fixed purity values should only appear after approved supplier
          records are imported.
        </p>
      </div>
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {items.map((item, index) => (
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
        href="/coa"
        className="subtle-shine mt-8 inline-flex min-h-11 items-center justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500"
      >
        View COA library
      </Link>
    </div>
  );
}

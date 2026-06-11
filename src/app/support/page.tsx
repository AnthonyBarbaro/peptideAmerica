import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, HelpCircle, Mail, PackageCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Support",
  description: "Support options for catalog, COA, checkout, and policy questions.",
};

const supportItems = [
  {
    title: "Catalog Questions",
    body: "Request help finding SKUs, categories, placeholder product fields, or future supplier data requirements.",
    icon: HelpCircle,
  },
  {
    title: "COA Records",
    body: "Ask about sample batch records, document status labels, or launch-ready COA replacement workflows.",
    icon: FileCheck2,
  },
  {
    title: "Shipping Workflow",
    body: "Review the placeholder shipping and delivery policy before fulfillment integrations are connected.",
    icon: PackageCheck,
  },
  {
    title: "Contact Form",
    body: "Use the contact form to validate a support request locally. Email delivery is not connected yet.",
    icon: Mail,
  },
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          Support
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">How can we help?</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Support is focused on catalog records, sample COA documents, checkout flow,
          and policy questions.
        </p>
      </div>
      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {supportItems.map((item) => (
          <article
            key={item.title}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <item.icon aria-hidden="true" className="text-red-600" size={28} />
            <h2 className="mt-4 text-xl font-black text-slate-950">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
          </article>
        ))}
      </section>
      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Contact Us</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The contact form currently validates requests in the browser only.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500"
        >
          Open contact form
        </Link>
      </div>
    </div>
  );
}

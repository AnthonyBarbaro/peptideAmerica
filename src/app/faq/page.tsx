import type { Metadata } from "next";
import { MotionReveal } from "@/components/motion-reveal";

const faqs = [
  {
    question: "What kind of catalog is this?",
    answer:
      "Peptide America is structured for research catalog browsing, product comparison, and batch document review.",
  },
  {
    question: "Who should use this catalog?",
    answer:
      "The catalog is positioned for qualified researchers, labs, and institutions that need organized product records and batch documentation.",
  },
  {
    question: "Are COA records available?",
    answer:
      "The COA library displays batch documents returned by the live catalog source.",
  },
  {
    question: "How does batch documentation work?",
    answer:
      "Batch records can include batch numbers, lab names, test dates, status labels, and document links.",
  },
  {
    question: "Where can I review quality documentation?",
    answer:
      "The quality documentation page explains how COA records, SKU fields, batch numbers, and supplier data readiness are organized.",
  },
  {
    question: "How should I read storage labels?",
    answer:
      "Storage labels are shown as supplier-provided catalog fields.",
  },
  {
    question: "Is shipping connected?",
    answer:
      "No. Shipping workflow integration is planned for a later phase after order flow is connected.",
  },
  {
    question: "Can I track an order?",
    answer:
      "Order tracking requires a connected order and fulfillment source.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "International shipping rules should be defined in reviewed shipping policy copy before live fulfillment is enabled.",
  },
  {
    question: "Can checkout collect payment now?",
    answer:
      "No. This Next.js storefront does not collect card information.",
  },
  {
    question: "How can support be contacted?",
    answer:
      "Use the support page or contact page to preview a support request. Email delivery is not connected yet.",
  },
  {
    question: "Where are the site policies?",
    answer:
      "Support, privacy, return and refund, shipping and delivery, and terms pages are available from the footer navigation.",
  },
  {
    question: "Is there a partner program?",
    answer:
      "Partner workflows require approved terms and reporting before launch.",
  },
];

export const metadata: Metadata = {
  title: "FAQ",
  description: "Concise answers about the Peptide America storefront.",
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">FAQ</p>
      <h1 className="mt-2 text-4xl font-black text-slate-950">Frequently asked questions</h1>
      <div className="mt-8 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm">
        {faqs.map((faq, index) => (
          <MotionReveal key={faq.question} delay={Math.min(index * 0.03, 0.18)} y={10}>
            <details className="group p-5">
              <summary className="cursor-pointer text-lg font-bold text-slate-950 marker:text-red-600">
                {faq.question}
              </summary>
              <p className="mt-3 leading-7 text-slate-600">{faq.answer}</p>
            </details>
          </MotionReveal>
        ))}
      </div>
    </div>
  );
}

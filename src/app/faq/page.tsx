import type { Metadata } from "next";

const faqs = [
  {
    question: "What kind of products are listed?",
    answer:
      "Peptide America is structured for research catalog browsing, product comparison, and batch document review.",
  },
  {
    question: "Are COA records available?",
    answer:
      "The COA library currently uses sample records. Production launch should replace every placeholder with approved supplier documents.",
  },
  {
    question: "How does batch documentation work?",
    answer:
      "Each sample product includes batch numbers, lab names, test dates, status labels, and placeholder document links.",
  },
  {
    question: "Is shipping connected?",
    answer:
      "No. Shipping workflow integration is planned for a later phase after WooCommerce order flow is connected.",
  },
  {
    question: "Can checkout collect payment now?",
    answer:
      "No. Checkout currently validates the cart and attestation only. A hosted checkout redirect can be added later.",
  },
  {
    question: "How can support be contacted?",
    answer:
      "Use the contact page to preview a support request. Email delivery is not connected yet.",
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
        {faqs.map((faq) => (
          <details key={faq.question} className="group p-5">
            <summary className="cursor-pointer text-lg font-bold text-slate-950 marker:text-red-600">
              {faq.question}
            </summary>
            <p className="mt-3 leading-7 text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

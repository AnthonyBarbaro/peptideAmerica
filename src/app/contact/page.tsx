import type { Metadata } from "next";
import { Mail, MessageSquareText } from "lucide-react";
import { MotionReveal } from "@/components/motion-reveal";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Peptide America for catalog, batch documentation, and storefront support.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          Contact
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Catalog support</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Preview a support request for catalog questions, sample COA records, or
          storefront feedback. No email backend is connected yet.
        </p>
        <div className="mt-8 grid gap-4">
          <MotionReveal y={12}>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <Mail aria-hidden="true" className="text-red-600" />
              <h2 className="mt-3 text-lg font-bold text-slate-950">Email workflow</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This form validates locally only. A support mailbox integration can be
                added in a later phase.
              </p>
            </div>
          </MotionReveal>
          <MotionReveal y={12} delay={0.06}>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <MessageSquareText aria-hidden="true" className="text-red-600" />
              <h2 className="mt-3 text-lg font-bold text-slate-950">Support scope</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Support copy stays focused on product records, batch documents, orders,
                and storefront access.
              </p>
            </div>
          </MotionReveal>
        </div>
      </section>
      <MotionReveal y={14}>
        <ContactForm />
      </MotionReveal>
    </div>
  );
}

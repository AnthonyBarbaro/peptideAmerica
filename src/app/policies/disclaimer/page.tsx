import type { Metadata } from "next";
import Link from "next/link";
import { PolicyShell } from "@/components/policy-shell";
import {
  disclaimerLastUpdated,
  disclaimerSections,
  fdaDisclaimer,
} from "@/lib/legal/disclaimer";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Important research-use, FDA, and liability disclaimer for Peptide America.",
};

export default function DisclaimerPage() {
  return (
    <PolicyShell title="Disclaimer" eyebrow="Important Notice">
      <p className="text-sm font-semibold text-slate-500">
        Last updated: {disclaimerLastUpdated}
      </p>

      <div className="rounded-lg border border-red-200 bg-red-50 p-5">
        <h2 className="text-base font-black text-red-950">FDA Disclaimer</h2>
        <p className="mt-2 text-sm leading-6 text-red-950">{fdaDisclaimer}</p>
      </div>

      {disclaimerSections.map((section) => (
        <section key={section.heading}>
          <h2 className="text-lg font-bold text-slate-950">{section.heading}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="mt-2">
              {paragraph}
            </p>
          ))}
          {section.intro ? <p className="mt-2">{section.intro}</p> : null}
          {section.bullets ? (
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5">
        <Link
          href="/contact"
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-blue-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
        >
          Contact us
        </Link>
        <Link
          href="/support"
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          Support
        </Link>
        <Link
          href="/policies/research-use-only"
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          Research Use Policy
        </Link>
      </div>

      <p className="text-sm font-medium text-slate-500">
        This page is provided for general information and is not legal advice.
      </p>
    </PolicyShell>
  );
}

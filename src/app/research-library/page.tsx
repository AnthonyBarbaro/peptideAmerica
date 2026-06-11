import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { researchArticles } from "@/lib/research/articles";

export const metadata: Metadata = {
  title: "Research Library",
  description:
    "Neutral catalog education for COA documents, batch records, technical specifications, and storage labels.",
};

export default function ResearchLibraryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          Research library
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Catalog education</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Short articles about documentation, batch records, specs, and data readiness
          for research catalog workflows.
        </p>
      </div>
      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {researchArticles.map((article) => (
          <article
            key={article.slug}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <BookOpen aria-hidden="true" className="text-red-600" size={28} />
            <div className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              {article.readTime}
            </div>
            <h2 className="mt-2 text-2xl font-black text-slate-950">{article.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{article.summary}</p>
            <Link
              href={`/research-library/${article.slug}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-600"
            >
              Read article
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}

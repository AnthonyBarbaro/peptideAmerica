import type { Metadata } from "next";
import { ResearchLibraryClient } from "@/components/research-library-client";
import { getResearchCategories, researchArticles } from "@/lib/research/articles";

export const metadata: Metadata = {
  title: "Research Library",
  description:
    "Source-backed peptide research notes for catalog review, COA context, and technical literature summaries.",
};

export default function ResearchLibraryPage() {
  const categories = getResearchCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-900">
          Research library
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">
          Peptide research notes
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Scan source summaries by peptide topic, research category, and current catalog
          mapping. Each article keeps long-form context in the library instead of
          repeating it across product cards.
        </p>
      </div>
      <div className="mt-8">
        <ResearchLibraryClient articles={researchArticles} categories={categories} />
      </div>
    </div>
  );
}

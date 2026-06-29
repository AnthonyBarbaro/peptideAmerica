"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import type { ResearchArticle } from "@/lib/research/articles";

type ResearchLibraryClientProps = {
  articles: ResearchArticle[];
  categories: string[];
};

const allCategoriesLabel = "All topics";

function sourceCountLabel(count: number) {
  return `${count} source${count === 1 ? "" : "s"}`;
}

export function ResearchLibraryClient({
  articles,
  categories,
}: ResearchLibraryClientProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(allCategoriesLabel);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        category === allCategoriesLabel || article.category === category;
      const searchable = [
        article.title,
        article.summary,
        article.category,
        ...article.tags,
        ...article.relatedProductSkus,
        ...article.sources.map((source) => source.publisher),
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [articles, category, query]);

  return (
    <div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Search library</span>
          <div className="mt-2 flex min-h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 transition focus-within:border-blue-900 focus-within:ring-2 focus-within:ring-blue-900/20">
            <Search aria-hidden="true" className="shrink-0 text-slate-400" size={19} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Peptide, SKU, source, or category"
              className="min-h-10 flex-1 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400"
            />
          </div>
        </label>
        <div className="mt-5">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Category
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {[allCategoriesLabel, ...categories].map((item) => {
              const isActive = item === category;
              const count =
                item === allCategoriesLabel
                  ? articles.length
                  : articles.filter((article) => article.category === item).length;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-white"
                  }`}
                >
                  {item} <span className="ml-1 opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-slate-600">
          {filteredArticles.length} topic{filteredArticles.length === 1 ? "" : "s"}
        </p>
        {category !== allCategoriesLabel || query ? (
          <button
            type="button"
            onClick={() => {
              setCategory(allCategoriesLabel);
              setQuery("");
            }}
            className="text-sm font-bold text-blue-900 hover:text-blue-700"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredArticles.map((article) => (
          <article
            key={article.slug}
            className="flex min-h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="rounded-md bg-blue-50 p-2 text-blue-900">
                <BookOpen aria-hidden="true" size={20} />
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  {sourceCountLabel(article.sources.length)}
                </span>
                {article.relatedProductSkus.length > 0 ? (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
                    Product-linked
                  </span>
                ) : null}
              </div>
            </div>
            <div className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-blue-900">
              {article.category}
            </div>
            <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950">
              {article.title}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
              {article.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href={`/research-library/${article.slug}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:text-blue-700"
            >
              Read research notes
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}

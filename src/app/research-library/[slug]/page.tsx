import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpen, FileText, Lightbulb } from "lucide-react";
import {
  getPlainLanguageNotes,
  getResearchArticle,
  researchArticles,
} from "@/lib/research/articles";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";

type ResearchArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return researchArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ResearchArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getResearchArticle(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  return {
    title: article.title,
    description: article.summary,
  };
}

function isExternalUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export default async function ResearchArticlePage({ params }: ResearchArticlePageProps) {
  const { slug } = await params;
  const article = getResearchArticle(slug);

  if (!article) {
    notFound();
  }

  const plainLanguageNotes = getPlainLanguageNotes(article);

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/research-library"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-900"
      >
        <ArrowLeft aria-hidden="true" size={18} />
        Back to library
      </Link>
      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-900">
            {article.category}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            {article.readTime}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            {article.sources.length} source{article.sources.length === 1 ? "" : "s"}
          </span>
        </div>
        <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950">
          {article.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">{article.summary}</p>
        {article.relatedProductSkus.length > 0 ? (
          <div className="mt-6">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Catalog mapping
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {article.relatedProductSkus.map((sku) => (
                <span
                  key={sku}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700"
                >
                  {sku}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {plainLanguageNotes.length > 0 ? (
        <section className="mt-6 rounded-lg border border-blue-100 bg-blue-950 p-6 text-white shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-white/10 p-2 text-blue-100">
              <Lightbulb aria-hidden="true" size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
                Simple explanation
              </p>
              <h2 className="mt-1 text-2xl font-black">Plain-English snapshot</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {plainLanguageNotes.map((note) => (
              <div
                key={note}
                className="rounded-lg border border-white/10 bg-white/[0.06] p-4 text-sm font-medium leading-6 text-blue-50"
              >
                {note}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-50 p-2 text-blue-900">
              <BookOpen aria-hidden="true" size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-950">Research focus</h2>
          </div>
          <ul className="mt-5 space-y-3">
            {article.researchFocus.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-900" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-slate-100 p-2 text-slate-700">
              <FileText aria-hidden="true" size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-950">Mechanism notes</h2>
          </div>
          <ul className="mt-5 space-y-3">
            {article.mechanismNotes.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-black text-slate-950">Source summaries</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {article.studySummaries.map((study) => (
            <div key={study.title} className="rounded-lg bg-slate-50 p-5">
              <h3 className="text-lg font-black text-slate-950">{study.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{study.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-black text-slate-950">Sources</h2>
        <div className="mt-5 divide-y divide-slate-100 rounded-lg border border-slate-200">
          {article.sources.map((source) => {
            const external = isExternalUrl(source.url);

            return (
              <a
                key={`${source.title}-${source.url}`}
                href={source.url}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="flex items-start justify-between gap-4 p-4 transition hover:bg-slate-50"
              >
                <span>
                  <span className="block font-bold text-slate-950">{source.title}</span>
                  <span className="mt-1 block text-sm font-medium text-slate-500">
                    {source.publisher} · {source.year}
                  </span>
                </span>
                {external ? (
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-slate-400"
                    size={18}
                  />
                ) : null}
              </a>
            );
          })}
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Research Library", href: "/research-library" },
              { name: article.title, href: `/research-library/${article.slug}` },
            ]),
          ),
        }}
      />
    </article>
  );
}

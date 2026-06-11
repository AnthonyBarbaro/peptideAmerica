import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getResearchArticle, researchArticles } from "@/lib/research/articles";
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

export default async function ResearchArticlePage({ params }: ResearchArticlePageProps) {
  const { slug } = await params;
  const article = getResearchArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/research-library"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-700"
      >
        <ArrowLeft aria-hidden="true" size={18} />
        Back to library
      </Link>
      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
          {article.readTime}
        </p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950">
          {article.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">{article.summary}</p>
        <div className="mt-8 space-y-8">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-black text-slate-950">{section.heading}</h2>
              <p className="mt-3 leading-7 text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
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

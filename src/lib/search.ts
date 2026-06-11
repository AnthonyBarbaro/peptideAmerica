import type { CoaBatch, Product } from "@/lib/commerce/types";
import type { ResearchArticle } from "@/lib/research/articles";

export type SearchResult =
  | {
      type: "product";
      title: string;
      href: string;
      eyebrow: string;
      summary: string;
    }
  | {
      type: "coa";
      title: string;
      href: string;
      eyebrow: string;
      summary: string;
    }
  | {
      type: "article";
      title: string;
      href: string;
      eyebrow: string;
      summary: string;
    };

const normalize = (value: string) => value.trim().toLowerCase();

export function includesQuery(values: string[], query: string) {
  const term = normalize(query);

  if (!term) {
    return true;
  }

  return values.some((value) => normalize(value).includes(term));
}

export function searchProducts(products: Product[], query: string) {
  return products.filter((product) =>
    includesQuery(
      [
        product.name,
        product.sku,
        product.category,
        product.shortDescription,
        product.researchOverview,
        ...product.tags,
      ],
      query,
    ),
  );
}

export function searchCoaBatches(
  batches: CoaBatch[],
  products: Product[],
  query: string,
) {
  const productBySlug = new Map(products.map((product) => [product.slug, product]));

  return batches.filter((batch) => {
    const product = productBySlug.get(batch.productSlug);

    return includesQuery(
      [
        batch.batchNumber,
        batch.sku,
        batch.labName,
        batch.notes,
        product?.name ?? "",
      ],
      query,
    );
  });
}

export function searchArticles(articles: ResearchArticle[], query: string) {
  return articles.filter((article) =>
    includesQuery(
      [
        article.title,
        article.summary,
        ...article.tags,
        ...article.sections.flatMap((section) => [section.heading, section.body]),
      ],
      query,
    ),
  );
}

export function buildSearchResults({
  products,
  batches,
  articles,
  query,
}: {
  products: Product[];
  batches: CoaBatch[];
  articles: ResearchArticle[];
  query: string;
}): SearchResult[] {
  const productBySlug = new Map(products.map((product) => [product.slug, product]));

  return [
    ...searchProducts(products, query).map((product): SearchResult => ({
      type: "product",
      title: product.name,
      href: `/shop/${product.slug}`,
      eyebrow: `${product.sku} · ${product.category}`,
      summary: product.shortDescription,
    })),
    ...searchCoaBatches(batches, products, query).map((batch): SearchResult => {
      const product = productBySlug.get(batch.productSlug);

      return {
        type: "coa",
        title: batch.batchNumber,
        href: "/coa",
        eyebrow: `${batch.sku} · ${batch.labName}`,
        summary: `${product?.name ?? batch.productSlug} batch record with ${batch.status} status.`,
      };
    }),
    ...searchArticles(articles, query).map((article): SearchResult => ({
      type: "article",
      title: article.title,
      href: `/research-library/${article.slug}`,
      eyebrow: `Research library · ${article.readTime}`,
      summary: article.summary,
    })),
  ];
}

import type { MetadataRoute } from "next";
import { getCommerceProvider } from "@/lib/commerce/provider";
import { researchArticles } from "@/lib/research/articles";
import { publicRoutes } from "@/lib/site-routes";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://peptideamerica.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCommerceProvider().listProducts();

  return [
    ...publicRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1 : 0.7,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/shop/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...researchArticles.map((article) => ({
      url: `${siteUrl}/research-library/${article.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

import type { MetadataRoute } from "next";
import { getCommerceProvider } from "@/lib/commerce/provider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://peptideamerica.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCommerceProvider().listProducts();
  const staticRoutes = ["", "/shop", "/cart", "/checkout", "/coa"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/shop/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}

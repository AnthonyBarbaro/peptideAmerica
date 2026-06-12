import { describe, expect, it } from "vitest";
import { mockProducts } from "../src/lib/commerce/mock-provider";
import { researchArticles } from "../src/lib/research/articles";
import { publicRoutes } from "../src/lib/site-routes";

const requiredStaticRoutes = [
  "/",
  "/shop",
  "/coa",
  "/research-library",
  "/my-account",
  "/cart",
  "/checkout",
  "/search",
  "/faq",
  "/support",
  "/track-order",
  "/quality",
  "/partner-program",
  "/contact",
  "/policies/research-use-only",
  "/policies/privacy",
  "/policies/return-refund",
  "/policies/terms",
  "/policies/shipping-returns",
];

describe("route inventory", () => {
  it("includes required static public routes", () => {
    expect(publicRoutes).toEqual(expect.arrayContaining(requiredStaticRoutes));
  });

  it("has mock product and article routes", () => {
    expect(mockProducts.map((product) => `/shop/${product.slug}`)).toContain(
      "/shop/pa-research-peptide-alpha",
    );
    expect(
      researchArticles.map((article) => `/research-library/${article.slug}`),
    ).toContain("/research-library/understanding-coa-documentation");
  });
});

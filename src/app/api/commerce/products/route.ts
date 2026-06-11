import { NextRequest, NextResponse } from "next/server";
import { getCommerceProvider } from "@/lib/commerce/provider";
import type { ProductQuery } from "@/lib/commerce/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const first = searchParams.get("first");
  const query: ProductQuery = {
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    sort: (searchParams.get("sort") as ProductQuery["sort"]) ?? "featured",
    first: first ? Number(first) : undefined,
  };
  const commerce = getCommerceProvider();
  const [products, categories] = await Promise.all([
    commerce.listProducts(query),
    commerce.listCategories(),
  ]);

  return NextResponse.json({
    provider: commerce.name,
    products,
    categories,
  });
}

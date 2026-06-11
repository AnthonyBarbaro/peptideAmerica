import { NextRequest, NextResponse } from "next/server";
import { getCommerceProvider } from "@/lib/commerce/provider";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const products = await getCommerceProvider().searchProducts(query);

  return NextResponse.json({ products, query });
}

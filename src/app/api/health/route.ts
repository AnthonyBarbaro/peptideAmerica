import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "peptide-america-frontend",
    provider: process.env.COMMERCE_PROVIDER ?? "mock",
    checkoutMode: process.env.CHECKOUT_MODE ?? "disabled",
  });
}

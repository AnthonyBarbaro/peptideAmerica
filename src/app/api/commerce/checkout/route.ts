import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutSession } from "@/lib/payment/checkout-provider";

const checkoutSchema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  attestationAccepted: z.literal(true),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        slug: z.string().min(1),
        name: z.string().min(1),
        sku: z.string().min(1),
        priceCents: z.number().int().nonnegative(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid checkout request.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const response = await createCheckoutSession(parsed.data);

  return NextResponse.json(response, { status: response.ok ? 200 : 400 });
}

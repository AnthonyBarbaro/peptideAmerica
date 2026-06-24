import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutSession } from "@/lib/payment/checkout-provider";

const checkoutSchema = z.object({
  clientRequestId: z.string().min(1).optional(),
  customer: z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
  }),
  shippingAddress: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    region: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(2),
  }),
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

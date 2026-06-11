import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getAccountActionUrl,
  getAccountIntegration,
} from "@/lib/account/provider";

const accountSessionSchema = z.object({
  action: z.enum(["login", "register", "lost-password"]).default("login"),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = accountSessionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid account request." },
      { status: 400 },
    );
  }

  const integration = getAccountIntegration();
  const redirectUrl = getAccountActionUrl(integration, parsed.data.action);

  if (!integration.connected || !redirectUrl) {
    return NextResponse.json({
      ok: false,
      mode: integration.mode,
      message:
        "Account portal is not connected yet. Set WORDPRESS_ACCOUNT_URL or WOOCOMMERCE_URL to enable WordPress/WooCommerce account handoff.",
    });
  }

  return NextResponse.json({
    ok: true,
    mode: integration.mode,
    redirectUrl,
    message: "Continue to the WordPress/WooCommerce account portal.",
  });
}

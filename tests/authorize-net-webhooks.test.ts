import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyAuthorizeNetWebhookSignature } from "../src/lib/payment/authorize-net/webhooks";

describe("Authorize.Net webhook signatures", () => {
  it("verifies HMAC SHA512 signatures", () => {
    const body = JSON.stringify({ eventType: "net.authorize.payment.authcapture.created" });
    const signatureKey =
      "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    const signature = createHmac("sha512", Buffer.from(signatureKey, "hex"))
      .update(body, "utf8")
      .digest("hex");

    expect(
      verifyAuthorizeNetWebhookSignature({
        body,
        signatureHeader: `sha512=${signature}`,
        signatureKey,
      }),
    ).toBe(true);
  });

  it("rejects mismatched signatures", () => {
    expect(
      verifyAuthorizeNetWebhookSignature({
        body: "{}",
        signatureHeader: "sha512=deadbeef",
        signatureKey:
          "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      }),
    ).toBe(false);
  });
});

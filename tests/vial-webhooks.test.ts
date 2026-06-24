import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyVialWebhookSignature } from "../src/lib/vial/webhooks";

describe("VialAPI webhook signatures", () => {
  it("verifies HMAC SHA256 signatures over timestamp and raw body", () => {
    const body = JSON.stringify({
      externalOrderId: "PA-20260624-0001",
      status: "shipped",
    });
    const secret = "vial_webhook_test_secret";
    const timestamp = "1782345600";
    const signature = createHmac("sha256", secret)
      .update(`${timestamp}.${body}`, "utf8")
      .digest("hex");

    expect(
      verifyVialWebhookSignature({
        body,
        timestamp,
        signatureHeader: `sha256=${signature}`,
        secret,
        nowSeconds: 1782345600,
      }),
    ).toBe(true);
  });

  it("rejects mismatched signatures", () => {
    expect(
      verifyVialWebhookSignature({
        body: "{}",
        timestamp: "1782345600",
        signatureHeader: "sha256=deadbeef",
        secret: "vial_webhook_test_secret",
        nowSeconds: 1782345600,
      }),
    ).toBe(false);
  });

  it("rejects stale timestamps", () => {
    const body = "{}";
    const secret = "vial_webhook_test_secret";
    const timestamp = "1782345600";
    const signature = createHmac("sha256", secret)
      .update(`${timestamp}.${body}`, "utf8")
      .digest("hex");

    expect(
      verifyVialWebhookSignature({
        body,
        timestamp,
        signatureHeader: `sha256=${signature}`,
        secret,
        nowSeconds: 1782346001,
      }),
    ).toBe(false);
  });
});

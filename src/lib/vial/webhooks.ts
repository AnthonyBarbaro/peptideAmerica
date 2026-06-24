import { createHmac, timingSafeEqual } from "node:crypto";
import { getVialConfig } from "./config";

const MAX_CLOCK_SKEW_SECONDS = 5 * 60;

function normalizeSignature(value: string | null) {
  return value?.trim() ?? "";
}

export function verifyVialWebhookSignature({
  body,
  timestamp,
  signatureHeader,
  secret = getVialConfig().webhookSecret,
  nowSeconds = Math.floor(Date.now() / 1000),
}: {
  body: string;
  timestamp: string | null;
  signatureHeader: string | null;
  secret?: string;
  nowSeconds?: number;
}) {
  const timestampNumber = Number(timestamp);
  const signature = normalizeSignature(signatureHeader);

  if (!secret || !signature || !Number.isFinite(timestampNumber)) {
    return false;
  }

  if (Math.abs(nowSeconds - timestampNumber) > MAX_CLOCK_SKEW_SECONDS) {
    return false;
  }

  const expected =
    "sha256=" +
    createHmac("sha256", secret)
      .update(`${timestamp}.${body}`, "utf8")
      .digest("hex");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  return (
    signatureBuffer.length === expectedBuffer.length &&
    timingSafeEqual(signatureBuffer, expectedBuffer)
  );
}

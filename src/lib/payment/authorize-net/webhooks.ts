import { createHmac, timingSafeEqual } from "node:crypto";
import { getAuthorizeNetConfig } from "./config";

function normalizeSignature(value: string | null) {
  return value?.trim().replace(/^sha512=/i, "").toLowerCase() ?? "";
}

export function verifyAuthorizeNetWebhookSignature({
  body,
  signatureHeader,
  signatureKey = getAuthorizeNetConfig().signatureKey,
}: {
  body: string;
  signatureHeader: string | null;
  signatureKey?: string;
}) {
  const signature = normalizeSignature(signatureHeader);

  if (!signature || !signatureKey) {
    return false;
  }

  const expected = createHmac("sha512", Buffer.from(signatureKey, "hex"))
    .update(body, "utf8")
    .digest("hex");

  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  return (
    signatureBuffer.length === expectedBuffer.length &&
    timingSafeEqual(signatureBuffer, expectedBuffer)
  );
}

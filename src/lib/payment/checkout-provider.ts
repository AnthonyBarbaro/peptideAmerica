import type { CheckoutRequest, CheckoutResponse } from "./types";

export async function createCheckoutSession(
  request: CheckoutRequest,
): Promise<CheckoutResponse> {
  if (!request.attestationAccepted) {
    return {
      ok: false,
      checkoutMode: "disabled",
      message: "Checkout attestation is required.",
    };
  }

  if (request.items.length === 0) {
    return {
      ok: false,
      checkoutMode: "disabled",
      message: "Cart is empty.",
    };
  }

  return {
    ok: true,
    checkoutMode: "disabled",
    message: "Phase 1 checkout is validated locally. Payment connection is not active.",
  };
}

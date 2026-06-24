import type { CheckoutRequest, CheckoutResponse } from "./types";
import { createAuthorizeNetHostedPayment } from "./authorize-net/hosted";
import {
  getAuthorizeNetConfig,
  isAuthorizeNetConfigured,
} from "./authorize-net/config";
import { createPendingOrder } from "../orders/order-ledger";
import { canSubmitVialOrders, submitVialOrder } from "../vial/orders";

function hasOrderContact(request: CheckoutRequest) {
  const customer = request.customer;
  const shippingAddress = request.shippingAddress;

  return Boolean(
    customer?.email &&
      customer.firstName &&
      customer.lastName &&
      shippingAddress?.line1 &&
      shippingAddress.city &&
      shippingAddress.region &&
      shippingAddress.postalCode &&
      shippingAddress.country,
  );
}

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

  if (!hasOrderContact(request)) {
    return {
      ok: false,
      checkoutMode: "disabled",
      message: "Customer and shipping details are required.",
    };
  }

  if (process.env.PAYMENT_PROVIDER === "authorize_net") {
    const authorizeNetConfig = getAuthorizeNetConfig();

    if (!isAuthorizeNetConfigured(authorizeNetConfig)) {
      return {
        ok: false,
        checkoutMode: "authorize_net_hosted",
        message: "Authorize.Net hosted payment is not configured.",
      };
    }

    try {
      const externalOrderId = request.clientRequestId || crypto.randomUUID();
      const orderRequest = { ...request, clientRequestId: externalOrderId };

      await createPendingOrder(orderRequest);

      const payment = await createAuthorizeNetHostedPayment(orderRequest);

      return {
        ok: true,
        checkoutMode: "authorize_net_hosted",
        message: "Continue to secure payment.",
        paymentToken: payment.token,
        paymentFormUrl: payment.paymentFormUrl,
        externalOrderId: payment.externalOrderId,
      };
    } catch (error) {
      return {
        ok: false,
        checkoutMode: "authorize_net_hosted",
        message:
          error instanceof Error
            ? error.message
            : "Unable to create Authorize.Net payment session.",
      };
    }
  }

  if (process.env.CHECKOUT_MODE === "vial_order") {
    if (!canSubmitVialOrders()) {
      return {
        ok: false,
        checkoutMode: "vial_order",
        message:
          "Live order submission is not enabled. Configure Vial order env vars and payment approval before accepting orders.",
      };
    }

    const order = await submitVialOrder(request);

    return {
      ok: true,
      checkoutMode: "vial_order",
      message: "Order submitted.",
      orderId: order.id,
    };
  }

  return {
    ok: false,
    checkoutMode: "disabled",
    message: "Checkout is not active.",
  };
}

import type { CheckoutRequest } from "@/lib/payment/types";
import {
  getAuthorizeNetApiUrl,
  getAuthorizeNetConfig,
  getAuthorizeNetPaymentFormUrl,
  isAuthorizeNetConfigured,
} from "./config";

type AuthorizeNetHostedPaymentResult = {
  token: string;
  paymentFormUrl: string;
  externalOrderId: string;
};

type AuthorizeNetErrorResponse = {
  messages?: {
    resultCode?: string;
    message?: Array<{
      code?: string;
      text?: string;
    }>;
  };
};

function formatAmount(cents: number) {
  return (cents / 100).toFixed(2);
}

function getOrderTotalCents(request: CheckoutRequest) {
  return request.items.reduce(
    (total, item) => total + item.priceCents * item.quantity,
    0,
  );
}

function getAuthorizeNetError(payload: AuthorizeNetErrorResponse) {
  const message = payload.messages?.message?.[0];
  return message?.text || "Authorize.Net rejected the hosted payment request.";
}

function setting(name: string, value: unknown) {
  return {
    settingName: name,
    settingValue: JSON.stringify(value),
  };
}

export async function createAuthorizeNetHostedPayment(
  request: CheckoutRequest,
): Promise<AuthorizeNetHostedPaymentResult> {
  const config = getAuthorizeNetConfig();

  if (!isAuthorizeNetConfigured(config)) {
    throw new Error("Authorize.Net hosted payment is not configured.");
  }

  const totalCents = getOrderTotalCents(request);

  if (totalCents <= 0) {
    throw new Error("Order total must be greater than zero.");
  }

  const externalOrderId = request.clientRequestId || crypto.randomUUID();
  const payload = {
    getHostedPaymentPageRequest: {
      refId: externalOrderId,
      merchantAuthentication: {
        name: config.apiLoginId,
        transactionKey: config.transactionKey,
      },
      transactionRequest: {
        transactionType: "authCaptureTransaction",
        amount: formatAmount(totalCents),
        order: {
          invoiceNumber: externalOrderId.slice(0, 20),
          description: `Peptide America order ${externalOrderId}`,
        },
        customer: {
          email: request.customer?.email,
        },
        billTo: {
          firstName: request.customer?.firstName,
          lastName: request.customer?.lastName,
          address: request.shippingAddress?.line1,
          city: request.shippingAddress?.city,
          state: request.shippingAddress?.region,
          zip: request.shippingAddress?.postalCode,
          country: request.shippingAddress?.country,
          phoneNumber: request.customer?.phone,
        },
        shipTo: {
          firstName: request.customer?.firstName,
          lastName: request.customer?.lastName,
          address: request.shippingAddress?.line1,
          city: request.shippingAddress?.city,
          state: request.shippingAddress?.region,
          zip: request.shippingAddress?.postalCode,
          country: request.shippingAddress?.country,
        },
        lineItems: {
          lineItem: request.items.slice(0, 30).map((item) => ({
            itemId: item.sku.slice(0, 31),
            name: item.name.slice(0, 31),
            description: item.sku.slice(0, 255),
            quantity: item.quantity,
            unitPrice: formatAmount(item.priceCents),
          })),
        },
        userFields: {
          userField: [
            { name: "externalOrderId", value: externalOrderId },
            { name: "source", value: "peptideamerica" },
          ],
        },
      },
      hostedPaymentSettings: {
        setting: [
          setting("hostedPaymentReturnOptions", {
            showReceipt: true,
            url: config.returnUrl,
            urlText: "Return to Peptide America",
            cancelUrl: config.cancelUrl,
            cancelUrlText: "Cancel",
          }),
          setting("hostedPaymentPaymentOptions", {
            cardCodeRequired: true,
          }),
          setting("hostedPaymentBillingAddressOptions", {
            show: true,
            required: true,
          }),
          setting("hostedPaymentShippingAddressOptions", {
            show: true,
            required: true,
          }),
          setting("hostedPaymentButtonOptions", {
            text: "Pay",
          }),
          setting("hostedPaymentOrderOptions", {
            show: true,
            merchantName: "Peptide America",
          }),
        ],
      },
    },
  };

  const response = await fetch(getAuthorizeNetApiUrl(config.environment), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const responsePayload = (await response.json()) as AuthorizeNetErrorResponse & {
    token?: string;
  };

  if (!response.ok || !responsePayload.token) {
    throw new Error(getAuthorizeNetError(responsePayload));
  }

  return {
    token: responsePayload.token,
    paymentFormUrl: getAuthorizeNetPaymentFormUrl(config.environment),
    externalOrderId,
  };
}

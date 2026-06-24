export type AuthorizeNetEnvironment = "sandbox" | "production";

export type AuthorizeNetConfig = {
  apiLoginId: string;
  transactionKey: string;
  signatureKey: string;
  environment: AuthorizeNetEnvironment;
  returnUrl: string;
  cancelUrl: string;
};

function cleanEnv(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : "";
}

export function getAuthorizeNetConfig(): AuthorizeNetConfig {
  const environment =
    process.env.AUTHORIZE_NET_ENV === "production" ? "production" : "sandbox";

  return {
    apiLoginId: cleanEnv(process.env.AUTHORIZE_NET_API_LOGIN_ID),
    transactionKey: cleanEnv(process.env.AUTHORIZE_NET_TRANSACTION_KEY),
    signatureKey: cleanEnv(process.env.AUTHORIZE_NET_SIGNATURE_KEY),
    environment,
    returnUrl: cleanEnv(process.env.AUTHORIZE_NET_RETURN_URL),
    cancelUrl: cleanEnv(process.env.AUTHORIZE_NET_CANCEL_URL),
  };
}

export function isAuthorizeNetConfigured(config = getAuthorizeNetConfig()) {
  return Boolean(
    config.apiLoginId &&
      config.transactionKey &&
      config.returnUrl &&
      config.cancelUrl,
  );
}

export function getAuthorizeNetApiUrl(environment: AuthorizeNetEnvironment) {
  return environment === "production"
    ? "https://api.authorize.net/xml/v1/request.api"
    : "https://apitest.authorize.net/xml/v1/request.api";
}

export function getAuthorizeNetPaymentFormUrl(environment: AuthorizeNetEnvironment) {
  return environment === "production"
    ? "https://accept.authorize.net/payment/payment"
    : "https://test.authorize.net/payment/payment";
}

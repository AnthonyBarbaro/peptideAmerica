import type { AccountAction, AccountIntegration } from "@/lib/account/types";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function getConfiguredAccountBase() {
  const directAccountUrl = process.env.WORDPRESS_ACCOUNT_URL?.trim();

  if (directAccountUrl) {
    return trimTrailingSlash(directAccountUrl);
  }

  const wooUrl = process.env.WOOCOMMERCE_URL?.trim();

  if (wooUrl) {
    return `${trimTrailingSlash(wooUrl)}/my-account`;
  }

  return null;
}

export function getAccountIntegration(): AccountIntegration {
  const accountUrl = getConfiguredAccountBase();

  if (!accountUrl) {
    return {
      mode: "local_preview",
      connected: false,
      accountUrl: null,
      loginUrl: null,
      registerUrl: null,
      lostPasswordUrl: null,
    };
  }

  return {
    mode: "wordpress_redirect",
    connected: true,
    accountUrl,
    loginUrl: `${accountUrl}/#login`,
    registerUrl: `${accountUrl}/#register`,
    lostPasswordUrl: `${accountUrl}/lost-password/`,
  };
}

export function getAccountActionUrl(
  integration: AccountIntegration,
  action: AccountAction,
) {
  switch (action) {
    case "register":
      return integration.registerUrl;
    case "lost-password":
      return integration.lostPasswordUrl;
    case "login":
    default:
      return integration.loginUrl;
  }
}

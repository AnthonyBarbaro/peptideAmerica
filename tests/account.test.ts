import { afterEach, describe, expect, it } from "vitest";
import {
  getAccountActionUrl,
  getAccountIntegration,
} from "../src/lib/account/provider";
import {
  validateLogin,
  validateRegister,
} from "../src/lib/account/validation";

const originalWordPressAccountUrl = process.env.WORDPRESS_ACCOUNT_URL;
const originalWooCommerceUrl = process.env.WOOCOMMERCE_URL;

afterEach(() => {
  process.env.WORDPRESS_ACCOUNT_URL = originalWordPressAccountUrl;
  process.env.WOOCOMMERCE_URL = originalWooCommerceUrl;
});

describe("account integration", () => {
  it("defaults to local preview when no account URL is configured", () => {
    delete process.env.WORDPRESS_ACCOUNT_URL;
    delete process.env.WOOCOMMERCE_URL;

    expect(getAccountIntegration()).toMatchObject({
      mode: "local_preview",
      connected: false,
      accountUrl: null,
    });
  });

  it("uses a configured WordPress account URL", () => {
    process.env.WORDPRESS_ACCOUNT_URL = "https://example.com/my-account/";

    const integration = getAccountIntegration();

    expect(integration.connected).toBe(true);
    expect(integration.accountUrl).toBe("https://example.com/my-account");
    expect(getAccountActionUrl(integration, "login")).toBe(
      "https://example.com/my-account/#login",
    );
  });

  it("falls back to WooCommerce my-account path", () => {
    delete process.env.WORDPRESS_ACCOUNT_URL;
    process.env.WOOCOMMERCE_URL = "https://shop.example.com/";

    expect(getAccountIntegration().accountUrl).toBe(
      "https://shop.example.com/my-account",
    );
  });
});

describe("account validation", () => {
  it("requires login credentials", () => {
    expect(validateLogin({ identifier: "", password: "" })).toEqual({
      identifier: "Enter a username or email address.",
      password: "Enter your password.",
    });
  });

  it("validates registration fields", () => {
    expect(
      validateRegister({
        email: "bad-email",
        password: "short",
        confirmPassword: "other",
      }),
    ).toEqual({
      email: "Enter a valid email address.",
      password: "Use at least 8 characters.",
      confirmPassword: "Passwords must match.",
    });
  });
});

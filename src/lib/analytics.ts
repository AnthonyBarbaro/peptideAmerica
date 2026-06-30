/**
 * Provider-agnostic analytics. Safe to call with or without an analytics
 * provider configured: events are forwarded to `window.dataLayer` (GTM /
 * GA-style) and to a `pa:track` CustomEvent so any future provider can
 * subscribe without touching call sites. No network calls, no PII required.
 *
 * Usage: trackEvent("add_to_cart", { sku, priceCents });
 */

export type AnalyticsEvent =
  | "view_home"
  | "search_products"
  | "view_product"
  | "open_coa"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_checkout"
  | "newsletter_signup"
  | "back_in_stock_request";

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

type DataLayerWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

export function trackEvent(event: AnalyticsEvent, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const detail = { event, ...payload, ts: Date.now() };

  try {
    const target = window as DataLayerWindow;
    target.dataLayer = target.dataLayer ?? [];
    target.dataLayer.push(detail);
    window.dispatchEvent(new CustomEvent("pa:track", { detail }));
  } catch {
    // Analytics must never break the UI; swallow any provider errors.
  }

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, payload);
  }
}

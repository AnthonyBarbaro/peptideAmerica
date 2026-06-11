export type CheckoutLineItem = {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  priceCents: number;
  quantity: number;
};

export type CheckoutRequest = {
  items: CheckoutLineItem[];
  attestationAccepted: boolean;
  email?: string;
};

export type CheckoutResponse = {
  ok: boolean;
  checkoutMode: "disabled" | "woocommerce_redirect";
  message: string;
  redirectUrl?: string;
};

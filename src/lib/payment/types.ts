export type CheckoutLineItem = {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  priceCents: number;
  quantity: number;
};

export type CheckoutCustomer = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

export type CheckoutShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

export type CheckoutRequest = {
  items: CheckoutLineItem[];
  attestationAccepted: boolean;
  customer?: CheckoutCustomer;
  shippingAddress?: CheckoutShippingAddress;
  clientRequestId?: string;
};

export type CheckoutResponse = {
  ok: boolean;
  checkoutMode: "disabled" | "vial_order" | "authorize_net_hosted";
  message: string;
  redirectUrl?: string;
  orderId?: string;
  paymentToken?: string;
  paymentFormUrl?: string;
  externalOrderId?: string;
};

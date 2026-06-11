export type WooCommerceRestConfig = {
  url: string;
  consumerKey: string;
  consumerSecret: string;
};

export class WooCommerceRestClient {
  constructor(private readonly config: WooCommerceRestConfig) {}

  async getProducts() {
    throw new Error(
      `WooCommerce REST is not connected in Phase 1 for ${this.config.url}.`,
    );
  }
}

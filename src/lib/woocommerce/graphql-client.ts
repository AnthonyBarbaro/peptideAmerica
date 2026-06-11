export type WooGraphqlConfig = {
  endpoint: string;
};

export class WooGraphqlClient {
  constructor(private readonly config: WooGraphqlConfig) {}

  async query<TData>(query: string, variables?: Record<string, unknown>): Promise<TData> {
    void query;
    void variables;

    throw new Error(
      `WPGraphQL/WooGraphQL is not connected in Phase 1 for ${this.config.endpoint}.`,
    );
  }
}

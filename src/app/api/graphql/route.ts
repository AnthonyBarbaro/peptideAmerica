import { createSchema, createYoga } from "graphql-yoga";
import { getCommerceProvider } from "@/lib/commerce/provider";

const typeDefs = /* GraphQL */ `
  type TechnicalSpec {
    label: String!
    value: String!
  }

  type CoaBatch {
    id: ID!
    productSlug: String!
    sku: String!
    batchNumber: String!
    labName: String!
    testedAt: String!
    purityPercent: Float
    status: String!
    documentUrl: String!
    notes: String!
  }

  type Product {
    id: ID!
    slug: String!
    name: String!
    sku: String!
    category: String!
    priceCents: Int!
    sizeLabel: String!
    stockStatus: String!
    shortDescription: String!
    researchOverview: String!
    technicalSpecs: [TechnicalSpec!]!
    purityLabel: String!
    storageLabel: String!
    molecularWeight: String!
    sequence: String!
    tags: [String!]!
    images: [String!]!
    coaBatches: [CoaBatch!]!
  }

  type SiteSettings {
    brandName: String!
    siteUrl: String!
    commerceProvider: String!
    checkoutMode: String!
  }

  type Query {
    products(search: String, category: String, first: Int): [Product!]!
    product(slug: String!): Product
    categories: [String!]!
    coaBatches(productSlug: String): [CoaBatch!]!
    siteSettings: SiteSettings!
  }
`;

const schema = createSchema({
  typeDefs,
  resolvers: {
    Query: {
      products: async (
        _root: unknown,
        args: { search?: string; category?: string; first?: number },
      ) => getCommerceProvider().listProducts(args),
      product: async (_root: unknown, args: { slug: string }) =>
        getCommerceProvider().getProduct(args.slug),
      categories: async () => getCommerceProvider().listCategories(),
      coaBatches: async (_root: unknown, args: { productSlug?: string }) =>
        getCommerceProvider().listCoaBatches(args.productSlug),
      siteSettings: () => ({
        brandName: process.env.NEXT_PUBLIC_BRAND_NAME ?? "Peptide America",
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://peptideamerica.com",
        commerceProvider: process.env.COMMERCE_PROVIDER ?? "mock",
        checkoutMode: process.env.CHECKOUT_MODE ?? "disabled",
      }),
    },
  },
});

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

export { yoga as POST };

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type TechnicalSpec = {
  label: string;
  value: string;
};

export type CoaBatchStatus = "sample" | "pending" | "verified";

export type CoaBatch = {
  id: string;
  productSlug: string;
  sku: string;
  batchNumber: string;
  labName: string;
  testedAt: string;
  purityPercent: number | null;
  status: CoaBatchStatus;
  documentUrl: string;
  notes: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: string;
  priceCents: number;
  sizeLabel: string;
  stockStatus: StockStatus;
  shortDescription: string;
  researchOverview: string;
  technicalSpecs: TechnicalSpec[];
  purityLabel: string;
  storageLabel: string;
  molecularWeight: string;
  sequence: string;
  tags: string[];
  images: string[];
  coaBatches: CoaBatch[];
};

export type ProductQuery = {
  search?: string;
  category?: string;
  first?: number;
  sort?: "featured" | "price-asc" | "price-desc" | "name";
};

export type CommerceProvider = {
  name: string;
  listProducts(query?: ProductQuery): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;
  searchProducts(query: string): Promise<Product[]>;
  listCategories(): Promise<string[]>;
  listCoaBatches(productSlug?: string): Promise<CoaBatch[]>;
};

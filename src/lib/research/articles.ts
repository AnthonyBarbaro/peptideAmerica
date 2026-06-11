export type ResearchArticle = {
  slug: string;
  title: string;
  summary: string;
  readTime: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
  tags: string[];
};

export const researchArticles: ResearchArticle[] = [
  {
    slug: "understanding-coa-documentation",
    title: "Understanding COA Documentation",
    summary:
      "A practical overview of how certificates of analysis organize batch identity, lab details, and result summaries.",
    readTime: "4 min read",
    tags: ["COA", "Documentation", "Batch records"],
    sections: [
      {
        heading: "What a COA records",
        body:
          "A COA is a batch document that connects a catalog item to a specific lot, testing lab, date, and measured attributes supplied by the vendor.",
      },
      {
        heading: "Why batch identity matters",
        body:
          "Batch identity helps purchasing teams compare the item in hand with the matching document instead of relying on a generic catalog entry.",
      },
      {
        heading: "Phase 1 note",
        body:
          "Peptide America currently displays sample records only. Live supplier documents should replace every placeholder before launch.",
      },
    ],
  },
  {
    slug: "what-batch-verification-means",
    title: "What Batch Verification Means",
    summary:
      "How SKU, batch number, lab name, and document status work together in a clean ecommerce workflow.",
    readTime: "3 min read",
    tags: ["Batch", "Verification", "Catalog"],
    sections: [
      {
        heading: "Matching records",
        body:
          "Batch verification starts by comparing the product SKU and batch number against the document listed in the COA library.",
      },
      {
        heading: "Status labels",
        body:
          "Status labels should show whether a record is sample, pending, or verified so teams can understand the document state quickly.",
      },
      {
        heading: "Operational value",
        body:
          "Clear batch records reduce support back-and-forth and make product pages easier to review during procurement.",
      },
    ],
  },
  {
    slug: "reading-technical-specifications",
    title: "Reading Technical Specifications",
    summary:
      "A guide to scanning format, appearance, sequence, storage label, and other structured catalog fields.",
    readTime: "5 min read",
    tags: ["Specifications", "Catalog", "Reference"],
    sections: [
      {
        heading: "Structured fields",
        body:
          "Technical specifications should be presented as short labeled fields so details are easy to compare across catalog entries.",
      },
      {
        heading: "Placeholder fields",
        body:
          "When supplier values are unavailable, placeholder labels should make that status obvious instead of implying final data.",
      },
      {
        heading: "Review flow",
        body:
          "A strong product page keeps identifiers, specs, COA records, and cart actions close together without crowding the page.",
      },
    ],
  },
  {
    slug: "storage-labels-for-research-materials",
    title: "Storage Labels for Research Materials",
    summary:
      "How storage labels should be displayed as supplier-provided handling fields in a research catalog.",
    readTime: "3 min read",
    tags: ["Storage", "Labels", "Materials"],
    sections: [
      {
        heading: "Label source",
        body:
          "Storage labels should come from supplier documentation or approved internal product records before being published.",
      },
      {
        heading: "Catalog display",
        body:
          "The storefront should show storage text near the technical specifications so teams can review it with other product identifiers.",
      },
      {
        heading: "Data readiness",
        body:
          "Phase 1 placeholder storage labels should be replaced during product data import and checked during launch QA.",
      },
    ],
  },
];

export function getResearchArticle(slug: string) {
  return researchArticles.find((article) => article.slug === slug) ?? null;
}

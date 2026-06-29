import type { Product } from "@/lib/commerce/types";

export type ResearchSource = {
  title: string;
  publisher: string;
  url: string;
  year: string;
};

export type ResearchStudySummary = {
  title: string;
  body: string;
};

export type ResearchArticle = {
  slug: string;
  title: string;
  summary: string;
  readTime: string;
  category: string;
  relatedProductSkus: string[];
  researchFocus: string[];
  mechanismNotes: string[];
  studySummaries: ResearchStudySummary[];
  sources: ResearchSource[];
  tags: string[];
};

const webMdPeptideOverview: ResearchSource = {
  title: "Peptide overview",
  publisher: "WebMD",
  url: "https://www.webmd.com/a-to-z-guides/what-are-peptides",
  year: "2024",
};

export const researchArticles: ResearchArticle[] = [
  {
    slug: "aod-9604-research-notes",
    title: "AOD 9604 Research Notes",
    summary:
      "A literature overview of AOD 9604 as a growth-hormone-fragment topic in metabolic pathway research.",
    readTime: "7 min read",
    category: "Metabolic Research",
    relatedProductSkus: ["AOD9604-10MG"],
    researchFocus: [
      "Studied in relation to lipid-signaling models and growth-hormone-fragment biology.",
      "Often reviewed as a narrow fragment topic rather than as a full growth hormone analog.",
      "Useful catalog context includes fragment identity, assay model, and whether the source is preclinical or clinical literature.",
    ],
    mechanismNotes: [
      "Research literature discusses AOD 9604 as a C-terminal growth hormone fragment with a narrower signaling profile than the full parent protein.",
      "Mechanism under review centers on metabolic signaling markers, receptor selectivity, and the difference between fragment-level findings and broader endocrine activity.",
    ],
    studySummaries: [
      {
        title: "Fragment identity",
        body:
          "Early papers describe AOD 9604 as a synthetic fragment used to isolate metabolic signaling questions from broader growth hormone biology.",
      },
      {
        title: "Catalog review angle",
        body:
          "For storefront education, the most useful data points are SKU identity, stated fragment, lot documentation, and the type of research model described by each source.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "AOD 9604 lipid-signaling study",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/11713213/",
        year: "2001",
      },
      {
        title: "AOD 9604 metabolic model study",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/11146367/",
        year: "2000",
      },
    ],
    tags: ["AOD 9604", "Metabolic", "Growth hormone fragment"],
  },
  {
    slug: "bpc-157-research-notes",
    title: "BPC-157 Research Notes",
    summary:
      "A compliant literature summary for BPC-157, focused on preclinical models, study design, and source quality.",
    readTime: "8 min read",
    category: "Tissue Repair Research",
    relatedProductSkus: ["BPC157-10MG", "BPC157-5MG"],
    researchFocus: [
      "Studied in relation to cellular stress models, tissue-culture endpoints, and experimental repair pathways.",
      "Most public literature is preclinical, so product-page language should stay limited to research context.",
      "Source review should separate laboratory findings from unsupported retail claims.",
    ],
    mechanismNotes: [
      "Research literature discusses BPC-157 around nitric-oxide signaling, local mediator balance, and cellular response pathways.",
      "Mechanism under review remains model-dependent; catalog copy should avoid implying real-world outcomes.",
    ],
    studySummaries: [
      {
        title: "Preclinical literature base",
        body:
          "Review literature describes many model systems, but the evidence base is not the same as approved product labeling.",
      },
      {
        title: "Source quality check",
        body:
          "Useful source notes should list model type, endpoint measured, and whether findings come from a review or original experiment.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "BPC-157 review",
        publisher: "PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12446177/",
        year: "2025",
      },
    ],
    tags: ["BPC-157", "Cellular", "Preclinical"],
  },
  {
    slug: "ghk-cu-research-notes",
    title: "GHK-Cu Research Notes",
    summary:
      "A source-backed overview of the copper peptide GHK-Cu, focused on binding context and laboratory literature.",
    readTime: "7 min read",
    category: "Dermal Research",
    relatedProductSkus: ["GHKCU-50MG"],
    researchFocus: [
      "Studied in relation to copper-binding peptide chemistry and matrix-focused laboratory models.",
      "Often discussed with dermal-research terminology, but public storefront copy should avoid cosmetic outcome claims.",
      "Catalog review should note peptide identity, copper complex status, and source type.",
    ],
    mechanismNotes: [
      "Research literature discusses GHK-Cu as a naturally occurring copper-binding peptide with gene-expression and matrix-related study themes.",
      "Mechanism under review includes copper transport context, extracellular matrix markers, and cell-culture signaling observations.",
    ],
    studySummaries: [
      {
        title: "Copper-complex context",
        body:
          "Review literature connects GHK-Cu to copper-binding chemistry and cellular signaling questions in laboratory models.",
      },
      {
        title: "Catalog review angle",
        body:
          "A product page should distinguish the catalog material, the copper-complex naming, and the source record used for any technical note.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "GHK-Cu review",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/29986520/",
        year: "2018",
      },
    ],
    tags: ["GHK-Cu", "Copper peptide", "Dermal"],
  },
  {
    slug: "glow-blend-research-notes",
    title: "GLOW Blend Research Notes",
    summary:
      "A catalog-facing framework for reviewing a peptide blend when constituent-level source review is required.",
    readTime: "5 min read",
    category: "Peptide Blend Research",
    relatedProductSkus: ["GLOW-70MG"],
    researchFocus: [
      "Studied as a catalog blend topic where source review depends on confirmed constituent identity.",
      "The product record should connect the blend name, SKU, lot documentation, and any supplier-provided composition records.",
      "Literature notes should be attached at the constituent level when a blend formula is confirmed for publication.",
    ],
    mechanismNotes: [
      "Mechanism under review should not be inferred from the blend name alone.",
      "For blend products, the storefront should avoid pathway statements until each component is mapped to approved source records.",
    ],
    studySummaries: [
      {
        title: "Blend review workflow",
        body:
          "A blend article is most useful as a documentation checkpoint: confirm formula, map constituents, then attach source notes.",
      },
      {
        title: "Public copy boundary",
        body:
          "Until constituent-level records are approved, public copy should stay focused on catalog identity and source-readiness.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "COA documentation primer",
        publisher: "Peptide America",
        url: "/coa",
        year: "Catalog",
      },
    ],
    tags: ["GLOW", "Blend", "Catalog review"],
  },
  {
    slug: "hcg-research-notes",
    title: "HCG Research Notes",
    summary:
      "A research-library overview of HCG as a glycoprotein hormone topic with structure and receptor context.",
    readTime: "7 min read",
    category: "Endocrine Research",
    relatedProductSkus: ["HCG-10000IU"],
    researchFocus: [
      "Studied in relation to glycoprotein hormone structure, subunit biology, and receptor interaction.",
      "Catalog review should separate biochemical identity from unsupported retail claims.",
      "Useful source notes include subunit structure, receptor context, and supplier lot documentation.",
    ],
    mechanismNotes: [
      "Research literature discusses HCG as part of the glycoprotein hormone family with alpha and beta subunit structure.",
      "Mechanism under review centers on receptor binding context and hormone-family structure-function relationships.",
    ],
    studySummaries: [
      {
        title: "Hormone-family structure",
        body:
          "Classic structure-function literature reviews the glycoprotein hormone family and places HCG in that broader biochemical class.",
      },
      {
        title: "Catalog review angle",
        body:
          "Product pages should use neutral identifiers and batch documentation rather than implying applied biological outcomes.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "Glycoprotein hormone structure review",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/2456242/",
        year: "1988",
      },
      {
        title: "HCG receptor review",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/1636261/",
        year: "1992",
      },
    ],
    tags: ["HCG", "Glycoprotein", "Endocrine"],
  },
  {
    slug: "nad-plus-research-notes",
    title: "NAD+ Research Notes",
    summary:
      "A literature summary for NAD+ as a redox cofactor topic in cellular metabolism research.",
    readTime: "8 min read",
    category: "Cellular Research",
    relatedProductSkus: ["NAD-1000MG"],
    researchFocus: [
      "Studied in relation to redox biology, mitochondrial function, and cellular energy pathways.",
      "Research literature often separates NAD+ itself from precursor compounds such as NR and NMN.",
      "Catalog copy should identify the material and avoid extrapolating from precursor literature unless sources match the material.",
    ],
    mechanismNotes: [
      "NAD+ is discussed as a pyridine nucleotide cofactor involved in redox cycling and multiple cellular processes.",
      "Mechanism under review includes mitochondrial signaling, DNA-repair-associated enzyme systems, and cellular stress response markers.",
    ],
    studySummaries: [
      {
        title: "Cofactor context",
        body:
          "Review literature frames NAD+ around intracellular cofactor biology rather than a single narrow pathway.",
      },
      {
        title: "Source matching",
        body:
          "When reviewing sources, note whether the paper covers NAD+, NADH, or precursor compounds, because those categories are not interchangeable.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "NAD+ compound review",
        publisher: "PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10692436/",
        year: "2023",
      },
      {
        title: "NAD+ systematic review",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/37971292/",
        year: "2023",
      },
    ],
    tags: ["NAD+", "Cofactor", "Mitochondrial"],
  },
  {
    slug: "retatrutide-research-notes",
    title: "Retatrutide Research Notes",
    summary:
      "A source-backed overview of retatrutide as a multi-receptor incretin research topic.",
    readTime: "8 min read",
    category: "Metabolic Research",
    relatedProductSkus: ["RETATRUTIDE-20MG", "RETATRUTIDE-30MG"],
    researchFocus: [
      "Studied in relation to GLP-1, GIP, and glucagon receptor signaling.",
      "Research literature focuses on multi-receptor pharmacology and metabolic-marker study design.",
      "Catalog language should stay limited to identity, receptor class, and source summaries.",
    ],
    mechanismNotes: [
      "Retatrutide is discussed as a triple-receptor agonist topic in incretin-related literature.",
      "Mechanism under review includes the relationship between receptor balance, signaling bias, and metabolic-marker endpoints.",
    ],
    studySummaries: [
      {
        title: "Multi-receptor profile",
        body:
          "Primary literature frames retatrutide around three receptor systems rather than a single GLP-1 pathway.",
      },
      {
        title: "Research-page boundary",
        body:
          "Public notes should summarize receptor class and study design without translating findings into buyer-facing outcome claims.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "Retatrutide phase 2 publication",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/37366315/",
        year: "2023",
      },
    ],
    tags: ["Retatrutide", "Incretin", "Metabolic"],
  },
  {
    slug: "tb-500-research-notes",
    title: "TB-500 Research Notes",
    summary:
      "A literature overview of TB-500 and thymosin beta-4 themes in actin and cellular-repair research.",
    readTime: "8 min read",
    category: "Tissue Repair Research",
    relatedProductSkus: ["TB500-10MG", "TB500-5MG"],
    researchFocus: [
      "Studied in relation to thymosin beta-4 sequence motifs, actin binding, and cellular movement models.",
      "Product education should separate TB-500 retail naming from thymosin beta-4 literature.",
      "Source notes should clarify whether a study is about TB-500, thymosin beta-4, or a related fragment.",
    ],
    mechanismNotes: [
      "Research literature discusses thymosin beta-4 around actin sequestration and cell-migration model systems.",
      "Mechanism under review includes how short sequence motifs relate to full thymosin beta-4 behavior.",
    ],
    studySummaries: [
      {
        title: "Actin-focused literature",
        body:
          "Reviews describe thymosin beta-4 as a multifunctional peptide in actin and cellular movement models.",
      },
      {
        title: "Catalog review angle",
        body:
          "A TB-500 page should clearly show SKU identity and avoid merging all thymosin beta-4 findings into one product claim.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "Thymosin beta-4 review",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/22074294/",
        year: "2012",
      },
      {
        title: "Thymosin beta-4 dermal model paper",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/23050815/",
        year: "2012",
      },
    ],
    tags: ["TB-500", "Thymosin beta-4", "Cellular"],
  },
  {
    slug: "semaglutide-research-notes",
    title: "Semaglutide Research Notes",
    summary:
      "A neutral overview of semaglutide as a GLP-1 receptor agonist topic in incretin research.",
    readTime: "7 min read",
    category: "Metabolic Research",
    relatedProductSkus: [],
    researchFocus: [
      "Studied in relation to GLP-1 receptor signaling and incretin pathway research.",
      "Useful source notes include receptor class, peptide engineering, and study design.",
      "This library-only topic provides context for comparing incretin-family literature.",
    ],
    mechanismNotes: [
      "Semaglutide is discussed as a GLP-1 receptor agonist with sequence engineering for longer activity in research literature.",
      "Mechanism under review includes receptor activation, incretin signaling, and metabolic-marker endpoints.",
    ],
    studySummaries: [
      {
        title: "GLP-1 class context",
        body:
          "General GLP-1 receptor literature provides the class framework for semaglutide and related incretin topics.",
      },
      {
        title: "Library role",
        body:
          "This entry helps readers distinguish single-receptor GLP-1 topics from dual and triple receptor topics.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "Semaglutide overview",
        publisher: "NCBI Bookshelf",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK603723/",
        year: "2024",
      },
      {
        title: "GLP-1 receptor agonist review",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/38093651/",
        year: "2023",
      },
    ],
    tags: ["Semaglutide", "GLP-1", "Incretin"],
  },
  {
    slug: "tirzepatide-research-notes",
    title: "Tirzepatide Research Notes",
    summary:
      "A research summary for tirzepatide as a dual GIP and GLP-1 receptor agonist topic.",
    readTime: "7 min read",
    category: "Metabolic Research",
    relatedProductSkus: [],
    researchFocus: [
      "Studied in relation to dual GIP and GLP-1 receptor signaling.",
      "Often compared with single-receptor GLP-1 topics in incretin research.",
      "Useful source review should keep receptor pharmacology separate from product claims.",
    ],
    mechanismNotes: [
      "Tirzepatide is discussed as a synthetic peptide that engages GIP and GLP-1 receptor pathways.",
      "Mechanism under review includes signaling balance, receptor bias, and metabolic-marker study design.",
    ],
    studySummaries: [
      {
        title: "Dual receptor profile",
        body:
          "Review literature places tirzepatide in the dual-receptor incretin category rather than a single GLP-1-only class.",
      },
      {
        title: "Comparison framework",
        body:
          "Research notes should identify comparator class and measured markers without converting findings into retail claims.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "Tirzepatide receptor review",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/33325008/",
        year: "2021",
      },
      {
        title: "Tirzepatide signaling paper",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/32730231/",
        year: "2020",
      },
    ],
    tags: ["Tirzepatide", "GIP", "GLP-1"],
  },
  {
    slug: "cjc-1295-research-notes",
    title: "CJC-1295 Research Notes",
    summary:
      "A source-backed overview of CJC-1295 as a long-acting GHRH analog topic.",
    readTime: "7 min read",
    category: "Secretagogue Research",
    relatedProductSkus: [],
    researchFocus: [
      "Studied in relation to growth-hormone-releasing hormone analog design.",
      "Research literature often tracks GH and IGF-1 markers as readouts of pathway engagement.",
      "Catalog notes should avoid implying applied outcomes and focus on structure and source context.",
    ],
    mechanismNotes: [
      "CJC-1295 is discussed as a modified GHRH analog designed for extended circulation in study settings.",
      "Mechanism under review includes albumin-binding strategy, GH-marker response, and IGF-1-marker response.",
    ],
    studySummaries: [
      {
        title: "Analog design",
        body:
          "Source literature describes structural modifications intended to extend the research window for GHRH analog study.",
      },
      {
        title: "Marker tracking",
        body:
          "Studies commonly report endocrine marker changes, which should be presented as source observations, not product promises.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "CJC-1295 pharmacology study",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/16352683/",
        year: "2006",
      },
      {
        title: "CJC-1295 marker study",
        publisher: "PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2787983/",
        year: "2009",
      },
    ],
    tags: ["CJC-1295", "GHRH", "Secretagogue"],
  },
  {
    slug: "ipamorelin-research-notes",
    title: "Ipamorelin Research Notes",
    summary:
      "A research-library summary of ipamorelin as a selective ghrelin-receptor secretagogue topic.",
    readTime: "7 min read",
    category: "Secretagogue Research",
    relatedProductSkus: [],
    researchFocus: [
      "Studied in relation to ghrelin receptor signaling and GH-marker research.",
      "Often discussed for selectivity compared with other secretagogue peptides.",
      "Useful source notes include receptor target, model type, and measured markers.",
    ],
    mechanismNotes: [
      "Ipamorelin is discussed as a pentapeptide that engages growth hormone secretagogue receptor pathways.",
      "Mechanism under review includes ghrelin receptor activity, selectivity, and endocrine marker tracking.",
    ],
    studySummaries: [
      {
        title: "Selectivity literature",
        body:
          "Early source literature describes ipamorelin as a selective secretagogue in comparison with broader peptide classes.",
      },
      {
        title: "Marker-based reading",
        body:
          "Catalog education should frame GH-marker changes as study observations rather than buyer-facing claims.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "Ipamorelin selectivity study",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/9849822/",
        year: "1998",
      },
      {
        title: "Ipamorelin marker-model paper",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/10496658/",
        year: "1999",
      },
    ],
    tags: ["Ipamorelin", "Ghrelin receptor", "Secretagogue"],
  },
  {
    slug: "tesamorelin-research-notes",
    title: "Tesamorelin Research Notes",
    summary:
      "A neutral summary of tesamorelin as a GHRH analog topic with marker and body-composition literature.",
    readTime: "7 min read",
    category: "Secretagogue Research",
    relatedProductSkus: [],
    researchFocus: [
      "Studied in relation to GHRH receptor signaling and endocrine marker changes.",
      "Source literature includes body-composition marker studies that require careful, non-promotional framing.",
      "Catalog education should identify source type and avoid translating findings into product outcomes.",
    ],
    mechanismNotes: [
      "Tesamorelin is discussed as a synthetic GHRH analog with pituitary receptor activity.",
      "Mechanism under review includes GH and IGF-1 marker pathways and metabolic-marker source context.",
    ],
    studySummaries: [
      {
        title: "GHRH analog context",
        body:
          "Review sources describe tesamorelin as a modified GHRH analog used to study endocrine marker pathways.",
      },
      {
        title: "Source language boundary",
        body:
          "Because many sources use clinical endpoints, storefront copy should summarize only pathway and study-design context.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "Tesamorelin development review",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/19243281/",
        year: "2009",
      },
      {
        title: "Tesamorelin GHRH analog study",
        publisher: "PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6766405/",
        year: "2019",
      },
    ],
    tags: ["Tesamorelin", "GHRH", "Secretagogue"],
  },
  {
    slug: "sermorelin-research-notes",
    title: "Sermorelin Research Notes",
    summary:
      "A literature overview of sermorelin as a GHRH analog topic in endocrine marker research.",
    readTime: "6 min read",
    category: "Secretagogue Research",
    relatedProductSkus: [],
    researchFocus: [
      "Studied in relation to GHRH analog response and pituitary-marker research.",
      "Often reviewed as a shorter GHRH analog than longer-acting modified compounds.",
      "Source notes should distinguish analog structure from applied use claims.",
    ],
    mechanismNotes: [
      "Sermorelin is discussed as a GHRH analog that engages pituitary signaling pathways.",
      "Mechanism under review includes GH-marker response, receptor context, and analog duration differences.",
    ],
    studySummaries: [
      {
        title: "Analog comparison",
        body:
          "Review sources compare sermorelin with other secretagogue and GHRH analog topics by structure and marker response.",
      },
      {
        title: "Catalog review angle",
        body:
          "A library page should keep discussion to receptor class, source type, and source observations.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "Sermorelin review article",
        publisher: "PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2699646/",
        year: "2009",
      },
      {
        title: "Growth hormone secretagogue review",
        publisher: "PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7108996/",
        year: "2020",
      },
    ],
    tags: ["Sermorelin", "GHRH", "Secretagogue"],
  },
  {
    slug: "pt-141-research-notes",
    title: "PT-141 Research Notes",
    summary:
      "A compliant overview of PT-141, also called bremelanotide, as a melanocortin receptor research topic.",
    readTime: "7 min read",
    category: "Melanocortin Research",
    relatedProductSkus: [],
    researchFocus: [
      "Studied in relation to melanocortin receptor signaling in central nervous system and skin-related pathways.",
      "Often discussed under bremelanotide naming in formal literature.",
      "Public copy should avoid applied outcome language and stay focused on receptor class and study design.",
    ],
    mechanismNotes: [
      "PT-141 is discussed as a melanocortin receptor agonist with central signaling study themes.",
      "Mechanism under review includes melanocortin receptor subtype activity and neuroendocrine signaling context.",
    ],
    studySummaries: [
      {
        title: "Melanocortin pathway context",
        body:
          "Review literature places PT-141 within melanocortin receptor research rather than a general peptide category.",
      },
      {
        title: "Naming alignment",
        body:
          "Source review should map PT-141 and bremelanotide names so article links remain clear to readers.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "PT-141 melanocortin review",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/12851303/",
        year: "2003",
      },
      {
        title: "Bremelanotide literature review",
        publisher: "PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8788464/",
        year: "2022",
      },
    ],
    tags: ["PT-141", "Bremelanotide", "Melanocortin"],
  },
  {
    slug: "melanotan-ii-research-notes",
    title: "Melanotan II Research Notes",
    summary:
      "A research-context overview of Melanotan II as an alpha-MSH analog and melanocortin receptor topic.",
    readTime: "7 min read",
    category: "Melanocortin Research",
    relatedProductSkus: [],
    researchFocus: [
      "Studied in relation to alpha-MSH analog chemistry and melanocortin receptor activity.",
      "Source review should include safety-context literature because public claims around this compound are common online.",
      "Catalog education should avoid appearance or performance claims and focus on source classification.",
    ],
    mechanismNotes: [
      "Melanotan II is discussed as a cyclic peptide analog of alpha-melanocyte-stimulating hormone.",
      "Mechanism under review includes melanocortin receptor activity and pigmentation-model signaling.",
    ],
    studySummaries: [
      {
        title: "Analog identity",
        body:
          "Early source literature describes Melanotan II through melanocortin receptor and pigmentation-model research.",
      },
      {
        title: "Source caution",
        body:
          "Public education should make clear that online promotional claims are not the same as controlled source records.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "Melanotan II overview",
        publisher: "DermNet",
        url: "https://dermnetnz.org/topics/melanotan-ii",
        year: "2023",
      },
      {
        title: "Melanotan II early evaluation",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/8637402/",
        year: "1996",
      },
    ],
    tags: ["Melanotan II", "Melanocortin", "Alpha-MSH"],
  },
  {
    slug: "epitalon-research-notes",
    title: "Epitalon Research Notes",
    summary:
      "A literature overview of Epitalon as a pineal tetrapeptide topic in cellular-marker research.",
    readTime: "7 min read",
    category: "Cellular Research",
    relatedProductSkus: [],
    researchFocus: [
      "Studied in relation to tetrapeptide biology, telomerase-marker systems, and cell-line models.",
      "Some literature uses longevity framing, so storefront language should remain neutral and model-specific.",
      "Useful source notes include model type, marker measured, and whether findings are in vitro or organism-level.",
    ],
    mechanismNotes: [
      "Epitalon is discussed as a short pineal tetrapeptide with telomerase-marker and gene-expression study themes.",
      "Mechanism under review includes transcriptional markers, telomere-associated assays, and model-specific endpoints.",
    ],
    studySummaries: [
      {
        title: "Tetrapeptide review",
        body:
          "Recent review literature summarizes Epitalon findings across cellular and model-system research.",
      },
      {
        title: "Marker interpretation",
        body:
          "Catalog pages should present telomerase or telomere notes as study markers, not product outcomes.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "Epitalon review",
        publisher: "PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11943447/",
        year: "2025",
      },
      {
        title: "Epitalon cell-line marker paper",
        publisher: "PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12411320/",
        year: "2025",
      },
    ],
    tags: ["Epitalon", "Tetrapeptide", "Cellular"],
  },
  {
    slug: "thymosin-alpha-1-research-notes",
    title: "Thymosin Alpha-1 Research Notes",
    summary:
      "A research summary for thymosin alpha-1 as a thymic peptide topic in immune-signaling literature.",
    readTime: "7 min read",
    category: "Cellular Research",
    relatedProductSkus: [],
    researchFocus: [
      "Studied in relation to thymic peptide biology and immune-signaling marker systems.",
      "Research literature spans broad model types, so public pages should stay source-specific.",
      "Useful notes include pathway category, model type, and whether a paper is review or original research.",
    ],
    mechanismNotes: [
      "Thymosin alpha-1 is discussed as a naturally occurring thymic peptide with immune-modulation study themes.",
      "Mechanism under review includes cytokine signaling, innate and adaptive immune-marker context, and tolerance-related pathways.",
    ],
    studySummaries: [
      {
        title: "Review literature",
        body:
          "Review sources summarize thymosin alpha-1 across immune-marker and host-response research areas.",
      },
      {
        title: "Catalog language boundary",
        body:
          "Product-style pages should not convert immune-marker findings into applied claims.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "Thymosin alpha-1 review",
        publisher: "PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7747025/",
        year: "2021",
      },
      {
        title: "Thymosin alpha-1 literature review",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/33362999/",
        year: "2020",
      },
    ],
    tags: ["Thymosin Alpha-1", "Thymic peptide", "Cellular"],
  },
  {
    slug: "dsip-research-notes",
    title: "DSIP Research Notes",
    summary:
      "A literature overview of delta sleep-inducing peptide as an unresolved neuropeptide research topic.",
    readTime: "6 min read",
    category: "Neuro Research",
    relatedProductSkus: [],
    researchFocus: [
      "Studied in relation to sleep-state markers and neuropeptide identity questions.",
      "Review literature notes unresolved questions around precursor identity and receptor mapping.",
      "Catalog copy should frame DSIP as a research topic with open literature questions.",
    ],
    mechanismNotes: [
      "DSIP is discussed as a nonapeptide associated with sleep-marker research and historical neuropeptide studies.",
      "Mechanism under review remains unsettled, including questions around endogenous source and receptor identity.",
    ],
    studySummaries: [
      {
        title: "Unresolved literature",
        body:
          "Modern review literature describes DSIP as an open research topic rather than a settled pathway system.",
      },
      {
        title: "Study-design caution",
        body:
          "Source notes should identify whether papers address chemistry, sleep-marker assays, or historical observations.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "DSIP unresolved-riddle review",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/16539679/",
        year: "2006",
      },
      {
        title: "DSIP historical review",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/6145137/",
        year: "1984",
      },
    ],
    tags: ["DSIP", "Neuropeptide", "Sleep markers"],
  },
  {
    slug: "mots-c-research-notes",
    title: "MOTS-c Research Notes",
    summary:
      "A source-backed overview of MOTS-c as a mitochondrial-derived peptide topic in metabolic stress research.",
    readTime: "7 min read",
    category: "Mitochondrial Research",
    relatedProductSkus: [],
    researchFocus: [
      "Studied in relation to mitochondrial-derived peptide signaling and cellular stress response.",
      "Research literature often discusses nuclear translocation and metabolic-marker regulation.",
      "Catalog education should identify MOTS-c as a mitochondrial-encoded peptide topic without product outcome claims.",
    ],
    mechanismNotes: [
      "MOTS-c is discussed as a peptide encoded within mitochondrial DNA with stress-response signaling themes.",
      "Mechanism under review includes nuclear translocation, gene-expression markers, and metabolic homeostasis models.",
    ],
    studySummaries: [
      {
        title: "Mitochondrial-derived peptide context",
        body:
          "Review literature places MOTS-c in the growing group of mitochondrial-derived signaling peptides.",
      },
      {
        title: "Marker-system review",
        body:
          "Source notes should distinguish cellular marker observations from claims about real-world outcomes.",
      },
    ],
    sources: [
      webMdPeptideOverview,
      {
        title: "MOTS-c review",
        publisher: "PMC",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9905433/",
        year: "2023",
      },
      {
        title: "MOTS-c nuclear translocation paper",
        publisher: "PubMed",
        url: "https://pubmed.ncbi.nlm.nih.gov/29983246/",
        year: "2018",
      },
    ],
    tags: ["MOTS-c", "Mitochondrial", "Metabolic"],
  },
];

export function getResearchArticle(slug: string) {
  return researchArticles.find((article) => article.slug === slug) ?? null;
}

export function getResearchArticlesForProduct(product: Product) {
  const sku = product.sku.toUpperCase();

  return researchArticles.filter((article) =>
    article.relatedProductSkus.some((relatedSku) => relatedSku.toUpperCase() === sku),
  );
}

export function getResearchCategories() {
  return Array.from(new Set(researchArticles.map((article) => article.category))).sort();
}

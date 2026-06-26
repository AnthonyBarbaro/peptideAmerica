import type { CatalogProductOverride } from "@/lib/catalog/overrides";

export const catalogOverrides = {
  "AOD9604-10MG": {
    images: ["/product_images/AOD9604-10MG.png"],
    // priceCents: 0,
  },
  "BPC157-10MG": {
    images: ["/product_images/BPC157-10MG.png"],
    // priceCents: 0,
  },
  "BPC157-5MG": {
    images: ["/product_images/BPC157-5MG.png"],
    // priceCents: 0,
  },
  "GHKCU-50MG": {
    images: ["/product_images/GHK-CU-50MG.png"],
    // priceCents: 0,
  },
  "GLOW-70MG": {
    images: ["/product_images/GLOW-70MG.png"],
    // priceCents: 0,
  },
  "HCG-10000IU": {
    images: ["/product_images/HCG-10000IU.png"],
    // priceCents: 0,
  },
  "NAD-1000MG": {
    images: ["/product_images/NAD+-1000MG.png"],
    // priceCents: 0,
  },
  "RETATRUTIDE-20MG": {
    images: ["/product_images/Retatrutide-20MG.png"],
    // priceCents: 0,
  },
  "RETATRUTIDE-30MG": {
    images: ["/product_images/Retatrutide-30MG.png"],
    // priceCents: 0,
  },
  "TB500-10MG": {
    images: ["/product_images/TB-500-10MG.png"],
    // priceCents: 0,
  },
  "TB500-5MG": {
    images: ["/product_images/TB-500-5MG.png"],
    // priceCents: 0,
  },
  "TESAMORELIN-10MG": {
    // priceCents: 0,
  },
} satisfies Record<string, CatalogProductOverride>;

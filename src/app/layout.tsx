import type { Metadata } from "next";
import "./globals.css";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { CartHydrator } from "@/components/cart-hydrator";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getCommerceProvider } from "@/lib/commerce/provider";
import { organizationJsonLd } from "@/lib/seo/jsonld";

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? "Peptide America";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://peptideamerica.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brandName} | Premium Peptide Catalog`,
    template: `%s | ${brandName}`,
  },
  description:
    "A premium ecommerce frontend for peptide catalog browsing, batch documentation, cart workflows, and COA lookup.",
  applicationName: brandName,
  openGraph: {
    title: `${brandName} | Premium Peptide Catalog`,
    description:
      "Batch-aware peptide ecommerce frontend with mock catalog data and clean integration adapters.",
    url: siteUrl,
    siteName: brandName,
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const commerce = getCommerceProvider();
  const products = await commerce.listProducts();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-950">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-slate-950 focus:shadow-xl"
        >
          Skip to content
        </a>
        <div className="bg-red-700 px-4 py-2 text-center text-sm font-semibold text-white">
          Research use only. Not for human or animal use.
        </div>
        <Header products={products} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <CartHydrator />
        <AccessibilityPanel />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </body>
    </html>
  );
}

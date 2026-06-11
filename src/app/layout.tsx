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
    "A premium peptide catalog for product browsing, batch documentation, cart workflows, and COA lookup.",
  applicationName: brandName,
  openGraph: {
    title: `${brandName} | Premium Peptide Catalog`,
    description:
      "Batch-aware peptide catalog with product browsing, COA lookup, and cart workflows.",
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
        <div className="bg-red-700 text-white">
          <div className="mx-auto flex min-h-8 max-w-7xl items-center gap-2 px-4 py-1.5 text-[13px] font-semibold leading-5 sm:px-6 lg:px-8">
            <span className="rounded-sm bg-white/15 px-2 py-0.5 text-[11px] uppercase tracking-[0.16em]">
              Research use only
            </span>
            <span>Not for human or animal use.</span>
          </div>
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

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { CartHydrator } from "@/components/cart-hydrator";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { complianceCopy } from "@/lib/compliance/copy";
import { getCommerceProvider } from "@/lib/commerce/provider";
import { organizationJsonLd } from "@/lib/seo/jsonld";

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? "Peptide America";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://peptideamerica.com";
const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
const metadataBase = new URL(siteUrl);
const ogImageUrl = new URL("/og-image.png", metadataBase);
const ogImageAlt = `${brandName} premium peptide research catalog`;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase,
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
    url: metadataBase,
    siteName: brandName,
    type: "website",
    images: [
      {
        url: ogImageUrl,
        secureUrl: ogImageUrl,
        type: "image/png",
        width: 1731,
        height: 909,
        alt: ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brandName} | Premium Peptide Catalog`,
    description:
      "Batch-aware peptide catalog with product browsing, COA lookup, and cart workflows.",
    images: [
      {
        url: ogImageUrl,
        secureUrl: ogImageUrl,
        type: "image/png",
        width: 1731,
        height: 909,
        alt: ogImageAlt,
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const commerce = getCommerceProvider();
  const products = await commerce.listProducts();
  const appContent = (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-slate-950 focus:shadow-xl"
      >
        Skip to content
      </a>
      <div className="border-b border-blue-900 bg-blue-950 text-white">
        <div className="mx-auto flex min-h-8 max-w-7xl items-center justify-center gap-x-2.5 gap-y-0.5 px-4 py-1.5 text-center text-[12px] font-semibold leading-tight sm:gap-x-3 sm:px-6 lg:px-8">
          <span className="shrink-0 font-black uppercase tracking-[0.16em]">
            {complianceCopy.banner.primary}
          </span>
          <span aria-hidden="true" className="hidden h-1 w-1 shrink-0 rounded-full bg-white/60 sm:block" />
          <span className="shrink-0">{complianceCopy.banner.secondary}</span>
          <span aria-hidden="true" className="hidden h-1 w-1 shrink-0 rounded-full bg-white/60 md:block" />
          <span className="hidden text-white/85 md:inline">
            {complianceCopy.banner.tertiary}
          </span>
        </div>
      </div>
      <Header products={products} clerkEnabled={clerkEnabled} />
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
    </>
  );

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-950">
        {clerkEnabled ? <ClerkProvider>{appContent}</ClerkProvider> : appContent}
      </body>
    </html>
  );
}

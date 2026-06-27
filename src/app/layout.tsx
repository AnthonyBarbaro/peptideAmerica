import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { CartHydrator } from "@/components/cart-hydrator";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getCommerceProvider } from "@/lib/commerce/provider";
import { organizationJsonLd } from "@/lib/seo/jsonld";

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME ?? "Peptide America";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://peptideamerica.com";
const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export const dynamic = "force-dynamic";

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
  const appContent = (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-slate-950 focus:shadow-xl"
      >
        Skip to content
      </a>
      <div className="bg-red-700 text-white">
        <div className="mx-auto flex h-6 max-w-7xl items-center gap-1.5 overflow-hidden px-4 text-[11px] font-bold leading-none sm:px-6 lg:px-8">
          <span className="shrink-0 uppercase tracking-[0.14em]">
            Research use only
          </span>
          <span aria-hidden="true" className="shrink-0 text-white/65">
            /
          </span>
          <span className="min-w-0 truncate">Not for human or animal use.</span>
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

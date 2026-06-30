import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ClipboardList,
  FileCheck2,
  LockKeyhole,
  PackageCheck,
} from "lucide-react";
import { CoaDocumentLink } from "@/components/coa-document-link";
import { ProductCard } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { RecentlyViewed } from "@/components/recently-viewed";
import {
  getProductResearchArea,
  getProductResearchDescription,
  getResearchAreaDetails,
} from "@/lib/catalog/research-areas";
import { complianceCopy } from "@/lib/compliance/copy";
import { getCommerceProvider } from "@/lib/commerce/provider";
import {
  formatCatalogPrice,
  formatDisplaySku,
  formatStockStatus,
  stockStatusBadgeClassName,
} from "@/lib/format";
import { getResearchArticlesForProduct } from "@/lib/research/articles";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/jsonld";

const fulfillmentHighlights = [
  {
    title: "Batch documentation",
    text: "Available COA and batch records are linked to the product.",
    icon: FileCheck2,
  },
  {
    title: "Account records",
    text: "Signed-in orders keep invoices and history together.",
    icon: ClipboardList,
  },
  {
    title: "Order tracking",
    text: "Fulfillment status stays tied to each order.",
    icon: PackageCheck,
  },
  {
    title: "Secure checkout",
    text: "Payment is handled by the hosted checkout processor.",
    icon: LockKeyhole,
  },
];

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCommerceProvider().getProduct(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const commerce = getCommerceProvider();
  const product = await commerce.getProduct(slug);

  if (!product) {
    notFound();
  }

  const catalog = await commerce.listProducts();
  const relatedProducts = catalog
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3);
  const researchArea = getProductResearchArea(product);
  const researchLabel = getResearchAreaDetails(researchArea).label;
  const linkedResearchArticles = getResearchArticlesForProduct(product);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-10 sm:px-6 lg:px-8 lg:pb-14">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-900"
      >
        <ArrowLeft aria-hidden="true" size={18} />
        Back to shop
      </Link>
      <section className="mt-8 grid gap-10 lg:grid-cols-[.95fr_1.05fr]">
        <ProductImage product={product} className="aspect-square rounded-lg border border-slate-200" />
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              {researchLabel}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${stockStatusBadgeClassName(product.stockStatus)}`}
            >
              {formatStockStatus(product.stockStatus)}
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-black text-slate-950">{product.name}</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {formatDisplaySku(product.sku)}
          </p>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            {getProductResearchDescription(product)}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Price
              </div>
              <div className="mt-1 text-2xl font-black text-slate-950">
                {formatCatalogPrice(product.priceCents)}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Size
              </div>
              <div className="mt-1 text-xl font-bold text-slate-950">{product.sizeLabel}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Stock
              </div>
              <div className="mt-1 text-xl font-bold text-slate-950">
                {formatStockStatus(product.stockStatus)}
              </div>
            </div>
          </div>
          <ProductPurchasePanel product={product} />
        </div>
      </section>

      <section className="mt-12 rounded-lg border border-slate-200 bg-slate-50 p-5 sm:p-6">
        <h2 className="text-lg font-black text-slate-950">What you get with each order</h2>
        <p className="mt-1 text-sm font-medium text-slate-600">
          Catalog workflow only. No claims about use, outcomes, or results.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {fulfillmentHighlights.map((item) => (
            <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-800">
                <item.icon aria-hidden="true" size={18} />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-950">{item.title}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {product.coaBatches.length > 0 ? (
        <section className="mt-12">
          <div className="rounded-lg border border-slate-200 bg-white p-5 lg:max-w-3xl">
            <h2 className="text-xl font-bold text-slate-950">COA and batch records</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {product.coaBatches.map((batch) => (
                <div key={batch.id} className="rounded-md bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-slate-950">{batch.batchNumber}</div>
                      <div className="mt-1 text-sm text-slate-500">{batch.labName}</div>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
                      {batch.status}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-slate-600">
                    Purity:{" "}
                    {batch.purityPercent
                      ? `${batch.purityPercent}%`
                      : complianceCopy.fallback.coaPending}
                  </div>
                  <CoaDocumentLink
                    documentUrl={batch.documentUrl}
                    sku={batch.sku}
                    batchNumber={batch.batchNumber}
                    className="mt-3"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {linkedResearchArticles.length > 0 ? (
        <section className="mt-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-900">
                Research notes
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Source-backed library links
              </h2>
            </div>
            <Link
              href="/research-library"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:text-blue-700"
            >
              Browse library
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {linkedResearchArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/research-library/${article.slug}`}
                className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-md bg-blue-50 p-2 text-blue-900">
                    <BookOpen aria-hidden="true" size={20} />
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {article.sources.length} source
                    {article.sources.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  {article.category}
                </div>
                <h3 className="mt-2 text-xl font-black text-slate-950">{article.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{article.summary}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-900 group-hover:text-blue-700">
                  Read research notes
                  <ArrowRight aria-hidden="true" size={17} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-14">
        <h2 className="text-2xl font-black text-slate-950">Related products</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <RecentlyViewed product={product} catalog={catalog} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Shop", href: "/shop" },
              { name: product.name, href: `/shop/${product.slug}` },
            ]),
          ),
        }}
      />
    </div>
  );
}

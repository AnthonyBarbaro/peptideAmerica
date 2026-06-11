import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, FileCheck2 } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import { ProductVisual } from "@/components/product-visual";
import { SpecAccordion } from "@/components/spec-accordion";
import { getCommerceProvider } from "@/lib/commerce/provider";
import { formatMoney, formatStockStatus } from "@/lib/format";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/jsonld";

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

  const relatedProducts = (await commerce.listProducts())
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-700"
      >
        <ArrowLeft aria-hidden="true" size={18} />
        Back to shop
      </Link>
      <section className="mt-8 grid gap-10 lg:grid-cols-[.95fr_1.05fr]">
        <ProductVisual product={product} className="aspect-square" />
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              {product.category}
            </span>
            <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
              {formatStockStatus(product.stockStatus)}
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-black text-slate-950">{product.name}</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">{product.sku}</p>
          <p className="mt-5 text-lg leading-8 text-slate-600">{product.researchOverview}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Price
              </div>
              <div className="mt-1 text-2xl font-black text-slate-950">
                {formatMoney(product.priceCents)}
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
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton product={product} className="sm:min-w-44" />
            <Link
              href="/coa"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
            >
              <FileCheck2 aria-hidden="true" size={18} />
              View COA records
            </Link>
          </div>
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle aria-hidden="true" className="mt-0.5 text-red-700" size={20} />
              <p className="text-sm font-medium leading-6 text-red-950">
                Research use only. Not for human or animal use. Catalog details are supplied
                for lab purchasing and batch review.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_.8fr]">
        <SpecAccordion product={product} />
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-950">COA and batch records</h2>
          <div className="mt-5 grid gap-3">
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
                  Purity: {batch.purityPercent ? `${batch.purityPercent}% sample` : "Pending"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-black text-slate-950">Related products</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
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

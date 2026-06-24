import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  FileCheck2,
  LockKeyhole,
  Microscope,
  PackageCheck,
  Search,
  ShieldCheck,
} from "lucide-react";
import { MotionReveal } from "@/components/motion-reveal";
import { ProductCard } from "@/components/product-card";
import { getCommerceProvider } from "@/lib/commerce/provider";

const valueCards = [
  {
    title: "Batch COA Access",
    text: "Review available batch documents alongside the catalog.",
    icon: FileCheck2,
  },
  {
    title: "Structured Catalog",
    text: "Clear categories, specs, stock states, and search-ready product data.",
    icon: ShieldCheck,
  },
  {
    title: "Order Tracking",
    text: "Follow order status from checkout through fulfillment.",
    icon: PackageCheck,
  },
  {
    title: "Hosted Payment Flow",
    text: "Payment details are handled through a hosted checkout experience.",
    icon: LockKeyhole,
  },
];

const documentationCards = [
  {
    title: "Search product records",
    text: "Find available documents by product name, SKU, or batch number.",
    icon: Search,
  },
  {
    title: "Match batch details",
    text: "Compare batch identifiers with the product record before checkout.",
    icon: PackageCheck,
  },
  {
    title: "Review COA files",
    text: "Open available COA records and keep documentation close to the catalog.",
    icon: FileCheck2,
  },
];

export default async function HomePage() {
  const commerce = getCommerceProvider();
  const products = await commerce.listProducts({ first: 3 });

  return (
    <>
      <section className="relative isolate overflow-hidden bg-slate-50 text-slate-950">
        <div className="absolute inset-y-0 right-0 -z-20 w-full sm:w-[66%] lg:w-[62%]">
          <Image
            src="/pa/hero-vials-centered.jpg"
            alt="Peptide America labeled research vials"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 62vw"
            className="h-full w-full object-cover object-[70%_50%] sm:object-contain sm:object-right-center"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(248,250,252,0.96)_0%,rgba(248,250,252,0.88)_48%,rgba(248,250,252,0.76)_100%)] sm:bg-[linear-gradient(90deg,rgba(248,250,252,1)_0%,rgba(248,250,252,0.98)_36%,rgba(248,250,252,0.78)_53%,rgba(248,250,252,0.22)_70%,rgba(248,250,252,0)_100%)]" />
        <div className="absolute inset-y-0 right-0 -z-10 hidden w-[62%] bg-[radial-gradient(circle_at_82%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_46%,rgba(248,250,252,0.84)_100%)] sm:block" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-slate-50 to-transparent" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="w-full min-w-0 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-700 sm:text-sm sm:tracking-[0.28em]">
              Research catalog for modern labs
            </p>
            <h1 className="mt-5 text-3xl font-black leading-tight tracking-normal text-blue-950 sm:text-6xl">
              Premium research peptides, organized for faster lab purchasing.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
              Browse a focused catalog, review batch COA records when available, and track orders
              from checkout through fulfillment in one streamlined storefront.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="subtle-shine group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-red-950/30 hover:bg-red-500 sm:w-auto"
              >
                Shop research catalog
                <ArrowRight aria-hidden="true" size={18} className="transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/coa"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-slate-300 bg-white/75 px-6 py-3 text-sm font-bold text-blue-950 shadow-sm backdrop-blur hover:border-red-200 hover:bg-white sm:w-auto"
              >
                Browse COA records
              </Link>
            </div>
            <div className="mt-6 inline-flex max-w-full items-center gap-2 rounded-md border border-blue-950/10 bg-white/75 px-4 py-2 text-sm font-semibold text-blue-950 shadow-sm backdrop-blur">
              <Microscope aria-hidden="true" size={18} className="text-red-700" />
              Batch documentation and order tracking
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/quality" className="text-blue-900 underline-offset-4 hover:text-red-700 hover:underline">
                Quality documentation
              </Link>
              <Link href="/track-order" className="text-blue-900 underline-offset-4 hover:text-red-700 hover:underline">
                Track order
              </Link>
              <Link href="/partner-program" className="text-blue-900 underline-offset-4 hover:text-red-700 hover:underline">
                Partner program
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {valueCards.map((card, index) => (
            <MotionReveal key={card.title} delay={index * 0.06}>
              <div className="h-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-red-100 hover:shadow-lg">
                <card.icon aria-hidden="true" className="text-red-600" size={28} />
                <h2 className="mt-4 text-lg font-bold text-slate-950">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.text}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
              Featured catalog
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Built for clean evaluation</h2>
          </div>
          <Link href="/shop" className="text-sm font-bold text-red-700 hover:text-red-600">
            View all products
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-950">Catalog is being updated</h3>
            <p className="mt-2 text-sm text-slate-600">
              Product listings are temporarily unavailable. Please check back soon.
            </p>
          </div>
        ) : null}
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
              Batch documentation
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Find available COA records before checkout.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Product records, batch identifiers, and available COA files stay close
              together so research teams can review documentation without digging.
            </p>
            <Link
              href="/coa"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Browse COA records
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {documentationCards.map((card) => (
              <div
                key={card.title}
                className="h-full rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:border-red-100 hover:shadow-lg"
              >
                <div className="grid h-10 w-10 place-items-center rounded-md bg-red-600 text-white">
                  <card.icon aria-hidden="true" size={20} />
                </div>
                <h3 className="mt-4 text-base font-black text-slate-950">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

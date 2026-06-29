import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FlaskConical,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { FeaturedProductRail } from "@/components/featured-product-rail";
import { MotionReveal } from "@/components/motion-reveal";
import { getCommerceProvider } from "@/lib/commerce/provider";

const showPartnerAccessSection = false;

const valueCards = [
  {
    title: "COA-Backed Records",
    text: "Review published supplier documents directly from the catalog workflow.",
    icon: FileCheck2,
  },
  {
    title: "Clean Catalog Data",
    text: "Product names, SKUs, sizes, pricing, and stock states stay organized.",
    icon: ShieldCheck,
  },
  {
    title: "Tracked Order Flow",
    text: "Orders are logged for account history, tracking, and fulfillment updates.",
    icon: PackageCheck,
  },
  {
    title: "Hosted Checkout",
    text: "Payment details stay outside the storefront and inside the processor flow.",
    icon: LockKeyhole,
  },
];

const orderingSteps = [
  {
    title: "Live stock status",
    text: "See in-stock, low-stock, and unavailable items before building a cart.",
  },
  {
    title: "COA access",
    text: "Open available documents from the catalog or COA library.",
  },
  {
    title: "Checkout handoff",
    text: "Payment details stay inside the processor flow, not the storefront.",
  },
  {
    title: "Order history",
    text: "Signed-in accounts keep tracking, invoices, and status updates together.",
  },
];

const qualityCards = [
  {
    title: "COA Library",
    text: "Documents organized by product, SKU, batch, and lab.",
    icon: FileCheck2,
  },
  {
    title: "Catalog Controls",
    text: "Pricing, imagery, copy, and stock stay aligned.",
    icon: ClipboardCheck,
  },
  {
    title: "Product Images",
    text: "Branded visuals stay consistent across cards and pages.",
    icon: FlaskConical,
  },
  {
    title: "Account Orders",
    text: "Signed-in buyers can review history and invoices.",
    icon: ShieldCheck,
  },
  {
    title: "Tracking Updates",
    text: "Fulfillment events stay tied to each order.",
    icon: PackageCheck,
  },
  {
    title: "Clean Checkout",
    text: "Payment stays inside the processor flow.",
    icon: LockKeyhole,
  },
];

export default async function HomePage() {
  const commerce = getCommerceProvider();
  const products = await commerce.listProducts({ first: 5 });

  return (
    <>
      <section className="relative isolate overflow-hidden bg-white text-slate-950">
        <div className="absolute inset-y-0 right-0 -z-20 hidden w-[64%] sm:block">
          <Image
            src="/pa/hero-vials-centered.jpg"
            alt="Peptide America labeled research vials"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 62vw"
            className="h-full w-full object-contain object-right-center"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(242,247,251,0.98)_100%)] sm:bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_34%,rgba(255,255,255,0.9)_48%,rgba(255,255,255,0.36)_70%,rgba(255,255,255,0)_100%)]" />
        <div className="absolute inset-y-0 left-0 -z-10 w-full opacity-80 [background-image:radial-gradient(circle_at_18%_18%,rgba(0,75,147,0.08),transparent_28%),radial-gradient(circle_at_74%_70%,rgba(220,38,38,0.08),transparent_26%)]" />
        <div className="mx-auto grid min-h-[calc(100svh-7rem)] max-w-7xl items-center gap-8 px-4 py-12 sm:min-h-[680px] sm:px-6 sm:py-18 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="w-full min-w-0 max-w-2xl">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-3.5 py-2 text-xs font-black uppercase tracking-[0.12em] text-blue-900 shadow-sm">
              <ShieldCheck aria-hidden="true" size={15} className="shrink-0 text-blue-800" />
              Documentation-first research catalog
            </div>
            <h1 className="mt-5 text-[2.55rem] font-black leading-[1.02] tracking-normal text-blue-950 sm:text-6xl lg:text-[4.4rem]">
              Premium peptides with cleaner catalog, COA, and order workflows.
            </h1>
            <p className="mt-6 max-w-xl text-base font-medium leading-7 text-slate-700 sm:text-lg sm:leading-8">
              Browse product records, review available supplier documents, and keep cart,
              account, fulfillment, and invoice history moving through one focused storefront.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="subtle-shine group inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(100deg,#172554,#1d4ed8)] px-7 py-3 text-sm font-black text-white shadow-xl shadow-blue-950/25 transition hover:-translate-y-0.5 sm:w-auto"
              >
                View products
                <ArrowRight aria-hidden="true" size={18} className="transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/coa"
                className="inline-flex min-h-13 w-full items-center justify-center rounded-lg border border-blue-100 bg-white/85 px-7 py-3 text-sm font-black text-blue-950 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white sm:w-auto"
              >
                Browse COA library
              </Link>
            </div>
          </div>
          <div className="relative sm:hidden">
            <Image
              src="/pa/hero-vials-centered.jpg"
              alt="Peptide America labeled research vials"
              width={831}
              height={780}
              priority
              className="h-auto w-full rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-blue-950/10"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
          {valueCards.map((card, index) => (
            <MotionReveal key={card.title} delay={index * 0.06}>
              <div className="h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg sm:p-5">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-800 sm:h-11 sm:w-11">
                  <card.icon aria-hidden="true" size={20} />
                </div>
                <h2 className="mt-3 text-sm font-bold leading-snug text-slate-950 sm:mt-4 sm:text-lg">
                  {card.title}
                </h2>
                <p className="mt-1.5 text-xs leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">
                  {card.text}
                </p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-900">
              Product catalog
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              The Peptide America line.
            </h2>
            <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-slate-600">
              Clean product cards, simple category labels, clear stock states, and available
              documentation close to the product record.
            </p>
          </div>
          <Link href="/shop" className="text-sm font-bold text-blue-900 hover:text-blue-700">
            View all products
          </Link>
        </div>
        <FeaturedProductRail products={products} />
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
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-900">
              Buying workflow
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              Everything needed before checkout.
            </h2>
            <p className="mt-4 text-base font-medium leading-7 text-slate-600">
              Product cards, documents, checkout, and order records are organized so
              buyers can move through the catalog without hunting for basics.
            </p>
            </div>
            <Link href="/my-account" className="text-sm font-bold text-blue-900 hover:text-blue-700">
              View account
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {orderingSteps.map((item, index) => (
              <MotionReveal key={item.title} delay={index * 0.06}>
                <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-xs font-black text-blue-800 ring-1 ring-blue-100">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-sm font-black leading-snug text-slate-950 sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs font-medium leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">
                    {item.text}
                  </p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="quality" className="bg-blue-950">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
              Quality workflow
            </p>
            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Research-grade presentation with documentation close by.
            </h2>
            <p className="mt-4 text-base font-medium leading-7 text-blue-100/80">
              Catalog, COA, image, order, and account data are organized so the store
              feels polished on the front end and manageable in the backend.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {qualityCards.map((card, index) => (
              <MotionReveal key={card.title} delay={index * 0.04}>
                <div className="h-full rounded-xl border border-white/10 bg-white/[0.055] p-4 transition hover:border-white/20 hover:bg-white/[0.075] sm:p-5">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-800/80 text-white sm:h-10 sm:w-10">
                    <card.icon aria-hidden="true" size={19} />
                  </div>
                  <h3 className="mt-3 text-sm font-black leading-snug text-white sm:text-base">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-xs font-medium leading-5 text-blue-100/75 sm:text-sm sm:leading-6">
                    {card.text}
                  </p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {showPartnerAccessSection ? (
        <section className="bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-900">
                Partner access
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
                Built for buyers who need organized records.
              </h2>
              <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600">
                Account access, order history, COA lookup, pricing controls, product imagery,
                and fulfillment tracking are built to work together as the catalog goes live.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/partner-program"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-950 px-5 py-2 text-sm font-black text-white shadow-lg shadow-blue-950/15 transition hover:bg-blue-900"
                >
                  Partner program
                </Link>
                <Link
                  href="/my-account"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-black text-blue-950 transition hover:border-blue-200"
                >
                  Account dashboard
                </Link>
              </div>
            </div>
            <div className="grid gap-3">
              {[
                "Product prices and images managed from backend records",
                "Order, invoice, and tracking history organized for customers",
                "COA documents searchable by SKU, batch, product, and lab",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <CheckCircle2 aria-hidden="true" size={20} className="mt-0.5 shrink-0 text-blue-700" />
                  <p className="text-sm font-bold leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

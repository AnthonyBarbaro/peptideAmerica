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
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { MotionReveal } from "@/components/motion-reveal";
import { ProductCard } from "@/components/product-card";
import { getCommerceProvider } from "@/lib/commerce/provider";

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

const trustItems = [
  "99%+ purity documentation",
  "COA with published products",
  "Batch-level organization",
  "Premium vial presentation",
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

const orderingSteps = [
  {
    step: "01",
    title: "Browse the catalog",
    text: "Compare catalog cards, size labels, stock status, and available documentation before adding items.",
  },
  {
    step: "02",
    title: "Review documentation",
    text: "Open available COA files, product identifiers, and batch details before moving forward.",
  },
  {
    step: "03",
    title: "Track fulfillment",
    text: "Keep order status, tracking information, and invoice history close to your account.",
  },
];

const qualityCards = [
  {
    title: "Published document library",
    text: "COA files live in one searchable library with product, SKU, batch, and lab fields.",
    icon: FileCheck2,
  },
  {
    title: "SKU-level catalog controls",
    text: "Product pricing, imagery, and page copy stay consistent across every catalog card.",
    icon: ClipboardCheck,
  },
  {
    title: "Consistent vial presentation",
    text: "Product visuals use one branded system across cards and detail pages for a cleaner shopping flow.",
    icon: FlaskConical,
  },
  {
    title: "Account-ready commerce",
    text: "Signed-in buyers can return to order history, tracking details, and invoices.",
    icon: ShieldCheck,
  },
  {
    title: "Fulfillment event trail",
    text: "Status updates are organized around the order so customers can follow progress.",
    icon: PackageCheck,
  },
  {
    title: "Lean checkout surface",
    text: "Checkout stays focused, polished, and connected to the account experience.",
    icon: LockKeyhole,
  },
];

const marketingStats = [
  {
    value: "99%+",
    label: "Purity documentation shown where supplier COA records are published",
  },
  {
    value: "COA",
    label: "Product documents organized by SKU, batch, and lab",
  },
  {
    value: "Batch",
    label: "Lot-level records kept close to product pages",
  },
  {
    value: "Premium",
    label: "Clean vial visuals and branded product presentation",
  },
];

export default async function HomePage() {
  const commerce = getCommerceProvider();
  const products = await commerce.listProducts({ first: 3 });

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
              <ShieldCheck aria-hidden="true" size={15} className="shrink-0 text-red-700" />
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
                className="subtle-shine group inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(100deg,#dc2626,#b91c1c)] px-7 py-3 text-sm font-black text-white shadow-xl shadow-red-950/25 transition hover:-translate-y-0.5 sm:w-auto"
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
            <div className="mt-6 grid gap-2 text-sm font-bold text-slate-700 sm:grid-cols-2">
              {trustItems.map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 aria-hidden="true" size={17} className="shrink-0 text-blue-700" />
                  {item}
                </span>
              ))}
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

      <section className="bg-[linear-gradient(100deg,#005ea8_0%,#004b93_58%,#0f172a_100%)] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-4 text-center text-xs font-black uppercase tracking-[0.14em] sm:px-6 lg:px-8">
          {trustItems.map((item, index) => (
            <span key={item} className="inline-flex items-center gap-3">
              {index > 0 ? <span className="hidden text-white/35 sm:inline">/</span> : null}
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {marketingStats.map((item, index) => (
            <MotionReveal key={item.label} delay={index * 0.05}>
              <div className="border-l-[3px] border-red-600 pl-5">
                <p className="text-3xl font-black tracking-normal text-blue-950 sm:text-4xl">
                  {item.value}
                </p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                  {item.label}
                </p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {valueCards.map((card, index) => (
            <MotionReveal key={card.title} delay={index * 0.06}>
              <div className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-800">
                  <card.icon aria-hidden="true" size={22} />
                </div>
                <h2 className="mt-4 text-lg font-bold text-slate-950">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.text}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
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
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
              Ordering flow
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              Three steps. Less guessing.
            </h2>
            <p className="mt-4 text-base font-medium leading-7 text-slate-600">
              The storefront is built around the path from product review to checkout,
              account history, and fulfillment updates.
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {orderingSteps.map((item, index) => (
              <MotionReveal key={item.title} delay={index * 0.06}>
                <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-6">
                  <span className="inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-xs font-black tracking-[0.12em] text-blue-800">
                    STEP {item.step}
                  </span>
                  <h3 className="mt-4 text-lg font-black text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
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
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {qualityCards.map((card, index) => (
              <MotionReveal key={card.title} delay={index * 0.04}>
                <div className="h-full rounded-xl border border-white/10 bg-white/[0.045] p-6">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-800/70 text-white">
                    <card.icon aria-hidden="true" size={21} />
                  </div>
                  <h3 className="mt-4 text-lg font-black text-white">{card.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-blue-100/75">
                    {card.text}
                  </p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
              Batch documentation
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              Search the COA library before checkout.
            </h2>
            <p className="mt-4 text-base font-medium leading-7 text-slate-600">
              Product records, batch identifiers, and available files stay close
              together so teams can review documentation without digging.
            </p>
            <Link
              href="/coa"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Browse COA records
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {documentationCards.map((card) => (
              <div
                key={card.title}
                className="h-full rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:border-red-100 hover:shadow-lg"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-red-600 text-white">
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

      <section className="bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
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
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-sm font-black text-white shadow-lg shadow-red-950/15 transition hover:bg-red-500"
              >
                Partner program
                <Sparkles aria-hidden="true" size={18} />
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
    </>
  );
}

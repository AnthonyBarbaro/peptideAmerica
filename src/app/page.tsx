import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import { PageView } from "@/components/analytics/page-view";
import { FeaturedProductRail } from "@/components/featured-product-rail";
import { MotionReveal } from "@/components/motion-reveal";
import { complianceCopy } from "@/lib/compliance/copy";
import { getCommerceProvider } from "@/lib/commerce/provider";

const showPartnerAccessSection = false;

const valueCards = [
  {
    title: "Documentation you can check",
    text: "When a certificate of analysis is available, it's linked right to the product.",
    icon: FileCheck2,
  },
  {
    title: "A catalog without guesswork",
    text: "Clear names, sizes, SKUs, pricing, and live stock on every record.",
    icon: ShieldCheck,
  },
  {
    title: "Orders, organized",
    text: "Track status, invoices, and order history together in your account.",
    icon: PackageCheck,
  },
  {
    title: "Checkout you can trust",
    text: "Payment is handled by a secure processor, never on our storefront.",
    icon: LockKeyhole,
  },
];

const orderingSteps = [
  {
    title: "Browse the catalog",
    text: "Search and filter research peptides by name, SKU, or category, with live stock status.",
  },
  {
    title: "Review the documentation",
    text: "Open any available COAs and batch records before adding to the cart.",
  },
  {
    title: "Check out securely",
    text: "Confirm the research-use attestation and pay through a secure hosted processor.",
  },
];

const closerPoints = [
  "Batch-linked certificates of analysis",
  "Live stock status and clear pricing",
  "Account order history and tracking",
];

export default async function HomePage() {
  const commerce = getCommerceProvider();
  const catalog = await commerce.listProducts();
  const products = catalog.slice(0, 5);
  const documentedProductCount = catalog.filter(
    (item) => item.coaBatches.length > 0,
  ).length;
  const coaDocumentCount = catalog.reduce(
    (total, item) => total + item.coaBatches.length,
    0,
  );
  const hasDocs = coaDocumentCount > 0;
  const coaStats = [
    { value: hasDocs ? String(coaDocumentCount) : "—", label: "COA documents on file" },
    { value: hasDocs ? String(documentedProductCount) : "—", label: "documented products" },
    { value: String(catalog.length), label: "catalog products" },
  ];

  return (
    <>
      <PageView event="view_home" />
      <section className="relative isolate overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-white to-slate-50 text-slate-950">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_12%_15%,rgba(29,78,216,0.07),transparent_32%),radial-gradient(circle_at_88%_12%,rgba(220,38,38,0.05),transparent_30%)]"
        />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8 lg:py-20">
          <div className="w-full min-w-0">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-3.5 py-2 text-xs font-black uppercase tracking-[0.12em] text-blue-900 shadow-sm">
              <ShieldCheck aria-hidden="true" size={15} className="shrink-0 text-blue-800" />
              Documentation-first research catalog
            </div>
            <h1 className="mt-5 text-balance text-[2.4rem] font-black leading-[1.04] tracking-[-0.02em] text-blue-950 sm:text-5xl lg:text-[3.6rem]">
              Research peptides, with the documentation to match.
            </h1>
            <p className="mt-6 max-w-xl text-base font-medium leading-7 text-slate-700 sm:text-lg sm:leading-8">
              A clean, research-only catalog with clear sizes, live stock, and available
              certificates of analysis next to every product. Find what you need and check
              out securely.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="subtle-shine group inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(100deg,#172554,#1d4ed8)] px-7 py-3 text-sm font-black text-white shadow-xl shadow-blue-950/25 transition hover:-translate-y-0.5 sm:w-auto"
              >
                Shop the catalog
                <ArrowRight aria-hidden="true" size={18} className="transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/coa"
                className="inline-flex min-h-13 w-full items-center justify-center rounded-lg border border-blue-100 bg-white/85 px-7 py-3 text-sm font-black text-blue-950 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white sm:w-auto"
              >
                Browse COA library
              </Link>
            </div>
            <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-slate-600">
              <li className="inline-flex items-center gap-1.5">
                <ShieldCheck aria-hidden="true" size={15} className="text-red-600" />
                Research use only
              </li>
              <li className="inline-flex items-center gap-1.5">
                <FileCheck2 aria-hidden="true" size={15} className="text-blue-700" />
                Batch-linked COAs
              </li>
              <li className="inline-flex items-center gap-1.5">
                <LockKeyhole aria-hidden="true" size={15} className="text-blue-700" />
                Secure hosted checkout
              </li>
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_50%_42%,rgba(29,78,216,0.16),transparent_70%)] blur-2xl"
            />
            <div className="hero-float overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-100 shadow-xl shadow-blue-950/10">
              <Image
                src="/pa/hero-vials-centered.jpg"
                alt="Peptide America research vials labeled research purposes only"
                width={831}
                height={780}
                priority
                sizes="(max-width: 1024px) 90vw, 540px"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="max-w-2xl text-2xl font-black text-slate-950 sm:text-3xl">
          A research catalog built for confident purchasing.
        </h2>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {valueCards.map((card, index) => (
            <MotionReveal key={card.title} delay={index * 0.06}>
              <div className="h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg sm:p-5">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-800 sm:h-11 sm:w-11">
                  <card.icon aria-hidden="true" size={20} />
                </div>
                <h3 className="mt-3 text-sm font-bold leading-snug text-slate-950 sm:mt-4 sm:text-base">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">
                  {card.text}
                </p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">
              Featured research peptides
            </h2>
            <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-slate-600">
              Clean product cards with clear sizes, live stock, and available documentation —
              easy to scan, easy to compare.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-900 transition hover:text-blue-700"
          >
            View all products
            <ArrowRight aria-hidden="true" size={16} />
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
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">
              How ordering works
            </h2>
            <p className="mt-3 text-base font-medium leading-7 text-slate-600">
              Three simple steps from catalog to checkout.
            </p>
          </div>
          <div className="mt-9 grid gap-4 sm:gap-6 lg:grid-cols-3">
            {orderingSteps.map((item, index) => (
              <MotionReveal key={item.title} delay={index * 0.08}>
                <div className="relative h-full rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                  <span className="text-4xl font-black tracking-tight text-blue-200 sm:text-5xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-lg font-black leading-snug text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                    {item.text}
                  </p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-12">
          <div>
            <h2 className="max-w-xl text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
              Documentation you can verify, not just trust.
            </h2>
            <p className="mt-4 max-w-lg text-base font-medium leading-7 text-slate-600">
              When a certificate of analysis is published for a batch, it&apos;s linked right
              to the product. Review the batch record before you order — no guesswork.
            </p>
            <dl className="mt-7 grid grid-cols-3 gap-4 border-y border-slate-200 py-5">
              {coaStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xl font-black text-blue-950 sm:text-3xl">{stat.value}</dt>
                  <dd className="mt-1 text-xs font-semibold leading-4 text-slate-500">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                What a COA shows
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Batch number", "Lab", "Tested date", "Purity result"].map((field) => (
                  <span
                    key={field}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    <CheckCircle2 aria-hidden="true" size={14} className="text-blue-700" />
                    {field}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/coa"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-950 px-7 text-sm font-black text-white shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-blue-900"
              >
                Browse COA library
                <ArrowRight aria-hidden="true" size={18} className="transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/quality"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-7 text-sm font-black text-blue-950 transition hover:-translate-y-0.5 hover:border-blue-200"
              >
                How we document
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -inset-5 -z-10 rounded-[2.25rem] bg-[radial-gradient(60%_60%_at_55%_40%,rgba(29,78,216,0.20),transparent_70%)] blur-2xl"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl shadow-blue-950/25">
              <Image
                src="/coa-cta.png"
                alt="Peptide America research vials labeled research purposes only"
                fill
                sizes="(max-width: 1024px) 90vw, 460px"
                className="object-cover"
              />
            </div>
            {hasDocs ? (
              <div className="absolute right-4 top-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 aria-hidden="true" size={16} />
                </span>
                <span className="text-xs font-bold leading-tight text-slate-900">
                  COA available
                  <span className="block text-[10px] font-semibold text-slate-500">
                    on listed batches
                  </span>
                </span>
              </div>
            ) : null}
            <Link
              href="/coa"
              className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur transition hover:border-blue-200"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-800">
                  <FileCheck2 aria-hidden="true" size={18} />
                </span>
                <span className="text-sm font-bold leading-tight text-slate-900">
                  See the documents
                  <span className="block text-xs font-medium text-slate-500">
                    Open the COA library
                  </span>
                </span>
              </span>
              <ArrowRight aria-hidden="true" size={18} className="shrink-0 text-slate-400" />
            </Link>
          </div>
        </div>
      </section>

      <section id="quality" className="bg-blue-950">
        <div className="lab-grid">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
            <div>
              <h2 className="max-w-xl text-3xl font-black leading-tight text-white sm:text-[2.6rem]">
                Everything a research purchaser needs, in one storefront.
              </h2>
              <p className="mt-4 max-w-lg text-base font-medium leading-7 text-blue-100/85">
                Catalog, certificates of analysis, account history, and order tracking — all
                organized and easy to find.
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-red-300">
                {complianceCopy.researchUseShort}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-red-600 px-7 text-sm font-black text-white shadow-lg shadow-red-950/30 transition hover:-translate-y-0.5 hover:bg-red-500"
                >
                  Shop research catalog
                  <ArrowRight aria-hidden="true" size={18} className="transition group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/coa"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-7 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  Browse COA library
                </Link>
              </div>
            </div>
            <ul className="grid gap-3">
              {closerPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-4"
                >
                  <CheckCircle2 aria-hidden="true" size={22} className="shrink-0 text-red-400" />
                  <span className="text-sm font-bold leading-6 text-white sm:text-base">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
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

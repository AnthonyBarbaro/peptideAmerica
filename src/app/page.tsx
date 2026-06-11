import Link from "next/link";
import { ArrowRight, FileCheck2, LockKeyhole, PackageCheck, ShieldCheck } from "lucide-react";
import { MotionReveal } from "@/components/motion-reveal";
import { ProductCard } from "@/components/product-card";
import { getCommerceProvider } from "@/lib/commerce/provider";

const valueCards = [
  {
    title: "Batch COA Access",
    text: "Surface batch documents beside product and catalog workflows.",
    icon: FileCheck2,
  },
  {
    title: "Structured Catalog",
    text: "Clear categories, specs, stock states, and search-ready product data.",
    icon: ShieldCheck,
  },
  {
    title: "Fast Fulfillment Ready",
    text: "Prepared for a later ShipStation handoff through WooCommerce.",
    icon: PackageCheck,
  },
  {
    title: "Secure Checkout Ready",
    text: "Built for a later compliant payment redirect instead of direct card capture.",
    icon: LockKeyhole,
  },
];

export default async function HomePage() {
  const commerce = getCommerceProvider();
  const products = await commerce.listProducts({ first: 3 });

  return (
    <>
      <section className="lab-grid relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.28),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0),rgba(15,23,42,0.94))]" />
        <svg
          className="molecule-drift absolute right-[-4rem] top-16 h-72 w-72 text-white/25 md:right-16 md:h-96 md:w-96"
          viewBox="0 0 320 320"
          aria-hidden="true"
        >
          <path
            d="M72 176 L135 98 L214 132 L249 222 L154 250 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
          />
          {[72, 135, 214, 249, 154].map((value, index) => (
            <circle
              key={value}
              cx={[72, 135, 214, 249, 154][index]}
              cy={[176, 98, 132, 222, 250][index]}
              r="15"
              fill="currentColor"
            />
          ))}
        </svg>
        <div className="relative mx-auto grid min-h-[74vh] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <MotionReveal>
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-200">
                PeptideAmerica.com
              </p>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-normal sm:text-6xl">
                Premium peptide ecommerce for batch-aware lab purchasing.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                A fast storefront with polished catalog browsing, COA lookup, cart
                workflows, and clean adapter boundaries for later commerce integrations.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-red-950/30 hover:bg-red-500"
                >
                  Shop catalog
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <Link
                  href="/coa"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/25 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
                >
                  View COA library
                </Link>
              </div>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.12}>
            <div className="rounded-lg border border-white/10 bg-white/8 p-5 shadow-2xl backdrop-blur">
              <div className="grid gap-3">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    className="rounded-md border border-white/10 bg-slate-950/60 p-4 transition hover:border-red-300/60 hover:bg-slate-900"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold">{product.name}</div>
                        <div className="mt-1 text-sm text-slate-300">{product.sku}</div>
                      </div>
                      <span className="rounded-full bg-red-600/20 px-3 py-1 text-xs font-semibold text-red-100">
                        COA
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {valueCards.map((card) => (
            <div key={card.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <card.icon aria-hidden="true" className="text-red-600" size={28} />
              <h2 className="mt-4 text-lg font-bold text-slate-950">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.text}</p>
            </div>
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
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">
              COA-first workflow
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Batch verification stays close to the catalog.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {["Search by SKU", "Select batch", "Review sample record"].map((item) => (
              <div key={item} className="rounded-lg bg-slate-50 p-5">
                <div className="text-sm font-bold text-slate-950">{item}</div>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div className="h-2 w-2/3 rounded-full bg-red-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

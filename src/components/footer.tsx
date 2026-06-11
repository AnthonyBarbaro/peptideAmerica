import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-slate-600 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <div className="text-base font-bold text-slate-950">Peptide America</div>
          <p className="mt-2 max-w-xl">
            A Phase 1 ecommerce frontend with mock catalog data, COA lookup, cart state,
            and clean integration points.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4" aria-label="Footer navigation">
          <Link href="/shop" className="font-medium hover:text-red-700">
            Shop
          </Link>
          <Link href="/coa" className="font-medium hover:text-red-700">
            COA
          </Link>
          <Link href="/cart" className="font-medium hover:text-red-700">
            Cart
          </Link>
        </nav>
      </div>
    </footer>
  );
}

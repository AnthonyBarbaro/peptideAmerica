import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-slate-600 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div>
          <div className="text-base font-bold text-slate-950">Peptide America</div>
          <p className="mt-2 max-w-xl">
            Premium catalog browsing, batch lookup, and responsive support.
          </p>
        </div>
        <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Footer navigation">
          {[
            ["/support", "Support"],
            ["/contact", "Contact Us"],
            ["/my-account", "My Account"],
            ["/shop", "Shop"],
            ["/coa", "COA"],
            ["/research-library", "Research Library"],
            ["/search", "Search"],
            ["/faq", "FAQ"],
            ["/policies/research-use-only", "Research Use Policy"],
            ["/policies/privacy", "Privacy Policy"],
            ["/policies/return-refund", "Return and Refund Policy"],
            ["/policies/shipping-returns", "Shipping and Delivery Policy"],
            ["/policies/terms", "Terms and Conditions"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="font-medium hover:text-red-700">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

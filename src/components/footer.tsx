import Image from "next/image";
import Link from "next/link";
import { CatalogUpdatesForm } from "@/components/newsletter/catalog-updates-form";

const footerSections = [
  {
    title: "Shop",
    links: [
      ["/shop", "Products"],
      ["/coa", "COA Library"],
      ["/quality", "Quality"],
      ["/research-library", "Research Library"],
      ["/search", "Search"],
    ],
  },
  {
    title: "Account",
    links: [
      ["/my-account", "My Account"],
      ["/track-order", "Track Order"],
      ["/partner-program", "Partner Program"],
    ],
  },
  {
    title: "Help",
    links: [
      ["/support", "Support"],
      ["/contact", "Contact Us"],
      ["/faq", "FAQ"],
    ],
  },
  {
    title: "Policies",
    links: [
      ["/policies/research-use-only", "Research Use"],
      ["/policies/privacy", "Privacy"],
      ["/policies/return-refund", "Returns"],
      ["/policies/shipping-returns", "Shipping"],
      ["/policies/terms", "Terms"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-600 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.35fr] lg:items-start">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:border-0 sm:bg-transparent sm:p-0">
          <Link
            href="/"
            className="relative block h-10 w-52 overflow-hidden"
            aria-label="Peptide America home"
          >
            <Image
              src="/pa/logo.png"
              alt=""
              fill
              sizes="208px"
              className="object-cover object-center scale-[1.45]"
            />
          </Link>
          <p className="mt-3 max-w-md text-sm font-medium leading-6 text-slate-600">
            Catalog browsing, COA lookup, account order history, and support links in one place.
          </p>
          <CatalogUpdatesForm />
        </div>
          <nav
            className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4"
            aria-label="Footer navigation"
          >
            {footerSections.map((section) => (
              <section
                key={section.title}
                className={section.title === "Policies" ? "col-span-2 sm:col-span-1" : ""}
              >
                <h2 className="text-xs font-black uppercase tracking-[0.14em] text-blue-950">
                  {section.title}
                </h2>
                <ul
                  className={`mt-3 grid gap-2.5 ${
                    section.title === "Policies" ? "grid-cols-2 sm:grid-cols-1" : ""
                  }`}
                >
                  {section.links.map(([href, label]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="inline-flex min-h-7 items-center text-sm font-semibold leading-5 text-slate-600 transition hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Peptide America.</p>
          <p>Secure account access, catalog support, and order records.</p>
        </div>
      </div>
    </footer>
  );
}

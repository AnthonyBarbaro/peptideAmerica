"use client";

import Link from "next/link";
import { FlaskConical, Menu, ShoppingCart, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { SearchDialog } from "@/components/search-dialog";
import { useCartStore } from "@/lib/cart-store";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/coa", label: "COA" },
];

type HeaderProps = {
  products: Product[];
};

export function Header({ products }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/92 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-red-600">
            <FlaskConical aria-hidden="true" size={21} />
          </span>
          <span>
            <span className="block text-base font-bold leading-5">Peptide America</span>
            <span className="block text-xs text-slate-300">PeptideAmerica.com</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-200 underline-offset-4 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <SearchDialog products={products} />
          <Link
            href="/cart"
            className="inline-flex min-h-10 items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            <ShoppingCart aria-hidden="true" size={18} />
            Cart
            <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
              {cartCount}
            </span>
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/15 p-2 md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {mobileOpen ? (
        <div className="border-t border-white/10 px-4 pb-4 md:hidden">
          <nav className="grid gap-2 py-3" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-3 text-sm font-medium text-slate-100 hover:bg-white/10"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="grid gap-2">
            <SearchDialog products={products} />
            <Link
              href="/cart"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-950"
              onClick={() => setMobileOpen(false)}
            >
              <ShoppingCart aria-hidden="true" size={18} />
              Cart ({cartCount})
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

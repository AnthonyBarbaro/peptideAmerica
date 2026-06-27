"use client";

import Image from "next/image";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, ReceiptText, ShoppingCart, UserRound, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { SearchDialog } from "@/components/search-dialog";
import { useCartStore } from "@/lib/cart-store";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/coa", label: "COA" },
  { href: "/research-library", label: "Library" },
];

type HeaderProps = {
  products: Product[];
  clerkEnabled: boolean;
};

function AccountControl({ clerkEnabled }: { clerkEnabled: boolean }) {
  if (!clerkEnabled) {
    return (
      <Link
        href="/my-account"
        className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
      >
        <UserRound aria-hidden="true" size={18} />
        Account
      </Link>
    );
  }

  return <ClerkAccountControl />;
}

function ClerkAccountControl() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="min-h-10 min-w-10 rounded-md border border-slate-200" />;
  }

  if (isSignedIn) {
    return (
      <div className="grid min-h-10 min-w-10 place-items-center rounded-md border border-slate-200">
        <AccountUserButton />
      </div>
    );
  }

  return (
    <SignInButton mode="modal">
      <button
        type="button"
        className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
      >
        <UserRound aria-hidden="true" size={18} />
        Sign in
      </button>
    </SignInButton>
  );
}

function MobileAccountControl({
  clerkEnabled,
  onNavigate,
}: {
  clerkEnabled: boolean;
  onNavigate?: () => void;
}) {
  if (!clerkEnabled) {
    return (
      <Link
        href="/my-account"
        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-slate-200 p-2 text-slate-800 transition hover:bg-slate-50"
        aria-label="My account"
        onClick={onNavigate}
      >
        <UserRound aria-hidden="true" size={20} />
      </Link>
    );
  }

  return <ClerkMobileAccountControl onNavigate={onNavigate} />;
}

function ClerkMobileAccountControl({ onNavigate }: { onNavigate?: () => void }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="min-h-10 min-w-10 rounded-md border border-slate-200" />;
  }

  if (isSignedIn) {
    return (
      <div className="grid min-h-10 min-w-10 place-items-center rounded-md border border-slate-200">
        <AccountUserButton />
      </div>
    );
  }

  return (
    <SignInButton mode="modal">
      <button
        type="button"
        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-slate-200 p-2 text-slate-800 transition hover:bg-slate-50"
        aria-label="Sign in"
        onClick={onNavigate}
      >
        <UserRound aria-hidden="true" size={20} />
      </button>
    </SignInButton>
  );
}

function AccountUserButton() {
  return (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Link
          href="/my-account"
          label="Orders & invoices"
          labelIcon={<ReceiptText aria-hidden="true" size={16} />}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}

export function Header({ products, clerkEnabled }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const items = useCartStore((state) => state.items);
  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 text-slate-950 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center">
          <span className="relative block h-10 w-[166px] shrink-0 overflow-hidden sm:h-11 sm:w-[210px]">
            <Image
              src="/pa/logo.png"
              alt="Peptide America"
              fill
              priority
              sizes="(max-width: 640px) 166px, 210px"
              className="object-cover object-center scale-[1.45]"
            />
          </span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-700 underline-offset-4 hover:text-red-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <SearchDialog products={products} />
          <AccountControl clerkEnabled={clerkEnabled} />
          <Link
            href="/cart"
            className="inline-flex min-h-10 items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-red-950/15 transition hover:bg-red-500"
          >
            <ShoppingCart aria-hidden="true" size={18} />
            Cart
            <span className="rounded-full bg-white px-2 py-0.5 text-xs text-red-700">
              {cartCount}
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-1.5 md:hidden">
          <MobileAccountControl clerkEnabled={clerkEnabled} />
          <Link
            href="/cart"
            className="relative inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-slate-200 p-2 text-slate-800 transition hover:bg-slate-50"
            aria-label={`Cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}
          >
            <ShoppingCart aria-hidden="true" size={20} />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[11px] font-bold leading-none text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-200 p-2 text-slate-800 transition hover:bg-slate-50"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id="mobile-navigation-drawer"
            className="absolute inset-x-0 top-full overflow-hidden border-t border-slate-200 bg-white shadow-2xl shadow-slate-950/12 md:hidden"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -18 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -14 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4">
              <div className="[&>button]:min-h-11 [&>button]:w-full [&>button]:justify-center [&>button]:rounded-lg">
                <SearchDialog products={products} />
              </div>
              <nav className="grid gap-2" aria-label="Mobile navigation">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + index * 0.035, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      className="flex min-h-12 items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-900 transition hover:bg-slate-100"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                      <ArrowIndicator />
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <Link
                href="/shop"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-black text-white"
                onClick={() => setMobileOpen(false)}
              >
                Shop catalog
                <ShoppingCart aria-hidden="true" size={18} />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function ArrowIndicator() {
  return (
    <span
      aria-hidden="true"
      className="grid h-8 w-8 place-items-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200"
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4">
        <path
          d="M7.5 4.5 12.5 10l-5 5.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </span>
  );
}

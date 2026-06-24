"use client";

import Image from "next/image";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, ReceiptText, ShoppingCart, UserRound, X } from "lucide-react";
import { useMemo, useState } from "react";
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
        className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
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
    return <div className="min-h-10 min-w-10 rounded-md border border-white/15" />;
  }

  if (isSignedIn) {
    return (
      <div className="grid min-h-10 min-w-10 place-items-center rounded-md border border-white/15">
        <AccountUserButton />
      </div>
    );
  }

  return (
    <SignInButton mode="modal">
      <button
        type="button"
        className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
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
        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-white/15 p-2 text-white transition hover:bg-white/10"
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
    return <div className="min-h-10 min-w-10 rounded-md border border-white/15" />;
  }

  if (isSignedIn) {
    return (
      <div className="grid min-h-10 min-w-10 place-items-center rounded-md border border-white/15">
        <AccountUserButton />
      </div>
    );
  }

  return (
    <SignInButton mode="modal">
      <button
        type="button"
        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-white/15 p-2 text-white transition hover:bg-white/10"
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
  const items = useCartStore((state) => state.items);
  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/92 text-white backdrop-blur">
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
              style={{
                filter:
                  "drop-shadow(0 1px 0 rgba(0,0,0,0.85)) drop-shadow(0 -1px 0 rgba(0,0,0,0.75)) drop-shadow(1px 0 0 rgba(0,0,0,0.75)) drop-shadow(-1px 0 0 rgba(0,0,0,0.75))",
              }}
            />
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
          <AccountControl clerkEnabled={clerkEnabled} />
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
        <div className="flex items-center gap-1.5 md:hidden">
          <MobileAccountControl clerkEnabled={clerkEnabled} />
          <Link
            href="/cart"
            className="relative inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-white/15 p-2 text-white transition hover:bg-white/10"
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
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/15 p-2"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
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
            <MobileAccountControl
              clerkEnabled={clerkEnabled}
              onNavigate={() => setMobileOpen(false)}
            />
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

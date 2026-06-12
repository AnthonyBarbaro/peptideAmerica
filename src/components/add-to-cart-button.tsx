"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { useCartStore } from "@/lib/cart-store";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
  label?: string;
};

export function AddToCartButton({
  product,
  className = "",
  label = "Add to cart",
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const disabled = product.stockStatus === "out_of_stock";

  return (
    <button
      type="button"
      disabled={disabled}
      className={`subtle-shine inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-950/20 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-slate-600 ${className}`}
      onClick={() => {
        addItem(product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
    >
      <ShoppingCart aria-hidden="true" size={18} />
      {disabled ? "Unavailable" : added ? "Added" : label}
    </button>
  );
}

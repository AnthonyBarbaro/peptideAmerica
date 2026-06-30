"use client";

import { Ban, Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/commerce/types";
import { trackEvent } from "@/lib/analytics";
import { useCartStore } from "@/lib/cart-store";
import { getCatalogPriceCents } from "@/lib/format";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
  label?: string;
  iconOnly?: boolean;
};

export function AddToCartButton({
  product,
  className = "",
  label = "Add to cart",
  iconOnly = false,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const disabled = product.stockStatus === "out_of_stock";
  const buttonLabel = disabled ? "Unavailable" : added ? "Added to cart" : label;
  const Icon = disabled ? Ban : added ? Check : ShoppingCart;
  const sizeClassName = iconOnly ? "min-h-11 w-11 px-0 py-0" : "min-h-11 px-4 py-2";
  const cartProduct = {
    ...product,
    priceCents: getCatalogPriceCents(product.priceCents),
  };

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={iconOnly ? buttonLabel : undefined}
      title={iconOnly ? buttonLabel : undefined}
      className={`subtle-shine inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition disabled:cursor-not-allowed disabled:bg-slate-600 disabled:shadow-none ${
        added ? "bg-emerald-600 hover:bg-emerald-600" : "bg-blue-950 hover:bg-blue-900"
      } ${sizeClassName} ${className}`}
      onClick={() => {
        addItem(cartProduct);
        setAdded(true);
        trackEvent("add_to_cart", {
          sku: product.sku,
          name: product.name,
          priceCents: cartProduct.priceCents,
        });
        window.setTimeout(() => setAdded(false), 1400);
      }}
    >
      <Icon aria-hidden="true" size={iconOnly ? 20 : 18} strokeWidth={iconOnly ? 2.6 : 2} />
      {iconOnly ? <span className="sr-only">{buttonLabel}</span> : buttonLabel}
    </button>
  );
}

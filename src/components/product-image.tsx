"use client";

import { useState } from "react";

import type { Product } from "@/lib/commerce/types";

type ProductImageProps = {
  product: Product;
  className?: string;
  /** Override the default surface so cards can use a per-product tint. */
  surfaceClassName?: string;
};

export function ProductImage({
  product,
  className = "",
  surfaceClassName = "bg-gradient-to-b from-white via-slate-50 to-slate-100",
}: ProductImageProps) {
  const imageSrc = product.images?.[0]?.trim();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(imageSrc && imageSrc !== failedSrc);

  return (
    <div
      className={`relative overflow-hidden ${surfaceClassName} ${className}`}
      aria-label={`${product.name} product image`}
    >
      {showImage ? (
        // Directus assets are served through the storefront proxy or Directus URL at runtime.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-contain p-1.5 transition duration-300 group-hover:scale-[1.03] sm:p-3"
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(imageSrc ?? null)}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 border border-dashed border-slate-300 bg-slate-50 px-4 text-center">
          <div className="text-sm font-bold text-slate-900">Image pending</div>
          <div className="text-xs font-medium text-slate-500">{product.sku}</div>
        </div>
      )}
    </div>
  );
}

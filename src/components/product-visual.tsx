import type { Product } from "@/lib/commerce/types";

const visualStyles: Record<string, string> = {
  "pa-research-peptide-alpha":
    "radial-gradient(circle at 30% 25%, rgba(255,255,255,.36), transparent 22%), linear-gradient(135deg, #14345f, #07111f 62%, #b91c1c)",
  "pa-research-peptide-beta":
    "radial-gradient(circle at 72% 22%, rgba(255,255,255,.3), transparent 20%), linear-gradient(135deg, #0f2a48, #101827 58%, #dc2626)",
  "pa-research-peptide-gamma":
    "radial-gradient(circle at 26% 74%, rgba(255,255,255,.28), transparent 18%), linear-gradient(135deg, #122c45, #06111d 56%, #991b1b)",
  "pa-research-peptide-delta":
    "radial-gradient(circle at 70% 72%, rgba(255,255,255,.28), transparent 18%), linear-gradient(135deg, #172554, #0b1120 58%, #7f1d1d)",
};

type ProductVisualProps = {
  product: Product;
  className?: string;
};

export function ProductVisual({ product, className = "" }: ProductVisualProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-white/10 bg-slate-950 ${className}`}
      style={{ background: visualStyles[product.slug] ?? visualStyles["pa-research-peptide-alpha"] }}
      aria-hidden="true"
    >
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 300 220">
        <defs>
          <pattern id={`grid-${product.id}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="white" strokeOpacity="0.28" />
          </pattern>
        </defs>
        <rect width="300" height="220" fill={`url(#grid-${product.id})`} />
        <path
          d="M40 150 C80 80 120 190 165 116 S232 70 265 124"
          fill="none"
          stroke="white"
          strokeOpacity="0.6"
          strokeWidth="4"
        />
        <circle cx="58" cy="132" r="10" fill="white" fillOpacity="0.72" />
        <circle cx="139" cy="145" r="8" fill="#ef4444" fillOpacity="0.82" />
        <circle cx="207" cy="92" r="11" fill="white" fillOpacity="0.72" />
        <circle cx="253" cy="120" r="7" fill="#ef4444" fillOpacity="0.82" />
      </svg>
      <div className="absolute inset-x-4 bottom-4 rounded-md border border-white/10 bg-slate-950/70 p-3 backdrop-blur">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-red-200">
          {product.sku}
        </div>
        <div className="mt-1 text-sm font-semibold text-white">{product.sizeLabel}</div>
      </div>
    </div>
  );
}

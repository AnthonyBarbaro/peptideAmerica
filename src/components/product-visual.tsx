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
  const primaryImage = product.images[0];
  const labelName = getLabelName(product);
  const labelSize = getLabelSize(product);

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-white/10 bg-slate-950 ${className}`}
      style={{ background: visualStyles[product.slug] ?? visualStyles["pa-research-peptide-alpha"] }}
      aria-label={`${product.name} product image`}
    >
      {primaryImage ? (
        // Directus asset URLs are runtime-configured and should render without Next image domain coupling.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={primaryImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <GeneratedVialLabel product={product} labelName={labelName} labelSize={labelSize} />
      )}
      {primaryImage ? <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" /> : null}
      {primaryImage ? (
        <div className="absolute inset-x-4 bottom-4 rounded-md border border-white/10 bg-slate-950/70 p-3 backdrop-blur">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-red-200">
            {product.sku}
          </div>
          <div className="mt-1 text-sm font-semibold text-white">{product.sizeLabel}</div>
        </div>
      ) : null}
    </div>
  );
}

type GeneratedVialLabelProps = {
  product: Product;
  labelName: string;
  labelSize: string;
};

function GeneratedVialLabel({ product, labelName, labelSize }: GeneratedVialLabelProps) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_52%_18%,rgba(255,255,255,0.95),rgba(243,247,251,0.88)_34%,rgba(209,220,232,0.72)_66%,rgba(255,255,255,0.92))]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.08),transparent_22%,transparent_76%,rgba(15,23,42,0.08))]" />
      <div className="absolute left-1/2 top-[4%] h-[18%] w-[38%] -translate-x-1/2 rounded-t-[999px] rounded-b-lg border border-slate-300/80 bg-[linear-gradient(180deg,#f8fafc,#cbd5e1_48%,#f8fafc)] shadow-[0_10px_28px_rgba(15,23,42,0.18)]" />
      <div className="absolute left-1/2 top-[15%] h-[78%] w-[58%] -translate-x-1/2 rounded-t-[22%] rounded-b-[10%] border border-slate-300/70 bg-[linear-gradient(90deg,rgba(255,255,255,0.55),rgba(255,255,255,0.86)_22%,rgba(255,255,255,0.64)_78%,rgba(226,232,240,0.36))] shadow-[0_26px_50px_rgba(15,23,42,0.22)] backdrop-blur">
        <div className="absolute inset-x-[8%] top-[18%] overflow-hidden rounded-md border border-slate-200 bg-white/90 shadow-sm">
          <div className="absolute inset-0 opacity-[0.07]">
            <div className="grid h-full grid-cols-3 gap-3 p-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="rounded-md border border-slate-700" />
              ))}
            </div>
          </div>
          <div className="relative flex min-h-[54%] flex-col items-center px-3 py-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/pa/logo.png"
              alt=""
              className="mb-2 h-7 max-w-[78%] object-contain drop-shadow-[0_1px_0_rgba(255,255,255,0.85)]"
              loading="lazy"
            />
            <div
              className="max-w-full break-words text-center text-xl font-semibold leading-none text-[#0a6484] sm:text-2xl"
              title={labelName}
            >
              {labelName}
            </div>
            <div className="mt-1 text-base font-medium leading-none text-[#0a6484] sm:text-lg">
              {labelSize}
            </div>
          </div>
          <div className="relative h-8 bg-[#155fa7]" aria-hidden="true" />
        </div>
        <div className="absolute inset-x-[18%] bottom-[8%] h-[8%] rounded-full bg-slate-300/40 blur-sm" />
      </div>
      <div className="absolute inset-x-4 bottom-4 rounded-md border border-white/70 bg-white/72 p-3 shadow-sm backdrop-blur">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
          {product.sku}
        </div>
        <div className="mt-1 text-sm font-semibold text-slate-950">{product.name}</div>
      </div>
    </div>
  );
}

function getLabelName(product: Product) {
  const sizeLabel = product.sizeLabel.trim();

  if (!sizeLabel) {
    return product.name.trim();
  }

  const escapedSize = sizeLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const withoutSize = product.name.replace(new RegExp(`\\s*${escapedSize}\\s*$`, "i"), "").trim();

  return withoutSize || product.name.trim();
}

function getLabelSize(product: Product) {
  const sizeLabel = product.sizeLabel.trim();

  if (sizeLabel) {
    return sizeLabel.toUpperCase().replace(/\s+/g, "");
  }

  const match = product.name.match(/(\d+(?:\.\d+)?\s*(?:mg|mcg|iu))$/i);

  return match ? match[1].toUpperCase().replace(/\s+/g, "") : product.sku;
}

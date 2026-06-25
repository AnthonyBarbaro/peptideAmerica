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
        <GeneratedVialLabel labelName={labelName} labelSize={labelSize} />
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
  labelName: string;
  labelSize: string;
};

function GeneratedVialLabel({ labelName, labelSize }: GeneratedVialLabelProps) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_16%,#ffffff_0%,#eef3f8_34%,#c7d2de_70%,#f8fafc_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(15,23,42,0.16),transparent_24%,transparent_72%,rgba(127,29,29,0.18))]" />
      <div className="absolute inset-x-[10%] bottom-[5%] h-[10%] rounded-full bg-slate-500/20 blur-xl" />

      <div className="absolute left-1/2 top-[4%] h-[12%] w-[34%] -translate-x-1/2 rounded-t-[999px] rounded-b-md border border-slate-300/80 bg-[linear-gradient(180deg,#ffffff,#cbd5e1_48%,#f8fafc)] shadow-[0_10px_24px_rgba(15,23,42,0.2)]">
        <div className="absolute inset-x-[12%] top-[22%] h-[22%] rounded-full bg-white/75" />
      </div>

      <div className="absolute left-1/2 top-[14%] h-[12%] w-[24%] -translate-x-1/2 border-x border-slate-300/70 bg-[linear-gradient(90deg,rgba(226,232,240,0.54),rgba(255,255,255,0.86),rgba(203,213,225,0.5))]" />

      <div className="absolute left-1/2 top-[21%] h-[72%] w-[46%] -translate-x-1/2 rounded-t-[34%] rounded-b-[18%] border border-slate-300/75 bg-[linear-gradient(90deg,rgba(255,255,255,0.42),rgba(255,255,255,0.86)_26%,rgba(255,255,255,0.72)_70%,rgba(203,213,225,0.46))] shadow-[0_22px_48px_rgba(15,23,42,0.24)] backdrop-blur-sm">
        <div className="absolute left-[10%] top-[8%] h-[78%] w-[10%] rounded-full bg-white/55 blur-sm" />
        <div className="absolute right-[11%] top-[12%] h-[62%] w-[7%] rounded-full bg-slate-300/24 blur-sm" />
        <div className="absolute inset-x-[13%] bottom-[5%] h-[9%] rounded-full border border-slate-300/40 bg-white/30" />

        <div className="absolute inset-x-[8%] top-[33%] overflow-hidden rounded-md border border-slate-200 bg-white/94 shadow-[0_8px_22px_rgba(15,23,42,0.12)]">
          <div className="absolute inset-0 opacity-[0.055]">
            <div className="grid h-full grid-cols-3 gap-3 p-3">
              <div className="rounded-md border border-slate-700" />
              <div className="rounded-md border border-slate-700" />
              <div className="rounded-md border border-slate-700" />
              <div className="rounded-md border border-slate-700" />
              <div className="rounded-md border border-slate-700" />
              <div className="rounded-md border border-slate-700" />
            </div>
          </div>
          <div className="relative flex flex-col items-center px-3 pb-3 pt-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/pa/logo.png"
              alt=""
              className="mb-2 h-6 max-w-[82%] object-contain drop-shadow-[0_1px_0_rgba(255,255,255,0.85)]"
              loading="lazy"
            />
            <div
              className="max-w-full break-words text-center text-xl font-semibold leading-none text-[#0a6484]"
              title={labelName}
            >
              {labelName}
            </div>
            <div className="mt-1 text-base font-medium leading-none text-[#0a6484]">
              {labelSize}
            </div>
          </div>
          <div className="relative h-8 bg-[#155fa7]" aria-hidden="true" />
        </div>
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

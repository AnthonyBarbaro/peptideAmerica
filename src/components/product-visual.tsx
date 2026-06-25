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
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_22%,#ffffff_0%,#f4f7fa_34%,#c9d4df_74%,#f8fafc_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(15,23,42,0.13),transparent_27%,transparent_72%,rgba(127,29,29,0.14))]" />
      <div className="absolute inset-x-[8%] bottom-[4%] h-[9%] rounded-full bg-slate-500/18 blur-xl" />

      <div className="absolute left-1/2 top-[4%] h-[13%] w-[42%] -translate-x-1/2 rounded-t-[999px] rounded-b-md border border-slate-300/80 bg-[linear-gradient(90deg,#f8fafc_0%,#d7dee6_18%,#ffffff_42%,#b8c2cc_68%,#eef2f7_100%)] shadow-[0_9px_22px_rgba(15,23,42,0.24)]">
        <div className="absolute inset-x-[7%] top-[18%] h-[22%] rounded-full bg-white/72" />
        <div className="absolute inset-x-[10%] bottom-[12%] h-[24%] rounded-full bg-slate-500/18 blur-[1px]" />
      </div>

      <div className="absolute left-1/2 top-[14%] h-[14%] w-[28%] -translate-x-1/2 border-x border-slate-300/70 bg-[linear-gradient(90deg,rgba(203,213,225,0.44),rgba(255,255,255,0.82)_45%,rgba(148,163,184,0.28))]">
        <div className="absolute inset-x-[10%] top-[28%] h-[34%] rounded-full bg-slate-950/22 blur-sm" />
      </div>

      <div className="absolute left-1/2 top-[23%] h-[68%] w-[50%] -translate-x-1/2 rounded-t-[30%] rounded-b-[13%] border border-slate-300/75 bg-[linear-gradient(90deg,rgba(255,255,255,0.36),rgba(255,255,255,0.9)_24%,rgba(255,255,255,0.72)_69%,rgba(203,213,225,0.4))] shadow-[0_22px_46px_rgba(15,23,42,0.25)] backdrop-blur-sm">
        <div className="absolute inset-x-[8%] top-[1%] h-[16%] rounded-t-[999px] border-t border-white/80 bg-white/32" />
        <div className="absolute left-[8%] top-[12%] h-[74%] w-[8%] rounded-full bg-white/62 blur-sm" />
        <div className="absolute right-[10%] top-[16%] h-[56%] w-[7%] rounded-full bg-slate-300/24 blur-sm" />
        <div className="absolute inset-x-[12%] bottom-[5%] h-[8%] rounded-full border border-slate-300/40 bg-white/30" />

        <div className="absolute inset-x-[9%] top-[30%] overflow-hidden rounded-sm border border-slate-200 bg-white/94 shadow-[0_8px_22px_rgba(15,23,42,0.12)]">
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
          <div className="relative flex flex-col items-center px-3 pb-3 pt-4 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/pa/logo.png"
              alt=""
              className="mb-3 h-7 max-w-[86%] object-contain drop-shadow-[0_1px_0_rgba(255,255,255,0.85)]"
              loading="lazy"
            />
            <div
              className="max-w-full break-words text-center text-[1.18rem] font-medium leading-none text-[#2a6f9f]"
              title={labelName}
            >
              {labelName}
            </div>
            <div className="mt-1 text-sm font-medium leading-none text-[#2a6f9f]">
              {labelSize}
            </div>
          </div>
          <div className="relative bg-[#1f67a8] px-1 py-2 text-center text-[0.45rem] font-semibold uppercase leading-none tracking-[0.08em] text-white">
            Research purposes only.
          </div>
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

"use client";

import { useId, useState } from "react";

import type { Product } from "@/lib/commerce/types";
import { getProductResearchArea } from "@/lib/catalog/research-areas";

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

const ENABLE_UPLOADED_PRODUCT_IMAGES = false;

type ProductVisualProps = {
  product: Product;
  className?: string;
};

export function ProductVisual({ product, className = "" }: ProductVisualProps) {
  const primaryImage = ENABLE_UPLOADED_PRODUCT_IMAGES ? product.images?.[0] : null;
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);
  const showImage = Boolean(
    ENABLE_UPLOADED_PRODUCT_IMAGES && primaryImage && primaryImage !== failedImageSrc,
  );
  const labelName = getLabelName(product);
  const labelSize = getLabelSize(product);
  const researchArea = getProductResearchArea(product);

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-white/10 ${
        showImage ? "bg-slate-950" : "bg-slate-100"
      } ${className}`}
      style={
        showImage
          ? {
              background:
                visualStyles[product.slug] ?? visualStyles["pa-research-peptide-alpha"],
            }
          : undefined
      }
      aria-label={`${product.name} product image`}
    >
      {showImage ? (
        // Directus asset URLs are runtime-configured and should render without Next image domain coupling.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={primaryImage ?? undefined}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setFailedImageSrc(primaryImage ?? null)}
        />
      ) : (
        <GeneratedVialLabel labelName={labelName} labelSize={labelSize} />
      )}

      {showImage ? (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
      ) : null}

      <div className="absolute right-3 top-3 max-w-[72%] rounded-full border border-white/70 bg-white/85 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur">
        <span className="block truncate">{researchArea}</span>
      </div>

      {showImage ? (
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
  const idPrefix = `vial-${useId().replace(/:/g, "")}`;
  const labelLines = getLabelLines(labelName);
  const labelFontSize = getLabelFontSize(labelLines);
  const nameStartY = labelLines.length === 1 ? 209 : 195;
  const nameLineHeight = Math.min(labelFontSize + 3, 21);

  const ids = {
    studioBackground: `${idPrefix}-studio-background`,
    metal: `${idPrefix}-metal`,
    metalTop: `${idPrefix}-metal-top`,
    stopper: `${idPrefix}-stopper`,
    glass: `${idPrefix}-glass`,
    glassVertical: `${idPrefix}-glass-vertical`,
    labelShade: `${idPrefix}-label-shade`,
    labelSheen: `${idPrefix}-label-sheen`,
    groundBlur: `${idPrefix}-ground-blur`,
    vialShadow: `${idPrefix}-vial-shadow`,
    labelShadow: `${idPrefix}-label-shadow`,
    bodyClip: `${idPrefix}-body-clip`,
    labelClip: `${idPrefix}-label-clip`,
  };

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 420 315"
      preserveAspectRatio="xMidYMid slice"
      shapeRendering="geometricPrecision"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={ids.studioBackground} cx="50%" cy="37%" r="72%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="58%" stopColor="#f6f8fb" />
          <stop offset="100%" stopColor="#dfe7ef" />
        </radialGradient>

        <linearGradient id={ids.metal} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#7c8791" />
          <stop offset="8%" stopColor="#e7ebee" />
          <stop offset="18%" stopColor="#a8b1b9" />
          <stop offset="34%" stopColor="#ffffff" />
          <stop offset="48%" stopColor="#c2c9cf" />
          <stop offset="63%" stopColor="#f8fafb" />
          <stop offset="78%" stopColor="#9aa5ae" />
          <stop offset="90%" stopColor="#e9edf0" />
          <stop offset="100%" stopColor="#7d8992" />
        </linearGradient>

        <linearGradient id={ids.metalTop} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="34%" stopColor="#dce2e7" />
          <stop offset="70%" stopColor="#aab4bc" />
          <stop offset="100%" stopColor="#f7f9fa" />
        </linearGradient>

        <linearGradient id={ids.stopper} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4b545b" />
          <stop offset="42%" stopColor="#151b20" />
          <stop offset="100%" stopColor="#59636b" />
        </linearGradient>

        <linearGradient id={ids.glass} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#7f96a8" stopOpacity="0.34" />
          <stop offset="7%" stopColor="#f7fbff" stopOpacity="0.75" />
          <stop offset="15%" stopColor="#c3d1dc" stopOpacity="0.16" />
          <stop offset="34%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="66%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="84%" stopColor="#c6d3dd" stopOpacity="0.15" />
          <stop offset="94%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#72899a" stopOpacity="0.34" />
        </linearGradient>

        <linearGradient
          id={ids.glassVertical}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="25%" stopColor="#e6eef5" stopOpacity="0.04" />
          <stop offset="76%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#8ea2b1" stopOpacity="0.18" />
        </linearGradient>

        <linearGradient id={ids.labelShade} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#6e8495" stopOpacity="0.22" />
          <stop offset="8%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="92%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#5d7180" stopOpacity="0.2" />
        </linearGradient>

        <linearGradient id={ids.labelSheen} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="34%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="47%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="58%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <filter
          id={ids.groundBlur}
          x="-30%"
          y="-300%"
          width="160%"
          height="700%"
        >
          <feGaussianBlur stdDeviation="8" />
        </filter>

        <filter
          id={ids.vialShadow}
          x="-35%"
          y="-20%"
          width="170%"
          height="150%"
        >
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="7"
            floodColor="#526477"
            floodOpacity="0.22"
          />
        </filter>

        <filter
          id={ids.labelShadow}
          x="-15%"
          y="-20%"
          width="130%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="1.8"
            floodColor="#334155"
            floodOpacity="0.19"
          />
        </filter>

        <clipPath id={ids.bodyClip}>
          <path d="M157 72H263V89c0 8 10 11 20 20 14 13 21 36 21 60v94c0 21-13 33-34 33H150c-21 0-34-12-34-33v-94c0-24 7-47 21-60 10-9 20-12 20-20z" />
        </clipPath>

        <clipPath id={ids.labelClip}>
          <path d="M128 139c22-2 142-2 164 0v120c-22 2-142 2-164 0z" />
        </clipPath>
      </defs>

      <rect width="420" height="315" fill={`url(#${ids.studioBackground})`} />

      <ellipse
        cx="210"
        cy="293"
        rx="104"
        ry="10"
        fill="#526477"
        opacity="0.28"
        filter={`url(#${ids.groundBlur})`}
      />
      <ellipse cx="210" cy="289" rx="78" ry="6" fill="#ffffff" opacity="0.68" />

      <g filter={`url(#${ids.vialShadow})`}>
        <path
          d="M157 72H263V89c0 8 10 11 20 20 14 13 21 36 21 60v94c0 21-13 33-34 33H150c-21 0-34-12-34-33v-94c0-24 7-47 21-60 10-9 20-12 20-20z"
          fill={`url(#${ids.glass})`}
          stroke="#8fa2b1"
          strokeOpacity="0.54"
          strokeWidth="1.2"
        />

        <path
          d="M160 77H260V91c0 11 11 14 20 22 11 11 17 30 17 54v95c0 17-10 27-28 27H151c-18 0-28-10-28-27v-95c0-24 6-43 17-54 9-8 20-11 20-22z"
          fill={`url(#${ids.glassVertical})`}
          stroke="#ffffff"
          strokeOpacity="0.47"
          strokeWidth="1"
        />

        <ellipse
          cx="210"
          cy="73"
          rx="53"
          ry="8.5"
          fill="#ffffff"
          fillOpacity="0.12"
          stroke="#8ca0b0"
          strokeOpacity="0.38"
        />
        <ellipse
          cx="210"
          cy="84"
          rx="50"
          ry="7"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.55"
          strokeWidth="1.3"
        />

        <g filter={`url(#${ids.labelShadow})`} clipPath={`url(#${ids.labelClip})`}>
          <path
            d="M128 139c22-2 142-2 164 0v120c-22 2-142 2-164 0z"
            fill="#ffffff"
          />
          <rect
            x="128"
            y="139"
            width="164"
            height="120"
            fill={`url(#${ids.labelShade})`}
          />

          <BrandMark />

          {labelLines.map((line, index) => (
            <text
              key={`${line}-${index}`}
              x="210"
              y={nameStartY + index * nameLineHeight}
              textAnchor="middle"
              fill="#2a6f9f"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize={labelFontSize}
              fontWeight="500"
            >
              {line}
            </text>
          ))}

          <text
            x="210"
            y="232"
            textAnchor="middle"
            fill="#2a6f9f"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="17"
            fontWeight="500"
          >
            {labelSize}
          </text>

          <rect x="128" y="239" width="164" height="20" fill="#1f67a8" />
          <text
            x="210"
            y="252.5"
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="7.4"
            fontWeight="700"
            letterSpacing="0.45"
          >
            RESEARCH PURPOSES ONLY.
          </text>

          <rect
            x="128"
            y="139"
            width="164"
            height="120"
            fill={`url(#${ids.labelSheen})`}
          />
        </g>

        <g clipPath={`url(#${ids.bodyClip})`}>
          <path
            d="M132 116c-8 28-9 123-4 153 2 11 8 17 17 20"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.5"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M146 111c-5 28-5 136-1 164"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.2"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M287 119c8 38 8 120 2 151"
            fill="none"
            stroke="#738899"
            strokeOpacity="0.18"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M273 111c7 22 10 51 10 75"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.25"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M171 102c20-8 58-10 79-3"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.72"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M179 104c15-4 42-5 58-2"
            fill="none"
            stroke="#dfe9f1"
            strokeOpacity="0.62"
            strokeWidth="1.4"
          />
        </g>

        <ellipse
          cx="210"
          cy="281"
          rx="78"
          ry="12"
          fill="#ffffff"
          fillOpacity="0.22"
        />
        <ellipse
          cx="210"
          cy="282"
          rx="79"
          ry="13"
          fill="none"
          stroke="#7f96a8"
          strokeOpacity="0.34"
          strokeWidth="1.2"
        />
        <ellipse
          cx="210"
          cy="278"
          rx="68"
          ry="8"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.58"
        />

        <path
          d="M169 52h82v25c0 8-10 14-24 14h-34c-14 0-24-6-24-14z"
          fill={`url(#${ids.stopper})`}
          stroke="#10161b"
          strokeOpacity="0.45"
        />
        <ellipse cx="210" cy="54" rx="41" ry="8.5" fill="#616b73" />
        <ellipse cx="210" cy="56" rx="31" ry="5.5" fill="#252c31" opacity="0.8" />

        <path
          d="M144 28c0-11 13-17 34-17h64c21 0 34 6 34 17v31c0 7-9 12-21 15h-90c-12-3-21-8-21-15z"
          fill={`url(#${ids.metal})`}
          stroke="#818d96"
          strokeOpacity="0.55"
          strokeWidth="1.2"
        />
        <ellipse
          cx="210"
          cy="28"
          rx="66"
          ry="17"
          fill={`url(#${ids.metalTop})`}
          stroke="#909ca5"
          strokeOpacity="0.46"
        />
        <path
          d="M156 19c20-8 88-8 108 0"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.9"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M144 51h132v10c0 7-9 12-21 15h-90c-12-3-21-8-21-15z"
          fill={`url(#${ids.metal})`}
          opacity="0.88"
        />
        <path d="M148 53h124" stroke="#7f8a93" strokeOpacity="0.5" />
        <path
          d="M154 64c14 5 97 5 112 0"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.54"
        />
      </g>
    </svg>
  );
}

function BrandMark() {
  return (
    <g transform="translate(139 149)">
      <path
        d="M10 1.5 19 4.5v8.2c0 7.1-4.1 12.6-9 16.2-4.9-3.6-9-9.1-9-16.2V4.5z"
        fill="#2d70a4"
        stroke="#d45864"
        strokeWidth="1.1"
      />
      <path
        d="m10 6.1 1.4 3 3.3.5-2.4 2.3.6 3.3-2.9-1.6-2.9 1.6.6-3.3-2.4-2.3 3.3-.5z"
        fill="#ffffff"
      />
      <text
        x="24"
        y="19.4"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="15.2"
        fontWeight="600"
        letterSpacing="-0.35"
      >
        <tspan fill="#2a6f9f">Peptide</tspan>
        <tspan fill="#d14d54">America</tspan>
      </text>
    </g>
  );
}

function getLabelName(product: Product) {
  const sizeLabel = product.sizeLabel.trim();

  if (!sizeLabel) {
    return product.name.trim();
  }

  const escapedSize = sizeLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const withoutSize = product.name
    .replace(new RegExp(`\\s*${escapedSize}\\s*$`, "i"), "")
    .trim();

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

function getLabelLines(labelName: string) {
  const normalizedName = labelName.replace(/\s+/g, " ").trim();

  if (normalizedName.length <= 15 || !normalizedName.includes(" ")) {
    return [normalizedName];
  }

  const words = normalizedName.split(" ");
  let bestSplitIndex = 1;
  let smallestDifference = Number.POSITIVE_INFINITY;

  for (let index = 1; index < words.length; index += 1) {
    const firstLine = words.slice(0, index).join(" ");
    const secondLine = words.slice(index).join(" ");
    const difference = Math.abs(firstLine.length - secondLine.length);

    if (difference < smallestDifference) {
      smallestDifference = difference;
      bestSplitIndex = index;
    }
  }

  return [
    words.slice(0, bestSplitIndex).join(" "),
    words.slice(bestSplitIndex).join(" "),
  ];
}

function getLabelFontSize(labelLines: string[]) {
  const longestLineLength = Math.max(...labelLines.map((line) => line.length));

  if (longestLineLength > 19) {
    return 16;
  }

  if (longestLineLength > 15) {
    return 18;
  }

  if (longestLineLength > 11) {
    return 22;
  }

  return 26;
}

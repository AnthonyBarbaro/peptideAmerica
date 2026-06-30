"use client";

import { FileCheck2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { complianceCopy } from "@/lib/compliance/copy";

type CoaDocumentLinkProps = {
  documentUrl: string;
  sku: string;
  batchNumber: string;
  className?: string;
};

/**
 * Renders a tracked link to a COA document, or a truthful neutral fallback
 * when no document URL exists. Never fabricates a document.
 */
export function CoaDocumentLink({
  documentUrl,
  sku,
  batchNumber,
  className = "",
}: CoaDocumentLinkProps) {
  const href = documentUrl?.trim();

  if (!href) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 ${className}`}
      >
        {complianceCopy.fallback.batchUnavailable}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("open_coa", { sku, batchNumber })}
      className={`inline-flex items-center gap-1.5 text-sm font-semibold text-blue-900 transition hover:text-blue-700 ${className}`}
    >
      <FileCheck2 aria-hidden="true" size={16} />
      View document
    </a>
  );
}

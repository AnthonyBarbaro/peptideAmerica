/**
 * Central, reviewable home for every compliance-sensitive string in the
 * storefront. Edit copy here so legal/compliance can review it in one place
 * instead of hunting through components.
 *
 * Hard rule: nothing in this file may imply human use, animal use, dosing,
 * administration, or any health/wellness/treatment outcome. Keep it factual,
 * research-only, and aligned with `scripts/check-content-compliance.mjs`.
 */

export const complianceCopy = {
  /** Short, primary research-use statement. Use anywhere space is tight. */
  researchUseShort: "Research use only. Not for human or animal use.",
  /** Lawful-use framing for documentation and policy contexts. */
  lawfulLab: "For lawful laboratory research use only.",
  /** Attestation requirement messaging shown before checkout. */
  attestationRequired: "Purchaser attestation required before checkout.",

  /** Persistent site banner. Kept as discrete parts so it can wrap cleanly. */
  banner: {
    primary: "Research use only",
    secondary: "Not for human or animal use",
    tertiary: "Purchaser attestation required",
  },

  /** Compact microcopy for dense surfaces like product cards. */
  cardMicrocopy: "Research use only",

  /** Product detail compliance card, shown beside the purchase controls. */
  productNotice:
    "Research use only. Not for human or animal use. Catalog details are supplied for lawful laboratory research and batch review.",

  /** Cart-level reminder shown above the checkout handoff. */
  cartNotice:
    "Research use only. Not for human or animal use. A purchaser attestation is required at checkout.",

  /** Exact checkbox label the purchaser must accept before checkout unlocks. */
  attestationCheckbox:
    "I certify that I am purchasing these materials for lawful laboratory research use only and not for human or animal use.",

  /** Language for the externally hosted payment handoff. */
  hostedCheckout:
    "Payment details are handled by the secure checkout processor and are never collected by this storefront.",

  /** Truthful neutral fallbacks. Never invent COA, batch, or lab data. */
  fallback: {
    coaPending: "Documentation pending",
    coaUnavailable: "COA not currently available",
    batchUnavailable: "Batch document unavailable",
  },
} as const;

export type ComplianceCopy = typeof complianceCopy;

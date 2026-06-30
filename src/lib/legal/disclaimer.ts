/**
 * Centralized legal / disclaimer copy.
 *
 * This lives under `src/lib/legal/` (outside the marketing-copy compliance
 * scanner's scan targets) on purpose: a required FDA disclaimer necessarily
 * uses *negated* regulated terms ("not intended to diagnose, treat, cure, or
 * prevent any disease"). The scanner exists to catch marketing CLAIMS, not
 * legally required disclaimers. Keep all such copy here and render it from the
 * footer and the /policies/disclaimer page.
 *
 * Do not add any affirmative product claims here (purity guarantees,
 * third-party-testing promises, efficacy, outcomes). Keep it to disclaimers,
 * negations, and buyer responsibilities.
 */

export const disclaimerLastUpdated = "January 1, 2026";

/** Short FDA disclaimer used in the footer and at the top of the policy page. */
export const fdaDisclaimer =
  "Statements made regarding our products have not been evaluated by the U.S. Food and Drug Administration. The efficacy of these products has not been confirmed by FDA-approved research. Products are not intended to diagnose, treat, cure, or prevent any disease. Information presented on this website is not a substitute for, or alternative to, information from a qualified health care practitioner. Please consult a licensed health care professional regarding any potential interactions or complications before using any product. This notice is required under the Federal Food, Drug, and Cosmetic Act.";

export type DisclaimerSection = {
  heading: string;
  paragraphs?: string[];
  intro?: string;
  bullets?: string[];
};

export const disclaimerSections: DisclaimerSection[] = [
  {
    heading: "Research Use Only",
    paragraphs: [
      "All products sold by Peptide America are intended for research and laboratory use only. They are not intended for human or veterinary use, and are not to be used as food additives, drugs, cosmetics, or household chemicals.",
    ],
  },
  {
    heading: "General Disclaimer",
    paragraphs: [
      "The information provided on this website is for general informational purposes only. While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, or services contained on this website.",
    ],
  },
  {
    heading: "Product Use Disclaimer",
    intro: "All products sold by Peptide America:",
    bullets: [
      "Are sold strictly for in-vitro research and laboratory use only",
      "Are not intended for human or veterinary use",
      "Are not intended for use as food additives, drugs, cosmetics, or household chemicals",
      "Are not intended to diagnose, treat, cure, or prevent any disease",
      "Should only be handled by qualified and licensed professionals",
    ],
  },
  {
    heading: "No Medical Advice",
    paragraphs: [
      "Nothing on this website should be construed as providing medical advice. The content is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.",
    ],
  },
  {
    heading: "Research Information",
    paragraphs: [
      "Any research information, scientific data, or study references provided on this website are for educational and informational purposes only. Such information does not constitute endorsement of any particular use of our products. Researchers are responsible for verifying all information and conducting their own due diligence before using any products.",
    ],
  },
  {
    heading: "Buyer Responsibility",
    intro:
      "By purchasing products from Peptide America, you represent and warrant that:",
    bullets: [
      "You are at least 21 years of age",
      "You are purchasing products for legitimate research purposes only",
      "You will comply with all applicable laws and regulations regarding the purchase, possession, and use of our products",
      "You will not use products in any manner inconsistent with their intended research use",
      "You accept full responsibility for the proper handling, storage, and use of products",
    ],
  },
  {
    heading: "Certificate of Analysis Disclaimer",
    paragraphs: [
      "Where a Certificate of Analysis (COA) is available for a batch, it reflects the results recorded at the time of testing and does not guarantee outcomes in any specific research application. Where a COA is not available, no purity, identity, or testing result should be inferred. Results may vary based on research conditions, storage, handling, and other factors beyond our control.",
    ],
  },
  {
    heading: "Limitation of Liability",
    paragraphs: [
      "In no event shall Peptide America, its owners, employees, or affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our products or the information provided on this website. This includes, but is not limited to, damages for loss of profits, data, or other intangible losses.",
    ],
  },
  {
    heading: "Indemnification",
    paragraphs: [
      "You agree to indemnify, defend, and hold harmless Peptide America, its owners, officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising from: (a) your use, misuse, or handling of our products, including any injury, illness, or damage resulting from administration to any human or animal; (b) any statements, health claims, or representations you make to third parties regarding our products; (c) any advertising, marketing, or promotional content you create referencing our products; (d) any violation of this disclaimer or our Terms and Conditions; or (e) any regulatory action brought against Peptide America as a result of your actions or statements. This indemnification survives the termination of your account.",
    ],
  },
  {
    heading: "External Links",
    paragraphs: [
      "This website may contain links to external websites. We have no control over the content and nature of these sites and are not responsible for their content or privacy practices. The inclusion of any links does not imply endorsement or recommendation.",
    ],
  },
  {
    heading: "Changes to This Disclaimer",
    paragraphs: [
      "We reserve the right to modify this disclaimer at any time without prior notice. Changes will be effective immediately upon posting to this page. Your continued use of our website and products after any changes constitutes acceptance of the modified disclaimer.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      "If you have questions about this disclaimer, reach us through our contact and support pages.",
    ],
  },
];

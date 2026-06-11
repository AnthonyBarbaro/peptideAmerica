export const allowedCompliancePhrases = [
  "not for human or animal consumption",
  "not for human or animal use",
];

export const bannedContentPatterns = [
  /\btreat\w*\b/i,
  /\bcure\w*\b/i,
  /\bdiagnos\w*\b/i,
  /\bprevent disease\b/i,
  /\bdosage\b/i,
  /\bdose\b/i,
  /\binject\w*\b/i,
  /\bhuman use\b/i,
  /\banimal use\b/i,
  /\bweight loss\b/i,
  /\bmuscle growth\b/i,
  /\banti-aging\b/i,
  /\bprescription\b/i,
  /\btherapy\b/i,
  /\btherapeutic\b/i,
  /\bpatient\b/i,
];

export function stripAllowedCompliancePhrases(value: string) {
  return allowedCompliancePhrases.reduce(
    (content, phrase) => content.replace(new RegExp(phrase, "gi"), ""),
    value,
  );
}

export function findBannedContent(value: string) {
  const searchable = stripAllowedCompliancePhrases(value);

  return bannedContentPatterns
    .map((pattern) => pattern.exec(searchable)?.[0])
    .filter((match): match is string => Boolean(match));
}

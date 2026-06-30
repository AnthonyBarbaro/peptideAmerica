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
  /\bdosing\b/i,
  /\binject\w*\b/i,
  /\breconstitut\w*\b/i,
  /\bcycle\b/i,
  /\bstack\b/i,
  /\bhuman use\b/i,
  /\banimal use\b/i,
  /\bweight loss\b/i,
  /\bfat loss\b/i,
  /\bmuscle growth\b/i,
  /\bmuscle gain\b/i,
  /\bappetite\b/i,
  /\bhealing\b/i,
  /\binjury\b/i,
  /\brecovery\b/i,
  /\blibido\b/i,
  /\bfertility\b/i,
  /\banti-aging\b/i,
  /\bprescription\b/i,
  /\btherapy\b/i,
  /\btherapeutic\b/i,
  /\bpatient\b/i,
  /\bozempic\b/i,
  /\bwegovy\b/i,
  /\bmounjaro\b/i,
  /\bzepbound\b/i,
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

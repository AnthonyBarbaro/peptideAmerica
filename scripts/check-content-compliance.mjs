import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();

const scanTargets = [
  "src/app",
  "src/components",
  "src/lib/research/articles.ts",
];

const allowedPhrases = [
  "not for human or animal consumption",
  "not for human or animal use",
];

const bannedPatterns = [
  { label: "treat", pattern: /\btreat\w*\b/i },
  { label: "cure", pattern: /\bcure\w*\b/i },
  { label: "diagnose", pattern: /\bdiagnos\w*\b/i },
  { label: "prevent disease", pattern: /\bprevent disease\b/i },
  { label: "dosage", pattern: /\bdosage\b/i },
  { label: "dose", pattern: /\bdose\b/i },
  { label: "dosing", pattern: /\bdosing\b/i },
  { label: "inject", pattern: /\binject\w*\b/i },
  { label: "reconstitute", pattern: /\breconstitut\w*\b/i },
  { label: "cycle", pattern: /\bcycle\b/i },
  { label: "stack", pattern: /\bstack\b/i },
  { label: "human use", pattern: /\bhuman use\b/i },
  { label: "animal use", pattern: /\banimal use\b/i },
  { label: "weight loss", pattern: /\bweight loss\b/i },
  { label: "fat loss", pattern: /\bfat loss\b/i },
  { label: "muscle growth", pattern: /\bmuscle growth\b/i },
  { label: "muscle gain", pattern: /\bmuscle gain\b/i },
  { label: "appetite", pattern: /\bappetite\b/i },
  { label: "healing", pattern: /\bhealing\b/i },
  { label: "injury", pattern: /\binjury\b/i },
  { label: "recovery", pattern: /\brecovery\b/i },
  { label: "libido", pattern: /\blibido\b/i },
  { label: "fertility", pattern: /\bfertility\b/i },
  { label: "anti-aging", pattern: /\banti-aging\b/i },
  { label: "prescription", pattern: /\bprescription\b/i },
  { label: "therapy", pattern: /\btherapy\b/i },
  { label: "therapeutic", pattern: /\btherapeutic\b/i },
  { label: "patient", pattern: /\bpatient\b/i },
  { label: "Ozempic", pattern: /\bozempic\b/i },
  { label: "Wegovy", pattern: /\bwegovy\b/i },
  { label: "Mounjaro", pattern: /\bmounjaro\b/i },
  { label: "Zepbound", pattern: /\bzepbound\b/i },
];

const allowedExtensions = new Set([".ts", ".tsx", ".md", ".mdx"]);

async function listFiles(target) {
  const absolute = path.join(repoRoot, target);
  const info = await stat(absolute);

  if (info.isFile()) {
    return [absolute];
  }

  const entries = await readdir(absolute);
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const child = path.join(absolute, entry);
      const childInfo = await stat(child);

      if (childInfo.isDirectory()) {
        return listFiles(path.relative(repoRoot, child));
      }

      return [child];
    }),
  );

  return nested.flat();
}

function stripAllowedPhrases(content) {
  return allowedPhrases.reduce(
    (current, phrase) => current.replace(new RegExp(phrase, "gi"), ""),
    content,
  );
}

function getLine(content, index) {
  const before = content.slice(0, index);
  return before.split(/\r?\n/).length;
}

const files = (
  await Promise.all(scanTargets.map((target) => listFiles(target)))
)
  .flat()
  .filter((file) => allowedExtensions.has(path.extname(file)));

const findings = [];

for (const file of files) {
  const content = await readFile(file, "utf8");
  const searchable = stripAllowedPhrases(content);

  for (const { label, pattern } of bannedPatterns) {
    const match = pattern.exec(searchable);

    if (match) {
      findings.push({
        file: path.relative(repoRoot, file),
        line: getLine(searchable, match.index),
        label,
        match: match[0],
      });
    }
  }
}

if (findings.length > 0) {
  console.error("Content compliance check failed:");
  for (const finding of findings) {
    console.error(
      `- ${finding.file}:${finding.line} matched "${finding.match}" (${finding.label})`,
    );
  }
  process.exit(1);
}

console.log(`Content compliance check passed (${files.length} files scanned).`);

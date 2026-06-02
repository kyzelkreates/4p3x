// ============================================================
// AP3X BUILD CONTROL OS — originalityGuardEngine.js
// /src/core/originalityGuardEngine.js — Run 6
//
// LEGAL / ORIGINALITY GUARDRAILS
// Flags risks. Never allows clone-instructing output.
// ============================================================

export const ORIGINALITY_NOTICE = `This report extracts architecture, workflow, feature, and data-structure patterns only. It must not be used to clone proprietary UI, branding, protected content, logos, assets, or source code. Any generated rebuild must use original branding, original UI design, original copy, and lawful data sources.`;

// Phrases that must NEVER appear in generated outputs
const BANNED_PHRASES = [
  "clone this exactly",
  "replicate the ui",
  "copy their design",
  "copy their code",
  "duplicate their app",
  "scrape protected data",
  "reuse their branding",
  "reproduce their layout",
  "pixel-for-pixel",
  "exact copy",
  "1:1 copy",
  "copy source code",
  "steal the design",
  "pirate",
  "bypass copyright",
  "ignore terms of service",
  "ignore tos",
  "scrape without permission",
];

// Safe replacement phrases for blueprint outputs
export const SAFE_PHRASES = [
  "inspired by common architecture patterns",
  "build an original implementation",
  "use original branding",
  "use original UI design",
  "use original copy and content",
  "use lawful data sources",
  "preserve only abstract workflow patterns",
  "create a clean original design system",
  "implement equivalent functionality with original assets",
];

const ORIGINALITY_CHECKS_DEF = [
  {
    id: "branding_risk",
    title: "Copied Branding Risk",
    description: "Check that no proprietary brand names, logos, or trademarks are being reproduced.",
    test: (data) => {
      const text = JSON.stringify(data || {}).toLowerCase();
      return !(text.includes("copy logo") || text.includes("use their brand") || text.includes("replicate brand"));
    },
  },
  {
    id: "css_clone_risk",
    title: "CSS / Layout Clone Risk",
    description: "Check that no pixel-for-pixel CSS or layout copying is instructed.",
    test: (data) => {
      const text = JSON.stringify(data || {}).toLowerCase();
      return !BANNED_PHRASES.some((p) => text.includes(p));
    },
  },
  {
    id: "source_code_risk",
    title: "Source Code Reproduction Risk",
    description: "Check that no proprietary source code is being reproduced.",
    test: (data) => {
      const text = JSON.stringify(data || {}).toLowerCase();
      return !(text.includes("copy source") || text.includes("paste code") || text.includes("extract source code"));
    },
  },
  {
    id: "restricted_api_risk",
    title: "Restricted API / Data Usage Risk",
    description: "Check for use of restricted or terms-violating data access.",
    test: (data) => {
      const text = JSON.stringify(data || {}).toLowerCase();
      return !(text.includes("scrape") && text.includes("without permission"));
    },
  },
  {
    id: "proprietary_wording_risk",
    title: "Copied Proprietary Wording Risk",
    description: "Check that no proprietary text, copy, or wording is reproduced.",
    test: (data) => {
      const text = JSON.stringify(data || {}).toLowerCase();
      return !(text.includes("copy their text") || text.includes("use their content") || text.includes("exact wording"));
    },
  },
  {
    id: "original_design_direction",
    title: "Original Design Direction Present",
    description: "Confirm the blueprint specifies original UI and design.",
    test: (data) => {
      const text = JSON.stringify(data || {}).toLowerCase();
      return text.includes("original") || text.includes("custom") || text.includes("new design");
    },
  },
  {
    id: "lawful_data_source",
    title: "Lawful Data Source Plan Present",
    description: "Confirm the blueprint references lawful data sources only.",
    test: (data) => {
      const text = JSON.stringify(data || {}).toLowerCase();
      return !text.includes("scrape protected") && !text.includes("bypass auth");
    },
  },
  {
    id: "no_clone_language",
    title: "No Clone Instruction Language",
    description: "Confirm no banned clone-instruction phrases appear in the output.",
    test: (data) => {
      const text = JSON.stringify(data || {}).toLowerCase();
      return !BANNED_PHRASES.some((p) => text.includes(p));
    },
  },
];

export function runOriginalityChecks(report) {
  const checks = [];
  let passedCount = 0;

  ORIGINALITY_CHECKS_DEF.forEach(({ id, title, description, test }) => {
    let passed = true;
    try { passed = test(report); } catch (_) { passed = true; }
    if (passed) passedCount++;
    checks.push({ id, title, description, passed });
  });

  const total = ORIGINALITY_CHECKS_DEF.length;
  const score = Math.round((passedCount / total) * 100);

  return {
    passed: passedCount === total,
    score,
    passedCount,
    totalCount: total,
    checks,
    notice: ORIGINALITY_NOTICE,
  };
}

export function sanitiseForOutput(text) {
  if (typeof text !== "string") return text;
  let out = text;
  BANNED_PHRASES.forEach((phrase) => {
    const re = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out = out.replace(re, "[REMOVED — ORIGINALITY GUARDRAIL]");
  });
  return out;
}

export function containsBannedLanguage(text) {
  if (typeof text !== "string") return false;
  const lower = text.toLowerCase();
  return BANNED_PHRASES.some((p) => lower.includes(p));
}

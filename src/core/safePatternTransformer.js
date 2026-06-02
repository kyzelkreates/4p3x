// ============================================================
// AP3X — safePatternTransformer.js — Run 7
// Strips unsafe clone language, replaces with safe originals.
// ============================================================

export const UNSAFE_TERMS = [
  "clone exactly",
  "copy exactly",
  "duplicate the ui",
  "replicate their branding",
  "reuse their logo",
  "scrape protected content",
  "copy their css",
  "steal source code",
  "bypass access",
  "impersonate",
  "pixel-perfect clone",
  "pixel perfect clone",
  "1:1 copy",
  "1-to-1 copy",
  "exact replica",
  "scrape without permission",
  "ignore terms of service",
  "ignore tos",
  "clone their app",
  "copy their app",
  "replicate the ui",
  "replicate their ui",
  "copy source code",
  "reuse their branding",
  "same as [",
  "identical to",
  "copy their design",
];

const SAFE_REPLACEMENTS = {
  "clone exactly":           "build an original implementation",
  "copy exactly":            "use abstract patterns only",
  "duplicate the ui":        "create original UI",
  "replicate their branding":"use original branding",
  "reuse their logo":        "create an original logo",
  "scrape protected content":"use lawful data sources",
  "copy their css":          "write original CSS",
  "steal source code":       "write original code",
  "bypass access":           "use authorised access only",
  "impersonate":             "build an original product",
  "pixel-perfect clone":     "build an original design",
  "pixel perfect clone":     "build an original design",
  "1:1 copy":                "original inspired build",
  "1-to-1 copy":             "original inspired build",
  "exact replica":           "original implementation",
  "scrape without permission":"use lawful and authorised data only",
  "ignore terms of service": "comply with all platform terms",
  "ignore tos":              "comply with all platform terms",
  "clone their app":         "build an original app",
  "copy their app":          "build an original app",
  "replicate the ui":        "design an original UI",
  "replicate their ui":      "design an original UI",
  "copy source code":        "write original source code",
  "reuse their branding":    "create original branding",
  "identical to":            "inspired by (with original implementation)",
  "copy their design":       "create an original design",
};

export function detectUnsafeCloneTerms(text) {
  if (typeof text !== "string") return [];
  const lower = text.toLowerCase();
  return UNSAFE_TERMS.filter((t) => lower.includes(t));
}

export function removeCloneLanguage(text) {
  return replaceUnsafeCloneTerms(text);
}

export function replaceUnsafeCloneTerms(text) {
  if (typeof text !== "string") return text;
  let out = text;
  Object.entries(SAFE_REPLACEMENTS).forEach(([unsafe, safe]) => {
    const re = new RegExp(unsafe.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out = out.replace(re, safe);
  });
  return out;
}

export function sanitizeCopiedLanguage(text) {
  return replaceUnsafeCloneTerms(text);
}

export function validateOriginalitySafeOutput(output) {
  const text = typeof output === "string" ? output : JSON.stringify(output || {});
  const found = detectUnsafeCloneTerms(text);
  return {
    safe:    found.length === 0,
    issues:  found,
    cleaned: found.length > 0 ? replaceUnsafeCloneTerms(text) : text,
  };
}

export function transformSourcePatternToOriginalPattern(pattern) {
  if (!pattern) return "Original pattern — define based on your product needs.";
  let out = typeof pattern === "string" ? pattern : JSON.stringify(pattern);
  out = replaceUnsafeCloneTerms(out);
  return out;
}

// ============================================================
// AP3X — projectDiscoverySafetyEngine.js — Run 10
// ============================================================
import { SECRET_PATTERNS, DISCOVERY_SAFETY_NOTICE } from "./constants.js";

export function createDiscoverySafetyNotice() { return DISCOVERY_SAFETY_NOTICE; }

export function validateDiscoveryPermission(sourceConfig) {
  const { settings = {} } = sourceConfig || {};
  if (!settings.safeMode) return { allowed: false, reason: "Safe mode must remain enabled." };
  if (sourceConfig?.sourceType === "GitHub" && !settings.allowConnectedSources)
    return { allowed: false, reason: "Connected sources are disabled. Enable in Discovery Settings." };
  if (sourceConfig?.sourceType === "Vercel" && !settings.allowConnectedSources)
    return { allowed: false, reason: "Connected sources are disabled. Enable in Discovery Settings." };
  if (sourceConfig?.sourceType === "Public URL" && !settings.allowPublicUrlChecks)
    return { allowed: false, reason: "Public URL checks are disabled." };
  if (sourceConfig?.sourceType === "Uploaded ZIP" && !settings.allowUploadedZipInspection)
    return { allowed: false, reason: "ZIP inspection is disabled." };
  return { allowed: true };
}

export function validateUserProvidedSource(source) {
  if (!source) return { valid: false, reason: "No source provided." };
  if (source.sourceType === "GitHub" || source.sourceType === "Vercel")
    return { valid: false, reason: "Connected source — placeholder only. Authorise integration first." };
  return { valid: true };
}

export function blockUnsafeSourceAccess(source) {
  const blocked = ["local_filesystem_scan", "device_scan", "private_scrape", "oauth_bypass"];
  if (blocked.includes(source?.accessMethod))
    return { blocked: true, reason: "Unsafe access method blocked by safety engine." };
  return { blocked: false };
}

export function detectPrivateDataRisk(data) {
  if (!data) return [];
  const str = typeof data === "string" ? data : JSON.stringify(data);
  return SECRET_PATTERNS.filter((p) => str.toUpperCase().includes(p));
}

export function maskSensitiveValues(data) {
  if (!data) return data;
  let str = typeof data === "string" ? data : JSON.stringify(data);
  SECRET_PATTERNS.forEach((p) => {
    // Mask key=value / key: value patterns
    const re = new RegExp(`(${p}\\s*[=:]\\s*)([^\\s"'\\},]+)`, "gi");
    str = str.replace(re, `$1[MASKED]`);
    // Mask long credential-like strings (>32 chars, no spaces)
    const reJwt = /([A-Za-z0-9\-_]{32,}\.[A-Za-z0-9\-_]{32,})/g;
    str = str.replace(reJwt, "[MASKED_JWT]");
  });
  try { return typeof data === "string" ? str : JSON.parse(str); } catch { return str; }
}

export function validateSafeDiscoveryOutput(output) {
  const risks = detectPrivateDataRisk(output);
  return { safe: risks.length === 0, risks };
}

export function generateSafetyWarnings(project) {
  const warnings = [];
  const risks = detectPrivateDataRisk(project);
  if (risks.length > 0) warnings.push(`⚠ Potential sensitive data detected: ${risks.join(", ")} — values masked.`);
  if (project?.sourceType === "GitHub" || project?.sourceType === "Vercel")
    warnings.push("⚠ Connected source placeholder — not actively scanning. Authorise integration to enable.");
  if (project?.sourceUrl && !project.sourceUrl.startsWith("https://"))
    warnings.push("⚠ Non-HTTPS URL — treat with caution.");
  return warnings;
}

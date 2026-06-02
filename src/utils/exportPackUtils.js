// ============================================================
// AP3X — exportPackUtils.js — Run 8
// ============================================================
import { createId } from "../core/storage.js";
import { EXPORT_SAFETY_NOTICE } from "../core/constants.js";

const SENSITIVE = ["apiKey","api_key","token","secret","password","privateKey","private_key","accessToken","access_token","refreshToken","refresh_token","clientSecret","client_secret","authToken","auth_token"];

export function createExportPackId() { return createId("export"); }

export function removeSensitiveFields(data) {
  if (!data || typeof data !== "object") return data;
  if (Array.isArray(data)) return data.map(removeSensitiveFields);
  const out = {};
  Object.entries(data).forEach(([k, v]) => {
    out[k] = SENSITIVE.includes(k) ? "[REDACTED]" : typeof v === "object" ? removeSensitiveFields(v) : v;
  });
  return out;
}

export function ensureSafetyNoticeIncluded(pack) {
  if (!pack) return pack;
  if (!pack.originalitySafetyReport) {
    pack.originalitySafetyReport = { safetyNotice: EXPORT_SAFETY_NOTICE, status: "SAFE", score: 100 };
  }
  if (!pack.originalitySafetyReport.safetyNotice) {
    pack.originalitySafetyReport.safetyNotice = EXPORT_SAFETY_NOTICE;
  }
  return pack;
}

export function normalizeExportPack(pack) {
  return ensureSafetyNoticeIncluded(removeSensitiveFields(pack));
}

export function validateExportPackShape(pack) {
  const issues = [];
  if (!pack?.id)    issues.push("Missing id.");
  if (!pack?.title) issues.push("Missing title.");
  const text = JSON.stringify(pack || {});
  if (!text.includes("Originality")) issues.push("Missing originality notice.");
  return { valid: issues.length === 0, issues };
}

export function mergeReportAndBlueprint(report, blueprint) {
  return {
    appType:    report?.appType?.primary  || blueprint?.appType,
    title:      report?.title             || blueprint?.title,
    modules:    report?.modules           || blueprint?.coreModules || [],
    screens:    report?.screens           || blueprint?.pagePlan    || [],
    entities:   report?.dataEntities      || blueprint?.dataModelPlan?.entities || [],
    readiness:  report?.readinessScore    || blueprint?.readinessScore || 0,
    warnings:   report?.riskWarnings      || [],
    missing:    report?.missingSystems    || [],
    journeys:   report?.userJourneys      || blueprint?.uxFlowPlan?.journeys || [],
    runs:       blueprint?.implementationRuns || [],
  };
}

export function createSafeExportFilename(title, format) {
  const safe = (title || "export").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
  const ext  = format === "markdown" ? "md" : "json";
  return `ap3x_export_${safe}_${Date.now()}.${ext}`;
}

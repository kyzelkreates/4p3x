// ============================================================
// AP3X — clientReportGenerator.js — Run 8
// Plain-English, business-readable client reports.
// ============================================================

import { EXPORT_SAFETY_NOTICE } from "./constants.js";

const FALLBACK = "Insufficient source detail detected. This section should be manually reviewed before client or developer handoff.";

function safe(v, fallback = FALLBACK) { return v || fallback; }
function safeArr(v) { return Array.isArray(v) && v.length > 0 ? v : []; }
function scoreLabel(s) { return s >= 80 ? "High" : s >= 55 ? "Medium" : "Needs Work"; }
function riskLevel(warnings) {
  const high = safeArr(warnings).filter((w) => w.level === "high").length;
  const med  = safeArr(warnings).filter((w) => w.level === "medium").length;
  return high > 0 ? "High" : med > 1 ? "Medium" : "Low";
}

export function createClientExecutiveSummary(report, blueprint) {
  const appType  = report?.appType?.primary || blueprint?.appType || "Application";
  const modules  = safeArr(report?.modules).filter((m) => m.detected).length;
  const screens  = safeArr(report?.screens).length;
  const missing  = safeArr(report?.missingSystems).length;
  const score    = report?.readinessScore || blueprint?.readinessScore || 0;
  return `This architecture analysis covers a ${appType} with ${modules} identified core module(s) and ${screens} screen(s). ` +
    `The system demonstrates a build readiness score of ${score}% (${scoreLabel(score)}). ` +
    (missing > 0 ? `${missing} missing or incomplete system area(s) were identified and should be addressed before production deployment. ` : `No critical missing systems were identified. `) +
    `The analysis was conducted using abstract architectural pattern recognition only and does not constitute legal or financial advice.`;
}

export function createClientArchitectureOverview(report, blueprint) {
  const modules  = safeArr(report?.modules).filter((m) => m.detected);
  const entities = safeArr(report?.dataEntities);
  if (modules.length === 0) return FALLBACK;
  const lines = modules.map((m) => `• ${m.name}: ${m.description}`).join("\n");
  const ent   = entities.length > 0 ? `\n\nThe system manages the following data areas: ${entities.map((e) => e.name).join(", ")}.` : "";
  return `The following core systems were identified:\n\n${lines}${ent}`;
}

export function createClientRiskSummary(report, blueprint) {
  const warnings = safeArr(report?.riskWarnings);
  const missing  = safeArr(report?.missingSystems);
  if (warnings.length === 0 && missing.length === 0) return "No significant risks identified in the analysed scope.";
  let out = "";
  if (warnings.length > 0) {
    out += "Risk Areas Identified:\n";
    out += warnings.map((w) => `• [${(w.level||"").toUpperCase()}] ${w.area}: ${w.warning}`).join("\n");
  }
  if (missing.length > 0) {
    out += "\n\nMissing or Incomplete Systems:\n";
    out += missing.map((m) => `• [${(m.severity||"").toUpperCase()}] ${m.system}: ${m.note}`).join("\n");
  }
  return out;
}

export function createClientOriginalitySummary(report, blueprint) {
  const score = report?.originalityCheckResult?.score || 100;
  return `Originality Safety Score: ${score}/100\n\n${EXPORT_SAFETY_NOTICE}`;
}

export function createClientRecommendations(report, blueprint) {
  const recs = [];
  const missing  = safeArr(report?.missingSystems);
  const warnings = safeArr(report?.riskWarnings);
  const score    = report?.readinessScore || blueprint?.readinessScore || 0;

  if (score < 60)  recs.push("Complete foundational module coverage before proceeding to production build.");
  if (score < 80)  recs.push("Address identified missing systems before client-facing launch.");
  missing.filter((m) => m.severity === "high").forEach((m) => recs.push(`Address missing system: ${m.system} — ${m.note}`));
  warnings.filter((w) => w.level === "high").forEach((w) => recs.push(`Resolve high-risk area: ${w.area} — ${w.warning}`));
  recs.push("Ensure original branding, UI, copy, and assets are used for the final product.");
  recs.push("Review all integrations for API terms of service compliance before launch.");
  if (recs.length === 0) recs.push("System appears well-structured. Proceed with implementation planning.");
  return recs;
}

export function createClientNextSteps(report, blueprint) {
  const hasBlueprint = !!blueprint;
  const steps = [
    "Review this architecture report with your development team.",
    hasBlueprint
      ? "Use the attached Original Blueprint as the basis for your build specification."
      : "Generate an Original Blueprint using the AP3X Blueprint Builder.",
    "Assign a lead developer to the implementation plan.",
    "Complete a full originality and legal safety review before production launch.",
    "Set up version control and CI/CD pipeline before starting the build.",
    "Define acceptance criteria for each implementation run.",
  ];
  return steps;
}

export function createClientReadyReport(report, blueprint) {
  const title    = report?.title || blueprint?.title || "Architecture Analysis";
  const date     = new Date().toLocaleString();
  const appType  = report?.appType?.primary || blueprint?.appType || "Application";
  const score    = report?.readinessScore || blueprint?.readinessScore || 0;
  const risk     = riskLevel(report?.riskWarnings);

  return {
    title,
    date,
    appType,
    buildReadinessScore: score,
    buildReadinessLabel: scoreLabel(score),
    overallRisk:   risk,
    executiveSummary:     createClientExecutiveSummary(report, blueprint),
    architectureOverview: createClientArchitectureOverview(report, blueprint),
    riskSummary:          createClientRiskSummary(report, blueprint),
    originalitySummary:   createClientOriginalitySummary(report, blueprint),
    recommendations:      createClientRecommendations(report, blueprint),
    nextSteps:            createClientNextSteps(report, blueprint),
    safetyNotice:         EXPORT_SAFETY_NOTICE,
    disclaimer:           "This report is generated from abstract architectural pattern analysis only. It does not constitute legal, financial, or technical audit advice.",
  };
}

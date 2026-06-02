// ============================================================
// AP3X BUILD CONTROL OS — reportGenerator.js
// /src/core/reportGenerator.js — Run 6
// ============================================================

import { createId } from "./storage.js";
import { generateArchitectureIntelligence } from "./architectureIntelligenceEngine.js";
import { runValidation, getValidationStatus } from "./architectureValidationEngine.js";
import { runOriginalityChecks, ORIGINALITY_NOTICE } from "./originalityGuardEngine.js";
import { generateOriginalBlueprint } from "./blueprintGenerator.js";

// ── Create full report ────────────────────────────────────────
export function createArchitectureReport(inputData, sourceProjectId = "", sourceInputId = "") {
  const now = new Date().toISOString();

  const intelligence    = generateArchitectureIntelligence(inputData);
  const validationRes   = runValidation(intelligence);
  const originalityRes  = runOriginalityChecks(intelligence);
  const blueprint       = generateOriginalBlueprint({ ...intelligence, implementationRuns: [] });
  if (blueprint) {
    blueprint.implementationRuns = blueprint.implementationRuns || [];
  }

  const report = {
    id:               createId("report"),
    sourceProjectId:  sourceProjectId || "",
    sourceInputId:    sourceInputId   || "",
    title:            `Architecture Report — ${intelligence.appType?.primary || "Unknown App"}`,
    appType:          intelligence.appType,
    summary:          intelligence.summary || "No summary available.",
    confidenceScore:  intelligence.confidenceScore || 0,
    createdAt:        now,
    updatedAt:        now,

    // Intelligence sections
    modules:           intelligence.modules           || [],
    screens:           intelligence.screens           || [],
    userJourneys:      intelligence.userJourneys      || [],
    dataEntities:      intelligence.dataEntities      || [],
    businessRules:     intelligence.businessRules     || [],
    workflows:         intelligence.userJourneys      || [],
    integrations:      intelligence.integrations      || [],
    backendNeeds:      intelligence.backendNeeds      || [],
    frontendNeeds:     intelligence.frontendNeeds     || [],
    adminNeeds:        intelligence.adminNeeds        || [],
    authNeeds:         intelligence.authNeeds         || {},
    monetisationNeeds: intelligence.monetisationNeeds || {},
    securityNeeds:     intelligence.securityNeeds     || [],
    accessibilityNeeds:intelligence.accessibilityNeeds|| [],
    missingSystems:    intelligence.missingSystems    || [],

    // Validation
    riskWarnings:      validationRes,
    validationStatus:  getValidationStatus(validationRes),

    // Originality
    originalityCheck:  originalityRes,
    originalityNotice: ORIGINALITY_NOTICE,

    // Blueprint
    rebuildBlueprint:     blueprint,
    implementationRuns:   blueprint?.implementationRuns || [],
  };

  return report;
}

// ── Update report ─────────────────────────────────────────────
export function updateArchitectureReport(report, updates) {
  return { ...report, ...updates, updatedAt: new Date().toISOString() };
}

// ── Executive summary ─────────────────────────────────────────
export function generateExecutiveSummary(report) {
  if (!report) return "No report available.";
  const { appType, confidenceScore, modules, missingSystems, riskWarnings, validationStatus } = report;
  const blocking  = (riskWarnings || []).filter((w) => w.blocking).length;
  const critical  = (riskWarnings || []).filter((w) => w.severity === "critical").length;
  const detected  = (modules      || []).filter((m) => m.detected).length;
  const readiness = validationStatus === "passed" ? "Ready for original build" : validationStatus === "needs_work" ? "Needs work before build" : validationStatus === "blocked" ? "Blocked — critical issues" : "Minor warnings only";

  return `Primary system type: ${appType?.primary || "Unknown"} (confidence: ${confidenceScore}%). ` +
    `${detected} active module(s) detected. ` +
    `${(missingSystems || []).length} missing system(s) identified. ` +
    `${(riskWarnings || []).length} validation warning(s) — ${critical} critical, ${blocking} blocking. ` +
    `Build readiness: ${readiness}.`;
}

// ── Technical summary ─────────────────────────────────────────
export function generateTechnicalSummary(report) {
  if (!report) return "No report available.";
  const { screens, dataEntities, integrations, backendNeeds, securityNeeds } = report;
  return `${(screens || []).length} screen(s) identified. ` +
    `${(dataEntities || []).length} data entity/ies extracted. ` +
    `${(integrations || []).filter((i) => i.type !== "none").length} integration(s) planned. ` +
    `${(backendNeeds || []).length} backend requirement(s). ` +
    `${(securityNeeds || []).filter((s) => s.status === "active").length} active security control(s).`;
}

// ── Build readiness summary ───────────────────────────────────
export function generateBuildReadinessSummary(report) {
  if (!report) return "No report available.";
  const blocking = (report.riskWarnings || []).filter((w) => w.blocking).length;
  const critical = (report.riskWarnings || []).filter((w) => w.severity === "critical").length;
  const high     = (report.riskWarnings || []).filter((w) => w.severity === "high").length;
  const conf     = report.confidenceScore || 0;

  if (blocking > 0 || critical > 0) return `Not Ready — ${blocking} blocking issue(s), ${critical} critical warning(s) must be resolved first.`;
  if (high > 0)                       return `Buildable With Caution — ${high} high-severity warning(s) should be addressed.`;
  if (conf < 40)                      return `Needs More Data — confidence score is ${conf}%. Add more project detail.`;
  if (conf >= 75)                     return `Ready For Original Build — high confidence, no critical issues.`;
  return `Buildable With Caution — moderate confidence (${conf}%). Review all warnings before starting.`;
}

// ── Format for display ────────────────────────────────────────
export function formatReportForDisplay(report) {
  if (!report) return null;
  return {
    ...report,
    executiveSummary:   generateExecutiveSummary(report),
    technicalSummary:   generateTechnicalSummary(report),
    buildReadinessSummary: generateBuildReadinessSummary(report),
    originalityNotice:  ORIGINALITY_NOTICE,
  };
}

// ── Format for export ─────────────────────────────────────────
export function formatReportForExport(report) {
  if (!report) return null;
  // Strip internal IDs that are implementation-specific
  const { ...clean } = report;
  return {
    ...clean,
    executiveSummary:      generateExecutiveSummary(report),
    technicalSummary:      generateTechnicalSummary(report),
    buildReadinessSummary: generateBuildReadinessSummary(report),
    exportedAt: new Date().toISOString(),
    exportNotice: "Generated by AP3X BUILD CONTROL OS™ Architecture Intelligence. Architecture patterns only. Not a clone blueprint.",
    originalityNotice: ORIGINALITY_NOTICE,
  };
}

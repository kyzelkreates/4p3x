// ============================================================
// AP3X — architectureScoringUtils.js — Run 6
// ============================================================

export function calculateArchitectureCompleteness(report) {
  if (!report) return 0;
  let score = 0;
  if ((report.modules        || []).length > 0) score += 15;
  if ((report.screens        || []).length > 2) score += 15;
  if ((report.dataEntities   || []).length > 0) score += 15;
  if ((report.userJourneys   || []).length > 0) score += 15;
  if ((report.businessRules  || []).length > 0) score += 10;
  if ((report.backendNeeds   || []).length > 0) score += 10;
  if ((report.securityNeeds  || []).length > 0) score += 10;
  if ((report.integrations   || []).length > 0) score += 10;
  return Math.min(score, 100);
}

export function calculateWorkflowClarity(report) {
  if (!report) return 0;
  const journeys = report.userJourneys || [];
  const rules    = report.businessRules || [];
  const screens  = report.screens || [];
  let score = 0;
  if (journeys.length >= 3) score += 40;
  else if (journeys.length > 0) score += 20;
  if (rules.length >= 3) score += 30;
  else if (rules.length > 0) score += 15;
  if (screens.length >= 4) score += 30;
  else if (screens.length > 1) score += 15;
  return Math.min(score, 100);
}

export function calculateDataModelClarity(report) {
  if (!report) return 0;
  const entities = report.dataEntities || [];
  let score = 0;
  const detected = entities.filter((e) => e.source === "detected" || e.source === "run6");
  if (detected.length >= 3) score += 50;
  else if (detected.length > 0) score += 25;
  const withFields = entities.filter((e) => (e.fields || []).length > 2);
  if (withFields.length >= 2) score += 30;
  else if (withFields.length > 0) score += 15;
  if (report.rebuildBlueprint?.dataModelPlan?.relationships?.length > 0) score += 20;
  return Math.min(score, 100);
}

export function calculateOriginalitySafetyScore(report) {
  if (!report) return 0;
  const oCheck = report.originalityCheck;
  if (!oCheck) return 50;
  return oCheck.score || 0;
}

export function calculateBuildReadinessScore(report) {
  if (!report) return 0;
  const warnings = report.riskWarnings || [];
  const blocking = warnings.filter((w) => w.blocking).length;
  const critical = warnings.filter((w) => w.severity === "critical").length;
  const high     = warnings.filter((w) => w.severity === "high").length;
  const medium   = warnings.filter((w) => w.severity === "medium").length;
  const conf     = report.confidenceScore || 0;

  let score = conf;
  score -= blocking * 30;
  score -= critical * 20;
  score -= high     * 10;
  score -= medium   *  5;
  return Math.max(0, Math.min(score, 100));
}

export function calculateImplementationComplexity(report) {
  if (!report) return 50;
  const modules  = (report.modules        || []).length;
  const entities = (report.dataEntities   || []).length;
  const screens  = (report.screens        || []).length;
  const integrations = (report.integrations || []).filter((i) => i.type !== "none").length;
  const missing  = (report.missingSystems  || []).length;

  let score = 20;
  score += modules      * 8;
  score += entities     * 5;
  score += screens      * 4;
  score += integrations * 12;
  score += missing      * 6;
  return Math.min(score, 100);
}

export function calculateOverallRiskLevel(report) {
  if (!report) return { level: "Unknown", score: 0 };
  const warnings = report.riskWarnings || [];
  const blocking = warnings.filter((w) => w.blocking).length;
  const critical = warnings.filter((w) => w.severity === "critical").length;
  const high     = warnings.filter((w) => w.severity === "high").length;
  const conf     = report.confidenceScore || 0;

  if (blocking > 0 || critical > 1) return { level: "Critical", score: 100 };
  if (critical > 0 || high > 2)     return { level: "High",     score: 75 };
  if (high > 0 || conf < 40)        return { level: "Medium",   score: 50 };
  return { level: "Low", score: 25 };
}

export function getBuildReadinessLabel(score) {
  if (score >= 80) return "Ready For Original Build";
  if (score >= 55) return "Buildable With Caution";
  if (score >= 30) return "Needs Work";
  return "Not Ready";
}

export function getAllScores(report) {
  return {
    architectureCompleteness: calculateArchitectureCompleteness(report),
    workflowClarity:          calculateWorkflowClarity(report),
    dataModelClarity:         calculateDataModelClarity(report),
    originalitySafety:        calculateOriginalitySafetyScore(report),
    buildReadiness:           calculateBuildReadinessScore(report),
    implementationComplexity: calculateImplementationComplexity(report),
    riskLevel:                calculateOverallRiskLevel(report),
    buildReadinessLabel:      getBuildReadinessLabel(calculateBuildReadinessScore(report)),
  };
}

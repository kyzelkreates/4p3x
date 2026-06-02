// ============================================================
// AP3X — investorSummaryGenerator.js — Run 8
// Investor/product summary. No fake revenue or market claims.
// ============================================================

import { EXPORT_SAFETY_NOTICE } from "./constants.js";

const FALLBACK = "Insufficient source detail detected. This section should be manually reviewed before investor handoff.";
const CAUTION  = "Note: All forward-looking statements are hypothetical planning scenarios only. No revenue, customer, or market data is implied or guaranteed.";

function safeArr(v) { return Array.isArray(v) && v.length > 0 ? v : []; }

export function createMarketPositioningSummary(report, blueprint) {
  const appType  = report?.appType?.primary || blueprint?.appType || "Application";
  const modules  = safeArr(report?.modules).filter((m) => m.detected).length;
  return `The product operates in the ${appType} category. With ${modules} identified core module(s), ` +
    `the system architecture supports a focused, original solution. Market positioning should be defined through independent market research and validated with target users.`;
}

export function createProductOpportunitySummary(report, blueprint) {
  const missing = safeArr(report?.missingSystems);
  const opp = missing.filter((m) => m.severity !== "high").map((m) => m.system);
  return (
    `The identified architecture provides a foundation for an original ${report?.appType?.primary || "digital"} product. ` +
    `The following areas represent potential differentiation or expansion opportunities: ` +
    (opp.length > 0 ? opp.join(", ") + ". " : "To be defined through product discovery. ") +
    `All product opportunities must be validated with real users before investment in build.`
  );
}

export function createTechnicalMoatSummary(report, blueprint) {
  const modules = safeArr(report?.modules).filter((m) => m.detected);
  const complex = modules.filter((m) => m.confidence > 0.8);
  return (
    `The system demonstrates ${complex.length} high-confidence detected module(s), suggesting a well-defined core. ` +
    `Technical defensibility will depend on original implementation quality, UX execution, and continued iteration. ` +
    `No technical moat is implied by architecture analysis alone.`
  );
}

export function createScalabilitySummary(report, blueprint) {
  const backend = safeArr(report?.backendNeeds);
  const needsDB = backend.some((b) => b.need?.toLowerCase().includes("supabase") || b.need?.toLowerCase().includes("database"));
  return (
    `The architecture supports a local-first initial build with a ${needsDB ? "planned database layer (e.g. Supabase) for multi-user and cloud scalability" : "scalability path to cloud storage when required"}. ` +
    `Horizontal scaling would require a cloud backend, authentication layer, and RLS-based data separation. ` +
    `Scalability estimates should be validated with a senior engineer before committing to infrastructure spend.`
  );
}

export function createDemoNarrative(report, blueprint) {
  const title   = report?.title || blueprint?.title || "Product";
  const journey = safeArr(report?.userJourneys)[0];
  if (!journey) return `${title} demonstrates a structured user workflow. Demo narrative to be developed with product team.`;
  return (
    `Demo narrative for ${title}:\n\n` +
    `A user opens the app and follows a core workflow: ${safeArr(journey.steps).join(" → ")}.\n\n` +
    `This journey demonstrates the core value proposition in under 2 minutes. ` +
    `All demo content should use original data, original branding, and non-proprietary examples.`
  );
}

export function createInvestorRiskSummary(report, blueprint) {
  const warnings = safeArr(report?.riskWarnings);
  const missing  = safeArr(report?.missingSystems).filter((m) => m.severity === "high");
  const highRisk = warnings.filter((w) => w.level === "high");
  if (warnings.length === 0 && missing.length === 0) {
    return "No critical risk areas identified in the architectural analysis. Standard early-stage build and market risks apply.";
  }
  const lines = [
    ...highRisk.map((w) => `• [HIGH] ${w.area}: ${w.warning}`),
    ...missing.map((m)  => `• [CRITICAL MISSING] ${m.system}: ${m.note}`),
    ...warnings.filter((w) => w.level !== "high").map((w) => `• [${(w.level||"").toUpperCase()}] ${w.area}: ${w.warning}`),
  ];
  return `Risk areas to communicate to investors:\n\n${lines.join("\n")}\n\n${CAUTION}`;
}

export function createInvestorSummary(report, blueprint) {
  const title   = report?.title || blueprint?.title || "Product Architecture Summary";
  const appType = report?.appType?.primary || blueprint?.appType || "Application";
  const score   = report?.readinessScore || blueprint?.readinessScore || 0;
  const modules = safeArr(report?.modules).filter((m) => m.detected).length;
  const screens = safeArr(report?.screens).length;
  const entities= safeArr(report?.dataEntities).length;

  return {
    title,
    appType,
    buildReadinessScore:   score,
    modulesDetected:       modules,
    screensIdentified:     screens,
    dataEntitiesIdentified:entities,
    executiveHeadline:     `${title} — ${appType} architecture analysis and original build readiness overview.`,
    marketPositioning:     createMarketPositioningSummary(report, blueprint),
    productOpportunity:    createProductOpportunitySummary(report, blueprint),
    technicalMoat:         createTechnicalMoatSummary(report, blueprint),
    scalability:           createScalabilitySummary(report, blueprint),
    demoNarrative:         createDemoNarrative(report, blueprint),
    riskSummary:           createInvestorRiskSummary(report, blueprint),
    caution:               CAUTION,
    safetyNotice:          EXPORT_SAFETY_NOTICE,
    disclaimer:            "This summary is generated from abstract architectural pattern analysis. It does not constitute investment advice, financial projections, or market research. All figures and opportunities are hypothetical.",
  };
}

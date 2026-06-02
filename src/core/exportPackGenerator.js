// ============================================================
// AP3X — exportPackGenerator.js — Run 8
// Central export pack generator. Works with report-only,
// blueprint-only, or report + blueprint.
// ============================================================

import { createId } from "./storage.js";
import { EXPORT_SAFETY_NOTICE } from "./constants.js";
import { createClientReadyReport }   from "./clientReportGenerator.js";
import { createInvestorSummary }     from "./investorSummaryGenerator.js";
import { createDeveloperBrief }      from "./developerBriefGenerator.js";

const FALLBACK = "Insufficient source detail detected. This section should be manually reviewed before client or developer handoff.";

function safeArr(v) { return Array.isArray(v) && v.length > 0 ? v : []; }
function scoreLabel(s) { return s >= 80 ? "High" : s >= 55 ? "Medium" : "Needs Work"; }
function riskLevel(warnings) {
  const high = safeArr(warnings).filter((w) => w.level === "high").length;
  const med  = safeArr(warnings).filter((w) => w.level === "medium").length;
  return high > 0 ? "High" : med > 1 ? "Medium" : "Low";
}

// ── Risk Scorecard ────────────────────────────────────────────
export function generateRiskScorecard(report, blueprint) {
  const modules  = safeArr(report?.modules).filter((m) => m.detected).length;
  const total    = safeArr(report?.modules).length;
  const entities = safeArr(report?.dataEntities).length;
  const screens  = safeArr(report?.screens).length;
  const warnings = safeArr(report?.riskWarnings);
  const missing  = safeArr(report?.missingSystems);
  const hasBlueprint = !!blueprint;

  const archCompleteness  = total > 0 ? Math.round((modules / total) * 100) : 50;
  const dataClarity       = entities > 0 ? Math.min(100, entities * 12) : 30;
  const workflowClarity   = safeArr(report?.userJourneys).length > 0 ? 80 : 40;
  const buildReadiness    = report?.readinessScore || blueprint?.readinessScore || 50;
  const origSafety        = report?.originalityCheckResult?.score || 90;
  const implComplexity    = Math.max(10, 100 - (modules * 8));
  const overallRisk       = warnings.filter((w) => w.level === "high").length > 0 ? "High"
    : missing.filter((m) => m.severity === "high").length > 0 ? "High"
    : warnings.filter((w) => w.level === "medium").length > 1 ? "Medium" : "Low";

  return {
    architectureCompleteness: { score: archCompleteness, label: scoreLabel(archCompleteness), note: `${modules}/${total} modules detected` },
    dataClarity:              { score: dataClarity,       label: scoreLabel(dataClarity),      note: `${entities} data entities identified` },
    workflowClarity:          { score: workflowClarity,   label: scoreLabel(workflowClarity),  note: safeArr(report?.userJourneys).length > 0 ? "User journeys detected" : "No journeys detected" },
    buildReadiness:           { score: buildReadiness,    label: scoreLabel(buildReadiness),   note: hasBlueprint ? "Blueprint compiled" : "Blueprint not yet compiled" },
    originalitySafety:        { score: origSafety,        label: scoreLabel(origSafety),       note: "Abstract patterns only" },
    implementationComplexity: { score: implComplexity,    label: implComplexity > 70 ? "Complex" : "Moderate", note: `${modules} core modules, ${screens} screens` },
    overallRisk:              overallRisk,
    warningCount:             warnings.length,
    missingSystemCount:       missing.length,
    recommendation:           overallRisk === "High"
      ? "Address high-risk items before committing to a full build timeline."
      : overallRisk === "Medium"
      ? "Review medium-risk areas with your development team before sprint planning."
      : "Architecture is in good shape. Proceed with implementation planning.",
  };
}

// ── Originality safety report ─────────────────────────────────
export function generateOriginalitySafetyReport(report, blueprint) {
  const score   = report?.originalityCheckResult?.score || 100;
  const passed  = report?.originalityCheckResult?.passed !== false;
  return {
    score,
    passed,
    status:       passed ? "SAFE" : "REVIEW REQUIRED",
    safetyNotice: EXPORT_SAFETY_NOTICE,
    mustUse: [
      "Original branding and product name",
      "Original UI design and layout",
      "Original copy and content",
      "Original assets, icons, and images",
      "Lawful and authorised data sources",
    ],
    mustNotUse: [
      "Proprietary UI copied pixel-for-pixel",
      "Copyrighted logos, icons, or visual assets",
      "CSS variables or design tokens from the source",
      "Protected source code",
      "Platform-restricted data",
    ],
    useFor: [
      "Abstract workflow patterns",
      "Data model structure inspiration",
      "Feature category understanding",
      "Component responsibility planning",
    ],
    legalNote: "This analysis does not constitute legal advice. Consult a qualified IP attorney before public product launch.",
  };
}

// ── Implementation roadmap ────────────────────────────────────
export function generateImplementationRoadmap(report, blueprint) {
  const runs  = safeArr(blueprint?.implementationRuns);
  const score = report?.readinessScore || blueprint?.readinessScore || 0;
  return {
    totalRuns:       runs.length,
    estimatedPhases: runs.length > 0 ? Math.ceil(runs.length / 2) : 5,
    buildReadiness:  score,
    readinessLabel:  scoreLabel(score),
    phases: runs.length > 0
      ? runs.map((r) => ({
          phase:   r.runNumber,
          title:   r.title,
          mission: r.mission,
          gates:   safeArr(r.validationGates).slice(0, 3),
          depends: safeArr(r.dependsOn),
        }))
      : [
          { phase:1, title:"Core Foundation",        mission:"App shell, SSOT, navigation, PWA manifest.",        gates:["App loads","Navigation works","State persists"],     depends:[] },
          { phase:2, title:"Primary Data Module",    mission:"First CRUD module with filters and import/export.", gates:["CRUD works","Filters work","JSON export works"],    depends:[1] },
          { phase:3, title:"Secondary Modules",      mission:"Remaining core modules and business logic.",        gates:["All modules work","No regressions"],                depends:[1,2] },
          { phase:4, title:"Intelligence Layer",     mission:"Validation, risk scoring, report generation.",      gates:["Reports generate","Risk scores show","Exports work"],depends:[1,2,3] },
          { phase:5, title:"Auth + Deploy",          mission:"Supabase auth, RLS, production deployment.",        gates:["Auth works","RLS configured","Build deploys"],       depends:[1,2,3,4] },
        ],
    completionCriteria: [
      "All run validation gates pass",
      "No console errors in production build",
      "Lighthouse score ≥ 80",
      "All acceptance tests pass",
      "Original branding and assets in place",
      "Privacy policy and legal pages present",
    ],
  };
}

// ── Build prompt pack ─────────────────────────────────────────
export function generateBuildPromptPack(report, blueprint) {
  const prompt = blueprint?.generatedBuildPrompt || "";
  return {
    hasPrompt: prompt.length > 0,
    prompt:    prompt || "No build prompt available. Generate a blueprint in the Blueprint Builder to produce a build prompt.",
    note:      "This prompt is ready to paste into your AI-assisted build tool (Manus, Base44, Cursor, Super Agent, or developer handoff).",
    safetyNotice: EXPORT_SAFETY_NOTICE,
  };
}

// ── Markdown output ───────────────────────────────────────────
export function generateMarkdownOutput(exportPack) {
  if (!exportPack) return "# No export pack available\n";
  const p    = exportPack;
  const cr   = p.clientReport    || {};
  const inv  = p.investorSummary || {};
  const dev  = p.developerBrief  || {};
  const risk = p.riskScorecard   || {};
  const road = p.implementationRoadmap || {};

  let md = `# 4P3X App Architecture Extractor — Export Pack\n\n`;
  md += `**Created by:** Kyzel Kreates  \n`;
  md += `**Generated:** ${new Date().toLocaleString()}  \n`;
  md += `**Pack ID:** ${p.id}  \n\n---\n\n`;

  md += `## Export Summary\n\n`;
  md += `- **Title:** ${p.title}  \n`;
  md += `- **App Type:** ${cr.appType || inv.appType || "Unknown"}  \n`;
  md += `- **Build Readiness:** ${cr.buildReadinessScore || 0}% (${cr.buildReadinessLabel || "—"})  \n`;
  md += `- **Overall Risk:** ${risk.overallRisk || "—"}  \n\n---\n\n`;

  md += `## Client-Ready Architecture Report\n\n`;
  md += `### Executive Summary\n\n${cr.executiveSummary || "—"}\n\n`;
  md += `### Architecture Overview\n\n${cr.architectureOverview || "—"}\n\n`;
  md += `### Risk Summary\n\n${cr.riskSummary || "—"}\n\n`;
  md += `### Recommendations\n\n${safeArr(cr.recommendations).map((r) => `- ${r}`).join("\n")}\n\n`;
  md += `### Next Steps\n\n${safeArr(cr.nextSteps).map((s) => `- ${s}`).join("\n")}\n\n---\n\n`;

  md += `## Investor Product Summary\n\n`;
  md += `### Market Positioning\n\n${inv.marketPositioning || "—"}\n\n`;
  md += `### Product Opportunity\n\n${inv.productOpportunity || "—"}\n\n`;
  md += `### Scalability\n\n${inv.scalability || "—"}\n\n`;
  md += `### Demo Narrative\n\n${inv.demoNarrative || "—"}\n\n`;
  md += `> ${inv.caution || ""}\n\n---\n\n`;

  md += `## Developer Build Brief\n\n`;
  if (dev.technicalScope) {
    md += `**App Type:** ${dev.technicalScope.appType}  \n`;
    md += `**Local-First:** ${dev.technicalScope.localFirst}  \n`;
    md += `**SSOT:** ${dev.technicalScope.ssotRequired}  \n`;
    md += `**Deploy Target:** ${dev.technicalScope.deployTarget}  \n\n`;
  }
  if (safeArr(dev.folderStructure).length > 0) {
    md += `### Folder Structure\n\n\`\`\`\n${dev.folderStructure.join("\n")}\n\`\`\`\n\n`;
  }
  md += `### State & Data\n\n`;
  if (dev.stateDataBrief) {
    md += `- SSOT File: \`${dev.stateDataBrief.ssotFile}\`\n`;
    md += `- Mutations: ${dev.stateDataBrief.mutations}\n\n`;
  }
  md += `---\n\n`;

  md += `## Risk Scorecard\n\n`;
  if (risk.architectureCompleteness) {
    md += `| Area | Score | Label |\n|---|---|---|\n`;
    md += `| Architecture Completeness | ${risk.architectureCompleteness.score}% | ${risk.architectureCompleteness.label} |\n`;
    md += `| Data Clarity | ${risk.dataClarity?.score || 0}% | ${risk.dataClarity?.label || "—"} |\n`;
    md += `| Build Readiness | ${risk.buildReadiness?.score || 0}% | ${risk.buildReadiness?.label || "—"} |\n`;
    md += `| Originality Safety | ${risk.originalitySafety?.score || 0}% | ${risk.originalitySafety?.label || "—"} |\n`;
    md += `\n**Overall Risk: ${risk.overallRisk}**\n\n`;
    md += `${risk.recommendation}\n\n`;
  }
  md += `---\n\n`;

  md += `## Originality & Legal Safety Notice\n\n`;
  md += `> ${EXPORT_SAFETY_NOTICE}\n\n---\n\n`;

  md += `## Implementation Roadmap\n\n`;
  safeArr(road.phases).forEach((ph) => {
    md += `### Phase ${ph.phase} — ${ph.title}\n\n${ph.mission}\n\n`;
    if (safeArr(ph.gates).length > 0) md += `Gates: ${ph.gates.join(", ")}\n\n`;
  });
  md += `---\n\n`;

  md += `## Build Prompt Pack\n\n`;
  md += `\`\`\`\n${p.buildPromptPack?.prompt || "No build prompt available."}\n\`\`\`\n\n---\n\n`;

  md += `## Final Recommendation\n\n`;
  md += `${risk.recommendation || "Review all sections and proceed with implementation planning."}\n\n`;
  md += `---\n\n`;
  md += `*Generated by AP3X BUILD CONTROL OS™ Export Centre — Run 8.*  \n`;
  md += `*Original implementation required. Architecture patterns only.*\n`;
  return md;
}

// ── JSON output ───────────────────────────────────────────────
export function generateJSONOutput(exportPack) {
  const STRIP = ["apiKey","api_key","token","secret","password","privateKey","private_key","accessToken","access_token","refreshToken","refresh_token","clientSecret","client_secret"];
  function strip(obj) {
    if (!obj || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(strip);
    const out = {};
    Object.entries(obj).forEach(([k, v]) => {
      out[k] = STRIP.includes(k) ? "[REDACTED]" : typeof v === "object" ? strip(v) : v;
    });
    return out;
  }
  return JSON.stringify(strip(exportPack), null, 2);
}

// ── Print output ──────────────────────────────────────────────
export function generatePrintOutput(exportPack) {
  return exportPack ? `Print-ready output for: ${exportPack.title}` : "";
}

// ── Validate ─────────────────────────────────────────────────
export function validateExportPack(exportPack) {
  const issues = [];
  if (!exportPack?.id)           issues.push("Missing export pack ID.");
  if (!exportPack?.clientReport) issues.push("Missing client report.");
  if (!exportPack?.riskScorecard)issues.push("Missing risk scorecard.");
  const md = exportPack?.markdownOutput || "";
  if (!md.includes("Originality"))issues.push("Missing originality safety notice in markdown.");
  return { valid: issues.length === 0, issues };
}

// ── Main entry ────────────────────────────────────────────────
export function generateExportPack(report, blueprint, settings = {}) {
  const now     = new Date().toISOString();
  const title   = [report?.title, blueprint?.title].filter(Boolean).join(" + ") || "Architecture Export Pack";

  const clientReport      = generateClientReport(report, blueprint, settings);
  const investorSummary   = generateInvestorSummary(report, blueprint, settings);
  const developerBrief    = generateDeveloperBrief(report, blueprint, settings);
  const riskScorecard     = generateRiskScorecard(report, blueprint);
  const originalitySafetyReport = generateOriginalitySafetyReport(report, blueprint);
  const implementationRoadmap   = generateImplementationRoadmap(report, blueprint);
  const buildPromptPack         = generateBuildPromptPack(report, blueprint);

  const pack = {
    id:                   createId("export"),
    sourceReportId:       report?.id    || null,
    sourceBlueprintId:    blueprint?.id || null,
    title,
    exportType:           report && blueprint ? "full" : report ? "report-only" : "blueprint-only",
    clientReport,
    investorSummary,
    developerBrief,
    riskScorecard,
    originalitySafetyReport,
    implementationRoadmap,
    buildPromptPack,
    markdownOutput: "",
    jsonOutput:     "",
    printOutput:    "",
    createdAt:      now,
    updatedAt:      now,
  };

  pack.markdownOutput = generateMarkdownOutput(pack);
  pack.jsonOutput     = generateJSONOutput(pack);
  pack.printOutput    = generatePrintOutput(pack);
  return pack;
}

// Wrappers
export function generateClientReport(report, blueprint, settings) {
  return settings?.includeClientReport !== false ? createClientReadyReport(report, blueprint) : null;
}
export function generateInvestorSummary(report, blueprint, settings) {
  return settings?.includeInvestorSummary !== false ? createInvestorSummary(report, blueprint) : null;
}
export function generateDeveloperBrief(report, blueprint, settings) {
  return settings?.includeDeveloperBrief !== false ? createDeveloperBrief(report, blueprint) : null;
}

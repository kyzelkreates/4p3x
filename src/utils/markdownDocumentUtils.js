// ============================================================
// AP3X — markdownDocumentUtils.js — Run 8
// ============================================================
export { generateMarkdownOutput as buildFullMarkdownPack } from "../core/exportPackGenerator.js";

import { EXPORT_SAFETY_NOTICE } from "../core/constants.js";
function safeArr(v) { return Array.isArray(v) && v.length > 0 ? v : []; }

export function buildClientReportMarkdown(exportPack) {
  const cr = exportPack?.clientReport;
  if (!cr) return "# Client Report\n\nNo client report available.\n";
  let md = `# Client-Ready Architecture Report\n\n**${cr.title}**\n\n`;
  md += `## Executive Summary\n\n${cr.executiveSummary || "—"}\n\n`;
  md += `## Architecture Overview\n\n${cr.architectureOverview || "—"}\n\n`;
  md += `## Risk Summary\n\n${cr.riskSummary || "—"}\n\n`;
  md += `## Recommendations\n\n${safeArr(cr.recommendations).map((r) => `- ${r}`).join("\n")}\n\n`;
  md += `## Next Steps\n\n${safeArr(cr.nextSteps).map((s) => `- ${s}`).join("\n")}\n\n`;
  md += `---\n\n> ${EXPORT_SAFETY_NOTICE}\n`;
  return md;
}

export function buildInvestorSummaryMarkdown(exportPack) {
  const inv = exportPack?.investorSummary;
  if (!inv) return "# Investor Summary\n\nNo investor summary available.\n";
  let md = `# Investor Product Summary\n\n**${inv.title}**\n\n`;
  md += `## Market Positioning\n\n${inv.marketPositioning || "—"}\n\n`;
  md += `## Product Opportunity\n\n${inv.productOpportunity || "—"}\n\n`;
  md += `## Scalability\n\n${inv.scalability || "—"}\n\n`;
  md += `## Demo Narrative\n\n${inv.demoNarrative || "—"}\n\n`;
  md += `> ${inv.caution || ""}\n\n---\n\n> ${EXPORT_SAFETY_NOTICE}\n`;
  return md;
}

export function buildDeveloperBriefMarkdown(exportPack) {
  const dev = exportPack?.developerBrief;
  if (!dev) return "# Developer Brief\n\nNo developer brief available.\n";
  let md = `# Developer Build Brief\n\n**${dev.title}**\n\n`;
  if (dev.technicalScope) {
    md += `## Technical Scope\n\n`;
    md += `- App Type: ${dev.technicalScope.appType}\n`;
    md += `- Local-First: ${dev.technicalScope.localFirst}\n`;
    md += `- Deploy Target: ${dev.technicalScope.deployTarget}\n\n`;
  }
  if (safeArr(dev.folderStructure).length > 0) {
    md += `## Folder Structure\n\n\`\`\`\n${dev.folderStructure.join("\n")}\n\`\`\`\n\n`;
  }
  md += `---\n\n> ${EXPORT_SAFETY_NOTICE}\n`;
  return md;
}

export function buildRiskScorecardMarkdown(exportPack) {
  const risk = exportPack?.riskScorecard;
  if (!risk) return "# Risk Scorecard\n\nNo risk data available.\n";
  let md = `# Risk Scorecard\n\n`;
  md += `**Overall Risk: ${risk.overallRisk}**\n\n`;
  md += `| Area | Score | Label |\n|---|---|---|\n`;
  const areas = ["architectureCompleteness","dataClarity","workflowClarity","buildReadiness","originalitySafety"];
  areas.forEach((a) => {
    if (risk[a]) md += `| ${a.replace(/([A-Z])/g," $1").trim()} | ${risk[a].score}% | ${risk[a].label} |\n`;
  });
  md += `\n${risk.recommendation}\n`;
  return md;
}

export function buildOriginalitySafetyMarkdown(exportPack) {
  const osr = exportPack?.originalitySafetyReport;
  let md = `# Originality & Legal Safety Report\n\n`;
  md += `**Status:** ${osr?.status || "SAFE"}  \n`;
  md += `**Score:** ${osr?.score || 100}/100\n\n`;
  md += `> ${EXPORT_SAFETY_NOTICE}\n\n`;
  md += `## Must Use\n\n${safeArr(osr?.mustUse).map((i)=>`- ${i}`).join("\n")}\n\n`;
  md += `## Must Not Use\n\n${safeArr(osr?.mustNotUse).map((i)=>`- ${i}`).join("\n")}\n\n`;
  md += `## Use For\n\n${safeArr(osr?.useFor).map((i)=>`- ${i}`).join("\n")}\n`;
  return md;
}

export function buildImplementationRoadmapMarkdown(exportPack) {
  const road = exportPack?.implementationRoadmap;
  if (!road) return "# Implementation Roadmap\n\nNo roadmap available.\n";
  let md = `# Implementation Roadmap\n\n`;
  md += `**Total Phases:** ${road.totalRuns || 0}  \n`;
  md += `**Build Readiness:** ${road.buildReadiness || 0}% (${road.readinessLabel || "—"})\n\n`;
  safeArr(road.phases).forEach((ph) => {
    md += `## Phase ${ph.phase} — ${ph.title}\n\n${ph.mission}\n\n`;
    if (safeArr(ph.gates).length > 0) md += `Gates: ${ph.gates.join(" | ")}\n\n`;
  });
  return md;
}

export function buildBuildPromptPackMarkdown(exportPack) {
  const bp = exportPack?.buildPromptPack;
  if (!bp?.hasPrompt) return "# Build Prompt Pack\n\nNo build prompt available. Generate a blueprint first.\n";
  return `# Build Prompt Pack\n\n\`\`\`\n${bp.prompt}\n\`\`\`\n\n> ${EXPORT_SAFETY_NOTICE}\n`;
}

// ============================================================
// AP3X — blueprintExportUtils.js — Run 7
// ============================================================

import { ORIGINALITY_SAFETY_NOTICE } from "../core/constants.js";

const STRIP_FIELDS = ["apiKey","api_key","token","secret","password","privateKey","private_key","accessToken","access_token","refreshToken","refresh_token","clientSecret","client_secret"];

function stripSecrets(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(stripSecrets);
  const out = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (STRIP_FIELDS.includes(k)) { out[k] = "[REDACTED]"; }
    else out[k] = typeof v === "object" ? stripSecrets(v) : v;
  });
  return out;
}

export function exportBlueprintAsJSON(blueprint) {
  return JSON.stringify(stripSecrets(blueprint), null, 2);
}

export function exportBlueprintAsMarkdown(blueprint) {
  if (!blueprint) return "# No blueprint available\n";
  const b = blueprint;
  const h1 = (t) => `# ${t}\n`;
  const h2 = (t) => `\n## ${t}\n`;
  const h3 = (t) => `\n### ${t}\n`;
  const li  = (t) => `- ${t}`;
  const br  = () => "\n---\n";

  let md = "";
  md += h1("Original App Blueprint");
  md += `**Generated:** ${new Date().toLocaleString()}  \n`;
  md += `**App Type:** ${b.appType || "Unknown"}  \n`;
  md += `**Original App Name Suggestion:** ${b.originalAppName || "TBD"}  \n`;
  md += `**Readiness Score:** ${b.readinessScore || 0}%  \n`;
  md += br();

  md += h2("Product Summary");
  md += (b.productSummary || "TBD") + "\n";

  md += h2("Target Users");
  (b.targetUsers || []).forEach((u) => { md += li(u) + "\n"; });

  md += h2("Core Modules");
  (b.coreModules || []).forEach((m) => {
    md += li(`**${m.name}** (${m.detected?"detected":"inferred"}) — ${m.description}`) + "\n";
  });

  md += h2("Page Plan");
  (b.pagePlan || []).forEach((p) => {
    md += h3(p.name);
    md += `Purpose: ${p.purpose}  \n`;
    md += `Components: ${(p.mainComponents||[]).join(", ")}  \n`;
    md += `States: ${(p.uiStates||[]).join(", ")}  \n`;
  });

  md += h2("Component Plan");
  (b.componentPlan || []).slice(0, 10).forEach((c) => {
    md += li(`**${c.name}** [${c.type}] — ${c.responsibility}`) + "\n";
  });
  if ((b.componentPlan||[]).length > 10) md += li(`+${b.componentPlan.length - 10} more components`) + "\n";

  md += h2("Data Model Plan");
  md += `Storage: ${b.dataModelPlan?.storageStrategy || "localStorage SSOT"}  \n`;
  (b.dataModelPlan?.entities || []).forEach((e) => {
    md += h3(e.name);
    md += `Fields: ${(e.fields||[]).join(", ")}  \n`;
  });

  md += h2("State Management Plan");
  if (b.stateManagementPlan) {
    md += li(`Pattern: ${b.stateManagementPlan.pattern}`) + "\n";
    md += li(`File: ${b.stateManagementPlan.storeFile}`) + "\n";
    md += li(`Key: ${b.stateManagementPlan.storeKey}`) + "\n";
  }

  md += h2("UX Flow Plan");
  md += li(`Navigation: ${b.uxFlowPlan?.navigationPattern || "Sidebar SPA"}`) + "\n";
  md += li(`Forms: ${b.uxFlowPlan?.formPattern || "Validate before save"}`) + "\n";
  (b.uxFlowPlan?.journeys || []).forEach((j) => {
    md += h3(j.name);
    (j.steps||[]).forEach((s) => { md += li(s) + "\n"; });
  });

  md += h2("Business Logic Plan");
  (b.businessLogicPlan?.coreRules || []).forEach((r) => {
    md += li(`**${r.rule}** → ${r.file}`) + "\n";
  });

  md += h2("API / Integration Boundary");
  md += `Current: ${b.apiBoundaryPlan?.currentBoundary || "None"}  \n`;
  (b.apiBoundaryPlan?.plannedIntegrations || []).forEach((i) => {
    md += li(`${i.name} [Run ${i.plannedRun}] — ${i.note}`) + "\n";
  });

  md += h2("Admin / User Separation");
  md += b.adminUserSeparationPlan?.currentSeparation + "\n";
  (b.adminUserSeparationPlan?.roles||[]).forEach((r) => {
    md += li(`**${r.role}**: ${r.access}`) + "\n";
  });

  md += h2("Validation Plan");
  (b.validationStatePlan?.statesRequired||[]).forEach((s) => { md += li(s) + "\n"; });

  md += h2("Accessibility Plan");
  md += `Target: ${b.accessibilityPlan?.targetStandard}  \n`;
  (b.accessibilityPlan?.requirements||[]).forEach((r) => { md += li(r) + "\n"; });

  md += h2("Mobile / PWA Plan");
  (b.mobilePlan?.mobilePatterns||[]).forEach((p) => { md += li(p) + "\n"; });
  if (b.pwaPlan) { md += li(`Service Worker: ${b.pwaPlan.serviceWorker}`) + "\n"; }

  md += h2("Deployment Plan");
  if (b.deploymentPlan) {
    md += li(`Target: ${b.deploymentPlan.target}`) + "\n";
    md += li(`Build: ${b.deploymentPlan.buildCommand}`) + "\n";
  }

  md += h2("Security / Privacy Plan");
  (b.securityPrivacyPlan?.currentControls||[]).forEach((c) => { md += li(c) + "\n"; });

  md += h2("Implementation Runs");
  (b.implementationRuns||[]).forEach((r) => {
    md += h3(`Run ${r.runNumber} — ${r.title}`);
    md += `Mission: ${r.mission}  \n`;
    if ((r.dependsOn||[]).length > 0) md += `Depends on: Run ${r.dependsOn.join(", ")}  \n`;
    md += `Validation Gates:\n`;
    (r.validationGates||[]).forEach((g) => { md += li(g) + "\n"; });
  });

  md += h2("Build Prompt");
  md += "```\n" + (b.generatedBuildPrompt || "Generate a build prompt first.") + "\n```\n";

  md += h2("Originality Safety Notice");
  md += `> ${ORIGINALITY_SAFETY_NOTICE}\n`;

  md += br();
  md += `*Generated by AP3X BUILD CONTROL OS™ Blueprint Builder — Run 7.*\n`;
  md += `*Original implementation required. Architecture patterns only.*\n`;

  return md;
}

export async function copyBlueprintToClipboard(blueprint, format = "json") {
  const text = format === "markdown" ? exportBlueprintAsMarkdown(blueprint) : exportBlueprintAsJSON(blueprint);
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return { success: true };
    }
    const el = document.createElement("textarea");
    el.value = text; el.style.position = "fixed"; el.style.opacity = "0";
    document.body.appendChild(el); el.focus(); el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return { success: ok, fallback: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export function downloadBlueprintFile(blueprint, format = "json") {
  try {
    const text = format === "markdown" ? exportBlueprintAsMarkdown(blueprint) : exportBlueprintAsJSON(blueprint);
    const mime = format === "markdown" ? "text/markdown" : "application/json";
    const ext  = format === "markdown" ? "md" : "json";
    const name = `ap3x-blueprint-${Date.now()}.${ext}`;
    const blob = new Blob([text], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 500);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export async function copyBuildPromptToClipboard(prompt) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(prompt || "");
      return { success: true };
    }
    const el = document.createElement("textarea");
    el.value = prompt || ""; el.style.position = "fixed"; el.style.opacity = "0";
    document.body.appendChild(el); el.focus(); el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return { success: ok, fallback: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

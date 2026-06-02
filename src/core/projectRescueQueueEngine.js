// ============================================================
// AP3X — projectRescueQueueEngine.js — Run 10
// ============================================================
import { EXPORT_SAFETY_NOTICE } from "./constants.js";

export function generateRescuePriority(project) {
  let score = 50;
  if (project?.portfolioValue === "High")      score += 20;
  if (project?.clientValue)                    score += 10;
  if (project?.status === "Broken")            score += 15;
  if ((project?.completionScore||0) >= 60)     score += 15; // nearly complete = easy win
  if ((project?.completionScore||0) < 20)      score -= 10; // very early
  if ((project?.healthScore||0)     >= 70)     score += 10;
  if (project?.duplicateRisk)                  score -= 20;
  if (project?.status === "Stale")             score += 5;
  if (project?.status === "Archived")          score  = 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function generateNextAction(project) {
  if (!project) return "Review manually";
  if (project.readyForExtraction)          return "Send to Architecture Extractor";
  if (project.status === "Broken")         return "Create Fix-Only Prompt";
  if (project.duplicateRisk)               return "Archive duplicate";
  if (project.status === "Stale")          return "Review manually";
  if (!project.linkedDeployment)           return "Reconnect deployment";
  if ((project.detectedFiles||[]).length===0) return "Upload ZIP for deeper scan";
  return "Run Product Readiness Check";
}

export function generateSafeFinishPlan(project) {
  const missing = project?.missingSystems || [];
  const stack   = (project?.detectedStack||[]).join(", ") || "Unknown";
  return {
    projectTitle:   project?.title || "Unnamed Project",
    currentStatus:  project?.status || "Unknown",
    healthScore:    project?.healthScore || 0,
    completionScore:project?.completionScore || 0,
    detectedStack:  stack,
    missingSystems: missing,
    finishSteps:    [
      missing.includes("Pages / Screens")   ? "Map all screens and user flows."   : null,
      missing.includes("Routing")           ? "Define and document all routes."   : null,
      missing.includes("Detected Stack")    ? "Clarify tech stack and entry point.": null,
      missing.includes("Deployment URL")    ? "Connect or create deployment target.": null,
      missing.includes("Config Files")      ? "Add package.json / build config."  : null,
      missing.includes("Repository Link")   ? "Link or create repository."        : null,
      (project?.completionScore||0) < 60    ? "Run Architecture Extraction to map remaining structure." : null,
    ].filter(Boolean),
    recommendedRun: project?.readyForExtraction ? "Architecture Extractor" : "Manual Review First",
    safetyNotice:   EXPORT_SAFETY_NOTICE,
  };
}

export function generateFixOnlyPromptForProject(project) {
  const missing = (project?.missingSystems||[]).join(", ") || "None detected";
  const stack   = (project?.detectedStack||[]).join(", ") || "Unknown";
  return `⛔ STRICT ENFORCEMENT RULES — READ FIRST

YOU ARE IN FIX-ONLY BUILD COMPILER MODE.

PROJECT IDENTITY:
${project?.title || "Unnamed Project"}
Source: ${project?.sourceType || "Unknown"}
Stack: ${stack}
Status: ${project?.status || "Unknown"}
Health Score: ${project?.healthScore || 0}/100
Completion Score: ${project?.completionScore || 0}/100

CURRENT KNOWN STATE:
- Detected Stack: ${stack}
- Detected Framework: ${project?.detectedFramework || "Unknown"}
- Missing Systems: ${missing}
- Deployment: ${project?.linkedDeployment || "None"}
- Repo: ${project?.linkedRepo || "None"}

MISSION:
Fix only what is missing or broken. Do NOT rebuild working systems.
Do NOT rewrite working logic. Do NOT start from scratch.

ALLOWED:
- Add identified missing systems
- Fix broken imports or config
- Add missing config files
- Fix deployment configuration
- Reconnect missing data flows

FORBIDDEN:
- Do NOT rebuild existing working systems
- Do NOT copy proprietary UI, branding, or protected assets
- Do NOT export secrets, tokens, or API keys
- Do NOT clone third-party apps
- Do NOT delete files unless clearly broken stubs
- Do NOT start a new project

VALIDATION GATES:
- App must still load after changes
- Existing working features must remain intact
- No new external dependencies unless explicitly required
- No secrets in exported files

STOP CONDITIONS:
Stop immediately if:
- Fix requires a full rebuild
- Fix requires copying protected content
- Fix requires secret/credential access
- Fix would break working systems

ROLLBACK:
Revert all changes if any validation gate fails.

${EXPORT_SAFETY_NOTICE}

---
Directive 1: Adapt the skill set to the task. Include full folder structure, program code, logic code, transition code, UI logic, UI code, and HTML/JSX where required. Preserve SSOT, prevent feature creep, and protect working systems.`;
}

export function generateExtractionRecommendation(project) {
  if (project?.readyForExtraction) return "Project has sufficient metadata for Architecture Extraction. Send to extractor.";
  if ((project?.completionScore||0) < 30) return "Project has very little data. Add more details (stack, pages, URL) before extracting.";
  return "Project has partial data. Extraction will work but results will be limited. Consider uploading ZIP or adding URL.";
}

export function prioritiseRescueQueue(projects, queueIds) {
  return (queueIds||[])
    .map((id) => (projects||[]).find((p)=>p.id===id))
    .filter(Boolean)
    .map((p) => ({ ...p, rescuePriority: generateRescuePriority(p), nextAction: generateNextAction(p) }))
    .sort((a,b) => b.rescuePriority - a.rescuePriority);
}

export function addToRescueQueue(id) { return id; } // actual mutation via storage helper
export function removeFromRescueQueue(id) { return id; }

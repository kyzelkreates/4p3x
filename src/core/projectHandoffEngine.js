// ============================================================
// AP3X — projectHandoffEngine.js — Run 10
// ============================================================
import { createId } from "./storage.js";
import { EXPORT_SAFETY_NOTICE } from "./constants.js";
import { generateSafeFinishPlan, generateFixOnlyPromptForProject } from "./projectRescueQueueEngine.js";
import { validateSafeDiscoveryOutput } from "./projectDiscoverySafetyEngine.js";

export function createExtractorInputFromProject(project) {
  return {
    id:                        createId("handoff"),
    projectId:                 project?.id,
    title:                     project?.title || "Unnamed Project",
    sourceSummary:             `Source: ${project?.sourceType||"Manual"} | Status: ${project?.status||"Unknown"}`,
    detectedStack:             project?.detectedStack || [],
    detectedFramework:         project?.detectedFramework || "Unknown",
    detectedFiles:             project?.detectedFiles || [],
    detectedPages:             project?.detectedPages || [],
    detectedRoutes:            project?.detectedRoutes || [],
    detectedComponents:        project?.detectedComponents || [],
    detectedDataModels:        [],
    missingSystems:            project?.missingSystems || [],
    healthSummary:             `Health: ${project?.healthScore||0}/100 | Completion: ${project?.completionScore||0}/100 | Risk: ${project?.riskLevel||"Unknown"}`,
    recommendedExtractionFocus:project?.missingSystems?.length>0 ? `Focus on: ${project.missingSystems.slice(0,3).join(", ")}` : "Full architecture extraction.",
    safetyWarnings:            project?.safetyWarnings || [],
    createdAt:                 new Date().toISOString(),
  };
}

export function createDiscoveryToExtractorHandoff(project) {
  const handoff = createExtractorInputFromProject(project);
  const safety  = validateSafeDiscoveryOutput(handoff);
  if (!safety.safe) handoff.safetyWarnings = [...(handoff.safetyWarnings||[]), `⚠ Output contains potential risks: ${safety.risks.join(", ")} — review before extraction.`];
  return handoff;
}

export function sendProjectToArchitectureExtractor(project) {
  const handoff = createDiscoveryToExtractorHandoff(project);
  return { success: true, handoff, message: `Project "${project?.title}" prepared for Architecture Extractor. Handoff ID: ${handoff.id}` };
}

export function createProjectRescueBrief(project) {
  return {
    title:          `Rescue Brief — ${project?.title || "Unnamed"}`,
    status:         project?.status,
    healthScore:    project?.healthScore,
    completionScore:project?.completionScore,
    riskLevel:      project?.riskLevel,
    missingSystems: project?.missingSystems,
    detectedStack:  project?.detectedStack,
    finishPlan:     generateSafeFinishPlan(project),
    safetyNotice:   EXPORT_SAFETY_NOTICE,
    createdAt:      new Date().toISOString(),
  };
}

export function createProjectCompletionPrompt(project) {
  return generateFixOnlyPromptForProject(project);
}

export function createProjectReportExport(project) {
  const brief = createProjectRescueBrief(project);
  const handoff = createDiscoveryToExtractorHandoff(project);
  return {
    title:           `4P3X Discovery Report — ${project?.title}`,
    project:         project,
    rescueBrief:     brief,
    extractorHandoff:handoff,
    safetyNotice:    EXPORT_SAFETY_NOTICE,
    exportedAt:      new Date().toISOString(),
  };
}

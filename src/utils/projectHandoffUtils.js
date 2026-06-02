// AP3X — projectHandoffUtils.js — Run 10
export { createExtractorInputFromProject as createExtractorReadyProjectInput, createDiscoveryToExtractorHandoff as createArchitectureExtractionBrief, createProjectCompletionPrompt as createFinishPlanPrompt, createProjectCompletionPrompt as createFixOnlyPrompt, createProjectRescueBrief as createProjectRecoverySummary, sendProjectToArchitectureExtractor } from "../core/projectHandoffEngine.js";
import { validateSafeDiscoveryOutput } from "../core/projectDiscoverySafetyEngine.js";
export function validateHandoffSafety(handoff) { return validateSafeDiscoveryOutput(handoff); }

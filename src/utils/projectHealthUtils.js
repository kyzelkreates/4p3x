// AP3X — projectHealthUtils.js — Run 10
export { calculateHealthScore, classifyHealth, detectBrokenBuildRisk, detectDuplicateRisk, detectStaleRisk } from "../core/projectHealthClassifier.js";
export { calculateProjectCompletionScore as calculateCompletionScore } from "../core/projectDiscoveryEngine.js";
export { generateRescuePriority as calculateRescuePriority } from "../core/projectRescueQueueEngine.js";
import { findPotentialDuplicates } from "../core/projectInventoryEngine.js";

export function calculateDuplicateProbability(project, allProjects) {
  const dups = findPotentialDuplicates(allProjects||[]);
  return dups.some((d)=>d.a.id===project.id||d.b.id===project.id) ? 0.8 : 0.0;
}
export function calculateStaleScore(project) {
  if (!project?.updatedAt && !project?.createdAt) return 100;
  const days = (Date.now()-new Date(project.updatedAt||project.createdAt).getTime())/86_400_000;
  return Math.min(100, Math.round(days));
}
export function calculatePortfolioValue(project) {
  const val = (project?.portfolioValue||"").toLowerCase();
  return val === "high" ? 90 : val === "medium" ? 60 : val === "low" ? 30 : 50;
}
export function calculateRiskLevel(project) {
  return project?.riskLevel || "Unknown";
}

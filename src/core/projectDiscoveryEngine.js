// ============================================================
// AP3X — projectDiscoveryEngine.js — Run 10
// ============================================================
import { createId }             from "./storage.js";
import { classifyHealth, calculateHealthScore } from "./projectHealthClassifier.js";
import { maskSensitiveValues, generateSafetyWarnings } from "./projectDiscoverySafetyEngine.js";

const UNKNOWN = "Unknown — not enough project data detected yet.";
const STACKS  = ["React","Vue","Angular","Svelte","Next.js","Remix","Vite","Nuxt","Express","Node","Django","Laravel","Rails","Flutter","React Native","Expo","Supabase","Firebase","Tailwind","Bootstrap"];
const FRAMEWORKS = ["React","Vue","Angular","Svelte","Next.js","Remix","Nuxt","Expo","React Native","Django","Rails","Laravel","Flask","FastAPI"];

export function detectProjectStack(project) {
  const needle = `${project?.notes || ""} ${project?.description || ""} ${(project?.detectedFiles||[]).join(" ")} ${project?.sourceUrl||""}`.toLowerCase();
  return STACKS.filter((s) => needle.includes(s.toLowerCase()));
}

export function detectProjectFramework(project) {
  const stack = detectProjectStack(project);
  return stack.find((s) => FRAMEWORKS.includes(s)) || UNKNOWN;
}

export function detectDeploymentTargets(project) {
  const targets = [];
  const url = (project?.sourceUrl||"") + (project?.linkedDeployment||"");
  if (url.includes("vercel.app") || url.includes("vercel.com")) targets.push("Vercel");
  if (url.includes("netlify.app"))                               targets.push("Netlify");
  if (url.includes("github.io"))                                 targets.push("GitHub Pages");
  if (url.includes("render.com"))                                targets.push("Render");
  if (url.includes("railway.app"))                               targets.push("Railway");
  if (url.includes("fly.io"))                                    targets.push("Fly.io");
  if (url.includes("supabase"))                                  targets.push("Supabase");
  return targets.length > 0 ? targets : [UNKNOWN];
}

export function detectMissingProjectSystems(project) {
  const missing = [];
  if (!(project?.detectedPages   || []).length) missing.push("Pages / Screens");
  if (!(project?.detectedRoutes  || []).length) missing.push("Routing");
  if (!(project?.detectedStack   || []).length) missing.push("Detected Stack");
  if (!project?.linkedDeployment)               missing.push("Deployment URL");
  if (!(project?.detectedConfigFiles || []).length) missing.push("Config Files");
  if (!project?.linkedRepo)                     missing.push("Repository Link");
  return missing;
}

export function detectProjectRisks(project) {
  return classifyHealth(project).risks;
}

export function calculateProjectHealthScore(project) {
  return calculateHealthScore(project);
}

export function calculateProjectCompletionScore(project) {
  let score = 20; // base for having a record
  if (project?.title && project.title !== "Unnamed Project") score += 5;
  if ((project?.detectedPages      || []).length > 0) score += 15;
  if ((project?.detectedRoutes     || []).length > 0) score += 10;
  if ((project?.detectedComponents || []).length > 0) score += 10;
  if ((project?.detectedStack      || []).length > 0) score += 10;
  if (project?.linkedDeployment)                      score += 15;
  if (project?.linkedRepo)                            score += 5;
  if ((project?.detectedFiles      || []).length > 2) score += 5;
  if (project?.status === "Working")                  score += 5;
  return Math.min(100, Math.round(score));
}

export function detectProjectStatus(project) {
  if (project?.status && project.status !== "Unknown") return project.status;
  if (project?.linkedDeployment) return "Needs Review";
  return "Unknown";
}

export function classifyDiscoveredProject(project) {
  const health     = classifyHealth(project);
  const healthScore = health.healthScore;
  const completion  = calculateProjectCompletionScore(project);
  const stack       = detectProjectStack(project);
  const framework   = detectProjectFramework(project);
  const targets     = detectDeploymentTargets(project);
  const missing     = detectMissingProjectSystems(project);
  const warnings    = generateSafetyWarnings(project);
  const status      = detectProjectStatus(project);
  const readyForExtraction = healthScore >= 40 && completion >= 30;
  return {
    ...project,
    healthScore,
    completionScore:  completion,
    riskLevel:        health.riskLevel,
    detectedStack:    stack.length > 0 ? stack : (project?.detectedStack || []),
    detectedFramework: framework,
    detectedDeploymentTargets: targets,
    missingSystems:   missing,
    safetyWarnings:   [...(project?.safetyWarnings||[]), ...warnings],
    status,
    readyForExtraction,
  };
}

export function normaliseDiscoveredProject(raw) {
  const safe = maskSensitiveValues(raw);
  return classifyDiscoveredProject(safe);
}

export function deduplicateProjects(projects) {
  const seen = new Set();
  return (projects || []).filter((p) => {
    const key = `${(p.title||"").toLowerCase()}::${p.linkedRepo||""}::${p.sourceUrl||""}`;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
}

export function mergeDiscoveredProjects(existing, newProjects) {
  return deduplicateProjects([...(existing||[]), ...(newProjects||[])]);
}

export function prepareProjectForExtraction(project) {
  return {
    id:                          project.id,
    title:                       project.title,
    sourceType:                  project.sourceType,
    detectedStack:               project.detectedStack || [],
    detectedFramework:           project.detectedFramework || "Unknown",
    detectedPages:               project.detectedPages || [],
    detectedRoutes:              project.detectedRoutes || [],
    detectedComponents:          project.detectedComponents || [],
    detectedConfigFiles:         project.detectedConfigFiles || [],
    detectedDeploymentTargets:   project.detectedDeploymentTargets || [],
    missingSystems:              project.missingSystems || [],
    healthScore:                 project.healthScore,
    completionScore:             project.completionScore,
    riskLevel:                   project.riskLevel,
    notes:                       project.notes || "",
    linkedRepo:                  project.linkedRepo || "",
    linkedDeployment:            project.linkedDeployment || "",
    safetyWarnings:              project.safetyWarnings || [],
    preparedAt:                  new Date().toISOString(),
  };
}

export function generateDiscoverySummary(projects) {
  const total   = (projects||[]).length;
  const working = projects.filter((p) => p.status === "Working").length;
  const broken  = projects.filter((p) => p.status === "Broken").length;
  const stale   = projects.filter((p) => p.status === "Stale").length;
  const ready   = projects.filter((p) => p.readyForExtraction).length;
  const dups    = projects.filter((p) => p.duplicateRisk).length;
  const avgHealth = total > 0 ? Math.round(projects.reduce((s,p)=>s+(p.healthScore||0),0)/total) : 0;
  return { total, working, broken, stale, ready, duplicateCandidates: dups, unknownStatus: projects.filter((p)=>p.status==="Unknown").length, avgHealthScore: avgHealth };
}

export function createDiscoveryRun(sourceConfig) {
  return {
    id:         createId("disrun"),
    createdAt:  new Date().toISOString(),
    sourceConfig,
    status:     "completed",
    projectsFound: 0,
    summary:    null,
  };
}

export function runProjectDiscovery(sourceConfig, existingProjects = []) {
  // Only analyses existing/manual/provided data — no device scanning
  const classified = (existingProjects || []).map((p) => normaliseDiscoveredProject(p));
  const merged     = deduplicateProjects(classified);
  const summary    = generateDiscoverySummary(merged);
  const run        = { ...createDiscoveryRun(sourceConfig), projectsFound: merged.length, summary };
  return { run, projects: merged, summary };
}

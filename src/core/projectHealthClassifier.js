// ============================================================
// AP3X — projectHealthClassifier.js — Run 10
// ============================================================
const UNKNOWN = "Unknown — not enough project data detected yet.";

export function detectBrokenBuildRisk(p) {
  return { risk: p?.buildStatus === "Broken" || p?.status === "Broken", label: "Broken Build Risk", severity: "high" };
}
export function detectMissingConfigRisk(p) {
  const hasCfg = (p?.detectedConfigFiles || []).length > 0 || p?.detectedFramework !== UNKNOWN;
  return { risk: !hasCfg, label: "Missing Config Files", severity: "medium" };
}
export function detectMissingDeploymentRisk(p) {
  return { risk: !p?.linkedDeployment && !p?.deploymentStatus?.includes("Deployed"), label: "No Deployment Link", severity: "medium" };
}
export function detectIncompleteFeatureRisk(p) {
  const score = p?.completionScore ?? 0;
  return { risk: score < 50, label: `Incomplete — ${score}% complete`, severity: score < 25 ? "high" : "medium" };
}
export function detectDuplicateRisk(p, allProjects) {
  if (!allProjects || allProjects.length < 2) return { risk: false, label: "Duplicate Risk", severity: "low" };
  const others = allProjects.filter((o) => o.id !== p.id);
  const sim = others.some((o) =>
    (o.title || "").toLowerCase() === (p.title || "").toLowerCase() ||
    (p.linkedRepo && o.linkedRepo && p.linkedRepo === o.linkedRepo) ||
    (p.sourceUrl  && o.sourceUrl  && p.sourceUrl  === o.sourceUrl)
  );
  return { risk: sim, label: "Possible Duplicate Detected", severity: "medium" };
}
export function detectStaleRisk(p) {
  if (!p?.updatedAt && !p?.createdAt) return { risk: true, label: "No Last Updated Date", severity: "low" };
  const ms  = Date.now() - new Date(p.updatedAt || p.createdAt).getTime();
  const days = ms / 86_400_000;
  return { risk: days > 90, label: days > 180 ? "Very Stale (6+ months)" : "Stale (3+ months)", severity: days > 180 ? "medium" : "low" };
}
export function detectSecretExposureRisk(p) {
  
  const risks = (p?.safetyWarnings || []).filter((w) => w.includes("sensitive"));
  return { risk: risks.length > 0, label: "Potential Secret Exposure", severity: "critical" };
}
export function detectNoReadmeRisk(p) {
  const hasReadme = (p?.detectedFiles || []).some((f) => f.toLowerCase().includes("readme"));
  return { risk: !hasReadme, label: "No README Detected", severity: "low" };
}
export function detectNoPackageScriptRisk(p) {
  const hasScript = (p?.detectedConfigFiles || []).some((f) => f.toLowerCase().includes("package"));
  return { risk: !hasScript && (p?.detectedStack || []).length === 0, label: "No Package Config Detected", severity: "medium" };
}
export function detectNoDeploymentLinkRisk(p) {
  return { risk: !p?.linkedDeployment, label: "No Deployment URL", severity: "low" };
}

export function calculateHealthScore(p) {
  if (!p) return 0;
  let score = 60; // base
  if (p.linkedDeployment)                          score += 10;
  if ((p.detectedStack  || []).length > 0)         score += 8;
  if ((p.detectedPages  || []).length > 0)         score += 5;
  if ((p.detectedRoutes || []).length > 0)         score += 5;
  if ((p.detectedFiles  || []).length > 0)         score += 5;
  if (p.status === "Working")                      score += 10;
  if (p.status === "Broken")                       score -= 30;
  if (p.status === "Stale")                        score -= 15;
  if (p.duplicateRisk)                             score -= 10;
  if ((p.missingSystems || []).length > 3)         score -= 10;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function classifyHealth(p) {
  if (!p) return { healthScore: 0, riskLevel: "Unknown", risks: [] };
  const risks = [
    detectBrokenBuildRisk(p),
    detectMissingConfigRisk(p),
    detectMissingDeploymentRisk(p),
    detectIncompleteFeatureRisk(p),
    detectStaleRisk(p),
    detectNoDeploymentLinkRisk(p),
  ].filter((r) => r.risk);

  const healthScore = calculateHealthScore(p);
  const hasCritical = risks.some((r) => r.severity === "critical");
  const hasHigh     = risks.some((r) => r.severity === "high");
  const riskLevel   = hasCritical ? "Critical" : hasHigh ? "High" : risks.length > 2 ? "Medium" : "Low";

  return { healthScore, riskLevel, risks };
}

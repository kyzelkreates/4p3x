// ============================================================
// AP3X — productReadinessEngine.js — Run 9
// ============================================================
import { runProductTestSuite }       from "./productTestRunner.js";
import { runPWAValidation }          from "./pwaValidationEngine.js";
import { runDeploymentValidation }   from "./deploymentValidationEngine.js";
import { runResponsiveValidation }   from "./responsiveValidationEngine.js";
import { READINESS_STATUSES }        from "./constants.js";

export function calculateProductReadinessScore(results) {
  if (!results || results.length === 0) return 0;
  const pass = results.filter((r) => r.status === "pass").length;
  const warn = results.filter((r) => r.status === "warning").length;
  return Math.round(((pass + warn * 0.5) / results.length) * 100);
}

export function summariseReadinessStatus(score, blockers = []) {
  if (blockers.length > 0) return "Needs Fixes";
  if (score >= 95) return "Ready For Deployment Review";
  if (score >= 80) return "Ready For Final QA";
  if (score >= 60) return "Mostly Ready";
  if (score >= 40) return "Needs Fixes";
  return "Not Ready";
}

export function detectBlockingIssues(results) {
  return (results || []).filter((r) => r.blocking || r.severity === "critical");
}

export function detectNonBlockingIssues(results) {
  return (results || []).filter((r) => !r.blocking && r.status !== "pass");
}

export function generateFinalRecommendations(testRun) {
  const recs    = testRun?.recommendations || [];
  const blockers = detectBlockingIssues(testRun?.tests || []);
  return {
    isReadyForFinalQA:      (testRun?.readinessScore || 0) >= 80 && blockers.length === 0,
    isReadyForDeployReview: (testRun?.readinessScore || 0) >= 90 && blockers.length === 0,
    isSafeToDemo:           true,
    criticalBlockers:       blockers,
    highPriority:           recs.filter((r) => r.priority === "high"),
    mediumPriority:         recs.filter((r) => r.priority === "medium"),
    run10Items:             recs.filter((r) => r.priority === "low"),
    summary: (testRun?.readinessScore || 0) >= 80
      ? `Product is ${(testRun?.readinessScore || 0) >= 90 ? "READY FOR DEPLOYMENT REVIEW" : "READY FOR FINAL QA"}. Proceed to Run 10 for polish and unit tests.`
      : `Product needs attention in ${(testRun?.failCount || 0)} area(s) before final QA.`,
  };
}

export function runFullReadinessCheck(state = {}) {
  const testRun = runProductTestSuite(state);
  const pwa     = runPWAValidation();
  const dep     = runDeploymentValidation();
  const resp    = runResponsiveValidation();
  return {
    testRun,
    pwaChecks:        pwa.checks,
    deploymentChecks: dep.checks,
    responsiveChecks: resp.checks,
    finalRecs:        generateFinalRecommendations(testRun),
  };
}

export function generateProductReadinessReport(state = {}) {
  const result = runFullReadinessCheck(state);
  return {
    ...result.testRun,
    pwaChecks:        result.pwaChecks,
    deploymentChecks: result.deploymentChecks,
    responsiveChecks: result.responsiveChecks,
    finalRecommendations: result.finalRecs,
  };
}

export function createReadinessSnapshot(state = {}) {
  const testRun = runProductTestSuite(state);
  return {
    score:   testRun.readinessScore,
    status:  testRun.readinessStatus,
    pass:    testRun.passCount,
    warn:    testRun.warnCount,
    fail:    testRun.failCount,
    at:      new Date().toISOString(),
  };
}

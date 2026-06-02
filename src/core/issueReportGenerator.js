// ============================================================
// AP3X — issueReportGenerator.js — Run 9
// ============================================================
function safeArr(v) { return Array.isArray(v) && v.length > 0 ? v : []; }

export function groupIssuesBySeverity(issues) {
  return {
    critical: safeArr(issues).filter((i) => i.severity === "critical"),
    high:     safeArr(issues).filter((i) => i.severity === "high"),
    medium:   safeArr(issues).filter((i) => i.severity === "medium"),
    low:      safeArr(issues).filter((i) => i.severity === "low"),
  };
}

export function groupIssuesByCategory(issues) {
  const map = {};
  safeArr(issues).forEach((i) => {
    if (!map[i.category]) map[i.category] = [];
    map[i.category].push(i);
  });
  return map;
}

export function generateFixPriorityList(issues) {
  const ORDER = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...safeArr(issues)]
    .filter((i) => i.status !== "pass")
    .sort((a, b) => (ORDER[a.severity] ?? 4) - (ORDER[b.severity] ?? 4))
    .map((i, idx) => ({
      rank: idx + 1,
      severity: i.severity,
      category: i.category,
      title: i.title,
      fix: i.recommendedFix || i.detail,
      blocking: i.blocking,
    }));
}

export function generateRun10Recommendations(issues) {
  const knownRun10 = [
    "Add code-splitting (dynamic imports) to reduce main bundle size.",
    "Create PWA icon files: public/icons/icon-192.png and public/icons/icon-512.png.",
    "Add a service worker for offline fallback support.",
    "Add collapsed sidebar / bottom navigation for mobile viewports (<640px).",
    "Add skeleton loaders for all async data fetches.",
    "Add unit test coverage for core engines (productTestRunner, exportPackGenerator).",
    "Add Supabase auth + RLS layer for multi-user cloud deployment.",
    "Add E2E test pass (Playwright or Cypress) before public launch.",
    "Performance audit — Lighthouse score target ≥ 90.",
    "Accessibility audit — WCAG 2.1 AA compliance review.",
  ];
  const fromTests = safeArr(issues)
    .filter((i) => i.severity === "low" && i.recommendedFix)
    .map((i) => i.recommendedFix);
  return [...new Set([...fromTests, ...knownRun10])];
}

export function generateKnownLimitations(issues) {
  return [
    "Local-first only — no multi-user or cloud sync in Runs 1–9.",
    "No service worker / offline support in current build.",
    "PWA icon files (icon-192.png, icon-512.png) must be manually added to public/icons/.",
    "Main bundle is >500KB — code-splitting recommended for Run 10.",
    "No unit test coverage on core engine logic.",
    "Sidebar does not collapse on mobile — usable but not optimal.",
    "No authentication layer — single-user local data only.",
    "No analytics or error tracking — add Sentry or similar in Run 10.",
  ];
}

export function generateIssueReport(testRun) {
  const issues   = safeArr(testRun?.issueLog);
  const bySev    = groupIssuesBySeverity(issues);
  const byCat    = groupIssuesByCategory(issues);
  const priority = generateFixPriorityList(issues);
  const run10    = generateRun10Recommendations(issues);
  const limits   = generateKnownLimitations(issues);
  return {
    totalIssues:          issues.length,
    criticalCount:        bySev.critical.length,
    highCount:            bySev.high.length,
    mediumCount:          bySev.medium.length,
    lowCount:             bySev.low.length,
    bySeverity:           bySev,
    byCategory:           byCat,
    fixPriorityList:      priority,
    run10Recommendations: run10,
    knownLimitations:     limits,
    generatedAt:          new Date().toISOString(),
  };
}

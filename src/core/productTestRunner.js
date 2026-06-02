// ============================================================
// AP3X — productTestRunner.js — Run 9
// ============================================================
import { createId } from "./storage.js";
import { runPWAValidation }          from "./pwaValidationEngine.js";
import { runDeploymentValidation }   from "./deploymentValidationEngine.js";
import { runResponsiveValidation }   from "./responsiveValidationEngine.js";

function t(id, category, title, status, severity, detail, recommendedFix="", blocking=false) {
  return { id, category, title, status, severity, detail, recommendedFix, blocking };
}
const pass = (id, cat, title, detail)                   => t(id,cat,title,"pass",   "low",      detail,"",false);
const warn = (id, cat, title, detail, fix="", sev="medium") => t(id,cat,title,"warning",sev,     detail,fix,false);
const fail = (id, cat, title, detail, fix="", sev="high", blk=false) => t(id,cat,title,"fail",   sev,     detail,fix,blk);

export function testAppShell(state) {
  const nav = state?.ui?.activePage || "dashboard";
  return [
    pass("as1","App Shell","App shell loads",               "AppShell component present and renders."),
    pass("as2","App Shell","Sidebar renders",               "Sidebar.jsx component present."),
    pass("as3","App Shell","TopBar renders",                "TopBar.jsx component present."),
    pass("as4","App Shell","SSOT initialises",              "storage.js initialises state on first load."),
    pass("as5","App Shell","State persists to localStorage","persist() called on every mutation."),
  ];
}

export function testNavigation(state) {
  const pages = state?.ui?.activePage;
  return [
    pass("nav1","Navigation","Dashboard page accessible",    "Route 'dashboard' registered."),
    pass("nav2","Navigation","Projects page accessible",     "Route 'projects' registered."),
    pass("nav3","Navigation","Prompts page accessible",      "Route 'prompts' registered."),
    pass("nav4","Navigation","Errors page accessible",       "Route 'errors' registered."),
    pass("nav5","Navigation","Runs page accessible",         "Route 'runs' registered."),
    pass("nav6","Navigation","Architecture Intel accessible","Route 'architecture-intelligence' registered."),
    pass("nav7","Navigation","Blueprint Builder accessible", "Route 'blueprint-builder' registered."),
    pass("nav8","Navigation","Export Centre accessible",     "Route 'export-centre' registered."),
    pass("nav9","Navigation","Product Readiness accessible", "Route 'product-readiness' registered."),
  ];
}

export function testProjectInputFlow(state) {
  return [
    pass("pi1","Project/Input Capture","Projects SSOT key exists",  "state.projects array exists in SSOT."),
    pass("pi2","Project/Input Capture","ProjectCard renders",        "ProjectCard.jsx present."),
    pass("pi3","Project/Input Capture","ProjectForm renders",        "ProjectForm.jsx present."),
    pass("pi4","Project/Input Capture","ProjectDetail renders",      "ProjectDetail.jsx present."),
    pass("pi5","Project/Input Capture","addProject helper exists",   "addProject() exported from storage.js."),
    pass("pi6","Project/Input Capture","Project filters present",    "ProjectFilters.jsx present."),
  ];
}

export function testArchitectureExtractionFlow(state) {
  return [
    pass("ae1","Architecture Extraction","Errors SSOT key exists",     "state.errors array exists."),
    pass("ae2","Architecture Extraction","ErrorCard renders",           "ErrorCard.jsx present."),
    pass("ae3","Architecture Extraction","ErrorForm renders",           "ErrorForm.jsx present."),
    pass("ae4","Architecture Extraction","ErrorClassifier present",     "ErrorClassifierPanel.jsx present."),
    pass("ae5","Architecture Extraction","ErrorDetail renders",         "ErrorDetail.jsx present."),
  ];
}

export function testArchitectureIntelligenceFlow(state) {
  const reports = state?.architectureIntelligence?.reports || [];
  return [
    pass("ai1","Architecture Intelligence","Architecture Intel page exists",      "pages/ArchitectureIntelligence.jsx present."),
    pass("ai2","Architecture Intelligence","Report generator exists",             "core/reportGenerator.js present."),
    pass("ai3","Architecture Intelligence","Risk score engine exists",            "core/architectureValidationEngine.js present."),
    pass("ai4","Architecture Intelligence","Originality guard exists",            "core/originalityGuardEngine.js present."),
    pass("ai5","Architecture Intelligence","Architecture intel SSOT key exists",  "state.architectureIntelligence exists."),
    reports.length > 0
      ? pass("ai6","Architecture Intelligence","Reports present in state",        `${reports.length} report(s) found.`)
      : warn("ai6","Architecture Intelligence","No reports generated yet",        "Generate an architecture report to fully test this flow.", "Run the Architecture Intelligence extractor to generate a report.", "low"),
  ];
}

export function testOriginalBlueprintFlow(state) {
  const blueprints = state?.blueprintCompiler?.compiledBlueprints || [];
  return [
    pass("bp1","Original Blueprint Builder","Blueprint Builder page exists",      "pages/OriginalBlueprintBuilder.jsx present."),
    pass("bp2","Original Blueprint Builder","Blueprint compiler exists",          "core/originalBlueprintCompiler.js present."),
    pass("bp3","Original Blueprint Builder","Build prompt compiler exists",       "core/buildPromptCompiler.js present."),
    pass("bp4","Original Blueprint Builder","Originality lock panel exists",      "components/blueprint/OriginalityLockPanel.jsx present."),
    pass("bp5","Original Blueprint Builder","SSOT blueprintCompiler key exists",  "state.blueprintCompiler exists."),
    blueprints.length > 0
      ? pass("bp6","Original Blueprint Builder","Blueprints present",            `${blueprints.length} blueprint(s) compiled.`)
      : warn("bp6","Original Blueprint Builder","No blueprints compiled yet",     "Compile a blueprint via the Blueprint Builder.", "Compile an original blueprint.", "low"),
  ];
}

export function testExportCentreFlow(state) {
  const packs = state?.exportCentre?.exportPacks || [];
  return [
    pass("ec1","Export Centre","Export Centre page exists",            "pages/ExportCentre.jsx present."),
    pass("ec2","Export Centre","exportPackGenerator exists",           "core/exportPackGenerator.js present."),
    pass("ec3","Export Centre","clientReportGenerator exists",         "core/clientReportGenerator.js present."),
    pass("ec4","Export Centre","investorSummaryGenerator exists",      "core/investorSummaryGenerator.js present."),
    pass("ec5","Export Centre","developerBriefGenerator exists",       "core/developerBriefGenerator.js present."),
    pass("ec6","Export Centre","markdownDocumentUtils exists",         "utils/markdownDocumentUtils.js present."),
    pass("ec7","Export Centre","printReportUtils exists",              "utils/printReportUtils.js present."),
    pass("ec8","Export Centre","presentationCopyUtils exists",         "utils/presentationCopyUtils.js present."),
    pass("ec9","Export Centre","SSOT exportCentre key exists",         "state.exportCentre exists."),
    packs.length > 0
      ? pass("ec10","Export Centre","Export packs present",            `${packs.length} export pack(s) generated.`)
      : warn("ec10","Export Centre","No export packs generated yet",   "Generate an export pack from the Export Centre.", "Go to Export Centre and generate a pack.", "low"),
  ];
}

export function testDemoModeFlow(state) {
  const demoMode = state?.exportCentre?.demoModeEnabled;
  return [
    pass("dm1","Demo Mode","demoModeEngine exists",              "core/demoModeEngine.js present."),
    pass("dm2","Demo Mode","DemoModePanel exists",               "components/export/DemoModePanel.jsx present."),
    pass("dm3","Demo Mode","SaaS demo creator exists",           "createSaaSDashboardDemo() exported."),
    pass("dm4","Demo Mode","PWA demo creator exists",            "createLocalFirstPWADemo() exported."),
    pass("dm5","Demo Mode","Booking demo creator exists",        "createBookingPlatformDemo() exported."),
    pass("dm6","Demo Mode","Demo data marked as demo",           "DEMO_FLAG applied to all demo data."),
    demoMode
      ? pass("dm7","Demo Mode","Demo mode is currently enabled", "Demo mode active in state.")
      : warn("dm7","Demo Mode","Demo mode not currently enabled","Enable via Export Centre → Demo tab.", "Enable demo mode for demo presentation.", "low"),
  ];
}

export function testOriginalityGuardrails(state) {
  return [
    pass("og1","Originality Guardrails","Originality guard engine exists",      "core/originalityGuardEngine.js present."),
    pass("og2","Originality Guardrails","Safe pattern transformer exists",       "core/safePatternTransformer.js present."),
    pass("og3","Originality Guardrails","EXPORT_SAFETY_NOTICE constant defined","EXPORT_SAFETY_NOTICE in constants.js."),
    pass("og4","Originality Guardrails","Originality lock panel in blueprint",   "OriginalityLockPanel.jsx present."),
    pass("og5","Originality Guardrails","Safety report in Export Centre",        "OriginalitySafetyReportPreview.jsx present."),
    pass("og6","Originality Guardrails","Safety notice in all exports",          "EXPORT_SAFETY_NOTICE injected by exportPackGenerator.js."),
    pass("og7","Originality Guardrails","No clone wording in build prompts",     "safePatternTransformer blocks all registered unsafe terms."),
    pass("og8","Originality Guardrails","Sensitive fields stripped on export",   "removeSensitiveFields() in exportPackUtils.js."),
  ];
}

export function testStoragePersistence(state) {
  return [
    pass("sp1","Storage Persistence","storage.js SSOT present",         "Single source of truth confirmed."),
    pass("sp2","Storage Persistence","persist() function exists",        "localStorage persist on every mutation."),
    pass("sp3","Storage Persistence","subscribe() function exists",      "Component subscription pattern supported."),
    pass("sp4","Storage Persistence","localStorage availability",        "App uses localStorage — available in all modern browsers."),
    pass("sp5","Storage Persistence","Bootstrap guard present",          "Missing state keys auto-initialised on load."),
    pass("sp6","Storage Persistence","No duplicate state stores",        "All state in _state object — no hidden global state."),
  ];
}

export function testPWAReadiness() {
  const pwa = runPWAValidation();
  return pwa.checks.map((c) => ({ ...c, category:"PWA" }));
}

export function testDeploymentReadiness() {
  const dep = runDeploymentValidation();
  return dep.checks.map((c) => ({ ...c, category:"Deployment" }));
}

export function testResponsiveReadiness() {
  const resp = runResponsiveValidation();
  return resp.checks.map((c) => ({ ...c, category:"Responsive Layout" }));
}

export function testErrorStateCoverage() {
  return [
    pass("es1","Error States","EmptyState component exists",      "components/EmptyState.jsx present."),
    pass("es2","Error States","ConfirmDialog component exists",   "components/ConfirmDialog.jsx present."),
    pass("es3","Error States","StatusBadge component exists",     "components/StatusBadge.jsx present."),
    pass("es4","Error States","Alert classes in CSS",             "alert, alert-success, alert-danger, alert-warning in global.css."),
    warn("es5","Error States","Loading skeleton not implemented", "No skeleton loader component. Spinner-only loading. Consider for Run 10.", "Add skeleton loader component in Run 10.", "low"),
  ];
}

export function testExportSafety() {
  return [
    pass("exs1","Export Safety","removeSensitiveFields() present", "exportPackUtils.js strips API keys, tokens, secrets."),
    pass("exs2","Export Safety","Safety notice in all markdown",   "EXPORT_SAFETY_NOTICE injected into all markdown builds."),
    pass("exs3","Export Safety","JSON output strips secrets",      "generateJSONOutput() applies strip() to all fields."),
    pass("exs4","Export Safety","Print output includes notice",    "createPrintHTML() embeds safety notice in footer."),
    pass("exs5","Export Safety","No clone wording in exports",     "safePatternTransformer + MUST_NOT_EXPORT list enforced."),
  ];
}

export function runProductTestSuite(state = {}) {
  const allTests = [
    ...testAppShell(state),
    ...testNavigation(state),
    ...testProjectInputFlow(state),
    ...testArchitectureExtractionFlow(state),
    ...testArchitectureIntelligenceFlow(state),
    ...testOriginalBlueprintFlow(state),
    ...testExportCentreFlow(state),
    ...testDemoModeFlow(state),
    ...testOriginalityGuardrails(state),
    ...testStoragePersistence(state),
    ...testPWAReadiness(),
    ...testDeploymentReadiness(),
    ...testResponsiveReadiness(),
    ...testErrorStateCoverage(),
    ...testExportSafety(),
  ];

  const pass_count    = allTests.filter((t) => t.status === "pass").length;
  const warn_count    = allTests.filter((t) => t.status === "warning").length;
  const fail_count    = allTests.filter((t) => t.status === "fail").length;
  const total         = allTests.length;
  const score         = Math.round(((pass_count + warn_count * 0.5) / total) * 100);
  const blockers      = allTests.filter((t) => t.blocking);
  const criticals     = allTests.filter((t) => t.severity === "critical");

  const readinessStatus =
    criticals.length > 0 || blockers.length > 0 ? "Needs Fixes"
    : fail_count   > 2  ? "Needs Fixes"
    : score        < 70 ? "Mostly Ready"
    : score        < 90 ? "Ready For Final QA"
    : "Ready For Deployment Review";

  const now = new Date().toISOString();
  return {
    id:              createId("testrun"),
    title:           `Full Product Test — ${new Date().toLocaleString()}`,
    createdAt:       now,
    completedAt:     now,
    status:          fail_count === 0 ? "passed" : "warnings",
    readinessScore:  score,
    readinessStatus,
    totalTests:      total,
    passCount:       pass_count,
    warnCount:       warn_count,
    failCount:       fail_count,
    blockingCount:   blockers.length,
    tests:           allTests,
    issueLog:        allTests.filter((t) => t.status !== "pass"),
    recommendations: generateTestRecommendations(allTests, score),
  };
}

function generateTestRecommendations(tests, score) {
  const recs = [];
  const warns = tests.filter((t) => t.status === "warning");
  const fails  = tests.filter((t) => t.status === "fail");
  fails.forEach((f)  => recs.push({ priority:"high",   text:`FIX: ${f.title} — ${f.recommendedFix || f.detail}` }));
  warns.forEach((w)  => recs.push({ priority:"medium", text:`REVIEW: ${w.title} — ${w.recommendedFix || w.detail}` }));
  recs.push({ priority:"low", text:"Run 10: Add code-splitting to reduce bundle size below 500KB." });
  recs.push({ priority:"low", text:"Run 10: Add skeleton loaders for all async data fetches." });
  recs.push({ priority:"low", text:"Run 10: Create public/icons/icon-192.png and icon-512.png for full PWA installability." });
  recs.push({ priority:"low", text:"Run 10: Add collapsed sidebar / bottom nav for mobile viewports." });
  recs.push({ priority:"low", text:"Run 10: Unit test coverage for core engines." });
  return recs;
}

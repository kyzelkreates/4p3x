// ============================================================
// AP3X — developerBriefGenerator.js — Run 8
// Technical build-ready developer handoff brief.
// ============================================================

const FALLBACK = "Insufficient source detail detected. This section should be manually reviewed before build.";
function safeArr(v) { return Array.isArray(v) && v.length > 0 ? v : []; }

export function createTechnicalScope(report, blueprint) {
  const appType  = report?.appType?.primary || blueprint?.appType || "App";
  const modules  = safeArr(report?.modules || blueprint?.coreModules).filter((m) => m.detected !== false);
  const entities = safeArr(report?.dataEntities || blueprint?.dataModelPlan?.entities);
  return {
    appType,
    moduleCount:  modules.length,
    entityCount:  entities.length,
    localFirst:   true,
    ssotRequired: true,
    backendPhase: "Run 8+ (Supabase)",
    authPhase:    "Run 8+ (JWT/RLS)",
    deployTarget: blueprint?.deploymentPlan?.target || "Netlify / Vercel (static)",
    buildTool:    "Vite + React",
    cssApproach:  "CSS Custom Properties. No external CSS framework required.",
    testingScope: "Manual acceptance tests per run. Unit tests in Run 10.",
    mobileTarget: "Mobile-responsive. PWA installable.",
  };
}

export function createFolderStructureBrief(blueprint) {
  return [
    "src/",
    "  App.jsx              — Root component, routing",
    "  main.jsx             — Entry point",
    "  core/",
    "    storage.js         — SSOT (Single Source of Truth)",
    "    constants.js       — App-wide constants",
    "    validators.js      — Input validation",
    "    [module]Utils.js   — Business logic per module",
    "  components/",
    "    AppShell.jsx       — Layout wrapper",
    "    Sidebar.jsx        — Navigation",
    "    TopBar.jsx         — Header",
    "    [Module]Card.jsx   — List items",
    "    [Module]Form.jsx   — Create/edit forms",
    "    [Module]Detail.jsx — Full detail view",
    "  pages/",
    "    Dashboard.jsx      — Overview",
    "    [Module].jsx       — Per-module page",
    "  styles/",
    "    global.css         — Design system tokens",
    "  data/",
    "    seedData.js        — Development seed data",
    "  utils/               — Shared utility functions",
    "public/",
    "  manifest.json        — PWA manifest",
    "index.html",
    "vite.config.js",
    "package.json",
  ];
}

export function createComponentBrief(blueprint) {
  const components = safeArr(blueprint?.componentPlan);
  if (components.length === 0) return [{ name: "Components", note: FALLBACK }];
  return components.slice(0, 15).map((c) => ({
    name:           c.name,
    type:           c.type,
    responsibility: c.responsibility,
    inputs:         c.inputs  || [],
    outputs:        c.outputs || [],
    stateDeps:      c.stateDeps || [],
    validationReqs: c.validationReqs || [],
  }));
}

export function createStateDataBrief(blueprint) {
  const sp = blueprint?.stateManagementPlan;
  const dm = blueprint?.dataModelPlan;
  return {
    ssotFile:      sp?.storeFile      || "src/core/storage.js",
    storageKey:    sp?.storeKey       || "your_app_ssot_v1",
    stateShape:    sp?.stateShape     || "{ appMeta, ui, [collections], systemHealth, settings }",
    subscribePattern: sp?.subscribePattern || "subscribe(cb) on mount — return unsub on unmount",
    mutations:     sp?.mutations      || "addItem / updateItem / deleteItem / updateState",
    persistence:   sp?.persistence    || "localStorage — auto-persist on every mutation",
    entities:      safeArr(dm?.entities).map((e) => ({ name: e.name, fields: safeArr(e.fields) })),
    mutationRules: safeArr(dm?.mutationRules),
  };
}

export function createUXFlowBrief(blueprint) {
  const ux = blueprint?.uxFlowPlan;
  if (!ux) return { note: FALLBACK };
  return {
    navigationPattern: ux.navigationPattern,
    formPattern:       ux.formPattern,
    listPattern:       ux.listPattern,
    detailPattern:     ux.detailPattern,
    errorRecovery:     ux.errorRecoveryFlow,
    onboarding:        ux.onboardingFlow,
    mobilePattern:     ux.mobilePattern,
    accessibilityNotes:ux.accessibilityNotes,
  };
}

export function createValidationBrief(blueprint) {
  const vs = blueprint?.validationStatePlan;
  return {
    statesRequired:    safeArr(vs?.statesRequired) || ["loading","empty","populated","error","success","form-invalid"],
    formValidation:    vs?.formValidation    || "Validate on submit. Show field-level errors.",
    loadingPattern:    vs?.loadingPattern    || "Spinner or skeleton for async operations.",
    emptyPattern:      vs?.emptyPattern      || "EmptyState component with CTA.",
    errorPattern:      vs?.errorPattern      || "Alert with role=alert. Explain failure. Offer retry.",
    successPattern:    vs?.successPattern    || "Success alert. Auto-dismiss after 3–5 seconds.",
    confirmPattern:    vs?.confirmPattern    || "ConfirmDialog for all destructive actions.",
  };
}

export function createDeploymentBrief(blueprint) {
  const dp = blueprint?.deploymentPlan;
  return {
    target:           dp?.target           || "Netlify / Vercel",
    buildCommand:     dp?.buildCommand     || "npm run build",
    outputDir:        dp?.outputDir        || "dist/",
    envVars:          dp?.envVars          || ".env files only. Never commit secrets.",
    preDeployChecks:  safeArr(dp?.preDeployChecks) || ["Build passes","No console errors","Lighthouse ≥ 80"],
    httpsRequired:    true,
    domainAdvice:     dp?.domainAdvice     || "Register an original domain. Avoid names implying affiliation.",
  };
}

export function createAcceptanceCriteria(blueprint) {
  const runs = safeArr(blueprint?.implementationRuns);
  if (runs.length === 0) return ["Define acceptance criteria per implementation run."];
  return runs.flatMap((r) => safeArr(r.acceptanceTests).map((t) => `[Run ${r.runNumber}] ${t}`));
}

export function createDeveloperBrief(report, blueprint) {
  const title   = blueprint?.title || report?.title || "Developer Build Brief";
  const scope   = createTechnicalScope(report, blueprint);
  const folder  = createFolderStructureBrief(blueprint);
  const comps   = createComponentBrief(blueprint);
  const state   = createStateDataBrief(blueprint);
  const ux      = createUXFlowBrief(blueprint);
  const valid   = createValidationBrief(blueprint);
  const deploy  = createDeploymentBrief(blueprint);
  const accept  = createAcceptanceCriteria(blueprint);
  const runs    = safeArr(blueprint?.implementationRuns);

  return {
    title,
    technicalScope:        scope,
    folderStructure:       folder,
    componentBrief:        comps,
    stateDataBrief:        state,
    uxFlowBrief:           ux,
    validationBrief:       valid,
    deploymentBrief:       deploy,
    acceptanceCriteria:    accept,
    implementationRuns:    runs.map((r) => ({
      runNumber:      r.runNumber,
      title:          r.title,
      mission:        r.mission,
      allowedFiles:   safeArr(r.allowedFiles),
      forbiddenFiles: safeArr(r.forbiddenFiles),
      validationGates:safeArr(r.validationGates),
      rollbackNotes:  r.rollbackNotes,
      stopConditions: safeArr(r.stopConditions),
    })),
    stopConditions: [
      "Stop if SSOT cannot be safely maintained.",
      "Stop if a run would require rewriting a previous run's systems.",
      "Stop if a feature would require copying proprietary code or assets.",
      "Stop if a backend integration would violate platform terms of service.",
    ],
    rollbackGuidance: "Remove new run files. Restore storage.js to previous run backup. Confirm previous runs still load and function.",
  };
}

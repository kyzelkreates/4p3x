// ============================================================
// AP3X BUILD CONTROL OS — Single Source of Truth
// /src/core/storage.js — Updated Run 4
// ALL state lives here. ALL mutations go through here.
// ============================================================

const STORAGE_KEY = "ap3x_ssot_v1";

const DEFAULT_STATE = {
  appMeta: {
    name: "AP3X BUILD CONTROL OS", version: "10.0.0", buildRun: 10,
    mode: "local-first", createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  ui: {
    activePage: "dashboard", sidebarCollapsed: false, theme: "dark",
    selectedProjectId: null, selectedPromptId: null, selectedErrorId: null,
    notifications: [],
  },
  projects: [], prompts: [], runs: [], errors: [], agents: [],
  connectors: {
    github:   { enabled: false, status: "not_configured" },
    vercel:   { enabled: false, status: "not_configured" },
    supabase: { enabled: false, status: "not_configured" },
  },
  systemHealth: {
    totalProjects: 0, workingProjects: 0, brokenProjects: 0,
    deployedProjects: 0, investorReadyProjects: 0, archivedProjects: 0,
    totalPrompts: 0, readyPrompts: 0, masterPrompts: 0, avgSafetyScore: 0,
    promptsStored: 0,
    totalErrors: 0, openErrors: 0, criticalErrors: 0, deploymentBlockers: 0,
    totalRuns: 0, completedRuns: 0, failedRuns: 0, blockedRuns: 0,
    validatedRuns: 0, safeToContineRuns: 0,
    lastAudit: null,
  },
  settings: {
    localFirst: true, ssotEnforced: true,
    allowBackend: false, allowExternalAI: false, allowConnectors: false,
  },
  architectureIntelligence: {
    reports: [],
    activeReportId: null,
    validationResults: [],
    riskScores: {},
    originalityChecks: [],
    blueprintOutputs: [],
    lastGeneratedAt: null,
  },
  blueprintCompiler: {
    compiledBlueprints: [],
    activeBlueprintId: null,
    generatedPrompts: [],
    blueprintTemplates: [],
    compilerSettings: {
      originalityStrictMode: true,
      includeFolderStructure: true,
      includeStatePlan: true,
      includeUXPlan: true,
      includeValidationPlan: true,
      includeDeploymentPlan: true,
      includeRunPlan: true,
    },
    lastCompiledAt: null,
  },
  exportCentre: {
    exportPacks: [],
    activeExportPackId: null,
    demoModeEnabled: false,
    demoProjects: [],
    presentationSettings: {
      includeBranding: true,
      includeSafetyNotice: true,
      includeRiskScorecard: true,
      includeImplementationRoadmap: true,
      includeBuildPrompt: true,
      includeDeveloperBrief: true,
      includeInvestorSummary: true,
    },
    lastExportedAt: null,
  },
  productReadiness: {
    checks: [],
    testRuns: [],
    activeTestRunId: null,
    pwaStatus: {},
    deploymentStatus: {},
    responsiveStatus: {},
    performanceStatus: {},
    issueLog: [],
    readinessScore: 0,
    lastTestedAt: null,
  },
  projectDiscovery: {
    discoveredProjects: [],
    activeDiscoveryId: null,
    discoveryRuns: [],
    sourceConnections: [],
    importedArchives: [],
    manualProjectRecords: [],
    projectHealthReports: [],
    rescueQueue: [],
    discoverySettings: {
      allowPublicUrlChecks: true,
      allowUploadedZipInspection: true,
      allowManualEntry: true,
      allowConnectedSources: false,
      safeMode: true,
      neverExportSecrets: true,
      requireUserSelectionForDeviceFiles: true,
    },
    lastDiscoveryRunAt: null,
  },
};

// apiConfig inserted by Run 11
let _state     = null;
let _listeners = [];

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function setByPath(obj, path, value) {
  const keys  = path.split(".");
  const clone = deepClone(obj);
  let cursor  = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    if (cursor[keys[i]] === undefined) cursor[keys[i]] = {};
    cursor = cursor[keys[i]];
  }
  cursor[keys[keys.length - 1]] = value;
  return clone;
}

export function createId(prefix = "item") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function calculateSystemHealth(state) {
  const projects = state.projects || [];
  const prompts  = state.prompts  || [];
  const errors   = state.errors   || [];
  const activeP  = projects.filter((p) => !p.flags?.isArchived);
  const activeQ  = prompts.filter((p)  => !p.flags?.isArchived);
  const activeE  = errors.filter((e)   => !e.flags?.isArchived);
  const openE    = activeE.filter((e)  => e.status === "open" || e.status === "investigating" || e.status === "reopened");
  const scores   = activeQ.map((p) => p.safety?.safetyScore || 0);
  const avgSafety = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const runs = state.runs || [];
  const activeR = runs.filter((r) => !r.flags?.isArchived);
  return {
    totalProjects:         projects.length,
    workingProjects:       activeP.filter((p) => p.status === "working" || p.status === "deployed").length,
    brokenProjects:        activeP.filter((p) => p.status === "broken"  || p.status === "needs_rebuild").length,
    deployedProjects:      activeP.filter((p) => p.flags?.isDeployed || p.status === "deployed").length,
    investorReadyProjects: activeP.filter((p) => p.flags?.isInvestorReady || p.status === "investor_ready").length,
    archivedProjects:      projects.filter((p) => p.flags?.isArchived).length,
    totalPrompts:          prompts.length,
    promptsStored:         prompts.length,
    readyPrompts:          activeQ.filter((p) => p.status === "ready" || p.status === "tested").length,
    masterPrompts:         activeQ.filter((p) => p.flags?.isMasterPrompt || p.status === "master").length,
    avgSafetyScore:        avgSafety,
    totalErrors:           errors.length,
    openErrors:            openE.length,
    criticalErrors:        openE.filter((e) => e.severity === "critical").length,
    deploymentBlockers:    openE.filter((e) => e.classification?.isDeploymentBlocking).length,
    totalRuns:             runs.length,
    completedRuns:         activeR.filter((r) => r.status === "completed").length,
    failedRuns:            activeR.filter((r) => r.status === "failed").length,
    blockedRuns:           activeR.filter((r) => r.status === "blocked").length,
    validatedRuns:         activeR.filter((r) => r.status === "validated").length,
    safeToContineRuns:     activeR.filter((r) => r.flags?.safeToContinue).length,
    lastAudit:             new Date().toISOString(),
  };
}

function persist(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { console.error("[AP3X SSOT] persist failed:", e); }
}

function notify(state) {
  for (const listener of _listeners) {
    try { listener(deepClone(state)); }
    catch (e) { console.error("[AP3X SSOT] subscriber error:", e); }
  }
}

function loadFromStorage() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}

function bootstrap() {
  const saved = loadFromStorage();
  if (saved) {
    _state = saved;
    if (_state.appMeta) { _state.appMeta.version = DEFAULT_STATE.appMeta.version; _state.appMeta.buildRun = DEFAULT_STATE.appMeta.buildRun; }
    if (!_state.prompts) _state.prompts = [];
    if (!_state.errors)  _state.errors  = [];
    if (!_state.runs)    _state.runs    = [];
    if (!_state.architectureIntelligence) _state.architectureIntelligence = { reports: [], activeReportId: null, validationResults: [], riskScores: {}, originalityChecks: [], blueprintOutputs: [], lastGeneratedAt: null };
    if (!_state.blueprintCompiler) _state.blueprintCompiler = { compiledBlueprints: [], activeBlueprintId: null, generatedPrompts: [], blueprintTemplates: [], compilerSettings: { originalityStrictMode: true, includeFolderStructure: true, includeStatePlan: true, includeUXPlan: true, includeValidationPlan: true, includeDeploymentPlan: true, includeRunPlan: true }, lastCompiledAt: null };
    if (!_state.exportCentre) _state.exportCentre = { exportPacks: [], activeExportPackId: null, demoModeEnabled: false, demoProjects: [], presentationSettings: { includeBranding: true, includeSafetyNotice: true, includeRiskScorecard: true, includeImplementationRoadmap: true, includeBuildPrompt: true, includeDeveloperBrief: true, includeInvestorSummary: true }, lastExportedAt: null };
    if (!_state.productReadiness) _state.productReadiness = { checks: [], testRuns: [], activeTestRunId: null, pwaStatus: {}, deploymentStatus: {}, responsiveStatus: {}, performanceStatus: {}, issueLog: [], readinessScore: 0, lastTestedAt: null };
    if (!_state.apiConfig) _state.apiConfig = { providers:{}, aiAgents:{}, projectConnectors:{}, activeAgentId:null, lastUpdated:null };
    if (!_state.projectDiscovery) _state.projectDiscovery = { discoveredProjects: [], activeDiscoveryId: null, discoveryRuns: [], sourceConnections: [], importedArchives: [], manualProjectRecords: [], projectHealthReports: [], rescueQueue: [], discoverySettings: { allowPublicUrlChecks: true, allowUploadedZipInspection: true, allowManualEntry: true, allowConnectedSources: false, safeMode: true, neverExportSecrets: true, requireUserSelectionForDeviceFiles: true }, lastDiscoveryRunAt: null };
    _state.systemHealth = calculateSystemHealth(_state);
  } else {
    _state = deepClone(DEFAULT_STATE);
    _state.appMeta.createdAt = _state.appMeta.lastUpdated = new Date().toISOString();
  }
}

bootstrap();

// ── Public API ────────────────────────────────────────────────
export function getState()  { return deepClone(_state); }

export function setState(updaterOrObject) {
  const prev = deepClone(_state);
  const next = typeof updaterOrObject === "function" ? updaterOrObject(prev) : { ...prev, ...updaterOrObject };
  next.appMeta.lastUpdated = new Date().toISOString();
  next.systemHealth = calculateSystemHealth(next);
  _state = next; persist(_state); notify(_state);
}

export function updateState(path, value) {
  const next = setByPath(_state, path, value);
  next.appMeta.lastUpdated = new Date().toISOString();
  next.systemHealth = calculateSystemHealth(next);
  _state = next; persist(_state); notify(_state);
}

export function resetState() {
  _state = deepClone(DEFAULT_STATE);
  _state.appMeta.createdAt = _state.appMeta.lastUpdated = new Date().toISOString();
  _state.systemHealth = calculateSystemHealth(_state);
  persist(_state); notify(_state);
}

export function seedInitialState() {
  const { seedData } = _seedModule;
  const next = deepClone(_state);
  if (next.projects.length === 0) next.projects = deepClone(seedData.projects);
  if (next.prompts.length  === 0) next.prompts  = deepClone(seedData.prompts);
  if (next.errors.length   === 0) next.errors   = deepClone(seedData.errors);
  if (next.runs.length     === 0) next.runs     = deepClone(seedData.runs || []);
  next.appMeta.lastUpdated = new Date().toISOString();
  next.systemHealth = calculateSystemHealth(next);
  _state = next; persist(_state); notify(_state);
}

export function subscribe(listener) {
  _listeners.push(listener);
  return () => { _listeners = _listeners.filter((l) => l !== listener); };
}

// ── Collection Helpers ────────────────────────────────────────
const VALID_COLLECTIONS = ["projects","prompts","runs","errors","agents"];

function assertCollection(name) {
  if (!VALID_COLLECTIONS.includes(name)) throw new Error(`[AP3X SSOT] Invalid collection: "${name}".`);
}

export function getCollection(name) { assertCollection(name); return deepClone(_state[name] || []); }

export function addItem(name, item, actionName = "ADD_ITEM") {
  assertCollection(name);
  const next    = deepClone(_state);
  const newItem = { ...item, id: item.id || createId(name.slice(0,-1)), createdAt: item.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
  next[name]    = [...(next[name] || []), newItem];
  next.appMeta.lastUpdated = new Date().toISOString();
  next.systemHealth = calculateSystemHealth(next);
  _state = next; persist(_state); notify(_state);
  console.debug(`[AP3X SSOT] ${actionName}`);
  return deepClone(newItem);
}

export function updateItem(name, id, patch, actionName = "UPDATE_ITEM") {
  assertCollection(name);
  const next = deepClone(_state);
  const idx  = next[name].findIndex((i) => i.id === id);
  if (idx === -1) { console.warn(`[AP3X SSOT] updateItem: "${id}" not found`); return; }
  next[name][idx] = { ...next[name][idx], ...patch, updatedAt: new Date().toISOString() };
  next.appMeta.lastUpdated = new Date().toISOString();
  next.systemHealth = calculateSystemHealth(next);
  _state = next; persist(_state); notify(_state);
  console.debug(`[AP3X SSOT] ${actionName} → ${name}[${id}]`);
}

export function deleteItem(name, id, actionName = "DELETE_ITEM") {
  assertCollection(name);
  const next = deepClone(_state);
  next[name] = next[name].filter((i) => i.id !== id);
  next.appMeta.lastUpdated = new Date().toISOString();
  next.systemHealth = calculateSystemHealth(next);
  _state = next; persist(_state); notify(_state);
  console.debug(`[AP3X SSOT] ${actionName} → ${name}[${id}]`);
}

// ── Project helpers (Run 2) ───────────────────────────────────
export function addProject(p)        { return addItem("projects", p, "ADD_PROJECT"); }
export function updateProject(id, patch) { return updateItem("projects", id, patch, "UPDATE_PROJECT"); }
export function deleteProject(id)    { return deleteItem("projects", id, "DELETE_PROJECT"); }

export function archiveProjectById(id) {
  const p = _state.projects.find((x) => x.id === id); if (!p) return;
  updateItem("projects", id, { flags: { ...p.flags, isArchived: true }, status: "archived" }, "ARCHIVE_PROJECT");
}
export function restoreProjectById(id) {
  const p = _state.projects.find((x) => x.id === id); if (!p) return;
  updateItem("projects", id, { flags: { ...p.flags, isArchived: false }, status: p.status === "archived" ? "draft" : p.status }, "RESTORE_PROJECT");
}
export function duplicateProject(id) {
  const p = _state.projects.find((x) => x.id === id); if (!p) return null;
  const now = new Date().toISOString();
  const copy = JSON.parse(JSON.stringify(p));
  copy.id = createId("project"); copy.name = `${p.name} (Copy)`; copy.slug = `${p.slug}-copy`;
  copy.createdAt = now; copy.updatedAt = now;
  copy.flags = { ...copy.flags, isArchived: false };
  return addItem("projects", copy, "DUPLICATE_PROJECT");
}
export function importProject(project) { return addItem("projects", project, "IMPORT_PROJECT"); }

// ── Project health update (Run 4) ─────────────────────────────
export function applyProjectHealthRecommendationById(projectId) {
  const project = _state.projects.find((x) => x.id === projectId); if (!project) return;
  const { applyProjectHealthRecommendation } = _errorUtilsModule;
  const patch = applyProjectHealthRecommendation(project, _state.errors);
  updateItem("projects", projectId, patch, "APPLY_PROJECT_HEALTH");
}

// ── Prompt helpers (Run 3) ────────────────────────────────────
export function addPrompt(p)         { return addItem("prompts", p, "ADD_PROMPT"); }
export function updatePrompt(id, patch) { return updateItem("prompts", id, patch, "UPDATE_PROMPT"); }
export function deletePrompt(id)     { return deleteItem("prompts", id, "DELETE_PROMPT"); }

export function archivePromptById(id) {
  const p = _state.prompts.find((x) => x.id === id); if (!p) return;
  updateItem("prompts", id, { flags: { ...p.flags, isArchived: true }, status: "archived" }, "ARCHIVE_PROMPT");
}
export function restorePromptById(id) {
  const p = _state.prompts.find((x) => x.id === id); if (!p) return;
  updateItem("prompts", id, { flags: { ...p.flags, isArchived: false }, status: p.status === "archived" ? "draft" : p.status }, "RESTORE_PROMPT");
}
export function duplicatePromptById(id) {
  const p = _state.prompts.find((x) => x.id === id); if (!p) return null;
  const { duplicatePrompt } = _promptUtilsModule;
  const copy = duplicatePrompt(p);
  return addItem("prompts", copy, "DUPLICATE_PROMPT");
}
export function importPrompt(p) { return addItem("prompts", p, "IMPORT_PROMPT"); }
export function copyPromptById(id) {
  const p = _state.prompts.find((x) => x.id === id); if (!p) return;
  const now = new Date().toISOString();
  updateItem("prompts", id, { usage: { ...p.usage, timesCopied: (p.usage?.timesCopied||0)+1, lastCopiedAt: now } }, "COPY_PROMPT");
}
export function createPromptVersionById(id, newContent, changeNote = "") {
  const p = _state.prompts.find((x) => x.id === id); if (!p) return;
  const now = new Date().toISOString();
  const v   = p.versioning || { currentVersion: 1, versions: [] };
  const nv  = v.currentVersion + 1;
  updateItem("prompts", id, { content: newContent, versioning: { currentVersion: nv, versions: [...(v.versions||[]), { version: nv, content: newContent, createdAt: now, changeNote: changeNote||`Version ${nv}` }] } }, "CREATE_PROMPT_VERSION");
}
export function togglePromptPinned(id) {
  const p = _state.prompts.find((x) => x.id === id); if (!p) return;
  updateItem("prompts", id, { flags: { ...p.flags, isPinned: !p.flags?.isPinned } }, "TOGGLE_PROMPT_PINNED");
}
export function togglePromptFavourite(id) {
  const p = _state.prompts.find((x) => x.id === id); if (!p) return;
  updateItem("prompts", id, { flags: { ...p.flags, isFavourite: !p.flags?.isFavourite } }, "TOGGLE_PROMPT_FAVOURITE");
}

// ── Error helpers (Run 4) ─────────────────────────────────────
export function addError(error)       { return addItem("errors", error, "ADD_ERROR"); }
export function updateError(id, patch) { return updateItem("errors", id, patch, "UPDATE_ERROR"); }
export function deleteError(id)       { return deleteItem("errors", id, "DELETE_ERROR"); }

export function archiveErrorById(id) {
  const e = _state.errors.find((x) => x.id === id); if (!e) return;
  updateItem("errors", id, { flags: { ...e.flags, isArchived: true }, status: "archived" }, "ARCHIVE_ERROR");
}
export function restoreErrorById(id) {
  const e = _state.errors.find((x) => x.id === id); if (!e) return;
  updateItem("errors", id, { flags: { ...e.flags, isArchived: false }, status: e.status === "archived" ? "open" : e.status }, "RESTORE_ERROR");
}
export function duplicateErrorById(id) {
  const e = _state.errors.find((x) => x.id === id); if (!e) return null;
  const { duplicateError } = _errorUtilsModule;
  const copy = duplicateError(e);
  return addItem("errors", copy, "DUPLICATE_ERROR");
}
export function importError(error)    { return addItem("errors", error, "IMPORT_ERROR"); }

export function importErrorFromLog(rawLog, metadata = {}) {
  const { importErrorFromRawLog } = _errorUtilsModule;
  const result = importErrorFromRawLog(rawLog, metadata, _state.errors);
  if (!result.success) { console.warn("[AP3X SSOT] importErrorFromLog failed:", result.error); return result; }
  addItem("errors", result.error, "IMPORT_ERROR_FROM_LOG");
  return result;
}

export function toggleErrorPinned(id) {
  const e = _state.errors.find((x) => x.id === id); if (!e) return;
  updateItem("errors", id, { flags: { ...e.flags, isPinned: !e.flags?.isPinned } }, "TOGGLE_ERROR_PINNED");
}

export function markErrorFixed(id, resultNotes = "") {
  const e = _state.errors.find((x) => x.id === id); if (!e) return;
  const now = new Date().toISOString();
  updateItem("errors", id, {
    status: "fixed",
    fixPlan: { ...e.fixPlan, fixAttempted: true, fixedAt: now, resultNotes },
  }, "MARK_ERROR_FIXED");
}

export function markErrorReopened(id, reason = "") {
  const e = _state.errors.find((x) => x.id === id); if (!e) return;
  updateItem("errors", id, {
    status: "reopened",
    fixPlan: { ...e.fixPlan, resultNotes: reason ? `Reopened: ${reason}` : e.fixPlan?.resultNotes },
  }, "MARK_ERROR_REOPENED");
}

export function updateErrorFixChecklist(id, steps) {
  const e = _state.errors.find((x) => x.id === id); if (!e) return;
  updateItem("errors", id, { fixPlan: { ...e.fixPlan, steps } }, "UPDATE_ERROR_FIX_CHECKLIST");
}

export function applyProjectClassificationFromError(errorId) {
  const e = _state.errors.find((x) => x.id === errorId); if (!e || !e.linkedProjectId) return;
  applyProjectHealthRecommendationById(e.linkedProjectId);
}

export function exportStateSnapshot() { return JSON.stringify(deepClone(_state), null, 2); }

// ── Module Bridges ────────────────────────────────────────────
const _seedModule       = { seedData: { projects: [], prompts: [], errors: [] } };
const _promptUtilsModule = { duplicatePrompt: (p) => p };
const _errorUtilsModule  = {
  duplicateError: (e) => e,
  applyProjectHealthRecommendation: (p) => p,
  importErrorFromRawLog: () => ({ success: false, error: "not registered" }),
};

export function _registerSeedData(data)      { _seedModule.seedData = data; }
export function _registerPromptUtils(utils)  { _promptUtilsModule.duplicatePrompt = utils.duplicatePrompt; }
export function _registerErrorUtils(utils) {
  if (utils.duplicateError)                   _errorUtilsModule.duplicateError = utils.duplicateError;
  if (utils.applyProjectHealthRecommendation) _errorUtilsModule.applyProjectHealthRecommendation = utils.applyProjectHealthRecommendation;
  if (utils.importErrorFromRawLog)            _errorUtilsModule.importErrorFromRawLog = utils.importErrorFromRawLog;
}

// ════════════════════════════════════════════════════════════
// RUN 5 — RUN HELPERS
// ════════════════════════════════════════════════════════════

export function addRun(run)          { return addItem("runs", run, "ADD_RUN"); }
export function updateRun(id, patch) { return updateItem("runs", id, patch, "UPDATE_RUN"); }
export function deleteRun(id)        { return deleteItem("runs", id, "DELETE_RUN"); }

export function importRun(run)       { return addItem("runs", run, "IMPORT_RUN"); }

export function archiveRunById(id) {
  const r = _state.runs.find((x) => x.id === id); if (!r) return;
  updateItem("runs", id, { flags: { ...r.flags, isArchived: true }, status: "archived" }, "ARCHIVE_RUN");
}
export function restoreRunById(id) {
  const r = _state.runs.find((x) => x.id === id); if (!r) return;
  updateItem("runs", id, { flags: { ...r.flags, isArchived: false }, status: r.status === "archived" ? "planned" : r.status }, "RESTORE_RUN");
}
export function duplicateRunById(id) {
  const r = _state.runs.find((x) => x.id === id); if (!r) return null;
  const { duplicateRun: dup } = _runUtilsModule;
  const copy = dup(r);
  return addItem("runs", copy, "DUPLICATE_RUN");
}
export function toggleRunPinned(id) {
  const r = _state.runs.find((x) => x.id === id); if (!r) return;
  updateItem("runs", id, { flags: { ...r.flags, isPinned: !r.flags?.isPinned } }, "TOGGLE_RUN_PINNED");
}
export function markRunCompleted(id, outcome = {}) {
  const r = _state.runs.find((x) => x.id === id); if (!r) return;
  updateItem("runs", id, {
    status: "completed",
    flags: { ...r.flags, safeToContinue: true, needsFix: false },
    outcome: { ...r.outcome, ...outcome },
  }, "MARK_RUN_COMPLETED");
}
export function markRunFailed(id, notes = "") {
  const r = _state.runs.find((x) => x.id === id); if (!r) return;
  updateItem("runs", id, {
    status: "failed",
    flags: { ...r.flags, needsFix: true, safeToContinue: false },
    outcome: { ...r.outcome, resultNotes: notes || r.outcome?.resultNotes },
  }, "MARK_RUN_FAILED");
}
export function markRunValidated(id, validationResult = "passed") {
  const r = _state.runs.find((x) => x.id === id); if (!r) return;
  updateItem("runs", id, {
    status: "validated",
    flags: { ...r.flags, needsReview: false, safeToContinue: validationResult === "passed" || validationResult === "partial" },
    validation: { ...r.validation, result: validationResult },
  }, "MARK_RUN_VALIDATED");
}
export function updateRunCheckpoint(runId, checkpointId, patch) {
  const r = _state.runs.find((x) => x.id === runId); if (!r) return;
  const checkpoints = (r.checkpoints || []).map((c) =>
    c.id === checkpointId ? { ...c, ...patch, ...(patch.status && (patch.status === "passed" || patch.status === "failed" || patch.status === "skipped") ? { completedAt: new Date().toISOString() } : {}) } : c
  );
  updateItem("runs", runId, { checkpoints }, "UPDATE_RUN_CHECKPOINT");
}
export function addRunCheckpoint(runId, checkpoint) {
  const r = _state.runs.find((x) => x.id === runId); if (!r) return;
  updateItem("runs", runId, { checkpoints: [...(r.checkpoints || []), checkpoint] }, "ADD_RUN_CHECKPOINT");
}
export function deleteRunCheckpoint(runId, checkpointId) {
  const r = _state.runs.find((x) => x.id === runId); if (!r) return;
  updateItem("runs", runId, { checkpoints: (r.checkpoints || []).filter((c) => c.id !== checkpointId) }, "DELETE_RUN_CHECKPOINT");
}
export function updateRunValidationChecklist(runId, checklist) {
  const r = _state.runs.find((x) => x.id === runId); if (!r) return;
  const { calculateValidationSummary: cvs } = _runUtilsModule;
  const summary = cvs(checklist);
  updateItem("runs", runId, { validation: { ...r.validation, checklist, ...summary } }, "UPDATE_RUN_VALIDATION");
}
export function createRunFromPromptId(promptId, projectId = "") {
  const prompt = _state.prompts.find((p) => p.id === promptId); if (!prompt) return null;
  const { createRunFromPrompt } = _runUtilsModule;
  return addItem("runs", createRunFromPrompt(prompt, projectId), "CREATE_RUN_FROM_PROMPT");
}
export function createRunFromErrorId(errorId, promptId = "") {
  const error = _state.errors.find((e) => e.id === errorId); if (!error) return null;
  const { createRunFromError } = _runUtilsModule;
  return addItem("runs", createRunFromError(error, promptId), "CREATE_RUN_FROM_ERROR");
}

// ── Run utils module bridge ───────────────────────────────────
const _runUtilsModule = {
  duplicateRun: (r) => r,
  createRunFromPrompt: () => ({}),
  createRunFromError: () => ({}),
  calculateValidationSummary: () => ({ passedCount: 0, failedCount: 0, warningCount: 0, result: "not_tested" }),
};
export function _registerRunUtils(utils) {
  if (utils.duplicateRun)              _runUtilsModule.duplicateRun              = utils.duplicateRun;
  if (utils.createRunFromPrompt)       _runUtilsModule.createRunFromPrompt       = utils.createRunFromPrompt;
  if (utils.createRunFromError)        _runUtilsModule.createRunFromError        = utils.createRunFromError;
  if (utils.calculateValidationSummary)_runUtilsModule.calculateValidationSummary = utils.calculateValidationSummary;
}


// ── Architecture Intelligence helpers (Run 6) ─────────────────
export function addArchitectureReport(report) {
  const now = new Date().toISOString();
  _state.appMeta.lastUpdated = now;
  _state.architectureIntelligence.reports = [
    ...(_state.architectureIntelligence.reports || []), report,
  ];
  _state.architectureIntelligence.activeReportId = report.id;
  _state.architectureIntelligence.lastGeneratedAt = now;
  persist(_state);
  notify(_state);
  return report;
}
export function updateArchitectureReportById(id, patch) {
  const now = new Date().toISOString();
  _state.architectureIntelligence.reports = (
    _state.architectureIntelligence.reports || []
  ).map((r) => r.id === id ? { ...r, ...patch, updatedAt: now } : r);
  _state.appMeta.lastUpdated = now;
  persist(_state);
  notify(_state);
}
export function deleteArchitectureReportById(id) {
  _state.architectureIntelligence.reports = (
    _state.architectureIntelligence.reports || []
  ).filter((r) => r.id !== id);
  if (_state.architectureIntelligence.activeReportId === id) {
    const remaining = _state.architectureIntelligence.reports;
    _state.architectureIntelligence.activeReportId =
      remaining.length > 0 ? remaining[remaining.length - 1].id : null;
  }
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state);
  notify(_state);
}
export function clearArchitectureReports() {
  _state.architectureIntelligence.reports      = [];
  _state.architectureIntelligence.activeReportId = null;
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state);
  notify(_state);
}

// ── Blueprint Compiler helpers (Run 7) ────────────────────────
export function addCompiledBlueprint(blueprint) {
  const now = new Date().toISOString();
  _state.appMeta.lastUpdated = now;
  _state.blueprintCompiler.compiledBlueprints = [
    ...(_state.blueprintCompiler.compiledBlueprints || []), blueprint,
  ];
  _state.blueprintCompiler.activeBlueprintId = blueprint.id;
  _state.blueprintCompiler.lastCompiledAt    = now;
  persist(_state);
  notify(_state);
  return blueprint;
}
export function updateCompiledBlueprintById(id, patch) {
  const now = new Date().toISOString();
  _state.blueprintCompiler.compiledBlueprints = (
    _state.blueprintCompiler.compiledBlueprints || []
  ).map((b) => b.id === id ? { ...b, ...patch, updatedAt: now } : b);
  _state.appMeta.lastUpdated = now;
  persist(_state);
  notify(_state);
}
export function deleteCompiledBlueprintById(id) {
  _state.blueprintCompiler.compiledBlueprints = (
    _state.blueprintCompiler.compiledBlueprints || []
  ).filter((b) => b.id !== id);
  if (_state.blueprintCompiler.activeBlueprintId === id) {
    const rem = _state.blueprintCompiler.compiledBlueprints;
    _state.blueprintCompiler.activeBlueprintId =
      rem.length > 0 ? rem[rem.length - 1].id : null;
  }
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state);
  notify(_state);
}
export function updateBlueprintCompilerSettings(patch) {
  _state.blueprintCompiler.compilerSettings = {
    ...(_state.blueprintCompiler.compilerSettings || {}), ...patch,
  };
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state);
  notify(_state);
}
export function clearCompiledBlueprints() {
  _state.blueprintCompiler.compiledBlueprints = [];
  _state.blueprintCompiler.activeBlueprintId  = null;
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state);
  notify(_state);
}


// ── Export Centre helpers (Run 8) ─────────────────────────────
export function addExportPack(pack) {
  const now = new Date().toISOString();
  _state.appMeta.lastUpdated = now;
  _state.exportCentre.exportPacks = [...(_state.exportCentre.exportPacks || []), pack];
  _state.exportCentre.activeExportPackId = pack.id;
  _state.exportCentre.lastExportedAt = now;
  persist(_state); notify(_state); return pack;
}
export function updateExportPackById(id, patch) {
  const now = new Date().toISOString();
  _state.exportCentre.exportPacks = (_state.exportCentre.exportPacks || []).map(
    (p) => p.id === id ? { ...p, ...patch, updatedAt: now } : p
  );
  _state.appMeta.lastUpdated = now;
  persist(_state); notify(_state);
}
export function deleteExportPackById(id) {
  _state.exportCentre.exportPacks = (_state.exportCentre.exportPacks || []).filter((p) => p.id !== id);
  if (_state.exportCentre.activeExportPackId === id) {
    const rem = _state.exportCentre.exportPacks;
    _state.exportCentre.activeExportPackId = rem.length > 0 ? rem[rem.length - 1].id : null;
  }
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state); notify(_state);
}
export function clearExportPacks() {
  _state.exportCentre.exportPacks = [];
  _state.exportCentre.activeExportPackId = null;
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state); notify(_state);
}
export function updatePresentationSettings(patch) {
  _state.exportCentre.presentationSettings = { ...(_state.exportCentre.presentationSettings || {}), ...patch };
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state); notify(_state);
}
export function setDemoMode(enabled) {
  _state.exportCentre.demoModeEnabled = !!enabled;
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state); notify(_state);
}
export function setDemoProjects(projects) {
  _state.exportCentre.demoProjects = projects || [];
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state); notify(_state);
}


// ── Product Readiness helpers (Run 9) ────────────────────────
export function addTestRun(run) {
  const now = new Date().toISOString();
  _state.productReadiness.testRuns = [...(_state.productReadiness.testRuns || []), run];
  _state.productReadiness.activeTestRunId = run.id;
  _state.productReadiness.readinessScore  = run.readinessScore || 0;
  _state.productReadiness.lastTestedAt    = now;
  _state.appMeta.lastUpdated = now;
  persist(_state); notify(_state); return run;
}
export function updateProductReadinessStatus(patch) {
  _state.productReadiness = { ...(_state.productReadiness || {}), ...patch };
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state); notify(_state);
}
export function clearTestRuns() {
  _state.productReadiness.testRuns = [];
  _state.productReadiness.activeTestRunId = null;
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state); notify(_state);
}

// ── Project Discovery helpers (Run 10) ───────────────────────
export function addDiscoveredProject(project) {
  const now = new Date().toISOString();
  _state.projectDiscovery.discoveredProjects = [...(_state.projectDiscovery.discoveredProjects || []), project];
  _state.appMeta.lastUpdated = now;
  persist(_state); notify(_state); return project;
}
export function updateDiscoveredProject(id, patch) {
  _state.projectDiscovery.discoveredProjects = (_state.projectDiscovery.discoveredProjects || []).map((p) => p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p);
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state); notify(_state);
}
export function deleteDiscoveredProject(id) {
  _state.projectDiscovery.discoveredProjects = (_state.projectDiscovery.discoveredProjects || []).filter((p) => p.id !== id);
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state); notify(_state);
}
export function addDiscoveryRun(run) {
  _state.projectDiscovery.discoveryRuns = [...(_state.projectDiscovery.discoveryRuns || []), run];
  _state.projectDiscovery.activeDiscoveryId = run.id;
  _state.projectDiscovery.lastDiscoveryRunAt = new Date().toISOString();
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state); notify(_state); return run;
}
export function addToRescueQueue(projectId) {
  const q = _state.projectDiscovery.rescueQueue || [];
  if (!q.includes(projectId)) _state.projectDiscovery.rescueQueue = [...q, projectId];
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state); notify(_state);
}
export function removeFromRescueQueueStorage(projectId) {
  _state.projectDiscovery.rescueQueue = (_state.projectDiscovery.rescueQueue || []).filter((id) => id !== projectId);
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state); notify(_state);
}
export function updateDiscoverySettings(patch) {
  _state.projectDiscovery.discoverySettings = { ...(_state.projectDiscovery.discoverySettings || {}), ...patch };
  _state.appMeta.lastUpdated = new Date().toISOString();
  persist(_state); notify(_state);
}


// ── API Config helpers (Run 11) ───────────────────────────────
export function saveApiProvider(provider) {
  if (!_state.apiConfig) _state.apiConfig = { providers:{}, aiAgents:{}, projectConnectors:{}, activeAgentId:null, lastUpdated:null };
  const now = new Date().toISOString();
  _state.apiConfig.providers[provider.id] = { ...(provider), updatedAt: now };
  _state.apiConfig.lastUpdated = now;
  _state.appMeta.lastUpdated   = now;
  persist(_state); notify(_state);
}
export function deleteApiProvider(id) {
  if (!_state.apiConfig?.providers) return;
  delete _state.apiConfig.providers[id];
  _state.apiConfig.lastUpdated = new Date().toISOString();
  _state.appMeta.lastUpdated   = new Date().toISOString();
  persist(_state); notify(_state);
}
export function saveAiAgent(agent) {
  if (!_state.apiConfig) _state.apiConfig = { providers:{}, aiAgents:{}, projectConnectors:{}, activeAgentId:null, lastUpdated:null };
  const now = new Date().toISOString();
  _state.apiConfig.aiAgents[agent.id] = { ...agent, updatedAt: now };
  _state.apiConfig.lastUpdated = now;
  _state.appMeta.lastUpdated   = now;
  persist(_state); notify(_state);
}
export function deleteAiAgent(id) {
  if (!_state.apiConfig?.aiAgents) return;
  delete _state.apiConfig.aiAgents[id];
  if (_state.apiConfig.activeAgentId === id) _state.apiConfig.activeAgentId = null;
  _state.apiConfig.lastUpdated = new Date().toISOString();
  _state.appMeta.lastUpdated   = new Date().toISOString();
  persist(_state); notify(_state);
}
export function setActiveAgent(id) {
  if (!_state.apiConfig) return;
  _state.apiConfig.activeAgentId = id;
  _state.apiConfig.lastUpdated   = new Date().toISOString();
  _state.appMeta.lastUpdated     = new Date().toISOString();
  persist(_state); notify(_state);
}
export function saveProjectConnector(connector) {
  if (!_state.apiConfig) _state.apiConfig = { providers:{}, aiAgents:{}, projectConnectors:{}, activeAgentId:null, lastUpdated:null };
  const now = new Date().toISOString();
  _state.apiConfig.projectConnectors[connector.id] = { ...connector, updatedAt: now };
  _state.apiConfig.lastUpdated = now;
  _state.appMeta.lastUpdated   = now;
  persist(_state); notify(_state);
}
export function deleteProjectConnector(id) {
  if (!_state.apiConfig?.projectConnectors) return;
  delete _state.apiConfig.projectConnectors[id];
  _state.apiConfig.lastUpdated = new Date().toISOString();
  _state.appMeta.lastUpdated   = new Date().toISOString();
  persist(_state); notify(_state);
}
export function updateApiConfigTestResult(section, id, result) {
  if (!_state.apiConfig?.[section]?.[id]) return;
  const now = new Date().toISOString();
  _state.apiConfig[section][id] = {
    ..._state.apiConfig[section][id],
    testStatus:    result.status,
    testMessage:   result.message,
    verified:      result.status === "ok",
    verifiedAt:    result.status === "ok" ? now : _state.apiConfig[section][id].verifiedAt,
    lastTestedAt:  now,
  };
  _state.apiConfig.lastUpdated = now;
  _state.appMeta.lastUpdated   = now;
  persist(_state); notify(_state);
}

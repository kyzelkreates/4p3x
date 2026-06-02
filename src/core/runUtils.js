// ============================================================
// AP3X BUILD CONTROL OS — runUtils.js
// /src/core/runUtils.js — Run 5
// All run business logic. No mutations. No localStorage.
// ============================================================

import {
  RUN_TYPES, RUN_STATUSES, RUN_VALIDATION_RESULTS,
  RUN_CHECKPOINT_STATUSES, SECRET_CONTENT_TERMS,
} from "./constants.js";
import {
  createRunSlug, sanitizeRunText, sanitizeRunTags,
  validateRunType, validateRunStatus, stripSecretLikeFieldsFromRunImport,
  validateRunRecord, normalizeRunInput,
} from "./validators.js";

// ── ID generator (mirrors storage.js) ────────────────────────
function makeId(prefix = "run") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── Empty structures ──────────────────────────────────────────
export function createEmptyRun() {
  const now = new Date().toISOString();
  return {
    id: makeId("run"),
    title: "",
    slug: "",
    runNumber: "",
    description: "",
    type: "build",
    status: "planned",
    priority: "medium",
    linkedProjectId: "",
    linkedPromptId: "",
    linkedErrorId: "",
    scope: {
      summary: "",
      allowedWork: [],
      forbiddenWork: [],
      filesExpected: [],
      filesTouched: [],
    },
    promptSnapshot: {
      title: "",
      content: "",
      copiedFromPromptId: "",
      copiedAt: null,
    },
    checkpoints: [],
    validation: {
      checklist: [],
      passedCount: 0,
      failedCount: 0,
      warningCount: 0,
      result: "not_tested",
      notes: "",
    },
    outcome: {
      summary: "",
      filesCreated: [],
      filesUpdated: [],
      knownLimitations: "",
      nextRecommendedAction: "",
      resultNotes: "",
    },
    flags: {
      isArchived: false,
      isPinned: false,
      isBlocking: false,
      needsFix: false,
      needsReview: false,
      causedRegression: false,
      safeToContinue: false,
    },
    tags: [],
    createdAt: now,
    updatedAt: now,
  };
}

// ── Create checkpoint ─────────────────────────────────────────
export function createCheckpoint(title = "", description = "") {
  return {
    id: makeId("checkpoint"),
    title: sanitizeRunText(title, 120),
    description: sanitizeRunText(description, 1000),
    status: "pending",
    createdAt: new Date().toISOString(),
    completedAt: null,
    notes: "",
  };
}

// ── Create validation item ────────────────────────────────────
export function createValidationItem(text = "") {
  return {
    id: makeId("vitem"),
    text: sanitizeRunText(text, 500),
    result: "not_tested",
    notes: "",
  };
}

// ── Create from form data ─────────────────────────────────────
export function createRunFromForm(formData, existingRun = null) {
  const now = new Date().toISOString();
  const normalized = normalizeRunInput(formData);
  const base = existingRun ? { ...existingRun } : createEmptyRun();
  return {
    ...base,
    ...normalized,
    id: base.id || makeId("run"),
    slug: createRunSlug(normalized.title),
    type: validateRunType(normalized.type),
    status: validateRunStatus(normalized.status),
    tags: sanitizeRunTags(normalized.tags || []),
    createdAt: base.createdAt || now,
    updatedAt: now,
    // Preserve sub-objects that form doesn't always touch
    checkpoints: existingRun?.checkpoints || [],
    validation: existingRun?.validation || base.validation,
  };
}

// ── Create from prompt ────────────────────────────────────────
export function createRunFromPrompt(prompt, projectId = "") {
  const base = createEmptyRun();
  const now = new Date().toISOString();
  return {
    ...base,
    title: `Prompt Run — ${prompt.title || "Untitled"}`,
    slug: createRunSlug(`prompt-run-${prompt.title || "untitled"}`),
    type: "prompt",
    status: "planned",
    linkedProjectId: projectId,
    linkedPromptId: prompt.id,
    promptSnapshot: {
      title: prompt.title || "",
      content: sanitizeRunText(prompt.content || "", 50000),
      copiedFromPromptId: prompt.id,
      copiedAt: now,
    },
    tags: ["from-prompt", ...(prompt.tags || []).slice(0, 4)],
    createdAt: now,
    updatedAt: now,
  };
}

// ── Create from error ─────────────────────────────────────────
export function createRunFromError(error, promptId = "") {
  const base = createEmptyRun();
  const now = new Date().toISOString();
  return {
    ...base,
    title: `Fix Run — ${error.title || "Untitled"}`,
    slug: createRunSlug(`fix-run-${error.title || "untitled"}`),
    type: "fix",
    status: "planned",
    linkedProjectId: error.linkedProjectId || "",
    linkedErrorId: error.id,
    linkedPromptId: promptId,
    tags: ["from-error", "fix", ...(error.tags || []).slice(0, 3)],
    createdAt: now,
    updatedAt: now,
  };
}

// ── Stats ─────────────────────────────────────────────────────
export function calculateRunStats(runs = []) {
  const active   = runs;
  const archived = active.filter((r) => r.flags?.isArchived);
  const live     = active.filter((r) => !r.flags?.isArchived);
  return {
    total:          active.length,
    archived:       archived.length,
    completed:      live.filter((r) => r.status === "completed").length,
    failed:         live.filter((r) => r.status === "failed").length,
    blocked:        live.filter((r) => r.status === "blocked").length,
    inProgress:     live.filter((r) => r.status === "in_progress").length,
    needsReview:    live.filter((r) => r.status === "needs_review" || r.flags?.needsReview).length,
    validated:      live.filter((r) => r.status === "validated").length,
    safeToContinue: live.filter((r) => r.flags?.safeToContinue).length,
    planned:        live.filter((r) => r.status === "planned").length,
    pinned:         live.filter((r) => r.flags?.isPinned).length,
  };
}

// ── Filter ────────────────────────────────────────────────────
export function filterRuns(runs = [], filters = {}) {
  return runs.filter((r) => {
    if (!filters.showArchived && r.flags?.isArchived) return false;
    if (filters.pinnedOnly && !r.flags?.isPinned) return false;
    if (filters.needsFixOnly && !r.flags?.needsFix) return false;
    if (filters.safeOnly && !r.flags?.safeToContinue) return false;
    if (filters.type   && filters.type   !== "all" && r.type   !== filters.type)   return false;
    if (filters.status && filters.status !== "all" && r.status !== filters.status) return false;
    if (filters.priority && filters.priority !== "all" && r.priority !== filters.priority) return false;
    if (filters.linkedProjectId && filters.linkedProjectId !== "all" && r.linkedProjectId !== filters.linkedProjectId) return false;
    if (filters.linkedPromptId  && filters.linkedPromptId  !== "all" && r.linkedPromptId  !== filters.linkedPromptId)  return false;
    if (filters.linkedErrorId   && filters.linkedErrorId   !== "all" && r.linkedErrorId   !== filters.linkedErrorId)   return false;
    return true;
  });
}

// ── Search ────────────────────────────────────────────────────
export function searchRuns(runs = [], query = "") {
  if (!query.trim()) return runs;
  const q = query.toLowerCase();
  return runs.filter((r) => {
    return (
      r.title?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.runNumber?.toLowerCase().includes(q) ||
      r.tags?.some((t) => t.toLowerCase().includes(q)) ||
      r.promptSnapshot?.title?.toLowerCase().includes(q) ||
      r.promptSnapshot?.content?.toLowerCase().includes(q)
    );
  });
}

// ── Sort ──────────────────────────────────────────────────────
const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 };
const STATUS_ORDER   = { in_progress: 0, needs_review: 1, blocked: 2, planned: 3, ready: 4, completed: 5, failed: 6, validated: 7, archived: 8 };

export function sortRuns(runs = [], sortMode = "newest") {
  const sorted = [...runs];
  if (sortMode === "newest")     return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  if (sortMode === "oldest")     return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  if (sortMode === "run_number") return sorted.sort((a, b) => (parseFloat(a.runNumber) || 0) - (parseFloat(b.runNumber) || 0));
  if (sortMode === "priority")   return sorted.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9));
  if (sortMode === "status")     return sorted.sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));
  if (sortMode === "project")    return sorted.sort((a, b) => (a.linkedProjectId || "").localeCompare(b.linkedProjectId || ""));
  return sorted;
}

// ── Get by ID ─────────────────────────────────────────────────
export function getRunById(runs = [], id) {
  return runs.find((r) => r.id === id) || null;
}

// ── Archive / Restore / Duplicate ────────────────────────────
export function archiveRun(run) {
  return { ...run, flags: { ...run.flags, isArchived: true }, status: "archived", updatedAt: new Date().toISOString() };
}
export function restoreRun(run) {
  return { ...run, flags: { ...run.flags, isArchived: false }, status: run.status === "archived" ? "planned" : run.status, updatedAt: new Date().toISOString() };
}
export function duplicateRun(run) {
  const now = new Date().toISOString();
  return {
    ...JSON.parse(JSON.stringify(run)),
    id: makeId("run"),
    title: `${run.title} (Copy)`,
    slug: createRunSlug(`${run.title}-copy`),
    status: "planned",
    flags: { ...run.flags, isArchived: false, safeToContinue: false },
    checkpoints: (run.checkpoints || []).map((c) => ({ ...c, id: makeId("checkpoint"), status: "pending", completedAt: null })),
    validation: { ...(run.validation || {}), checklist: (run.validation?.checklist || []).map((v) => ({ ...v, id: makeId("vitem"), result: "not_tested", notes: "" })), result: "not_tested", passedCount: 0, failedCount: 0, warningCount: 0 },
    createdAt: now,
    updatedAt: now,
  };
}

// ── Checkpoint update ─────────────────────────────────────────
export function updateCheckpointStatus(run, checkpointId, status, notes = "") {
  const now = new Date().toISOString();
  const checkpoints = (run.checkpoints || []).map((c) => {
    if (c.id !== checkpointId) return c;
    const completed = (status === "passed" || status === "failed" || status === "skipped") ? now : null;
    return { ...c, status, notes: notes || c.notes, completedAt: completed };
  });
  return { ...run, checkpoints, updatedAt: now };
}

// ── Validation summary ────────────────────────────────────────
export function calculateValidationSummary(checklist = []) {
  const passed  = checklist.filter((v) => v.result === "passed").length;
  const failed  = checklist.filter((v) => v.result === "failed").length;
  const warning = checklist.filter((v) => v.result === "warning").length;
  const total   = checklist.length;
  let result = "not_tested";
  if (total === 0)           result = "not_tested";
  else if (failed > 0)       result = "failed";
  else if (warning > 0)      result = "warning";
  else if (passed === total) result = "passed";
  else if (passed > 0)       result = "partial";
  return { passedCount: passed, failedCount: failed, warningCount: warning, result };
}

// ── Readiness ─────────────────────────────────────────────────
export function calculateRunReadiness(run) {
  const checks = [
    !!run.title?.trim(),
    !!run.type,
    !!run.status,
    (run.checkpoints || []).length > 0,
    (run.validation?.checklist || []).length > 0,
    !!run.scope?.summary?.trim(),
  ];
  const passed = checks.filter(Boolean).length;
  return { score: Math.round((passed / checks.length) * 100), checks };
}

// ── Default validation checklist by run type ──────────────────
const CHECKLISTS = {
  build: ["App loads without errors","Sidebar navigation works","State persists after refresh","All mutations through storage.js","No console errors","Build succeeds"],
  fix:   ["Target bug identified","Fix applied to correct file","App still loads after fix","No regressions introduced","Build succeeds","State persists"],
  refactor: ["No functional changes","All existing features work","Build succeeds","No new console errors"],
  deploy:   ["Build output correct","Deployment target configured","No build errors","Live URL responds"],
  database: ["RLS status stated explicitly","Schema change applied","Rollback plan documented","No data loss"],
  safety:   ["No secrets in prompt snapshot","Safety rules present","SSOT enforced","No future-run code"],
  prompt:   ["Prompt has title","Content is text-only","Safety rules checked","No secrets included"],
  test:     ["Test cases defined","Results documented","Pass/fail recorded","Notes added"],
};

export function createDefaultValidationChecklist(runType = "build") {
  const items = CHECKLISTS[runType] || CHECKLISTS.build;
  return items.map((text) => createValidationItem(text));
}

// ── Export ────────────────────────────────────────────────────
export function exportRunAsJson(run) {
  const { result: cleaned, secretsStripped } = stripSecretLikeFieldsFromRunImport(run);
  return { json: JSON.stringify(cleaned, null, 2), warned: secretsStripped };
}

// ── Import ────────────────────────────────────────────────────
export function importRunFromJson(jsonText, existingRuns = []) {
  try {
    const raw = JSON.parse(jsonText);
    if (!raw || typeof raw !== "object") return { success: false, error: "Invalid JSON — must be a run object." };
    const { result: cleaned, secretsStripped } = stripSecretLikeFieldsFromRunImport(raw);
    const normalized = normalizeRunInput(cleaned);
    if (!normalized.title?.trim()) return { success: false, error: "Run title is required." };
    const now = new Date().toISOString();
    // New ID if duplicate
    const isDuplicate = existingRuns.some((r) => r.id === cleaned.id);
    const run = {
      ...createEmptyRun(),
      ...normalized,
      id: isDuplicate ? makeId("run") : (cleaned.id || makeId("run")),
      slug: createRunSlug(normalized.title),
      checkpoints: Array.isArray(cleaned.checkpoints) ? cleaned.checkpoints : [],
      validation: cleaned.validation || { checklist: [], passedCount: 0, failedCount: 0, warningCount: 0, result: "not_tested", notes: "" },
      outcome:    cleaned.outcome    || { summary: "", filesCreated: [], filesUpdated: [], knownLimitations: "", nextRecommendedAction: "", resultNotes: "" },
      flags:      { ...createEmptyRun().flags, ...(cleaned.flags || {}) },
      createdAt:  cleaned.createdAt  || now,
      updatedAt:  now,
    };
    return { success: true, run, secretsStripped };
  } catch (e) {
    return { success: false, error: `JSON parse error: ${e.message}` };
  }
}

// ── Secret masking ────────────────────────────────────────────
export function maskSecretLikeContent(content) {
  if (typeof content !== "string") return content;
  let out = content;
  (SECRET_CONTENT_TERMS || []).forEach((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    try {
      out = out.replace(new RegExp(`(${escaped}[^\\s]{0,40})`, "gi"), "[REDACTED]");
    } catch (_) {}
  });
  return out;
}

// ============================================================
// AP3X BUILD CONTROL OS — Error Utilities
// /src/core/errorUtils.js — Run 4
// ============================================================

import { createId } from "./storage.js";
import {
  normalizeErrorInput, validateErrorRecord,
  detectErrorSignals as detectSignalsFromValidators,
  maskSecretLikeContent,
  stripSecretLikeFieldsFromErrorImport,
} from "./validators.js";

// ── Create empty error ────────────────────────────────────────
export function createEmptyError() {
  const now = new Date().toISOString();
  return {
    id: createId("error"),
    title: "", slug: "", description: "", rawLog: "",
    category: "unknown", source: "manual",
    severity: "medium", status: "open", priority: "medium",
    linkedProjectId: "", linkedPromptId: "", linkedRunId: "",
    environment: {
      platform: "", browser: "", device: "", framework: "",
      deploymentTarget: "", url: "", branch: "", buildId: "", timestamp: "",
    },
    diagnosis: {
      suspectedCause: "", affectedArea: "", failurePoint: "",
      reproductionSteps: "", expectedBehaviour: "", actualBehaviour: "",
      userImpact: "", notes: "",
    },
    classification: {
      projectStatusBefore: "", recommendedProjectStatus: "",
      recommendedHealth: "", isBlocking: false, isDeploymentBlocking: false,
      isSecurityRelated: false, isDataLossRisk: false,
      isRegression: false, isRecurring: false,
    },
    fixPlan: {
      summary: "", steps: [], validationSteps: [], rollbackPlan: "",
      linkedFixPromptId: "", fixAttempted: false,
      fixedAt: null, fixedBy: "", resultNotes: "",
    },
    tags: [],
    attachments: { screenshotNotes: "", fileNotes: "", externalReferences: [] },
    flags: {
      isArchived: false, isPinned: false, needsPrompt: false,
      needsHumanReview: false, needsRebuild: false, canBeIgnored: false,
    },
    createdAt: now, updatedAt: now,
  };
}

// ── Create from form data ─────────────────────────────────────
export function createErrorFromForm(formData, existingError = null) {
  const now = new Date().toISOString();
  const base = existingError
    ? { ...existingError }
    : { id: createId("error"), createdAt: now };
  const merged = { ...base, ...formData };
  const normalized = normalizeErrorInput(merged);
  normalized.updatedAt = now;
  if (!normalized.createdAt) normalized.createdAt = now;
  return normalized;
}

// ── Stats ─────────────────────────────────────────────────────
export function calculateErrorStats(errors) {
  const active = errors.filter((e) => !e.flags?.isArchived);
  const open   = active.filter((e) => e.status === "open" || e.status === "investigating" || e.status === "reopened");
  return {
    total:              errors.length,
    open:               open.length,
    critical:           active.filter((e) => e.severity === "critical" && e.status !== "fixed" && e.status !== "validated" && e.status !== "ignored").length,
    high:               active.filter((e) => e.severity === "high"     && e.status !== "fixed" && e.status !== "validated" && e.status !== "ignored").length,
    fixed:              active.filter((e) => e.status === "fixed" || e.status === "validated").length,
    deploymentBlockers: active.filter((e) => e.classification?.isDeploymentBlocking && e.status !== "fixed" && e.status !== "validated").length,
    archived:           errors.filter((e) => e.flags?.isArchived).length,
    investigating:      active.filter((e) => e.status === "investigating").length,
    needsReview:        active.filter((e) => e.flags?.needsHumanReview).length,
  };
}

// ── Filter ────────────────────────────────────────────────────
export function filterErrors(errors, filters) {
  let result = [...errors];
  if (!filters.showArchived) result = result.filter((e) => !e.flags?.isArchived);
  if (filters.pinnedOnly)    result = result.filter((e) => e.flags?.isPinned);
  if (filters.blockersOnly)  result = result.filter((e) => e.classification?.isDeploymentBlocking);
  if (filters.needsReview)   result = result.filter((e) => e.flags?.needsHumanReview);
  if (filters.category  && filters.category  !== "all") result = result.filter((e) => e.category  === filters.category);
  if (filters.source    && filters.source    !== "all") result = result.filter((e) => e.source    === filters.source);
  if (filters.severity  && filters.severity  !== "all") result = result.filter((e) => e.severity  === filters.severity);
  if (filters.status    && filters.status    !== "all") result = result.filter((e) => e.status    === filters.status);
  if (filters.priority  && filters.priority  !== "all") result = result.filter((e) => e.priority  === filters.priority);
  if (filters.linkedProjectId && filters.linkedProjectId !== "all")
    result = result.filter((e) => e.linkedProjectId === filters.linkedProjectId);
  if (filters.linkedPromptId && filters.linkedPromptId !== "all")
    result = result.filter((e) => e.linkedPromptId === filters.linkedPromptId);
  return result;
}

// ── Search ────────────────────────────────────────────────────
export function searchErrors(errors, query) {
  if (!query || query.trim() === "") return errors;
  const q = query.toLowerCase().trim();
  return errors.filter((e) => {
    const hay = [e.title, e.description, e.rawLog, ...(e.tags || [])].join(" ").toLowerCase();
    return hay.includes(q);
  });
}

// ── Sort ──────────────────────────────────────────────────────
const SEV_ORDER = { critical: 4, high: 3, medium: 2, low: 1 };
const PRI_ORDER = { urgent: 4, high: 3, medium: 2, low: 1 };
const STA_ORDER = { open: 6, reopened: 5, investigating: 4, fix_planned: 3, fix_in_progress: 2, fixed: 1, validated: 1, ignored: 0, archived: 0 };

export function sortErrors(errors, sortMode) {
  const arr = [...errors];
  switch (sortMode) {
    case "oldest":   return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case "severity": return arr.sort((a, b) => (SEV_ORDER[b.severity] || 0) - (SEV_ORDER[a.severity] || 0));
    case "priority": return arr.sort((a, b) => (PRI_ORDER[b.priority] || 0) - (PRI_ORDER[a.priority] || 0));
    case "status":   return arr.sort((a, b) => (STA_ORDER[b.status]   || 0) - (STA_ORDER[a.status]   || 0));
    case "project":  return arr.sort((a, b) => (a.linkedProjectId || "").localeCompare(b.linkedProjectId || ""));
    case "newest": default: return arr.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
}

export function getErrorById(errors, id) { return errors.find((e) => e.id === id) || null; }

// ── Archive / Restore / Duplicate ────────────────────────────
export function archiveError(error) {
  return { ...error, flags: { ...error.flags, isArchived: true }, status: "archived", updatedAt: new Date().toISOString() };
}
export function restoreError(error) {
  return { ...error, flags: { ...error.flags, isArchived: false }, status: error.status === "archived" ? "open" : error.status, updatedAt: new Date().toISOString() };
}
export function duplicateError(error) {
  const now  = new Date().toISOString();
  const copy = JSON.parse(JSON.stringify(error));
  copy.id        = createId("error");
  copy.title     = `${error.title} (Copy)`;
  copy.slug      = `${error.slug || ""}-copy`;
  copy.createdAt = now; copy.updatedAt = now;
  copy.status    = "open";
  copy.flags     = { ...copy.flags, isArchived: false, isPinned: false };
  copy.fixPlan   = { ...copy.fixPlan, fixAttempted: false, fixedAt: null, fixedBy: "", resultNotes: "" };
  return copy;
}

// ── Severity from log ─────────────────────────────────────────
export function calculateErrorSeverityFromLog(rawLog) {
  if (!rawLog) return "medium";
  const log = rawLog.toLowerCase();
  if (log.includes("critical") || log.includes("data loss") || log.includes("fatal") ||
      log.includes("security breach") || log.includes("unauthorized access")) return "critical";
  if (log.includes("error") || log.includes("failed") || log.includes("crash") ||
      log.includes("exception") || log.includes("uncaught")) return "high";
  if (log.includes("warning") || log.includes("warn") || log.includes("deprecated") ||
      log.includes("404") || log.includes("timeout")) return "medium";
  return "low";
}

// ── Detect signals from raw log ───────────────────────────────
export function detectErrorSignals(rawLog) {
  if (!rawLog) return { category: "unknown", source: "manual", signals: [] };
  const log = rawLog.toLowerCase();
  const signals = [];
  let category = "unknown";
  let source   = "manual";

  if (log.includes("build failed") || log.includes("vite") || log.includes("esbuild") || log.includes("compilation")) {
    category = "build_error"; source = "vite"; signals.push("Build tool failure detected");
  }
  if (log.includes("deploy") || log.includes("vercel") || log.includes("netlify")) {
    category = "deployment_error"; source = "vercel"; signals.push("Deployment failure detected");
  }
  if (log.includes("supabase") || log.includes("rls") || log.includes("postgres") || log.includes("database")) {
    category = "database_error"; source = "supabase"; signals.push("Database error detected");
  }
  if (log.includes("uncaught") || log.includes("typeerror") || log.includes("referenceerror") || log.includes("crash")) {
    if (category === "unknown") category = "runtime_error"; source = "browser_console"; signals.push("Runtime exception detected");
  }
  if (log.includes("401") || log.includes("403") || log.includes("unauthorized") || log.includes("auth")) {
    if (category === "unknown") category = "auth_error"; signals.push("Auth/permission error detected");
  }
  if (log.includes("manifest") || log.includes("service worker") || log.includes("pwa") || log.includes("install")) {
    if (category === "unknown") category = "pwa_error"; source = "pwa_install"; signals.push("PWA issue detected");
  }
  if (log.includes("localstorage") || log.includes("storage") || log.includes("quota")) {
    if (category === "unknown") category = "storage_error"; signals.push("Storage error detected");
  }
  if (log.includes("404") || log.includes("route") || log.includes("not found")) {
    if (category === "unknown") category = "routing_error"; signals.push("Routing issue detected");
  }
  if (log.includes("security") || log.includes("cors") || log.includes("csp")) {
    if (category === "unknown") category = "security_warning"; signals.push("Security-related issue detected");
  }

  return { category, source, signals };
}

// ── Project classification ────────────────────────────────────
export function classifyProjectFromErrors(project, errors) {
  const linked = errors.filter((e) =>
    e.linkedProjectId === project.id && !e.flags?.isArchived &&
    e.status !== "fixed" && e.status !== "validated" && e.status !== "ignored"
  );
  const health = calculateProjectHealthFromErrors(project, errors);
  const status = getRecommendedProjectStatus(project, errors);
  const reasons = [];

  const critical = linked.filter((e) => e.severity === "critical");
  const high     = linked.filter((e) => e.severity === "high");
  const medium   = linked.filter((e) => e.severity === "medium");
  const blocking = linked.filter((e) => e.classification?.isDeploymentBlocking);
  const security = linked.filter((e) => e.classification?.isSecurityRelated);
  const dataLoss = linked.filter((e) => e.classification?.isDataLossRisk);

  if (critical.length > 0) reasons.push(`${critical.length} critical error(s) unresolved`);
  if (high.length > 0)     reasons.push(`${high.length} high severity error(s)`);
  if (medium.length > 0)   reasons.push(`${medium.length} medium severity error(s)`);
  if (blocking.length > 0) reasons.push(`${blocking.length} deployment blocker(s)`);
  if (security.length > 0) reasons.push(`${security.length} security-related error(s)`);
  if (dataLoss.length > 0) reasons.push(`${dataLoss.length} data loss risk error(s)`);
  if (linked.length === 0) reasons.push("No unresolved errors linked");

  return {
    recommendedHealth: health,
    recommendedStatus: status,
    reasons,
    openErrors: linked.length,
    criticalCount: critical.length,
    highCount: high.length,
    deploymentBlockers: blocking.length,
    securityIssues: security.length,
    dataLossRisks: dataLoss.length,
  };
}

export function calculateProjectHealthFromErrors(project, errors) {
  if (project.flags?.isArchived) return "unknown";
  const linked = errors.filter((e) =>
    e.linkedProjectId === project.id && !e.flags?.isArchived &&
    e.status !== "fixed" && e.status !== "validated" && e.status !== "ignored"
  );
  if (linked.some((e) => e.severity === "critical"))  return "critical";
  if (linked.some((e) => e.severity === "high"))       return "broken";
  if (linked.some((e) => e.severity === "medium"))     return "warning";
  if (linked.length === 0) {
    if ((project.flags?.isInvestorReady || project.status === "investor_ready") &&
        (project.flags?.isDeployed || project.status === "deployed")) return "excellent";
    if (project.status === "working" || project.status === "deployed") return "good";
    return "unknown";
  }
  return "unknown";
}

export function getRecommendedProjectStatus(project, errors) {
  const linked = errors.filter((e) =>
    e.linkedProjectId === project.id && !e.flags?.isArchived &&
    e.status !== "fixed" && e.status !== "validated" && e.status !== "ignored"
  );
  const critical  = linked.filter((e) => e.severity === "critical");
  const high      = linked.filter((e) => e.severity === "high");
  const medium    = linked.filter((e) => e.severity === "medium");
  const blocking  = linked.filter((e) => e.classification?.isDeploymentBlocking);
  const needsRebuild = linked.some((e) => e.flags?.needsRebuild);

  if (needsRebuild) return "needs_rebuild";
  if (critical.length > 0 || (high.length > 0 && blocking.length > 0)) return "broken";
  if (high.length > 0) return "broken";
  if (medium.length > 0) return "partial";
  if (linked.length === 0 && (project.status === "working" || project.status === "deployed")) return project.status;
  return project.status;
}

// applyProjectHealthRecommendation is a pure function — it returns the patch.
// Actual storage mutation goes through storage.js.
export function applyProjectHealthRecommendation(project, errors) {
  const classification = classifyProjectFromErrors(project, errors);
  return {
    status: classification.recommendedStatus,
    health: classification.recommendedHealth,
    updatedAt: new Date().toISOString(),
  };
}

// ── Export / Import ───────────────────────────────────────────
export function exportErrorAsJson(error) {
  const { obj: safe, warned } = stripSecretLikeFieldsFromErrorImport(JSON.parse(JSON.stringify(error)));
  return { json: JSON.stringify(safe, null, 2), warned };
}

export function importErrorFromJson(jsonText, existingErrors = []) {
  let parsed;
  try { parsed = JSON.parse(jsonText); }
  catch { return { success: false, error: "Invalid JSON — could not parse." }; }
  if (typeof parsed !== "object" || Array.isArray(parsed) || parsed === null)
    return { success: false, error: "JSON must be a single error object." };

  const { obj: clean, warned } = stripSecretLikeFieldsFromErrorImport(parsed);
  const existingIds = new Set(existingErrors.map((e) => e.id));
  if (!clean.id || existingIds.has(clean.id)) clean.id = createId("error");

  const now = new Date().toISOString();
  if (!clean.createdAt) clean.createdAt = now;
  clean.updatedAt = now;
  clean.source = "imported_json";

  const normalized = normalizeErrorInput(clean);
  const validation = validateErrorRecord(normalized);
  if (!validation.valid) return { success: false, error: `Validation failed: ${validation.errors.join(" ")}` };

  return { success: true, error: normalized, secretsStripped: warned };
}

export function importErrorFromRawLog(rawLog, metadata = {}, existingErrors = []) {
  if (!rawLog || rawLog.trim() === "") return { success: false, error: "Raw log is required." };
  if (rawLog.length > 50000) return { success: false, error: "Log exceeds 50,000 character limit." };

  const signals  = detectErrorSignals(rawLog);
  const severity = calculateErrorSeverityFromLog(rawLog);
  const now      = new Date().toISOString();

  const err = normalizeErrorInput({
    id:          createId("error"),
    title:       metadata.title || `Imported Log — ${new Date().toLocaleString()}`,
    description: metadata.description || signals.signals.join(". "),
    rawLog:      rawLog.trim(),
    category:    metadata.category || signals.category,
    source:      metadata.source   || signals.source,
    severity:    metadata.severity || severity,
    status:      "open",
    priority:    metadata.priority || (severity === "critical" ? "urgent" : severity === "high" ? "high" : "medium"),
    linkedProjectId: metadata.linkedProjectId || "",
    createdAt: now, updatedAt: now,
  });

  return { success: true, error: err, signals: signals.signals };
}

// ── Secret masking ────────────────────────────────────────────
export { maskSecretLikeContent };

// ── Fix checklist ─────────────────────────────────────────────
export function createFixChecklistFromError(error) {
  const steps = [];
  const cat   = error.category || "unknown";
  const sev   = error.severity || "medium";

  if (sev === "critical" || sev === "high") {
    steps.push({ id: createId("step"), text: "Identify and isolate the failure point", completed: false });
    steps.push({ id: createId("step"), text: "Preserve current state — do not wipe localStorage", completed: false });
  }
  if (cat === "build_error" || cat === "deployment_error") {
    steps.push({ id: createId("step"), text: "Run `npm run build` locally and confirm error", completed: false });
    steps.push({ id: createId("step"), text: "Check Vite build output for the specific file and line", completed: false });
    steps.push({ id: createId("step"), text: "Fix only the identified issue — do not rewrite", completed: false });
    steps.push({ id: createId("step"), text: "Run build again and confirm clean output", completed: false });
  }
  if (cat === "runtime_error") {
    steps.push({ id: createId("step"), text: "Reproduce error in browser console", completed: false });
    steps.push({ id: createId("step"), text: "Add error boundary or try/catch at failure point", completed: false });
    steps.push({ id: createId("step"), text: "Verify fix does not break adjacent functionality", completed: false });
  }
  if (cat === "database_error") {
    steps.push({ id: createId("step"), text: "State RLS status explicitly before any SQL changes", completed: false });
    steps.push({ id: createId("step"), text: "Test query in Supabase SQL editor first", completed: false });
    steps.push({ id: createId("step"), text: "Include rollback plan before applying migration", completed: false });
  }
  if (cat === "pwa_error") {
    steps.push({ id: createId("step"), text: "Check manifest.json for errors", completed: false });
    steps.push({ id: createId("step"), text: "Verify service worker registration", completed: false });
    steps.push({ id: createId("step"), text: "Test install prompt in Chrome DevTools Application tab", completed: false });
  }

  steps.push({ id: createId("step"), text: "Write validation test or manual test case", completed: false });
  steps.push({ id: createId("step"), text: "Confirm error does not reappear — mark as Fixed", completed: false });

  return steps;
}

export function parseFixSteps(text) {
  if (!text || typeof text !== "string") return [];
  return text.split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => ({
      id: createId("step"),
      text: line.replace(/^[-*\d.]+\s*/, "").trim(),
      completed: false,
    }));
}

export function updateErrorFixStep(error, stepId, completed) {
  const steps = (error.fixPlan?.steps || []).map((s) =>
    s.id === stepId ? { ...s, completed } : s
  );
  return { ...error, fixPlan: { ...error.fixPlan, steps }, updatedAt: new Date().toISOString() };
}

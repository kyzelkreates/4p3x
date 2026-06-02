// ============================================================
// AP3X BUILD CONTROL OS — Project Utilities
// /src/core/projectUtils.js — Run 2
// ============================================================

import { createId } from "./storage.js";
import { normalizeProjectInput, validateProject } from "./validators.js";
import { SECRET_FIELD_NAMES } from "./constants.js";

// ── Create empty project template ────────────────────────────
export function createEmptyProject() {
  const now = new Date().toISOString();
  return {
    id: createId("project"),
    name: "",
    slug: "",
    description: "",
    type: "pwa",
    status: "draft",
    priority: "medium",
    stage: "idea",
    health: "unknown",
    category: "",
    sector: "",
    owner: "",
    tags: [],
    links: {
      github: "", vercel: "", liveUrl: "",
      base44: "", supabase: "", docs: "", figma: "", other: "",
    },
    stack: {
      frontend: "", backend: "", database: "",
      ai: "", deployment: "", auth: "", storage: "",
    },
    notes: "",
    nextAction: "",
    risks: [],
    blockers: [],
    metrics: {
      completionPercent: 0,
      investorReadiness: 0,
      technicalHealth: 0,
      deploymentReadiness: 0,
    },
    flags: {
      isTemplate: false,
      isArchived: false,
      isInvestorReady: false,
      isDeployed: false,
      needsRebuild: false,
      hasPwa: false,
      hasBackend: false,
      hasAi: false,
    },
    createdAt: now,
    updatedAt: now,
  };
}

// ── Create project from form data ─────────────────────────────
export function createProjectFromForm(formData, existingProject = null) {
  const now = new Date().toISOString();
  const base = existingProject
    ? { ...existingProject }
    : { id: createId("project"), createdAt: now };

  const merged = { ...base, ...formData };
  const normalized = normalizeProjectInput(merged);
  normalized.updatedAt = now;
  if (!normalized.createdAt) normalized.createdAt = now;

  return normalized;
}

// ── Stats calculator ──────────────────────────────────────────
export function calculateProjectStats(projects) {
  const active = projects.filter((p) => !p.flags?.isArchived);
  return {
    total:         projects.length,
    working:       active.filter((p) => p.status === "working" || p.status === "deployed").length,
    broken:        active.filter((p) => p.status === "broken" || p.status === "needs_rebuild").length,
    deployed:      active.filter((p) => p.flags?.isDeployed || p.status === "deployed").length,
    investorReady: active.filter((p) => p.flags?.isInvestorReady || p.status === "investor_ready").length,
    archived:      projects.filter((p) => p.flags?.isArchived).length,
    draft:         active.filter((p) => p.status === "draft" || p.status === "idea").length,
    building:      active.filter((p) => p.status === "building").length,
  };
}

// ── Filter projects ───────────────────────────────────────────
export function filterProjects(projects, filters) {
  let result = [...projects];

  // Show/hide archived
  if (!filters.showArchived) {
    result = result.filter((p) => !p.flags?.isArchived);
  }

  // Status
  if (filters.status && filters.status !== "all") {
    result = result.filter((p) => p.status === filters.status);
  }

  // Type
  if (filters.type && filters.type !== "all") {
    result = result.filter((p) => p.type === filters.type);
  }

  // Priority
  if (filters.priority && filters.priority !== "all") {
    result = result.filter((p) => p.priority === filters.priority);
  }

  return result;
}

// ── Search projects ───────────────────────────────────────────
export function searchProjects(projects, query) {
  if (!query || query.trim() === "") return projects;
  const q = query.toLowerCase().trim();
  return projects.filter((p) => {
    const haystack = [
      p.name, p.description, p.category, p.sector,
      p.owner, p.notes, p.nextAction, ...(p.tags || []),
    ].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}

// ── Sort projects ─────────────────────────────────────────────
export function sortProjects(projects, sortMode) {
  const arr = [...projects];
  const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };

  switch (sortMode) {
    case "oldest":
      return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case "name":
      return arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    case "name_desc":
      return arr.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    case "priority":
      return arr.sort((a, b) =>
        (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
      );
    case "health":
      return arr.sort((a, b) =>
        (b.metrics?.completionPercent || 0) - (a.metrics?.completionPercent || 0)
      );
    case "newest":
    default:
      return arr.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
}

// ── Get project by ID ─────────────────────────────────────────
export function getProjectById(projects, id) {
  return projects.find((p) => p.id === id) || null;
}

// ── Archive project ───────────────────────────────────────────
export function archiveProject(project) {
  return {
    ...project,
    flags: { ...project.flags, isArchived: true },
    status: "archived",
    updatedAt: new Date().toISOString(),
  };
}

// ── Restore project ───────────────────────────────────────────
export function restoreProject(project) {
  return {
    ...project,
    flags: { ...project.flags, isArchived: false },
    status: project.status === "archived" ? "draft" : project.status,
    updatedAt: new Date().toISOString(),
  };
}

// ── Mark working ──────────────────────────────────────────────
export function markProjectWorking(project) {
  return {
    ...project,
    status: "working",
    health: "healthy",
    flags: { ...project.flags, needsRebuild: false },
    updatedAt: new Date().toISOString(),
  };
}

// ── Mark broken ───────────────────────────────────────────────
export function markProjectBroken(project) {
  return {
    ...project,
    status: "broken",
    health: "broken",
    flags: { ...project.flags, needsRebuild: true },
    updatedAt: new Date().toISOString(),
  };
}

// ── Calculate health string ───────────────────────────────────
export function calculateProjectHealth(project) {
  const { metrics = {}, flags = {}, status } = project;
  const avg = (
    (metrics.completionPercent || 0) +
    (metrics.technicalHealth || 0) +
    (metrics.deploymentReadiness || 0)
  ) / 3;

  if (flags.isArchived)     return "archived";
  if (status === "broken" || status === "needs_rebuild") return "broken";
  if (status === "working" || status === "deployed")     return avg >= 80 ? "healthy" : "partial";
  if (avg >= 60)             return "partial";
  return "unknown";
}

// ── Strip secret-like fields from an object (recursive) ───────
function stripSecrets(obj, warned = { v: false }) {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map((item) => stripSecrets(item, warned));
  const out = {};
  for (const [key, val] of Object.entries(obj)) {
    if (SECRET_FIELD_NAMES.includes(key)) {
      warned.v = true; // flag that stripping occurred
      continue;
    }
    out[key] = typeof val === "object" ? stripSecrets(val, warned) : val;
  }
  return out;
}

// ── Export project as JSON ────────────────────────────────────
export function exportProjectAsJson(project) {
  const warned = { v: false };
  const safe = stripSecrets(project, warned);
  return {
    json: JSON.stringify(safe, null, 2),
    warned: warned.v,
  };
}

// ── Import project from pasted JSON ──────────────────────────
export function importProjectFromJson(jsonText, existingProjects = []) {
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return { success: false, error: "Invalid JSON — could not parse." };
  }

  if (typeof parsed !== "object" || Array.isArray(parsed) || parsed === null) {
    return { success: false, error: "JSON must be a single project object." };
  }

  // Strip secrets
  const warned = { v: false };
  const clean = stripSecrets(parsed, warned);

  // Assign new ID if duplicate exists
  const existingIds = new Set(existingProjects.map((p) => p.id));
  if (!clean.id || existingIds.has(clean.id)) {
    clean.id = createId("project");
  }

  // Set timestamps safely
  const now = new Date().toISOString();
  if (!clean.createdAt) clean.createdAt = now;
  clean.updatedAt = now;

  // Normalise
  const normalized = normalizeProjectInput(clean);

  // Validate
  const validation = validateProject(normalized);
  if (!validation.valid) {
    return {
      success: false,
      error: `Validation failed: ${validation.errors.join(" ")}`,
    };
  }

  return {
    success: true,
    project: normalized,
    secretsStripped: warned.v,
  };
}

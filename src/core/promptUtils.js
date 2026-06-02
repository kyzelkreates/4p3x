// ============================================================
// AP3X BUILD CONTROL OS — Prompt Utilities
// /src/core/promptUtils.js — Run 3
// ============================================================

import { createId } from "./storage.js";
import {
  normalizePromptInput,
  validatePrompt,
  detectPromptSafetyRules,
  calculatePromptSafetyScore,
  stripSecretLikeFieldsFromPromptImport,
  detectSecretLikeContent,
} from "./validators.js";

// ── Create empty prompt ───────────────────────────────────────
export function createEmptyPrompt() {
  const now = new Date().toISOString();
  return {
    id: createId("prompt"),
    title: "",
    slug: "",
    description: "",
    content: "",
    type: "base44",
    category: "build",
    status: "draft",
    priority: "medium",
    linkedProjectId: "",
    linkedRunId: "",
    linkedErrorId: "",
    tags: [],
    platform: { target: "base44", model: "", environment: "", notes: "" },
    safety: {
      hasNoRewriteRule: false, hasNoFeatureCreepRule: false,
      hasSSOTRule: false, hasValidationGates: false,
      hasScopeLock: false, hasRollbackInstruction: false,
      hasDirective1: false, hasRLSStatement: false,
      safetyScore: 0, warnings: [], secretDetected: false,
    },
    versioning: {
      currentVersion: 1,
      versions: [{ version: 1, content: "", createdAt: now, changeNote: "Initial version" }],
    },
    usage: {
      timesCopied: 0, lastCopiedAt: null,
      lastUsedAt: null, resultStatus: "unknown", resultNotes: "",
    },
    flags: {
      isPinned: false, isFavourite: false, isArchived: false,
      isTemplate: false, isMasterPrompt: false, needsReview: false,
    },
    createdAt: now,
    updatedAt: now,
  };
}

// ── Create prompt from form data ──────────────────────────────
export function createPromptFromForm(formData, existingPrompt = null) {
  const now = new Date().toISOString();
  const base = existingPrompt
    ? { ...existingPrompt }
    : { id: createId("prompt"), createdAt: now };

  // Detect if content changed — create new version
  let versioning = base.versioning || {
    currentVersion: 1,
    versions: [{ version: 1, content: formData.content || "", createdAt: now, changeNote: "Initial version" }],
  };

  if (existingPrompt && formData.content !== existingPrompt.content && formData.content) {
    const newVersion = versioning.currentVersion + 1;
    versioning = {
      currentVersion: newVersion,
      versions: [
        ...(versioning.versions || []),
        {
          version: newVersion,
          content: formData.content,
          createdAt: now,
          changeNote: formData.changeNote || `Version ${newVersion}`,
        },
      ],
    };
  }

  const merged = { ...base, ...formData, versioning };
  const normalized = normalizePromptInput(merged);
  normalized.updatedAt = now;
  if (!normalized.createdAt) normalized.createdAt = now;

  return normalized;
}

// ── Stats calculator ──────────────────────────────────────────
export function calculatePromptStats(prompts) {
  const active = prompts.filter((p) => !p.flags?.isArchived);
  const scores = active.map((p) => p.safety?.safetyScore || 0);
  const avgSafety = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  return {
    total:      prompts.length,
    ready:      active.filter((p) => p.status === "ready" || p.status === "tested").length,
    successful: active.filter((p) => p.status === "successful").length,
    failed:     active.filter((p) => p.status === "failed").length,
    master:     active.filter((p) => p.flags?.isMasterPrompt || p.status === "master").length,
    pinned:     active.filter((p) => p.flags?.isPinned).length,
    favourites: active.filter((p) => p.flags?.isFavourite).length,
    archived:   prompts.filter((p) => p.flags?.isArchived).length,
    avgSafety,
  };
}

// ── Filter prompts ────────────────────────────────────────────
export function filterPrompts(prompts, filters) {
  let result = [...prompts];
  if (!filters.showArchived) result = result.filter((p) => !p.flags?.isArchived);
  if (filters.pinnedOnly)    result = result.filter((p) => p.flags?.isPinned);
  if (filters.favouritesOnly) result = result.filter((p) => p.flags?.isFavourite);
  if (filters.type     && filters.type     !== "all") result = result.filter((p) => p.type     === filters.type);
  if (filters.category && filters.category !== "all") result = result.filter((p) => p.category === filters.category);
  if (filters.status   && filters.status   !== "all") result = result.filter((p) => p.status   === filters.status);
  if (filters.priority && filters.priority !== "all") result = result.filter((p) => p.priority === filters.priority);
  if (filters.linkedProjectId && filters.linkedProjectId !== "all")
    result = result.filter((p) => p.linkedProjectId === filters.linkedProjectId);
  return result;
}

// ── Search prompts ────────────────────────────────────────────
export function searchPrompts(prompts, query) {
  if (!query || query.trim() === "") return prompts;
  const q = query.toLowerCase().trim();
  return prompts.filter((p) => {
    const haystack = [
      p.title, p.description, p.content,
      ...(p.tags || []),
    ].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}

// ── Sort prompts ──────────────────────────────────────────────
export function sortPrompts(prompts, sortMode) {
  const arr = [...prompts];
  const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
  switch (sortMode) {
    case "oldest":      return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case "title":       return arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    case "title_desc":  return arr.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    case "priority":    return arr.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
    case "safety":      return arr.sort((a, b) => (b.safety?.safetyScore || 0) - (a.safety?.safetyScore || 0));
    case "most_copied": return arr.sort((a, b) => (b.usage?.timesCopied || 0) - (a.usage?.timesCopied || 0));
    case "newest":
    default:            return arr.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
}

// ── Get by ID ─────────────────────────────────────────────────
export function getPromptById(prompts, id) {
  return prompts.find((p) => p.id === id) || null;
}

// ── Archive ───────────────────────────────────────────────────
export function archivePrompt(prompt) {
  return {
    ...prompt,
    flags: { ...prompt.flags, isArchived: true },
    status: "archived",
    updatedAt: new Date().toISOString(),
  };
}

// ── Restore ───────────────────────────────────────────────────
export function restorePrompt(prompt) {
  return {
    ...prompt,
    flags: { ...prompt.flags, isArchived: false },
    status: prompt.status === "archived" ? "draft" : prompt.status,
    updatedAt: new Date().toISOString(),
  };
}

// ── Duplicate ─────────────────────────────────────────────────
export function duplicatePrompt(prompt) {
  const now = new Date().toISOString();
  const copy = JSON.parse(JSON.stringify(prompt));
  copy.id = createId("prompt");
  copy.title = `${prompt.title} (Copy)`;
  copy.slug = `${prompt.slug}-copy`;
  copy.createdAt = now;
  copy.updatedAt = now;
  copy.flags = { ...copy.flags, isArchived: false, isPinned: false };
  copy.usage = { timesCopied: 0, lastCopiedAt: null, lastUsedAt: null, resultStatus: "unknown", resultNotes: "" };
  copy.versioning = {
    currentVersion: 1,
    versions: [{ version: 1, content: prompt.content, createdAt: now, changeNote: "Duplicated" }],
  };
  return copy;
}

// ── Create version ────────────────────────────────────────────
export function createPromptVersion(prompt, newContent, changeNote = "") {
  const now = new Date().toISOString();
  const currentVersioning = prompt.versioning || { currentVersion: 1, versions: [] };
  const newVersion = currentVersioning.currentVersion + 1;
  return {
    ...prompt,
    content: newContent,
    updatedAt: now,
    versioning: {
      currentVersion: newVersion,
      versions: [
        ...(currentVersioning.versions || []),
        { version: newVersion, content: newContent, createdAt: now, changeNote: changeNote || `Version ${newVersion}` },
      ],
    },
  };
}

// ── Calculate safety ──────────────────────────────────────────
export function calculatePromptSafety(prompt) {
  return calculatePromptSafetyScore(prompt.content || "");
}

// ── Mark copied ───────────────────────────────────────────────
export function markPromptCopied(prompt) {
  const now = new Date().toISOString();
  return {
    ...prompt,
    updatedAt: now,
    usage: {
      ...prompt.usage,
      timesCopied: (prompt.usage?.timesCopied || 0) + 1,
      lastCopiedAt: now,
    },
  };
}

// ── Copy to clipboard (async) ─────────────────────────────────
export async function copyPromptToClipboard(text) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return { success: true };
  }
  // Fallback
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0;";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return { success: true, fallback: true };
  } catch {
    return { success: false };
  }
}

// ── Export as JSON ────────────────────────────────────────────
export function exportPromptAsJson(prompt) {
  const { obj: safe, warned } = stripSecretLikeFieldsFromPromptImport(JSON.parse(JSON.stringify(prompt)));
  return { json: JSON.stringify(safe, null, 2), warned };
}

// ── Export as text ────────────────────────────────────────────
export function exportPromptAsText(prompt) {
  const lines = [
    `# ${prompt.title}`,
    `Type: ${prompt.type} | Category: ${prompt.category} | Status: ${prompt.status}`,
    prompt.description ? `\n${prompt.description}` : "",
    "\n---\n",
    prompt.content || "",
    "\n---",
    `Tags: ${(prompt.tags || []).join(", ")}`,
    `Safety Score: ${prompt.safety?.safetyScore ?? "—"}/100`,
    `Version: ${prompt.versioning?.currentVersion ?? 1}`,
    `Updated: ${prompt.updatedAt ? new Date(prompt.updatedAt).toLocaleString() : "—"}`,
  ];
  return lines.filter((l) => l !== "").join("\n");
}

// ── Import from JSON ──────────────────────────────────────────
export function importPromptFromJson(jsonText, existingPrompts = []) {
  let parsed;
  try { parsed = JSON.parse(jsonText); }
  catch { return { success: false, error: "Invalid JSON — could not parse." }; }
  if (typeof parsed !== "object" || Array.isArray(parsed) || parsed === null)
    return { success: false, error: "JSON must be a single prompt object." };

  const { obj: clean, warned } = stripSecretLikeFieldsFromPromptImport(parsed);

  // Assign new ID if duplicate
  const existingIds = new Set(existingPrompts.map((p) => p.id));
  if (!clean.id || existingIds.has(clean.id)) clean.id = createId("prompt");

  const now = new Date().toISOString();
  if (!clean.createdAt) clean.createdAt = now;
  clean.updatedAt = now;

  const normalized = normalizePromptInput(clean);
  const validation = validatePrompt(normalized);
  if (!validation.valid)
    return { success: false, error: `Validation failed: ${validation.errors.join(" ")}` };

  return { success: true, prompt: normalized, secretsStripped: warned };
}

// ── Import from plain text ────────────────────────────────────
export function importPromptFromText(text, metadata = {}) {
  if (!text || typeof text !== "string" || text.trim() === "")
    return { success: false, error: "Prompt text content is required." };
  if (text.length > 50000)
    return { success: false, error: "Text exceeds 50,000 character limit." };

  const now = new Date().toISOString();
  const secretCheck = detectSecretLikeContent(text);

  const prompt = normalizePromptInput({
    id: createId("prompt"),
    title:    metadata.title    || "Imported Prompt",
    category: metadata.category || "other",
    type:     metadata.type     || "other",
    status:   metadata.status   || "draft",
    priority: metadata.priority || "medium",
    content:  text.trim(),
    tags:     metadata.tags     || [],
    createdAt: now,
    updatedAt: now,
  });

  return {
    success: true,
    prompt,
    secretsStripped: false,
    secretWarning: secretCheck.found
      ? `Secret-like content detected in text: ${secretCheck.terms.join(", ")}`
      : null,
  };
}

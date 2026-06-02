// ============================================================
// AP3X BUILD CONTROL OS — Validators
// /src/core/validators.js — Updated Run 4
// ============================================================

import {
  PROJECT_STATUSES, PROJECT_TYPES,
  PROMPT_TYPES, PROMPT_CATEGORIES, PROMPT_STATUSES,
  ERROR_CATEGORIES, ERROR_SOURCES, ERROR_SEVERITIES, ERROR_STATUSES,
  SECRET_CONTENT_TERMS, SAFETY_RULES, SECRET_FIELD_NAMES,
} from "./constants.js";

// ════════════════════════════════════════════════════════════
// SHARED UTILITIES
// ════════════════════════════════════════════════════════════

export function sanitizeString(value, maxLength = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function createProjectSlug(name) {
  if (!name || typeof name !== "string") return "";
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim()
    .replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
}

export function validateUrl(url) {
  if (!url || url.trim() === "") return { valid: true };
  try {
    const u = new URL(url.trim());
    if (!["http:", "https:"].includes(u.protocol))
      return { valid: false, error: "URL must start with http:// or https://" };
    return { valid: true };
  } catch { return { valid: false, error: "Invalid URL format." }; }
}

export function validatePercent(value) {
  const n = Number(value);
  if (isNaN(n) || n < 0 || n > 100) return { valid: false, error: "Value must be between 0 and 100." };
  return { valid: true, value: Math.round(n) };
}

export function isValidProjectStatus(s)  { return PROJECT_STATUSES.some((x) => x.value === s); }
export function isValidProjectType(t)    { return PROJECT_TYPES.some((x) => x.value === t); }

export function sanitizeTags(tags) {
  if (!Array.isArray(tags)) { if (typeof tags === "string") tags = tags.split(","); else return []; }
  const seen = new Set();
  return tags.map((t) => String(t).trim().toLowerCase().replace(/[^a-z0-9-_]/g, ""))
    .filter((t) => t.length > 0 && !seen.has(t) && seen.add(t));
}

export function detectSecretLikeContent(content) {
  if (!content || typeof content !== "string") return { found: false, terms: [] };
  const found = SECRET_CONTENT_TERMS.filter((term) => content.toLowerCase().includes(term.toLowerCase()));
  return { found: found.length > 0, terms: found };
}

export function maskSecretLikeContent(content) {
  if (!content || typeof content !== "string") return content;
  let masked = content;
  for (const term of SECRET_CONTENT_TERMS) {
    const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^\\s"'\\n]{0,80})`, "gi");
    masked = masked.replace(re, `[MASKED:${term.toUpperCase()}]`);
  }
  return masked;
}

export function stripSecretLikeFieldsFromErrorImport(input) {
  if (typeof input !== "object" || input === null) return { obj: input, warned: false };
  let warned = false;
  function strip(obj) {
    if (typeof obj !== "object" || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(strip);
    const out = {};
    for (const [key, val] of Object.entries(obj)) {
      if (SECRET_FIELD_NAMES.includes(key)) { warned = true; continue; }
      out[key] = typeof val === "object" ? strip(val) : val;
    }
    return out;
  }
  return { obj: strip(input), warned };
}

// Keep Run 3 compat
export { stripSecretLikeFieldsFromErrorImport as stripSecretLikeFieldsFromPromptImport };

// ════════════════════════════════════════════════════════════
// PROJECT VALIDATORS (Runs 1–2)
// ════════════════════════════════════════════════════════════

export function validateProjectName(name) {
  const errors = [];
  if (!name || typeof name !== "string" || name.trim() === "") errors.push("Project name is required.");
  else if (name.trim().length > 80) errors.push("Project name must be 80 characters or fewer.");
  return { valid: errors.length === 0, errors };
}

export function validateProject(data) {
  const errors = [];
  const n = validateProjectName(data.name);
  if (!n.valid) errors.push(...n.errors);
  if (data.description && data.description.length > 500) errors.push("Description max 500 chars.");
  if (data.notes && data.notes.length > 3000) errors.push("Notes max 3000 chars.");
  return { valid: errors.length === 0, errors };
}

export function normalizeProjectInput(input) {
  const out = { ...input };
  out.name        = sanitizeString(input.name || "", 80);
  out.slug        = createProjectSlug(out.name);
  out.description = sanitizeString(input.description || "", 500);
  out.notes       = sanitizeString(input.notes || "", 3000);
  out.nextAction  = sanitizeString(input.nextAction || "", 300);
  out.category    = sanitizeString(input.category || "", 80);
  out.sector      = sanitizeString(input.sector || "", 80);
  out.owner       = sanitizeString(input.owner || "", 80);
  if (!isValidProjectStatus(out.status)) out.status = "draft";
  if (!isValidProjectType(out.type))     out.type   = "other";
  out.tags    = sanitizeTags(input.tags || []);
  out.links   = { github:sanitizeString(input.links?.github||"",300), vercel:sanitizeString(input.links?.vercel||"",300), liveUrl:sanitizeString(input.links?.liveUrl||"",300), base44:sanitizeString(input.links?.base44||"",300), supabase:sanitizeString(input.links?.supabase||"",300), docs:sanitizeString(input.links?.docs||"",300), figma:sanitizeString(input.links?.figma||"",300), other:sanitizeString(input.links?.other||"",300) };
  out.stack   = { frontend:sanitizeString(input.stack?.frontend||"",100), backend:sanitizeString(input.stack?.backend||"",100), database:sanitizeString(input.stack?.database||"",100), ai:sanitizeString(input.stack?.ai||"",100), deployment:sanitizeString(input.stack?.deployment||"",100), auth:sanitizeString(input.stack?.auth||"",100), storage:sanitizeString(input.stack?.storage||"",100) };
  const clamp = (v) => Math.min(100, Math.max(0, Math.round(Number(v) || 0)));
  out.metrics = { completionPercent:clamp(input.metrics?.completionPercent), investorReadiness:clamp(input.metrics?.investorReadiness), technicalHealth:clamp(input.metrics?.technicalHealth), deploymentReadiness:clamp(input.metrics?.deploymentReadiness) };
  const bool = (v) => Boolean(v);
  out.flags   = { isTemplate:bool(input.flags?.isTemplate), isArchived:bool(input.flags?.isArchived), isInvestorReady:bool(input.flags?.isInvestorReady), isDeployed:bool(input.flags?.isDeployed), needsRebuild:bool(input.flags?.needsRebuild), hasPwa:bool(input.flags?.hasPwa), hasBackend:bool(input.flags?.hasBackend), hasAi:bool(input.flags?.hasAi) };
  out.risks    = Array.isArray(input.risks)    ? input.risks.map((r) => sanitizeString(r,200))    : [];
  out.blockers = Array.isArray(input.blockers) ? input.blockers.map((b) => sanitizeString(b,200)) : [];
  const validPriorities = ["low","medium","high","urgent"];
  out.priority = validPriorities.includes(input.priority) ? input.priority : "medium";
  const validStages = ["idea","blueprint","run_1","run_2","run_3_plus","mvp","testing","deployed","scaling","archived"];
  out.stage    = validStages.includes(input.stage) ? input.stage : "idea";
  out.health   = input.health || "unknown";
  return out;
}

// ════════════════════════════════════════════════════════════
// PROMPT VALIDATORS (Run 3)
// ════════════════════════════════════════════════════════════

export function isValidPromptType(t)     { return PROMPT_TYPES.some((x)    => x.value === t); }
export function isValidPromptCategory(c) { return PROMPT_CATEGORIES.some((x) => x.value === c); }
export function isValidPromptStatus(s)   { return PROMPT_STATUSES.some((x)  => x.value === s); }

export function createPromptSlug(title) {
  if (!title || typeof title !== "string") return "";
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim()
    .replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 100);
}

export function validatePromptTitle(title) {
  const errors = [];
  if (!title || typeof title !== "string" || title.trim() === "") errors.push("Prompt title is required.");
  else if (title.trim().length > 100) errors.push("Prompt title must be 100 characters or fewer.");
  return { valid: errors.length === 0, errors };
}

export function validatePromptContent(content) {
  const errors = [];
  if (!content || typeof content !== "string" || content.trim() === "") errors.push("Prompt content is required.");
  else if (content.length > 50000) errors.push("Prompt content must be 50,000 characters or fewer.");
  return { valid: errors.length === 0, errors };
}

export function sanitizePromptTags(tags)    { return sanitizeTags(tags); }
export function sanitizePromptContent(c)    { return typeof c === "string" ? c.slice(0, 50000) : ""; }

export function detectPromptSafetyRules(content) {
  if (!content || typeof content !== "string")
    return SAFETY_RULES.reduce((acc, rule) => { acc[rule.key] = false; return acc; }, {});
  const lower = content.toLowerCase();
  return SAFETY_RULES.reduce((acc, rule) => {
    acc[rule.key] = rule.terms.some((term) => lower.includes(term.toLowerCase()));
    return acc;
  }, {});
}

export function calculatePromptSafetyScore(content) {
  const rules  = detectPromptSafetyRules(content);
  const secret = detectSecretLikeContent(content);
  let score    = 0;
  for (const rule of SAFETY_RULES) { if (rules[rule.key]) score += rule.score; }
  if (secret.found) score = Math.max(0, score - 30);
  const warnings = [];
  if (secret.found) warnings.push(`Secret-like content detected: ${secret.terms.join(", ")}`);
  SAFETY_RULES.forEach((rule) => { if (!rules[rule.key]) warnings.push(`Missing: ${rule.label}`); });
  return { score: Math.min(100, Math.max(0, score)), rules, warnings, secretDetected: secret.found };
}

export function validatePrompt(data) {
  const errors = [];
  const t = validatePromptTitle(data.title);   if (!t.valid) errors.push(...t.errors);
  const c = validatePromptContent(data.content); if (!c.valid) errors.push(...c.errors);
  if (data.description && data.description.length > 500) errors.push("Description max 500 chars.");
  return { valid: errors.length === 0, errors };
}

export function normalizePromptInput(input) {
  const out    = { ...input };
  out.title    = sanitizeString(input.title || "", 100);
  out.slug     = createPromptSlug(out.title);
  out.description = sanitizeString(input.description || "", 500);
  out.content  = sanitizePromptContent(input.content || "");
  if (!isValidPromptType(out.type))     out.type     = "other";
  if (!isValidPromptCategory(out.category)) out.category = "other";
  if (!isValidPromptStatus(out.status)) out.status   = "draft";
  const vp = ["low","medium","high","urgent"];
  out.priority = vp.includes(input.priority) ? input.priority : "medium";
  out.tags     = sanitizePromptTags(input.tags || []);
  out.linkedProjectId = sanitizeString(input.linkedProjectId || "", 100);
  out.linkedRunId     = sanitizeString(input.linkedRunId     || "", 100);
  out.linkedErrorId   = sanitizeString(input.linkedErrorId   || "", 100);
  out.platform = { target:sanitizeString(input.platform?.target||"base44",80), model:sanitizeString(input.platform?.model||"",80), environment:sanitizeString(input.platform?.environment||"",80), notes:sanitizeString(input.platform?.notes||"",500) };
  const safetyResult = calculatePromptSafetyScore(out.content);
  out.safety   = { ...safetyResult.rules, safetyScore:safetyResult.score, warnings:safetyResult.warnings, secretDetected:safetyResult.secretDetected||false };
  out.usage    = { timesCopied:Number(input.usage?.timesCopied)||0, lastCopiedAt:input.usage?.lastCopiedAt||null, lastUsedAt:input.usage?.lastUsedAt||null, resultStatus:["unknown","successful","failed","partial"].includes(input.usage?.resultStatus)?input.usage.resultStatus:"unknown", resultNotes:sanitizeString(input.usage?.resultNotes||"",1000) };
  const bool   = (v) => Boolean(v);
  out.flags    = { isPinned:bool(input.flags?.isPinned), isFavourite:bool(input.flags?.isFavourite), isArchived:bool(input.flags?.isArchived), isTemplate:bool(input.flags?.isTemplate), isMasterPrompt:bool(input.flags?.isMasterPrompt), needsReview:bool(input.flags?.needsReview) };
  if (!out.versioning || !Array.isArray(out.versioning.versions)) {
    const now = new Date().toISOString();
    out.versioning = { currentVersion:1, versions:[{version:1,content:out.content,createdAt:now,changeNote:"Initial version"}] };
  }
  return out;
}

// ════════════════════════════════════════════════════════════
// ERROR VALIDATORS (Run 4)
// ════════════════════════════════════════════════════════════

export function isValidErrorCategory(c) { return ERROR_CATEGORIES.some((x) => x.value === c); }
export function isValidErrorSource(s)   { return ERROR_SOURCES.some((x)     => x.value === s); }
export function isValidErrorSeverity(s) { return ERROR_SEVERITIES.some((x)  => x.value === s); }
export function isValidErrorStatus(s)   { return ERROR_STATUSES.some((x)    => x.value === s); }

export function createErrorSlug(title) {
  if (!title || typeof title !== "string") return "";
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim()
    .replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 120);
}

export function validateErrorTitle(title) {
  const errors = [];
  if (!title || typeof title !== "string" || title.trim() === "") errors.push("Error title is required.");
  else if (title.trim().length > 120) errors.push("Error title must be 120 characters or fewer.");
  return { valid: errors.length === 0, errors };
}

export function validateRawLog(rawLog) {
  if (!rawLog || typeof rawLog !== "string") return { valid: true };
  if (rawLog.length > 50000) return { valid: false, error: "Raw log must be 50,000 characters or fewer." };
  return { valid: true };
}

export function validateErrorCategory(c) {
  if (!c || !isValidErrorCategory(c)) return { valid: false, fallback: "unknown" };
  return { valid: true };
}

export function validateErrorSource(s) {
  if (!s || !isValidErrorSource(s)) return { valid: false, fallback: "manual" };
  return { valid: true };
}

export function validateErrorSeverity(s) {
  if (!s || !isValidErrorSeverity(s)) return { valid: false, fallback: "medium" };
  return { valid: true };
}

export function validateErrorStatus(s) {
  if (!s || !isValidErrorStatus(s)) return { valid: false, fallback: "open" };
  return { valid: true };
}

export function sanitizeErrorTags(tags) { return sanitizeTags(tags); }

export function sanitizeErrorLog(rawLog) {
  if (typeof rawLog !== "string") return "";
  // Store as text only — never execute
  return rawLog.slice(0, 50000);
}

export function validateFixSteps(steps) {
  if (!Array.isArray(steps)) return { valid: false, error: "Steps must be an array." };
  for (const step of steps) {
    if (typeof step !== "object" || !step.text) return { valid: false, error: "Each step must have a text field." };
  }
  return { valid: true };
}

export function detectErrorSignals(rawLog) {
  // Kept here for validators.js consumers — main logic in errorUtils.js
  if (!rawLog) return { category: "unknown", source: "manual", signals: [] };
  return { category: "unknown", source: "manual", signals: [] };
}

export function validateErrorRecord(data) {
  const errors = [];
  const t = validateErrorTitle(data.title); if (!t.valid) errors.push(...t.errors);
  if (data.description && data.description.length > 1000) errors.push("Description max 1000 chars.");
  const l = validateRawLog(data.rawLog); if (!l.valid) errors.push(l.error);
  if (data.diagnosis) {
    const diagFields = ["suspectedCause","affectedArea","failurePoint","reproductionSteps","expectedBehaviour","actualBehaviour","userImpact","notes"];
    for (const f of diagFields) {
      if (data.diagnosis[f] && data.diagnosis[f].length > 3000) errors.push(`Diagnosis "${f}" max 3000 chars.`);
    }
  }
  return { valid: errors.length === 0, errors };
}

export function normalizeErrorInput(input) {
  const out  = { ...input };
  out.title  = sanitizeString(input.title || "", 120);
  out.slug   = createErrorSlug(out.title);
  out.description = sanitizeString(input.description || "", 1000);
  out.rawLog = sanitizeErrorLog(input.rawLog || "");

  if (!isValidErrorCategory(out.category)) out.category = "unknown";
  if (!isValidErrorSource(out.source))     out.source   = "manual";
  if (!isValidErrorSeverity(out.severity)) out.severity = "medium";
  if (!isValidErrorStatus(out.status))     out.status   = "open";

  const vp = ["low","medium","high","urgent"];
  out.priority = vp.includes(input.priority) ? input.priority : "medium";
  out.tags     = sanitizeErrorTags(input.tags || []);
  out.linkedProjectId = sanitizeString(input.linkedProjectId || "", 100);
  out.linkedPromptId  = sanitizeString(input.linkedPromptId  || "", 100);
  out.linkedRunId     = sanitizeString(input.linkedRunId     || "", 100);

  const ss = (v, max = 300) => sanitizeString(v || "", max);
  out.environment = {
    platform:         ss(input.environment?.platform),
    browser:          ss(input.environment?.browser),
    device:           ss(input.environment?.device),
    framework:        ss(input.environment?.framework),
    deploymentTarget: ss(input.environment?.deploymentTarget),
    url:              ss(input.environment?.url, 500),
    branch:           ss(input.environment?.branch),
    buildId:          ss(input.environment?.buildId),
    timestamp:        ss(input.environment?.timestamp),
  };
  out.diagnosis = {
    suspectedCause:      ss(input.diagnosis?.suspectedCause,     3000),
    affectedArea:        ss(input.diagnosis?.affectedArea,       3000),
    failurePoint:        ss(input.diagnosis?.failurePoint,       3000),
    reproductionSteps:   ss(input.diagnosis?.reproductionSteps,  3000),
    expectedBehaviour:   ss(input.diagnosis?.expectedBehaviour,  3000),
    actualBehaviour:     ss(input.diagnosis?.actualBehaviour,    3000),
    userImpact:          ss(input.diagnosis?.userImpact,         3000),
    notes:               ss(input.diagnosis?.notes,              3000),
  };

  const validStatuses = ["idea","draft","building","working","partial","broken","deployed","paused","archived","needs_rebuild","investor_ready"];
  const validHealths  = ["excellent","good","warning","broken","critical","unknown"];
  const bool = (v) => Boolean(v);
  out.classification = {
    projectStatusBefore:        validStatuses.includes(input.classification?.projectStatusBefore) ? input.classification.projectStatusBefore : "",
    recommendedProjectStatus:   validStatuses.includes(input.classification?.recommendedProjectStatus) ? input.classification.recommendedProjectStatus : "",
    recommendedHealth:          validHealths.includes(input.classification?.recommendedHealth) ? input.classification.recommendedHealth : "",
    isBlocking:               bool(input.classification?.isBlocking),
    isDeploymentBlocking:     bool(input.classification?.isDeploymentBlocking),
    isSecurityRelated:        bool(input.classification?.isSecurityRelated),
    isDataLossRisk:           bool(input.classification?.isDataLossRisk),
    isRegression:             bool(input.classification?.isRegression),
    isRecurring:              bool(input.classification?.isRecurring),
  };
  out.fixPlan = {
    summary:           ss(input.fixPlan?.summary,     3000),
    steps:             Array.isArray(input.fixPlan?.steps)           ? input.fixPlan.steps           : [],
    validationSteps:   Array.isArray(input.fixPlan?.validationSteps) ? input.fixPlan.validationSteps : [],
    rollbackPlan:      ss(input.fixPlan?.rollbackPlan, 3000),
    linkedFixPromptId: ss(input.fixPlan?.linkedFixPromptId, 100),
    fixAttempted:      bool(input.fixPlan?.fixAttempted),
    fixedAt:           input.fixPlan?.fixedAt || null,
    fixedBy:           ss(input.fixPlan?.fixedBy, 100),
    resultNotes:       ss(input.fixPlan?.resultNotes, 3000),
  };
  out.attachments = {
    screenshotNotes:    ss(input.attachments?.screenshotNotes,  1000),
    fileNotes:          ss(input.attachments?.fileNotes,        1000),
    externalReferences: Array.isArray(input.attachments?.externalReferences) ? input.attachments.externalReferences.map((r) => ss(r, 500)) : [],
  };
  out.flags = {
    isArchived:       bool(input.flags?.isArchived),
    isPinned:         bool(input.flags?.isPinned),
    needsPrompt:      bool(input.flags?.needsPrompt),
    needsHumanReview: bool(input.flags?.needsHumanReview),
    needsRebuild:     bool(input.flags?.needsRebuild),
    canBeIgnored:     bool(input.flags?.canBeIgnored),
  };
  return out;
}

// ── Legacy ────────────────────────────────────────────────────
export function validateError(data) {
  const errors = [];
  if (!data.title || typeof data.title !== "string" || data.title.trim() === "") errors.push("title is required.");
  const validStatuses = ["open","investigating","fix_planned","fix_in_progress","fixed","validated","reopened","ignored","archived"];
  if (!data.status || !validStatuses.includes(data.status)) errors.push("invalid status.");
  return { valid: errors.length === 0, errors };
}

export function assertSSOT(settings) {
  if (settings && settings.ssotEnforced === false)
    throw new Error("[AP3X] SSOT enforcement disabled — mutation blocked.");
}

// ════════════════════════════════════════════════════════════
// RUN 5 — RUN VALIDATORS
// ════════════════════════════════════════════════════════════

import {
  RUN_TYPES, RUN_STATUSES, RUN_VALIDATION_RESULTS,
  RUN_CHECKPOINT_STATUSES,
} from "./constants.js";

export function sanitizeRunText(value, maxLength = 3000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function sanitizeRunArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((v) => sanitizeRunText(String(v), 500)).filter(Boolean);
}

export function sanitizeRunTags(tags) {
  if (!Array.isArray(tags)) return [];
  const seen = new Set();
  return tags
    .map((t) => String(t).trim().toLowerCase().slice(0, 60))
    .filter((t) => { if (!t || seen.has(t)) return false; seen.add(t); return true; });
}

export function createRunSlug(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 100);
}

export function validateRunTitle(title) {
  if (!title || !title.trim()) return "Run title is required.";
  if (title.trim().length > 120) return "Run title must be 120 characters or fewer.";
  return null;
}

export function validateRunNumber(runNumber) {
  if (runNumber === undefined || runNumber === null || runNumber === "") return null; // optional
  const n = String(runNumber).trim();
  if (n.length > 20) return "Run number must be 20 characters or fewer.";
  return null;
}

export function validateRunType(type) {
  const valid = (RUN_TYPES || []).map((t) => t.value);
  return valid.includes(type) ? type : "other";
}

export function validateRunStatus(status) {
  const valid = (RUN_STATUSES || []).map((s) => s.value);
  return valid.includes(status) ? status : "planned";
}

export function validateValidationResult(result) {
  const valid = (RUN_VALIDATION_RESULTS || []).map((r) => r.value);
  return valid.includes(result) ? result : "not_tested";
}

export function validateCheckpoint(checkpoint) {
  const errors = [];
  if (!checkpoint) { errors.push("Checkpoint is required."); return { valid: false, errors }; }
  if (!checkpoint.title?.trim()) errors.push("Checkpoint title is required.");
  if (checkpoint.title && checkpoint.title.length > 120) errors.push("Checkpoint title max 120 chars.");
  const validStatuses = (RUN_CHECKPOINT_STATUSES || []).map((s) => s.value);
  if (checkpoint.status && !validStatuses.includes(checkpoint.status)) errors.push("Invalid checkpoint status.");
  return { valid: errors.length === 0, errors };
}

export function validateValidationItem(item) {
  const errors = [];
  if (!item) { errors.push("Validation item required."); return { valid: false, errors }; }
  if (!item.text?.trim()) errors.push("Validation item text is required.");
  if (item.text && item.text.length > 500) errors.push("Validation item max 500 chars.");
  return { valid: errors.length === 0, errors };
}

export function normalizeRunInput(input) {
  if (!input || typeof input !== "object") return {};
  return {
    ...input,
    title:       sanitizeRunText(input.title || "", 120),
    description: sanitizeRunText(input.description || "", 1000),
    type:        validateRunType(input.type),
    status:      validateRunStatus(input.status),
    tags:        sanitizeRunTags(input.tags),
    scope: {
      summary:       sanitizeRunText(input.scope?.summary || "", 1000),
      allowedWork:   sanitizeRunArray(input.scope?.allowedWork),
      forbiddenWork: sanitizeRunArray(input.scope?.forbiddenWork),
      filesExpected: sanitizeRunArray(input.scope?.filesExpected),
      filesTouched:  sanitizeRunArray(input.scope?.filesTouched),
    },
    promptSnapshot: {
      title:             sanitizeRunText(input.promptSnapshot?.title   || "", 120),
      content:           sanitizeRunText(input.promptSnapshot?.content || "", 50000),
      copiedFromPromptId:String(input.promptSnapshot?.copiedFromPromptId || ""),
      copiedAt:          input.promptSnapshot?.copiedAt || null,
    },
  };
}

export function stripSecretLikeFieldsFromRunImport(input) {
  if (!input || typeof input !== "object") return { result: {}, secretsStripped: false };
  const SECRET_KEYS = [
    "apiKey","api_key","token","secret","password","privateKey","private_key",
    "accessToken","access_token","refreshToken","refresh_token",
    "clientSecret","client_secret","authorization","x-api-key",
  ];
  let secretsStripped = false;
  function clean(obj) {
    if (Array.isArray(obj)) return obj.map(clean);
    if (obj && typeof obj === "object") {
      const out = {};
      for (const [k, v] of Object.entries(obj)) {
        if (SECRET_KEYS.some((sk) => k.toLowerCase().includes(sk.toLowerCase()))) {
          out[k] = "[REDACTED]"; secretsStripped = true;
        } else { out[k] = clean(v); }
      }
      return out;
    }
    return obj;
  }
  return { result: clean(input), secretsStripped };
}

export function validateRunRecord(run) {
  const errors = [];
  const titleErr = validateRunTitle(run?.title);
  if (titleErr) errors.push(titleErr);
  const numErr = validateRunNumber(run?.runNumber);
  if (numErr) errors.push(numErr);
  if (run?.description && run.description.length > 1000) errors.push("Description max 1000 chars.");
  if (run?.promptSnapshot?.content && run.promptSnapshot.content.length > 50000) errors.push("Prompt snapshot max 50,000 chars.");
  return { valid: errors.length === 0, errors };
}

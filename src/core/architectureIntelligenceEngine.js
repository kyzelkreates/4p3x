// ============================================================
// AP3X BUILD CONTROL OS — architectureIntelligenceEngine.js
// /src/core/architectureIntelligenceEngine.js — Run 6
//
// PURPOSE: Analyse extracted architecture data (projects, prompts,
// runs, errors) and produce structured intelligence objects.
// Works with partial data — never crashes on missing fields.
// No external AI. No external calls. Local-only processing.
// ============================================================

import { createId } from "./storage.js";

const FALLBACK = "No reliable data detected for this section yet.";

function safe(v, fallback = FALLBACK) {
  if (v === null || v === undefined || v === "" ||
      (Array.isArray(v) && v.length === 0)) return fallback;
  return v;
}

function safeArr(v) {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => x !== null && x !== undefined);
}

// ── App type detection ────────────────────────────────────────
const APP_TYPE_SIGNALS = [
  { type: "Control OS",   keywords: ["control os","command centre","control centre","os™","build control"] },
  { type: "SaaS",         keywords: ["saas","subscription","billing","multi-tenant","tier"] },
  { type: "PWA",          keywords: ["pwa","service worker","manifest","offline","installable"] },
  { type: "Dashboard",    keywords: ["dashboard","analytics","metrics","reporting","stats","kpi"] },
  { type: "LMS",          keywords: ["lms","course","lesson","student","instructor","module","quiz","enrol"] },
  { type: "E-commerce",   keywords: ["ecommerce","shop","cart","checkout","product","order","payment","stripe"] },
  { type: "Navigation",   keywords: ["navigation","route","map","gps","directions","fleet","vehicle"] },
  { type: "AI Tool",      keywords: ["ai","llm","openai","groq","prompt","generation","embeddings","inference"] },
  { type: "Admin Panel",  keywords: ["admin","crm","management","back office","staff","roles","permissions"] },
  { type: "API Service",  keywords: ["api","rest","graphql","webhook","endpoint","swagger","openapi"] },
  { type: "Mobile App",   keywords: ["mobile","ios","android","react native","expo","flutter","native"] },
  { type: "Marketing Site",keywords: ["landing","marketing","seo","blog","cms","wordpress","content"] },
  { type: "Developer Tool",keywords: ["cli","devtool","build tool","compiler","linter","ci/cd","pipeline","extractor"] },
];

export function analyseAppType(inputData) {
  const text = JSON.stringify(inputData || {}).toLowerCase();
  const scores = APP_TYPE_SIGNALS.map((sig) => {
    const hits = sig.keywords.filter((kw) => text.includes(kw)).length;
    return { type: sig.type, score: hits };
  }).filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  if (scores.length === 0) return { primary: "Unknown / General App", secondary: [], confidence: 20 };
  const primary = scores[0].type;
  const secondary = scores.slice(1, 3).map((s) => s.type);
  const confidence = Math.min(95, 40 + scores[0].score * 15);
  return { primary, secondary, confidence };
}

// ── Core module extraction ────────────────────────────────────
export function extractCoreModules(inputData) {
  const modules = [];
  const { projects, prompts, runs, errors } = inputData || {};

  if ((projects || []).length > 0) {
    modules.push({ id: "project-registry", name: "Project Registry", description: "Tracks all build projects with status, health, and metadata.", detected: true, confidence: 95 });
  }
  if ((prompts || []).length > 0) {
    modules.push({ id: "prompt-vault", name: "Prompt Vault", description: "Stores, versions, and validates AI build prompts with safety scoring.", detected: true, confidence: 95 });
  }
  if ((errors || []).length > 0) {
    modules.push({ id: "error-centre", name: "Error Centre", description: "Captures, classifies, and triages build failures with fix checklists.", detected: true, confidence: 95 });
  }
  if ((runs || []).length > 0) {
    modules.push({ id: "run-history", name: "Run History", description: "Tracks every build, fix, and validation run with checkpoints and snapshots.", detected: true, confidence: 95 });
  }

  const text = JSON.stringify(inputData || {}).toLowerCase();
  if (text.includes("auth") || text.includes("login") || text.includes("user")) {
    modules.push({ id: "auth", name: "Authentication Module", description: "Handles user identity, roles, and access control.", detected: false, confidence: 40 });
  }
  if (text.includes("payment") || text.includes("stripe") || text.includes("subscription")) {
    modules.push({ id: "payments", name: "Payments / Billing", description: "Subscription or one-time payment processing.", detected: false, confidence: 50 });
  }
  if (text.includes("deploy") || text.includes("vercel") || text.includes("netlify") || text.includes("github")) {
    modules.push({ id: "deployment", name: "Deployment Pipeline", description: "Automated deployment and CI/CD integration.", detected: false, confidence: 45 });
  }
  if (text.includes("ai") || text.includes("llm") || text.includes("openai") || text.includes("groq")) {
    modules.push({ id: "ai-layer", name: "AI Integration Layer", description: "LLM/AI provider integration for generation or analysis.", detected: false, confidence: 60 });
  }
  if (text.includes("export") || text.includes("import") || text.includes("json") || text.includes("csv")) {
    modules.push({ id: "import-export", name: "Import / Export Engine", description: "Data portability layer for JSON, CSV, or Markdown.", detected: true, confidence: 85 });
  }
  if (text.includes("architecture") || text.includes("extractor") || text.includes("intelligence")) {
    modules.push({ id: "architecture-intelligence", name: "Architecture Intelligence", description: "Analyses extracted app data to produce structured rebuild blueprints.", detected: true, confidence: 90 });
  }

  return modules.length > 0 ? modules : [{ id: "unknown", name: "Unknown Module", description: FALLBACK, detected: false, confidence: 0 }];
}

// ── Screen/page extraction ────────────────────────────────────
export function extractScreens(inputData) {
  const screens = [];
  const { projects, prompts, runs, errors } = inputData || {};
  const text = JSON.stringify(inputData || {}).toLowerCase();

  const always = [
    { id: "dashboard",  name: "Dashboard",     type: "primary",   description: "System overview: stats, modules, health indicators." },
    { id: "settings",   name: "Settings",      type: "utility",   description: "App configuration, state management, local data controls." },
  ];
  always.forEach((s) => screens.push(s));

  if ((projects || []).length > 0) screens.push({ id: "projects", name: "Project Registry", type: "primary", description: "Project list, detail, create/edit forms, filters, health panel." });
  if ((prompts  || []).length > 0) screens.push({ id: "prompts",  name: "Prompt Vault",     type: "primary", description: "Prompt list, detail, version history, safety scoring, copy." });
  if ((errors   || []).length > 0) screens.push({ id: "errors",   name: "Error Centre",     type: "primary", description: "Error list, triage, fix checklists, classifier, health." });
  if ((runs     || []).length > 0) screens.push({ id: "runs",     name: "Run History",      type: "primary", description: "Run list, checkpoints, validation, timeline, import/export." });
  if (text.includes("agent") || text.includes("bot")) screens.push({ id: "agents", name: "Agent Board", type: "future", description: "AI agent control plane — future run." });
  if (text.includes("architect") || text.includes("intelligence")) screens.push({ id: "architecture-intelligence", name: "Architecture Intelligence", type: "primary", description: "Report generation, validation, risk scoring, blueprint output." });

  return screens;
}

// ── User journey extraction ───────────────────────────────────
export function extractUserJourneys(inputData) {
  const journeys = [];
  const text = JSON.stringify(inputData || {}).toLowerCase();

  journeys.push({ id: "build-flow", name: "Project Build Flow", steps: ["Create project → Set type/status/priority → Link prompts → Track errors → Record runs → Monitor health"], detected: true });
  journeys.push({ id: "prompt-flow", name: "Prompt Management Flow", steps: ["Create prompt → Score safety → Version → Copy → Apply to run → Archive"], detected: true });
  journeys.push({ id: "error-flow", name: "Error Resolution Flow", steps: ["Log error → Classify severity → Assign fix → Create fix run → Validate → Mark resolved"], detected: true });
  journeys.push({ id: "run-flow", name: "Run Execution Flow", steps: ["Plan run → Add checkpoints → Record validation → Mark outcome → Export report"], detected: true });

  if (text.includes("auth") || text.includes("login")) {
    journeys.push({ id: "auth-flow", name: "Authentication Flow", steps: ["Register/Login → Verify → Access scoped data → Logout"], detected: false });
  }
  if (text.includes("blueprint") || text.includes("intelligence") || text.includes("report")) {
    journeys.push({ id: "intelligence-flow", name: "Architecture Intelligence Flow", steps: ["Select source project → Generate intelligence → Review report → Check originality → Export blueprint"], detected: true });
  }

  return journeys;
}

// ── Data entity extraction ────────────────────────────────────
export function extractDataEntities(inputData) {
  const entities = [];
  const { projects, prompts, runs, errors } = inputData || {};

  if ((projects || []).length > 0) entities.push({ name: "Project", fields: ["id","name","slug","type","status","priority","stage","health","tags","links","stack","metrics","flags","createdAt","updatedAt"], source: "detected" });
  if ((prompts  || []).length > 0) entities.push({ name: "Prompt",  fields: ["id","title","content","type","status","category","tags","safety","versions","flags","createdAt","updatedAt"], source: "detected" });
  if ((errors   || []).length > 0) entities.push({ name: "Error",   fields: ["id","title","type","severity","status","source","linkedProjectId","classification","fixChecklist","flags","createdAt","updatedAt"], source: "detected" });
  if ((runs     || []).length > 0) entities.push({ name: "Run",     fields: ["id","title","runNumber","type","status","priority","scope","promptSnapshot","checkpoints","validation","outcome","flags","createdAt","updatedAt"], source: "detected" });

  const text = JSON.stringify(inputData || {}).toLowerCase();
  if (text.includes("user") || text.includes("auth")) entities.push({ name: "User", fields: ["id","email","role","profile","createdAt"], source: "inferred" });
  if (text.includes("report") || text.includes("intelligence")) {
    entities.push({ name: "ArchitectureReport", fields: ["id","sourceProjectId","title","appType","summary","modules","screens","userJourneys","dataEntities","riskWarnings","originalityNotice","rebuildBlueprint","validationStatus","createdAt","updatedAt"], source: "run6" });
  }

  return entities.length > 0 ? entities : [{ name: "Unknown", fields: [], source: "none" }];
}

// ── Business rules extraction ─────────────────────────────────
export function extractBusinessRules(inputData) {
  const rules = [];
  const text = JSON.stringify(inputData || {}).toLowerCase();

  rules.push({ id: "ssot", rule: "Single Source of Truth", description: "All state lives in storage.js. No component mutates state directly.", origin: "architecture" });
  rules.push({ id: "local-first", rule: "Local-First Persistence", description: "All data stored in localStorage. No backend required for core operation.", origin: "architecture" });
  rules.push({ id: "archive-preferred", rule: "Archive Over Delete", description: "Archiving is preferred over permanent deletion to preserve audit trails.", origin: "pattern" });
  rules.push({ id: "secret-strip", rule: "Secret Field Stripping", description: "On any import or export, secret-like fields (API keys, tokens, passwords) are automatically removed.", origin: "security" });
  rules.push({ id: "no-direct-mutation", rule: "No Direct Array Mutation", description: "Components never push/splice state arrays. All mutations use addItem/updateItem/deleteItem.", origin: "architecture" });
  rules.push({ id: "confirm-delete", rule: "Delete Confirmation Required", description: "Permanent delete requires a ConfirmDialog — no window.confirm.", origin: "ux" });

  if (text.includes("safety") || text.includes("safety score")) {
    rules.push({ id: "prompt-safety", rule: "Prompt Safety Scoring", description: "Prompts are scored 0–100 based on 8 safety rule signals (SSOT, scope lock, validation gates, etc.).", origin: "prompt-vault" });
  }
  if (text.includes("classifier") || text.includes("health")) {
    rules.push({ id: "deterministic-classifier", rule: "Deterministic Health Classification", description: "Project health is classified locally without AI. No external calls.", origin: "error-centre" });
  }
  if (text.includes("originality") || text.includes("legal") || text.includes("blueprint")) {
    rules.push({ id: "originality-guard", rule: "Originality Guardrail", description: "Architecture extraction must not produce clone instructions. All blueprints must be original.", origin: "run6" });
  }

  return rules;
}

// ── Integration needs extraction ──────────────────────────────
export function extractIntegrationNeeds(inputData) {
  const text = JSON.stringify(inputData || {}).toLowerCase();
  const needs = [];

  if (text.includes("github") || text.includes("repo")) needs.push({ name: "GitHub", type: "vcs", status: "planned", run: 8, note: "Repository linking and scanning." });
  if (text.includes("vercel") || text.includes("deploy")) needs.push({ name: "Vercel", type: "deployment", status: "planned", run: 8, note: "Automated deployment hooks." });
  if (text.includes("supabase") || text.includes("database")) needs.push({ name: "Supabase", type: "database", status: "planned", run: 8, note: "Postgres + auth + RLS when multi-user is needed." });
  if (text.includes("stripe") || text.includes("payment")) needs.push({ name: "Stripe", type: "payments", status: "future", run: 9, note: "Billing and subscription management." });
  if (text.includes("openai") || text.includes("groq") || text.includes("llm")) needs.push({ name: "AI Provider", type: "ai", status: "future", run: 7, note: "LLM integration for generation features." });

  if (needs.length === 0) needs.push({ name: "None Required Yet", type: "none", status: "not_applicable", run: null, note: "Current system is fully local-first." });
  return needs;
}

// ── Backend needs ─────────────────────────────────────────────
export function extractBackendNeeds(inputData) {
  const text = JSON.stringify(inputData || {}).toLowerCase();
  const needs = [];

  needs.push({ need: "localStorage SSOT", priority: "active", description: "Current backend — all data in browser localStorage via storage.js." });
  if (text.includes("supabase") || text.includes("postgres") || text.includes("database")) {
    needs.push({ need: "Database (Supabase/Postgres)", priority: "planned", description: "Persistent server-side storage for multi-user or cross-device sync." });
  }
  if (text.includes("api") || text.includes("endpoint") || text.includes("webhook")) {
    needs.push({ need: "REST/Webhook API", priority: "future", description: "Programmatic access to data for integrations or mobile clients." });
  }
  if (text.includes("auth") || text.includes("login")) {
    needs.push({ need: "Auth Service", priority: "future", description: "User authentication, session management, role-based access." });
  }
  return needs;
}

// ── Frontend needs ────────────────────────────────────────────
export function extractFrontendNeeds(inputData) {
  const text = JSON.stringify(inputData || {}).toLowerCase();
  return [
    { need: "React 18 SPA",          status: "active",  description: "Current framework — component-based UI." },
    { need: "Vite Build System",      status: "active",  description: "Fast bundler and dev server." },
    { need: "CSS Custom Properties",  status: "active",  description: "Dark theme design system via CSS variables." },
    { need: "PWA Manifest",           status: "active",  description: "Installable PWA with offline capability." },
    { need: "Mobile Responsive",      status: "active",  description: "CSS responsive layout for desktop/tablet/mobile." },
    ...(text.includes("chart") || text.includes("visual") ? [{ need: "Data Visualisation", status: "future", description: "Charts/graphs for metrics display." }] : []),
    ...(text.includes("drag") || text.includes("kanban") ? [{ need: "Drag-and-Drop", status: "future", description: "Kanban or sortable list interaction." }] : []),
  ];
}

// ── Admin needs ───────────────────────────────────────────────
export function extractAdminNeeds(inputData) {
  const text = JSON.stringify(inputData || {}).toLowerCase();
  const needs = [];
  needs.push({ need: "Settings Page", status: "active", description: "Local state management, seed/export/reset controls." });
  if (text.includes("admin") || text.includes("role") || text.includes("user management")) {
    needs.push({ need: "User Management", status: "future", description: "Admin panel for managing users, roles, and permissions." });
    needs.push({ need: "Audit Log", status: "future", description: "Action history for accountability and debugging." });
  }
  if (text.includes("supabase") || text.includes("database")) {
    needs.push({ need: "Data Admin", status: "planned", description: "CRUD admin for database records (Supabase Studio or custom)." });
  }
  return needs;
}

// ── Auth needs ────────────────────────────────────────────────
export function extractAuthNeeds(inputData) {
  const text = JSON.stringify(inputData || {}).toLowerCase();
  if (text.includes("auth") || text.includes("login") || text.includes("session") || text.includes("supabase")) {
    return { required: true, model: "email+password or OAuth", rls: "Supabase RLS when DB added", currentStatus: "planned for Run 8", note: "Currently single-user local-only." };
  }
  return { required: false, model: "none", rls: "not applicable", currentStatus: "single-user local-only", note: "No auth needed for current local-first scope." };
}

// ── Monetisation needs ────────────────────────────────────────
export function extractMonetisationNeeds(inputData) {
  const text = JSON.stringify(inputData || {}).toLowerCase();
  if (text.includes("saas") || text.includes("subscription") || text.includes("investor") || text.includes("stripe")) {
    return { model: "SaaS Subscription", tiers: ["Free (limited projects)", "Pro (unlimited)", "Team (multi-user)"], engine: "Stripe", status: "future", run: 9 };
  }
  return { model: "None planned yet", tiers: [], engine: null, status: "not_applicable", run: null };
}

// ── Security needs ────────────────────────────────────────────
export function extractSecurityNeeds(inputData) {
  return [
    { area: "Secret Field Stripping",     status: "active",  description: "API keys, tokens, and passwords auto-removed from imports/exports." },
    { area: "No External Calls",          status: "active",  description: "All processing local-only. No data sent to third parties." },
    { area: "Input Sanitisation",         status: "active",  description: "All user input sanitised before storage." },
    { area: "XSS Prevention",             status: "active",  description: "React JSX auto-escapes rendered values." },
    { area: "RLS (Row-Level Security)",   status: "planned", description: "To be configured when Supabase is added in Run 8." },
    { area: "Content Security Policy",    status: "future",  description: "CSP headers needed when deployed to production." },
    { area: "HTTPS / Secure Transport",   status: "deployment", description: "Enforce HTTPS on production deployment." },
  ];
}

// ── Accessibility needs ───────────────────────────────────────
export function extractAccessibilityNeeds() {
  return [
    { area: "ARIA labels",         status: "partial", description: "Buttons and inputs have aria-label attributes." },
    { area: "Focus states",        status: "partial", description: "Keyboard navigation and visible focus rings." },
    { area: "Colour contrast",     status: "partial", description: "Dark theme — contrast should be verified against WCAG AA." },
    { area: "Screen reader",       status: "future",  description: "Full screen-reader testing with NVDA/VoiceOver recommended." },
    { area: "Error announcements", status: "partial", description: "Form errors use role=alert." },
    { area: "Skip navigation",     status: "future",  description: "Add skip-to-content link for keyboard users." },
  ];
}

// ── Missing systems detection ─────────────────────────────────
export function detectMissingSystems(inputData) {
  const missing = [];
  const text = JSON.stringify(inputData || {}).toLowerCase();
  const { projects, prompts, runs, errors } = inputData || {};

  if (!text.includes("auth") && !text.includes("login")) missing.push({ system: "Authentication", severity: "medium", note: "No auth model detected. Required for multi-user/SaaS use." });
  if (!text.includes("database") && !text.includes("supabase")) missing.push({ system: "Persistent Database", severity: "medium", note: "Currently localStorage only. Cloud DB needed for multi-device." });
  if (!text.includes("deploy") && !text.includes("vercel") && !text.includes("netlify")) missing.push({ system: "Deployment Pipeline", severity: "low", note: "No CI/CD or automated deployment detected." });
  if (!text.includes("test") && !text.includes("vitest") && !text.includes("jest")) missing.push({ system: "Automated Testing", severity: "medium", note: "No test suite detected. Add unit + integration tests." });
  if (!text.includes("monitoring") && !text.includes("sentry") && !text.includes("error tracking")) missing.push({ system: "Production Monitoring", severity: "low", note: "No runtime error tracking for production." });
  if (!text.includes("offline") && !text.includes("service worker")) missing.push({ system: "Service Worker / Offline Cache", severity: "low", note: "PWA manifest exists but offline caching strategy unclear." });
  if (!text.includes("backup") && !text.includes("sync")) missing.push({ system: "Data Backup / Sync", severity: "medium", note: "localStorage only — data lost on browser clear. Add export/backup flow." });

  return missing;
}

// ── Confidence score ──────────────────────────────────────────
export function calculateConfidenceScore(report) {
  let score = 0;
  const checks = [
    [report.appType?.primary && report.appType.primary !== "Unknown / General App", 15],
    [(report.modules   || []).filter((m) => m.detected).length > 0, 15],
    [(report.screens   || []).length > 2, 10],
    [(report.userJourneys || []).length > 0, 10],
    [(report.dataEntities || []).length > 0, 10],
    [(report.businessRules || []).length > 0, 10],
    [(report.securityNeeds || []).length > 0, 10],
    [(report.missingSystems || []).length >= 0, 10],
    [!!report.summary && report.summary !== FALLBACK, 10],
  ];
  checks.forEach(([cond, pts]) => { if (cond) score += pts; });
  return Math.min(score, 100);
}

// ── Main entry point ──────────────────────────────────────────
export function generateArchitectureIntelligence(inputData) {
  const safe_data = inputData || {};
  const now = new Date().toISOString();

  const appTypeResult = analyseAppType(safe_data);
  const modules       = extractCoreModules(safe_data);
  const screens       = extractScreens(safe_data);
  const userJourneys  = extractUserJourneys(safe_data);
  const dataEntities  = extractDataEntities(safe_data);
  const businessRules = extractBusinessRules(safe_data);
  const integrations  = extractIntegrationNeeds(safe_data);
  const backendNeeds  = extractBackendNeeds(safe_data);
  const frontendNeeds = extractFrontendNeeds(safe_data);
  const adminNeeds    = extractAdminNeeds(safe_data);
  const authNeeds     = extractAuthNeeds(safe_data);
  const monetisation  = extractMonetisationNeeds(safe_data);
  const securityNeeds = extractSecurityNeeds(safe_data);
  const accessibility = extractAccessibilityNeeds();
  const missingSystems= detectMissingSystems(safe_data);

  const report = {
    appType:          appTypeResult,
    modules,
    screens,
    userJourneys,
    dataEntities,
    businessRules,
    integrations,
    backendNeeds,
    frontendNeeds,
    adminNeeds,
    authNeeds,
    monetisationNeeds: monetisation,
    securityNeeds,
    accessibilityNeeds: accessibility,
    missingSystems,
    summary: null,
  };

  const totalProjects = (safe_data.projects || []).length;
  const totalPrompts  = (safe_data.prompts  || []).length;
  const totalRuns     = (safe_data.runs     || []).length;
  const totalErrors   = (safe_data.errors   || []).length;

  report.summary = `${appTypeResult.primary} system — ${totalProjects} project(s), ${totalPrompts} prompt(s), ${totalRuns} run(s), ${totalErrors} error(s) tracked. ${modules.filter(m=>m.detected).length} active module(s) detected. ${missingSystems.length} missing system(s) identified.`;

  report.confidenceScore = calculateConfidenceScore(report);

  return report;
}

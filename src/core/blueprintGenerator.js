// ============================================================
// AP3X BUILD CONTROL OS — blueprintGenerator.js
// /src/core/blueprintGenerator.js — Run 6
//
// Generates ORIGINAL rebuild blueprints from intelligence reports.
// Never produces clone instructions.
// All outputs reference original design, original branding, lawful data.
// ============================================================

import { SAFE_PHRASES } from "./originalityGuardEngine.js";

// ── Suggested file structure ──────────────────────────────────
export function generateSuggestedFileStructure(report) {
  const modules = (report?.modules || []).filter((m) => m.detected || m.confidence > 50);
  const appType = report?.appType?.primary || "General App";

  const base = [
    "src/",
    "  main.jsx              — app entry point",
    "  App.jsx               — root component + SSOT bridge",
    "  core/",
    "    storage.js          — SINGLE SOURCE OF TRUTH (all state, all mutations)",
    "    constants.js        — app-wide enums, labels, config",
    "    validators.js       — input validation and sanitisation",
    "  components/",
    "    AppShell.jsx        — main layout: sidebar + topbar + content",
    "    Sidebar.jsx         — navigation",
    "    TopBar.jsx          — header bar",
    "    StatCard.jsx        — reusable metric card",
    "    StatusBadge.jsx     — reusable status/label badge",
    "    EmptyState.jsx      — empty list/no-data state",
    "    ConfirmDialog.jsx   — delete/destructive action confirmation",
    "  pages/",
    "    Dashboard.jsx       — overview stats + module registry",
    "    Settings.jsx        — local state controls",
    "  data/",
    "    seedData.js         — safe demo/seed data",
    "  styles/",
    "    global.css          — CSS custom properties design system",
    "public/",
    "  manifest.json         — PWA manifest",
    "index.html",
    "vite.config.js",
    "package.json",
  ];

  const moduleFiles = [];
  modules.forEach((mod) => {
    const n = mod.name.replace(/\s+/g, "");
    if (mod.id === "project-registry")       moduleFiles.push(`  components/${n}Card.jsx, ${n}Form.jsx, ${n}Detail.jsx, ${n}Filters.jsx`);
    else if (mod.id === "prompt-vault")      moduleFiles.push(`  components/${n}Card.jsx, ${n}Form.jsx, ${n}Detail.jsx, SafetyPanel.jsx`);
    else if (mod.id === "error-centre")      moduleFiles.push(`  components/${n}Card.jsx, ${n}Form.jsx, ${n}Detail.jsx, ClassifierPanel.jsx`);
    else if (mod.id === "run-history")       moduleFiles.push(`  components/RunCard.jsx, RunForm.jsx, RunDetail.jsx, CheckpointPanel.jsx, ValidationPanel.jsx`);
    else if (mod.id === "architecture-intelligence") moduleFiles.push(`  core/architectureIntelligenceEngine.js, blueprintGenerator.js`);
    else if (mod.id === "auth")              moduleFiles.push(`  core/authUtils.js (future — Supabase Auth)`);
    else if (mod.id === "payments")          moduleFiles.push(`  core/paymentsUtils.js (future — Stripe)`);
  });

  const extra = [];
  if (appType === "SaaS") extra.push("  core/subscriptionUtils.js — billing logic");
  if (appType === "LMS")  extra.push("  components/CourseCard.jsx, LessonViewer.jsx — LMS UI");
  if (appType === "E-commerce") extra.push("  components/ProductCard.jsx, CartPanel.jsx, CheckoutFlow.jsx");

  return [...base, ...(moduleFiles.length > 0 ? ["", "// Module-specific additions:", ...moduleFiles] : []), ...(extra.length > 0 ? ["", "// App-type-specific additions:", ...extra] : [])].join("\n");
}

// ── Implementation runs ───────────────────────────────────────
export function generateImplementationRuns(report) {
  const modules = (report?.modules || []);
  const appType = report?.appType?.primary || "General App";
  const missing = (report?.missingSystems || []);

  const runs = [
    { run: 1, title: "Core Foundation + SSOT",             description: "App shell, sidebar, topbar, dashboard, global CSS, PWA manifest, storage.js SSOT. No features." },
    { run: 2, title: "Input / Project Capture",             description: "Full project registry with CRUD, filters, search, detail view, JSON import/export." },
    { run: 3, title: "Screen + Feature Mapping",            description: "Prompt vault (or equivalent feature store) with versioning, safety scoring, and copy panel." },
    { run: 4, title: "Workflow + Data Model Mapping",       description: "Error centre with classification, triage, fix checklists, and project health integration." },
    { run: 5, title: "Audit + Run History Layer",           description: "Run history with checkpoints, validation checklists, timelines, and prompt snapshots." },
    { run: 6, title: "Architecture Intelligence + Reporting",description: "Architecture analysis engine, report generation, validation warnings, originality checks, blueprint output." },
  ];

  if (modules.some((m) => m.id === "ai-layer" || m.id === "architecture-intelligence")) {
    runs.push({ run: 7, title: "AI Integration Layer",     description: "LLM provider connection (local or cloud). Prompt chaining. Output validation. Safety guardrails." });
  } else {
    runs.push({ run: 7, title: "Agent Board + Automation", description: "AI agent control plane, task automation, scheduled jobs." });
  }

  runs.push({ run: 8, title: "Connectors + Backend",       description: "GitHub, Vercel, Supabase. Authentication. Row-Level Security. Multi-user support." });

  if (appType === "SaaS" || modules.some((m) => m.id === "payments")) {
    runs.push({ run: 9, title: "Monetisation + Billing",   description: "Stripe integration. Subscription tiers. Billing portal. Webhook handlers." });
  } else {
    runs.push({ run: 9, title: "Deployment + PWA Polish",  description: "Service worker, offline cache, deploy pipeline, performance audit." });
  }

  runs.push({ run: 10, title: "Final QA + Presentation Layer", description: "Full test suite, accessibility audit, investor/client demo mode, documentation." });

  return runs;
}

// ── Component plan ────────────────────────────────────────────
export function generateComponentPlan(report) {
  const components = [
    { name: "AppShell",      type: "layout",  purpose: "Root layout — sidebar + topbar + main content area." },
    { name: "Sidebar",       type: "layout",  purpose: "Navigation — page links, active state, collapse support." },
    { name: "TopBar",        type: "layout",  purpose: "Header — app title, page name, mobile menu toggle." },
    { name: "StatCard",      type: "display", purpose: "Reusable metric card with value, label, variant colour." },
    { name: "StatusBadge",   type: "display", purpose: "Coloured badge for any status/label value." },
    { name: "EmptyState",    type: "ux",      purpose: "Empty list placeholder with icon, title, CTA button." },
    { name: "ConfirmDialog", type: "ux",      purpose: "Modal confirmation for destructive actions." },
    { name: "ModuleCard",    type: "display", purpose: "Module registry card showing run status and lock state." },
  ];

  (report?.modules || []).filter((m) => m.detected).forEach((mod) => {
    const n = mod.name.replace(/\s+/g, "");
    components.push({ name: `${n}Card`,   type: "feature", purpose: `${mod.name} list item with status, quick actions.` });
    components.push({ name: `${n}Form`,   type: "feature", purpose: `${mod.name} create/edit form with validation.` });
    components.push({ name: `${n}Detail`, type: "feature", purpose: `${mod.name} full detail view with all sections.` });
    components.push({ name: `${n}Filters`,type: "feature", purpose: `${mod.name} search, filter, sort bar.` });
  });

  return components;
}

// ── Data model plan ───────────────────────────────────────────
export function generateDataModelPlan(report) {
  return {
    storageStrategy: "localStorage via storage.js SSOT (current). Migrate to Supabase in Run 8 for multi-user.",
    entities: (report?.dataEntities || []).map((e) => ({
      name:    e.name,
      fields:  e.fields,
      source:  e.source,
      storage: e.source === "inferred" ? "future" : "current",
    })),
    relationships: [
      "Project → has many Errors (linkedProjectId)",
      "Project → has many Runs (linkedProjectId)",
      "Project → has many Prompts (linkedProjectId)",
      "Run → linked to one Prompt (linkedPromptId)",
      "Run → linked to one Error (linkedErrorId)",
      "Run → has many Checkpoints (embedded)",
      "Run → has one ValidationChecklist (embedded)",
    ],
    mutations: "All mutations through addItem/updateItem/deleteItem in storage.js. No component-level state writes.",
  };
}

// ── State management plan ─────────────────────────────────────
export function generateStateManagementPlan(report) {
  return {
    pattern:      "Single Source of Truth (SSOT) — all state in one localStorage-backed object.",
    storeFile:    "src/core/storage.js",
    storeKey:     "ap3x_ssot_v1 (or equivalent project-specific key)",
    shape:        "{ appMeta, ui, projects, prompts, errors, runs, agents, connectors, systemHealth, settings, architectureIntelligence }",
    subscribers:  "React components subscribe via subscribe(). Unsubscribe on unmount.",
    mutations:    "All writes go through: addItem(), updateItem(), deleteItem(), updateState().",
    persistence:  "localStorage. Every mutation calls _persist(). State loaded on init.",
    noContextAPI: "Do not use React Context or Redux. SSOT replaces them.",
    noDirectLS:   "Components never call localStorage directly. SSOT only.",
  };
}

// ── UX flow plan ──────────────────────────────────────────────
export function generateUXFlowPlan(report) {
  const journeys = report?.userJourneys || [];
  const screens  = report?.screens     || [];

  return {
    navigationPattern: "Single-page app with sidebar navigation. Active page stored in SSOT (ui.activePage).",
    pageTransitions:   "Instant — no router library required for local-first SPA. PAGE_MAP in AppShell.",
    formPattern:       "Multi-tab or sectioned forms. Validate before save. Show inline errors. Cancel returns safely.",
    listPattern:       "Card grid or table. Search + filter bar above. Stats row above filters. Empty state when no data.",
    detailPattern:     "Full-page detail view with sections, action bar at top, ConfirmDialog for destructive actions.",
    importExport:      "JSON import/export on all entities. Secret field stripping on all imports. Clipboard fallback.",
    mobileLayout:      "Single-column on mobile. Sidebar collapses to overlay. Touch-friendly tap targets.",
    accessibilityNote: "All interactive elements have aria-label. Errors use role=alert. Focus states visible.",
    flows: journeys.map((j) => ({ name: j.name, steps: j.steps })),
    screens: screens.map((s) => ({ id: s.id, name: s.name, type: s.type })),
  };
}

// ── Validation plan ───────────────────────────────────────────
export function generateValidationPlan(report) {
  const runs = (report?.implementationRuns || []);
  return {
    approach: "Manual validation gates per run. Checklist in each run record. No automated test suite yet (add in Run 10).",
    gates: [
      "App loads without errors",
      "Previous run features still work",
      "All state mutations through storage.js",
      "State persists after browser refresh",
      "No direct localStorage calls outside storage.js",
      "No Supabase / AI / backend added before planned run",
      "Build succeeds with 0 errors",
      "Secret-like fields stripped on import/export",
      "Originality notice present in all reports",
      "Confirmation dialogs used for destructive actions",
    ],
    perRunGates: runs.map((r) => ({
      run: r.run,
      title: r.title,
      keyGates: [`Run ${r.run} features complete`, "Previous runs preserved", "Build succeeds"],
    })),
    rlsNote: "RLS STATUS must be stated in every run. NOT APPLICABLE until Supabase is integrated (Run 8).",
  };
}

// ── Main blueprint generator ──────────────────────────────────
export function generateOriginalBlueprint(report) {
  if (!report) return null;
  return {
    notice: "This blueprint is inspired by common architecture patterns. Build an original implementation with original branding, original UI design, original copy, and lawful data sources. Do not clone proprietary assets, code, or content.",
    appType:           report.appType?.primary || "General App",
    fileStructure:     generateSuggestedFileStructure(report),
    implementationRuns:generateImplementationRuns(report),
    componentPlan:     generateComponentPlan(report),
    dataModelPlan:     generateDataModelPlan(report),
    stateManagement:   generateStateManagementPlan(report),
    uxFlowPlan:        generateUXFlowPlan(report),
    validationPlan:    generateValidationPlan(report),
    safePhrases:       SAFE_PHRASES,
  };
}

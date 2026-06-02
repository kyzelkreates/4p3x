// ============================================================
// AP3X — implementationRunPlanner.js — Run 7
// Generates isolated, drift-free implementation run plans.
// ============================================================

import { createId } from "./storage.js";

const FALLBACK_GATES = [
  "App loads without errors",
  "All previous run features still work",
  "Build succeeds with 0 errors",
  "All state mutations through SSOT",
  "No external APIs added before planned run",
];

function makeRun(num, title, mission, allowedFiles, forbiddenFiles, outputs, gates, tests, rollback, stop, deps = []) {
  return {
    runNumber:        num,
    title,
    mission,
    dependsOn:        deps,
    allowedFiles,
    forbiddenFiles,
    requiredOutputs:  outputs,
    validationGates:  gates.length > 0 ? gates : FALLBACK_GATES,
    acceptanceTests:  tests,
    rollbackNotes:    rollback,
    stopConditions:   stop,
  };
}

// ── Full 10-run plan ──────────────────────────────────────────
export function generateTenRunPlan(blueprint) {
  const appType = blueprint?.appType || "App";
  const mods    = (blueprint?.coreModules || []).slice(0, 8);
  const hasSaaS = JSON.stringify(blueprint || {}).toLowerCase().includes("saas");
  const hasAuth = JSON.stringify(blueprint || {}).toLowerCase().includes("auth");

  const runs = [
    makeRun(1, "Core Foundation + SSOT",
      "Build the application shell, layout, navigation, global CSS design system, PWA manifest, SSOT (storage.js), and placeholder pages. No features.",
      ["src/App.jsx","src/main.jsx","src/components/AppShell.jsx","src/components/Sidebar.jsx","src/components/TopBar.jsx","src/core/storage.js","src/core/constants.js","src/styles/global.css","public/manifest.json","index.html","vite.config.js","package.json"],
      ["Supabase","GitHub API","OpenAI","backend","auth","payments","any feature pages"],
      ["Working app shell","Navigation","SSOT","PWA manifest","Global CSS"],
      ["App loads","Sidebar navigates","State persists","Build succeeds"],
      ["Open app → confirm shell renders","Click all nav items","Refresh → confirm state persists"],
      "Remove all new files. Restore previous package.json and vite.config.js.",
      ["If SSOT cannot be established","If build fails before any features are added"],
      []
    ),
    makeRun(2, mods[0] ? `${mods[0]} Module` : "Primary Data Module",
      `Build the first core module: CRUD (create, read, update, delete), filters, search, detail view, JSON import/export. Preserve Run 1.`,
      [`src/pages/${mods[0]?.replace(/\s/g,"") || "PrimaryModule"}.jsx`,`src/components/${mods[0]?.replace(/\s/g,"") || "PrimaryModule"}Card.jsx`,`src/components/${mods[0]?.replace(/\s/g,"") || "PrimaryModule"}Form.jsx`,`src/core/storage.js (extend only)`],
      ["Supabase","backend","auth","Run 1 components"],
      ["Working CRUD","Filters","Search","Detail view","JSON import/export"],
      [...FALLBACK_GATES,"CRUD works","Filters work","State persists"],
      ["Add item → confirm saved","Edit item → confirm updated","Delete with confirm dialog","Import JSON → confirm data loads"],
      "Remove new page + components. Restore storage.js to Run 1 state.",
      ["If SSOT shape cannot be safely extended"],
      [1]
    ),
    makeRun(3, mods[1] ? `${mods[1]} Module` : "Secondary Data Module",
      `Build the second core module with full CRUD, versioning if applicable, safety/validation scoring, and export. Preserve Runs 1–2.`,
      [`src/pages/SecondaryModule.jsx`,`src/components/SecondaryModule*.jsx`,`src/core/storage.js (extend only)`],
      ["Supabase","backend","auth","Run 1–2 components"],
      ["Working module","Scoring/validation","Export","Run 1–2 preserved"],
      [...FALLBACK_GATES,"Module CRUD works","Scoring works"],
      ["Add record → confirm","Score/validate → check output","Export → check format"],
      "Remove new module files. Restore storage.js to Run 2 state.",
      ["If Run 2 features break during development"],
      [1, 2]
    ),
    makeRun(4, mods[2] ? `${mods[2]} Module` : "Workflow / Error Tracking Module",
      `Build the third core module: classification, triage, fix tracking, and health integration. Preserve Runs 1–3.`,
      [`src/pages/WorkflowModule.jsx`,`src/components/WorkflowModule*.jsx`,`src/core/storage.js (extend only)`],
      ["Supabase","backend","auth","Run 1–3 components"],
      ["Classification engine","Fix tracking","Health panel","Run 1–3 preserved"],
      [...FALLBACK_GATES,"Classification works","No Run 1–3 regressions"],
      ["Log workflow item → classify","Assign fix → track status","Check health panel updates"],
      "Remove module files. Restore to Run 3 state.",
      ["If classifier requires external AI (forbidden in this run)"],
      [1, 2, 3]
    ),
    makeRun(5, mods[3] ? `${mods[3]} Module` : "Audit / History Module",
      `Build the audit trail and history module: checkpoints, validation checklists, timelines, snapshots. Preserve Runs 1–4.`,
      [`src/pages/AuditHistory.jsx`,`src/components/AuditHistory*.jsx`,`src/core/storage.js (extend only)`],
      ["Supabase","backend","auth","Run 1–4 components"],
      ["Checkpoint system","Validation checklists","Timeline view","Run 1–4 preserved"],
      [...FALLBACK_GATES,"Checkpoints save correctly","Timeline renders"],
      ["Add checkpoint → confirm","Mark validation → check result","View timeline → confirm events"],
      "Remove audit module files. Restore to Run 4 state.",
      ["If audit data shape conflicts with existing SSOT"],
      [1, 2, 3, 4]
    ),
    makeRun(6, "Architecture Intelligence Layer",
      `Build the architecture intelligence engine: report generation, validation warnings, risk scoring, originality checks, blueprint output. Preserve Runs 1–5.`,
      ["src/core/architectureIntelligenceEngine.js","src/core/architectureValidationEngine.js","src/core/originalityGuardEngine.js","src/core/reportGenerator.js","src/core/blueprintGenerator.js","src/components/intelligence/","src/pages/ArchitectureIntelligence.jsx","src/utils/architectureScoringUtils.js","src/utils/reportExportUtils.js","src/core/storage.js (extend only)"],
      ["backend","external AI APIs","Supabase","Run 1–5 components"],
      ["Report generation","Validation warnings","Risk scoring","Originality notice","Export","Runs 1–5 preserved"],
      [...FALLBACK_GATES,"Report generates","Originality notice always present","Export works"],
      ["Generate report → confirm appears","Check warnings → verify categorised","Export JSON → verify format","Confirm originality notice present"],
      "Remove intelligence files. Remove blueprintCompiler state additions from storage.js.",
      ["If originality guardrails cannot be enforced","If reports include banned clone language"],
      [1, 2, 3, 4, 5]
    ),
    makeRun(7, "Original Blueprint Builder",
      `Build the blueprint compiler: compile Run 6 reports into original build specs, generate safe build prompts, export blueprints. Preserve Runs 1–6.`,
      ["src/core/originalBlueprintCompiler.js","src/core/buildPromptCompiler.js","src/core/implementationRunPlanner.js","src/core/originalProductPlanner.js","src/core/safePatternTransformer.js","src/components/blueprint/","src/pages/OriginalBlueprintBuilder.jsx","src/utils/blueprintExportUtils.js","src/core/storage.js (extend only)"],
      ["backend","external AI APIs","Supabase","Run 1–6 components"],
      ["Blueprint compiler","Build prompt generation","Export","Run 1–6 preserved","No clone language"],
      [...FALLBACK_GATES,"Blueprint compiles","Prompt generated","No unsafe clone language","Export works"],
      ["Select report → compile → confirm blueprint","Generate prompt → confirm Directive 1 present","Export Markdown → confirm originality notice"],
      "Remove blueprint files. Remove blueprintCompiler state from storage.js.",
      ["If safe prompt generation requires proprietary content","If clone language cannot be eliminated"],
      [1, 2, 3, 4, 5, 6]
    ),
    makeRun(8, hasAuth ? "Authentication + Backend (Supabase)" : "Connectors + Integration Layer",
      hasAuth
        ? "Integrate Supabase: authentication, Row-Level Security, server-side data sync. Preserve all previous runs."
        : "Connect GitHub, Vercel, Supabase OAuth. Add API integrations. Preserve all previous runs.",
      ["src/core/authUtils.js","src/core/supabaseClient.js","src/core/connectors/","src/core/storage.js (extend only)"],
      ["Run 1–7 core components","Offline-first state (keep working)"],
      [hasAuth ? "Auth works" : "Connectors work","RLS configured","Previous runs preserved"],
      [...FALLBACK_GATES, hasAuth ? "Login/logout works" : "OAuth connects","Data syncs"],
      [hasAuth ? "Register → login → view scoped data" : "Connect GitHub → confirm token","Test API call → confirm response"],
      "Remove auth/connector files. Restore to Run 7 state. Confirm localStorage fallback still works.",
      ["If RLS cannot be safely configured","If auth breaks local-first fallback"],
      [1, 2, 3, 4, 5, 6, 7]
    ),
    makeRun(9, hasSaaS ? "Monetisation + Billing (Stripe)" : "Deployment + PWA Polish",
      hasSaaS
        ? "Integrate Stripe: subscription tiers, billing portal, webhook handlers. Preserve all previous runs."
        : "Service worker, offline cache strategy, deploy pipeline, Lighthouse performance audit, progressive enhancement.",
      hasSaaS
        ? ["src/core/paymentsUtils.js","src/components/billing/","src/core/storage.js (extend only)"]
        : ["public/sw.js","public/manifest.json (update)","vite.config.js (update)","netlify.toml or vercel.json"],
      ["Run 1–8 core components"],
      [hasSaaS ? "Stripe checkout works" : "Offline works","PWA installable","Lighthouse score ≥ 80"],
      [...FALLBACK_GATES, hasSaaS ? "Payment flow works" : "Offline mode works","Build passes"],
      [hasSaaS ? "Subscribe → checkout → confirm webhook" : "Open app offline → confirm loads","Install PWA → confirm icon appears"],
      hasSaaS
        ? "Remove Stripe files. Restore to Run 8 state. Confirm no charge loop."
        : "Remove service worker. Restore manifest.json. Confirm app still loads.",
      ["If Stripe webhook cannot be safely validated","If offline cache causes data corruption"],
      [1, 2, 3, 4, 5, 6, 7, 8]
    ),
    makeRun(10, "Final QA + Presentation Layer",
      "Full test suite, accessibility audit (WCAG AA), investor/client demo mode, complete documentation, production deploy.",
      ["src/tests/","src/pages/DemoMode.jsx","README.md","docs/"],
      ["Run 1–9 features","Production data (use seed data only for demo)"],
      ["All tests pass","Accessibility audit passes","Demo mode works","Documentation complete"],
      [...FALLBACK_GATES,"All tests pass","Lighthouse ≥ 90","WCAG AA","Demo mode works"],
      ["Run full test suite","Open demo mode → confirm locked","Check accessibility with screen reader"],
      "Remove test files and demo mode page. Restore to Run 9 state.",
      ["If test suite reveals critical regressions across multiple runs"],
      [1, 2, 3, 4, 5, 6, 7, 8, 9]
    ),
  ];
  return runs;
}

// ── MVP 5-run plan ────────────────────────────────────────────
export function generateMVPRunPlan(blueprint) {
  const full = generateTenRunPlan(blueprint);
  return [full[0], full[1], full[2], full[3], full[9]].map((r, i) => ({
    ...r, runNumber: i + 1,
  }));
}

export function generateFullProductRunPlan(blueprint) {
  return generateTenRunPlan(blueprint);
}

export function generateRunPlan(blueprint, mode = "full") {
  return mode === "mvp" ? generateMVPRunPlan(blueprint) : generateTenRunPlan(blueprint);
}

// ── Dependency graph ──────────────────────────────────────────
export function generateRunDependencies(runs) {
  return (runs || []).map((r) => ({
    runNumber: r.runNumber,
    title:     r.title,
    requires:  r.dependsOn || [],
    blocks:    (runs || []).filter((other) => (other.dependsOn || []).includes(r.runNumber)).map((x) => x.runNumber),
  }));
}

// ── Run isolation check ───────────────────────────────────────
export function validateRunIsolation(runs) {
  const issues = [];
  (runs || []).forEach((run) => {
    const forbidden = run.forbiddenFiles || [];
    const allowed   = run.allowedFiles   || [];
    const overlap   = allowed.filter((f) => forbidden.some((fb) => f.includes(fb)));
    if (overlap.length > 0) {
      issues.push({ runNumber: run.runNumber, issue: `File appears in both allowed and forbidden: ${overlap.join(", ")}` });
    }
    if (!run.rollbackNotes || run.rollbackNotes.length < 10) {
      issues.push({ runNumber: run.runNumber, issue: "Missing or insufficient rollback notes." });
    }
  });
  return { valid: issues.length === 0, issues };
}

// ── Drift risk detection ──────────────────────────────────────
export function detectRunDriftRisk(runs) {
  const risks = [];
  (runs || []).forEach((run) => {
    const mission = (run.mission || "").toLowerCase();
    if (mission.includes("rewrite") || mission.includes("replace")) {
      risks.push({ runNumber: run.runNumber, risk: "Mission mentions rewrite/replace — high drift risk." });
    }
    if ((run.allowedFiles || []).length > 20) {
      risks.push({ runNumber: run.runNumber, risk: "Too many allowed files — scope may be too broad." });
    }
    if ((run.validationGates || []).length < 3) {
      risks.push({ runNumber: run.runNumber, risk: "Too few validation gates — may miss regressions." });
    }
  });
  return risks;
}

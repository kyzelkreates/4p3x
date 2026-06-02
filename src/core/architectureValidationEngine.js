// ============================================================
// AP3X BUILD CONTROL OS — architectureValidationEngine.js
// /src/core/architectureValidationEngine.js — Run 6
// ============================================================

import { createId } from "./storage.js";

const SEV = { low: "low", medium: "medium", high: "high", critical: "critical" };

function check(id, severity, category, title, description, recommendedFix, blocking = false) {
  return { id, severity, category, title, description, recommendedFix, blocking };
}

// ── Validation rule definitions ───────────────────────────────
const VALIDATION_CHECKS = [
  {
    id: "missing_app_type",
    test: (r) => !r.appType?.primary || r.appType.primary === "Unknown / General App",
    result: check("missing_app_type", SEV.high, "Classification",
      "App type not detected",
      "The system could not determine a primary app type from the available data.",
      "Add more descriptive project names, types, or descriptions to improve classification.",
      false),
  },
  {
    id: "missing_user_journeys",
    test: (r) => !r.userJourneys || r.userJourneys.length === 0,
    result: check("missing_user_journeys", SEV.high, "UX",
      "No user journeys detected",
      "No user flow patterns could be extracted from the current data.",
      "Document the main user workflows: what can a user do, in what order?",
      false),
  },
  {
    id: "missing_screens",
    test: (r) => !r.screens || r.screens.length <= 1,
    result: check("missing_screens", SEV.medium, "UX",
      "Very few screens detected",
      "Less than 2 distinct screens/pages could be identified.",
      "Define all screens: list, detail, create/edit, settings, auth, etc.",
      false),
  },
  {
    id: "missing_data_entities",
    test: (r) => !r.dataEntities || r.dataEntities.length === 0,
    result: check("missing_data_entities", SEV.high, "Data Model",
      "No data entities detected",
      "No data structures could be extracted from the current project data.",
      "Define your core entities (e.g. User, Project, Order) with their fields.",
      false),
  },
  {
    id: "missing_auth_model",
    test: (r) => r.authNeeds?.required && r.authNeeds?.currentStatus?.includes("future"),
    result: check("missing_auth_model", SEV.medium, "Security",
      "Auth model required but not implemented",
      "Authentication was detected as needed but is not yet implemented.",
      "Implement auth before adding multi-user features. Consider Supabase Auth in Run 8.",
      false),
  },
  {
    id: "missing_error_states",
    test: (r) => {
      const text = JSON.stringify(r).toLowerCase();
      return !text.includes("error state") && !text.includes("empty state");
    },
    result: check("missing_error_states", SEV.low, "UX",
      "Error and empty states may be missing",
      "No explicit error or empty state patterns were confirmed across all screens.",
      "Ensure every page has: loading state, empty state, error state, and success state.",
      false),
  },
  {
    id: "missing_mobile",
    test: (r) => {
      const text = JSON.stringify(r?.frontendNeeds || []).toLowerCase();
      return !text.includes("mobile") && !text.includes("responsive");
    },
    result: check("missing_mobile", SEV.medium, "Accessibility",
      "Mobile responsiveness not confirmed",
      "No mobile/responsive design pattern was detected in the frontend needs.",
      "Add responsive CSS breakpoints and test on mobile viewport.",
      false),
  },
  {
    id: "missing_accessibility",
    test: (r) => !r.accessibilityNeeds || r.accessibilityNeeds.length === 0,
    result: check("missing_accessibility", SEV.medium, "Accessibility",
      "No accessibility notes",
      "No accessibility considerations were extracted.",
      "Add ARIA labels, focus states, and contrast checks. Target WCAG AA.",
      false),
  },
  {
    id: "missing_security",
    test: (r) => !r.securityNeeds || r.securityNeeds.length === 0,
    result: check("missing_security", SEV.high, "Security",
      "No security notes detected",
      "No security considerations were extracted from the architecture data.",
      "Define: input sanitisation, XSS prevention, secret handling, HTTPS enforcement.",
      true),
  },
  {
    id: "missing_persistence_plan",
    test: (r) => {
      const backend = JSON.stringify(r.backendNeeds || []).toLowerCase();
      return !backend.includes("local") && !backend.includes("database") && !backend.includes("storage");
    },
    result: check("missing_persistence_plan", SEV.high, "Data Model",
      "No data persistence plan detected",
      "No clear data persistence strategy was found.",
      "Define how data is stored: localStorage, Supabase, or another DB.",
      false),
  },
  {
    id: "missing_api_boundary",
    test: (r) => !r.integrations || r.integrations.length === 0,
    result: check("missing_api_boundary", SEV.low, "Architecture",
      "No API/integration boundary defined",
      "No external integrations or API boundaries were detected.",
      "Document what external services (if any) the system should call — even if none.",
      false),
  },
  {
    id: "missing_originality_notice",
    test: (r) => !r.originalityNotice || r.originalityNotice.length < 20,
    result: check("missing_originality_notice", SEV.critical, "Legal / Safety",
      "Originality & Legal Safety Notice missing",
      "The architecture report does not include the required originality and legal safety notice.",
      "Every report must include the Originality & Legal Safety Notice. This is non-negotiable.",
      true),
  },
  {
    id: "missing_deployment_plan",
    test: (r) => {
      const text = JSON.stringify(r).toLowerCase();
      return !text.includes("deploy") && !text.includes("hosting") && !text.includes("netlify") && !text.includes("vercel");
    },
    result: check("missing_deployment_plan", SEV.low, "Deployment",
      "No deployment assumptions defined",
      "No deployment target or hosting assumptions were found.",
      "Specify where the app will be deployed: Netlify, Vercel, static hosting, etc.",
      false),
  },
  {
    id: "missing_pwa_offline",
    test: (r) => {
      const text = JSON.stringify(r).toLowerCase();
      return text.includes("pwa") && !text.includes("offline") && !text.includes("service worker");
    },
    result: check("missing_pwa_offline", SEV.low, "PWA",
      "PWA offline behaviour not defined",
      "App appears to be a PWA but no offline caching strategy was detected.",
      "Define a service worker caching strategy (network-first, cache-first, or stale-while-revalidate).",
      false),
  },
  {
    id: "low_confidence",
    test: (r) => (r.confidenceScore || 0) < 40,
    result: check("low_confidence", SEV.medium, "Data Quality",
      "Low analysis confidence score",
      "The intelligence engine had insufficient data to produce a reliable analysis.",
      "Add more project descriptions, types, prompts, and run records to improve accuracy.",
      false),
  },
];

// ── Run all validation checks ─────────────────────────────────
export function runValidation(intelligenceReport) {
  const results = [];
  if (!intelligenceReport || typeof intelligenceReport !== "object") {
    return [check("no_report", SEV.critical, "Input", "No report data", "No intelligence report was provided.", "Generate the architecture intelligence first.", true)];
  }
  VALIDATION_CHECKS.forEach(({ id, test, result }) => {
    try {
      if (test(intelligenceReport)) results.push({ ...result, id: `val_${id}_${Date.now()}`, ruleId: id });
    } catch (_) {
      // Never crash on a failed test
    }
  });
  return results;
}

// ── Severity helpers ──────────────────────────────────────────
export function groupBySeverity(validationResults) {
  return {
    critical: (validationResults || []).filter((v) => v.severity === "critical"),
    high:     (validationResults || []).filter((v) => v.severity === "high"),
    medium:   (validationResults || []).filter((v) => v.severity === "medium"),
    low:      (validationResults || []).filter((v) => v.severity === "low"),
  };
}

export function hasBlockingIssues(validationResults) {
  return (validationResults || []).some((v) => v.blocking);
}

export function getValidationStatus(validationResults) {
  if (!validationResults || validationResults.length === 0) return "passed";
  if (hasBlockingIssues(validationResults)) return "blocked";
  const critHigh = validationResults.filter((v) => v.severity === "critical" || v.severity === "high");
  if (critHigh.length > 0) return "needs_work";
  return "warnings_only";
}

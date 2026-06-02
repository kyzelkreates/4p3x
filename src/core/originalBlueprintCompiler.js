// ============================================================
// AP3X — originalBlueprintCompiler.js — Run 7
// Compiles a Run 6 architecture report into a full original
// build specification. Never produces clone instructions.
// ============================================================

import { createId } from "./storage.js";
import { ORIGINALITY_SAFETY_NOTICE } from "./constants.js";
import { replaceUnsafeCloneTerms } from "./safePatternTransformer.js";
import {
  generateOriginalNamingOptions,
  generateOriginalBrandingDirection,
  generateOriginalValueProposition,
  generateOriginalUserPromise,
  generateOriginalFeaturePositioning,
} from "./originalProductPlanner.js";
import { generateRunPlan } from "./implementationRunPlanner.js";
import { compileBuildPromptFromBlueprint } from "./buildPromptCompiler.js";

const FALLBACK = "Insufficient source detail detected. Use this section as a planning placeholder and validate manually before build.";

function safe(v) { return v || FALLBACK; }
function safeArr(v) { return Array.isArray(v) && v.length > 0 ? v : []; }

// ── App identity ──────────────────────────────────────────────
export function generateOriginalAppIdentity(report) {
  const naming    = generateOriginalNamingOptions(report);
  const branding  = generateOriginalBrandingDirection(report);
  const value     = generateOriginalValueProposition(report);
  const promise   = generateOriginalUserPromise(report);
  const features  = generateOriginalFeaturePositioning(report);
  return { naming, branding, value, promise, features };
}

// ── Product summary ───────────────────────────────────────────
export function generateProductSummary(report) {
  const type    = report?.appType?.primary || "App";
  const modules = safeArr(report?.modules).filter((m) => m.detected).length;
  const screens = safeArr(report?.screens).length;
  return `An original ${type} product with ${modules} core module(s) and ${screens} screen(s). ` +
    `Built local-first with original branding, original UI, and original content. ` +
    `Inspired by abstract architecture patterns only — not a clone of any proprietary system.`;
}

// ── Target users ──────────────────────────────────────────────
export function generateTargetUsers(report) {
  const type = (report?.appType?.primary || "App").toLowerCase();
  const map = {
    "control os":  ["Developers managing multiple build projects", "Technical leads tracking deployments"],
    "saas":        ["Business users", "Teams needing collaborative workflows", "Admins managing accounts"],
    "dashboard":   ["Analysts reviewing metrics", "Managers tracking KPIs"],
    "lms":         ["Students accessing learning content", "Instructors managing courses", "Admins tracking progress"],
    "e-commerce":  ["Shoppers browsing products", "Admins managing inventory and orders"],
    "ai tool":     ["Developers using AI prompts", "Creators generating content", "Researchers analysing outputs"],
    "developer tool":["Developers building and debugging", "Teams reviewing code quality"],
    "navigation":  ["Drivers planning routes", "Fleet managers tracking vehicles"],
  };
  const found = Object.entries(map).find(([k]) => type.includes(k));
  return found ? found[1] : ["Primary users — define based on your product research.", "Admin users managing the system."];
}

// ── User roles ────────────────────────────────────────────────
export function generateUserRoles(report) {
  const roles = [{ role: "User", access: "Core features, own data only", notes: "Default authenticated user." }];
  const text  = JSON.stringify(report || {}).toLowerCase();
  if (text.includes("admin")) roles.push({ role: "Admin", access: "All data, system settings, user management", notes: "Elevated access — add in Run 8." });
  if (text.includes("saas")  || text.includes("team")) roles.push({ role: "Owner", access: "Billing, team management, account settings", notes: "Account owner for SaaS tiers." });
  if (!text.includes("auth")) roles.push({ role: "Guest (local)", access: "All local data (single-user mode)", notes: "No auth required until Run 8." });
  return roles;
}

// ── Core modules ──────────────────────────────────────────────
export function generateCoreModules(report) {
  return safeArr(report?.modules).map((m) => ({
    name:        m.name,
    description: m.description,
    detected:    m.detected,
    confidence:  m.confidence,
    buildPriority: m.detected ? "high" : "medium",
    originalNote: `Build an original ${m.name.toLowerCase()} — do not replicate any proprietary implementation.`,
  }));
}

// ── Page plan ─────────────────────────────────────────────────
export function generatePagePlan(report) {
  return safeArr(report?.screens).map((s) => ({
    name:        s.name,
    id:          s.id,
    type:        s.type,
    purpose:     s.description,
    mainComponents: [`${s.name}Card`, `${s.name}Form`, `${s.name}Detail`, `${s.name}Filters`],
    stateNeeds:  ["List data from SSOT", "Selected item ID", "Filter/search state", "Form open/closed state"],
    uiStates:    ["Loading", "Empty (no data)", "Populated list", "Detail view", "Form (create)", "Form (edit)", "Delete confirmation", "Error"],
    originalNote: `Design this page with original layout and components. Do not copy any source app's page structure pixel-for-pixel.`,
  }));
}

// ── Component plan ────────────────────────────────────────────
export function generateComponentPlan(report) {
  const base = [
    { name:"AppShell",      type:"layout",  responsibility:"Root layout wrapper: sidebar + topbar + main content.", inputs:["state"],        outputs:["rendered layout"],       stateDeps:["ui.activePage","ui.sidebarCollapsed"], validationReqs:["Must handle all page IDs safely"] },
    { name:"Sidebar",       type:"layout",  responsibility:"Navigation — page links with active state.",            inputs:["activePage"],   outputs:["navigation events"],    stateDeps:["ui.activePage"], validationReqs:["All nav items must be keyboard accessible"] },
    { name:"StatCard",      type:"display", responsibility:"Reusable metric card.",                                 inputs:["label","value","variant"], outputs:[],            stateDeps:[], validationReqs:["Must not crash on null value"] },
    { name:"StatusBadge",   type:"display", responsibility:"Coloured status label.",                                inputs:["status","label"], outputs:[],                    stateDeps:[], validationReqs:["Must show readable label for all status values"] },
    { name:"EmptyState",    type:"ux",      responsibility:"Empty list/no-data placeholder with CTA.",              inputs:["title","cta"],  outputs:["button click"],         stateDeps:[], validationReqs:["Must always show a recovery action"] },
    { name:"ConfirmDialog", type:"ux",      responsibility:"Destructive action confirmation modal.",                inputs:["open","title","message","onConfirm","onCancel"], outputs:["confirm","cancel"], stateDeps:[], validationReqs:["Must prevent accidental deletes"] },
  ];
  const moduleComponents = safeArr(report?.modules).filter((m) => m.detected).flatMap((m) => {
    const n = m.name.replace(/\s+/g,"");
    return [
      { name:`${n}Card`,    type:"feature", responsibility:`${m.name} list item — summary, status, quick actions.`, inputs:["item","onAction"], outputs:["action events"], stateDeps:[`${n.toLowerCase()}s collection`], validationReqs:["Show archived items dimmed","Show status badge"] },
      { name:`${n}Form`,    type:"feature", responsibility:`${m.name} create/edit form with validation.`,           inputs:["item","mode","onSave","onCancel"], outputs:["save event"], stateDeps:["form field state"], validationReqs:["Validate before save","Show inline errors","Cancel must not lose working state"] },
      { name:`${n}Detail`,  type:"feature", responsibility:`${m.name} full detail view with all sections.`,         inputs:["item","onEdit","onBack"], outputs:["action events"], stateDeps:[`selected ${n.toLowerCase()} ID`], validationReqs:["All sections present","Actions work"] },
      { name:`${n}Filters`, type:"feature", responsibility:`${m.name} search, filter, and sort bar.`,              inputs:["filters","onChange"], outputs:["filter change events"], stateDeps:["filter state"], validationReqs:["Clear filters must reset to defaults"] },
    ];
  });
  return [...base, ...moduleComponents].map((c) => ({ ...c, originalNote: "Build this component with original design. No pixel-for-pixel copying." }));
}

// ── Data model ────────────────────────────────────────────────
export function generateDataModelPlan(report) {
  return {
    storageStrategy: safe(report?.backendNeeds?.[0]?.description),
    entities: safeArr(report?.dataEntities).map((e) => ({
      name:    e.name,
      fields:  safeArr(e.fields),
      source:  e.source,
      relationships: [],
      persistenceNote: "All mutations through SSOT helper functions only.",
    })),
    relationships: [
      "Define entity relationships based on your product's specific logic.",
      "Example: Project → has many Errors, Runs, Prompts.",
      "Use foreign keys (linkedEntityId) stored in the child record.",
    ],
    mutationRules: [
      "All mutations through addItem/updateItem/deleteItem in SSOT.",
      "No component-level state array mutations.",
      "Every mutation updates lastUpdated timestamp.",
      "Every mutation persists to storage and notifies subscribers.",
    ],
  };
}

// ── State management plan ─────────────────────────────────────
export function generateStateManagementPlan(report) {
  return {
    pattern:        "Single Source of Truth (SSOT) — all state in one file.",
    storeFile:      "src/core/storage.js",
    storeKey:       "your_app_ssot_v1 (use a unique key for your app)",
    stateShape:     "{ appMeta, ui, [entity collections], systemHealth, settings }",
    subscribePattern:"React components call subscribe(cb) on mount, return unsub on unmount.",
    mutations:      "All writes: addItem(), updateItem(), deleteItem(), updateState().",
    persistence:    "localStorage. Every mutation calls persist(). Loaded on init via bootstrap().",
    derivedState:   "Computed values (e.g. systemHealth stats) recalculated on every mutation.",
    noContextAPI:   "Do not use React Context, Redux, Zustand, or MobX. SSOT replaces them.",
    noDirectLS:     "Components never call localStorage directly.",
    transitions:    [
      "User action → component calls SSOT helper → SSOT mutates + persists + notifies → React re-renders",
    ],
  };
}

// ── Business logic plan ───────────────────────────────────────
export function generateBusinessLogicPlan(report) {
  const rules = safeArr(report?.businessRules);
  return {
    coreRules: rules.map((r) => ({ rule: r.rule, description: r.description, file: `src/core/${r.id || "businessLogic"}Utils.js`, origin: r.origin })),
    patternNote: "Extract all business logic into /src/core/[module]Utils.js files. Never put business logic inside UI components.",
    validationNote: "All input validation in src/core/validators.js. Components call validators before saving.",
    utilitiesNeeded: safeArr(report?.modules).filter((m) => m.detected).map((m) => `src/core/${m.name.replace(/\s+/g,"")}Utils.js`),
  };
}

// ── UX flow plan ──────────────────────────────────────────────
export function generateUXFlowPlan(report) {
  return {
    navigationPattern:  "Sidebar SPA navigation. Active page ID stored in SSOT (ui.activePage).",
    formPattern:        "Inline or modal forms. Validate before save. Show inline errors. Cancel returns safely.",
    listPattern:        "Stats row → filter/search bar → card grid. Empty state when no data.",
    detailPattern:      "Full-page detail with section headers, action bar at top, confirm dialog for deletes.",
    importExportPattern:"JSON import/export on all entities. Strip secret fields. Clipboard fallback for download.",
    errorRecoveryFlow:  "Show alert → explain what failed → offer retry or safe fallback action.",
    onboardingFlow:     "First launch: seed data prompt or empty state with Add First Item CTA.",
    mobilePattern:      "Single column. Sidebar as overlay. Large tap targets (min 44×44px).",
    accessibilityNotes: "ARIA labels on all inputs/buttons. role=alert for errors. Skip-to-content link.",
    journeys:           safeArr(report?.userJourneys).map((j) => ({ name: j.name, steps: j.steps })),
  };
}

// ── API boundary plan ─────────────────────────────────────────
export function generateApiBoundaryPlan(report) {
  const integrations = safeArr(report?.integrations).filter((i) => i.type !== "none");
  return {
    currentBoundary: "None — fully local-first. No external API calls in Run 7.",
    plannedIntegrations: integrations.map((i) => ({
      name: i.name, type: i.type, plannedRun: i.run, note: i.note,
      safetyNote: `All ${i.name} integration must use official authorised API access only. No scraping or TOS violations.`,
    })),
    apiDesignPrinciples: [
      "Keep API calls in /src/core/[service]Client.js — never in UI components.",
      "Always handle loading, error, and empty API response states.",
      "Never store API keys in source code — use .env files.",
      "All external data must be validated before storing in SSOT.",
    ],
  };
}

// ── Admin/user separation plan ────────────────────────────────
export function generateAdminUserSeparationPlan(report) {
  const needsAuth = report?.authNeeds?.required;
  return {
    currentSeparation: "Single-user local-first (Run 7). No auth required yet.",
    plannedSeparation: needsAuth ? "Role-based access in Run 8 via Supabase RLS." : "Admin vs User roles to be defined when auth is added.",
    roles: generateUserRoles(report),
    rlsNote: "RLS (Row-Level Security) will be configured when Supabase is integrated. NOT APPLICABLE in Runs 1–7.",
    adminFunctions: ["User management (Run 8+)", "System settings (available from Run 1)", "Data export (available from Run 2+)"],
  };
}

// ── Validation state plan ─────────────────────────────────────
export function generateValidationStatePlan(report) {
  return {
    statesRequired: ["loading", "empty", "populated", "error", "success", "form-invalid", "form-saving", "delete-confirming"],
    formValidation: "Validate on submit. Show field-level errors. Clear errors on re-type.",
    loadingPattern: "Show a spinner or skeleton loader for async operations.",
    emptyPattern:   "Always show EmptyState with title, message, and a CTA button.",
    errorPattern:   "Show an alert with role=alert. Explain what failed. Offer retry.",
    successPattern: "Show a success alert or status badge. Auto-dismiss after 3–5 seconds.",
    confirmPattern: "Use ConfirmDialog for all destructive actions. Never use window.confirm.",
    globalNotes:    "No blank pages or sections. Every state transition must be visible to the user.",
  };
}

// ── Accessibility plan ────────────────────────────────────────
export function generateAccessibilityPlan() {
  return {
    targetStandard:  "WCAG 2.1 AA minimum",
    requirements: [
      "All interactive elements: aria-label or visible text label",
      "Error messages: role='alert' for screen readers",
      "Focus states: visible outline on all focusable elements",
      "Colour contrast: minimum 4.5:1 for text, 3:1 for UI elements",
      "Skip-to-content: add skip link at top of page",
      "Keyboard navigation: all features usable without mouse",
      "Images: alt text on all meaningful images",
      "Forms: label element for every input",
    ],
    testingTools:    ["axe DevTools", "NVDA (Windows)", "VoiceOver (macOS/iOS)", "Lighthouse accessibility audit"],
  };
}

// ── Mobile plan ───────────────────────────────────────────────
export function generateMobilePlan() {
  return {
    breakpoints: { mobile:"< 768px", tablet:"768px – 1024px", desktop:"> 1024px" },
    mobilePatterns: [
      "Single column layout on mobile",
      "Sidebar collapses to overlay with hamburger toggle",
      "Touch targets minimum 44×44px",
      "Card grids go 1-column on mobile",
      "Forms go full-width on mobile",
      "Tables convert to card view on mobile",
    ],
    cssApproach: "CSS custom properties + media queries. No CSS framework required.",
    testDevices: ["iPhone SE (375px)", "Pixel 7 (412px)", "iPad (768px)", "13-inch laptop (1280px)"],
  };
}

// ── PWA plan ──────────────────────────────────────────────────
export function generatePWAPlan() {
  return {
    manifestRequired: true,
    serviceWorker:    "Add a service worker for offline caching in Run 9.",
    cacheStrategy:    "Cache-first for static assets. Network-first for dynamic data.",
    installable:      "Configure manifest.json with name, icons, theme_color, display: standalone.",
    offlineNote:      "SSOT localStorage data already works offline. Service worker caches app shell.",
  };
}

// ── Deployment plan ───────────────────────────────────────────
export function generateDeploymentPlan(report) {
  const text = JSON.stringify(report || {}).toLowerCase();
  const target = text.includes("vercel") ? "Vercel" : text.includes("netlify") ? "Netlify" : "Static hosting (Netlify/Vercel/GitHub Pages)";
  return {
    target,
    buildCommand:   "npm run build",
    outputDir:      "dist/",
    envVars:        "Store all secrets in .env files. Never commit .env to version control.",
    ciCd:           "Add GitHub Actions workflow in Run 9 for automatic deploy on push.",
    httpsRequired:  true,
    domainAdvice:   "Register an original domain name. Do not use a subdomain that implies affiliation with another product.",
    preDeployChecks:["Build succeeds with 0 errors", "All validation gates passed", "Lighthouse score ≥ 80", "No hardcoded secrets"],
  };
}

// ── Security/privacy plan ─────────────────────────────────────
export function generateSecurityPrivacyPlan(report) {
  return {
    currentControls: [
      "Input sanitisation before SSOT storage",
      "Secret field stripping on all imports/exports",
      "No external calls from client in Runs 1–7",
      "XSS prevention via React JSX auto-escaping",
    ],
    plannedControls: [
      "Row-Level Security (RLS) via Supabase in Run 8",
      "HTTPS enforcement on production deployment",
      "Content Security Policy headers",
      "Rate limiting on API endpoints (Run 8+)",
    ],
    privacyNotes: [
      "Do not collect unnecessary user data",
      "Be transparent about what is stored locally",
      "Add a privacy policy page before public launch",
      "GDPR compliance required for EU users",
    ],
    secretHandling: "All secret-like fields stripped on import/export. Never store API keys in source code.",
  };
}

// ── Readiness score ───────────────────────────────────────────
export function calculateBlueprintReadinessScore(blueprint) {
  let score = 0;
  if ((blueprint?.coreModules     || []).length > 0) score += 15;
  if ((blueprint?.pagePlan        || []).length > 0) score += 15;
  if ((blueprint?.dataModelPlan?.entities || []).length > 0) score += 15;
  if (blueprint?.stateManagementPlan?.pattern) score += 10;
  if ((blueprint?.implementationRuns || []).length > 0) score += 15;
  if (blueprint?.generatedBuildPrompt && blueprint.generatedBuildPrompt.length > 100) score += 10;
  if (blueprint?.originalityCheck?.passed) score += 10;
  if ((blueprint?.uxFlowPlan?.journeys || []).length > 0) score += 10;
  return Math.min(score, 100);
}

// ── Main compiler ─────────────────────────────────────────────
export function compileOriginalBlueprint(report, options = {}) {
  if (!report) return null;
  const now = new Date().toISOString();
  const {
    tool = "developer",
    includeRunPlan = true,
    runMode = "full",
  } = options;

  const coreModules      = generateCoreModules(report);
  const pagePlan         = generatePagePlan(report);
  const componentPlan    = generateComponentPlan(report);
  const dataModelPlan    = generateDataModelPlan(report);
  const statePlan        = generateStateManagementPlan(report);
  const businessLogic    = generateBusinessLogicPlan(report);
  const uxFlow           = generateUXFlowPlan(report);
  const apiBoundary      = generateApiBoundaryPlan(report);
  const adminSeparation  = generateAdminUserSeparationPlan(report);
  const validationStates = generateValidationStatePlan(report);
  const accessibility    = generateAccessibilityPlan();
  const mobile           = generateMobilePlan();
  const pwa              = generatePWAPlan();
  const deployment       = generateDeploymentPlan(report);
  const security         = generateSecurityPrivacyPlan(report);
  const appIdentity      = generateOriginalAppIdentity(report);
  const targetUsers      = generateTargetUsers(report);
  const userRoles        = generateUserRoles(report);
  const productSummary   = generateProductSummary(report);

  const blueprint = {
    id:              createId("blueprint"),
    sourceReportId:  report.id || "",
    title:           `Original Blueprint — ${report.appType?.primary || "App"}`,
    appType:         report.appType?.primary || "App",
    originalAppName: appIdentity.naming.suggestions[0],
    productSummary,
    targetUsers,
    userRoles,
    coreModules,
    pagePlan,
    componentPlan,
    dataModelPlan,
    stateManagementPlan: statePlan,
    businessLogicPlan:   businessLogic,
    uxFlowPlan:          uxFlow,
    apiBoundaryPlan:     apiBoundary,
    adminUserSeparationPlan: adminSeparation,
    validationStatePlan:  validationStates,
    accessibilityPlan:    accessibility,
    mobilePlan:           mobile,
    pwaPlan:              pwa,
    deploymentPlan:       deployment,
    securityPrivacyPlan:  security,
    originalAppIdentity:  appIdentity,
    implementationRuns:   includeRunPlan ? generateRunPlan(
      { appType: report.appType?.primary, coreModules },
      runMode
    ) : [],
    generatedBuildPrompt: "",
    originalitySafetyNotice: ORIGINALITY_SAFETY_NOTICE,
    readinessScore: 0,
    createdAt: now,
    updatedAt: now,
  };

  // Generate the build prompt
  blueprint.generatedBuildPrompt = compileBuildPromptFromBlueprint(blueprint, { tool, runIndex: 0 });
  blueprint.readinessScore = calculateBlueprintReadinessScore(blueprint);

  return blueprint;
}

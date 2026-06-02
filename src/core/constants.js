// ============================================================
// AP3X BUILD CONTROL OS — Constants
// /src/core/constants.js — Updated Run 4
// ============================================================

export const APP_NAME = "AP3X BUILD CONTROL OS™";
export const APP_SUBTITLE = "Autonomous Project Command Centre";
export const CURRENT_RUN = 5;
export const VERSION = "5.0.0";

// ── Brand Colours ─────────────────────────────────────────────
export const COLORS = {
  bg: "#050816", panel: "#0B1020", panel2: "#111827",
  accent: "#00E5FF", accent2: "#7C3AED",
  success: "#22C55E", warning: "#F59E0B", danger: "#EF4444",
  textPrimary: "#F8FAFC", textMuted: "#94A3B8",
};

// ── Navigation Pages ──────────────────────────────────────────
export const PAGES = [
  { id: "dashboard",               label: "Dashboard",             icon: "⬡" },
  { id: "projects",                label: "Projects",              icon: "◈" },
  { id: "prompts",                 label: "Prompt Vault",          icon: "◎" },
  { id: "errors",                  label: "Error Centre",          icon: "⚠" },
  { id: "runs",                    label: "Run History",           icon: "◷" },
  { id: "architecture-intelligence",label: "Architecture Intel",  icon: "◐" },
  { id: "blueprint-builder",       label: "Blueprint Builder",     icon: "◑" },
  { id: "export-centre",           label: "Export Centre",         icon: "↓" },
  { id: "product-readiness",       label: "Product Readiness",     icon: "◉" },
  { id: "project-discovery",       label: "Project Discovery AI",  icon: "⬡" },
  { id: "agents",                  label: "Agent Board",           icon: "◉" },
  { id: "settings",                label: "Settings",              icon: "⚙" },
];

// ── Module Registry ───────────────────────────────────────────
export const MODULES = [
  { id: "project-registry",   title: "Project Registry",          description: "Track all local PWA/SaaS projects.",                       page: "projects", run: 2, locked: false, active: true },
  { id: "prompt-vault",       title: "Prompt Vault",              description: "Store, version, copy, validate, and reuse build prompts.",  page: "prompts",  run: 3, locked: false, active: true },
  { id: "error-centre",       title: "Error Centre",              description: "Capture, classify, and triage build failures.",             page: "errors",   run: 4, locked: false, active: true },
  { id: "classifier",         title: "Working/Broken Classifier", description: "Deterministic local project health classification.",        page: "projects", run: 4, locked: false, active: true },
  { id: "run-history",        title: "Run History",               description: "Full build run audit trail.",                               page: "runs",     run: 5, locked: false, active: true  },
  { id: "architecture-mapper",title: "Architecture Intelligence",  description: "Generate structured intelligence reports from project data.", page: "architecture-intelligence", run: 6, locked: false, active: true  },
  { id: "blueprint-builder",   title: "Blueprint Builder",           description: "Compile original build blueprints from architecture reports.",page: "blueprint-builder",        run: 7, locked: false, active: true  },
  { id: "agent-board",        title: "Agent Board",               description: "AI agent control plane.",                                   page: "agents",   run: 7, locked: true,  active: false },
  { id: "connectors",         title: "Connectors",                description: "GitHub, Vercel, Supabase integration layer.",               page: null,       run: 8, locked: true,  active: false },
  { id: "saas-factory",       title: "SaaS Factory",              description: "Autonomous SaaS generator engine.",                         page: null,       run: 9, locked: true,  active: false },
];

// ── Project Types ─────────────────────────────────────────────
export const PROJECT_TYPES = [
  { value: "pwa",          label: "PWA" },
  { value: "saas",         label: "SaaS" },
  { value: "dashboard",    label: "Dashboard" },
  { value: "control_os",   label: "Control OS" },
  { value: "lms",          label: "LMS" },
  { value: "navigation",   label: "Navigation" },
  { value: "fleet",        label: "Fleet" },
  { value: "ai_tool",      label: "AI Tool" },
  { value: "admin_panel",  label: "Admin Panel" },
  { value: "mobile_app",   label: "Mobile App" },
  { value: "website",      label: "Website" },
  { value: "api",          label: "API" },
  { value: "database",     label: "Database" },
  { value: "prototype",    label: "Prototype" },
  { value: "other",        label: "Other" },
];

// ── Project Statuses ──────────────────────────────────────────
export const PROJECT_STATUSES = [
  { value: "idea",           label: "Idea",           cls: "badge-muted",   description: "Early concept." },
  { value: "draft",          label: "Draft",          cls: "badge-muted",   description: "Started but incomplete." },
  { value: "building",       label: "Building",       cls: "badge-accent",  description: "Actively being built." },
  { value: "working",        label: "Working",        cls: "badge-success", description: "Functional and passing." },
  { value: "partial",        label: "Partial",        cls: "badge-warning", description: "Working but incomplete." },
  { value: "broken",         label: "Broken",         cls: "badge-danger",  description: "Non-functional." },
  { value: "deployed",       label: "Deployed",       cls: "badge-success", description: "Live in production." },
  { value: "paused",         label: "Paused",         cls: "badge-muted",   description: "On hold." },
  { value: "archived",       label: "Archived",       cls: "badge-locked",  description: "Archived." },
  { value: "needs_rebuild",  label: "Needs Rebuild",  cls: "badge-danger",  description: "Requires full rebuild." },
  { value: "investor_ready", label: "Investor Ready", cls: "badge-purple",  description: "Ready for investors." },
];

export const PROJECT_STAGES = [
  { value: "idea",       label: "Idea" },
  { value: "blueprint",  label: "Blueprint" },
  { value: "run_1",      label: "Run 1" },
  { value: "run_2",      label: "Run 2" },
  { value: "run_3_plus", label: "Run 3+" },
  { value: "mvp",        label: "MVP" },
  { value: "testing",    label: "Testing" },
  { value: "deployed",   label: "Deployed" },
  { value: "scaling",    label: "Scaling" },
  { value: "archived",   label: "Archived" },
];

export const PROJECT_PRIORITIES = [
  { value: "low",    label: "Low",    cls: "badge-muted"   },
  { value: "medium", label: "Medium", cls: "badge-accent"  },
  { value: "high",   label: "High",   cls: "badge-warning" },
  { value: "urgent", label: "Urgent", cls: "badge-danger"  },
];

export const SORT_MODES = [
  { value: "newest",    label: "Newest First" },
  { value: "oldest",    label: "Oldest First" },
  { value: "name",      label: "Name A→Z" },
  { value: "name_desc", label: "Name Z→A" },
  { value: "priority",  label: "Priority" },
  { value: "health",    label: "Health %" },
];

// ── Prompt Types ──────────────────────────────────────────────
export const PROMPT_TYPES = [
  { value: "base44",        label: "Base44" },
  { value: "manus",         label: "Manus" },
  { value: "chatgpt",       label: "ChatGPT" },
  { value: "supabase_sql",  label: "Supabase SQL" },
  { value: "debug_fix",     label: "Debug Fix" },
  { value: "refactor",      label: "Refactor" },
  { value: "architecture",  label: "Architecture" },
  { value: "deployment",    label: "Deployment" },
  { value: "documentation", label: "Documentation" },
  { value: "investor",      label: "Investor" },
  { value: "grant",         label: "Grant" },
  { value: "ui_ux",         label: "UI/UX" },
  { value: "data_import",   label: "Data Import" },
  { value: "migration",     label: "Migration" },
  { value: "emergency_fix", label: "Emergency Fix" },
  { value: "other",         label: "Other" },
];

export const PROMPT_CATEGORIES = [
  { value: "build",         label: "Build" },
  { value: "fix",           label: "Fix" },
  { value: "refactor",      label: "Refactor" },
  { value: "audit",         label: "Audit" },
  { value: "deploy",        label: "Deploy" },
  { value: "database",      label: "Database" },
  { value: "ai_agent",      label: "AI Agent" },
  { value: "ui",            label: "UI" },
  { value: "pwa",           label: "PWA" },
  { value: "routing",       label: "Routing" },
  { value: "safety",        label: "Safety" },
  { value: "business",      label: "Business" },
  { value: "investor",      label: "Investor" },
  { value: "grant",         label: "Grant" },
  { value: "documentation", label: "Documentation" },
  { value: "template",      label: "Template" },
  { value: "other",         label: "Other" },
];

export const PROMPT_STATUSES = [
  { value: "draft",        label: "Draft",        cls: "badge-muted",   description: "Work in progress." },
  { value: "ready",        label: "Ready",        cls: "badge-accent",  description: "Ready to use." },
  { value: "tested",       label: "Tested",       cls: "badge-accent",  description: "Has been tested." },
  { value: "successful",   label: "Successful",   cls: "badge-success", description: "Produced a successful result." },
  { value: "failed",       label: "Failed",       cls: "badge-danger",  description: "Produced a failed result." },
  { value: "needs_review", label: "Needs Review", cls: "badge-warning", description: "Flagged for review." },
  { value: "archived",     label: "Archived",     cls: "badge-locked",  description: "Archived." },
  { value: "master",       label: "Master",       cls: "badge-purple",  description: "Canonical master prompt." },
];

export const PROMPT_PRIORITIES = [
  { value: "low",    label: "Low",    cls: "badge-muted"   },
  { value: "medium", label: "Medium", cls: "badge-accent"  },
  { value: "high",   label: "High",   cls: "badge-warning" },
  { value: "urgent", label: "Urgent", cls: "badge-danger"  },
];

export const PROMPT_SORT_MODES = [
  { value: "newest",      label: "Newest First" },
  { value: "oldest",      label: "Oldest First" },
  { value: "title",       label: "Title A→Z" },
  { value: "title_desc",  label: "Title Z→A" },
  { value: "priority",    label: "Priority" },
  { value: "safety",      label: "Safety Score" },
  { value: "most_copied", label: "Most Copied" },
];

export const RESULT_STATUSES = [
  { value: "unknown",    label: "Unknown" },
  { value: "successful", label: "Successful" },
  { value: "failed",     label: "Failed" },
  { value: "partial",    label: "Partial" },
];

// ── Error Constants (Run 4) ───────────────────────────────────
export const ERROR_CATEGORIES = [
  { value: "unknown",           label: "Unknown" },
  { value: "build_error",       label: "Build Error" },
  { value: "runtime_error",     label: "Runtime Error" },
  { value: "deployment_error",  label: "Deployment Error" },
  { value: "database_error",    label: "Database Error" },
  { value: "auth_error",        label: "Auth Error" },
  { value: "api_error",         label: "API Error" },
  { value: "ui_error",          label: "UI Error" },
  { value: "routing_error",     label: "Routing Error" },
  { value: "pwa_error",         label: "PWA Error" },
  { value: "storage_error",     label: "Storage Error" },
  { value: "validation_error",  label: "Validation Error" },
  { value: "dependency_error",  label: "Dependency Error" },
  { value: "environment_error", label: "Environment Error" },
  { value: "security_warning",  label: "Security Warning" },
  { value: "performance_issue", label: "Performance Issue" },
  { value: "data_import_error", label: "Data Import Error" },
  { value: "regression",        label: "Regression" },
  { value: "other",             label: "Other" },
];

export const ERROR_SOURCES = [
  { value: "manual",          label: "Manual Entry" },
  { value: "base44",          label: "Base44" },
  { value: "vercel",          label: "Vercel" },
  { value: "github",          label: "GitHub" },
  { value: "supabase",        label: "Supabase" },
  { value: "browser_console", label: "Browser Console" },
  { value: "vite",            label: "Vite" },
  { value: "react",           label: "React" },
  { value: "pwa_install",     label: "PWA Install" },
  { value: "mobile",          label: "Mobile" },
  { value: "user_report",     label: "User Report" },
  { value: "qa_test",         label: "QA Test" },
  { value: "deployment_log",  label: "Deployment Log" },
  { value: "imported_json",   label: "Imported JSON" },
  { value: "other",           label: "Other" },
];

export const ERROR_SEVERITIES = [
  { value: "low",      label: "Low",      cls: "badge-muted",   description: "Minor issue, non-blocking." },
  { value: "medium",   label: "Medium",   cls: "badge-warning", description: "Degraded but not fully broken." },
  { value: "high",     label: "High",     cls: "badge-danger",  description: "Core functionality impaired." },
  { value: "critical", label: "Critical", cls: "badge-critical",description: "System down or data loss risk." },
];

export const ERROR_STATUSES = [
  { value: "open",            label: "Open",            cls: "badge-danger",  description: "Unresolved." },
  { value: "investigating",   label: "Investigating",   cls: "badge-warning", description: "Being diagnosed." },
  { value: "fix_planned",     label: "Fix Planned",     cls: "badge-accent",  description: "Fix approach identified." },
  { value: "fix_in_progress", label: "Fix In Progress", cls: "badge-accent",  description: "Fix being implemented." },
  { value: "fixed",           label: "Fixed",           cls: "badge-success", description: "Fix applied." },
  { value: "validated",       label: "Validated",       cls: "badge-success", description: "Fix confirmed working." },
  { value: "reopened",        label: "Reopened",        cls: "badge-danger",  description: "Regression — reopened." },
  { value: "ignored",         label: "Ignored",         cls: "badge-muted",   description: "Accepted as known." },
  { value: "archived",        label: "Archived",        cls: "badge-locked",  description: "Archived." },
];

export const ERROR_SORT_MODES = [
  { value: "newest",   label: "Newest First" },
  { value: "oldest",   label: "Oldest First" },
  { value: "severity", label: "Severity (Critical first)" },
  { value: "priority", label: "Priority" },
  { value: "status",   label: "Status" },
  { value: "project",  label: "Project" },
];

export const PROJECT_HEALTH_LEVELS = [
  { value: "excellent", label: "Excellent", cls: "badge-success", description: "Investor-ready, deployed, no open errors." },
  { value: "good",      label: "Good",      cls: "badge-success", description: "Working, no open errors." },
  { value: "warning",   label: "Warning",   cls: "badge-warning", description: "Medium open errors present." },
  { value: "broken",    label: "Broken",    cls: "badge-danger",  description: "High severity open errors." },
  { value: "critical",  label: "Critical",  cls: "badge-critical",description: "Critical open errors — immediate action required." },
  { value: "unknown",   label: "Unknown",   cls: "badge-muted",   description: "Insufficient data." },
];

// ── Shared: Secret-like detection ─────────────────────────────
export const SECRET_FIELD_NAMES = [
  "apiKey","api_key","token","secret","password","privateKey","private_key",
  "accessToken","access_token","refreshToken","refresh_token",
  "clientSecret","client_secret","authorization","x-api-key",
];

export const SECRET_CONTENT_TERMS = [
  "apiKey","API_KEY","accessToken","refreshToken","privateKey",
  "bearer ","sk-","supabase service role","VITE_",".env",
  "password","secret","authorization","x-api-key",
];

export const SAFETY_RULES = [
  { key: "hasNoRewriteRule",       label: "No Rewrite Rule",       score: 15, terms: ["do not rewrite","don't rewrite","no rewrite","DO NOT rewrite"] },
  { key: "hasNoFeatureCreepRule",  label: "No Feature Creep Rule", score: 15, terms: ["no feature creep","do not add features","DO NOT build future"] },
  { key: "hasSSOTRule",            label: "SSOT Rule",             score: 15, terms: ["ssot","single source of truth","storage.js only"] },
  { key: "hasValidationGates",     label: "Validation Gates",      score: 15, terms: ["validation gate","validate before","VALIDATION GATES","checklist"] },
  { key: "hasScopeLock",           label: "Scope Lock",            score: 10, terms: ["scope lock","run lock","SCOPE LOCK","this run only"] },
  { key: "hasRollbackInstruction", label: "Rollback Instruction",  score: 10, terms: ["rollback","checkpoint","ROLLBACK","preserve run"] },
  { key: "hasDirective1",          label: "Directive 1",           score: 10, terms: ["directive 1","DIRECTIVE 1","full code","full program code"] },
  { key: "hasRLSStatement",        label: "RLS Statement",         score: 10, terms: ["rls status","row-level security","RLS STATUS"] },
];


// ── Run Types (Run 5) ─────────────────────────────────────────
export const RUN_TYPES = [
  { value: "build",         label: "Build" },
  { value: "fix",           label: "Fix" },
  { value: "refactor",      label: "Refactor" },
  { value: "audit",         label: "Audit" },
  { value: "deploy",        label: "Deploy" },
  { value: "database",      label: "Database" },
  { value: "prompt",        label: "Prompt" },
  { value: "ui",            label: "UI" },
  { value: "pwa",           label: "PWA" },
  { value: "routing",       label: "Routing" },
  { value: "safety",        label: "Safety" },
  { value: "documentation", label: "Documentation" },
  { value: "investor",      label: "Investor" },
  { value: "grant",         label: "Grant" },
  { value: "test",          label: "Test" },
  { value: "other",         label: "Other" },
];

export const RUN_STATUSES = [
  { value: "planned",      label: "Planned" },
  { value: "ready",        label: "Ready" },
  { value: "in_progress",  label: "In Progress" },
  { value: "completed",    label: "Completed" },
  { value: "failed",       label: "Failed" },
  { value: "blocked",      label: "Blocked" },
  { value: "needs_review", label: "Needs Review" },
  { value: "validated",    label: "Validated" },
  { value: "archived",     label: "Archived" },
];

export const RUN_VALIDATION_RESULTS = [
  { value: "not_tested", label: "Not Tested" },
  { value: "passed",     label: "Passed" },
  { value: "failed",     label: "Failed" },
  { value: "partial",    label: "Partial" },
  { value: "warning",    label: "Warning" },
];

export const RUN_CHECKPOINT_STATUSES = [
  { value: "pending",     label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "passed",      label: "Passed" },
  { value: "failed",      label: "Failed" },
  { value: "skipped",     label: "Skipped" },
];

export const RUN_SORT_MODES = [
  { value: "newest",     label: "Newest First" },
  { value: "oldest",     label: "Oldest First" },
  { value: "run_number", label: "Run Number" },
  { value: "priority",   label: "Priority" },
  { value: "status",     label: "Status" },
  { value: "project",    label: "Project" },
];

// ── Legacy ────────────────────────────────────────────────────
export const STATUS_TYPES = {
  WORKING:"working", BROKEN:"broken", PARTIAL:"partial", DRAFT:"draft",
  LOCKED:"locked", NOT_CONFIGURED:"not_configured", SUCCESS:"success",
  WARNING:"warning", DANGER:"danger",
};

export const AGENTS = [
  { id: "architect",  label: "Architect Agent",  icon: "🏗", lockRun: 7 },
  { id: "debug",      label: "Debug Agent",       icon: "🔍", lockRun: 7 },
  { id: "security",   label: "Security Agent",    icon: "🔒", lockRun: 7 },
  { id: "supabase",   label: "Supabase Agent",    icon: "🗄", lockRun: 8 },
  { id: "pwa",        label: "PWA Agent",         icon: "📱", lockRun: 7 },
  { id: "investor",   label: "Investor Agent",    icon: "💼", lockRun: 9 },
  { id: "prompt",     label: "Prompt Agent",      icon: "✍",  lockRun: 7 },
  { id: "compliance", label: "Compliance Agent",  icon: "✅", lockRun: 7 },
];

// ── Blueprint Compiler Constants (Run 7) ─────────────────────
export const BLUEPRINT_TARGET_TOOLS = [
  { value: "manus",        label: "Manus"        },
  { value: "base44",       label: "Base44"        },
  { value: "superagent",   label: "Super Agent"   },
  { value: "cursor",       label: "Cursor"        },
  { value: "developer",    label: "Developer"     },
];

export const ORIGINALITY_SAFETY_NOTICE =
  "This blueprint is for original development only. It uses abstract architecture, " +
  "workflow, data-model, and feature-category understanding. It must not be used to " +
  "clone proprietary UI, branding, protected content, logos, CSS, assets, source code, " +
  "or restricted platform data.";

export const DIRECTIVE_ONE =
  "Directive 1: Adapt the skill set to the task. Include full folder structure, " +
  "program code, logic code, transition code, UI logic, UI code, and HTML/JSX where " +
  "required. Preserve SSOT, prevent feature creep, and protect working systems.";

// ── Export Centre Constants (Run 8) ──────────────────────────
export const EXPORT_SAFETY_NOTICE =
  "Originality & Legal Safety Notice: This document is for original development planning only. " +
  "It uses abstract architecture, workflow, feature-category, and data-model understanding. " +
  "It must not be used to clone proprietary UI, branding, protected content, logos, CSS, assets, " +
  "source code, or restricted platform data. Any rebuild must use original branding, original UI, " +
  "original copy, original assets, and lawful data sources.";

export const DEMO_TYPES = [
  { id: "saas",    label: "SaaS Dashboard Architecture"        },
  { id: "pwa",     label: "Local-First PWA Architecture"       },
  { id: "booking", label: "Booking / Scheduling Platform"      },
];

// ── Product Readiness Constants (Run 9) ──────────────────────
export const READINESS_STATUSES = [
  "Not Ready",
  "Needs Fixes",
  "Mostly Ready",
  "Ready For Final QA",
  "Ready For Deployment Review",
];

export const TEST_CATEGORIES = [
  "App Shell",
  "Navigation",
  "Project/Input Capture",
  "Architecture Extraction",
  "Architecture Intelligence",
  "Original Blueprint Builder",
  "Export Centre",
  "Demo Mode",
  "Originality Guardrails",
  "Storage Persistence",
  "PWA",
  "Deployment",
  "Responsive Layout",
  "Error States",
];

// ── Project Discovery Constants (Run 10) ──────────────────────
export const PROJECT_SOURCE_TYPES = [
  "Manual Entry",
  "Uploaded ZIP",
  "Selected Folder/File",
  "GitHub",
  "Vercel",
  "Public URL",
  "Email Reference",
  "Manus Export",
  "Base44 Export",
  "OnSpace Export",
  "Lingguang Export",
  "Other",
];



export const PROJECT_RISK_LEVELS = ["Low", "Medium", "High", "Critical"];

export const DISCOVERY_SAFETY_NOTICE =
  "Project Discovery only analyses projects, files, URLs, and connected sources that you explicitly provide or authorise. It does not secretly scan your device, bypass access controls, expose secrets, or copy proprietary code, branding, assets, or content.";

export const SECRET_PATTERNS = [
  "API_KEY", "SECRET", "TOKEN", "PASSWORD", "PRIVATE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY", "OPENAI_API_KEY", "GROQ_API_KEY",
];

export const NEXT_ACTIONS = [
  "Send to Architecture Extractor",
  "Run Product Readiness Check",
  "Generate Original Blueprint",
  "Create Fix-Only Prompt",
  "Archive duplicate",
  "Review manually",
  "Reconnect deployment",
  "Upload ZIP for deeper scan",
];

// ============================================================
// AP3X — buildPromptCompiler.js — Run 7
// Generates complete, copy-paste-ready build prompts.
// Every prompt ends with Directive 1.
// Every prompt contains the Originality Safety Rule.
// ============================================================

import { DIRECTIVE_ONE, ORIGINALITY_SAFETY_NOTICE } from "./constants.js";
import { replaceUnsafeCloneTerms } from "./safePatternTransformer.js";

const ORIGINALITY_RULE_BLOCK = `
====================================================
ORIGINALITY SAFETY RULE
====================================================

${ORIGINALITY_SAFETY_NOTICE}

This build must use:
- Original branding and product name
- Original UI design and layout
- Original copy and content
- Original assets, icons, and images
- Lawful and authorised data sources

Use the architecture analysis only for:
- Abstract workflow patterns
- Data model structure inspiration
- Feature category understanding
- Component responsibility planning

Do NOT:
- Clone proprietary UI pixel-for-pixel
- Reproduce copyrighted logos, icons, or assets
- Copy CSS variables or design tokens from the source
- Reproduce protected source code
- Violate any platform terms of service or API terms

====================================================
`;

function safeName(blueprint) {
  return (blueprint?.title || "Original App").replace(/[<>"]/g, "");
}

function safeType(blueprint) {
  return blueprint?.appType || "App";
}

function moduleList(blueprint) {
  return (blueprint?.coreModules || []).map((m, i) => `${i + 1}. ${m.name || m} — ${m.description || ""}`).join("\n") || "Core modules to be defined.";
}

function pageList(blueprint) {
  return (blueprint?.pagePlan || []).map((p) => `- ${p.name || p}: ${p.purpose || ""}`).join("\n") || "Pages to be defined.";
}

function entityList(blueprint) {
  return (blueprint?.dataModelPlan?.entities || []).map((e) => `- ${e.name}: ${(e.fields || []).slice(0,5).join(", ")}`).join("\n") || "Entities to be defined.";
}

function runGates(run) {
  return (run?.validationGates || []).map((g, i) => `${i + 1}. ${g}`).join("\n") || "1. App loads\n2. Build succeeds";
}

// ── Core prompt shell ─────────────────────────────────────────
function buildPromptShell(blueprint, run, tool) {
  const name   = safeName(blueprint);
  const type   = safeType(blueprint);
  const runNum = run?.runNumber || 1;
  const title  = run?.title    || "Core Foundation";
  const mission= run?.mission  || "Build the core foundation.";

  return `⛔ STRICT ENFORCEMENT RULES — READ FIRST

YOU ARE RUN ${runNum} ONLY.

PROJECT:
${name}
Type: ${type}

CREATED BY: [Your Name]

MODE:
FIX-ONLY BUILD COMPILER MODE

PRIMARY RULES:
1. DO NOT rebuild the whole app.
2. DO NOT rewrite working systems.
3. DO NOT modify previous run files unless explicitly listed below.
4. DO NOT add backend, Supabase, auth, or connectors before their planned run.
5. DO NOT add features beyond this run's scope.
6. DO NOT create duplicate state stores.
7. DO NOT move state outside of the SSOT.
8. STOP immediately if this run would break a previous run.

====================================================
CURRENT PROJECT STATUS
====================================================

Runs 1–${runNum - 1} are assumed complete and must remain intact.
Run ${runNum} is the ONLY run being built now.

====================================================
MISSION OF RUN ${runNum}: ${title.toUpperCase()}
====================================================

${mission}

====================================================
RUN ${runNum} SCOPE LOCK
====================================================

THIS RUN MUST ONLY BUILD:
${(run?.requiredOutputs || []).map((o) => `- ${o}`).join("\n") || "- Core module as defined above."}

THIS RUN MUST NOT BUILD:
${(run?.forbiddenFiles || []).map((f) => `- ${f}`).join("\n") || "- Any feature not listed above."}

====================================================
ALLOWED FILES / CHANGES
====================================================

${(run?.allowedFiles || []).map((f) => `- ${f}`).join("\n") || "- New module files only."}

====================================================
CORE ARCHITECTURE LOCK
====================================================

- Local-first, single-user MVP
- Static deploy compatible
- SSOT enforced (storage.js or equivalent)
- Backend disabled until Run 8
- External AI disabled until planned run
- Connectors disabled until Run 8

====================================================
MODULES / FEATURES REQUIRED
====================================================

${moduleList(blueprint)}

====================================================
PAGE PLAN
====================================================

${pageList(blueprint)}

====================================================
DATA MODEL
====================================================

${entityList(blueprint)}

====================================================
STATE MANAGEMENT
====================================================

${blueprint?.stateManagementPlan?.pattern || "Single Source of Truth — all state in storage.js."}
${blueprint?.stateManagementPlan?.mutations || "All mutations through addItem/updateItem/deleteItem."}

====================================================
UI/UX REQUIREMENTS
====================================================

${blueprint?.uxFlowPlan?.navigationPattern || "Sidebar navigation with SSOT-backed active page state."}
Mobile responsive. Accessible. No blank states.

====================================================
VALIDATION GATES
====================================================

${runGates(run)}

====================================================
ACCEPTANCE TESTS
====================================================

${(run?.acceptanceTests || []).map((t, i) => `${i + 1}. ${t}`).join("\n") || "1. App loads.\n2. Feature works.\n3. Build succeeds."}

====================================================
STOP CONDITIONS
====================================================

${(run?.stopConditions || []).map((s) => `- ${s}`).join("\n") || "- Stop if build fails before any new features are added."}

====================================================
ROLLBACK INSTRUCTIONS
====================================================

${run?.rollbackNotes || "Remove new files. Restore SSOT to previous run state. Confirm previous runs still work."}

====================================================
${ORIGINALITY_RULE_BLOCK}
====================================================
FINAL OUTPUT REQUIRED
====================================================

When complete, output:
1. Files created
2. Files modified
3. What Run ${runNum} added
4. Validation checklist result
5. Any known limitations
6. Confirmation that previous runs were preserved
7. Confirmation: "RLS STATUS: NOT APPLICABLE" (if no database)

====================================================

${DIRECTIVE_ONE}`;
}

// ── Tool-specific compilers ───────────────────────────────────
export function compileManusPrompt(blueprint, run) {
  return injectOriginalitySafetyRules(
    injectFixOnlyCompilerRules(buildPromptShell(blueprint, run, "manus"))
  );
}

export function compileBase44Prompt(blueprint, run) {
  let prompt = buildPromptShell(blueprint, run, "base44");
  prompt = `# Base44 Super Agent Build Prompt\n\n` + prompt;
  return injectOriginalitySafetyRules(injectFixOnlyCompilerRules(prompt));
}

export function compileSuperAgentPrompt(blueprint, run) {
  let prompt = buildPromptShell(blueprint, run, "superagent");
  prompt = `# Super Agent Task\n\nYou are a Super Agent. Execute the following build task:\n\n` + prompt;
  return injectOriginalitySafetyRules(injectFixOnlyCompilerRules(prompt));
}

export function compileCursorPrompt(blueprint, run) {
  let prompt = `// Cursor AI Build Prompt — Run ${run?.runNumber || 1}\n// ${safeName(blueprint)}\n\n` + buildPromptShell(blueprint, run, "cursor");
  return injectOriginalitySafetyRules(injectFixOnlyCompilerRules(prompt));
}

export function compileDeveloperPrompt(blueprint, run) {
  let prompt = `# Developer Implementation Spec — Run ${run?.runNumber || 1}\n# ${safeName(blueprint)}\n\n` + buildPromptShell(blueprint, run, "developer");
  return injectOriginalitySafetyRules(injectFixOnlyCompilerRules(prompt));
}

// ── Injectors ─────────────────────────────────────────────────
export function injectFixOnlyCompilerRules(prompt) {
  if (!prompt || typeof prompt !== "string") return prompt;
  const rules = `\n====================================================\nFIX-ONLY BUILD COMPILER WRAPPER\n====================================================\n\nRules:\n1. DO NOT rewrite the whole app.\n2. DO NOT replace working systems.\n3. DO NOT change app identity.\n4. DO NOT create a second storage/state system.\n5. DO NOT add backend, Supabase, AI, connectors, auth, or payments before their planned run.\n6. STOP immediately if a change would break SSOT.\n7. Build this run only. Do not start the next run.\n\n====================================================\n`;
  return rules + prompt;
}

export function injectOriginalitySafetyRules(prompt) {
  if (!prompt || typeof prompt !== "string") return prompt;
  return replaceUnsafeCloneTerms(prompt);
}

export function injectDirectiveOne(prompt) {
  if (!prompt || typeof prompt !== "string") return prompt;
  const hasD1 = prompt.includes("Directive 1:");
  return hasD1 ? prompt : prompt + `\n\n${DIRECTIVE_ONE}`;
}

// ── Main entry ────────────────────────────────────────────────
export function compileBuildPromptFromBlueprint(blueprint, options = {}) {
  const { tool = "developer", runIndex = 0 } = options;
  const runs = blueprint?.implementationRuns || [];
  const run  = runs[runIndex] || runs[0] || null;

  const compilers = {
    manus:      compileManusPrompt,
    base44:     compileBase44Prompt,
    superagent: compileSuperAgentPrompt,
    cursor:     compileCursorPrompt,
    developer:  compileDeveloperPrompt,
  };

  const compiler = compilers[tool] || compilers.developer;
  let prompt = compiler(blueprint, run);
  prompt = injectDirectiveOne(prompt);
  return prompt;
}

// ── Validate compiled prompt ──────────────────────────────────
export function validateCompiledPrompt(prompt) {
  if (!prompt || typeof prompt !== "string") return { valid: false, issues: ["Prompt is empty."] };
  const issues = [];
  if (!prompt.includes("ORIGINALITY SAFETY RULE"))     issues.push("Missing originality safety rule block.");
  if (!prompt.includes("Directive 1:"))                issues.push("Missing Directive 1 ending.");
  if (!prompt.includes("VALIDATION GATES"))            issues.push("Missing validation gates.");
  if (!prompt.includes("ROLLBACK"))                    issues.push("Missing rollback instructions.");
  if (!prompt.includes("STOP CONDITIONS"))             issues.push("Missing stop conditions.");
  if (prompt.toLowerCase().includes("clone exactly"))  issues.push("Contains banned clone language.");
  if (prompt.toLowerCase().includes("copy exactly"))   issues.push("Contains banned clone language.");
  return { valid: issues.length === 0, issues };
}

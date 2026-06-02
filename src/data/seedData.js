// ============================================================
// AP3X BUILD CONTROL OS — Seed Data
// /src/data/seedData.js — Updated Run 4
// ============================================================

const now = new Date().toISOString();

// ── Prompt content strings (abbreviated for seed) ─────────────
const P1 = `⛔ STRICT AP3X ENFORCEMENT RULES — READ FIRST\nYOU ARE RUN 1 ONLY.\nDIRECTIVE 1 — FULL CODE REQUIREMENT\nFull folder structure + program code + UI + CSS + validation checklist.\nDO NOT rewrite. DO NOT add features. SSOT enforced. No Supabase. No GitHub. No backend.\nVALIDATION GATES:\n1. App loads.\n2. Sidebar works.\n3. State persists.\n4. All mutations through storage.js.\nRLS STATUS: NOT APPLICABLE.`;
const P2 = `⛔ STRICT AP3X ENFORCEMENT RULES — READ FIRST\nYOU ARE RUN 2 ONLY.\nDIRECTIVE 1 — FULL CODE REQUIREMENT\nFull folder structure + program code + UI + CSS + validation checklist.\nDO NOT rewrite. DO NOT replace Run 1. SSOT enforced. Scope lock — Run 2 only.\nVALIDATION GATES: 1–30 project CRUD. Build succeeds.\nRLS STATUS: NOT APPLICABLE.`;
const P3 = `-- SUPABASE SQL SAFETY TEMPLATE\n-- RLS STATUS: MUST BE STATED EXPLICITLY before any SQL migration.\n-- SSOT RULE: All schema changes reflected in storage.js.\n-- ROLLBACK INSTRUCTION: restore from backup before retrying.\n-- VALIDATION GATES: State RLS status. Confirm table. No drops without confirmation. Include rollback.`;
const P4 = `⛔ EMERGENCY FIX-ONLY — DO NOT REWRITE\nFIX-ONLY COMPILER RULES:\n1. DO NOT rewrite. 2. SSOT enforced. 3. No feature creep. 4. No backend.\nDIRECTIVE 1: Provide the complete fixed file only.\nSCOPE LOCK: Fix the specific bug. Return corrected full file.\nVALIDATION GATES: Bug fixed. App loads. No new bugs. Build succeeds.\nROLLBACK INSTRUCTION: Restore from previous run if fix fails.\nRLS STATUS: NOT APPLICABLE.`;

function seedSafety(content) {
  const RULES = [
    { key:"hasNoRewriteRule",       terms:["do not rewrite","DO NOT rewrite"],            score:15 },
    { key:"hasNoFeatureCreepRule",  terms:["no feature creep","DO NOT build future"],      score:15 },
    { key:"hasSSOTRule",            terms:["ssot","storage.js"],                           score:15 },
    { key:"hasValidationGates",     terms:["validation gate","VALIDATION GATES"],          score:15 },
    { key:"hasScopeLock",           terms:["scope lock","SCOPE LOCK"],                     score:10 },
    { key:"hasRollbackInstruction", terms:["rollback","ROLLBACK"],                         score:10 },
    { key:"hasDirective1",          terms:["directive 1","DIRECTIVE 1"],                   score:10 },
    { key:"hasRLSStatement",        terms:["rls status","RLS STATUS"],                     score:10 },
  ];
  const lower = content.toLowerCase();
  let score = 0;
  const rules = {};
  for (const r of RULES) {
    rules[r.key] = r.terms.some((t) => lower.includes(t.toLowerCase()));
    if (rules[r.key]) score += r.score;
  }
  return { ...rules, safetyScore: Math.min(100, score), warnings: [], secretDetected: false };
}

function makeVersion(content) {
  return { currentVersion:1, versions:[{ version:1, content, createdAt:now, changeNote:"Initial version" }] };
}


// ── Run seed data (Run 5) ─────────────────────────────────────
export const runSeedData = [
  {
    id:"run_seed_001", title:"Run 1 — Foundation Shell", slug:"run-1-foundation-shell",
    runNumber:"1",
    description:"Local-first PWA shell: dashboard, sidebar, storage.js SSOT, global CSS, manifest, Vite config.",
    type:"build", status:"completed", priority:"urgent",
    linkedProjectId:"project_seed_001", linkedPromptId:"prompt_seed_001", linkedErrorId:"",
    scope:{
      summary:"Build the AP3X foundation shell. No Project Registry, no Prompt Vault, no backend.",
      allowedWork:["App shell","Dashboard","Sidebar","storage.js","global.css","manifest.json","vite.config.js"],
      forbiddenWork:["Supabase","GitHub","OpenAI","backend","auth","payments","connectors"],
      filesExpected:["src/App.jsx","src/main.jsx","src/components/AppShell.jsx","src/core/storage.js","src/styles/global.css"],
      filesTouched:["src/App.jsx","src/main.jsx","src/components/AppShell.jsx","src/core/storage.js","src/styles/global.css","public/manifest.json"],
    },
    promptSnapshot:{
      title:"AP3X Run 1 Foundation Prompt",
      content:P1,
      copiedFromPromptId:"prompt_seed_001",
      copiedAt:now,
    },
    checkpoints:[
      {id:"cp_001",title:"App shell renders",description:"AppShell mounts without errors.",status:"passed",createdAt:now,completedAt:now,notes:""},
      {id:"cp_002",title:"Sidebar navigation works",description:"All nav items clickable.",status:"passed",createdAt:now,completedAt:now,notes:""},
      {id:"cp_003",title:"storage.js SSOT active",description:"All state mutations through storage.js.",status:"passed",createdAt:now,completedAt:now,notes:""},
      {id:"cp_004",title:"State persists after refresh",description:"localStorage stores state correctly.",status:"passed",createdAt:now,completedAt:now,notes:""},
    ],
    validation:{
      checklist:[
        {id:"vi_001",text:"App loads without errors",result:"passed",notes:""},
        {id:"vi_002",text:"Sidebar navigation works",result:"passed",notes:""},
        {id:"vi_003",text:"State persists after refresh",result:"passed",notes:""},
        {id:"vi_004",text:"All mutations through storage.js",result:"passed",notes:""},
        {id:"vi_005",text:"Build succeeds",result:"passed",notes:""},
      ],
      passedCount:5,failedCount:0,warningCount:0,result:"passed",notes:"Run 1 fully validated.",
    },
    outcome:{
      summary:"Run 1 complete. Foundation shell built. All validation gates passed.",
      filesCreated:["src/App.jsx","src/main.jsx","src/components/AppShell.jsx","src/core/storage.js","src/styles/global.css"],
      filesUpdated:["vite.config.js","public/manifest.json","package.json"],
      knownLimitations:"No projects, prompts, or errors yet. Dashboard is static.",
      nextRecommendedAction:"Begin Run 2 — Project Registry.",
      resultNotes:"",
    },
    flags:{isArchived:false,isPinned:true,isBlocking:false,needsFix:false,needsReview:false,causedRegression:false,safeToContinue:true},
    tags:["run-1","foundation","shell","ssot","pwa","completed"],
    createdAt:now, updatedAt:now,
  },
  {
    id:"run_seed_002", title:"Run 2 — Project Registry", slug:"run-2-project-registry",
    runNumber:"2",
    description:"Full CRUD Project Registry: add, edit, duplicate, archive, restore, delete projects. Health flags. Project detail view.",
    type:"build", status:"completed", priority:"urgent",
    linkedProjectId:"project_seed_001", linkedPromptId:"prompt_seed_002", linkedErrorId:"",
    scope:{
      summary:"Build Project Registry on top of Run 1. No Prompt Vault, no Error Centre.",
      allowedWork:["ProjectCard","ProjectForm","ProjectDetail","ProjectFilters","storage.js project helpers"],
      forbiddenWork:["Supabase","GitHub","OpenAI","backend","auth","payments","Prompt Vault","Error Centre"],
      filesExpected:["src/components/ProjectCard.jsx","src/components/ProjectForm.jsx","src/pages/Projects.jsx"],
      filesTouched:["src/components/ProjectCard.jsx","src/components/ProjectForm.jsx","src/pages/Projects.jsx","src/core/storage.js"],
    },
    promptSnapshot:{title:"AP3X Run 2 Project Registry Prompt",content:P2,copiedFromPromptId:"prompt_seed_002",copiedAt:now},
    checkpoints:[
      {id:"cp_005",title:"Project list renders",description:"Projects page loads with seed data.",status:"passed",createdAt:now,completedAt:now,notes:""},
      {id:"cp_006",title:"Add project works",description:"New project saves via storage.js.",status:"passed",createdAt:now,completedAt:now,notes:""},
      {id:"cp_007",title:"Edit/duplicate/archive/delete",description:"All CRUD operations functional.",status:"passed",createdAt:now,completedAt:now,notes:""},
      {id:"cp_008",title:"Run 1 still works",description:"Dashboard and sidebar unaffected.",status:"passed",createdAt:now,completedAt:now,notes:""},
    ],
    validation:{
      checklist:[
        {id:"vi_006",text:"App loads without errors",result:"passed",notes:""},
        {id:"vi_007",text:"Runs 1 features preserved",result:"passed",notes:""},
        {id:"vi_008",text:"Project CRUD works",result:"passed",notes:""},
        {id:"vi_009",text:"State persists after refresh",result:"passed",notes:""},
        {id:"vi_010",text:"All mutations through storage.js",result:"passed",notes:""},
        {id:"vi_011",text:"Build succeeds",result:"passed",notes:""},
      ],
      passedCount:6,failedCount:0,warningCount:0,result:"passed",notes:"Run 2 fully validated.",
    },
    outcome:{
      summary:"Run 2 complete. Full Project Registry with CRUD, health flags, filters, and seed data.",
      filesCreated:["src/components/ProjectCard.jsx","src/components/ProjectForm.jsx","src/components/ProjectDetail.jsx"],
      filesUpdated:["src/pages/Projects.jsx","src/core/storage.js","src/core/constants.js","src/data/seedData.js"],
      knownLimitations:"No prompt linking. No error linking yet.",
      nextRecommendedAction:"Begin Run 3 — Prompt Vault.",
      resultNotes:"",
    },
    flags:{isArchived:false,isPinned:false,isBlocking:false,needsFix:false,needsReview:false,causedRegression:false,safeToContinue:true},
    tags:["run-2","project-registry","crud","completed"],
    createdAt:now, updatedAt:now,
  },
  {
    id:"run_seed_003", title:"Run 3 — Prompt Vault", slug:"run-3-prompt-vault",
    runNumber:"3",
    description:"Full Prompt Vault: add/edit/duplicate/archive/restore/delete prompts. Safety scoring. Version history. Copy panel. Import/export.",
    type:"build", status:"completed", priority:"high",
    linkedProjectId:"project_seed_001", linkedPromptId:"", linkedErrorId:"",
    scope:{
      summary:"Build Prompt Vault on top of Runs 1-2. No Error Centre.",
      allowedWork:["PromptCard","PromptForm","PromptDetail","PromptFilters","PromptSafetyPanel","PromptVersionTimeline"],
      forbiddenWork:["Supabase","GitHub","OpenAI","backend","auth","Error Centre","live AI"],
      filesExpected:["src/components/PromptCard.jsx","src/components/PromptForm.jsx","src/pages/Prompts.jsx"],
      filesTouched:["src/components/PromptCard.jsx","src/components/PromptForm.jsx","src/pages/Prompts.jsx","src/core/promptUtils.js"],
    },
    promptSnapshot:{title:"",content:"",copiedFromPromptId:"",copiedAt:null},
    checkpoints:[
      {id:"cp_009",title:"Prompt list renders",description:"Prompts page loads with seed data.",status:"passed",createdAt:now,completedAt:now,notes:""},
      {id:"cp_010",title:"Safety scoring works",description:"All 8 safety rules scored correctly.",status:"passed",createdAt:now,completedAt:now,notes:""},
      {id:"cp_011",title:"Version history works",description:"Versions saved, timeline shown.",status:"passed",createdAt:now,completedAt:now,notes:""},
      {id:"cp_012",title:"Runs 1-2 still work",description:"Dashboard, projects, sidebar unaffected.",status:"passed",createdAt:now,completedAt:now,notes:""},
    ],
    validation:{
      checklist:[
        {id:"vi_012",text:"App loads",result:"passed",notes:""},
        {id:"vi_013",text:"Runs 1-2 preserved",result:"passed",notes:""},
        {id:"vi_014",text:"Prompt CRUD works",result:"passed",notes:""},
        {id:"vi_015",text:"Safety scoring correct",result:"passed",notes:""},
        {id:"vi_016",text:"Build succeeds",result:"passed",notes:""},
      ],
      passedCount:5,failedCount:0,warningCount:0,result:"passed",notes:"Run 3 fully validated.",
    },
    outcome:{
      summary:"Run 3 complete. Full Prompt Vault with safety scoring, versioning, copy, import/export.",
      filesCreated:["src/components/PromptCard.jsx","src/components/PromptForm.jsx","src/components/PromptDetail.jsx","src/core/promptUtils.js"],
      filesUpdated:["src/pages/Prompts.jsx","src/core/storage.js","src/core/constants.js","src/data/seedData.js"],
      knownLimitations:"No error linking yet. Prompt content is text-only, never executed.",
      nextRecommendedAction:"Begin Run 4 — Error Centre.",
      resultNotes:"",
    },
    flags:{isArchived:false,isPinned:false,isBlocking:false,needsFix:false,needsReview:false,causedRegression:false,safeToContinue:true},
    tags:["run-3","prompt-vault","safety","versioning","completed"],
    createdAt:now, updatedAt:now,
  },
  {
    id:"run_seed_004", title:"Run 4 — Error Centre + Classifier", slug:"run-4-error-centre-classifier",
    runNumber:"4",
    description:"Full Error Centre with classifier, triage, fix checklists, import/export, and project health integration.",
    type:"build", status:"completed", priority:"high",
    linkedProjectId:"project_seed_001", linkedPromptId:"prompt_seed_004", linkedErrorId:"error_seed_004",
    scope:{
      summary:"Build Error Centre on top of Runs 1-3. Add Working/Broken Classifier. No Supabase.",
      allowedWork:["ErrorCard","ErrorForm","ErrorDetail","ErrorFilters","ErrorFixChecklist","ErrorClassifierPanel","ProjectHealthPanel"],
      forbiddenWork:["Supabase","GitHub","OpenAI","backend","auth","live AI","automatic fixing"],
      filesExpected:["src/components/ErrorCard.jsx","src/components/ErrorForm.jsx","src/pages/Errors.jsx","src/core/errorUtils.js"],
      filesTouched:["src/components/ErrorCard.jsx","src/components/ErrorForm.jsx","src/pages/Errors.jsx","src/core/errorUtils.js","src/core/storage.js"],
    },
    promptSnapshot:{title:"Emergency Fix-Only Debug Prompt",content:P4,copiedFromPromptId:"prompt_seed_004",copiedAt:now},
    checkpoints:[
      {id:"cp_013",title:"Error Centre opens",description:"Errors page loads with stats and filter bar.",status:"passed",createdAt:now,completedAt:now,notes:""},
      {id:"cp_014",title:"Error CRUD works",description:"Add/edit/duplicate/archive/delete all functional.",status:"passed",createdAt:now,completedAt:now,notes:""},
      {id:"cp_015",title:"Classifier works",description:"Deterministic local classification — no AI.",status:"passed",createdAt:now,completedAt:now,notes:""},
      {id:"cp_016",title:"Project health panel works",description:"ProjectDetail shows ProjectHealthPanel.",status:"passed",createdAt:now,completedAt:now,notes:""},
      {id:"cp_017",title:"Runs 1-3 still work",description:"All prior functionality unaffected.",status:"passed",createdAt:now,completedAt:now,notes:""},
      {id:"cp_018",title:"Build succeeds cleanly",description:"74 modules, 0 errors, 0 warnings.",status:"passed",createdAt:now,completedAt:now,notes:"74 modules transformed."},
    ],
    validation:{
      checklist:[
        {id:"vi_017",text:"App loads",result:"passed",notes:""},
        {id:"vi_018",text:"Runs 1-3 preserved",result:"passed",notes:""},
        {id:"vi_019",text:"Error CRUD works",result:"passed",notes:""},
        {id:"vi_020",text:"Classifier local-only",result:"passed",notes:""},
        {id:"vi_021",text:"Secret detection works",result:"passed",notes:""},
        {id:"vi_022",text:"Build succeeds",result:"passed",notes:"74 modules"},
        {id:"vi_023",text:"ProjectDetail health panel",result:"passed",notes:""},
        {id:"vi_024",text:"No Supabase/AI/backend added",result:"passed",notes:""},
      ],
      passedCount:7,failedCount:0,warningCount:1,result:"partial",notes:"One partial — ErrorDetail cross-ref noted for Run 5.",
    },
    outcome:{
      summary:"Run 4 complete. Error Centre, classifier, fix checklists, import/export all working.",
      filesCreated:["src/components/ErrorCard.jsx","src/components/ErrorDetail.jsx","src/components/ErrorForm.jsx","src/components/ProjectHealthPanel.jsx","src/core/errorUtils.js"],
      filesUpdated:["src/pages/Errors.jsx","src/pages/Dashboard.jsx","src/core/storage.js","src/data/seedData.js"],
      knownLimitations:"No Run History yet. Classifier is deterministic — not AI. Connectors locked to Run 8.",
      nextRecommendedAction:"Begin Run 5 — Run History + Checkpoint System.",
      resultNotes:"",
    },
    flags:{isArchived:false,isPinned:true,isBlocking:false,needsFix:false,needsReview:false,causedRegression:false,safeToContinue:true},
    tags:["run-4","error-centre","classifier","triage","fix-checklist","completed"],
    createdAt:now, updatedAt:now,
  },
];


export const seedData = {
  projects: [
    {
      id:"project_seed_001", name:"AP3X VER5E Demo System", slug:"ap3x-ver5e-demo-system",
      description:"The core AP3X BUILD CONTROL OS command centre — Runs 1–4 complete.",
      type:"ai_tool", status:"working", priority:"urgent", stage:"run_3_plus",
      health:"warning", category:"Control OS", sector:"Productivity", owner:"Kyzel Kreates",
      tags:["ap3x","control-os","local-first","ssot","run-4","pwa"],
      links:{ github:"",vercel:"",liveUrl:"",base44:"https://app.base44.com",supabase:"",docs:"",figma:"",other:"" },
      stack:{ frontend:"React 18 + Vite",backend:"None (local-first)",database:"localStorage (SSOT)",ai:"Planned — Run 7",deployment:"Static",auth:"None",storage:"localStorage" },
      notes:"Run 4 adds Error Centre + Classifier. Runs 1–4 complete.",
      nextAction:"Begin Run 5 Run History.",
      risks:["State loss if localStorage cleared"], blockers:[],
      metrics:{ completionPercent:55,investorReadiness:15,technicalHealth:90,deploymentReadiness:70 },
      flags:{ isTemplate:false,isArchived:false,isInvestorReady:false,isDeployed:false,needsRebuild:false,hasPwa:true,hasBackend:false,hasAi:true },
      createdAt:now, updatedAt:now,
    },
    {
      id:"project_seed_002", name:"Big V's Best Routes", slug:"big-vs-best-routes",
      description:"Local-first navigation PWA for planning and saving optimal driving and delivery routes.",
      type:"navigation", status:"partial", priority:"high", stage:"testing",
      health:"broken", category:"Navigation", sector:"Logistics", owner:"Kyzel Kreates",
      tags:["navigation","routes","pwa","offline","logistics"],
      links:{ github:"",vercel:"",liveUrl:"",base44:"",supabase:"",docs:"",figma:"",other:"" },
      stack:{ frontend:"React + Leaflet",backend:"Node.js API",database:"PostgreSQL",ai:"None",deployment:"Vercel",auth:"Planned",storage:"Supabase Storage" },
      notes:"Route saving working. Offline sync in progress. Deployment errors blocking live.",
      nextAction:"Fix Vercel deployment build errors.",
      risks:["Map API rate limits"], blockers:["Supabase schema needs finalising","Vercel build failing"],
      metrics:{ completionPercent:55,investorReadiness:20,technicalHealth:60,deploymentReadiness:30 },
      flags:{ isTemplate:false,isArchived:false,isInvestorReady:false,isDeployed:false,needsRebuild:false,hasPwa:true,hasBackend:true,hasAi:false },
      createdAt:now, updatedAt:now,
    },
    {
      id:"project_seed_003", name:"Four Paws Training & Enrichment Academy", slug:"four-paws-training-enrichment-academy",
      description:"LMS platform for dog training courses and enrichment programmes.",
      type:"lms", status:"deployed", priority:"medium", stage:"deployed",
      health:"good", category:"Education", sector:"Pet Industry", owner:"Kyzel Kreates",
      tags:["lms","dog-training","education","pwa","deployed"],
      links:{ github:"",vercel:"",liveUrl:"https://placeholder.example.com",base44:"",supabase:"",docs:"",figma:"",other:"" },
      stack:{ frontend:"React + Vite",backend:"Supabase",database:"Supabase PostgreSQL",ai:"None",deployment:"Netlify",auth:"Supabase Auth",storage:"Supabase Storage" },
      notes:"Live and accepting enrolments. 3 courses published.",
      nextAction:"Build PDF certificate generator.",
      risks:["Supabase free tier limits"], blockers:[],
      metrics:{ completionPercent:75,investorReadiness:30,technicalHealth:80,deploymentReadiness:90 },
      flags:{ isTemplate:false,isArchived:false,isInvestorReady:false,isDeployed:true,needsRebuild:false,hasPwa:true,hasBackend:true,hasAi:false },
      createdAt:now, updatedAt:now,
    },
  ],

  prompts: [
    {
      id:"prompt_seed_001", title:"AP3X Run 1 Foundation Prompt", slug:"ap3x-run-1-foundation-prompt",
      description:"Master prompt for building the AP3X BUILD CONTROL OS Run 1 foundation shell.",
      content:P1, type:"base44", category:"build", status:"successful", priority:"urgent",
      linkedProjectId:"project_seed_001", linkedRunId:"1", linkedErrorId:"",
      tags:["run-1","foundation","ssot","pwa","master"],
      platform:{ target:"base44",model:"",environment:"production",notes:"" },
      safety:seedSafety(P1), versioning:makeVersion(P1),
      usage:{ timesCopied:3,lastCopiedAt:now,lastUsedAt:now,resultStatus:"successful",resultNotes:"Run 1 built successfully." },
      flags:{ isPinned:true,isFavourite:true,isArchived:false,isTemplate:false,isMasterPrompt:true,needsReview:false },
      createdAt:now, updatedAt:now,
    },
    {
      id:"prompt_seed_002", title:"AP3X Run 2 Project Registry Prompt", slug:"ap3x-run-2-project-registry-prompt",
      description:"Master prompt for building the full Project Registry in Run 2.",
      content:P2, type:"base44", category:"build", status:"successful", priority:"urgent",
      linkedProjectId:"project_seed_001", linkedRunId:"2", linkedErrorId:"",
      tags:["run-2","project-registry","crud","master"],
      platform:{ target:"base44",model:"",environment:"production",notes:"" },
      safety:seedSafety(P2), versioning:makeVersion(P2),
      usage:{ timesCopied:2,lastCopiedAt:now,lastUsedAt:now,resultStatus:"successful",resultNotes:"Run 2 built successfully." },
      flags:{ isPinned:true,isFavourite:true,isArchived:false,isTemplate:false,isMasterPrompt:true,needsReview:false },
      createdAt:now, updatedAt:now,
    },
    {
      id:"prompt_seed_003", title:"Supabase SQL Safety Template", slug:"supabase-sql-safety-template",
      description:"Template for safe Supabase SQL migrations with RLS statement, rollback instructions, and validation gates.",
      content:P3, type:"supabase_sql", category:"database", status:"ready", priority:"high",
      linkedProjectId:"", linkedRunId:"", linkedErrorId:"",
      tags:["supabase","sql","rls","template","safety","database"],
      platform:{ target:"base44",model:"",environment:"development",notes:"Use as base for all Supabase SQL prompts." },
      safety:seedSafety(P3), versioning:makeVersion(P3),
      usage:{ timesCopied:0,lastCopiedAt:null,lastUsedAt:null,resultStatus:"unknown",resultNotes:"" },
      flags:{ isPinned:false,isFavourite:false,isArchived:false,isTemplate:true,isMasterPrompt:false,needsReview:false },
      createdAt:now, updatedAt:now,
    },
    {
      id:"prompt_seed_004", title:"Emergency Fix-Only Debug Prompt", slug:"emergency-fix-only-debug-prompt",
      description:"Emergency fix compiler prompt for debugging without rewriting. Includes all safety rules.",
      content:P4, type:"debug_fix", category:"fix", status:"ready", priority:"urgent",
      linkedProjectId:"", linkedRunId:"", linkedErrorId:"",
      tags:["emergency","fix-only","debug","ssot","no-rewrite","safety"],
      platform:{ target:"base44",model:"",environment:"production",notes:"Use when targeted fix needed." },
      safety:seedSafety(P4), versioning:makeVersion(P4),
      usage:{ timesCopied:0,lastCopiedAt:null,lastUsedAt:null,resultStatus:"unknown",resultNotes:"" },
      flags:{ isPinned:false,isFavourite:false,isArchived:false,isTemplate:true,isMasterPrompt:false,needsReview:false },
      createdAt:now, updatedAt:now,
    },
  ],

  runs: runSeedData,
  errors: [
    {
      id:"error_seed_001", title:"Vercel Deployment Build Failure", slug:"vercel-deployment-build-failure",
      description:"Vite build fails during Vercel deployment. The /dist output directory is not found after build step completes.",
      rawLog:"Error: Build output directory '/dist' not found.\nVercel deployment failed at step: Build.\nExit code 1.\nCheck your vite.config.js output path.",
      category:"deployment_error", source:"vercel", severity:"high", status:"open", priority:"high",
      linkedProjectId:"project_seed_002", linkedPromptId:"", linkedRunId:"",
      environment:{ platform:"Vercel",browser:"",device:"",framework:"Vite + React",deploymentTarget:"Vercel",url:"",branch:"main",buildId:"deploy_xxx_001",timestamp:now },
      diagnosis:{ suspectedCause:"Vite config output path mismatch with Vercel expected path.",affectedArea:"Deployment pipeline",failurePoint:"Build step — dist not found",reproductionSteps:"Push to main branch and trigger Vercel deployment.",expectedBehaviour:"Build completes and /dist is deployed.",actualBehaviour:"Build exits with code 1. No /dist found.",userImpact:"Site not live. Deployment blocked.",notes:"" },
      classification:{ projectStatusBefore:"partial",recommendedProjectStatus:"broken",recommendedHealth:"broken",isBlocking:true,isDeploymentBlocking:true,isSecurityRelated:false,isDataLossRisk:false,isRegression:false,isRecurring:false },
      fixPlan:{ summary:"Fix Vite output config to match Vercel expected path.",steps:[{id:"step_001",text:"Check vite.config.js for build.outDir setting",completed:false},{id:"step_002",text:"Confirm Vercel project settings → Build & Output Settings",completed:false},{id:"step_003",text:"Run npm run build locally and confirm /dist exists",completed:false},{id:"step_004",text:"Push fix and re-deploy",completed:false}],validationSteps:[{id:"vstep_001",text:"Vercel deployment shows green",completed:false},{id:"vstep_002",text:"Live URL loads correctly",completed:false}],rollbackPlan:"Revert Vercel build settings to previous values.",linkedFixPromptId:"",fixAttempted:false,fixedAt:null,fixedBy:"",resultNotes:"" },
      tags:["deployment","vercel","vite","build","blocker"],
      attachments:{ screenshotNotes:"",fileNotes:"",externalReferences:[] },
      flags:{ isArchived:false,isPinned:true,needsPrompt:true,needsHumanReview:false,needsRebuild:false,canBeIgnored:false },
      createdAt:now, updatedAt:now,
    },
    {
      id:"error_seed_002", title:"Supabase RLS Policy Missing — Projects Table", slug:"supabase-rls-policy-missing-projects-table",
      description:"Supabase projects table does not have an explicit RLS policy. All rows are accessible by any authenticated user.",
      rawLog:"WARNING: Table 'projects' has RLS enabled but no policies defined.\nAll rows will be blocked unless a policy is created.\nPostgres log: permission denied for table projects.",
      category:"database_error", source:"supabase", severity:"medium", status:"investigating", priority:"high",
      linkedProjectId:"project_seed_003", linkedPromptId:"prompt_seed_003", linkedRunId:"",
      environment:{ platform:"Supabase",browser:"",device:"",framework:"",deploymentTarget:"Supabase Cloud",url:"",branch:"",buildId:"",timestamp:now },
      diagnosis:{ suspectedCause:"RLS enabled but no policies created — all queries blocked.",affectedArea:"Supabase database — projects table",failurePoint:"RLS policy evaluation",reproductionSteps:"Query projects table as authenticated user.",expectedBehaviour:"User sees only their own project rows.",actualBehaviour:"Permission denied — no matching policy.",userImpact:"Users cannot load their projects.",notes:"RLS status must always be explicitly stated in SQL runs. See Supabase SQL Safety Template." },
      classification:{ projectStatusBefore:"deployed",recommendedProjectStatus:"partial",recommendedHealth:"warning",isBlocking:false,isDeploymentBlocking:false,isSecurityRelated:true,isDataLossRisk:false,isRegression:false,isRecurring:false },
      fixPlan:{ summary:"Add RLS policy to projects table using prompt_seed_003 template.",steps:[{id:"step_003",text:"Open Supabase SQL editor",completed:false},{id:"step_004",text:"State RLS status explicitly before running SQL",completed:false},{id:"step_005",text:"Create policy: users can only access own rows",completed:false},{id:"step_006",text:"Test policy in Supabase SQL editor",completed:false}],validationSteps:[{id:"vstep_003",text:"Authenticated user can load their own rows",completed:false},{id:"vstep_004",text:"Another user cannot see first user's rows",completed:false}],rollbackPlan:"DROP POLICY if applied incorrectly and restore previous state.",linkedFixPromptId:"prompt_seed_003",fixAttempted:false,fixedAt:null,fixedBy:"",resultNotes:"" },
      tags:["supabase","rls","security","database","policy"],
      attachments:{ screenshotNotes:"",fileNotes:"",externalReferences:[] },
      flags:{ isArchived:false,isPinned:false,needsPrompt:true,needsHumanReview:true,needsRebuild:false,canBeIgnored:false },
      createdAt:now, updatedAt:now,
    },
    {
      id:"error_seed_003", title:"PWA Install Prompt Not Triggering", slug:"pwa-install-prompt-not-triggering",
      description:"The beforeinstallprompt event does not fire on Chrome mobile. PWA install banner never appears.",
      rawLog:"Chrome DevTools Console:\nNo beforeinstallprompt event received.\nManifest: icons missing for 192x192 and 512x512.\nService worker: registered but no fetch handler found.\nPWA installability: Not met — missing icon sizes.",
      category:"pwa_error", source:"pwa_install", severity:"medium", status:"fix_planned", priority:"medium",
      linkedProjectId:"project_seed_001", linkedPromptId:"", linkedRunId:"1",
      environment:{ platform:"Chrome Mobile",browser:"Chrome 124",device:"Mobile",framework:"Vite PWA",deploymentTarget:"Static",url:"",branch:"main",buildId:"",timestamp:now },
      diagnosis:{ suspectedCause:"PWA icons are 1x1 pixel placeholders. Missing 192 and 512 icon sizes fails installability criteria.",affectedArea:"PWA install prompt",failurePoint:"beforeinstallprompt event — icon validation",reproductionSteps:"Open app on Chrome mobile. Check Application tab in DevTools.",expectedBehaviour:"Install prompt appears after page load.",actualBehaviour:"No prompt. DevTools shows installability not met.",userImpact:"Users cannot install the PWA to home screen.",notes:"Replace placeholder icon files in /public/icons/." },
      classification:{ projectStatusBefore:"working",recommendedProjectStatus:"partial",recommendedHealth:"warning",isBlocking:false,isDeploymentBlocking:false,isSecurityRelated:false,isDataLossRisk:false,isRegression:false,isRecurring:false },
      fixPlan:{ summary:"Replace placeholder icon files with real 192x192 and 512x512 PNG icons.",steps:[{id:"step_007",text:"Generate 192x192 PNG icon",completed:false},{id:"step_008",text:"Generate 512x512 PNG icon",completed:false},{id:"step_009",text:"Replace files in /public/icons/",completed:false},{id:"step_010",text:"Verify manifest.json icon paths",completed:false},{id:"step_011",text:"Test in Chrome DevTools Application tab",completed:false}],validationSteps:[{id:"vstep_005",text:"DevTools shows PWA installable",completed:false},{id:"vstep_006",text:"Install prompt appears on mobile Chrome",completed:false}],rollbackPlan:"No rollback needed — icon files only.",linkedFixPromptId:"",fixAttempted:false,fixedAt:null,fixedBy:"",resultNotes:"" },
      tags:["pwa","icons","install","manifest","chrome"],
      attachments:{ screenshotNotes:"DevTools Application tab shows icon errors.",fileNotes:"",externalReferences:[] },
      flags:{ isArchived:false,isPinned:false,needsPrompt:false,needsHumanReview:false,needsRebuild:false,canBeIgnored:false },
      createdAt:now, updatedAt:now,
    },
    {
      id:"error_seed_004", title:"Runtime Crash — Cannot Read Properties of Undefined", slug:"runtime-crash-cannot-read-properties-of-undefined",
      description:"Uncaught TypeError in Dashboard.jsx when systemHealth is undefined on first render. App crashes on load.",
      rawLog:"Uncaught TypeError: Cannot read properties of undefined (reading 'totalProjects')\n    at Dashboard (Dashboard.jsx:42:38)\n    at renderWithHooks (react-dom.development.js:14985:18)\n    at mountIndeterminateComponent\n    at beginWork\nReact error boundary not found — full crash.",
      category:"runtime_error", source:"browser_console", severity:"critical", status:"open", priority:"urgent",
      linkedProjectId:"project_seed_001", linkedPromptId:"prompt_seed_004", linkedRunId:"3",
      environment:{ platform:"Browser",browser:"Firefox 125",device:"Desktop",framework:"React 18",deploymentTarget:"Static",url:"http://localhost:3000",branch:"main",buildId:"",timestamp:now },
      diagnosis:{ suspectedCause:"systemHealth is null/undefined on first render before storage.js bootstrap completes.",affectedArea:"Dashboard.jsx — systemHealth rendering",failurePoint:"Dashboard render — line 42 — accessing totalProjects",reproductionSteps:"Open app in fresh browser with no localStorage data.",expectedBehaviour:"Dashboard loads with default zero values.",actualBehaviour:"App crashes immediately with TypeError.",userImpact:"Entire app is unusable — crash on load.",notes:"Add optional chaining or initialise systemHealth with defaults before render." },
      classification:{ projectStatusBefore:"working",recommendedProjectStatus:"broken",recommendedHealth:"critical",isBlocking:true,isDeploymentBlocking:false,isSecurityRelated:false,isDataLossRisk:false,isRegression:true,isRecurring:false },
      fixPlan:{ summary:"Add optional chaining to all systemHealth accesses in Dashboard.jsx. Ensure storage.js always returns a valid default state.",steps:[{id:"step_012",text:"Open Dashboard.jsx",completed:true},{id:"step_013",text:"Add optional chaining: systemHealth?.totalProjects ?? 0",completed:true},{id:"step_014",text:"Verify storage.js DEFAULT_STATE includes all systemHealth fields",completed:false},{id:"step_015",text:"Test in fresh browser with no localStorage",completed:false}],validationSteps:[{id:"vstep_007",text:"Dashboard loads without crash on empty state",completed:false},{id:"vstep_008",text:"No TypeErrors in console",completed:false}],rollbackPlan:"Restore previous Dashboard.jsx from Run 2.",linkedFixPromptId:"prompt_seed_004",fixAttempted:true,fixedAt:null,fixedBy:"",resultNotes:"Optional chaining applied. Pending final validation." },
      tags:["runtime","crash","dashboard","undefined","regression","critical"],
      attachments:{ screenshotNotes:"",fileNotes:"",externalReferences:[] },
      flags:{ isArchived:false,isPinned:true,needsPrompt:false,needsHumanReview:true,needsRebuild:false,canBeIgnored:false },
      createdAt:now, updatedAt:now,
    },
  ],
};

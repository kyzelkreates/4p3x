# AP3X BUILD CONTROL OS™
### Autonomous Project Command Centre

> **Run 5 Complete — Run History + Checkpoint System**

---

## Overview

AP3X BUILD CONTROL OS is a local-first, installable PWA dashboard for organising, tracking, and managing AI-powered SaaS/PWA build systems.

All state is local-first via a single localStorage SSOT (`ap3x_ssot_v1`). No backend. No Supabase. No external AI. No authentication.

---

## Run Status

| Run | Module                           | Status      |
|-----|----------------------------------|-------------|
| 1   | Foundation Shell                 | ✅ Complete |
| 2   | Project Registry                 | ✅ Complete |
| 3   | Prompt Vault                     | ✅ Complete |
| 4   | Error Centre + Classifier        | ✅ Complete |
| 5   | Run History + Checkpoint System  | ✅ Complete |
| 6   | Architecture Mapper              | 🔒 Locked   |
| 7   | Agent Board                      | 🔒 Locked   |
| 8   | Connectors                       | 🔒 Locked   |
| 9   | SaaS Factory                     | 🔒 Locked   |

---

## What's in Run 5

### Run History Page
- Full CRUD: create, edit, duplicate, archive, restore, delete runs
- Delete uses ConfirmDialog — no window.confirm
- Mark Completed / Mark Failed / Mark Validated actions
- Search across title, description, run number, tags, snapshot content
- Filters: type, status, priority, linked project, archived, pinned, needs fix, safe to continue
- 6 sort modes: newest, oldest, run number, priority, status, project
- Stats bar: total, completed, failed, blocked, in progress, needs review, validated, safe to continue

### Run Form (6-tab)
- Core: title, run number, type, status, priority, description, tags
- Scope: summary, allowed work, forbidden work, files expected, files touched
- Snapshot: paste/copy prompt snapshot — text data only, never executed
- Outcome: summary, files created/updated, known limitations, next action, result notes
- Links: linked project, prompt, error
- Flags: pinned, blocking, needs fix, needs review, caused regression, safe to continue, archived

### Run Detail
- 9 sections: overview, management tabs, scope, prompt snapshot, outcome, linked records, tags, flags, record
- Management tabs: Checkpoints | Validation | Timeline
- JSON export with secret stripping
- Snapshot masking for secret-like content
- Mark Completed / Failed / Validated / Archive / Delete all from detail

### Checkpoint Panel
- Add/edit/delete checkpoints
- Set status: pending, in progress, passed, failed, skipped
- Notes per checkpoint
- Progress bar (passed/total)
- All mutations through storage.js SSOT only

### Validation Panel
- Add/delete validation items
- Mark each: not tested, passed, failed, warning
- Notes per item
- Auto-calculate overall result from checklist
- Manual override of overall result
- Auto-generate default checklist by run type
- All mutations through storage.js SSOT only

### Run Timeline
- Chronological local-only timeline
- Events: created, checkpoints, validation checked, completed/failed/validated, updated
- No external logs — derived from run data only

### Import / Export
- Export run as JSON (secrets stripped)
- Import run from JSON (secrets auto-redacted, new ID if duplicate)
- Warning if secret-like content detected
- Content stored as data only — never executed

### Cross-linking (Run 5 additions)
- ProjectDetail: linked runs count, completed count, failed count, latest run status
- PromptDetail: linked runs, runs using this prompt as snapshot
- ErrorDetail: linked runs, fix run count, latest run result
- Dashboard: Run History stats row (total, completed, failed, blocked, validated, safe to continue)
- Settings: full run stats section

### Seed Data (4 demo runs)
1. Run 1 — Foundation Shell: build, completed, validation passed, safe to continue
2. Run 2 — Project Registry: build, completed, validation passed, safe to continue
3. Run 3 — Prompt Vault: build, completed, validation passed, safe to continue
4. Run 4 — Error Centre: build, completed, validation partial, safe to continue

---

## File Structure (Run 5 additions)

```
src/
  components/
    RunCard.jsx              ← Run list card with all actions + checkpoint progress
    RunForm.jsx              ← 6-tab create/edit form
    RunDetail.jsx            ← Full detail with 3-tab management panel
    RunFilters.jsx           ← Filter/search/sort bar
    RunCheckpointPanel.jsx   ← Checkpoint CRUD + status management
    RunValidationPanel.jsx   ← Validation checklist + auto-generate + result
    RunTimeline.jsx          ← Local-only chronological timeline
    RunImportExportPanel.jsx ← JSON import/export with secret handling
    AppShell.jsx             ← Updated: Runs page registered
    StatusBadge.jsx          ← Updated: all run/validation/checkpoint statuses
  core/
    runUtils.js              ← All run business logic (20+ functions)
    storage.js               ← Updated: 16 new run helpers + _registerRunUtils
    constants.js             ← Updated: PAGES (runs added), MODULES (run-history unlocked),
                                RUN_TYPES, RUN_STATUSES, RUN_VALIDATION_RESULTS,
                                RUN_CHECKPOINT_STATUSES, RUN_SORT_MODES
    validators.js            ← Updated: all run validators (15 functions)
  pages/
    Runs.jsx                 ← Full Run History page (list, form, detail views)
    Dashboard.jsx            ← Updated: Run History stats row
    Settings.jsx             ← Updated: run stats section
    Projects.jsx             ← Updated: passes allRuns to ProjectDetail
    Prompts.jsx              ← Updated: passes allRuns to PromptDetail
    Errors.jsx               ← Updated: passes allRuns to ErrorDetail
  data/
    seedData.js              ← Updated: 4 demo runs added
  styles/
    global.css               ← Updated: Run 5 styles + badge-purple
  App.jsx                    ← Updated: _registerRunUtils bridge
```

---

## Architecture

```
Single Source of Truth: /src/core/storage.js  (key: ap3x_ssot_v1)
All state mutations:    addRun/updateRun/deleteRun/archiveRunById etc.
Run utils bridge:       _registerRunUtils() (registered in App.jsx)
No Redux. No Zustand. No backend. No Supabase in Runs 1–5.
Prompt snapshots:       Text data only — never executed, evaluated, or sent anywhere.
```

---

## Stack

| Layer     | Technology                            |
|-----------|---------------------------------------|
| Framework | React 18                              |
| Bundler   | Vite 5                                |
| Storage   | localStorage (SSOT)                   |
| Styling   | Pure CSS custom properties            |
| PWA       | Web App Manifest                      |
| Deploy    | Static (Netlify / Vercel / Pages)     |

---

## Setup

```bash
npm install
npm run dev      # Dev server → http://localhost:3000
npm run build    # Production build → /dist
npm run preview  # Preview production build
```

---

## Secret Handling

Secret fields stripped on export/import:
`apiKey`, `api_key`, `token`, `secret`, `password`, `privateKey`, `accessToken`,
`refreshToken`, `clientSecret`, `authorization`, `x-api-key`

Secret content detected and masked in prompt snapshots (14 terms):
`apiKey`, `API_KEY`, `accessToken`, `refreshToken`, `bearer`, `sk-`,
`supabase service role`, `VITE_`, `.env`, `password`, `secret`, etc.

Prompt snapshots are stored as data only. Never executed.

---

## RLS Status

**RLS STATUS: NOT APPLICABLE — no Supabase or database created in Runs 1–5.**
Row-Level Security will be configured when Supabase is integrated in Run 8.

---

## Validation Report (Run 5)

✅ 1. App loads  
✅ 2. Runs 1–4 (Dashboard, Projects, Prompts, Errors) still work  
✅ 3. Sidebar navigation — Runs page added  
✅ 4. Run History opens with stats and filter bar  
✅ 5. Add / Edit / Duplicate / Archive / Restore / Delete run — all working  
✅ 6. Delete uses ConfirmDialog — no window.confirm  
✅ 7. Mark Completed / Failed / Validated — status tracking correct  
✅ 8. Search, 7 filters, 6 sort modes  
✅ 9. Checkpoints can be added / updated / deleted — all statuses  
✅ 10. Validation checklist: add, mark, delete, auto-generate, override result  
✅ 11. Run detail — all sections  
✅ 12. Run timeline — chronological local events  
✅ 13. JSON import / export  
✅ 14. Secret fields removed on import  
✅ 15. Secret warning + masking in snapshots  
✅ 16. ProjectDetail shows linked runs  
✅ 17. PromptDetail shows linked runs  
✅ 18. ErrorDetail shows linked runs  
✅ 19. Dashboard Run History stats row  
✅ 20. Settings run count section  
✅ 21. State persists after refresh  
✅ 22. All mutations through storage.js  
✅ 23. No direct localStorage outside storage.js  
✅ 24. No Supabase, GitHub, Vercel, OpenAI, backend, auth, or future-run code  
✅ 25. **Build succeeds — 84 modules, 0 errors, 0 warnings**

---

*AP3X BUILD CONTROL OS™ — Built with SSOT discipline. Run 5 complete.*

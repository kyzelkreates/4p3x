// ============================================================
// AP3X — Runs Page (Run History)
// /src/pages/Runs.jsx — Run 5
// ============================================================

import { useState } from "react";
import EmptyState           from "../components/EmptyState.jsx";
import StatCard             from "../components/StatCard.jsx";
import RunCard              from "../components/RunCard.jsx";
import RunForm              from "../components/RunForm.jsx";
import RunDetail            from "../components/RunDetail.jsx";
import RunFilters           from "../components/RunFilters.jsx";
import RunImportExportPanel from "../components/RunImportExportPanel.jsx";
import ConfirmDialog        from "../components/ConfirmDialog.jsx";
import {
  archiveRunById, restoreRunById, deleteRun,
  duplicateRunById, markRunCompleted, markRunFailed,
  markRunValidated, seedInitialState,
  createRunFromPromptId,
} from "../core/storage.js";
import {
  calculateRunStats, filterRuns, searchRuns, sortRuns,
} from "../core/runUtils.js";

const DEFAULT_FILTERS = {
  search:"", type:"all", status:"all", priority:"all",
  linkedProjectId:"all", linkedPromptId:"all", linkedErrorId:"all",
  showArchived:false, pinnedOnly:false, needsFixOnly:false, safeOnly:false,
  sortMode:"newest",
};

export default function Runs({ state }) {
  const { runs, projects, prompts, errors } = state;

  const [view,          setView]          = useState("list");
  const [editingRun,    setEditingRun]    = useState(null);
  const [selectedRun,   setSelectedRun]   = useState(null);
  const [filters,       setFilters]       = useState(DEFAULT_FILTERS);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showImport,    setShowImport]    = useState(false);

  // Derived
  const stats    = calculateRunStats(runs || []);
  const searched = searchRuns(runs || [], filters.search);
  const filtered = filterRuns(searched, filters);
  const sorted   = sortRuns(filtered, filters.sortMode);

  function getName(arr, id) {
    if (!id) return null;
    const f = (arr||[]).find((x) => x.id === id);
    return f ? (f.name || f.title || null) : null;
  }

  // Navigation
  function openCreate()   { setEditingRun(null); setView("form"); }
  function openEdit(run)  { setEditingRun(run);  setView("form"); }
  function openDetail(run){ setSelectedRun(run); setView("detail"); }

  function handleFormSaved()  { setView("list"); setEditingRun(null); }
  function handleFormCancel() { setView(editingRun ? "detail" : "list"); }

  // Actions
  function handleArchive(run)   { archiveRunById(run.id); }
  function handleRestore(run)   { restoreRunById(run.id); }
  function handleDuplicate(run) { duplicateRunById(run.id); }
  function handleComplete(run)  { markRunCompleted(run.id, {}); }
  function handleFail(run)      { markRunFailed(run.id, ""); }
  function handleValidate(run)  { markRunValidated(run.id, run.validation?.result || "passed"); }
  function handleDeleteRequest(run) { setConfirmDelete(run); }
  function handleDeleteConfirm() {
    if (confirmDelete) {
      deleteRun(confirmDelete.id);
      if (view === "detail" && selectedRun?.id === confirmDelete.id) setView("list");
    }
    setConfirmDelete(null);
  }

  // Live-update selected
  const liveSelectedRun = selectedRun
    ? (runs||[]).find((r) => r.id === selectedRun.id) || selectedRun
    : null;

  // ── FORM ─────────────────────────────────────────────────────
  if (view === "form") {
    return (
      <div>
        <div className="page-header">
          <div className="page-title">{editingRun ? `Editing — ${editingRun.title}` : "New Run"}</div>
          <div className="page-subtitle">
            {editingRun
              ? "Update this run record. All fields save through storage.js SSOT."
              : "Capture a new build, fix, or prompt run. Snapshots are stored as data only — never executed."}
          </div>
        </div>
        <div className="panel">
          <RunForm
            existingRun={editingRun}
            projects={projects || []}
            prompts={prompts   || []}
            errors={errors     || []}
            onSaved={handleFormSaved}
            onCancel={handleFormCancel}
          />
        </div>
      </div>
    );
  }

  // ── DETAIL ───────────────────────────────────────────────────
  if (view === "detail" && liveSelectedRun) {
    return (
      <RunDetail
        run={liveSelectedRun}
        allRuns={runs     || []}
        projects={projects || []}
        prompts={prompts   || []}
        errors={errors     || []}
        onEdit={openEdit}
        onBack={() => setView("list")}
        onDeleted={() => setView("list")}
      />
    );
  }

  // ── LIST ─────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
          <div>
            <div className="page-title">Run History</div>
            <div className="page-subtitle">
              Track every build, fix, refactor, validation, and checkpoint across AP3X projects.
            </div>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowImport((v) => !v)}>
              {showImport ? "↑ Hide Import" : "↓ Import Run"}
            </button>
            <button className="btn btn-primary" onClick={openCreate}>+ New Run</button>
          </div>
        </div>
      </div>

      {/* Inline import */}
      {showImport && (
        <div style={{ marginBottom:20 }}>
          <RunImportExportPanel
            allRuns={runs || []}
            onImported={() => setShowImport(false)}
            onClose={() => setShowImport(false)}
          />
        </div>
      )}

      {/* Stats */}
      <div className="section">
        <div className="grid-stats">
          <StatCard label="Total"          value={stats.total}          variant="accent" />
          <StatCard label="Completed"      value={stats.completed}      variant="success" />
          <StatCard label="Failed"         value={stats.failed}         variant={stats.failed   > 0 ? "danger"  : ""} />
          <StatCard label="Blocked"        value={stats.blocked}        variant={stats.blocked  > 0 ? "danger"  : ""} />
          <StatCard label="In Progress"    value={stats.inProgress}     variant="accent" />
          <StatCard label="Needs Review"   value={stats.needsReview}    variant={stats.needsReview > 0 ? "warning" : ""} />
          <StatCard label="Validated"      value={stats.validated}      variant="success" />
          <StatCard label="Safe to Continue" value={stats.safeToContinue} variant="success" />
        </div>
      </div>

      {/* Filters */}
      <div className="section">
        <RunFilters
          filters={filters}
          projects={projects || []}
          prompts={prompts   || []}
          errors={errors     || []}
          onChange={setFilters}
        />
      </div>

      {/* Grid */}
      {(runs||[]).length === 0 ? (
        <div className="panel" style={{ padding:0 }}>
          <EmptyState icon="◷"
            title="Run History is empty"
            desc="Add your first run, import a run JSON, or seed demo runs to get started."
            action={
              <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                <button className="btn btn-primary" onClick={openCreate}>+ Add First Run</button>
                <button className="btn btn-ghost"   onClick={() => setShowImport(true)}>↓ Import Run JSON</button>
                <button className="btn btn-ghost"   onClick={seedInitialState}>⬡ Seed Demo Runs</button>
              </div>
            }
          />
        </div>
      ) : sorted.length === 0 ? (
        <div className="panel" style={{ padding:0 }}>
          <EmptyState icon="◷"
            title="No runs match these filters"
            desc="Try adjusting your search or filters."
            action={<button className="btn btn-ghost" onClick={() => setFilters(DEFAULT_FILTERS)}>Clear Filters</button>}
          />
        </div>
      ) : (
        <div>
          <div className="section-label">
            {sorted.length} run{sorted.length !== 1 ? "s" : ""}
            {(filters.search || filters.type !== "all" || filters.status !== "all") ? " (filtered)" : ""}
          </div>
          <div className="grid-cards">
            {sorted.map((run) => (
              <RunCard
                key={run.id}
                run={run}
                linkedProjectName={getName(projects, run.linkedProjectId)}
                linkedPromptName={getName(prompts,   run.linkedPromptId)}
                linkedErrorName={getName(errors,     run.linkedErrorId)}
                onView={openDetail}
                onEdit={openEdit}
                onDuplicate={handleDuplicate}
                onMarkCompleted={handleComplete}
                onMarkFailed={handleFail}
                onMarkValidated={handleValidate}
                onArchive={handleArchive}
                onRestore={handleRestore}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop:20, padding:"10px 14px", background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.72rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
        Run 5 — Run History (local-first). Prompt snapshots are data only — never executed.
        All mutations through storage.js SSOT. RLS: NOT APPLICABLE.
      </div>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Run?" variant="danger"
        message={`Permanently delete "${confirmDelete?.title}"? This cannot be undone. Archive instead to preserve it.`}
        confirmLabel="Delete Permanently" cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

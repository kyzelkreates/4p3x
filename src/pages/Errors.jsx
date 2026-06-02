// ============================================================
// AP3X — Errors Page (Error Centre)
// /src/pages/Errors.jsx — Run 4 (full implementation)
// ============================================================

import { useState } from "react";
import EmptyState       from "../components/EmptyState.jsx";
import StatCard         from "../components/StatCard.jsx";
import ErrorCard        from "../components/ErrorCard.jsx";
import ErrorForm        from "../components/ErrorForm.jsx";
import ErrorDetail      from "../components/ErrorDetail.jsx";
import ErrorFilters     from "../components/ErrorFilters.jsx";
import ErrorImportPanel from "../components/ErrorImportPanel.jsx";
import ConfirmDialog    from "../components/ConfirmDialog.jsx";
import {
  archiveErrorById, restoreErrorById, deleteError,
  duplicateErrorById, markErrorFixed, markErrorReopened,
  seedInitialState,
} from "../core/storage.js";
import {
  calculateErrorStats, filterErrors, searchErrors, sortErrors,
} from "../core/errorUtils.js";

const DEFAULT_FILTERS = {
  search:"", category:"all", source:"all", severity:"all",
  status:"all", priority:"all", linkedProjectId:"all", linkedPromptId:"all",
  showArchived:false, pinnedOnly:false, blockersOnly:false, needsReview:false,
  sortMode:"newest",
};

// Views: "list" | "form" | "detail" | "import"
export default function Errors({ state }) {
  const { errors, projects, prompts, runs } = state;

  const [view,           setView]           = useState("list");
  const [editingError,   setEditingError]   = useState(null);
  const [selectedError,  setSelectedError]  = useState(null);
  const [filters,        setFilters]        = useState(DEFAULT_FILTERS);
  const [confirmDelete,  setConfirmDelete]  = useState(null);
  const [showImport,     setShowImport]     = useState(false);

  // ── Derived ─────────────────────────────────────────────────
  const stats    = calculateErrorStats(errors);
  const searched = searchErrors(errors, filters.search);
  const filtered = filterErrors(searched, filters);
  const sorted   = sortErrors(filtered, filters.sortMode);

  function getProjectName(id) {
    if (!id) return null;
    const p = (projects || []).find((x) => x.id === id);
    return p ? p.name : null;
  }

  // ── Navigation ───────────────────────────────────────────────
  function openCreate()      { setEditingError(null); setView("form"); }
  function openEdit(error)   { setEditingError(error); setView("form"); }
  function openDetail(error) { setSelectedError(error); setView("detail"); }

  function handleFormSaved()  { setView("list"); setEditingError(null); }
  function handleFormCancel() { setView(editingError ? "detail" : "list"); }

  // ── Actions ──────────────────────────────────────────────────
  function handleArchive(error)    { archiveErrorById(error.id); }
  function handleRestore(error)    { restoreErrorById(error.id); }
  function handleDuplicate(error)  { duplicateErrorById(error.id); }
  function handleMarkFixed(error)  { markErrorFixed(error.id, ""); }
  function handleReopen(error)     { markErrorReopened(error.id, ""); }
  function handleDeleteRequest(e)  { setConfirmDelete(e); }
  function handleDeleteConfirm()   {
    if (confirmDelete) {
      deleteError(confirmDelete.id);
      if (view === "detail" && selectedError?.id === confirmDelete.id) setView("list");
    }
    setConfirmDelete(null);
  }

  // Live-update selected from state
  const liveSelectedError = selectedError
    ? errors.find((e) => e.id === selectedError.id) || selectedError
    : null;

  // ── FORM ────────────────────────────────────────────────────
  if (view === "form") {
    return (
      <div>
        <div className="page-header">
          <div className="page-title">{editingError ? `Editing — ${editingError.title}` : "New Error"}</div>
          <div className="page-subtitle">
            {editingError
              ? "Update this error record. All fields save through storage.js SSOT."
              : "Capture a new error. Logs are stored as data only — never executed."}
          </div>
        </div>
        <div className="panel">
          <ErrorForm
            existingError={editingError}
            projects={projects || []}
            prompts={prompts || []}
            onSaved={handleFormSaved}
            onCancel={handleFormCancel}
          />
        </div>
      </div>
    );
  }

  // ── DETAIL ───────────────────────────────────────────────────
  if (view === "detail" && liveSelectedError) {
    return (
      <ErrorDetail
        error={liveSelectedError}
        allErrors={errors}
        projects={projects || []}
        prompts={prompts   || []}
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
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
          <div>
            <div className="page-title">Error Centre</div>
            <div className="page-subtitle">
              Capture, classify, triage, and link build failures across every AP3X project.
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowImport((v) => !v)}>
              {showImport ? "↑ Hide Import" : "↓ Import"}
            </button>
            <button className="btn btn-primary" onClick={openCreate}>+ New Error</button>
          </div>
        </div>
      </div>

      {/* Inline import panel */}
      {showImport && (
        <div style={{marginBottom:20}}>
          <ErrorImportPanel
            allErrors={errors}
            projects={projects || []}
            onImported={() => setShowImport(false)}
            onClose={() => setShowImport(false)}
          />
        </div>
      )}

      {/* Stats */}
      <div className="section">
        <div className="grid-stats">
          <StatCard label="Total"      value={stats.total}              variant="accent" />
          <StatCard label="Open"       value={stats.open}               variant={stats.open > 0 ? "danger" : ""} />
          <StatCard label="Critical"   value={stats.critical}           variant={stats.critical > 0 ? "critical" : ""} />
          <StatCard label="High"       value={stats.high}               variant={stats.high > 0 ? "danger" : ""} />
          <StatCard label="Fixed"      value={stats.fixed}              variant="success" />
          <StatCard label="Blockers"   value={stats.deploymentBlockers} variant={stats.deploymentBlockers > 0 ? "critical" : ""} />
          <StatCard label="Archived"   value={stats.archived}           variant={stats.archived > 0 ? "warning" : ""} />
        </div>
      </div>

      {/* Filters */}
      <div className="section">
        <ErrorFilters filters={filters} projects={projects || []} onChange={setFilters} />
      </div>

      {/* Grid */}
      {errors.length === 0 ? (
        <div className="panel" style={{padding:0}}>
          <EmptyState icon="⚠"
            title="Error Centre is empty"
            desc="Add your first error, import a raw log, or seed demo errors to get started."
            action={
              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                <button className="btn btn-primary"  onClick={openCreate}>+ Add First Error</button>
                <button className="btn btn-ghost" onClick={() => setShowImport(true)}>↓ Import Log</button>
                <button className="btn btn-ghost" onClick={seedInitialState}>⬡ Seed Demo Errors</button>
              </div>
            }
          />
        </div>
      ) : sorted.length === 0 ? (
        <div className="panel" style={{padding:0}}>
          <EmptyState icon="⚠"
            title="No errors match these filters"
            desc="Try adjusting search or filters."
            action={<button className="btn btn-ghost" onClick={() => setFilters(DEFAULT_FILTERS)}>Clear Filters</button>}
          />
        </div>
      ) : (
        <div>
          <div className="section-label">
            {sorted.length} error{sorted.length !== 1 ? "s" : ""}
            {(filters.search || filters.severity !== "all" || filters.status !== "all") ? " (filtered)" : ""}
          </div>
          <div className="grid-cards">
            {sorted.map((error) => (
              <ErrorCard
                key={error.id}
                error={error}
                linkedProjectName={getProjectName(error.linkedProjectId)}
                onView={openDetail}
                onEdit={openEdit}
                onDuplicate={handleDuplicate}
                onMarkFixed={handleMarkFixed}
                onReopen={handleReopen}
                onArchive={handleArchive}
                onRestore={handleRestore}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{marginTop:20,padding:"10px 14px",background:"rgba(0,229,255,0.03)",border:"1px solid var(--border2)",borderRadius:"var(--radius)",fontSize:"0.72rem",color:"var(--muted)",fontFamily:"var(--font-mono)"}}>
        Run 4 — Error Centre (local-first). Classifier is local-only and deterministic. No AI calls made.
        Logs stored as data only — never executed. All mutations through storage.js SSOT. RLS: N/A.
      </div>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Error?" variant="danger"
        message={`Permanently delete "${confirmDelete?.title}"? This cannot be undone. Consider archiving instead.`}
        confirmLabel="Delete Permanently" cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

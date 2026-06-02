// ============================================================
// AP3X — Prompts Page (Full Prompt Vault)
// /src/pages/Prompts.jsx — Run 3
// ============================================================

import { useState } from "react";
import EmptyState               from "../components/EmptyState.jsx";
import StatCard                 from "../components/StatCard.jsx";
import PromptCard               from "../components/PromptCard.jsx";
import PromptForm               from "../components/PromptForm.jsx";
import PromptDetail             from "../components/PromptDetail.jsx";
import PromptFilters            from "../components/PromptFilters.jsx";
import PromptImportExportPanel  from "../components/PromptImportExportPanel.jsx";
import ConfirmDialog            from "../components/ConfirmDialog.jsx";
import {
  archivePromptById, restorePromptById, deletePrompt,
  duplicatePromptById, seedInitialState,
} from "../core/storage.js";
import {
  calculatePromptStats, filterPrompts, searchPrompts, sortPrompts,
} from "../core/promptUtils.js";

const DEFAULT_FILTERS = {
  search:          "",
  type:            "all",
  category:        "all",
  status:          "all",
  priority:        "all",
  linkedProjectId: "all",
  showArchived:    false,
  pinnedOnly:      false,
  favouritesOnly:  false,
  sortMode:        "newest",
};

// View modes: "list" | "form" | "detail" | "import"
export default function Prompts({ state }) {
  const { prompts, projects } = state;
  // errors available from state for cross-linking

  const [view,            setView]            = useState("list");
  const [editingPrompt,   setEditingPrompt]   = useState(null);
  const [selectedPrompt,  setSelectedPrompt]  = useState(null);
  const [filters,         setFilters]         = useState(DEFAULT_FILTERS);
  const [confirmDelete,   setConfirmDelete]   = useState(null);

  // ── Derived data ──────────────────────────────────────────
  const stats    = calculatePromptStats(prompts);
  const searched = searchPrompts(prompts, filters.search);
  const filtered = filterPrompts(searched, filters);
  const sorted   = sortPrompts(filtered, filters.sortMode);

  // Lookup helper for linked project name
  function getProjectName(id) {
    if (!id) return null;
    const p = (projects || []).find((x) => x.id === id);
    return p ? p.name : null;
  }

  // ── Navigation ────────────────────────────────────────────
  function openCreate()       { setEditingPrompt(null); setView("form"); }
  function openEdit(prompt)   { setEditingPrompt(prompt); setView("form"); }
  function openDetail(prompt) { setSelectedPrompt(prompt); setView("detail"); }

  function handleFormSaved()  { setView("list"); setEditingPrompt(null); }
  function handleFormCancel() { setView(editingPrompt ? "detail" : "list"); }

  // ── Actions ───────────────────────────────────────────────
  function handleArchive(prompt)   { archivePromptById(prompt.id); }
  function handleRestore(prompt)   { restorePromptById(prompt.id); }
  function handleDuplicate(prompt) { duplicatePromptById(prompt.id); }
  function handleDeleteRequest(prompt) { setConfirmDelete(prompt); }
  function handleDeleteConfirm() {
    if (confirmDelete) {
      deletePrompt(confirmDelete.id);
      if (view === "detail" && selectedPrompt?.id === confirmDelete.id) setView("list");
    }
    setConfirmDelete(null);
  }

  // Live-updated selected prompt from state
  const liveSelectedPrompt = selectedPrompt
    ? prompts.find((p) => p.id === selectedPrompt.id) || selectedPrompt
    : null;

  // ── FORM VIEW ─────────────────────────────────────────────
  if (view === "form") {
    return (
      <div>
        <div className="page-header">
          <div className="page-title">
            {editingPrompt ? `Editing — ${editingPrompt.title}` : "New Prompt"}
          </div>
          <div className="page-subtitle">
            {editingPrompt
              ? "Update this prompt. Editing content creates a new version automatically."
              : "Add a new prompt to the vault. All fields save locally through storage.js."}
          </div>
        </div>
        <div className="panel">
          <PromptForm
            existingPrompt={editingPrompt}
            projects={projects || []}
            onSaved={handleFormSaved}
            onCancel={handleFormCancel}
          />
        </div>
      </div>
    );
  }

  // ── DETAIL VIEW ───────────────────────────────────────────
  if (view === "detail" && liveSelectedPrompt) {
    return (
      <PromptDetail
        prompt={liveSelectedPrompt}
        allErrors={state.errors || []}
        allRuns={state.runs || []}
        allPrompts={prompts}
        projects={projects || []}
        onEdit={openEdit}
        onBack={() => setView("list")}
        onDeleted={() => setView("list")}
      />
    );
  }

  // ── IMPORT VIEW ───────────────────────────────────────────
  if (view === "import") {
    return (
      <div>
        <div className="page-header">
          <div className="page-title">Import Prompt</div>
          <div className="page-subtitle">
            Import a prompt from pasted JSON or plain text.
          </div>
        </div>
        <div className="panel">
          <PromptImportExportPanel
            allPrompts={prompts}
            onImported={() => setView("list")}
            onClose={() => setView("list")}
          />
        </div>
      </div>
    );
  }

  // ── LIST VIEW ─────────────────────────────────────────────
  return (
    <div>
      {/* ── Header ── */}
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="page-title">Prompt Vault</div>
            <div className="page-subtitle">
              Store, version, copy, validate, and reuse build prompts across every AP3X project.
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setView("import")}>
              ↓ Import
            </button>
            <button className="btn btn-primary" onClick={openCreate}>
              + New Prompt
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="section">
        <div className="grid-stats">
          <StatCard label="Total"        value={stats.total}         variant="accent" />
          <StatCard label="Ready"        value={stats.ready}         variant="accent" />
          <StatCard label="Successful"   value={stats.successful}    variant="success" />
          <StatCard label="Failed"       value={stats.failed}        variant={stats.failed > 0 ? "danger" : ""} />
          <StatCard label="Master"       value={stats.master}        variant="purple" />
          <StatCard label="Archived"     value={stats.archived}      variant={stats.archived > 0 ? "warning" : ""} />
          <StatCard
            label="Avg Safety"
            value={`${stats.avgSafety}/100`}
            variant={stats.avgSafety >= 80 ? "success" : stats.avgSafety >= 50 ? "warning" : "danger"}
          />
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="section">
        <PromptFilters
          filters={filters}
          projects={projects || []}
          onChange={setFilters}
        />
      </div>

      {/* ── Grid ── */}
      {prompts.length === 0 ? (
        <div className="panel" style={{ padding: 0 }}>
          <EmptyState
            icon="◎"
            title="Prompt Vault is empty"
            desc="Store your first prompt or seed demo data to get started."
            action={
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={openCreate}>+ Add First Prompt</button>
                <button className="btn btn-ghost" onClick={seedInitialState}>⬡ Seed Demo Prompts</button>
              </div>
            }
          />
        </div>
      ) : sorted.length === 0 ? (
        <div className="panel" style={{ padding: 0 }}>
          <EmptyState
            icon="◎"
            title="No prompts match these filters"
            desc="Try adjusting the search or filter options."
            action={
              <button className="btn btn-ghost" onClick={() => setFilters(DEFAULT_FILTERS)}>
                Clear Filters
              </button>
            }
          />
        </div>
      ) : (
        <div>
          <div className="section-label">
            {sorted.length} prompt{sorted.length !== 1 ? "s" : ""}
            {filters.search || filters.type !== "all" || filters.status !== "all"
              ? " (filtered)" : ""}
          </div>
          <div className="grid-cards">
            {sorted.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                linkedProjectName={getProjectName(prompt.linkedProjectId)}
                onView={openDetail}
                onEdit={openEdit}
                onCopy={(p) => openDetail(p)}
                onDuplicate={handleDuplicate}
                onArchive={handleArchive}
                onRestore={handleRestore}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{
        marginTop: 20, padding: "10px 14px",
        background: "rgba(0,229,255,0.03)", border: "1px solid var(--border2)",
        borderRadius: "var(--radius)", fontSize: "0.72rem", color: "var(--muted)",
        fontFamily: "var(--font-mono)",
      }}>
        Run 3 — Prompt Vault (local-first). Safety analysis is local-only. No AI calls made. Content not executed.
        All mutations through storage.js SSOT. RLS: N/A.
      </div>

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Prompt?"
        message={`Permanently delete "${confirmDelete?.title}"? This cannot be undone. Consider archiving instead.`}
        confirmLabel="Delete Permanently" cancelLabel="Cancel" variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

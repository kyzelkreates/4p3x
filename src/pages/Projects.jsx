// ============================================================
// AP3X — Projects Page (Full Project Registry)
// /src/pages/Projects.jsx — Run 2
// ============================================================

import { useState } from "react";
import EmptyState              from "../components/EmptyState.jsx";
import ProjectCard             from "../components/ProjectCard.jsx";
import ProjectForm             from "../components/ProjectForm.jsx";
import ProjectDetail           from "../components/ProjectDetail.jsx";
import ProjectFilters          from "../components/ProjectFilters.jsx";
import JsonImportExportPanel   from "../components/JsonImportExportPanel.jsx";
import ConfirmDialog           from "../components/ConfirmDialog.jsx";
import StatCard                from "../components/StatCard.jsx";
import {
  archiveProjectById, restoreProjectById, deleteProject,
  duplicateProject, seedInitialState,
} from "../core/storage.js";
import {
  calculateProjectStats, filterProjects, searchProjects, sortProjects,
} from "../core/projectUtils.js";

const DEFAULT_FILTERS = {
  search:       "",
  status:       "all",
  type:         "all",
  priority:     "all",
  showArchived: false,
  sortMode:     "newest",
};

// ── View modes ────────────────────────────────────────────────
// "list"   — project grid
// "form"   — create/edit form
// "detail" — project detail view
// "import" — JSON import panel

export default function Projects({ state }) {
  const { projects } = state;

  const [view,            setView]            = useState("list"); // "list"|"form"|"detail"|"import"
  const [editingProject,  setEditingProject]  = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filters,         setFilters]         = useState(DEFAULT_FILTERS);
  const [confirmDelete,   setConfirmDelete]   = useState(null); // project to delete

  // ── Derived data ──
  const stats    = calculateProjectStats(projects);
  const searched = searchProjects(projects, filters.search);
  const filtered = filterProjects(searched, filters);
  const sorted   = sortProjects(filtered, filters.sortMode);

  // ── Handlers ──
  function openCreate() {
    setEditingProject(null);
    setView("form");
  }

  function openEdit(project) {
    setEditingProject(project);
    setView("form");
  }

  function openDetail(project) {
    setSelectedProject(project);
    setView("detail");
  }

  function handleFormSaved() {
    setView("list");
    setEditingProject(null);
  }

  function handleFormCancel() {
    setView(editingProject ? "detail" : "list");
    if (!editingProject) setEditingProject(null);
  }

  function handleArchive(project) {
    archiveProjectById(project.id);
  }

  function handleRestore(project) {
    restoreProjectById(project.id);
  }

  function handleDuplicate(project) {
    duplicateProject(project.id);
  }

  function handleDeleteRequest(project) {
    setConfirmDelete(project);
  }

  function handleDeleteConfirm() {
    if (confirmDelete) {
      deleteProject(confirmDelete.id);
      if (view === "detail" && selectedProject?.id === confirmDelete.id) {
        setView("list");
      }
    }
    setConfirmDelete(null);
  }

  // ── Live-update selected project from state ──
  const liveSelectedProject = selectedProject
    ? projects.find((p) => p.id === selectedProject.id) || selectedProject
    : null;

  // ────────────────────────────────────────────────────────────
  // FORM VIEW
  if (view === "form") {
    return (
      <div>
        <div className="page-header">
          <div className="page-title">
            {editingProject ? `Editing — ${editingProject.name}` : "New Project"}
          </div>
          <div className="page-subtitle">
            {editingProject
              ? "Update the project record. All fields save locally through storage.js."
              : "Create a new project in the local registry."}
          </div>
        </div>
        <div className="panel">
          <ProjectForm
            existingProject={editingProject}
            onSaved={handleFormSaved}
            onCancel={handleFormCancel}
          />
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────
  // DETAIL VIEW
  if (view === "detail" && liveSelectedProject) {
    return (
      <ProjectDetail
        project={liveSelectedProject}
        allProjects={projects}
        allPrompts={state.prompts || []}
        allErrors={state.errors || []}
        onEdit={openEdit}
        onBack={() => setView("list")}
        onDeleted={() => setView("list")}
      />
    );
  }

  // ────────────────────────────────────────────────────────────
  // IMPORT VIEW
  if (view === "import") {
    return (
      <div>
        <div className="page-header">
          <div className="page-title">Import Project</div>
          <div className="page-subtitle">Paste a project JSON object to import it into your registry.</div>
        </div>
        <div className="panel">
          <JsonImportExportPanel
            allProjects={projects}
            onImported={() => setView("list")}
            onClose={() => setView("list")}
          />
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────
  // LIST VIEW (default)
  return (
    <div>
      {/* ── Header ── */}
      <div className="page-header">
        <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="page-title">Project Registry</div>
            <div className="page-subtitle">
              Track every build, repo, demo, deployment, and SaaS idea in one local-first command centre.
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setView("import")}>
              ↓ Import JSON
            </button>
            <button className="btn btn-primary" onClick={openCreate}>
              + New Project
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="section">
        <div className="grid-stats">
          <StatCard label="Total"         value={stats.total}         variant="accent" />
          <StatCard label="Working"       value={stats.working}       variant="success" />
          <StatCard label="Broken"        value={stats.broken}        variant={stats.broken > 0 ? "danger" : ""} />
          <StatCard label="Deployed"      value={stats.deployed}      variant="success" />
          <StatCard label="Investor Ready"value={stats.investorReady} />
          <StatCard label="Archived"      value={stats.archived}      variant="warning" />
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="section">
        <ProjectFilters filters={filters} onChange={setFilters} />
      </div>

      {/* ── Project Grid ── */}
      {projects.length === 0 ? (
        <div className="panel" style={{ padding: 0 }}>
          <EmptyState
            icon="◈"
            title="No projects yet"
            desc="Create your first project or seed demo data to get started."
            action={
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={openCreate}>
                  + Add First Project
                </button>
                <button className="btn btn-ghost" onClick={seedInitialState}>
                  ⬡ Seed Demo Projects
                </button>
              </div>
            }
          />
        </div>
      ) : sorted.length === 0 ? (
        <div className="panel" style={{ padding: 0 }}>
          <EmptyState
            icon="◎"
            title="No projects match these filters"
            desc="Try adjusting the search or filters above."
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
            {sorted.length} project{sorted.length !== 1 ? "s" : ""}
            {filters.search || filters.status !== "all" || filters.type !== "all"
              ? " (filtered)" : ""}
          </div>
          <div className="grid-cards">
            {sorted.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                linkedErrors={(state.errors||[]).filter((e)=>e.linkedProjectId===project.id)}
                onView={openDetail}
                onEdit={openEdit}
                onDuplicate={handleDuplicate}
                onArchive={handleArchive}
                onRestore={handleRestore}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Info footer ── */}
      <div style={{
        marginTop: 20,
        padding: "10px 14px",
        background: "rgba(0,229,255,0.03)",
        border: "1px solid var(--border2)",
        borderRadius: "var(--radius)",
        fontSize: "0.72rem",
        color: "var(--muted)",
        fontFamily: "var(--font-mono)",
      }}>
        Run 2 — Project Registry (local-first). All mutations through storage.js SSOT.
        GitHub sync reserved for Run 8. RLS: N/A.
      </div>

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Project?"
        message={`This will permanently delete "${confirmDelete?.name}". Consider archiving instead.`}
        confirmLabel="Delete Permanently"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

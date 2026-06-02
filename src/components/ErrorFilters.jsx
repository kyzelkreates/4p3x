// ============================================================
// AP3X — ErrorFilters
// /src/components/ErrorFilters.jsx — Run 4
// ============================================================

import { ERROR_CATEGORIES, ERROR_SOURCES, ERROR_SEVERITIES, ERROR_STATUSES, ERROR_SORT_MODES, PROJECT_PRIORITIES } from "../core/constants.js";

export default function ErrorFilters({ filters, projects, prompts, onChange }) {
  function set(k, v) { onChange({ ...filters, [k]: v }); }
  function clearAll() {
    onChange({ search:"",category:"all",source:"all",severity:"all",status:"all",priority:"all",
      linkedProjectId:"all",linkedPromptId:"all",showArchived:false,pinnedOnly:false,
      blockersOnly:false,needsReview:false,sortMode:"newest" });
  }
  const isFiltered = filters.search || filters.category!=="all" || filters.source!=="all" ||
    filters.severity!=="all" || filters.status!=="all" || filters.priority!=="all" ||
    filters.linkedProjectId!=="all" || filters.showArchived || filters.pinnedOnly ||
    filters.blockersOnly || filters.needsReview;

  return (
    <div className="filter-bar">
      <div className="filter-search-wrap">
        <input className="filter-input" type="search" placeholder="Search errors…" value={filters.search}
          onChange={(e) => set("search", e.target.value)} aria-label="Search errors" />
      </div>

      <select className="filter-select" value={filters.severity} onChange={(e) => set("severity", e.target.value)} aria-label="Severity">
        <option value="all">All Severities</option>
        {ERROR_SEVERITIES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>

      <select className="filter-select" value={filters.status} onChange={(e) => set("status", e.target.value)} aria-label="Status">
        <option value="all">All Statuses</option>
        {ERROR_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>

      <select className="filter-select" value={filters.category} onChange={(e) => set("category", e.target.value)} aria-label="Category">
        <option value="all">All Categories</option>
        {ERROR_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
      </select>

      <select className="filter-select" value={filters.source} onChange={(e) => set("source", e.target.value)} aria-label="Source">
        <option value="all">All Sources</option>
        {ERROR_SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>

      <select className="filter-select" value={filters.priority} onChange={(e) => set("priority", e.target.value)} aria-label="Priority">
        <option value="all">All Priorities</option>
        {PROJECT_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
      </select>

      {projects?.length > 0 && (
        <select className="filter-select" value={filters.linkedProjectId} onChange={(e) => set("linkedProjectId", e.target.value)} aria-label="Project">
          <option value="all">All Projects</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      )}

      <select className="filter-select" value={filters.sortMode} onChange={(e) => set("sortMode", e.target.value)} aria-label="Sort">
        {ERROR_SORT_MODES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>

      <label className="filter-check-label" title="Show archived">
        <input type="checkbox" checked={!!filters.showArchived} onChange={(e) => set("showArchived", e.target.checked)} aria-label="Show archived" />
        <span>Archived</span>
      </label>
      <label className="filter-check-label" title="Pinned only">
        <input type="checkbox" checked={!!filters.pinnedOnly} onChange={(e) => set("pinnedOnly", e.target.checked)} aria-label="Pinned only" />
        <span>Pinned</span>
      </label>
      <label className="filter-check-label" title="Deployment blockers only">
        <input type="checkbox" checked={!!filters.blockersOnly} onChange={(e) => set("blockersOnly", e.target.checked)} aria-label="Blockers only" />
        <span>Blockers</span>
      </label>
      <label className="filter-check-label" title="Needs human review">
        <input type="checkbox" checked={!!filters.needsReview} onChange={(e) => set("needsReview", e.target.checked)} aria-label="Needs review" />
        <span>Review</span>
      </label>

      {isFiltered && <button className="btn btn-ghost btn-sm" onClick={clearAll} aria-label="Clear filters">✕ Clear</button>}
    </div>
  );
}

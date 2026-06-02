// ============================================================
// AP3X — RunFilters — Run 5
// /src/components/RunFilters.jsx
// ============================================================

import { RUN_TYPES, RUN_STATUSES, RUN_SORT_MODES, PROJECT_PRIORITIES } from "../core/constants.js";

export default function RunFilters({ filters, projects, prompts, errors, onChange }) {
  function set(k, v) { onChange({ ...filters, [k]: v }); }
  function clearAll() {
    onChange({
      search:"", type:"all", status:"all", priority:"all",
      linkedProjectId:"all", linkedPromptId:"all", linkedErrorId:"all",
      showArchived:false, pinnedOnly:false, needsFixOnly:false, safeOnly:false,
      sortMode:"newest",
    });
  }
  const isFiltered = filters.search || filters.type !== "all" || filters.status !== "all" ||
    filters.priority !== "all" || filters.linkedProjectId !== "all" ||
    filters.showArchived || filters.pinnedOnly || filters.needsFixOnly || filters.safeOnly;

  return (
    <div className="filter-bar">
      <div className="filter-search-wrap">
        <input className="filter-input" type="search" placeholder="Search runs…" value={filters.search}
          onChange={(e) => set("search", e.target.value)} aria-label="Search runs" />
      </div>

      <select className="filter-select" value={filters.type}   onChange={(e) => set("type",   e.target.value)} aria-label="Type">
        <option value="all">All Types</option>
        {RUN_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>

      <select className="filter-select" value={filters.status} onChange={(e) => set("status", e.target.value)} aria-label="Status">
        <option value="all">All Statuses</option>
        {RUN_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>

      <select className="filter-select" value={filters.priority} onChange={(e) => set("priority", e.target.value)} aria-label="Priority">
        <option value="all">All Priorities</option>
        {PROJECT_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
      </select>

      {(projects || []).length > 0 && (
        <select className="filter-select" value={filters.linkedProjectId} onChange={(e) => set("linkedProjectId", e.target.value)} aria-label="Project">
          <option value="all">All Projects</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      )}

      <select className="filter-select" value={filters.sortMode} onChange={(e) => set("sortMode", e.target.value)} aria-label="Sort">
        {RUN_SORT_MODES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>

      <label className="filter-check-label">
        <input type="checkbox" checked={!!filters.showArchived} onChange={(e) => set("showArchived", e.target.checked)} aria-label="Show archived" />
        <span>Archived</span>
      </label>
      <label className="filter-check-label">
        <input type="checkbox" checked={!!filters.pinnedOnly} onChange={(e) => set("pinnedOnly", e.target.checked)} aria-label="Pinned only" />
        <span>Pinned</span>
      </label>
      <label className="filter-check-label">
        <input type="checkbox" checked={!!filters.needsFixOnly} onChange={(e) => set("needsFixOnly", e.target.checked)} aria-label="Needs fix only" />
        <span>Needs Fix</span>
      </label>
      <label className="filter-check-label">
        <input type="checkbox" checked={!!filters.safeOnly} onChange={(e) => set("safeOnly", e.target.checked)} aria-label="Safe to continue only" />
        <span>Safe</span>
      </label>

      {isFiltered && (
        <button className="btn btn-ghost btn-sm" onClick={clearAll} aria-label="Clear all filters">✕ Clear</button>
      )}
    </div>
  );
}

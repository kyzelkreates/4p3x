// ============================================================
// AP3X — PromptFilters Component
// /src/components/PromptFilters.jsx — Run 3
// ============================================================

import {
  PROMPT_TYPES, PROMPT_CATEGORIES, PROMPT_STATUSES,
  PROMPT_PRIORITIES, PROMPT_SORT_MODES,
} from "../core/constants.js";

export default function PromptFilters({ filters, projects, onChange }) {
  function set(key, value) { onChange({ ...filters, [key]: value }); }

  function clearAll() {
    onChange({
      search: "", type: "all", category: "all", status: "all",
      priority: "all", linkedProjectId: "all",
      showArchived: false, pinnedOnly: false, favouritesOnly: false,
      sortMode: "newest",
    });
  }

  const isFiltered =
    filters.search || filters.type !== "all" || filters.category !== "all" ||
    filters.status !== "all" || filters.priority !== "all" ||
    filters.linkedProjectId !== "all" || filters.showArchived ||
    filters.pinnedOnly || filters.favouritesOnly;

  return (
    <div className="filter-bar">
      {/* Search */}
      <div className="filter-search-wrap">
        <input
          className="filter-input"
          type="search"
          placeholder="Search prompts…"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          aria-label="Search prompts"
        />
      </div>

      {/* Type */}
      <select className="filter-select" value={filters.type} onChange={(e) => set("type", e.target.value)} aria-label="Filter by type">
        <option value="all">All Types</option>
        {PROMPT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>

      {/* Category */}
      <select className="filter-select" value={filters.category} onChange={(e) => set("category", e.target.value)} aria-label="Filter by category">
        <option value="all">All Categories</option>
        {PROMPT_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
      </select>

      {/* Status */}
      <select className="filter-select" value={filters.status} onChange={(e) => set("status", e.target.value)} aria-label="Filter by status">
        <option value="all">All Statuses</option>
        {PROMPT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>

      {/* Priority */}
      <select className="filter-select" value={filters.priority} onChange={(e) => set("priority", e.target.value)} aria-label="Filter by priority">
        <option value="all">All Priorities</option>
        {PROMPT_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
      </select>

      {/* Linked project */}
      {projects?.length > 0 && (
        <select className="filter-select" value={filters.linkedProjectId}
          onChange={(e) => set("linkedProjectId", e.target.value)} aria-label="Filter by linked project">
          <option value="all">All Projects</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      )}

      {/* Sort */}
      <select className="filter-select" value={filters.sortMode} onChange={(e) => set("sortMode", e.target.value)} aria-label="Sort prompts">
        {PROMPT_SORT_MODES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>

      {/* Toggle checkboxes */}
      <label className="filter-check-label" title="Show archived prompts">
        <input type="checkbox" checked={!!filters.showArchived}
          onChange={(e) => set("showArchived", e.target.checked)} aria-label="Show archived" />
        <span>Archived</span>
      </label>
      <label className="filter-check-label" title="Pinned only">
        <input type="checkbox" checked={!!filters.pinnedOnly}
          onChange={(e) => set("pinnedOnly", e.target.checked)} aria-label="Pinned only" />
        <span>Pinned</span>
      </label>
      <label className="filter-check-label" title="Favourites only">
        <input type="checkbox" checked={!!filters.favouritesOnly}
          onChange={(e) => set("favouritesOnly", e.target.checked)} aria-label="Favourites only" />
        <span>Fav</span>
      </label>

      {/* Clear */}
      {isFiltered && (
        <button className="btn btn-ghost btn-sm" onClick={clearAll}>✕ Clear</button>
      )}
    </div>
  );
}

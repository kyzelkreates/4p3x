// ============================================================
// AP3X — ProjectFilters Component
// /src/components/ProjectFilters.jsx — Run 2
// ============================================================

import { PROJECT_STATUSES, PROJECT_TYPES, PROJECT_PRIORITIES, SORT_MODES } from "../core/constants.js";

export default function ProjectFilters({ filters, onChange }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  function clearAll() {
    onChange({
      search: "",
      status: "all",
      type: "all",
      priority: "all",
      showArchived: false,
      sortMode: "newest",
    });
  }

  const isFiltered =
    filters.search ||
    filters.status !== "all" ||
    filters.type !== "all" ||
    filters.priority !== "all" ||
    filters.showArchived;

  return (
    <div className="filter-bar">
      {/* Search */}
      <div className="filter-search-wrap">
        <input
          className="filter-input"
          type="search"
          placeholder="Search projects…"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          aria-label="Search projects"
        />
      </div>

      {/* Status */}
      <select
        className="filter-select"
        value={filters.status}
        onChange={(e) => set("status", e.target.value)}
        aria-label="Filter by status"
      >
        <option value="all">All Statuses</option>
        {PROJECT_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      {/* Type */}
      <select
        className="filter-select"
        value={filters.type}
        onChange={(e) => set("type", e.target.value)}
        aria-label="Filter by type"
      >
        <option value="all">All Types</option>
        {PROJECT_TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      {/* Priority */}
      <select
        className="filter-select"
        value={filters.priority}
        onChange={(e) => set("priority", e.target.value)}
        aria-label="Filter by priority"
      >
        <option value="all">All Priorities</option>
        {PROJECT_PRIORITIES.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        className="filter-select"
        value={filters.sortMode}
        onChange={(e) => set("sortMode", e.target.value)}
        aria-label="Sort projects"
      >
        {SORT_MODES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      {/* Toggle archived */}
      <label className="filter-check-label" title="Show archived projects">
        <input
          type="checkbox"
          checked={!!filters.showArchived}
          onChange={(e) => set("showArchived", e.target.checked)}
          aria-label="Show archived projects"
        />
        <span>Archived</span>
      </label>

      {/* Clear */}
      {isFiltered && (
        <button className="btn btn-ghost btn-sm" onClick={clearAll}>
          ✕ Clear
        </button>
      )}
    </div>
  );
}

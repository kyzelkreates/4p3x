// ============================================================
// AP3X — Sidebar Component
// /src/components/Sidebar.jsx
// ============================================================

import { PAGES, APP_NAME, CURRENT_RUN } from "../core/constants.js";
import { updateState } from "../core/storage.js";

export default function Sidebar({ activePage, collapsed, onToggleCollapse, mobileOpen }) {
  function navigate(pageId) {
    updateState("ui.activePage", pageId, "NAVIGATE_PAGE");
  }

  function toggleCollapse() {
    updateState("ui.sidebarCollapsed", !collapsed, "TOGGLE_SIDEBAR");
    if (onToggleCollapse) onToggleCollapse();
  }

  const sidebarClass = [
    "app-sidebar",
    collapsed ? "collapsed" : "",
    mobileOpen ? "mobile-open" : "",
  ].filter(Boolean).join(" ");

  return (
    <aside className={sidebarClass} aria-label="Main navigation">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-title">
          {collapsed ? "A3X" : "AP3X BUILD"}
        </div>
        {!collapsed && (
          <div className="sidebar-logo-sub">Control OS™</div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" aria-label="Pages">
        {PAGES.map((page) => (
          <div
            key={page.id}
            className={`nav-item ${activePage === page.id ? "active" : ""}`}
            onClick={() => navigate(page.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") navigate(page.id); }}
            aria-label={page.label}
            aria-current={activePage === page.id ? "page" : undefined}
          >
            <span className="nav-icon" aria-hidden="true">{page.icon}</span>
            <span className="nav-label">{page.label}</span>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="sidebar-collapse-btn" onClick={toggleCollapse} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") toggleCollapse(); }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <span>{collapsed ? "→" : "←"}</span>
        {!collapsed && <span style={{ fontSize: "0.72rem" }}>Collapse</span>}
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="sidebar-footer">
          Run {CURRENT_RUN} · Local-first
        </div>
      )}
    </aside>
  );
}

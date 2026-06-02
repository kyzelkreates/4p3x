// ============================================================
// AP3X — TopBar Component
// /src/components/TopBar.jsx
// ============================================================

import { APP_NAME, CURRENT_RUN } from "../core/constants.js";

export default function TopBar({ activePage, onMenuClick }) {
  const pageLabels = {
    dashboard: "Dashboard",
    projects:  "Project Registry",
    prompts:   "Prompt Vault",
    errors:    "Error Centre",
    agents:    "Agent Board",
    settings:  "Settings",
  };

  return (
    <header className="app-topbar" role="banner">
      {/* Mobile hamburger */}
      <button
        className="btn btn-ghost btn-sm"
        style={{ display: "none", padding: "5px 8px" }}
        id="mobile-menu-btn"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        ☰
      </button>

      <div className="topbar-title">
        AP3X<span style={{ color: "var(--muted)", margin: "0 4px" }}>›</span>
        <span style={{ color: "var(--text)", fontWeight: 500 }}>
          {pageLabels[activePage] || activePage}
        </span>
      </div>

      <div className="topbar-spacer" />

      <span className="badge badge-accent">◈ Run {CURRENT_RUN}</span>
      <span className="badge badge-purple">⬡ Local-First</span>
      <span className="badge badge-success">✓ SSOT</span>
    </header>
  );
}

// ============================================================
// AP3X — ModuleCard Component
// /src/components/ModuleCard.jsx — Updated Run 2
// ============================================================

import StatusBadge from "./StatusBadge.jsx";
import { updateState } from "../core/storage.js";

export default function ModuleCard({ module }) {
  const { title, description, locked, run, page, active = false } = module;

  function handleClick() {
    if (!locked && page) {
      updateState("ui.activePage", page, "NAVIGATE_PAGE");
    }
  }

  return (
    <div
      className={`module-card ${locked ? "module-card--locked" : ""}`}
      onClick={handleClick}
      role={!locked && page ? "button" : undefined}
      tabIndex={!locked && page ? 0 : undefined}
      onKeyDown={(e) => { if (e.key === "Enter") handleClick(); }}
      aria-label={locked ? `${title} — locked` : title}
    >
      <div className="module-card-title">{title}</div>
      <div className="module-card-desc">{description}</div>
      <div className="module-card-footer">
        {locked ? (
          <>
            <StatusBadge status="locked" label="Locked" />
            <span style={{ fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
              Run {run}
            </span>
          </>
        ) : active ? (
          <>
            <StatusBadge status="working" label="Active" />
            <span style={{ fontSize: "0.68rem", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
              Run {run} ↗
            </span>
          </>
        ) : (
          <>
            <StatusBadge status="working" label="Available" />
            <span style={{ fontSize: "0.68rem", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
              Run {run} ↗
            </span>
          </>
        )}
      </div>
      {locked && (
        <div style={{
          fontSize: "0.68rem",
          color: "var(--muted)",
          fontStyle: "italic",
          marginTop: 4,
        }}>
          Reserved for future run
        </div>
      )}
    </div>
  );
}

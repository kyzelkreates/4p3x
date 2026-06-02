// ============================================================
// AP3X — PromptVersionTimeline Component
// /src/components/PromptVersionTimeline.jsx — Run 3
// ============================================================

import { useState } from "react";
import { copyPromptToClipboard } from "../core/promptUtils.js";
import { createPromptVersionById } from "../core/storage.js";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function PromptVersionTimeline({ prompt }) {
  const versioning = prompt.versioning || { currentVersion: 1, versions: [] };
  const versions   = [...(versioning.versions || [])].reverse(); // newest first
  const [expanded, setExpanded] = useState(null);
  const [copyStatus, setCopyStatus] = useState({});

  async function handleCopyVersion(version) {
    const result = await copyPromptToClipboard(version.content);
    setCopyStatus((prev) => ({ ...prev, [version.version]: result.success ? "success" : "error" }));
    setTimeout(() => setCopyStatus((prev) => ({ ...prev, [version.version]: null })), 2500);
  }

  function handleRestoreVersion(version) {
    if (version.version === versioning.currentVersion) return;
    createPromptVersionById(prompt.id, version.content, `Restored from v${version.version}`);
  }

  if (versions.length === 0) {
    return (
      <div style={{ color: "var(--muted)", fontSize: "0.8rem", padding: "12px 0" }}>
        No version history available.
      </div>
    );
  }

  return (
    <div>
      {versions.map((v) => {
        const isCurrent = v.version === versioning.currentVersion;
        const isExpanded = expanded === v.version;

        return (
          <div
            key={v.version}
            style={{
              marginBottom: 12,
              padding: "12px 16px",
              background: isCurrent ? "rgba(0,229,255,0.04)" : "var(--panel2)",
              border: `1px solid ${isCurrent ? "rgba(0,229,255,0.2)" : "var(--border2)"}`,
              borderRadius: "var(--radius)",
            }}
          >
            {/* Version header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.82rem",
                  color: isCurrent ? "var(--accent)" : "var(--muted)",
                  fontWeight: 600,
                }}>
                  v{v.version}
                </span>
                {isCurrent && (
                  <span className="badge badge-accent" style={{ fontSize: "0.62rem" }}>Current</span>
                )}
                <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                  {fmtDate(v.createdAt)}
                </span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setExpanded(isExpanded ? null : v.version)}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? "Collapse version" : "Expand version"}
                >
                  {isExpanded ? "↑ Hide" : "↓ Preview"}
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleCopyVersion(v)}
                  aria-label={`Copy version ${v.version}`}
                >
                  {copyStatus[v.version] === "success" ? "✓ Copied" : "⊕ Copy"}
                </button>
                {!isCurrent && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleRestoreVersion(v)}
                    aria-label={`Restore version ${v.version}`}
                  >
                    ↩ Restore
                  </button>
                )}
              </div>
            </div>

            {/* Change note */}
            {v.changeNote && (
              <div style={{ marginTop: 6, fontSize: "0.73rem", color: "var(--muted)", fontStyle: "italic" }}>
                {v.changeNote}
              </div>
            )}

            {/* Content preview */}
            {isExpanded && (
              <div style={{
                marginTop: 10,
                padding: "10px 12px",
                background: "rgba(0,0,0,0.25)",
                borderRadius: "var(--radius)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--muted)",
                maxHeight: 200,
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
              }}>
                {v.content || "(empty)"}
              </div>
            )}
          </div>
        );
      })}

      <div style={{
        marginTop: 8, padding: "8px 12px",
        background: "rgba(0,229,255,0.03)", border: "1px solid var(--border2)",
        borderRadius: "var(--radius)", fontSize: "0.68rem", color: "var(--muted)",
        fontFamily: "var(--font-mono)",
      }}>
        {versions.length} version{versions.length !== 1 ? "s" : ""} stored locally.
        Old versions are never deleted. Restoring creates a new version.
      </div>
    </div>
  );
}

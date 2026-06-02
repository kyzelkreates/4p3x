// ============================================================
// AP3X — ImplementationRoadmapPreview — Run 8
// ============================================================
import { useState } from "react";
export default function ImplementationRoadmapPreview({ exportPack }) {
  const [expanded, setExpanded] = useState(null);
  const road = exportPack?.implementationRoadmap;
  if (!road) return <div className="panel" style={{ color: "var(--muted)", padding: 20 }}>No implementation roadmap generated yet.</div>;
  return (
    <div>
      <div className="panel" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="badge badge-accent" style={{ fontSize: "0.68rem" }}>{road.totalRuns || 0} phases</span>
          <span className="badge badge-muted"  style={{ fontSize: "0.68rem" }}>Readiness {road.buildReadiness || 0}%</span>
          <span className={`badge ${road.readinessLabel === "High" ? "badge-success" : "badge-warning"}`} style={{ fontSize: "0.68rem" }}>{road.readinessLabel}</span>
        </div>
      </div>
      {(road.phases || []).map((ph) => (
        <div key={ph.phase} style={{ marginBottom: 8, border: "1px solid var(--border2)", borderRadius: "var(--radius)", borderLeft: "3px solid var(--accent)", overflow: "hidden" }}>
          <button
            style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "none", cursor: "pointer", textAlign: "left" }}
            onClick={() => setExpanded(expanded === ph.phase ? null : ph.phase)}
            aria-expanded={expanded === ph.phase}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="run-number-badge">Phase {ph.phase}</span>
              <span style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--text)" }}>{ph.title}</span>
            </div>
            <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{expanded === ph.phase ? "▲" : "▼"}</span>
          </button>
          {expanded === ph.phase && (
            <div style={{ padding: "10px 14px", background: "rgba(0,0,0,0.15)", borderTop: "1px solid var(--border2)", fontSize: "0.75rem", color: "var(--muted)" }}>
              <div style={{ marginBottom: 6 }}>{ph.mission}</div>
              {(ph.gates || []).length > 0 && <div>Gates: {ph.gates.join(" · ")}</div>}
              {(ph.depends || []).length > 0 && <div style={{ marginTop: 4 }}>Depends on: Phase {ph.depends.join(", ")}</div>}
            </div>
          )}
        </div>
      ))}
      <div className="panel" style={{ marginTop: 12 }}>
        <div className="section-label" style={{ marginBottom: 6 }}>Completion Criteria</div>
        {(road.completionCriteria || []).map((c, i) => <div key={i} style={{ fontSize: "0.73rem", color: "var(--muted)", padding: "2px 0" }}>✓ {c}</div>)}
      </div>
    </div>
  );
}

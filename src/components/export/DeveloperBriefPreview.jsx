// ============================================================
// AP3X — DeveloperBriefPreview — Run 8
// ============================================================
export default function DeveloperBriefPreview({ exportPack }) {
  const dev = exportPack?.developerBrief;
  if (!dev) return <div className="panel" style={{ color: "var(--muted)", padding: 20 }}>No developer brief generated yet.</div>;
  const scope = dev.technicalScope || {};
  const state = dev.stateDataBrief || {};
  return (
    <div>
      <div className="panel" style={{ marginBottom: 12 }}>
        <div className="section-label" style={{ marginBottom: 8 }}>Technical Scope</div>
        {Object.entries(scope).map(([k, v]) => (
          <div key={k} className="setting-row">
            <span className="setting-label" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>{k}</span>
            <span style={{ fontSize: "0.72rem", color: "var(--muted)", maxWidth: "60%", textAlign: "right" }}>{String(v)}</span>
          </div>
        ))}
      </div>
      {(dev.folderStructure || []).length > 0 && (
        <div className="panel" style={{ marginBottom: 12 }}>
          <div className="section-label" style={{ marginBottom: 6 }}>Folder Structure</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", lineHeight: 1.8, whiteSpace: "pre" }}>
            {dev.folderStructure.join("\n")}
          </div>
        </div>
      )}
      <div className="panel" style={{ marginBottom: 12 }}>
        <div className="section-label" style={{ marginBottom: 8 }}>State & Data</div>
        {state.ssotFile  && <div className="setting-row"><span className="setting-label">SSOT File</span><span style={{ fontSize: "0.72rem", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>{state.ssotFile}</span></div>}
        {state.mutations && <div className="setting-row"><span className="setting-label">Mutations</span><span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{state.mutations}</span></div>}
        {(state.entities || []).map((e) => (
          <div key={e.name} style={{ padding: "4px 0", fontSize: "0.72rem", color: "var(--muted)" }}>
            <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>{e.name}</span>: {(e.fields || []).join(", ")}
          </div>
        ))}
      </div>
      {(dev.acceptanceCriteria || []).length > 0 && (
        <div className="panel">
          <div className="section-label" style={{ marginBottom: 6 }}>Acceptance Criteria ({dev.acceptanceCriteria.length})</div>
          {dev.acceptanceCriteria.slice(0, 10).map((c, i) => (
            <div key={i} style={{ fontSize: "0.72rem", color: "var(--muted)", padding: "2px 0" }}>✓ {c}</div>
          ))}
          {dev.acceptanceCriteria.length > 10 && <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: 4 }}>+{dev.acceptanceCriteria.length - 10} more…</div>}
        </div>
      )}
    </div>
  );
}

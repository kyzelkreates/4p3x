// AP3X — ConnectedSourcesPanel — Run 10
import { getSourceConnections } from "../../utils/sourceConnectionUtils.js";

export default function ConnectedSourcesPanel() {
  const connections = getSourceConnections();
  return (
    <div className="panel">
      <div className="section-label" style={{ marginBottom:10 }}>Connected Sources</div>
      <div style={{ fontSize:"0.72rem", color:"var(--muted)", marginBottom:12 }}>
        Connected sources require explicit authorisation before any data is accessed. Placeholder sources are not active.
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px,1fr))", gap:8 }}>
        {connections.map((c) => (
          <div key={c.sourceType} style={{ padding:"10px 14px", background:"rgba(255,255,255,0.02)", border:`1px solid ${c.isPlaceholder?"var(--border2)":"var(--success)"}`, borderRadius:"var(--radius)" }}>
            <div style={{ fontWeight:600, fontSize:"0.78rem", color:"var(--text)", marginBottom:4 }}>{c.sourceType}</div>
            <div>
              <span className={`badge ${c.isPlaceholder ? "badge-muted" : "badge-success"}`} style={{ fontSize:"0.6rem" }}>{c.label}</span>
            </div>
            {c.isPlaceholder && (
              <div style={{ fontSize:"0.65rem", color:"var(--muted)", marginTop:4 }}>
                Connection placeholder only — not active until authorised integration is added.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

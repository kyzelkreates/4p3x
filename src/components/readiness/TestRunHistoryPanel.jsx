// AP3X — TestRunHistoryPanel — Run 9
import { scoreBadgeVariant } from "../../utils/readinessScoringUtils.js";

export default function TestRunHistoryPanel({ testRuns, activeRunId, onSelect }) {
  if (!testRuns || testRuns.length === 0) return (
    <div className="panel" style={{ color:"var(--muted)", padding:20 }}>No test run history yet. Run the full product test to create the first entry.</div>
  );
  return (
    <div>
      {[...testRuns].reverse().map((r) => (
        <div
          key={r.id}
          onClick={() => onSelect(r.id)}
          style={{
            marginBottom:8, padding:"10px 14px",
            background: r.id === activeRunId ? "rgba(0,229,255,0.05)" : "rgba(255,255,255,0.02)",
            border:`1px solid ${r.id === activeRunId ? "var(--accent)" : "var(--border2)"}`,
            borderRadius:"var(--radius)", cursor:"pointer",
            display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:"wrap",
          }}
        >
          <div>
            <div style={{ fontWeight:600, fontSize:"0.8rem", color:"var(--text)" }}>{r.title}</div>
            <div style={{ fontSize:"0.68rem", color:"var(--muted)", marginTop:2 }}>{new Date(r.createdAt).toLocaleString()}</div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <span className={`badge badge-${scoreBadgeVariant(r.readinessScore)}`} style={{ fontSize:"0.65rem" }}>{r.readinessScore}%</span>
            <span className={`badge ${r.failCount > 0 ? "badge-warning" : "badge-success"}`} style={{ fontSize:"0.65rem" }}>{r.readinessStatus}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

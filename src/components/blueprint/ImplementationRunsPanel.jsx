// ============================================================
// AP3X — ImplementationRunsPanel — Run 7
// ============================================================
import { useState } from "react";

export default function ImplementationRunsPanel({ blueprint }) {
  const [expanded, setExpanded] = useState(null);
  const runs = blueprint?.implementationRuns || [];
  if (runs.length === 0) return <div className="panel" style={{color:"var(--muted)",padding:20}}>No run plan generated yet.</div>;
  return (
    <div>
      <div style={{ marginBottom:10, display:"flex", gap:6, flexWrap:"wrap" }}>
        <span className="badge badge-accent" style={{fontSize:"0.68rem"}}>{runs.length} runs planned</span>
        <span className="badge badge-muted"  style={{fontSize:"0.68rem"}}>Run isolation enforced</span>
        <span className="badge badge-muted"  style={{fontSize:"0.68rem"}}>No feature drift</span>
      </div>
      {runs.map((r) => (
        <div key={r.runNumber} style={{
          marginBottom:8, border:"1px solid var(--border2)", borderRadius:"var(--radius)",
          borderLeft:"3px solid var(--accent)", overflow:"hidden",
        }}>
          <button
            style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background:"rgba(255,255,255,0.02)", border:"none", cursor:"pointer", textAlign:"left" }}
            onClick={() => setExpanded(expanded === r.runNumber ? null : r.runNumber)}
            aria-expanded={expanded === r.runNumber}
            aria-label={`Run ${r.runNumber}: ${r.title}`}
          >
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span className="run-number-badge">Run {r.runNumber}</span>
              <span style={{ fontWeight:600, fontSize:"0.82rem", color:"var(--text)" }}>{r.title}</span>
            </div>
            <span style={{ color:"var(--muted)", fontSize:"0.75rem" }}>{expanded === r.runNumber ? "▲" : "▼"}</span>
          </button>
          {expanded === r.runNumber && (
            <div style={{ padding:"12px 16px", background:"rgba(0,0,0,0.15)", borderTop:"1px solid var(--border2)" }}>
              <div style={{ fontSize:"0.78rem", color:"var(--muted)", marginBottom:10 }}>{r.mission}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, fontSize:"0.72rem" }}>
                <div>
                  <div style={{ fontWeight:600, color:"var(--text)", marginBottom:4 }}>Validation Gates</div>
                  {(r.validationGates||[]).map((g,i) => <div key={i} style={{color:"var(--muted)",padding:"1px 0"}}>✓ {g}</div>)}
                </div>
                <div>
                  <div style={{ fontWeight:600, color:"var(--text)", marginBottom:4 }}>Acceptance Tests</div>
                  {(r.acceptanceTests||[]).map((t,i) => <div key={i} style={{color:"var(--muted)",padding:"1px 0"}}>{i+1}. {t}</div>)}
                </div>
              </div>
              {(r.dependsOn||[]).length > 0 && (
                <div style={{ marginTop:8, fontSize:"0.68rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
                  Depends on: Run {r.dependsOn.join(", ")}
                </div>
              )}
              {r.rollbackNotes && (
                <div style={{ marginTop:8, padding:"6px 10px", background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:"var(--radius)", fontSize:"0.68rem", color:"var(--danger)" }}>
                  Rollback: {r.rollbackNotes}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

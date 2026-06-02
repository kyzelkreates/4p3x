// ============================================================
// AP3X — ComponentPlanPanel — Run 7
// ============================================================
import { useState } from "react";

export default function ComponentPlanPanel({ blueprint }) {
  const [filter, setFilter] = useState("all");
  const components = blueprint?.componentPlan || [];
  const types = ["all", ...new Set(components.map((c) => c.type))];
  const shown = filter === "all" ? components : components.filter((c) => c.type === filter);
  if (components.length === 0) return <div className="panel" style={{color:"var(--muted)",padding:20}}>No component plan generated yet.</div>;
  return (
    <div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
        {types.map((t) => (
          <button key={t} className={`btn btn-sm ${filter===t?"btn-primary":"btn-ghost"}`} onClick={() => setFilter(t)} aria-label={`Filter by ${t}`}>{t}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:10 }}>
        {shown.map((c) => (
          <div key={c.name} style={{ padding:"12px 14px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", borderLeft:`3px solid ${c.type==="layout"?"var(--accent)":c.type==="feature"?"var(--accent2)":c.type==="ux"?"var(--success)":"var(--border2)"}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <div style={{ fontWeight:700, fontSize:"0.82rem", color:"var(--text)", fontFamily:"var(--font-mono)" }}>{c.name}</div>
              <span className="badge badge-muted" style={{fontSize:"0.58rem"}}>{c.type}</span>
            </div>
            <div style={{ fontSize:"0.72rem", color:"var(--muted)", marginBottom:6 }}>{c.responsibility}</div>
            {(c.stateDeps||[]).length > 0 && (
              <div style={{ fontSize:"0.68rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
                State: {c.stateDeps.join(", ")}
              </div>
            )}
            {(c.validationReqs||[]).length > 0 && (
              <div style={{ marginTop:4 }}>
                {c.validationReqs.map((v,i) => (
                  <div key={i} style={{ fontSize:"0.65rem", color:"var(--accent)", padding:"1px 0" }}>✓ {v}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop:10, fontSize:"0.68rem", color:"var(--muted)" }}>
        Showing {shown.length} of {components.length} components.
      </div>
    </div>
  );
}

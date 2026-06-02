// AP3X — StaleProjectPanel — Run 10
import { findStaleProjects } from "../../core/projectInventoryEngine.js";

export default function StaleProjectPanel({ projects, onSelect }) {
  const stale = findStaleProjects(projects||[]);
  if (stale.length === 0) return (
    <div className="panel" style={{ textAlign:"center", padding:24, color:"var(--muted)" }}>
      <div style={{ fontSize:"2rem", marginBottom:6 }}>✓</div>
      No stale projects detected.
    </div>
  );
  return (
    <div>
      <div style={{ fontSize:"0.75rem", color:"var(--muted)", marginBottom:10 }}>
        {stale.length} stale project(s) detected (not updated in 90+ days or no date recorded).
      </div>
      {stale.map((p) => (
        <div key={p.id} style={{ marginBottom:8, padding:"10px 14px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <div>
            <div style={{ fontWeight:600, fontSize:"0.8rem", color:"var(--text)" }}>{p.title}</div>
            <div style={{ fontSize:"0.68rem", color:"var(--muted)", marginTop:2 }}>
              Last updated: {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "Unknown"}
            </div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <span className="badge badge-warning" style={{ fontSize:"0.62rem" }}>Stale</span>
            <button className="btn btn-ghost btn-xs" onClick={()=>onSelect?.(p)} aria-label="View project">View</button>
          </div>
        </div>
      ))}
    </div>
  );
}

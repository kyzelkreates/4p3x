// AP3X — DuplicateProjectPanel — Run 10
import { findPotentialDuplicates } from "../../core/projectInventoryEngine.js";

export default function DuplicateProjectPanel({ projects, onSelect }) {
  const dups = findPotentialDuplicates(projects||[]);
  if (dups.length === 0) return (
    <div className="panel" style={{ textAlign:"center", padding:24, color:"var(--muted)" }}>
      <div style={{ fontSize:"2rem", marginBottom:6 }}>✓</div>
      No duplicate candidates detected.
    </div>
  );
  return (
    <div>
      <div style={{ fontSize:"0.75rem", color:"var(--muted)", marginBottom:10 }}>
        {dups.length} potential duplicate pair(s) detected. Review and archive if confirmed. No automatic deletion.
      </div>
      {dups.map((d, i) => (
        <div key={i} style={{ marginBottom:10, padding:"12px 16px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)" }}>
          <div style={{ fontSize:"0.72rem", color:"var(--warning)", marginBottom:6, fontWeight:700 }}>⚠ {d.reason}</div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {[d.a, d.b].map((p) => (
              <button key={p.id} className="btn btn-ghost btn-sm" onClick={() => onSelect?.(p)} style={{ textAlign:"left" }} aria-label={`View ${p.title}`}>
                <div style={{ fontWeight:600, fontSize:"0.78rem" }}>{p.title}</div>
                <div style={{ fontSize:"0.65rem", color:"var(--muted)" }}>{p.sourceType} | {p.status}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

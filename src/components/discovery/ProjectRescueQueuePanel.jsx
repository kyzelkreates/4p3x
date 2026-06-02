// AP3X — ProjectRescueQueuePanel — Run 10
import { prioritiseRescueQueue } from "../../core/projectRescueQueueEngine.js";
import { removeFromRescueQueueStorage } from "../../core/storage.js";

export default function ProjectRescueQueuePanel({ projects, queueIds, onSelect, onRemove }) {
  const prioritised = prioritiseRescueQueue(projects, queueIds);

  if (!prioritised || prioritised.length === 0) return (
    <div className="panel" style={{ textAlign:"center", padding:32, color:"var(--muted)" }}>
      <div style={{ fontSize:"2rem", marginBottom:8 }}>⊕</div>
      No projects in rescue queue yet. Add projects from the inventory table.
    </div>
  );

  return (
    <div>
      {prioritised.map((p, i) => (
        <div key={p.id} onClick={() => onSelect?.(p)} style={{ marginBottom:8, padding:"12px 16px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8, borderLeft:`3px solid ${p.rescuePriority>=70?"var(--danger)":p.rescuePriority>=50?"var(--warning)":"var(--muted)"}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontFamily:"var(--font-mono)", fontWeight:800, fontSize:"0.9rem", color:"var(--accent)", minWidth:24 }}>#{i+1}</span>
            <div>
              <div style={{ fontWeight:600, fontSize:"0.82rem", color:"var(--text)" }}>{p.title}</div>
              <div style={{ fontSize:"0.7rem", color:"var(--accent)", marginTop:2 }}>→ {p.nextAction}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
            <span className="badge badge-accent" style={{ fontSize:"0.62rem" }}>Priority {p.rescuePriority}</span>
            <span className={`badge ${p.healthScore>=70?"badge-success":p.healthScore>=40?"badge-warning":"badge-danger"}`} style={{ fontSize:"0.62rem" }}>Health {p.healthScore}%</span>
            <button className="btn btn-ghost btn-xs" onClick={(e)=>{ e.stopPropagation(); onRemove?.(p.id); }} aria-label="Remove from queue">✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

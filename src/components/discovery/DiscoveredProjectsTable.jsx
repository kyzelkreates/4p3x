// AP3X — DiscoveredProjectsTable — Run 10
import StatusBadge from "../StatusBadge.jsx";

const STATUS_VARIANT = { "Working":"success","Broken":"danger","Stale":"warning","Unknown":"muted","New":"accent","Duplicate":"warning","Needs Review":"warning","Ready For Extraction":"success","Ready For Rescue Plan":"accent","Archived":"muted","Partially Working":"warning" };

export default function DiscoveredProjectsTable({ projects, queueIds, onSelect, onAddToQueue, onSendToExtractor, onGeneratePrompt, onMarkDuplicate, onArchive }) {
  if (!projects || projects.length === 0) return (
    <div className="panel" style={{ textAlign:"center", padding:32, color:"var(--muted)" }}>
      <div style={{ fontSize:"2rem", marginBottom:8 }}>⬡</div>
      No projects in inventory yet. Add projects using the source panels above.
    </div>
  );

  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.72rem" }}>
        <thead>
          <tr style={{ borderBottom:"1px solid var(--border2)", color:"var(--muted)", textAlign:"left" }}>
            {["Project","Source","Stack","Status","Health","Completion","Risk","Actions"].map((h)=>(
              <th key={h} style={{ padding:"6px 10px", fontWeight:700, whiteSpace:"nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id} style={{ borderBottom:"1px solid var(--border2)", cursor:"pointer" }} onClick={() => onSelect?.(p)}>
              <td style={{ padding:"8px 10px", color:"var(--text)", fontWeight:600, maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {p.title}
                {queueIds?.includes(p.id) && <span className="badge badge-accent" style={{ marginLeft:6, fontSize:"0.58rem" }}>Queue</span>}
              </td>
              <td style={{ padding:"8px 10px", color:"var(--muted)", whiteSpace:"nowrap" }}>{p.sourceType}</td>
              <td style={{ padding:"8px 10px", color:"var(--muted)", whiteSpace:"nowrap" }}>{(p.detectedStack||[]).slice(0,2).join(", ")||"—"}</td>
              <td style={{ padding:"8px 10px" }}>
                <span className={`badge badge-${STATUS_VARIANT[p.status]||"muted"}`} style={{ fontSize:"0.6rem" }}>{p.status||"Unknown"}</span>
              </td>
              <td style={{ padding:"8px 10px", color: p.healthScore>=70?"var(--success)":p.healthScore>=40?"var(--warning)":"var(--danger)", fontFamily:"var(--font-mono)" }}>{p.healthScore||0}%</td>
              <td style={{ padding:"8px 10px", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>{p.completionScore||0}%</td>
              <td style={{ padding:"8px 10px" }}>
                <span className={`badge ${p.riskLevel==="Critical"||p.riskLevel==="High"?"badge-danger":p.riskLevel==="Medium"?"badge-warning":"badge-success"}`} style={{ fontSize:"0.6rem" }}>{p.riskLevel||"Unknown"}</span>
              </td>
              <td style={{ padding:"8px 10px" }} onClick={(e)=>e.stopPropagation()}>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                  <button className="btn btn-ghost btn-xs" onClick={()=>onAddToQueue?.(p.id)}      title="Add to Rescue Queue"   aria-label="Queue">⊕ Queue</button>
                  <button className="btn btn-ghost btn-xs" onClick={()=>onSendToExtractor?.(p)}    title="Send to Extractor"     aria-label="Extract">⬡ Extract</button>
                  <button className="btn btn-ghost btn-xs" onClick={()=>onGeneratePrompt?.(p)}     title="Generate Finish Prompt" aria-label="Prompt">✦ Prompt</button>
                  <button className="btn btn-ghost btn-xs" onClick={()=>onArchive?.(p.id)}         title="Archive"               aria-label="Archive">↓ Archive</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

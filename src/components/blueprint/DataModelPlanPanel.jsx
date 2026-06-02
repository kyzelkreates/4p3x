// ============================================================
// AP3X — DataModelPlanPanel — Run 7
// ============================================================
export default function DataModelPlanPanel({ blueprint }) {
  const dm = blueprint?.dataModelPlan;
  if (!dm) return <div className="panel" style={{color:"var(--muted)",padding:20}}>No data model plan generated yet.</div>;
  return (
    <div>
      <div style={{ marginBottom:14, padding:"10px 14px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)" }}>
        <div className="section-label" style={{marginBottom:4}}>Storage Strategy</div>
        <div style={{ fontSize:"0.8rem", color:"var(--muted)" }}>{dm.storageStrategy}</div>
      </div>
      <div style={{ marginBottom:14 }}>
        <div className="section-label" style={{marginBottom:8}}>Entities ({(dm.entities||[]).length})</div>
        {(dm.entities||[]).map((e) => (
          <div key={e.name} style={{ marginBottom:10, padding:"12px 14px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, flexWrap:"wrap", gap:5 }}>
              <div style={{ fontWeight:700, fontSize:"0.85rem", color:"var(--text)" }}>{e.name}</div>
              <span className={`badge ${e.source==="detected"?"badge-success":e.source==="run7"?"badge-accent":"badge-muted"}`} style={{fontSize:"0.6rem"}}>{e.source}</span>
            </div>
            <div style={{ fontSize:"0.72rem", color:"var(--muted)", fontFamily:"var(--font-mono)", lineHeight:1.8 }}>
              {(e.fields||[]).join(", ")}
            </div>
            <div style={{ fontSize:"0.68rem", color:"var(--muted)", marginTop:4 }}>{e.persistenceNote}</div>
          </div>
        ))}
      </div>
      <div>
        <div className="section-label" style={{marginBottom:8}}>Relationships</div>
        {(dm.relationships||[]).map((r, i) => (
          <div key={i} style={{ fontSize:"0.75rem", color:"var(--muted)", fontFamily:"var(--font-mono)", padding:"3px 0" }}>→ {r}</div>
        ))}
      </div>
      <div style={{ marginTop:14 }}>
        <div className="section-label" style={{marginBottom:8}}>Mutation Rules</div>
        {(dm.mutationRules||[]).map((r, i) => (
          <div key={i} style={{ fontSize:"0.75rem", color:"var(--muted)", padding:"3px 0" }}>✓ {r}</div>
        ))}
      </div>
    </div>
  );
}

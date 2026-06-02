// ============================================================
// AP3X — PagePlanPanel — Run 7
// ============================================================
export default function PagePlanPanel({ blueprint }) {
  const pages = blueprint?.pagePlan || [];
  if (pages.length === 0) return <div className="panel" style={{color:"var(--muted)",padding:20}}>No page plan generated yet.</div>;
  return (
    <div>
      {pages.map((p) => (
        <div key={p.id || p.name} style={{ marginBottom:14, padding:"14px 16px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", borderLeft:"3px solid var(--accent)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6, flexWrap:"wrap", gap:6 }}>
            <div style={{ fontWeight:700, fontSize:"0.88rem", color:"var(--text)" }}>{p.name}</div>
            <span className={`badge ${p.type==="primary"?"badge-accent":p.type==="future"?"badge-locked":"badge-muted"}`} style={{fontSize:"0.62rem"}}>{p.type}</span>
          </div>
          <div style={{ fontSize:"0.75rem", color:"var(--muted)", marginBottom:8 }}>{p.purpose}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, fontSize:"0.72rem", color:"var(--muted)" }}>
            <div>
              <div style={{ fontWeight:600, color:"var(--text)", marginBottom:3 }}>Components</div>
              {(p.mainComponents||[]).map((c,i) => <div key={i}>• {c}</div>)}
            </div>
            <div>
              <div style={{ fontWeight:600, color:"var(--text)", marginBottom:3 }}>UI States</div>
              {(p.uiStates||[]).map((s,i) => <div key={i}>• {s}</div>)}
            </div>
          </div>
          {p.originalNote && (
            <div style={{ marginTop:8, fontSize:"0.68rem", color:"var(--accent)", fontFamily:"var(--font-mono)" }}>
              ℹ {p.originalNote}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// AP3X — StateLogicPlanPanel — Run 7
// ============================================================
export default function StateLogicPlanPanel({ blueprint }) {
  const sp = blueprint?.stateManagementPlan;
  const bl = blueprint?.businessLogicPlan;
  if (!sp) return <div className="panel" style={{color:"var(--muted)",padding:20}}>No state plan generated yet.</div>;
  return (
    <div>
      <div className="section-label" style={{marginBottom:8}}>SSOT Pattern</div>
      <div className="panel" style={{marginBottom:16}}>
        {Object.entries(sp).filter(([k]) => !["transitions"].includes(k)).map(([k, v]) => (
          <div key={k} className="setting-row">
            <span className="setting-label" style={{textTransform:"none",fontFamily:"var(--font-mono)",fontSize:"0.72rem"}}>{k}</span>
            <span style={{ fontSize:"0.72rem", color:"var(--muted)", maxWidth:"60%", textAlign:"right", wordBreak:"break-word" }}>{String(v)}</span>
          </div>
        ))}
      </div>
      {(sp.transitions||[]).length > 0 && (
        <div style={{ marginBottom:16 }}>
          <div className="section-label" style={{marginBottom:6}}>State Transitions</div>
          {sp.transitions.map((t,i) => (
            <div key={i} style={{ padding:"8px 12px", background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.75rem", color:"var(--muted)", marginBottom:6, fontFamily:"var(--font-mono)" }}>
              {t}
            </div>
          ))}
        </div>
      )}
      {bl && (
        <>
          <div className="section-label" style={{marginBottom:8}}>Business Logic Utilities</div>
          <div className="panel">
            {(bl.utilitiesNeeded||[]).map((u,i) => (
              <div key={i} style={{ fontSize:"0.73rem", color:"var(--accent)", fontFamily:"var(--font-mono)", padding:"3px 0" }}>{u}</div>
            ))}
            {bl.patternNote && <div style={{ marginTop:8, fontSize:"0.72rem", color:"var(--muted)" }}>{bl.patternNote}</div>}
          </div>
        </>
      )}
    </div>
  );
}

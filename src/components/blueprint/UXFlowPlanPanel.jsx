// ============================================================
// AP3X — UXFlowPlanPanel — Run 7
// ============================================================
export default function UXFlowPlanPanel({ blueprint }) {
  const ux = blueprint?.uxFlowPlan;
  const vs = blueprint?.validationStatePlan;
  const ac = blueprint?.accessibilityPlan;
  const mb = blueprint?.mobilePlan;
  if (!ux) return <div className="panel" style={{color:"var(--muted)",padding:20}}>No UX plan generated yet.</div>;
  return (
    <div>
      {/* Navigation & patterns */}
      <div className="panel" style={{marginBottom:16}}>
        {[["Navigation",ux.navigationPattern],["Forms",ux.formPattern],["Lists",ux.listPattern],["Detail",ux.detailPattern],["Import/Export",ux.importExportPattern],["Error Recovery",ux.errorRecoveryFlow],["Onboarding",ux.onboardingFlow],["Mobile",ux.mobilePattern],["Accessibility",ux.accessibilityNotes]].filter(([,v])=>v).map(([k,v]) => (
          <div key={k} className="setting-row">
            <span className="setting-label" style={{minWidth:120}}>{k}</span>
            <span style={{ fontSize:"0.73rem", color:"var(--muted)", maxWidth:"62%", textAlign:"right", wordBreak:"break-word" }}>{v}</span>
          </div>
        ))}
      </div>

      {/* User flows */}
      {(ux.journeys||[]).length > 0 && (
        <div style={{ marginBottom:16 }}>
          <div className="section-label" style={{marginBottom:8}}>User Journeys</div>
          {ux.journeys.map((j) => (
            <div key={j.name} style={{ marginBottom:10, padding:"10px 14px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)" }}>
              <div style={{ fontWeight:600, fontSize:"0.8rem", color:"var(--text)", marginBottom:5 }}>{j.name}</div>
              {(j.steps||[]).map((s,i) => <div key={i} style={{ fontSize:"0.73rem", color:"var(--muted)", padding:"2px 0" }}>→ {s}</div>)}
            </div>
          ))}
        </div>
      )}

      {/* Validation states */}
      {vs && (
        <div style={{ marginBottom:16 }}>
          <div className="section-label" style={{marginBottom:8}}>Required UI States</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {(vs.statesRequired||[]).map((s,i) => <span key={i} className="badge badge-muted" style={{fontSize:"0.68rem"}}>{s}</span>)}
          </div>
        </div>
      )}

      {/* Mobile */}
      {mb && (
        <div>
          <div className="section-label" style={{marginBottom:8}}>Mobile Plan</div>
          <div className="panel">
            {(mb.mobilePatterns||[]).map((p,i) => <div key={i} style={{ fontSize:"0.73rem", color:"var(--muted)", padding:"2px 0" }}>✓ {p}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}

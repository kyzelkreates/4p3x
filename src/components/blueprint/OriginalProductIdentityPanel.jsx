// ============================================================
// AP3X — OriginalProductIdentityPanel — Run 7
// ============================================================
export default function OriginalProductIdentityPanel({ blueprint }) {
  const id = blueprint?.originalAppIdentity;
  if (!id) return <div className="panel" style={{color:"var(--muted)",padding:20}}>No identity generated yet.</div>;

  return (
    <div>
      {/* Naming */}
      <div className="section">
        <div className="section-label" style={{marginBottom:8}}>Name Suggestions (use as inspiration)</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
          {(id.naming?.suggestions || []).map((n, i) => (
            <span key={i} className="badge badge-accent" style={{fontSize:"0.75rem",padding:"4px 10px"}}>{n}</span>
          ))}
        </div>
        {(id.naming?.doNotUse || []).map((d, i) => (
          <div key={i} style={{ fontSize:"0.72rem", color:"var(--danger)", padding:"2px 0" }}>⛔ {d}</div>
        ))}
      </div>

      {/* Value prop */}
      <div className="section">
        <div className="section-label" style={{marginBottom:6}}>Value Proposition Template</div>
        <div style={{ padding:"12px 14px", background:"rgba(0,229,255,0.04)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.82rem", color:"var(--text)", lineHeight:1.7 }}>
          {id.value?.template || "Define your value proposition."}
        </div>
        {(id.value?.guidance || []).map((g, i) => (
          <div key={i} style={{ fontSize:"0.72rem", color:"var(--muted)", padding:"3px 0" }}>→ {g}</div>
        ))}
      </div>

      {/* User promise */}
      <div className="section">
        <div className="section-label" style={{marginBottom:6}}>User Promise Template</div>
        <div style={{ padding:"10px 14px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.8rem", color:"var(--text)" }}>
          {id.promise?.promise || "Define your user promise."}
        </div>
      </div>

      {/* Branding */}
      <div className="section">
        <div className="section-label" style={{marginBottom:8}}>Branding Direction</div>
        <div className="panel">
          {id.branding && Object.entries(id.branding).filter(([k]) => k !== "doNotCopy").map(([k, v]) => (
            <div key={k} className="setting-row">
              <span className="setting-label" style={{textTransform:"none"}}>{k.replace(/([A-Z])/g," $1").trim()}</span>
              <span style={{ fontSize:"0.73rem", color:"var(--muted)", maxWidth:"60%", textAlign:"right", wordBreak:"break-word" }}>{v}</span>
            </div>
          ))}
          {id.branding?.doNotCopy && (
            <div style={{ marginTop:8, padding:"8px 12px", background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"var(--radius)", fontSize:"0.72rem", color:"var(--danger)" }}>
              ⛔ {id.branding.doNotCopy}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

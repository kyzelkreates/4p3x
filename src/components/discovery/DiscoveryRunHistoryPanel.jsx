// AP3X — DiscoveryRunHistoryPanel — Run 10
export default function DiscoveryRunHistoryPanel({ discoveryRuns }) {
  if (!discoveryRuns || discoveryRuns.length === 0) return (
    <div className="panel" style={{ color:"var(--muted)", padding:20 }}>No discovery runs yet. Click "Run Project Discovery" to create the first entry.</div>
  );
  return (
    <div>
      {[...discoveryRuns].reverse().map((r) => (
        <div key={r.id} style={{ marginBottom:8, padding:"10px 14px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <div>
            <div style={{ fontWeight:600, fontSize:"0.78rem", color:"var(--text)" }}>Discovery Run — {new Date(r.createdAt).toLocaleString()}</div>
            <div style={{ fontSize:"0.68rem", color:"var(--muted)", marginTop:2 }}>Projects found: {r.projectsFound} | Status: {r.status}</div>
            {r.summary && <div style={{ fontSize:"0.68rem", color:"var(--muted)", marginTop:2 }}>Working: {r.summary.working} | Broken: {r.summary.broken} | Ready: {r.summary.ready}</div>}
          </div>
          <span className="badge badge-success" style={{ fontSize:"0.62rem" }}>✓ {r.status}</span>
        </div>
      ))}
    </div>
  );
}

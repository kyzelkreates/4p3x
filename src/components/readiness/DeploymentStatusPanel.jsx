// AP3X — DeploymentStatusPanel — Run 9
import { statusColor } from "../../utils/readinessScoringUtils.js";
import { statusIcon }  from "../../utils/productTestUtils.js";

export default function DeploymentStatusPanel({ checks }) {
  if (!checks || checks.length === 0) return <div className="panel" style={{ color:"var(--muted)", padding:20 }}>Run the product test to see deployment status.</div>;
  return (
    <div className="panel">
      <div className="section-label" style={{ marginBottom:10 }}>Deployment Status</div>
      {checks.map((c) => (
        <div key={c.id} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"6px 0", borderBottom:"1px solid var(--border2)" }}>
          <span style={{ color:statusColor(c.status), fontFamily:"var(--font-mono)", fontSize:"0.85rem", minWidth:16 }}>{statusIcon(c.status)}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:"0.78rem", color:"var(--text)", fontWeight:600 }}>{c.title}</div>
            <div style={{ fontSize:"0.7rem", color:"var(--muted)", marginTop:2 }}>{c.detail}</div>
          </div>
          <span className={`badge ${c.status==="pass"?"badge-success":c.status==="warning"?"badge-warning":"badge-danger"}`} style={{ fontSize:"0.6rem" }}>{c.severity}</span>
        </div>
      ))}
    </div>
  );
}

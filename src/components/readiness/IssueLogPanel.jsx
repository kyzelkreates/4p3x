// AP3X — IssueLogPanel — Run 9
import { groupIssuesBySeverity } from "../../utils/issueLogUtils.js";
import { statusColor }           from "../../utils/readinessScoringUtils.js";
import { statusIcon }            from "../../utils/productTestUtils.js";

export default function IssueLogPanel({ testRun }) {
  if (!testRun) return <div className="panel" style={{ color:"var(--muted)", padding:20 }}>Run the product test to see the issue log.</div>;
  const issues = testRun.issueLog || [];
  if (issues.length === 0) return (
    <div className="panel" style={{ textAlign:"center", padding:32 }}>
      <div style={{ color:"var(--success)", fontSize:"2rem", marginBottom:8 }}>✓</div>
      <div style={{ fontWeight:700, color:"var(--text)", fontSize:"0.9rem" }}>No issues found!</div>
      <div style={{ color:"var(--muted)", fontSize:"0.78rem", marginTop:4 }}>All tests passed cleanly.</div>
    </div>
  );
  const bySev = groupIssuesBySeverity(issues);
  const SECS  = [
    ["critical", "⛔ Critical", bySev.critical],
    ["high",     "🔴 High",     bySev.high],
    ["medium",   "🟡 Medium",   bySev.medium],
    ["low",      "🔵 Low",      bySev.low],
  ];
  return (
    <div>
      {SECS.filter(([,, arr]) => arr.length > 0).map(([sev, label, arr]) => (
        <div key={sev} style={{ marginBottom:12 }}>
          <div style={{ fontSize:"0.8rem", fontWeight:700, color: sev==="critical"||sev==="high"?"var(--danger)":sev==="medium"?"var(--warning)":"var(--accent)", marginBottom:6 }}>
            {label} ({arr.length})
          </div>
          {arr.map((i) => (
            <div key={i.id} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"7px 10px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", marginBottom:5 }}>
              <span style={{ color:statusColor(i.status), fontSize:"0.85rem", fontFamily:"var(--font-mono)", minWidth:14 }}>{statusIcon(i.status)}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"0.76rem", color:"var(--text)", fontWeight:600 }}>{i.category} — {i.title}</div>
                <div style={{ fontSize:"0.7rem", color:"var(--muted)", marginTop:2 }}>{i.detail}</div>
                {i.recommendedFix && <div style={{ fontSize:"0.67rem", color:"var(--accent)", marginTop:3 }}>Fix: {i.recommendedFix}</div>}
              </div>
              {i.blocking && <span className="badge badge-danger" style={{ fontSize:"0.6rem" }}>BLOCKING</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

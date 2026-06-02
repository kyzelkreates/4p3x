// AP3X — ProductTestPanel — Run 9
import { useState }                from "react";
import { groupTestsByCategory, categoryScore, statusIcon } from "../../utils/productTestUtils.js";
import { statusColor }             from "../../utils/readinessScoringUtils.js";

export default function ProductTestPanel({ testRun }) {
  const [expanded, setExpanded] = useState(null);
  if (!testRun) return <div className="panel" style={{ color:"var(--muted)", padding:20 }}>Run the full product test to see results.</div>;

  const grouped = groupTestsByCategory(testRun.tests || []);

  return (
    <div>
      {Object.entries(grouped).map(([cat, tests]) => {
        const score   = categoryScore(tests);
        const fails   = tests.filter((t) => t.status === "fail").length;
        const warns   = tests.filter((t) => t.status === "warning").length;
        const isOpen  = expanded === cat;
        return (
          <div key={cat} style={{ marginBottom:8, border:"1px solid var(--border2)", borderRadius:"var(--radius)", overflow:"hidden", borderLeft:`3px solid ${fails>0?"var(--danger)":warns>0?"var(--warning)":"var(--success)"}` }}>
            <button
              style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:"rgba(255,255,255,0.02)", border:"none", cursor:"pointer", textAlign:"left" }}
              onClick={() => setExpanded(isOpen ? null : cat)}
              aria-expanded={isOpen}
            >
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ color: fails>0?"var(--danger)":warns>0?"var(--warning)":"var(--success)", fontFamily:"var(--font-mono)", fontSize:"0.9rem" }}>{fails>0?"✕":warns>0?"⚠":"✓"}</span>
                <span style={{ fontWeight:600, fontSize:"0.82rem", color:"var(--text)" }}>{cat}</span>
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <span className={`badge ${score>=80?"badge-success":score>=50?"badge-warning":"badge-danger"}`} style={{ fontSize:"0.6rem" }}>{score}%</span>
                <span style={{ color:"var(--muted)", fontSize:"0.75rem" }}>{isOpen?"▲":"▼"}</span>
              </div>
            </button>
            {isOpen && (
              <div style={{ padding:"8px 14px", background:"rgba(0,0,0,0.12)", borderTop:"1px solid var(--border2)" }}>
                {tests.map((t) => (
                  <div key={t.id} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"5px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ color:statusColor(t.status), fontFamily:"var(--font-mono)", fontSize:"0.8rem", minWidth:14 }}>{statusIcon(t.status)}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"0.75rem", color:"var(--text)" }}>{t.title}</div>
                      <div style={{ fontSize:"0.68rem", color:"var(--muted)", marginTop:2 }}>{t.detail}</div>
                      {t.recommendedFix && t.status !== "pass" && (
                        <div style={{ fontSize:"0.65rem", color:"var(--accent)", marginTop:3 }}>Fix: {t.recommendedFix}</div>
                      )}
                    </div>
                    <span className={`badge ${t.severity==="critical"?"badge-danger":t.severity==="high"?"badge-danger":t.severity==="medium"?"badge-warning":"badge-muted"}`} style={{ fontSize:"0.58rem" }}>{t.severity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

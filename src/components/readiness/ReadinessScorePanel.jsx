// AP3X — ReadinessScorePanel — Run 9
import StatCard from "../StatCard.jsx";
import { scoreBadgeVariant } from "../../utils/readinessScoringUtils.js";

export default function ReadinessScorePanel({ testRun }) {
  if (!testRun) return (
    <div className="panel" style={{ textAlign:"center", padding:32, color:"var(--muted)" }}>
      <div style={{ fontSize:"2.5rem", marginBottom:8 }}>◉</div>
      No test run yet. Click "Run Full Product Test" to begin.
    </div>
  );
  const v = scoreBadgeVariant(testRun.readinessScore);
  return (
    <div>
      <div className="hero" style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <div>
            <div style={{ fontSize:"2.8rem", fontWeight:900, color: testRun.readinessScore >= 80 ? "var(--success)" : testRun.readinessScore >= 60 ? "var(--warning)" : "var(--danger)", fontFamily:"var(--font-mono)", lineHeight:1 }}>
              {testRun.readinessScore}%
            </div>
            <div style={{ fontSize:"0.75rem", color:"var(--muted)", marginTop:4 }}>{testRun.title}</div>
          </div>
          <span className={`badge badge-${v}`} style={{ fontSize:"0.78rem", padding:"6px 14px" }}>{testRun.readinessStatus}</span>
        </div>
      </div>
      <div className="grid-stats">
        <StatCard label="Total Tests"       value={testRun.totalTests}                                                              />
        <StatCard label="Passed"            value={testRun.passCount}    variant="success"                                          />
        <StatCard label="Warnings"          value={testRun.warnCount}    variant={testRun.warnCount > 0 ? "warning" : "success"}    />
        <StatCard label="Failed"            value={testRun.failCount}    variant={testRun.failCount > 0 ? "danger"  : "success"}    />
        <StatCard label="Blockers"          value={testRun.blockingCount} variant={testRun.blockingCount > 0 ? "danger" : "success"} />
        <StatCard label="Last Tested"       value={testRun.completedAt ? new Date(testRun.completedAt).toLocaleTimeString() : "—"}  />
      </div>
    </div>
  );
}

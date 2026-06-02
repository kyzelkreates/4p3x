// AP3X — ProductReadinessDashboard — Run 9
import StatCard from "../StatCard.jsx";
import { scoreBadgeVariant } from "../../utils/readinessScoringUtils.js";

export default function ProductReadinessDashboard({ testRun, onRunTest, running }) {
  return (
    <div className="panel" style={{ marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10, marginBottom:16 }}>
        <div>
          <div className="section-label">Product Readiness Dashboard</div>
          {testRun && (
            <div style={{ fontSize:"0.72rem", color:"var(--muted)", marginTop:2 }}>
              Last tested: {new Date(testRun.completedAt).toLocaleString()}
            </div>
          )}
        </div>
        <button
          className="btn btn-primary"
          onClick={onRunTest}
          disabled={running}
          aria-label="Run full product test"
          style={{ minWidth:200 }}
        >
          {running ? "⟳ Running Tests…" : "◉ Run Full Product Test"}
        </button>
      </div>

      {testRun ? (
        <div className="grid-stats">
          <StatCard label="Readiness Score"  value={`${testRun.readinessScore}%`} variant={scoreBadgeVariant(testRun.readinessScore)} />
          <StatCard label="Status"           value={testRun.readinessStatus}      variant={testRun.readinessScore >= 80 ? "success" : "warning"} />
          <StatCard label="Total Tests"      value={testRun.totalTests}           />
          <StatCard label="Passed"           value={testRun.passCount}            variant="success"  />
          <StatCard label="Warnings"         value={testRun.warnCount}            variant={testRun.warnCount > 0 ? "warning" : "success"} />
          <StatCard label="Failed"           value={testRun.failCount}            variant={testRun.failCount > 0 ? "danger" : "success"}  />
          <StatCard label="Critical Blockers" value={testRun.blockingCount}       variant={testRun.blockingCount > 0 ? "danger" : "success"} />
          <StatCard label="Version"          value="9.0.0"                        variant="accent"   />
        </div>
      ) : (
        <div style={{ textAlign:"center", padding:"20px 0", color:"var(--muted)", fontSize:"0.85rem" }}>
          Click "Run Full Product Test" to generate your first readiness report.
        </div>
      )}
    </div>
  );
}

// AP3X — ProjectDiscoveryDashboard — Run 10
import StatCard from "../StatCard.jsx";
import { generateInventoryStats } from "../../core/projectInventoryEngine.js";

export default function ProjectDiscoveryDashboard({ projects, onRunDiscovery, running }) {
  const stats = generateInventoryStats(projects||[]);
  return (
    <div className="panel" style={{ marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10, marginBottom:16 }}>
        <div className="section-label">Project Discovery Dashboard</div>
        <button className="btn btn-primary" onClick={onRunDiscovery} disabled={running} aria-label="Run project discovery" style={{ minWidth:200 }}>
          {running ? "⟳ Running Discovery…" : "⬡ Run Project Discovery"}
        </button>
      </div>
      <div className="grid-stats">
        <StatCard label="Total Projects"      value={stats.total}                   />
        <StatCard label="Working"             value={stats.working}                 variant="success"  />
        <StatCard label="Broken"              value={stats.broken}                  variant={stats.broken  > 0 ? "danger"  : "success"} />
        <StatCard label="Stale"               value={stats.stale}                   variant={stats.stale   > 0 ? "warning" : "success"} />
        <StatCard label="Duplicate Candidates" value={stats.duplicateCandidates}    variant={stats.duplicateCandidates > 0 ? "warning" : "success"} />
        <StatCard label="Ready For Extraction" value={stats.readyForExtraction}     variant="accent"   />
        <StatCard label="Ready For Rescue"    value={stats.readyForRescuePlan}      variant="accent"   />
        <StatCard label="Unknown Status"      value={stats.unknownStatus}           variant={stats.unknownStatus > 0 ? "warning" : "success"} />
      </div>
      {stats.total > 0 && (
        <div style={{ marginTop:12, fontSize:"0.72rem", color:"var(--muted)" }}>
          Avg Health: <span style={{ color:"var(--accent)" }}>{stats.avgHealthScore}%</span> &nbsp;|&nbsp;
          Avg Completion: <span style={{ color:"var(--accent)" }}>{stats.avgCompletionScore}%</span>
        </div>
      )}
    </div>
  );
}

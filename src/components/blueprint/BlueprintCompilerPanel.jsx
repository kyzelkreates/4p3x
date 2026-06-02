// ============================================================
// AP3X — BlueprintCompilerPanel — Run 7
// Summary cards after compilation
// ============================================================
import StatCard from "../StatCard.jsx";

export default function BlueprintCompilerPanel({ blueprint }) {
  if (!blueprint) {
    return (
      <div className="panel" style={{ textAlign:"center", padding:40 }}>
        <div style={{ fontSize:"2.5rem", marginBottom:10 }}>◑</div>
        <div style={{ color:"var(--muted)", fontSize:"0.85rem" }}>
          Select a source report and click Compile Original Blueprint.
        </div>
      </div>
    );
  }

  const score = blueprint.readinessScore || 0;

  return (
    <div>
      <div className="hero" style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
          <div>
            <div className="hero-title" style={{ fontSize:"1rem" }}>{blueprint.title}</div>
            <div style={{ fontSize:"0.78rem", color:"var(--muted)", marginTop:4 }}>{blueprint.productSummary?.slice(0, 160)}…</div>
          </div>
          <span className={`badge ${score >= 75 ? "badge-success" : score >= 50 ? "badge-warning" : "badge-danger"}`} style={{fontSize:"0.7rem"}}>
            Readiness {score}%
          </span>
        </div>
      </div>

      <div className="grid-stats">
        <StatCard label="Original App Name"  value={blueprint.originalAppName || "TBD"}            variant="accent" />
        <StatCard label="Target Users"        value={(blueprint.targetUsers || []).length}           />
        <StatCard label="Core Modules"        value={(blueprint.coreModules || []).length}           variant="accent" />
        <StatCard label="Pages / Screens"     value={(blueprint.pagePlan || []).length}              />
        <StatCard label="Data Entities"       value={(blueprint.dataModelPlan?.entities || []).length} />
        <StatCard label="Build Readiness"     value={`${score}%`}
          variant={score >= 75 ? "success" : score >= 50 ? "warning" : "danger"}
          sub={score >= 75 ? "Ready" : score >= 50 ? "Caution" : "Needs Work"} />
        <StatCard label="Implementation Runs" value={(blueprint.implementationRuns || []).length}    />
        <StatCard label="Originality Lock"    value="Active"                                         variant="success" />
      </div>

      <div style={{ marginTop:14, padding:"8px 14px", background:"rgba(0,0,0,0.2)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.68rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
        Blueprint ID: {blueprint.id} · Generated: {blueprint.createdAt ? new Date(blueprint.createdAt).toLocaleString() : "—"}
      </div>
    </div>
  );
}

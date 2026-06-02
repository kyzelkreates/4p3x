// AP3X — ProjectHealthPanel (discovery) — Run 10
import { classifyHealth } from "../../core/projectHealthClassifier.js";
import { generateNextAction } from "../../core/projectRescueQueueEngine.js";

export default function ProjectHealthPanel({ project }) {
  if (!project) return <div className="panel" style={{ color:"var(--muted)", padding:20 }}>Select a project to view its health report.</div>;
  const health   = classifyHealth(project);
  const next     = generateNextAction(project);
  const healthColor = health.healthScore >= 70 ? "var(--success)" : health.healthScore >= 40 ? "var(--warning)" : "var(--danger)";
  return (
    <div className="panel">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8, marginBottom:14 }}>
        <div style={{ fontWeight:700, fontSize:"0.9rem", color:"var(--text)" }}>{project.title}</div>
        <div style={{ display:"flex", gap:6 }}>
          <span className={`badge ${health.riskLevel==="Critical"||health.riskLevel==="High"?"badge-danger":health.riskLevel==="Medium"?"badge-warning":"badge-success"}`} style={{ fontSize:"0.65rem" }}>Risk: {health.riskLevel}</span>
          <span className={`badge ${project.status==="Working"?"badge-success":"badge-warning"}`} style={{ fontSize:"0.65rem" }}>{project.status}</span>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
        {[["Health Score", `${health.healthScore}%`, healthColor],["Completion",`${project.completionScore||0}%`,"var(--accent)"],["Risk Level",health.riskLevel,"var(--text)"]].map(([l,v,c])=>(
          <div key={l} style={{ padding:"10px 12px", background:"rgba(255,255,255,0.03)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", textAlign:"center" }}>
            <div style={{ fontSize:"1.2rem", fontWeight:800, color:c, fontFamily:"var(--font-mono)" }}>{v}</div>
            <div style={{ fontSize:"0.65rem", color:"var(--muted)", marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>
      {(project.missingSystems||[]).length > 0 && (
        <div style={{ marginBottom:10 }}>
          <div className="section-label" style={{ marginBottom:4 }}>Missing Systems</div>
          {project.missingSystems.map((m,i) => <div key={i} style={{ fontSize:"0.73rem", color:"var(--warning)", padding:"2px 0" }}>⚠ {m}</div>)}
        </div>
      )}
      {(health.risks||[]).length > 0 && (
        <div style={{ marginBottom:10 }}>
          <div className="section-label" style={{ marginBottom:4 }}>Risk Flags</div>
          {health.risks.map((r,i) => <div key={i} style={{ fontSize:"0.73rem", color:"var(--muted)", padding:"2px 0" }}>• {r.label}</div>)}
        </div>
      )}
      {(project.detectedStack||[]).length > 0 && (
        <div style={{ marginBottom:10 }}>
          <div className="section-label" style={{ marginBottom:4 }}>Detected Stack</div>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>{project.detectedStack.map((s)=><span key={s} className="badge badge-accent" style={{ fontSize:"0.62rem" }}>{s}</span>)}</div>
        </div>
      )}
      {(project.safetyWarnings||[]).length > 0 && (
        <div style={{ marginBottom:10 }}>
          <div className="section-label" style={{ marginBottom:4 }}>Safety Warnings</div>
          {project.safetyWarnings.map((w,i)=><div key={i} style={{ fontSize:"0.68rem", color:"var(--warning)", padding:"2px 0" }}>{w}</div>)}
        </div>
      )}
      <div style={{ padding:"8px 12px", background:"rgba(0,229,255,0.04)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.75rem", color:"var(--accent)", fontWeight:600 }}>
        Recommended Next Action → {next}
      </div>
    </div>
  );
}

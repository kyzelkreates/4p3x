// ============================================================
// AP3X — ProjectHealthPanel
// /src/components/ProjectHealthPanel.jsx — Run 4
// ============================================================

import StatusBadge from "./StatusBadge.jsx";
import { classifyProjectFromErrors } from "../core/errorUtils.js";
import { applyProjectHealthRecommendationById } from "../core/storage.js";

export default function ProjectHealthPanel({ project, errors }) {
  const classification = classifyProjectFromErrors(project, errors);
  const { recommendedHealth, recommendedStatus, reasons, openErrors, criticalCount, highCount, deploymentBlockers, securityIssues, dataLossRisks } = classification;

  const currentHealth = project.health || "unknown";
  const healthChanged = recommendedHealth !== "unknown" && recommendedHealth !== currentHealth;
  const statusChanged = recommendedStatus !== project.status;
  const anyChange     = healthChanged || statusChanged;

  function handleApply() {
    applyProjectHealthRecommendationById(project.id);
  }

  return (
    <div>
      {/* Summary row */}
      <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:14 }}>
        {criticalCount   > 0 && <span className="badge badge-critical" style={{fontSize:"0.68rem"}}>⛔ {criticalCount} Critical</span>}
        {deploymentBlockers>0 && <span className="badge badge-critical" style={{fontSize:"0.68rem"}}>⛔ {deploymentBlockers} Deploy Blocker{deploymentBlockers>1?"s":""}</span>}
        {highCount       > 0 && <span className="badge badge-danger"   style={{fontSize:"0.68rem"}}>⚠ {highCount} High</span>}
        {securityIssues  > 0 && <span className="badge badge-danger"   style={{fontSize:"0.68rem"}}>🔒 {securityIssues} Security</span>}
        {dataLossRisks   > 0 && <span className="badge badge-danger"   style={{fontSize:"0.68rem"}}>⚠ {dataLossRisks} Data Loss Risk</span>}
        {openErrors === 0    && <span className="badge badge-success"  style={{fontSize:"0.68rem"}}>✓ No open errors</span>}
      </div>

      {/* Stats */}
      <div style={{ display:"grid",gap:6,marginBottom:14 }}>
        {[
          ["Current Status",      <StatusBadge status={project.status} />],
          ["Current Health",      <StatusBadge status={currentHealth} />],
          ["Open Errors",         <span className="mono" style={{fontSize:"0.8rem",color: openErrors>0?"var(--danger)":"var(--success)"}}>{openErrors}</span>],
          ["Critical",            <span className="mono" style={{fontSize:"0.8rem",color: criticalCount>0?"var(--danger)":"var(--muted)"}}>{criticalCount}</span>],
          ["High Severity",       <span className="mono" style={{fontSize:"0.8rem",color: highCount>0?"var(--warning)":"var(--muted)"}}>{highCount}</span>],
          ["Deployment Blockers", <span className="mono" style={{fontSize:"0.8rem",color: deploymentBlockers>0?"var(--danger)":"var(--muted)"}}>{deploymentBlockers}</span>],
        ].map(([label, node]) => (
          <div key={label} className="setting-row">
            <span className="setting-label">{label}</span>
            {node}
          </div>
        ))}
      </div>

      {/* Recommendation */}
      {anyChange && (
        <div style={{ padding:"12px 14px",background:"rgba(245,158,11,0.05)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:"var(--radius)",marginBottom:14 }}>
          <div style={{ fontSize:"0.78rem",fontWeight:600,color:"var(--warning)",marginBottom:8 }}>Classifier Recommendation</div>
          <div style={{ display:"grid",gap:6,marginBottom:10 }}>
            {healthChanged && (
              <div className="setting-row">
                <span className="setting-label">Recommended Health</span>
                <StatusBadge status={recommendedHealth} />
              </div>
            )}
            {statusChanged && (
              <div className="setting-row">
                <span className="setting-label">Recommended Status</span>
                <StatusBadge status={recommendedStatus} />
              </div>
            )}
          </div>
          {reasons.map((r,i) => (
            <div key={i} style={{fontSize:"0.73rem",color:"var(--muted)",padding:"2px 0"}}>→ {r}</div>
          ))}
          <button className="btn btn-warning btn-sm" style={{marginTop:12}} onClick={handleApply}>
            ✓ Apply Recommendation
          </button>
        </div>
      )}

      {!anyChange && (
        <div style={{fontSize:"0.75rem",color:"var(--muted)"}}>
          {openErrors === 0
            ? "Project health matches classifier recommendation — no changes needed."
            : "Classifier recommendation matches current status."}
        </div>
      )}

      <div style={{marginTop:10,padding:"8px 12px",background:"rgba(0,229,255,0.03)",border:"1px solid var(--border2)",borderRadius:"var(--radius)",fontSize:"0.68rem",color:"var(--muted)",fontFamily:"var(--font-mono)"}}>
        Classification is deterministic and local-only. No AI. Applying updates project through storage.js SSOT only.
      </div>
    </div>
  );
}

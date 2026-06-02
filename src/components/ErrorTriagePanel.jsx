// ============================================================
// AP3X — ErrorTriagePanel
// /src/components/ErrorTriagePanel.jsx — Run 4
// ============================================================

import StatusBadge from "./StatusBadge.jsx";
import { applyProjectClassificationFromError, markErrorFixed, markErrorReopened, updateError } from "../core/storage.js";
import { ERROR_STATUSES, ERROR_SEVERITIES } from "../core/constants.js";

export default function ErrorTriagePanel({ error, project }) {
  const c = error.classification || {};

  function handleUpdateStatus(newStatus) { updateError(error.id, { status: newStatus }); }
  function handleMarkFixed()  { markErrorFixed(error.id, ""); }
  function handleReopen()     { markErrorReopened(error.id, ""); }
  function handleApplyToProject() { applyProjectClassificationFromError(error.id); }

  const isResolved = error.status === "fixed" || error.status === "validated";
  const isOpen     = error.status === "open"  || error.status === "investigating" || error.status === "reopened";

  return (
    <div>
      {/* Flags */}
      <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:14 }}>
        {c.isDeploymentBlocking && <span className="badge badge-critical" style={{fontSize:"0.68rem"}}>⛔ Deployment Blocker</span>}
        {c.isSecurityRelated    && <span className="badge badge-danger"   style={{fontSize:"0.68rem"}}>🔒 Security</span>}
        {c.isDataLossRisk       && <span className="badge badge-danger"   style={{fontSize:"0.68rem"}}>⚠ Data Loss</span>}
        {c.isRegression         && <span className="badge badge-warning"  style={{fontSize:"0.68rem"}}>↩ Regression</span>}
        {c.isRecurring          && <span className="badge badge-warning"  style={{fontSize:"0.68rem"}}>↻ Recurring</span>}
        {c.isBlocking           && <span className="badge badge-danger"   style={{fontSize:"0.68rem"}}>⛔ Blocking</span>}
        {error.flags?.needsHumanReview && <span className="badge badge-warning" style={{fontSize:"0.68rem"}}>👤 Human Review</span>}
      </div>

      {/* Triage details */}
      <div style={{ display:"grid",gap:6,marginBottom:14 }}>
        {[
          ["Severity",   <StatusBadge status={error.severity} />],
          ["Status",     <StatusBadge status={error.status}   />],
          ["Priority",   <span className="badge badge-muted" style={{fontSize:"0.72rem"}}>{error.priority}</span>],
          ...(c.recommendedProjectStatus ? [["Recommended Project Status", <StatusBadge status={c.recommendedProjectStatus} />]] : []),
          ...(c.recommendedHealth        ? [["Recommended Health",         <StatusBadge status={c.recommendedHealth} />]]        : []),
          ...(project                    ? [["Current Project Status",     <StatusBadge status={project.status} />]]             : []),
        ].map(([label, node]) => (
          <div key={label} className="setting-row">
            <span className="setting-label">{label}</span>
            {node}
          </div>
        ))}
      </div>

      {/* Quick status change */}
      <div style={{ marginBottom:14 }}>
        <div className="section-label" style={{marginBottom:8}}>Quick Status</div>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {ERROR_STATUSES.map((s) => (
            s.value !== "archived" && (
              <button
                key={s.value}
                className={`btn btn-sm ${error.status === s.value ? "btn-primary" : "btn-ghost"}`}
                onClick={() => handleUpdateStatus(s.value)}
                aria-label={`Set status to ${s.label}`}
                aria-pressed={error.status === s.value}
              >
                {s.label}
              </button>
            )
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:14 }}>
        {!isResolved && isOpen && (
          <button className="btn btn-success btn-sm" onClick={handleMarkFixed}>
            ✓ Mark Fixed
          </button>
        )}
        {isResolved && (
          <button className="btn btn-warning btn-sm" onClick={handleReopen}>
            ↩ Reopen
          </button>
        )}
        {project && (
          <button className="btn btn-ghost btn-sm" onClick={handleApplyToProject}>
            ⬡ Apply to Project Health
          </button>
        )}
      </div>

      <div style={{padding:"8px 12px",background:"rgba(0,229,255,0.03)",border:"1px solid var(--border2)",borderRadius:"var(--radius)",fontSize:"0.68rem",color:"var(--muted)",fontFamily:"var(--font-mono)"}}>
        Triage is local-only. Applying project classification updates through storage.js SSOT only.
        No automatic changes occur until you click "Apply to Project Health".
      </div>
    </div>
  );
}

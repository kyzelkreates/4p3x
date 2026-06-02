// ============================================================
// AP3X — ErrorClassifierPanel
// /src/components/ErrorClassifierPanel.jsx — Run 4
// Local-only deterministic classifier. No AI.
// ============================================================

import StatusBadge from "./StatusBadge.jsx";

const SEV_LABELS  = { low:"Low",medium:"Medium",high:"High",critical:"Critical" };
const STA_LABELS  = { open:"Open",investigating:"Investigating",fix_planned:"Fix Planned",fix_in_progress:"Fix In Progress",fixed:"Fixed",validated:"Validated",reopened:"Reopened",ignored:"Ignored",archived:"Archived" };

export default function ErrorClassifierPanel({ error, project }) {
  const sev  = error.severity || "medium";
  const stat = error.status   || "open";
  const cat  = error.category || "unknown";
  const isOpen       = stat === "open" || stat === "investigating" || stat === "reopened";
  const isBlocking   = !!error.classification?.isDeploymentBlocking;
  const isSecurity   = !!error.classification?.isSecurityRelated;
  const isDataLoss   = !!error.classification?.isDataLossRisk;
  const isRegression = !!error.classification?.isRegression;
  const isFixed      = stat === "fixed" || stat === "validated" || stat === "ignored";

  // Deterministic classification
  let recommendedHealth = "unknown";
  let recommendedStatus = project?.status || "unknown";
  const reasons = [];

  if (!isFixed && isOpen) {
    if (sev === "critical")            { recommendedHealth = "critical"; recommendedStatus = "broken"; reasons.push("Critical severity unresolved"); }
    else if (sev === "high")           { recommendedHealth = "broken";   recommendedStatus = "broken"; reasons.push("High severity unresolved"); }
    else if (sev === "medium")         { recommendedHealth = "warning";  recommendedStatus = "partial"; reasons.push("Medium severity open"); }
    else if (sev === "low")            { recommendedHealth = "warning";  }
    if (isBlocking)                    { reasons.push("Deployment blocker — live deployment at risk"); }
    if (isSecurity)                    { reasons.push("Security-related — review required"); }
    if (isDataLoss)                    { reasons.push("Data loss risk — immediate attention"); }
    if (isRegression)                  { reasons.push("Regression — previously working functionality broken"); }
  } else if (isFixed) {
    if (project) {
      recommendedHealth = (project.flags?.isInvestorReady || project.status === "investor_ready") && (project.flags?.isDeployed || project.status === "deployed")
        ? "excellent" : (project.status === "working" || project.status === "deployed") ? "good" : "warning";
    }
    reasons.push("Error resolved — project health can improve");
  }

  const riskLevel = sev === "critical" ? "CRITICAL RISK"
    : sev === "high"     ? "HIGH RISK"
    : sev === "medium"   ? "MEDIUM RISK"
    : "LOW RISK";

  const riskCls = sev === "critical" ? "badge-critical"
    : sev === "high" ? "badge-danger"
    : sev === "medium" ? "badge-warning"
    : "badge-muted";

  return (
    <div>
      {/* Risk summary */}
      <div style={{ display:"flex",gap:10,alignItems:"center",marginBottom:14,flexWrap:"wrap" }}>
        <span className={`badge ${riskCls}`} style={{ fontSize:"0.75rem",fontWeight:700 }}>
          {riskLevel}
        </span>
        {isBlocking  && <span className="badge badge-critical" style={{ fontSize:"0.68rem" }}>⛔ Deployment Blocker</span>}
        {isSecurity  && <span className="badge badge-danger"   style={{ fontSize:"0.68rem" }}>🔒 Security Risk</span>}
        {isDataLoss  && <span className="badge badge-danger"   style={{ fontSize:"0.68rem" }}>⚠ Data Loss Risk</span>}
        {isRegression&& <span className="badge badge-warning"  style={{ fontSize:"0.68rem" }}>↩ Regression</span>}
      </div>

      {/* Classification table */}
      <div style={{ display:"grid",gap:8 }}>
        {[
          ["Error Severity",    <StatusBadge status={sev} label={SEV_LABELS[sev]} />],
          ["Error Status",      <StatusBadge status={stat} label={STA_LABELS[stat] || stat} />],
          ["Category",          <span className="badge badge-muted" style={{fontSize:"0.72rem"}}>{cat.replace(/_/g," ")}</span>],
          ["Deployment Blocker",<span className={`badge ${isBlocking?"badge-critical":"badge-muted"}`} style={{fontSize:"0.68rem"}}>{isBlocking?"Yes":"No"}</span>],
          ["Security Related",  <span className={`badge ${isSecurity?"badge-danger":"badge-muted"}`}   style={{fontSize:"0.68rem"}}>{isSecurity?"Yes":"No"}</span>],
          ["Data Loss Risk",    <span className={`badge ${isDataLoss?"badge-danger":"badge-muted"}`}   style={{fontSize:"0.68rem"}}>{isDataLoss?"Yes":"No"}</span>],
          ["Regression",        <span className={`badge ${isRegression?"badge-warning":"badge-muted"}`} style={{fontSize:"0.68rem"}}>{isRegression?"Yes":"No"}</span>],
        ].map(([label, node]) => (
          <div key={label} className="setting-row">
            <span className="setting-label">{label}</span>
            {node}
          </div>
        ))}
        {project && (
          <>
            <div className="setting-row">
              <span className="setting-label">Current Project Status</span>
              <StatusBadge status={project.status} />
            </div>
            <div className="setting-row">
              <span className="setting-label">Recommended Health</span>
              <StatusBadge status={recommendedHealth} />
            </div>
            <div className="setting-row">
              <span className="setting-label">Recommended Status</span>
              <StatusBadge status={recommendedStatus} />
            </div>
          </>
        )}
      </div>

      {/* Reasons */}
      {reasons.length > 0 && (
        <div style={{ marginTop:14 }}>
          <div className="section-label" style={{marginBottom:8}}>Classification Reasons</div>
          {reasons.map((r, i) => (
            <div key={i} style={{ fontSize:"0.75rem",color:"var(--muted)",padding:"4px 0",borderBottom:"1px solid var(--border2)" }}>
              → {r}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop:12,padding:"8px 12px",background:"rgba(0,229,255,0.03)",border:"1px solid var(--border2)",borderRadius:"var(--radius)",fontSize:"0.68rem",color:"var(--muted)",fontFamily:"var(--font-mono)" }}>
        Classifier is deterministic and local-only. No AI calls made. Recommendations require user confirmation before applying.
      </div>
    </div>
  );
}

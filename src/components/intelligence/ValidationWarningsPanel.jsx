// ============================================================
// AP3X — ValidationWarningsPanel — Run 6
// ============================================================

import { groupBySeverity, hasBlockingIssues } from "../../core/architectureValidationEngine.js";
import { getSeverityVariant } from "../../utils/blueprintFormatUtils.js";

function WarningRow({ w }) {
  return (
    <div style={{
      padding:"10px 14px", marginBottom:8,
      background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)",
      borderRadius:"var(--radius)",
      borderLeft:`3px solid ${w.severity==="critical"||w.severity==="high"?"var(--danger)":w.severity==="medium"?"var(--warning)":"var(--border2)"}`,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, flexWrap:"wrap" }}>
        <div style={{ fontWeight:600, fontSize:"0.82rem", color:"var(--text)" }}>
          {w.blocking && <span style={{ color:"var(--danger)", marginRight:6 }}>⛔</span>}
          {w.title}
        </div>
        <div style={{ display:"flex", gap:5 }}>
          <span className={`badge ${getSeverityVariant(w.severity)}`} style={{fontSize:"0.62rem"}}>{w.severity.toUpperCase()}</span>
          {w.blocking && <span className="badge badge-critical" style={{fontSize:"0.62rem"}}>BLOCKING</span>}
        </div>
      </div>
      <div style={{ fontSize:"0.75rem", color:"var(--muted)", marginTop:4 }}>{w.description}</div>
      <div style={{ fontSize:"0.73rem", color:"var(--accent)", marginTop:4 }}>
        <strong>Fix:</strong> {w.recommendedFix}
      </div>
      {w.category && (
        <div style={{ marginTop:4 }}>
          <span className="badge badge-muted" style={{fontSize:"0.6rem"}}>{w.category}</span>
        </div>
      )}
    </div>
  );
}

function SevGroup({ label, items, variant }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <span className={`badge ${variant}`}>{label.toUpperCase()}</span>
        <span style={{ fontSize:"0.72rem", color:"var(--muted)" }}>{items.length} issue{items.length !== 1 ? "s" : ""}</span>
      </div>
      {items.map((w) => <WarningRow key={w.id || w.ruleId} w={w} />)}
    </div>
  );
}

export default function ValidationWarningsPanel({ report }) {
  const warnings = report?.riskWarnings || [];

  if (!report) {
    return <div className="panel" style={{color:"var(--muted)",fontSize:"0.85rem",padding:20}}>Generate a report to see validation warnings.</div>;
  }

  if (warnings.length === 0) {
    return (
      <div className="panel" style={{ textAlign:"center", padding:30 }}>
        <div style={{ fontSize:"1.5rem", marginBottom:8 }}>✓</div>
        <div style={{ color:"var(--success)", fontWeight:600 }}>All validation checks passed</div>
        <div style={{ color:"var(--muted)", fontSize:"0.75rem", marginTop:4 }}>No warnings detected.</div>
      </div>
    );
  }

  const grouped = groupBySeverity(warnings);
  const blocking = hasBlockingIssues(warnings);

  return (
    <div>
      {blocking && (
        <div className="alert alert-danger" style={{ marginBottom:16 }}>
          ⛔ Blocking issues present — resolve these before starting a build.
        </div>
      )}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
        {grouped.critical.length > 0 && <span className="badge badge-critical">{grouped.critical.length} critical</span>}
        {grouped.high.length     > 0 && <span className="badge badge-danger"  >{grouped.high.length}     high</span>}
        {grouped.medium.length   > 0 && <span className="badge badge-warning" >{grouped.medium.length}   medium</span>}
        {grouped.low.length      > 0 && <span className="badge badge-muted"   >{grouped.low.length}      low</span>}
      </div>
      <SevGroup label="Critical" items={grouped.critical} variant="badge-critical" />
      <SevGroup label="High"     items={grouped.high}     variant="badge-danger"   />
      <SevGroup label="Medium"   items={grouped.medium}   variant="badge-warning"  />
      <SevGroup label="Low"      items={grouped.low}      variant="badge-muted"    />
    </div>
  );
}

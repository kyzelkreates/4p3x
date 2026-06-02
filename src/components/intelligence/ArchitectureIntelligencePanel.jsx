// ============================================================
// AP3X — ArchitectureIntelligencePanel — Run 6
// ============================================================

import StatusBadge from "../StatusBadge.jsx";
import StatCard    from "../StatCard.jsx";
import { getAllScores } from "../../utils/architectureScoringUtils.js";
import { formatPercent } from "../../utils/blueprintFormatUtils.js";

export default function ArchitectureIntelligencePanel({ report }) {
  if (!report) {
    return (
      <div className="panel" style={{ textAlign:"center", padding:40 }}>
        <div style={{ fontSize:"2rem", marginBottom:10 }}>◈</div>
        <div style={{ color:"var(--muted)", fontSize:"0.85rem" }}>No report generated yet.</div>
        <div style={{ color:"var(--muted)", fontSize:"0.75rem", marginTop:4 }}>
          Select a source and click Generate Architecture Intelligence.
        </div>
      </div>
    );
  }

  const scores = getAllScores(report);
  const bp     = report.rebuildBlueprint;

  return (
    <div>
      {/* Summary banner */}
      <div className="hero" style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
          <div style={{ flex:1 }}>
            <div className="hero-title" style={{ fontSize:"1rem" }}>{report.title}</div>
            <div style={{ fontSize:"0.8rem", color:"var(--muted)", marginTop:6 }}>{report.summary}</div>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            <StatusBadge status={report.appType?.primary === "Unknown / General App" ? "unknown" : "working"} label={report.appType?.primary || "Unknown"} />
            <StatusBadge status={report.validationStatus === "passed" ? "success" : report.validationStatus === "blocked" ? "danger" : "warning"} label={report.validationStatus?.replace("_"," ")} />
          </div>
        </div>
      </div>

      {/* Score cards */}
      <div className="grid-stats">
        <StatCard label="Confidence"          value={formatPercent(report.confidenceScore)}       variant={report.confidenceScore >= 70 ? "success" : report.confidenceScore >= 40 ? "warning" : "danger"} />
        <StatCard label="Build Readiness"     value={formatPercent(scores.buildReadiness)}        variant={scores.buildReadiness >= 70 ? "success" : scores.buildReadiness >= 40 ? "warning" : "danger"} sub={scores.buildReadinessLabel} />
        <StatCard label="Risk Level"          value={scores.riskLevel.level}                       variant={scores.riskLevel.level === "Low" ? "success" : scores.riskLevel.level === "Medium" ? "warning" : "danger"} />
        <StatCard label="Missing Systems"     value={report.missingSystems?.length ?? 0}           variant={(report.missingSystems?.length ?? 0) > 3 ? "danger" : (report.missingSystems?.length ?? 0) > 0 ? "warning" : "success"} />
        <StatCard label="Originality Safety"  value={formatPercent(scores.originalitySafety)}     variant={scores.originalitySafety >= 80 ? "success" : "warning"} />
        <StatCard label="Arch Completeness"   value={formatPercent(scores.architectureCompleteness)} variant={scores.architectureCompleteness >= 70 ? "success" : "warning"} />
      </div>

      <div className="accent-line" />

      {/* App type */}
      <div className="section">
        <div className="section-label">App Type Classification</div>
        <div className="panel">
          <div className="setting-row">
            <span className="setting-label">Primary Type</span>
            <span style={{ color:"var(--accent)", fontWeight:600 }}>{report.appType?.primary || "Unknown"}</span>
          </div>
          {(report.appType?.secondary || []).length > 0 && (
            <div className="setting-row">
              <span className="setting-label">Secondary Signals</span>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {report.appType.secondary.map((s) => <span key={s} className="badge badge-muted" style={{fontSize:"0.7rem"}}>{s}</span>)}
              </div>
            </div>
          )}
          <div className="setting-row">
            <span className="setting-label">Detection Confidence</span>
            <span style={{ color:"var(--muted)" }}>{report.appType?.confidence || 0}%</span>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="section">
        <div className="section-label">Detected Modules ({(report.modules || []).filter(m=>m.detected).length} active)</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:10 }}>
          {(report.modules || []).map((m) => (
            <div key={m.id} className="panel-sm" style={{ borderLeft:`3px solid ${m.detected ? "var(--accent)" : "var(--border2)"}`, opacity: m.detected ? 1 : 0.65 }}>
              <div style={{ fontWeight:600, fontSize:"0.82rem", color: m.detected ? "var(--text)" : "var(--muted)", marginBottom:4 }}>{m.name}</div>
              <div style={{ fontSize:"0.73rem", color:"var(--muted)", marginBottom:6 }}>{m.description}</div>
              <div style={{ display:"flex", gap:5 }}>
                <span className={`badge ${m.detected ? "badge-success" : "badge-muted"}`} style={{fontSize:"0.62rem"}}>{m.detected ? "Detected" : "Inferred"}</span>
                <span className="badge badge-muted" style={{fontSize:"0.62rem"}}>{m.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Screens */}
      <div className="section">
        <div className="section-label">Screen / Page Map</div>
        <div className="panel">
          {(report.screens || []).map((s) => (
            <div key={s.id} className="setting-row">
              <div>
                <div style={{ fontSize:"0.82rem", fontWeight:600, color:"var(--text)" }}>{s.name}</div>
                <div style={{ fontSize:"0.72rem", color:"var(--muted)" }}>{s.description}</div>
              </div>
              <span className={`badge ${s.type === "primary" ? "badge-accent" : s.type === "future" ? "badge-locked" : "badge-muted"}`} style={{fontSize:"0.62rem"}}>{s.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User journeys */}
      <div className="section">
        <div className="section-label">User Journeys</div>
        <div className="panel">
          {(report.userJourneys || []).map((j) => (
            <div key={j.id} style={{ marginBottom:14, paddingBottom:14, borderBottom:"1px solid var(--border2)" }}>
              <div style={{ fontWeight:600, fontSize:"0.82rem", color:"var(--text)", marginBottom:6 }}>{j.name}</div>
              {(j.steps || []).map((step, i) => (
                <div key={i} style={{ fontSize:"0.75rem", color:"var(--muted)", padding:"2px 0" }}>→ {step}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Timestamp */}
      <div style={{ marginTop:10, fontSize:"0.68rem", color:"var(--muted)", fontFamily:"var(--font-mono)", textAlign:"right" }}>
        Report generated: {report.createdAt ? new Date(report.createdAt).toLocaleString() : "—"}
      </div>
    </div>
  );
}

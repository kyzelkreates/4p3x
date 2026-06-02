// ============================================================
// AP3X — RiskScorecardPreview — Run 8
// ============================================================
export default function RiskScorecardPreview({ exportPack }) {
  const risk = exportPack?.riskScorecard;
  if (!risk) return <div className="panel" style={{ color: "var(--muted)", padding: 20 }}>No risk scorecard generated yet.</div>;
  const areas = [
    ["architectureCompleteness", "Architecture Completeness"],
    ["dataClarity",              "Data Clarity"],
    ["workflowClarity",          "Workflow Clarity"],
    ["buildReadiness",           "Build Readiness"],
    ["originalitySafety",        "Originality Safety"],
    ["implementationComplexity", "Implementation Complexity"],
  ];
  function bar(score) {
    const color = score >= 70 ? "var(--success)" : score >= 45 ? "var(--warning)" : "var(--danger)";
    return (
      <div style={{ flex: 1, height: 8, background: "var(--bg3)", borderRadius: 4, overflow: "hidden", minWidth: 80 }}>
        <div style={{ width: `${Math.min(score, 100)}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.4s" }} />
      </div>
    );
  }
  return (
    <div className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div className="section-label">Risk Scorecard</div>
        <span className={`badge ${risk.overallRisk === "High" ? "badge-danger" : risk.overallRisk === "Medium" ? "badge-warning" : "badge-success"}`} style={{ fontSize: "0.7rem" }}>
          Overall: {risk.overallRisk}
        </span>
      </div>
      {areas.map(([key, label]) => risk[key] && (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ minWidth: 180, fontSize: "0.75rem", color: "var(--text)" }}>{label}</div>
          {bar(risk[key].score)}
          <div style={{ minWidth: 40, fontSize: "0.72rem", color: "var(--muted)", textAlign: "right" }}>{risk[key].score}%</div>
          <span className={`badge ${risk[key].label === "High" || risk[key].label === "Needs Work" ? "badge-warning" : "badge-success"}`} style={{ fontSize: "0.58rem", minWidth: 60, textAlign: "center" }}>{risk[key].label}</span>
        </div>
      ))}
      <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(0,229,255,0.03)", border: "1px solid var(--border2)", borderRadius: "var(--radius)", fontSize: "0.78rem", color: "var(--muted)" }}>
        {risk.recommendation}
      </div>
    </div>
  );
}

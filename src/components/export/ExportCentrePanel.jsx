// ============================================================
// AP3X — ExportCentrePanel — Run 8 — Summary cards
// ============================================================
import StatCard from "../StatCard.jsx";

export default function ExportCentrePanel({ exportPack }) {
  if (!exportPack) return (
    <div className="panel" style={{ textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>↓</div>
      <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Select sources and generate an export pack.</div>
    </div>
  );

  const risk = exportPack.riskScorecard || {};
  const cr   = exportPack.clientReport  || {};
  const osr  = exportPack.originalitySafetyReport || {};
  const sections = [
    exportPack.clientReport          && "Client Report",
    exportPack.investorSummary       && "Investor Summary",
    exportPack.developerBrief        && "Developer Brief",
    exportPack.riskScorecard         && "Risk Scorecard",
    exportPack.originalitySafetyReport && "Originality Safety",
    exportPack.implementationRoadmap && "Implementation Roadmap",
    exportPack.buildPromptPack?.hasPrompt && "Build Prompt Pack",
  ].filter(Boolean);

  return (
    <div>
      <div className="hero" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div className="hero-title" style={{ fontSize: "1rem" }}>{exportPack.title}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 4, fontFamily: "var(--font-mono)" }}>
              Pack ID: {exportPack.id} · Generated: {exportPack.createdAt ? new Date(exportPack.createdAt).toLocaleString() : "—"}
            </div>
          </div>
          <span className="badge badge-success" style={{ fontSize: "0.7rem" }}>{sections.length} sections</span>
        </div>
      </div>
      <div className="grid-stats">
        <StatCard label="Export Type"        value={exportPack.exportType || "—"}                    />
        <StatCard label="Build Readiness"    value={`${cr.buildReadinessScore || 0}%`}  variant={cr.buildReadinessScore >= 75 ? "success" : "warning"} />
        <StatCard label="Overall Risk"       value={risk.overallRisk || "—"}            variant={risk.overallRisk === "High" ? "danger" : risk.overallRisk === "Medium" ? "warning" : "success"} />
        <StatCard label="Originality Safety" value={osr.status || "SAFE"}               variant={osr.passed !== false ? "success" : "danger"} />
        <StatCard label="Source Report"      value={exportPack.sourceReportId    ? "✓" : "—"} />
        <StatCard label="Source Blueprint"   value={exportPack.sourceBlueprintId ? "✓" : "—"} />
        <StatCard label="Sections Included"  value={sections.length}                    variant="accent" />
        <StatCard label="Safety Notice"      value="Included"                           variant="success" />
      </div>
      <div style={{ marginTop: 12, padding: "8px 14px", background: "rgba(0,229,255,0.03)", border: "1px solid var(--border2)", borderRadius: "var(--radius)", fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
        Sections: {sections.join(" · ")}
      </div>
    </div>
  );
}

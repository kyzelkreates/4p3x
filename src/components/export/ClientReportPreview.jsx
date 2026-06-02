// ============================================================
// AP3X — ClientReportPreview — Run 8
// ============================================================
export default function ClientReportPreview({ exportPack }) {
  const cr = exportPack?.clientReport;
  if (!cr) return <div className="panel" style={{ color: "var(--muted)", padding: 20 }}>No client report generated yet.</div>;
  function Section({ title, children }) {
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--accent)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>{title}</div>
        {children}
      </div>
    );
  }
  return (
    <div className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>{cr.title}</div>
        <div style={{ display: "flex", gap: 6 }}>
          <span className={`badge ${cr.buildReadinessScore >= 75 ? "badge-success" : "badge-warning"}`} style={{ fontSize: "0.65rem" }}>Readiness {cr.buildReadinessScore || 0}%</span>
          <span className={`badge ${cr.overallRisk === "High" ? "badge-danger" : cr.overallRisk === "Medium" ? "badge-warning" : "badge-success"}`} style={{ fontSize: "0.65rem" }}>Risk: {cr.overallRisk}</span>
        </div>
      </div>
      <Section title="Executive Summary"><div style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.7 }}>{cr.executiveSummary}</div></Section>
      <Section title="Architecture Overview"><div style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{cr.architectureOverview}</div></Section>
      <Section title="Risk Summary"><div style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{cr.riskSummary}</div></Section>
      <Section title="Recommendations">
        {(cr.recommendations || []).map((r, i) => <div key={i} style={{ fontSize: "0.75rem", color: "var(--muted)", padding: "2px 0" }}>→ {r}</div>)}
      </Section>
      <Section title="Next Steps">
        {(cr.nextSteps || []).map((s, i) => <div key={i} style={{ fontSize: "0.75rem", color: "var(--muted)", padding: "2px 0" }}>{i + 1}. {s}</div>)}
      </Section>
      <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "var(--radius)", fontSize: "0.68rem", color: "var(--muted)" }}>
        {cr.disclaimer}
      </div>
    </div>
  );
}

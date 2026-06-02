// ============================================================
// AP3X — InvestorSummaryPreview — Run 8
// ============================================================
export default function InvestorSummaryPreview({ exportPack }) {
  const inv = exportPack?.investorSummary;
  if (!inv) return <div className="panel" style={{ color: "var(--muted)", padding: 20 }}>No investor summary generated yet.</div>;
  function Row({ label, value }) {
    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--accent)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
        <div style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.7 }}>{value}</div>
      </div>
    );
  }
  return (
    <div className="panel">
      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", marginBottom: 14 }}>{inv.executiveHeadline}</div>
      <Row label="Market Positioning"  value={inv.marketPositioning}  />
      <Row label="Product Opportunity" value={inv.productOpportunity} />
      <Row label="Technical Advantage" value={inv.technicalMoat}      />
      <Row label="Scalability"         value={inv.scalability}        />
      <Row label="Demo Narrative"      value={inv.demoNarrative}      />
      <Row label="Risk Summary"        value={inv.riskSummary}        />
      <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "var(--radius)", fontSize: "0.72rem", color: "var(--muted)", marginTop: 10, fontStyle: "italic" }}>
        {inv.caution}
      </div>
      <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "var(--radius)", fontSize: "0.68rem", color: "var(--muted)" }}>
        {inv.disclaimer}
      </div>
    </div>
  );
}

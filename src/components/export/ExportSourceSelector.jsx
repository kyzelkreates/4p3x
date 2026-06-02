// ============================================================
// AP3X — ExportSourceSelector — Run 8
// ============================================================
export default function ExportSourceSelector({ reports, blueprints, selectedReportId, selectedBlueprintId, onSelectReport, onSelectBlueprint }) {
  return (
    <div className="panel" style={{ marginBottom: 16 }}>
      <div className="section-label" style={{ marginBottom: 12 }}>Source Selection</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label className="form-label" htmlFor="export-report-sel">Architecture Report (Run 6)</label>
          <select id="export-report-sel" className="form-select" value={selectedReportId || ""} onChange={(e) => onSelectReport(e.target.value)} aria-label="Select report">
            <option value="">— None —</option>
            {[...(reports || [])].reverse().map((r) => (
              <option key={r.id} value={r.id}>{r.isDemo ? "⚠ DEMO — " : ""}{r.title} ({new Date(r.createdAt).toLocaleDateString()})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="export-blueprint-sel">Original Blueprint (Run 7)</label>
          <select id="export-blueprint-sel" className="form-select" value={selectedBlueprintId || ""} onChange={(e) => onSelectBlueprint(e.target.value)} aria-label="Select blueprint">
            <option value="">— None —</option>
            {[...(blueprints || [])].reverse().map((b) => (
              <option key={b.id} value={b.id}>{b.title} ({new Date(b.createdAt).toLocaleDateString()})</option>
            ))}
          </select>
        </div>
      </div>
      {!selectedReportId && !selectedBlueprintId && (
        <div className="alert alert-warning" style={{ marginTop: 10 }} role="status">
          Select at least one source to generate an export pack.
        </div>
      )}
    </div>
  );
}

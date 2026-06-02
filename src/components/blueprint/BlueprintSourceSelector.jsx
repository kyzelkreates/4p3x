// ============================================================
// AP3X — BlueprintSourceSelector — Run 7
// ============================================================
import { BLUEPRINT_TARGET_TOOLS } from "../../core/constants.js";

export default function BlueprintSourceSelector({ reports, settings, onSettingsChange, selectedReportId, onSelectReport, onCompile, compiling }) {
  const hasReports = Array.isArray(reports) && reports.length > 0;

  function toggle(key) { onSettingsChange({ ...settings, [key]: !settings[key] }); }

  return (
    <div className="panel" style={{ marginBottom:20 }}>
      <div className="section-label" style={{ marginBottom:14 }}>Source + Compiler Settings</div>

      {/* Report selector */}
      <div style={{ marginBottom:16 }}>
        <label className="form-label" htmlFor="report-select">Architecture Intelligence Report</label>
        {!hasReports ? (
          <div className="alert alert-warning" role="status" style={{ marginTop:6 }}>
            ⚠ No architecture reports found. Generate a Run 6 Architecture Intelligence report first.
          </div>
        ) : (
          <select
            id="report-select"
            className="form-select"
            value={selectedReportId || ""}
            onChange={(e) => onSelectReport(e.target.value)}
            aria-label="Select source architecture report"
          >
            <option value="">— Select a report —</option>
            {[...reports].reverse().map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} ({new Date(r.createdAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Target tool */}
      <div style={{ marginBottom:16 }}>
        <label className="form-label" htmlFor="tool-select">Target Tool</label>
        <select
          id="tool-select"
          className="form-select"
          value={settings?.targetTool || "developer"}
          onChange={(e) => onSettingsChange({ ...settings, targetTool: e.target.value })}
          aria-label="Select target build tool"
        >
          {BLUEPRINT_TARGET_TOOLS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Settings toggles */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:8, marginBottom:16 }}>
        {[
          ["originalityStrictMode", "Originality Strict Mode"],
          ["includeFolderStructure","Include Folder Structure"],
          ["includeStatePlan",      "Include State Plan"],
          ["includeUXPlan",         "Include UX Flow Plan"],
          ["includeValidationPlan", "Include Validation Plan"],
          ["includeDeploymentPlan", "Include Deployment Plan"],
          ["includeRunPlan",        "Include 10-Run Plan"],
        ].map(([key, label]) => (
          <label key={key} style={{ display:"flex", gap:8, alignItems:"center", cursor:"pointer", fontSize:"0.8rem", color:"var(--text)", padding:"6px 0" }}>
            <input
              type="checkbox"
              checked={!!(settings?.[key])}
              onChange={() => toggle(key)}
              aria-label={label}
              style={{ accentColor:"var(--accent)", width:14, height:14 }}
            />
            {label}
          </label>
        ))}
      </div>

      {/* Compile button */}
      <button
        className="btn btn-primary"
        onClick={onCompile}
        disabled={compiling || !selectedReportId}
        aria-label="Compile original blueprint"
        style={{ width:"100%" }}
      >
        {compiling ? "⟳ Compiling…" : "◑ Compile Original Blueprint"}
      </button>
    </div>
  );
}

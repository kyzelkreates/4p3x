// ============================================================
// AP3X — ExportSettingsPanel — Run 8
// ============================================================
export default function ExportSettingsPanel({ settings, onChange }) {
  function tog(key) { onChange({ ...settings, [key]: !settings[key] }); }
  const opts = [
    ["includeBranding",             "Include Branding Header"],
    ["includeSafetyNotice",         "Include Safety Notice (always recommended)"],
    ["includeRiskScorecard",        "Include Risk Scorecard"],
    ["includeImplementationRoadmap","Include Implementation Roadmap"],
    ["includeBuildPrompt",          "Include Build Prompt Pack"],
    ["includeDeveloperBrief",       "Include Developer Brief"],
    ["includeInvestorSummary",      "Include Investor Summary"],
    ["includeClientReport",         "Include Client Report"],
    ["includePrintLayout",          "Include Print Layout"],
  ];
  return (
    <div className="panel" style={{ marginBottom: 16 }}>
      <div className="section-label" style={{ marginBottom: 10 }}>Export Settings</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px,1fr))", gap: 8 }}>
        {opts.map(([key, label]) => (
          <label key={key} style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer", fontSize: "0.8rem", color: "var(--text)", padding: "4px 0" }}>
            <input type="checkbox" checked={!!settings?.[key]} onChange={() => tog(key)} aria-label={label} style={{ accentColor: "var(--accent)", width: 14, height: 14 }} />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}

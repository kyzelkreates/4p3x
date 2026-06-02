// ============================================================
// AP3X — DemoModePanel — Run 8
// ============================================================
import { DEMO_TYPES } from "../../core/constants.js";
import { createSaaSDashboardDemo, createLocalFirstPWADemo, createBookingPlatformDemo } from "../../core/demoModeEngine.js";
import { setDemoMode, setDemoProjects } from "../../core/storage.js";

export default function DemoModePanel({ demoModeEnabled, onLoadDemo }) {
  const demoLoaders = {
    saas:    createSaaSDashboardDemo,
    pwa:     createLocalFirstPWADemo,
    booking: createBookingPlatformDemo,
  };
  function handleLoad(demoId) {
    const loader = demoLoaders[demoId];
    if (!loader) return;
    const demo = loader();
    onLoadDemo(demo);
  }
  return (
    <div className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div className="section-label">Demo Mode</div>
        {demoModeEnabled && (
          <span className="badge badge-warning" style={{ fontSize: "0.7rem", padding: "4px 10px" }}>⚠ DEMO MODE ACTIVE — Not real data</span>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <button
          className={`btn ${demoModeEnabled ? "btn-ghost" : "btn-primary"} btn-sm`}
          onClick={() => setDemoMode(true)}
          disabled={demoModeEnabled}
          aria-label="Enable demo mode"
        >
          {demoModeEnabled ? "✓ Demo Mode On" : "Enable Demo Mode"}
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => { setDemoMode(false); setDemoProjects([]); }}
          disabled={!demoModeEnabled}
          aria-label="Disable demo mode"
        >
          Disable Demo Mode
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => { setDemoMode(false); setDemoProjects([]); }}
          aria-label="Reset demo data"
        >
          Reset Demo Data
        </button>
      </div>
      <div className="section-label" style={{ marginBottom: 8 }}>Load Demo Examples</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 8 }}>
        {DEMO_TYPES.map((dt) => (
          <button
            key={dt.id}
            className="btn btn-ghost btn-sm"
            style={{ textAlign: "left", padding: "10px 14px" }}
            onClick={() => { setDemoMode(true); handleLoad(dt.id); }}
            aria-label={`Load ${dt.label} demo`}
          >
            <div style={{ fontWeight: 600, fontSize: "0.78rem" }}>{dt.label}</div>
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: 2 }}>Load demo analysis</div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.3)", borderRadius: "var(--radius)", fontSize: "0.68rem", color: "var(--muted)" }}>
        ⚠ Demo data is clearly marked as demo. It does not contain real customer data, real proprietary app names, or real production information.
      </div>
    </div>
  );
}

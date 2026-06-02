// ============================================================
// AP3X — Export Centre Page
// /src/pages/ExportCentre.jsx — Run 8
// ============================================================

import { useState } from "react";
import ExportSourceSelector             from "../components/export/ExportSourceSelector.jsx";
import ExportSettingsPanel              from "../components/export/ExportSettingsPanel.jsx";
import ExportCentrePanel                from "../components/export/ExportCentrePanel.jsx";
import ClientReportPreview              from "../components/export/ClientReportPreview.jsx";
import InvestorSummaryPreview           from "../components/export/InvestorSummaryPreview.jsx";
import DeveloperBriefPreview            from "../components/export/DeveloperBriefPreview.jsx";
import RiskScorecardPreview             from "../components/export/RiskScorecardPreview.jsx";
import OriginalitySafetyReportPreview   from "../components/export/OriginalitySafetyReportPreview.jsx";
import ImplementationRoadmapPreview     from "../components/export/ImplementationRoadmapPreview.jsx";
import BuildPromptPackPreview           from "../components/export/BuildPromptPackPreview.jsx";
import PrintableReportPreview           from "../components/export/PrintableReportPreview.jsx";
import ExportActionPanel                from "../components/export/ExportActionPanel.jsx";
import DemoModePanel                    from "../components/export/DemoModePanel.jsx";
import { generateExportPack }           from "../core/exportPackGenerator.js";
import { addExportPack, updatePresentationSettings, setDemoMode } from "../core/storage.js";

const TABS = [
  { id: "summary",      label: "↓ Summary"       },
  { id: "client",       label: "◎ Client Report" },
  { id: "investor",     label: "◈ Investor"      },
  { id: "developer",    label: "⬡ Developer"     },
  { id: "risk",         label: "◐ Risk"          },
  { id: "originality",  label: "⚖ Originality"  },
  { id: "roadmap",      label: "◷ Roadmap"       },
  { id: "prompt",       label: "⊕ Prompt"        },
  { id: "print",        label: "🖨 Print"         },
  { id: "export",       label: "↓ Export"        },
  { id: "demo",         label: "⚑ Demo"          },
];

export default function ExportCentre({ state }) {
  const reports    = state?.architectureIntelligence?.reports     || [];
  const blueprints = state?.blueprintCompiler?.compiledBlueprints || [];
  const packs      = state?.exportCentre?.exportPacks             || [];
  const settings   = state?.exportCentre?.presentationSettings    || {};
  const demoMode   = state?.exportCentre?.demoModeEnabled         || false;

  const [selReportId,    setSelReportId]    = useState(reports.length    > 0 ? reports[reports.length    - 1].id : null);
  const [selBlueprintId, setSelBlueprintId] = useState(blueprints.length > 0 ? blueprints[blueprints.length - 1].id : null);
  const [activePackId,   setActivePackId]   = useState(state?.exportCentre?.activeExportPackId || (packs.length > 0 ? packs[packs.length - 1].id : null));
  const [tab,            setTab]            = useState("summary");
  const [generating,     setGenerating]     = useState(false);
  const [genError,       setGenError]       = useState(null);
  const [demoReport,     setDemoReport]     = useState(null);

  const activePack = packs.find((p) => p.id === activePackId) || (packs.length > 0 ? packs[packs.length - 1] : null);

  // Merge demo sources into available lists
  const allReports    = demoReport ? [...reports, demoReport] : reports;
  const allBlueprints = blueprints;

  function handleGenerate() {
    setGenError(null);
    setGenerating(true);
    try {
      const report    = allReports.find((r) => r.id === selReportId)       || null;
      const blueprint = allBlueprints.find((b) => b.id === selBlueprintId) || null;
      if (!report && !blueprint) throw new Error("Select at least one source (report or blueprint) before generating.");
      const pack = generateExportPack(report, blueprint, { ...settings, includeClientReport: true });
      addExportPack(pack);
      setActivePackId(pack.id);
      setTab("summary");
    } catch (e) {
      setGenError(`Generation failed: ${e.message}`);
    } finally {
      setGenerating(false);
    }
  }

  function handleLoadDemo(demoData) {
    setDemoReport(demoData);
    setSelReportId(demoData.id);
    setTab("summary");
  }

  const hasSource = !!selReportId || !!selBlueprintId;
  const hasData   = allReports.length > 0 || allBlueprints.length > 0;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="page-title">4P3X Export Centre</div>
            <div className="page-subtitle">
              Turn architecture intelligence and original blueprints into professional reports, handoff packs, and presentation-ready documents.
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {demoMode && <span className="badge badge-warning" style={{ fontSize: "0.7rem" }}>⚠ DEMO MODE</span>}
            {packs.length > 0 && <span className="badge badge-success" style={{ fontSize: "0.7rem" }}>{packs.length} pack{packs.length !== 1 ? "s" : ""}</span>}
            <span className="badge badge-accent" style={{ fontSize: "0.7rem" }}>Run 8</span>
          </div>
        </div>
      </div>

      {/* Always-visible originality notice */}
      <OriginalitySafetyReportPreview exportPack={activePack} />

      {/* Error */}
      {genError && (
        <div className="alert alert-danger" role="alert" style={{ marginBottom: 14 }}>{genError}</div>
      )}

      {/* No data empty state */}
      {!hasData && !demoMode && (
        <div className="panel" style={{ textAlign: "center", padding: 48, marginBottom: 16 }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>↓</div>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: 8 }}>No Source Data Yet</div>
          <div style={{ color: "var(--muted)", fontSize: "0.85rem", maxWidth: 420, margin: "0 auto 20px" }}>
            Generate an Architecture Intelligence report (Run 6) or compile a Blueprint (Run 7) first — or load a demo example below.
          </div>
        </div>
      )}

      {/* Source selector + settings */}
      <ExportSourceSelector
        reports={allReports}
        blueprints={allBlueprints}
        selectedReportId={selReportId}
        selectedBlueprintId={selBlueprintId}
        onSelectReport={setSelReportId}
        onSelectBlueprint={setSelBlueprintId}
      />

      <ExportSettingsPanel settings={settings} onChange={(patch) => updatePresentationSettings(patch)} />

      {/* Generate button */}
      <div style={{ marginBottom: 20 }}>
        <button
          className="btn btn-primary"
          onClick={handleGenerate}
          disabled={generating || !hasSource}
          aria-label="Generate export pack"
          style={{ width: "100%" }}
        >
          {generating ? "⟳ Generating Export Pack…" : "↓ Generate Export Pack"}
        </button>
      </div>

      {/* Previously generated packs selector */}
      {packs.length > 1 && (
        <div className="panel" style={{ marginBottom: 16 }}>
          <label className="form-label" htmlFor="pack-select">Previously Generated Packs</label>
          <select
            id="pack-select"
            className="form-select"
            value={activePackId || ""}
            onChange={(e) => { setActivePackId(e.target.value); setTab("summary"); }}
            aria-label="Select previous export pack"
          >
            {[...packs].reverse().map((p) => (
              <option key={p.id} value={p.id}>{p.title} — {new Date(p.createdAt).toLocaleString()}</option>
            ))}
          </select>
        </div>
      )}

      {/* Tabs */}
      {(activePack || tab === "demo") && (
        <div>
          <div className="form-tabs" style={{ marginBottom: 20, flexWrap: "wrap" }}>
            {TABS.map((t) => (
              <button key={t.id} className={`tab-btn ${tab === t.id ? "tab-btn--active" : ""}`} onClick={() => setTab(t.id)} aria-label={t.label}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "summary"     && <ExportCentrePanel                exportPack={activePack} />}
          {tab === "client"      && <ClientReportPreview              exportPack={activePack} />}
          {tab === "investor"    && <InvestorSummaryPreview           exportPack={activePack} />}
          {tab === "developer"   && <DeveloperBriefPreview            exportPack={activePack} />}
          {tab === "risk"        && <RiskScorecardPreview             exportPack={activePack} />}
          {tab === "originality" && <OriginalitySafetyReportPreview   exportPack={activePack} />}
          {tab === "roadmap"     && <ImplementationRoadmapPreview     exportPack={activePack} />}
          {tab === "prompt"      && <BuildPromptPackPreview           exportPack={activePack} />}
          {tab === "print"       && <PrintableReportPreview           exportPack={activePack} />}
          {tab === "export"      && <ExportActionPanel                exportPack={activePack} />}
          {tab === "demo"        && <DemoModePanel demoModeEnabled={demoMode} onLoadDemo={handleLoadDemo} />}
        </div>
      )}

      {/* Demo mode always accessible via tab even without a pack */}
      {!activePack && tab !== "demo" && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setTab("demo")} aria-label="Open demo mode">Try Demo Mode →</button>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: 24, padding: "10px 14px",
        background: "rgba(0,229,255,0.03)", border: "1px solid var(--border2)",
        borderRadius: "var(--radius)", fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-mono)",
      }}>
        Run 8 — Export Centre (local-first). No external calls. No AI APIs. Sensitive fields stripped automatically.
        All exports include the Originality &amp; Legal Safety Notice. RLS: NOT APPLICABLE.
      </div>
    </div>
  );
}

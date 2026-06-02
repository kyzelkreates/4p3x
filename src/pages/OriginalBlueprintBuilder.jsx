// ============================================================
// AP3X — Original Blueprint Builder Page
// /src/pages/OriginalBlueprintBuilder.jsx — Run 7
// ============================================================

import { useState } from "react";
import BlueprintSourceSelector      from "../components/blueprint/BlueprintSourceSelector.jsx";
import BlueprintCompilerPanel       from "../components/blueprint/BlueprintCompilerPanel.jsx";
import OriginalProductIdentityPanel from "../components/blueprint/OriginalProductIdentityPanel.jsx";
import PagePlanPanel                from "../components/blueprint/PagePlanPanel.jsx";
import ComponentPlanPanel           from "../components/blueprint/ComponentPlanPanel.jsx";
import DataModelPlanPanel           from "../components/blueprint/DataModelPlanPanel.jsx";
import StateLogicPlanPanel          from "../components/blueprint/StateLogicPlanPanel.jsx";
import UXFlowPlanPanel              from "../components/blueprint/UXFlowPlanPanel.jsx";
import ImplementationRunsPanel      from "../components/blueprint/ImplementationRunsPanel.jsx";
import BuildPromptPanel             from "../components/blueprint/BuildPromptPanel.jsx";
import BlueprintExportPanel         from "../components/blueprint/BlueprintExportPanel.jsx";
import OriginalityLockPanel         from "../components/blueprint/OriginalityLockPanel.jsx";
import { compileOriginalBlueprint } from "../core/originalBlueprintCompiler.js";
import {
  addCompiledBlueprint,
  updateBlueprintCompilerSettings,
} from "../core/storage.js";

const TABS = [
  { id: "summary",    label: "◑ Summary"      },
  { id: "identity",   label: "◈ Identity"     },
  { id: "pages",      label: "◎ Pages"        },
  { id: "components", label: "⬡ Components"   },
  { id: "data",       label: "▦ Data Model"   },
  { id: "state",      label: "⇄ State Logic"  },
  { id: "ux",         label: "⤷ UX Flow"      },
  { id: "runs",       label: "◷ Runs"         },
  { id: "prompt",     label: "⊕ Build Prompt" },
  { id: "export",     label: "↓ Export"       },
];

export default function OriginalBlueprintBuilder({ state }) {
  const reports    = state?.architectureIntelligence?.reports      || [];
  const blueprints = state?.blueprintCompiler?.compiledBlueprints  || [];
  const settings   = state?.blueprintCompiler?.compilerSettings    || {};

  const [selectedReportId, setSelectedReportId] = useState(
    reports.length > 0 ? reports[reports.length - 1].id : null
  );
  const [activeBlueprintId, setActiveBlueprintId] = useState(
    state?.blueprintCompiler?.activeBlueprintId || (blueprints.length > 0 ? blueprints[blueprints.length - 1].id : null)
  );
  const [tab,       setTab]       = useState("summary");
  const [compiling, setCompiling] = useState(false);
  const [compileError, setCompileError] = useState(null);

  const activeBlueprint = blueprints.find((b) => b.id === activeBlueprintId) ||
    (blueprints.length > 0 ? blueprints[blueprints.length - 1] : null);

  function handleSettingsChange(patch) {
    updateBlueprintCompilerSettings(patch);
  }

  function handleCompile() {
    setCompileError(null);
    setCompiling(true);
    try {
      const report = reports.find((r) => r.id === selectedReportId);
      if (!report) throw new Error("Selected report not found. Please select a valid architecture report.");

      const opts = {
        tool:               settings.targetTool || "developer",
        includeRunPlan:     settings.includeRunPlan !== false,
        runMode:            "full",
      };
      const blueprint = compileOriginalBlueprint(report, opts);
      if (!blueprint) throw new Error("Blueprint compilation returned null. Please check the source report.");

      addCompiledBlueprint(blueprint);
      setActiveBlueprintId(blueprint.id);
      setTab("summary");
    } catch (e) {
      setCompileError(`Compilation failed: ${e.message}`);
    } finally {
      setCompiling(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="page-title">Original Blueprint Builder</div>
            <div className="page-subtitle">
              Convert architecture intelligence into safe, original, build-ready app plans.
            </div>
          </div>
          {blueprints.length > 0 && (
            <div style={{ display: "flex", gap: 6 }}>
              <span className="badge badge-success" style={{ fontSize: "0.7rem" }}>{blueprints.length} blueprint{blueprints.length !== 1 ? "s" : ""} compiled</span>
              <span className="badge badge-accent"  style={{ fontSize: "0.7rem" }}>Run 7 Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Originality lock — always visible */}
      <OriginalityLockPanel
        blueprint={activeBlueprint}
        strictMode={settings.originalityStrictMode !== false}
      />

      {/* Compile error */}
      {compileError && (
        <div className="alert alert-danger" role="alert" style={{ marginBottom: 16 }}>
          {compileError}
        </div>
      )}

      {/* Source selector + settings + compile */}
      <BlueprintSourceSelector
        reports={reports}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        selectedReportId={selectedReportId}
        onSelectReport={setSelectedReportId}
        onCompile={handleCompile}
        compiling={compiling}
      />

      {/* Previously compiled blueprint selector */}
      {blueprints.length > 1 && (
        <div className="panel" style={{ marginBottom: 16 }}>
          <label className="form-label" htmlFor="blueprint-select">Previously Compiled Blueprints</label>
          <select
            id="blueprint-select"
            className="form-select"
            value={activeBlueprintId || ""}
            onChange={(e) => { setActiveBlueprintId(e.target.value); setTab("summary"); }}
            aria-label="Select previously compiled blueprint"
          >
            {[...blueprints].reverse().map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} — {new Date(b.createdAt).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Empty state — no blueprint yet */}
      {!activeBlueprint && (
        <div className="panel" style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: "3rem", marginBottom: 14 }}>◑</div>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: 8 }}>
            No Blueprint Compiled Yet
          </div>
          <div style={{ color: "var(--muted)", fontSize: "0.85rem", maxWidth: 440, margin: "0 auto 20px" }}>
            {reports.length === 0
              ? "First, generate an Architecture Intelligence report on the Architecture Intel page. Then return here to compile a blueprint."
              : "Select a source report above and click Compile Original Blueprint."}
          </div>
          {reports.length > 0 && (
            <button
              className="btn btn-primary"
              onClick={handleCompile}
              disabled={compiling || !selectedReportId}
              aria-label="Compile blueprint"
            >
              {compiling ? "⟳ Compiling…" : "◑ Compile Now"}
            </button>
          )}
        </div>
      )}

      {/* Blueprint tabs */}
      {activeBlueprint && (
        <div>
          <div className="form-tabs" style={{ marginBottom: 20, flexWrap: "wrap" }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`tab-btn ${tab === t.id ? "tab-btn--active" : ""}`}
                onClick={() => setTab(t.id)}
                aria-label={t.label}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div>
            {tab === "summary"    && <BlueprintCompilerPanel       blueprint={activeBlueprint} />}
            {tab === "identity"   && <OriginalProductIdentityPanel blueprint={activeBlueprint} />}
            {tab === "pages"      && <PagePlanPanel                blueprint={activeBlueprint} />}
            {tab === "components" && <ComponentPlanPanel           blueprint={activeBlueprint} />}
            {tab === "data"       && <DataModelPlanPanel           blueprint={activeBlueprint} />}
            {tab === "state"      && <StateLogicPlanPanel          blueprint={activeBlueprint} />}
            {tab === "ux"         && <UXFlowPlanPanel              blueprint={activeBlueprint} />}
            {tab === "runs"       && <ImplementationRunsPanel      blueprint={activeBlueprint} />}
            {tab === "prompt"     && <BuildPromptPanel             blueprint={activeBlueprint} />}
            {tab === "export"     && <BlueprintExportPanel         blueprint={activeBlueprint} />}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: 24, padding: "10px 14px",
        background: "rgba(0,229,255,0.03)", border: "1px solid var(--border2)",
        borderRadius: "var(--radius)", fontSize: "0.72rem", color: "var(--muted)",
        fontFamily: "var(--font-mono)",
      }}>
        Run 7 — Original Blueprint Builder (local-first). No external calls. No AI APIs.
        All blueprints are original. Architecture patterns only. RLS: NOT APPLICABLE.
      </div>
    </div>
  );
}

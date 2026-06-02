// ============================================================
// AP3X — Architecture Intelligence Page
// /src/pages/ArchitectureIntelligence.jsx — Run 6
// ============================================================

import { useState } from "react";
import ArchitectureIntelligencePanel from "../components/intelligence/ArchitectureIntelligencePanel.jsx";
import ArchitectureReportViewer      from "../components/intelligence/ArchitectureReportViewer.jsx";
import ValidationWarningsPanel       from "../components/intelligence/ValidationWarningsPanel.jsx";
import RiskScorePanel                from "../components/intelligence/RiskScorePanel.jsx";
import OriginalitySafetyPanel        from "../components/intelligence/OriginalitySafetyPanel.jsx";
import RebuildBlueprintPanel         from "../components/intelligence/RebuildBlueprintPanel.jsx";
import ExportReportPanel             from "../components/intelligence/ExportReportPanel.jsx";
import { createArchitectureReport }  from "../core/reportGenerator.js";
import {
  addArchitectureReport, updateArchitectureReportById,
  clearArchitectureReports,
} from "../core/storage.js";

const PAGE_TABS = [
  { id:"intelligence", label:"⬡ Intelligence" },
  { id:"report",       label:"◎ Full Report" },
  { id:"warnings",     label:"⚠ Warnings" },
  { id:"risk",         label:"◈ Risk Scores" },
  { id:"originality",  label:"⚖ Originality" },
  { id:"blueprint",    label:"◷ Blueprint" },
  { id:"export",       label:"↓ Export" },
];

export default function ArchitectureIntelligence({ state }) {
  const { projects, prompts, runs, errors, architectureIntelligence } = state;
  const reports = architectureIntelligence?.reports || [];

  const [tab,            setTab]            = useState("intelligence");
  const [selectedSource, setSelectedSource] = useState("all");
  const [generating,     setGenerating]     = useState(false);
  const [genError,       setGenError]       = useState(null);
  const [activeReportId, setActiveReportId] = useState(
    architectureIntelligence?.activeReportId || (reports.length > 0 ? reports[reports.length - 1].id : null)
  );

  const allProjects = projects  || [];
  const allPrompts  = prompts   || [];
  const allRuns     = runs      || [];
  const allErrors   = errors    || [];

  const activeReport = reports.find((r) => r.id === activeReportId) || reports[reports.length - 1] || null;

  // Build source data for analysis
  function buildSourceData() {
    if (selectedSource === "all") {
      return { projects: allProjects, prompts: allPrompts, runs: allRuns, errors: allErrors };
    }
    const project = allProjects.find((p) => p.id === selectedSource);
    const linkedPrompts = allPrompts.filter((p) => p.linkedProjectId === selectedSource || !p.linkedProjectId);
    const linkedRuns    = allRuns.filter((r)   => r.linkedProjectId  === selectedSource);
    const linkedErrors  = allErrors.filter((e) => e.linkedProjectId  === selectedSource);
    return {
      projects: project ? [project] : allProjects,
      prompts:  linkedPrompts,
      runs:     linkedRuns,
      errors:   linkedErrors,
    };
  }

  function handleGenerate() {
    setGenError(null);
    setGenerating(true);
    try {
      const sourceData = buildSourceData();
      const projectId  = selectedSource !== "all" ? selectedSource : "";
      const report = createArchitectureReport(sourceData, projectId, "");
      addArchitectureReport(report);
      setActiveReportId(report.id);
      setTab("intelligence");
    } catch (e) {
      setGenError(`Report generation failed: ${e.message}. Please try again.`);
    } finally {
      setGenerating(false);
    }
  }

  const hasData = allProjects.length > 0 || allPrompts.length > 0 || allRuns.length > 0 || allErrors.length > 0;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
          <div>
            <div className="page-title">AP3X Architecture Intelligence</div>
            <div className="page-subtitle">
              Turn extracted app structures into safe, original, build-ready system blueprints.
            </div>
          </div>
          {reports.length > 0 && (
            <div style={{ display:"flex", gap:6 }}>
              <span className="badge badge-success" style={{fontSize:"0.7rem"}}>{reports.length} report{reports.length !== 1 ? "s" : ""}</span>
              <span className="badge badge-accent"  style={{fontSize:"0.7rem"}}>Run 6 Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Source selector + generate */}
      <div className="panel" style={{ marginBottom:20 }}>
        <div className="section-label" style={{ marginBottom:10 }}>Source Selector</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"flex-end" }}>
          <div style={{ flex:1, minWidth:200 }}>
            <label className="form-label">Analyse Source</label>
            <select
              className="form-select"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              aria-label="Select analysis source"
            >
              <option value="all">All System Data ({allProjects.length} projects, {allRuns.length} runs, {allErrors.length} errors)</option>
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>{p.name} [{p.type} · {p.status}]</option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={generating || !hasData}
            aria-label="Generate architecture intelligence"
            style={{ minWidth:220, flexShrink:0 }}
          >
            {generating ? "⟳ Generating…" : "⬡ Generate Architecture Intelligence"}
          </button>
        </div>

        {!hasData && (
          <div className="alert alert-warning" style={{ marginTop:10 }} role="status">
            ⚠ No source data found. Add projects, prompts, runs, or errors first, then generate intelligence.
          </div>
        )}
        {genError && (
          <div className="alert alert-danger" style={{ marginTop:10 }} role="alert">{genError}</div>
        )}

        {reports.length > 1 && (
          <div style={{ marginTop:12, borderTop:"1px solid var(--border2)", paddingTop:12 }}>
            <label className="form-label">Previously Generated Reports</label>
            <select
              className="form-select"
              value={activeReportId || ""}
              onChange={(e) => { setActiveReportId(e.target.value); setTab("intelligence"); }}
              aria-label="Select previous report"
            >
              {[...reports].reverse().map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} — {new Date(r.createdAt).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* No report state */}
      {!activeReport && (
        <div className="panel" style={{ textAlign:"center", padding:60 }}>
          <div style={{ fontSize:"3rem", marginBottom:14 }}>◈</div>
          <div style={{ fontWeight:700, fontSize:"1rem", color:"var(--text)", marginBottom:8 }}>
            No Architecture Intelligence Generated Yet
          </div>
          <div style={{ color:"var(--muted)", fontSize:"0.85rem", maxWidth:420, margin:"0 auto 20px" }}>
            Select a source above and click Generate Architecture Intelligence to produce a structured analysis report.
          </div>
          {hasData && (
            <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
              {generating ? "⟳ Generating…" : "⬡ Generate Now"}
            </button>
          )}
        </div>
      )}

      {/* Report content */}
      {activeReport && (
        <div>
          {/* Tab bar */}
          <div className="form-tabs" style={{ marginBottom:20, flexWrap:"wrap" }}>
            {PAGE_TABS.map((t) => (
              <button
                key={t.id}
                className={`tab-btn ${tab===t.id?"tab-btn--active":""}`}
                onClick={() => setTab(t.id)}
                aria-label={t.label}
              >
                {t.label}
                {t.id === "warnings" && (activeReport.riskWarnings||[]).length > 0 && (
                  <span className="badge badge-danger" style={{marginLeft:5,fontSize:"0.58rem"}}>{(activeReport.riskWarnings||[]).length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div>
            {tab === "intelligence" && <ArchitectureIntelligencePanel report={activeReport} />}
            {tab === "report"       && <ArchitectureReportViewer      report={activeReport} />}
            {tab === "warnings"     && <ValidationWarningsPanel        report={activeReport} />}
            {tab === "risk"         && <RiskScorePanel                 report={activeReport} />}
            {tab === "originality"  && <OriginalitySafetyPanel         report={activeReport} />}
            {tab === "blueprint"    && <RebuildBlueprintPanel          report={activeReport} />}
            {tab === "export"       && <ExportReportPanel              report={activeReport} />}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop:24, padding:"10px 14px",
        background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)",
        borderRadius:"var(--radius)", fontSize:"0.72rem", color:"var(--muted)",
        fontFamily:"var(--font-mono)",
      }}>
        Run 6 — Architecture Intelligence (local-first). No external calls. No AI APIs.
        Architecture patterns only. All generated blueprints are original.
        RLS: NOT APPLICABLE.
      </div>
    </div>
  );
}

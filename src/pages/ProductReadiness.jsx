// ============================================================
// AP3X — Product Readiness Page
// /src/pages/ProductReadiness.jsx — Run 9
// ============================================================

import { useState }                    from "react";
import ProductReadinessDashboard       from "../components/readiness/ProductReadinessDashboard.jsx";
import ReadinessScorePanel             from "../components/readiness/ReadinessScorePanel.jsx";
import PWAStatusPanel                  from "../components/readiness/PWAStatusPanel.jsx";
import DeploymentStatusPanel           from "../components/readiness/DeploymentStatusPanel.jsx";
import ResponsiveStatusPanel           from "../components/readiness/ResponsiveStatusPanel.jsx";
import ProductTestPanel                from "../components/readiness/ProductTestPanel.jsx";
import IssueLogPanel                   from "../components/readiness/IssueLogPanel.jsx";
import TestRunHistoryPanel             from "../components/readiness/TestRunHistoryPanel.jsx";
import FinalRecommendationsPanel       from "../components/readiness/FinalRecommendationsPanel.jsx";
import { generateProductReadinessReport } from "../core/productReadinessEngine.js";
import { addTestRun }                  from "../core/storage.js";

const TABS = [
  { id:"dashboard",    label:"◉ Dashboard"     },
  { id:"score",        label:"◑ Score"         },
  { id:"tests",        label:"✓ Tests"         },
  { id:"pwa",          label:"⊞ PWA"           },
  { id:"deployment",   label:"↑ Deployment"    },
  { id:"responsive",   label:"⬛ Responsive"   },
  { id:"issues",       label:"⚠ Issues"        },
  { id:"history",      label:"◷ History"       },
  { id:"final",        label:"✦ Final Report"  },
];

export default function ProductReadiness({ state }) {
  const testRuns   = state?.productReadiness?.testRuns    || [];
  const activeId   = state?.productReadiness?.activeTestRunId;

  const [tab,       setTab]       = useState("dashboard");
  const [running,   setRunning]   = useState(false);
  const [activeRun, setActiveRun] = useState(activeId || (testRuns.length > 0 ? testRuns[testRuns.length - 1].id : null));
  const [runError,  setRunError]  = useState(null);

  const currentRun = testRuns.find((r) => r.id === activeRun) || (testRuns.length > 0 ? testRuns[testRuns.length - 1] : null);

  function handleRunTest() {
    setRunError(null);
    setRunning(true);
    setTimeout(() => {
      try {
        const report = generateProductReadinessReport(state);
        addTestRun(report);
        setActiveRun(report.id);
        setTab("dashboard");
      } catch (e) {
        setRunError(`Test run failed: ${e.message}`);
      } finally {
        setRunning(false);
      }
    }, 600); // brief async feel
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
          <div>
            <div className="page-title">4P3X Product Readiness</div>
            <div className="page-subtitle">
              Validate PWA, deployment, exports, demo mode, and end-to-end product stability before final QA.
            </div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {currentRun && (
              <span className={`badge ${currentRun.readinessScore >= 80 ? "badge-success" : "badge-warning"}`} style={{ fontSize:"0.7rem" }}>
                {currentRun.readinessStatus}
              </span>
            )}
            <span className="badge badge-accent" style={{ fontSize:"0.7rem" }}>Run 9</span>
            <span className="badge badge-muted"  style={{ fontSize:"0.7rem" }}>v9.0.0</span>
          </div>
        </div>
      </div>

      {/* Error */}
      {runError && (
        <div className="alert alert-danger" role="alert" style={{ marginBottom:14 }}>{runError}</div>
      )}

      {/* Dashboard always visible at top */}
      <ProductReadinessDashboard testRun={currentRun} onRunTest={handleRunTest} running={running} />

      {/* Tabs */}
      <div className="form-tabs" style={{ marginBottom:20, flexWrap:"wrap" }}>
        {TABS.map((t) => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? "tab-btn--active" : ""}`} onClick={() => setTab(t.id)} aria-label={t.label}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard"  && <ReadinessScorePanel       testRun={currentRun} />}
      {tab === "score"      && <ReadinessScorePanel       testRun={currentRun} />}
      {tab === "tests"      && <ProductTestPanel          testRun={currentRun} />}
      {tab === "pwa"        && <PWAStatusPanel            checks={currentRun?.pwaChecks        || currentRun?.tests?.filter((t) => t.category === "PWA")} />}
      {tab === "deployment" && <DeploymentStatusPanel     checks={currentRun?.deploymentChecks  || currentRun?.tests?.filter((t) => t.category === "Deployment")} />}
      {tab === "responsive" && <ResponsiveStatusPanel     checks={currentRun?.responsiveChecks  || currentRun?.tests?.filter((t) => t.category === "Responsive Layout")} />}
      {tab === "issues"     && <IssueLogPanel             testRun={currentRun} />}
      {tab === "history"    && (
        <TestRunHistoryPanel
          testRuns={testRuns}
          activeRunId={activeRun}
          onSelect={(id) => { setActiveRun(id); setTab("dashboard"); }}
        />
      )}
      {tab === "final"      && <FinalRecommendationsPanel testRun={currentRun} />}

      {/* Footer */}
      <div style={{ marginTop:24, padding:"10px 14px", background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.72rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
        Run 9 — Product Readiness (local-first). No external calls. Test results persisted to SSOT.
        Originality &amp; Legal Safety Notice enforced throughout. RLS: NOT APPLICABLE.
      </div>
    </div>
  );
}

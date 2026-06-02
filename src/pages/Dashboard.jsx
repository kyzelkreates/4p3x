// ============================================================
// AP3X — Dashboard Page
// /src/pages/Dashboard.jsx — Updated Run 5
// ============================================================

import StatCard   from "../components/StatCard.jsx";
import ModuleCard from "../components/ModuleCard.jsx";
import { MODULES } from "../core/constants.js";

export default function Dashboard({ state }) {
  const { systemHealth, appMeta, connectors } = state;
  const h = systemHealth || {};

  const lastUpdated = appMeta?.lastUpdated
    ? new Date(appMeta.lastUpdated).toLocaleString() : "—";

  return (
    <div>
      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-title">
          <span>AP3X</span> BUILD CONTROL OS™
        </div>
        <div className="hero-subtitle">
          Autonomous Project Command Centre — Run 5 · Run History + Checkpoint System Active
        </div>
        <div className="hero-meta">
          <span className="badge badge-accent">v{appMeta?.version}</span>
          <span className="badge badge-purple">Run {appMeta?.buildRun}</span>
          <span className="badge badge-success">Local-First Active</span>
          <span className="badge badge-success">SSOT Enforced</span>
          <span className="badge badge-success">Project Registry</span>
          <span className="badge badge-success">Prompt Vault</span>
          <span className="badge badge-success">Error Centre</span>
          <span className="badge badge-success">Classifier</span>
          <span className="badge badge-success">Run History</span>
        </div>
      </div>

      {/* ── Project Registry ── */}
      <div className="section">
        <div className="section-label">Project Registry</div>
        <div className="grid-stats">
          <StatCard label="Total Projects"   value={h.totalProjects         ?? 0} variant="accent" />
          <StatCard label="Working/Deployed" value={h.workingProjects       ?? 0} variant="success" />
          <StatCard label="Broken"           value={h.brokenProjects        ?? 0} variant={h.brokenProjects        > 0 ? "danger"  : ""} />
          <StatCard label="Deployed"         value={h.deployedProjects      ?? 0} variant="success" />
          <StatCard label="Investor Ready"   value={h.investorReadyProjects ?? 0} />
          <StatCard label="Archived"         value={h.archivedProjects      ?? 0} variant={h.archivedProjects > 0 ? "warning" : ""} />
        </div>
      </div>

      <div className="accent-line" />

      {/* ── Prompt Vault ── */}
      <div className="section">
        <div className="section-label">Prompt Vault</div>
        <div className="grid-stats">
          <StatCard label="Total Prompts" value={h.totalPrompts  ?? 0} variant="accent" />
          <StatCard label="Ready"         value={h.readyPrompts  ?? 0} variant="accent" />
          <StatCard label="Master"        value={h.masterPrompts ?? 0} variant="purple" />
          <StatCard label="Avg Safety"
            value={`${h.avgSafetyScore ?? 0}/100`}
            variant={(h.avgSafetyScore ?? 0) >= 80 ? "success" : (h.avgSafetyScore ?? 0) >= 50 ? "warning" : "danger"} />
        </div>
      </div>

      <div className="accent-line" />

      {/* ── Error Centre ── */}
      <div className="section">
        <div className="section-label">Error Centre</div>
        <div className="grid-stats">
          <StatCard label="Total Errors"    value={h.totalErrors        ?? 0} variant="accent" />
          <StatCard label="Open"            value={h.openErrors         ?? 0} variant={h.openErrors         > 0 ? "danger"   : "success"} />
          <StatCard label="Critical"        value={h.criticalErrors     ?? 0} variant={h.criticalErrors     > 0 ? "critical" : ""} />
          <StatCard label="Deploy Blockers" value={h.deploymentBlockers ?? 0} variant={h.deploymentBlockers > 0 ? "critical" : ""} />
        </div>
      </div>

      <div className="accent-line" />

      {/* ── Run History ── */}
      <div className="section">
        <div className="section-label">Run History</div>
        <div className="grid-stats">
          <StatCard label="Total Runs"       value={h.totalRuns         ?? 0} variant="accent" />
          <StatCard label="Completed"        value={h.completedRuns     ?? 0} variant="success" />
          <StatCard label="Failed"           value={h.failedRuns        ?? 0} variant={h.failedRuns  > 0 ? "danger"  : ""} />
          <StatCard label="Blocked"          value={h.blockedRuns       ?? 0} variant={h.blockedRuns > 0 ? "danger"  : ""} />
          <StatCard label="Validated"        value={h.validatedRuns     ?? 0} variant="success" />
          <StatCard label="Safe to Continue" value={h.safeToContineRuns ?? 0} variant="success" />
        </div>
      </div>

      <div className="accent-line" />

      {/* ── Connectors ── */}
      <div className="section">
        <div className="section-label">Connectors</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {Object.entries(connectors || {}).map(([key, val]) => (
            <div key={key} className="panel-sm" style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span className="badge badge-muted">{key.toUpperCase()}</span>
              <span style={{ fontSize:"0.72rem", color:"var(--muted)" }}>{val.status.replace("_"," ")}</span>
              <span className="badge badge-locked" style={{ fontSize:"0.62rem" }}>Run 8</span>
            </div>
          ))}
        </div>
      </div>

      <div className="accent-line" />

      {/* ── Module Registry ── */}
      <div className="section">
        <div className="section-label">Module Registry</div>
        <div className="grid-modules">
          {MODULES.map((mod) => (
            <ModuleCard key={mod.id} module={mod} />
          ))}
        </div>
      </div>

      {/* ── System Info ── */}
      <div style={{
        marginTop:32, padding:"12px 16px",
        background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)",
        borderRadius:"var(--radius)", display:"flex", gap:20, flexWrap:"wrap",
      }}>
        <span className="mono text-muted">Mode: {appMeta?.mode}</span>
        <span className="mono text-muted">Backend: Disabled</span>
        <span className="mono text-muted">External AI: Disabled</span>
        <span className="mono text-muted">Connectors: Disabled (Run 8)</span>
        <span className="mono text-muted">RLS: N/A (no Supabase)</span>
        <span className="mono text-muted">Last Updated: {lastUpdated}</span>
      </div>
    </div>
  );
}

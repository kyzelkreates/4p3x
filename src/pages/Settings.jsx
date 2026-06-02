// ============================================================
// AP3X — Settings Page
// /src/pages/Settings.jsx — Updated Run 5
// ============================================================

import { useState } from "react";
import StatusBadge   from "../components/StatusBadge.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { resetState, seedInitialState, exportStateSnapshot } from "../core/storage.js";
import { calculateErrorStats } from "../core/errorUtils.js";
import { calculateRunStats }   from "../core/runUtils.js";

const STORAGE_KEY = "ap3x_ssot_v1";

function SR({ label, desc, badge, value, valueClass="" }) {
  return (
    <div className="setting-row">
      <div>
        <div className="setting-label">{label}</div>
        {desc && <div className="setting-desc">{desc}</div>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {badge && <StatusBadge status={badge.status} label={badge.label} />}
        {value !== undefined && <span className={`setting-value ${valueClass}`}>{String(value)}</span>}
      </div>
    </div>
  );
}

export default function Settings({ state }) {
  const { settings, appMeta, projects, prompts, errors, runs } = state;
  const [confirmReset, setConfirmReset] = useState(false);
  const [snapCopied,   setSnapCopied]   = useState(false);

  const errorStats = calculateErrorStats(errors || []);
  const runStats   = calculateRunStats(runs     || []);

  async function handleExportSnapshot() {
    const snap = exportStateSnapshot();
    try {
      await navigator.clipboard.writeText(snap);
      setSnapCopied(true);
      setTimeout(() => setSnapCopied(false), 2500);
    } catch {
      const blob = new Blob([snap], { type:"application/json" });
      window.open(URL.createObjectURL(blob), "_blank");
    }
  }

  const totalPrompts    = prompts?.length ?? 0;
  const archivedPrompts = (prompts||[]).filter((p) => p.flags?.isArchived).length;
  const masterPrompts   = (prompts||[]).filter((p) => p.flags?.isMasterPrompt || p.status === "master").length;
  const scores          = (prompts||[]).filter((p) => !p.flags?.isArchived).map((p) => p.safety?.safetyScore || 0);
  const avgSafety       = scores.length ? Math.round(scores.reduce((a,b) => a+b,0)/scores.length) : 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Settings</div>
        <div className="page-subtitle">Local state configuration — Run 5. No backend. No external services.</div>
      </div>

      {/* Architecture flags */}
      <div className="section">
        <div className="section-label">Architecture Flags</div>
        <div className="panel">
          <SR label="Local-First Mode"   desc="All data stored in browser localStorage." badge={{ status: settings?.localFirst   ? "success" : "danger", label: settings?.localFirst   ? "ENABLED" : "DISABLED" }} />
          <SR label="SSOT Enforced"      desc="All mutations route through storage.js."  badge={{ status: settings?.ssotEnforced ? "success" : "danger", label: settings?.ssotEnforced ? "ENABLED" : "DISABLED" }} />
          <SR label="Backend"            desc="Supabase, databases, server-side APIs."   badge={{ status: "not_configured", label: "DISABLED" }} />
          <SR label="External AI"        desc="OpenAI, Groq, external AI APIs."          badge={{ status: "not_configured", label: "DISABLED" }} />
          <SR label="Connectors"         desc="GitHub, Vercel, Supabase OAuth."          badge={{ status: "not_configured", label: "DISABLED" }} />
        </div>
      </div>

      {/* App Meta */}
      <div className="section">
        <div className="section-label">App Meta</div>
        <div className="panel">
          <SR label="App Name"    value={appMeta?.name}    valueClass="text-accent" />
          <SR label="Version"     value={appMeta?.version} valueClass="text-accent" />
          <SR label="Build Run"   value={`Run ${appMeta?.buildRun}`} />
          <SR label="Mode"        value={appMeta?.mode} />
          <SR label="Storage Key" desc="localStorage key for all state." value={STORAGE_KEY} valueClass="mono text-muted" />
          <SR label="Last Updated" value={appMeta?.lastUpdated ? new Date(appMeta.lastUpdated).toLocaleString() : "—"} valueClass="mono text-muted" />
        </div>
      </div>

      {/* Project Registry */}
      <div className="section">
        <div className="section-label">Project Registry</div>
        <div className="panel">
          <SR label="Total Projects"   value={projects?.length ?? 0} />
          <SR label="Archived"         value={(projects||[]).filter((p) => p.flags?.isArchived).length} />
          <SR label="Working/Deployed" value={(projects||[]).filter((p) => p.status==="working"||p.status==="deployed").length} />
          <SR label="Broken"           value={(projects||[]).filter((p) => p.status==="broken").length} />
        </div>
      </div>

      {/* Prompt Vault */}
      <div className="section">
        <div className="section-label">Prompt Vault</div>
        <div className="panel">
          <SR label="Total Prompts"    value={totalPrompts} />
          <SR label="Archived"         value={archivedPrompts} />
          <SR label="Master Prompts"   value={masterPrompts} />
          <SR label="Avg Safety Score" value={`${avgSafety}/100`}
            valueClass={avgSafety>=80?"text-success":avgSafety>=50?"text-warning":"text-danger"} />
        </div>
      </div>

      {/* Error Centre */}
      <div className="section">
        <div className="section-label">Error Centre</div>
        <div className="panel">
          <SR label="Total Errors"        value={errorStats.total} />
          <SR label="Open Errors"         value={errorStats.open}               valueClass={errorStats.open>0?"text-danger":""} />
          <SR label="Critical Errors"     value={errorStats.critical}           valueClass={errorStats.critical>0?"text-danger":""} />
          <SR label="Deployment Blockers" value={errorStats.deploymentBlockers} valueClass={errorStats.deploymentBlockers>0?"text-danger":""} />
          <SR label="Fixed"               value={errorStats.fixed}              valueClass="text-success" />
          <SR label="Archived Errors"     value={errorStats.archived} />
        </div>
      </div>

      {/* Run History */}
      <div className="section">
        <div className="section-label">Run History</div>
        <div className="panel">
          <SR label="Total Runs"         value={runStats.total} />
          <SR label="Completed"          value={runStats.completed}      valueClass="text-success" />
          <SR label="Failed"             value={runStats.failed}         valueClass={runStats.failed   > 0 ? "text-danger"  : ""} />
          <SR label="Blocked"            value={runStats.blocked}        valueClass={runStats.blocked  > 0 ? "text-danger"  : ""} />
          <SR label="Needs Review"       value={runStats.needsReview}    valueClass={runStats.needsReview > 0 ? "text-warning" : ""} />
          <SR label="Validated"          value={runStats.validated}      valueClass="text-success" />
          <SR label="Safe to Continue"   value={runStats.safeToContinue} valueClass="text-success" />
          <SR label="Archived Runs"      value={runStats.archived} />
          <div style={{ marginTop:6, fontSize:"0.7rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
            Prompt snapshots stored as text data only — never executed.
          </div>
        </div>
      </div>

      {/* Connectors */}
      <div className="section">
        <div className="section-label">Connectors (Locked — Run 8)</div>
        <div className="panel">
          {Object.entries(state.connectors||{}).map(([key, val]) => (
            <SR key={key}
              label={key.charAt(0).toUpperCase()+key.slice(1)}
              desc={`Status: ${val.status.replace("_"," ")}`}
              badge={{ status:"not_configured", label:"Not Configured" }} />
          ))}
          <div style={{ marginTop:10, fontSize:"0.72rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
            Connectors enabled in Run 8. No credentials stored.
          </div>
        </div>
      </div>

      {/* State Management */}
      <div className="section">
        <div className="section-label">State Management</div>
        <div className="panel">
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:12 }}>
            <button className="btn btn-primary" onClick={seedInitialState}>⬡ Seed Demo Data</button>
            <button className="btn btn-ghost"   onClick={handleExportSnapshot}>{snapCopied?"✓ Copied!":"↑ Export Snapshot"}</button>
            <button className="btn btn-danger"  onClick={() => setConfirmReset(true)}>✕ Reset Local State</button>
          </div>
          <div style={{ fontSize:"0.72rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
            Reset clears all localStorage and returns to defaults.
            Seed adds demo projects, prompts, errors, and runs if collections are empty.
            Export snapshot copies full state JSON to clipboard — secret fields included, handle with care.
          </div>
        </div>
      </div>

      {/* RLS notice */}
      <div style={{
        padding:"12px 16px", background:"rgba(124,58,237,0.04)", border:"1px solid rgba(124,58,237,0.12)",
        borderRadius:"var(--radius)", fontSize:"0.72rem", color:"var(--muted)", fontFamily:"var(--font-mono)",
      }}>
        RLS STATUS: NOT APPLICABLE — no Supabase or database created in Run 5.
        <br />Row-Level Security will be configured when Supabase is integrated in Run 8.
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset All Local State?" variant="danger"
        message="This will permanently erase all projects, prompts, errors, and runs from localStorage. This cannot be undone."
        confirmLabel="Reset Everything" cancelLabel="Cancel"
        onConfirm={() => { setConfirmReset(false); resetState(); }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}

// ============================================================
// AP3X — ErrorDetail — Run 4
// /src/components/ErrorDetail.jsx
// ============================================================

import { useState } from "react";
import StatusBadge          from "./StatusBadge.jsx";
import ConfirmDialog        from "./ConfirmDialog.jsx";
import ErrorTriagePanel     from "./ErrorTriagePanel.jsx";
import ErrorFixChecklist    from "./ErrorFixChecklist.jsx";
import ErrorClassifierPanel from "./ErrorClassifierPanel.jsx";
import {
  archiveErrorById, restoreErrorById, deleteError,
  markErrorFixed, markErrorReopened, toggleErrorPinned,
  applyProjectClassificationFromError,
} from "../core/storage.js";
import { exportErrorAsJson, maskSecretLikeContent } from "../core/errorUtils.js";
import { detectSecretLikeContent } from "../core/validators.js";
import { ERROR_CATEGORIES, ERROR_SOURCES } from "../core/constants.js";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
function getLabel(arr, v) {
  const f = arr.find((x) => x.value === v);
  return f ? f.label : (v || "—");
}

function DS({ title, children }) {
  return (
    <div className="detail-section">
      <div className="section-label">{title}</div>
      <div className="panel">{children}</div>
    </div>
  );
}
function DR({ label, value, mono }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="setting-row">
      <span className="setting-label">{label}</span>
      <span style={{
        fontSize: "0.78rem", color: "var(--muted)",
        maxWidth: "60%", textAlign: "right", wordBreak: "break-word",
        fontFamily: mono ? "var(--font-mono)" : undefined,
      }}>
        {String(value)}
      </span>
    </div>
  );
}

const DETAIL_TABS = [
  { id: "triage",     label: "Triage" },
  { id: "checklist",  label: "Fix Checklist" },
  { id: "classifier", label: "Classifier" },
];

export default function ErrorDetail({
  error, allErrors, projects, prompts, allRuns, onEdit, onBack, onDeleted,
}) {
  const [showLog,        setShowLog]        = useState(false);
  const [showMasked,     setShowMasked]     = useState(false);
  const [showExport,     setShowExport]     = useState(false);
  const [exportCopied,   setExportCopied]   = useState(false);
  const [confirmDelete,  setConfirmDelete]  = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [tab,            setTab]            = useState("triage");

  const archived = error.flags?.isArchived;
  const isFixed  = error.status === "fixed" || error.status === "validated";
  const isOpen   = error.status === "open"  || error.status === "investigating" || error.status === "reopened";

  const linkedProject = (projects || []).find((p) => p.id === error.linkedProjectId);
  const linkedPrompt  = (prompts  || []).find((p) => p.id === error.linkedPromptId);
  const linkedFix     = (prompts  || []).find((p) => p.id === error.fixPlan?.linkedFixPromptId);

  const secretCheck = error.rawLog ? detectSecretLikeContent(error.rawLog) : { found: false, terms: [] };
  const maskedLog   = secretCheck.found ? maskSecretLikeContent(error.rawLog) : error.rawLog;

  const { json: exportJson, warned: exportWarned } = exportErrorAsJson(error);

  async function handleCopyExport() {
    try {
      await navigator.clipboard.writeText(exportJson);
      setExportCopied(true);
      setTimeout(() => setExportCopied(false), 2500);
    } catch {
      alert("Clipboard unavailable — select and copy manually.");
    }
  }

  const c  = error.classification || {};
  const fp = error.fixPlan         || {};
  const fx = fp.steps              || [];
  const vx = fp.validationSteps    || [];
  const fixDone = fx.length > 0 && fx.every((s) => s.completed);
  const valDone = vx.length > 0 && vx.every((s) => s.completed);

  return (
    <div>
      {/* Back */}
      <div style={{ marginBottom: 20 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back to Error Centre</button>
      </div>

      {/* Hero */}
      <div className="hero" style={{ marginBottom: 20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
          <div style={{ flex: 1 }}>
            <div className="hero-title" style={{ fontSize:"1.05rem" }}>{error.title}</div>
            {error.slug && (
              <div className="mono text-muted" style={{ fontSize:"0.7rem", marginTop:2 }}>{error.slug}</div>
            )}
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            <StatusBadge status={error.severity} label={(error.severity || "").toUpperCase()} />
            <StatusBadge status={error.status} />
            {c.isDeploymentBlocking && <span className="badge badge-critical">⛔ Deploy Blocker</span>}
            {c.isSecurityRelated    && <span className="badge badge-danger">🔒 Security</span>}
            {c.isDataLossRisk       && <span className="badge badge-danger">⚠ Data Loss</span>}
            {c.isRegression         && <span className="badge badge-warning">↩ Regression</span>}
            {archived               && <span className="badge badge-locked">Archived</span>}
          </div>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:8 }}>
          <span className="badge badge-muted">{getLabel(ERROR_CATEGORIES, error.category)}</span>
          <span className="badge badge-muted">{getLabel(ERROR_SOURCES,    error.source)}</span>
          <span className="badge badge-muted">{error.priority} priority</span>
        </div>
        {error.description && (
          <p style={{ marginTop:10, fontSize:"0.85rem", color:"var(--muted)", maxWidth:640 }}>
            {error.description}
          </p>
        )}
      </div>

      {/* Action bar */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
        {!archived && (
          <button className="btn btn-primary btn-sm" onClick={() => onEdit?.(error)}>✎ Edit</button>
        )}
        {isOpen && !archived && (
          <button className="btn btn-success btn-sm" onClick={() => markErrorFixed(error.id, "")}>✓ Mark Fixed</button>
        )}
        {isFixed && !archived && (
          <button className="btn btn-warning btn-sm" onClick={() => markErrorReopened(error.id, "")}>↩ Reopen</button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => toggleErrorPinned(error.id)}>
          {error.flags?.isPinned ? "Unpin" : "📌 Pin"}
        </button>
        {linkedProject && (
          <button className="btn btn-ghost btn-sm" onClick={() => applyProjectClassificationFromError(error.id)}>
            ⬡ Apply to Project
          </button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => setShowExport((v) => !v)}>
          {showExport ? "↑ Hide Export" : "↓ Export JSON"}
        </button>
        {archived
          ? <button className="btn btn-ghost btn-sm" onClick={() => restoreErrorById(error.id)}>↩ Restore</button>
          : <button className="btn btn-ghost btn-sm" onClick={() => setConfirmArchive(true)}>↓ Archive</button>
        }
        <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(true)}>✕ Delete</button>
      </div>

      {/* Export */}
      {showExport && (
        <div className="json-panel" style={{ marginBottom: 24 }}>
          <div className="json-panel-header">
            <span style={{ fontSize:"0.82rem", color:"var(--accent)", fontWeight:600 }}>JSON Export</span>
            <button className="btn btn-primary btn-sm" onClick={handleCopyExport}>
              {exportCopied ? "✓ Copied!" : "⊕ Copy"}
            </button>
          </div>
          {exportWarned && (
            <div className="alert alert-warning" style={{ marginBottom:10 }}>
              ⚠ Secret-like fields were removed from this export.
            </div>
          )}
          <textarea className="form-textarea" readOnly value={exportJson} rows={12}
            style={{ fontFamily:"var(--font-mono)", fontSize:"0.68rem" }} aria-label="JSON export" />
        </div>
      )}

      {/* Raw log */}
      {error.rawLog && (
        <DS title="Raw Log">
          {secretCheck.found && (
            <div className="alert alert-danger" style={{ marginBottom:12 }}>
              ⚠ Secret-like content detected: {secretCheck.terms.join(", ")}.
              <button className="btn btn-ghost btn-sm" style={{ marginLeft:8 }}
                onClick={() => setShowMasked((v) => !v)}>
                {showMasked ? "Show Raw" : "Show Masked"}
              </button>
            </div>
          )}
          <button className="btn btn-ghost btn-sm" style={{ marginBottom:8 }}
            onClick={() => setShowLog((v) => !v)}>
            {showLog ? "↑ Collapse Log" : "↓ Show Log"}
          </button>
          {showLog && (
            <div style={{
              fontFamily:"var(--font-mono)", fontSize:"0.72rem", color:"var(--muted)",
              whiteSpace:"pre-wrap", lineHeight:1.7, maxHeight:300, overflowY:"auto",
              padding:"10px 12px", background:"rgba(0,0,0,0.25)", borderRadius:"var(--radius)",
            }}>
              {showMasked ? maskedLog : error.rawLog}
            </div>
          )}
          <div style={{ fontSize:"0.68rem", color:"var(--muted)", marginTop:6, fontFamily:"var(--font-mono)" }}>
            {(error.rawLog || "").length.toLocaleString()} characters · data only — never executed.
          </div>
        </DS>
      )}

      {/* Triage / Checklist / Classifier */}
      <DS title="Error Management">
        <div style={{ display:"flex", gap:0, marginBottom:16 }}>
          {DETAIL_TABS.map((t) => (
            <button key={t.id}
              className={`tab-btn ${tab === t.id ? "tab-btn--active" : ""}`}
              onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        {tab === "triage"     && <ErrorTriagePanel    error={error} project={linkedProject} />}
        {tab === "checklist"  && <ErrorFixChecklist   error={error} />}
        {tab === "classifier" && <ErrorClassifierPanel error={error} project={linkedProject} />}
      </DS>

      {/* Linked project */}
      {linkedProject && (
        <DS title="Linked Project">
          <div className="setting-row">
            <span className="setting-label">{linkedProject.name}</span>
            <StatusBadge status={linkedProject.status} />
          </div>
          {linkedProject.health && <DR label="Current Health" value={linkedProject.health} />}
          {error.linkedRunId    && <DR label="Run"            value={error.linkedRunId} />}
        </DS>
      )}

      {/* Linked prompts */}
      {(linkedPrompt || linkedFix) && (
        <DS title="Linked Prompts">
          {linkedPrompt && (
            <div className="setting-row">
              <span className="setting-label">Trigger Prompt</span>
              <span style={{ fontSize:"0.78rem", color:"var(--muted)" }}>{linkedPrompt.title}</span>
            </div>
          )}
          {linkedFix && (
            <div className="setting-row">
              <span className="setting-label">Fix Prompt</span>
              <span style={{ fontSize:"0.78rem", color:"var(--muted)" }}>{linkedFix.title}</span>
            </div>
          )}
        </DS>
      )}

      {/* Environment */}
      {Object.values(error.environment || {}).some(Boolean) && (
        <DS title="Environment">
          {[
            ["Platform",          error.environment?.platform],
            ["Browser",           error.environment?.browser],
            ["Device",            error.environment?.device],
            ["Framework",         error.environment?.framework],
            ["Deployment Target", error.environment?.deploymentTarget],
            ["URL",               error.environment?.url],
            ["Branch",            error.environment?.branch],
            ["Build ID",          error.environment?.buildId],
          ].filter(([, v]) => v).map(([l, v]) => <DR key={l} label={l} value={v} mono />)}
        </DS>
      )}

      {/* Diagnosis */}
      {Object.values(error.diagnosis || {}).some(Boolean) && (
        <DS title="Diagnosis">
          {[
            ["Suspected Cause",    error.diagnosis?.suspectedCause],
            ["Affected Area",      error.diagnosis?.affectedArea],
            ["Failure Point",      error.diagnosis?.failurePoint],
            ["Reproduction Steps", error.diagnosis?.reproductionSteps],
            ["Expected",           error.diagnosis?.expectedBehaviour],
            ["Actual",             error.diagnosis?.actualBehaviour],
            ["User Impact",        error.diagnosis?.userImpact],
            ["Notes",              error.diagnosis?.notes],
          ].filter(([, v]) => v).map(([l, v]) => (
            <div key={l} style={{ marginBottom:10 }}>
              <div style={{ fontSize:"0.72rem", color:"var(--accent)", fontFamily:"var(--font-mono)", marginBottom:3 }}>{l}</div>
              <div style={{ fontSize:"0.8rem", color:"var(--muted)", whiteSpace:"pre-wrap", lineHeight:1.6 }}>{v}</div>
            </div>
          ))}
        </DS>
      )}

      {/* Fix Plan */}
      {(fp.summary || fp.rollbackPlan || fp.resultNotes || fp.fixedAt) && (
        <DS title="Fix Plan">
          {fp.summary      && <div style={{marginBottom:10}}><div className="section-label" style={{marginBottom:4}}>Summary</div><div style={{fontSize:"0.8rem",color:"var(--muted)",whiteSpace:"pre-wrap"}}>{fp.summary}</div></div>}
          {fp.rollbackPlan && <div style={{marginBottom:10}}><div className="section-label" style={{marginBottom:4}}>Rollback Plan</div><div style={{fontSize:"0.8rem",color:"var(--muted)",whiteSpace:"pre-wrap"}}>{fp.rollbackPlan}</div></div>}
          {fp.fixedAt      && <DR label="Fixed At" value={fmtDate(fp.fixedAt)} mono />}
          {fp.resultNotes  && <div style={{marginTop:8}}><div className="section-label" style={{marginBottom:4}}>Result Notes</div><div style={{fontSize:"0.8rem",color:"var(--muted)",whiteSpace:"pre-wrap"}}>{fp.resultNotes}</div></div>}
          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            {fixDone && <span className="badge badge-success" style={{fontSize:"0.68rem"}}>✓ Fix Steps Complete</span>}
            {valDone && <span className="badge badge-success" style={{fontSize:"0.68rem"}}>✓ Validation Complete</span>}
          </div>
        </DS>
      )}


      {/* ── Linked Runs (Run 5) ── */}
      {(() => {
        const linked = (allRuns || []).filter((r) => r.linkedErrorId === error.id && !r.flags?.isArchived);
        if (linked.length === 0) return null;
        const fixRuns = linked.filter((r) => r.type === "fix");
        const latest  = [...linked].sort((a,b) => new Date(b.updatedAt)-new Date(a.updatedAt))[0];
        return (
          <DS title={`Linked Runs (${linked.length})`}>
            <div className="setting-row">
              <span className="setting-label">Fix Runs</span>
              <span style={{fontSize:"0.78rem",color:"var(--muted)"}}>{fixRuns.length}</span>
            </div>
            {latest && (
              <div className="setting-row">
                <span className="setting-label">Latest Run Result</span>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:"0.75rem",color:"var(--muted)"}}>{latest.title}</span>
                  <StatusBadge status={latest.status} />
                </div>
              </div>
            )}
            {linked.slice(0,3).map((r) => (
              <div key={r.id} className="setting-row">
                <div style={{flex:1}}>
                  <div style={{fontSize:"0.78rem",color:"var(--text)",fontWeight:500}}>{r.title}</div>
                  <div style={{fontSize:"0.68rem",color:"var(--muted)"}}>{r.type}{r.runNumber ? ` · Run ${r.runNumber}` : ""}</div>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
            {linked.length > 3 && <div style={{fontSize:"0.72rem",color:"var(--muted)"}}>+{linked.length-3} more</div>}
          </DS>
        );
      })()}

      {/* Tags */}
      {(error.tags || []).length > 0 && (
        <DS title="Tags">
          <div className="tags" style={{ padding:"4px 0" }}>
            {error.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
        </DS>
      )}

      {/* Flags */}
      <DS title="Flags">
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", padding:"4px 0" }}>
          {[
            ["Pinned",             error.flags?.isPinned],
            ["Needs Prompt",       error.flags?.needsPrompt],
            ["Needs Review",       error.flags?.needsHumanReview],
            ["Needs Rebuild",      error.flags?.needsRebuild],
            ["Can Ignore",         error.flags?.canBeIgnored],
            ["Archived",           error.flags?.isArchived],
            ["Deploy Blocker",     c.isDeploymentBlocking],
            ["Security",           c.isSecurityRelated],
            ["Data Loss",          c.isDataLossRisk],
            ["Regression",         c.isRegression],
            ["Recurring",          c.isRecurring],
          ].map(([l, v]) => (
            <span key={l} className={`badge ${v ? "badge-success" : "badge-muted"}`} style={{ fontSize:"0.68rem" }}>
              {v ? "✓" : "—"} {l}
            </span>
          ))}
        </div>
      </DS>

      {/* Record */}
      <DS title="Record">
        <DR label="ID"      value={error.id}           mono />
        <DR label="Created" value={fmtDate(error.createdAt)} mono />
        <DR label="Updated" value={fmtDate(error.updatedAt)} mono />
      </DS>

      {/* Dialogs */}
      <ConfirmDialog
        open={confirmDelete}
        title="Delete Error?" variant="danger"
        message={`Permanently delete "${error.title}"? This cannot be undone. Archive instead to preserve it.`}
        confirmLabel="Delete Permanently" cancelLabel="Cancel"
        onConfirm={() => { setConfirmDelete(false); deleteError(error.id); onDeleted?.(); }}
        onCancel={() => setConfirmDelete(false)}
      />
      <ConfirmDialog
        open={confirmArchive}
        title="Archive Error?" variant="danger"
        message={`Archive "${error.title}"? It will be hidden but preserved.`}
        confirmLabel="Archive" cancelLabel="Cancel"
        onConfirm={() => { setConfirmArchive(false); archiveErrorById(error.id); onBack?.(); }}
        onCancel={() => setConfirmArchive(false)}
      />
    </div>
  );
}

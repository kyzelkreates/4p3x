// ============================================================
// AP3X — RunDetail — Run 5
// /src/components/RunDetail.jsx
// ============================================================

import { useState } from "react";
import StatusBadge            from "./StatusBadge.jsx";
import ConfirmDialog          from "./ConfirmDialog.jsx";
import RunCheckpointPanel     from "./RunCheckpointPanel.jsx";
import RunValidationPanel     from "./RunValidationPanel.jsx";
import RunTimeline            from "./RunTimeline.jsx";
import RunImportExportPanel   from "./RunImportExportPanel.jsx";
import {
  archiveRunById, restoreRunById, deleteRun,
  markRunCompleted, markRunFailed, markRunValidated, toggleRunPinned,
} from "../core/storage.js";
import { RUN_TYPES, RUN_VALIDATION_RESULTS } from "../core/constants.js";
import { maskSecretLikeContent } from "../core/runUtils.js";
import { detectSecretLikeContent } from "../core/validators.js";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, { year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });
}
function getLabel(arr, v) { const f = arr.find((x) => x.value === v); return f ? f.label : (v || "—"); }

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
      <span style={{ fontSize:"0.78rem", color:"var(--muted)", maxWidth:"60%", textAlign:"right", wordBreak:"break-word", fontFamily:mono?"var(--font-mono)":undefined }}>{String(value)}</span>
    </div>
  );
}

const DETAIL_TABS = [
  { id:"checkpoints", label:"Checkpoints" },
  { id:"validation",  label:"Validation" },
  { id:"timeline",    label:"Timeline" },
];

export default function RunDetail({
  run, allRuns, projects, prompts, errors, onEdit, onBack, onDeleted,
}) {
  const [tab,            setTab]            = useState("checkpoints");
  const [showSnapshot,   setShowSnapshot]   = useState(false);
  const [showMasked,     setShowMasked]     = useState(false);
  const [showExport,     setShowExport]     = useState(false);
  const [confirmDelete,  setConfirmDelete]  = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [confirmFail,    setConfirmFail]    = useState(false);

  const archived = run.flags?.isArchived;
  const isActive = ["planned","ready","in_progress"].includes(run.status);
  const isDone   = run.status === "completed" || run.status === "validated";

  const linkedProject = (projects||[]).find((p) => p.id === run.linkedProjectId);
  const linkedPrompt  = (prompts ||[]).find((p) => p.id === run.linkedPromptId);
  const linkedError   = (errors  ||[]).find((e) => e.id === run.linkedErrorId);

  const snapContent   = run.promptSnapshot?.content || "";
  const secretCheck   = snapContent ? detectSecretLikeContent(snapContent) : { found:false, terms:[] };
  const maskedContent = secretCheck.found ? maskSecretLikeContent(snapContent) : snapContent;

  const totalChk = (run.checkpoints||[]).length;
  const passedChk= (run.checkpoints||[]).filter((c) => c.status==="passed").length;
  const failedChk= (run.checkpoints||[]).filter((c) => c.status==="failed").length;

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back to Run History</button>
      </div>

      {/* Hero */}
      <div className="hero" style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
          <div style={{ flex:1 }}>
            <div className="hero-title" style={{ fontSize:"1.05rem" }}>{run.title}</div>
            {run.slug && <div className="mono text-muted" style={{ fontSize:"0.7rem", marginTop:2 }}>{run.slug}</div>}
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {run.runNumber && <span className="badge badge-purple">Run {run.runNumber}</span>}
            <StatusBadge status={run.status} />
            {run.flags?.isBlocking       && <span className="badge badge-critical">⛔ Blocking</span>}
            {run.flags?.needsFix         && <span className="badge badge-danger">⚠ Needs Fix</span>}
            {run.flags?.causedRegression && <span className="badge badge-warning">↩ Regression</span>}
            {run.flags?.safeToContinue   && <span className="badge badge-success">✓ Safe</span>}
            {archived                    && <span className="badge badge-locked">Archived</span>}
          </div>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:8 }}>
          <span className="badge badge-muted">{getLabel(RUN_TYPES, run.type)}</span>
          <span className="badge badge-muted">{run.priority} priority</span>
          <StatusBadge status={run.validation?.result || "not_tested"} label={`Validation: ${(run.validation?.result||"not_tested").replace("_"," ")}`} />
        </div>
        {run.description && (
          <p style={{ marginTop:10, fontSize:"0.85rem", color:"var(--muted)", maxWidth:640 }}>{run.description}</p>
        )}
      </div>

      {/* Action bar */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
        {!archived && <button className="btn btn-primary btn-sm" onClick={() => onEdit?.(run)}>✎ Edit</button>}
        {isActive && !archived && (
          <>
            <button className="btn btn-success btn-sm" onClick={() => markRunCompleted(run.id, {})}>✓ Complete</button>
            <button className="btn btn-danger  btn-sm" onClick={() => setConfirmFail(true)}>✕ Fail</button>
          </>
        )}
        {(isDone || run.status === "needs_review") && !archived && (
          <button className="btn btn-accent btn-sm" onClick={() => markRunValidated(run.id, run.validation?.result || "passed")}>
            ⬡ Validate
          </button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => toggleRunPinned(run.id)}>
          {run.flags?.isPinned ? "Unpin" : "📌 Pin"}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowExport((v) => !v)}>
          {showExport ? "↑ Hide Export" : "↓ Export JSON"}
        </button>
        {archived
          ? <button className="btn btn-ghost btn-sm" onClick={() => restoreRunById(run.id)}>↩ Restore</button>
          : <button className="btn btn-ghost btn-sm" onClick={() => setConfirmArchive(true)}>↓ Archive</button>
        }
        <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(true)}>✕ Delete</button>
      </div>

      {/* Export panel */}
      {showExport && (
        <div style={{ marginBottom:24 }}>
          <RunImportExportPanel run={run} allRuns={allRuns||[]} onClose={() => setShowExport(false)} />
        </div>
      )}

      {/* Checkpoint / Validation / Timeline tabs */}
      <DS title="Run Management">
        <div style={{ display:"flex", gap:0, marginBottom:16 }}>
          {DETAIL_TABS.map((t) => (
            <button key={t.id} className={`tab-btn ${tab===t.id?"tab-btn--active":""}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        {tab === "checkpoints" && <RunCheckpointPanel run={run} />}
        {tab === "validation"  && <RunValidationPanel run={run} />}
        {tab === "timeline"    && <RunTimeline run={run} />}
      </DS>

      {/* Scope */}
      {(run.scope?.summary || run.scope?.allowedWork?.length || run.scope?.forbiddenWork?.length) && (
        <DS title="Scope">
          {run.scope.summary && <div style={{ fontSize:"0.8rem", color:"var(--muted)", marginBottom:10, whiteSpace:"pre-wrap" }}>{run.scope.summary}</div>}
          {run.scope.allowedWork?.length > 0 && (
            <div style={{ marginBottom:8 }}>
              <div className="section-label" style={{ marginBottom:4 }}>Allowed Work</div>
              {run.scope.allowedWork.map((w, i) => <div key={i} style={{ fontSize:"0.75rem", color:"var(--muted)", padding:"2px 0" }}>✓ {w}</div>)}
            </div>
          )}
          {run.scope.forbiddenWork?.length > 0 && (
            <div style={{ marginBottom:8 }}>
              <div className="section-label" style={{ marginBottom:4 }}>Forbidden Work</div>
              {run.scope.forbiddenWork.map((w, i) => <div key={i} style={{ fontSize:"0.75rem", color:"var(--danger)", padding:"2px 0" }}>⛔ {w}</div>)}
            </div>
          )}
          {run.scope.filesTouched?.length > 0 && (
            <div>
              <div className="section-label" style={{ marginBottom:4 }}>Files Touched</div>
              {run.scope.filesTouched.map((f, i) => <div key={i} style={{ fontSize:"0.72rem", color:"var(--muted)", fontFamily:"var(--font-mono)", padding:"2px 0" }}>{f}</div>)}
            </div>
          )}
        </DS>
      )}

      {/* Prompt Snapshot */}
      {(snapContent || run.promptSnapshot?.title) && (
        <DS title="Prompt Snapshot">
          {secretCheck.found && (
            <div className="alert alert-danger" style={{ marginBottom:10 }}>
              ⚠ Secret-like content detected in snapshot: {secretCheck.terms.join(", ")}.
              <button className="btn btn-ghost btn-sm" style={{ marginLeft:8 }} onClick={() => setShowMasked((v) => !v)}>
                {showMasked ? "Show Raw" : "Show Masked"}
              </button>
            </div>
          )}
          {run.promptSnapshot?.title && (
            <div style={{ fontWeight:600, fontSize:"0.82rem", color:"var(--text)", marginBottom:6 }}>{run.promptSnapshot.title}</div>
          )}
          <button className="btn btn-ghost btn-sm" style={{ marginBottom:8 }} onClick={() => setShowSnapshot((v) => !v)}>
            {showSnapshot ? "↑ Collapse" : "↓ Show Snapshot"}
          </button>
          {showSnapshot && snapContent && (
            <div style={{
              fontFamily:"var(--font-mono)", fontSize:"0.72rem", color:"var(--muted)",
              whiteSpace:"pre-wrap", lineHeight:1.7, maxHeight:300, overflowY:"auto",
              padding:"10px 12px", background:"rgba(0,0,0,0.25)", borderRadius:"var(--radius)",
            }}>
              {showMasked ? maskedContent : snapContent}
            </div>
          )}
          <div style={{ fontSize:"0.68rem", color:"var(--muted)", marginTop:6, fontFamily:"var(--font-mono)" }}>
            {snapContent.length.toLocaleString()} characters · text data only — never executed.
          </div>
        </DS>
      )}

      {/* Outcome */}
      {(run.outcome?.summary || run.outcome?.filesCreated?.length || run.outcome?.resultNotes) && (
        <DS title="Outcome">
          {run.outcome.summary      && <div style={{ marginBottom:10 }}><div className="section-label" style={{marginBottom:4}}>Summary</div><div style={{fontSize:"0.8rem",color:"var(--muted)",whiteSpace:"pre-wrap"}}>{run.outcome.summary}</div></div>}
          {run.outcome.filesCreated?.length > 0 && (
            <div style={{ marginBottom:8 }}>
              <div className="section-label" style={{marginBottom:4}}>Files Created</div>
              {run.outcome.filesCreated.map((f,i) => <div key={i} style={{fontSize:"0.72rem",color:"var(--muted)",fontFamily:"var(--font-mono)",padding:"2px 0"}}>+ {f}</div>)}
            </div>
          )}
          {run.outcome.filesUpdated?.length > 0 && (
            <div style={{ marginBottom:8 }}>
              <div className="section-label" style={{marginBottom:4}}>Files Updated</div>
              {run.outcome.filesUpdated.map((f,i) => <div key={i} style={{fontSize:"0.72rem",color:"var(--muted)",fontFamily:"var(--font-mono)",padding:"2px 0"}}>↑ {f}</div>)}
            </div>
          )}
          {run.outcome.knownLimitations     && <div style={{marginBottom:8}}><div className="section-label" style={{marginBottom:4}}>Known Limitations</div><div style={{fontSize:"0.8rem",color:"var(--muted)",whiteSpace:"pre-wrap"}}>{run.outcome.knownLimitations}</div></div>}
          {run.outcome.nextRecommendedAction && <div style={{marginBottom:8}}><div className="section-label" style={{marginBottom:4}}>Next Action</div><div style={{fontSize:"0.8rem",color:"var(--accent)",whiteSpace:"pre-wrap"}}>{run.outcome.nextRecommendedAction}</div></div>}
          {run.outcome.resultNotes          && <div><div className="section-label" style={{marginBottom:4}}>Result Notes</div><div style={{fontSize:"0.8rem",color:"var(--muted)",whiteSpace:"pre-wrap"}}>{run.outcome.resultNotes}</div></div>}
        </DS>
      )}

      {/* Linked records */}
      {(linkedProject || linkedPrompt || linkedError) && (
        <DS title="Linked Records">
          {linkedProject && (
            <div className="setting-row">
              <span className="setting-label">Project: {linkedProject.name}</span>
              <StatusBadge status={linkedProject.status} />
            </div>
          )}
          {linkedPrompt && (
            <div className="setting-row">
              <span className="setting-label">Prompt: {linkedPrompt.title}</span>
              <StatusBadge status={linkedPrompt.status} />
            </div>
          )}
          {linkedError && (
            <div className="setting-row">
              <span className="setting-label">Error: {linkedError.title}</span>
              <StatusBadge status={linkedError.severity} />
            </div>
          )}
        </DS>
      )}

      {/* Tags */}
      {(run.tags||[]).length > 0 && (
        <DS title="Tags">
          <div className="tags" style={{ padding:"4px 0" }}>
            {run.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
        </DS>
      )}

      {/* Flags */}
      <DS title="Flags">
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", padding:"4px 0" }}>
          {[
            ["Pinned",           run.flags?.isPinned],
            ["Blocking",         run.flags?.isBlocking],
            ["Needs Fix",        run.flags?.needsFix],
            ["Needs Review",     run.flags?.needsReview],
            ["Regression",       run.flags?.causedRegression],
            ["Safe to Continue", run.flags?.safeToContinue],
            ["Archived",         run.flags?.isArchived],
          ].map(([l, v]) => (
            <span key={l} className={`badge ${v?"badge-success":"badge-muted"}`} style={{ fontSize:"0.68rem" }}>
              {v ? "✓" : "—"} {l}
            </span>
          ))}
        </div>
      </DS>

      {/* Record */}
      <DS title="Record">
        <DR label="ID"      value={run.id}            mono />
        <DR label="Slug"    value={run.slug}           mono />
        <DR label="Created" value={fmtDate(run.createdAt)} mono />
        <DR label="Updated" value={fmtDate(run.updatedAt)} mono />
      </DS>

      {/* Dialogs */}
      <ConfirmDialog
        open={confirmDelete}
        title="Delete Run?" variant="danger"
        message={`Permanently delete "${run.title}"? This cannot be undone. Archive instead to preserve it.`}
        confirmLabel="Delete Permanently" cancelLabel="Cancel"
        onConfirm={() => { setConfirmDelete(false); deleteRun(run.id); onDeleted?.(); }}
        onCancel={() => setConfirmDelete(false)}
      />
      <ConfirmDialog
        open={confirmArchive}
        title="Archive Run?" variant="danger"
        message={`Archive "${run.title}"? It will be hidden but preserved.`}
        confirmLabel="Archive" cancelLabel="Cancel"
        onConfirm={() => { setConfirmArchive(false); archiveRunById(run.id); onBack?.(); }}
        onCancel={() => setConfirmArchive(false)}
      />
      <ConfirmDialog
        open={confirmFail}
        title="Mark Run as Failed?" variant="danger"
        message={`Mark "${run.title}" as failed? This will flag it as needing a fix.`}
        confirmLabel="Mark Failed" cancelLabel="Cancel"
        onConfirm={() => { setConfirmFail(false); markRunFailed(run.id, ""); }}
        onCancel={() => setConfirmFail(false)}
      />
    </div>
  );
}

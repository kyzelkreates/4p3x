// ============================================================
// AP3X — PromptDetail Component
// /src/components/PromptDetail.jsx — Run 3
// ============================================================

import { useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import PromptSafetyPanel from "./PromptSafetyPanel.jsx";
import PromptVersionTimeline from "./PromptVersionTimeline.jsx";
import PromptCopyPanel from "./PromptCopyPanel.jsx";
import PromptImportExportPanel from "./PromptImportExportPanel.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import {
  PROMPT_TYPES, PROMPT_CATEGORIES, PROMPT_PRIORITIES,
} from "../core/constants.js";
import {
  archivePromptById, restorePromptById, deletePrompt,
  togglePromptPinned, togglePromptFavourite,
} from "../core/storage.js";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function getLabel(arr, value) {
  const f = arr.find((x) => x.value === value); return f ? f.label : value;
}

function DetailSection({ title, children }) {
  return (
    <div className="detail-section">
      <div className="section-label">{title}</div>
      <div className="panel">{children}</div>
    </div>
  );
}

function FlagBadge({ label, active }) {
  return (
    <span className={`badge ${active ? "badge-success" : "badge-muted"}`} style={{ fontSize: "0.68rem" }}>
      {active ? "✓" : "—"} {label}
    </span>
  );
}

export default function PromptDetail({
  prompt, allPrompts, projects, allErrors, allRuns, onEdit, onBack, onDeleted,
}) {
  const [showCopy,     setShowCopy]     = useState(false);
  const [showExport,   setShowExport]   = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [confirmDelete,  setConfirmDelete]  = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);

  const archived = prompt.flags?.isArchived;
  const isMaster = prompt.flags?.isMasterPrompt || prompt.status === "master";

  const linkedProject = projects?.find((p) => p.id === prompt.linkedProjectId);

  return (
    <div>
      {/* Back */}
      <div style={{ marginBottom: 20 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back to Vault</button>
      </div>

      {/* Header */}
      <div className="hero" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="hero-title" style={{ fontSize: "1.1rem" }}>{prompt.title}</div>
            {prompt.slug && <div className="mono text-muted" style={{ fontSize: "0.7rem", marginTop: 2 }}>{prompt.slug}</div>}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <StatusBadge status={prompt.status} />
            {isMaster  && <span className="badge badge-purple">⬡ Master</span>}
            {archived  && <span className="badge badge-locked">Archived</span>}
            {prompt.flags?.isPinned    && <span className="badge badge-accent">📌 Pinned</span>}
            {prompt.flags?.isFavourite && <span className="badge badge-warning">★ Favourite</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <span className="badge badge-muted">{getLabel(PROMPT_TYPES, prompt.type)}</span>
          <span className="badge badge-muted">{getLabel(PROMPT_CATEGORIES, prompt.category)}</span>
          <span className="badge badge-muted">{getLabel(PROMPT_PRIORITIES, prompt.priority)}</span>
        </div>
        {prompt.description && (
          <p style={{ marginTop: 10, fontSize: "0.85rem", color: "var(--muted)", maxWidth: 600 }}>
            {prompt.description}
          </p>
        )}
      </div>

      {/* Action Bar */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {!archived && (
          <button className="btn btn-primary btn-sm" onClick={() => onEdit?.(prompt)}>✎ Edit</button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => setShowCopy((v) => !v)}>
          {showCopy ? "↑ Hide Copy" : "⊕ Copy Prompt"}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => togglePromptPinned(prompt.id)}>
          {prompt.flags?.isPinned ? "Unpin" : "📌 Pin"}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => togglePromptFavourite(prompt.id)}>
          {prompt.flags?.isFavourite ? "Unfav" : "★ Favourite"}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowExport((v) => !v)}>
          {showExport ? "↑ Hide Export" : "↓ Export"}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowVersions((v) => !v)}>
          {showVersions ? "↑ Versions" : "⊕ Versions"}
        </button>
        {archived
          ? <button className="btn btn-ghost btn-sm" onClick={() => restorePromptById(prompt.id)}>↩ Restore</button>
          : <button className="btn btn-ghost btn-sm" onClick={() => setConfirmArchive(true)}>↓ Archive</button>
        }
        <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(true)}>✕ Delete</button>
      </div>

      {/* Copy Panel */}
      {showCopy && (
        <div style={{ marginBottom: 24 }}>
          <PromptCopyPanel prompt={prompt} onClose={() => setShowCopy(false)} />
        </div>
      )}

      {/* Export Panel */}
      {showExport && (
        <div style={{ marginBottom: 24 }}>
          <PromptImportExportPanel
            prompt={prompt} allPrompts={allPrompts}
            onClose={() => setShowExport(false)}
          />
        </div>
      )}

      {/* Versions */}
      {showVersions && (
        <DetailSection title={`Version History (${prompt.versioning?.versions?.length ?? 0})`}>
          <PromptVersionTimeline prompt={prompt} />
        </DetailSection>
      )}

      {/* Safety */}
      <DetailSection title="Safety Analysis">
        <PromptSafetyPanel safety={prompt.safety} />
      </DetailSection>

      {/* Prompt Content */}
      <DetailSection title="Prompt Content">
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)",
          whiteSpace: "pre-wrap", lineHeight: 1.7,
          maxHeight: 400, overflowY: "auto",
          padding: "12px 14px",
          background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius)",
        }}>
          {prompt.content || "(empty)"}
        </div>
        <div style={{ fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-mono)", marginTop: 6 }}>
          {prompt.content?.length ?? 0} characters · Content is data only — not executed.
        </div>
      </DetailSection>

      {/* Linked Project */}
      {linkedProject && (
        <DetailSection title="Linked Project">
          <div className="setting-row">
            <span className="setting-label">{linkedProject.name}</span>
            <StatusBadge status={linkedProject.status} />
          </div>
          {prompt.linkedRunId && (
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 6 }}>
              Run: {prompt.linkedRunId}
            </div>
          )}
          {prompt.linkedErrorId && (
            <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
              Error ID: {prompt.linkedErrorId}
            </div>
          )}
        </DetailSection>
      )}

      {/* Platform */}
      {(prompt.platform?.target || prompt.platform?.model) && (
        <DetailSection title="Platform Targeting">
          {[
            ["Target",      prompt.platform?.target],
            ["Model",       prompt.platform?.model],
            ["Environment", prompt.platform?.environment],
            ["Notes",       prompt.platform?.notes],
          ].filter(([, v]) => v).map(([label, val]) => (
            <div key={label} className="setting-row">
              <span className="setting-label">{label}</span>
              <span className="mono text-muted" style={{ fontSize: "0.78rem" }}>{val}</span>
            </div>
          ))}
        </DetailSection>
      )}



      {/* ── Linked Runs (Run 5) ── */}
      {(() => {
        const linked = (allRuns || []).filter((r) => r.linkedPromptId === prompt.id && !r.flags?.isArchived);
        if (linked.length === 0) return null;
        const fromSnap = (allRuns || []).filter((r) => r.promptSnapshot?.copiedFromPromptId === prompt.id && !r.flags?.isArchived);
        return (
          <DetailSection title={`Linked Runs (${linked.length})`}>
            <div className="setting-row">
              <span className="setting-label">Directly linked</span>
              <span style={{fontSize:"0.78rem",color:"var(--muted)"}}>{linked.length}</span>
            </div>
            {fromSnap.length > 0 && (
              <div className="setting-row">
                <span className="setting-label">Used as snapshot</span>
                <span style={{fontSize:"0.78rem",color:"var(--muted)"}}>{fromSnap.length}</span>
              </div>
            )}
            {linked.slice(0,3).map((r) => (
              <div key={r.id} className="setting-row">
                <div style={{flex:1}}>
                  <div style={{fontSize:"0.78rem",color:"var(--text)",fontWeight:500}}>{r.title}</div>
                  {r.runNumber && <div style={{fontSize:"0.68rem",color:"var(--muted)",fontFamily:"var(--font-mono)"}}>Run {r.runNumber}</div>}
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
            {linked.length > 3 && <div style={{fontSize:"0.72rem",color:"var(--muted)"}}>+{linked.length-3} more</div>}
          </DetailSection>
        );
      })()}

      {/* ── Linked Errors (Run 4) ── */}
      {(() => {
        const linked = (allErrors || []).filter((e) => e.linkedPromptId === prompt.id || e.linkedErrorId === prompt.id);
        if (linked.length === 0) return null;
        return (
          <DetailSection title={`Linked Errors (${linked.length})`}>
            {linked.map((e) => (
              <div key={e.id} className="setting-row">
                <div style={{flex:1}}>
                  <div style={{fontSize:"0.82rem",color:"var(--text)",fontWeight:500}}>{e.title}</div>
                  <div style={{fontSize:"0.72rem",color:"var(--muted)",marginTop:2}}>
                    {e.category?.replace(/_/g," ")} · {e.source}
                  </div>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <StatusBadge status={e.severity} label={e.severity?.toUpperCase()} />
                  <StatusBadge status={e.status} />
                </div>
              </div>
            ))}
          </DetailSection>
        );
      })()}

      {/* Tags */}
      {prompt.tags?.length > 0 && (
        <DetailSection title="Tags">
          <div className="tags" style={{ padding: "4px 0" }}>
            {prompt.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
        </DetailSection>
      )}

      {/* Usage */}
      <DetailSection title="Usage History">
        <div className="setting-row">
          <span className="setting-label">Times Copied</span>
          <span className="mono text-muted" style={{ fontSize: "0.78rem" }}>{prompt.usage?.timesCopied ?? 0}</span>
        </div>
        <div className="setting-row">
          <span className="setting-label">Last Copied</span>
          <span className="mono text-muted" style={{ fontSize: "0.78rem" }}>{fmtDate(prompt.usage?.lastCopiedAt)}</span>
        </div>
        <div className="setting-row">
          <span className="setting-label">Result Status</span>
          <span className="mono text-muted" style={{ fontSize: "0.78rem" }}>{prompt.usage?.resultStatus || "unknown"}</span>
        </div>
        {prompt.usage?.resultNotes && (
          <div style={{ marginTop: 8, fontSize: "0.78rem", color: "var(--muted)", whiteSpace: "pre-wrap" }}>
            {prompt.usage.resultNotes}
          </div>
        )}
      </DetailSection>

      {/* Flags */}
      <DetailSection title="Flags">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "4px 0" }}>
          <FlagBadge label="Pinned"       active={prompt.flags?.isPinned} />
          <FlagBadge label="Favourite"    active={prompt.flags?.isFavourite} />
          <FlagBadge label="Template"     active={prompt.flags?.isTemplate} />
          <FlagBadge label="Master"       active={prompt.flags?.isMasterPrompt} />
          <FlagBadge label="Needs Review" active={prompt.flags?.needsReview} />
          <FlagBadge label="Archived"     active={prompt.flags?.isArchived} />
        </div>
      </DetailSection>

      {/* Record */}
      <DetailSection title="Record">
        <div className="setting-row">
          <span className="setting-label">ID</span>
          <span className="mono text-muted" style={{ fontSize: "0.72rem" }}>{prompt.id}</span>
        </div>
        <div className="setting-row">
          <span className="setting-label">Version</span>
          <span className="mono text-muted" style={{ fontSize: "0.72rem" }}>v{prompt.versioning?.currentVersion ?? 1}</span>
        </div>
        <div className="setting-row">
          <span className="setting-label">Created</span>
          <span className="mono text-muted" style={{ fontSize: "0.72rem" }}>{fmtDate(prompt.createdAt)}</span>
        </div>
        <div className="setting-row">
          <span className="setting-label">Updated</span>
          <span className="mono text-muted" style={{ fontSize: "0.72rem" }}>{fmtDate(prompt.updatedAt)}</span>
        </div>
      </DetailSection>

      {/* Dialogs */}
      <ConfirmDialog
        open={confirmDelete}
        title="Delete Prompt?"
        message={`Permanently delete "${prompt.title}"? This cannot be undone. Consider archiving instead.`}
        confirmLabel="Delete Permanently" cancelLabel="Cancel" variant="danger"
        onConfirm={() => { setConfirmDelete(false); deletePrompt(prompt.id); onDeleted?.(); }}
        onCancel={() => setConfirmDelete(false)}
      />
      <ConfirmDialog
        open={confirmArchive}
        title="Archive Prompt?"
        message={`Archive "${prompt.title}"? It will be hidden but preserved.`}
        confirmLabel="Archive" cancelLabel="Cancel" variant="danger"
        onConfirm={() => { setConfirmArchive(false); archivePromptById(prompt.id); onBack?.(); }}
        onCancel={() => setConfirmArchive(false)}
      />
    </div>
  );
}

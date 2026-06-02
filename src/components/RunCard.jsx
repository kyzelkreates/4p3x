// ============================================================
// AP3X — RunCard — Run 5
// /src/components/RunCard.jsx
// ============================================================

import StatusBadge from "./StatusBadge.jsx";
import { RUN_TYPES } from "../core/constants.js";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { year:"numeric", month:"short", day:"numeric" });
}
function getLabel(arr, v) {
  const f = arr.find((x) => x.value === v); return f ? f.label : (v || "—");
}

function CheckpointProgress({ checkpoints }) {
  const total  = (checkpoints || []).length;
  if (total === 0) return null;
  const passed = checkpoints.filter((c) => c.status === "passed").length;
  const failed = checkpoints.filter((c) => c.status === "failed").length;
  const pct    = Math.round((passed / total) * 100);
  return (
    <div style={{ fontSize:"0.7rem", color:"var(--muted)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
        <span>Checkpoints {passed}/{total}</span>
        {failed > 0 && <span style={{ color:"var(--danger)" }}>{failed} failed</span>}
      </div>
      <div style={{ height:3, background:"var(--border2)", borderRadius:2, overflow:"hidden" }}>
        <div style={{
          height:"100%", width:`${pct}%`,
          background: failed > 0 ? "var(--danger)" : pct === 100 ? "var(--success)" : "var(--accent)",
          transition:"width 0.3s",
        }} />
      </div>
    </div>
  );
}

export default function RunCard({
  run, linkedProjectName, linkedPromptName, linkedErrorName,
  onView, onEdit, onDuplicate, onMarkCompleted, onMarkFailed, onMarkValidated,
  onArchive, onRestore, onDelete,
}) {
  const archived = run.flags?.isArchived;
  const sev = run.status;
  const isActive = sev === "in_progress" || sev === "planned" || sev === "ready";
  const isFailed = sev === "failed" || sev === "blocked";
  const isDone   = sev === "completed" || sev === "validated";
  const validResult = run.validation?.result || "not_tested";

  const borderColor = archived ? "var(--border2)"
    : sev === "failed" || sev === "blocked" ? "rgba(239,68,68,0.3)"
    : sev === "completed" || sev === "validated" ? "rgba(34,197,94,0.2)"
    : sev === "in_progress" ? "rgba(0,229,255,0.2)"
    : "var(--border2)";

  return (
    <div className="item-card" style={{ borderColor, opacity: archived ? 0.6 : 1 }}>
      {/* Flag badges */}
      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:3 }}>
        {archived             && <span className="badge badge-locked"   style={{fontSize:"0.6rem"}}>Archived</span>}
        {run.flags?.isPinned  && <span className="badge badge-accent"   style={{fontSize:"0.6rem"}}>📌 Pinned</span>}
        {run.flags?.isBlocking&& <span className="badge badge-critical" style={{fontSize:"0.6rem"}}>⛔ Blocking</span>}
        {run.flags?.needsFix  && <span className="badge badge-danger"   style={{fontSize:"0.6rem"}}>⚠ Needs Fix</span>}
        {run.flags?.causedRegression && <span className="badge badge-warning" style={{fontSize:"0.6rem"}}>↩ Regression</span>}
        {run.flags?.safeToContinue   && <span className="badge badge-success" style={{fontSize:"0.6rem"}}>✓ Safe</span>}
        {run.flags?.needsReview      && <span className="badge badge-warning" style={{fontSize:"0.6rem"}}>👤 Review</span>}
      </div>

      {/* Header */}
      <div className="item-card-header">
        <div style={{ flex:1 }}>
          <div className="item-card-title">{run.title}</div>
          <div style={{ display:"flex", gap:5, marginTop:4, flexWrap:"wrap" }}>
            {run.runNumber && <span className="badge badge-purple" style={{fontSize:"0.62rem"}}>Run {run.runNumber}</span>}
            <span className="badge badge-muted" style={{fontSize:"0.62rem"}}>{getLabel(RUN_TYPES, run.type)}</span>
            <span className="badge badge-muted" style={{fontSize:"0.62rem"}}>{run.priority}</span>
          </div>
        </div>
        <StatusBadge status={run.status} />
      </div>

      {/* Description */}
      {run.description && (
        <div className="item-card-desc" style={{
          overflow:"hidden", display:"-webkit-box",
          WebkitBoxOrient:"vertical", WebkitLineClamp:2,
        }}>{run.description}</div>
      )}

      {/* Links */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {linkedProjectName && <span style={{fontSize:"0.72rem",color:"var(--muted)"}}>◈ {linkedProjectName}</span>}
        {linkedPromptName  && <span style={{fontSize:"0.72rem",color:"var(--muted)"}}>◎ {linkedPromptName}</span>}
        {linkedErrorName   && <span style={{fontSize:"0.72rem",color:"var(--muted)"}}>⚠ {linkedErrorName}</span>}
      </div>

      {/* Checkpoint progress */}
      <CheckpointProgress checkpoints={run.checkpoints} />

      {/* Validation result */}
      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
        <span style={{fontSize:"0.7rem",color:"var(--muted)"}}>Validation:</span>
        <StatusBadge status={validResult} label={validResult.replace("_"," ")} />
      </div>

      {/* Tags */}
      {run.tags?.length > 0 && (
        <div className="tags">
          {run.tags.slice(0, 4).map((t) => <span key={t} className="tag">{t}</span>)}
          {run.tags.length > 4 && <span className="tag">+{run.tags.length - 4}</span>}
        </div>
      )}

      {/* Date */}
      <div style={{ fontSize:"0.68rem", color:"var(--muted)" }}>{fmtDate(run.updatedAt)}</div>

      {/* Actions */}
      <div style={{
        display:"flex", gap:5, flexWrap:"wrap",
        paddingTop:10, borderTop:"1px solid var(--border2)",
      }}>
        <button className="btn btn-ghost btn-sm" onClick={() => onView?.(run)}      aria-label="View">◎ View</button>
        {!archived && <button className="btn btn-ghost btn-sm" onClick={() => onEdit?.(run)} aria-label="Edit">✎ Edit</button>}
        <button className="btn btn-ghost btn-sm"  onClick={() => onDuplicate?.(run)}  aria-label="Duplicate">⊕ Dupe</button>
        {isActive && !archived && (
          <>
            <button className="btn btn-success btn-sm" onClick={() => onMarkCompleted?.(run)} aria-label="Mark completed">✓ Done</button>
            <button className="btn btn-danger  btn-sm" onClick={() => onMarkFailed?.(run)}    aria-label="Mark failed">✕ Fail</button>
          </>
        )}
        {(isDone || sev === "needs_review") && !archived && (
          <button className="btn btn-accent btn-sm" onClick={() => onMarkValidated?.(run)} aria-label="Mark validated">⬡ Validate</button>
        )}
        {archived
          ? <button className="btn btn-ghost btn-sm" onClick={() => onRestore?.(run)} aria-label="Restore">↩ Restore</button>
          : <button className="btn btn-ghost btn-sm" onClick={() => onArchive?.(run)} aria-label="Archive">↓ Archive</button>
        }
        <button className="btn btn-danger btn-sm" onClick={() => onDelete?.(run)} aria-label="Delete">✕</button>
      </div>
    </div>
  );
}

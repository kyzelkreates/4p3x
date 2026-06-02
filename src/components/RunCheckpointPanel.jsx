// ============================================================
// AP3X — RunCheckpointPanel — Run 5
// /src/components/RunCheckpointPanel.jsx
// All mutations through storage.js only.
// ============================================================

import { useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import {
  addRunCheckpoint, updateRunCheckpoint, deleteRunCheckpoint,
} from "../core/storage.js";
import { createCheckpoint } from "../core/runUtils.js";
import { RUN_CHECKPOINT_STATUSES } from "../core/constants.js";

function fmtDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });
}

function CheckpointRow({ cp, runId, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [notes,   setNotes]   = useState(cp.notes || "");

  function handleStatusChange(newStatus) {
    updateRunCheckpoint(runId, cp.id, { status: newStatus });
  }
  function handleSaveNotes() {
    updateRunCheckpoint(runId, cp.id, { notes });
    setEditing(false);
  }

  const statusColor = cp.status === "passed"  ? "var(--success)"
    : cp.status === "failed"                  ? "var(--danger)"
    : cp.status === "in_progress"             ? "var(--accent)"
    : cp.status === "skipped"                 ? "var(--muted)"
    : "var(--muted)";

  return (
    <div style={{
      padding:"12px 14px", marginBottom:8,
      background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)",
      borderRadius:"var(--radius)", borderLeft:`3px solid ${statusColor}`,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, flexWrap:"wrap" }}>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:600, fontSize:"0.83rem", color:"var(--text)", marginBottom:3 }}>{cp.title}</div>
          {cp.description && (
            <div style={{ fontSize:"0.75rem", color:"var(--muted)", marginBottom:4 }}>{cp.description}</div>
          )}
          {cp.completedAt && (
            <div style={{ fontSize:"0.68rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
              Completed: {fmtDate(cp.completedAt)}
            </div>
          )}
        </div>
        <StatusBadge status={cp.status} label={cp.status.replace("_"," ")} />
      </div>

      {/* Status buttons */}
      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginTop:10 }}>
        {RUN_CHECKPOINT_STATUSES.map((s) => (
          <button
            key={s.value}
            className={`btn btn-sm ${cp.status === s.value ? "btn-primary" : "btn-ghost"}`}
            onClick={() => handleStatusChange(s.value)}
            aria-label={`Set to ${s.label}`}
            aria-pressed={cp.status === s.value}
          >
            {s.label}
          </button>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={() => setEditing((v) => !v)} aria-label="Edit notes">
          ✎ Notes
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(cp.id)} aria-label="Delete checkpoint">
          ✕
        </button>
      </div>

      {/* Notes editor */}
      {editing && (
        <div style={{ marginTop:10 }}>
          <textarea
            className="form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={3000}
            placeholder="Checkpoint notes…"
            aria-label="Checkpoint notes"
          />
          <div style={{ display:"flex", gap:8, marginTop:6 }}>
            <button className="btn btn-primary btn-sm" onClick={handleSaveNotes} aria-label="Save notes">✓ Save</button>
            <button className="btn btn-ghost   btn-sm" onClick={() => { setNotes(cp.notes||""); setEditing(false); }} aria-label="Cancel">Cancel</button>
          </div>
        </div>
      )}

      {cp.notes && !editing && (
        <div style={{ marginTop:8, fontSize:"0.75rem", color:"var(--muted)", whiteSpace:"pre-wrap" }}>
          {cp.notes}
        </div>
      )}
    </div>
  );
}

export default function RunCheckpointPanel({ run }) {
  const checkpoints = run.checkpoints || [];
  const [newTitle, setNewTitle] = useState("");
  const [newDesc,  setNewDesc]  = useState("");

  const passed  = checkpoints.filter((c) => c.status === "passed").length;
  const failed  = checkpoints.filter((c) => c.status === "failed").length;
  const pending = checkpoints.filter((c) => c.status === "pending").length;
  const total   = checkpoints.length;

  function handleAddCheckpoint() {
    if (!newTitle.trim()) return;
    const cp = createCheckpoint(newTitle.trim(), newDesc.trim());
    addRunCheckpoint(run.id, cp);
    setNewTitle(""); setNewDesc("");
  }

  function handleDelete(checkpointId) {
    deleteRunCheckpoint(run.id, checkpointId);
  }

  return (
    <div>
      {/* Summary */}
      {total > 0 && (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
          <span className="badge badge-muted" style={{fontSize:"0.7rem"}}>{total} total</span>
          <span className="badge badge-success" style={{fontSize:"0.7rem"}}>✓ {passed} passed</span>
          {failed > 0 && <span className="badge badge-danger" style={{fontSize:"0.7rem"}}>✕ {failed} failed</span>}
          {pending > 0 && <span className="badge badge-muted"  style={{fontSize:"0.7rem"}}>○ {pending} pending</span>}
        </div>
      )}

      {/* Progress bar */}
      {total > 0 && (
        <div style={{ marginBottom:16 }}>
          <div style={{ height:4, background:"var(--border2)", borderRadius:2, overflow:"hidden" }}>
            <div style={{
              height:"100%",
              width:`${Math.round((passed / total) * 100)}%`,
              background: failed > 0 ? "var(--danger)" : passed === total ? "var(--success)" : "var(--accent)",
              transition:"width 0.3s",
            }} />
          </div>
          <div style={{ fontSize:"0.68rem", color:"var(--muted)", marginTop:4, textAlign:"right" }}>
            {Math.round((passed / total) * 100)}% complete
          </div>
        </div>
      )}

      {/* Checkpoint list */}
      {checkpoints.length === 0
        ? <div style={{ fontSize:"0.78rem", color:"var(--muted)", padding:"8px 0", marginBottom:14 }}>
            No checkpoints yet. Add one below.
          </div>
        : checkpoints.map((cp) => (
            <CheckpointRow key={cp.id} cp={cp} runId={run.id} onDelete={handleDelete} />
          ))
      }

      {/* Add new */}
      <div style={{ borderTop:"1px solid var(--border2)", paddingTop:14, marginTop:4 }}>
        <div className="section-label" style={{ marginBottom:10 }}>Add Checkpoint</div>
        <div className="form-field" style={{ marginBottom:8 }}>
          <label className="form-label">Title <span style={{color:"var(--danger)"}}>*</span></label>
          <input
            className="form-input"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCheckpoint()}
            placeholder="Checkpoint title…"
            maxLength={120}
            aria-label="New checkpoint title"
          />
        </div>
        <div className="form-field" style={{ marginBottom:10 }}>
          <label className="form-label">Description</label>
          <input
            className="form-input"
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Optional description…"
            maxLength={500}
            aria-label="New checkpoint description"
          />
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleAddCheckpoint} disabled={!newTitle.trim()} aria-label="Add checkpoint">
          + Add Checkpoint
        </button>
      </div>

      <div style={{ marginTop:14, padding:"8px 10px", background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.68rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
        All checkpoint updates through storage.js SSOT only.
      </div>
    </div>
  );
}

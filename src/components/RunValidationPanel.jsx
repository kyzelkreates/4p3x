// ============================================================
// AP3X — RunValidationPanel — Run 5
// /src/components/RunValidationPanel.jsx
// All mutations through storage.js only.
// ============================================================

import { useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import {
  updateRunValidationChecklist, updateRun,
} from "../core/storage.js";
import { createValidationItem, calculateValidationSummary, createDefaultValidationChecklist } from "../core/runUtils.js";
import { RUN_VALIDATION_RESULTS } from "../core/constants.js";

const RESULT_OPTIONS = [
  { value:"not_tested", label:"Not Tested", cls:"badge-muted"    },
  { value:"passed",     label:"Passed",     cls:"badge-success"  },
  { value:"failed",     label:"Failed",     cls:"badge-danger"   },
  { value:"warning",    label:"Warning",    cls:"badge-warning"  },
];

function ValidationRow({ item, onToggleResult, onUpdateNotes, onDelete }) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes,        setNotes]        = useState(item.notes || "");
  const resultCls = item.result === "passed" ? "var(--success)" : item.result === "failed" ? "var(--danger)" : item.result === "warning" ? "var(--warning)" : "var(--muted)";

  return (
    <div style={{
      padding:"10px 12px", marginBottom:6,
      background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)",
      borderRadius:"var(--radius)", borderLeft:`3px solid ${resultCls}`,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <span style={{ fontSize:"0.8rem", color:"var(--text)", flex:1 }}>{item.text}</span>
        <StatusBadge status={item.result} label={item.result.replace("_"," ")} />
      </div>

      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginTop:8 }}>
        {RESULT_OPTIONS.map((r) => (
          <button
            key={r.value}
            className={`btn btn-sm ${item.result === r.value ? "btn-primary" : "btn-ghost"}`}
            onClick={() => onToggleResult(item.id, r.value)}
            aria-label={`Mark ${r.label}`}
            aria-pressed={item.result === r.value}
          >
            {r.label}
          </button>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={() => setEditingNotes((v) => !v)} aria-label="Notes">✎</button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(item.id)} aria-label="Delete item">✕</button>
      </div>

      {editingNotes && (
        <div style={{ marginTop:8 }}>
          <textarea
            className="form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            maxLength={1000}
            placeholder="Notes…"
            aria-label="Validation item notes"
          />
          <div style={{ display:"flex", gap:6, marginTop:4 }}>
            <button className="btn btn-primary btn-sm" onClick={() => { onUpdateNotes(item.id, notes); setEditingNotes(false); }}>✓ Save</button>
            <button className="btn btn-ghost   btn-sm" onClick={() => { setNotes(item.notes||""); setEditingNotes(false); }}>Cancel</button>
          </div>
        </div>
      )}
      {item.notes && !editingNotes && (
        <div style={{ marginTop:6, fontSize:"0.73rem", color:"var(--muted)" }}>{item.notes}</div>
      )}
    </div>
  );
}

export default function RunValidationPanel({ run }) {
  const checklist = run.validation?.checklist || [];
  const validation = run.validation || {};
  const [newText, setNewText] = useState("");

  function updateChecklist(next) {
    updateRunValidationChecklist(run.id, next);
  }

  function handleToggleResult(id, result) {
    updateChecklist(checklist.map((v) => v.id === id ? { ...v, result } : v));
  }
  function handleUpdateNotes(id, notes) {
    updateChecklist(checklist.map((v) => v.id === id ? { ...v, notes } : v));
  }
  function handleDelete(id) {
    updateChecklist(checklist.filter((v) => v.id !== id));
  }
  function handleAdd() {
    if (!newText.trim()) return;
    updateChecklist([...checklist, createValidationItem(newText.trim())]);
    setNewText("");
  }
  function handleAutoGenerate() {
    const defaults = createDefaultValidationChecklist(run.type || "build");
    const combined = [
      ...checklist,
      ...defaults.filter((d) => !checklist.some((c) => c.text === d.text)),
    ];
    updateChecklist(combined);
  }
  function handleSetOverallResult(result) {
    updateRun(run.id, { validation: { ...validation, result } });
  }

  const summary = calculateValidationSummary(checklist);
  const overallResult = validation.result || "not_tested";

  return (
    <div>
      {/* Summary stats */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
        <span className="badge badge-success" style={{fontSize:"0.7rem"}}>✓ {summary.passedCount} passed</span>
        <span className="badge badge-danger"  style={{fontSize:"0.7rem"}}>✕ {summary.failedCount} failed</span>
        <span className="badge badge-warning" style={{fontSize:"0.7rem"}}>⚠ {summary.warningCount} warning</span>
        <span className="badge badge-muted"   style={{fontSize:"0.7rem"}}>{checklist.length} total</span>
      </div>

      {/* Overall result */}
      <div style={{ marginBottom:16, padding:"10px 12px", background:"rgba(0,0,0,0.2)", border:"1px solid var(--border2)", borderRadius:"var(--radius)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <span style={{ fontSize:"0.78rem", fontWeight:600, color:"var(--text)" }}>Overall Validation Result</span>
          <StatusBadge status={overallResult} label={overallResult.replace("_"," ")} />
        </div>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginTop:8 }}>
          {RUN_VALIDATION_RESULTS.map((r) => (
            <button
              key={r.value}
              className={`btn btn-sm ${overallResult === r.value ? "btn-primary" : "btn-ghost"}`}
              onClick={() => handleSetOverallResult(r.value)}
              aria-label={`Set overall result to ${r.label}`}
              aria-pressed={overallResult === r.value}
            >
              {r.label}
            </button>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={handleAutoGenerate} style={{marginLeft:"auto"}} aria-label="Auto-generate checklist">
            ⬡ Auto-generate
          </button>
        </div>
        <div style={{ fontSize:"0.68rem", color:"var(--muted)", marginTop:6 }}>
          Auto-calculated from checklist: <strong>{summary.result.replace("_"," ")}</strong>
          {summary.result !== overallResult && " (differs from manual override)"}
        </div>
      </div>

      {/* Validation notes */}
      <div style={{ marginBottom:14 }}>
        <div className="form-field">
          <label className="form-label">Validation Notes</label>
          <textarea
            className="form-textarea"
            value={validation.notes || ""}
            onChange={(e) => updateRun(run.id, { validation: { ...validation, notes: e.target.value } })}
            rows={2}
            maxLength={3000}
            placeholder="Overall validation notes…"
            aria-label="Validation notes"
          />
        </div>
      </div>

      {/* Checklist items */}
      {checklist.length === 0
        ? <div style={{ fontSize:"0.78rem", color:"var(--muted)", marginBottom:14 }}>
            No validation items yet. Add one or auto-generate from run type.
          </div>
        : checklist.map((item) => (
            <ValidationRow
              key={item.id}
              item={item}
              onToggleResult={handleToggleResult}
              onUpdateNotes={handleUpdateNotes}
              onDelete={handleDelete}
            />
          ))
      }

      {/* Add new item */}
      <div style={{ display:"flex", gap:8, marginTop:10 }}>
        <input
          className="form-input"
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add validation item and press Enter…"
          maxLength={500}
          aria-label="New validation item"
        />
        <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={!newText.trim()} aria-label="Add item">
          + Add
        </button>
      </div>

      <div style={{ marginTop:14, padding:"8px 10px", background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.68rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
        All validation updates through storage.js SSOT only.
        Auto-generate creates default checklist for the run type — you can add/remove items freely.
      </div>
    </div>
  );
}

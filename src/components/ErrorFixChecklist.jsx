// ============================================================
// AP3X — ErrorFixChecklist — Run 4
// /src/components/ErrorFixChecklist.jsx
// All mutations through storage.js SSOT only.
// ============================================================

import { useState } from "react";
import { updateErrorFixChecklist, updateError, createId } from "../core/storage.js";

function CheckItem({ step, onToggle, onDelete }) {
  return (
    <div style={{
      display:"flex", alignItems:"flex-start", gap:10,
      padding:"8px 0", borderBottom:"1px solid var(--border2)",
    }}>
      <input
        type="checkbox"
        id={`step-${step.id}`}
        checked={step.completed}
        onChange={(e) => onToggle(step.id, e.target.checked)}
        style={{ marginTop:3, accentColor:"var(--accent)", flexShrink:0 }}
        aria-label={`Mark "${step.text}" as ${step.completed ? "incomplete" : "complete"}`}
      />
      <label
        htmlFor={`step-${step.id}`}
        style={{
          flex:1, fontSize:"0.8rem", lineHeight:1.5, cursor:"pointer",
          color: step.completed ? "var(--muted)" : "var(--text)",
          textDecoration: step.completed ? "line-through" : "none",
        }}
      >
        {step.text}
      </label>
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => onDelete(step.id)}
        style={{ padding:"0 6px", flexShrink:0 }}
        aria-label={`Remove step: ${step.text}`}
      >
        ✕
      </button>
    </div>
  );
}

function StepSection({ title, items, done, onToggle, onDelete, newVal, setNewVal, onAdd }) {
  return (
    <div style={{ marginBottom:22 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <div className="section-label" style={{ margin:0 }}>{title}</div>
        {done && <span className="badge badge-success" style={{ fontSize:"0.62rem" }}>✓ All Done</span>}
        <span style={{ fontSize:"0.72rem", color:"var(--muted)", marginLeft:"auto" }}>
          {items.filter((s) => s.completed).length}/{items.length}
        </span>
      </div>
      {items.length === 0
        ? <div style={{ fontSize:"0.78rem", color:"var(--muted)", padding:"8px 0" }}>No steps yet.</div>
        : items.map((s) => (
            <CheckItem key={s.id} step={s} onToggle={onToggle} onDelete={onDelete} />
          ))
      }
      <div style={{ display:"flex", gap:8, marginTop:10 }}>
        <input
          className="form-input"
          type="text"
          value={newVal}
          onChange={(e) => setNewVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
          placeholder="Add step and press Enter…"
          aria-label={`New ${title} step`}
        />
        <button className="btn btn-ghost btn-sm" onClick={onAdd} aria-label="Add step">+ Add</button>
      </div>
    </div>
  );
}

export default function ErrorFixChecklist({ error }) {
  const steps    = error.fixPlan?.steps          || [];
  const valSteps = error.fixPlan?.validationSteps || [];

  const [newFixStep, setNewFixStep] = useState("");
  const [newValStep, setNewValStep] = useState("");

  // ── Fix steps ──────────────────────────────────────────────
  function toggleFixStep(id, completed) {
    const next = steps.map((s) => s.id === id ? { ...s, completed } : s);
    updateErrorFixChecklist(error.id, next);
  }
  function deleteFixStep(id) {
    updateErrorFixChecklist(error.id, steps.filter((s) => s.id !== id));
  }
  function addFixStep() {
    if (!newFixStep.trim()) return;
    updateErrorFixChecklist(error.id, [
      ...steps,
      { id: createId("step"), text: newFixStep.trim(), completed: false },
    ]);
    setNewFixStep("");
  }

  // ── Validation steps ───────────────────────────────────────
  function toggleValStep(id, completed) {
    const next = valSteps.map((s) => s.id === id ? { ...s, completed } : s);
    updateError(error.id, { fixPlan: { ...error.fixPlan, validationSteps: next } });
  }
  function deleteValStep(id) {
    updateError(error.id, {
      fixPlan: { ...error.fixPlan, validationSteps: valSteps.filter((s) => s.id !== id) },
    });
  }
  function addValStep() {
    if (!newValStep.trim()) return;
    updateError(error.id, {
      fixPlan: {
        ...error.fixPlan,
        validationSteps: [
          ...valSteps,
          { id: createId("vstep"), text: newValStep.trim(), completed: false },
        ],
      },
    });
    setNewValStep("");
  }

  const fixDone = steps.length    > 0 && steps.every((s)    => s.completed);
  const valDone = valSteps.length > 0 && valSteps.every((s) => s.completed);

  return (
    <div>
      <StepSection
        title="Fix Steps"
        items={steps}
        done={fixDone}
        onToggle={toggleFixStep}
        onDelete={deleteFixStep}
        newVal={newFixStep}
        setNewVal={setNewFixStep}
        onAdd={addFixStep}
      />
      <StepSection
        title="Validation Steps"
        items={valSteps}
        done={valDone}
        onToggle={toggleValStep}
        onDelete={deleteValStep}
        newVal={newValStep}
        setNewVal={setNewValStep}
        onAdd={addValStep}
      />
    </div>
  );
}

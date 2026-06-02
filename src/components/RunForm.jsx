// ============================================================
// AP3X — RunForm — Run 5
// /src/components/RunForm.jsx
// ============================================================

import { useState } from "react";
import {
  RUN_TYPES, RUN_STATUSES, PROJECT_PRIORITIES,
} from "../core/constants.js";
import {
  validateRunRecord, sanitizeRunTags, createRunSlug, detectSecretLikeContent,
} from "../core/validators.js";
import { createRunFromForm, createEmptyRun } from "../core/runUtils.js";
import { addRun, updateRun } from "../core/storage.js";

function FF({ label, error, required, children }) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}{required && <span style={{ color:"var(--danger)" }}> *</span>}
      </label>
      {children}
      {error && <div className="form-error" role="alert">{error}</div>}
    </div>
  );
}
function CB({ label, checked, onChange }) {
  return (
    <label className="checkbox-row">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="checkbox-input" />
      <span className="checkbox-label">{label}</span>
    </label>
  );
}

const TABS = [
  { id:"core",     label:"Core" },
  { id:"scope",    label:"Scope" },
  { id:"snapshot", label:"Snapshot" },
  { id:"outcome",  label:"Outcome" },
  { id:"links",    label:"Links" },
  { id:"flags",    label:"Flags" },
];

function buildForm(existing) {
  const b = existing || createEmptyRun();
  return {
    title:       b.title       || "",
    runNumber:   b.runNumber   || "",
    description: b.description || "",
    type:        b.type        || "build",
    status:      b.status      || "planned",
    priority:    b.priority    || "medium",
    linkedProjectId: b.linkedProjectId || "",
    linkedPromptId:  b.linkedPromptId  || "",
    linkedErrorId:   b.linkedErrorId   || "",
    tagsRaw: (b.tags || []).join(", "),
    // scope
    scopeSummary:      b.scope?.summary       || "",
    allowedWorkText:   (b.scope?.allowedWork   || []).join("\n"),
    forbiddenWorkText: (b.scope?.forbiddenWork || []).join("\n"),
    filesExpectedText: (b.scope?.filesExpected || []).join("\n"),
    filesTouchedText:  (b.scope?.filesTouched  || []).join("\n"),
    // snapshot
    snapshotTitle:  b.promptSnapshot?.title   || "",
    snapshotContent:b.promptSnapshot?.content || "",
    snapshotPromptId: b.promptSnapshot?.copiedFromPromptId || "",
    // outcome
    outcomeSummary:     b.outcome?.summary               || "",
    filesCreatedText:   (b.outcome?.filesCreated  || []).join("\n"),
    filesUpdatedText:   (b.outcome?.filesUpdated  || []).join("\n"),
    knownLimitations:   b.outcome?.knownLimitations      || "",
    nextAction:         b.outcome?.nextRecommendedAction  || "",
    resultNotes:        b.outcome?.resultNotes            || "",
    // flags
    isArchived:        !!b.flags?.isArchived,
    isPinned:          !!b.flags?.isPinned,
    isBlocking:        !!b.flags?.isBlocking,
    needsFix:          !!b.flags?.needsFix,
    needsReview:       !!b.flags?.needsReview,
    causedRegression:  !!b.flags?.causedRegression,
    safeToContinue:    !!b.flags?.safeToContinue,
  };
}

function splitLines(text) {
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

export default function RunForm({ existingRun = null, projects = [], prompts = [], errors = [], onSaved, onCancel }) {
  const isEdit = !!existingRun;
  const [form,       setForm]       = useState(() => buildForm(existingRun));
  const [errs,       setErrs]       = useState({});
  const [saving,     setSaving]     = useState(false);
  const [section,    setSection]    = useState("core");
  const [secretWarn, setSecretWarn] = useState(null);

  function sf(k, v) { setForm((f) => ({ ...f, [k]: v })); if (errs[k]) setErrs((e) => ({ ...e, [k]: null })); }

  function handleSnapshotChange(v) {
    sf("snapshotContent", v);
    setSecretWarn(null);
    const sc = detectSecretLikeContent(v);
    if (sc.found) setSecretWarn(`Secret-like content in snapshot: ${sc.terms.join(", ")}.`);
  }

  function buildPayload() {
    return {
      title:       form.title,
      runNumber:   form.runNumber,
      description: form.description,
      type:        form.type,
      status:      form.status,
      priority:    form.priority,
      linkedProjectId: form.linkedProjectId,
      linkedPromptId:  form.linkedPromptId,
      linkedErrorId:   form.linkedErrorId,
      tags: form.tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
      scope: {
        summary:       form.scopeSummary,
        allowedWork:   splitLines(form.allowedWorkText),
        forbiddenWork: splitLines(form.forbiddenWorkText),
        filesExpected: splitLines(form.filesExpectedText),
        filesTouched:  splitLines(form.filesTouchedText),
      },
      promptSnapshot: {
        title:             form.snapshotTitle,
        content:           form.snapshotContent,
        copiedFromPromptId:form.snapshotPromptId,
        copiedAt:          existingRun?.promptSnapshot?.copiedAt || null,
      },
      outcome: {
        summary:              form.outcomeSummary,
        filesCreated:         splitLines(form.filesCreatedText),
        filesUpdated:         splitLines(form.filesUpdatedText),
        knownLimitations:     form.knownLimitations,
        nextRecommendedAction:form.nextAction,
        resultNotes:          form.resultNotes,
      },
      flags: {
        isArchived:       form.isArchived,
        isPinned:         form.isPinned,
        isBlocking:       form.isBlocking,
        needsFix:         form.needsFix,
        needsReview:      form.needsReview,
        causedRegression: form.causedRegression,
        safeToContinue:   form.safeToContinue,
      },
    };
  }

  function handleSave() {
    const payload = buildPayload();
    const v = validateRunRecord(payload);
    if (!v.valid) {
      const em = {};
      v.errors.forEach((e) => { if (e.toLowerCase().includes("title")) em.title = e; else em._general = e; });
      setErrs(em); setSection("core"); return;
    }
    setSaving(true);
    try {
      const record = createRunFromForm(payload, existingRun);
      if (isEdit) updateRun(existingRun.id, record);
      else        addRun(record);
      onSaved?.(record);
    } catch (e) {
      console.error(e);
      setErrs({ _general:"Failed to save. Please try again." });
    } finally { setSaving(false); }
  }

  function handleCopyFromPrompt() {
    if (!form.linkedPromptId) return;
    const p = (prompts || []).find((x) => x.id === form.linkedPromptId);
    if (!p) return;
    sf("snapshotTitle",   p.title || "");
    sf("snapshotContent", p.content || "");
    sf("snapshotPromptId", p.id);
  }

  const ta = (key, rows = 3, max = 3000, ph = "", mono = false) => (
    <textarea className="form-textarea" value={form[key]} maxLength={max} rows={rows}
      onChange={(e) => sf(key, e.target.value)} placeholder={ph}
      style={mono ? { fontFamily:"var(--font-mono)", fontSize:"0.73rem" } : undefined} />
  );
  const inp = (key, ph = "", type = "text", max = 200) => (
    <input className="form-input" type={type} value={form[key]} maxLength={max}
      onChange={(e) => sf(key, e.target.value)} placeholder={ph} />
  );

  return (
    <div className="form-container">
      <div className="form-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab-btn ${section===t.id?"tab-btn--active":""}`}
            onClick={() => setSection(t.id)} type="button">{t.label}</button>
        ))}
      </div>
      {errs._general && <div className="alert alert-danger" style={{marginBottom:16}} role="alert">{errs._general}</div>}

      {/* ── CORE ── */}
      {section === "core" && (
        <div className="form-section">
          <FF label="Run Title" required error={errs.title}>
            <input className={`form-input ${errs.title?"form-input--error":""}`}
              type="text" value={form.title} maxLength={120}
              onChange={(e) => sf("title", e.target.value)}
              placeholder="e.g. Run 5 — Run History + Checkpoint System" aria-required="true" />
          </FF>
          <div className="form-row">
            <FF label="Run Number"><input className="form-input" type="text" value={form.runNumber} maxLength={20} onChange={(e) => sf("runNumber", e.target.value)} placeholder="5" /></FF>
            <FF label="Type" required>
              <select className="form-select" value={form.type} onChange={(e) => sf("type", e.target.value)}>
                {RUN_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </FF>
            <FF label="Status">
              <select className="form-select" value={form.status} onChange={(e) => sf("status", e.target.value)}>
                {RUN_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </FF>
            <FF label="Priority">
              <select className="form-select" value={form.priority} onChange={(e) => sf("priority", e.target.value)}>
                {PROJECT_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </FF>
          </div>
          <FF label="Description">{ta("description", 3, 1000, "What does this run accomplish?")}</FF>
          <div className="char-count">{form.description.length}/1000</div>
          <FF label="Tags (comma-separated)">{inp("tagsRaw", "run-5, history, checkpoint...", "text", 500)}</FF>
        </div>
      )}

      {/* ── SCOPE ── */}
      {section === "scope" && (
        <div className="form-section">
          <FF label="Scope Summary">{ta("scopeSummary", 3, 1000, "What is this run allowed to build/fix?")}</FF>
          <FF label="Allowed Work (one per line)">{ta("allowedWorkText", 5, 5000, "RunCard.jsx\nRunForm.jsx\n...", true)}</FF>
          <FF label="Forbidden Work (one per line)">{ta("forbiddenWorkText", 4, 5000, "Supabase\nOpenAI\nbackend\n...", true)}</FF>
          <FF label="Files Expected (one per line)">{ta("filesExpectedText", 4, 5000, "src/components/RunCard.jsx\n...", true)}</FF>
          <FF label="Files Touched (one per line)">{ta("filesTouchedText",  4, 5000, "src/core/storage.js\n...", true)}</FF>
        </div>
      )}

      {/* ── SNAPSHOT ── */}
      {section === "snapshot" && (
        <div className="form-section">
          <div style={{ marginBottom:10, display:"flex", gap:8, flexWrap:"wrap" }}>
            <button className="btn btn-ghost btn-sm" type="button" onClick={handleCopyFromPrompt}
              disabled={!form.linkedPromptId} aria-label="Copy from linked prompt">
              ⊕ Copy from linked prompt
            </button>
          </div>
          {secretWarn && (
            <div className="alert alert-warning" style={{ marginBottom:10 }}>
              ⚠ {secretWarn} Content stored as data — never executed.
            </div>
          )}
          <FF label="Snapshot Title">
            <input className="form-input" type="text" value={form.snapshotTitle} maxLength={120}
              onChange={(e) => sf("snapshotTitle", e.target.value)} placeholder="Prompt title used for this run" />
          </FF>
          <FF label="Prompt Snapshot (text only — never executed)">
            <textarea className="form-textarea" value={form.snapshotContent} maxLength={50000} rows={16}
              onChange={(e) => handleSnapshotChange(e.target.value)}
              placeholder={"Paste the exact prompt used for this run...\n\nContent is stored as data only and never executed."}
              style={{ fontFamily:"var(--font-mono)", fontSize:"0.72rem", lineHeight:1.6 }}
              aria-label="Prompt snapshot content — text only, never executed" />
            <div className="char-count">{form.snapshotContent.length}/50,000</div>
          </FF>
          <div style={{ padding:"8px 12px", background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.7rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
            Prompt snapshots are stored as text data only. They are never executed, evaluated, or sent to any AI service.
          </div>
        </div>
      )}

      {/* ── OUTCOME ── */}
      {section === "outcome" && (
        <div className="form-section">
          <FF label="Outcome Summary">{ta("outcomeSummary", 3, 1000, "What was achieved in this run?")}</FF>
          <FF label="Files Created (one per line)">{ta("filesCreatedText", 4, 5000, "src/components/RunCard.jsx\n...", true)}</FF>
          <FF label="Files Updated (one per line)">{ta("filesUpdatedText", 4, 5000, "src/core/storage.js\n...", true)}</FF>
          <FF label="Known Limitations">{ta("knownLimitations", 3, 3000, "What is not yet built? What are the edge cases?")}</FF>
          <FF label="Next Recommended Action">{ta("nextAction", 2, 1000, "Begin Run 6 — Architecture Mapper.")}</FF>
          <FF label="Result Notes">{ta("resultNotes", 3, 3000, "Any additional notes about the run outcome.")}</FF>
        </div>
      )}

      {/* ── LINKS ── */}
      {section === "links" && (
        <div className="form-section">
          <FF label="Linked Project">
            <select className="form-select" value={form.linkedProjectId} onChange={(e) => sf("linkedProjectId", e.target.value)}>
              <option value="">None</option>
              {(projects||[]).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </FF>
          <FF label="Linked Prompt">
            <select className="form-select" value={form.linkedPromptId} onChange={(e) => sf("linkedPromptId", e.target.value)}>
              <option value="">None</option>
              {(prompts||[]).map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </FF>
          <FF label="Linked Error">
            <select className="form-select" value={form.linkedErrorId} onChange={(e) => sf("linkedErrorId", e.target.value)}>
              <option value="">None</option>
              {(errors||[]).map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </FF>
        </div>
      )}

      {/* ── FLAGS ── */}
      {section === "flags" && (
        <div className="form-section">
          <div className="section-label" style={{ marginBottom:14 }}>Run flags</div>
          <div className="checkbox-grid">
            <CB label="Pinned"             checked={form.isPinned}         onChange={(v) => sf("isPinned",         v)} />
            <CB label="Blocking"           checked={form.isBlocking}       onChange={(v) => sf("isBlocking",       v)} />
            <CB label="Needs Fix"          checked={form.needsFix}         onChange={(v) => sf("needsFix",         v)} />
            <CB label="Needs Review"       checked={form.needsReview}      onChange={(v) => sf("needsReview",      v)} />
            <CB label="Caused Regression"  checked={form.causedRegression} onChange={(v) => sf("causedRegression", v)} />
            <CB label="Safe to Continue"   checked={form.safeToContinue}   onChange={(v) => sf("safeToContinue",   v)} />
            <CB label="Archived"           checked={form.isArchived}       onChange={(v) => sf("isArchived",       v)} />
          </div>
        </div>
      )}

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onCancel} type="button">Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving} type="button">
          {saving ? "Saving…" : isEdit ? "✓ Save Changes" : "✓ Create Run"}
        </button>
      </div>
    </div>
  );
}

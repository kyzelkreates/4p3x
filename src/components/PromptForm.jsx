// ============================================================
// AP3X — PromptForm Component
// /src/components/PromptForm.jsx — Run 3
// ============================================================

import { useState } from "react";
import {
  PROMPT_TYPES, PROMPT_CATEGORIES, PROMPT_STATUSES,
  PROMPT_PRIORITIES, RESULT_STATUSES,
} from "../core/constants.js";
import { validatePrompt, sanitizePromptTags, detectSecretLikeContent, calculatePromptSafetyScore } from "../core/validators.js";
import { createPromptFromForm, createEmptyPrompt } from "../core/promptUtils.js";
import { addPrompt, updatePrompt } from "../core/storage.js";
import PromptSafetyPanel from "./PromptSafetyPanel.jsx";

function FormField({ label, error, required, children }) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}{required && <span style={{ color: "var(--danger)" }}> *</span>}
      </label>
      {children}
      {error && <div className="form-error" role="alert">{error}</div>}
    </div>
  );
}

function CheckboxRow({ label, checked, onChange, name }) {
  return (
    <label className="checkbox-row">
      <input type="checkbox" name={name} checked={checked}
        onChange={(e) => onChange(e.target.checked)} className="checkbox-input" />
      <span className="checkbox-label">{label}</span>
    </label>
  );
}

const SECTIONS = [
  { id: "core",     label: "Core" },
  { id: "content",  label: "Content" },
  { id: "platform", label: "Platform" },
  { id: "links",    label: "Links" },
  { id: "usage",    label: "Usage" },
  { id: "flags",    label: "Flags" },
];

export default function PromptForm({ existingPrompt = null, projects = [], onSaved, onCancel }) {
  const isEdit = !!existingPrompt;

  const [form, setForm] = useState(() => {
    const base = existingPrompt || createEmptyPrompt();
    return {
      title:           base.title || "",
      description:     base.description || "",
      content:         base.content || "",
      type:            base.type || "base44",
      category:        base.category || "build",
      status:          base.status || "draft",
      priority:        base.priority || "medium",
      linkedProjectId: base.linkedProjectId || "",
      linkedRunId:     base.linkedRunId || "",
      linkedErrorId:   base.linkedErrorId || "",
      tagsRaw:         (base.tags || []).join(", "),
      platformTarget:  base.platform?.target || "base44",
      platformModel:   base.platform?.model || "",
      platformEnv:     base.platform?.environment || "",
      platformNotes:   base.platform?.notes || "",
      resultStatus:    base.usage?.resultStatus || "unknown",
      resultNotes:     base.usage?.resultNotes || "",
      changeNote:      "",
      isPinned:        !!base.flags?.isPinned,
      isFavourite:     !!base.flags?.isFavourite,
      isTemplate:      !!base.flags?.isTemplate,
      isMasterPrompt:  !!base.flags?.isMasterPrompt,
      needsReview:     !!base.flags?.needsReview,
    };
  });

  const [errors,          setErrors]          = useState({});
  const [saving,          setSaving]          = useState(false);
  const [section,         setSection]         = useState("core");
  const [secretWarning,   setSecretWarning]   = useState(null);
  const [showSafety,      setShowSafety]      = useState(false);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
    if (key === "content") setSecretWarning(null);
  }

  // Live safety score from current content
  const liveSafety = calculatePromptSafetyScore(form.content);

  function buildFormData() {
    return {
      title:       form.title,
      description: form.description,
      content:     form.content,
      type:        form.type,
      category:    form.category,
      status:      form.status,
      priority:    form.priority,
      linkedProjectId: form.linkedProjectId,
      linkedRunId:     form.linkedRunId,
      linkedErrorId:   form.linkedErrorId,
      tags:        sanitizePromptTags(form.tagsRaw),
      changeNote:  form.changeNote,
      platform: {
        target:      form.platformTarget,
        model:       form.platformModel,
        environment: form.platformEnv,
        notes:       form.platformNotes,
      },
      usage: {
        ...(existingPrompt?.usage || {}),
        resultStatus: form.resultStatus,
        resultNotes:  form.resultNotes,
      },
      flags: {
        isPinned:       form.isPinned,
        isFavourite:    form.isFavourite,
        isArchived:     existingPrompt?.flags?.isArchived || false,
        isTemplate:     form.isTemplate,
        isMasterPrompt: form.isMasterPrompt,
        needsReview:    form.needsReview,
      },
    };
  }

  function handleSave() {
    const data       = buildFormData();
    const validation = validatePrompt(data);
    if (!validation.valid) {
      const errMap = {};
      validation.errors.forEach((e) => {
        if (e.toLowerCase().includes("title")) errMap.title = e;
        else if (e.toLowerCase().includes("content")) { errMap.content = e; }
        else errMap._general = e;
      });
      setErrors(errMap);
      setSection(errMap.title ? "core" : "content");
      return;
    }

    // Check for secrets
    const secretCheck = detectSecretLikeContent(data.content);
    if (secretCheck.found && !secretWarning) {
      setSecretWarning(`Secret-like content detected: ${secretCheck.terms.join(", ")}. Save anyway?`);
      setSection("content");
      return;
    }

    setSaving(true);
    try {
      const prompt = createPromptFromForm(data, existingPrompt);
      if (isEdit) updatePrompt(existingPrompt.id, prompt);
      else addPrompt(prompt);
      onSaved?.(prompt);
    } catch (e) {
      console.error(e);
      setErrors({ _general: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-container">
      {/* Section tabs */}
      <div className="form-tabs">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className={`tab-btn ${section === s.id ? "tab-btn--active" : ""}`}
            onClick={() => setSection(s.id)} type="button"
          >
            {s.label}
          </button>
        ))}
      </div>

      {errors._general && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }} role="alert">{errors._general}</div>
      )}

      {/* ── CORE ── */}
      {section === "core" && (
        <div className="form-section">
          <FormField label="Prompt Title" required error={errors.title}>
            <input className={`form-input ${errors.title ? "form-input--error" : ""}`}
              type="text" value={form.title} maxLength={100}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. AP3X Run 3 Prompt Vault Build Prompt"
              aria-required="true" />
          </FormField>

          <FormField label="Description" error={errors.description}>
            <textarea className="form-textarea" value={form.description} maxLength={500} rows={2}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="What does this prompt do?" />
            <div className="char-count">{form.description.length}/500</div>
          </FormField>

          <div className="form-row">
            <FormField label="Type" required>
              <select className="form-select" value={form.type} onChange={(e) => setField("type", e.target.value)}>
                {PROMPT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </FormField>
            <FormField label="Category" required>
              <select className="form-select" value={form.category} onChange={(e) => setField("category", e.target.value)}>
                {PROMPT_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select className="form-select" value={form.status} onChange={(e) => setField("status", e.target.value)}>
                {PROMPT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </FormField>
            <FormField label="Priority">
              <select className="form-select" value={form.priority} onChange={(e) => setField("priority", e.target.value)}>
                {PROMPT_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </FormField>
          </div>

          <div className="form-row">
            <FormField label="Linked Project">
              <select className="form-select" value={form.linkedProjectId} onChange={(e) => setField("linkedProjectId", e.target.value)}>
                <option value="">None</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </FormField>
            <FormField label="Linked Run ID">
              <input className="form-input" type="text" value={form.linkedRunId}
                onChange={(e) => setField("linkedRunId", e.target.value)} placeholder="1, 2, 3..." maxLength={20} />
            </FormField>
            <FormField label="Linked Error ID">
              <input className="form-input" type="text" value={form.linkedErrorId}
                onChange={(e) => setField("linkedErrorId", e.target.value)} placeholder="error_xxx" maxLength={100} />
            </FormField>
          </div>

          <FormField label="Tags (comma-separated)">
            <input className="form-input" type="text" value={form.tagsRaw}
              onChange={(e) => setField("tagsRaw", e.target.value)}
              placeholder="run-2, ssot, fix-only, master..." />
          </FormField>
        </div>
      )}

      {/* ── CONTENT ── */}
      {section === "content" && (
        <div className="form-section">
          {/* Live safety preview */}
          <div style={{ padding: "10px 14px", background: "var(--panel2)", border: "1px solid var(--border2)", borderRadius: "var(--radius)", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: showSafety ? 12 : 0 }}>
              <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Live Safety Score</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <PromptSafetyPanel safety={{ ...liveSafety.rules, safetyScore: liveSafety.score }} compact />
                <button className="btn btn-ghost btn-sm" onClick={() => setShowSafety((v) => !v)} type="button">
                  {showSafety ? "↑ Hide" : "↓ Details"}
                </button>
              </div>
            </div>
            {showSafety && (
              <PromptSafetyPanel safety={{ ...liveSafety.rules, safetyScore: liveSafety.score, warnings: liveSafety.warnings, secretDetected: liveSafety.secretDetected }} />
            )}
          </div>

          {secretWarning && (
            <div className="alert alert-warning" style={{ marginBottom: 12 }}>
              ⚠ {secretWarning}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setSecretWarning(null)} type="button">Review Content</button>
                <button className="btn btn-danger btn-sm" type="button" onClick={() => {
                  setSecretWarning("__bypass__");
                  setTimeout(handleSave, 0);
                }}>Save Anyway</button>
              </div>
            </div>
          )}

          <FormField label="Prompt Content" required error={errors.content}>
            <textarea
              className={`form-textarea ${errors.content ? "form-input--error" : ""}`}
              value={form.content}
              maxLength={50000}
              rows={20}
              onChange={(e) => setField("content", e.target.value)}
              placeholder="Paste your full prompt here..."
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", lineHeight: 1.6 }}
              aria-required="true"
            />
            <div className="char-count">{form.content.length}/50,000</div>
          </FormField>

          {isEdit && (
            <FormField label="Change Note (for version history)">
              <input className="form-input" type="text" value={form.changeNote}
                onChange={(e) => setField("changeNote", e.target.value)}
                placeholder="What changed in this version?" maxLength={200} />
            </FormField>
          )}
        </div>
      )}

      {/* ── PLATFORM ── */}
      {section === "platform" && (
        <div className="form-section">
          <div className="form-row">
            <FormField label="Target Platform">
              <input className="form-input" type="text" value={form.platformTarget}
                onChange={(e) => setField("platformTarget", e.target.value)} placeholder="base44, manus, chatgpt..." maxLength={80} />
            </FormField>
            <FormField label="Model">
              <input className="form-input" type="text" value={form.platformModel}
                onChange={(e) => setField("platformModel", e.target.value)} placeholder="GPT-4, Claude 3..." maxLength={80} />
            </FormField>
            <FormField label="Environment">
              <input className="form-input" type="text" value={form.platformEnv}
                onChange={(e) => setField("platformEnv", e.target.value)} placeholder="production, development..." maxLength={80} />
            </FormField>
          </div>
          <FormField label="Platform Notes">
            <textarea className="form-textarea" value={form.platformNotes} maxLength={500} rows={4}
              onChange={(e) => setField("platformNotes", e.target.value)}
              placeholder="Notes about this platform target..." />
          </FormField>
        </div>
      )}

      {/* ── LINKS ── */}
      {section === "links" && (
        <div className="form-section">
          <div style={{ color: "var(--muted)", fontSize: "0.78rem", marginBottom: 12 }}>
            Link this prompt to project records, runs, and errors by ID. These are stored references only.
          </div>
          <FormField label="Linked Project">
            <select className="form-select" value={form.linkedProjectId} onChange={(e) => setField("linkedProjectId", e.target.value)}>
              <option value="">None</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </FormField>
          <FormField label="Linked Run Number">
            <input className="form-input" type="text" value={form.linkedRunId}
              onChange={(e) => setField("linkedRunId", e.target.value)} placeholder="1, 2, 3..." maxLength={20} />
          </FormField>
          <FormField label="Linked Error ID">
            <input className="form-input" type="text" value={form.linkedErrorId}
              onChange={(e) => setField("linkedErrorId", e.target.value)} placeholder="error_seed_001..." maxLength={100} />
          </FormField>
        </div>
      )}

      {/* ── USAGE ── */}
      {section === "usage" && (
        <div className="form-section">
          <FormField label="Result Status">
            <select className="form-select" value={form.resultStatus} onChange={(e) => setField("resultStatus", e.target.value)}>
              {RESULT_STATUSES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </FormField>
          <FormField label="Result Notes">
            <textarea className="form-textarea" value={form.resultNotes} maxLength={1000} rows={5}
              onChange={(e) => setField("resultNotes", e.target.value)}
              placeholder="What happened when this prompt was used?" />
            <div className="char-count">{form.resultNotes.length}/1000</div>
          </FormField>
        </div>
      )}

      {/* ── FLAGS ── */}
      {section === "flags" && (
        <div className="form-section">
          <div className="section-label" style={{ marginBottom: 14 }}>Prompt flags</div>
          <div className="checkbox-grid">
            <CheckboxRow label="Pinned"        name="isPinned"       checked={form.isPinned}       onChange={(v) => setField("isPinned", v)} />
            <CheckboxRow label="Favourite"     name="isFavourite"    checked={form.isFavourite}    onChange={(v) => setField("isFavourite", v)} />
            <CheckboxRow label="Template"      name="isTemplate"     checked={form.isTemplate}     onChange={(v) => setField("isTemplate", v)} />
            <CheckboxRow label="Master Prompt" name="isMasterPrompt" checked={form.isMasterPrompt} onChange={(v) => setField("isMasterPrompt", v)} />
            <CheckboxRow label="Needs Review"  name="needsReview"    checked={form.needsReview}    onChange={(v) => setField("needsReview", v)} />
          </div>
        </div>
      )}

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onCancel} type="button">Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving} type="button">
          {saving ? "Saving…" : isEdit ? "✓ Save Changes" : "✓ Create Prompt"}
        </button>
      </div>
    </div>
  );
}

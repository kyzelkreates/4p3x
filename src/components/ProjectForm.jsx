// ============================================================
// AP3X — ProjectForm Component
// /src/components/ProjectForm.jsx — Run 2
// ============================================================

import { useState } from "react";
import { PROJECT_TYPES, PROJECT_STATUSES, PROJECT_STAGES, PROJECT_PRIORITIES } from "../core/constants.js";
import { validateProject, sanitizeTags } from "../core/validators.js";
import { createProjectFromForm, createEmptyProject } from "../core/projectUtils.js";
import { addProject, updateProject } from "../core/storage.js";

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
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="checkbox-input"
      />
      <span className="checkbox-label">{label}</span>
    </label>
  );
}

export default function ProjectForm({ existingProject = null, onSaved, onCancel }) {
  const isEdit = !!existingProject;

  const [form, setForm] = useState(() => {
    const base = existingProject ? { ...existingProject } : createEmptyProject();
    return {
      name:          base.name || "",
      description:   base.description || "",
      type:          base.type || "pwa",
      status:        base.status || "draft",
      priority:      base.priority || "medium",
      stage:         base.stage || "idea",
      category:      base.category || "",
      sector:        base.sector || "",
      owner:         base.owner || "",
      tagsRaw:       (base.tags || []).join(", "),
      github:        base.links?.github || "",
      vercel:        base.links?.vercel || "",
      liveUrl:       base.links?.liveUrl || "",
      base44:        base.links?.base44 || "",
      supabase:      base.links?.supabase || "",
      docs:          base.links?.docs || "",
      figma:         base.links?.figma || "",
      other:         base.links?.other || "",
      stackFrontend: base.stack?.frontend || "",
      stackBackend:  base.stack?.backend || "",
      stackDb:       base.stack?.database || "",
      stackAi:       base.stack?.ai || "",
      stackDeploy:   base.stack?.deployment || "",
      stackAuth:     base.stack?.auth || "",
      stackStorage:  base.stack?.storage || "",
      completionPercent:   base.metrics?.completionPercent ?? 0,
      investorReadiness:   base.metrics?.investorReadiness ?? 0,
      technicalHealth:     base.metrics?.technicalHealth ?? 0,
      deploymentReadiness: base.metrics?.deploymentReadiness ?? 0,
      notes:         base.notes || "",
      nextAction:    base.nextAction || "",
      isTemplate:      !!base.flags?.isTemplate,
      isInvestorReady: !!base.flags?.isInvestorReady,
      isDeployed:      !!base.flags?.isDeployed,
      needsRebuild:    !!base.flags?.needsRebuild,
      hasPwa:          !!base.flags?.hasPwa,
      hasBackend:      !!base.flags?.hasBackend,
      hasAi:           !!base.flags?.hasAi,
    };
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [section, setSection] = useState("core");

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  }

  function buildProjectData() {
    return {
      name:        form.name,
      description: form.description,
      type:        form.type,
      status:      form.status,
      priority:    form.priority,
      stage:       form.stage,
      category:    form.category,
      sector:      form.sector,
      owner:       form.owner,
      tags:        sanitizeTags(form.tagsRaw),
      links: {
        github:   form.github,
        vercel:   form.vercel,
        liveUrl:  form.liveUrl,
        base44:   form.base44,
        supabase: form.supabase,
        docs:     form.docs,
        figma:    form.figma,
        other:    form.other,
      },
      stack: {
        frontend:   form.stackFrontend,
        backend:    form.stackBackend,
        database:   form.stackDb,
        ai:         form.stackAi,
        deployment: form.stackDeploy,
        auth:       form.stackAuth,
        storage:    form.stackStorage,
      },
      metrics: {
        completionPercent:   Number(form.completionPercent) || 0,
        investorReadiness:   Number(form.investorReadiness) || 0,
        technicalHealth:     Number(form.technicalHealth) || 0,
        deploymentReadiness: Number(form.deploymentReadiness) || 0,
      },
      notes:      form.notes,
      nextAction: form.nextAction,
      flags: {
        isTemplate:      form.isTemplate,
        isArchived:      existingProject?.flags?.isArchived || false,
        isInvestorReady: form.isInvestorReady,
        isDeployed:      form.isDeployed,
        needsRebuild:    form.needsRebuild,
        hasPwa:          form.hasPwa,
        hasBackend:      form.hasBackend,
        hasAi:           form.hasAi,
      },
    };
  }

  function handleSave() {
    const data = buildProjectData();
    const validation = validateProject(data);
    if (!validation.valid) {
      const errMap = {};
      validation.errors.forEach((e) => {
        if (e.toLowerCase().includes("name")) errMap.name = e;
        else if (e.toLowerCase().includes("description")) errMap.description = e;
        else if (e.toLowerCase().includes("notes")) errMap.notes = e;
        else errMap._general = e;
      });
      setErrors(errMap);
      setSection("core");
      return;
    }

    setSaving(true);
    try {
      const project = createProjectFromForm(data, existingProject);
      if (isEdit) {
        updateProject(existingProject.id, project);
      } else {
        addProject(project);
      }
      onSaved?.(project);
    } catch (e) {
      console.error(e);
      setErrors({ _general: "Failed to save project. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  const SECTIONS = [
    { id: "core",    label: "Core" },
    { id: "links",   label: "Links" },
    { id: "stack",   label: "Stack" },
    { id: "metrics", label: "Metrics" },
    { id: "notes",   label: "Notes" },
    { id: "flags",   label: "Flags" },
  ];

  return (
    <div className="form-container">
      {/* Section tabs */}
      <div className="form-tabs">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className={`tab-btn ${section === s.id ? "tab-btn--active" : ""}`}
            onClick={() => setSection(s.id)}
            type="button"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* General error */}
      {errors._general && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }} role="alert">
          {errors._general}
        </div>
      )}

      {/* ── CORE ── */}
      {section === "core" && (
        <div className="form-section">
          <FormField label="Project Name" required error={errors.name}>
            <input
              className={`form-input ${errors.name ? "form-input--error" : ""}`}
              type="text"
              value={form.name}
              maxLength={80}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="e.g. AP3X VER5E System"
              aria-required="true"
              aria-describedby={errors.name ? "name-error" : undefined}
            />
          </FormField>

          <FormField label="Description" error={errors.description}>
            <textarea
              className="form-textarea"
              value={form.description}
              maxLength={500}
              rows={3}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="What does this project do?"
            />
            <div className="char-count">{form.description.length}/500</div>
          </FormField>

          <div className="form-row">
            <FormField label="Type" required>
              <select className="form-select" value={form.type} onChange={(e) => setField("type", e.target.value)}>
                {PROJECT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </FormField>

            <FormField label="Status" required>
              <select className="form-select" value={form.status} onChange={(e) => setField("status", e.target.value)}>
                {PROJECT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </FormField>

            <FormField label="Priority">
              <select className="form-select" value={form.priority} onChange={(e) => setField("priority", e.target.value)}>
                {PROJECT_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </FormField>

            <FormField label="Stage">
              <select className="form-select" value={form.stage} onChange={(e) => setField("stage", e.target.value)}>
                {PROJECT_STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </FormField>
          </div>

          <div className="form-row">
            <FormField label="Category">
              <input className="form-input" type="text" value={form.category}
                onChange={(e) => setField("category", e.target.value)} placeholder="e.g. Control OS" maxLength={80} />
            </FormField>
            <FormField label="Sector">
              <input className="form-input" type="text" value={form.sector}
                onChange={(e) => setField("sector", e.target.value)} placeholder="e.g. Productivity" maxLength={80} />
            </FormField>
            <FormField label="Owner">
              <input className="form-input" type="text" value={form.owner}
                onChange={(e) => setField("owner", e.target.value)} placeholder="e.g. Kyzel Kreates" maxLength={80} />
            </FormField>
          </div>

          <FormField label="Tags (comma-separated)">
            <input className="form-input" type="text" value={form.tagsRaw}
              onChange={(e) => setField("tagsRaw", e.target.value)}
              placeholder="pwa, local-first, mvp, ..." />
          </FormField>
        </div>
      )}

      {/* ── LINKS ── */}
      {section === "links" && (
        <div className="form-section">
          <div className="section-label" style={{ marginBottom: 16 }}>
            All links are optional. Stored as references only — no live scanning.
          </div>
          {[
            ["GitHub", "github", "https://github.com/..."],
            ["Vercel", "vercel", "https://vercel.com/..."],
            ["Live URL", "liveUrl", "https://..."],
            ["Base44", "base44", "https://app.base44.com/..."],
            ["Supabase", "supabase", "https://app.supabase.com/..."],
            ["Docs", "docs", "https://..."],
            ["Figma", "figma", "https://figma.com/..."],
            ["Other", "other", "https://..."],
          ].map(([label, key, placeholder]) => (
            <FormField key={key} label={label}>
              <input className="form-input" type="url" value={form[key]}
                onChange={(e) => setField(key, e.target.value)}
                placeholder={placeholder} />
            </FormField>
          ))}
        </div>
      )}

      {/* ── STACK ── */}
      {section === "stack" && (
        <div className="form-section">
          <div className="section-label" style={{ marginBottom: 16 }}>
            Describe the tech stack. Free-text, no validation.
          </div>
          <div className="form-row">
            {[
              ["Frontend", "stackFrontend", "React + Vite"],
              ["Backend", "stackBackend", "Node.js / Supabase"],
              ["Database", "stackDb", "PostgreSQL"],
              ["AI Layer", "stackAi", "OpenAI / None"],
              ["Deployment", "stackDeploy", "Vercel / Netlify"],
              ["Auth", "stackAuth", "Supabase Auth"],
              ["Storage", "stackStorage", "Supabase Storage"],
            ].map(([label, key, placeholder]) => (
              <FormField key={key} label={label}>
                <input className="form-input" type="text" value={form[key]}
                  onChange={(e) => setField(key, e.target.value)}
                  placeholder={placeholder} maxLength={100} />
              </FormField>
            ))}
          </div>
        </div>
      )}

      {/* ── METRICS ── */}
      {section === "metrics" && (
        <div className="form-section">
          <div className="section-label" style={{ marginBottom: 16 }}>
            0–100 percentage estimates. Self-assessed.
          </div>
          {[
            ["Completion %", "completionPercent"],
            ["Investor Readiness %", "investorReadiness"],
            ["Technical Health %", "technicalHealth"],
            ["Deployment Readiness %", "deploymentReadiness"],
          ].map(([label, key]) => (
            <FormField key={key} label={label}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input
                  type="range" min={0} max={100} step={5}
                  value={form[key]}
                  onChange={(e) => setField(key, Number(e.target.value))}
                  style={{ flex: 1 }}
                  aria-label={label}
                />
                <input
                  type="number" min={0} max={100}
                  value={form[key]}
                  onChange={(e) => setField(key, Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                  className="form-input"
                  style={{ width: 70 }}
                  aria-label={`${label} number input`}
                />
              </div>
            </FormField>
          ))}
        </div>
      )}

      {/* ── NOTES ── */}
      {section === "notes" && (
        <div className="form-section">
          <FormField label="Notes" error={errors.notes}>
            <textarea
              className="form-textarea"
              value={form.notes}
              maxLength={3000}
              rows={8}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="Free-form notes, observations, decisions..."
            />
            <div className="char-count">{form.notes.length}/3000</div>
          </FormField>

          <FormField label="Next Action">
            <input className="form-input" type="text" value={form.nextAction}
              onChange={(e) => setField("nextAction", e.target.value)}
              placeholder="What needs to happen next?" maxLength={300} />
          </FormField>
        </div>
      )}

      {/* ── FLAGS ── */}
      {section === "flags" && (
        <div className="form-section">
          <div className="section-label" style={{ marginBottom: 16 }}>Feature & state flags</div>
          <div className="checkbox-grid">
            <CheckboxRow label="Is Template"      name="isTemplate"      checked={form.isTemplate}      onChange={(v) => setField("isTemplate", v)} />
            <CheckboxRow label="Investor Ready"   name="isInvestorReady" checked={form.isInvestorReady} onChange={(v) => setField("isInvestorReady", v)} />
            <CheckboxRow label="Deployed"         name="isDeployed"      checked={form.isDeployed}      onChange={(v) => setField("isDeployed", v)} />
            <CheckboxRow label="Needs Rebuild"    name="needsRebuild"    checked={form.needsRebuild}    onChange={(v) => setField("needsRebuild", v)} />
            <CheckboxRow label="Has PWA"          name="hasPwa"          checked={form.hasPwa}          onChange={(v) => setField("hasPwa", v)} />
            <CheckboxRow label="Has Backend"      name="hasBackend"      checked={form.hasBackend}      onChange={(v) => setField("hasBackend", v)} />
            <CheckboxRow label="Has AI"           name="hasAi"           checked={form.hasAi}           onChange={(v) => setField("hasAi", v)} />
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onCancel} type="button">
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
          type="button"
        >
          {saving ? "Saving…" : isEdit ? "✓ Save Changes" : "✓ Create Project"}
        </button>
      </div>
    </div>
  );
}

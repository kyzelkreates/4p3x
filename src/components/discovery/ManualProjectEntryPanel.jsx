// AP3X — ManualProjectEntryPanel — Run 10
import { useState } from "react";
import { parseManualProjectEntry } from "../../core/projectSourceParser.js";
import { classifyDiscoveredProject } from "../../core/projectDiscoveryEngine.js";
import { PROJECT_STATUSES, PROJECT_SOURCE_TYPES } from "../../core/constants.js";

const EMPTY = { title:"", description:"", sourceType:"Manual Entry", sourceUrl:"", repoUrl:"", deploymentUrl:"", notes:"", status:"New", stack:"", tags:"", priority:"Medium", portfolioValue:"Medium", clientValue:"" };

export default function ManualProjectEntryPanel({ onAdd }) {
  const [form,   setForm]   = useState(EMPTY);
  const [error,  setError]  = useState(null);
  const [saved,  setSaved]  = useState(false);

  function handleChange(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); setError(null); }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Project title is required."); return; }
    const raw     = { ...form, tags: form.tags.split(",").map((t)=>t.trim()).filter(Boolean), detectedStack: form.stack ? [form.stack] : [] };
    const parsed  = parseManualProjectEntry(raw);
    const project = classifyDiscoveredProject(parsed);
    onAdd(project);
    setForm(EMPTY);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="panel">
      <div className="section-label" style={{ marginBottom:10 }}>Manual Project Entry</div>
      {saved  && <div className="alert alert-success" style={{ marginBottom:10 }}>✓ Project added to inventory.</div>}
      {error  && <div className="alert alert-danger"  style={{ marginBottom:10 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <div>
            <label className="form-label">Project Name *</label>
            <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="My App" required />
          </div>
          <div>
            <label className="form-label">Source Type</label>
            <select className="form-select" name="sourceType" value={form.sourceType} onChange={handleChange}>
              {PROJECT_SOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ gridColumn:"1/-1" }}>
            <label className="form-label">Description</label>
            <input className="form-input" name="description" value={form.description} onChange={handleChange} placeholder="What does this project do?" />
          </div>
          <div>
            <label className="form-label">Project URL</label>
            <input className="form-input" name="sourceUrl" value={form.sourceUrl} onChange={handleChange} placeholder="https://myapp.vercel.app" />
          </div>
          <div>
            <label className="form-label">Repo URL</label>
            <input className="form-input" name="repoUrl" value={form.repoUrl} onChange={handleChange} placeholder="https://github.com/user/repo" />
          </div>
          <div>
            <label className="form-label">Deployment URL</label>
            <input className="form-input" name="deploymentUrl" value={form.deploymentUrl} onChange={handleChange} placeholder="https://..." />
          </div>
          <div>
            <label className="form-label">Stack / Framework</label>
            <input className="form-input" name="stack" value={form.stack} onChange={handleChange} placeholder="React, Next.js, Supabase…" />
          </div>
          <div>
            <label className="form-label">Known Status</label>
            <select className="form-select" name="status" value={form.status} onChange={handleChange}>
              {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Priority</label>
            <select className="form-select" name="priority" value={form.priority} onChange={handleChange}>
              {["Low","Medium","High","Critical"].map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Portfolio Value</label>
            <select className="form-select" name="portfolioValue" value={form.portfolioValue} onChange={handleChange}>
              {["Unknown","Low","Medium","High"].map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Client / Revenue Value</label>
            <input className="form-input" name="clientValue" value={form.clientValue} onChange={handleChange} placeholder="Optional — e.g. 'Active client'" />
          </div>
          <div>
            <label className="form-label">Tags (comma-separated)</label>
            <input className="form-input" name="tags" value={form.tags} onChange={handleChange} placeholder="saas, mvp, mobile…" />
          </div>
          <div style={{ gridColumn:"1/-1" }}>
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Any known issues, context, or history…" />
          </div>
        </div>
        <button className="btn btn-primary" type="submit" style={{ marginTop:12, width:"100%" }}>+ Add Project to Inventory</button>
      </form>
    </div>
  );
}

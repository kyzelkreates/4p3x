// ============================================================
// AP3X — ErrorImportPanel
// /src/components/ErrorImportPanel.jsx — Run 4
// ============================================================

import { useState } from "react";
import { importError, importErrorFromLog } from "../core/storage.js";
import { importErrorFromJson, detectErrorSignals, calculateErrorSeverityFromLog, maskSecretLikeContent } from "../core/errorUtils.js";
import { detectSecretLikeContent } from "../core/validators.js";

export default function ErrorImportPanel({ allErrors, projects, onImported, onClose }) {
  const [tab,    setTab]    = useState("log");
  const [text,   setText]   = useState("");
  const [meta,   setMeta]   = useState({ title:"", linkedProjectId:"", category:"", source:"", severity:"" });
  const [result, setResult] = useState(null);

  function setM(k, v) { setMeta((m) => ({ ...m, [k]: v })); }

  function handleImportLog() {
    setResult(null);
    const res = importErrorFromLog(text, { ...meta }, allErrors);
    if (!res.success) { setResult({ type:"error", message: res.error }); return; }
    let msg = `Error "${res.error.title}" imported from log.`;
    if (res.signals?.length) msg += ` Signals: ${res.signals.join(", ")}.`;
    const secretCheck = detectSecretLikeContent(text);
    if (secretCheck.found) msg += ` ⚠ Secret-like content detected — review before sharing.`;
    setResult({ type:"success", message: msg });
    setText(""); setMeta({ title:"", linkedProjectId:"", category:"", source:"", severity:"" });
    onImported?.();
  }

  function handleImportJson() {
    setResult(null);
    const res = importErrorFromJson(text, allErrors);
    if (!res.success) { setResult({ type:"error", message: res.error }); return; }
    importError(res.error);
    let msg = `Error "${res.error.title}" imported from JSON.`;
    if (res.secretsStripped) msg += " ⚠ Secret-like fields were removed during import.";
    setResult({ type:"success", message: msg });
    setText("");
    onImported?.();
  }

  // Live signals preview
  const signals  = tab === "log" && text ? detectErrorSignals(text) : null;
  const severity = tab === "log" && text ? calculateErrorSeverityFromLog(text) : null;
  const secretCheck = text ? detectSecretLikeContent(text) : null;

  return (
    <div className="json-panel">
      <div className="json-panel-header">
        <div style={{ display:"flex",gap:0 }}>
          <button className={`tab-btn ${tab==="log"?"tab-btn--active":""}`} onClick={() => setTab("log")}>Raw Log</button>
          <button className={`tab-btn ${tab==="json"?"tab-btn--active":""}`} onClick={() => setTab("json")}>JSON</button>
        </div>
        {onClose && <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">✕</button>}
      </div>

      {tab === "log" && (
        <div>
          <div className="form-row" style={{marginBottom:12}}>
            <div className="form-field">
              <label className="form-label">Title (optional)</label>
              <input className="form-input" type="text" value={meta.title}
                onChange={(e) => setM("title", e.target.value)} placeholder="Auto-generated if empty" maxLength={120} />
            </div>
            <div className="form-field">
              <label className="form-label">Linked Project</label>
              <select className="form-select" value={meta.linkedProjectId} onChange={(e) => setM("linkedProjectId", e.target.value)}>
                <option value="">None</option>
                {(projects||[]).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          {signals && signals.signals.length > 0 && (
            <div className="alert alert-warning" style={{marginBottom:10}}>
              <div style={{fontWeight:600,marginBottom:4}}>Detected signals:</div>
              {signals.signals.map((s,i) => <div key={i} style={{fontSize:"0.75rem"}}>→ {s}</div>)}
              <div style={{fontSize:"0.72rem",marginTop:4}}>Category: <strong>{signals.category}</strong> · Source: <strong>{signals.source}</strong> · Severity: <strong>{severity}</strong></div>
            </div>
          )}
          {secretCheck?.found && (
            <div className="alert alert-danger" style={{marginBottom:10}}>
              ⚠ Secret-like content detected: {secretCheck.terms.join(", ")}. Content will be stored as-is — review before saving.
            </div>
          )}
          <textarea className="form-textarea" value={text} onChange={(e) => setText(e.target.value)}
            rows={12} placeholder={"Paste raw error log here...\n\nExample:\nUncaught TypeError: Cannot read properties of undefined\n    at Dashboard (Dashboard.jsx:42)\n..."}
            style={{fontFamily:"var(--font-mono)",fontSize:"0.72rem"}} aria-label="Paste raw error log" />
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button className="btn btn-primary" onClick={handleImportLog} disabled={!text.trim()}>↓ Import Log</button>
            {onClose && <button className="btn btn-ghost" onClick={onClose}>Cancel</button>}
          </div>
        </div>
      )}

      {tab === "json" && (
        <div>
          <div style={{fontSize:"0.75rem",color:"var(--muted)",marginBottom:8}}>
            Paste a single error JSON object. Secret-like fields are stripped automatically.
          </div>
          {secretCheck?.found && (
            <div className="alert alert-danger" style={{marginBottom:10}}>
              ⚠ Secret-like content detected: {secretCheck.terms.join(", ")}.
            </div>
          )}
          <textarea className="form-textarea" value={text} onChange={(e) => setText(e.target.value)}
            rows={14} placeholder={'{\n  "title": "My Error",\n  "category": "build_error",\n  ...\n}'}
            style={{fontFamily:"var(--font-mono)",fontSize:"0.72rem"}} aria-label="Paste error JSON" />
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button className="btn btn-primary" onClick={handleImportJson} disabled={!text.trim()}>↓ Import JSON</button>
            {onClose && <button className="btn btn-ghost" onClick={onClose}>Cancel</button>}
          </div>
        </div>
      )}

      {result && (
        <div className={`alert ${result.type==="error"?"alert-danger":"alert-success"}`} style={{marginTop:12}} role="status">
          {result.message}
        </div>
      )}

      <div style={{marginTop:12,padding:"8px 10px",background:"rgba(0,229,255,0.03)",border:"1px solid var(--border2)",borderRadius:"var(--radius)",fontSize:"0.68rem",color:"var(--muted)",fontFamily:"var(--font-mono)"}}>
        Imports are data only — logs are never executed. Secret fields removed. Content stored locally through storage.js SSOT.
      </div>
    </div>
  );
}

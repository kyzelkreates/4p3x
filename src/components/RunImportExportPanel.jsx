// ============================================================
// AP3X — RunImportExportPanel — Run 5
// /src/components/RunImportExportPanel.jsx
// ============================================================

import { useState } from "react";
import { importRun } from "../core/storage.js";
import { exportRunAsJson, importRunFromJson } from "../core/runUtils.js";
import { detectSecretLikeContent } from "../core/validators.js";

export default function RunImportExportPanel({ run, allRuns, onImported, onClose }) {
  const [tab,          setTab]          = useState(run ? "export" : "import");
  const [importText,   setImportText]   = useState("");
  const [result,       setResult]       = useState(null);
  const [exportCopied, setExportCopied] = useState(false);

  // Export
  const { json: exportJson, warned: exportWarned } = run ? exportRunAsJson(run) : { json: "", warned: false };

  async function handleCopyExport() {
    try {
      await navigator.clipboard.writeText(exportJson);
      setExportCopied(true);
      setTimeout(() => setExportCopied(false), 2500);
    } catch {
      alert("Clipboard unavailable — select and copy manually.");
    }
  }

  // Import
  function handleImport() {
    setResult(null);
    const res = importRunFromJson(importText, allRuns || []);
    if (!res.success) { setResult({ type:"error", message: res.error }); return; }
    importRun(res.run);
    let msg = `Run "${res.run.title}" imported successfully.`;
    if (res.secretsStripped) msg += " ⚠ Secret-like fields were removed.";
    setResult({ type:"success", message: msg });
    setImportText("");
    onImported?.();
  }

  const secretCheck = importText ? detectSecretLikeContent(importText) : { found: false, terms: [] };

  return (
    <div className="json-panel">
      <div className="json-panel-header">
        <div style={{ display:"flex", gap:0 }}>
          {run && <button className={`tab-btn ${tab==="export"?"tab-btn--active":""}`} onClick={() => setTab("export")}>Export</button>}
          <button className={`tab-btn ${tab==="import"?"tab-btn--active":""}`} onClick={() => setTab("import")}>Import</button>
        </div>
        {onClose && <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close">✕</button>}
      </div>

      {/* Export tab */}
      {tab === "export" && run && (
        <div>
          {exportWarned && (
            <div className="alert alert-warning" style={{ marginBottom:10 }}>
              ⚠ Secret-like fields were removed from this export.
            </div>
          )}
          <textarea
            className="form-textarea"
            readOnly
            value={exportJson}
            rows={14}
            style={{ fontFamily:"var(--font-mono)", fontSize:"0.68rem" }}
            aria-label="Run JSON export"
          />
          <button className="btn btn-primary btn-sm" style={{ marginTop:8 }} onClick={handleCopyExport}>
            {exportCopied ? "✓ Copied!" : "⊕ Copy JSON"}
          </button>
        </div>
      )}

      {/* Import tab */}
      {tab === "import" && (
        <div>
          <div style={{ fontSize:"0.75rem", color:"var(--muted)", marginBottom:8 }}>
            Paste a run JSON object. Secret-like fields are automatically removed. Content is stored as data only — never executed.
          </div>
          {secretCheck.found && (
            <div className="alert alert-danger" style={{ marginBottom:10 }}>
              ⚠ Secret-like content detected: {secretCheck.terms.join(", ")}. Fields will be redacted on import.
            </div>
          )}
          <textarea
            className="form-textarea"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={14}
            placeholder={'{\n  "title": "Run 5 — Run History",\n  "type": "build",\n  "status": "completed",\n  ...\n}'}
            style={{ fontFamily:"var(--font-mono)", fontSize:"0.7rem" }}
            aria-label="Paste run JSON to import"
          />
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            <button className="btn btn-primary" onClick={handleImport} disabled={!importText.trim()}>↓ Import Run</button>
            {onClose && <button className="btn btn-ghost" onClick={onClose}>Cancel</button>}
          </div>
        </div>
      )}

      {result && (
        <div className={`alert ${result.type === "error" ? "alert-danger" : "alert-success"}`} style={{ marginTop:10 }} role="status">
          {result.message}
        </div>
      )}

      <div style={{ marginTop:10, padding:"8px 10px", background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.68rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
        Imports are data only — content is never executed. Secret fields removed. Stored through storage.js SSOT.
      </div>
    </div>
  );
}

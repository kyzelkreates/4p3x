// ============================================================
// AP3X — PromptImportExportPanel Component
// /src/components/PromptImportExportPanel.jsx — Run 3
// ============================================================

import { useState } from "react";
import {
  exportPromptAsJson, exportPromptAsText,
  importPromptFromJson, importPromptFromText,
  copyPromptToClipboard,
} from "../core/promptUtils.js";
import { importPrompt } from "../core/storage.js";

export default function PromptImportExportPanel({ prompt, allPrompts, onImported, onClose }) {
  const [tab,          setTab]          = useState(prompt ? "export" : "import");
  const [exportFormat, setExportFormat] = useState("json");
  const [importText,   setImportText]   = useState("");
  const [importMode,   setImportMode]   = useState("json");
  const [importMeta,   setImportMeta]   = useState({ title: "", type: "other", category: "other" });
  const [result,       setResult]       = useState(null);
  const [copied,       setCopied]       = useState(false);

  const exportedJson = prompt ? exportPromptAsJson(prompt) : null;
  const exportedText = prompt ? exportPromptAsText(prompt) : null;
  const displayText  = exportFormat === "json" ? exportedJson?.json : exportedText;

  async function handleCopy() {
    const text = exportFormat === "json" ? exportedJson?.json : exportedText;
    if (!text) return;
    const res = await copyPromptToClipboard(text);
    if (res.success) { setCopied(true); setTimeout(() => setCopied(false), 2500); }
    else alert("Clipboard unavailable — select and copy manually.");
  }

  function handleImport() {
    setResult(null);
    let parsed;
    if (importMode === "json") {
      parsed = importPromptFromJson(importText, allPrompts);
    } else {
      parsed = importPromptFromText(importText, importMeta);
    }
    if (!parsed.success) { setResult({ type: "error", message: parsed.error }); return; }
    importPrompt(parsed.prompt);
    let msg = `Prompt "${parsed.prompt.title}" imported.`;
    if (parsed.secretsStripped) msg += " ⚠ Secret-like fields were removed.";
    if (parsed.secretWarning)   msg += ` ⚠ ${parsed.secretWarning}`;
    setResult({ type: "success", message: msg });
    setImportText("");
    onImported?.();
  }

  return (
    <div className="json-panel">
      <div className="json-panel-header">
        <div style={{ display: "flex", gap: 0 }}>
          {prompt && (
            <button className={`tab-btn ${tab === "export" ? "tab-btn--active" : ""}`} onClick={() => setTab("export")}>
              Export
            </button>
          )}
          <button className={`tab-btn ${tab === "import" ? "tab-btn--active" : ""}`} onClick={() => setTab("import")}>
            Import
          </button>
        </div>
        {onClose && (
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close panel">✕</button>
        )}
      </div>

      {/* ── EXPORT ── */}
      {tab === "export" && prompt && (
        <div>
          {(exportedJson?.warned) && (
            <div className="alert alert-warning" style={{ marginBottom: 12 }}>
              ⚠ Secret-like fields were removed from this export.
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 0 }}>
              <button
                className={`tab-btn ${exportFormat === "json" ? "tab-btn--active" : ""}`}
                onClick={() => setExportFormat("json")}
              >JSON</button>
              <button
                className={`tab-btn ${exportFormat === "text" ? "tab-btn--active" : ""}`}
                onClick={() => setExportFormat("text")}
              >Text</button>
            </div>
            <div style={{ flex: 1 }} />
            <button className="btn btn-primary btn-sm" onClick={handleCopy}>
              {copied ? "✓ Copied!" : "⊕ Copy"}
            </button>
          </div>
          <textarea
            className="form-textarea"
            readOnly
            value={displayText || ""}
            rows={16}
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}
            aria-label="Exported prompt content"
          />
        </div>
      )}

      {/* ── IMPORT ── */}
      {tab === "import" && (
        <div>
          <div style={{ display: "flex", gap: 0, marginBottom: 14 }}>
            <button
              className={`tab-btn ${importMode === "json" ? "tab-btn--active" : ""}`}
              onClick={() => setImportMode("json")}
            >JSON Object</button>
            <button
              className={`tab-btn ${importMode === "text" ? "tab-btn--active" : ""}`}
              onClick={() => setImportMode("text")}
            >Plain Text</button>
          </div>

          {importMode === "text" && (
            <div className="form-row" style={{ marginBottom: 12 }}>
              <div className="form-field">
                <label className="form-label">Title</label>
                <input className="form-input" type="text" value={importMeta.title}
                  onChange={(e) => setImportMeta((m) => ({ ...m, title: e.target.value }))}
                  placeholder="Prompt title" maxLength={100} />
              </div>
              <div className="form-field">
                <label className="form-label">Type</label>
                <input className="form-input" type="text" value={importMeta.type}
                  onChange={(e) => setImportMeta((m) => ({ ...m, type: e.target.value }))}
                  placeholder="base44, debug_fix, ..." />
              </div>
              <div className="form-field">
                <label className="form-label">Category</label>
                <input className="form-input" type="text" value={importMeta.category}
                  onChange={(e) => setImportMeta((m) => ({ ...m, category: e.target.value }))}
                  placeholder="build, fix, ..." />
              </div>
            </div>
          )}

          <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: 8 }}>
            {importMode === "json"
              ? "Paste a prompt JSON object. Secret-like fields are stripped automatically."
              : "Paste raw prompt text. Set the title, type, and category above."}
          </div>

          <textarea
            className="form-textarea"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={12}
            placeholder={importMode === "json"
              ? '{\n  "title": "My Prompt",\n  "content": "...",\n  ...\n}'
              : "Paste your prompt text here..."}
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}
            aria-label="Paste prompt content to import"
          />

          {result && (
            <div className={`alert ${result.type === "error" ? "alert-danger" : "alert-success"}`} style={{ marginTop: 10 }}>
              {result.message}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              className="btn btn-primary"
              onClick={handleImport}
              disabled={!importText.trim()}
            >
              ↓ Import Prompt
            </button>
            {onClose && <button className="btn btn-ghost" onClick={onClose}>Cancel</button>}
          </div>
        </div>
      )}
    </div>
  );
}

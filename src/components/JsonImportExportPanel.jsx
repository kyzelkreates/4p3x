// ============================================================
// AP3X — JsonImportExportPanel Component
// /src/components/JsonImportExportPanel.jsx — Run 2
// ============================================================

import { useState } from "react";
import { exportProjectAsJson, importProjectFromJson } from "../core/projectUtils.js";
import { importProject } from "../core/storage.js";

export default function JsonImportExportPanel({ project, allProjects, onImported, onClose }) {
  const [tab, setTab] = useState(project ? "export" : "import");
  const [importText, setImportText] = useState("");
  const [importResult, setImportResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Export
  const exportResult = project ? exportProjectAsJson(project) : null;

  function handleCopy() {
    if (!exportResult) return;
    navigator.clipboard.writeText(exportResult.json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      alert("Clipboard not available — please copy the text manually.");
    });
  }

  // Import
  function handleImport() {
    setImportResult(null);
    const result = importProjectFromJson(importText, allProjects);
    if (!result.success) {
      setImportResult({ type: "error", message: result.error });
      return;
    }
    importProject(result.project);
    setImportResult({
      type: "success",
      message: `Project "${result.project.name}" imported.` +
        (result.secretsStripped ? " ⚠ Secret-like fields were removed during import." : ""),
    });
    setImportText("");
    onImported?.();
  }

  return (
    <div className="json-panel">
      <div className="json-panel-header">
        <div style={{ display: "flex", gap: 0 }}>
          {project && (
            <button
              className={`tab-btn ${tab === "export" ? "tab-btn--active" : ""}`}
              onClick={() => setTab("export")}
            >
              Export
            </button>
          )}
          <button
            className={`tab-btn ${tab === "import" ? "tab-btn--active" : ""}`}
            onClick={() => setTab("import")}
          >
            Import
          </button>
        </div>
        {onClose && (
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close panel">
            ✕
          </button>
        )}
      </div>

      {tab === "export" && exportResult && (
        <div>
          {exportResult.warned && (
            <div className="alert alert-warning" style={{ marginBottom: 12 }}>
              ⚠ Secret-like fields were removed from this export.
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={handleCopy}>
              {copied ? "✓ Copied!" : "⊕ Copy JSON"}
            </button>
          </div>
          <textarea
            className="form-textarea"
            readOnly
            value={exportResult.json}
            rows={16}
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}
            aria-label="Exported project JSON"
          />
        </div>
      )}

      {tab === "import" && (
        <div>
          <div style={{ marginBottom: 8, fontSize: "0.78rem", color: "var(--muted)" }}>
            Paste a project JSON object below. Secret-like fields (apiKey, token, password, etc.) will be automatically removed.
          </div>
          <textarea
            className="form-textarea"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={14}
            placeholder={'{\n  "name": "My Project",\n  "type": "pwa",\n  ...\n}'}
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}
            aria-label="Paste project JSON to import"
          />
          {importResult && (
            <div className={`alert ${importResult.type === "error" ? "alert-danger" : "alert-success"}`}
              style={{ marginTop: 10 }}>
              {importResult.message}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              className="btn btn-primary"
              onClick={handleImport}
              disabled={!importText.trim()}
            >
              ↓ Import Project
            </button>
            {onClose && (
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

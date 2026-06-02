// ============================================================
// AP3X — ExportReportPanel — Run 6
// ============================================================

import { useState } from "react";
import { exportReportAsJSON, exportReportAsMarkdown, copyReportToClipboard, downloadReportFile } from "../../utils/reportExportUtils.js";

export default function ExportReportPanel({ report, onClose }) {
  const [status,  setStatus]  = useState(null);
  const [preview, setPreview] = useState(null);
  const [format,  setFormat]  = useState("json");

  if (!report) {
    return (
      <div className="panel" style={{ color:"var(--muted)", fontSize:"0.85rem", padding:20 }}>
        Generate a report to enable export.
      </div>
    );
  }

  async function handleCopy(fmt) {
    setStatus({ loading:true });
    const res = await copyReportToClipboard(report, fmt);
    if (res.success) setStatus({ ok:true,  msg:`${fmt.toUpperCase()} copied to clipboard${res.fallback?" (fallback method)":""}!` });
    else             setStatus({ ok:false, msg:`Copy failed: ${res.error || "Unknown error"}. Try the Preview tab and copy manually.` });
    setTimeout(() => setStatus(null), 4000);
  }

  function handleDownload(fmt) {
    setStatus({ loading:true });
    const res = downloadReportFile(report, fmt);
    if (res.success) setStatus({ ok:true,  msg:`${fmt.toUpperCase()} file download started!` });
    else             setStatus({ ok:false, msg:`Download failed: ${res.error || "Browser may not support downloads."}` });
    setTimeout(() => setStatus(null), 4000);
  }

  function handlePreview(fmt) {
    setFormat(fmt);
    setPreview(fmt === "markdown" ? exportReportAsMarkdown(report) : exportReportAsJSON(report));
  }

  return (
    <div>
      {/* Action buttons */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
        <button className="btn btn-primary btn-sm" onClick={() => handleCopy("json")}    aria-label="Copy JSON">⊕ Copy JSON</button>
        <button className="btn btn-primary btn-sm" onClick={() => handleCopy("markdown")}aria-label="Copy Markdown">⊕ Copy Markdown</button>
        <button className="btn btn-ghost  btn-sm" onClick={() => handleDownload("json")}  aria-label="Download JSON">↓ Download JSON</button>
        <button className="btn btn-ghost  btn-sm" onClick={() => handleDownload("markdown")}aria-label="Download Markdown">↓ Download Markdown</button>
        <button className="btn btn-ghost  btn-sm" onClick={() => handlePreview("json")}   aria-label="Preview JSON">◎ Preview JSON</button>
        <button className="btn btn-ghost  btn-sm" onClick={() => handlePreview("markdown")}aria-label="Preview Markdown">◎ Preview Markdown</button>
        {onClose && <button className="btn btn-ghost btn-sm" onClick={onClose} style={{marginLeft:"auto"}} aria-label="Close">✕ Close</button>}
      </div>

      {/* Status */}
      {status && !status.loading && (
        <div className={`alert ${status.ok ? "alert-success" : "alert-danger"}`} style={{ marginBottom:12 }} role="status">
          {status.msg}
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <span className="section-label">{format.toUpperCase()} Preview (read-only)</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setPreview(null)} aria-label="Close preview">✕ Close Preview</button>
          </div>
          <textarea
            readOnly
            value={preview}
            rows={18}
            className="form-textarea"
            style={{ fontFamily:"var(--font-mono)", fontSize:"0.68rem", lineHeight:1.6, cursor:"text" }}
            aria-label={`${format} preview`}
          />
          <button className="btn btn-primary btn-sm" style={{ marginTop:6 }} onClick={() => handleCopy(format)} aria-label="Copy previewed content">
            ⊕ Copy {format.toUpperCase()}
          </button>
        </div>
      )}

      <div style={{ marginTop:14, padding:"8px 12px", background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.68rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
        Exports contain architecture patterns only. No secrets, API keys, or proprietary assets.
        Originality &amp; Legal Safety Notice is included in all exports.
      </div>
    </div>
  );
}

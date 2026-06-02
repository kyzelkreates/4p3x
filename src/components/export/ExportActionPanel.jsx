// ============================================================
// AP3X — ExportActionPanel — Run 8
// ============================================================
import { useState } from "react";
import { copyFullMarkdownPack, copyClientReport, copyInvestorSummary, copyDeveloperBrief, copyBuildPromptPack, downloadJSONPack, downloadMarkdownPack } from "../../utils/presentationCopyUtils.js";
import { openPrintWindow } from "../../utils/printReportUtils.js";

export default function ExportActionPanel({ exportPack }) {
  const [status, setStatus] = useState(null);
  if (!exportPack) return (
    <div className="panel" style={{ color: "var(--muted)", padding: 20 }}>Generate an export pack to enable export actions.</div>
  );
  async function act(fn, label) {
    try {
      const res = await fn();
      setStatus(res.success ? { ok: true, msg: `${label} succeeded!${res.fallback ? " (fallback)" : ""}` } : { ok: false, msg: `${label} failed: ${res.error || "Unknown error"}` });
    } catch (e) { setStatus({ ok: false, msg: `${label} error: ${e.message}` }); }
    setTimeout(() => setStatus(null), 4000);
  }
  function dlAct(fn, label) {
    const res = fn();
    setStatus(res.success ? { ok: true, msg: `${label} download started!` } : { ok: false, msg: `${label} failed: ${res.error || "Browser may not support downloads."}` });
    setTimeout(() => setStatus(null), 4000);
  }
  function printAct() {
    const res = openPrintWindow(exportPack);
    setStatus(res.success ? { ok: true, msg: "Print window opened." } : { ok: false, msg: `Print failed: ${res.error}. Use Copy Markdown as fallback.` });
    setTimeout(() => setStatus(null), 6000);
  }
  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <button className="btn btn-primary btn-sm" onClick={() => act(() => copyFullMarkdownPack(exportPack),   "Full Markdown Pack")}  aria-label="Copy full markdown pack">⊕ Copy Full Markdown</button>
        <button className="btn btn-primary btn-sm" onClick={() => act(() => copyClientReport(exportPack),       "Client Report")}       aria-label="Copy client report">⊕ Copy Client Report</button>
        <button className="btn btn-primary btn-sm" onClick={() => act(() => copyInvestorSummary(exportPack),    "Investor Summary")}    aria-label="Copy investor summary">⊕ Copy Investor Summary</button>
        <button className="btn btn-primary btn-sm" onClick={() => act(() => copyDeveloperBrief(exportPack),     "Developer Brief")}     aria-label="Copy developer brief">⊕ Copy Developer Brief</button>
        <button className="btn btn-primary btn-sm" onClick={() => act(() => copyBuildPromptPack(exportPack),    "Build Prompt")}        aria-label="Copy build prompt">⊕ Copy Build Prompt</button>
        <button className="btn btn-ghost  btn-sm" onClick={() => dlAct(() => downloadJSONPack(exportPack),     "JSON Pack")}            aria-label="Download JSON pack">↓ Download JSON</button>
        <button className="btn btn-ghost  btn-sm" onClick={() => dlAct(() => downloadMarkdownPack(exportPack), "Markdown Pack")}        aria-label="Download markdown pack">↓ Download Markdown</button>
        <button className="btn btn-ghost  btn-sm" onClick={printAct} aria-label="Print report">🖨 Print Report</button>
      </div>
      {status && (
        <div className={`alert ${status.ok ? "alert-success" : "alert-danger"}`} role="status" style={{ marginBottom: 10 }}>
          {status.msg}
        </div>
      )}
      <div style={{ padding: "8px 12px", background: "rgba(0,229,255,0.03)", border: "1px solid var(--border2)", borderRadius: "var(--radius)", fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
        All exports strip sensitive fields automatically. Originality &amp; Legal Safety Notice is included in every export.
      </div>
    </div>
  );
}

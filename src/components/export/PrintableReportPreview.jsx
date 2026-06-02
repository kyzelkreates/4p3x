// ============================================================
// AP3X — PrintableReportPreview — Run 8
// ============================================================
import { useState } from "react";
import { openPrintWindow } from "../../utils/printReportUtils.js";
export default function PrintableReportPreview({ exportPack }) {
  const [status, setStatus] = useState(null);
  function handlePrint() {
    const res = openPrintWindow(exportPack);
    if (!res.success) setStatus({ ok: false, msg: `Print failed: ${res.error}. Use Copy Markdown as fallback.` });
    else setStatus({ ok: true, msg: "Print window opened." });
    setTimeout(() => setStatus(null), 5000);
  }
  if (!exportPack) return <div className="panel" style={{ color: "var(--muted)", padding: 20 }}>Generate an export pack to enable print layout.</div>;
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button className="btn btn-primary btn-sm" onClick={handlePrint} aria-label="Open print window">🖨 Open Print Window</button>
      </div>
      {status && <div className={`alert ${status.ok ? "alert-success" : "alert-warning"}`} role="status" style={{ marginBottom: 10 }}>{status.msg}</div>}
      <div style={{ padding: "16px 20px", background: "#fff", border: "1px solid var(--border2)", borderRadius: "var(--radius)", color: "#111", fontFamily: "Georgia, serif" }}>
        <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 6, borderBottom: "2px solid #111", paddingBottom: 6 }}>{exportPack.title}</div>
        <div style={{ fontSize: "0.72rem", color: "#555", marginBottom: 12 }}>Generated: {new Date().toLocaleString()}</div>
        <div style={{ fontSize: "0.8rem", color: "#111", lineHeight: 1.7, marginBottom: 10 }}>{exportPack.clientReport?.executiveSummary || "—"}</div>
        <div style={{ padding: "10px 14px", background: "#f9f9f9", border: "1px solid #ccc", borderRadius: 4, fontSize: "0.72rem", color: "#333", fontStyle: "italic" }}>
          ⚖ {exportPack.originalitySafetyReport?.safetyNotice || "Originality & Legal Safety Notice included in full export."}
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: "0.68rem", color: "var(--muted)" }}>
        Preview only — click "Open Print Window" for the full printable layout.
      </div>
    </div>
  );
}

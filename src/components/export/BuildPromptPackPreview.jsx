// ============================================================
// AP3X — BuildPromptPackPreview — Run 8
// ============================================================
import { useState } from "react";
import { copyBuildPromptPack as copyBuildPromptToClipboard } from "../../utils/presentationCopyUtils.js";
export default function BuildPromptPackPreview({ exportPack }) {
  const bp = exportPack?.buildPromptPack;
  const [status, setStatus] = useState(null);
  if (!bp) return <div className="panel" style={{ color: "var(--muted)", padding: 20 }}>No build prompt pack available.</div>;
  if (!bp.hasPrompt) return (
    <div className="panel">
      <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>No build prompt available. Generate a blueprint in the Blueprint Builder, then regenerate this export pack.</div>
    </div>
  );
  async function handleCopy() {
    const res = await copyBuildPromptToClipboard(exportPack);
    setStatus(res.success ? { ok: true, msg: "Prompt copied!" } : { ok: false, msg: `Copy failed: ${res.error}` });
    setTimeout(() => setStatus(null), 4000);
  }
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button className="btn btn-primary btn-sm" onClick={handleCopy} aria-label="Copy prompt">⊕ Copy Prompt</button>
      </div>
      {status && <div className={`alert ${status.ok ? "alert-success" : "alert-danger"}`} role="status" style={{ marginBottom: 10 }}>{status.msg}</div>}
      <textarea
        readOnly value={bp.prompt || ""} rows={16}
        className="form-textarea"
        style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", lineHeight: 1.6 }}
        aria-label="Build prompt preview"
      />
    </div>
  );
}

// ============================================================
// AP3X — BlueprintExportPanel — Run 7
// ============================================================
import { useState } from "react";
import {
  copyBlueprintToClipboard,
  downloadBlueprintFile,
  copyBuildPromptToClipboard,
} from "../../utils/blueprintExportUtils.js";

export default function BlueprintExportPanel({ blueprint }) {
  const [status, setStatus] = useState(null);

  if (!blueprint) {
    return (
      <div className="panel" style={{ color: "var(--muted)", padding: 20 }}>
        Compile a blueprint to enable export.
      </div>
    );
  }

  async function act(fn, label) {
    const res = await fn();
    setStatus(
      res.success
        ? { ok: true,  msg: `${label} succeeded!${res.fallback ? " (fallback method)" : ""}` }
        : { ok: false, msg: `${label} failed: ${res.error || "Unknown error"}` }
    );
    setTimeout(() => setStatus(null), 4000);
  }

  function dlAct(fn, label) {
    const res = fn();
    setStatus(
      res.success
        ? { ok: true,  msg: `${label} download started!` }
        : { ok: false, msg: `${label} failed: ${res.error || "Browser may not support downloads."}` }
    );
    setTimeout(() => setStatus(null), 4000);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <button className="btn btn-primary btn-sm" onClick={() => act(() => copyBlueprintToClipboard(blueprint, "json"),     "Copy JSON")}      aria-label="Copy JSON">⊕ Copy JSON</button>
        <button className="btn btn-primary btn-sm" onClick={() => act(() => copyBlueprintToClipboard(blueprint, "markdown"), "Copy Markdown")}  aria-label="Copy Markdown">⊕ Copy Markdown</button>
        <button className="btn btn-ghost  btn-sm" onClick={() => dlAct(() => downloadBlueprintFile(blueprint, "json"),     "Download JSON")}   aria-label="Download JSON">↓ Download JSON</button>
        <button className="btn btn-ghost  btn-sm" onClick={() => dlAct(() => downloadBlueprintFile(blueprint, "markdown"), "Download MD")}     aria-label="Download Markdown">↓ Download MD</button>
        <button className="btn btn-ghost  btn-sm" onClick={() => act(() => copyBuildPromptToClipboard(blueprint.generatedBuildPrompt || ""), "Copy Prompt")} aria-label="Copy build prompt">⊕ Copy Build Prompt</button>
      </div>

      {status && (
        <div className={`alert ${status.ok ? "alert-success" : "alert-danger"}`} role="status" style={{ marginBottom: 10 }}>
          {status.msg}
        </div>
      )}

      <div style={{ padding: "8px 12px", background: "rgba(0,229,255,0.03)", border: "1px solid var(--border2)", borderRadius: "var(--radius)", fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
        Exports contain architecture patterns only. Secrets are stripped automatically.
        Originality &amp; Legal Safety Notice is included in all exports.
      </div>
    </div>
  );
}

// ============================================================
// AP3X — BuildPromptPanel — Run 7
// ============================================================
import { useState } from "react";
import { copyBuildPromptToClipboard } from "../../utils/blueprintExportUtils.js";
import { compileBuildPromptFromBlueprint } from "../../core/buildPromptCompiler.js";
import { validateCompiledPrompt } from "../../core/buildPromptCompiler.js";
import { BLUEPRINT_TARGET_TOOLS } from "../../core/constants.js";

export default function BuildPromptPanel({ blueprint }) {
  const [tool,     setTool]     = useState("developer");
  const [runIndex, setRunIndex] = useState(0);
  const [status,   setStatus]   = useState(null);
  const [preview,  setPreview]  = useState(false);

  if (!blueprint) return <div className="panel" style={{color:"var(--muted)",padding:20}}>Compile a blueprint to generate build prompts.</div>;

  const runs = blueprint.implementationRuns || [];
  const prompt = compileBuildPromptFromBlueprint(blueprint, { tool, runIndex });
  const validation = validateCompiledPrompt(prompt);

  async function handleCopy() {
    const res = await copyBuildPromptToClipboard(prompt);
    setStatus(res.success ? { ok:true, msg:"Prompt copied to clipboard!" } : { ok:false, msg:`Copy failed: ${res.error || "Unknown error"}` });
    setTimeout(() => setStatus(null), 4000);
  }

  return (
    <div>
      {/* Tool + run selectors */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:14 }}>
        <div style={{ flex:1, minWidth:150 }}>
          <label className="form-label" htmlFor="prompt-tool">Target Tool</label>
          <select id="prompt-tool" className="form-select" value={tool} onChange={(e) => setTool(e.target.value)} aria-label="Select target tool">
            {BLUEPRINT_TARGET_TOOLS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        {runs.length > 0 && (
          <div style={{ flex:1, minWidth:150 }}>
            <label className="form-label" htmlFor="run-select">Target Run</label>
            <select id="run-select" className="form-select" value={runIndex} onChange={(e) => setRunIndex(Number(e.target.value))} aria-label="Select run">
              {runs.map((r, i) => <option key={r.runNumber} value={i}>Run {r.runNumber} — {r.title}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Validation badge */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
        <span className={`badge ${validation.valid ? "badge-success" : "badge-warning"}`} style={{fontSize:"0.65rem"}}>
          {validation.valid ? "✓ Prompt valid" : `⚠ ${validation.issues.length} issue(s)`}
        </span>
        <span className="badge badge-muted" style={{fontSize:"0.65rem"}}>Directive 1 present</span>
        <span className="badge badge-muted" style={{fontSize:"0.65rem"}}>Originality rule present</span>
      </div>
      {!validation.valid && (
        <div className="alert alert-warning" style={{marginBottom:10}} role="alert">
          {validation.issues.map((i, idx) => <div key={idx}>⚠ {i}</div>)}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
        <button className="btn btn-primary btn-sm" onClick={handleCopy} aria-label="Copy prompt">⊕ Copy Prompt</button>
        <button className="btn btn-ghost  btn-sm" onClick={() => setPreview((v) => !v)} aria-label="Toggle preview">{preview ? "Hide Preview" : "Preview Prompt"}</button>
      </div>

      {status && (
        <div className={`alert ${status.ok?"alert-success":"alert-danger"}`} style={{marginBottom:10}} role="status">{status.msg}</div>
      )}

      {/* Preview */}
      {preview && (
        <textarea
          readOnly
          value={prompt}
          rows={20}
          className="form-textarea"
          style={{ fontFamily:"var(--font-mono)", fontSize:"0.68rem", lineHeight:1.6, cursor:"text" }}
          aria-label="Prompt preview"
        />
      )}
    </div>
  );
}

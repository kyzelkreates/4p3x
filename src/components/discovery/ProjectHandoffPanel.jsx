// AP3X — ProjectHandoffPanel — Run 10
import { useState } from "react";
import { sendProjectToArchitectureExtractor, createProjectCompletionPrompt } from "../../core/projectHandoffEngine.js";
import { generateSafeFinishPlan } from "../../core/projectRescueQueueEngine.js";

export default function ProjectHandoffPanel({ project }) {
  const [handoff,  setHandoff]  = useState(null);
  const [prompt,   setPrompt]   = useState(null);
  const [status,   setStatus]   = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  if (!project) return <div className="panel" style={{ color:"var(--muted)", padding:20 }}>Select a project to generate handoff.</div>;

  function handleSendToExtractor() {
    const result = sendProjectToArchitectureExtractor(project);
    setHandoff(result.handoff);
    setStatus({ ok: result.success, msg: result.message });
    setTimeout(() => setStatus(null), 5000);
  }

  function handleGeneratePrompt() {
    const p = createProjectCompletionPrompt(project);
    setPrompt(p);
    setShowPrompt(true);
  }

  const plan = generateSafeFinishPlan(project);

  return (
    <div>
      <div className="panel" style={{ marginBottom:12 }}>
        <div className="section-label" style={{ marginBottom:8 }}>Project: {project.title}</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
          <button className="btn btn-primary btn-sm" onClick={handleSendToExtractor} aria-label="Send to extractor">⬡ Send To Architecture Extractor</button>
          <button className="btn btn-ghost  btn-sm" onClick={handleGeneratePrompt}   aria-label="Generate prompt">✦ Generate Fix-Only Prompt</button>
        </div>
        {status && <div className={`alert ${status.ok?"alert-success":"alert-danger"}`} role="status">{status.msg}</div>}
      </div>

      {/* Safe Finish Plan */}
      <div className="panel" style={{ marginBottom:12 }}>
        <div className="section-label" style={{ marginBottom:6 }}>Safe Finish Plan</div>
        <div style={{ marginBottom:6 }}><span className="badge badge-accent" style={{ fontSize:"0.62rem" }}>Stack: {plan.detectedStack||"Unknown"}</span></div>
        {plan.finishSteps.length > 0
          ? plan.finishSteps.map((s,i)=><div key={i} style={{ fontSize:"0.73rem", color:"var(--muted)", padding:"2px 0" }}>{i+1}. {s}</div>)
          : <div style={{ fontSize:"0.73rem", color:"var(--success)" }}>✓ No critical gaps detected — project may be ready for extraction.</div>
        }
        <div style={{ marginTop:8, fontSize:"0.65rem", color:"var(--muted)", fontStyle:"italic" }}>{plan.safetyNotice}</div>
      </div>

      {/* Handoff detail */}
      {handoff && (
        <div className="panel" style={{ marginBottom:12 }}>
          <div className="section-label" style={{ marginBottom:6 }}>Extractor Handoff — {handoff.id}</div>
          <div className="setting-row"><span className="setting-label">Focus</span><span style={{ fontSize:"0.72rem", color:"var(--muted)" }}>{handoff.recommendedExtractionFocus}</span></div>
          <div className="setting-row"><span className="setting-label">Health</span><span style={{ fontSize:"0.72rem", color:"var(--muted)" }}>{handoff.healthSummary}</span></div>
          {(handoff.safetyWarnings||[]).map((w,i)=><div key={i} style={{ fontSize:"0.68rem", color:"var(--warning)", padding:"2px 0" }}>{w}</div>)}
        </div>
      )}

      {/* Fix-only prompt */}
      {showPrompt && prompt && (
        <div className="panel">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div className="section-label">Fix-Only Build Prompt</div>
            <button className="btn btn-ghost btn-xs" onClick={async()=>{ await navigator.clipboard.writeText(prompt).catch(()=>{}); }} aria-label="Copy prompt">⊕ Copy</button>
          </div>
          <textarea readOnly value={prompt} rows={18} className="form-textarea" style={{ fontFamily:"var(--font-mono)", fontSize:"0.65rem", lineHeight:1.6 }} aria-label="Fix-only prompt" />
        </div>
      )}
    </div>
  );
}

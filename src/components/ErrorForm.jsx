// ============================================================
// AP3X — ErrorForm — Run 4
// ============================================================
import { useState } from "react";
import { ERROR_CATEGORIES, ERROR_SOURCES, ERROR_SEVERITIES, ERROR_STATUSES, PROJECT_PRIORITIES } from "../core/constants.js";
import { validateErrorRecord, detectSecretLikeContent } from "../core/validators.js";
import { createErrorFromForm, createEmptyError, detectErrorSignals, calculateErrorSeverityFromLog, parseFixSteps, createFixChecklistFromError } from "../core/errorUtils.js";
import { addError, updateError } from "../core/storage.js";

function FF({ label, error, required, children }) {
  return (
    <div className="form-field">
      <label className="form-label">{label}{required && <span style={{color:"var(--danger)"}}> *</span>}</label>
      {children}
      {error && <div className="form-error" role="alert">{error}</div>}
    </div>
  );
}
function CB({ label, checked, onChange }) {
  return (
    <label className="checkbox-row">
      <input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)} className="checkbox-input" />
      <span className="checkbox-label">{label}</span>
    </label>
  );
}

const TABS = [
  {id:"core",label:"Core"},{id:"log",label:"Log"},{id:"environment",label:"Env"},
  {id:"diagnosis",label:"Diagnosis"},{id:"fix",label:"Fix Plan"},{id:"links",label:"Links"},{id:"flags",label:"Flags"},
];

function buildForm(existing) {
  const b = existing || createEmptyError();
  return {
    title:b.title||"", description:b.description||"", rawLog:b.rawLog||"",
    category:b.category||"unknown", source:b.source||"manual",
    severity:b.severity||"medium", status:b.status||"open", priority:b.priority||"medium",
    linkedProjectId:b.linkedProjectId||"", linkedPromptId:b.linkedPromptId||"", linkedRunId:b.linkedRunId||"",
    envPlatform:b.environment?.platform||"", envBrowser:b.environment?.browser||"",
    envDevice:b.environment?.device||"", envFramework:b.environment?.framework||"",
    envDeploymentTarget:b.environment?.deploymentTarget||"", envUrl:b.environment?.url||"",
    envBranch:b.environment?.branch||"", envBuildId:b.environment?.buildId||"",
    suspectedCause:b.diagnosis?.suspectedCause||"", affectedArea:b.diagnosis?.affectedArea||"",
    failurePoint:b.diagnosis?.failurePoint||"", reproductionSteps:b.diagnosis?.reproductionSteps||"",
    expectedBehaviour:b.diagnosis?.expectedBehaviour||"", actualBehaviour:b.diagnosis?.actualBehaviour||"",
    userImpact:b.diagnosis?.userImpact||"", diagNotes:b.diagnosis?.notes||"",
    recommendedProjectStatus:b.classification?.recommendedProjectStatus||"",
    recommendedHealth:b.classification?.recommendedHealth||"",
    isBlocking:!!b.classification?.isBlocking, isDeploymentBlocking:!!b.classification?.isDeploymentBlocking,
    isSecurityRelated:!!b.classification?.isSecurityRelated, isDataLossRisk:!!b.classification?.isDataLossRisk,
    isRegression:!!b.classification?.isRegression, isRecurring:!!b.classification?.isRecurring,
    fixSummary:b.fixPlan?.summary||"",
    fixStepsText:(b.fixPlan?.steps||[]).map(s=>s.text).join("\n"),
    validationStepsText:(b.fixPlan?.validationSteps||[]).map(s=>s.text).join("\n"),
    rollbackPlan:b.fixPlan?.rollbackPlan||"", resultNotes:b.fixPlan?.resultNotes||"",
    linkedFixPromptId:b.fixPlan?.linkedFixPromptId||"",
    screenshotNotes:b.attachments?.screenshotNotes||"", fileNotes:b.attachments?.fileNotes||"",
    tagsRaw:(b.tags||[]).join(", "),
    isArchived:!!b.flags?.isArchived, isPinned:!!b.flags?.isPinned,
    needsPrompt:!!b.flags?.needsPrompt, needsHumanReview:!!b.flags?.needsHumanReview,
    needsRebuild:!!b.flags?.needsRebuild, canBeIgnored:!!b.flags?.canBeIgnored,
  };
}

export default function ErrorForm({ existingError=null, projects=[], prompts=[], onSaved, onCancel }) {
  const isEdit = !!existingError;
  const [form,       setForm]       = useState(() => buildForm(existingError));
  const [errors,     setErrors]     = useState({});
  const [saving,     setSaving]     = useState(false);
  const [section,    setSection]    = useState("core");
  const [secretWarn, setSecretWarn] = useState(null);
  const [logSignals, setLogSignals] = useState(null);

  function sf(k,v) { setForm(f=>({...f,[k]:v})); if(errors[k]) setErrors(e=>({...e,[k]:null})); }

  function handleLogChange(v) {
    sf("rawLog",v);
    if(v.trim()){
      const sigs=detectErrorSignals(v);
      const sev=calculateErrorSeverityFromLog(v);
      setLogSignals({...sigs,severity:sev});
      if(form.category==="unknown") sf("category",sigs.category);
      if(form.source==="manual")    sf("source",  sigs.source);
    } else { setLogSignals(null); }
    setSecretWarn(null);
  }

  function buildPayload() {
    return {
      title:form.title, description:form.description, rawLog:form.rawLog,
      category:form.category, source:form.source, severity:form.severity,
      status:form.status, priority:form.priority,
      linkedProjectId:form.linkedProjectId, linkedPromptId:form.linkedPromptId, linkedRunId:form.linkedRunId,
      tags:form.tagsRaw.split(",").map(t=>t.trim()).filter(Boolean),
      environment:{platform:form.envPlatform,browser:form.envBrowser,device:form.envDevice,
        framework:form.envFramework,deploymentTarget:form.envDeploymentTarget,url:form.envUrl,
        branch:form.envBranch,buildId:form.envBuildId,timestamp:""},
      diagnosis:{suspectedCause:form.suspectedCause,affectedArea:form.affectedArea,
        failurePoint:form.failurePoint,reproductionSteps:form.reproductionSteps,
        expectedBehaviour:form.expectedBehaviour,actualBehaviour:form.actualBehaviour,
        userImpact:form.userImpact,notes:form.diagNotes},
      classification:{recommendedProjectStatus:form.recommendedProjectStatus,
        recommendedHealth:form.recommendedHealth,isBlocking:form.isBlocking,
        isDeploymentBlocking:form.isDeploymentBlocking,isSecurityRelated:form.isSecurityRelated,
        isDataLossRisk:form.isDataLossRisk,isRegression:form.isRegression,isRecurring:form.isRecurring},
      fixPlan:{summary:form.fixSummary,steps:parseFixSteps(form.fixStepsText),
        validationSteps:parseFixSteps(form.validationStepsText),rollbackPlan:form.rollbackPlan,
        linkedFixPromptId:form.linkedFixPromptId,
        fixAttempted:existingError?.fixPlan?.fixAttempted||false,fixedAt:existingError?.fixPlan?.fixedAt||null,
        fixedBy:existingError?.fixPlan?.fixedBy||"",resultNotes:form.resultNotes},
      attachments:{screenshotNotes:form.screenshotNotes,fileNotes:form.fileNotes,externalReferences:existingError?.attachments?.externalReferences||[]},
      flags:{isArchived:form.isArchived,isPinned:form.isPinned,needsPrompt:form.needsPrompt,
        needsHumanReview:form.needsHumanReview,needsRebuild:form.needsRebuild,canBeIgnored:form.canBeIgnored},
    };
  }

  function handleSave() {
    const payload=buildPayload();
    const v=validateErrorRecord(payload);
    if(!v.valid){
      const em={};
      v.errors.forEach(e=>{if(e.toLowerCase().includes("title"))em.title=e;else em._general=e;});
      setErrors(em); setSection("core"); return;
    }
    const sc=detectSecretLikeContent(form.rawLog);
    if(sc.found && !secretWarn){ setSecretWarn(`Secret-like content in log: ${sc.terms.join(", ")}. Save anyway?`); setSection("log"); return; }
    setSaving(true);
    try {
      const record=createErrorFromForm(payload,existingError);
      if(isEdit) updateError(existingError.id,record); else addError(record);
      onSaved?.(record);
    } catch(e){ console.error(e); setErrors({_general:"Failed to save."}); }
    finally { setSaving(false); }
  }

  function handleAutoChecklist() {
    const dummy={...buildPayload(),id:existingError?.id||"tmp"};
    const steps=createFixChecklistFromError(dummy);
    sf("fixStepsText",steps.map(s=>s.text).join("\n"));
  }

  const ta=(key,rows=3,max=3000,ph="")=>(
    <textarea className="form-textarea" value={form[key]} maxLength={max} rows={rows}
      onChange={e=>sf(key,e.target.value)} placeholder={ph} />
  );
  const inp=(key,ph="",type="text",max=200)=>(
    <input className="form-input" type={type} value={form[key]} maxLength={max}
      onChange={e=>sf(key,e.target.value)} placeholder={ph} />
  );

  return (
    <div className="form-container">
      <div className="form-tabs">
        {TABS.map(s=>(
          <button key={s.id} className={`tab-btn ${section===s.id?"tab-btn--active":""}`}
            onClick={()=>setSection(s.id)} type="button">{s.label}</button>
        ))}
      </div>
      {errors._general && <div className="alert alert-danger" style={{marginBottom:16}} role="alert">{errors._general}</div>}

      {/* CORE */}
      {section==="core" && (
        <div className="form-section">
          <FF label="Error Title" required error={errors.title}>
            <input className={`form-input ${errors.title?"form-input--error":""}`} type="text"
              value={form.title} maxLength={120} onChange={e=>sf("title",e.target.value)}
              placeholder="e.g. Vercel Build Failure — dist not found" aria-required="true" />
          </FF>
          <FF label="Description">{ta("description",2,1000,"Brief description")}</FF>
          <div className="char-count">{form.description.length}/1000</div>
          <div className="form-row">
            <FF label="Category" required>
              <select className="form-select" value={form.category} onChange={e=>sf("category",e.target.value)}>
                {ERROR_CATEGORIES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </FF>
            <FF label="Source">
              <select className="form-select" value={form.source} onChange={e=>sf("source",e.target.value)}>
                {ERROR_SOURCES.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </FF>
            <FF label="Severity" required>
              <select className="form-select" value={form.severity} onChange={e=>sf("severity",e.target.value)}>
                {ERROR_SEVERITIES.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </FF>
            <FF label="Status">
              <select className="form-select" value={form.status} onChange={e=>sf("status",e.target.value)}>
                {ERROR_STATUSES.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </FF>
            <FF label="Priority">
              <select className="form-select" value={form.priority} onChange={e=>sf("priority",e.target.value)}>
                {PROJECT_PRIORITIES.map(p=><option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </FF>
          </div>
          <FF label="Tags (comma-separated)">{inp("tagsRaw","build, deploy, blocker...",undefined,500)}</FF>
        </div>
      )}

      {/* LOG */}
      {section==="log" && (
        <div className="form-section">
          {logSignals?.signals?.length>0 && (
            <div className="alert alert-warning" style={{marginBottom:12}}>
              <div style={{fontWeight:600,marginBottom:4}}>Auto-detected:</div>
              {logSignals.signals.map((s,i)=><div key={i} style={{fontSize:"0.75rem"}}>→ {s}</div>)}
              <div style={{fontSize:"0.72rem",marginTop:4}}>Category: <strong>{logSignals.category}</strong> · Source: <strong>{logSignals.source}</strong> · Severity: <strong>{logSignals.severity}</strong></div>
            </div>
          )}
          {secretWarn && (
            <div className="alert alert-danger" style={{marginBottom:12}}>
              ⚠ {secretWarn}
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <button className="btn btn-ghost btn-sm" type="button" onClick={()=>setSecretWarn(null)}>Review</button>
                <button className="btn btn-danger btn-sm" type="button" onClick={()=>{setSecretWarn("__bypass__");setTimeout(handleSave,0);}}>Save Anyway</button>
              </div>
            </div>
          )}
          <FF label="Raw Log (data only — never executed)" error={errors.rawLog}>
            <textarea className="form-textarea" value={form.rawLog} maxLength={50000} rows={18}
              onChange={e=>handleLogChange(e.target.value)}
              placeholder={"Paste raw error log here...\n\nUncaught TypeError: Cannot read...\n    at Component.jsx:42"}
              style={{fontFamily:"var(--font-mono)",fontSize:"0.73rem",lineHeight:1.6}} />
            <div className="char-count">{form.rawLog.length}/50,000</div>
          </FF>
        </div>
      )}

      {/* ENVIRONMENT */}
      {section==="environment" && (
        <div className="form-section">
          <div className="form-row">
            <FF label="Platform">{inp("envPlatform","Vercel, Browser...")}</FF>
            <FF label="Browser">{inp("envBrowser","Chrome 124...")}</FF>
            <FF label="Device">{inp("envDevice","Desktop, Mobile...")}</FF>
          </div>
          <div className="form-row">
            <FF label="Framework">{inp("envFramework","React + Vite...")}</FF>
            <FF label="Deployment Target">{inp("envDeploymentTarget","Vercel...")}</FF>
            <FF label="Branch">{inp("envBranch","main...")}</FF>
          </div>
          <div className="form-row">
            <FF label="URL">{inp("envUrl","https://...",undefined,500)}</FF>
            <FF label="Build ID">{inp("envBuildId","deploy_xxx")}</FF>
          </div>
        </div>
      )}

      {/* DIAGNOSIS */}
      {section==="diagnosis" && (
        <div className="form-section">
          {[
            ["Suspected Cause","suspectedCause","What likely caused this?"],
            ["Affected Area","affectedArea","Which part of the system?"],
            ["Failure Point","failurePoint","Exact file, line, function..."],
            ["Reproduction Steps","reproductionSteps","Step-by-step to reproduce"],
            ["Expected Behaviour","expectedBehaviour","What should happen?"],
            ["Actual Behaviour","actualBehaviour","What actually happens?"],
            ["User Impact","userImpact","How does this affect users?"],
            ["Notes","diagNotes","Any additional context"],
          ].map(([label,key,ph])=>(
            <FF key={key} label={label}>{ta(key,3,3000,ph)}</FF>
          ))}
        </div>
      )}

      {/* FIX PLAN */}
      {section==="fix" && (
        <div className="form-section">
          <FF label="Fix Plan Summary">{ta("fixSummary",3,3000,"High-level plan...")}</FF>
          <FF label="Fix Steps (one per line)">
            <div style={{display:"flex",gap:8,marginBottom:6}}>
              <button className="btn btn-ghost btn-sm" type="button" onClick={handleAutoChecklist}>⬡ Auto-generate</button>
            </div>
            <textarea className="form-textarea" value={form.fixStepsText} maxLength={10000} rows={8}
              onChange={e=>sf("fixStepsText",e.target.value)}
              placeholder={"Step 1\nStep 2\n..."} style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem"}} />
          </FF>
          <FF label="Validation Steps (one per line)">
            <textarea className="form-textarea" value={form.validationStepsText} maxLength={5000} rows={4}
              onChange={e=>sf("validationStepsText",e.target.value)}
              placeholder={"Validate 1\nValidate 2\n..."} style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem"}} />
          </FF>
          <FF label="Rollback Plan">{ta("rollbackPlan",3,3000,"What to do if fix fails...")}</FF>
          <FF label="Result Notes">{ta("resultNotes",3,3000,"What happened when fix was applied?")}</FF>
        </div>
      )}

      {/* LINKS */}
      {section==="links" && (
        <div className="form-section">
          <FF label="Linked Project">
            <select className="form-select" value={form.linkedProjectId} onChange={e=>sf("linkedProjectId",e.target.value)}>
              <option value="">None</option>
              {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </FF>
          <FF label="Linked Prompt">
            <select className="form-select" value={form.linkedPromptId} onChange={e=>sf("linkedPromptId",e.target.value)}>
              <option value="">None</option>
              {prompts.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </FF>
          <FF label="Linked Fix Prompt">
            <select className="form-select" value={form.linkedFixPromptId} onChange={e=>sf("linkedFixPromptId",e.target.value)}>
              <option value="">None</option>
              {prompts.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </FF>
          <FF label="Linked Run Number">{inp("linkedRunId","1, 2, 3...",undefined,20)}</FF>
          <FF label="Screenshot Notes">{ta("screenshotNotes",2,1000)}</FF>
          <FF label="File Notes">{ta("fileNotes",2,1000)}</FF>
          <div style={{borderTop:"1px solid var(--border2)",paddingTop:14,marginTop:4}}>
            <div className="form-row">
              <FF label="Recommended Project Status">{inp("recommendedProjectStatus","broken, partial...",undefined,40)}</FF>
              <FF label="Recommended Health">{inp("recommendedHealth","critical, broken...",undefined,40)}</FF>
            </div>
          </div>
        </div>
      )}

      {/* FLAGS */}
      {section==="flags" && (
        <div className="form-section">
          <div className="section-label" style={{marginBottom:14}}>Error flags</div>
          <div className="checkbox-grid">
            <CB label="Deployment Blocker"  checked={form.isDeploymentBlocking} onChange={v=>sf("isDeploymentBlocking",v)} />
            <CB label="Blocking"            checked={form.isBlocking}           onChange={v=>sf("isBlocking",v)} />
            <CB label="Security Related"    checked={form.isSecurityRelated}    onChange={v=>sf("isSecurityRelated",v)} />
            <CB label="Data Loss Risk"      checked={form.isDataLossRisk}       onChange={v=>sf("isDataLossRisk",v)} />
            <CB label="Regression"          checked={form.isRegression}         onChange={v=>sf("isRegression",v)} />
            <CB label="Recurring"           checked={form.isRecurring}          onChange={v=>sf("isRecurring",v)} />
            <CB label="Pinned"              checked={form.isPinned}             onChange={v=>sf("isPinned",v)} />
            <CB label="Needs Prompt"        checked={form.needsPrompt}          onChange={v=>sf("needsPrompt",v)} />
            <CB label="Needs Human Review"  checked={form.needsHumanReview}     onChange={v=>sf("needsHumanReview",v)} />
            <CB label="Needs Rebuild"       checked={form.needsRebuild}         onChange={v=>sf("needsRebuild",v)} />
            <CB label="Can Be Ignored"      checked={form.canBeIgnored}         onChange={v=>sf("canBeIgnored",v)} />
            <CB label="Archived"            checked={form.isArchived}           onChange={v=>sf("isArchived",v)} />
          </div>
        </div>
      )}

      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onCancel} type="button">Cancel</button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving} type="button">
          {saving?"Saving…":isEdit?"✓ Save Changes":"✓ Create Error"}
        </button>
      </div>
    </div>
  );
}

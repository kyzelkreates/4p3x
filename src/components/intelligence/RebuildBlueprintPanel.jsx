// ============================================================
// AP3X — RebuildBlueprintPanel — Run 6
// ============================================================

import { useState } from "react";
import { formatFileStructureForDisplay, formatRunsForDisplay } from "../../utils/blueprintFormatUtils.js";

const TABS = [
  { id:"runs",       label:"Implementation Runs" },
  { id:"files",      label:"File Structure" },
  { id:"components", label:"Components" },
  { id:"data",       label:"Data Model" },
  { id:"state",      label:"State Management" },
  { id:"ux",         label:"UX Flow" },
  { id:"validation", label:"Validation Plan" },
];

export default function RebuildBlueprintPanel({ report }) {
  const [tab, setTab] = useState("runs");
  const bp = report?.rebuildBlueprint;

  if (!report || !bp) {
    return (
      <div className="panel" style={{ textAlign:"center", padding:30, color:"var(--muted)", fontSize:"0.85rem" }}>
        Generate a report to see the original rebuild blueprint.
      </div>
    );
  }

  const fileLines = formatFileStructureForDisplay(bp.fileStructure || "");
  const runs      = formatRunsForDisplay(bp.implementationRuns || []);

  return (
    <div>
      {/* Safety notice */}
      <div style={{ padding:"10px 14px", marginBottom:16, background:"rgba(0,229,255,0.03)", border:"1px solid rgba(0,229,255,0.15)", borderRadius:"var(--radius)", fontSize:"0.75rem", color:"var(--muted)" }}>
        ℹ️ {bp.notice}
      </div>

      {/* Tabs */}
      <div className="form-tabs" style={{ marginBottom:16 }}>
        {TABS.map((t) => (
          <button key={t.id} className={`tab-btn ${tab===t.id?"tab-btn--active":""}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ── RUNS ── */}
      {tab === "runs" && (
        <div>
          {runs.map((r) => (
            <div key={r.run} style={{
              padding:"12px 16px", marginBottom:10,
              background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)",
              borderRadius:"var(--radius)", borderLeft:"3px solid var(--accent)",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
                <span className="badge badge-purple" style={{fontSize:"0.68rem",fontFamily:"var(--font-mono)"}}>Run {r.run}</span>
                <span style={{ fontWeight:600, fontSize:"0.82rem", color:"var(--text)" }}>{r.title}</span>
              </div>
              <div style={{ fontSize:"0.75rem", color:"var(--muted)", marginTop:5 }}>{r.description}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── FILE STRUCTURE ── */}
      {tab === "files" && (
        <div style={{
          fontFamily:"var(--font-mono)", fontSize:"0.72rem",
          background:"rgba(0,0,0,0.25)", border:"1px solid var(--border2)",
          borderRadius:"var(--radius)", padding:"14px 16px",
          maxHeight:400, overflowY:"auto",
        }}>
          {fileLines.map((line) => (
            <div key={line.key} style={{
              padding:"1px 0",
              color: line.isComment ? "rgba(148,163,184,0.4)" : line.isDir ? "var(--accent)" : line.isFile ? "var(--text)" : "var(--muted)",
            }}>
              {line.text}
            </div>
          ))}
        </div>
      )}

      {/* ── COMPONENTS ── */}
      {tab === "components" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:8 }}>
          {(bp.componentPlan || []).map((c) => (
            <div key={c.name} style={{ padding:"10px 12px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)" }}>
              <div style={{ fontWeight:600, fontSize:"0.8rem", color:"var(--text)", fontFamily:"var(--font-mono)" }}>{c.name}</div>
              <div style={{ marginTop:3 }}><span className="badge badge-muted" style={{fontSize:"0.6rem"}}>{c.type}</span></div>
              <div style={{ fontSize:"0.72rem", color:"var(--muted)", marginTop:4 }}>{c.purpose}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── DATA MODEL ── */}
      {tab === "data" && (
        <div>
          <div style={{ marginBottom:14, padding:"10px 14px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)" }}>
            <div className="section-label" style={{marginBottom:6}}>Storage Strategy</div>
            <div style={{ fontSize:"0.78rem", color:"var(--muted)" }}>{bp.dataModelPlan?.storageStrategy}</div>
          </div>
          {(bp.dataModelPlan?.entities || []).map((e) => (
            <div key={e.name} style={{ marginBottom:10, padding:"10px 14px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)" }}>
              <div style={{ fontWeight:600, fontSize:"0.82rem", color:"var(--text)", marginBottom:4 }}>{e.name}</div>
              <div style={{ fontSize:"0.72rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>{e.fields?.join(", ")}</div>
              <div style={{ marginTop:4, display:"flex", gap:5 }}>
                <span className="badge badge-muted" style={{fontSize:"0.6rem"}}>{e.source}</span>
                <span className={`badge ${e.storage==="current"?"badge-success":"badge-locked"}`} style={{fontSize:"0.6rem"}}>{e.storage}</span>
              </div>
            </div>
          ))}
          {(bp.dataModelPlan?.relationships || []).length > 0 && (
            <div style={{ padding:"10px 14px", background:"rgba(0,0,0,0.2)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", marginTop:10 }}>
              <div className="section-label" style={{marginBottom:8}}>Relationships</div>
              {bp.dataModelPlan.relationships.map((r, i) => (
                <div key={i} style={{ fontSize:"0.73rem", color:"var(--muted)", fontFamily:"var(--font-mono)", padding:"2px 0" }}>→ {r}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── STATE ── */}
      {tab === "state" && (
        <div>
          {bp.stateManagement && Object.entries(bp.stateManagement).map(([k, v]) => (
            <div key={k} className="setting-row">
              <span className="setting-label" style={{textTransform:"none",fontFamily:"var(--font-mono)",fontSize:"0.75rem"}}>{k}</span>
              <span style={{ fontSize:"0.73rem", color:"var(--muted)", maxWidth:"60%", textAlign:"right", wordBreak:"break-word" }}>{String(v)}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── UX FLOW ── */}
      {tab === "ux" && (
        <div>
          {bp.uxFlowPlan && Object.entries(bp.uxFlowPlan).filter(([k]) => !["flows","screens"].includes(k)).map(([k, v]) => (
            <div key={k} className="setting-row">
              <span className="setting-label" style={{textTransform:"none"}}>{k.replace(/([A-Z])/g," $1").trim()}</span>
              <span style={{ fontSize:"0.73rem", color:"var(--muted)", maxWidth:"60%", textAlign:"right", wordBreak:"break-word" }}>{String(v)}</span>
            </div>
          ))}
          {(bp.uxFlowPlan?.flows || []).length > 0 && (
            <div style={{ marginTop:14 }}>
              <div className="section-label" style={{marginBottom:8}}>User Flows</div>
              {bp.uxFlowPlan.flows.map((f) => (
                <div key={f.name} style={{ marginBottom:10, padding:"8px 12px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)" }}>
                  <div style={{ fontWeight:600, fontSize:"0.78rem", color:"var(--text)", marginBottom:4 }}>{f.name}</div>
                  {(f.steps || []).map((s, i) => <div key={i} style={{ fontSize:"0.72rem", color:"var(--muted)", padding:"2px 0" }}>→ {s}</div>)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── VALIDATION PLAN ── */}
      {tab === "validation" && (
        <div>
          {bp.validationPlan?.approach && (
            <div style={{ marginBottom:14, padding:"10px 14px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)" }}>
              <div className="section-label" style={{marginBottom:4}}>Approach</div>
              <div style={{ fontSize:"0.78rem", color:"var(--muted)" }}>{bp.validationPlan.approach}</div>
            </div>
          )}
          {(bp.validationPlan?.gates || []).length > 0 && (
            <div style={{ marginBottom:14 }}>
              <div className="section-label" style={{marginBottom:8}}>Standard Validation Gates</div>
              {bp.validationPlan.gates.map((g, i) => (
                <div key={i} style={{ fontSize:"0.75rem", color:"var(--muted)", padding:"3px 0" }}>✓ {g}</div>
              ))}
            </div>
          )}
          {bp.validationPlan?.rlsNote && (
            <div style={{ padding:"8px 12px", background:"rgba(124,58,237,0.04)", border:"1px solid rgba(124,58,237,0.15)", borderRadius:"var(--radius)", fontSize:"0.72rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
              {bp.validationPlan.rlsNote}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

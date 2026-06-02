// ============================================================
// AP3X — ArchitectureReportViewer — Run 6
// Full report in clean tabbed sections.
// ============================================================

import { useState } from "react";
import StatusBadge from "../StatusBadge.jsx";
import { ORIGINALITY_NOTICE } from "../../core/originalityGuardEngine.js";
import { generateExecutiveSummary, generateTechnicalSummary, generateBuildReadinessSummary } from "../../core/reportGenerator.js";

const TABS = [
  { id:"overview",    label:"Overview" },
  { id:"modules",     label:"Modules" },
  { id:"data",        label:"Data Model" },
  { id:"backend",     label:"Backend" },
  { id:"security",    label:"Security" },
  { id:"missing",     label:"Missing Systems" },
  { id:"originality", label:"⚖ Originality" },
];

function DR({ label, value, mono }) {
  if (!value && value !== 0) return null;
  return (
    <div className="setting-row">
      <span className="setting-label">{label}</span>
      <span style={{ fontSize:"0.78rem", color:"var(--muted)", maxWidth:"62%", textAlign:"right", wordBreak:"break-word", fontFamily:mono?"var(--font-mono)":undefined }}>{String(value)}</span>
    </div>
  );
}

export default function ArchitectureReportViewer({ report }) {
  const [tab, setTab] = useState("overview");

  if (!report) {
    return (
      <div className="panel" style={{ textAlign:"center", padding:40, color:"var(--muted)", fontSize:"0.85rem" }}>
        No report to display. Generate one first.
      </div>
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="form-tabs" style={{ marginBottom:16 }}>
        {TABS.map((t) => (
          <button key={t.id} className={`tab-btn ${tab===t.id?"tab-btn--active":""}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <div>
          <div style={{ marginBottom:16, padding:"14px 16px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)" }}>
            <div className="section-label" style={{marginBottom:6}}>Executive Summary</div>
            <div style={{ fontSize:"0.82rem", color:"var(--muted)", lineHeight:1.7 }}>{generateExecutiveSummary(report)}</div>
          </div>
          <div style={{ marginBottom:16, padding:"14px 16px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)" }}>
            <div className="section-label" style={{marginBottom:6}}>Technical Summary</div>
            <div style={{ fontSize:"0.82rem", color:"var(--muted)", lineHeight:1.7 }}>{generateTechnicalSummary(report)}</div>
          </div>
          <div style={{ padding:"14px 16px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)" }}>
            <div className="section-label" style={{marginBottom:6}}>Build Readiness</div>
            <div style={{ fontSize:"0.82rem", color:"var(--accent)", lineHeight:1.7, fontWeight:500 }}>{generateBuildReadinessSummary(report)}</div>
          </div>
          <div style={{ marginTop:16 }}>
            <div className="section-label" style={{marginBottom:8}}>Business Rules</div>
            {(report.businessRules || []).map((r) => (
              <div key={r.id} style={{ padding:"8px 12px", marginBottom:6, background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)" }}>
                <div style={{ fontWeight:600, fontSize:"0.8rem", color:"var(--text)" }}>{r.rule}</div>
                <div style={{ fontSize:"0.72rem", color:"var(--muted)", marginTop:2 }}>{r.description}</div>
                <span className="badge badge-muted" style={{fontSize:"0.6rem",marginTop:4}}>{r.origin}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODULES ── */}
      {tab === "modules" && (
        <div>
          <div style={{ marginBottom:14 }}>
            <div className="section-label" style={{marginBottom:8}}>Screens / Pages</div>
            {(report.screens || []).map((s) => (
              <div key={s.id} className="setting-row">
                <div>
                  <div style={{ fontWeight:600, fontSize:"0.8rem", color:"var(--text)" }}>{s.name}</div>
                  <div style={{ fontSize:"0.72rem", color:"var(--muted)" }}>{s.description}</div>
                </div>
                <span className={`badge ${s.type==="primary"?"badge-accent":s.type==="future"?"badge-locked":"badge-muted"}`} style={{fontSize:"0.62rem"}}>{s.type}</span>
              </div>
            ))}
          </div>
          <div className="section-label" style={{marginBottom:8}}>Integrations</div>
          {(report.integrations || []).map((i) => (
            <div key={i.name} className="setting-row">
              <div>
                <div style={{ fontWeight:600, fontSize:"0.8rem", color:"var(--text)" }}>{i.name}</div>
                <div style={{ fontSize:"0.72rem", color:"var(--muted)" }}>{i.note}</div>
              </div>
              <div style={{ display:"flex", gap:5 }}>
                <span className="badge badge-muted" style={{fontSize:"0.6rem"}}>{i.type}</span>
                {i.run && <span className="badge badge-purple" style={{fontSize:"0.6rem"}}>Run {i.run}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── DATA MODEL ── */}
      {tab === "data" && (
        <div>
          {(report.dataEntities || []).map((e) => (
            <div key={e.name} style={{ marginBottom:12, padding:"12px 14px", background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)", borderRadius:"var(--radius)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div style={{ fontWeight:700, fontSize:"0.85rem", color:"var(--text)" }}>{e.name}</div>
                <span className={`badge ${e.source==="detected"?"badge-success":e.source==="run6"?"badge-accent":"badge-muted"}`} style={{fontSize:"0.6rem"}}>{e.source}</span>
              </div>
              <div style={{ fontSize:"0.72rem", color:"var(--muted)", fontFamily:"var(--font-mono)", lineHeight:1.6 }}>
                {(e.fields || []).map((f, i) => (
                  <span key={i}>{f}{i < e.fields.length - 1 ? ", " : ""}</span>
                ))}
              </div>
            </div>
          ))}
          <div style={{ marginTop:10, padding:"8px 12px", background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.68rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
            Auth: {report.authNeeds?.model || "None"} · {report.authNeeds?.currentStatus || "N/A"}
          </div>
        </div>
      )}

      {/* ── BACKEND ── */}
      {tab === "backend" && (
        <div>
          <div className="section-label" style={{marginBottom:8}}>Backend Needs</div>
          {(report.backendNeeds || []).map((n, i) => (
            <div key={i} className="setting-row">
              <div>
                <div style={{ fontWeight:600, fontSize:"0.8rem", color:"var(--text)" }}>{n.need}</div>
                <div style={{ fontSize:"0.72rem", color:"var(--muted)" }}>{n.description}</div>
              </div>
              <span className={`badge ${n.priority==="active"?"badge-success":n.priority==="planned"?"badge-accent":"badge-muted"}`} style={{fontSize:"0.62rem"}}>{n.priority}</span>
            </div>
          ))}
          <div className="section-label" style={{marginBottom:8,marginTop:14}}>Frontend Needs</div>
          {(report.frontendNeeds || []).map((n, i) => (
            <div key={i} className="setting-row">
              <div>
                <div style={{ fontWeight:600, fontSize:"0.8rem", color:"var(--text)" }}>{n.need}</div>
                <div style={{ fontSize:"0.72rem", color:"var(--muted)" }}>{n.description}</div>
              </div>
              <span className={`badge ${n.status==="active"?"badge-success":n.status==="future"?"badge-locked":"badge-muted"}`} style={{fontSize:"0.62rem"}}>{n.status}</span>
            </div>
          ))}
          <div className="section-label" style={{marginBottom:8,marginTop:14}}>Monetisation</div>
          <div className="setting-row">
            <span className="setting-label">Model</span><span style={{fontSize:"0.78rem",color:"var(--muted)"}}>{report.monetisationNeeds?.model || "Not planned"}</span>
          </div>
          {(report.monetisationNeeds?.tiers||[]).length > 0 && (
            <div className="setting-row">
              <span className="setting-label">Tiers</span>
              <span style={{ fontSize:"0.78rem", color:"var(--muted)" }}>{report.monetisationNeeds.tiers.join(", ")}</span>
            </div>
          )}
        </div>
      )}

      {/* ── SECURITY ── */}
      {tab === "security" && (
        <div>
          {(report.securityNeeds || []).map((s, i) => (
            <div key={i} className="setting-row">
              <div>
                <div style={{ fontWeight:600, fontSize:"0.8rem", color:"var(--text)" }}>{s.area}</div>
                <div style={{ fontSize:"0.72rem", color:"var(--muted)" }}>{s.description}</div>
              </div>
              <span className={`badge ${s.status==="active"?"badge-success":s.status==="planned"?"badge-accent":"badge-muted"}`} style={{fontSize:"0.62rem"}}>{s.status}</span>
            </div>
          ))}
          <div style={{ marginTop:14 }}>
            <div className="section-label" style={{marginBottom:8}}>Accessibility</div>
            {(report.accessibilityNeeds || []).map((a, i) => (
              <div key={i} className="setting-row">
                <div>
                  <div style={{ fontWeight:600, fontSize:"0.8rem", color:"var(--text)" }}>{a.area}</div>
                  <div style={{ fontSize:"0.72rem", color:"var(--muted)" }}>{a.description}</div>
                </div>
                <span className={`badge ${a.status==="active"?"badge-success":a.status==="partial"?"badge-warning":"badge-muted"}`} style={{fontSize:"0.62rem"}}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MISSING SYSTEMS ── */}
      {tab === "missing" && (
        <div>
          {(report.missingSystems || []).length === 0 ? (
            <div style={{ textAlign:"center", padding:24, color:"var(--success)", fontSize:"0.85rem" }}>✓ No critical missing systems detected.</div>
          ) : (
            (report.missingSystems || []).map((m, i) => (
              <div key={i} style={{
                padding:"10px 14px", marginBottom:8,
                background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)",
                borderRadius:"var(--radius)",
                borderLeft:`3px solid ${m.severity==="high"?"var(--danger)":m.severity==="medium"?"var(--warning)":"var(--border2)"}`,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <div style={{ fontWeight:600, fontSize:"0.82rem", color:"var(--text)" }}>{m.system}</div>
                  <span className={`badge ${m.severity==="high"?"badge-danger":"badge-warning"}`} style={{fontSize:"0.62rem"}}>{m.severity}</span>
                </div>
                <div style={{ fontSize:"0.73rem", color:"var(--muted)", marginTop:4 }}>{m.note}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── ORIGINALITY ── */}
      {tab === "originality" && (
        <div>
          <div style={{ padding:"14px 16px", marginBottom:16, background:"rgba(124,58,237,0.06)", border:"1.5px solid rgba(124,58,237,0.35)", borderRadius:"var(--radius)" }}>
            <div style={{ fontSize:"0.72rem", fontWeight:700, color:"#c4b5fd", marginBottom:6, textTransform:"uppercase" }}>⚖ Originality &amp; Legal Safety Notice</div>
            <div style={{ fontSize:"0.8rem", color:"var(--text)", lineHeight:1.7 }}>{ORIGINALITY_NOTICE}</div>
          </div>
          <div style={{ marginTop:10, fontSize:"0.68rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
            Report ID: {report.id} · Created: {report.createdAt ? new Date(report.createdAt).toLocaleString() : "—"}
          </div>
        </div>
      )}
    </div>
  );
}

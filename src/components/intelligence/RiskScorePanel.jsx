// ============================================================
// AP3X — RiskScorePanel — Run 6
// ============================================================

import { getAllScores } from "../../utils/architectureScoringUtils.js";
import { formatPercent, getScoreVariant } from "../../utils/blueprintFormatUtils.js";

function ScoreBar({ label, score, desc }) {
  const pct = Math.round(score || 0);
  const color = pct >= 75 ? "var(--success)" : pct >= 50 ? "var(--warning)" : pct >= 25 ? "var(--accent)" : "var(--danger)";
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span style={{ fontSize:"0.8rem", color:"var(--text)", fontWeight:500 }}>{label}</span>
        <span style={{ fontSize:"0.78rem", color, fontWeight:600 }}>{formatPercent(pct)}</span>
      </div>
      <div style={{ height:6, background:"var(--border2)", borderRadius:3, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:3, transition:"width 0.4s" }} />
      </div>
      {desc && <div style={{ fontSize:"0.68rem", color:"var(--muted)", marginTop:3 }}>{desc}</div>}
    </div>
  );
}

export default function RiskScorePanel({ report }) {
  if (!report) {
    return <div className="panel" style={{color:"var(--muted)",fontSize:"0.85rem",padding:20}}>Generate a report to see risk scores.</div>;
  }

  const s = getAllScores(report);
  const riskColor = s.riskLevel.level === "Low" ? "var(--success)" : s.riskLevel.level === "Medium" ? "var(--warning)" : "var(--danger)";

  return (
    <div>
      {/* Overall risk */}
      <div style={{
        padding:"16px 20px", borderRadius:"var(--radius)", marginBottom:20,
        background:`rgba(0,0,0,0.2)`, border:`1px solid ${riskColor}`,
        display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10,
      }}>
        <div>
          <div style={{ fontWeight:700, fontSize:"0.95rem", color:"var(--text)" }}>Overall Risk Level</div>
          <div style={{ fontSize:"0.75rem", color:"var(--muted)", marginTop:2 }}>Based on validation warnings, confidence, and complexity.</div>
        </div>
        <div style={{ fontSize:"1.5rem", fontWeight:800, color:riskColor }}>{s.riskLevel.level}</div>
      </div>

      {/* Score bars */}
      <ScoreBar label="Architecture Completeness" score={s.architectureCompleteness} desc="Modules, screens, entities, journeys, and rules detected." />
      <ScoreBar label="Workflow Clarity"           score={s.workflowClarity}          desc="User journeys, business rules, and screen count clarity." />
      <ScoreBar label="Data Model Clarity"         score={s.dataModelClarity}         desc="Entities, fields, and relationship definitions." />
      <ScoreBar label="Originality Safety"         score={s.originalitySafety}        desc="Originality check pass rate — higher is safer." />
      <ScoreBar label="Build Readiness"            score={s.buildReadiness}           desc={s.buildReadinessLabel} />

      {/* Complexity — inverted display */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
          <span style={{ fontSize:"0.8rem", color:"var(--text)", fontWeight:500 }}>Implementation Complexity</span>
          <span style={{ fontSize:"0.78rem", color:"var(--muted)", fontWeight:600 }}>{formatPercent(s.implementationComplexity)}</span>
        </div>
        <div style={{ height:6, background:"var(--border2)", borderRadius:3, overflow:"hidden" }}>
          <div style={{
            height:"100%", width:`${s.implementationComplexity}%`,
            background: s.implementationComplexity > 70 ? "var(--danger)" : s.implementationComplexity > 40 ? "var(--warning)" : "var(--success)",
            borderRadius:3, transition:"width 0.4s",
          }} />
        </div>
        <div style={{ fontSize:"0.68rem", color:"var(--muted)", marginTop:3 }}>
          Higher = more complex to build. Plan more implementation runs accordingly.
        </div>
      </div>

      <div style={{ marginTop:12, padding:"8px 12px", background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.68rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
        All scores calculated locally from extracted architecture data. No external calls.
      </div>
    </div>
  );
}

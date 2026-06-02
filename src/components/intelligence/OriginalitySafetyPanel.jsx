// ============================================================
// AP3X — OriginalitySafetyPanel — Run 6
// ============================================================

import { ORIGINALITY_NOTICE } from "../../core/originalityGuardEngine.js";

export default function OriginalitySafetyPanel({ report }) {
  const check = report?.originalityCheck;

  return (
    <div>
      {/* Mandatory legal notice — ALWAYS shown */}
      <div style={{
        padding:"16px 18px", marginBottom:20,
        background:"rgba(124,58,237,0.06)", border:"1.5px solid rgba(124,58,237,0.35)",
        borderRadius:"var(--radius)",
      }}>
        <div style={{ fontSize:"0.72rem", fontWeight:700, color:"#c4b5fd", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.05em" }}>
          ⚖ Originality &amp; Legal Safety Notice
        </div>
        <div style={{ fontSize:"0.8rem", color:"var(--text)", lineHeight:1.7 }}>
          {ORIGINALITY_NOTICE}
        </div>
      </div>

      {/* Score summary */}
      {check ? (
        <>
          <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:16 }}>
            <div style={{ fontSize:"2rem", fontWeight:800, color: check.passed ? "var(--success)" : "var(--warning)" }}>
              {check.score}%
            </div>
            <div>
              <div style={{ fontWeight:600, color: check.passed ? "var(--success)" : "var(--warning)" }}>
                {check.passed ? "All originality checks passed" : "Some checks need attention"}
              </div>
              <div style={{ fontSize:"0.72rem", color:"var(--muted)" }}>
                {check.passedCount}/{check.totalCount} checks passed
              </div>
            </div>
          </div>

          {/* Individual checks */}
          <div>
            {(check.checks || []).map((c) => (
              <div key={c.id} style={{
                display:"flex", gap:12, alignItems:"flex-start",
                padding:"10px 14px", marginBottom:6,
                background:"rgba(255,255,255,0.02)", border:"1px solid var(--border2)",
                borderRadius:"var(--radius)",
                borderLeft:`3px solid ${c.passed ? "var(--success)" : "var(--warning)"}`,
              }}>
                <div style={{ fontSize:"1rem", color: c.passed ? "var(--success)" : "var(--warning)", flexShrink:0, marginTop:1 }}>
                  {c.passed ? "✓" : "⚠"}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:"0.8rem", color:"var(--text)" }}>{c.title}</div>
                  <div style={{ fontSize:"0.72rem", color:"var(--muted)", marginTop:2 }}>{c.description}</div>
                </div>
                <span className={`badge ${c.passed ? "badge-success" : "badge-warning"}`} style={{fontSize:"0.62rem",flexShrink:0}}>
                  {c.passed ? "PASS" : "WARN"}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ color:"var(--muted)", fontSize:"0.82rem" }}>
          Generate a report to see originality checks.
        </div>
      )}

      <div style={{ marginTop:16, padding:"8px 12px", background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.68rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
        These checks detect risks in the extracted data. They do not guarantee legal compliance.
        Always consult qualified legal advice before using any extracted architecture commercially.
      </div>
    </div>
  );
}

// ============================================================
// AP3X — OriginalityLockPanel — Run 7 (always visible)
// ============================================================
import { ORIGINALITY_SAFETY_NOTICE } from "../../core/constants.js";
import { detectUnsafeCloneTerms }    from "../../core/safePatternTransformer.js";

export default function OriginalityLockPanel({ blueprint, strictMode = true }) {
  const promptText = blueprint?.generatedBuildPrompt || "";
  const allText    = JSON.stringify(blueprint || {});
  const detected   = detectUnsafeCloneTerms(allText);

  return (
    <div style={{ marginBottom:20 }}>
      {/* Mandatory notice */}
      <div style={{ padding:"14px 18px", background:"rgba(124,58,237,0.07)", border:"1.5px solid rgba(124,58,237,0.4)", borderRadius:"var(--radius)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, flexWrap:"wrap", gap:6 }}>
          <div style={{ fontSize:"0.72rem", fontWeight:700, color:"#c4b5fd", textTransform:"uppercase", letterSpacing:"0.06em" }}>
            🔒 Originality Lock — Always Active
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <span className={`badge ${strictMode ? "badge-success" : "badge-warning"}`} style={{fontSize:"0.62rem"}}>
              {strictMode ? "STRICT MODE ON" : "STRICT MODE OFF"}
            </span>
            <span className={`badge ${detected.length === 0 ? "badge-success" : "badge-danger"}`} style={{fontSize:"0.62rem"}}>
              {detected.length === 0 ? "CLEAN" : `${detected.length} ISSUE(S)`}
            </span>
          </div>
        </div>
        <div style={{ fontSize:"0.78rem", color:"var(--text)", lineHeight:1.7 }}>
          {ORIGINALITY_SAFETY_NOTICE}
        </div>
      </div>

      {/* Blocked terms */}
      {detected.length > 0 && (
        <div style={{ marginTop:10, padding:"10px 14px", background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:"var(--radius)" }} role="alert">
          <div style={{ fontWeight:600, fontSize:"0.78rem", color:"var(--danger)", marginBottom:6 }}>
            ⛔ Unsafe clone language detected and replaced in output:
          </div>
          {detected.map((t, i) => (
            <div key={i} style={{ fontSize:"0.72rem", color:"var(--muted)", fontFamily:"var(--font-mono)", padding:"2px 0" }}>
              "{t}" → replaced with safe alternative
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

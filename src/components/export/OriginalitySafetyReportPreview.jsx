// ============================================================
// AP3X — OriginalitySafetyReportPreview — Run 8 (always visible)
// ============================================================
import { EXPORT_SAFETY_NOTICE } from "../../core/constants.js";

export default function OriginalitySafetyReportPreview({ exportPack }) {
  const osr = exportPack?.originalitySafetyReport || { status: "SAFE", score: 100, passed: true };
  return (
    <div>
      <div style={{ padding: "14px 18px", background: "rgba(124,58,237,0.07)", border: "1.5px solid rgba(124,58,237,0.4)", borderRadius: "var(--radius)", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#c4b5fd", textTransform: "uppercase" }}>⚖ Originality &amp; Legal Safety Report</div>
          <div style={{ display: "flex", gap: 6 }}>
            <span className={`badge ${osr.passed !== false ? "badge-success" : "badge-danger"}`} style={{ fontSize: "0.62rem" }}>{osr.status || "SAFE"}</span>
            <span className="badge badge-muted" style={{ fontSize: "0.62rem" }}>Score: {osr.score || 100}/100</span>
          </div>
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text)", lineHeight: 1.7 }}>{EXPORT_SAFETY_NOTICE}</div>
      </div>
      {osr.mustUse && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="panel">
            <div className="section-label" style={{ marginBottom: 6, color: "var(--success)" }}>✓ Must Use</div>
            {(osr.mustUse || []).map((i, idx) => <div key={idx} style={{ fontSize: "0.73rem", color: "var(--muted)", padding: "2px 0" }}>• {i}</div>)}
          </div>
          <div className="panel">
            <div className="section-label" style={{ marginBottom: 6, color: "var(--danger)" }}>⛔ Must Not Use</div>
            {(osr.mustNotUse || []).map((i, idx) => <div key={idx} style={{ fontSize: "0.73rem", color: "var(--muted)", padding: "2px 0" }}>• {i}</div>)}
          </div>
        </div>
      )}
      {osr.legalNote && (
        <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border2)", borderRadius: "var(--radius)", fontSize: "0.68rem", color: "var(--muted)", fontStyle: "italic" }}>
          {osr.legalNote}
        </div>
      )}
    </div>
  );
}

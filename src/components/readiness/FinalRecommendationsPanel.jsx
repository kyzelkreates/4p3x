// AP3X — FinalRecommendationsPanel — Run 9
import { generateFinalRecommendations } from "../../core/productReadinessEngine.js";
import { generateKnownLimitations }     from "../../utils/issueLogUtils.js";

export default function FinalRecommendationsPanel({ testRun }) {
  if (!testRun) return <div className="panel" style={{ color:"var(--muted)", padding:20 }}>Run the product test to see recommendations.</div>;
  const recs   = generateFinalRecommendations(testRun);
  const limits = generateKnownLimitations(testRun.issueLog || []);

  return (
    <div>
      {/* Status banner */}
      <div style={{ padding:"16px 20px", marginBottom:16, borderRadius:"var(--radius)", border:`2px solid ${recs.isReadyForFinalQA?"var(--success)":"var(--warning)"}`, background:`rgba(${recs.isReadyForFinalQA?"0,255,136":"251,191,36"},0.05)` }}>
        <div style={{ fontWeight:800, fontSize:"1rem", color:recs.isReadyForFinalQA?"var(--success)":"var(--warning)", marginBottom:4 }}>
          {recs.isReadyForDeployReview ? "✓ READY FOR DEPLOYMENT REVIEW" : recs.isReadyForFinalQA ? "✓ READY FOR FINAL QA" : "⚠ NEEDS ATTENTION BEFORE FINAL QA"}
        </div>
        <div style={{ fontSize:"0.78rem", color:"var(--muted)" }}>{recs.summary}</div>
        <div style={{ marginTop:6, display:"flex", gap:6 }}>
          {recs.isSafeToDemo && <span className="badge badge-success" style={{ fontSize:"0.65rem" }}>✓ Safe to Demo</span>}
          {recs.criticalBlockers.length === 0 && <span className="badge badge-success" style={{ fontSize:"0.65rem" }}>✓ No Critical Blockers</span>}
        </div>
      </div>

      {/* Run 10 recommendations */}
      <div className="panel" style={{ marginBottom:14 }}>
        <div className="section-label" style={{ marginBottom:8 }}>Run 10 Recommendations</div>
        {testRun.recommendations?.filter((r) => r.priority === "low").map((r, i) => (
          <div key={i} style={{ fontSize:"0.73rem", color:"var(--muted)", padding:"3px 0" }}>→ {r.text.replace("Run 10: ","")}</div>
        ))}
      </div>

      {/* Known limitations */}
      <div className="panel">
        <div className="section-label" style={{ marginBottom:8 }}>Known Limitations (Runs 1–9)</div>
        {limits.map((l, i) => (
          <div key={i} style={{ fontSize:"0.73rem", color:"var(--muted)", padding:"3px 0" }}>• {l}</div>
        ))}
      </div>
    </div>
  );
}

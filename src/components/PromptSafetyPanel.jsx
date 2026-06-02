// ============================================================
// AP3X — PromptSafetyPanel Component
// /src/components/PromptSafetyPanel.jsx — Run 3
// LOCAL analysis only. No live AI.
// ============================================================

import { SAFETY_RULES } from "../core/constants.js";

function ScoreBar({ score }) {
  const color = score >= 80 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--danger)";
  const label = score >= 80 ? "Strong prompt" : score >= 50 ? "Needs improvement" : "Unsafe — review required";
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color }}>Safety Score</span>
        <span style={{ fontSize: "1rem", fontWeight: 700, color, fontFamily: "var(--font-mono)" }}>
          {score}/100
        </span>
      </div>
      <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden", marginBottom: 6 }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.4s" }} />
      </div>
      <div style={{ fontSize: "0.75rem", color, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function RuleRow({ label, active, score }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "7px 0", borderBottom: "1px solid var(--border2)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "0.9rem" }}>{active ? "✓" : "○"}</span>
        <span style={{ fontSize: "0.8rem", color: active ? "var(--text)" : "var(--muted)" }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>+{score}pts</span>
        <span className={`badge ${active ? "badge-success" : "badge-muted"}`} style={{ fontSize: "0.62rem" }}>
          {active ? "Found" : "Missing"}
        </span>
      </div>
    </div>
  );
}

export default function PromptSafetyPanel({ safety = {}, compact = false }) {
  const score    = safety.safetyScore ?? 0;
  const warnings = safety.warnings    || [];
  const secretDetected = safety.secretDetected ?? false;

  if (compact) {
    const color = score >= 80 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--danger)";
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 999 }} />
        </div>
        <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color }}>{score}/100</span>
      </div>
    );
  }

  return (
    <div>
      <ScoreBar score={score} />

      {secretDetected && (
        <div className="alert alert-danger" style={{ marginBottom: 14 }}>
          ⚠ Secret-like content detected in this prompt. Review before use. (-30pts applied)
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <div className="section-label" style={{ marginBottom: 10 }}>Rule Detection</div>
        {SAFETY_RULES.map((rule) => (
          <RuleRow
            key={rule.key}
            label={rule.label}
            active={!!safety[rule.key]}
            score={rule.score}
          />
        ))}
      </div>

      {warnings.length > 0 && (
        <div>
          <div className="section-label" style={{ marginBottom: 8 }}>Recommendations</div>
          {warnings
            .filter((w) => !w.startsWith("Secret-like"))
            .map((w, i) => (
              <div key={i} style={{
                fontSize: "0.75rem", color: "var(--muted)", padding: "5px 0",
                borderBottom: "1px solid var(--border2)",
              }}>
                → {w}
              </div>
            ))}
        </div>
      )}

      <div style={{
        marginTop: 14, padding: "8px 12px",
        background: "rgba(0,229,255,0.03)", border: "1px solid var(--border2)",
        borderRadius: "var(--radius)", fontSize: "0.68rem", color: "var(--muted)",
        fontFamily: "var(--font-mono)",
      }}>
        Analysis is local-only. No AI calls made. Content not executed.
      </div>
    </div>
  );
}

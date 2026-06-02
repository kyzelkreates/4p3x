// ============================================================
// AP3X — Agents Page (Agent Board)
// /src/pages/Agents.jsx
// ALL agents are locked in Run 1. No live AI calls.
// ============================================================

import { AGENTS } from "../core/constants.js";
import StatusBadge from "../components/StatusBadge.jsx";

function AgentCard({ agent }) {
  return (
    <div className="agent-card">
      <div className="agent-icon" aria-hidden="true">{agent.icon}</div>
      <div>
        <div className="agent-label">{agent.label}</div>
        <div style={{ marginTop: 6 }}>
          <StatusBadge status="locked" label="Locked" />
        </div>
      </div>
      <div className="agent-lock-msg">
        Locked until Run {agent.lockRun} — no live AI calls enabled.
      </div>
      <div style={{
        marginTop: "auto",
        padding: "6px 10px",
        background: "rgba(124,58,237,0.06)",
        border: "1px solid rgba(124,58,237,0.12)",
        borderRadius: "var(--radius)",
        fontSize: "0.68rem",
        color: "var(--muted)",
        fontFamily: "var(--font-mono)",
      }}>
        Reserved for future run
      </div>
    </div>
  );
}

export default function Agents({ state }) {
  return (
    <div>
      {/* ── Header ───────────────────────────────────────── */}
      <div className="page-header">
        <div className="page-title">Agent Board</div>
        <div className="page-subtitle">
          AI agent control plane — all agents locked in Run 1. No external AI calls are made.
        </div>
      </div>

      {/* ── Lock Banner ──────────────────────────────────── */}
      <div style={{
        marginBottom: 24,
        padding: "12px 18px",
        background: "rgba(124,58,237,0.06)",
        border: "1px solid rgba(124,58,237,0.2)",
        borderRadius: "var(--radius-lg)",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <span style={{ fontSize: "1.2rem" }}>🔒</span>
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>
            Agent Board — Run 1 Foundation Mode
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 2 }}>
            All agents are locked placeholders in Run 1. No OpenAI, Groq, or external AI calls are
            executed. Agent activation begins in Run 2.
          </div>
        </div>
      </div>

      {/* ── Agents Grid ──────────────────────────────────── */}
      <div className="grid-agents">
        {AGENTS.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* ── Settings echo ────────────────────────────────── */}
      <div style={{
        marginTop: 24,
        padding: "10px 14px",
        background: "rgba(0,229,255,0.03)",
        border: "1px solid var(--border2)",
        borderRadius: "var(--radius)",
        fontSize: "0.72rem",
        color: "var(--muted)",
        fontFamily: "var(--font-mono)",
      }}>
        settings.allowExternalAI = false · settings.allowBackend = false · Run 1
      </div>
    </div>
  );
}

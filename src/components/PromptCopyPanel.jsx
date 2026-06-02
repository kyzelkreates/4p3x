// ============================================================
// AP3X — PromptCopyPanel Component
// /src/components/PromptCopyPanel.jsx — Run 3
// ============================================================

import { useState } from "react";
import { copyPromptToClipboard } from "../core/promptUtils.js";
import { copyPromptById } from "../core/storage.js";

export default function PromptCopyPanel({ prompt, onClose }) {
  const [status, setStatus] = useState(null); // null | "success" | "fallback" | "error"

  async function doCopy(text, label) {
    setStatus(null);
    const result = await copyPromptToClipboard(text);
    if (result.success) {
      // Update usage stats through SSOT
      copyPromptById(prompt.id);
      setStatus({ type: result.fallback ? "fallback" : "success", label });
    } else {
      setStatus({ type: "error", label });
    }
    setTimeout(() => setStatus(null), 3000);
  }

  const fullText      = `${prompt.title}\n\n${prompt.content}`;
  const contentOnly   = prompt.content || "";
  const markdownBlock = `\`\`\`\n${prompt.content}\n\`\`\``;

  return (
    <div className="json-panel">
      <div className="json-panel-header">
        <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--accent)" }}>
          ◎ Copy Prompt
        </div>
        {onClose && (
          <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close copy panel">✕</button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          className="btn btn-primary"
          onClick={() => doCopy(fullText, "Title + Content")}
          aria-label="Copy title and full prompt content"
        >
          ⊕ Copy Title + Content
        </button>

        <button
          className="btn btn-ghost"
          onClick={() => doCopy(contentOnly, "Prompt Content")}
          aria-label="Copy prompt content only"
        >
          ◎ Copy Content Only
        </button>

        <button
          className="btn btn-ghost"
          onClick={() => doCopy(markdownBlock, "Markdown Block")}
          aria-label="Copy as markdown code block"
        >
          ⌥ Copy as Markdown Block
        </button>
      </div>

      {status && (
        <div
          className={`alert ${status.type === "error" ? "alert-danger" : "alert-success"}`}
          style={{ marginTop: 14 }}
          role="status"
        >
          {status.type === "success"  && `✓ Copied "${status.label}" to clipboard.`}
          {status.type === "fallback" && `✓ Copied "${status.label}" — clipboard API unavailable, used fallback.`}
          {status.type === "error"    && `✕ Clipboard unavailable — please select and copy manually.`}
        </div>
      )}

      <div style={{
        marginTop: 14, fontSize: "0.68rem", color: "var(--muted)",
        fontFamily: "var(--font-mono)", borderTop: "1px solid var(--border2)", paddingTop: 10,
      }}>
        Times copied: {prompt.usage?.timesCopied ?? 0} ·
        Last copied: {prompt.usage?.lastCopiedAt
          ? new Date(prompt.usage.lastCopiedAt).toLocaleString() : "Never"}
      </div>
    </div>
  );
}

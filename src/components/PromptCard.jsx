// ============================================================
// AP3X — PromptCard Component
// /src/components/PromptCard.jsx — Run 3
// ============================================================

import StatusBadge from "./StatusBadge.jsx";
import PromptSafetyPanel from "./PromptSafetyPanel.jsx";
import { PROMPT_TYPES, PROMPT_CATEGORIES, PROMPT_PRIORITIES } from "../core/constants.js";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function getLabel(arr, value) {
  const found = arr.find((x) => x.value === value);
  return found ? found.label : value;
}

function getPriorityClass(priority) {
  const map = { low: "badge-muted", medium: "badge-accent", high: "badge-warning", urgent: "badge-danger" };
  return map[priority] || "badge-muted";
}

export default function PromptCard({
  prompt,
  linkedProjectName,
  onView, onEdit, onCopy, onDuplicate, onArchive, onRestore, onDelete,
}) {
  const archived  = prompt.flags?.isArchived;
  const isMaster  = prompt.flags?.isMasterPrompt || prompt.status === "master";
  const safety    = prompt.safety?.safetyScore ?? 0;
  const lowSafety = safety < 50;

  const borderColor = archived   ? "rgba(124,58,237,0.15)"
    : isMaster   ? "rgba(0,229,255,0.2)"
    : lowSafety  ? "rgba(245,158,11,0.2)"
    : "var(--border2)";

  return (
    <div className="item-card" style={{ borderColor, opacity: archived ? 0.6 : 1, position: "relative" }}>
      {/* Badges row */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
        {archived  && <span className="badge badge-locked" style={{ fontSize: "0.62rem" }}>Archived</span>}
        {isMaster  && <span className="badge badge-purple" style={{ fontSize: "0.62rem" }}>⬡ Master</span>}
        {prompt.flags?.isPinned     && <span className="badge badge-accent" style={{ fontSize: "0.62rem" }}>📌 Pinned</span>}
        {prompt.flags?.isFavourite  && <span className="badge badge-warning" style={{ fontSize: "0.62rem" }}>★ Fav</span>}
      </div>

      {/* Header */}
      <div className="item-card-header">
        <div style={{ flex: 1 }}>
          <div className="item-card-title">{prompt.title}</div>
          <div style={{ display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
            <span className="badge badge-muted" style={{ fontSize: "0.62rem" }}>{getLabel(PROMPT_TYPES, prompt.type)}</span>
            <span className="badge badge-muted" style={{ fontSize: "0.62rem" }}>{getLabel(PROMPT_CATEGORIES, prompt.category)}</span>
            <span className={`badge ${getPriorityClass(prompt.priority)}`} style={{ fontSize: "0.62rem" }}>{prompt.priority}</span>
          </div>
        </div>
        <StatusBadge status={prompt.status} />
      </div>

      {/* Description */}
      {prompt.description && (
        <div className="item-card-desc" style={{
          WebkitLineClamp: 2, overflow: "hidden",
          display: "-webkit-box", WebkitBoxOrient: "vertical",
        }}>
          {prompt.description}
        </div>
      )}

      {/* Linked project */}
      {linkedProjectName && (
        <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
          ◈ {linkedProjectName}
        </div>
      )}

      {/* Safety */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>Safety</span>
        <PromptSafetyPanel safety={prompt.safety} compact />
        {lowSafety && !archived && (
          <span className="badge badge-warning" style={{ fontSize: "0.6rem" }}>⚠ Low</span>
        )}
      </div>

      {/* Tags */}
      {prompt.tags?.length > 0 && (
        <div className="tags">
          {prompt.tags.slice(0, 4).map((t) => <span key={t} className="tag">{t}</span>)}
          {prompt.tags.length > 4 && <span className="tag">+{prompt.tags.length - 4}</span>}
        </div>
      )}

      {/* Meta row */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
          v{prompt.versioning?.currentVersion ?? 1}
        </span>
        <span style={{ fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
          ⊕ {prompt.usage?.timesCopied ?? 0}
        </span>
        <span className="item-card-date" style={{ fontSize: "0.68rem" }}>
          {fmtDate(prompt.updatedAt)}
        </span>
      </div>

      {/* Actions */}
      <div style={{
        display: "flex", gap: 5, flexWrap: "wrap",
        marginTop: 4, paddingTop: 10, borderTop: "1px solid var(--border2)",
      }}>
        <button className="btn btn-ghost btn-sm" onClick={() => onView?.(prompt)} aria-label="View prompt">◎ View</button>
        {!archived && (
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => onEdit?.(prompt)} aria-label="Edit prompt">✎ Edit</button>
            <button className="btn btn-primary btn-sm" onClick={() => onCopy?.(prompt)} aria-label="Copy prompt">⊕ Copy</button>
          </>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => onDuplicate?.(prompt)} aria-label="Duplicate prompt">⊕ Dupe</button>
        {archived
          ? <button className="btn btn-ghost btn-sm" onClick={() => onRestore?.(prompt)} aria-label="Restore">↩</button>
          : <button className="btn btn-ghost btn-sm" onClick={() => onArchive?.(prompt)} aria-label="Archive">↓</button>
        }
        <button className="btn btn-danger btn-sm" onClick={() => onDelete?.(prompt)} aria-label="Delete prompt">✕</button>
      </div>
    </div>
  );
}

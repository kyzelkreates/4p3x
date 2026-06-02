// ============================================================
// AP3X — ProjectCard Component
// /src/components/ProjectCard.jsx — Run 2
// ============================================================

import StatusBadge from "./StatusBadge.jsx";
import { PROJECT_TYPES, PROJECT_PRIORITIES } from "../core/constants.js";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });
}

function getPriorityConfig(priority) {
  const map = { low: "badge-muted", medium: "badge-accent", high: "badge-warning", urgent: "badge-danger" };
  return map[priority] || "badge-muted";
}

function getTypeLabel(type) {
  const found = PROJECT_TYPES.find((t) => t.value === type);
  return found ? found.label : type;
}

function ProgressBar({ value, variant = "" }) {
  const pct = Math.min(100, Math.max(0, Number(value) || 0));
  const color = pct >= 80 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--muted)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        flex: 1, height: 4, background: "rgba(255,255,255,0.06)",
        borderRadius: 999, overflow: "hidden",
      }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.3s" }} />
      </div>
      <span style={{ fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-mono)", minWidth: 28, textAlign: "right" }}>
        {pct}%
      </span>
    </div>
  );
}

export default function ProjectCard({
  linkedErrors,
  project,
  onView,
  onEdit,
  onDuplicate,
  onArchive,
  onRestore,
  onDelete,
}) {
  const archived  = project.flags?.isArchived;
  const isBroken  = project.status === "broken" || project.status === "needs_rebuild";
  const isWorking = project.status === "working" || project.status === "deployed";

  const borderColor = archived
    ? "rgba(124,58,237,0.15)"
    : isBroken
    ? "rgba(239,68,68,0.2)"
    : isWorking
    ? "rgba(34,197,94,0.15)"
    : "var(--border2)";

  const hasLinks = Object.values(project.links || {}).some((v) => v && v.trim() !== "");

  return (
    <div
      className="item-card"
      style={{
        borderColor,
        opacity: archived ? 0.6 : 1,
        position: "relative",
      }}
    >
      {/* Archived overlay badge */}
      {archived && (
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <span className="badge badge-locked">Archived</span>
        </div>
      )}

      {/* Header */}
      <div className="item-card-header" style={{ paddingRight: archived ? 80 : 0 }}>
        <div style={{ flex: 1 }}>
          <div className="item-card-title">{project.name}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
            <span className="badge badge-muted" style={{ fontSize: "0.62rem" }}>
              {getTypeLabel(project.type)}
            </span>
            <span className={`badge ${getPriorityConfig(project.priority)}`} style={{ fontSize: "0.62rem" }}>
              {project.priority}
            </span>
            {project.stage && (
              <span className="badge badge-muted" style={{ fontSize: "0.62rem" }}>
                {project.stage.replace(/_/g, " ")}
              </span>
            )}
          </div>
        </div>
        {!archived && <StatusBadge status={project.status} />}
      </div>

      {/* Description */}
      {project.description && (
        <div className="item-card-desc" style={{ WebkitLineClamp: 2, overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical" }}>
          {project.description}
        </div>
      )}

      {/* Progress */}
      <div>
        <div style={{ fontSize: "0.66rem", color: "var(--muted)", marginBottom: 4, fontFamily: "var(--font-mono)" }}>
          Completion
        </div>
        <ProgressBar value={project.metrics?.completionPercent} />
      </div>

      {/* Tags */}
      {project.tags?.length > 0 && (
        <div className="tags">
          {project.tags.slice(0, 5).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
          {project.tags.length > 5 && (
            <span className="tag">+{project.tags.length - 5}</span>
          )}
        </div>
      )}

      {/* Links */}
      {hasLinks && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {project.links?.liveUrl && (
            <a href={project.links.liveUrl} target="_blank" rel="noopener noreferrer"
              className="badge badge-success" style={{ fontSize: "0.62rem", textDecoration: "none" }}
              onClick={(e) => e.stopPropagation()}>
              ↗ Live
            </a>
          )}
          {project.links?.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer"
              className="badge badge-muted" style={{ fontSize: "0.62rem", textDecoration: "none" }}
              onClick={(e) => e.stopPropagation()}>
              ⌥ GitHub
            </a>
          )}
          {project.links?.vercel && (
            <a href={project.links.vercel} target="_blank" rel="noopener noreferrer"
              className="badge badge-muted" style={{ fontSize: "0.62rem", textDecoration: "none" }}
              onClick={(e) => e.stopPropagation()}>
              ▲ Vercel
            </a>
          )}
        </div>
      )}

      {/* Date */}
      <div className="item-card-date">Updated {fmtDate(project.updatedAt)}</div>

      {/* Linked errors */}
      {(() => {
        const open = (linkedErrors||[]).filter((e) => !e.flags?.isArchived && e.status!=="fixed" && e.status!=="validated" && e.status!=="ignored");
        const crit = open.filter((e) => e.severity==="critical");
        const bloc = open.filter((e) => e.classification?.isDeploymentBlocking);
        if (open.length === 0) return null;
        return (
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {crit.length>0 && <span className="badge badge-critical" style={{fontSize:"0.6rem"}}>⛔ {crit.length} Critical</span>}
            {bloc.length>0 && <span className="badge badge-critical" style={{fontSize:"0.6rem"}}>⛔ {bloc.length} Blocker{bloc.length>1?"s":""}</span>}
            {open.length>0 && <span className="badge badge-danger"   style={{fontSize:"0.6rem"}}>⚠ {open.length} Open Error{open.length>1?"s":""}</span>}
          </div>
        );
      })()}

      {/* Actions */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4, paddingTop: 10, borderTop: "1px solid var(--border2)" }}>
        <button className="btn btn-ghost btn-sm" onClick={() => onView?.(project)} aria-label="View project">
          ◎ View
        </button>
        {!archived && (
          <button className="btn btn-ghost btn-sm" onClick={() => onEdit?.(project)} aria-label="Edit project">
            ✎ Edit
          </button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => onDuplicate?.(project)} aria-label="Duplicate project">
          ⊕ Dupe
        </button>
        {archived ? (
          <button className="btn btn-ghost btn-sm" onClick={() => onRestore?.(project)} aria-label="Restore project">
            ↩ Restore
          </button>
        ) : (
          <button className="btn btn-ghost btn-sm" onClick={() => onArchive?.(project)} aria-label="Archive project">
            ↓ Archive
          </button>
        )}
        <button className="btn btn-danger btn-sm" onClick={() => onDelete?.(project)} aria-label="Delete project">
          ✕
        </button>
      </div>
    </div>
  );
}

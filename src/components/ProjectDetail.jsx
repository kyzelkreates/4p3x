// ============================================================
// AP3X — ProjectDetail Component
// /src/components/ProjectDetail.jsx — Run 2
// ============================================================

import { useState } from "react";
import StatusBadge from "./StatusBadge.jsx";
import JsonImportExportPanel from "./JsonImportExportPanel.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import ProjectHealthPanel from "./ProjectHealthPanel.jsx";
import { PROJECT_TYPES, PROJECT_PRIORITIES } from "../core/constants.js";
import {
  archiveProjectById,
  restoreProjectById,
  deleteProject,
  updateProject,
  duplicateProject,
} from "../core/storage.js";
import { markProjectWorking, markProjectBroken } from "../core/projectUtils.js";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function DetailSection({ title, children }) {
  return (
    <div className="detail-section">
      <div className="section-label">{title}</div>
      <div className="panel">{children}</div>
    </div>
  );
}

function MetricBar({ label, value }) {
  const pct = Math.min(100, Math.max(0, Number(value) || 0));
  const color =
    pct >= 80 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--muted)";
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{label}</span>
        <span style={{ fontSize: "0.78rem", fontFamily: "var(--font-mono)", color }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}

function LinkRow({ label, url }) {
  if (!url || url.trim() === "") return null;
  return (
    <div className="setting-row">
      <span className="setting-label">{label}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="badge badge-accent"
        style={{ fontSize: "0.7rem", textDecoration: "none" }}
      >
        ↗ Open
      </a>
    </div>
  );
}

function FlagBadge({ label, active }) {
  return (
    <span className={`badge ${active ? "badge-success" : "badge-muted"}`} style={{ fontSize: "0.68rem" }}>
      {active ? "✓" : "—"} {label}
    </span>
  );
}

function getTypeLabel(type) {
  const found = PROJECT_TYPES.find((t) => t.value === type);
  return found ? found.label : type;
}

function getPriorityLabel(p) {
  const found = PROJECT_PRIORITIES.find((x) => x.value === p);
  return found ? found.label : p;
}

export default function ProjectDetail({
  project,
  allProjects,
  onEdit,
  onBack,
  onDeleted,
}) {
  const [showJson,       setShowJson]       = useState(false);
  const [confirmDelete,  setConfirmDelete]  = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);

  const archived = project.flags?.isArchived;

  function handleMarkWorking() {
    const updated = markProjectWorking(project);
    updateProject(project.id, updated);
  }

  function handleMarkBroken() {
    const updated = markProjectBroken(project);
    updateProject(project.id, updated);
  }

  function handleArchive()  { setConfirmArchive(true); }
  function handleRestore()  { restoreProjectById(project.id); }

  function handleDuplicate() {
    duplicateProject(project.id);
    onBack?.();
  }

  function handleDelete() { setConfirmDelete(true); }

  return (
    <div>
      {/* ── Back ── */}
      <div style={{ marginBottom: 20 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          ← Back to Registry
        </button>
      </div>

      {/* ── Header ── */}
      <div className="hero" style={{ marginBottom: 20 }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <div className="hero-title" style={{ fontSize: "1.2rem" }}>{project.name}</div>
            {project.slug && (
              <div className="mono text-muted" style={{ fontSize: "0.7rem", marginTop: 2 }}>
                {project.slug}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <StatusBadge status={project.status} />
            {archived && <StatusBadge status="locked" label="Archived" />}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          <span className="badge badge-muted">{getTypeLabel(project.type)}</span>
          <span className="badge badge-muted">{getPriorityLabel(project.priority)}</span>
          <span className="badge badge-muted">{(project.stage || "").replace(/_/g, " ")}</span>
          {project.category && <span className="badge badge-muted">{project.category}</span>}
          {project.sector   && <span className="badge badge-muted">{project.sector}</span>}
        </div>

        {project.description && (
          <p style={{ marginTop: 12, fontSize: "0.85rem", color: "var(--muted)", maxWidth: 600 }}>
            {project.description}
          </p>
        )}
      </div>

      {/* ── Action Bar ── */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {!archived && (
          <button className="btn btn-primary btn-sm" onClick={() => onEdit?.(project)}>
            ✎ Edit
          </button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={handleDuplicate}>
          ⊕ Duplicate
        </button>
        {!archived && (
          <>
            <button className="btn btn-ghost btn-sm" onClick={handleMarkWorking}>
              ✓ Mark Working
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleMarkBroken}>
              ✕ Mark Broken
            </button>
          </>
        )}
        {archived ? (
          <button className="btn btn-ghost btn-sm" onClick={handleRestore}>
            ↩ Restore
          </button>
        ) : (
          <button className="btn btn-ghost btn-sm" onClick={handleArchive}>
            ↓ Archive
          </button>
        )}
        <button className="btn btn-ghost btn-sm" onClick={() => setShowJson((v) => !v)}>
          {showJson ? "↑ Hide JSON" : "↓ Export JSON"}
        </button>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>
          ✕ Delete
        </button>
      </div>

      {/* ── JSON Panel ── */}
      {showJson && (
        <div style={{ marginBottom: 24 }}>
          <JsonImportExportPanel
            project={project}
            allProjects={allProjects}
            onClose={() => setShowJson(false)}
          />
        </div>
      )}

      {/* ── Metrics ── */}
      <DetailSection title="Metrics">
        <MetricBar label="Completion"            value={project.metrics?.completionPercent} />
        <MetricBar label="Technical Health"      value={project.metrics?.technicalHealth} />
        <MetricBar label="Investor Readiness"    value={project.metrics?.investorReadiness} />
        <MetricBar label="Deployment Readiness"  value={project.metrics?.deploymentReadiness} />
      </DetailSection>

      {/* ── Links ── */}
      {Object.values(project.links || {}).some((v) => v) && (
        <DetailSection title="Links">
          <LinkRow label="GitHub"   url={project.links?.github} />
          <LinkRow label="Vercel"   url={project.links?.vercel} />
          <LinkRow label="Live URL" url={project.links?.liveUrl} />
          <LinkRow label="Base44"   url={project.links?.base44} />
          <LinkRow label="Supabase" url={project.links?.supabase} />
          <LinkRow label="Docs"     url={project.links?.docs} />
          <LinkRow label="Figma"    url={project.links?.figma} />
          <LinkRow label="Other"    url={project.links?.other} />
        </DetailSection>
      )}

      {/* ── Stack ── */}
      {Object.values(project.stack || {}).some((v) => v) && (
        <DetailSection title="Stack">
          {[
            ["Frontend",   project.stack?.frontend],
            ["Backend",    project.stack?.backend],
            ["Database",   project.stack?.database],
            ["AI Layer",   project.stack?.ai],
            ["Deployment", project.stack?.deployment],
            ["Auth",       project.stack?.auth],
            ["Storage",    project.stack?.storage],
          ]
            .filter(([, v]) => v)
            .map(([label, val]) => (
              <div key={label} className="setting-row">
                <span className="setting-label">{label}</span>
                <span className="mono text-muted" style={{ fontSize: "0.78rem" }}>{val}</span>
              </div>
            ))}
        </DetailSection>
      )}

      {/* ── Tags ── */}
      {project.tags?.length > 0 && (
        <DetailSection title="Tags">
          <div className="tags" style={{ padding: "4px 0" }}>
            {project.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
        </DetailSection>
      )}

      {/* ── Flags ── */}
      <DetailSection title="Flags">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "4px 0" }}>
          <FlagBadge label="PWA"            active={project.flags?.hasPwa} />
          <FlagBadge label="Backend"        active={project.flags?.hasBackend} />
          <FlagBadge label="AI"             active={project.flags?.hasAi} />
          <FlagBadge label="Deployed"       active={project.flags?.isDeployed} />
          <FlagBadge label="Investor Ready" active={project.flags?.isInvestorReady} />
          <FlagBadge label="Template"       active={project.flags?.isTemplate} />
          <FlagBadge label="Needs Rebuild"  active={project.flags?.needsRebuild} />
          <FlagBadge label="Archived"       active={project.flags?.isArchived} />
        </div>
      </DetailSection>

      {/* ── Notes ── */}
      {project.notes && (
        <DetailSection title="Notes">
          <div style={{
            fontSize: "0.82rem", color: "var(--muted)",
            whiteSpace: "pre-wrap", lineHeight: 1.7,
            maxHeight: 300, overflowY: "auto",
          }}>
            {project.notes}
          </div>
        </DetailSection>
      )}

      {/* ── Next Action ── */}
      {project.nextAction && (
        <DetailSection title="Next Action">
          <div style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 500 }}>
            → {project.nextAction}
          </div>
        </DetailSection>
      )}


      {/* ── Linked Prompts ── */}
      {(() => {
        const linked = (allPrompts || []).filter((p) => p.linkedProjectId === project.id);
        if (linked.length === 0) return null;
        return (
          <DetailSection title={`Linked Prompts (${linked.length})`}>
            {linked.map((p) => (
              <div key={p.id} className="setting-row" style={{ alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.82rem", color: "var(--text)", fontWeight: 500 }}>{p.title}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                    <span className="badge badge-muted" style={{ fontSize: "0.62rem" }}>{p.type}</span>
                    <span className="badge badge-muted" style={{ fontSize: "0.62rem" }}>{p.category}</span>
                    {p.flags?.isMasterPrompt && (
                      <span className="badge badge-purple" style={{ fontSize: "0.62rem" }}>⬡ Master</span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <StatusBadge status={p.status} />
                  <span style={{ fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                    Safety {p.safety?.safetyScore ?? 0}/100
                  </span>
                </div>
              </div>
            ))}
          </DetailSection>
        );
      })()}


      {/* ── Project Health (Run 4) ── */}
      <DetailSection title="Project Health & Classifier">
        <ProjectHealthPanel project={project} errors={allErrors || []} />
      </DetailSection>

      {/* ── Record Meta ── */}
      <DetailSection title="Record">
        <div className="setting-row">
          <span className="setting-label">ID</span>
          <span className="mono text-muted" style={{ fontSize: "0.72rem" }}>{project.id}</span>
        </div>
        <div className="setting-row">
          <span className="setting-label">Created</span>
          <span className="mono text-muted" style={{ fontSize: "0.72rem" }}>{fmtDate(project.createdAt)}</span>
        </div>
        <div className="setting-row">
          <span className="setting-label">Updated</span>
          <span className="mono text-muted" style={{ fontSize: "0.72rem" }}>{fmtDate(project.updatedAt)}</span>
        </div>
        {project.owner && (
          <div className="setting-row">
            <span className="setting-label">Owner</span>
            <span className="mono text-muted" style={{ fontSize: "0.72rem" }}>{project.owner}</span>
          </div>
        )}
      </DetailSection>

      {/* ── Dialogs ── */}
      <ConfirmDialog
        open={confirmDelete}
        title="Delete Project?"
        message={`This will permanently delete "${project.name}". This cannot be undone. Consider archiving instead.`}
        confirmLabel="Delete Permanently"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => {
          setConfirmDelete(false);
          deleteProject(project.id);
          onDeleted?.();
        }}
        onCancel={() => setConfirmDelete(false)}
      />

      <ConfirmDialog
        open={confirmArchive}
        title="Archive Project?"
        message={`Archive "${project.name}"? It will be hidden but preserved. You can restore it later.`}
        confirmLabel="Archive"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => {
          setConfirmArchive(false);
          archiveProjectById(project.id);
          onBack?.();
        }}
        onCancel={() => setConfirmArchive(false)}
      />
    </div>
  );
}

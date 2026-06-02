// ============================================================
// AP3X — RunTimeline — Run 5
// /src/components/RunTimeline.jsx
// Chronological local-only timeline. No external logs.
// ============================================================

import StatusBadge from "./StatusBadge.jsx";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    year:"numeric", month:"short", day:"numeric",
    hour:"2-digit", minute:"2-digit",
  });
}

function TimelineEvent({ icon, color, title, subtitle, date, badge }) {
  return (
    <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:16 }}>
      <div style={{
        width:32, height:32, borderRadius:"50%", flexShrink:0,
        background:`rgba(${color},0.15)`, border:`1.5px solid rgba(${color},0.5)`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:"0.85rem",
      }}>
        {icon}
      </div>
      <div style={{ flex:1, paddingTop:4 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, flexWrap:"wrap" }}>
          <div style={{ fontWeight:600, fontSize:"0.82rem", color:"var(--text)" }}>{title}</div>
          {badge && <StatusBadge status={badge.status} label={badge.label} />}
        </div>
        {subtitle && (
          <div style={{ fontSize:"0.73rem", color:"var(--muted)", marginTop:2 }}>{subtitle}</div>
        )}
        <div style={{ fontSize:"0.68rem", color:"var(--muted)", marginTop:4, fontFamily:"var(--font-mono)" }}>
          {fmtDate(date)}
        </div>
      </div>
    </div>
  );
}

export default function RunTimeline({ run }) {
  // Build timeline events in chronological order
  const events = [];

  // Created
  events.push({
    id: "created",
    icon: "◈",
    color: "0,229,255",
    title: "Run Created",
    subtitle: `Type: ${run.type || "build"} · Status: ${run.status || "planned"}`,
    date: run.createdAt,
    badge: null,
  });

  // Checkpoints (in creation order)
  (run.checkpoints || []).forEach((cp) => {
    const color = cp.status === "passed" ? "34,197,94" : cp.status === "failed" ? "239,68,68" : cp.status === "in_progress" ? "0,229,255" : "100,116,139";
    events.push({
      id: cp.id,
      icon: cp.status === "passed" ? "✓" : cp.status === "failed" ? "✕" : cp.status === "skipped" ? "↷" : "○",
      color,
      title: `Checkpoint: ${cp.title}`,
      subtitle: cp.description || cp.notes || null,
      date: cp.completedAt || cp.createdAt,
      badge: { status: cp.status, label: cp.status.replace("_"," ") },
    });
  });

  // Validation items that are done
  const doneItems = (run.validation?.checklist || []).filter((v) => v.result !== "not_tested");
  if (doneItems.length > 0) {
    const passed  = doneItems.filter((v) => v.result === "passed").length;
    const failed  = doneItems.filter((v) => v.result === "failed").length;
    const warning = doneItems.filter((v) => v.result === "warning").length;
    events.push({
      id: "validation",
      icon: "⬡",
      color: failed > 0 ? "239,68,68" : warning > 0 ? "245,158,11" : "34,197,94",
      title: "Validation Checked",
      subtitle: `${passed} passed · ${failed} failed · ${warning} warning`,
      date: run.updatedAt,
      badge: { status: run.validation?.result || "not_tested", label: (run.validation?.result || "not_tested").replace("_"," ") },
    });
  }

  // Status transitions shown via current status if terminal
  if (run.status === "completed") {
    events.push({
      id: "completed",
      icon: "✓",
      color: "34,197,94",
      title: "Run Marked Completed",
      subtitle: run.outcome?.summary || null,
      date: run.updatedAt,
      badge: { status:"completed", label:"Completed" },
    });
  }
  if (run.status === "failed") {
    events.push({
      id: "failed",
      icon: "✕",
      color: "239,68,68",
      title: "Run Marked Failed",
      subtitle: run.outcome?.resultNotes || null,
      date: run.updatedAt,
      badge: { status:"failed", label:"Failed" },
    });
  }
  if (run.status === "validated") {
    events.push({
      id: "validated",
      icon: "◎",
      color: "124,58,237",
      title: "Run Validated",
      subtitle: `Result: ${(run.validation?.result || "not_tested").replace("_"," ")}`,
      date: run.updatedAt,
      badge: { status:"validated", label:"Validated" },
    });
  }

  // Updated (if different from created and not terminal)
  if (run.updatedAt && run.updatedAt !== run.createdAt && !["completed","failed","validated"].includes(run.status)) {
    events.push({
      id: "updated",
      icon: "↻",
      color: "100,116,139",
      title: "Run Updated",
      subtitle: null,
      date: run.updatedAt,
      badge: null,
    });
  }

  // Sort by date
  events.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

  return (
    <div>
      {events.length === 0 ? (
        <div style={{ fontSize:"0.78rem", color:"var(--muted)" }}>No timeline events yet.</div>
      ) : (
        <div style={{ position:"relative", paddingLeft:0 }}>
          {/* Vertical line */}
          <div style={{
            position:"absolute", left:15, top:16, bottom:16,
            width:1, background:"var(--border2)",
          }} />
          {events.map((ev) => (
            <TimelineEvent key={ev.id} {...ev} />
          ))}
        </div>
      )}

      <div style={{ marginTop:16, padding:"8px 10px", background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.68rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
        Local-only timeline. Derived from run data — no external logs or live tracking.
      </div>
    </div>
  );
}

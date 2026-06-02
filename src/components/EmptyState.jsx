// ============================================================
// AP3X — EmptyState Component
// /src/components/EmptyState.jsx
// ============================================================

export default function EmptyState({ icon = "◎", title = "Nothing here yet", desc = "", action = null }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      {desc && <div className="empty-desc">{desc}</div>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

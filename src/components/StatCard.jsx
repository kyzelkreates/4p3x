// ============================================================
// AP3X — StatCard Component
// /src/components/StatCard.jsx
// ============================================================

export default function StatCard({ label, value, sub, variant = "" }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${variant}`}>{value ?? "—"}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

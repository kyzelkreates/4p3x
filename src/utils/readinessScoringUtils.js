// AP3X — readinessScoringUtils.js — Run 9
export { calculateProductReadinessScore, summariseReadinessStatus, detectBlockingIssues, detectNonBlockingIssues } from "../core/productReadinessEngine.js";
export function scoreBadgeVariant(score) {
  if (score >= 90) return "success";
  if (score >= 70) return "accent";
  if (score >= 50) return "warning";
  return "danger";
}
export function statusColor(status) {
  const m = { pass:"var(--success)", warning:"var(--warning)", fail:"var(--danger)", not_tested:"var(--muted)" };
  return m[status] || "var(--muted)";
}

// ============================================================
// AP3X — blueprintFormatUtils.js — Run 6
// ============================================================

export function formatRunsForDisplay(runs = []) {
  return runs.map((r) => ({
    ...r,
    label: `Run ${r.run} — ${r.title}`,
    shortDesc: r.description?.slice(0, 100) + (r.description?.length > 100 ? "…" : ""),
  }));
}

export function formatFileStructureForDisplay(raw = "") {
  return raw.split("\n").map((line, i) => {
    const isComment = line.trim().startsWith("//");
    const isDir     = line.trim().endsWith("/");
    const isFile    = line.includes(".") && !isComment;
    return { key: i, text: line, isComment, isDir, isFile };
  });
}

export function formatEntityForDisplay(entity) {
  if (!entity) return null;
  return {
    name:   entity.name,
    fields: (entity.fields || []).join(", "),
    source: entity.source,
    label:  `${entity.name} (${entity.source})`,
  };
}

export function getRiskVariant(level) {
  if (level === "Critical") return "danger";
  if (level === "High")     return "danger";
  if (level === "Medium")   return "warning";
  return "success";
}

export function getScoreVariant(score) {
  if (score >= 75) return "success";
  if (score >= 50) return "warning";
  if (score >= 25) return "danger";
  return "danger";
}

export function getSeverityVariant(severity) {
  if (severity === "critical") return "badge-critical";
  if (severity === "high")     return "badge-danger";
  if (severity === "medium")   return "badge-warning";
  return "badge-muted";
}

export function formatPercent(n) {
  return `${Math.round(n || 0)}%`;
}

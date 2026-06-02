// ============================================================
// AP3X — StatusBadge Component
// /src/components/StatusBadge.jsx — Updated Run 5
// ============================================================

const STATUS_MAP = {
  // Project
  working:        { cls: "badge-success", label: "Working" },
  broken:         { cls: "badge-danger",  label: "Broken" },
  partial:        { cls: "badge-warning", label: "Partial" },
  building:       { cls: "badge-accent",  label: "Building" },
  deployed:       { cls: "badge-success", label: "Deployed" },
  paused:         { cls: "badge-muted",   label: "Paused" },
  archived:       { cls: "badge-locked",  label: "Archived" },
  needs_rebuild:  { cls: "badge-danger",  label: "Needs Rebuild" },
  investor_ready: { cls: "badge-purple",  label: "Investor Ready" },
  idea:           { cls: "badge-muted",   label: "Idea" },
  draft:          { cls: "badge-muted",   label: "Draft" },
  locked:         { cls: "badge-locked",  label: "Locked" },
  not_configured: { cls: "badge-locked",  label: "Not Configured" },
  success:        { cls: "badge-success", label: "Success" },
  warning:        { cls: "badge-warning", label: "Warning" },
  danger:         { cls: "badge-danger",  label: "Danger" },
  // Prompt
  ready:        { cls: "badge-accent",  label: "Ready" },
  tested:       { cls: "badge-accent",  label: "Tested" },
  successful:   { cls: "badge-success", label: "Successful" },
  failed:       { cls: "badge-danger",  label: "Failed" },
  needs_review: { cls: "badge-warning", label: "Needs Review" },
  master:       { cls: "badge-purple",  label: "Master" },
  // Error (Run 4)
  open:            { cls: "badge-danger",   label: "Open" },
  investigating:   { cls: "badge-warning",  label: "Investigating" },
  fix_planned:     { cls: "badge-accent",   label: "Fix Planned" },
  fix_in_progress: { cls: "badge-accent",   label: "Fix In Progress" },
  fixed:           { cls: "badge-success",  label: "Fixed" },
  validated:       { cls: "badge-success",  label: "Validated" },
  reopened:        { cls: "badge-danger",   label: "Reopened" },
  ignored:         { cls: "badge-muted",    label: "Ignored" },
  // Health (Run 4)
  excellent: { cls: "badge-success",  label: "Excellent" },
  good:      { cls: "badge-success",  label: "Good" },
  critical:  { cls: "badge-critical", label: "Critical" },
  unknown:   { cls: "badge-muted",    label: "Unknown" },
  // Severity (Run 4)
  low:    { cls: "badge-muted",    label: "Low" },
  medium: { cls: "badge-warning",  label: "Medium" },
  high:   { cls: "badge-danger",   label: "High" },
  // Run statuses (Run 5)
  planned:      { cls: "badge-muted",    label: "Planned" },
  in_progress:  { cls: "badge-accent",   label: "In Progress" },
  completed:    { cls: "badge-success",  label: "Completed" },
  blocked:      { cls: "badge-danger",   label: "Blocked" },
  // Validation results (Run 5)
  not_tested: { cls: "badge-muted",    label: "Not Tested" },
  passed:     { cls: "badge-success",  label: "Passed" },
  // partial already defined above
  // Checkpoint statuses (Run 5)
  pending:    { cls: "badge-muted",    label: "Pending" },
  skipped:    { cls: "badge-locked",   label: "Skipped" },
  // Run badge purple (run number)
  badge_purple: { cls: "badge-purple", label: "" },
};

export default function StatusBadge({ status, label, style }) {
  const cfg = STATUS_MAP[status] || { cls: "badge-muted", label: status || "Unknown" };
  return (
    <span className={`badge ${cfg.cls}`} style={style} title={cfg.label}>
      {label || cfg.label}
    </span>
  );
}

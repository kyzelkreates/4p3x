// AP3X — ErrorCard — Run 4
import StatusBadge from "./StatusBadge.jsx";
import { ERROR_CATEGORIES, ERROR_SOURCES } from "../core/constants.js";

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});
}
function getLabel(arr,v){const f=arr.find(x=>x.value===v);return f?f.label:v;}

export default function ErrorCard({
  error, linkedProjectName,
  onView, onEdit, onDuplicate, onMarkFixed, onReopen, onArchive, onRestore, onDelete,
}) {
  const archived   = error.flags?.isArchived;
  const isFixed    = error.status==="fixed"||error.status==="validated";
  const isOpen     = error.status==="open"||error.status==="investigating"||error.status==="reopened";
  const isBlocking = !!error.classification?.isDeploymentBlocking;
  const isSecurity = !!error.classification?.isSecurityRelated;
  const isDataLoss = !!error.classification?.isDataLossRisk;
  const sev        = error.severity||"medium";
  const borderColor = sev==="critical"?"rgba(239,68,68,0.35)":sev==="high"?"rgba(239,68,68,0.2)":isBlocking?"rgba(245,158,11,0.3)":"var(--border2)";

  return (
    <div className="item-card" style={{borderColor, opacity:archived?0.6:1}}>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:3}}>
        {archived   && <span className="badge badge-locked"   style={{fontSize:"0.6rem"}}>Archived</span>}
        {isBlocking && <span className="badge badge-critical" style={{fontSize:"0.6rem"}}>⛔ Deploy Blocker</span>}
        {isSecurity && <span className="badge badge-danger"   style={{fontSize:"0.6rem"}}>🔒 Security</span>}
        {isDataLoss && <span className="badge badge-danger"   style={{fontSize:"0.6rem"}}>⚠ Data Loss</span>}
        {error.classification?.isRegression  && <span className="badge badge-warning" style={{fontSize:"0.6rem"}}>↩ Regression</span>}
        {error.flags?.isPinned               && <span className="badge badge-accent"  style={{fontSize:"0.6rem"}}>📌 Pinned</span>}
        {error.flags?.needsHumanReview       && <span className="badge badge-warning" style={{fontSize:"0.6rem"}}>👤 Review</span>}
      </div>
      <div className="item-card-header">
        <div style={{flex:1}}>
          <div className="item-card-title">{error.title}</div>
          <div style={{display:"flex",gap:5,marginTop:4,flexWrap:"wrap"}}>
            <span className="badge badge-muted" style={{fontSize:"0.62rem"}}>{sev.toUpperCase()}</span>
            <span className="badge badge-muted" style={{fontSize:"0.62rem"}}>{getLabel(ERROR_CATEGORIES,error.category)}</span>
            <span className="badge badge-muted" style={{fontSize:"0.62rem"}}>{getLabel(ERROR_SOURCES,error.source)}</span>
          </div>
        </div>
        <StatusBadge status={error.status} />
      </div>
      {error.description && (
        <div className="item-card-desc" style={{WebkitLineClamp:2,overflow:"hidden",display:"-webkit-box",WebkitBoxOrient:"vertical"}}>
          {error.description}
        </div>
      )}
      {linkedProjectName && <div style={{fontSize:"0.72rem",color:"var(--muted)"}}>◈ {linkedProjectName}</div>}
      {error.tags?.length>0 && (
        <div className="tags">
          {error.tags.slice(0,4).map(t=><span key={t} className="tag">{t}</span>)}
          {error.tags.length>4 && <span className="tag">+{error.tags.length-4}</span>}
        </div>
      )}
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <span className="item-card-date" style={{fontSize:"0.68rem"}}>{fmtDate(error.updatedAt)}</span>
        {error.priority && <span className="badge badge-muted" style={{fontSize:"0.6rem"}}>{error.priority}</span>}
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:4,paddingTop:10,borderTop:"1px solid var(--border2)"}}>
        <button className="btn btn-ghost btn-sm" onClick={()=>onView?.(error)}      aria-label="View">◎ View</button>
        {!archived && <button className="btn btn-ghost btn-sm" onClick={()=>onEdit?.(error)} aria-label="Edit">✎ Edit</button>}
        <button className="btn btn-ghost btn-sm" onClick={()=>onDuplicate?.(error)} aria-label="Duplicate">⊕ Dupe</button>
        {isOpen && !archived && <button className="btn btn-success btn-sm" onClick={()=>onMarkFixed?.(error)} aria-label="Mark fixed">✓ Fixed</button>}
        {isFixed && !archived && <button className="btn btn-warning btn-sm" onClick={()=>onReopen?.(error)} aria-label="Reopen">↩ Reopen</button>}
        {archived
          ? <button className="btn btn-ghost btn-sm" onClick={()=>onRestore?.(error)} aria-label="Restore">↩ Restore</button>
          : <button className="btn btn-ghost btn-sm" onClick={()=>onArchive?.(error)} aria-label="Archive">↓ Archive</button>}
        <button className="btn btn-danger btn-sm" onClick={()=>onDelete?.(error)} aria-label="Delete">✕</button>
      </div>
    </div>
  );
}

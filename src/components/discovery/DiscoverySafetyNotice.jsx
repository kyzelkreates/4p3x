// AP3X — DiscoverySafetyNotice — Run 10
import { DISCOVERY_SAFETY_NOTICE } from "../../core/constants.js";
export default function DiscoverySafetyNotice() {
  return (
    <div style={{ padding:"12px 16px", marginBottom:16, background:"rgba(124,58,237,0.07)", border:"1.5px solid rgba(124,58,237,0.4)", borderRadius:"var(--radius)", display:"flex", gap:10, alignItems:"flex-start" }}>
      <span style={{ fontSize:"1.1rem", flexShrink:0 }}>⚖</span>
      <div>
        <div style={{ fontWeight:700, fontSize:"0.72rem", color:"#c4b5fd", textTransform:"uppercase", marginBottom:3 }}>Safety Notice</div>
        <div style={{ fontSize:"0.75rem", color:"var(--muted)", lineHeight:1.7 }}>{DISCOVERY_SAFETY_NOTICE}</div>
      </div>
    </div>
  );
}

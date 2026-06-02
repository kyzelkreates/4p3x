// AP3X — DiscoverySourcePanel — Run 10
import ManualProjectEntryPanel from "./ManualProjectEntryPanel.jsx";
import URLDiscoveryPanel       from "./URLDiscoveryPanel.jsx";
import ZipImportPanel          from "./ZipImportPanel.jsx";
import ConnectedSourcesPanel   from "./ConnectedSourcesPanel.jsx";
import { useState }            from "react";

const SOURCES = ["Manual Entry", "Public URL", "Upload ZIP", "Connected Sources"];

export default function DiscoverySourcePanel({ onAdd }) {
  const [active, setActive] = useState("Manual Entry");
  return (
    <div>
      <div className="form-tabs" style={{ marginBottom:14, flexWrap:"wrap" }}>
        {SOURCES.map((s) => (
          <button key={s} className={`tab-btn ${active===s?"tab-btn--active":""}`} onClick={()=>setActive(s)} aria-label={s}>{s}</button>
        ))}
      </div>
      {active === "Manual Entry"      && <ManualProjectEntryPanel onAdd={onAdd} />}
      {active === "Public URL"         && <URLDiscoveryPanel       onAdd={onAdd} />}
      {active === "Upload ZIP"         && <ZipImportPanel          onAdd={onAdd} />}
      {active === "Connected Sources"  && <ConnectedSourcesPanel />}
    </div>
  );
}

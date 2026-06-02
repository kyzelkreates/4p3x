// AP3X — URLDiscoveryPanel — Run 10
import { useState } from "react";
import { parsePublicUrlInput } from "../../core/projectSourceParser.js";
import { classifyDiscoveredProject } from "../../core/projectDiscoveryEngine.js";

export default function URLDiscoveryPanel({ onAdd }) {
  const [url,   setUrl]   = useState("");
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  function handleAdd() {
    if (!url.trim()) { setError("Please enter a URL."); return; }
    if (!url.startsWith("http")) { setError("Please enter a valid URL starting with http:// or https://."); return; }
    const project = classifyDiscoveredProject(parsePublicUrlInput(url.trim()));
    onAdd(project);
    setUrl(""); setError(null); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="panel">
      <div className="section-label" style={{ marginBottom:8 }}>Public URL Reference</div>
      <div style={{ padding:"8px 12px", background:"rgba(234,179,8,0.06)", border:"1px solid rgba(234,179,8,0.3)", borderRadius:"var(--radius)", fontSize:"0.72rem", color:"var(--muted)", marginBottom:10 }}>
        ⚠ Only enter URLs you are authorised to analyse. URL is stored as a reference only — live scanning requires a connected URL analyser.
      </div>
      {saved  && <div className="alert alert-success" style={{ marginBottom:8 }}>✓ URL reference added.</div>}
      {error  && <div className="alert alert-danger"  style={{ marginBottom:8 }}>{error}</div>}
      <div style={{ display:"flex", gap:8 }}>
        <input className="form-input" value={url} onChange={(e) => { setUrl(e.target.value); setError(null); }} placeholder="https://my-project.vercel.app" style={{ flex:1 }} />
        <button className="btn btn-primary btn-sm" onClick={handleAdd}>Add URL</button>
      </div>
      <div style={{ marginTop:8, fontSize:"0.68rem", color:"var(--muted)" }}>
        URL stored as reference. No live fetch performed — mark "Needs Review" for manual follow-up.
      </div>
    </div>
  );
}

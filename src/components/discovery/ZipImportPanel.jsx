// AP3X — ZipImportPanel — Run 10
import { useState } from "react";
import { parseUploadedZipMetadata } from "../../core/projectSourceParser.js";
import { classifyDiscoveredProject } from "../../core/projectDiscoveryEngine.js";

export default function ZipImportPanel({ onAdd }) {
  const [added, setAdded] = useState(false);
  const [name,  setName]  = useState("");

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const project = classifyDiscoveredProject(parseUploadedZipMetadata({ name: file.name, size: file.size }));
    setName(file.name);
    onAdd(project);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
    e.target.value = "";
  }

  return (
    <div className="panel">
      <div className="section-label" style={{ marginBottom:8 }}>ZIP / Archive Import</div>
      <div style={{ padding:"8px 12px", background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.72rem", color:"var(--muted)", marginBottom:10 }}>
        ZIP metadata is recorded (file name, size). Deep structure inspection requires a ZIP parser integration. No file contents are read or stored.
      </div>
      {added && <div className="alert alert-success" style={{ marginBottom:8 }}>✓ ZIP metadata recorded: {name}</div>}
      <label className="btn btn-ghost" style={{ cursor:"pointer", display:"inline-block" }}>
        ↑ Select ZIP File
        <input type="file" accept=".zip,.tar,.gz,.tar.gz" onChange={handleFile} style={{ display:"none" }} />
      </label>
      <div style={{ marginTop:8, fontSize:"0.68rem", color:"var(--muted)" }}>
        Only file name and size are recorded. File contents are never read or stored.
      </div>
    </div>
  );
}

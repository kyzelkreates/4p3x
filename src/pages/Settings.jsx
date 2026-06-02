// ============================================================
// AP3X — Settings Page
// /src/pages/Settings.jsx — Run 11
// Tabs: System · API Providers · AI Agents · Project Connectors · Data
// ============================================================

import { useState, useCallback }     from "react";
import StatusBadge                   from "../components/StatusBadge.jsx";
import ConfirmDialog                 from "../components/ConfirmDialog.jsx";
import {
  resetState, seedInitialState, exportStateSnapshot,
  saveApiProvider, deleteApiProvider,
  saveAiAgent, deleteAiAgent, setActiveAgent,
  saveProjectConnector, deleteProjectConnector,
  updateApiConfigTestResult,
} from "../core/storage.js";
import { calculateErrorStats }       from "../core/errorUtils.js";
import { calculateRunStats }         from "../core/runUtils.js";
import {
  PROVIDER_CATALOGUE, AI_AGENT_ROLES, CONNECTOR_TYPES,
  createProviderConfig, createAgentConfig, createConnectorConfig,
  testProviderConnection, testProjectConnector,
  maskApiKey, getDefaultModelsForProvider, summariseApiConfig,
} from "../core/apiConfigEngine.js";

const STORAGE_KEY = "ap3x_ssot_v1";

// ── Shared row component ──────────────────────────────────────
function SR({ label, desc, badge, value, valueClass="" }) {
  return (
    <div className="setting-row">
      <div>
        <div className="setting-label">{label}</div>
        {desc && <div className="setting-desc">{desc}</div>}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {badge  && <StatusBadge status={badge.status} label={badge.label} />}
        {value !== undefined && <span className={`setting-value ${valueClass}`}>{String(value)}</span>}
      </div>
    </div>
  );
}

// ── Status pill ───────────────────────────────────────────────
function TestPill({ status, message }) {
  const MAP = { ok:"var(--success)", error:"var(--danger)", warning:"var(--warning)", untested:"var(--muted)", skipped:"var(--muted)", testing:"var(--accent)" };
  const color = MAP[status] || MAP.untested;
  return (
    <span style={{ fontSize:"0.68rem", color, fontFamily:"var(--font-mono)", display:"block", marginTop:4 }}>
      {status === "testing" ? "⟳ Testing…" : (message || "Not tested")}
    </span>
  );
}

// ─────────────────────────────────────────────
// TAB: API PROVIDERS
// ─────────────────────────────────────────────
function ApiProvidersTab({ apiConfig }) {
  const providers = Object.values(apiConfig?.providers || {});
  const [adding,   setAdding]   = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [testing,  setTesting]  = useState({});
  const [confirm,  setConfirm]  = useState(null);

  const EMPTY = { catalogueId:"groq", name:"", baseUrl:"", apiKey:"", authType:"bearer", testPath:"/models", enabled:true, notes:"" };
  const [form, setForm] = useState(EMPTY);

  function openAdd() {
    const cat = PROVIDER_CATALOGUE.find((c)=>c.id==="groq");
    setForm({ ...EMPTY, catalogueId: cat.id, name: cat.name, baseUrl: cat.baseUrl, authType: cat.authType, testPath: cat.testPath||"/models" });
    setEditing(null);
    setAdding(true);
  }

  function openEdit(p) {
    setForm({ catalogueId: p.catalogueId||"custom", name: p.name, baseUrl: p.baseUrl, apiKey: p.apiKey||"", authType: p.authType, testPath: p.testPath||"/models", enabled: p.enabled, notes: p.notes||"" });
    setEditing(p.id);
    setAdding(true);
  }

  function handleCatalogueChange(e) {
    const cat = PROVIDER_CATALOGUE.find((c)=>c.id===e.target.value);
    if (cat) setForm((f)=>({ ...f, catalogueId: cat.id, name: cat.name, baseUrl: cat.baseUrl, authType: cat.authType, testPath: cat.testPath||"" }));
  }

  function handleSave() {
    if (!form.name.trim() || !form.baseUrl.trim()) return;
    const cfg = editing
      ? { ...(apiConfig.providers[editing]), ...form, id: editing }
      : createProviderConfig(form);
    saveApiProvider(cfg);
    setAdding(false); setEditing(null); setForm(EMPTY);
  }

  async function handleTest(p) {
    setTesting((t)=>({ ...t, [p.id]: "testing" }));
    const result = await testProviderConnection(p);
    updateApiConfigTestResult("providers", p.id, result);
    setTesting((t)=>({ ...t, [p.id]: null }));
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
        <div className="section-label">API Providers</div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Provider</button>
      </div>

      {/* Quick-pick catalogue */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px,1fr))", gap:6, marginBottom:16 }}>
        {PROVIDER_CATALOGUE.filter((c)=>c.category==="ai").map((c)=>(
          <button key={c.id} className="btn btn-ghost btn-xs" style={{ textAlign:"left", padding:"8px 10px", lineHeight:1.4 }}
            onClick={()=>{ const cat=c; setForm({ ...EMPTY, catalogueId:cat.id, name:cat.name, baseUrl:cat.baseUrl, authType:cat.authType, testPath:cat.testPath||"" }); setEditing(null); setAdding(true); }}
            aria-label={`Quick-add ${c.name}`}>
            <div style={{ fontWeight:700, fontSize:"0.72rem", color:"var(--text)" }}>{c.name}</div>
            <div style={{ fontSize:"0.63rem", color:"var(--muted)" }}>{c.tier==="free_local"?"🆓 Local":c.tier==="free_tier"?"🆓 Free":"💳 Paid"}</div>
          </button>
        ))}
      </div>

      {/* Add / Edit form */}
      {adding && (
        <div className="panel" style={{ marginBottom:14, border:"1.5px solid var(--accent)", background:"rgba(0,229,255,0.03)" }}>
          <div className="section-label" style={{ marginBottom:10 }}>{editing ? "Edit Provider" : "Add Provider"}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label className="form-label">Catalogue</label>
              <select className="form-select" value={form.catalogueId} onChange={handleCatalogueChange}>
                {PROVIDER_CATALOGUE.map((c)=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Display Name *</label>
              <input className="form-input" value={form.name} onChange={(e)=>setForm((f)=>({...f,name:e.target.value}))} placeholder="My Groq Key" />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label className="form-label">Base URL *</label>
              <input className="form-input" value={form.baseUrl} onChange={(e)=>setForm((f)=>({...f,baseUrl:e.target.value}))} placeholder="https://api.groq.com/openai/v1" />
            </div>
            <div>
              <label className="form-label">API Key</label>
              <input className="form-input" type="password" value={form.apiKey} onChange={(e)=>setForm((f)=>({...f,apiKey:e.target.value}))} placeholder="sk-…   (stored in localStorage only)" autoComplete="off" />
              <div style={{ fontSize:"0.62rem", color:"var(--muted)", marginTop:3 }}>
                ⚠ Stored in browser localStorage. Never sent anywhere except your configured endpoint.
              </div>
            </div>
            <div>
              <label className="form-label">Auth Type</label>
              <select className="form-select" value={form.authType} onChange={(e)=>setForm((f)=>({...f,authType:e.target.value}))}>
                <option value="bearer">Bearer (Authorization: Bearer …)</option>
                <option value="x-api-key">x-api-key header</option>
                <option value="none">None / No Auth</option>
              </select>
            </div>
            <div>
              <label className="form-label">Test Path</label>
              <input className="form-input" value={form.testPath} onChange={(e)=>setForm((f)=>({...f,testPath:e.target.value}))} placeholder="/models" />
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, paddingTop:20 }}>
              <input type="checkbox" id="prov-enabled" checked={form.enabled} onChange={(e)=>setForm((f)=>({...f,enabled:e.target.checked}))} />
              <label htmlFor="prov-enabled" className="form-label" style={{ margin:0 }}>Enabled</label>
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label className="form-label">Notes</label>
              <input className="form-input" value={form.notes} onChange={(e)=>setForm((f)=>({...f,notes:e.target.value}))} placeholder="Optional context…" />
            </div>
          </div>
          {PROVIDER_CATALOGUE.find((c)=>c.id===form.catalogueId)?.notes && (
            <div style={{ marginTop:8, padding:"6px 10px", background:"rgba(234,179,8,0.06)", border:"1px solid rgba(234,179,8,0.2)", borderRadius:"var(--radius)", fontSize:"0.68rem", color:"var(--muted)" }}>
              ℹ {PROVIDER_CATALOGUE.find((c)=>c.id===form.catalogueId).notes}
            </div>
          )}
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={!form.name.trim()||!form.baseUrl.trim()}>Save Provider</button>
            <button className="btn btn-ghost  btn-sm" onClick={()=>{ setAdding(false); setEditing(null); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Provider list */}
      {providers.length === 0 && !adding && (
        <div className="panel" style={{ textAlign:"center", padding:32, color:"var(--muted)" }}>
          <div style={{ fontSize:"2rem", marginBottom:8 }}>⬡</div>
          No API providers configured yet. Click "+ Add Provider" or pick from the quick-add buttons above.
        </div>
      )}
      {providers.map((p) => (
        <div key={p.id} className="panel" style={{ marginBottom:8, borderLeft:`3px solid ${p.verified?"var(--success)":p.enabled?"var(--accent)":"var(--border2)"}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:"0.85rem", color:"var(--text)", marginBottom:2 }}>{p.name}</div>
              <div style={{ fontSize:"0.7rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>{p.baseUrl}</div>
              <div style={{ fontSize:"0.68rem", color:"var(--muted)", marginTop:2 }}>
                Key: {maskApiKey(p.apiKey)} &nbsp;|&nbsp; Auth: {p.authType}
              </div>
              <TestPill status={testing[p.id] === "testing" ? "testing" : p.testStatus} message={p.testMessage} />
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"flex-start" }}>
              <span className={`badge ${p.enabled?"badge-success":"badge-muted"}`} style={{ fontSize:"0.6rem" }}>{p.enabled?"Enabled":"Disabled"}</span>
              <span className={`badge ${p.verified?"badge-success":"badge-muted"}`} style={{ fontSize:"0.6rem" }}>{p.verified?"✓ Verified":"Unverified"}</span>
              <button className="btn btn-primary btn-xs" onClick={()=>handleTest(p)} disabled={testing[p.id]==="testing"} aria-label="Test connection">⟳ Test</button>
              <button className="btn btn-ghost   btn-xs" onClick={()=>openEdit(p)}                                          aria-label="Edit">✏ Edit</button>
              <button className="btn btn-danger  btn-xs" onClick={()=>setConfirm(p.id)}                                     aria-label="Delete">✕</button>
            </div>
          </div>
          {p.notes && <div style={{ marginTop:6, fontSize:"0.68rem", color:"var(--muted)", fontStyle:"italic" }}>{p.notes}</div>}
          {p.verifiedAt && <div style={{ marginTop:4, fontSize:"0.62rem", color:"var(--success)", fontFamily:"var(--font-mono)" }}>Last verified: {new Date(p.verifiedAt).toLocaleString()}</div>}
        </div>
      ))}

      <ConfirmDialog
        open={!!confirm} title="Delete Provider?" variant="danger"
        message="This will remove this provider and its API key from local storage permanently."
        confirmLabel="Delete Provider"
        onConfirm={()=>{ deleteApiProvider(confirm); setConfirm(null); }}
        onCancel={()=>setConfirm(null)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: AI AGENTS
// ─────────────────────────────────────────────
function AiAgentsTab({ apiConfig }) {
  const agents    = Object.values(apiConfig?.aiAgents   || {});
  const providers = Object.values(apiConfig?.providers  || {}).filter((p)=>p.enabled);
  const [adding,  setAdding]  = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const EMPTY = { name:"", providerId:"", modelId:"", role:"architecture_analyser", enabled:true, systemPrompt:"", temperature:0.3, maxTokens:2048, notes:"" };
  const [form, setForm] = useState(EMPTY);
  const [customModel, setCustomModel] = useState("");

  const activeId = apiConfig?.activeAgentId;

  function openAdd() { setForm(EMPTY); setEditing(null); setCustomModel(""); setAdding(true); }
  function openEdit(a) {
    setForm({ name:a.name, providerId:a.providerId, modelId:a.modelId, role:a.role, enabled:a.enabled, systemPrompt:a.systemPrompt||"", temperature:a.temperature??0.3, maxTokens:a.maxTokens??2048, notes:a.notes||"" });
    setEditing(a.id); setCustomModel(""); setAdding(true);
  }

  function handleSave() {
    if (!form.name.trim()) return;
    const finalModel = customModel.trim() || form.modelId;
    const cfg = editing
      ? { ...(apiConfig.aiAgents[editing]), ...form, modelId: finalModel, id: editing }
      : createAgentConfig({ ...form, modelId: finalModel });
    saveAiAgent(cfg);
    setAdding(false); setEditing(null); setForm(EMPTY); setCustomModel("");
  }

  const providerModels = getDefaultModelsForProvider(
    providers.find((p)=>p.id===form.providerId)?.catalogueId || ""
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
        <div className="section-label">AI Agents</div>
        <button className="btn btn-primary btn-sm" onClick={openAdd} disabled={providers.length===0} title={providers.length===0?"Add and enable an API provider first":""}>+ Add Agent</button>
      </div>

      {providers.length === 0 && (
        <div style={{ padding:"10px 14px", background:"rgba(234,179,8,0.06)", border:"1px solid rgba(234,179,8,0.2)", borderRadius:"var(--radius)", fontSize:"0.72rem", color:"var(--warning)", marginBottom:12 }}>
          ⚠ Add and enable at least one API provider before configuring agents.
        </div>
      )}

      {adding && (
        <div className="panel" style={{ marginBottom:14, border:"1.5px solid var(--accent)", background:"rgba(0,229,255,0.03)" }}>
          <div className="section-label" style={{ marginBottom:10 }}>{editing ? "Edit Agent" : "Add Agent"}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label className="form-label">Agent Name *</label>
              <input className="form-input" value={form.name} onChange={(e)=>setForm((f)=>({...f,name:e.target.value}))} placeholder="My Groq Architecture Agent" />
            </div>
            <div>
              <label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={(e)=>setForm((f)=>({...f,role:e.target.value}))}>
                {AI_AGENT_ROLES.map((r)=><option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
              <div style={{ fontSize:"0.63rem", color:"var(--muted)", marginTop:2 }}>{AI_AGENT_ROLES.find((r)=>r.id===form.role)?.description}</div>
            </div>
            <div>
              <label className="form-label">API Provider *</label>
              <select className="form-select" value={form.providerId} onChange={(e)=>setForm((f)=>({...f,providerId:e.target.value,modelId:""}))}>
                <option value="">— Select provider —</option>
                {providers.map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Model</label>
              {providerModels.length > 0 ? (
                <select className="form-select" value={form.modelId} onChange={(e)=>setForm((f)=>({...f,modelId:e.target.value}))}>
                  <option value="">— Select model —</option>
                  {providerModels.map((m)=><option key={m} value={m}>{m}</option>)}
                </select>
              ) : (
                <input className="form-input" value={form.modelId} onChange={(e)=>setForm((f)=>({...f,modelId:e.target.value}))} placeholder="gpt-4o / llama3 / mistral…" />
              )}
              {providerModels.length > 0 && (
                <input className="form-input" value={customModel} onChange={(e)=>setCustomModel(e.target.value)} placeholder="Or type a custom model ID…" style={{ marginTop:4 }} />
              )}
            </div>
            <div>
              <label className="form-label">Temperature ({form.temperature})</label>
              <input type="range" min={0} max={1} step={0.05} value={form.temperature} onChange={(e)=>setForm((f)=>({...f,temperature:parseFloat(e.target.value)}))} style={{ width:"100%", accentColor:"var(--accent)" }} />
              <div style={{ fontSize:"0.62rem", color:"var(--muted)" }}>0 = deterministic &nbsp;|&nbsp; 1 = creative</div>
            </div>
            <div>
              <label className="form-label">Max Tokens ({form.maxTokens.toLocaleString()})</label>
              <input type="range" min={256} max={8192} step={256} value={form.maxTokens} onChange={(e)=>setForm((f)=>({...f,maxTokens:parseInt(e.target.value)}))} style={{ width:"100%", accentColor:"var(--accent)" }} />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label className="form-label">System Prompt</label>
              <textarea className="form-textarea" value={form.systemPrompt} onChange={(e)=>setForm((f)=>({...f,systemPrompt:e.target.value}))} rows={6} placeholder="You are AP3X, an AI architecture analyser…" />
            </div>
            <div>
              <label className="form-label">Notes</label>
              <input className="form-input" value={form.notes} onChange={(e)=>setForm((f)=>({...f,notes:e.target.value}))} placeholder="Optional context…" />
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, paddingTop:20 }}>
              <input type="checkbox" id="agent-enabled" checked={form.enabled} onChange={(e)=>setForm((f)=>({...f,enabled:e.target.checked}))} />
              <label htmlFor="agent-enabled" className="form-label" style={{ margin:0 }}>Enabled</label>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={!form.name.trim()}>Save Agent</button>
            <button className="btn btn-ghost  btn-sm" onClick={()=>{ setAdding(false); setEditing(null); }}>Cancel</button>
          </div>
        </div>
      )}

      {agents.length === 0 && !adding && (
        <div className="panel" style={{ textAlign:"center", padding:32, color:"var(--muted)" }}>
          <div style={{ fontSize:"2rem", marginBottom:8 }}>◎</div>
          No AI agents configured yet. Add an API provider first, then create an agent.
        </div>
      )}

      {agents.map((a) => {
        const prov = providers.find((p)=>p.id===a.providerId);
        const role = AI_AGENT_ROLES.find((r)=>r.id===a.role);
        const isActive = activeId === a.id;
        return (
          <div key={a.id} className="panel" style={{ marginBottom:8, borderLeft:`3px solid ${isActive?"var(--gold)":a.enabled?"var(--accent)":"var(--border2)"}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:3 }}>
                  <span style={{ fontWeight:700, fontSize:"0.85rem", color:"var(--text)" }}>{a.name}</span>
                  {isActive && <span className="badge badge-gold" style={{ fontSize:"0.6rem" }}>★ Active</span>}
                </div>
                <div style={{ fontSize:"0.7rem", color:"var(--muted)" }}>
                  {role?.label} &nbsp;|&nbsp; {a.modelId || "No model"} &nbsp;|&nbsp; Provider: {prov?.name || "—"}
                </div>
                <div style={{ fontSize:"0.68rem", color:"var(--muted)", marginTop:2 }}>
                  Temp: {a.temperature} &nbsp;|&nbsp; Max tokens: {a.maxTokens?.toLocaleString()}
                </div>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                <span className={`badge ${a.enabled?"badge-success":"badge-muted"}`} style={{ fontSize:"0.6rem" }}>{a.enabled?"Enabled":"Disabled"}</span>
                {!isActive && <button className="btn btn-primary btn-xs" onClick={()=>setActiveAgent(a.id)} aria-label="Set as active">★ Set Active</button>}
                {isActive  && <button className="btn btn-ghost   btn-xs" onClick={()=>setActiveAgent(null)} aria-label="Deactivate">☆ Deactivate</button>}
                <button className="btn btn-ghost  btn-xs" onClick={()=>openEdit(a)}     aria-label="Edit">✏ Edit</button>
                <button className="btn btn-danger btn-xs" onClick={()=>setConfirm(a.id)} aria-label="Delete">✕</button>
              </div>
            </div>
            {a.notes && <div style={{ marginTop:6, fontSize:"0.68rem", color:"var(--muted)", fontStyle:"italic" }}>{a.notes}</div>}
          </div>
        );
      })}

      <ConfirmDialog
        open={!!confirm} title="Delete Agent?" variant="danger"
        message="This will remove this agent configuration permanently."
        confirmLabel="Delete Agent"
        onConfirm={()=>{ deleteAiAgent(confirm); setConfirm(null); }}
        onCancel={()=>setConfirm(null)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: PROJECT CONNECTORS
// ─────────────────────────────────────────────
function ProjectConnectorsTab({ apiConfig }) {
  const connectors = Object.values(apiConfig?.projectConnectors || {});
  const [adding,  setAdding]  = useState(false);
  const [editing, setEditing] = useState(null);
  const [testing, setTesting] = useState({});
  const [confirm, setConfirm] = useState(null);

  const EMPTY = { name:"", catalogueId:"github", type:"github", baseUrl:"", token:"", scopes:[], enabled:true, notes:"" };
  const [form, setForm] = useState(EMPTY);

  const SRC_CATALOGUE = PROVIDER_CATALOGUE.filter((c)=>c.category==="project_source");

  function openAdd() { setForm(EMPTY); setEditing(null); setAdding(true); }
  function openEdit(c) {
    setForm({ name:c.name, catalogueId:c.catalogueId||"github", type:c.type, baseUrl:c.baseUrl||"", token:c.token||"", scopes:c.scopes||[], enabled:c.enabled, notes:c.notes||"" });
    setEditing(c.id); setAdding(true);
  }

  function handleCatalogueChange(e) {
    const cat = SRC_CATALOGUE.find((c)=>c.id===e.target.value);
    if (cat) setForm((f)=>({ ...f, catalogueId:cat.id, name:cat.name, type:cat.id, baseUrl:cat.baseUrl }));
  }

  function handleSave() {
    if (!form.name.trim()) return;
    const cfg = editing
      ? { ...(apiConfig.projectConnectors[editing]), ...form, id:editing }
      : createConnectorConfig(form);
    saveProjectConnector(cfg);
    setAdding(false); setEditing(null); setForm(EMPTY);
  }

  async function handleTest(c) {
    setTesting((t)=>({ ...t, [c.id]:"testing" }));
    const result = await testProjectConnector(c);
    updateApiConfigTestResult("projectConnectors", c.id, result);
    setTesting((t)=>({ ...t, [c.id]:null }));
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
        <div className="section-label">Project Source Connectors</div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Connector</button>
      </div>

      <div style={{ padding:"8px 12px", background:"rgba(124,58,237,0.07)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:"var(--radius)", fontSize:"0.72rem", color:"var(--muted)", marginBottom:14 }}>
        ⚠ Tokens are stored in browser localStorage only. They are sent exclusively to your configured endpoints when you click Test. Never transmitted to third parties.
      </div>

      {/* Quick-pick source catalogue */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px,1fr))", gap:6, marginBottom:14 }}>
        {SRC_CATALOGUE.map((c)=>(
          <button key={c.id} className="btn btn-ghost btn-xs" style={{ textAlign:"left", padding:"8px 10px" }}
            onClick={()=>{ setForm({ ...EMPTY, catalogueId:c.id, name:c.name, type:c.id, baseUrl:c.baseUrl }); setEditing(null); setAdding(true); }}
            aria-label={`Quick-add ${c.name}`}>
            <div style={{ fontWeight:700, fontSize:"0.72rem" }}>{c.name}</div>
            <div style={{ fontSize:"0.62rem", color:"var(--muted)" }}>🆓 Free tier</div>
          </button>
        ))}
      </div>

      {adding && (
        <div className="panel" style={{ marginBottom:14, border:"1.5px solid var(--accent)", background:"rgba(0,229,255,0.03)" }}>
          <div className="section-label" style={{ marginBottom:10 }}>{editing ? "Edit Connector" : "Add Connector"}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label className="form-label">Source Type</label>
              <select className="form-select" value={form.catalogueId} onChange={handleCatalogueChange}>
                {SRC_CATALOGUE.map((c)=><option key={c.id} value={c.id}>{c.name}</option>)}
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="form-label">Display Name *</label>
              <input className="form-input" value={form.name} onChange={(e)=>setForm((f)=>({...f,name:e.target.value}))} placeholder="My GitHub Account" />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label className="form-label">Base URL</label>
              <input className="form-input" value={form.baseUrl} onChange={(e)=>setForm((f)=>({...f,baseUrl:e.target.value}))} placeholder="https://api.github.com" />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label className="form-label">Token / Personal Access Token</label>
              <input className="form-input" type="password" value={form.token} onChange={(e)=>setForm((f)=>({...f,token:e.target.value}))} placeholder="ghp_… / glpat-… / …" autoComplete="off" />
              <div style={{ fontSize:"0.62rem", color:"var(--muted)", marginTop:3 }}>
                ⚠ Stored in localStorage only. Sent only to your configured endpoint when you click Test.
              </div>
            </div>
            <div>
              <label className="form-label">Notes</label>
              <input className="form-input" value={form.notes} onChange={(e)=>setForm((f)=>({...f,notes:e.target.value}))} placeholder="Optional context…" />
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, paddingTop:20 }}>
              <input type="checkbox" id="conn-enabled" checked={form.enabled} onChange={(e)=>setForm((f)=>({...f,enabled:e.target.checked}))} />
              <label htmlFor="conn-enabled" className="form-label" style={{ margin:0 }}>Enabled</label>
            </div>
          </div>
          {SRC_CATALOGUE.find((c)=>c.id===form.catalogueId)?.notes && (
            <div style={{ marginTop:8, padding:"6px 10px", background:"rgba(234,179,8,0.06)", border:"1px solid rgba(234,179,8,0.2)", borderRadius:"var(--radius)", fontSize:"0.68rem", color:"var(--muted)" }}>
              ℹ {SRC_CATALOGUE.find((c)=>c.id===form.catalogueId).notes}
            </div>
          )}
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={!form.name.trim()}>Save Connector</button>
            <button className="btn btn-ghost  btn-sm" onClick={()=>{ setAdding(false); setEditing(null); }}>Cancel</button>
          </div>
        </div>
      )}

      {connectors.length === 0 && !adding && (
        <div className="panel" style={{ textAlign:"center", padding:32, color:"var(--muted)" }}>
          <div style={{ fontSize:"2rem", marginBottom:8 }}>⬡</div>
          No project connectors configured yet.
        </div>
      )}

      {connectors.map((c) => {
        const cat = SRC_CATALOGUE.find((s)=>s.id===c.catalogueId);
        return (
          <div key={c.id} className="panel" style={{ marginBottom:8, borderLeft:`3px solid ${c.verified?"var(--success)":c.enabled?"var(--accent)":"var(--border2)"}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:"0.85rem", color:"var(--text)", marginBottom:2 }}>{c.name}</div>
                <div style={{ fontSize:"0.7rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>{c.baseUrl || cat?.baseUrl || "—"}</div>
                <div style={{ fontSize:"0.68rem", color:"var(--muted)", marginTop:2 }}>Token: {maskApiKey(c.token)}</div>
                <TestPill status={testing[c.id]==="testing"?"testing":c.testStatus} message={c.testMessage} />
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                <span className={`badge ${c.enabled?"badge-success":"badge-muted"}`} style={{ fontSize:"0.6rem" }}>{c.enabled?"Enabled":"Disabled"}</span>
                <span className={`badge ${c.verified?"badge-success":"badge-muted"}`} style={{ fontSize:"0.6rem" }}>{c.verified?"✓ Verified":"Unverified"}</span>
                <button className="btn btn-primary btn-xs" onClick={()=>handleTest(c)} disabled={testing[c.id]==="testing"} aria-label="Test connection">⟳ Test</button>
                <button className="btn btn-ghost   btn-xs" onClick={()=>openEdit(c)}                                          aria-label="Edit">✏ Edit</button>
                <button className="btn btn-danger  btn-xs" onClick={()=>setConfirm(c.id)}                                     aria-label="Delete">✕</button>
              </div>
            </div>
            {c.notes && <div style={{ marginTop:6, fontSize:"0.68rem", color:"var(--muted)", fontStyle:"italic" }}>{c.notes}</div>}
          </div>
        );
      })}

      <ConfirmDialog
        open={!!confirm} title="Delete Connector?" variant="danger"
        message="This will remove this connector and its token from local storage permanently."
        confirmLabel="Delete Connector"
        onConfirm={()=>{ deleteProjectConnector(confirm); setConfirm(null); }}
        onCancel={()=>setConfirm(null)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// TAB: SYSTEM
// ─────────────────────────────────────────────
function SystemTab({ state }) {
  const { settings, appMeta, projects, prompts, errors, runs } = state;
  const [confirmReset, setConfirmReset] = useState(false);
  const [snapCopied,   setSnapCopied]   = useState(false);

  const errorStats = calculateErrorStats(errors || []);
  const runStats   = calculateRunStats(runs     || []);

  async function handleExportSnapshot() {
    const snap = exportStateSnapshot();
    try {
      await navigator.clipboard.writeText(snap);
      setSnapCopied(true);
      setTimeout(() => setSnapCopied(false), 2500);
    } catch {
      const blob = new Blob([snap], { type:"application/json" });
      window.open(URL.createObjectURL(blob), "_blank");
    }
  }

  const totalPrompts    = prompts?.length ?? 0;
  const archivedPrompts = (prompts||[]).filter((p) => p.flags?.isArchived).length;
  const masterPrompts   = (prompts||[]).filter((p) => p.flags?.isMasterPrompt || p.status === "master").length;
  const scores          = (prompts||[]).filter((p) => !p.flags?.isArchived).map((p) => p.safety?.safetyScore || 0);
  const avgSafety       = scores.length ? Math.round(scores.reduce((a,b) => a+b,0)/scores.length) : 0;

  return (
    <div>
      <div className="section">
        <div className="section-label">Architecture Flags</div>
        <div className="panel">
          <SR label="Local-First Mode"   desc="All data stored in browser localStorage." badge={{ status: settings?.localFirst   ? "success" : "danger", label: settings?.localFirst   ? "ENABLED" : "DISABLED" }} />
          <SR label="SSOT Enforced"      desc="All mutations route through storage.js."  badge={{ status: settings?.ssotEnforced ? "success" : "danger", label: settings?.ssotEnforced ? "ENABLED" : "DISABLED" }} />
          <SR label="Backend"            desc="Supabase / server-side APIs."             badge={{ status: "not_configured", label: "DISABLED" }} />
          <SR label="External AI"        desc="Configured via API Providers tab."        badge={{ status: Object.values(state.apiConfig?.providers||{}).some((p)=>p.enabled&&p.verified) ? "success" : "not_configured", label: Object.values(state.apiConfig?.providers||{}).some((p)=>p.enabled&&p.verified) ? "ACTIVE" : "NOT CONFIGURED" }} />
          <SR label="Connectors"         desc="Configured via Project Connectors tab."   badge={{ status: Object.values(state.apiConfig?.projectConnectors||{}).some((c)=>c.enabled&&c.verified) ? "success" : "not_configured", label: Object.values(state.apiConfig?.projectConnectors||{}).some((c)=>c.enabled&&c.verified) ? "ACTIVE" : "NOT CONFIGURED" }} />
        </div>
      </div>

      <div className="section">
        <div className="section-label">App Meta</div>
        <div className="panel">
          <SR label="App Name"    value={appMeta?.name}    valueClass="text-accent" />
          <SR label="Version"     value={appMeta?.version} valueClass="text-accent" />
          <SR label="Build Run"   value={`Run ${appMeta?.buildRun}`} />
          <SR label="Mode"        value={appMeta?.mode} />
          <SR label="Storage Key" value={STORAGE_KEY} valueClass="mono text-muted" />
          <SR label="Last Updated" value={appMeta?.lastUpdated ? new Date(appMeta.lastUpdated).toLocaleString() : "—"} valueClass="mono text-muted" />
        </div>
      </div>

      <div className="section">
        <div className="section-label">Registry Stats</div>
        <div className="panel">
          <SR label="Projects"        value={projects?.length ?? 0} />
          <SR label="Prompts"         value={totalPrompts} />
          <SR label="Master Prompts"  value={masterPrompts} />
          <SR label="Avg Safety"      value={`${avgSafety}/100`} valueClass={avgSafety>=80?"text-success":avgSafety>=50?"text-warning":"text-danger"} />
          <SR label="Total Errors"    value={errorStats.total} />
          <SR label="Open Errors"     value={errorStats.open}    valueClass={errorStats.open>0?"text-danger":""} />
          <SR label="Total Runs"      value={runStats.total} />
          <SR label="Completed Runs"  value={runStats.completed} valueClass="text-success" />
        </div>
      </div>

      <div className="section">
        <div className="section-label">State Management</div>
        <div className="panel">
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:12 }}>
            <button className="btn btn-primary" onClick={seedInitialState}>⬡ Seed Demo Data</button>
            <button className="btn btn-ghost"   onClick={handleExportSnapshot}>{snapCopied ? "✓ Copied!" : "↑ Export Snapshot"}</button>
            <button className="btn btn-danger"  onClick={() => setConfirmReset(true)}>✕ Reset Local State</button>
          </div>
          <div style={{ fontSize:"0.72rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
            Reset clears all localStorage including API keys and tokens. Export snapshot copies full state JSON — handle with care, it includes credentials.
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmReset} title="Reset All Local State?" variant="danger"
        message="This will permanently erase ALL data including API keys, tokens, projects, prompts, errors, and runs. This cannot be undone."
        confirmLabel="Reset Everything"
        onConfirm={() => { resetState(); setConfirmReset(false); }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN SETTINGS PAGE
// ─────────────────────────────────────────────
const TABS = [
  { id:"system",     label:"⬡ System"            },
  { id:"providers",  label:"⚡ API Providers"     },
  { id:"agents",     label:"◎ AI Agents"          },
  { id:"connectors", label:"⬗ Project Connectors" },
];

export default function Settings({ state }) {
  const [tab, setTab] = useState("system");
  const apiConfig  = state?.apiConfig || {};
  const summary    = summariseApiConfig(apiConfig);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
          <div>
            <div className="page-title">Settings</div>
            <div className="page-subtitle">System configuration, API providers, AI agents, and project source connectors.</div>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {summary.verifiedProviders > 0    && <span className="badge badge-success" style={{ fontSize:"0.7rem" }}>⚡ {summary.verifiedProviders} Provider{summary.verifiedProviders!==1?"s":""}</span>}
            {summary.enabledAgents    > 0    && <span className="badge badge-accent"  style={{ fontSize:"0.7rem" }}>◎ {summary.enabledAgents} Agent{summary.enabledAgents!==1?"s":""}</span>}
            {summary.verifiedConnectors > 0  && <span className="badge badge-success" style={{ fontSize:"0.7rem" }}>⬗ {summary.verifiedConnectors} Connector{summary.verifiedConnectors!==1?"s":""}</span>}
            {summary.activeAgentId && <span className="badge badge-gold" style={{ fontSize:"0.7rem" }}>★ Active Agent</span>}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="form-tabs" style={{ marginBottom:20 }}>
        {TABS.map((t) => (
          <button key={t.id} className={`tab-btn ${tab===t.id?"tab-btn--active":""}`} onClick={()=>setTab(t.id)} aria-label={t.label}>{t.label}</button>
        ))}
      </div>

      {tab === "system"     && <SystemTab            state={state} />}
      {tab === "providers"  && <ApiProvidersTab      apiConfig={apiConfig} />}
      {tab === "agents"     && <AiAgentsTab          apiConfig={apiConfig} />}
      {tab === "connectors" && <ProjectConnectorsTab apiConfig={apiConfig} />}

      {/* Footer */}
      <div style={{ marginTop:24, padding:"10px 14px", background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.72rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
        Run 11 — API & AI Configuration. All credentials stored in localStorage only. Never sent to third parties.
        Sent only to your configured endpoints during explicit Test actions. No telemetry.
      </div>
    </div>
  );
}

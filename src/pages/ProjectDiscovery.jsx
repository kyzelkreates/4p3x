// ============================================================
// AP3X — Project Discovery AI Page
// /src/pages/ProjectDiscovery.jsx — Run 10
// ============================================================

import { useState }                     from "react";
import DiscoverySafetyNotice            from "../components/discovery/DiscoverySafetyNotice.jsx";
import ProjectDiscoveryDashboard        from "../components/discovery/ProjectDiscoveryDashboard.jsx";
import DiscoverySourcePanel             from "../components/discovery/DiscoverySourcePanel.jsx";
import DiscoveredProjectsTable          from "../components/discovery/DiscoveredProjectsTable.jsx";
import ProjectHealthPanel               from "../components/discovery/ProjectHealthPanel.jsx";
import ProjectRescueQueuePanel          from "../components/discovery/ProjectRescueQueuePanel.jsx";
import ProjectHandoffPanel              from "../components/discovery/ProjectHandoffPanel.jsx";
import DuplicateProjectPanel            from "../components/discovery/DuplicateProjectPanel.jsx";
import StaleProjectPanel                from "../components/discovery/StaleProjectPanel.jsx";
import DiscoveryRunHistoryPanel         from "../components/discovery/DiscoveryRunHistoryPanel.jsx";
import { runProjectDiscovery }          from "../core/projectDiscoveryEngine.js";
import { addDiscoveredProject, updateDiscoveredProject, deleteDiscoveredProject, addDiscoveryRun, addToRescueQueue, removeFromRescueQueueStorage } from "../core/storage.js";
import { sendProjectToArchitectureExtractor } from "../core/projectHandoffEngine.js";

const TABS = [
  { id:"inventory",   label:"⬡ Inventory"   },
  { id:"add",         label:"+ Add Project"  },
  { id:"health",      label:"◑ Health"       },
  { id:"queue",       label:"⊕ Rescue Queue" },
  { id:"handoff",     label:"✦ Handoff"      },
  { id:"duplicates",  label:"⚠ Duplicates"   },
  { id:"stale",       label:"◷ Stale"        },
  { id:"history",     label:"⏷ History"      },
];

export default function ProjectDiscovery({ state }) {
  const discovery = state?.projectDiscovery || {};
  const projects  = discovery.discoveredProjects || [];
  const queueIds  = discovery.rescueQueue         || [];
  const runs      = discovery.discoveryRuns       || [];

  const [tab,      setTab]      = useState("inventory");
  const [selected, setSelected] = useState(null);
  const [running,  setRunning]  = useState(false);
  const [runNote,  setRunNote]  = useState(null);

  // Sync selected project with latest state
  const liveSelected = selected ? (projects.find((p) => p.id === selected.id) || selected) : null;

  function handleAdd(project) {
    addDiscoveredProject(project);
    setTab("inventory");
  }

  function handleRunDiscovery() {
    setRunning(true);
    setRunNote(null);
    setTimeout(() => {
      const result = runProjectDiscovery({ safeMode: true }, projects);
      result.projects.forEach((p) => {
        if (projects.find((e) => e.id === p.id)) {
          updateDiscoveredProject(p.id, p);
        }
      });
      addDiscoveryRun(result.run);
      setRunNote(`Discovery complete — ${result.run.projectsFound} projects classified.`);
      setRunning(false);
      setTimeout(() => setRunNote(null), 5000);
    }, 700);
  }

  function handleArchive(id) {
    updateDiscoveredProject(id, { status: "Archived" });
    if (liveSelected?.id === id) setSelected(null);
  }

  function handleAddToQueue(id)    { addToRescueQueue(id); }
  function handleRemoveFromQueue(id) { removeFromRescueQueueStorage(id); }

  function handleSendToExtractor(project) {
    const result = sendProjectToArchitectureExtractor(project);
    updateDiscoveredProject(project.id, { status:"Ready For Extraction", extractionInputId: result.handoff?.id });
    setSelected({ ...project, status:"Ready For Extraction" });
    setTab("handoff");
  }

  function handleGeneratePrompt(project) {
    setSelected(project);
    setTab("handoff");
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
          <div>
            <div className="page-title">4P3X Project Discovery AI</div>
            <div className="page-subtitle">
              Find scattered projects, classify their health, and prepare them for architecture extraction and safe completion planning.
            </div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <span className="badge badge-accent" style={{ fontSize:"0.7rem" }}>Run 10</span>
            <span className="badge badge-muted"  style={{ fontSize:"0.7rem" }}>v10.0.0</span>
          </div>
        </div>
      </div>

      {/* Safety notice — always visible */}
      <DiscoverySafetyNotice />

      {runNote && <div className="alert alert-success" style={{ marginBottom:14 }}>{runNote}</div>}

      {/* Dashboard */}
      <ProjectDiscoveryDashboard projects={projects} onRunDiscovery={handleRunDiscovery} running={running} />

      {/* Tabs */}
      <div className="form-tabs" style={{ marginBottom:20, flexWrap:"wrap" }}>
        {TABS.map((t) => (
          <button key={t.id} className={`tab-btn ${tab===t.id?"tab-btn--active":""}`} onClick={()=>setTab(t.id)} aria-label={t.label}>{t.label}</button>
        ))}
      </div>

      {tab === "inventory"  && (
        <div>
          <DiscoveredProjectsTable
            projects={projects.filter((p)=>p.status!=="Archived")}
            queueIds={queueIds}
            onSelect={(p)=>{ setSelected(p); setTab("health"); }}
            onAddToQueue={handleAddToQueue}
            onSendToExtractor={handleSendToExtractor}
            onGeneratePrompt={handleGeneratePrompt}
            onMarkDuplicate={(id)=>updateDiscoveredProject(id,{duplicateRisk:true,status:"Duplicate"})}
            onArchive={handleArchive}
          />
        </div>
      )}

      {tab === "add"       && <DiscoverySourcePanel onAdd={handleAdd} />}

      {tab === "health"    && (
        <div>
          {projects.length > 0 && (
            <div style={{ marginBottom:12 }}>
              <label className="form-label">Select Project</label>
              <select className="form-select" value={liveSelected?.id||""} onChange={(e)=>setSelected(projects.find((p)=>p.id===e.target.value)||null)}>
                <option value="">— Select a project —</option>
                {projects.map((p)=><option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
          )}
          <ProjectHealthPanel project={liveSelected} />
        </div>
      )}

      {tab === "queue"     && (
        <ProjectRescueQueuePanel
          projects={projects}
          queueIds={queueIds}
          onSelect={(p)=>{ setSelected(p); setTab("health"); }}
          onRemove={handleRemoveFromQueue}
        />
      )}

      {tab === "handoff"   && (
        <div>
          {projects.length > 0 && (
            <div style={{ marginBottom:12 }}>
              <label className="form-label">Select Project for Handoff</label>
              <select className="form-select" value={liveSelected?.id||""} onChange={(e)=>setSelected(projects.find((p)=>p.id===e.target.value)||null)}>
                <option value="">— Select a project —</option>
                {projects.map((p)=><option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
          )}
          <ProjectHandoffPanel project={liveSelected} />
        </div>
      )}

      {tab === "duplicates" && <DuplicateProjectPanel projects={projects} onSelect={(p)=>{ setSelected(p); setTab("health"); }} />}
      {tab === "stale"      && <StaleProjectPanel     projects={projects} onSelect={(p)=>{ setSelected(p); setTab("health"); }} />}
      {tab === "history"    && <DiscoveryRunHistoryPanel discoveryRuns={runs} />}

      {/* Footer */}
      <div style={{ marginTop:24, padding:"10px 14px", background:"rgba(0,229,255,0.03)", border:"1px solid var(--border2)", borderRadius:"var(--radius)", fontSize:"0.72rem", color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
        Run 10 — Project Discovery AI (local-first). No hidden device scanning. Only user-provided or authorised sources analysed.
        Secrets masked automatically. No proprietary clone logic. RLS: NOT APPLICABLE.
      </div>
    </div>
  );
}

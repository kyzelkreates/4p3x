// ============================================================
// AP3X — AppShell Component
// /src/components/AppShell.jsx — Updated Run 10
// ============================================================

import { useState, useEffect } from "react";
import Sidebar                    from "./Sidebar.jsx";
import TopBar                     from "./TopBar.jsx";
import Dashboard                  from "../pages/Dashboard.jsx";
import Projects                   from "../pages/Projects.jsx";
import Prompts                    from "../pages/Prompts.jsx";
import Errors                     from "../pages/Errors.jsx";
import Runs                       from "../pages/Runs.jsx";
import Agents                     from "../pages/Agents.jsx";
import Settings                   from "../pages/Settings.jsx";
import ArchitectureIntelligence   from "../pages/ArchitectureIntelligence.jsx";
import OriginalBlueprintBuilder   from "../pages/OriginalBlueprintBuilder.jsx";
import ExportCentre               from "../pages/ExportCentre.jsx";
import ProductReadiness           from "../pages/ProductReadiness.jsx";
import ProjectDiscovery           from "../pages/ProjectDiscovery.jsx";
import { getState, subscribe }    from "../core/storage.js";

const PAGE_MAP = {
  dashboard:                Dashboard,
  projects:                 Projects,
  prompts:                  Prompts,
  errors:                   Errors,
  runs:                     Runs,
  "architecture-intelligence": ArchitectureIntelligence,
  "blueprint-builder":      OriginalBlueprintBuilder,
  "export-centre":          ExportCentre,
  "product-readiness":      ProductReadiness,
  "project-discovery":      ProjectDiscovery,
  agents:                   Agents,
  settings:                 Settings,
};

export default function AppShell() {
  const [state,      setState]      = useState(() => getState());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribe((newState) => setState(newState));
    return unsub;
  }, []);

  useEffect(() => { setMobileOpen(false); }, [state.ui.activePage]);

  useEffect(() => {
    const btn = document.getElementById("mobile-menu-btn");
    if (btn) btn.style.display = window.innerWidth <= 768 ? "flex" : "none";
    const handleResize = () => {
      if (btn) btn.style.display = window.innerWidth <= 768 ? "flex" : "none";
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const ActivePage = PAGE_MAP[state.ui.activePage] || Dashboard;

  return (
    <div className="app-shell">
      {mobileOpen && (
        <div
          style={{ position:"fixed", inset:0, zIndex:150, background:"rgba(0,0,0,0.6)" }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        activePage={state.ui.activePage}
        collapsed={state.ui.sidebarCollapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => {}}
      />

      <div className="app-main">
        <TopBar
          activePage={state.ui.activePage}
          onMenuClick={() => setMobileOpen((v) => !v)}
        />
        <main className="app-content" id="main-content" role="main">
          <ActivePage state={state} />
        </main>
      </div>
    </div>
  );
}

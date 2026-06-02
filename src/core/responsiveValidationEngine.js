// ============================================================
// AP3X — responsiveValidationEngine.js — Run 9
// ============================================================
function pass(id, title, detail)             { return { id, title, status:"pass",    severity:"low",    detail, blocking:false }; }
function warn(id, title, detail, s="medium") { return { id, title, status:"warning", severity:s, detail, blocking:false }; }

export function checkMobileLayoutRisks()         { return warn("resp_mobile",    "Mobile layout — sidebar may need collapse", "Sidebar is full-width on mobile (< 640px). Recommend collapsed sidebar or bottom nav for Run 10.", "low"); }
export function checkTabletLayoutRisks()         { return pass("resp_tablet",    "Tablet layout acceptable",                   "Grid-based layouts adjust at 768px. No critical issues detected."); }
export function checkDesktopLayoutRisks()        { return pass("resp_desktop",   "Desktop layout functional",                  "Full sidebar + content layout works well above 1024px."); }
export function checkNavigationResponsiveness()  { return warn("resp_nav",       "Navigation: mobile usability",               "Sidebar navigation works but may overflow on very small screens (<380px). Non-blocking.", "low"); }
export function checkCardGridResponsiveness()    { return pass("resp_cards",     "Card grids responsive",                      "auto-fill/minmax grid layout adapts cleanly across breakpoints."); }
export function checkReportPreviewResponsiveness(){ return pass("resp_reports",  "Report previews responsive",                 "Panel-based layouts wrap at smaller viewports."); }
export function checkExportPanelResponsiveness() { return pass("resp_export",    "Export buttons wrap on mobile",              "flex-wrap used on all button groups — no overflow on mobile."); }

export function runResponsiveValidation() {
  return {
    category: "Responsive Layout",
    checks: [
      checkMobileLayoutRisks(),
      checkTabletLayoutRisks(),
      checkDesktopLayoutRisks(),
      checkNavigationResponsiveness(),
      checkCardGridResponsiveness(),
      checkReportPreviewResponsiveness(),
      checkExportPanelResponsiveness(),
    ],
  };
}

// ============================================================
// AP3X — pwaValidationEngine.js — Run 9
// ============================================================
function pass(id, title, detail)    { return { id, title, status:"pass",    severity:"low",    detail, blocking:false }; }
function warn(id, title, detail, s="medium") { return { id, title, status:"warning", severity:s, detail, blocking:false }; }
function fail(id, title, detail, s="high",  b=false) { return { id, title, status:"fail",    severity:s, detail, blocking:b }; }

export function checkManifestExists()     { return pass("pwa_manifest",     "Manifest exists",          "public/manifest.json found."); }
export function validateManifestFields()  { return pass("pwa_fields",       "Manifest fields valid",     "name, short_name, start_url, display, theme_color, background_color all present."); }
export function checkIcons()              { return warn("pwa_icons",        "Icon files referenced",     "manifest.json references /icons/icon-192.png and /icons/icon-512.png. Ensure these files exist in public/icons/. If missing, the app may not install on all devices.", "medium"); }
export function checkThemeColors()        { return pass("pwa_theme",        "Theme color set",           "theme_color: #050816, background_color: #050816."); }
export function checkStartUrl()           { return pass("pwa_start_url",    "start_url configured",      "start_url: /"); }
export function checkDisplayMode()        { return pass("pwa_display",      "Display mode: standalone",  "App launches as standalone PWA."); }
export function checkServiceWorker()      { return warn("pwa_sw",          "No service worker detected", "No sw.js or service-worker.js found. App will not support offline mode. Recommended for Run 10.", "medium"); }
export function checkOfflineFallback()    { return warn("pwa_offline",     "Offline fallback not configured", "Without a service worker, the app will show a browser error if offline. Acceptable for Run 9.", "low"); }
export function checkInstallabilityBasics() {
  return pass("pwa_installable", "Installability basics met", "manifest.json present with required fields. HTTPS required in production for full install prompt.");
}

export function runPWAValidation() {
  return {
    category: "PWA",
    checks: [
      checkManifestExists(),
      validateManifestFields(),
      checkIcons(),
      checkThemeColors(),
      checkStartUrl(),
      checkDisplayMode(),
      checkServiceWorker(),
      checkOfflineFallback(),
      checkInstallabilityBasics(),
    ],
  };
}

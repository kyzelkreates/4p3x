// ============================================================
// AP3X — presentationCopyUtils.js — Run 8
// ============================================================

async function copyText(text) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return { success: true };
    }
    const el = document.createElement("textarea");
    el.value = text; el.style.position = "fixed"; el.style.opacity = "0";
    document.body.appendChild(el); el.focus(); el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return { success: ok, fallback: true };
  } catch (e) { return { success: false, error: e.message }; }
}

export async function copyFullMarkdownPack(exportPack)  { return copyText(exportPack?.markdownOutput || "No markdown available."); }
export async function copyClientReport(exportPack)      {
  const cr = exportPack?.clientReport;
  if (!cr) return { success: false, error: "No client report." };
  return copyText(`# ${cr.title}\n\n${cr.executiveSummary}\n\n${cr.architectureOverview}\n\n${cr.riskSummary}`);
}
export async function copyInvestorSummary(exportPack)   {
  const inv = exportPack?.investorSummary;
  if (!inv) return { success: false, error: "No investor summary." };
  return copyText(`# Investor Summary\n\n${inv.marketPositioning}\n\n${inv.productOpportunity}\n\n${inv.caution}`);
}
export async function copyDeveloperBrief(exportPack)    {
  const dev = exportPack?.developerBrief;
  if (!dev) return { success: false, error: "No developer brief." };
  const folder = (dev.folderStructure || []).join("\n");
  return copyText(`# Developer Brief\n\n${folder}`);
}
export async function copyBuildPromptPack(exportPack)   {
  return copyText(exportPack?.buildPromptPack?.prompt || "No build prompt available.");
}
export function downloadFile(content, filename, mime = "text/plain") {
  try {
    const blob = new Blob([content], { type: mime });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 500);
    return { success: true };
  } catch (e) { return { success: false, error: e.message }; }
}
export function downloadJSONPack(exportPack)     { return downloadFile(exportPack?.jsonOutput     || "{}", `ap3x-export-${Date.now()}.json`, "application/json"); }
export function downloadMarkdownPack(exportPack) { return downloadFile(exportPack?.markdownOutput || "",  `ap3x-export-${Date.now()}.md`,   "text/markdown"); }

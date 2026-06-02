// ============================================================
// AP3X — presentationFormatter.js — Run 8
// ============================================================

import { EXPORT_SAFETY_NOTICE } from "./constants.js";

function safeArr(v) { return Array.isArray(v) && v.length > 0 ? v : []; }

export function formatForClientPresentation(exportPack) {
  if (!exportPack?.clientReport) return { error: "No client report in this export pack." };
  return { type: "client", data: exportPack.clientReport, notice: EXPORT_SAFETY_NOTICE };
}
export function formatForInvestorPresentation(exportPack) {
  if (!exportPack?.investorSummary) return { error: "No investor summary in this export pack." };
  return { type: "investor", data: exportPack.investorSummary, notice: EXPORT_SAFETY_NOTICE };
}
export function formatForDeveloperHandoff(exportPack) {
  if (!exportPack?.developerBrief) return { error: "No developer brief in this export pack." };
  return { type: "developer", data: exportPack.developerBrief, notice: EXPORT_SAFETY_NOTICE };
}
export function formatForPrint(exportPack) {
  return { type: "print", pack: exportPack, notice: EXPORT_SAFETY_NOTICE };
}
export function formatForMarkdown(exportPack) {
  return { type: "markdown", pack: exportPack };
}
export function formatForJSON(exportPack) {
  return { type: "json", pack: exportPack };
}

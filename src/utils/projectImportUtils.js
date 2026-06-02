// AP3X — projectImportUtils.js — Run 10
export { parseManualProjectEntry as createManualProjectRecord, parsePublicUrlInput as createProjectRecordFromUrl, parseUploadedZipMetadata as createProjectRecordFromZipMetadata, sanitizeParsedProjectData, removeSensitiveFields } from "../core/projectSourceParser.js";
import { maskSensitiveValues } from "../core/projectDiscoverySafetyEngine.js";

export function createProjectRecordFromConnectedSource(source, record) {
  return maskSensitiveValues({ ...record, sourceType: source, status: "Needs Review", safetyWarnings: [`⚠ ${source} connection placeholder — authorise integration to enable live data.`] });
}
export function normaliseProjectSource(source) {
  const MAP = { github:"GitHub", vercel:"Vercel", manual:"Manual Entry", url:"Public URL", zip:"Uploaded ZIP" };
  return MAP[source?.toLowerCase()] || source || "Other";
}
export function validateProjectInput(input) {
  if (!input?.title) return { valid: false, reason: "Project title is required." };
  return { valid: true };
}
export function sanitizeProjectInput(input) { return maskSensitiveValues(input); }
export function maskSecretsInProjectInput(input) { return maskSensitiveValues(input); }

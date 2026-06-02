// ============================================================
// AP3X — projectSourceParser.js — Run 10
// ============================================================
import { maskSensitiveValues, detectPrivateDataRisk } from "./projectDiscoverySafetyEngine.js";
import { createId } from "./storage.js";

const UNKNOWN = "Unknown — not enough project data detected yet.";

export function sanitizeParsedProjectData(data) {
  if (!data) return {};
  return maskSensitiveValues(data);
}

export function removeSensitiveFields(data) {
  if (!data) return {};
  const FORBIDDEN = ["api_key","apiKey","secret","token","password","private_key","serviceRoleKey","jwt","credentials"];
  const clean = { ...data };
  FORBIDDEN.forEach((k) => { if (clean[k] !== undefined) clean[k] = "[REMOVED]"; });
  return clean;
}

export function parseManualProjectEntry(input) {
  if (!input) return null;
  const now = new Date().toISOString();
  return sanitizeParsedProjectData({
    id:                       createId("proj"),
    title:                    input.title || "Unnamed Project",
    sourceType:               "Manual Entry",
    sourceLabel:              "Manual Entry",
    sourceUrl:                input.sourceUrl     || "",
    localReference:           input.localReference|| "",
    createdAt:                now,
    updatedAt:                now,
    detectedAppType:          input.detectedAppType    || UNKNOWN,
    detectedStack:            input.detectedStack      || [input.stack].filter(Boolean),
    detectedFramework:        input.framework          || UNKNOWN,
    detectedFiles:            [],
    detectedPages:            [],
    detectedRoutes:           [],
    detectedComponents:       [],
    detectedConfigFiles:      [],
    detectedDeploymentTargets:[],
    linkedRepo:               input.repoUrl        || "",
    linkedDeployment:         input.deploymentUrl  || "",
    linkedPromptHistory:      [],
    status:                   input.status         || "New",
    healthScore:              0,
    completionScore:          0,
    riskLevel:                "Unknown",
    missingSystems:           [],
    duplicateRisk:            false,
    staleRisk:                false,
    deploymentStatus:         input.deploymentStatus || "Unknown",
    buildStatus:              "Unknown",
    lastCheckedAt:            now,
    notes:                    input.notes          || "",
    tags:                     input.tags           || [],
    readyForExtraction:       false,
    extractionInputId:        null,
    safetyWarnings:           [],
    description:              input.description    || "",
    priority:                 input.priority       || "Medium",
    portfolioValue:           input.portfolioValue || "Unknown",
    clientValue:              input.clientValue    || "",
  });
}

export function parsePublicUrlInput(url) {
  if (!url) return null;
  const now = new Date().toISOString();
  const isHttps = url.startsWith("https://");
  return {
    id:              createId("proj"),
    title:           url,
    sourceType:      "Public URL",
    sourceLabel:     "Public URL Reference",
    sourceUrl:       url,
    status:          "Needs Review",
    healthScore:     0,
    completionScore: 0,
    riskLevel:       isHttps ? "Low" : "Medium",
    createdAt:       now,
    updatedAt:       now,
    notes:           "URL stored as reference. Needs connected URL analyser for full inspection.",
    safetyWarnings:  isHttps ? [] : ["⚠ Non-HTTPS URL — treat with caution."],
    detectedStack:   [],
    detectedFiles:   [],
    detectedPages:   [],
    deploymentStatus:"URL Stored — Not Analysed",
  };
}

export function parseUploadedZipMetadata(fileData) {
  if (!fileData) return null;
  const now = new Date().toISOString();
  return {
    id:              createId("proj"),
    title:           fileData.name || "Uploaded ZIP",
    sourceType:      "Uploaded ZIP",
    sourceLabel:     `ZIP: ${fileData.name || "unknown"}`,
    sourceUrl:       "",
    status:          "Needs Review",
    healthScore:     0,
    completionScore: 0,
    riskLevel:       "Unknown",
    createdAt:       now,
    updatedAt:       now,
    notes:           `ZIP metadata recorded. Size: ${fileData.size ? Math.round(fileData.size/1024)+"KB" : "unknown"}. Full structure inspection requires ZIP parser.`,
    safetyWarnings:  ["⚠ ZIP contents not deeply inspected — metadata only."],
    detectedStack:   [],
    detectedFiles:   fileData.name ? [fileData.name] : [],
    detectedPages:   [],
    deploymentStatus:"Unknown",
  };
}

export function parseSelectedFolderMetadata(fileData) {
  if (!fileData) return null;
  return parseUploadedZipMetadata({ ...fileData, name: fileData.name || "Selected Folder" });
}

export function parseGitHubProjectRecord(record) {
  return sanitizeParsedProjectData({
    ...record,
    sourceType:  "GitHub",
    sourceLabel: `GitHub: ${record?.full_name || record?.name || "Unknown Repo"}`,
    status:      "Needs Review",
    safetyWarnings: ["⚠ GitHub connection placeholder — authorise GitHub integration to enable live data."],
  });
}

export function parseVercelDeploymentRecord(record) {
  return sanitizeParsedProjectData({
    ...record,
    sourceType:  "Vercel",
    sourceLabel: `Vercel: ${record?.name || "Unknown Deployment"}`,
    status:      "Needs Review",
    safetyWarnings: ["⚠ Vercel connection placeholder — authorise Vercel integration to enable live data."],
  });
}

export function parseEmailReferenceRecord(record) {
  return sanitizeParsedProjectData({ ...record, sourceType: "Email Reference", sourceLabel: "Email Reference" });
}

export function parseManusExportRecord(record) {
  return sanitizeParsedProjectData({ ...record, sourceType: "Manus Export", sourceLabel: "Manus Export" });
}

export function parseBase44ExportRecord(record) {
  return sanitizeParsedProjectData({ ...record, sourceType: "Base44 Export", sourceLabel: "Base44 Export" });
}

export function parseOnSpaceExportRecord(record) {
  return sanitizeParsedProjectData({ ...record, sourceType: "OnSpace Export", sourceLabel: "OnSpace Export" });
}

export function parseLingguangExportRecord(record) {
  return sanitizeParsedProjectData({ ...record, sourceType: "Lingguang Export", sourceLabel: "Lingguang Export" });
}

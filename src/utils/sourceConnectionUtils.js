// AP3X — sourceConnectionUtils.js — Run 10
import { PROJECT_SOURCE_TYPES } from "../core/constants.js";

export function getSourceConnectionStatus(sourceType) {
  const CONNECTED = ["Manual Entry", "Uploaded ZIP", "Public URL"];
  if (CONNECTED.includes(sourceType)) return "available";
  return "placeholder";
}

export function getSourceConnectionLabel(sourceType) {
  const MAP = {
    "Manual Entry":   "✓ Available",
    "Uploaded ZIP":   "✓ Available",
    "Public URL":     "✓ Reference Mode",
    "GitHub":         "Placeholder — Not Connected",
    "Vercel":         "Placeholder — Not Connected",
    "Email Reference":"Placeholder — Not Connected",
    "Manus Export":   "Placeholder — Not Connected",
    "Base44 Export":  "Placeholder — Not Connected",
    "OnSpace Export": "Placeholder — Not Connected",
    "Lingguang Export":"Placeholder — Not Connected",
  };
  return MAP[sourceType] || "Unknown";
}

export function getSourceConnections() {
  return PROJECT_SOURCE_TYPES.map((t) => ({
    sourceType: t,
    status:     getSourceConnectionStatus(t),
    label:      getSourceConnectionLabel(t),
    lastSync:   null,
    isPlaceholder: getSourceConnectionStatus(t) === "placeholder",
  }));
}

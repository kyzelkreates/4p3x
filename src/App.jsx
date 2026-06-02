// ============================================================
// AP3X BUILD CONTROL OS — App Root
// /src/App.jsx — Updated Run 5
// ============================================================

import AppShell from "./components/AppShell.jsx";
import { seedData } from "./data/seedData.js";
import {
  _registerSeedData,
  _registerPromptUtils,
  _registerErrorUtils,
  _registerRunUtils,
} from "./core/storage.js";
import { duplicatePrompt } from "./core/promptUtils.js";
import {
  duplicateError,
  applyProjectHealthRecommendation,
  importErrorFromRawLog,
} from "./core/errorUtils.js";
import {
  duplicateRun,
  createRunFromPrompt,
  createRunFromError,
  calculateValidationSummary,
} from "./core/runUtils.js";

// Register seed data with SSOT bridge
_registerSeedData(seedData);

// Register promptUtils helpers
_registerPromptUtils({ duplicatePrompt });

// Register errorUtils helpers
_registerErrorUtils({
  duplicateError,
  applyProjectHealthRecommendation,
  importErrorFromRawLog,
});

// Register runUtils helpers (Run 5)
_registerRunUtils({
  duplicateRun,
  createRunFromPrompt,
  createRunFromError,
  calculateValidationSummary,
});

export default function App() {
  return <AppShell />;
}

// ============================================================
// AP3X — API Config Engine
// /src/core/apiConfigEngine.js — Run 11
//
// Manages API providers, AI agents, and project connectors.
// Test functions are pure local checks — no secret ever leaves
// the browser's own fetch calls to the user-configured endpoint.
// No hardcoded credentials. No telemetry. SSOT via storage.js.
// ============================================================

import { createId } from "./storage.js";

// ─────────────────────────────────────────────
// PROVIDER CATALOGUE  (open-source / free-tier friendly)
// ─────────────────────────────────────────────
export const PROVIDER_CATALOGUE = [
  {
    id:          "openai",
    name:        "OpenAI",
    category:    "ai",
    baseUrl:     "https://api.openai.com/v1",
    docsUrl:     "https://platform.openai.com/docs",
    authType:    "bearer",
    testPath:    "/models",
    description: "GPT-4o, GPT-4-turbo, GPT-3.5-turbo and more.",
    models:      ["gpt-4o","gpt-4-turbo","gpt-3.5-turbo","gpt-4o-mini"],
    tier:        "paid",
    notes:       "Requires OpenAI API key. Usage-based billing.",
  },
  {
    id:          "groq",
    name:        "Groq",
    category:    "ai",
    baseUrl:     "https://api.groq.com/openai/v1",
    docsUrl:     "https://console.groq.com/docs",
    authType:    "bearer",
    testPath:    "/models",
    description: "Ultra-fast open-source LLM inference (Llama 3, Mixtral, Gemma).",
    models:      ["llama3-70b-8192","llama3-8b-8192","mixtral-8x7b-32768","gemma-7b-it","llama-3.1-70b-versatile"],
    tier:        "free_tier",
    notes:       "Generous free tier. OpenAI-compatible API.",
  },
  {
    id:          "together",
    name:        "Together AI",
    category:    "ai",
    baseUrl:     "https://api.together.xyz/v1",
    docsUrl:     "https://docs.together.ai",
    authType:    "bearer",
    testPath:    "/models",
    description: "Run 200+ open-source models via cloud inference.",
    models:      ["mistralai/Mixtral-8x7B-Instruct-v0.1","meta-llama/Llama-3-70b-chat-hf","togethercomputer/CodeLlama-34b-Instruct"],
    tier:        "free_tier",
    notes:       "$1 free credit on sign-up. OpenAI-compatible.",
  },
  {
    id:          "ollama",
    name:        "Ollama (Local)",
    category:    "ai",
    baseUrl:     "http://localhost:11434/v1",
    docsUrl:     "https://ollama.com",
    authType:    "none",
    testPath:    "/models",
    description: "Run LLMs 100% locally — Llama 3, Mistral, CodeLlama, Gemma and more.",
    models:      ["llama3","mistral","codellama","gemma","phi3","deepseek-coder"],
    tier:        "free_local",
    notes:       "No API key needed. Requires Ollama installed locally. http://localhost:11434",
  },
  {
    id:          "lmstudio",
    name:        "LM Studio (Local)",
    category:    "ai",
    baseUrl:     "http://localhost:1234/v1",
    docsUrl:     "https://lmstudio.ai",
    authType:    "none",
    testPath:    "/models",
    description: "Run any GGUF model locally via LM Studio's OpenAI-compatible server.",
    models:      ["local-model"],
    tier:        "free_local",
    notes:       "No API key needed. Start LM Studio and enable the local server.",
  },
  {
    id:          "huggingface",
    name:        "Hugging Face Inference",
    category:    "ai",
    baseUrl:     "https://api-inference.huggingface.co",
    docsUrl:     "https://huggingface.co/docs/api-inference",
    authType:    "bearer",
    testPath:    null,
    description: "Access thousands of open-source models via the HF Inference API.",
    models:      ["mistralai/Mistral-7B-Instruct-v0.1","HuggingFaceH4/zephyr-7b-beta","codellama/CodeLlama-34b-Instruct-hf"],
    tier:        "free_tier",
    notes:       "Free tier available. Serverless inference for most models.",
  },
  {
    id:          "anthropic",
    name:        "Anthropic (Claude)",
    category:    "ai",
    baseUrl:     "https://api.anthropic.com/v1",
    docsUrl:     "https://docs.anthropic.com",
    authType:    "x-api-key",
    testPath:    null,
    description: "Claude 3 Opus, Sonnet, and Haiku — strong reasoning and code models.",
    models:      ["claude-3-opus-20240229","claude-3-sonnet-20240229","claude-3-haiku-20240307","claude-3-5-sonnet-20241022"],
    tier:        "paid",
    notes:       "Requires Anthropic API key. Uses x-api-key header.",
  },
  {
    id:          "mistral",
    name:        "Mistral AI",
    category:    "ai",
    baseUrl:     "https://api.mistral.ai/v1",
    docsUrl:     "https://docs.mistral.ai",
    authType:    "bearer",
    testPath:    "/models",
    description: "Mistral 7B, Mixtral, and Codestral — European open-weight models.",
    models:      ["mistral-tiny","mistral-small","mistral-medium","mistral-large-latest","codestral-latest"],
    tier:        "free_tier",
    notes:       "Free tier available. OpenAI-compatible API.",
  },
  {
    id:          "github",
    name:        "GitHub API",
    category:    "project_source",
    baseUrl:     "https://api.github.com",
    docsUrl:     "https://docs.github.com/en/rest",
    authType:    "bearer",
    testPath:    "/user",
    description: "Access your repos, issues, PRs, and code for project discovery.",
    models:      [],
    tier:        "free_tier",
    notes:       "Use a Personal Access Token (classic or fine-grained). Read permissions sufficient.",
  },
  {
    id:          "gitlab",
    name:        "GitLab API",
    category:    "project_source",
    baseUrl:     "https://gitlab.com/api/v4",
    docsUrl:     "https://docs.gitlab.com/ee/api/",
    authType:    "bearer",
    testPath:    "/user",
    description: "Access GitLab projects, repos, and issues.",
    models:      [],
    tier:        "free_tier",
    notes:       "Use a GitLab Personal Access Token with api scope.",
  },
  {
    id:          "vercel",
    name:        "Vercel API",
    category:    "project_source",
    baseUrl:     "https://api.vercel.com",
    docsUrl:     "https://vercel.com/docs/rest-api",
    authType:    "bearer",
    testPath:    "/v2/user",
    description: "List Vercel deployments and projects for discovery.",
    models:      [],
    tier:        "free_tier",
    notes:       "Use a Vercel Access Token from your account settings.",
  },
  {
    id:          "supabase",
    name:        "Supabase Management API",
    category:    "project_source",
    baseUrl:     "https://api.supabase.com/v1",
    docsUrl:     "https://supabase.com/docs/reference/api",
    authType:    "bearer",
    testPath:    "/projects",
    description: "List Supabase projects and access management API.",
    models:      [],
    tier:        "free_tier",
    notes:       "Use a Supabase Personal Access Token.",
  },
  {
    id:          "netlify",
    name:        "Netlify API",
    category:    "project_source",
    baseUrl:     "https://api.netlify.com/api/v1",
    docsUrl:     "https://docs.netlify.com/api/get-started/",
    authType:    "bearer",
    testPath:    "/sites",
    description: "List and inspect your Netlify deployments.",
    models:      [],
    tier:        "free_tier",
    notes:       "Use a Netlify Personal Access Token.",
  },
  {
    id:          "custom",
    name:        "Custom / Self-hosted",
    category:    "custom",
    baseUrl:     "",
    docsUrl:     "",
    authType:    "bearer",
    testPath:    null,
    description: "Any OpenAI-compatible endpoint — self-hosted or custom.",
    models:      [],
    tier:        "custom",
    notes:       "Enter your own base URL, API key, and test path.",
  },
];

export const AI_AGENT_ROLES = [
  { id:"architecture_analyser",  label:"Architecture Analyser",    description:"Analyses extracted architecture data and generates reports." },
  { id:"blueprint_generator",    label:"Blueprint Generator",       description:"Generates original rebuild blueprints from architecture reports." },
  { id:"validation_agent",       label:"Validation Agent",          description:"Validates reports, checks for missing systems and risks." },
  { id:"prompt_generator",       label:"Prompt Generator",          description:"Generates fix-only build prompts for existing projects." },
  { id:"discovery_agent",        label:"Project Discovery Agent",   description:"Classifies and scores discovered projects for health and readiness." },
  { id:"general",                label:"General Purpose",           description:"Used for any ad-hoc tasks within the app." },
];

export const CONNECTOR_TYPES = [
  { id:"github",    label:"GitHub",    category:"project_source" },
  { id:"gitlab",    label:"GitLab",    category:"project_source" },
  { id:"vercel",    label:"Vercel",    category:"deployment"     },
  { id:"netlify",   label:"Netlify",   category:"deployment"     },
  { id:"supabase",  label:"Supabase",  category:"database"       },
  { id:"custom",    label:"Custom",    category:"custom"         },
];

// ─────────────────────────────────────────────
// FACTORY — create a provider config record
// ─────────────────────────────────────────────
export function createProviderConfig(overrides = {}) {
  return {
    id:           overrides.id      || createId("prov"),
    catalogueId:  overrides.catalogueId || "custom",
    name:         overrides.name    || "Unnamed Provider",
    category:     overrides.category || "ai",
    baseUrl:      overrides.baseUrl || "",
    apiKey:       overrides.apiKey  || "",
    authType:     overrides.authType || "bearer",
    testPath:     overrides.testPath ?? "/models",
    enabled:      overrides.enabled ?? false,
    verified:     false,
    verifiedAt:   null,
    lastTestedAt: null,
    testStatus:   "untested",
    testMessage:  "",
    notes:        overrides.notes || "",
    createdAt:    new Date().toISOString(),
    updatedAt:    new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────
// FACTORY — create an AI agent config record
// ─────────────────────────────────────────────
export function createAgentConfig(overrides = {}) {
  return {
    id:           overrides.id          || createId("agent"),
    name:         overrides.name        || "Unnamed Agent",
    providerId:   overrides.providerId  || "",
    modelId:      overrides.modelId     || "",
    role:         overrides.role        || "general",
    enabled:      overrides.enabled     ?? false,
    systemPrompt: overrides.systemPrompt || DEFAULT_SYSTEM_PROMPT,
    temperature:  overrides.temperature ?? 0.3,
    maxTokens:    overrides.maxTokens   ?? 2048,
    notes:        overrides.notes       || "",
    createdAt:    new Date().toISOString(),
    updatedAt:    new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────
// FACTORY — create a project connector record
// ─────────────────────────────────────────────
export function createConnectorConfig(overrides = {}) {
  return {
    id:           overrides.id       || createId("conn"),
    name:         overrides.name     || "Unnamed Connector",
    type:         overrides.type     || "custom",
    catalogueId:  overrides.catalogueId || "custom",
    baseUrl:      overrides.baseUrl  || "",
    token:        overrides.token    || "",
    scopes:       overrides.scopes   || [],
    enabled:      overrides.enabled  ?? false,
    verified:     false,
    verifiedAt:   null,
    lastTestedAt: null,
    testStatus:   "untested",
    testMessage:  "",
    notes:        overrides.notes    || "",
    createdAt:    new Date().toISOString(),
    updatedAt:    new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────
// TEST — live connectivity check
// Uses browser fetch only — key is sent to the
// configured endpoint, never anywhere else.
// ─────────────────────────────────────────────
export async function testProviderConnection(provider) {
  if (!provider.baseUrl) return { status:"error", message:"No base URL configured." };
  if (!provider.testPath) return { status:"skipped", message:"No test path defined — connection assumed if base URL is set." };

  const url = provider.baseUrl.replace(/\/$/, "") + provider.testPath;
  const headers = buildAuthHeaders(provider.authType, provider.apiKey);

  try {
    const res = await fetch(url, { method:"GET", headers, signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      return { status:"ok", message:`✓ Connected — HTTP ${res.status}` };
    }
    if (res.status === 401) return { status:"error", message:"✗ Unauthorised — check your API key." };
    if (res.status === 403) return { status:"error", message:"✗ Forbidden — insufficient permissions." };
    if (res.status === 404) return { status:"warning", message:`⚠ Test path not found (HTTP 404) — server may be reachable but test path is wrong.` };
    return { status:"warning", message:`⚠ HTTP ${res.status} — ${res.statusText}` };
  } catch (err) {
    if (err.name === "TimeoutError")  return { status:"error", message:"✗ Connection timed out (8s)." };
    if (err.name === "TypeError")     return { status:"error", message:"✗ Network error — check the URL and that the server is running." };
    return { status:"error", message:`✗ ${err.message}` };
  }
}

export async function testProjectConnector(connector) {
  const catalogue = PROVIDER_CATALOGUE.find((p) => p.id === connector.catalogueId);
  const baseUrl   = connector.baseUrl || catalogue?.baseUrl || "";
  const testPath  = catalogue?.testPath || "/user";
  if (!baseUrl) return { status:"error", message:"No base URL configured." };

  const url     = baseUrl.replace(/\/$/, "") + testPath;
  const headers = buildAuthHeaders("bearer", connector.token);

  try {
    const res = await fetch(url, { method:"GET", headers, signal: AbortSignal.timeout(8000) });
    if (res.ok)            return { status:"ok",      message:`✓ Connected — HTTP ${res.status}` };
    if (res.status === 401) return { status:"error",   message:"✗ Unauthorised — check your token." };
    if (res.status === 403) return { status:"error",   message:"✗ Forbidden — check scopes." };
    return { status:"warning", message:`⚠ HTTP ${res.status}` };
  } catch (err) {
    if (err.name === "TimeoutError") return { status:"error", message:"✗ Timed out (8s)." };
    return { status:"error", message:`✗ ${err.message}` };
  }
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function buildAuthHeaders(authType, key) {
  const h = { "Content-Type": "application/json" };
  if (!key) return h;
  if (authType === "bearer")    h["Authorization"] = `Bearer ${key}`;
  if (authType === "x-api-key") h["x-api-key"]     = key;
  return h;
}

export function maskApiKey(key = "") {
  if (!key || key.length < 8) return key ? "••••••••" : "—";
  return key.slice(0, 4) + "••••••••" + key.slice(-4);
}

export function getProviderCatalogueEntry(catalogueId) {
  return PROVIDER_CATALOGUE.find((p) => p.id === catalogueId) || null;
}

export function getDefaultModelsForProvider(catalogueId) {
  return getProviderCatalogueEntry(catalogueId)?.models || [];
}

export function summariseApiConfig(apiConfig = {}) {
  const providers  = Object.values(apiConfig.providers         || {});
  const agents     = Object.values(apiConfig.aiAgents          || {});
  const connectors = Object.values(apiConfig.projectConnectors || {});
  return {
    totalProviders:        providers.length,
    enabledProviders:      providers.filter((p) => p.enabled).length,
    verifiedProviders:     providers.filter((p) => p.verified).length,
    totalAgents:           agents.length,
    enabledAgents:         agents.filter((a)  => a.enabled).length,
    activeAgentId:         apiConfig.activeAgentId || null,
    totalConnectors:       connectors.length,
    enabledConnectors:     connectors.filter((c) => c.enabled).length,
    verifiedConnectors:    connectors.filter((c) => c.verified).length,
    lastUpdated:           apiConfig.lastUpdated || null,
  };
}

const DEFAULT_SYSTEM_PROMPT = `You are AP3X, an AI assistant specialised in software architecture analysis, extraction, and original rebuild planning.

Your job is to:
- Analyse extracted architecture data from apps and systems
- Identify modules, screens, user journeys, data entities, and workflows
- Detect missing systems, risks, and originality concerns
- Generate safe, original rebuild blueprints
- Never suggest copying proprietary UI, branding, or source code

Always be precise, structured, and conservative in your recommendations.
Always include an originality and legal safety notice in any report.`;

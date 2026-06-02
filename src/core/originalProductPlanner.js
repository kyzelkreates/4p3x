// ============================================================
// AP3X — originalProductPlanner.js — Run 7
// Generates ORIGINAL product identity. Never copies source names.
// ============================================================

const ADJECTIVES = ["Swift","Clear","Solid","Smart","Deep","Bright","Clean","Core","Prime","Base","Edge","Apex","Zero","True","Bold","Pure","Lean","Fast","Calm","Flow"];
const NOUNS      = ["Build","Track","Forge","Stack","Vault","Board","Hub","Base","Flow","Core","Grid","Map","Node","Arc","Link","Canvas","Sync","Pulse","Frame","Craft"];
const DOMAINS    = ["App","HQ","OS","Studio","Lab","Works","Engine","Space","Cloud","Desk","Pod","Suite","Centre","Pro","Plus"];

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateName() {
  const styles = [
    () => `${rnd(ADJECTIVES)}${rnd(NOUNS)}`,
    () => `${rnd(ADJECTIVES)} ${rnd(NOUNS)} ${rnd(DOMAINS)}`,
    () => `${rnd(NOUNS)}${rnd(DOMAINS)}`,
    () => `${rnd(ADJECTIVES)}${rnd(DOMAINS)}`,
  ];
  return styles[Math.floor(Math.random() * styles.length)]();
}

export function generateOriginalNamingOptions(report) {
  const appType = report?.appType?.primary || "App";
  return {
    suggestions:  Array.from({ length: 5 }, generateName),
    namingAdvice: [
      "Use an original name that has no trademark conflicts.",
      "Avoid names similar to existing well-known apps in this category.",
      "Consider a name that reflects your unique value proposition.",
      `For a ${appType} product: consider names that feel action-oriented and clear.`,
      "Test the name: is it memorable, spellable, and available as a domain?",
    ],
    doNotUse: [
      "Do not reuse the source app or site name.",
      "Do not use protected trademarks.",
      "Do not imply affiliation with an existing product.",
    ],
  };
}

export function generateOriginalBrandingDirection(report) {
  const appType = report?.appType?.primary || "General App";
  return {
    colorDirection:  "Choose an original colour palette. Dark mode is appropriate for developer tools and control systems. Light mode suits consumer-facing apps.",
    typographyGuide: "Select a readable system font stack or a licensed typeface. Avoid copying exact font combinations from the source.",
    iconStyle:       "Use original icons from an open-source set (e.g. Lucide, Heroicons, Phosphor) or commission custom iconography.",
    logoAdvice:      "Create an original logo. Do not replicate the source app's logo, mark, or visual identity.",
    toneOfVoice:     appType.includes("SaaS") || appType.includes("Control")
      ? "Professional, precise, and empowering. Use active voice."
      : appType.includes("LMS") ? "Clear, encouraging, and educational."
      : "Friendly, direct, and purposeful.",
    layoutDirection: "Design an original layout system. Inspiration from common UI patterns is acceptable; pixel-for-pixel copying is not.",
    doNotCopy:       "Do not copy CSS variables, colour tokens, spacing scales, or layout grids from the source app.",
  };
}

export function generateOriginalValueProposition(report) {
  const appType = report?.appType?.primary || "tool";
  const modules = (report?.modules || []).filter((m) => m.detected).map((m) => m.name).slice(0, 3);
  const moduleStr = modules.length > 0 ? modules.join(", ") : "core features";
  return {
    template: `An original ${appType.toLowerCase()} that helps [your target users] [achieve their main goal] by providing [${moduleStr}] — without [main pain point].`,
    guidance: [
      "Replace each [bracket] with your original product research.",
      "Do not reuse the source app's marketing copy, taglines, or product claims.",
      "Focus on the problem you uniquely solve, not on copying an existing solution.",
      "Validate your value proposition with real users before building.",
    ],
  };
}

export function generateOriginalUserPromise(report) {
  return {
    promise:  "Your users should be able to [accomplish primary goal] in [target time/steps] without [key friction point].",
    examples: [
      "Track all your projects and prompts in one place without losing context between builds.",
      "Understand your build errors and get fix guidance without leaving your workflow.",
      "Generate architecture intelligence from your project data in under 30 seconds.",
    ],
    advice: "Make the user promise measurable. Avoid vague superlatives like 'best' or 'most powerful'.",
  };
}

export function generateOriginalFeaturePositioning(report) {
  const modules = (report?.modules || []).filter((m) => m.detected);
  return {
    coreFeatures: modules.map((m) => ({
      feature:     m.name,
      originalAngle: `Your original take on ${m.name.toLowerCase()} — define what makes yours uniquely valuable.`,
      avoidCopying: `Do not replicate ${m.name} exactly as implemented in any source app. Build your own interpretation.`,
    })),
    differentiators: [
      "Identify one thing you do better than any existing solution.",
      "Find an underserved user need in this app category.",
      "Use abstract architecture patterns as inspiration, not as a spec to copy.",
    ],
  };
}

export function generateOriginalLandingPageStructure(report) {
  return {
    sections: [
      { name: "Hero",             purpose: "State the unique value proposition. Original headline and subheadline." },
      { name: "Problem Statement",purpose: "Describe the pain point your product solves. Original copy only." },
      { name: "Feature Showcase", purpose: "Show 3–5 core features with original descriptions and original screenshots." },
      { name: "Social Proof",     purpose: "Testimonials or case studies (when available). Original quotes only." },
      { name: "Pricing",          purpose: "Clear, original pricing structure if applicable." },
      { name: "CTA",              purpose: "Single clear call to action. Original button text." },
      { name: "Footer",           purpose: "Links, legal, socials. Original content only." },
    ],
    advice: "All copy, images, and design must be original. Do not copy landing page text, screenshots, or layouts from any source app.",
  };
}

export function generateOriginalDashboardConcept(report) {
  const modules = (report?.modules || []).filter((m) => m.detected).slice(0, 4);
  return {
    layout:    "Sidebar navigation + main content area. Stats overview at top. Module cards in a responsive grid.",
    widgets:   modules.map((m) => ({ name: `${m.name} Summary`, type: "stat-card + list", note: "Original implementation." })),
    advice:    "Design your dashboard layout from scratch. Use the detected modules as a reference for what data to surface, not as a layout to copy.",
    doNotCopy: "Do not replicate the visual layout, colour system, or component structure of any source dashboard pixel-for-pixel.",
  };
}

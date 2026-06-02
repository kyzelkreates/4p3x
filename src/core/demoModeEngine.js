// ============================================================
// AP3X — demoModeEngine.js — Run 8
// Realistic demo data. No real proprietary names or customer data.
// ============================================================

import { createId } from "./storage.js";
import { EXPORT_SAFETY_NOTICE } from "./constants.js";

const DEMO_FLAG = { isDemo: true, demoLabel: "⚠ DEMO DATA — Not real customer or proprietary data" };

function demoId(prefix) { return `${prefix}_demo_${Math.random().toString(36).slice(2,8)}`; }

// ── SaaS Dashboard Demo ───────────────────────────────────────
export function createSaaSDashboardDemo() {
  return {
    ...DEMO_FLAG,
    id: demoId("report"),
    title: "SaaS Analytics Dashboard — Demo Architecture Analysis",
    appType: { primary: "SaaS Dashboard", secondary: "B2B Analytics Tool" },
    createdAt: new Date().toISOString(),
    modules: [
      { name:"Analytics Engine",   detected:true,  confidence:0.91, description:"Core metrics aggregation and charting system." },
      { name:"User Management",    detected:true,  confidence:0.88, description:"User accounts, roles, team management." },
      { name:"Dashboard Builder",  detected:true,  confidence:0.84, description:"Drag-and-drop widget configuration." },
      { name:"Report Scheduler",   detected:true,  confidence:0.77, description:"Scheduled email and PDF report delivery." },
      { name:"Billing & Plans",    detected:true,  confidence:0.72, description:"Subscription tiers, usage limits, Stripe integration." },
      { name:"API Integration Hub",detected:false, confidence:0.45, description:"Third-party data source connectors — partially detected." },
    ],
    screens: [
      { id:"s1", name:"Login / Onboarding", type:"primary",   description:"Auth entry point with SSO option." },
      { id:"s2", name:"Main Dashboard",      type:"primary",   description:"KPI overview with customisable widget grid." },
      { id:"s3", name:"Analytics Deep-Dive", type:"primary",   description:"Drill-down charts and filter controls." },
      { id:"s4", name:"Report Centre",       type:"primary",   description:"Scheduled reports, PDF preview, export." },
      { id:"s5", name:"Team Settings",       type:"secondary", description:"User roles, permissions, invites." },
      { id:"s6", name:"Billing Portal",      type:"secondary", description:"Plan management, invoices, upgrade flow." },
      { id:"s7", name:"API Keys",            type:"secondary", description:"Developer API key management." },
    ],
    dataEntities: [
      { name:"User",        fields:["id","email","role","teamId","createdAt"],                          source:"detected" },
      { name:"Team",        fields:["id","name","plan","billingEmail","createdAt"],                     source:"detected" },
      { name:"Dashboard",   fields:["id","title","widgets","ownerId","isPublic"],                       source:"detected" },
      { name:"Report",      fields:["id","title","schedule","recipients","lastSentAt","format"],        source:"detected" },
      { name:"Metric",      fields:["id","name","value","unit","source","collectedAt"],                 source:"detected" },
      { name:"Subscription",fields:["id","teamId","plan","status","renewsAt","stripeId"],              source:"detected" },
    ],
    userJourneys: [
      { name:"New User Onboarding",  steps:["Sign up","Verify email","Connect first data source","View default dashboard","Invite team member"] },
      { name:"Build Custom Dashboard",steps:["Open Dashboard Builder","Add widget","Configure metric","Set date range","Save & share"] },
      { name:"Schedule a Report",    steps:["Go to Report Centre","Choose template","Set schedule","Add recipients","Confirm"] },
    ],
    businessRules: [
      { id:"br1", rule:"Free plan limited to 3 dashboards",         description:"Enforce plan limits server-side and UI.",              origin:"detected" },
      { id:"br2", rule:"Reports require at least one recipient",     description:"Validate recipient list before scheduling.",           origin:"detected" },
      { id:"br3", rule:"API key rotation must invalidate old keys",  description:"Security rule — old keys must expire on rotation.",    origin:"detected" },
    ],
    missingSystems: [
      { system:"Offline Support",        severity:"medium", note:"No service worker detected. SaaS dashboards benefit from cache-first loading." },
      { system:"Audit Log",              severity:"low",    note:"No user action audit trail detected. Recommended for enterprise compliance." },
      { system:"Custom Domain Support",  severity:"low",    note:"White-label custom domain support not detected." },
    ],
    riskWarnings: [
      { area:"Security",     level:"medium", warning:"API key management must include IP allowlisting for production." },
      { area:"Scalability",  level:"low",    warning:"Dashboard widget rendering may bottleneck at >50 widgets. Consider virtualisation." },
    ],
    originalityCheckResult: { passed:true, score:94, notice:EXPORT_SAFETY_NOTICE },
    authNeeds: { required:true, model:"Supabase Auth / JWT", currentStatus:"Not implemented in local-first prototype" },
    readinessScore: 81,
    backendNeeds: [{ need:"Supabase DB", priority:"active", description:"Replace localStorage with Supabase for multi-user." }],
    integrations: [{ name:"Stripe", type:"payments", run:9, note:"Billing integration for subscription management." }],
    appStructure: { pagesCount:7, modulesCount:6, entitiesCount:6, integrationsCount:1 },
  };
}

// ── Local-First PWA Demo ──────────────────────────────────────
export function createLocalFirstPWADemo() {
  return {
    ...DEMO_FLAG,
    id: demoId("report"),
    title: "Local-First PWA Task Manager — Demo Architecture Analysis",
    appType: { primary: "Local-First PWA", secondary: "Personal Productivity Tool" },
    createdAt: new Date().toISOString(),
    modules: [
      { name:"Task Management",     detected:true,  confidence:0.95, description:"Core task CRUD, tags, priorities, due dates." },
      { name:"Project Organiser",   detected:true,  confidence:0.88, description:"Project grouping and milestone tracking." },
      { name:"Daily Focus Mode",    detected:true,  confidence:0.80, description:"Today view with drag-to-prioritise UI." },
      { name:"Habit Tracker",       detected:true,  confidence:0.73, description:"Daily habit check-ins and streak tracking." },
      { name:"Offline Sync Engine", detected:true,  confidence:0.68, description:"Service worker + IndexedDB offline-first sync." },
      { name:"Cloud Backup",        detected:false, confidence:0.30, description:"Optional cloud backup — not yet implemented." },
    ],
    screens: [
      { id:"s1", name:"Home / Today",     type:"primary",   description:"Today's tasks and habits. Focus timer." },
      { id:"s2", name:"All Tasks",        type:"primary",   description:"Full task list with filters and search." },
      { id:"s3", name:"Projects",         type:"primary",   description:"Project list with progress bars." },
      { id:"s4", name:"Habits",           type:"primary",   description:"Daily habit grid and streak display." },
      { id:"s5", name:"Settings",         type:"secondary", description:"Theme, notifications, backup, data export." },
      { id:"s6", name:"Offline Indicator",type:"utility",   description:"Always-visible connectivity status." },
    ],
    dataEntities: [
      { name:"Task",    fields:["id","title","status","priority","dueDate","projectId","tags","notes"],   source:"detected" },
      { name:"Project", fields:["id","name","color","milestone","archived","createdAt"],                   source:"detected" },
      { name:"Habit",   fields:["id","name","frequency","streak","lastCheckedAt","color"],                source:"detected" },
      { name:"CheckIn", fields:["id","habitId","date","completed"],                                        source:"detected" },
    ],
    userJourneys: [
      { name:"Morning Routine",    steps:["Open app","Review today's tasks","Check habits","Start focus timer","Mark tasks done"] },
      { name:"Add New Project",    steps:["Go to Projects","Create project","Set milestone","Add first task","Assign to project"] },
      { name:"End-of-Day Review",  steps:["Open Today view","Mark remaining tasks","Log habit check-ins","Review tomorrow"] },
    ],
    businessRules: [
      { id:"br1", rule:"Tasks auto-reschedule overdue items", description:"Overdue tasks move to today on next open.", origin:"detected" },
      { id:"br2", rule:"Habits reset at midnight local time", description:"Local timezone-aware reset logic required.",  origin:"detected" },
    ],
    missingSystems: [
      { system:"Cloud Sync",      severity:"medium", note:"No cloud sync detected. Data is local-only. Users risk data loss on device change." },
      { system:"Collaboration",   severity:"low",    note:"No multi-user sharing. Solo-use app." },
      { system:"Push Notifications",severity:"low",  note:"No push notification system detected." },
    ],
    riskWarnings: [
      { area:"Data Safety",  level:"medium", warning:"Local-only storage means data loss if device is lost or reset." },
    ],
    originalityCheckResult: { passed:true, score:97, notice:EXPORT_SAFETY_NOTICE },
    authNeeds: { required:false, model:"No auth — single user local-first", currentStatus:"Not applicable" },
    readinessScore: 87,
    backendNeeds: [{ need:"IndexedDB + Service Worker", priority:"active", description:"Already in scope for PWA offline mode." }],
    integrations: [],
    appStructure: { pagesCount:6, modulesCount:6, entitiesCount:4, integrationsCount:0 },
  };
}

// ── Booking Platform Demo ─────────────────────────────────────
export function createBookingPlatformDemo() {
  return {
    ...DEMO_FLAG,
    id: demoId("report"),
    title: "Booking & Scheduling Platform — Demo Architecture Analysis",
    appType: { primary: "Booking Platform", secondary: "Service-Based Scheduling SaaS" },
    createdAt: new Date().toISOString(),
    modules: [
      { name:"Availability Engine",    detected:true,  confidence:0.90, description:"Real-time slot availability with buffer time logic." },
      { name:"Booking Management",     detected:true,  confidence:0.89, description:"Create, reschedule, cancel, and confirm bookings." },
      { name:"Service Catalogue",      detected:true,  confidence:0.85, description:"Service types, durations, pricing, staff assignment." },
      { name:"Client Portal",          detected:true,  confidence:0.82, description:"Client-facing booking page and history." },
      { name:"Staff Scheduling",       detected:true,  confidence:0.74, description:"Staff calendar, time-off management, shift patterns." },
      { name:"Payments & Deposits",    detected:true,  confidence:0.70, description:"Stripe deposits, refunds, invoice generation." },
      { name:"Automated Reminders",    detected:true,  confidence:0.66, description:"Email/SMS reminders before appointment." },
      { name:"Reporting & Analytics",  detected:false, confidence:0.40, description:"Revenue and booking analytics — partially detected." },
    ],
    screens: [
      { id:"s1", name:"Public Booking Page",   type:"primary",   description:"Customer-facing slot picker and booking form." },
      { id:"s2", name:"Staff Dashboard",        type:"primary",   description:"Today's bookings, schedule overview, quick actions." },
      { id:"s3", name:"Booking Detail",         type:"primary",   description:"Full booking info, reschedule, cancel, notes." },
      { id:"s4", name:"Service Manager",        type:"primary",   description:"Add/edit services, durations, pricing." },
      { id:"s5", name:"Staff Profiles",         type:"secondary", description:"Staff info, availability rules, assigned services." },
      { id:"s6", name:"Client Management",      type:"secondary", description:"Client records, booking history, notes." },
      { id:"s7", name:"Payments",               type:"secondary", description:"Payment records, refunds, invoices." },
      { id:"s8", name:"Reminder Settings",      type:"secondary", description:"Configure reminder templates and timing." },
      { id:"s9", name:"Analytics",              type:"future",    description:"Revenue and utilisation reports." },
    ],
    dataEntities: [
      { name:"Booking",    fields:["id","clientId","serviceId","staffId","startAt","endAt","status","paymentStatus","notes"],   source:"detected" },
      { name:"Service",    fields:["id","name","duration","price","depositRequired","staffIds","isActive"],                      source:"detected" },
      { name:"Staff",      fields:["id","name","email","services","availability","timeOffDates"],                                 source:"detected" },
      { name:"Client",     fields:["id","name","email","phone","bookingHistory","notes"],                                         source:"detected" },
      { name:"TimeSlot",   fields:["id","staffId","startAt","endAt","isAvailable","bufferMins"],                                  source:"detected" },
      { name:"Payment",    fields:["id","bookingId","amount","status","stripeId","refundedAt"],                                   source:"detected" },
      { name:"Reminder",   fields:["id","bookingId","channel","sendAt","sent","template"],                                        source:"detected" },
    ],
    userJourneys: [
      { name:"Customer Books Appointment", steps:["Visit booking page","Select service","Choose staff (optional)","Pick time slot","Enter details","Pay deposit","Receive confirmation"] },
      { name:"Staff Manages Day",          steps:["Open Staff Dashboard","Review today's schedule","Check for cancellations","Update booking notes","Mark as completed"] },
      { name:"Admin Adds Service",         steps:["Open Service Manager","Create service","Set duration and price","Assign staff","Publish to booking page"] },
    ],
    businessRules: [
      { id:"br1", rule:"Buffer time enforced between bookings",           description:"Minimum buffer cannot be overridden by clients.",           origin:"detected" },
      { id:"br2", rule:"Deposits are non-refundable by default",          description:"Refund logic requires manual admin override.",              origin:"detected" },
      { id:"br3", rule:"Reminders sent 24h and 1h before appointment",    description:"Timing is configurable per service.",                       origin:"detected" },
      { id:"br4", rule:"Staff cannot be double-booked",                   description:"Slot reservation must be atomic to prevent race conditions.", origin:"detected" },
    ],
    missingSystems: [
      { system:"Waitlist Management", severity:"medium", note:"No waitlist for full time slots detected." },
      { system:"Group Bookings",      severity:"low",    note:"Single-attendee bookings only. Group class support not detected." },
      { system:"Multi-Location",      severity:"low",    note:"Single-location architecture. Multi-location not detected." },
    ],
    riskWarnings: [
      { area:"Concurrency",  level:"high",   warning:"Double-booking race condition risk. Slot reservation must be transactional." },
      { area:"Payments",     level:"medium", warning:"Stripe webhook validation required for production. Must handle failed payments." },
      { area:"GDPR",         level:"medium", warning:"Client PII stored. Privacy policy and data retention policy required." },
    ],
    originalityCheckResult: { passed:true, score:89, notice:EXPORT_SAFETY_NOTICE },
    authNeeds: { required:true, model:"JWT + RLS", currentStatus:"Required for client and staff separation" },
    readinessScore: 74,
    backendNeeds: [
      { need:"Supabase DB + RLS",    priority:"active",  description:"Multi-user data with row-level security." },
      { need:"Stripe Payments",      priority:"active",  description:"Deposit and refund processing." },
      { need:"Email/SMS API",        priority:"planned", description:"Transactional reminders via SendGrid or Twilio." },
    ],
    integrations: [
      { name:"Stripe",    type:"payments",    run:9, note:"Deposit and payment processing." },
      { name:"SendGrid",  type:"email",       run:9, note:"Transactional reminder emails." },
    ],
    appStructure: { pagesCount:9, modulesCount:8, entitiesCount:7, integrationsCount:2 },
  };
}

export function createAllDemoProjects() {
  return [createSaaSDashboardDemo(), createLocalFirstPWADemo(), createBookingPlatformDemo()];
}
export function markAsDemoData(data) {
  return { ...data, ...DEMO_FLAG };
}
export function isDemoData(data) {
  return !!(data && data.isDemo);
}
export function isDemoModeEnabled(state) {
  return !!(state?.exportCentre?.demoModeEnabled);
}
export function seedDemoProjects() { return createAllDemoProjects(); }
export function createDemoArchitectureReport() { return createSaaSDashboardDemo(); }
export function createDemoBlueprint() { return null; }
export function createDemoExportPack() { return null; }
export function enableDemoMode()  { /* called via setDemoMode(true) in storage */ }
export function disableDemoMode() { /* called via setDemoMode(false) in storage */ }
export function resetDemoMode()   { /* called via setDemoMode(false) + setDemoProjects([]) */ }

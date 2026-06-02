// ============================================================
// AP3X — projectInventoryEngine.js — Run 10
// ============================================================
export function groupProjectsBySource(projects) {
  const map = {};
  (projects||[]).forEach((p) => { const k=p.sourceType||"Other"; if(!map[k])map[k]=[]; map[k].push(p); });
  return map;
}
export function groupProjectsByStatus(projects) {
  const map = {};
  (projects||[]).forEach((p) => { const k=p.status||"Unknown"; if(!map[k])map[k]=[]; map[k].push(p); });
  return map;
}
export function groupProjectsByStack(projects) {
  const map = {};
  (projects||[]).forEach((p) => {
    const stacks = p.detectedStack?.length>0 ? p.detectedStack : ["Unknown"];
    stacks.forEach((s)=>{ if(!map[s])map[s]=[]; map[s].push(p); });
  });
  return map;
}
export function groupProjectsByRisk(projects) {
  const map = {};
  (projects||[]).forEach((p) => { const k=p.riskLevel||"Unknown"; if(!map[k])map[k]=[]; map[k].push(p); });
  return map;
}
export function groupProjectsByDeploymentTarget(projects) {
  const map = {};
  (projects||[]).forEach((p) => {
    const targets = p.detectedDeploymentTargets?.length>0 ? p.detectedDeploymentTargets : ["Unknown"];
    targets.forEach((t)=>{ if(!map[t])map[t]=[]; map[t].push(p); });
  });
  return map;
}
export function findPotentialDuplicates(projects) {
  const dups = [];
  (projects||[]).forEach((p, i) => {
    const others = (projects||[]).slice(i+1);
    others.forEach((o) => {
      const titleMatch = (p.title||"").toLowerCase() === (o.title||"").toLowerCase();
      const repoMatch  = p.linkedRepo && o.linkedRepo && p.linkedRepo === o.linkedRepo;
      const urlMatch   = p.sourceUrl  && o.sourceUrl  && p.sourceUrl  === o.sourceUrl;
      if (titleMatch || repoMatch || urlMatch) dups.push({ a: p, b: o, reason: titleMatch?"Same Title":repoMatch?"Same Repo":"Same URL" });
    });
  });
  return dups;
}
export function findStaleProjects(projects) {
  return (projects||[]).filter((p) => {
    if (!p.updatedAt && !p.createdAt) return true;
    const days = (Date.now()-new Date(p.updatedAt||p.createdAt).getTime())/86_400_000;
    return days > 90;
  });
}
export function findBrokenProjects(projects) { return (projects||[]).filter((p)=>p.status==="Broken"||p.buildStatus==="Broken"); }
export function findReadyProjects(projects) { return (projects||[]).filter((p)=>p.status==="Working"||p.status==="Ready For Extraction"); }
export function findProjectsReadyForExtraction(projects) { return (projects||[]).filter((p)=>p.readyForExtraction); }

export function generateInventoryStats(projects) {
  const arr = projects||[];
  return {
    total:                arr.length,
    working:              arr.filter((p)=>p.status==="Working").length,
    broken:               arr.filter((p)=>p.status==="Broken").length,
    stale:                arr.filter((p)=>p.status==="Stale").length,
    duplicateCandidates:  findPotentialDuplicates(arr).length,
    readyForExtraction:   arr.filter((p)=>p.readyForExtraction).length,
    readyForRescuePlan:   arr.filter((p)=>p.status==="Ready For Rescue Plan").length,
    unknownStatus:        arr.filter((p)=>!p.status||p.status==="Unknown").length,
    bySource:             groupProjectsBySource(arr),
    byStatus:             groupProjectsByStatus(arr),
    byStack:              groupProjectsByStack(arr),
    byRisk:               groupProjectsByRisk(arr),
    avgHealthScore:       arr.length>0 ? Math.round(arr.reduce((s,p)=>s+(p.healthScore||0),0)/arr.length) : 0,
    avgCompletionScore:   arr.length>0 ? Math.round(arr.reduce((s,p)=>s+(p.completionScore||0),0)/arr.length) : 0,
  };
}

export function createProjectInventory(projects) {
  return { projects: projects||[], stats: generateInventoryStats(projects), generatedAt: new Date().toISOString() };
}

// AP3X — productTestUtils.js — Run 9
export { runProductTestSuite } from "../core/productTestRunner.js";
export function groupTestsByCategory(tests) {
  const map = {};
  (tests || []).forEach((t) => {
    if (!map[t.category]) map[t.category] = [];
    map[t.category].push(t);
  });
  return map;
}
export function categoryScore(tests) {
  if (!tests || tests.length === 0) return 0;
  const p = tests.filter((t) => t.status === "pass").length;
  const w = tests.filter((t) => t.status === "warning").length;
  return Math.round(((p + w * 0.5) / tests.length) * 100);
}
export function statusIcon(status) {
  return { pass:"✓", warning:"⚠", fail:"✕", not_tested:"—" }[status] || "—";
}

/**
 * Preset save/load fidelity test.
 * Verifies that saving a customized tool config, resetting to defaults, then
 * loading the saved preset reproduces the exact generated code. Covers the
 * trickiest cases: a dynamic-structure tool (gradient stops) and the two tools
 * whose key selection lives in module state (cursor, transition).
 *
 * Run: npm test
 */
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><body><div id="tool-controls"></div><div id="preview-body"></div></body>', { pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.structuredClone = globalThis.structuredClone || ((o) => JSON.parse(JSON.stringify(o)));
window.__updateCode = () => {};

// Mirrors the snapshot/apply logic in main.js
function snapshot(tool) {
  const snap = { state: null, dom: {} };
  if (typeof tool.getState === 'function') snap.state = tool.getState();
  document.getElementById('tool-controls').querySelectorAll('input[id],select[id],textarea[id]').forEach(el => {
    snap.dom[el.id] = el.type === 'checkbox' ? { checked: el.checked } : { value: el.value };
  });
  return JSON.parse(JSON.stringify(snap)); // simulate localStorage round-trip
}
function render(tool) {
  document.getElementById('tool-controls').innerHTML = tool.renderControls();
  document.getElementById('preview-body').innerHTML = tool.renderPreview();
  tool.init();
}
function apply(tool, snap) {
  if (snap.state != null && tool.setState) { tool.setState(snap.state); render(tool); }
  Object.entries(snap.dom).forEach(([id, v]) => {
    const el = document.getElementById(id); if (!el) return;
    if ('checked' in v) el.checked = v.checked; else el.value = v.value;
    el.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    el.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  });
}

let pass = 0, fail = 0;
const check = (name, cond) => cond ? (pass++, console.log('  ✓', name)) : (fail++, console.log('  ✗ FAIL', name));

async function test(file, label, mutate) {
  const mod = await import(`../tools/${file}.js`);
  const tool = Object.values(mod)[0];
  render(tool);
  mutate(tool);
  const customized = tool.getCode('css');
  const snap = snapshot(tool);
  tool.reset?.(); render(tool);
  const afterReset = tool.getCode('css');
  apply(tool, snap);
  console.log(`\n[${label}]`);
  check('customized differs from default', customized !== afterReset);
  check('loaded preset restores exact code', tool.getCode('css') === customized);
}

await test('gradient', 'gradient — dynamic stops + module state', (t) => {
  t.setState({ type: 'radial', angle: 200, stops: [{ color: '#ff0000', position: 0 }, { color: '#00ff00', position: 40 }, { color: '#0000ff', position: 100 }] });
  render(t);
});
await test('cursor', 'cursor — module state', () => {
  document.querySelector('[data-cursor="grab"]').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
});
await test('transition', 'transition — easing + id inputs', () => {
  document.querySelector('[data-easing="cubic-bezier(0.34, 1.56, 0.64, 1)"]').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  document.getElementById('trans-duration').value = '800';
});

console.log(`\n=== ${pass} passed, ${fail} failed ===`);
process.exit(fail ? 1 : 0);

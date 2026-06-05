/* ============================================================
   FreeReign — Typography Scale Generator Tool
   ============================================================ */

let state = {
  baseSize: 16,
  scale: 1.25,       // Major Third
  unit: 'rem',
  steps: 6,
  baseFont: 'Inter',
  lineHeight: 1.5,
  fontWeight: 400,
};

const SCALES = [
  { name: 'Minor Second', ratio: 1.067 },
  { name: 'Major Second', ratio: 1.125 },
  { name: 'Minor Third', ratio: 1.2 },
  { name: 'Major Third', ratio: 1.25 },
  { name: 'Perfect Fourth', ratio: 1.333 },
  { name: 'Augmented Fourth', ratio: 1.414 },
  { name: 'Perfect Fifth', ratio: 1.5 },
  { name: 'Golden Ratio', ratio: 1.618 },
];

const FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins',
  'Source Sans Pro', 'Playfair Display', 'Merriweather', 'DM Sans',
  'Outfit', 'Space Grotesk', 'JetBrains Mono',
];

function generateScale() {
  const sizes = [];
  for (let i = -2; i <= state.steps; i++) {
    const px = state.baseSize * Math.pow(state.scale, i);
    let value;
    if (state.unit === 'rem') {
      value = (px / 16).toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
    } else if (state.unit === 'em') {
      value = (px / state.baseSize).toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
    } else {
      value = Math.round(px);
    }
    const labels = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
    sizes.push({
      label: labels[i + 2] || `${i + 2 - labels.length + 1}xl`,
      value: +value,
      px: Math.round(px),
      step: i,
    });
  }
  return sizes;
}

function updatePreview() {
  const container = document.getElementById('type-preview');
  if (!container) return;

  const sizes = generateScale();
  container.innerHTML = sizes.reverse().map(s => `
    <div style="
      display:flex;align-items:baseline;gap:var(--space-4);
      padding:var(--space-2) 0;
      border-bottom:1px solid var(--border-subtle);
    ">
      <span style="
        font-family:var(--font-mono);font-size:var(--text-xs);
        color:var(--accent-primary);min-width:40px;text-align:right;
      ">${s.label}</span>
      <span style="
        font-family:'${state.baseFont}',sans-serif;
        font-size:${s.px}px;
        font-weight:${state.fontWeight};
        line-height:${state.lineHeight};
        color:var(--text-primary);
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        max-width:100%;
      ">Aa</span>
      <span style="
        font-family:var(--font-mono);font-size:var(--text-xs);
        color:var(--text-tertiary);margin-left:auto;white-space:nowrap;
      ">${s.value}${state.unit} / ${s.px}px</span>
    </div>
  `).join('');

  if (window.__updateCode) window.__updateCode();
}

export const typographyTool = {
  id: 'typography',
  name: 'Type Scale',
  icon: '🔤',
  description: 'Generate harmonious typography scales using musical ratios. Perfect for consistent heading and body text sizing.',
  shortDesc: 'Modular type scale calculator',
  isPro: true,
  isNew: false,

  renderControls() {
    return `
      <div class="control-group">
        <span class="control-label">Scale Ratio</span>
        <select class="control-select" id="type-scale">
          ${SCALES.map(s =>
            `<option value="${s.ratio}" ${state.scale === s.ratio ? 'selected' : ''}>${s.name} (${s.ratio})</option>`
          ).join('')}
        </select>
      </div>
      <div class="control-group">
        <span class="control-label">Base Size <span class="control-value" id="type-base-val">${state.baseSize}px</span></span>
        <input type="range" min="10" max="24" value="${state.baseSize}" id="type-base" />
      </div>
      <div class="control-group">
        <span class="control-label">Unit</span>
        <select class="control-select" id="type-unit">
          ${['rem', 'em', 'px'].map(u =>
            `<option value="${u}" ${state.unit === u ? 'selected' : ''}>${u}</option>`
          ).join('')}
        </select>
      </div>
      <div class="control-group">
        <span class="control-label">Steps <span class="control-value" id="type-steps-val">${state.steps}</span></span>
        <input type="range" min="3" max="10" value="${state.steps}" id="type-steps" />
      </div>
      <div class="control-group">
        <span class="control-label">Font</span>
        <select class="control-select" id="type-font">
          ${FONTS.map(f =>
            `<option value="${f}" ${state.baseFont === f ? 'selected' : ''}>${f}</option>`
          ).join('')}
        </select>
      </div>
      <div class="control-group">
        <span class="control-label">Line Height <span class="control-value" id="type-lh-val">${state.lineHeight}</span></span>
        <input type="range" min="1" max="2.5" step="0.05" value="${state.lineHeight}" id="type-lh" />
      </div>
      <div class="control-group">
        <span class="control-label">Weight <span class="control-value" id="type-weight-val">${state.fontWeight}</span></span>
        <input type="range" min="100" max="900" step="100" value="${state.fontWeight}" id="type-weight" />
      </div>
    `;
  },

  renderPreview() {
    return `<div id="type-preview" style="width:100%;height:100%;overflow-y:auto;padding:var(--space-4);display:flex;flex-direction:column;gap:0;"></div>`;
  },

  init() {
    updatePreview();

    document.getElementById('type-scale')?.addEventListener('change', (e) => {
      state.scale = +e.target.value;
      updatePreview();
    });

    document.getElementById('type-base')?.addEventListener('input', (e) => {
      state.baseSize = +e.target.value;
      document.getElementById('type-base-val').textContent = state.baseSize + 'px';
      updatePreview();
    });

    document.getElementById('type-unit')?.addEventListener('change', (e) => {
      state.unit = e.target.value;
      updatePreview();
    });

    document.getElementById('type-steps')?.addEventListener('input', (e) => {
      state.steps = +e.target.value;
      document.getElementById('type-steps-val').textContent = state.steps;
      updatePreview();
    });

    document.getElementById('type-font')?.addEventListener('change', (e) => {
      state.baseFont = e.target.value;
      updatePreview();
    });

    document.getElementById('type-lh')?.addEventListener('input', (e) => {
      state.lineHeight = +e.target.value;
      document.getElementById('type-lh-val').textContent = state.lineHeight;
      updatePreview();
    });

    document.getElementById('type-weight')?.addEventListener('input', (e) => {
      state.fontWeight = +e.target.value;
      document.getElementById('type-weight-val').textContent = state.fontWeight;
      updatePreview();
    });
  },

  getState() { return structuredClone(state); },
  setState(s) { if (s) state = structuredClone(s); },

  reset() {
    state = { baseSize: 16, scale: 1.25, unit: 'rem', steps: 6, baseFont: 'Inter', lineHeight: 1.5, fontWeight: 400 };
  },

  getCode(format) {
    const sizes = generateScale();
    if (format === 'css') {
      const vars = sizes.map(s => `  --text-${s.label}: ${s.value}${state.unit};`).join('\n');
      return `/* Generated by FreeReign — ${SCALES.find(sc => sc.ratio === state.scale)?.name || 'Custom'} Scale */\n:root {\n  /* Base: ${state.baseSize}px, Scale: ${state.scale} */\n${vars}\n  --line-height: ${state.lineHeight};\n  --font-family: '${state.baseFont}', sans-serif;\n}`;
    } else if (format === 'scss') {
      const vars = sizes.map(s => `$text-${s.label}: ${s.value}${state.unit};`).join('\n');
      return `// Generated by FreeReign — ${SCALES.find(sc => sc.ratio === state.scale)?.name || 'Custom'} Scale\n// Base: ${state.baseSize}px, Scale: ${state.scale}\n${vars}\n$line-height: ${state.lineHeight};\n$font-family: '${state.baseFont}', sans-serif;`;
    } else {
      const obj = {};
      sizes.forEach(s => { obj[s.label] = `${s.value}${state.unit}`; });
      return `// Generated by FreeReign\n// tailwind.config.js\nmodule.exports = {\n  theme: {\n    fontSize: ${JSON.stringify(obj, null, 6).replace(/^/gm, '    ').trim()}\n  }\n}`;
    }
  }
};

/* ============================================================
   FreeReign — Clip-Path Generator Tool
   ============================================================ */

const PRESETS = [
  { name: 'Triangle', path: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
  { name: 'Trapezoid', path: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' },
  { name: 'Parallelogram', path: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' },
  { name: 'Rhombus', path: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
  { name: 'Pentagon', path: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' },
  { name: 'Hexagon', path: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
  { name: 'Octagon', path: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' },
  { name: 'Star', path: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
  { name: 'Cross', path: 'polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)' },
  { name: 'Arrow Right', path: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)' },
  { name: 'Arrow Left', path: 'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)' },
  { name: 'Circle', path: 'circle(50% at 50% 50%)' },
  { name: 'Ellipse', path: 'ellipse(50% 35% at 50% 50%)' },
  { name: 'Inset', path: 'inset(10% 10% 10% 10% round 10px)' },
  { name: 'Message', path: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)' },
  { name: 'Chevron', path: 'polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%)' },
];

let state = {
  clipPath: PRESETS[0].path,
  customMode: false,
  selectedPreset: 0,
};

function updatePreview() {
  const el = document.getElementById('clip-preview');
  if (el) {
    el.style.clipPath = state.clipPath;
    el.style.webkitClipPath = state.clipPath;
  }
  if (window.__updateCode) window.__updateCode();
}

export const clipPathTool = {
  id: 'clippath',
  name: 'Clip-Path',
  icon: '✂️',
  description: 'Create CSS clip-path shapes with 16 presets or custom polygon definitions. Triangle, hexagon, star, and more.',
  shortDesc: 'CSS shape clipping',
  isPro: true,
  isNew: false,

  renderControls() {
    return `
      <div class="control-group">
        <span class="control-label">Shape Presets</span>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-2);" id="clip-presets">
          ${PRESETS.map((p, i) => `
            <button class="preset-btn ${i === state.selectedPreset ? 'active' : ''}" data-index="${i}" style="
              width:100%;height:48px;position:relative;overflow:hidden;
            " title="${p.name}">
              <div style="
                position:absolute;inset:6px;
                background:var(--accent-gradient);
                clip-path:${p.path};
                -webkit-clip-path:${p.path};
              "></div>
            </button>
          `).join('')}
        </div>
      </div>
      <div class="control-group">
        <label class="control-checkbox">
          <input type="checkbox" id="clip-custom" ${state.customMode ? 'checked' : ''} />
          Custom clip-path
        </label>
      </div>
      <div class="control-group" id="clip-custom-input" style="display:${state.customMode ? 'block' : 'none'}">
        <span class="control-label">Clip-Path Value</span>
        <textarea class="control-input" id="clip-value" rows="4" style="font-family:var(--font-mono);font-size:var(--text-xs);resize:vertical">${state.clipPath}</textarea>
      </div>
      <div class="control-group">
        <span class="control-label" style="color:var(--text-tertiary);font-size:var(--text-xs)">
          Current: <code style="color:var(--accent-primary)">${PRESETS[state.selectedPreset]?.name || 'Custom'}</code>
        </span>
      </div>
    `;
  },

  renderPreview() {
    return `
      <div style="position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
        <div style="width:280px;height:280px;position:relative;">
          <div style="position:absolute;inset:0;border:2px dashed var(--border-default);border-radius:var(--radius-sm);opacity:0.4"></div>
          <div id="clip-preview" style="
            width:100%;height:100%;
            background:var(--accent-gradient);
            transition:clip-path 0.4s cubic-bezier(0.34,1.56,0.64,1);
          "></div>
        </div>
      </div>
    `;
  },

  init() {
    updatePreview();

    document.querySelectorAll('#clip-presets .preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = +btn.dataset.index;
        state.selectedPreset = idx;
        state.clipPath = PRESETS[idx].path;
        document.querySelectorAll('#clip-presets .preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const textarea = document.getElementById('clip-value');
        if (textarea) textarea.value = state.clipPath;
        updatePreview();
      });
    });

    document.getElementById('clip-custom')?.addEventListener('change', (e) => {
      state.customMode = e.target.checked;
      document.getElementById('clip-custom-input').style.display = state.customMode ? 'block' : 'none';
    });

    document.getElementById('clip-value')?.addEventListener('input', (e) => {
      state.clipPath = e.target.value;
      updatePreview();
    });
  },

  reset() {
    state = { clipPath: PRESETS[0].path, customMode: false, selectedPreset: 0 };
  },

  getCode(format) {
    if (format === 'css') {
      return `/* Generated by FreeReign — ${PRESETS[state.selectedPreset]?.name || 'Custom'} */\n.clipped {\n  clip-path: ${state.clipPath};\n  -webkit-clip-path: ${state.clipPath};\n}`;
    } else if (format === 'scss') {
      return `// Generated by FreeReign — ${PRESETS[state.selectedPreset]?.name || 'Custom'}\n$clip-path: ${state.clipPath};\n\n.clipped {\n  clip-path: $clip-path;\n  -webkit-clip-path: $clip-path;\n}`;
    } else {
      return `<!-- Generated by FreeReign -->\n<div class="[clip-path:${state.clipPath.replace(/\s+/g, '_')}]">\n  ...\n</div>`;
    }
  }
};

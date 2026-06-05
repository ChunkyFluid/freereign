/* ============================================================
   FreeReign — CSS Filter Generator Tool
   ============================================================ */

let state = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  hueRotate: 0,
  invert: 0,
  saturate: 100,
  sepia: 0,
  opacity: 100,
  dropShadowX: 0,
  dropShadowY: 4,
  dropShadowBlur: 8,
  dropShadowColor: '#000000',
  useDropShadow: false,
};

function getFilterCSS() {
  const parts = [];
  if (state.blur > 0) parts.push(`blur(${state.blur}px)`);
  if (state.brightness !== 100) parts.push(`brightness(${state.brightness}%)`);
  if (state.contrast !== 100) parts.push(`contrast(${state.contrast}%)`);
  if (state.grayscale > 0) parts.push(`grayscale(${state.grayscale}%)`);
  if (state.hueRotate !== 0) parts.push(`hue-rotate(${state.hueRotate}deg)`);
  if (state.invert > 0) parts.push(`invert(${state.invert}%)`);
  if (state.saturate !== 100) parts.push(`saturate(${state.saturate}%)`);
  if (state.sepia > 0) parts.push(`sepia(${state.sepia}%)`);
  if (state.opacity < 100) parts.push(`opacity(${state.opacity}%)`);
  if (state.useDropShadow) {
    parts.push(`drop-shadow(${state.dropShadowX}px ${state.dropShadowY}px ${state.dropShadowBlur}px ${state.dropShadowColor})`);
  }
  return parts.length ? parts.join(' ') : 'none';
}

function updatePreview() {
  const el = document.getElementById('filter-preview');
  if (el) {
    el.style.filter = getFilterCSS();
  }
  if (window.__updateCode) window.__updateCode();
}

export const filterTool = {
  id: 'filter',
  name: 'CSS Filter',
  icon: '🔮',
  description: 'Build CSS filter chains with blur, brightness, contrast, grayscale, hue-rotate, saturate, sepia, and drop-shadow.',
  shortDesc: 'Filter chain builder',
  isPro: true,
  isNew: false,

  renderControls() {
    const sliders = [
      { id: 'blur', label: 'Blur', min: 0, max: 20, val: state.blur, unit: 'px' },
      { id: 'brightness', label: 'Brightness', min: 0, max: 300, val: state.brightness, unit: '%' },
      { id: 'contrast', label: 'Contrast', min: 0, max: 300, val: state.contrast, unit: '%' },
      { id: 'grayscale', label: 'Grayscale', min: 0, max: 100, val: state.grayscale, unit: '%' },
      { id: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360, val: state.hueRotate, unit: '°' },
      { id: 'invert', label: 'Invert', min: 0, max: 100, val: state.invert, unit: '%' },
      { id: 'saturate', label: 'Saturate', min: 0, max: 300, val: state.saturate, unit: '%' },
      { id: 'sepia', label: 'Sepia', min: 0, max: 100, val: state.sepia, unit: '%' },
      { id: 'opacity', label: 'Opacity', min: 0, max: 100, val: state.opacity, unit: '%' },
    ];

    return `
      ${sliders.map(s => `
        <div class="control-group">
          <span class="control-label">${s.label} <span class="control-value" id="flt-${s.id}-val">${s.val}${s.unit}</span></span>
          <input type="range" min="${s.min}" max="${s.max}" value="${s.val}" id="flt-${s.id}" data-prop="${s.id}" data-unit="${s.unit}" />
        </div>
      `).join('')}
      <div class="control-group">
        <label class="control-checkbox">
          <input type="checkbox" id="flt-dropshadow-check" ${state.useDropShadow ? 'checked' : ''} />
          Drop Shadow
        </label>
      </div>
      <div id="flt-dropshadow-controls" style="display:${state.useDropShadow ? 'block' : 'none'}">
        <div class="control-group">
          <span class="control-label">Shadow X <span class="control-value" id="flt-dsx-val">${state.dropShadowX}px</span></span>
          <input type="range" min="-20" max="20" value="${state.dropShadowX}" id="flt-dsx" />
        </div>
        <div class="control-group">
          <span class="control-label">Shadow Y <span class="control-value" id="flt-dsy-val">${state.dropShadowY}px</span></span>
          <input type="range" min="-20" max="20" value="${state.dropShadowY}" id="flt-dsy" />
        </div>
        <div class="control-group">
          <span class="control-label">Shadow Blur <span class="control-value" id="flt-dsb-val">${state.dropShadowBlur}px</span></span>
          <input type="range" min="0" max="30" value="${state.dropShadowBlur}" id="flt-dsb" />
        </div>
        <div class="control-group">
          <span class="control-label">Shadow Color</span>
          <input type="color" value="${state.dropShadowColor}" id="flt-dsc" />
        </div>
      </div>
    `;
  },

  renderPreview() {
    return `
      <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">
        <div id="filter-preview" style="
          width: 240px; height: 180px;
          background: var(--accent-gradient);
          border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center;
          font-size: 3rem;
          transition: filter 0.2s ease;
        ">🎭</div>
      </div>
    `;
  },

  init() {
    updatePreview();

    // Main filter sliders
    document.querySelectorAll('#tool-controls input[type="range"][data-prop]').forEach(input => {
      input.addEventListener('input', (e) => {
        const prop = e.target.dataset.prop;
        const unit = e.target.dataset.unit;
        state[prop] = +e.target.value;
        document.getElementById(`flt-${prop}-val`).textContent = e.target.value + unit;
        updatePreview();
      });
    });

    // Drop shadow toggle
    document.getElementById('flt-dropshadow-check')?.addEventListener('change', (e) => {
      state.useDropShadow = e.target.checked;
      document.getElementById('flt-dropshadow-controls').style.display = state.useDropShadow ? 'block' : 'none';
      updatePreview();
    });

    // Drop shadow controls
    const dsControls = [
      { id: 'flt-dsx', prop: 'dropShadowX', valId: 'flt-dsx-val', unit: 'px' },
      { id: 'flt-dsy', prop: 'dropShadowY', valId: 'flt-dsy-val', unit: 'px' },
      { id: 'flt-dsb', prop: 'dropShadowBlur', valId: 'flt-dsb-val', unit: 'px' },
    ];
    dsControls.forEach(({ id, prop, valId, unit }) => {
      document.getElementById(id)?.addEventListener('input', (e) => {
        state[prop] = +e.target.value;
        document.getElementById(valId).textContent = e.target.value + unit;
        updatePreview();
      });
    });

    document.getElementById('flt-dsc')?.addEventListener('input', (e) => {
      state.dropShadowColor = e.target.value;
      updatePreview();
    });
  },

  getState() { return structuredClone(state); },
  setState(s) { if (s) state = structuredClone(s); },

  reset() {
    state = {
      blur: 0, brightness: 100, contrast: 100, grayscale: 0, hueRotate: 0,
      invert: 0, saturate: 100, sepia: 0, opacity: 100,
      dropShadowX: 0, dropShadowY: 4, dropShadowBlur: 8,
      dropShadowColor: '#000000', useDropShadow: false,
    };
  },

  getCode(format) {
    const filter = getFilterCSS();
    if (format === 'css') {
      return `/* Generated by FreeReign */\n.filtered {\n  filter: ${filter};\n}`;
    } else if (format === 'scss') {
      return `// Generated by FreeReign\n$filter: ${filter};\n\n.filtered {\n  filter: $filter;\n}`;
    } else {
      const parts = [];
      if (state.blur > 0) parts.push(`blur-[${state.blur}px]`);
      if (state.brightness !== 100) parts.push(`brightness-[${state.brightness}%]`);
      if (state.contrast !== 100) parts.push(`contrast-[${state.contrast}%]`);
      if (state.grayscale > 0) parts.push(`grayscale-[${state.grayscale}%]`);
      if (state.hueRotate !== 0) parts.push(`hue-rotate-[${state.hueRotate}deg]`);
      if (state.invert > 0) parts.push(`invert-[${state.invert}%]`);
      if (state.saturate !== 100) parts.push(`saturate-[${state.saturate}%]`);
      if (state.sepia > 0) parts.push(`sepia-[${state.sepia}%]`);
      return `<!-- Generated by FreeReign -->\n<div class="${parts.join(' ')}">\n  ...\n</div>`;
    }
  }
};

/* ============================================================
   FreeReign — Neumorphism Generator Tool
   ============================================================ */

let state = {
  size: 200,
  radius: 30,
  distance: 8,
  intensity: 15,
  blur: 16,
  bgColor: '#e0e5ec',
  shape: 'flat',  // flat, concave, convex, pressed
};

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function adjustBrightness(hex, percent) {
  const rgb = hexToRgb(hex);
  const adjust = (c) => Math.max(0, Math.min(255, Math.round(c + (255 * percent / 100))));
  const r = adjust(rgb.r).toString(16).padStart(2, '0');
  const g = adjust(rgb.g).toString(16).padStart(2, '0');
  const b = adjust(rgb.b).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

function getNeumorphCSS() {
  const lightShadow = adjustBrightness(state.bgColor, state.intensity);
  const darkShadow = adjustBrightness(state.bgColor, -state.intensity);
  const d = state.distance;
  const b = state.blur;

  let shadow;
  let bg = state.bgColor;

  switch (state.shape) {
    case 'flat':
      shadow = `${d}px ${d}px ${b}px ${darkShadow},\n    -${d}px -${d}px ${b}px ${lightShadow}`;
      break;
    case 'concave':
      shadow = `${d}px ${d}px ${b}px ${darkShadow},\n    -${d}px -${d}px ${b}px ${lightShadow}`;
      bg = `linear-gradient(145deg, ${adjustBrightness(state.bgColor, -3)}, ${adjustBrightness(state.bgColor, 3)})`;
      break;
    case 'convex':
      shadow = `${d}px ${d}px ${b}px ${darkShadow},\n    -${d}px -${d}px ${b}px ${lightShadow}`;
      bg = `linear-gradient(145deg, ${adjustBrightness(state.bgColor, 3)}, ${adjustBrightness(state.bgColor, -3)})`;
      break;
    case 'pressed':
      shadow = `inset ${d}px ${d}px ${b}px ${darkShadow},\n    inset -${d}px -${d}px ${b}px ${lightShadow}`;
      break;
  }

  return { shadow, bg, borderRadius: state.radius + 'px' };
}

function updatePreview() {
  const el = document.getElementById('neumo-preview');
  const wrapper = document.getElementById('neumo-wrapper');
  if (el && wrapper) {
    const css = getNeumorphCSS();
    wrapper.style.background = state.bgColor;
    el.style.boxShadow = css.shadow.replace(/\n\s+/g, ' ');
    el.style.background = css.bg;
    el.style.borderRadius = css.borderRadius;
    el.style.width = state.size + 'px';
    el.style.height = state.size + 'px';
  }
  if (window.__updateCode) window.__updateCode();
}

export const neumorphismTool = {
  id: 'neumorphism',
  name: 'Neumorphism',
  icon: '🧊',
  description: 'Create soft UI (neumorphic) designs with dual shadows. Flat, concave, convex, and pressed states.',
  shortDesc: 'Soft UI shadow effects',
  isPro: false,
  isNew: true,

  renderControls() {
    return `
      <div class="control-group">
        <span class="control-label">Shape</span>
        <select class="control-select" id="neumo-shape">
          ${['flat', 'concave', 'convex', 'pressed'].map(s =>
            `<option value="${s}" ${state.shape === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`
          ).join('')}
        </select>
      </div>
      <div class="control-group">
        <span class="control-label">Background <span class="control-value" id="neumo-bg-val">${state.bgColor}</span></span>
        <div class="control-row">
          <input type="color" value="${state.bgColor}" id="neumo-bg" />
          <input type="text" class="control-input" value="${state.bgColor}" id="neumo-bg-hex" style="font-family:var(--font-mono);flex:1" />
        </div>
      </div>
      <div class="control-group">
        <span class="control-label">Size <span class="control-value" id="neumo-size-val">${state.size}px</span></span>
        <input type="range" min="80" max="300" value="${state.size}" id="neumo-size" />
      </div>
      <div class="control-group">
        <span class="control-label">Border Radius <span class="control-value" id="neumo-radius-val">${state.radius}px</span></span>
        <input type="range" min="0" max="150" value="${state.radius}" id="neumo-radius" />
      </div>
      <div class="control-group">
        <span class="control-label">Distance <span class="control-value" id="neumo-distance-val">${state.distance}px</span></span>
        <input type="range" min="1" max="30" value="${state.distance}" id="neumo-distance" />
      </div>
      <div class="control-group">
        <span class="control-label">Intensity <span class="control-value" id="neumo-intensity-val">${state.intensity}%</span></span>
        <input type="range" min="1" max="40" value="${state.intensity}" id="neumo-intensity" />
      </div>
      <div class="control-group">
        <span class="control-label">Blur <span class="control-value" id="neumo-blur-val">${state.blur}px</span></span>
        <input type="range" min="0" max="60" value="${state.blur}" id="neumo-blur" />
      </div>
    `;
  },

  renderPreview() {
    return `
      <div id="neumo-wrapper" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${state.bgColor};border-radius:var(--radius-lg);">
        <div id="neumo-preview" style="
          width: ${state.size}px; height: ${state.size}px;
          border-radius: ${state.radius}px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
        ">
          <span style="font-size:2rem;">🧊</span>
        </div>
      </div>
    `;
  },

  init() {
    updatePreview();

    const sliders = [
      { id: 'neumo-size', prop: 'size', unit: 'px' },
      { id: 'neumo-radius', prop: 'radius', unit: 'px' },
      { id: 'neumo-distance', prop: 'distance', unit: 'px' },
      { id: 'neumo-intensity', prop: 'intensity', unit: '%' },
      { id: 'neumo-blur', prop: 'blur', unit: 'px' },
    ];

    sliders.forEach(({ id, prop, unit }) => {
      document.getElementById(id)?.addEventListener('input', (e) => {
        state[prop] = +e.target.value;
        document.getElementById(`${id}-val`).textContent = e.target.value + unit;
        updatePreview();
      });
    });

    document.getElementById('neumo-shape')?.addEventListener('change', (e) => {
      state.shape = e.target.value;
      updatePreview();
    });

    const bgColor = document.getElementById('neumo-bg');
    const bgHex = document.getElementById('neumo-bg-hex');
    bgColor?.addEventListener('input', (e) => {
      state.bgColor = e.target.value;
      bgHex.value = e.target.value;
      document.getElementById('neumo-bg-val').textContent = e.target.value;
      updatePreview();
    });
    bgHex?.addEventListener('input', (e) => {
      if (/^#[0-9a-f]{6}$/i.test(e.target.value)) {
        state.bgColor = e.target.value;
        bgColor.value = e.target.value;
        document.getElementById('neumo-bg-val').textContent = e.target.value;
        updatePreview();
      }
    });
  },

  getState() { return structuredClone(state); },
  setState(s) { if (s) state = structuredClone(s); },

  reset() {
    state = { size: 200, radius: 30, distance: 8, intensity: 15, blur: 16, bgColor: '#e0e5ec', shape: 'flat' };
  },

  getCode(format) {
    const css = getNeumorphCSS();
    if (format === 'css') {
      return `/* Generated by FreeReign — Neumorphism */\n.neumorphic {\n  background: ${css.bg};\n  box-shadow: ${css.shadow};\n  border-radius: ${css.borderRadius};\n}\n\n/* Apply same background to parent */\n.neumorphic-container {\n  background: ${state.bgColor};\n}`;
    } else if (format === 'scss') {
      return `// Generated by FreeReign — Neumorphism\n$neumo-bg: ${state.bgColor};\n$neumo-light: ${adjustBrightness(state.bgColor, state.intensity)};\n$neumo-dark: ${adjustBrightness(state.bgColor, -state.intensity)};\n\n.neumorphic {\n  background: ${css.bg};\n  box-shadow: ${css.shadow};\n  border-radius: ${css.borderRadius};\n}`;
    } else {
      return `<!-- Generated by FreeReign -->\n<div class="bg-[${state.bgColor}] rounded-[${state.radius}px] shadow-[${css.shadow.replace(/\n\s+/g, ',').replace(/\s+/g, '_')}]">\n  ...\n</div>`;
    }
  }
};

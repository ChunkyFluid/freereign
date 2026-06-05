/* ============================================================
   FreeReign — Color Palette Generator Tool
   ============================================================ */

let state = {
  baseColor: '#6366f1',
  harmony: 'analogous',
  count: 5,
  palette: [],
};

function hexToHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalette() {
  const hsl = hexToHSL(state.baseColor);
  const palette = [];

  switch (state.harmony) {
    case 'analogous':
      for (let i = 0; i < state.count; i++) {
        const offset = (i - Math.floor(state.count / 2)) * 30;
        palette.push(hslToHex(hsl.h + offset, hsl.s, hsl.l));
      }
      break;
    case 'complementary':
      palette.push(state.baseColor);
      palette.push(hslToHex(hsl.h + 180, hsl.s, hsl.l));
      for (let i = 2; i < state.count; i++) {
        palette.push(hslToHex(hsl.h + 180 + (i - 1) * 15, hsl.s - 10, hsl.l + (i * 5)));
      }
      break;
    case 'triadic':
      for (let i = 0; i < state.count; i++) {
        palette.push(hslToHex(hsl.h + (i * 120), hsl.s, hsl.l));
      }
      break;
    case 'split-complementary':
      palette.push(state.baseColor);
      palette.push(hslToHex(hsl.h + 150, hsl.s, hsl.l));
      palette.push(hslToHex(hsl.h + 210, hsl.s, hsl.l));
      for (let i = 3; i < state.count; i++) {
        palette.push(hslToHex(hsl.h + (i * 72), hsl.s - 10, hsl.l + 10));
      }
      break;
    case 'monochromatic':
      for (let i = 0; i < state.count; i++) {
        const lOffset = ((i / (state.count - 1)) * 60) - 30;
        palette.push(hslToHex(hsl.h, hsl.s, Math.max(10, Math.min(90, hsl.l + lOffset))));
      }
      break;
    case 'tetradic':
      for (let i = 0; i < state.count; i++) {
        palette.push(hslToHex(hsl.h + (i * 90), hsl.s, hsl.l));
      }
      break;
    default:
      for (let i = 0; i < state.count; i++) {
        palette.push(hslToHex(hsl.h + (i * 30), hsl.s, hsl.l));
      }
  }

  state.palette = palette.slice(0, state.count);
}

function updatePreview() {
  generatePalette();
  const container = document.getElementById('palette-preview');
  if (container) {
    container.innerHTML = state.palette.map((color, i) => `
      <div class="palette-swatch" style="background: ${color}; flex: 1; min-height: 100%; cursor: pointer; transition: all 0.2s; position: relative;" data-color="${color}" title="Click to copy ${color}">
        <span style="position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); font-family: var(--font-mono); font-size: 0.7rem; color: ${hexToHSL(color).l > 55 ? '#000' : '#fff'}; font-weight: 600; background: rgba(0,0,0,0.15); padding: 2px 8px; border-radius: 4px; white-space: nowrap;">${color.toUpperCase()}</span>
      </div>
    `).join('');

    // Click to copy
    container.querySelectorAll('.palette-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        navigator.clipboard.writeText(swatch.dataset.color);
        window.__showToast?.(`Copied ${swatch.dataset.color}`, 'success');
      });
      swatch.addEventListener('mouseenter', () => swatch.style.flex = '1.5');
      swatch.addEventListener('mouseleave', () => swatch.style.flex = '1');
    });
  }
  if (window.__updateCode) window.__updateCode();
}

export const colorPaletteTool = {
  id: 'colorpalette',
  name: 'Color Palette',
  icon: '🎯',
  description: 'Generate harmonious color palettes from any base color. Analogous, complementary, triadic, and more color theories.',
  shortDesc: 'Harmonious color palettes',
  isPro: false,
  isNew: false,

  renderControls() {
    return `
      <div class="control-group">
        <span class="control-label">Base Color</span>
        <div class="control-row">
          <input type="color" value="${state.baseColor}" id="palette-color" />
          <input type="text" class="control-input" value="${state.baseColor}" id="palette-hex" style="font-family: var(--font-mono); flex:1" />
        </div>
      </div>
      <div class="control-group">
        <span class="control-label">Harmony</span>
        <select class="control-select" id="palette-harmony">
          <option value="analogous" ${state.harmony === 'analogous' ? 'selected' : ''}>Analogous</option>
          <option value="complementary" ${state.harmony === 'complementary' ? 'selected' : ''}>Complementary</option>
          <option value="triadic" ${state.harmony === 'triadic' ? 'selected' : ''}>Triadic</option>
          <option value="split-complementary" ${state.harmony === 'split-complementary' ? 'selected' : ''}>Split Complementary</option>
          <option value="monochromatic" ${state.harmony === 'monochromatic' ? 'selected' : ''}>Monochromatic</option>
          <option value="tetradic" ${state.harmony === 'tetradic' ? 'selected' : ''}>Tetradic</option>
        </select>
      </div>
      <div class="control-group">
        <span class="control-label">Colors <span class="control-value" id="palette-count-val">${state.count}</span></span>
        <input type="range" min="3" max="8" value="${state.count}" id="palette-count" />
      </div>
      <button class="add-stop-btn" id="palette-random" style="border-style:solid;border-color:var(--accent-primary);color:var(--accent-primary)">
        🎲 Random Base Color
      </button>
    `;
  },

  renderPreview() {
    return `<div id="palette-preview" style="display: flex; width: 100%; height: 100%; border-radius: var(--radius-lg); overflow: hidden;"></div>`;
  },

  init() {
    updatePreview();

    const colorInput = document.getElementById('palette-color');
    const hexInput = document.getElementById('palette-hex');
    const harmonySelect = document.getElementById('palette-harmony');
    const countSlider = document.getElementById('palette-count');
    const randomBtn = document.getElementById('palette-random');

    colorInput?.addEventListener('input', (e) => {
      state.baseColor = e.target.value;
      hexInput.value = e.target.value;
      updatePreview();
    });

    hexInput?.addEventListener('input', (e) => {
      const val = e.target.value;
      if (/^#[0-9a-f]{6}$/i.test(val)) {
        state.baseColor = val;
        colorInput.value = val;
        updatePreview();
      }
    });

    harmonySelect?.addEventListener('change', (e) => {
      state.harmony = e.target.value;
      updatePreview();
    });

    countSlider?.addEventListener('input', (e) => {
      state.count = +e.target.value;
      document.getElementById('palette-count-val').textContent = state.count;
      updatePreview();
    });

    randomBtn?.addEventListener('click', () => {
      state.baseColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      colorInput.value = state.baseColor;
      hexInput.value = state.baseColor;
      updatePreview();
    });
  },

  getState() { return structuredClone(state); },
  setState(s) { if (s) state = structuredClone(s); },

  reset() {
    state = { baseColor: '#6366f1', harmony: 'analogous', count: 5, palette: [] };
  },

  getCode(format) {
    generatePalette();
    if (format === 'css') {
      const vars = state.palette.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n');
      return `/* Generated by FreeReign — ${state.harmony} palette */\n:root {\n${vars}\n}`;
    } else if (format === 'scss') {
      const vars = state.palette.map((c, i) => `$color-${i + 1}: ${c};`).join('\n');
      return `// Generated by FreeReign — ${state.harmony} palette\n${vars}`;
    } else {
      const colors = {};
      state.palette.forEach((c, i) => { colors[`palette-${i + 1}`] = c; });
      return `// Generated by FreeReign\n// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(colors, null, 8).replace(/^/gm, '      ').trim()}\n    }\n  }\n}`;
    }
  }
};

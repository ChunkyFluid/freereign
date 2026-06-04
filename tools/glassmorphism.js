/* ============================================================
   FreeReign — Glassmorphism Generator Tool
   ============================================================ */

let state = {
  blur: 16,
  opacity: 20,
  saturation: 120,
  borderOpacity: 30,
  borderRadius: 16,
  bgColor: '#ffffff',
  backdropColor: '#6366f1',
};

function getGlassCSS() {
  const r = parseInt(state.bgColor.slice(1, 3), 16);
  const g = parseInt(state.bgColor.slice(3, 5), 16);
  const b = parseInt(state.bgColor.slice(5, 7), 16);
  return {
    background: `rgba(${r}, ${g}, ${b}, ${(state.opacity / 100).toFixed(2)})`,
    backdropFilter: `blur(${state.blur}px) saturate(${state.saturation}%)`,
    webkitBackdropFilter: `blur(${state.blur}px) saturate(${state.saturation}%)`,
    border: `1px solid rgba(${r}, ${g}, ${b}, ${(state.borderOpacity / 100).toFixed(2)})`,
    borderRadius: `${state.borderRadius}px`,
  };
}

function updatePreview() {
  const el = document.getElementById('glass-preview');
  const backdrop = document.getElementById('glass-backdrop');
  if (el) {
    const css = getGlassCSS();
    el.style.background = css.background;
    el.style.backdropFilter = css.backdropFilter;
    el.style.webkitBackdropFilter = css.webkitBackdropFilter;
    el.style.border = css.border;
    el.style.borderRadius = css.borderRadius;
  }
  if (backdrop) {
    backdrop.style.background = `linear-gradient(135deg, ${state.backdropColor}, ${adjustHue(state.backdropColor, 60)})`;
  }
  if (window.__updateCode) window.__updateCode();
}

function adjustHue(hex, deg) {
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
  h = ((h * 360 + deg) % 360) / 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const a2 = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h * 12) % 12;
    const c = l - a2 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export const glassmorphismTool = {
  id: 'glassmorphism',
  name: 'Glassmorphism',
  icon: '💎',
  description: 'Create beautiful frosted glass effects with backdrop blur, transparency, and saturation controls.',
  shortDesc: 'Frosted glass UI effects',
  isPro: false,
  isNew: true,

  renderControls() {
    return `
      <div class="control-group">
        <span class="control-label">Blur <span class="control-value" id="glass-blur-val">${state.blur}px</span></span>
        <input type="range" min="0" max="40" value="${state.blur}" id="glass-blur" />
      </div>
      <div class="control-group">
        <span class="control-label">Opacity <span class="control-value" id="glass-opacity-val">${state.opacity}%</span></span>
        <input type="range" min="0" max="100" value="${state.opacity}" id="glass-opacity" />
      </div>
      <div class="control-group">
        <span class="control-label">Saturation <span class="control-value" id="glass-saturation-val">${state.saturation}%</span></span>
        <input type="range" min="0" max="300" value="${state.saturation}" id="glass-saturation" />
      </div>
      <div class="control-group">
        <span class="control-label">Border Opacity <span class="control-value" id="glass-border-val">${state.borderOpacity}%</span></span>
        <input type="range" min="0" max="100" value="${state.borderOpacity}" id="glass-border" />
      </div>
      <div class="control-group">
        <span class="control-label">Border Radius <span class="control-value" id="glass-radius-val">${state.borderRadius}px</span></span>
        <input type="range" min="0" max="50" value="${state.borderRadius}" id="glass-radius" />
      </div>
      <div class="control-group">
        <span class="control-label">Glass Color</span>
        <div class="control-row">
          <input type="color" value="${state.bgColor}" id="glass-color" />
          <input type="text" class="control-input" value="${state.bgColor}" id="glass-color-hex" style="font-family:var(--font-mono);flex:1" />
        </div>
      </div>
      <div class="control-group">
        <span class="control-label">Backdrop Color</span>
        <div class="control-row">
          <input type="color" value="${state.backdropColor}" id="glass-backdrop-color" />
          <input type="text" class="control-input" value="${state.backdropColor}" id="glass-backdrop-hex" style="font-family:var(--font-mono);flex:1" />
        </div>
      </div>
    `;
  },

  renderPreview() {
    return `
      <div style="position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
        <div id="glass-backdrop" style="position:absolute;inset:40px;border-radius:24px;background:linear-gradient(135deg, ${state.backdropColor}, ${adjustHue(state.backdropColor, 60)});">
          <div style="position:absolute;top:20%;left:15%;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.3);"></div>
          <div style="position:absolute;bottom:20%;right:20%;width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,0.2);"></div>
          <div style="position:absolute;top:40%;right:15%;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.25);"></div>
        </div>
        <div id="glass-preview" style="
          position:relative;z-index:1;
          width:240px;height:160px;
          padding:24px;
          display:flex;flex-direction:column;justify-content:center;
          color:white;text-shadow:0 1px 2px rgba(0,0,0,0.1);
        ">
          <div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Glass Card</div>
          <div style="font-size:0.75rem;opacity:0.85;line-height:1.4;">A beautiful frosted glass effect using backdrop-filter.</div>
        </div>
      </div>
    `;
  },

  init() {
    updatePreview();

    const controls = [
      { id: 'glass-blur', prop: 'blur', unit: 'px' },
      { id: 'glass-opacity', prop: 'opacity', unit: '%' },
      { id: 'glass-saturation', prop: 'saturation', unit: '%' },
      { id: 'glass-border', prop: 'borderOpacity', unit: '%' },
      { id: 'glass-radius', prop: 'borderRadius', unit: 'px' },
    ];

    controls.forEach(({ id, prop, unit }) => {
      const el = document.getElementById(id);
      el?.addEventListener('input', (e) => {
        state[prop] = +e.target.value;
        document.getElementById(`${id}-val`).textContent = e.target.value + unit;
        updatePreview();
      });
    });

    const colorInput = document.getElementById('glass-color');
    const colorHex = document.getElementById('glass-color-hex');
    colorInput?.addEventListener('input', (e) => { state.bgColor = e.target.value; colorHex.value = e.target.value; updatePreview(); });
    colorHex?.addEventListener('input', (e) => { if (/^#[0-9a-f]{6}$/i.test(e.target.value)) { state.bgColor = e.target.value; colorInput.value = e.target.value; updatePreview(); }});

    const bdInput = document.getElementById('glass-backdrop-color');
    const bdHex = document.getElementById('glass-backdrop-hex');
    bdInput?.addEventListener('input', (e) => { state.backdropColor = e.target.value; bdHex.value = e.target.value; updatePreview(); });
    bdHex?.addEventListener('input', (e) => { if (/^#[0-9a-f]{6}$/i.test(e.target.value)) { state.backdropColor = e.target.value; bdInput.value = e.target.value; updatePreview(); }});
  },

  reset() {
    state = { blur: 16, opacity: 20, saturation: 120, borderOpacity: 30, borderRadius: 16, bgColor: '#ffffff', backdropColor: '#6366f1' };
  },

  getCode(format) {
    const css = getGlassCSS();
    if (format === 'css') {
      return `/* Generated by FreeReign */\n.glass {\n  background: ${css.background};\n  backdrop-filter: ${css.backdropFilter};\n  -webkit-backdrop-filter: ${css.webkitBackdropFilter};\n  border: ${css.border};\n  border-radius: ${css.borderRadius};\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);\n}`;
    } else if (format === 'scss') {
      return `// Generated by FreeReign\n@mixin glassmorphism($blur: ${state.blur}px, $opacity: ${(state.opacity / 100).toFixed(2)}) {\n  background: ${css.background};\n  backdrop-filter: blur($blur) saturate(${state.saturation}%);\n  -webkit-backdrop-filter: blur($blur) saturate(${state.saturation}%);\n  border: ${css.border};\n  border-radius: ${css.borderRadius};\n}\n\n.glass {\n  @include glassmorphism;\n}`;
    } else {
      return `<!-- Generated by FreeReign -->\n<div class="backdrop-blur-[${state.blur}px] bg-white/${state.opacity} border border-white/${state.borderOpacity} rounded-[${state.borderRadius}px] saturate-[${state.saturation}%]">\n  ...\n</div>`;
    }
  }
};

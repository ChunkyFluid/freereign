/* ============================================================
   FreeReign — Responsive Breakpoint Tester Tool
   ============================================================ */

let state = {
  width: 375,
  height: 667,
  url: '',
  preset: 'iphone',
  orientation: 'portrait',
  showRuler: true,
};

const DEVICES = [
  { id: 'iphone', name: 'iPhone 15', w: 393, h: 852, icon: '📱' },
  { id: 'iphone-se', name: 'iPhone SE', w: 375, h: 667, icon: '📱' },
  { id: 'iphone-plus', name: 'iPhone 15 Plus', w: 430, h: 932, icon: '📱' },
  { id: 'pixel', name: 'Pixel 8', w: 412, h: 915, icon: '📱' },
  { id: 'ipad', name: 'iPad', w: 820, h: 1180, icon: '📋' },
  { id: 'ipad-pro', name: 'iPad Pro 12.9"', w: 1024, h: 1366, icon: '📋' },
  { id: 'macbook', name: 'MacBook Air', w: 1280, h: 800, icon: '💻' },
  { id: 'desktop', name: 'Desktop 1080p', w: 1920, h: 1080, icon: '🖥️' },
  { id: '4k', name: '4K Display', w: 2560, h: 1440, icon: '🖥️' },
];

const BREAKPOINTS = [
  { label: 'xs', min: 0, max: 479, color: '#ef4444' },
  { label: 'sm', min: 480, max: 639, color: '#f97316' },
  { label: 'md', min: 640, max: 767, color: '#eab308' },
  { label: 'lg', min: 768, max: 1023, color: '#22c55e' },
  { label: 'xl', min: 1024, max: 1279, color: '#3b82f6' },
  { label: '2xl', min: 1280, max: 9999, color: '#8b5cf6' },
];

function getCurrentBreakpoint() {
  const w = state.orientation === 'portrait' ? state.width : state.height;
  return BREAKPOINTS.find(bp => w >= bp.min && w <= bp.max) || BREAKPOINTS[0];
}

function updatePreview() {
  const container = document.getElementById('bp-preview');
  const infoBar = document.getElementById('bp-info');
  if (!container) return;

  const w = state.orientation === 'portrait' ? state.width : state.height;
  const h = state.orientation === 'portrait' ? state.height : state.width;

  // Scale to fit
  const maxW = container.parentElement.clientWidth - 40;
  const maxH = container.parentElement.clientHeight - 60;
  const scaleW = maxW / w;
  const scaleH = maxH / h;
  const scale = Math.min(scaleW, scaleH, 1);

  container.style.width = w + 'px';
  container.style.height = h + 'px';
  container.style.transform = `scale(${scale})`;
  container.style.transformOrigin = 'top center';

  const bp = getCurrentBreakpoint();
  if (infoBar) {
    infoBar.innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:6px;">
        <span style="width:8px;height:8px;border-radius:50%;background:${bp.color};"></span>
        <strong>${w} × ${h}</strong>
        <span style="color:var(--text-tertiary)">·</span>
        <span style="color:${bp.color};font-weight:600;">${bp.label}</span>
      </span>
    `;
  }

  // Render breakpoint indicators
  const ruler = document.getElementById('bp-ruler');
  if (ruler && state.showRuler) {
    ruler.style.display = 'block';
    ruler.innerHTML = BREAKPOINTS.map(bp => {
      const bpW = Math.min(bp.max, 1920);
      const pct = (bpW / 1920) * 100;
      const isActive = w >= bp.min && w <= bp.max;
      return `<div style="
        position:absolute;left:0;
        width:${pct}%;height:100%;
        border-right:2px solid ${bp.color};
        opacity:${isActive ? 1 : 0.3};
      ">
        <span style="
          position:absolute;right:4px;top:0;
          font-size:9px;font-weight:600;color:${bp.color};
        ">${bp.label}</span>
      </div>`;
    }).join('');
  } else if (ruler) {
    ruler.style.display = 'none';
  }

  if (window.__updateCode) window.__updateCode();
}

export const breakpointTool = {
  id: 'breakpoint',
  name: 'Breakpoint Tester',
  icon: '📏',
  description: 'Test responsive breakpoints across popular device sizes. Visualize how your layouts respond at different viewport widths.',
  shortDesc: 'Responsive viewport tester',
  isPro: true,
  isNew: true,

  renderControls() {
    return `
      <div class="control-group">
        <span class="control-label">Device</span>
        <select class="control-select" id="bp-device">
          ${DEVICES.map(d =>
            `<option value="${d.id}" ${state.preset === d.id ? 'selected' : ''}>${d.icon} ${d.name} (${d.w}×${d.h})</option>`
          ).join('')}
          <option value="custom">✏️ Custom Size</option>
        </select>
      </div>
      <div class="control-group">
        <span class="control-label">Width <span class="control-value" id="bp-w-val">${state.width}px</span></span>
        <input type="range" min="240" max="2560" value="${state.width}" id="bp-width" />
      </div>
      <div class="control-group">
        <span class="control-label">Height <span class="control-value" id="bp-h-val">${state.height}px</span></span>
        <input type="range" min="320" max="1600" value="${state.height}" id="bp-height" />
      </div>
      <div class="control-group">
        <span class="control-label">Orientation</span>
        <select class="control-select" id="bp-orientation">
          <option value="portrait" ${state.orientation === 'portrait' ? 'selected' : ''}>Portrait</option>
          <option value="landscape" ${state.orientation === 'landscape' ? 'selected' : ''}>Landscape</option>
        </select>
      </div>
      <div class="control-group">
        <label class="control-checkbox">
          <input type="checkbox" id="bp-ruler-check" ${state.showRuler ? 'checked' : ''} />
          Show breakpoint ruler
        </label>
      </div>
      <div class="control-group">
        <span class="control-label" style="margin-bottom:var(--space-2)">Breakpoint Map</span>
        ${BREAKPOINTS.map(bp => `
          <div style="display:flex;align-items:center;gap:var(--space-2);padding:2px 0;">
            <span style="width:8px;height:8px;border-radius:50%;background:${bp.color};flex-shrink:0;"></span>
            <span style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--accent-primary);min-width:24px;font-weight:600;">${bp.label}</span>
            <span style="font-size:var(--text-xs);color:var(--text-tertiary);">${bp.min}${bp.max < 9999 ? '–' + bp.max : '+'}px</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderPreview() {
    return `
      <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;padding:var(--space-4);overflow:hidden;">
        <div id="bp-info" style="font-family:var(--font-mono);font-size:var(--text-sm);margin-bottom:var(--space-3);"></div>
        <div style="position:relative;flex:1;display:flex;align-items:flex-start;justify-content:center;width:100%;overflow:hidden;">
          <div id="bp-preview" style="
            border: 2px solid var(--border-default);
            border-radius: var(--radius-md);
            background: var(--bg-surface);
            overflow: hidden;
            position: relative;
            transition: width 0.3s ease, height 0.3s ease;
          ">
            <div style="
              width:100%;height:100%;
              display:flex;flex-direction:column;
              align-items:center;justify-content:center;
              background:linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%);
              padding:var(--space-4);
            ">
              <div style="font-size:1.5rem;margin-bottom:var(--space-2);">📐</div>
              <div style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary);margin-bottom:var(--space-1);text-align:center;">Viewport Preview</div>
              <div style="font-size:var(--text-xs);color:var(--text-tertiary);text-align:center;">This area represents your viewport at the selected device dimensions</div>
            </div>
          </div>
        </div>
        <div id="bp-ruler" style="width:100%;height:16px;position:relative;margin-top:var(--space-2);"></div>
      </div>
    `;
  },

  init() {
    updatePreview();

    document.getElementById('bp-device')?.addEventListener('change', (e) => {
      const device = DEVICES.find(d => d.id === e.target.value);
      if (device) {
        state.preset = device.id;
        state.width = device.w;
        state.height = device.h;
        document.getElementById('bp-width').value = state.width;
        document.getElementById('bp-height').value = state.height;
        document.getElementById('bp-w-val').textContent = state.width + 'px';
        document.getElementById('bp-h-val').textContent = state.height + 'px';
      }
      updatePreview();
    });

    document.getElementById('bp-width')?.addEventListener('input', (e) => {
      state.width = +e.target.value;
      document.getElementById('bp-w-val').textContent = state.width + 'px';
      updatePreview();
    });

    document.getElementById('bp-height')?.addEventListener('input', (e) => {
      state.height = +e.target.value;
      document.getElementById('bp-h-val').textContent = state.height + 'px';
      updatePreview();
    });

    document.getElementById('bp-orientation')?.addEventListener('change', (e) => {
      state.orientation = e.target.value;
      updatePreview();
    });

    document.getElementById('bp-ruler-check')?.addEventListener('change', (e) => {
      state.showRuler = e.target.checked;
      updatePreview();
    });
  },

  reset() {
    state = { width: 375, height: 667, url: '', preset: 'iphone', orientation: 'portrait', showRuler: true };
  },

  getCode(format) {
    if (format === 'css') {
      return `/* Generated by FreeReign — Responsive Breakpoints */\n\n/* Mobile First Approach */\n.container {\n  /* Base styles (mobile) */\n  padding: 1rem;\n}\n\n/* Small (${BREAKPOINTS[1].min}px+) */\n@media (min-width: ${BREAKPOINTS[1].min}px) {\n  .container {\n    padding: 1.5rem;\n  }\n}\n\n/* Medium (${BREAKPOINTS[2].min}px+) */\n@media (min-width: ${BREAKPOINTS[2].min}px) {\n  .container {\n    padding: 2rem;\n    max-width: ${BREAKPOINTS[2].max}px;\n  }\n}\n\n/* Large (${BREAKPOINTS[3].min}px+) */\n@media (min-width: ${BREAKPOINTS[3].min}px) {\n  .container {\n    padding: 2.5rem;\n    max-width: ${BREAKPOINTS[3].max}px;\n  }\n}\n\n/* XL (${BREAKPOINTS[4].min}px+) */\n@media (min-width: ${BREAKPOINTS[4].min}px) {\n  .container {\n    padding: 3rem;\n    max-width: ${BREAKPOINTS[4].max}px;\n  }\n}\n\n/* 2XL (${BREAKPOINTS[5].min}px+) */\n@media (min-width: ${BREAKPOINTS[5].min}px) {\n  .container {\n    max-width: 1400px;\n    margin: 0 auto;\n  }\n}`;
    } else if (format === 'scss') {
      return `// Generated by FreeReign — Responsive Breakpoints\n$breakpoints: (\n${BREAKPOINTS.map(bp => `  '${bp.label}': ${bp.min}px`).join(',\n')}\n);\n\n@mixin respond-to($breakpoint) {\n  @if map-has-key($breakpoints, $breakpoint) {\n    @media (min-width: map-get($breakpoints, $breakpoint)) {\n      @content;\n    }\n  }\n}\n\n// Usage:\n.container {\n  padding: 1rem;\n\n  @include respond-to('md') {\n    padding: 2rem;\n  }\n\n  @include respond-to('lg') {\n    padding: 3rem;\n  }\n}`;
    } else {
      return `<!-- Generated by FreeReign -->\n<!-- Tailwind default breakpoints -->\n<!-- sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px -->\n\n<div class="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:max-w-7xl 2xl:mx-auto">\n  <!-- Responsive container -->\n</div>\n\n<!-- Current viewport: ${state.width}×${state.height} (${getCurrentBreakpoint().label}) -->`;
    }
  }
};

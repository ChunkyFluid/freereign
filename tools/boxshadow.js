/* ============================================================
   FreeReign — Box Shadow Generator Tool
   ============================================================ */

let shadows = [
  { x: 0, y: 4, blur: 20, spread: 0, color: '#6366f1', opacity: 40, inset: false },
];

const PRESETS = [
  { name: 'Soft', shadows: [{ x: 0, y: 4, blur: 15, spread: -3, color: '#000000', opacity: 20, inset: false }] },
  { name: 'Sharp', shadows: [{ x: 4, y: 4, blur: 0, spread: 0, color: '#000000', opacity: 40, inset: false }] },
  { name: 'Glow', shadows: [{ x: 0, y: 0, blur: 30, spread: 5, color: '#6366f1', opacity: 50, inset: false }] },
  { name: 'Layered', shadows: [
    { x: 0, y: 1, blur: 3, spread: 0, color: '#000000', opacity: 12, inset: false },
    { x: 0, y: 4, blur: 8, spread: 0, color: '#000000', opacity: 10, inset: false },
    { x: 0, y: 12, blur: 24, spread: 0, color: '#000000', opacity: 8, inset: false },
  ]},
  { name: 'Inset', shadows: [{ x: 0, y: 2, blur: 8, spread: 0, color: '#000000', opacity: 30, inset: true }] },
  { name: 'Neon', shadows: [
    { x: 0, y: 0, blur: 10, spread: 2, color: '#8b5cf6', opacity: 60, inset: false },
    { x: 0, y: 0, blur: 30, spread: 5, color: '#8b5cf6', opacity: 30, inset: false },
  ]},
];

function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
}

function getShadowCSS() {
  return shadows.map(s => {
    const rgba = hexToRgba(s.color, s.opacity);
    return `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${rgba}`;
  }).join(',\n    ');
}

function updatePreview() {
  const el = document.getElementById('shadow-preview');
  if (el) el.style.boxShadow = shadows.map(s => {
    const rgba = hexToRgba(s.color, s.opacity);
    return `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${rgba}`;
  }).join(', ');
  if (window.__updateCode) window.__updateCode();
}

function renderShadowList() {
  const container = document.getElementById('shadow-list');
  if (!container) return;

  container.innerHTML = shadows.map((s, i) => `
    <div class="control-group" style="padding: var(--space-3); background: var(--bg-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-2)">
        <span style="font-size:var(--text-xs);font-weight:var(--weight-semibold);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em">Shadow ${i + 1}</span>
        ${shadows.length > 1 ? `<button class="color-stop__remove" data-shadow-index="${i}">×</button>` : ''}
      </div>
      <div class="control-row" style="margin-bottom:var(--space-2)">
        <input type="color" value="${s.color}" data-prop="color" data-index="${i}" class="shadow-input" />
        <label class="control-checkbox" style="font-size:var(--text-xs)">
          <input type="checkbox" ${s.inset ? 'checked' : ''} data-prop="inset" data-index="${i}" class="shadow-input" />
          Inset
        </label>
      </div>
      <div class="control-group" style="margin-bottom:var(--space-1)">
        <span class="control-label">X Offset <span class="control-value">${s.x}px</span></span>
        <input type="range" min="-50" max="50" value="${s.x}" data-prop="x" data-index="${i}" class="shadow-input" />
      </div>
      <div class="control-group" style="margin-bottom:var(--space-1)">
        <span class="control-label">Y Offset <span class="control-value">${s.y}px</span></span>
        <input type="range" min="-50" max="50" value="${s.y}" data-prop="y" data-index="${i}" class="shadow-input" />
      </div>
      <div class="control-group" style="margin-bottom:var(--space-1)">
        <span class="control-label">Blur <span class="control-value">${s.blur}px</span></span>
        <input type="range" min="0" max="100" value="${s.blur}" data-prop="blur" data-index="${i}" class="shadow-input" />
      </div>
      <div class="control-group" style="margin-bottom:var(--space-1)">
        <span class="control-label">Spread <span class="control-value">${s.spread}px</span></span>
        <input type="range" min="-30" max="30" value="${s.spread}" data-prop="spread" data-index="${i}" class="shadow-input" />
      </div>
      <div class="control-group">
        <span class="control-label">Opacity <span class="control-value">${s.opacity}%</span></span>
        <input type="range" min="0" max="100" value="${s.opacity}" data-prop="opacity" data-index="${i}" class="shadow-input" />
      </div>
    </div>
  `).join('');

  // Bind events
  container.querySelectorAll('.shadow-input').forEach(input => {
    const handler = (e) => {
      const idx = +e.target.dataset.index;
      const prop = e.target.dataset.prop;
      if (prop === 'inset') {
        shadows[idx].inset = e.target.checked;
      } else if (prop === 'color') {
        shadows[idx].color = e.target.value;
      } else {
        shadows[idx][prop] = +e.target.value;
        const valueSpan = e.target.closest('.control-group')?.querySelector('.control-value');
        if (valueSpan) valueSpan.textContent = e.target.value + (prop === 'opacity' ? '%' : 'px');
      }
      updatePreview();
    };
    input.addEventListener('input', handler);
    input.addEventListener('change', handler);
  });

  container.querySelectorAll('.color-stop__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      shadows.splice(+btn.dataset.shadowIndex, 1);
      renderShadowList();
      updatePreview();
    });
  });
}

export const boxShadowTool = {
  id: 'boxshadow',
  name: 'Box Shadow',
  icon: '🌑',
  description: 'Design layered box shadows with precise control over offset, blur, spread, color, and opacity. Stack multiple shadows for depth.',
  shortDesc: 'Layered shadows with depth',
  isPro: false,
  isNew: false,

  renderControls() {
    return `
      <div id="shadow-list"></div>
      <button class="add-stop-btn" id="add-shadow-btn">+ Add Shadow Layer</button>
      <div class="control-group">
        <span class="control-label">Presets</span>
        <div class="preset-grid" id="shadow-presets">
          ${PRESETS.map((p, i) => {
            const bg = '#1a1a28';
            const shadow = p.shadows.map(s => `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${hexToRgba(s.color, s.opacity)}`).join(', ');
            return `<button class="preset-btn" data-index="${i}" style="background:${bg};box-shadow:${shadow}" title="${p.name}"></button>`;
          }).join('')}
        </div>
      </div>
    `;
  },

  renderPreview() {
    return `<div class="preview-element" id="shadow-preview" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg);"></div>`;
  },

  init() {
    renderShadowList();
    updatePreview();

    document.getElementById('add-shadow-btn')?.addEventListener('click', () => {
      shadows.push({ x: 0, y: 4, blur: 20, spread: 0, color: '#000000', opacity: 20, inset: false });
      renderShadowList();
      updatePreview();
    });

    document.querySelectorAll('#shadow-presets .preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        shadows = JSON.parse(JSON.stringify(PRESETS[+btn.dataset.index].shadows));
        renderShadowList();
        updatePreview();
      });
    });
  },

  reset() {
    shadows = [{ x: 0, y: 4, blur: 20, spread: 0, color: '#6366f1', opacity: 40, inset: false }];
  },

  getCode(format) {
    const css = getShadowCSS();
    if (format === 'css') {
      return `/* Generated by FreeReign */\n.element {\n  box-shadow: ${css};\n}`;
    } else if (format === 'scss') {
      return `// Generated by FreeReign\n$shadow: ${css};\n\n.element {\n  box-shadow: $shadow;\n}`;
    } else {
      return `<!-- Generated by FreeReign -->\n<div class="shadow-[${css.replace(/\s+/g, '_').replace(/,/g, ',')}]">\n  ...\n</div>`;
    }
  }
};

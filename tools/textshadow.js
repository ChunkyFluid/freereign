/* ============================================================
   FreeReign — Text Shadow Generator Tool
   ============================================================ */

let shadows = [
  { x: 2, y: 2, blur: 4, color: '#6366f1', opacity: 80 },
];

function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
}

function getTextShadowCSS() {
  return shadows.map(s => {
    return `${s.x}px ${s.y}px ${s.blur}px ${hexToRgba(s.color, s.opacity)}`;
  }).join(',\n    ');
}

function updatePreview() {
  const el = document.getElementById('tshadow-preview');
  if (el) {
    el.style.textShadow = shadows.map(s =>
      `${s.x}px ${s.y}px ${s.blur}px ${hexToRgba(s.color, s.opacity)}`
    ).join(', ');
  }
  if (window.__updateCode) window.__updateCode();
}

function renderShadowList() {
  const container = document.getElementById('tshadow-list');
  if (!container) return;

  container.innerHTML = shadows.map((s, i) => `
    <div style="padding:var(--space-3);background:var(--bg-elevated);border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-2)">
        <span style="font-size:var(--text-xs);font-weight:var(--weight-semibold);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em">Shadow ${i + 1}</span>
        <div style="display:flex;align-items:center;gap:var(--space-2)">
          <input type="color" value="${s.color}" data-index="${i}" data-prop="color" class="ts-input" />
          ${shadows.length > 1 ? `<button class="color-stop__remove" data-ts-index="${i}">×</button>` : ''}
        </div>
      </div>
      <div class="control-group" style="margin-bottom:var(--space-1)">
        <span class="control-label">X <span class="control-value">${s.x}px</span></span>
        <input type="range" min="-30" max="30" value="${s.x}" data-index="${i}" data-prop="x" class="ts-input" />
      </div>
      <div class="control-group" style="margin-bottom:var(--space-1)">
        <span class="control-label">Y <span class="control-value">${s.y}px</span></span>
        <input type="range" min="-30" max="30" value="${s.y}" data-index="${i}" data-prop="y" class="ts-input" />
      </div>
      <div class="control-group" style="margin-bottom:var(--space-1)">
        <span class="control-label">Blur <span class="control-value">${s.blur}px</span></span>
        <input type="range" min="0" max="50" value="${s.blur}" data-index="${i}" data-prop="blur" class="ts-input" />
      </div>
      <div class="control-group">
        <span class="control-label">Opacity <span class="control-value">${s.opacity}%</span></span>
        <input type="range" min="0" max="100" value="${s.opacity}" data-index="${i}" data-prop="opacity" class="ts-input" />
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.ts-input').forEach(input => {
    const handler = (e) => {
      const idx = +e.target.dataset.index;
      const prop = e.target.dataset.prop;
      if (prop === 'color') {
        shadows[idx].color = e.target.value;
      } else {
        shadows[idx][prop] = +e.target.value;
        const valSpan = e.target.closest('.control-group')?.querySelector('.control-value');
        if (valSpan) valSpan.textContent = e.target.value + (prop === 'opacity' ? '%' : 'px');
      }
      updatePreview();
    };
    input.addEventListener('input', handler);
  });

  container.querySelectorAll('.color-stop__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      shadows.splice(+btn.dataset.tsIndex, 1);
      renderShadowList();
      updatePreview();
    });
  });
}

export const textShadowTool = {
  id: 'textshadow',
  name: 'Text Shadow',
  icon: '💬',
  description: 'Create eye-catching text shadow effects with multiple layers, colors, and precise offset controls.',
  shortDesc: 'Layered text shadow effects',
  isPro: false,
  isNew: false,

  renderControls() {
    return `
      <div id="tshadow-list" style="display:flex;flex-direction:column;gap:var(--space-3)"></div>
      <button class="add-stop-btn" id="add-tshadow-btn">+ Add Shadow Layer</button>
      <div class="control-group">
        <span class="control-label">Preview Text</span>
        <input type="text" class="control-input" value="FreeReign" id="tshadow-text" />
      </div>
      <div class="control-group">
        <span class="control-label">Font Size <span class="control-value" id="tshadow-size-val">48px</span></span>
        <input type="range" min="16" max="96" value="48" id="tshadow-size" />
      </div>
      <div class="control-group">
        <span class="control-label">Text Color</span>
        <input type="color" value="#ededf4" id="tshadow-color" />
      </div>
    `;
  },

  renderPreview() {
    return `<div id="tshadow-preview" style="
      font-size: 48px;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.02em;
      user-select: none;
      transition: text-shadow 0.2s ease;
    ">FreeReign</div>`;
  },

  init() {
    renderShadowList();
    updatePreview();

    document.getElementById('add-tshadow-btn')?.addEventListener('click', () => {
      shadows.push({ x: 2, y: 2, blur: 4, color: '#8b5cf6', opacity: 60 });
      renderShadowList();
      updatePreview();
    });

    document.getElementById('tshadow-text')?.addEventListener('input', (e) => {
      const el = document.getElementById('tshadow-preview');
      if (el) el.textContent = e.target.value || 'FreeReign';
    });

    document.getElementById('tshadow-size')?.addEventListener('input', (e) => {
      const el = document.getElementById('tshadow-preview');
      if (el) el.style.fontSize = e.target.value + 'px';
      document.getElementById('tshadow-size-val').textContent = e.target.value + 'px';
    });

    document.getElementById('tshadow-color')?.addEventListener('input', (e) => {
      const el = document.getElementById('tshadow-preview');
      if (el) el.style.color = e.target.value;
    });
  },

  reset() {
    shadows = [{ x: 2, y: 2, blur: 4, color: '#6366f1', opacity: 80 }];
  },

  getCode(format) {
    const css = getTextShadowCSS();
    if (format === 'css') {
      return `/* Generated by FreeReign */\n.text-effect {\n  text-shadow: ${css};\n}`;
    } else if (format === 'scss') {
      return `// Generated by FreeReign\n$text-shadow: ${css};\n\n.text-effect {\n  text-shadow: $text-shadow;\n}`;
    } else {
      return `<!-- Generated by FreeReign -->\n<span class="[text-shadow:${css.replace(/\s+/g, '_')}]">\n  Your text\n</span>`;
    }
  }
};

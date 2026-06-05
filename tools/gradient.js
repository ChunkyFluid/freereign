/* ============================================================
   FreeReign — Gradient Generator Tool
   ============================================================ */

const DEFAULT_STOPS = [
  { color: '#6366f1', position: 0 },
  { color: '#8b5cf6', position: 50 },
  { color: '#d946ef', position: 100 },
];

const PRESETS = [
  { name: 'Indigo Dream', stops: [{ color: '#6366f1', position: 0 }, { color: '#8b5cf6', position: 50 }, { color: '#d946ef', position: 100 }] },
  { name: 'Ocean', stops: [{ color: '#0ea5e9', position: 0 }, { color: '#6366f1', position: 100 }] },
  { name: 'Sunset', stops: [{ color: '#f97316', position: 0 }, { color: '#ef4444', position: 50 }, { color: '#ec4899', position: 100 }] },
  { name: 'Forest', stops: [{ color: '#059669', position: 0 }, { color: '#10b981', position: 100 }] },
  { name: 'Midnight', stops: [{ color: '#1e1b4b', position: 0 }, { color: '#4338ca', position: 100 }] },
  { name: 'Peach', stops: [{ color: '#fbbf24', position: 0 }, { color: '#f97316', position: 50 }, { color: '#ef4444', position: 100 }] },
  { name: 'Aurora', stops: [{ color: '#06b6d4', position: 0 }, { color: '#8b5cf6', position: 50 }, { color: '#ec4899', position: 100 }] },
  { name: 'Minimal', stops: [{ color: '#e5e7eb', position: 0 }, { color: '#f9fafb', position: 100 }] },
];

let state = {
  type: 'linear',
  angle: 135,
  stops: JSON.parse(JSON.stringify(DEFAULT_STOPS)),
};

function getGradientCSS() {
  const stopsStr = [...state.stops]
    .sort((a, b) => a.position - b.position)
    .map(s => `${s.color} ${s.position}%`)
    .join(', ');

  if (state.type === 'linear') {
    return `linear-gradient(${state.angle}deg, ${stopsStr})`;
  } else if (state.type === 'radial') {
    return `radial-gradient(circle, ${stopsStr})`;
  } else {
    return `conic-gradient(from ${state.angle}deg, ${stopsStr})`;
  }
}

function updatePreview() {
  const preview = document.getElementById('gradient-preview');
  if (preview) {
    preview.style.background = getGradientCSS();
  }
  if (window.__updateCode) window.__updateCode();
}

function renderStops() {
  const container = document.getElementById('gradient-stops');
  if (!container) return;

  container.innerHTML = state.stops.map((stop, i) => `
    <div class="color-stop">
      <input type="color" value="${stop.color}" data-index="${i}" class="gradient-stop-color" />
      <input type="range" min="0" max="100" value="${stop.position}" data-index="${i}" class="gradient-stop-pos" style="flex:1" />
      <span class="control-value" style="min-width:36px;text-align:center">${stop.position}%</span>
      ${state.stops.length > 2 ? `<button class="color-stop__remove" data-index="${i}">×</button>` : ''}
    </div>
  `).join('');

  // Bind stop events
  container.querySelectorAll('.gradient-stop-color').forEach(input => {
    input.addEventListener('input', (e) => {
      state.stops[+e.target.dataset.index].color = e.target.value;
      updatePreview();
    });
  });

  container.querySelectorAll('.gradient-stop-pos').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = +e.target.dataset.index;
      state.stops[idx].position = +e.target.value;
      e.target.nextElementSibling.textContent = e.target.value + '%';
      updatePreview();
    });
  });

  container.querySelectorAll('.color-stop__remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.stops.splice(+e.target.dataset.index, 1);
      renderStops();
      updatePreview();
    });
  });
}

export const gradientTool = {
  id: 'gradient',
  name: 'Gradient Generator',
  icon: '🎨',
  description: 'Create stunning CSS gradients with multiple color stops, angles, and types. Linear, radial, and conic gradients with live preview.',
  shortDesc: 'Linear, radial & conic gradients',
  isPro: false,
  isNew: false,

  renderControls() {
    return `
      <div class="control-group">
        <span class="control-label">Type</span>
        <select class="control-select" id="gradient-type">
          <option value="linear" ${state.type === 'linear' ? 'selected' : ''}>Linear</option>
          <option value="radial" ${state.type === 'radial' ? 'selected' : ''}>Radial</option>
          <option value="conic" ${state.type === 'conic' ? 'selected' : ''}>Conic</option>
        </select>
      </div>
      <div class="control-group" id="angle-group">
        <span class="control-label">
          Angle
          <span class="control-value" id="angle-value">${state.angle}°</span>
        </span>
        <input type="range" min="0" max="360" value="${state.angle}" id="gradient-angle" />
      </div>
      <div class="control-group">
        <span class="control-label">Color Stops</span>
        <div class="color-stops" id="gradient-stops"></div>
        <button class="add-stop-btn" id="add-stop-btn">+ Add Color Stop</button>
      </div>
      <div class="control-group">
        <span class="control-label">Presets</span>
        <div class="preset-grid" id="gradient-presets">
          ${PRESETS.map((p, i) => {
            const bg = `linear-gradient(135deg, ${p.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`;
            return `<button class="preset-btn" data-index="${i}" style="background:${bg}" title="${p.name}"></button>`;
          }).join('')}
        </div>
      </div>
    `;
  },

  renderPreview() {
    return `<div class="preview-element" id="gradient-preview" style="background: ${getGradientCSS()}; width: 100%; height: 100%; border-radius: var(--radius-lg);"></div>`;
  },

  init() {
    renderStops();
    updatePreview();

    const typeSelect = document.getElementById('gradient-type');
    const angleInput = document.getElementById('gradient-angle');
    const angleValue = document.getElementById('angle-value');
    const angleGroup = document.getElementById('angle-group');
    const addStopBtn = document.getElementById('add-stop-btn');

    typeSelect?.addEventListener('change', (e) => {
      state.type = e.target.value;
      angleGroup.style.display = state.type === 'radial' ? 'none' : '';
      updatePreview();
    });

    angleInput?.addEventListener('input', (e) => {
      state.angle = +e.target.value;
      angleValue.textContent = state.angle + '°';
      updatePreview();
    });

    addStopBtn?.addEventListener('click', () => {
      const lastColor = state.stops[state.stops.length - 1]?.color || '#ffffff';
      state.stops.push({ color: lastColor, position: 100 });
      renderStops();
      updatePreview();
    });

    // Presets
    document.querySelectorAll('#gradient-presets .preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = PRESETS[+btn.dataset.index];
        state.stops = JSON.parse(JSON.stringify(preset.stops));
        renderStops();
        updatePreview();
      });
    });

    // Initial angle group visibility
    if (angleGroup && state.type === 'radial') {
      angleGroup.style.display = 'none';
    }
  },

  getState() { return structuredClone(state); },
  setState(s) { if (s) state = structuredClone(s); },

  reset() {
    state = {
      type: 'linear',
      angle: 135,
      stops: JSON.parse(JSON.stringify(DEFAULT_STOPS)),
    };
  },

  getCode(format) {
    const gradient = getGradientCSS();

    if (format === 'css') {
      return `/* Generated by FreeReign */\n.element {\n  background: ${gradient};\n}`;
    } else if (format === 'scss') {
      return `// Generated by FreeReign\n$gradient: ${gradient};\n\n.element {\n  background: $gradient;\n}`;
    } else {
      // Tailwind - approximate
      return `<!-- Generated by FreeReign -->\n<!-- Use arbitrary value in Tailwind -->\n<div class="bg-[${gradient.replace(/\s/g, '_')}]">\n  ...\n</div>\n\n/* Or in tailwind.config.js */\nbackgroundImage: {\n  'custom': '${gradient}',\n}`;
    }
  }
};

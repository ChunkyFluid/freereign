/* ============================================================
   FreeReign — Border Radius Generator Tool
   ============================================================ */

let state = {
  all: 16,
  linked: true,
  topLeft: 16,
  topRight: 16,
  bottomRight: 16,
  bottomLeft: 16,
  unit: 'px',
  size: 200,
};

function getRadiusCSS() {
  const u = state.unit;
  if (state.linked) {
    return `${state.all}${u}`;
  }
  return `${state.topLeft}${u} ${state.topRight}${u} ${state.bottomRight}${u} ${state.bottomLeft}${u}`;
}

function updatePreview() {
  const el = document.getElementById('radius-preview');
  if (el) {
    el.style.borderRadius = getRadiusCSS();
    el.style.width = state.size + 'px';
    el.style.height = state.size + 'px';
  }
  if (window.__updateCode) window.__updateCode();
}

export const borderRadiusTool = {
  id: 'borderradius',
  name: 'Border Radius',
  icon: '⬜',
  description: 'Fine-tune border radius for each corner independently or uniformly. Perfect for buttons, cards, and custom shapes.',
  shortDesc: 'Per-corner radius control',
  isPro: false,
  isNew: false,

  renderControls() {
    return `
      <div class="control-group">
        <span class="control-label">
          Unit
        </span>
        <select class="control-select" id="radius-unit">
          <option value="px" ${state.unit === 'px' ? 'selected' : ''}>Pixels (px)</option>
          <option value="%" ${state.unit === '%' ? 'selected' : ''}>Percent (%)</option>
          <option value="rem" ${state.unit === 'rem' ? 'selected' : ''}>REM</option>
          <option value="em" ${state.unit === 'em' ? 'selected' : ''}>EM</option>
        </select>
      </div>
      <div class="control-group">
        <label class="control-checkbox">
          <input type="checkbox" id="radius-linked" ${state.linked ? 'checked' : ''} />
          Link all corners
        </label>
      </div>
      <div id="radius-linked-controls">
        <div class="control-group">
          <span class="control-label">All Corners <span class="control-value" id="radius-all-val">${state.all}${state.unit}</span></span>
          <input type="range" min="0" max="${state.unit === '%' ? 50 : 100}" value="${state.all}" id="radius-all" />
        </div>
      </div>
      <div id="radius-individual-controls" style="display:${state.linked ? 'none' : 'block'}">
        <div class="control-group">
          <span class="control-label">Top Left <span class="control-value" id="radius-tl-val">${state.topLeft}${state.unit}</span></span>
          <input type="range" min="0" max="${state.unit === '%' ? 50 : 100}" value="${state.topLeft}" id="radius-tl" data-corner="topLeft" />
        </div>
        <div class="control-group">
          <span class="control-label">Top Right <span class="control-value" id="radius-tr-val">${state.topRight}${state.unit}</span></span>
          <input type="range" min="0" max="${state.unit === '%' ? 50 : 100}" value="${state.topRight}" id="radius-tr" data-corner="topRight" />
        </div>
        <div class="control-group">
          <span class="control-label">Bottom Right <span class="control-value" id="radius-br-val">${state.bottomRight}${state.unit}</span></span>
          <input type="range" min="0" max="${state.unit === '%' ? 50 : 100}" value="${state.bottomRight}" id="radius-br" data-corner="bottomRight" />
        </div>
        <div class="control-group">
          <span class="control-label">Bottom Left <span class="control-value" id="radius-bl-val">${state.bottomLeft}${state.unit}</span></span>
          <input type="range" min="0" max="${state.unit === '%' ? 50 : 100}" value="${state.bottomLeft}" id="radius-bl" data-corner="bottomLeft" />
        </div>
      </div>
      <div class="control-group">
        <span class="control-label">Preview Size <span class="control-value" id="radius-size-val">${state.size}px</span></span>
        <input type="range" min="80" max="350" value="${state.size}" id="radius-size" />
      </div>
    `;
  },

  renderPreview() {
    return `<div class="preview-element" id="radius-preview" style="
      background: var(--accent-gradient);
      border-radius: ${getRadiusCSS()};
      width: ${state.size}px;
      height: ${state.size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: var(--font-mono);
      font-size: var(--text-sm);
    ">${getRadiusCSS()}</div>`;
  },

  init() {
    updatePreview();

    const linkedCheck = document.getElementById('radius-linked');
    const linkedControls = document.getElementById('radius-linked-controls');
    const individualControls = document.getElementById('radius-individual-controls');
    const allSlider = document.getElementById('radius-all');
    const sizeSlider = document.getElementById('radius-size');
    const unitSelect = document.getElementById('radius-unit');

    linkedCheck?.addEventListener('change', (e) => {
      state.linked = e.target.checked;
      linkedControls.style.display = state.linked ? 'block' : 'none';
      individualControls.style.display = state.linked ? 'none' : 'block';
      if (state.linked) {
        state.topLeft = state.topRight = state.bottomRight = state.bottomLeft = state.all;
      }
      updatePreview();
      updatePreviewText();
    });

    allSlider?.addEventListener('input', (e) => {
      state.all = +e.target.value;
      state.topLeft = state.topRight = state.bottomRight = state.bottomLeft = state.all;
      document.getElementById('radius-all-val').textContent = state.all + state.unit;
      updatePreview();
      updatePreviewText();
    });

    ['tl', 'tr', 'br', 'bl'].forEach(corner => {
      const slider = document.getElementById(`radius-${corner}`);
      const map = { tl: 'topLeft', tr: 'topRight', br: 'bottomRight', bl: 'bottomLeft' };
      slider?.addEventListener('input', (e) => {
        state[map[corner]] = +e.target.value;
        document.getElementById(`radius-${corner}-val`).textContent = e.target.value + state.unit;
        updatePreview();
        updatePreviewText();
      });
    });

    sizeSlider?.addEventListener('input', (e) => {
      state.size = +e.target.value;
      document.getElementById('radius-size-val').textContent = state.size + 'px';
      updatePreview();
    });

    unitSelect?.addEventListener('change', (e) => {
      state.unit = e.target.value;
      updatePreview();
      updatePreviewText();
    });

    function updatePreviewText() {
      const el = document.getElementById('radius-preview');
      if (el) el.textContent = getRadiusCSS();
    }
  },

  reset() {
    state = { all: 16, linked: true, topLeft: 16, topRight: 16, bottomRight: 16, bottomLeft: 16, unit: 'px', size: 200 };
  },

  getCode(format) {
    const radius = getRadiusCSS();
    if (format === 'css') {
      if (state.linked) {
        return `/* Generated by FreeReign */\n.element {\n  border-radius: ${radius};\n}`;
      }
      return `/* Generated by FreeReign */\n.element {\n  border-top-left-radius: ${state.topLeft}${state.unit};\n  border-top-right-radius: ${state.topRight}${state.unit};\n  border-bottom-right-radius: ${state.bottomRight}${state.unit};\n  border-bottom-left-radius: ${state.bottomLeft}${state.unit};\n}`;
    } else if (format === 'scss') {
      return `// Generated by FreeReign\n$radius: ${radius};\n\n.element {\n  border-radius: $radius;\n}`;
    } else {
      const val = state.linked ? state.all : `[${radius.replace(/ /g, '_')}]`;
      return `<!-- Generated by FreeReign -->\n<div class="rounded-[${radius.replace(/ /g, '_')}]">\n  ...\n</div>`;
    }
  }
};

/* ============================================================
   FreeReign — CSS Grid Generator Tool
   ============================================================ */

let state = {
  columns: 3,
  rows: 3,
  colGap: 12,
  rowGap: 12,
  colTemplate: '1fr 1fr 1fr',
  rowTemplate: '1fr 1fr 1fr',
  autoMode: true,
};

function updateTemplates() {
  if (state.autoMode) {
    state.colTemplate = Array(state.columns).fill('1fr').join(' ');
    state.rowTemplate = Array(state.rows).fill('1fr').join(' ');
  }
}

function updatePreview() {
  updateTemplates();
  const el = document.getElementById('grid-preview');
  if (el) {
    el.style.display = 'grid';
    el.style.gridTemplateColumns = state.colTemplate;
    el.style.gridTemplateRows = state.rowTemplate;
    el.style.columnGap = state.colGap + 'px';
    el.style.rowGap = state.rowGap + 'px';

    const count = state.columns * state.rows;
    el.innerHTML = '';
    const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#14b8a6'];
    for (let i = 0; i < count; i++) {
      const cell = document.createElement('div');
      cell.style.cssText = `
        background: ${colors[i % colors.length]};
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        font-weight: 600;
        color: white;
        min-height: 40px;
        transition: all 0.3s ease;
      `;
      cell.textContent = i + 1;
      el.appendChild(cell);
    }
  }
  if (window.__updateCode) window.__updateCode();
}

export const gridTool = {
  id: 'grid',
  name: 'Grid Generator',
  icon: '🔲',
  description: 'Build CSS Grid layouts visually with custom columns, rows, gaps, and template definitions.',
  shortDesc: 'CSS Grid layout builder',
  isPro: false,
  isNew: false,

  renderControls() {
    return `
      <div class="control-group">
        <span class="control-label">Columns <span class="control-value" id="grid-cols-val">${state.columns}</span></span>
        <input type="range" min="1" max="8" value="${state.columns}" id="grid-cols" />
      </div>
      <div class="control-group">
        <span class="control-label">Rows <span class="control-value" id="grid-rows-val">${state.rows}</span></span>
        <input type="range" min="1" max="6" value="${state.rows}" id="grid-rows" />
      </div>
      <div class="control-group">
        <span class="control-label">Column Gap <span class="control-value" id="grid-cgap-val">${state.colGap}px</span></span>
        <input type="range" min="0" max="40" value="${state.colGap}" id="grid-cgap" />
      </div>
      <div class="control-group">
        <span class="control-label">Row Gap <span class="control-value" id="grid-rgap-val">${state.rowGap}px</span></span>
        <input type="range" min="0" max="40" value="${state.rowGap}" id="grid-rgap" />
      </div>
      <div class="control-group">
        <label class="control-checkbox">
          <input type="checkbox" id="grid-auto" ${state.autoMode ? 'checked' : ''} />
          Auto-generate templates
        </label>
      </div>
      <div id="grid-manual-templates" style="display:${state.autoMode ? 'none' : 'block'}">
        <div class="control-group">
          <span class="control-label">Column Template</span>
          <input type="text" class="control-input" value="${state.colTemplate}" id="grid-col-tpl" style="font-family:var(--font-mono)" />
        </div>
        <div class="control-group">
          <span class="control-label">Row Template</span>
          <input type="text" class="control-input" value="${state.rowTemplate}" id="grid-row-tpl" style="font-family:var(--font-mono)" />
        </div>
      </div>
    `;
  },

  renderPreview() {
    return `<div id="grid-preview" style="width:100%;height:100%;padding:16px;border-radius:var(--radius-lg);"></div>`;
  },

  init() {
    updatePreview();

    const controls = [
      { id: 'grid-cols', prop: 'columns', valId: 'grid-cols-val', unit: '' },
      { id: 'grid-rows', prop: 'rows', valId: 'grid-rows-val', unit: '' },
      { id: 'grid-cgap', prop: 'colGap', valId: 'grid-cgap-val', unit: 'px' },
      { id: 'grid-rgap', prop: 'rowGap', valId: 'grid-rgap-val', unit: 'px' },
    ];

    controls.forEach(({ id, prop, valId, unit }) => {
      document.getElementById(id)?.addEventListener('input', (e) => {
        state[prop] = +e.target.value;
        document.getElementById(valId).textContent = e.target.value + unit;
        updatePreview();
      });
    });

    document.getElementById('grid-auto')?.addEventListener('change', (e) => {
      state.autoMode = e.target.checked;
      document.getElementById('grid-manual-templates').style.display = state.autoMode ? 'none' : 'block';
      updatePreview();
    });

    document.getElementById('grid-col-tpl')?.addEventListener('input', (e) => {
      state.colTemplate = e.target.value;
      updatePreview();
    });

    document.getElementById('grid-row-tpl')?.addEventListener('input', (e) => {
      state.rowTemplate = e.target.value;
      updatePreview();
    });
  },

  getState() { return structuredClone(state); },
  setState(s) { if (s) state = structuredClone(s); },

  reset() {
    state = { columns: 3, rows: 3, colGap: 12, rowGap: 12, colTemplate: '1fr 1fr 1fr', rowTemplate: '1fr 1fr 1fr', autoMode: true };
  },

  getCode(format) {
    updateTemplates();
    if (format === 'css') {
      return `/* Generated by FreeReign */\n.grid-container {\n  display: grid;\n  grid-template-columns: ${state.colTemplate};\n  grid-template-rows: ${state.rowTemplate};\n  column-gap: ${state.colGap}px;\n  row-gap: ${state.rowGap}px;\n}`;
    } else if (format === 'scss') {
      return `// Generated by FreeReign\n.grid-container {\n  display: grid;\n  grid-template-columns: ${state.colTemplate};\n  grid-template-rows: ${state.rowTemplate};\n  column-gap: ${state.colGap}px;\n  row-gap: ${state.rowGap}px;\n}`;
    } else {
      return `<!-- Generated by FreeReign -->\n<div class="grid grid-cols-${state.columns} grid-rows-${state.rows} gap-x-[${state.colGap}px] gap-y-[${state.rowGap}px]">\n  <div>1</div>\n  <div>2</div>\n  ...\n</div>`;
    }
  }
};

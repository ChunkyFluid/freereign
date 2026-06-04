/* ============================================================
   FreeReign — Flexbox Playground Tool
   ============================================================ */

let state = {
  direction: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'nowrap',
  gap: 12,
  itemCount: 5,
};

function updatePreview() {
  const el = document.getElementById('flex-preview');
  if (el) {
    el.style.flexDirection = state.direction;
    el.style.justifyContent = state.justifyContent;
    el.style.alignItems = state.alignItems;
    el.style.flexWrap = state.flexWrap;
    el.style.gap = state.gap + 'px';

    el.innerHTML = '';
    for (let i = 0; i < state.itemCount; i++) {
      const item = document.createElement('div');
      item.style.cssText = `
        width: ${40 + (i * 8)}px;
        height: ${40 + (i * 5)}px;
        min-width: 30px;
        min-height: 30px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        font-weight: 600;
        color: white;
        transition: all 0.3s ease;
      `;
      const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308'];
      item.style.background = colors[i % colors.length];
      item.textContent = i + 1;
      el.appendChild(item);
    }
  }
  if (window.__updateCode) window.__updateCode();
}

export const flexboxTool = {
  id: 'flexbox',
  name: 'Flexbox Playground',
  icon: '📐',
  description: 'Visually build flexbox layouts with interactive controls for direction, alignment, wrapping, and gap.',
  shortDesc: 'Visual flexbox builder',
  isPro: false,
  isNew: false,

  renderControls() {
    const dirs = ['row', 'row-reverse', 'column', 'column-reverse'];
    const justOpts = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'];
    const alignOpts = ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'];
    const wrapOpts = ['nowrap', 'wrap', 'wrap-reverse'];

    return `
      <div class="control-group">
        <span class="control-label">Direction</span>
        <select class="control-select" id="flex-direction">
          ${dirs.map(d => `<option value="${d}" ${state.direction === d ? 'selected' : ''}>${d}</option>`).join('')}
        </select>
      </div>
      <div class="control-group">
        <span class="control-label">Justify Content</span>
        <select class="control-select" id="flex-justify">
          ${justOpts.map(j => `<option value="${j}" ${state.justifyContent === j ? 'selected' : ''}>${j}</option>`).join('')}
        </select>
      </div>
      <div class="control-group">
        <span class="control-label">Align Items</span>
        <select class="control-select" id="flex-align">
          ${alignOpts.map(a => `<option value="${a}" ${state.alignItems === a ? 'selected' : ''}>${a}</option>`).join('')}
        </select>
      </div>
      <div class="control-group">
        <span class="control-label">Wrap</span>
        <select class="control-select" id="flex-wrap">
          ${wrapOpts.map(w => `<option value="${w}" ${state.flexWrap === w ? 'selected' : ''}>${w}</option>`).join('')}
        </select>
      </div>
      <div class="control-group">
        <span class="control-label">Gap <span class="control-value" id="flex-gap-val">${state.gap}px</span></span>
        <input type="range" min="0" max="40" value="${state.gap}" id="flex-gap" />
      </div>
      <div class="control-group">
        <span class="control-label">Items <span class="control-value" id="flex-count-val">${state.itemCount}</span></span>
        <input type="range" min="1" max="10" value="${state.itemCount}" id="flex-count" />
      </div>
    `;
  },

  renderPreview() {
    return `<div id="flex-preview" style="
      display: flex;
      width: 100%;
      height: 100%;
      padding: 16px;
      border-radius: var(--radius-lg);
    "></div>`;
  },

  init() {
    updatePreview();

    const binds = [
      { id: 'flex-direction', prop: 'direction', type: 'select' },
      { id: 'flex-justify', prop: 'justifyContent', type: 'select' },
      { id: 'flex-align', prop: 'alignItems', type: 'select' },
      { id: 'flex-wrap', prop: 'flexWrap', type: 'select' },
    ];

    binds.forEach(({ id, prop }) => {
      document.getElementById(id)?.addEventListener('change', (e) => {
        state[prop] = e.target.value;
        updatePreview();
      });
    });

    document.getElementById('flex-gap')?.addEventListener('input', (e) => {
      state.gap = +e.target.value;
      document.getElementById('flex-gap-val').textContent = state.gap + 'px';
      updatePreview();
    });

    document.getElementById('flex-count')?.addEventListener('input', (e) => {
      state.itemCount = +e.target.value;
      document.getElementById('flex-count-val').textContent = state.itemCount;
      updatePreview();
    });
  },

  reset() {
    state = { direction: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap', gap: 12, itemCount: 5 };
  },

  getCode(format) {
    if (format === 'css') {
      return `/* Generated by FreeReign */\n.container {\n  display: flex;\n  flex-direction: ${state.direction};\n  justify-content: ${state.justifyContent};\n  align-items: ${state.alignItems};\n  flex-wrap: ${state.flexWrap};\n  gap: ${state.gap}px;\n}`;
    } else if (format === 'scss') {
      return `// Generated by FreeReign\n.container {\n  display: flex;\n  flex-direction: ${state.direction};\n  justify-content: ${state.justifyContent};\n  align-items: ${state.alignItems};\n  flex-wrap: ${state.flexWrap};\n  gap: ${state.gap}px;\n}`;
    } else {
      const dirMap = { 'row': 'flex-row', 'row-reverse': 'flex-row-reverse', 'column': 'flex-col', 'column-reverse': 'flex-col-reverse' };
      const justMap = { 'flex-start': 'justify-start', 'flex-end': 'justify-end', 'center': 'justify-center', 'space-between': 'justify-between', 'space-around': 'justify-around', 'space-evenly': 'justify-evenly' };
      const alignMap = { 'flex-start': 'items-start', 'flex-end': 'items-end', 'center': 'items-center', 'stretch': 'items-stretch', 'baseline': 'items-baseline' };
      const wrapMap = { 'nowrap': 'flex-nowrap', 'wrap': 'flex-wrap', 'wrap-reverse': 'flex-wrap-reverse' };
      return `<!-- Generated by FreeReign -->\n<div class="flex ${dirMap[state.direction] || ''} ${justMap[state.justifyContent] || ''} ${alignMap[state.alignItems] || ''} ${wrapMap[state.flexWrap] || ''} gap-[${state.gap}px]">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</div>`;
    }
  }
};

/* ============================================================
   FreeReign — CSS Cursor Customizer
   ============================================================ */

export const cursorTool = {
  id: 'cursor',
  name: 'Cursor Styles',
  icon: '🖱️',
  description: 'Preview and generate all 38 CSS cursor styles. Click any cursor to see it in action and copy the CSS.',
  shortDesc: 'All 38 CSS cursor values',
  category: 'effects',
  isNew: true,

  renderControls() {
    const cursors = [
      { name: 'default', label: 'Default' },
      { name: 'pointer', label: 'Pointer' },
      { name: 'crosshair', label: 'Crosshair' },
      { name: 'move', label: 'Move' },
      { name: 'text', label: 'Text' },
      { name: 'wait', label: 'Wait' },
      { name: 'help', label: 'Help' },
      { name: 'not-allowed', label: 'Not Allowed' },
      { name: 'grab', label: 'Grab' },
      { name: 'grabbing', label: 'Grabbing' },
      { name: 'zoom-in', label: 'Zoom In' },
      { name: 'zoom-out', label: 'Zoom Out' },
      { name: 'col-resize', label: 'Col Resize' },
      { name: 'row-resize', label: 'Row Resize' },
      { name: 'n-resize', label: 'N Resize' },
      { name: 's-resize', label: 'S Resize' },
      { name: 'e-resize', label: 'E Resize' },
      { name: 'w-resize', label: 'W Resize' },
      { name: 'ne-resize', label: 'NE Resize' },
      { name: 'nw-resize', label: 'NW Resize' },
      { name: 'se-resize', label: 'SE Resize' },
      { name: 'sw-resize', label: 'SW Resize' },
      { name: 'ew-resize', label: 'EW Resize' },
      { name: 'ns-resize', label: 'NS Resize' },
      { name: 'nesw-resize', label: 'NESW Resize' },
      { name: 'nwse-resize', label: 'NWSE Resize' },
      { name: 'cell', label: 'Cell' },
      { name: 'context-menu', label: 'Context Menu' },
      { name: 'alias', label: 'Alias' },
      { name: 'copy', label: 'Copy' },
      { name: 'no-drop', label: 'No Drop' },
      { name: 'all-scroll', label: 'All Scroll' },
      { name: 'progress', label: 'Progress' },
      { name: 'vertical-text', label: 'Vertical Text' },
      { name: 'none', label: 'None (Hidden)' },
    ];

    return `
      <div class="control-group">
        <label class="control-label">Cursor Type <span class="control-value" id="cursor-val">pointer</span></label>
      </div>
      <div class="control-group" style="max-height: 380px; overflow-y: auto; scrollbar-width: thin;">
        <div style="display: flex; flex-direction: column; gap: 4px;" id="cursor-list">
          ${cursors.map(c => `
            <button class="cursor-option ${c.name === 'pointer' ? 'active' : ''}" data-cursor="${c.name}" style="
              display: flex; align-items: center; justify-content: space-between;
              padding: 8px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 500;
              background: ${c.name === 'pointer' ? 'var(--accent-gradient-subtle)' : 'transparent'};
              color: ${c.name === 'pointer' ? 'var(--accent-primary)' : 'var(--text-secondary)'};
              cursor: ${c.name}; transition: all 150ms ease; text-align: left; width: 100%;
            ">
              <span>${c.label}</span>
              <code style="font-size: 0.65rem; font-family: var(--font-mono); color: var(--text-tertiary);">${c.name}</code>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderPreview() {
    return `
      <div id="cursor-preview" style="
        width: 100%; min-height: 280px; border-radius: var(--radius-lg);
        background: var(--accent-gradient); cursor: pointer;
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
        transition: cursor 0.2s; position: relative; overflow: hidden;
      ">
        <div style="font-size: 3rem; position: relative; z-index: 1;">🖱️</div>
        <div id="cursor-name" style="font-size: 1.2rem; font-weight: 700; color: white; position: relative; z-index: 1;">pointer</div>
        <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7); position: relative; z-index: 1;">Move your cursor over this area</div>
        <div style="position: absolute; inset: 0; background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px);"></div>
      </div>
    `;
  },

  init() {
    const preview = document.getElementById('cursor-preview');
    const cursorName = document.getElementById('cursor-name');
    const cursorVal = document.getElementById('cursor-val');
    const list = document.getElementById('cursor-list');
    let selected = 'pointer';

    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.cursor-option');
      if (!btn) return;
      selected = btn.dataset.cursor;
      preview.style.cursor = selected;
      cursorName.textContent = selected;
      cursorVal.textContent = selected;

      list.querySelectorAll('.cursor-option').forEach(b => {
        b.style.background = 'transparent';
        b.style.color = 'var(--text-secondary)';
        b.classList.remove('active');
      });
      btn.style.background = 'var(--accent-gradient-subtle)';
      btn.style.color = 'var(--accent-primary)';
      btn.classList.add('active');
      window.__updateCode?.();
    });
  },

  reset() {},

  getCode(format) {
    const cursor = document.getElementById('cursor-val')?.textContent || 'pointer';

    if (format === 'tailwind') {
      return `<!-- Generated by FreeReign — Cursor -->
<div class="cursor-${cursor}">
  Hover me
</div>`;
    }

    const css = `/* Generated by FreeReign — Cursor: ${cursor} */
.element {
  cursor: ${cursor};
}`;

    return css;
  }
};

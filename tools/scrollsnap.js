/* ============================================================
   FreeReign — CSS Scroll Snap Generator
   ============================================================ */

export const scrollSnapTool = {
  id: 'scrollsnap',
  name: 'Scroll Snap',
  icon: '📜',
  description: 'Generate CSS scroll-snap properties with visual controls. Build smooth, snapping scroll containers for carousels and galleries.',
  shortDesc: 'Scroll snap container builder',
  category: 'layout',
  isNew: true,

  renderControls() {
    return `
      <div class="control-group">
        <label class="control-label">Scroll Direction</label>
        <select class="control-select" id="snap-direction">
          <option value="x">Horizontal (x)</option>
          <option value="y">Vertical (y)</option>
          <option value="both">Both</option>
        </select>
      </div>
      <div class="control-group">
        <label class="control-label">Snap Type</label>
        <select class="control-select" id="snap-type">
          <option value="mandatory">Mandatory</option>
          <option value="proximity">Proximity</option>
        </select>
      </div>
      <div class="control-group">
        <label class="control-label">Snap Align</label>
        <select class="control-select" id="snap-align">
          <option value="start">Start</option>
          <option value="center" selected>Center</option>
          <option value="end">End</option>
        </select>
      </div>
      <div class="control-group">
        <label class="control-label">Snap Stop</label>
        <select class="control-select" id="snap-stop">
          <option value="normal">Normal</option>
          <option value="always">Always</option>
        </select>
      </div>
      <div class="control-group">
        <label class="control-label">Items <span class="control-value" id="items-val">5</span></label>
        <input type="range" id="snap-items" min="3" max="10" value="5" step="1" />
      </div>
      <div class="control-group">
        <label class="control-label">Gap <span class="control-value" id="gap-val">16px</span></label>
        <input type="range" id="snap-gap" min="0" max="32" value="16" step="2" />
      </div>
      <div class="control-group">
        <label class="control-label">Padding <span class="control-value" id="padding-val">16px</span></label>
        <input type="range" id="snap-padding" min="0" max="48" value="16" step="4" />
      </div>
    `;
  },

  renderPreview() {
    return `<div id="snap-preview-wrapper" style="width: 100%; overflow: hidden;"></div>`;
  },

  init() {
    const colors = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4'];

    function update() {
      const dir = document.getElementById('snap-direction').value;
      const type = document.getElementById('snap-type').value;
      const align = document.getElementById('snap-align').value;
      const items = parseInt(document.getElementById('snap-items').value);
      const gap = document.getElementById('snap-gap').value;
      const padding = document.getElementById('snap-padding').value;
      const wrapper = document.getElementById('snap-preview-wrapper');

      document.getElementById('items-val').textContent = items;
      document.getElementById('gap-val').textContent = gap + 'px';
      document.getElementById('padding-val').textContent = padding + 'px';

      const isHorizontal = dir === 'x' || dir === 'both';
      const containerStyle = isHorizontal
        ? `display: flex; overflow-x: auto; scroll-snap-type: x ${type}; gap: ${gap}px; padding: ${padding}px; scrollbar-width: thin;`
        : `display: flex; flex-direction: column; overflow-y: auto; scroll-snap-type: y ${type}; gap: ${gap}px; padding: ${padding}px; max-height: 300px; scrollbar-width: thin;`;

      const itemSize = isHorizontal
        ? 'min-width: 200px; height: 180px;'
        : 'width: 100%; min-height: 120px;';

      wrapper.innerHTML = `
        <div style="${containerStyle} border-radius: var(--radius-lg); background: var(--bg-elevated);">
          ${Array.from({length: items}, (_, i) => `
            <div style="${itemSize} scroll-snap-align: ${align}; scroll-snap-stop: ${document.getElementById('snap-stop').value}; background: ${colors[i % colors.length]}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 1.2rem; flex-shrink: 0;">
              ${i + 1}
            </div>
          `).join('')}
        </div>
        <p style="text-align: center; font-size: 0.75rem; color: var(--text-tertiary); margin-top: 8px;">← Scroll to test snap behavior →</p>
      `;

      window.__updateCode?.();
    }

    ['snap-direction', 'snap-type', 'snap-align', 'snap-stop', 'snap-items', 'snap-gap', 'snap-padding'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', update);
      document.getElementById(id)?.addEventListener('change', update);
    });

    update();
  },

  reset() {
    document.getElementById('snap-direction').value = 'x';
    document.getElementById('snap-type').value = 'mandatory';
    document.getElementById('snap-align').value = 'center';
    document.getElementById('snap-stop').value = 'normal';
    document.getElementById('snap-items').value = 5;
    document.getElementById('snap-gap').value = 16;
    document.getElementById('snap-padding').value = 16;
  },

  getCode(format) {
    const dir = document.getElementById('snap-direction')?.value || 'x';
    const type = document.getElementById('snap-type')?.value || 'mandatory';
    const align = document.getElementById('snap-align')?.value || 'center';
    const stop = document.getElementById('snap-stop')?.value || 'normal';
    const gap = document.getElementById('snap-gap')?.value || 16;
    const padding = document.getElementById('snap-padding')?.value || 16;

    if (format === 'tailwind') {
      const snapDir = dir === 'x' ? 'snap-x' : dir === 'y' ? 'snap-y' : 'snap-both';
      const snapType = type === 'mandatory' ? 'snap-mandatory' : 'snap-proximity';
      const snapAlign = `snap-${align}`;
      return `<!-- Generated by FreeReign — Scroll Snap -->
<div class="flex overflow-x-auto ${snapDir} ${snapType} gap-[${gap}px] p-[${padding}px]">
  <div class="${snapAlign} snap-${stop === 'always' ? 'always' : 'normal'} shrink-0">
    Item
  </div>
</div>`;
    }

    const css = `/* Generated by FreeReign — Scroll Snap */
.scroll-container {
  display: flex;
  overflow-${dir === 'y' ? 'y' : 'x'}: auto;
  scroll-snap-type: ${dir} ${type};
  gap: ${gap}px;
  padding: ${padding}px;
  -webkit-overflow-scrolling: touch;
}

.scroll-item {
  scroll-snap-align: ${align};
  scroll-snap-stop: ${stop};
  flex-shrink: 0;
}`;

    if (format === 'scss') {
      return css.replace('/* Generated', '$snap-type: ' + type + ';\n$snap-align: ' + align + ';\n\n/* Generated');
    }
    return css;
  }
};

/* ============================================================
   FreeReign — CSS Container Query Generator (PRO)
   ============================================================ */

export const containerQueryTool = {
  id: 'containerquery',
  name: 'Container Queries',
  icon: '📦',
  description: 'Generate responsive CSS container queries. Build component-level responsive designs that adapt to their container, not the viewport.',
  shortDesc: 'Component-level responsiveness',
  category: 'pro',
  isPro: true,

  renderControls() {
    return `
      <div class="control-group">
        <label class="control-label">Container Type</label>
        <select class="control-select" id="cq-type">
          <option value="inline-size" selected>inline-size</option>
          <option value="size">size</option>
          <option value="normal">normal</option>
        </select>
      </div>
      <div class="control-group">
        <label class="control-label">Container Name</label>
        <input type="text" id="cq-name" value="card" style="padding: 8px 12px; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 8px; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.8rem; width: 100%;" />
      </div>
      <div class="control-group">
        <label class="control-label">Breakpoints</label>
        <div id="cq-breakpoints" style="display: flex; flex-direction: column; gap: 8px;">
          <div class="cq-bp" style="display: flex; align-items: center; gap: 8px;">
            <input type="number" class="bp-value" value="300" min="0" max="2000" step="50" style="width: 80px; padding: 6px 10px; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 6px; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.8rem;" />
            <span style="font-size: 0.75rem; color: var(--text-tertiary);">px — Small</span>
          </div>
          <div class="cq-bp" style="display: flex; align-items: center; gap: 8px;">
            <input type="number" class="bp-value" value="500" min="0" max="2000" step="50" style="width: 80px; padding: 6px 10px; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 6px; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.8rem;" />
            <span style="font-size: 0.75rem; color: var(--text-tertiary);">px — Medium</span>
          </div>
          <div class="cq-bp" style="display: flex; align-items: center; gap: 8px;">
            <input type="number" class="bp-value" value="700" min="0" max="2000" step="50" style="width: 80px; padding: 6px 10px; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 6px; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.8rem;" />
            <span style="font-size: 0.75rem; color: var(--text-tertiary);">px — Large</span>
          </div>
        </div>
      </div>
      <div class="control-group">
        <label class="control-label">Preview Width <span class="control-value" id="preview-width-val">100%</span></label>
        <input type="range" id="cq-preview-width" min="200" max="800" value="800" step="10" />
      </div>
    `;
  },

  renderPreview() {
    return `
      <div id="cq-preview-wrapper" style="width: 100%; transition: width 300ms ease;">
        <div id="cq-preview" style="
          container-type: inline-size; container-name: card;
          background: var(--bg-elevated); border-radius: var(--radius-lg);
          border: 2px dashed var(--border-default); padding: 20px;
          transition: width 300ms ease;
        ">
          <div id="cq-inner" style="
            display: grid; grid-template-columns: 1fr; gap: 12px;
            transition: all 300ms ease;
          ">
            <div style="height: 120px; background: var(--accent-gradient); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">Image</div>
            <div>
              <div style="font-size: 1rem; font-weight: 700; margin-bottom: 4px;">Card Title</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5;">This card adapts to its container width, not the viewport. Resize the container using the slider.</div>
            </div>
          </div>
        </div>
        <div style="text-align: center; font-size: 0.7rem; color: var(--text-tertiary); margin-top: 8px;" id="cq-width-label">Container: 800px</div>
      </div>
    `;
  },

  init() {
    const typeSelect = document.getElementById('cq-type');
    const nameInput = document.getElementById('cq-name');
    const widthSlider = document.getElementById('cq-preview-width');
    const preview = document.getElementById('cq-preview');
    const inner = document.getElementById('cq-inner');
    const wrapper = document.getElementById('cq-preview-wrapper');
    const widthLabel = document.getElementById('cq-width-label');
    const widthVal = document.getElementById('preview-width-val');

    function update() {
      const w = widthSlider.value;
      const name = nameInput.value;
      const type = typeSelect.value;
      wrapper.style.width = w + 'px';
      widthVal.textContent = w + 'px';
      widthLabel.textContent = `Container: ${w}px`;
      preview.style.containerType = type;
      preview.style.containerName = name;

      // Responsive behavior based on width
      const width = parseInt(w);
      const bps = Array.from(document.querySelectorAll('.bp-value')).map(el => parseInt(el.value));
      
      if (width >= bps[2]) {
        inner.style.gridTemplateColumns = '200px 1fr';
        inner.style.gap = '20px';
      } else if (width >= bps[1]) {
        inner.style.gridTemplateColumns = '150px 1fr';
        inner.style.gap = '16px';
      } else {
        inner.style.gridTemplateColumns = '1fr';
        inner.style.gap = '12px';
      }

      window.__updateCode?.();
    }

    [typeSelect, nameInput, widthSlider].forEach(el => {
      el.addEventListener('input', update);
    });

    document.querySelectorAll('.bp-value').forEach(el => {
      el.addEventListener('input', update);
    });

    update();
  },

  reset() {
    document.getElementById('cq-type').value = 'inline-size';
    document.getElementById('cq-name').value = 'card';
    document.getElementById('cq-preview-width').value = 800;
  },

  getCode(format) {
    const type = document.getElementById('cq-type')?.value || 'inline-size';
    const name = document.getElementById('cq-name')?.value || 'card';
    const bps = Array.from(document.querySelectorAll('.bp-value') || []).map(el => parseInt(el.value));
    const bp1 = bps[0] || 300;
    const bp2 = bps[1] || 500;
    const bp3 = bps[2] || 700;

    if (format === 'tailwind') {
      return `<!-- Generated by FreeReign Pro — Container Queries -->
<!-- Requires Tailwind CSS v3.3+ with @tailwindcss/container-queries -->
<div class="@container/${name}">
  <div class="grid grid-cols-1 @[${bp2}px]/${name}:grid-cols-[150px_1fr] @[${bp3}px]/${name}:grid-cols-[200px_1fr] gap-3 @[${bp2}px]/${name}:gap-4 @[${bp3}px]/${name}:gap-5">
    <div>Image</div>
    <div>Content</div>
  </div>
</div>`;
    }

    const css = `/* Generated by FreeReign Pro — Container Queries */

/* Container */
.${name}-container {
  container-type: ${type};
  container-name: ${name};
}

/* Base layout (< ${bp1}px) */
.${name}-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

/* Medium (≥ ${bp2}px) */
@container ${name} (min-width: ${bp2}px) {
  .${name}-content {
    grid-template-columns: 150px 1fr;
    gap: 16px;
  }
}

/* Large (≥ ${bp3}px) */
@container ${name} (min-width: ${bp3}px) {
  .${name}-content {
    grid-template-columns: 200px 1fr;
    gap: 20px;
  }
}`;

    if (format === 'scss') {
      return css.replace('/* Generated', `$container-name: '${name}';\n$bp-sm: ${bp1}px;\n$bp-md: ${bp2}px;\n$bp-lg: ${bp3}px;\n\n/* Generated`);
    }
    return css;
  }
};

/* ============================================================
   FreeReign — Media Query Builder (Pro)
   Visual builder for responsive @media queries
   ============================================================ */

export const mediaqueryTool = {
  id: 'mediaquery',
  name: 'Media Query Builder',
  icon: '📱',
  description: 'Build responsive @media queries visually. Combine width, height, orientation, color-scheme, and hover conditions with AND/OR logic.',
  shortDesc: 'Visual @media builder',
  category: 'pro',
  isPro: true,
  isNew: true,

  renderControls() {
    return `
      <div class="control-group">
        <label class="control-label">Condition Type</label>
        <select class="control-select" id="mq-type">
          <option value="min-width">Min Width (mobile-first)</option>
          <option value="max-width">Max Width (desktop-first)</option>
          <option value="range">Width Range</option>
          <option value="orientation">Orientation</option>
          <option value="prefers-color-scheme">Color Scheme</option>
          <option value="prefers-reduced-motion">Reduced Motion</option>
          <option value="hover">Hover Support</option>
          <option value="custom">Custom Combination</option>
        </select>
      </div>
      <div class="control-group" id="mq-width-group">
        <label class="control-label">Breakpoint <span class="control-value" id="mq-bp-val">768px</span></label>
        <input type="range" id="mq-breakpoint" min="320" max="1920" value="768" step="1" />
        <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 8px;">
          ${[
            { label: 'SM', val: 640 },
            { label: 'MD', val: 768 },
            { label: 'LG', val: 1024 },
            { label: 'XL', val: 1280 },
            { label: '2XL', val: 1536 },
          ].map(p => `
            <button class="mq-preset-btn" data-val="${p.val}" style="
              padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 600;
              background: var(--bg-surface); color: var(--text-secondary);
              border: 1px solid var(--border-default); cursor: pointer;
            ">${p.label} (${p.val})</button>
          `).join('')}
        </div>
      </div>
      <div class="control-group" id="mq-width2-group" style="display: none;">
        <label class="control-label">Max Breakpoint <span class="control-value" id="mq-bp2-val">1024px</span></label>
        <input type="range" id="mq-breakpoint2" min="320" max="1920" value="1024" step="1" />
      </div>
      <div class="control-group" id="mq-orient-group" style="display: none;">
        <label class="control-label">Orientation</label>
        <select class="control-select" id="mq-orientation">
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </div>
      <div class="control-group" id="mq-scheme-group" style="display: none;">
        <label class="control-label">Color Scheme</label>
        <select class="control-select" id="mq-scheme">
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>
      <div class="control-group" id="mq-custom-group" style="display: none;">
        <label class="control-label">Combine with</label>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-secondary);">
            <input type="checkbox" id="mq-add-orientation" /> + Orientation (portrait)
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-secondary);">
            <input type="checkbox" id="mq-add-hover" /> + Hover support
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-secondary);">
            <input type="checkbox" id="mq-add-scheme" /> + Dark mode
          </label>
        </div>
      </div>
      <div class="control-group">
        <label class="control-label">CSS Syntax</label>
        <select class="control-select" id="mq-syntax">
          <option value="modern">Modern (range syntax)</option>
          <option value="legacy" selected>Legacy (min-width / max-width)</option>
        </select>
      </div>
    `;
  },

  renderPreview() {
    return `
      <div style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 16px;">
        <div id="mq-visual" style="
          width: 100%; max-width: 600px; height: 40px; border-radius: 8px;
          background: var(--bg-elevated); position: relative; overflow: hidden;
          border: 1px solid var(--border-default);
        ">
          <div id="mq-active-range" style="
            position: absolute; top: 0; bottom: 0;
            background: var(--accent-gradient); opacity: 0.3; border-radius: 8px;
          "></div>
          <div id="mq-marker" style="
            position: absolute; top: 0; bottom: 0; width: 2px;
            background: var(--accent-primary);
          "></div>
        </div>
        <div style="width: 100%; max-width: 600px; display: flex; justify-content: space-between; font-size: 0.65rem; color: var(--text-tertiary);">
          <span>320px</span><span>640px</span><span>768px</span><span>1024px</span><span>1280px</span><span>1536px</span><span>1920px</span>
        </div>
        <div id="mq-output-preview" style="
          width: 100%; max-width: 600px; padding: 16px; border-radius: 10px;
          background: var(--bg-surface); border: 1px solid var(--border-default);
          font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-primary);
          line-height: 1.6; white-space: pre-wrap;
        "></div>
      </div>
    `;
  },

  init() {
    const type = document.getElementById('mq-type');
    const bp = document.getElementById('mq-breakpoint');
    const bp2 = document.getElementById('mq-breakpoint2');
    const syntax = document.getElementById('mq-syntax');
    const widthGroup = document.getElementById('mq-width-group');
    const width2Group = document.getElementById('mq-width2-group');
    const orientGroup = document.getElementById('mq-orient-group');
    const schemeGroup = document.getElementById('mq-scheme-group');
    const customGroup = document.getElementById('mq-custom-group');
    const preview = document.getElementById('mq-output-preview');
    const activeRange = document.getElementById('mq-active-range');
    const marker = document.getElementById('mq-marker');

    function showGroups() {
      const v = type.value;
      widthGroup.style.display = ['min-width', 'max-width', 'range', 'custom'].includes(v) ? '' : 'none';
      width2Group.style.display = v === 'range' ? '' : 'none';
      orientGroup.style.display = v === 'orientation' ? '' : 'none';
      schemeGroup.style.display = v === 'prefers-color-scheme' ? '' : 'none';
      customGroup.style.display = v === 'custom' ? '' : 'none';
    }

    function buildQuery() {
      const v = type.value;
      const bpVal = +bp.value;
      const bpVal2 = +bp2.value;
      const useMod = syntax.value === 'modern';

      switch (v) {
        case 'min-width':
          return useMod ? `@media (width >= ${bpVal}px)` : `@media (min-width: ${bpVal}px)`;
        case 'max-width':
          return useMod ? `@media (width < ${bpVal}px)` : `@media (max-width: ${bpVal - 1}px)`;
        case 'range':
          return useMod
            ? `@media (${bpVal}px <= width < ${bpVal2}px)`
            : `@media (min-width: ${bpVal}px) and (max-width: ${bpVal2 - 1}px)`;
        case 'orientation':
          return `@media (orientation: ${document.getElementById('mq-orientation').value})`;
        case 'prefers-color-scheme':
          return `@media (prefers-color-scheme: ${document.getElementById('mq-scheme').value})`;
        case 'prefers-reduced-motion':
          return `@media (prefers-reduced-motion: reduce)`;
        case 'hover':
          return `@media (hover: hover)`;
        case 'custom': {
          let parts = [useMod ? `(width >= ${bpVal}px)` : `(min-width: ${bpVal}px)`];
          if (document.getElementById('mq-add-orientation')?.checked) parts.push('(orientation: portrait)');
          if (document.getElementById('mq-add-hover')?.checked) parts.push('(hover: hover)');
          if (document.getElementById('mq-add-scheme')?.checked) parts.push('(prefers-color-scheme: dark)');
          return `@media ${parts.join(' and ')}`;
        }
        default:
          return `@media (min-width: ${bpVal}px)`;
      }
    }

    function updateVisual() {
      const v = type.value;
      const bpVal = +bp.value;
      const bpVal2 = +bp2.value;
      const totalRange = 1920 - 320;

      if (['min-width', 'custom'].includes(v)) {
        const left = ((bpVal - 320) / totalRange) * 100;
        activeRange.style.left = left + '%';
        activeRange.style.right = '0%';
        marker.style.left = left + '%';
        marker.style.display = '';
      } else if (v === 'max-width') {
        const right = ((1920 - bpVal) / totalRange) * 100;
        activeRange.style.left = '0%';
        activeRange.style.right = right + '%';
        marker.style.left = ((bpVal - 320) / totalRange * 100) + '%';
        marker.style.display = '';
      } else if (v === 'range') {
        const left = ((bpVal - 320) / totalRange) * 100;
        const right = ((1920 - bpVal2) / totalRange) * 100;
        activeRange.style.left = left + '%';
        activeRange.style.right = right + '%';
        marker.style.display = 'none';
      } else {
        activeRange.style.left = '0%';
        activeRange.style.right = '0%';
        marker.style.display = 'none';
      }
    }

    function update() {
      document.getElementById('mq-bp-val').textContent = bp.value + 'px';
      document.getElementById('mq-bp2-val').textContent = bp2.value + 'px';
      showGroups();
      updateVisual();
      const query = buildQuery();
      preview.textContent = `${query} {\n  /* Your responsive styles */\n}`;
      window.__updateCode?.();
    }

    // Preset buttons
    document.querySelectorAll('.mq-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bp.value = btn.dataset.val;
        update();
      });
    });

    [type, bp, bp2, syntax].forEach(el => el.addEventListener('input', update));
    document.querySelectorAll('#mq-custom-group input[type="checkbox"]').forEach(el => el.addEventListener('change', update));
    document.getElementById('mq-orientation')?.addEventListener('input', update);
    document.getElementById('mq-scheme')?.addEventListener('input', update);

    update();
    this._buildQuery = buildQuery;
  },

  reset() {
    document.getElementById('mq-type').value = 'min-width';
    document.getElementById('mq-breakpoint').value = 768;
    document.getElementById('mq-breakpoint2').value = 1024;
    document.getElementById('mq-syntax').value = 'legacy';
  },

  getCode(format) {
    const query = this._buildQuery?.() || '@media (min-width: 768px)';

    if (format === 'tailwind') {
      const bp = document.getElementById('mq-breakpoint')?.value || 768;
      return `/* Generated by FreeReign Pro — Media Query Builder */
/* In tailwind.config.js */
module.exports = {
  theme: {
    screens: {
      'custom': '${bp}px',
    }
  }
}

/* Usage: */
<div class="custom:flex custom:gap-4">
  <!-- Responsive content -->
</div>`;
    }

    if (format === 'scss') {
      const bp = document.getElementById('mq-breakpoint')?.value || 768;
      return `// Generated by FreeReign Pro — Media Query Builder
$breakpoint: ${bp}px;

@mixin responsive {
  ${query} {
    @content;
  }
}

// Usage:
.element {
  font-size: 14px;
  @include responsive {
    font-size: 18px;
  }
}`;
    }

    return `/* Generated by FreeReign Pro — Media Query Builder */
${query} {
  .element {
    /* Add your responsive styles here */
  }
}`;
  }
};

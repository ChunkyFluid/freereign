/* ============================================================
   FreeReign — Fluid Typography Generator (Pro)
   Generate responsive font sizes using CSS clamp()
   ============================================================ */

export const fluidTypeTool = {
  id: 'fluidtype',
  name: 'Fluid Typography',
  icon: '📏',
  description: 'Generate responsive font sizes using CSS clamp(). Set min/max sizes, viewport range, and get a perfect fluid scale.',
  shortDesc: 'Responsive clamp() fonts',
  category: 'pro',
  isPro: true,
  isNew: true,

  renderControls() {
    return `
      <div class="control-group">
        <label class="control-label">Base Size (desktop) <span class="control-value" id="ft-base-val">18px</span></label>
        <input type="range" id="ft-base" min="12" max="48" value="18" step="1" />
      </div>
      <div class="control-group">
        <label class="control-label">Min Size (mobile) <span class="control-value" id="ft-min-val">14px</span></label>
        <input type="range" id="ft-min" min="10" max="36" value="14" step="1" />
      </div>
      <div class="control-group">
        <label class="control-label">Min Viewport <span class="control-value" id="ft-vmin-val">320px</span></label>
        <input type="range" id="ft-vmin" min="280" max="600" value="320" step="10" />
      </div>
      <div class="control-group">
        <label class="control-label">Max Viewport <span class="control-value" id="ft-vmax-val">1200px</span></label>
        <input type="range" id="ft-vmax" min="768" max="1920" value="1200" step="10" />
      </div>
      <div class="control-group">
        <label class="control-label">Scale Steps</label>
        <select class="control-select" id="ft-steps">
          <option value="5">5 steps</option>
          <option value="6" selected>6 steps</option>
          <option value="8">8 steps</option>
          <option value="10">10 steps</option>
        </select>
      </div>
      <div class="control-group">
        <label class="control-label">Scale Ratio <span class="control-value" id="ft-ratio-val">1.25</span></label>
        <select class="control-select" id="ft-ratio">
          <option value="1.125">Minor Second (1.125)</option>
          <option value="1.200">Minor Third (1.200)</option>
          <option value="1.250" selected>Major Third (1.250)</option>
          <option value="1.333">Perfect Fourth (1.333)</option>
          <option value="1.414">Augmented Fourth (1.414)</option>
          <option value="1.500">Perfect Fifth (1.500)</option>
          <option value="1.618">Golden Ratio (1.618)</option>
        </select>
      </div>
    `;
  },

  renderPreview() {
    return `
      <div id="ft-preview" style="
        width: 100%; padding: 24px; display: flex; flex-direction: column; gap: 8px;
        font-family: var(--font-sans);
      "></div>
    `;
  },

  init() {
    const base = document.getElementById('ft-base');
    const min = document.getElementById('ft-min');
    const vmin = document.getElementById('ft-vmin');
    const vmax = document.getElementById('ft-vmax');
    const steps = document.getElementById('ft-steps');
    const ratio = document.getElementById('ft-ratio');
    const preview = document.getElementById('ft-preview');

    const labels = ['--text-xs', '--text-sm', '--text-base', '--text-lg', '--text-xl', '--text-2xl', '--text-3xl', '--text-4xl', '--text-5xl', '--text-6xl'];

    function clamp(minPx, maxPx, minVw, maxVw) {
      const slope = (maxPx - minPx) / (maxVw - minVw);
      const yAxisIntersection = -minVw * slope + minPx;
      const slopeVw = +(slope * 100).toFixed(4);
      const interceptRem = +(yAxisIntersection / 16).toFixed(4);
      const minRem = +(minPx / 16).toFixed(3);
      const maxRem = +(maxPx / 16).toFixed(3);
      return `clamp(${minRem}rem, ${interceptRem}rem + ${slopeVw}vw, ${maxRem}rem)`;
    }

    function generateScale() {
      const baseVal = +base.value;
      const minVal = +min.value;
      const ratioVal = +ratio.value;
      const stepsVal = +steps.value;
      const vminVal = +vmin.value;
      const vmaxVal = +vmax.value;
      const baseIndex = 2; // index of --text-base

      const scale = [];
      for (let i = 0; i < stepsVal; i++) {
        const exp = i - baseIndex;
        const maxPx = +(baseVal * Math.pow(ratioVal, exp)).toFixed(1);
        const minPx = +(minVal * Math.pow(ratioVal, Math.max(0, exp * 0.6))).toFixed(1);
        scale.push({
          label: labels[i] || `--text-${i}`,
          minPx: Math.max(10, minPx),
          maxPx: Math.max(10, maxPx),
          clamp: clamp(Math.max(10, minPx), Math.max(10, maxPx), vminVal, vmaxVal),
        });
      }
      return scale;
    }

    function update() {
      document.getElementById('ft-base-val').textContent = base.value + 'px';
      document.getElementById('ft-min-val').textContent = min.value + 'px';
      document.getElementById('ft-vmin-val').textContent = vmin.value + 'px';
      document.getElementById('ft-vmax-val').textContent = vmax.value + 'px';
      document.getElementById('ft-ratio-val').textContent = ratio.value;

      const scale = generateScale();
      preview.innerHTML = scale.map(s => `
        <div style="display: flex; align-items: baseline; gap: 12px; padding: 6px 0; border-bottom: 1px solid var(--border-default);">
          <code style="font-size: 0.65rem; color: var(--accent-primary); font-family: var(--font-mono); min-width: 90px;">${s.label}</code>
          <span style="font-size: ${s.maxPx}px; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">
            The quick brown fox
          </span>
        </div>
      `).join('');

      window.__updateCode?.();
    }

    [base, min, vmin, vmax, steps, ratio].forEach(el => el.addEventListener('input', update));
    update();

    // Store for getCode
    this._generateScale = generateScale;
    this._getValues = () => ({ vmin: +vmin.value, vmax: +vmax.value });
  },

  reset() {
    document.getElementById('ft-base').value = 18;
    document.getElementById('ft-min').value = 14;
    document.getElementById('ft-vmin').value = 320;
    document.getElementById('ft-vmax').value = 1200;
    document.getElementById('ft-steps').value = 6;
    document.getElementById('ft-ratio').value = '1.250';
  },

  getCode(format) {
    const scale = this._generateScale?.() || [];

    if (format === 'tailwind') {
      return `/* Generated by FreeReign Pro — Fluid Typography */
module.exports = {
  theme: {
    fontSize: {
${scale.map(s => `      '${s.label.replace('--text-', '')}': '${s.clamp}',`).join('\n')}
    }
  }
}`;
    }

    if (format === 'scss') {
      return `// Generated by FreeReign Pro — Fluid Typography
${scale.map(s => `${s.label}: ${s.clamp};`).join('\n')}

// Usage: font-size: var(--text-base);`;
    }

    return `/* Generated by FreeReign Pro — Fluid Typography */
:root {
${scale.map(s => `  ${s.label}: ${s.clamp};`).join('\n')}
}

/* Usage */
body { font-size: var(--text-base); }
h1 { font-size: var(--text-3xl); }
h2 { font-size: var(--text-2xl); }
small { font-size: var(--text-sm); }`;
  }
};

/* ============================================================
   FreeReign — CSS Aspect Ratio Calculator
   ============================================================ */

export const aspectRatioTool = {
  id: 'aspectratio',
  name: 'Aspect Ratio',
  icon: '📐',
  description: 'Calculate and generate CSS aspect-ratio properties with common presets. Perfect for responsive images, videos, and containers.',
  shortDesc: 'Responsive aspect-ratio calculator',
  category: 'layout',
  isNew: true,

  renderControls() {
    return `
      <div class="control-group">
        <label class="control-label">Preset Ratios</label>
        <div class="preset-grid" id="ratio-presets" style="grid-template-columns: repeat(3, 1fr);">
          <button class="preset-btn active" data-ratio="16/9" style="background: var(--accent-gradient); color: white; width: 100%; height: 36px; font-size: 0.7rem; font-weight: 600;">16:9</button>
          <button class="preset-btn" data-ratio="4/3" style="background: var(--bg-elevated); color: var(--text-secondary); width: 100%; height: 36px; font-size: 0.7rem; font-weight: 600;">4:3</button>
          <button class="preset-btn" data-ratio="1/1" style="background: var(--bg-elevated); color: var(--text-secondary); width: 100%; height: 36px; font-size: 0.7rem; font-weight: 600;">1:1</button>
          <button class="preset-btn" data-ratio="21/9" style="background: var(--bg-elevated); color: var(--text-secondary); width: 100%; height: 36px; font-size: 0.7rem; font-weight: 600;">21:9</button>
          <button class="preset-btn" data-ratio="9/16" style="background: var(--bg-elevated); color: var(--text-secondary); width: 100%; height: 36px; font-size: 0.7rem; font-weight: 600;">9:16</button>
          <button class="preset-btn" data-ratio="3/2" style="background: var(--bg-elevated); color: var(--text-secondary); width: 100%; height: 36px; font-size: 0.7rem; font-weight: 600;">3:2</button>
          <button class="preset-btn" data-ratio="2/1" style="background: var(--bg-elevated); color: var(--text-secondary); width: 100%; height: 36px; font-size: 0.7rem; font-weight: 600;">2:1</button>
          <button class="preset-btn" data-ratio="3/4" style="background: var(--bg-elevated); color: var(--text-secondary); width: 100%; height: 36px; font-size: 0.7rem; font-weight: 600;">3:4</button>
          <button class="preset-btn" data-ratio="5/4" style="background: var(--bg-elevated); color: var(--text-secondary); width: 100%; height: 36px; font-size: 0.7rem; font-weight: 600;">5:4</button>
        </div>
      </div>
      <div class="control-group">
        <label class="control-label">Custom Width <span class="control-value" id="width-val">16</span></label>
        <input type="range" id="ratio-w" min="1" max="32" value="16" step="1" />
      </div>
      <div class="control-group">
        <label class="control-label">Custom Height <span class="control-value" id="height-val">9</span></label>
        <input type="range" id="ratio-h" min="1" max="32" value="9" step="1" />
      </div>
      <div class="control-group">
        <label class="control-label">Container Width <span class="control-value" id="container-val">100%</span></label>
        <input type="range" id="container-w" min="20" max="100" value="100" step="5" />
      </div>
      <div class="control-group">
        <label class="control-label">Object Fit</label>
        <select class="control-select" id="object-fit">
          <option value="cover">cover</option>
          <option value="contain">contain</option>
          <option value="fill">fill</option>
          <option value="none">none</option>
          <option value="scale-down">scale-down</option>
        </select>
      </div>
    `;
  },

  renderPreview() {
    return `
      <div id="ratio-preview" style="width: 100%; aspect-ratio: 16/9; background: var(--accent-gradient); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; color: white; transition: all 0.3s ease; position: relative; overflow: hidden;">
        <span id="ratio-label" style="position: relative; z-index: 1; text-shadow: 0 2px 8px rgba(0,0,0,0.3);">16 : 9</span>
        <div style="position: absolute; inset: 0; background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px);"></div>
      </div>
    `;
  },

  init() {
    const wSlider = document.getElementById('ratio-w');
    const hSlider = document.getElementById('ratio-h');
    const containerSlider = document.getElementById('container-w');
    const objectFit = document.getElementById('object-fit');
    const wVal = document.getElementById('width-val');
    const hVal = document.getElementById('height-val');
    const containerVal = document.getElementById('container-val');
    const preview = document.getElementById('ratio-preview');
    const label = document.getElementById('ratio-label');
    const presets = document.getElementById('ratio-presets');

    function update() {
      const w = wSlider.value;
      const h = hSlider.value;
      const cw = containerSlider.value;
      wVal.textContent = w;
      hVal.textContent = h;
      containerVal.textContent = cw + '%';
      preview.style.aspectRatio = `${w}/${h}`;
      preview.style.width = cw + '%';
      label.textContent = `${w} : ${h}`;
      window.__updateCode?.();
    }

    [wSlider, hSlider, containerSlider, objectFit].forEach(el => {
      el.addEventListener('input', update);
    });

    presets.addEventListener('click', (e) => {
      const btn = e.target.closest('.preset-btn');
      if (!btn) return;
      const [w, h] = btn.dataset.ratio.split('/');
      wSlider.value = w;
      hSlider.value = h;
      presets.querySelectorAll('.preset-btn').forEach(b => {
        b.style.background = 'var(--bg-elevated)';
        b.style.color = 'var(--text-secondary)';
      });
      btn.style.background = 'var(--accent-gradient)';
      btn.style.color = 'white';
      update();
    });

    update();
  },

  reset() {
    document.getElementById('ratio-w').value = 16;
    document.getElementById('ratio-h').value = 9;
    document.getElementById('container-w').value = 100;
    document.getElementById('object-fit').value = 'cover';
  },

  getCode(format) {
    const w = document.getElementById('ratio-w')?.value || 16;
    const h = document.getElementById('ratio-h')?.value || 9;
    const cw = document.getElementById('container-w')?.value || 100;
    const fit = document.getElementById('object-fit')?.value || 'cover';

    if (format === 'tailwind') {
      return `<!-- Generated by FreeReign — Aspect Ratio -->
<div class="aspect-[${w}/${h}] w-[${cw}%] object-${fit}">
  <!-- content -->
</div>`;
    }

    const css = `/* Generated by FreeReign — Aspect Ratio */
.responsive-container {
  aspect-ratio: ${w} / ${h};
  width: ${cw}%;
  object-fit: ${fit};
  overflow: hidden;
}`;

    if (format === 'scss') {
      return css.replace('.responsive-container', '$ratio: #{$w} / #{$h};\n\n.responsive-container');
    }
    return css;
  }
};

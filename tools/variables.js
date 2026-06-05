/* ============================================================
   FreeReign — CSS Custom Properties (Variables) Generator
   ============================================================ */

export const variablesTool = {
  id: 'variables',
  name: 'CSS Variables',
  icon: '🏷️',
  description: 'Generate a complete CSS custom properties system. Create color scales, spacing tokens, and typography variables with one click.',
  shortDesc: 'Custom properties system',
  
  isPro: true,
  isNew: true,

  renderControls() {
    return `
      <div class="control-group">
        <label class="control-label">Primary Color</label>
        <div style="display: flex; gap: 8px; align-items: center;">
          <input type="color" id="var-primary" value="#8b5cf6" style="width: 40px; height: 36px; border: none; border-radius: 6px; cursor: pointer;" />
          <input type="text" id="var-primary-hex" value="#8b5cf6" style="flex: 1; padding: 8px 12px; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 8px; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.8rem;" />
        </div>
      </div>
      <div class="control-group">
        <label class="control-label">Secondary Color</label>
        <div style="display: flex; gap: 8px; align-items: center;">
          <input type="color" id="var-secondary" value="#06b6d4" style="width: 40px; height: 36px; border: none; border-radius: 6px; cursor: pointer;" />
          <input type="text" id="var-secondary-hex" value="#06b6d4" style="flex: 1; padding: 8px 12px; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 8px; color: var(--text-primary); font-family: var(--font-mono); font-size: 0.8rem;" />
        </div>
      </div>
      <div class="control-group">
        <label class="control-label">Base Font Size <span class="control-value" id="font-val">16px</span></label>
        <input type="range" id="var-font-size" min="12" max="20" value="16" step="1" />
      </div>
      <div class="control-group">
        <label class="control-label">Spacing Unit <span class="control-value" id="space-val">4px</span></label>
        <input type="range" id="var-spacing" min="2" max="8" value="4" step="1" />
      </div>
      <div class="control-group">
        <label class="control-label">Border Radius <span class="control-value" id="radius-val">8px</span></label>
        <input type="range" id="var-radius" min="0" max="24" value="8" step="2" />
      </div>
      <div class="control-group">
        <label class="control-label">Include</label>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-secondary); cursor: pointer;">
            <input type="checkbox" id="inc-colors" checked style="accent-color: var(--accent-primary);"> Color Scales
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-secondary); cursor: pointer;">
            <input type="checkbox" id="inc-spacing" checked style="accent-color: var(--accent-primary);"> Spacing
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-secondary); cursor: pointer;">
            <input type="checkbox" id="inc-typography" checked style="accent-color: var(--accent-primary);"> Typography
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-secondary); cursor: pointer;">
            <input type="checkbox" id="inc-radius" checked style="accent-color: var(--accent-primary);"> Border Radius
          </label>
          <label style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-secondary); cursor: pointer;">
            <input type="checkbox" id="inc-shadows" checked style="accent-color: var(--accent-primary);"> Shadows
          </label>
        </div>
      </div>
    `;
  },

  renderPreview() {
    return `<div id="vars-preview" style="width: 100%;"></div>`;
  },

  init() {
    const primary = document.getElementById('var-primary');
    const primaryHex = document.getElementById('var-primary-hex');
    const secondary = document.getElementById('var-secondary');
    const secondaryHex = document.getElementById('var-secondary-hex');
    const fontSize = document.getElementById('var-font-size');
    const spacing = document.getElementById('var-spacing');
    const radius = document.getElementById('var-radius');
    const preview = document.getElementById('vars-preview');

    function hexToHSL(hex) {
      let r = parseInt(hex.slice(1,3), 16) / 255;
      let g = parseInt(hex.slice(3,5), 16) / 255;
      let b = parseInt(hex.slice(5,7), 16) / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max === min) { h = s = 0; }
      else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }
      return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function generateScale(hex, name) {
      const { h, s } = hexToHSL(hex);
      return [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => {
        const l = shade <= 100 ? 95 - (shade / 100 * 5) : shade <= 500 ? 90 - ((shade - 100) / 400 * 45) : 45 - ((shade - 500) / 400 * 35);
        return { shade, color: `hsl(${h}, ${s}%, ${Math.round(l)}%)`, varName: `--${name}-${shade}` };
      });
    }

    function update() {
      const p = primary.value;
      const s = secondary.value;
      const fs = fontSize.value;
      const sp = spacing.value;
      const r = radius.value;
      primaryHex.value = p;
      secondaryHex.value = s;
      document.getElementById('font-val').textContent = fs + 'px';
      document.getElementById('space-val').textContent = sp + 'px';
      document.getElementById('radius-val').textContent = r + 'px';

      const pScale = generateScale(p, 'primary');
      const sScale = generateScale(s, 'secondary');

      preview.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <div style="font-size: 0.7rem; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Primary Scale</div>
            <div style="display: flex; border-radius: 8px; overflow: hidden; height: 48px;">
              ${pScale.map(c => `<div style="flex: 1; background: ${c.color};" title="${c.varName}: ${c.color}"></div>`).join('')}
            </div>
          </div>
          <div>
            <div style="font-size: 0.7rem; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Secondary Scale</div>
            <div style="display: flex; border-radius: 8px; overflow: hidden; height: 48px;">
              ${sScale.map(c => `<div style="flex: 1; background: ${c.color};" title="${c.varName}: ${c.color}"></div>`).join('')}
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
            ${[1,2,3,4,6,8,10,12].map(n => `
              <div style="height: ${n * parseInt(sp)}px; background: var(--accent-gradient); border-radius: 4px; min-height: 4px;" title="--space-${n}: ${n * parseInt(sp)}px"></div>
            `).join('')}
          </div>
          <div style="padding: 16px; background: ${p}; border-radius: ${r}px; color: white; font-size: ${fs}px; text-align: center; font-weight: 600;">
            Preview — ${fs}px / ${r}px radius
          </div>
        </div>
      `;

      window.__updateCode?.();
    }

    [primary, secondary, fontSize, spacing, radius].forEach(el => {
      el.addEventListener('input', update);
    });

    primaryHex.addEventListener('change', () => { primary.value = primaryHex.value; update(); });
    secondaryHex.addEventListener('change', () => { secondary.value = secondaryHex.value; update(); });

    document.querySelectorAll('[id^="inc-"]').forEach(cb => {
      cb.addEventListener('change', () => window.__updateCode?.());
    });

    update();
  },

  reset() {
    document.getElementById('var-primary').value = '#8b5cf6';
    document.getElementById('var-secondary').value = '#06b6d4';
    document.getElementById('var-font-size').value = 16;
    document.getElementById('var-spacing').value = 4;
    document.getElementById('var-radius').value = 8;
  },

  getCode(format) {
    const p = document.getElementById('var-primary')?.value || '#8b5cf6';
    const s = document.getElementById('var-secondary')?.value || '#06b6d4';
    const fs = parseInt(document.getElementById('var-font-size')?.value || 16);
    const sp = parseInt(document.getElementById('var-spacing')?.value || 4);
    const r = parseInt(document.getElementById('var-radius')?.value || 8);

    const incColors = document.getElementById('inc-colors')?.checked !== false;
    const incSpacing = document.getElementById('inc-spacing')?.checked !== false;
    const incTypography = document.getElementById('inc-typography')?.checked !== false;
    const incRadius = document.getElementById('inc-radius')?.checked !== false;
    const incShadows = document.getElementById('inc-shadows')?.checked !== false;

    function hexToHSL(hex) {
      let rv = parseInt(hex.slice(1,3), 16) / 255;
      let gv = parseInt(hex.slice(3,5), 16) / 255;
      let bv = parseInt(hex.slice(5,7), 16) / 255;
      const max = Math.max(rv, gv, bv), min = Math.min(rv, gv, bv);
      let h, sv, l = (max + min) / 2;
      if (max === min) { h = sv = 0; }
      else {
        const d = max - min;
        sv = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
          case rv: h = ((gv - bv) / d + (gv < bv ? 6 : 0)) / 6; break;
          case gv: h = ((bv - rv) / d + 2) / 6; break;
          case bv: h = ((rv - gv) / d + 4) / 6; break;
        }
      }
      return { h: Math.round(h * 360), s: Math.round(sv * 100), l: Math.round(l * 100) };
    }

    function scale(hex, name) {
      const { h, sv } = hexToHSL(hex);
      const saturation = hexToHSL(hex).s;
      return [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => {
        const l = shade <= 100 ? 95 - (shade / 100 * 5) : shade <= 500 ? 90 - ((shade - 100) / 400 * 45) : 45 - ((shade - 500) / 400 * 35);
        return `  --${name}-${shade}: hsl(${hexToHSL(hex).h}, ${saturation}%, ${Math.round(l)}%);`;
      }).join('\n');
    }

    let sections = [];
    sections.push('/* Generated by FreeReign — CSS Variables */');
    sections.push(':root {');

    if (incColors) {
      sections.push('  /* Colors — Primary */');
      sections.push(scale(p, 'primary'));
      sections.push('');
      sections.push('  /* Colors — Secondary */');
      sections.push(scale(s, 'secondary'));
      sections.push('');
      sections.push('  /* Neutral */');
      sections.push('  --gray-50: hsl(0, 0%, 98%);');
      sections.push('  --gray-100: hsl(0, 0%, 96%);');
      sections.push('  --gray-200: hsl(0, 0%, 90%);');
      sections.push('  --gray-300: hsl(0, 0%, 83%);');
      sections.push('  --gray-400: hsl(0, 0%, 64%);');
      sections.push('  --gray-500: hsl(0, 0%, 46%);');
      sections.push('  --gray-600: hsl(0, 0%, 33%);');
      sections.push('  --gray-700: hsl(0, 0%, 25%);');
      sections.push('  --gray-800: hsl(0, 0%, 15%);');
      sections.push('  --gray-900: hsl(0, 0%, 9%);');
    }

    if (incSpacing) {
      sections.push('');
      sections.push('  /* Spacing */');
      [1,2,3,4,5,6,8,10,12,16,20,24].forEach(n => {
        sections.push(`  --space-${n}: ${n * sp}px;`);
      });
    }

    if (incTypography) {
      sections.push('');
      sections.push('  /* Typography */');
      sections.push(`  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;`);
      sections.push(`  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;`);
      sections.push(`  --text-xs: ${(fs * 0.75).toFixed(1)}px;`);
      sections.push(`  --text-sm: ${(fs * 0.875).toFixed(1)}px;`);
      sections.push(`  --text-base: ${fs}px;`);
      sections.push(`  --text-lg: ${(fs * 1.125).toFixed(1)}px;`);
      sections.push(`  --text-xl: ${(fs * 1.25).toFixed(1)}px;`);
      sections.push(`  --text-2xl: ${(fs * 1.5).toFixed(1)}px;`);
      sections.push(`  --text-3xl: ${(fs * 1.875).toFixed(1)}px;`);
      sections.push(`  --text-4xl: ${(fs * 2.25).toFixed(1)}px;`);
    }

    if (incRadius) {
      sections.push('');
      sections.push('  /* Border Radius */');
      sections.push(`  --radius-sm: ${Math.round(r * 0.5)}px;`);
      sections.push(`  --radius-md: ${r}px;`);
      sections.push(`  --radius-lg: ${Math.round(r * 1.5)}px;`);
      sections.push(`  --radius-xl: ${r * 2}px;`);
      sections.push(`  --radius-full: 9999px;`);
    }

    if (incShadows) {
      sections.push('');
      sections.push('  /* Shadows */');
      sections.push('  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);');
      sections.push('  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);');
      sections.push('  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);');
      sections.push('  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);');
    }

    sections.push('}');

    if (format === 'scss') {
      return sections.join('\n').replace(/--/g, '$').replace(':root {\n', '').replace('\n}', '').replace(/;/g, ';');
    }

    return sections.join('\n');
  }
};

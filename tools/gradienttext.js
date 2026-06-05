/* ============================================================
   FreeReign — CSS Gradient Text Generator (PRO)
   ============================================================ */

export const gradientTextTool = {
  id: 'gradienttext',
  name: 'Gradient Text',
  icon: '✨',
  description: 'Create stunning gradient text effects with custom colors, angles, and animations. Supports multi-color gradients and animated text.',
  shortDesc: 'Animated gradient text effects',
  category: 'pro',
  isPro: true,

  renderControls() {
    return `
      <div class="control-group">
        <label class="control-label">Color 1</label>
        <div style="display: flex; gap: 8px; align-items: center;">
          <input type="color" id="gt-color1" value="#8b5cf6" style="width: 40px; height: 36px; border: none; border-radius: 6px; cursor: pointer;" />
          <span class="control-value" id="gt-c1-val">#8b5cf6</span>
        </div>
      </div>
      <div class="control-group">
        <label class="control-label">Color 2</label>
        <div style="display: flex; gap: 8px; align-items: center;">
          <input type="color" id="gt-color2" value="#06b6d4" style="width: 40px; height: 36px; border: none; border-radius: 6px; cursor: pointer;" />
          <span class="control-value" id="gt-c2-val">#06b6d4</span>
        </div>
      </div>
      <div class="control-group">
        <label class="control-label">Color 3 (optional)</label>
        <div style="display: flex; gap: 8px; align-items: center;">
          <input type="color" id="gt-color3" value="#f43f5e" style="width: 40px; height: 36px; border: none; border-radius: 6px; cursor: pointer;" />
          <label style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--text-secondary); cursor: pointer;">
            <input type="checkbox" id="gt-use-c3" style="accent-color: var(--accent-primary);"> Enable
          </label>
        </div>
      </div>
      <div class="control-group">
        <label class="control-label">Angle <span class="control-value" id="gt-angle-val">135°</span></label>
        <input type="range" id="gt-angle" min="0" max="360" value="135" step="5" />
      </div>
      <div class="control-group">
        <label class="control-label">Font Size <span class="control-value" id="gt-size-val">48px</span></label>
        <input type="range" id="gt-size" min="16" max="120" value="48" step="2" />
      </div>
      <div class="control-group">
        <label class="control-label">Font Weight <span class="control-value" id="gt-weight-val">800</span></label>
        <input type="range" id="gt-weight" min="100" max="900" value="800" step="100" />
      </div>
      <div class="control-group">
        <label class="control-label">Animate</label>
        <label style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-secondary); cursor: pointer;">
          <input type="checkbox" id="gt-animate" style="accent-color: var(--accent-primary);"> Animated gradient shift
        </label>
      </div>
      <div class="control-group">
        <label class="control-label">Preview Text</label>
        <input type="text" id="gt-text" value="FreeReign" style="padding: 8px 12px; background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 8px; color: var(--text-primary); font-size: 0.85rem; width: 100%;" />
      </div>
    `;
  },

  renderPreview() {
    return `
      <div style="width: 100%; min-height: 200px; display: flex; align-items: center; justify-content: center; background: var(--bg-elevated); border-radius: var(--radius-lg); padding: 32px;">
        <div id="gt-preview" style="
          font-size: 48px; font-weight: 800; text-align: center;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          line-height: 1.2;
        ">FreeReign</div>
      </div>
      <style id="gt-anim-style"></style>
    `;
  },

  init() {
    const c1 = document.getElementById('gt-color1');
    const c2 = document.getElementById('gt-color2');
    const c3 = document.getElementById('gt-color3');
    const useC3 = document.getElementById('gt-use-c3');
    const angle = document.getElementById('gt-angle');
    const size = document.getElementById('gt-size');
    const weight = document.getElementById('gt-weight');
    const animate = document.getElementById('gt-animate');
    const text = document.getElementById('gt-text');
    const preview = document.getElementById('gt-preview');
    const animStyle = document.getElementById('gt-anim-style');

    function update() {
      const colors = useC3.checked
        ? `${c1.value}, ${c2.value}, ${c3.value}`
        : `${c1.value}, ${c2.value}`;

      document.getElementById('gt-c1-val').textContent = c1.value;
      document.getElementById('gt-c2-val').textContent = c2.value;
      document.getElementById('gt-angle-val').textContent = angle.value + '°';
      document.getElementById('gt-size-val').textContent = size.value + 'px';
      document.getElementById('gt-weight-val').textContent = weight.value;

      preview.textContent = text.value || 'FreeReign';
      preview.style.fontSize = size.value + 'px';
      preview.style.fontWeight = weight.value;

      if (animate.checked) {
        const grad = useC3.checked
          ? `${c1.value}, ${c2.value}, ${c3.value}, ${c1.value}`
          : `${c1.value}, ${c2.value}, ${c1.value}`;
        preview.style.background = `linear-gradient(${angle.value}deg, ${grad})`;
        preview.style.backgroundSize = '200% auto';
        preview.style.animation = 'gradient-text-shift 3s linear infinite';
        animStyle.textContent = `@keyframes gradient-text-shift { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }`;
      } else {
        preview.style.background = `linear-gradient(${angle.value}deg, ${colors})`;
        preview.style.backgroundSize = '';
        preview.style.animation = '';
        animStyle.textContent = '';
      }

      preview.style.webkitBackgroundClip = 'text';
      preview.style.backgroundClip = 'text';
      preview.style.webkitTextFillColor = 'transparent';
      preview.style.color = 'transparent';

      window.__updateCode?.();
    }

    [c1, c2, c3, angle, size, weight, text].forEach(el => {
      el.addEventListener('input', update);
    });
    [useC3, animate].forEach(el => {
      el.addEventListener('change', update);
    });

    update();
  },

  reset() {
    document.getElementById('gt-color1').value = '#8b5cf6';
    document.getElementById('gt-color2').value = '#06b6d4';
    document.getElementById('gt-color3').value = '#f43f5e';
    document.getElementById('gt-use-c3').checked = false;
    document.getElementById('gt-angle').value = 135;
    document.getElementById('gt-size').value = 48;
    document.getElementById('gt-weight').value = 800;
    document.getElementById('gt-animate').checked = false;
    document.getElementById('gt-text').value = 'FreeReign';
  },

  getCode(format) {
    const c1v = document.getElementById('gt-color1')?.value || '#8b5cf6';
    const c2v = document.getElementById('gt-color2')?.value || '#06b6d4';
    const c3v = document.getElementById('gt-color3')?.value || '#f43f5e';
    const useC3 = document.getElementById('gt-use-c3')?.checked;
    const angleVal = document.getElementById('gt-angle')?.value || 135;
    const sizeVal = document.getElementById('gt-size')?.value || 48;
    const weightVal = document.getElementById('gt-weight')?.value || 800;
    const isAnimated = document.getElementById('gt-animate')?.checked;

    const colors = useC3 ? `${c1v}, ${c2v}, ${c3v}` : `${c1v}, ${c2v}`;
    const animColors = useC3 ? `${c1v}, ${c2v}, ${c3v}, ${c1v}` : `${c1v}, ${c2v}, ${c1v}`;

    if (format === 'tailwind') {
      return `<!-- Generated by FreeReign Pro — Gradient Text -->
<h1 class="text-[${sizeVal}px] font-[${weightVal}] bg-gradient-to-r from-[${c1v}] ${useC3 ? `via-[${c2v}] to-[${c3v}]` : `to-[${c2v}]`} bg-clip-text text-transparent${isAnimated ? ' animate-gradient-x bg-[length:200%_auto]' : ''}">
  Your Text Here
</h1>`;
    }

    let css = `/* Generated by FreeReign Pro — Gradient Text */
.gradient-text {
  font-size: ${sizeVal}px;
  font-weight: ${weightVal};
  background: linear-gradient(${angleVal}deg, ${isAnimated ? animColors : colors});
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;`;

    if (isAnimated) {
      css += `
  background-size: 200% auto;
  animation: gradient-text-shift 3s linear infinite;
}

@keyframes gradient-text-shift {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}`;
    } else {
      css += '\n}';
    }

    if (format === 'scss') {
      return css.replace('/* Generated', `$gradient-color-1: ${c1v};\n$gradient-color-2: ${c2v};\n${useC3 ? `$gradient-color-3: ${c3v};\n` : ''}\n/* Generated`);
    }
    return css;
  }
};

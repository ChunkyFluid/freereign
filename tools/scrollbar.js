/* ============================================================
   FreeReign — Custom Scrollbar Generator (Pro)
   Style webkit scrollbars with visual controls
   ============================================================ */

export const scrollbarTool = {
  id: 'scrollbar',
  name: 'Custom Scrollbar',
  icon: '📜',
  description: 'Design custom CSS scrollbars with visual controls. Set width, track color, thumb styling, border radius, and hover effects.',
  shortDesc: 'Webkit scrollbar styling',
  category: 'pro',
  isPro: true,
  isNew: true,

  renderControls() {
    return `
      <div class="control-group">
        <label class="control-label">Scrollbar Width <span class="control-value" id="sb-width-val">10px</span></label>
        <input type="range" id="sb-width" min="4" max="24" value="10" step="1" />
      </div>
      <div class="control-group">
        <label class="control-label">Track Color</label>
        <input type="color" id="sb-track-color" value="#1e1e28" class="control-color" />
      </div>
      <div class="control-group">
        <label class="control-label">Thumb Color</label>
        <input type="color" id="sb-thumb-color" value="#8b5cf6" class="control-color" />
      </div>
      <div class="control-group">
        <label class="control-label">Thumb Hover Color</label>
        <input type="color" id="sb-thumb-hover" value="#a78bfa" class="control-color" />
      </div>
      <div class="control-group">
        <label class="control-label">Thumb Radius <span class="control-value" id="sb-radius-val">5px</span></label>
        <input type="range" id="sb-radius" min="0" max="12" value="5" step="1" />
      </div>
      <div class="control-group">
        <label class="control-label">Track Radius <span class="control-value" id="sb-track-radius-val">0px</span></label>
        <input type="range" id="sb-track-radius" min="0" max="12" value="0" step="1" />
      </div>
      <div class="control-group">
        <label class="control-label">Thumb Border <span class="control-value" id="sb-border-val">2px</span></label>
        <input type="range" id="sb-border" min="0" max="6" value="2" step="1" />
      </div>
      <div class="control-group">
        <label class="control-label">Border Color</label>
        <input type="color" id="sb-border-color" value="#1e1e28" class="control-color" />
      </div>
    `;
  },

  renderPreview() {
    return `
      <div id="sb-preview-container" style="
        width: 100%; height: 300px; overflow-y: scroll; border-radius: 12px;
        background: var(--bg-elevated); padding: 24px;
      ">
        <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.8;">
          ${Array.from({length: 30}, (_, i) => `<p style="margin-bottom: 12px;">Line ${i + 1} — Scroll to see the custom scrollbar styling in action. Adjust the controls on the left to customize the appearance.</p>`).join('')}
        </div>
      </div>
      <style id="sb-preview-style"></style>
    `;
  },

  init() {
    const width = document.getElementById('sb-width');
    const trackColor = document.getElementById('sb-track-color');
    const thumbColor = document.getElementById('sb-thumb-color');
    const thumbHover = document.getElementById('sb-thumb-hover');
    const radius = document.getElementById('sb-radius');
    const trackRadius = document.getElementById('sb-track-radius');
    const border = document.getElementById('sb-border');
    const borderColor = document.getElementById('sb-border-color');
    const styleEl = document.getElementById('sb-preview-style');

    function update() {
      document.getElementById('sb-width-val').textContent = width.value + 'px';
      document.getElementById('sb-radius-val').textContent = radius.value + 'px';
      document.getElementById('sb-track-radius-val').textContent = trackRadius.value + 'px';
      document.getElementById('sb-border-val').textContent = border.value + 'px';

      const css = `
        #sb-preview-container::-webkit-scrollbar {
          width: ${width.value}px;
        }
        #sb-preview-container::-webkit-scrollbar-track {
          background: ${trackColor.value};
          border-radius: ${trackRadius.value}px;
        }
        #sb-preview-container::-webkit-scrollbar-thumb {
          background: ${thumbColor.value};
          border-radius: ${radius.value}px;
          border: ${border.value}px solid ${borderColor.value};
        }
        #sb-preview-container::-webkit-scrollbar-thumb:hover {
          background: ${thumbHover.value};
        }
      `;
      styleEl.textContent = css;
      window.__updateCode?.();
    }

    [width, trackColor, thumbColor, thumbHover, radius, trackRadius, border, borderColor].forEach(el => {
      el.addEventListener('input', update);
    });
    update();
  },

  reset() {
    document.getElementById('sb-width').value = 10;
    document.getElementById('sb-track-color').value = '#1e1e28';
    document.getElementById('sb-thumb-color').value = '#8b5cf6';
    document.getElementById('sb-thumb-hover').value = '#a78bfa';
    document.getElementById('sb-radius').value = 5;
    document.getElementById('sb-track-radius').value = 0;
    document.getElementById('sb-border').value = 2;
    document.getElementById('sb-border-color').value = '#1e1e28';
  },

  getCode(format) {
    const w = document.getElementById('sb-width')?.value || 10;
    const tc = document.getElementById('sb-track-color')?.value || '#1e1e28';
    const thc = document.getElementById('sb-thumb-color')?.value || '#8b5cf6';
    const thh = document.getElementById('sb-thumb-hover')?.value || '#a78bfa';
    const r = document.getElementById('sb-radius')?.value || 5;
    const tr = document.getElementById('sb-track-radius')?.value || 0;
    const b = document.getElementById('sb-border')?.value || 2;
    const bc = document.getElementById('sb-border-color')?.value || '#1e1e28';

    if (format === 'tailwind') {
      return `/* Generated by FreeReign Pro — Custom Scrollbar */
/* Add to your global CSS — Tailwind doesn't have scrollbar utilities */
.custom-scrollbar::-webkit-scrollbar {
  width: ${w}px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: ${tc};
  border-radius: ${tr}px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: ${thc};
  border-radius: ${r}px;
  border: ${b}px solid ${bc};
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: ${thh};
}

/* Firefox */
.custom-scrollbar {
  scrollbar-width: ${parseInt(w) <= 8 ? 'thin' : 'auto'};
  scrollbar-color: ${thc} ${tc};
}`;
    }

    if (format === 'scss') {
      return `// Generated by FreeReign Pro — Custom Scrollbar
$scrollbar-width: ${w}px;
$scrollbar-track: ${tc};
$scrollbar-thumb: ${thc};
$scrollbar-thumb-hover: ${thh};
$scrollbar-radius: ${r}px;
$scrollbar-border: ${b}px solid ${bc};

@mixin custom-scrollbar {
  &::-webkit-scrollbar { width: $scrollbar-width; }
  &::-webkit-scrollbar-track { background: $scrollbar-track; border-radius: ${tr}px; }
  &::-webkit-scrollbar-thumb { background: $scrollbar-thumb; border-radius: $scrollbar-radius; border: $scrollbar-border; }
  &::-webkit-scrollbar-thumb:hover { background: $scrollbar-thumb-hover; }
  scrollbar-width: ${parseInt(w) <= 8 ? 'thin' : 'auto'};
  scrollbar-color: $scrollbar-thumb $scrollbar-track;
}`;
    }

    return `/* Generated by FreeReign Pro — Custom Scrollbar */

/* Webkit (Chrome, Safari, Edge) */
.element::-webkit-scrollbar {
  width: ${w}px;
}

.element::-webkit-scrollbar-track {
  background: ${tc};
  border-radius: ${tr}px;
}

.element::-webkit-scrollbar-thumb {
  background: ${thc};
  border-radius: ${r}px;
  border: ${b}px solid ${bc};
}

.element::-webkit-scrollbar-thumb:hover {
  background: ${thh};
}

/* Firefox */
.element {
  scrollbar-width: ${parseInt(w) <= 8 ? 'thin' : 'auto'};
  scrollbar-color: ${thc} ${tc};
}`;
  }
};

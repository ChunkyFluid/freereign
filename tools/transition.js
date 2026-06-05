/* ============================================================
   FreeReign — CSS Transition Generator
   ============================================================ */

export const transitionTool = {
  id: 'transition',
  name: 'Transition',
  icon: '🔀',
  description: 'Design smooth CSS transitions with visual easing curves. Preview timing functions, delays, and multi-property transitions in real time.',
  shortDesc: 'Visual transition builder',
  
  isPro: true,
  isNew: true,

  renderControls() {
    return `
      <div class="control-group">
        <label class="control-label">Property</label>
        <select class="control-select" id="trans-property">
          <option value="all">all</option>
          <option value="transform" selected>transform</option>
          <option value="opacity">opacity</option>
          <option value="background-color">background-color</option>
          <option value="color">color</option>
          <option value="box-shadow">box-shadow</option>
          <option value="border">border</option>
          <option value="width">width</option>
          <option value="height">height</option>
          <option value="border-radius">border-radius</option>
          <option value="filter">filter</option>
          <option value="backdrop-filter">backdrop-filter</option>
        </select>
      </div>
      <div class="control-group">
        <label class="control-label">Duration <span class="control-value" id="duration-val">300ms</span></label>
        <input type="range" id="trans-duration" min="50" max="2000" value="300" step="50" />
      </div>
      <div class="control-group">
        <label class="control-label">Delay <span class="control-value" id="delay-val">0ms</span></label>
        <input type="range" id="trans-delay" min="0" max="1000" value="0" step="50" />
      </div>
      <div class="control-group">
        <label class="control-label">Easing Function</label>
        <div style="display: flex; flex-direction: column; gap: 4px;" id="easing-list">
          ${[
            { id: 'ease', label: 'Ease', value: 'ease' },
            { id: 'ease-in', label: 'Ease In', value: 'ease-in' },
            { id: 'ease-out', label: 'Ease Out', value: 'ease-out' },
            { id: 'ease-in-out', label: 'Ease In Out', value: 'ease-in-out' },
            { id: 'linear', label: 'Linear', value: 'linear' },
            { id: 'cubic-snap', label: 'Snap', value: 'cubic-bezier(0.6, -0.28, 0.74, 0.05)' },
            { id: 'cubic-bounce', label: 'Bounce In', value: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)' },
            { id: 'cubic-smooth', label: 'Smooth', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
            { id: 'cubic-enter', label: 'Enter', value: 'cubic-bezier(0, 0, 0.2, 1)' },
            { id: 'cubic-exit', label: 'Exit', value: 'cubic-bezier(0.4, 0, 1, 1)' },
            { id: 'spring', label: 'Spring', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
          ].map(e => `
            <button class="easing-btn ${e.id === 'ease' ? 'active' : ''}" data-easing="${e.value}" data-id="${e.id}" style="
              display: flex; align-items: center; justify-content: space-between;
              padding: 8px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 500;
              background: ${e.id === 'ease' ? 'var(--accent-gradient-subtle)' : 'transparent'};
              color: ${e.id === 'ease' ? 'var(--accent-primary)' : 'var(--text-secondary)'};
              transition: all 150ms ease; text-align: left; width: 100%;
            ">
              <span>${e.label}</span>
              <code style="font-size: 0.6rem; font-family: var(--font-mono); color: var(--text-tertiary); max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${e.value}</code>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderPreview() {
    return `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
        <div id="trans-preview-area" style="
          width: 100%; min-height: 200px; border-radius: var(--radius-lg);
          background: var(--bg-elevated); display: flex; align-items: center; justify-content: center;
          overflow: hidden; position: relative; cursor: pointer;
        ">
          <div id="trans-box" style="
            width: 80px; height: 80px; border-radius: 16px;
            background: var(--accent-gradient);
            transition: transform 300ms ease;
            box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
          "></div>
        </div>
        <div style="display: flex; gap: 8px; justify-content: center;">
          <button id="trans-trigger" style="
            padding: 8px 20px; border-radius: 8px; font-size: 0.8rem; font-weight: 600;
            background: var(--accent-gradient); color: white; cursor: pointer;
          ">▶ Trigger Transition</button>
          <button id="trans-reset-preview" style="
            padding: 8px 20px; border-radius: 8px; font-size: 0.8rem; font-weight: 500;
            background: var(--bg-surface); color: var(--text-secondary); cursor: pointer;
            border: 1px solid var(--border-default);
          ">↺ Reset</button>
        </div>
        <p style="text-align: center; font-size: 0.7rem; color: var(--text-tertiary);">Click "Trigger" or hover the box to preview</p>
      </div>
    `;
  },

  init() {
    const durationSlider = document.getElementById('trans-duration');
    const delaySlider = document.getElementById('trans-delay');
    const propertySelect = document.getElementById('trans-property');
    const easingList = document.getElementById('easing-list');
    const box = document.getElementById('trans-box');
    const trigger = document.getElementById('trans-trigger');
    const resetBtn = document.getElementById('trans-reset-preview');

    let easing = 'ease';
    let triggered = false;

    function getTransformForProperty(prop) {
      switch(prop) {
        case 'transform': return 'scale(1.3) rotate(15deg)';
        case 'opacity': return null;
        case 'background-color': return null;
        case 'box-shadow': return null;
        case 'border-radius': return null;
        case 'width': return null;
        case 'filter': return null;
        default: return 'scale(1.3) rotate(15deg)';
      }
    }

    function applyTransition() {
      const prop = propertySelect.value;
      const duration = durationSlider.value;
      const delay = delaySlider.value;
      box.style.transition = `${prop} ${duration}ms ${easing} ${delay}ms`;
    }

    function triggerAnimation() {
      const prop = propertySelect.value;
      triggered = !triggered;
      if (triggered) {
        switch(prop) {
          case 'transform':
          case 'all':
            box.style.transform = 'scale(1.3) rotate(15deg)'; break;
          case 'opacity':
            box.style.opacity = '0.3'; break;
          case 'background-color':
            box.style.background = 'linear-gradient(135deg, #f43f5e, #f97316)'; break;
          case 'box-shadow':
            box.style.boxShadow = '0 8px 40px rgba(139, 92, 246, 0.6), 0 0 80px rgba(139, 92, 246, 0.3)'; break;
          case 'border-radius':
            box.style.borderRadius = '50%'; break;
          case 'width':
          case 'height':
            box.style.width = '140px'; box.style.height = '140px'; break;
          case 'filter':
            box.style.filter = 'blur(4px) hue-rotate(90deg)'; break;
          default:
            box.style.transform = 'scale(1.3) rotate(15deg)';
        }
      } else {
        box.style.transform = '';
        box.style.opacity = '';
        box.style.background = 'var(--accent-gradient)';
        box.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.3)';
        box.style.borderRadius = '16px';
        box.style.width = '80px';
        box.style.height = '80px';
        box.style.filter = '';
      }
    }

    function update() {
      document.getElementById('duration-val').textContent = durationSlider.value + 'ms';
      document.getElementById('delay-val').textContent = delaySlider.value + 'ms';
      applyTransition();
      window.__updateCode?.();
    }

    [durationSlider, delaySlider, propertySelect].forEach(el => {
      el.addEventListener('input', update);
    });

    easingList.addEventListener('click', (e) => {
      const btn = e.target.closest('.easing-btn');
      if (!btn) return;
      easing = btn.dataset.easing;
      easingList.querySelectorAll('.easing-btn').forEach(b => {
        b.style.background = 'transparent';
        b.style.color = 'var(--text-secondary)';
        b.classList.remove('active');
      });
      btn.style.background = 'var(--accent-gradient-subtle)';
      btn.style.color = 'var(--accent-primary)';
      btn.classList.add('active');
      update();
    });

    trigger.addEventListener('click', triggerAnimation);
    resetBtn.addEventListener('click', () => {
      triggered = false;
      box.style.transform = '';
      box.style.opacity = '';
      box.style.background = 'var(--accent-gradient)';
      box.style.boxShadow = '0 4px 20px rgba(139, 92, 246, 0.3)';
      box.style.borderRadius = '16px';
      box.style.width = '80px';
      box.style.height = '80px';
      box.style.filter = '';
    });

    box.parentElement.addEventListener('mouseenter', () => { if (!triggered) triggerAnimation(); });
    box.parentElement.addEventListener('mouseleave', () => { if (triggered) triggerAnimation(); });

    update();
  },

  reset() {
    document.getElementById('trans-duration').value = 300;
    document.getElementById('trans-delay').value = 0;
    document.getElementById('trans-property').value = 'transform';
  },

  getCode(format) {
    const prop = document.getElementById('trans-property')?.value || 'transform';
    const duration = document.getElementById('trans-duration')?.value || 300;
    const delay = document.getElementById('trans-delay')?.value || 0;
    const activeBtn = document.querySelector('.easing-btn.active');
    const easing = activeBtn?.dataset.easing || 'ease';

    const delayStr = parseInt(delay) > 0 ? ` ${delay}ms` : '';

    if (format === 'tailwind') {
      const durationMap = { '150': '150', '200': '200', '300': '300', '500': '500', '700': '700', '1000': '1000' };
      const dur = durationMap[duration] || `[${duration}ms]`;
      return `<!-- Generated by FreeReign — Transition -->
<div class="transition-${prop === 'all' ? 'all' : `[${prop}]`} duration-${dur} ${easing === 'ease-in-out' ? 'ease-in-out' : easing === 'ease-in' ? 'ease-in' : easing === 'ease-out' ? 'ease-out' : `[${easing}]`}${parseInt(delay) > 0 ? ` delay-[${delay}ms]` : ''}">
  Hover me
</div>`;
    }

    const css = `/* Generated by FreeReign — Transition */
.element {
  transition: ${prop} ${duration}ms ${easing}${delayStr};
}

/* Triggered state */
.element:hover {
  /* Add your hover styles here */
}`;

    if (format === 'scss') {
      return `// Generated by FreeReign — Transition
$transition-property: ${prop};
$transition-duration: ${duration}ms;
$transition-easing: ${easing};
$transition-delay: ${delay}ms;

.element {
  transition: $transition-property $transition-duration $transition-easing${parseInt(delay) > 0 ? ' $transition-delay' : ''};
}`;
    }
    return css;
  }
};

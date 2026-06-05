/* ============================================================
   FreeReign — CSS Transform Generator Tool
   ============================================================ */

let state = {
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scaleX: 1,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  skewX: 0,
  skewY: 0,
  perspective: 800,
  usePerspective: false,
};

function getTransformCSS() {
  const parts = [];
  if (state.rotateX !== 0) parts.push(`rotateX(${state.rotateX}deg)`);
  if (state.rotateY !== 0) parts.push(`rotateY(${state.rotateY}deg)`);
  if (state.rotateZ !== 0) parts.push(`rotate(${state.rotateZ}deg)`);
  if (state.scaleX !== 1 || state.scaleY !== 1) parts.push(`scale(${state.scaleX}, ${state.scaleY})`);
  if (state.translateX !== 0 || state.translateY !== 0) parts.push(`translate(${state.translateX}px, ${state.translateY}px)`);
  if (state.skewX !== 0 || state.skewY !== 0) parts.push(`skew(${state.skewX}deg, ${state.skewY}deg)`);
  return parts.length ? parts.join(' ') : 'none';
}

function updatePreview() {
  const el = document.getElementById('transform-preview');
  const wrapper = document.getElementById('transform-wrapper');
  if (el) {
    el.style.transform = getTransformCSS();
  }
  if (wrapper && state.usePerspective) {
    wrapper.style.perspective = state.perspective + 'px';
  } else if (wrapper) {
    wrapper.style.perspective = 'none';
  }
  if (window.__updateCode) window.__updateCode();
}

export const transformTool = {
  id: 'transform',
  name: 'Transform',
  icon: '🔄',
  description: 'Manipulate CSS transforms with visual controls for rotation, scale, translation, skew, and 3D perspective.',
  shortDesc: 'Rotate, scale, skew & translate',
  isPro: true,
  isNew: false,

  renderControls() {
    const sliders = [
      { id: 'rotateZ', label: 'Rotate Z', min: -180, max: 180, val: state.rotateZ, unit: '°' },
      { id: 'rotateX', label: 'Rotate X', min: -180, max: 180, val: state.rotateX, unit: '°' },
      { id: 'rotateY', label: 'Rotate Y', min: -180, max: 180, val: state.rotateY, unit: '°' },
      { id: 'scaleX', label: 'Scale X', min: 0.1, max: 3, val: state.scaleX, unit: '', step: 0.05 },
      { id: 'scaleY', label: 'Scale Y', min: 0.1, max: 3, val: state.scaleY, unit: '', step: 0.05 },
      { id: 'translateX', label: 'Translate X', min: -100, max: 100, val: state.translateX, unit: 'px' },
      { id: 'translateY', label: 'Translate Y', min: -100, max: 100, val: state.translateY, unit: 'px' },
      { id: 'skewX', label: 'Skew X', min: -45, max: 45, val: state.skewX, unit: '°' },
      { id: 'skewY', label: 'Skew Y', min: -45, max: 45, val: state.skewY, unit: '°' },
    ];

    return `
      ${sliders.map(s => `
        <div class="control-group">
          <span class="control-label">${s.label} <span class="control-value" id="tf-${s.id}-val">${s.val}${s.unit}</span></span>
          <input type="range" min="${s.min}" max="${s.max}" value="${s.val}" ${s.step ? `step="${s.step}"` : ''} id="tf-${s.id}" data-prop="${s.id}" data-unit="${s.unit}" />
        </div>
      `).join('')}
      <div class="control-group">
        <label class="control-checkbox">
          <input type="checkbox" id="tf-perspective-check" ${state.usePerspective ? 'checked' : ''} />
          Enable Perspective
        </label>
      </div>
      <div class="control-group" id="tf-perspective-group" style="display:${state.usePerspective ? 'block' : 'none'}">
        <span class="control-label">Perspective <span class="control-value" id="tf-perspective-val">${state.perspective}px</span></span>
        <input type="range" min="100" max="2000" value="${state.perspective}" id="tf-perspective" />
      </div>
    `;
  },

  renderPreview() {
    return `
      <div id="transform-wrapper" style="perspective:${state.usePerspective ? state.perspective + 'px' : 'none'};display:flex;align-items:center;justify-content:center;width:100%;height:100%;">
        <div id="transform-preview" style="
          width: 160px; height: 120px;
          background: var(--accent-gradient);
          border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 700; font-size: 1rem;
          box-shadow: var(--shadow-lg);
          transition: transform 0.15s ease;
        ">Transform</div>
      </div>
    `;
  },

  init() {
    updatePreview();

    // Bind all sliders
    document.querySelectorAll('#tool-controls input[type="range"][data-prop]').forEach(input => {
      input.addEventListener('input', (e) => {
        const prop = e.target.dataset.prop;
        const unit = e.target.dataset.unit;
        const val = +e.target.value;
        state[prop] = val;
        document.getElementById(`tf-${prop}-val`).textContent = (Number.isInteger(val) ? val : val.toFixed(2)) + unit;
        updatePreview();
      });
    });

    // Perspective checkbox
    document.getElementById('tf-perspective-check')?.addEventListener('change', (e) => {
      state.usePerspective = e.target.checked;
      document.getElementById('tf-perspective-group').style.display = state.usePerspective ? 'block' : 'none';
      updatePreview();
    });

    // Perspective slider
    document.getElementById('tf-perspective')?.addEventListener('input', (e) => {
      state.perspective = +e.target.value;
      document.getElementById('tf-perspective-val').textContent = state.perspective + 'px';
      updatePreview();
    });
  },

  reset() {
    state = {
      rotateX: 0, rotateY: 0, rotateZ: 0,
      scaleX: 1, scaleY: 1,
      translateX: 0, translateY: 0,
      skewX: 0, skewY: 0,
      perspective: 800, usePerspective: false,
    };
  },

  getCode(format) {
    const transform = getTransformCSS();
    if (format === 'css') {
      let code = `/* Generated by FreeReign */\n.element {\n  transform: ${transform};`;
      if (state.usePerspective) {
        code += `\n}\n\n.element-parent {\n  perspective: ${state.perspective}px;`;
      }
      code += '\n}';
      return code;
    } else if (format === 'scss') {
      let code = `// Generated by FreeReign\n$transform: ${transform};\n\n.element {\n  transform: $transform;`;
      if (state.usePerspective) code += `\n  \n  &-parent {\n    perspective: ${state.perspective}px;\n  }`;
      code += '\n}';
      return code;
    } else {
      const parts = [];
      if (state.rotateZ !== 0) parts.push(`rotate-[${state.rotateZ}deg]`);
      if (state.scaleX !== 1) parts.push(`scale-x-[${state.scaleX}]`);
      if (state.scaleY !== 1) parts.push(`scale-y-[${state.scaleY}]`);
      if (state.translateX !== 0) parts.push(`translate-x-[${state.translateX}px]`);
      if (state.translateY !== 0) parts.push(`translate-y-[${state.translateY}px]`);
      if (state.skewX !== 0) parts.push(`skew-x-[${state.skewX}deg]`);
      if (state.skewY !== 0) parts.push(`skew-y-[${state.skewY}deg]`);
      return `<!-- Generated by FreeReign -->\n<div class="${parts.join(' ')}">\n  ...\n</div>`;
    }
  }
};

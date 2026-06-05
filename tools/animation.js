/* ============================================================
   FreeReign — CSS Animation Generator Tool
   ============================================================ */

let state = {
  name: 'pulse',
  duration: 2,
  timingFunction: 'ease-in-out',
  iterationCount: 'infinite',
  direction: 'normal',
  fillMode: 'none',
  keyframes: [
    { offset: 0, transform: 'scale(1)', opacity: 1 },
    { offset: 50, transform: 'scale(1.05)', opacity: 0.8 },
    { offset: 100, transform: 'scale(1)', opacity: 1 },
  ],
};

const PRESETS = [
  { name: 'Pulse', keyframes: [
    { offset: 0, transform: 'scale(1)', opacity: 1 },
    { offset: 50, transform: 'scale(1.05)', opacity: 0.8 },
    { offset: 100, transform: 'scale(1)', opacity: 1 },
  ]},
  { name: 'Bounce', keyframes: [
    { offset: 0, transform: 'translateY(0)', opacity: 1 },
    { offset: 30, transform: 'translateY(-30px)', opacity: 1 },
    { offset: 50, transform: 'translateY(0)', opacity: 1 },
    { offset: 70, transform: 'translateY(-15px)', opacity: 1 },
    { offset: 100, transform: 'translateY(0)', opacity: 1 },
  ]},
  { name: 'Shake', keyframes: [
    { offset: 0, transform: 'translateX(0)', opacity: 1 },
    { offset: 20, transform: 'translateX(-10px)', opacity: 1 },
    { offset: 40, transform: 'translateX(10px)', opacity: 1 },
    { offset: 60, transform: 'translateX(-10px)', opacity: 1 },
    { offset: 80, transform: 'translateX(10px)', opacity: 1 },
    { offset: 100, transform: 'translateX(0)', opacity: 1 },
  ]},
  { name: 'Fade In', keyframes: [
    { offset: 0, transform: 'translateY(20px)', opacity: 0 },
    { offset: 100, transform: 'translateY(0)', opacity: 1 },
  ]},
  { name: 'Spin', keyframes: [
    { offset: 0, transform: 'rotate(0deg)', opacity: 1 },
    { offset: 100, transform: 'rotate(360deg)', opacity: 1 },
  ]},
  { name: 'Swing', keyframes: [
    { offset: 0, transform: 'rotate(0deg)', opacity: 1 },
    { offset: 25, transform: 'rotate(15deg)', opacity: 1 },
    { offset: 50, transform: 'rotate(-10deg)', opacity: 1 },
    { offset: 75, transform: 'rotate(5deg)', opacity: 1 },
    { offset: 100, transform: 'rotate(0deg)', opacity: 1 },
  ]},
];

function getAnimationCSS() {
  return `${state.name} ${state.duration}s ${state.timingFunction} ${state.iterationCount} ${state.direction} ${state.fillMode}`;
}

function getKeyframesCSS() {
  const lines = state.keyframes.map(kf => {
    let props = [];
    if (kf.transform && kf.transform !== 'none') props.push(`    transform: ${kf.transform};`);
    if (kf.opacity !== undefined && kf.opacity !== 1) props.push(`    opacity: ${kf.opacity};`);
    else if (kf.opacity !== undefined) props.push(`    opacity: ${kf.opacity};`);
    return `  ${kf.offset}% {\n${props.join('\n')}\n  }`;
  });
  return `@keyframes ${state.name} {\n${lines.join('\n')}\n}`;
}

function updatePreview() {
  const el = document.getElementById('anim-preview');
  if (el) {
    // Remove and re-add to restart animation
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = getAnimationCSS();

    // Create dynamic keyframes style
    let styleEl = document.getElementById('anim-dynamic-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'anim-dynamic-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = getKeyframesCSS();
  }
  if (window.__updateCode) window.__updateCode();
}

function renderKeyframes() {
  const container = document.getElementById('anim-keyframes');
  if (!container) return;

  container.innerHTML = state.keyframes.map((kf, i) => `
    <div style="padding:var(--space-2);background:var(--bg-elevated);border-radius:var(--radius-sm);border:1px solid var(--border-subtle);margin-bottom:var(--space-2)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-1)">
        <span style="font-size:var(--text-xs);font-weight:600;color:var(--text-tertiary)">${kf.offset}%</span>
        ${state.keyframes.length > 2 ? `<button class="color-stop__remove" data-kf-index="${i}">×</button>` : ''}
      </div>
      <div class="control-group" style="margin-bottom:var(--space-1)">
        <span class="control-label" style="font-size:var(--text-xs)">Transform</span>
        <input type="text" class="control-input" value="${kf.transform}" data-index="${i}" data-prop="transform" style="font-family:var(--font-mono);font-size:var(--text-xs)" />
      </div>
      <div class="control-group">
        <span class="control-label" style="font-size:var(--text-xs)">Opacity <span class="control-value">${kf.opacity}</span></span>
        <input type="range" min="0" max="1" step="0.05" value="${kf.opacity}" data-index="${i}" data-prop="opacity" />
      </div>
    </div>
  `).join('');

  container.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = +e.target.dataset.index;
      const prop = e.target.dataset.prop;
      if (prop === 'opacity') {
        state.keyframes[idx].opacity = +e.target.value;
        const valSpan = e.target.closest('.control-group')?.querySelector('.control-value');
        if (valSpan) valSpan.textContent = e.target.value;
      } else {
        state.keyframes[idx][prop] = e.target.value;
      }
      updatePreview();
    });
  });

  container.querySelectorAll('.color-stop__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      state.keyframes.splice(+btn.dataset.kfIndex, 1);
      renderKeyframes();
      updatePreview();
    });
  });
}

export const animationTool = {
  id: 'animation',
  name: 'Animation Builder',
  icon: '✨',
  description: 'Build CSS keyframe animations with visual preview. Customize timing, duration, keyframes, and choose from presets.',
  shortDesc: 'Keyframe animation builder',
  isPro: false,
  isNew: true,

  renderControls() {
    return `
      <div class="control-group">
        <span class="control-label">Preset</span>
        <select class="control-select" id="anim-preset">
          <option value="">Custom</option>
          ${PRESETS.map((p, i) => `<option value="${i}">${p.name}</option>`).join('')}
        </select>
      </div>
      <div class="control-group">
        <span class="control-label">Name</span>
        <input type="text" class="control-input" value="${state.name}" id="anim-name" style="font-family:var(--font-mono)" />
      </div>
      <div class="control-group">
        <span class="control-label">Duration <span class="control-value" id="anim-dur-val">${state.duration}s</span></span>
        <input type="range" min="0.1" max="5" step="0.1" value="${state.duration}" id="anim-duration" />
      </div>
      <div class="control-group">
        <span class="control-label">Timing</span>
        <select class="control-select" id="anim-timing">
          ${['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'step-start', 'step-end'].map(t =>
            `<option value="${t}" ${state.timingFunction === t ? 'selected' : ''}>${t}</option>`
          ).join('')}
        </select>
      </div>
      <div class="control-group">
        <span class="control-label">Iteration</span>
        <select class="control-select" id="anim-iteration">
          ${['infinite', '1', '2', '3', '5'].map(i =>
            `<option value="${i}" ${state.iterationCount === i ? 'selected' : ''}>${i}</option>`
          ).join('')}
        </select>
      </div>
      <div class="control-group">
        <span class="control-label">Direction</span>
        <select class="control-select" id="anim-direction">
          ${['normal', 'reverse', 'alternate', 'alternate-reverse'].map(d =>
            `<option value="${d}" ${state.direction === d ? 'selected' : ''}>${d}</option>`
          ).join('')}
        </select>
      </div>
      <div class="control-group">
        <span class="control-label">Keyframes</span>
        <div id="anim-keyframes"></div>
      </div>
    `;
  },

  renderPreview() {
    return `<div id="anim-preview" style="
      width: 120px; height: 120px;
      background: var(--accent-gradient);
      border-radius: var(--radius-lg);
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: 700; font-size: 1.2rem;
    ">◆</div>`;
  },

  init() {
    renderKeyframes();
    updatePreview();

    document.getElementById('anim-preset')?.addEventListener('change', (e) => {
      const idx = +e.target.value;
      if (!isNaN(idx) && PRESETS[idx]) {
        state.keyframes = JSON.parse(JSON.stringify(PRESETS[idx].keyframes));
        state.name = PRESETS[idx].name.toLowerCase().replace(/\s+/g, '-');
        document.getElementById('anim-name').value = state.name;
        renderKeyframes();
        updatePreview();
      }
    });

    document.getElementById('anim-name')?.addEventListener('input', (e) => {
      state.name = e.target.value.replace(/[^a-zA-Z0-9-_]/g, '');
      updatePreview();
    });

    document.getElementById('anim-duration')?.addEventListener('input', (e) => {
      state.duration = +e.target.value;
      document.getElementById('anim-dur-val').textContent = state.duration + 's';
      updatePreview();
    });

    document.getElementById('anim-timing')?.addEventListener('change', (e) => {
      state.timingFunction = e.target.value;
      updatePreview();
    });

    document.getElementById('anim-iteration')?.addEventListener('change', (e) => {
      state.iterationCount = e.target.value;
      updatePreview();
    });

    document.getElementById('anim-direction')?.addEventListener('change', (e) => {
      state.direction = e.target.value;
      updatePreview();
    });
  },

  getState() { return structuredClone(state); },
  setState(s) { if (s) state = structuredClone(s); },

  reset() {
    state = {
      name: 'pulse', duration: 2, timingFunction: 'ease-in-out', iterationCount: 'infinite',
      direction: 'normal', fillMode: 'none',
      keyframes: [
        { offset: 0, transform: 'scale(1)', opacity: 1 },
        { offset: 50, transform: 'scale(1.05)', opacity: 0.8 },
        { offset: 100, transform: 'scale(1)', opacity: 1 },
      ],
    };
    document.getElementById('anim-dynamic-style')?.remove();
  },

  getCode(format) {
    const animation = getAnimationCSS();
    const keyframes = getKeyframesCSS();
    if (format === 'css') {
      return `/* Generated by FreeReign */\n${keyframes}\n\n.element {\n  animation: ${animation};\n}`;
    } else if (format === 'scss') {
      return `// Generated by FreeReign\n${keyframes}\n\n.element {\n  animation: ${animation};\n}`;
    } else {
      return `<!-- Generated by FreeReign -->\n<!-- Add keyframes to your CSS -->\n${keyframes}\n\n<!-- Apply with arbitrary value -->\n<div class="animate-[${state.name}_${state.duration}s_${state.timingFunction}_${state.iterationCount}]">\n  ...\n</div>`;
    }
  }
};

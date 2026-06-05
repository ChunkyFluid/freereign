/* ============================================================
   FreeReign — Main Application Controller
   ============================================================ */
import './style.css';
import { gradientTool } from './tools/gradient.js';
import { boxShadowTool } from './tools/boxshadow.js';
import { borderRadiusTool } from './tools/borderradius.js';
import { colorPaletteTool } from './tools/colorpalette.js';
import { glassmorphismTool } from './tools/glassmorphism.js';
import { flexboxTool } from './tools/flexbox.js';
import { gridTool } from './tools/grid.js';
import { animationTool } from './tools/animation.js';
import { textShadowTool } from './tools/textshadow.js';
import { neumorphismTool } from './tools/neumorphism.js';
// Pro tools
import { transformTool } from './tools/transform.js';
import { clipPathTool } from './tools/clippath.js';
import { filterTool } from './tools/filter.js';
import { typographyTool } from './tools/typography.js';
import { breakpointTool } from './tools/breakpoint.js';
import { aspectRatioTool } from './tools/aspectratio.js';
import { cursorTool } from './tools/cursor.js';
import { scrollSnapTool } from './tools/scrollsnap.js';
import { transitionTool } from './tools/transition.js';
import { variablesTool } from './tools/variables.js';
import { containerQueryTool } from './tools/containerquery.js';
import { gradientTextTool } from './tools/gradienttext.js';
import { fluidTypeTool } from './tools/fluidtype.js';
import { scrollbarTool } from './tools/scrollbar.js';
import { mediaqueryTool } from './tools/mediaquery.js';

// === Tool Registry ===
// 10 Free tools, 15 Pro tools = 25 total
const TOOLS = [
  // --- Free (10) ---
  gradientTool,
  boxShadowTool,
  borderRadiusTool,
  colorPaletteTool,
  glassmorphismTool,
  flexboxTool,
  gridTool,
  animationTool,
  textShadowTool,
  neumorphismTool,
  // --- Pro (15) ---
  transformTool,
  transitionTool,
  clipPathTool,
  filterTool,
  typographyTool,
  variablesTool,
  breakpointTool,
  aspectRatioTool,
  scrollSnapTool,
  cursorTool,
  containerQueryTool,
  gradientTextTool,
  fluidTypeTool,
  scrollbarTool,
  mediaqueryTool,
];

const TOOL_CATEGORIES = {
  essentials: ['gradient', 'boxshadow', 'borderradius', 'colorpalette', 'glassmorphism'],
  layout: ['flexbox', 'grid'],
  effects: ['animation', 'textshadow', 'neumorphism'],
  pro: ['transform', 'transition', 'clippath', 'filter', 'typography', 'variables', 'breakpoint', 'aspectratio', 'scrollsnap', 'cursor', 'containerquery', 'gradienttext', 'fluidtype', 'scrollbar', 'mediaquery'],
};

// === State ===
let currentTool = null;
let isPro = false;
let isPreviewingPro = false;

// === Analytics ===
const analytics = {
  sessionStart: Date.now(),
  toolViews: {},
  copies: 0,
  proClicks: 0,
  track(event, data = {}) {
    const entry = { event, ...data, timestamp: Date.now() };
    const stored = JSON.parse(localStorage.getItem('fr_analytics') || '[]');
    stored.push(entry);
    if (stored.length > 500) stored.splice(0, stored.length - 500);
    localStorage.setItem('fr_analytics', JSON.stringify(stored));
  },
  trackToolView(toolId) {
    this.toolViews[toolId] = (this.toolViews[toolId] || 0) + 1;
    this.track('tool_view', { tool: toolId });
  },
  trackCopy(toolId) {
    this.copies++;
    this.track('copy', { tool: toolId });
  },
  trackProClick() {
    this.proClicks++;
    this.track('pro_click');
  }
};

// === DOM Elements ===
const sidebarEl = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sidebarToggle = document.getElementById('sidebar-toggle');
const toolContainer = document.getElementById('tool-container');
const searchInput = document.getElementById('tool-search');
const themeToggle = document.getElementById('theme-toggle');
const proBtn = document.getElementById('pro-btn');
const sidebarProBtn = document.getElementById('sidebar-pro-btn');
const proModalOverlay = document.getElementById('pro-modal-overlay');
const proModalClose = document.getElementById('pro-modal-close');
const proBuyBtn = document.getElementById('pro-buy-btn');
const logoLink = document.getElementById('logo-link');

// === Initialize App ===
function init() {
  checkProStatus();
  renderSidebar();
  handleRouting();
  bindGlobalEvents();
  initTheme();
}

// === Theme ===
function initTheme() {
  const saved = localStorage.getItem('fr_theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('fr_theme', next);
}

// === Pro Status ===
function checkProStatus() {
  isPro = localStorage.getItem('fr_pro') === 'true';
  document.body.classList.toggle('is-pro', isPro);
}

// === Sidebar Rendering ===
function renderSidebar() {
  Object.entries(TOOL_CATEGORIES).forEach(([category, toolIds]) => {
    const container = document.getElementById(`tools-${category}`);
    if (!container) return;
    container.innerHTML = '';
    
    const tools = toolIds.map(id => TOOLS.find(t => t.id === id)).filter(Boolean);
    tools.forEach(tool => {
      const btn = document.createElement('button');
      btn.className = 'sidebar__tool-btn';
      btn.dataset.toolId = tool.id;
      btn.innerHTML = `
        <span class="sidebar__tool-icon">${tool.icon}</span>
        <span class="sidebar__tool-name">${tool.name}</span>
        ${tool.isPro && !isPro ? '<span class="sidebar__tool-lock">🔒</span>' : ''}
        ${tool.isNew ? '<span class="sidebar__tool-badge">NEW</span>' : ''}
      `;
      btn.addEventListener('click', () => navigateTo(tool.id));
      container.appendChild(btn);
    });
  });
}

// === Routing ===
function handleRouting() {
  const hash = window.location.hash.slice(1);
  if (hash && hash !== 'pro') {
    navigateTo(hash);
  } else {
    renderLanding();
  }
}

function navigateTo(toolId) {
  const tool = TOOLS.find(t => t.id === toolId);
  if (!tool) {
    renderLanding();
    return;
  }

  // Pro tools: allow preview mode instead of hard blocking
  isPreviewingPro = tool.isPro && !isPro;

  currentTool = tool;
  window.location.hash = toolId;
  analytics.trackToolView(toolId);

  // Update sidebar active state
  document.querySelectorAll('.sidebar__tool-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.toolId === toolId);
  });

  // Close mobile sidebar
  sidebarEl.classList.remove('open');

  // Update page title and meta for SEO
  document.title = `${tool.name} — Free CSS Generator | FreeReign`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', `Free ${tool.name} generator. ${tool.description} Generate CSS, SCSS, and Tailwind code instantly.`);
  }
  // Update canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', `https://freereign.dev/${tool.id}`);
  // Update og:url
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', `https://freereign.dev/${tool.id}`);

  // Render tool
  renderTool(tool);
}

// === Tool Rendering ===
function renderTool(tool) {
  toolContainer.innerHTML = '';
  toolContainer.style.animation = 'none';
  toolContainer.offsetHeight; // trigger reflow
  toolContainer.style.animation = '';

  const proPreviewBanner = isPreviewingPro ? `
    <div class="pro-preview-banner" id="pro-preview-banner">
      <span class="pro-preview-banner__text">★ Previewing Pro tool — code output includes watermark</span>
      <button class="pro-preview-banner__btn" id="pro-preview-unlock">Unlock Pro — $14.99</button>
    </div>
  ` : '';

  const copyBtnLabel = isPreviewingPro ? '🔒 Unlock to Copy' : 'Copy';
  const downloadBtnLabel = isPreviewingPro ? '🔒 Unlock' : 'Download';

  const html = `
    ${proPreviewBanner}
    <div class="tool-header">
      <h1 class="tool-header__title">${tool.name}${isPreviewingPro ? ' <span class="tool-header__pro-badge">PRO</span>' : ''}</h1>
      <p class="tool-header__desc">${tool.description}</p>
    </div>
    <div class="tool-body">
      <div class="tool-controls" id="tool-controls">
        ${tool.renderControls()}
      </div>
      <div class="tool-preview" id="tool-preview-panel">
        <div class="tool-preview__header">
          <span class="tool-preview__title">Preview</span>
          <div class="tool-preview__actions">
            <button class="preview-action-btn" id="reset-btn">Reset</button>
          </div>
        </div>
        <div class="tool-preview__body" id="preview-body">
          ${tool.renderPreview()}
        </div>
      </div>
    </div>
    <div class="tool-code" id="tool-code-panel">
      <div class="tool-code__header">
        <div class="tool-code__tabs">
          <button class="code-tab active" data-format="css" aria-label="CSS output format">CSS</button>
          <button class="code-tab${!isPro ? ' code-tab--locked' : ''}" data-format="scss">SCSS${!isPro ? ' 🔒' : ''}</button>
          <button class="code-tab${!isPro ? ' code-tab--locked' : ''}" data-format="tailwind">Tailwind${!isPro ? ' 🔒' : ''}</button>
        </div>
        <div class="tool-code__actions">
          <button class="copy-btn" id="download-btn" title="Download CSS file (Ctrl+S)" aria-label="Download CSS file">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v9M3 7l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 12h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            ${downloadBtnLabel}
          </button>
          <button class="copy-btn" id="share-btn" title="Share this tool" aria-label="Share this tool">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 8a2 2 0 100-4 2 2 0 000 4zM10 4a2 2 0 100-4 2 2 0 000 4zM10 14a2 2 0 100-4 2 2 0 000 4zM5.7 7.2l2.6 1.6M8.3 3.2L5.7 4.8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
            Share
          </button>
          <button class="copy-btn ${isPreviewingPro ? 'copy-btn--locked' : ''}" id="copy-btn" aria-label="Copy code to clipboard">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4" y="4" width="9" height="9" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M10 4V3a2 2 0 00-2-2H3a2 2 0 00-2 2v5a2 2 0 002 2h1" stroke="currentColor" stroke-width="1.5"/></svg>
            ${copyBtnLabel}
          </button>
        </div>
      </div>
      <div class="tool-code__body">
        <pre id="code-output"></pre>
      </div>
    </div>
    <div class="tool-footer">
      <span>Made with ◆ by <strong>FreeReign</strong></span>
      <span>·</span>
      <span>${TOOLS.length} tools</span>
      <span>·</span>
      <span>100% client-side</span>
      <span>·</span>
      <a href="/terms" class="tool-footer__link">Terms</a>
      <a href="/privacy" class="tool-footer__link">Privacy</a>
      <a href="/refund" class="tool-footer__link">Refund</a>
    </div>
  `;

  toolContainer.innerHTML = html;

  // Initialize tool logic
  tool.init();

  // Bind code panel events
  bindCodePanelEvents(tool);

  // Bind reset
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      tool.reset?.();
      tool.init();
      bindCodePanelEvents(tool);
    });
  }

  // Bind share
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const url = window.location.href;
      const title = `FreeReign — ${tool.name}`;
      const text = `Check out this CSS ${tool.name} tool on FreeReign!`;
      if (navigator.share) {
        navigator.share({ title, text, url }).catch(() => {});
      } else {
        navigator.clipboard.writeText(url).then(() => {
          showToast('Link copied to clipboard!', 'success');
        });
      }
    });
  }

  // Pro preview banner unlock button
  const proUnlockBtn = document.getElementById('pro-preview-unlock');
  if (proUnlockBtn) {
    proUnlockBtn.addEventListener('click', () => {
      analytics.trackProClick();
      showProModal();
    });
  }
}

function bindCodePanelEvents(tool) {
  const copyBtn = document.getElementById('copy-btn');
  const codeTabs = document.querySelectorAll('.code-tab');
  let currentFormat = 'css';

  // Helper: get code with watermark applied
  function getCodeWithWatermark() {
    let code = tool.getCode(currentFormat);
    // Strip any tool-level watermarks to avoid duplicates
    code = code.replace(/\/\*\s*Generated by FreeReign[^*]*\*\/\r?\n?/g, '');
    code = code.replace(/\/\/\s*Generated by FreeReign[^\n]*\r?\n?/g, '');
    code = code.replace(/<!--\s*Generated by FreeReign[^>]*-->\r?\n?/g, '');
    code = code.replace(/^\s*\n/, ''); // Clean up leading blank line
    if (isPreviewingPro) {
      code = `/* Generated by FreeReign Pro (preview) */\n/* Get Pro: freereign.dev — $14.99 one-time */\n\n${code}`;
    } else if (!isPro) {
      code = `/* Generated by FreeReign — freereign.dev */\n\n${code}`;
    }
    return code;
  }

  // Update code output
  function updateCode() {
    const output = document.getElementById('code-output');
    if (!output) return;
    output.innerHTML = highlightCSS(getCodeWithWatermark());
  }

  updateCode();

  // Copy button
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (isPreviewingPro) {
        analytics.trackProClick();
        showProModal();
        return;
      }
      const code = getCodeWithWatermark();
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Copied!
        `;
        analytics.trackCopy(tool.id);
        showToast('Code copied to clipboard!', 'success');
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4" y="4" width="9" height="9" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M10 4V3a2 2 0 00-2-2H3a2 2 0 00-2 2v5a2 2 0 002 2h1" stroke="currentColor" stroke-width="1.5"/></svg>
            Copy
          `;
        }, 2000);
      });
    });
  }

  // Download button
  const downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (isPreviewingPro) {
        analytics.trackProClick();
        showProModal();
        return;
      }
      const code = getCodeWithWatermark();
      const ext = currentFormat === 'scss' ? 'scss' : currentFormat === 'tailwind' ? 'html' : 'css';
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tool.id}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      analytics.track('download', { tool: tool.id, format: currentFormat });
      showToast(`${tool.id}.${ext} downloaded!`, 'success');
    });
  }

  // Format tabs
  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const format = tab.dataset.format;
      // Gate SCSS/Tailwind for non-Pro users
      if (!isPro && (format === 'scss' || format === 'tailwind')) {
        analytics.trackProClick();
        showToast('SCSS & Tailwind output is a Pro feature', 'info');
        showProModal();
        return;
      }
      codeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFormat = format;
      updateCode();
    });
  });

  // Expose update function globally for tools to call
  window.__updateCode = updateCode;
}

// === CSS Syntax Highlighting ===
function highlightCSS(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, match => `<span class="css-comment">${match}</span>`)
    .replace(/([\w-]+)(\s*:\s*)/g, '<span class="css-prop">$1</span>$2')
    .replace(/([{}\[\]])/g, '<span class="css-brace">$1</span>')
    .replace(/(\.[\w-]+)/g, '<span class="css-selector">$1</span>');
}

// === Landing Page ===
function renderLanding() {
  currentTool = null;
  document.querySelectorAll('.sidebar__tool-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  window.location.hash = '';

  // Reset page title and meta
  document.title = 'FreeReign — Premium CSS & Design Toolkit';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', '25 CSS generators in one toolkit. 10 free, 15 Pro. Gradients, shadows, glassmorphism, animations & more. Instant code output.');
  }

  toolContainer.innerHTML = `
    <div class="landing">
      <span class="landing__eyebrow">✦ No signup · No install · Works in your browser</span>
      <h1 class="landing__title">
        Ship CSS<br/>
        <span class="landing__title-accent">10x Faster</span>
      </h1>
      <p class="landing__subtitle">
        ${TOOLS.length} visual CSS generators with instant code output.
        Gradients, shadows, animations, layouts — copy & paste into any project.
      </p>
      <div class="landing__cta-group">
        <button class="landing__cta landing__cta--primary" id="cta-explore">
          Start Building — Free →
        </button>
        <button class="landing__cta landing__cta--secondary" id="cta-pro">
          ★ Unlock All ${TOOLS.length} Tools — $14.99
        </button>
      </div>

      <div class="landing__stats">
        <div class="landing__stat">
          <span class="landing__stat-number">10</span>
          <span class="landing__stat-label">Free Tools</span>
        </div>
        <div class="landing__stat">
          <span class="landing__stat-number">${TOOLS.filter(t => t.isPro).length}</span>
          <span class="landing__stat-label">Pro Tools</span>
        </div>
        <div class="landing__stat">
          <span class="landing__stat-number">3</span>
          <span class="landing__stat-label">Output Formats</span>
        </div>
        <div class="landing__stat">
          <span class="landing__stat-number">0</span>
          <span class="landing__stat-label">Data Collected</span>
        </div>
      </div>

      <div class="landing__tools-grid">
        ${TOOLS.map(tool => `
          <div class="landing__tool-card" data-tool-id="${tool.id}">
            <div class="landing__tool-card-icon">${tool.icon}</div>
            <div class="landing__tool-card-name">${tool.name}</div>
            <div class="landing__tool-card-desc">${tool.shortDesc || tool.description}</div>
            ${tool.isPro ? '<span class="sidebar__tool-badge">PRO</span>' : ''}
            ${tool.isNew ? '<span class="sidebar__tool-badge">NEW</span>' : ''}
          </div>
        `).join('')}
      </div>

      <div class="landing__features">
        <div class="landing__feature">
          <div class="landing__feature-icon">⚡</div>
          <h3 class="landing__feature-title">Instant Output</h3>
          <p class="landing__feature-desc">Every slider generates real CSS. Copy one line or a full component — paste it right into your project.</p>
        </div>
        <div class="landing__feature">
          <div class="landing__feature-icon">🔒</div>
          <h3 class="landing__feature-title">Zero Data Collection</h3>
          <p class="landing__feature-desc">Everything runs locally in your browser. No accounts, no tracking, no server calls. Your CSS stays yours.</p>
        </div>
        <div class="landing__feature">
          <div class="landing__feature-icon">⌨️</div>
          <h3 class="landing__feature-title">Power-User Ready</h3>
          <p class="landing__feature-desc">Keyboard shortcuts (/ to search, Ctrl+S to download, arrow keys to switch tools), share links, and format tabs.</p>
        </div>
        <div class="landing__feature">
          <div class="landing__feature-icon">🎨</div>
          <h3 class="landing__feature-title">Framework Agnostic</h3>
          <p class="landing__feature-desc">Output as CSS, SCSS, or Tailwind. Works with React, Vue, Svelte, vanilla HTML — anything that uses CSS.</p>
        </div>
      </div>

      <div class="landing__bottom-cta">
        <h2 class="landing__bottom-title">Ready to build <span class="landing__title-accent">faster</span>?</h2>
        <p class="landing__bottom-desc">Join developers who use FreeReign to ship CSS in seconds, not minutes.</p>
        <button class="landing__cta landing__cta--primary" id="cta-explore-bottom">Start Building →</button>
      <div class="landing__compare">
          <h2 class="landing__compare-title">Free vs <span class="landing__title-accent">Pro</span></h2>
          <div class="landing__compare-table">
            <div class="landing__compare-row landing__compare-row--header">
              <span></span><span>Free</span><span>Pro</span>
            </div>
            <div class="landing__compare-row">
              <span>CSS generators</span><span>10 tools</span><span>25 tools</span>
            </div>
            <div class="landing__compare-row">
              <span>Output formats</span><span>CSS only</span><span>CSS, SCSS, Tailwind</span>
            </div>
            <div class="landing__compare-row">
              <span>Code watermark</span><span>Included</span><span>Clean output</span>
            </div>
            <div class="landing__compare-row">
              <span>Save presets</span><span>—</span><span>✓</span>
            </div>
            <div class="landing__compare-row">
              <span>Lifetime updates</span><span>—</span><span>✓</span>
            </div>
            <div class="landing__compare-row landing__compare-row--price">
              <span></span><span>$0</span><span>$14.99 <small>one-time</small></span>
            </div>
          </div>
          <button class="landing__cta landing__cta--secondary" id="cta-pro-compare" style="margin-top: 20px;">★ Upgrade to Pro</button>
        </div>
      </div>
    </div>
    <div class="landing__footer">
      <span>© ${new Date().getFullYear()} FreeReign</span>
      <span>·</span>
      <a href="/terms" class="landing__footer-link">Terms</a>
      <a href="/privacy" class="landing__footer-link">Privacy</a>
      <a href="/refund" class="landing__footer-link">Refund</a>
    </div>
  `;

  // Bind landing events
  document.querySelectorAll('.landing__tool-card').forEach(card => {
    card.addEventListener('click', () => {
      navigateTo(card.dataset.toolId);
    });
  });

  const ctaExplore = document.getElementById('cta-explore');
  if (ctaExplore) {
    ctaExplore.addEventListener('click', () => {
      navigateTo(TOOLS[0].id);
    });
  }

  const ctaPro = document.getElementById('cta-pro');
  if (ctaPro) {
    ctaPro.addEventListener('click', () => showProModal());
  }

  const ctaBottom = document.getElementById('cta-explore-bottom');
  if (ctaBottom) {
    ctaBottom.addEventListener('click', () => navigateTo(TOOLS[0].id));
  }

  // Pro comparison CTA
  const ctaProCompare = document.getElementById('cta-pro-compare');
  if (ctaProCompare) {
    ctaProCompare.addEventListener('click', () => showProModal());
  }
}

// === Global Events ===
function bindGlobalEvents() {
  // Sidebar toggle (mobile)
  sidebarToggle.addEventListener('click', () => {
    sidebarEl.classList.toggle('open');
  });

  sidebarOverlay.addEventListener('click', () => {
    sidebarEl.classList.remove('open');
  });

  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);

  // Search
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.sidebar__tool-btn').forEach(btn => {
      const name = btn.querySelector('.sidebar__tool-name').textContent.toLowerCase();
      btn.style.display = name.includes(query) ? '' : 'none';
    });
  });

  // Keyboard shortcut for search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
    if (e.key === 'Escape') {
      searchInput.blur();
      searchInput.value = '';
      document.querySelectorAll('.sidebar__tool-btn').forEach(btn => {
        btn.style.display = '';
      });
      sidebarEl.classList.remove('open');
      proModalOverlay.classList.remove('visible');
    }

    // Arrow key navigation between tools
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && document.activeElement === document.body) {
      if (!currentTool) return;
      const idx = TOOLS.findIndex(t => t.id === currentTool.id);
      if (idx === -1) return;
      const next = e.key === 'ArrowRight' ? idx + 1 : idx - 1;
      if (next >= 0 && next < TOOLS.length) {
        navigateTo(TOOLS[next].id);
      }
    }

    // Ctrl+S to download CSS
    if (e.key === 's' && (e.ctrlKey || e.metaKey) && currentTool) {
      e.preventDefault();
      const codeEl = document.getElementById('code-output');
      if (codeEl) {
        const code = codeEl.textContent;
        const blob = new Blob([code], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentTool.id}.css`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('CSS file downloaded!', 'success');
      }
    }

    // Ctrl+Shift+C to copy code
    if (e.key === 'C' && e.shiftKey && (e.ctrlKey || e.metaKey) && currentTool) {
      e.preventDefault();
      const codeEl = document.getElementById('code-output');
      if (codeEl) {
        navigator.clipboard.writeText(codeEl.textContent).then(() => {
          showToast('Code copied!', 'success');
        });
      }
    }
  });

  // Pro modal
  proBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showProModal();
  });

  sidebarProBtn.addEventListener('click', () => showProModal());

  proModalClose.addEventListener('click', () => {
    proModalOverlay.classList.remove('visible');
  });

  proModalOverlay.addEventListener('click', (e) => {
    if (e.target === proModalOverlay) {
      proModalOverlay.classList.remove('visible');
    }
  });

  proBuyBtn.addEventListener('click', () => {
    analytics.trackProClick();
  });

  // Listen for Lemon Squeezy checkout success
  window.addEventListener('message', (event) => {
    if (event.data && event.data.event === 'Checkout.Success') {
      // Activate Pro license
      localStorage.setItem('fr_pro', 'true');
      localStorage.setItem('fr_pro_order', JSON.stringify(event.data.data));
      isPro = true;
      document.body.classList.add('is-pro');
      proModalOverlay.classList.remove('visible');
      renderSidebar();
      showToast('🎉 Welcome to FreeReign Pro! All tools unlocked.', 'success');
      analytics.track('pro_purchase', { orderId: event.data?.data?.order?.id });
    }
  });

  // Logo -> landing
  logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    renderLanding();
  });

  // Hash change
  window.addEventListener('hashchange', handleRouting);
}

// === Pro Modal ===
function showProModal() {
  analytics.trackProClick();
  proModalOverlay.classList.add('visible');
}

// === Toast System ===
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}

// Make toast available globally for tools
window.__showToast = showToast;

// === Boot ===
init();

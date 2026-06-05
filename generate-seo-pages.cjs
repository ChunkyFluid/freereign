/**
 * generate-seo-pages.js
 * Generates static HTML landing pages for each tool to enable Google indexing.
 * Run: node generate-seo-pages.js
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://freereign.dev';

const tools = [
  {
    id: 'gradient',
    name: 'CSS Gradient Generator',
    icon: '🎨',
    headline: 'Create Beautiful CSS Gradients — Instantly',
    description: 'Generate linear, radial, and conic CSS gradients with visual controls. Pick colors, adjust angles, add color stops, and copy production-ready CSS, SCSS, or Tailwind code in seconds.',
    keywords: 'css gradient generator, gradient maker, linear gradient, radial gradient, conic gradient, css gradient tool, tailwind gradient',
    features: [
      'Linear, radial, and conic gradient types',
      'Multiple color stops with position control',
      'Angle adjustment with visual preview',
      'One-click copy in CSS, SCSS, or Tailwind',
      'Dark and light theme preview',
    ],
    useCases: 'hero backgrounds, buttons, cards, text overlays, decorative sections',
  },
  {
    id: 'boxshadow',
    name: 'CSS Box Shadow Generator',
    icon: '🌑',
    headline: 'Design Perfect CSS Box Shadows',
    description: 'Build multi-layer box shadows with visual sliders for offset, blur, spread, color, and opacity. Preview in real time and export production-ready CSS code.',
    keywords: 'css box shadow generator, box shadow maker, css shadow tool, drop shadow css, multi-layer shadow',
    features: [
      'Horizontal and vertical offset control',
      'Blur and spread radius sliders',
      'Color picker with opacity',
      'Inset shadow toggle',
      'Live preview on a card element',
    ],
    useCases: 'cards, modals, buttons, navigation bars, elevated UI elements',
  },
  {
    id: 'borderradius',
    name: 'CSS Border Radius Generator',
    icon: '⬜',
    headline: 'Customize CSS Border Radius — Per Corner',
    description: 'Control each corner\'s border radius independently. Create pills, circles, organic shapes, and asymmetric rounded corners with instant CSS output.',
    keywords: 'css border radius generator, rounded corners css, border radius tool, per corner radius',
    features: [
      'Individual control for all 4 corners',
      'Link/unlink corners toggle',
      'Pixel and percentage unit support',
      'Preset shapes (pill, circle, blob)',
      'Live preview with adjustable element',
    ],
    useCases: 'buttons, avatars, cards, image masks, decorative shapes',
  },
  {
    id: 'colorpalette',
    name: 'CSS Color Palette Generator',
    icon: '🎯',
    headline: 'Generate Harmonious Color Palettes',
    description: 'Create beautiful, accessible color palettes using color theory. Choose from 6 harmony modes — analogous, complementary, triadic, split-complementary, tetradic, and monochromatic.',
    keywords: 'css color palette generator, color scheme generator, complementary colors, analogous colors, color harmony tool',
    features: [
      '6 color harmony algorithms',
      'Base color with hue wheel',
      'Exportable hex, HSL, and RGB values',
      'Live preview of color combinations',
      'Copy individual colors or full palette',
    ],
    useCases: 'branding, web design, UI design, data visualization, theming',
  },
  {
    id: 'glassmorphism',
    name: 'CSS Glassmorphism Generator',
    icon: '💎',
    headline: 'Create Stunning Frosted Glass Effects',
    description: 'Generate glassmorphism CSS with backdrop-filter blur, saturation, transparency, and border effects. Preview on vivid backgrounds and copy production-ready code.',
    keywords: 'glassmorphism generator, css glass effect, frosted glass css, backdrop blur css, glassmorphism tool',
    features: [
      'Backdrop blur intensity control',
      'Saturation and brightness adjustment',
      'Background opacity slider',
      'Border and shadow customization',
      'Preview on colorful background',
    ],
    useCases: 'cards, modals, navigation, overlay panels, login forms',
    guide: { url: '/blog/how-to-create-glassmorphism-css', title: 'How to Create Glassmorphism in CSS — full guide' },
  },
  {
    id: 'variables',
    name: 'CSS Variables Generator',
    icon: '🏷️',
    headline: 'Build a Complete CSS Custom Properties System',
    description: 'Generate a full CSS custom properties (CSS variables) system from two base colors. Includes auto-generated color scales, spacing tokens, typography scale, border radius, and shadow tokens.',
    keywords: 'css variables generator, css custom properties, design tokens, css color scale, spacing system css',
    features: [
      'Auto-generated 10-shade color scales',
      'Spacing token system from base unit',
      'Typography scale with 8 sizes',
      'Border radius token set',
      'Shadow token collection',
    ],
    useCases: 'design systems, component libraries, theming, dark mode, white-labeling',
    isPro: true,
  },
  {
    id: 'flexbox',
    name: 'CSS Flexbox Playground',
    icon: '📐',
    headline: 'Visual CSS Flexbox Layout Builder',
    description: 'Build flexbox layouts visually with controls for direction, wrap, justify, align, and gap. See items respond in real time and copy the CSS for your layout.',
    keywords: 'css flexbox generator, flexbox playground, flexbox layout builder, flex direction, justify content, align items',
    features: [
      'All flex container properties',
      'Direction, wrap, and flow controls',
      'Justify and align with visual feedback',
      'Gap control for spacing',
      'Multiple child items with sizing',
    ],
    useCases: 'navigation bars, card grids, sidebars, centering, responsive layouts',
  },
  {
    id: 'grid',
    name: 'CSS Grid Generator',
    icon: '🔲',
    headline: 'Build CSS Grid Layouts Visually',
    description: 'Design CSS Grid layouts with interactive controls for columns, rows, gaps, and template areas. See grid lines and items update in real time.',
    keywords: 'css grid generator, grid layout builder, css grid tool, grid template columns, grid template rows',
    features: [
      'Column and row template controls',
      'Gap and padding adjustment',
      'Visual grid line display',
      'Auto-fit and auto-fill modes',
      'Responsive grid patterns',
    ],
    useCases: 'page layouts, dashboards, galleries, magazine layouts, card grids',
  },
  {
    id: 'breakpoint',
    name: 'CSS Breakpoint Tester',
    icon: '📏',
    headline: 'Test Responsive Breakpoints Across Devices',
    description: 'Preview your responsive designs at standard breakpoints. Test mobile, tablet, laptop, and desktop viewports with 9 device presets.',
    keywords: 'css breakpoint tester, responsive design tool, media query tester, viewport tester, device preview',
    features: [
      '9 standard device presets',
      'Custom width and height input',
      'Mobile, tablet, laptop, desktop',
      'Landscape and portrait modes',
      'URL-based iframe preview',
    ],
    useCases: 'responsive testing, QA, design review, client presentations',
    isPro: true,
  },
  {
    id: 'aspectratio',
    name: 'CSS Aspect Ratio Calculator',
    icon: '📐',
    headline: 'Calculate and Generate CSS Aspect Ratios',
    description: 'Generate CSS aspect-ratio properties with 9 common presets (16:9, 4:3, 1:1, etc.). Perfect for responsive images, videos, and embed containers.',
    keywords: 'css aspect ratio, aspect ratio calculator, responsive aspect ratio, 16:9 css, image aspect ratio',
    features: [
      '9 preset ratios (16:9, 4:3, 1:1, etc.)',
      'Custom width and height inputs',
      'Container width percentage control',
      'Object-fit property selector',
      'Visual preview with live updates',
    ],
    useCases: 'video embeds, image containers, responsive cards, hero sections',
    isPro: true,
  },
  {
    id: 'scrollsnap',
    name: 'CSS Scroll Snap Generator',
    icon: '📜',
    headline: 'Build Smooth CSS Scroll Snap Containers',
    description: 'Generate CSS scroll-snap properties for carousels, galleries, and scrollable sections. Control snap type, alignment, direction, and spacing.',
    keywords: 'css scroll snap generator, scroll snap container, snap type css, carousel css, scroll snap align',
    features: [
      'Horizontal, vertical, and both directions',
      'Mandatory and proximity snap types',
      'Start, center, and end alignment',
      'Gap and padding controls',
      'Interactive scroll preview',
    ],
    useCases: 'carousels, image galleries, onboarding flows, slide decks',
    isPro: true,
  },
  {
    id: 'animation',
    name: 'CSS Animation Builder',
    icon: '✨',
    headline: 'Create CSS Keyframe Animations Visually',
    description: 'Build CSS animations with 6 presets (fade, slide, bounce, spin, pulse, shake). Control duration, timing function, delay, and iteration count.',
    keywords: 'css animation generator, keyframe animation builder, css animation tool, bounce animation, fade in css',
    features: [
      '6 animation presets',
      'Duration and delay controls',
      'Timing function selector',
      'Iteration count and direction',
      'Live preview with play/pause',
    ],
    useCases: 'loading spinners, entrance effects, hover animations, attention grabbers',
  },
  {
    id: 'textshadow',
    name: 'CSS Text Shadow Generator',
    icon: '💬',
    headline: 'Design Beautiful CSS Text Shadow Effects',
    description: 'Create multi-layer text shadow effects with controls for offset, blur, and color. Preview on custom text with adjustable typography.',
    keywords: 'css text shadow generator, text shadow tool, text glow effect, neon text css, 3d text shadow',
    features: [
      'X and Y offset sliders',
      'Blur radius control',
      'Color picker with opacity',
      'Custom preview text input',
      'Font size and weight control',
    ],
    useCases: 'headings, hero text, logos, decorative typography, neon effects',
  },
  {
    id: 'transform',
    name: 'CSS Transform Generator',
    icon: '🔄',
    headline: '3D CSS Transform Tool with Perspective',
    description: 'Manipulate CSS transforms visually — rotate, scale, translate, and skew in 2D and 3D. Includes perspective control for depth effects.',
    keywords: 'css transform generator, css rotate, css scale, css translate, css skew, 3d transform css, perspective css',
    features: [
      'Rotate X, Y, Z axes',
      'Scale, translate, and skew',
      'Perspective depth control',
      '3D transform preview',
      'Combined transform output',
    ],
    useCases: 'card flips, hover effects, parallax elements, 3D UI, interactive elements',
    isPro: true,
  },
  {
    id: 'transition',
    name: 'CSS Transition Generator',
    icon: '🔀',
    headline: 'Design Smooth CSS Transitions with Visual Easing',
    description: 'Build CSS transitions with 11 easing presets including cubic-bezier curves. Preview timing, duration, delay, and property targeting in real time.',
    keywords: 'css transition generator, easing function, cubic bezier, css transition tool, timing function css',
    features: [
      '11 easing function presets',
      'Custom cubic-bezier support',
      'Duration and delay sliders',
      'Property targeting selector',
      'Interactive trigger preview',
    ],
    useCases: 'button hovers, page transitions, smooth scroll, menu animations, state changes',
    isPro: true,
  },
  {
    id: 'neumorphism',
    name: 'CSS Neumorphism Generator',
    icon: '🧊',
    headline: 'Create Soft UI / Neumorphic CSS Effects',
    description: 'Generate neumorphic (soft UI) designs with flat, concave, convex, and pressed states. Control shadow intensity, blur, and surface color.',
    keywords: 'neumorphism generator, soft ui css, neumorphic design, css neumorphism, soft shadow css',
    features: [
      '4 neumorphic states',
      'Shadow intensity and blur',
      'Surface color customization',
      'Light source direction',
      'Flat, concave, convex, pressed',
    ],
    useCases: 'buttons, cards, toggles, inputs, dashboard widgets',
  },
  {
    id: 'clippath',
    name: 'CSS Clip-Path Generator',
    icon: '✂️',
    headline: 'Generate CSS Clip-Path Shapes',
    description: 'Create CSS clip-path shapes from 16 presets including polygons, circles, ellipses, and custom paths. Visual editor with instant code output.',
    keywords: 'css clip path generator, clip path shapes, polygon css, css mask, css shape tool',
    features: [
      '16 shape presets',
      'Circle and ellipse modes',
      'Custom polygon support',
      'Inset with round corners',
      'Visual shape preview',
    ],
    useCases: 'hero sections, image masks, decorative dividers, creative layouts',
    isPro: true,
    guide: { url: '/blog/css-clip-path-guide', title: 'CSS clip-path: the complete guide' },
  },
  {
    id: 'filter',
    name: 'CSS Filter Generator',
    icon: '🔮',
    headline: 'Build CSS Filter Chains Visually',
    description: 'Combine 9 CSS filter properties — blur, brightness, contrast, grayscale, hue-rotate, invert, saturate, sepia, and drop-shadow — into a single filter chain.',
    keywords: 'css filter generator, css blur, css grayscale, css sepia, filter chain css, image filter css',
    features: [
      '9 filter properties',
      'Chain multiple filters',
      'Visual before/after preview',
      'Drop shadow with filter',
      'Reset individual filters',
    ],
    useCases: 'image effects, hover states, disabled states, artistic filters, overlays',
    isPro: true,
  },
  {
    id: 'cursor',
    name: 'CSS Cursor Styles Reference',
    icon: '🖱️',
    headline: 'All 35 CSS Cursor Values — Visual Reference',
    description: 'Preview and test all CSS cursor property values in one place. Click any cursor style to see it in action and copy the CSS code instantly.',
    keywords: 'css cursor property, cursor styles css, all css cursors, cursor pointer, cursor not-allowed, css cursor values',
    features: [
      'All 35 standard cursor values',
      'Live hover preview area',
      'Click to select and copy',
      'Categorized by type',
      'Instant CSS output',
    ],
    useCases: 'interactive elements, drag handles, resize areas, disabled states, custom UX',
    isPro: true,
  },
  {
    id: 'typography',
    name: 'CSS Typography Scale Generator',
    icon: '🔤',
    headline: 'Build a Perfect Typographic Scale',
    description: 'Generate a harmonious typography scale using modular ratios. Choose from 8 classic ratios (Minor Third, Perfect Fourth, Golden Ratio, etc.) and export as CSS custom properties.',
    keywords: 'typography scale generator, modular scale, type scale css, font size scale, typographic hierarchy',
    features: [
      '8 modular ratio presets',
      'Base size and scale step controls',
      'CSS custom property output',
      'Visual hierarchy preview',
      'Font family and weight customization',
    ],
    useCases: 'design systems, editorial design, responsive typography, component libraries',
    isPro: true,
  },
  {
    id: 'containerquery',
    name: 'CSS Container Query Generator',
    icon: '📦',
    headline: 'Generate CSS Container Queries Visually',
    description: 'Build CSS container queries with a visual editor. Define container types, set size conditions, and preview responsive component behavior within containers.',
    keywords: 'css container query generator, container query builder, responsive components, container size query',
    features: [
      'Container type and name setup',
      'Min-width and max-width conditions',
      'Visual container resize preview',
      'Nested container support',
      'Modern CSS syntax output',
    ],
    useCases: 'responsive components, design systems, widget libraries, reusable cards',
    isPro: true,
  },
  {
    id: 'gradienttext',
    name: 'CSS Gradient Text Generator',
    icon: '✨',
    headline: 'Create Stunning CSS Gradient Text Effects',
    description: 'Apply gradient colors to text using background-clip. Choose direction, colors, and see live preview on editable text. Export production-ready CSS.',
    keywords: 'css gradient text, gradient text effect, background-clip text, colorful text css, text gradient generator',
    features: [
      'Multi-color gradient text',
      'Direction and angle control',
      'Editable preview text',
      'Font size and weight controls',
      'Cross-browser compatible output',
    ],
    useCases: 'hero headings, logos, CTAs, marketing pages, creative typography',
    isPro: true,
  },
  {
    id: 'fluidtype',
    name: 'CSS Fluid Typography Generator',
    icon: '📏',
    headline: 'Generate Responsive Font Sizes with CSS clamp()',
    description: 'Create a complete responsive typography scale using CSS clamp(). Set min/max sizes, viewport breakpoints, and scale ratio. Get production-ready fluid type tokens.',
    keywords: 'css clamp font size, fluid typography, responsive font size, css clamp generator, fluid type scale',
    features: [
      'CSS clamp() based responsive sizing',
      'Multiple scale ratios (Minor Third to Golden Ratio)',
      'Min/max viewport range controls',
      'Full type scale with CSS custom properties',
      'Tailwind config output',
    ],
    useCases: 'design systems, responsive typography, fluid layouts, mobile-first design',
    isPro: true,
  },
  {
    id: 'scrollbar',
    name: 'CSS Custom Scrollbar Generator',
    icon: '📜',
    headline: 'Design Custom CSS Scrollbars',
    description: 'Style webkit scrollbars with visual controls for width, track color, thumb color, radius, borders, and hover effects. Outputs both webkit and Firefox syntax.',
    keywords: 'css scrollbar generator, custom scrollbar css, webkit scrollbar, scrollbar-color, scrollbar styling',
    features: [
      'Webkit scrollbar track and thumb styling',
      'Firefox scrollbar-color support',
      'Border and radius controls',
      'Hover state customization',
      'Live scroll preview',
    ],
    useCases: 'sidebars, code editors, chat windows, dashboards, custom UI',
    isPro: true,
  },
  {
    id: 'mediaquery',
    name: 'CSS Media Query Builder',
    icon: '📱',
    headline: 'Build Responsive @media Queries Visually',
    description: 'Build CSS media queries with a visual builder. Combine width, orientation, color-scheme, hover, and reduced-motion conditions. Supports modern range syntax and legacy syntax.',
    keywords: 'css media query builder, responsive design, media query generator, breakpoint builder, min-width max-width',
    features: [
      'Min-width, max-width, and range modes',
      'Modern range syntax and legacy syntax toggle',
      'Compound condition combinator',
      'Visual breakpoint range indicator',
      'Tailwind screens config output',
    ],
    useCases: 'responsive design, mobile-first development, accessibility, dark mode detection',
    isPro: true,
  },
];

function generatePage(tool) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tool.name} — ${tool.isPro ? 'Pro Tool' : 'Free Online Tool'} | FreeReign</title>
  <meta name="description" content="${tool.description}">
  <meta name="keywords" content="${tool.keywords}">
  <link rel="canonical" href="${BASE_URL}/tools/${tool.id}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">

  <!-- Open Graph -->
  <meta property="og:title" content="${tool.name} — ${tool.isPro ? 'Pro Tool' : 'Free Online Tool'} | FreeReign">
  <meta property="og:description" content="${tool.description}">
  <meta property="og:image" content="${BASE_URL}/og-image.png">
  <meta property="og:url" content="${BASE_URL}/tools/${tool.id}">
  <meta property="og:type" content="website">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${tool.name} — FreeReign">
  <meta name="twitter:description" content="${tool.description}">
  <meta name="twitter:image" content="${BASE_URL}/og-image.png">

  <!-- JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "${tool.name}",
    "description": "${tool.description}",
    "url": "${BASE_URL}/tools/${tool.id}",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "creator": { "@type": "Organization", "name": "FreeReign" }
  }
  </script>

  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0f0f14; --bg-surface: #16161d; --bg-elevated: #1e1e28;
      --text: #e8e6f0; --text-secondary: #9896a8; --text-tertiary: #6b6980;
      --accent: #8b5cf6; --accent-secondary: #06b6d4;
      --border: rgba(255,255,255,0.08);
      --radius: 12px;
    }
    body {
      font-family: 'Inter', system-ui, sans-serif; background: var(--bg);
      color: var(--text); min-height: 100vh; line-height: 1.6;
    }
    .container { max-width: 760px; margin: 0 auto; padding: 48px 24px; }
    .breadcrumb { font-size: 0.8rem; color: var(--text-tertiary); margin-bottom: 32px; }
    .breadcrumb a { color: var(--accent); text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }
    .hero { text-align: center; margin-bottom: 48px; }
    .hero__icon { font-size: 3.5rem; margin-bottom: 16px; display: block; }
    .hero__title { font-size: 2.2rem; font-weight: 800; line-height: 1.2; margin-bottom: 12px;
      background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
      -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
    .hero__desc { font-size: 1.05rem; color: var(--text-secondary); max-width: 560px; margin: 0 auto 24px; }
    .cta-btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 32px; border-radius: var(--radius); font-size: 1rem; font-weight: 700;
      background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
      color: white; text-decoration: none; transition: transform 200ms, box-shadow 200ms;
      box-shadow: 0 4px 20px rgba(139,92,246,0.3);
    }
    .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(139,92,246,0.4); }
    .section { margin-bottom: 40px; }
    .section__title { font-size: 1.3rem; font-weight: 700; margin-bottom: 16px; }
    .features { list-style: none; display: grid; gap: 12px; }
    .features li {
      display: flex; align-items: flex-start; gap: 12px; padding: 14px 18px;
      background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius);
      font-size: 0.9rem;
    }
    .features li::before { content: '✓'; color: var(--accent); font-weight: 700; flex-shrink: 0; }
    .use-cases { font-size: 0.95rem; color: var(--text-secondary); }
    .formats {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 8px;
    }
    .format-card {
      text-align: center; padding: 18px 12px; background: var(--bg-surface);
      border: 1px solid var(--border); border-radius: var(--radius);
    }
    .format-card strong { display: block; margin-bottom: 4px; font-size: 0.95rem; }
    .format-card span { font-size: 0.75rem; color: var(--text-tertiary); }
    .related { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .related a {
      display: flex; align-items: center; gap: 10px; padding: 14px 16px;
      background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius);
      color: var(--text); text-decoration: none; font-size: 0.9rem; font-weight: 500;
      transition: border-color 200ms;
    }
    .related a:hover { border-color: var(--accent); }
    .related a span:first-child { font-size: 1.3rem; }
    .bottom-cta {
      text-align: center; padding: 48px 24px; margin-top: 32px;
      background: var(--bg-surface); border-radius: var(--radius); border: 1px solid var(--border);
    }
    .bottom-cta h2 { font-size: 1.5rem; margin-bottom: 8px; }
    .bottom-cta p { color: var(--text-secondary); margin-bottom: 20px; }
    footer { text-align: center; padding: 32px; font-size: 0.8rem; color: var(--text-tertiary); }
    footer a { color: var(--accent); text-decoration: none; }
    @media (max-width: 600px) {
      .hero__title { font-size: 1.6rem; }
      .formats { grid-template-columns: 1fr; }
      .related { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <nav class="breadcrumb">
      <a href="${BASE_URL}">FreeReign</a> / <a href="${BASE_URL}/#${tool.id}">${tool.name}</a>
    </nav>

    <header class="hero">
      <span class="hero__icon">${tool.icon}</span>
      <h1 class="hero__title">${tool.headline}</h1>
      <p class="hero__desc">${tool.description}</p>
      <a href="${BASE_URL}/#${tool.id}" class="cta-btn">
        Open ${tool.name} →
      </a>
    </header>

    <section class="section">
      <h2 class="section__title">Features</h2>
      <ul class="features">
        ${tool.features.map(f => `<li>${f}</li>`).join('\n        ')}
      </ul>
    </section>

    ${tool.guide ? `<section class="section">
      <h2 class="section__title">Learn</h2>
      <div class="related">
        <a href="${BASE_URL}${tool.guide.url}"><span>📖</span> ${tool.guide.title} →</a>
      </div>
    </section>

    ` : ''}<section class="section">
      <h2 class="section__title">Output Formats</h2>
      <div class="formats">
        <div class="format-card"><strong>CSS</strong><span>Standard properties</span></div>
        <div class="format-card"><strong>SCSS</strong><span>Variables & nesting</span></div>
        <div class="format-card"><strong>Tailwind</strong><span>Utility classes</span></div>
      </div>
    </section>

    <section class="section">
      <h2 class="section__title">Common Use Cases</h2>
      <p class="use-cases">Perfect for ${tool.useCases}.</p>
    </section>

    <section class="section">
      <h2 class="section__title">More CSS Tools</h2>
      <div class="related" id="related-tools"></div>
    </section>

    <div class="bottom-cta">
      <h2>Start Designing</h2>
      <p>25 CSS generators. 10 free, 15 Pro. Instant code.</p>
      <a href="${BASE_URL}/#${tool.id}" class="cta-btn">Open ${tool.name} →</a>
    </div>
  </div>

  <footer>
    <p>Made with ◆ by <a href="${BASE_URL}">FreeReign</a> · 25 CSS generators · <a href="https://github.com/ChunkyFluid/freereign">GitHub</a></p>
  </footer>

  <script>
    // Populate related tools (4 random from other tools)
    const allTools = ${JSON.stringify(tools.filter(t => t.id !== tool.id).map(t => ({ id: t.id, name: t.name, icon: t.icon })))};
    const shuffled = allTools.sort(() => 0.5 - Math.random()).slice(0, 4);
    document.getElementById('related-tools').innerHTML = shuffled.map(t =>
      \`<a href="/tools/\${t.id}"><span>\${t.icon}</span> \${t.name}</a>\`
    ).join('');
  </script>
</body>
</html>`;
}

// Generate pages
const outputDir = path.join(__dirname, 'public', 'tools');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

tools.forEach(tool => {
  const html = generatePage(tool);
  const filePath = path.join(outputDir, `${tool.id}.html`);
  fs.writeFileSync(filePath, html);
  console.log(`  ✓ /tools/${tool.id}.html`);
});

// Generate index page listing all tools
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>All CSS Generator Tools — Free Online | FreeReign</title>
  <meta name="description" content="25 CSS generators in one toolkit. 10 free, 15 Pro. Gradients, shadows, glassmorphism, flexbox, grid, animations, and more.">
  <link rel="canonical" href="${BASE_URL}/tools/">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta property="og:title" content="25 CSS Generator Tools — FreeReign">
  <meta property="og:description" content="CSS toolkit with 25 visual generators. 10 free, 15 Pro.">
  <meta property="og:image" content="${BASE_URL}/og-image.png">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0f0f14; --bg-surface: #16161d; --bg-elevated: #1e1e28;
      --text: #e8e6f0; --text-secondary: #9896a8; --text-tertiary: #6b6980;
      --accent: #8b5cf6; --accent-secondary: #06b6d4;
      --border: rgba(255,255,255,0.08); --radius: 12px;
    }
    body { font-family: 'Inter', system-ui, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 860px; margin: 0 auto; padding: 48px 24px; }
    h1 { font-size: 2.2rem; font-weight: 800; text-align: center; margin-bottom: 8px;
      background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
      -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { text-align: center; color: var(--text-secondary); margin-bottom: 40px; font-size: 1.05rem; }
    .tools-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
    .tool-card {
      padding: 20px; background: var(--bg-surface); border: 1px solid var(--border);
      border-radius: var(--radius); text-decoration: none; color: var(--text);
      transition: border-color 200ms, transform 200ms;
    }
    .tool-card:hover { border-color: var(--accent); transform: translateY(-2px); }
    .tool-card__icon { font-size: 1.8rem; margin-bottom: 8px; display: block; }
    .tool-card__name { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
    .tool-card__desc { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; }
    footer { text-align: center; padding: 32px; font-size: 0.8rem; color: var(--text-tertiary); }
    footer a { color: var(--accent); text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <h1>25 CSS Generator Tools</h1>
    <p class="subtitle">10 free tools, 15 Pro tools. Pick a tool and start designing.</p>
    <div class="tools-grid">
      ${tools.map(t => `
      <a href="/tools/${t.id}" class="tool-card">
        <span class="tool-card__icon">${t.icon}</span>
        <div class="tool-card__name">${t.name}</div>
        <div class="tool-card__desc">${t.description.slice(0, 100)}...</div>
      </a>`).join('')}
    </div>
  </div>
  <footer>
    <p>Made with ◆ by <a href="${BASE_URL}">FreeReign</a> · <a href="https://github.com/ChunkyFluid/freereign">GitHub</a></p>
  </footer>
</body>
</html>`;

fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);
console.log(`  ✓ /tools/index.html (directory listing)`);
console.log(`\n✅ Generated ${tools.length + 1} SEO pages in public/tools/`);

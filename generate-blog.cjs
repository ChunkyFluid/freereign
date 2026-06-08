/**
 * generate-blog.cjs
 * Renders SEO blog articles from body partials in blog-src/ + the config below
 * into public/blog/<slug>.html. Handles the shared <head>, styling, Article +
 * FAQPage JSON-LD, breadcrumb, FAQ section, related tools, CTA, and footer so
 * each new article is just a body partial + a config entry.
 *
 * Run: npm run blog   (then `npm run build` copies public/ into dist/)
 */
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://freereign.dev';
const TODAY = '2026-06-05';

const SHARED_CSS = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0f0f14; --bg-surface: #16161d; --bg-elevated: #1e1e28;
      --text: #e8e6f0; --text-secondary: #9896a8; --text-tertiary: #6b6980;
      --accent: #8b5cf6; --accent-secondary: #06b6d4;
      --border: rgba(255,255,255,0.08); --radius: 12px;
    }
    body { font-family: 'Inter', system-ui, sans-serif; background: var(--bg); color: var(--text); line-height: 1.7; }
    .container { max-width: 760px; margin: 0 auto; padding: 48px 24px; }
    .breadcrumb { font-size: 0.8rem; color: var(--text-tertiary); margin-bottom: 28px; }
    .breadcrumb a { color: var(--accent); text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }
    h1 { font-size: 2.2rem; font-weight: 800; line-height: 1.2; margin-bottom: 14px;
      background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
      -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
    .lede { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 32px; }
    h2 { font-size: 1.4rem; font-weight: 700; margin: 40px 0 14px; }
    h3 { font-size: 1.05rem; font-weight: 700; margin: 24px 0 10px; }
    p { margin-bottom: 16px; }
    a { color: var(--accent); }
    ul { margin: 0 0 16px 22px; }
    li { margin-bottom: 8px; }
    code { font-family: 'JetBrains Mono', monospace; font-size: 0.85em; background: var(--bg-elevated);
      padding: 2px 6px; border-radius: 5px; color: #c4b5fd; }
    pre { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius);
      padding: 18px; overflow-x: auto; margin-bottom: 20px; }
    pre code { background: none; padding: 0; color: var(--text); font-size: 0.82rem; line-height: 1.6; }
    .demo { background: var(--bg-surface); border: 1px solid var(--border); border-radius: 16px;
      padding: 36px 24px; margin: 8px 0 28px; text-align: center; }
    .demo-note { font-size: 0.8rem; color: var(--text-tertiary); margin-top: 14px; }
    .callout { background: var(--bg-surface); border: 1px solid var(--border); border-left: 3px solid var(--accent);
      border-radius: var(--radius); padding: 16px 18px; margin-bottom: 20px; font-size: 0.92rem; color: var(--text-secondary); }
    .cta-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 30px; border-radius: var(--radius);
      font-size: 1rem; font-weight: 700; background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
      color: #fff; text-decoration: none; transition: transform 200ms, box-shadow 200ms; box-shadow: 0 4px 20px rgba(139,92,246,0.3); }
    .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(139,92,246,0.4); }
    .cta-wrap { text-align: center; padding: 36px 24px; margin: 36px 0; background: var(--bg-surface);
      border: 1px solid var(--border); border-radius: var(--radius); }
    .cta-wrap h2 { margin-top: 0; }
    .related { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 12px; }
    .related a { display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: var(--bg-surface);
      border: 1px solid var(--border); border-radius: var(--radius); color: var(--text); text-decoration: none;
      font-size: 0.9rem; font-weight: 500; transition: border-color 200ms; }
    .related a:hover { border-color: var(--accent); }
    .related a span:first-child { font-size: 1.3rem; }
    footer { text-align: center; padding: 32px; font-size: 0.8rem; color: var(--text-tertiary); }
    footer a { color: var(--accent); text-decoration: none; }
    @media (max-width: 600px) { h1 { font-size: 1.7rem; } .related { grid-template-columns: 1fr; } }`;

const ARTICLES = [
  {
    slug: 'css-fluid-typography-clamp',
    title: 'CSS Fluid Typography with clamp(): The Complete Guide',
    description: 'Master fluid typography in CSS with clamp(): scale font sizes smoothly across viewports without breakpoints. The formula, an accessible recipe, a full type scale, Tailwind, and a free generator.',
    keywords: 'css fluid typography, clamp css, fluid type scale, responsive font size css, css clamp calculator, fluid font size',
    h1: 'CSS Fluid Typography with clamp()',
    lede: 'Fluid typography scales your font sizes smoothly with the viewport — no breakpoints, no jumps. It is all powered by one CSS function: <code>clamp()</code>. This guide covers the formula, the accessibility trap to avoid, and a full fluid type scale. Want the numbers solved for you? <a href="https://freereign.dev/#fluidtype">Use the free fluid typography generator →</a>',
    cta: { heading: 'Skip the math', blurb: 'Enter a min and max font size and two breakpoints — get the exact clamp() value instantly, plus a full fluid scale.', label: 'Open the Fluid Typography Generator →', toolId: 'fluidtype' },
    faqs: [
      { q: 'What is the clamp() function in CSS?', a: 'clamp(MIN, PREFERRED, MAX) returns the preferred value but never lets it drop below MIN or rise above MAX. For typography the preferred value is viewport-relative, so the font size scales fluidly between the two bounds.' },
      { q: 'Is fluid typography bad for accessibility?', a: 'Only if you use a pure viewport unit like 5vw, which ignores browser zoom. Including a rem component in the preferred value — for example 1rem + 4vw — keeps the text responsive to zoom and user font-size settings.' },
      { q: 'Do I still need media queries with clamp()?', a: 'For font sizing, usually not — clamp() interpolates every size between your min and max automatically. You may still use media queries for layout changes, but the typography scales on its own.' },
      { q: 'Is clamp() supported in all browsers?', a: 'Yes. clamp() has been supported in all modern browsers for years and needs no prefix.' },
    ],
    related: [
      { id: 'fluidtype', icon: '📐', name: 'Fluid Typography Generator' },
      { id: 'typography', icon: '🔤', name: 'Type Scale Calculator' },
      { id: 'variables', icon: '🏷️', name: 'CSS Variables Generator' },
      { id: 'breakpoint', icon: '📏', name: 'Breakpoint Tester' },
    ],
    extraCss: `
    .fluid-demo { font-weight: 800; line-height: 1; font-size: clamp(2rem, 1rem + 8vw, 6rem);
      background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
      -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }`,
  },
  {
    slug: 'css-container-queries',
    title: 'CSS Container Queries: The Complete Guide (with Examples)',
    description: 'Learn CSS container queries: make components respond to their container instead of the viewport. container-type, @container syntax, container query units (cqi/cqw), browser support, Tailwind, and a free generator.',
    keywords: 'css container queries, container query, @container css, container-type inline-size, cqi cqw units, component responsive css',
    h1: 'CSS Container Queries',
    lede: 'Container queries let a component respond to the size of <em>its own container</em> instead of the viewport — the missing piece for truly reusable, responsive components. This guide covers the setup, the new container units, browser support, and the gotchas. Prefer to build it visually? <a href="https://freereign.dev/#containerquery">Use the free container query generator →</a>',
    cta: { heading: 'Build it visually', blurb: 'Set the container type, breakpoints, and rules with live controls and copy the @container CSS in one click.', label: 'Open the Container Query Generator →', toolId: 'containerquery' },
    faqs: [
      { q: 'What is the difference between container queries and media queries?', a: 'Media queries respond to the viewport size; container queries respond to the size of a specified ancestor element. That lets the same component lay itself out differently depending on where it is placed — a wide column versus a narrow sidebar — without viewport breakpoints.' },
      { q: 'How do I set up a container query?', a: 'Give the parent container-type: inline-size (and optionally container-name), then query it from descendants with @container (min-width: 400px) { ... }. The element you want to restyle must be inside the container, not the container itself.' },
      { q: 'What are cqi and cqw units?', a: 'They are container query length units. cqw is 1% of the container width, cqh is 1% of its height, cqi is 1% of its inline size, and cqb is 1% of its block size. They size relative to the query container instead of the viewport.' },
      { q: 'Are container queries supported in browsers?', a: 'Yes. Container queries are supported in all major browsers (Chrome, Edge, Safari, Firefox) since 2023 and are safe for production.' },
    ],
    related: [
      { id: 'containerquery', icon: '📦', name: 'Container Query Generator' },
      { id: 'mediaquery', icon: '📱', name: 'Media Query Builder' },
      { id: 'grid', icon: '🔲', name: 'Grid Generator' },
      { id: 'flexbox', icon: '📐', name: 'Flexbox Playground' },
    ],
    extraCss: `
    .cq-wrap { container-type: inline-size; max-width: 420px; margin: 0 auto; resize: horizontal;
      overflow: auto; padding: 10px; border: 1px dashed var(--border); border-radius: 14px; }
    .cq-card { display: flex; flex-direction: column; gap: 12px; background: var(--bg-elevated);
      border-radius: 12px; padding: 16px; text-align: left; }
    .cq-card__img { font-size: 2.2rem; }
    .cq-card__body strong { display: block; }
    .cq-card__body span { font-size: 0.8rem; color: var(--text-secondary); }
    @container (min-width: 360px) { .cq-card { flex-direction: row; align-items: center; } }`,
  },
  {
    slug: 'css-box-shadow-guide',
    title: 'CSS box-shadow: The Complete Guide (Layers, Glow, Performance)',
    description: 'Master CSS box-shadow: the syntax, layering multiple shadows for depth, glow effects, inset shadows, performance tricks, copy-paste recipes, Tailwind, and a free generator.',
    keywords: 'css box shadow, box shadow generator, css shadow, box shadow examples, multiple box shadows, inset shadow, css shadow effects',
    h1: 'CSS box-shadow: The Complete Guide',
    lede: 'The <code>box-shadow</code> property adds depth, elevation, and glow to any element — and stacking multiple shadows is where it gets powerful. This guide covers the syntax, layered shadows, performance tricks, and gives you copy-paste recipes. Want to build them visually? <a href="https://freereign.dev/#boxshadow">Use the free box shadow generator →</a>',
    cta: { heading: 'Build shadows visually', blurb: 'Add multiple shadow layers, adjust offset, blur, spread, and color with live preview — copy the CSS in one click.', label: 'Open the Box Shadow Generator →', toolId: 'boxshadow' },
    faqs: [
      { q: 'Can you have multiple box shadows?', a: 'Yes. Comma-separate them: box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08). The first shadow renders on top. Layering 2-3 shadows creates much more realistic depth than a single shadow.' },
      { q: 'What is an inset shadow?', a: 'Adding the inset keyword makes the shadow render inside the element instead of outside. It is commonly used for pressed buttons, input fields, and inner glow effects.' },
      { q: 'Does box-shadow affect layout?', a: 'No. Shadows are purely visual and do not change the element\'s size or position in the document flow. They can overflow parent containers with overflow: hidden.' },
      { q: 'How do I animate box-shadow performantly?', a: 'Animating box-shadow directly causes repaints. The performant approach is to put the target shadow on a pseudo-element with opacity: 0 and transition the opacity instead — the browser can composite opacity changes on the GPU.' },
    ],
    related: [
      { id: 'boxshadow', icon: '🔲', name: 'Box Shadow Generator' },
      { id: 'textshadow', icon: '✏️', name: 'Text Shadow Generator' },
      { id: 'neumorphism', icon: '🔘', name: 'Neumorphism Generator' },
      { id: 'glassmorphism', icon: '🪟', name: 'Glassmorphism Generator' },
    ],
    extraCss: `
    .shadow-demo { width: 200px; height: 120px; margin: 0 auto; border-radius: 16px;
      background: var(--bg-elevated); display: flex; align-items: center; justify-content: center;
      font-weight: 700; color: var(--text);
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08), 0 12px 30px rgba(0,0,0,0.06); }`,
  },
  {
    slug: 'css-gradient-guide',
    title: 'CSS Gradients: The Complete Guide (Linear, Radial, Conic + Recipes)',
    description: 'Master CSS gradients: linear-gradient, radial-gradient, conic-gradient, color stops, repeating gradients, mesh-like layered effects, Tailwind, and a free visual generator.',
    keywords: 'css gradient, linear-gradient, radial-gradient, conic-gradient, css gradient generator, gradient background css, repeating gradient',
    h1: 'CSS Gradients: The Complete Guide',
    lede: 'CSS gradients let you create smooth color transitions without images — from simple two-color fades to complex mesh-like effects. This guide covers all three gradient functions, color stop tricks, repeating patterns, and gives you copy-paste recipes. Want to build gradients visually? <a href="https://freereign.dev/#gradient">Use the free gradient generator →</a>',
    cta: { heading: 'Build gradients visually', blurb: 'Drag color stops, adjust angles, pick from presets — get linear, radial, or conic gradient CSS instantly.', label: 'Open the Gradient Generator →', toolId: 'gradient' },
    faqs: [
      { q: 'What is the difference between linear, radial, and conic gradients?', a: 'Linear gradients transition colors along a straight line (top to bottom, left to right, or any angle). Radial gradients radiate outward from a center point in a circle or ellipse. Conic gradients sweep colors around a center point like a color wheel.' },
      { q: 'How do I make a hard edge in a gradient?', a: 'Set two adjacent color stops to the same position: linear-gradient(90deg, #8b5cf6 50%, #06b6d4 50%). This creates a sharp line instead of a smooth transition — useful for stripes and flags.' },
      { q: 'Can I layer multiple gradients?', a: 'Yes. Comma-separate multiple gradient values in the background property. Each one layers on top of the previous. Use transparent in your stops to let lower layers show through — this is how you create mesh-like effects.' },
      { q: 'Do CSS gradients need vendor prefixes?', a: 'No. All three gradient functions (linear, radial, conic) are supported unprefixed in all modern browsers.' },
    ],
    related: [
      { id: 'gradient', icon: '🎨', name: 'Gradient Generator' },
      { id: 'gradienttext', icon: '✨', name: 'Gradient Text Generator' },
      { id: 'colorpalette', icon: '🎯', name: 'Color Palette Generator' },
      { id: 'glassmorphism', icon: '🪟', name: 'Glassmorphism Generator' },
    ],
    extraCss: `
    .gradient-demo { width: 100%; height: 120px; border-radius: 16px;
      background: linear-gradient(135deg, #8b5cf6, #06b6d4, #14b8a6); }`,
  },
  {
    slug: 'css-flexbox-guide',
    title: 'CSS Flexbox: The Complete Guide (Properties, Patterns + Playground)',
    description: 'Master CSS flexbox: the mental model, every container and item property, 5 copy-paste layout patterns, flexbox vs grid, Tailwind utilities, and a free visual playground.',
    keywords: 'css flexbox, flexbox guide, flex css, justify-content, align-items, flex-grow, flexbox layout, flexbox cheat sheet',
    h1: 'CSS Flexbox: The Complete Guide',
    lede: 'Flexbox is the CSS layout engine for distributing space in one dimension — rows or columns. This guide covers the mental model, every property, and gives you 5 copy-paste patterns for common layouts. Want to experiment visually? <a href="https://freereign.dev/#flexbox">Use the free flexbox playground →</a>',
    cta: { heading: 'Try it visually', blurb: 'Toggle every flexbox property with live preview — see how justify-content, align-items, gap, and wrapping work in real time.', label: 'Open the Flexbox Playground →', toolId: 'flexbox' },
    faqs: [
      { q: 'What is the difference between flexbox and grid?', a: 'Flexbox is one-dimensional — it lays out items in a row or column. Grid is two-dimensional — it controls rows and columns simultaneously. Use flexbox for navbars, button groups, and single-direction layouts. Use grid for page-level layouts and card grids.' },
      { q: 'What does flex: 1 mean?', a: 'flex: 1 is shorthand for flex-grow: 1, flex-shrink: 1, flex-basis: 0%. It tells the item to grow and take up an equal share of available space.' },
      { q: 'How do I center something with flexbox?', a: 'Set display: flex, justify-content: center, and align-items: center on the parent container. This centers the children both horizontally and vertically.' },
      { q: 'Why does my flex item overflow?', a: 'Flex items default to min-width: auto, which prevents them from shrinking below their content size. Add min-width: 0 to the item to allow it to shrink, and use overflow-wrap: break-word on text.' },
    ],
    related: [
      { id: 'flexbox', icon: '📐', name: 'Flexbox Playground' },
      { id: 'grid', icon: '🔲', name: 'CSS Grid Generator' },
      { id: 'containerquery', icon: '📦', name: 'Container Queries' },
      { id: 'breakpoint', icon: '📏', name: 'Breakpoint Tester' },
    ],
    extraCss: `
    .flex-demo { display: flex; gap: 12px; max-width: 360px; margin: 0 auto; }
    .flex-item { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 10px;
      padding: 16px; text-align: center; font-weight: 700; font-size: 1.2rem; color: var(--accent); }`,
  },
  {
    slug: 'css-animation-guide',
    title: 'CSS Animations: The Complete Guide (@keyframes, Timing, Recipes)',
    description: 'Master CSS animations: @keyframes syntax, the animation shorthand, timing functions, 7 copy-paste recipes (fade, slide, bounce, spin, pulse, shake), reduced motion, performance, and Tailwind.',
    keywords: 'css animation, @keyframes css, css animation examples, css animation shorthand, animation timing function, css bounce animation, css fade in',
    h1: 'CSS Animations: The Complete Guide',
    lede: 'CSS animations let you create multi-step motion sequences that run on page load, loop infinitely, or trigger on demand — all without JavaScript. This guide covers @keyframes, every animation property, timing functions, and gives you 7 copy-paste recipes. Build them visually? <a href="https://freereign.dev/#animation">Use the free animation builder →</a>',
    cta: { heading: 'Build animations visually', blurb: 'Pick your timing function, set keyframes, preview the animation live — copy the full @keyframes CSS in one click.', label: 'Open the Animation Builder →', toolId: 'animation' },
    faqs: [
      { q: 'What is the difference between CSS transitions and CSS animations?', a: 'Transitions animate between two states and require a trigger (like :hover or a class toggle). Animations use @keyframes to define multiple steps, can run on page load, loop infinitely, and do not need a trigger.' },
      { q: 'How do I make a CSS animation loop forever?', a: 'Set animation-iteration-count: infinite. For example: animation: spin 1s linear infinite.' },
      { q: 'What does animation-fill-mode: forwards do?', a: 'It tells the element to keep the styles from the last keyframe after the animation ends, instead of snapping back to its original state.' },
      { q: 'How do I respect users who prefer reduced motion?', a: 'Use the @media (prefers-reduced-motion: reduce) media query to set animation-duration to near zero and limit iteration count to 1. This respects the user\'s OS-level motion preference.' },
    ],
    related: [
      { id: 'animation', icon: '🎬', name: 'Animation Builder' },
      { id: 'transition', icon: '🔄', name: 'Transition Generator' },
      { id: 'transform', icon: '🔀', name: 'Transform Generator' },
      { id: 'filter', icon: '🎨', name: 'CSS Filter Generator' },
    ],
    extraCss: `
    .anim-demo { display: flex; justify-content: center; padding: 20px; }
    .anim-box { width: 60px; height: 60px; border-radius: 12px;
      background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
      animation: pulse-demo 2s ease-in-out infinite; }
    @keyframes pulse-demo { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); opacity: 0.7; } }`,
  },
  {
    slug: 'css-grid-guide',
    title: 'CSS Grid: The Complete Guide (Columns, Areas, Patterns + Generator)',
    description: 'Master CSS Grid: grid-template-columns, rows, areas, auto-fit/auto-fill, repeat(), named lines, alignment, 5 copy-paste layout patterns, and a free visual generator.',
    keywords: 'css grid, css grid layout, grid-template-columns, grid-template-areas, css grid generator, auto-fit auto-fill, responsive grid',
    h1: 'CSS Grid: The Complete Guide',
    lede: 'CSS Grid is the most powerful layout system in CSS — it gives you control over rows and columns simultaneously. This guide covers everything from basic grids to named areas and responsive patterns. Want to build grids visually? <a href="https://freereign.dev/#grid">Use the free CSS Grid generator →</a>',
    cta: { heading: 'Build grids visually', blurb: 'Set columns, rows, and gaps with sliders — see the grid update in real time and copy the CSS.', label: 'Open the Grid Generator →', toolId: 'grid' },
    faqs: [
      { q: 'What is the difference between auto-fill and auto-fit?', a: 'auto-fill creates as many tracks as will fit, leaving empty ones visible. auto-fit collapses empty tracks so items stretch to fill the space. For responsive card grids, auto-fit is usually what you want.' },
      { q: 'How do I make a responsive grid without media queries?', a: 'Use grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)). Items will automatically wrap to new rows when they can\'t fit at the minimum size.' },
      { q: 'What is the fr unit?', a: 'fr stands for "fraction of available space." 1fr 2fr 1fr creates three columns where the middle one is twice as wide as the others.' },
      { q: 'Should I use Grid or Flexbox?', a: 'Use Grid for two-dimensional layouts (page layouts, card grids). Use Flexbox for one-dimensional layouts (navbars, button groups). Combine them: Grid for the outer layout, Flexbox for components inside each cell.' },
    ],
    related: [
      { id: 'grid', icon: '🔲', name: 'CSS Grid Generator' },
      { id: 'flexbox', icon: '📐', name: 'Flexbox Playground' },
      { id: 'containerquery', icon: '📦', name: 'Container Queries' },
      { id: 'breakpoint', icon: '📏', name: 'Breakpoint Tester' },
    ],
    extraCss: `
    .grid-demo { display: grid; grid-template-columns: 120px 1fr; grid-template-rows: auto 1fr auto;
      grid-template-areas: "header header" "sidebar main" "footer footer"; gap: 8px; max-width: 400px; margin: 0 auto; }
    .grid-item { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 8px;
      padding: 12px; text-align: center; font-weight: 600; font-size: 0.85rem; color: var(--accent); }
    .grid-item--header { grid-area: header; }
    .grid-item--sidebar { grid-area: sidebar; }
    .grid-item--main { grid-area: main; min-height: 80px; }
    .grid-item--footer { grid-area: footer; }`,
  },
  {
    slug: 'css-border-radius-guide',
    title: 'CSS Border Radius: The Complete Guide (Shapes, Scale + Generator)',
    description: 'Master CSS border-radius: circles, pills, blobs, elliptical corners, design system scale, advanced combos with shadows and gradients, Tailwind utilities, and a free generator.',
    keywords: 'css border radius, border-radius, css rounded corners, css circle, css pill button, border-radius generator, css blob shape',
    h1: 'CSS Border Radius: The Complete Guide',
    lede: 'The <code>border-radius</code> property turns sharp rectangles into circles, pills, cards, and organic blobs — all with one line of CSS. This guide covers every syntax, common shapes, a design system scale, and advanced techniques. Generate it visually? <a href="https://freereign.dev/#borderradius">Use the free border radius generator →</a>',
    cta: { heading: 'Generate it visually', blurb: 'Drag corners independently, see the shape update live, copy the exact border-radius value.', label: 'Open the Border Radius Generator →', toolId: 'borderradius' },
    faqs: [
      { q: 'How do I make a circle with CSS?', a: 'Set border-radius: 50% on an element with equal width and height. If the element is not square, 50% creates an ellipse instead.' },
      { q: 'How do I make a pill button?', a: 'Set border-radius: 9999px (or 100vmax). This creates a fully rounded capsule shape regardless of the element\'s width or height.' },
      { q: 'What does the slash (/) mean in border-radius?', a: 'The slash separates horizontal and vertical radii, creating elliptical corners. For example, border-radius: 20px / 10px makes corners that curve more horizontally than vertically.' },
      { q: 'Does border-radius affect performance?', a: 'No. Border-radius is extremely cheap to render. Unlike box-shadow or filter, you can use it freely without performance concerns.' },
    ],
    related: [
      { id: 'borderradius', icon: '◼️', name: 'Border Radius Generator' },
      { id: 'boxshadow', icon: '🔳', name: 'Box Shadow Generator' },
      { id: 'glassmorphism', icon: '🪟', name: 'Glassmorphism Generator' },
      { id: 'clippath', icon: '✂️', name: 'Clip-Path Generator' },
    ],
    extraCss: `
    .radius-demo { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
    .radius-box { width: 80px; height: 80px; background: var(--bg-elevated); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; color: var(--accent); }
    .radius-box--card { border-radius: 16px; }
    .radius-box--pill { border-radius: 9999px; width: 120px; height: 44px; }
    .radius-box--circle { border-radius: 50%; }
    .radius-box--blob { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }`,
  },
];

function articleJsonLd(a) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: a.h1,
    description: a.description,
    author: { '@type': 'Organization', name: 'FreeReign' },
    publisher: { '@type': 'Organization', name: 'FreeReign' },
    datePublished: TODAY,
    dateModified: TODAY,
    mainEntityOfPage: `${BASE_URL}/blog/${a.slug}`,
    image: `${BASE_URL}/og-image.png`,
  }, null, 2);
}

function faqJsonLd(a) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: a.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }, null, 2);
}

function render(a) {
  const body = fs.readFileSync(path.join(__dirname, 'blog-src', `${a.slug}.html`), 'utf8').trim();
  const faqHtml = a.faqs.map(f => `    <h3>${f.q}</h3>\n    <p>${f.a}</p>`).join('\n');
  const relatedHtml = a.related.map(r => `      <a href="${BASE_URL}/#${r.id}"><span>${r.icon}</span> ${r.name}</a>`).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${a.title} | FreeReign</title>
  <meta name="description" content="${a.description}">
  <meta name="keywords" content="${a.keywords}">
  <link rel="canonical" href="${BASE_URL}/blog/${a.slug}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <script defer data-domain="freereign.dev" src="https://analytics.freereign.dev/js/script.outbound-links.js"></script>
  <script>window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments) }</script>

  <meta property="og:title" content="${a.title}">
  <meta property="og:description" content="${a.description}">
  <meta property="og:image" content="${BASE_URL}/og-image.png">
  <meta property="og:url" content="${BASE_URL}/blog/${a.slug}">
  <meta property="og:type" content="article">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${a.title}">
  <meta name="twitter:description" content="${a.description}">
  <meta name="twitter:image" content="${BASE_URL}/og-image.png">

  <script type="application/ld+json">
  ${articleJsonLd(a)}
  </script>
  <script type="application/ld+json">
  ${faqJsonLd(a)}
  </script>

  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>${SHARED_CSS}${a.extraCss || ''}
  </style>
</head>
<body>
  <div class="container">
    <nav class="breadcrumb">
      <a href="${BASE_URL}">FreeReign</a> / <a href="${BASE_URL}/blog/">Blog</a> / ${a.h1}
    </nav>

    <h1>${a.h1}</h1>
    <p class="lede">${a.lede}</p>

    ${body}

    <div class="cta-wrap">
      <h2>${a.cta.heading}</h2>
      <p>${a.cta.blurb}</p>
      <a class="cta-btn" href="${BASE_URL}/#${a.cta.toolId}">${a.cta.label}</a>
    </div>

    <h2>FAQ</h2>
${faqHtml}

    <h2>Related tools</h2>
    <div class="related">
${relatedHtml}
    </div>
  </div>

  <footer>
    <p>Made with ◆ by <a href="${BASE_URL}">FreeReign</a> · 25 CSS generators · <a href="${BASE_URL}/tools/">All tools</a></p>
  </footer>
</body>
</html>
`;
}

const outDir = path.join(__dirname, 'public', 'blog');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

ARTICLES.forEach(a => {
  fs.writeFileSync(path.join(outDir, `${a.slug}.html`), render(a));
  console.log(`  ✓ /blog/${a.slug}`);
});

console.log(`\n✅ Generated ${ARTICLES.length} blog articles in public/blog/`);
console.log('\nSitemap entries:');
ARTICLES.forEach(a => console.log(
  `  <url><loc>${BASE_URL}/blog/${a.slug}</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>`));

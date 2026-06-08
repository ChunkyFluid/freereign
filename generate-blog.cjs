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
      --bg: #111113; --bg-surface: #1c1c1f; --bg-elevated: #232326;
      --text: #ececec; --text-secondary: #888; --text-tertiary: #555;
      --accent: #0d9488; --accent-secondary: #14b8a6;
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
    title: 'Stop Using Breakpoints for Font Sizes — Use clamp() Instead',
    description: 'How to use CSS clamp() for fluid typography that scales smoothly across every viewport. The formula, the accessibility trap most people fall into, and a full type scale you can steal.',
    keywords: 'css fluid typography, clamp css, fluid type scale, responsive font size css, css clamp calculator, fluid font size',
    h1: 'Stop Using Breakpoints for Font Sizes',
    lede: 'If you\'re still writing three media queries to handle your h1 on mobile, tablet, and desktop, there\'s a better way. <code>clamp()</code> lets your type scale smoothly between a min and max size with zero breakpoints. But there\'s an accessibility trap that almost nobody talks about — using pure viewport units breaks browser zoom. Here\'s how to do it right. <a href="https://freereign.dev/#fluidtype">Or just skip to the generator →</a>',
    cta: { heading: 'Skip the math', blurb: 'Enter a min and max font size and two breakpoints — get the exact clamp() value instantly, plus a full fluid scale.', label: 'Open the Fluid Typography Generator →', toolId: 'fluidtype' },
    faqs: [
      { q: 'What is the clamp() function in CSS?', a: 'It takes three values — a minimum, a preferred (usually viewport-relative), and a maximum. The browser uses the middle value but clamps it to the bounds. For typography, this means your font size smoothly scales between the min and max as the viewport changes.' },
      { q: 'Is fluid typography bad for accessibility?', a: 'It can be, if you do it wrong. A pure viewport unit like 5vw ignores browser zoom completely — the text stays the same size when users zoom in. The fix is mixing in a rem component: something like 1rem + 4vw. That way the text still responds to zoom and user font-size preferences.' },
      { q: 'Do I still need media queries with clamp()?', a: 'For font sizing? Almost never. clamp() handles every size between your bounds automatically. You might still want media queries for layout changes, but the typography part is solved.' },
      { q: 'Is clamp() supported in all browsers?', a: 'Yes — it\'s been universally supported for years. No prefix needed. Ship it.' },
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
    title: 'Container Queries Finally Fix the One Thing Media Queries Can\'t Do',
    description: 'CSS container queries let components respond to their own container size instead of the viewport. Here\'s the setup, the gotchas, and why they change how you think about responsive design.',
    keywords: 'css container queries, container query, @container css, container-type inline-size, cqi cqw units, component responsive css',
    h1: 'Container Queries Fix Responsive Components',
    lede: 'Here\'s the problem media queries can\'t solve: you have a card component. It goes in a wide main column and a narrow sidebar. Both see the same viewport, so both get the same styles. That\'s broken. Container queries fix it — the card responds to <em>its own container</em>, not the viewport. This is the biggest CSS feature in years, and it\'s production-ready now. <a href="https://freereign.dev/#containerquery">Try the generator →</a>',
    cta: { heading: 'Build it visually', blurb: 'Set the container type, breakpoints, and rules with live controls and copy the @container CSS in one click.', label: 'Open the Container Query Generator →', toolId: 'containerquery' },
    faqs: [
      { q: 'What is the difference between container queries and media queries?', a: 'Media queries check the viewport. Container queries check a specific parent element. That means the same component can lay itself out differently depending on where you drop it — wide column vs. narrow sidebar — without any viewport logic at all.' },
      { q: 'How do I set up a container query?', a: 'Two steps: give the parent container-type: inline-size, then use @container (min-width: 400px) { ... } on the children. The tricky part is that the queried element must be inside the container — you can\'t query and restyle the container itself.' },
      { q: 'What are cqi and cqw units?', a: 'New relative units that size against the container instead of the viewport. cqw is 1% of the container width, cqi is 1% of its inline size. Think of them like vw/vh, but scoped to the nearest query container.' },
      { q: 'Are container queries supported in browsers?', a: 'Yes — Chrome, Edge, Safari, and Firefox all support them since 2023. Safe to ship in production.' },
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
    title: 'Why Your CSS Shadows Look Flat (and How to Fix Them)',
    description: 'Single-layer box-shadows look fake. Here\'s how to stack multiple shadows for realistic depth, plus the pseudo-element trick for animating them without killing performance.',
    keywords: 'css box shadow, box shadow generator, css shadow, box shadow examples, multiple box shadows, inset shadow, css shadow effects',
    h1: 'Why Your CSS Shadows Look Flat',
    lede: 'A single <code>box-shadow</code> looks fake. Always. Real-world light creates multiple layers of shadow at different distances, and CSS lets you do the same thing by comma-separating values. This is the difference between a shadow that looks like a design tool preset and one that looks like an actual object on screen. <a href="https://freereign.dev/#boxshadow">Build layered shadows visually →</a>',
    cta: { heading: 'Build shadows visually', blurb: 'Add multiple shadow layers, adjust offset, blur, spread, and color with live preview — copy the CSS in one click.', label: 'Open the Box Shadow Generator →', toolId: 'boxshadow' },
    faqs: [
      { q: 'Can you have multiple box shadows?', a: 'Yes, and you should. Comma-separate them — the first one renders on top. Two or three shadows at different distances create way more realistic depth than one big shadow ever will.' },
      { q: 'What is an inset shadow?', a: 'Adding the inset keyword flips the shadow inside the element. It\'s useful for pressed button states, input fields, and that inner glow effect you see on dark UI cards.' },
      { q: 'Does box-shadow affect layout?', a: 'Nope. Shadows are purely visual and don\'t change the element\'s size or position. They can overflow parent containers though, which catches people off guard with overflow: hidden.' },
      { q: 'How do I animate box-shadow performantly?', a: 'Don\'t animate box-shadow directly — it triggers a repaint every frame. Instead, put the hover shadow on a ::before or ::after pseudo-element with opacity: 0, then just transition the opacity. The browser composites opacity on the GPU, so it\'s buttery smooth.' },
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
    title: 'CSS Gradients Are More Powerful Than You Think',
    description: 'Linear, radial, and conic gradients explained. Color stop tricks, repeating patterns, mesh-like layered effects you can build with pure CSS, and recipes you can copy-paste.',
    keywords: 'css gradient, linear-gradient, radial-gradient, conic-gradient, css gradient generator, gradient background css, repeating gradient',
    h1: 'CSS Gradients Are More Powerful Than You Think',
    lede: 'Most people use <code>linear-gradient</code> with two colors and call it a day. But CSS gradients can do way more — hard edges for stripes, layered radials for mesh effects, conic gradients for pie charts, and repeating patterns for backgrounds. Once you learn color stop positioning, gradients become a legitimate design tool, not just a background shortcut. <a href="https://freereign.dev/#gradient">Build gradients visually →</a>',
    cta: { heading: 'Build gradients visually', blurb: 'Drag color stops, adjust angles, pick from presets — get linear, radial, or conic gradient CSS instantly.', label: 'Open the Gradient Generator →', toolId: 'gradient' },
    faqs: [
      { q: 'What is the difference between linear, radial, and conic gradients?', a: 'Linear goes in a straight line (any angle). Radial radiates from a center point outward. Conic sweeps around a center point like a clock. Each has its uses — linear for most backgrounds, radial for spotlight effects, conic for pie charts or decorative stuff.' },
      { q: 'How do I make a hard edge in a gradient?', a: 'Set two color stops to the same position — like linear-gradient(90deg, purple 50%, cyan 50%). No transition space between them means a sharp line. This is how you make stripes and flags with pure CSS.' },
      { q: 'Can I layer multiple gradients?', a: 'Yes, and that\'s where it gets interesting. Comma-separate multiple gradients in the background property. Use transparent stops so lower layers show through. Three layered radials with low opacity creates a mesh-gradient effect that looks like it came from Figma.' },
      { q: 'Do CSS gradients need vendor prefixes?', a: 'Not anymore. All three functions work unprefixed in every modern browser.' },
    ],
    related: [
      { id: 'gradient', icon: '🎨', name: 'Gradient Generator' },
      { id: 'gradienttext', icon: '✨', name: 'Gradient Text Generator' },
      { id: 'colorpalette', icon: '🎯', name: 'Color Palette Generator' },
      { id: 'glassmorphism', icon: '🪟', name: 'Glassmorphism Generator' },
    ],
    extraCss: `
    .gradient-demo { width: 100%; height: 120px; border-radius: 16px;
      background: linear-gradient(135deg, #0d9488, #14b8a6, #2dd4bf); }`,
  },
  {
    slug: 'css-flexbox-guide',
    title: 'Flexbox in 10 Minutes: Every Property, 5 Layouts You\'ll Actually Use',
    description: 'A practical flexbox reference: the mental model, every container and item property explained, and 5 copy-paste layout patterns (navbar, sticky footer, equal columns, centering, card grid).',
    keywords: 'css flexbox, flexbox guide, flex css, justify-content, align-items, flex-grow, flexbox layout, flexbox cheat sheet',
    h1: 'Flexbox in 10 Minutes',
    lede: 'Flexbox has a lot of properties, but you only need to understand one thing: there\'s a main axis and a cross axis. <code>justify-content</code> works on the main axis, <code>align-items</code> works on the cross axis. Once that clicks, everything else falls into place. Here\'s every property, plus the 5 layout patterns that cover 90% of real-world use cases. <a href="https://freereign.dev/#flexbox">Or just play with it visually →</a>',
    cta: { heading: 'Try it visually', blurb: 'Toggle every flexbox property with live preview — see how justify-content, align-items, gap, and wrapping work in real time.', label: 'Open the Flexbox Playground →', toolId: 'flexbox' },
    faqs: [
      { q: 'What is the difference between flexbox and grid?', a: 'Flexbox handles one direction at a time — a row or a column. Grid handles rows and columns together. Use flexbox for navbars, button groups, and anything in a line. Use grid for page layouts and card grids. Combine them freely.' },
      { q: 'What does flex: 1 mean?', a: 'It\'s shorthand for flex-grow: 1, flex-shrink: 1, flex-basis: 0%. In plain English: "take up your fair share of whatever space is left." If three items all have flex: 1, they split the space equally.' },
      { q: 'How do I center something with flexbox?', a: 'display: flex; justify-content: center; align-items: center on the parent. That\'s it. Three lines, centered both ways. It\'s probably the most commonly written flexbox pattern.' },
      { q: 'Why does my flex item overflow?', a: 'Flex items have min-width: auto by default, which means they refuse to shrink below their content width. Add min-width: 0 and the item will shrink properly. For text, also add overflow-wrap: break-word.' },
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
    title: '7 CSS Animations You Can Copy-Paste (Plus When Not to Use Them)',
    description: '@keyframes explained, the animation shorthand demystified, timing functions that actually feel good, 7 ready-to-use recipes, and why you should respect prefers-reduced-motion.',
    keywords: 'css animation, @keyframes css, css animation examples, css animation shorthand, animation timing function, css bounce animation, css fade in',
    h1: '7 CSS Animations You Can Copy-Paste',
    lede: 'CSS animations are two things: a <code>@keyframes</code> rule and an <code>animation</code> property. That\'s really it. But the difference between an animation that feels janky and one that feels polished usually comes down to the timing function — and most people just use <code>ease</code>. Here are 7 recipes you can grab right now, plus the timing curve that most design systems actually use. <a href="https://freereign.dev/#animation">Build animations visually →</a>',
    cta: { heading: 'Build animations visually', blurb: 'Pick your timing function, set keyframes, preview the animation live — copy the full @keyframes CSS in one click.', label: 'Open the Animation Builder →', toolId: 'animation' },
    faqs: [
      { q: 'What is the difference between CSS transitions and CSS animations?', a: 'Transitions go between two states and need a trigger (hover, class toggle, etc.). Animations use @keyframes, can have as many steps as you want, run on page load, and can loop forever. Use transitions for hover effects; use animations for loading spinners and entrance sequences.' },
      { q: 'How do I make a CSS animation loop forever?', a: 'animation-iteration-count: infinite. Or in shorthand: animation: spin 1s linear infinite.' },
      { q: 'What does animation-fill-mode: forwards do?', a: 'Without it, the element snaps back to its original state when the animation ends. With forwards, it stays at wherever the last keyframe left it. You almost always want this for entrance animations.' },
      { q: 'How do I respect users who prefer reduced motion?', a: 'Wrap your animations in @media (prefers-reduced-motion: reduce) and set duration to near-zero. This isn\'t optional — some users get physically sick from motion. The CSS is three lines and it matters.' },
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
    title: 'CSS Grid in Practice: Layouts, Named Areas, and the auto-fit Trick',
    description: 'A practical CSS Grid walkthrough: grid-template-columns, named areas, the auto-fit/auto-fill responsive trick, alignment, and 5 layout patterns you can drop into any project.',
    keywords: 'css grid, css grid layout, grid-template-columns, grid-template-areas, css grid generator, auto-fit auto-fill, responsive grid',
    h1: 'CSS Grid in Practice',
    lede: 'Grid is the layout tool where CSS finally got it right. Two dimensions, explicit placement, named areas that literally map to how your page looks. The thing most people miss is <code>repeat(auto-fit, minmax(250px, 1fr))</code> — one line that gives you a responsive card grid with zero media queries. Here\'s everything you need to use Grid for real projects. <a href="https://freereign.dev/#grid">Build grids visually →</a>',
    cta: { heading: 'Build grids visually', blurb: 'Set columns, rows, and gaps with sliders — see the grid update in real time and copy the CSS.', label: 'Open the Grid Generator →', toolId: 'grid' },
    faqs: [
      { q: 'What is the difference between auto-fill and auto-fit?', a: 'auto-fill creates as many columns as will fit, even if some are empty. auto-fit does the same but collapses the empty ones so your items stretch to fill. For card grids where you want items to grow, auto-fit is almost always what you want.' },
      { q: 'How do I make a responsive grid without media queries?', a: 'grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)). That\'s it. Items wrap to new rows when they can\'t fit at 250px, and they grow to fill available space. One line, fully responsive.' },
      { q: 'What is the fr unit?', a: 'It means "fraction of the leftover space." 1fr 2fr 1fr gives you three columns where the middle one gets double the space. Think of it as flex-grow for grid tracks.' },
      { q: 'Should I use Grid or Flexbox?', a: 'Grid for anything two-dimensional — page layouts, card grids, dashboards. Flexbox for one-dimensional stuff — navbars, button rows, vertical stacks. In practice, most projects use both: grid for the outer layout, flexbox inside each cell.' },
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
    title: 'Beyond Rounded Corners: Circles, Pills, Blobs, and the Slash Trick',
    description: 'CSS border-radius does way more than rounded cards. Circles, pill buttons, organic blobs, elliptical corners with the slash syntax, a design system scale, and gradient borders.',
    keywords: 'css border radius, border-radius, css rounded corners, css circle, css pill button, border-radius generator, css blob shape',
    h1: 'Beyond Rounded Corners',
    lede: 'Everyone knows <code>border-radius: 12px</code>. But most people don\'t know about the slash syntax for elliptical corners, how <code>9999px</code> makes a pill shape regardless of dimensions, or how to create organic blob shapes with eight values. <code>border-radius</code> is one of those properties that does more than the name suggests. <a href="https://freereign.dev/#borderradius">Generate shapes visually →</a>',
    cta: { heading: 'Generate it visually', blurb: 'Drag corners independently, see the shape update live, copy the exact border-radius value.', label: 'Open the Border Radius Generator →', toolId: 'borderradius' },
    faqs: [
      { q: 'How do I make a circle with CSS?', a: 'border-radius: 50% on a square element. If it\'s not square, you get an ellipse — which is sometimes what you want, sometimes not.' },
      { q: 'How do I make a pill button?', a: 'border-radius: 9999px. This makes a fully rounded capsule shape no matter what the width or height is. Some people use 100vmax instead.' },
      { q: 'What does the slash (/) mean in border-radius?', a: 'It separates horizontal and vertical radii, so each corner can have an elliptical curve instead of a circular one. border-radius: 20px / 10px makes corners that are wider than they are tall. It\'s how you get those subtle squircle-ish shapes.' },
      { q: 'Does border-radius affect performance?', a: 'Not at all. It\'s one of the cheapest CSS properties to render. Unlike shadows or filters, you can use it on every element without worrying about paint cost.' },
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

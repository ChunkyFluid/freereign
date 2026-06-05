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

# FreeReign — Launch & Marketing Kit

> Goal: **$50 in 30 days** (validation), then scale toward **$5,000 by end of year**.
> Everything below is copy-paste ready. Your only job is to hit submit and reply to comments.
> Read `MARKETING.md` top-to-bottom once, then work the **30-Day Calendar** at the bottom.

The hard truth: the product is fine. The blocker is that nobody knows it exists.
This kit is 90% of the marketing *execution*. The 10% only you can do is press "post"
and talk to humans in the threads. Do that part well — replies and follow-ups convert
more than the original post.

---

## 0. Pre-launch checklist (do this BEFORE any post)

- [ ] Set up Plausible (cloud ~$9/mo, or self-host on your Hetzner box). Confirm
      `freereign.dev` shows live visitors and that custom events fire
      (`tool_view`, `pro_modal_open`, `checkout_click`, `pro_purchase`).
- [ ] Smoke-test the **full purchase flow** end to end with a real card (refund yourself
      after). A broken checkout during a launch spike is a catastrophe.
- [ ] Make sure **Save Presets** actually works (it's advertised — shipping vaporware
      to a paying customer = refund + bad review).
- [ ] Take 4–6 clean screenshots / a 20–30s screen recording (gradient + glassmorphism
      + the code panel copy animation). You'll reuse these everywhere.
- [ ] Set a UTM convention so you know which channel drove each visit, e.g.
      `?utm_source=reddit&utm_medium=post&utm_campaign=webdev_launch`.
- [ ] Decide your **kill/pivot criterion** in writing: *if ~1–2k targeted visitors produce
      0 `checkout_click` events, the one-time-Pro offer is wrong → pivot to design-tokens/
      team angle or ad/affiliate before investing more.*

---

## 1. The wedge: pick ONE hero tool

Don't market "25 generators" — you'd be competing with 25 established tools at once and
ranking for nothing. Pick one tool, make it the best on the internet for a *specific*
long-tail intent, and let it be the front door.

**Recommended hero: Glassmorphism Generator.**
- Strong, trendy search demand; the existing free tools are mediocre.
- Visually striking = screenshots that stop the scroll = shares.
- Target the long-tail, not the head term: aim for *"glassmorphism CSS generator with code"*,
  *"glassmorphism generator tailwind"*, *"frosted glass CSS generator"* — not the contested
  word "glassmorphism" alone.

**Backup hero: Clip-Path Generator** (lower competition, easier to rank, less demand).

The thing that actually ranks and earns backlinks is **a tutorial article with the tool
embedded** — not the bare tool page. See §6 for the draft.

---

## 2. Product Hunt launch

PH can do thousands of visits in a day. Launch **Tuesday–Thursday, 12:01am PT**. Line up
5–10 people in advance who'll genuinely try it and comment (not just upvote — comments matter).

**Name:** FreeReign
**Tagline (≤60 chars):** `25 visual CSS generators with instant copy-paste code`
**Topics:** Design Tools, Developer Tools, Web App, CSS

**Description:**
```
FreeReign is a toolkit of 25 visual CSS generators — gradients, shadows,
glassmorphism, animations, flexbox, grid, clip-path and more. Every tool has
live controls, a real-time preview, and one-click code output in CSS, SCSS,
and Tailwind.

No signup. No install. 100% client-side — your work never leaves your browser.

10 tools are free forever. Pro ($14.99 one-time) unlocks all 25, clean output,
SCSS/Tailwind export, and saved presets.

Built solo. I'd love your feedback — what tool should I add next?
```

**First comment (post immediately after launch, as the maker):**
```
Maker here 👋

I kept bouncing between 10 different single-purpose CSS sites every time I
styled something, so I built the toolkit I wanted: every generator in one
place, consistent UI, copy-paste output in the format you actually use.

A few things I'm proud of:
• Everything runs locally — zero tracking, zero server calls
• Live preview on every control
• Keyboard-driven (/ to search, Ctrl+S to export, arrows to switch tools)

It's free to use (10 tools). Genuinely want feedback on what's missing —
drop the CSS thing you generate most often and I'll prioritize it.
```

---

## 3. Reddit (one post per subreddit, spread across days — NEVER blast all at once)

Reddit will nuke obvious self-promo. Rules that keep you alive:
- Post from an aged account with karma. Read each sub's rules first.
- Lead with value/story, not "buy my thing." Don't mention Pro in the post body —
  let people discover it.
- Reply to every comment for the first few hours. Engagement = reach.
- Space posts 2–3 days apart. Vary the angle.

### r/webdev  (use the "Showoff Saturday" thread if required)
**Title:** `I built a free toolkit of 25 visual CSS generators (gradients, glassmorphism, grid…) — all client-side, no signup`
**Body:**
```
I got tired of juggling a dozen different single-purpose CSS sites, so I built
one toolkit with 25 generators: gradient, box-shadow, glassmorphism, flexbox,
grid, clip-path, animations, and more. Live preview on everything, copy-paste
output in CSS / SCSS / Tailwind.

It's 100% client-side — no accounts, no tracking, nothing leaves your browser.

Link: https://freereign.dev?utm_source=reddit&utm_medium=post&utm_campaign=webdev

Would love feedback on the UX and which generator I should build next.
```

### r/Frontend
**Title:** `Made a client-side CSS generator suite — feedback on the glassmorphism + grid tools?`
**Body:** (shorter, more technical)
```
Built a set of visual CSS tools, vanilla JS, no deps, all client-side. The two
I sweated the most are the glassmorphism generator (backdrop-filter is fiddly)
and the grid builder. Curious what frontend folks think of the output quality
and whether the Tailwind export matches how you'd actually write it.

https://freereign.dev?utm_source=reddit&utm_medium=post&utm_campaign=frontend
```

### r/web_design
**Title:** `A free color-palette + gradient + glassmorphism toolkit for designers (no signup)`
**Body:** lead with the design/visual angle, mention the 6 color-harmony modes and presets.

### r/SideProject  /  r/IndieHackers (build-in-public angle is welcome here)
**Title:** `Launched my CSS toolkit — sharing the build + first revenue experiment`
**Body:** here you CAN talk business. Share that it's 10 free / 15 Pro at $14.99 one-time,
that you're testing whether a one-time dev tool can convert, and that you'll report back
with numbers. IH/SideProject reward transparency.

### r/css
**Title:** `Free clip-path + glassmorphism generators with live preview` — keep it purely useful, this sub is small but high-intent.

---

## 4. Hacker News — "Show HN"

Post Tue–Thu morning US time. HN traffic is huge but skeptical and allergic to marketing.

**Title:** `Show HN: FreeReign – 25 client-side CSS generators, no signup`
**URL:** `https://freereign.dev`
**First comment:**
```
I built this because I was tired of hopping between a dozen single-purpose CSS
sites. It's vanilla JS, no dependencies, everything runs in the browser — no
accounts, no analytics calls on the tool data itself.

10 tools are free; a Pro tier unlocks the rest. Happy to go into the technical
details (the syntax highlighter and the watermark-stripping were the annoying
parts). Feedback welcome, especially on output quality.
```
Expect blunt feedback. Engage graciously; don't get defensive. HN loves a maker who
takes criticism well.

---

## 5. X / Twitter — build-in-public thread

Post the thread, pin it, then post 2–3x/week with progress + a screenshot/clip. Tag with
`#buildinpublic #css #webdev #frontend`. Reply to people, don't just broadcast.

**Launch thread:**
```
1/ I shipped FreeReign — 25 visual CSS generators in one place.

Gradients, glassmorphism, shadows, grid, clip-path, animations… live preview +
copy-paste code (CSS/SCSS/Tailwind). No signup, 100% client-side.

🔗 freereign.dev
[attach the 20s screen recording]

2/ Why? I was tabbing between ~10 different CSS sites every time I styled
anything. Inconsistent UIs, ads everywhere, half of them want your email.

So I built the one toolkit I actually wanted.

3/ Stack: vanilla JS, zero dependencies, ~38KB gzipped. Fast on purpose.
Everything runs locally — your CSS never touches a server.

4/ Business experiment: 10 tools free forever, 15 Pro for $14.99 one-time
(no subscription). I'll share real numbers as I go. Following along? 👇

5/ What CSS thing do you generate most often? That's what I build next.
```

---

## 6. The wedge tutorial (this is what ranks + earns backlinks)

Write ONE genuinely good article targeting the hero tool's long-tail. Publish on your own
site (`/blog/...` or a static page) AND cross-post to dev.to and Hashnode with a canonical
link back to your domain. Embed the live tool in the article.

> ✅ **Shipped:** the first article is live at
> `public/blog/how-to-create-glassmorphism-css.html` →
> `https://freereign.dev/blog/how-to-create-glassmorphism-css`
> (Article + FAQ schema, a live in-page glass demo, copy-paste recipes, Tailwind
> section, and a CTA into the generator; it's in the sitemap). Action items:
> (1) cross-post to dev.to + Hashnode with `rel=canonical` back to your domain,
> (2) submit the URL in Google Search Console, (3) add a "Read the guide" link
> from the glassmorphism tool page for internal linking.

**Working title:** `How to Create Glassmorphism in CSS (2026 Guide + Free Generator)`
**Target queries:** glassmorphism css, glassmorphism generator, frosted glass css, backdrop-filter blur

**Outline:**
1. What glassmorphism is + 2–3 real-world examples (with images).
2. The core CSS: `background` with alpha, `backdrop-filter: blur() saturate()`, a subtle
   1px border, soft shadow. Show a minimal working snippet.
3. The gotchas: browser support / `-webkit-backdrop-filter`, why it needs a busy background,
   performance, accessibility/contrast.
4. Copy-paste recipes: card, navbar, modal, login form.
5. "Skip the math — generate it visually" → embed the FreeReign glassmorphism tool.
6. FAQ (great for SEO featured snippets): Does glassmorphism hurt performance? Does Safari
   support backdrop-filter? How do I do it in Tailwind?

Repeat for the highest-demand tools. Each article is a new front door that links to the rest.

> ✅ **Shipped (article #2):** `public/blog/css-clip-path-guide.html` →
> `https://freereign.dev/blog/css-clip-path-guide` (Article + FAQ schema, six live
> in-page clipped shapes, the polygon coordinate system explained, copy-paste recipes,
> animation section, Tailwind, FAQ, CTA into the generator; in the sitemap; the
> clip-path tool page links to it). Cross-post + Search Console it the same way.

---

## 7. Directories & passive backlinks (one afternoon, long-tail SEO juice)

Submit FreeReign to (free): There's An AI For That-style tool directories, ToolHunt,
SaaSHub, AlternativeTo (as an alternative to popular gradient tools), Awesome-* GitHub
lists (open a PR adding it to relevant "awesome-css"/"awesome-design-tools" lists),
CSS-Tricks/Smashing newsletter tip submissions, and dev tool roundup sites. Each is a
backlink + a trickle of qualified traffic.

---

## 8. 30-Day Calendar

**Week 1 — Foundations (no public posts yet)**
- Day 1–2: Plausible live + confirm events. Smoke-test checkout end to end.
- Day 3–4: Confirm Save Presets works. Capture screenshots + screen recording.
- Day 5: Write & publish the glassmorphism tutorial (§6). Submit sitemap to Google
  Search Console + Bing Webmaster Tools.
- Day 6–7: Soft launch — post the build-in-public thread (§5) and the r/SideProject
  post (§3). Warm up. Watch the funnel.

**Week 2 — Community blitz (one post/day, never two)**
- Day 8: r/webdev (or queue for Showoff Saturday)
- Day 9: dev.to cross-post of the tutorial (canonical → your site)
- Day 10: r/Frontend
- Day 11: Submit to 5 tool directories (§7)
- Day 12: r/web_design
- Day 13: X progress post + screenshot
- Day 14: r/css + Hashnode cross-post

**Week 3 — Big swings**
- Day 15: **Product Hunt launch** (§2). All hands — reply to every comment all day.
- Day 16: **Show HN** (§4) the next morning.
- Day 17–18: Ride the spike — reply everywhere, fix anything users report.
- Day 19: Indie Hackers "I launched, here are my numbers" post.
- Day 20–21: X recap thread with real metrics.

**Week 4 — Read the data, decide**
- Day 22–26: Open the Plausible funnel. Which source drove `checkout_click`? Where do
  people drop? Double down on the winning channel; fix the worst drop-off step.
- Day 27–28: Write tutorial #2 for the next-highest-demand tool.
- Day 29–30: Review against the **kill/pivot criterion**. If sales happened → scale the
  channel that worked. If 0 checkout clicks on 1–2k visits → pivot the offer (design-tokens/
  team tier, or ad/affiliate layer) rather than grinding more of the same.

---

## 9. Conversion checklist (do these if traffic comes but nobody buys)

- Add a one-line nudge after a successful copy: "Liked this? 15 more pro tools + saved
  presets in Pro →" (you already have the modal — trigger it on the 3rd copy).
- Make the **free vs Pro** comparison concrete with screenshots, not just text.
- Add real social proof as it arrives (PH/HN comments, tweets) to the Pro modal.
- Sharpen the value prop from "more generators" → "save your design system & export
  tokens." Professionals/agencies pay for workflow, not for CSS strings.
- Test a higher price ($29) once Save Presets + token export are real — $14.99 can read
  as "cheap toy" rather than "professional tool."

---

## 10. Scaling logic to $5,000

Once *something* converts:
1. **SEO compounding** — your 25 static tool pages + a growing library of tutorials are
   the strongest long-term asset. Invest in real content + internal linking + backlinks.
   This is what turns into passive monthly sales by month 3–4.
2. **Distribution surface** — a VS Code extension or Figma plugin puts you in front of
   developers *in their buying context*. 3–6 month bet; start once the web funnel converts.
3. **Higher-value / recurring** — a "Team" tier with shared presets + design-token export
   for agencies is where real revenue lives. One agency sale > 20 hobbyist sales.
4. **Monetize free traffic** — once you clear ~10k pageviews/mo, add tasteful dev-audience
   ads (Carbon) or an affiliate strip. This pays even from visitors who never buy Pro.

$5k by EOY is realistic only if a traffic channel is producing by ~month 3. Protect that
timeline: ship the tutorials, work the calendar, and let the funnel data — not your gut —
pick where to spend the next hour.

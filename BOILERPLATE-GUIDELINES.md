# Boilerplate Guidelines — Astro + Keystatic marketing site

## Overview

This file describes the **reusable skeleton** of a finished Astro site (source project: a designer portfolio). It was extracted from the code as it exists, nothing invented. Hand it to a coding agent that is setting up a **new** project. It needs no other context.

Every component has two layers:

| Layer | What it contains | Reused? |
|---|---|---|
| **Skeleton** | Structure, behaviour, animation logic, accessibility, responsive logic, props | Yes, copy as-is |
| **Skin** | Colours, fonts, radius, padding, font weight, exact sizes, copy | No, changes per project |

How to read it:

- Rules come first, then code. Code snippets are copied from the source project. Where a value is skin, it appears as a CSS variable (`var(--…)`) or as `<PLACEHOLDER>`, or it is called out in a "Skin" line.
- Pixel values inside snippets (e.g. `height: 40px`) are the source project's skin. Keep the *shape* of the rule and replace the number with the new project's design value.
- "Source:" gives the file path in the source project.
- Inconsistencies found in the source are flagged with **⚠ Inconsistency** and collected again in [Open questions](#open-questions).
- Brand colours, font families, copy and images are per-project inputs (see the end). Typography sizes have a **generic default chart** in §6 that works for most marketing sites; a project only changes it when its design says otherwise.

**How a new project should use this file**

1. Set up the project (§4).
2. Create the token files with the new project's skin values (§4.4). Start typography from the default chart in §6.
3. Copy the global CSS patterns (§1 and §3).
4. Build components from the skeletons (§2).
5. Fill in every item in [Per-project inputs](#per-project-inputs).

---

## 1. Animation system

> **New projects:** build entrance animations (page-load intro, nav intro, scroll reveal) and their controls from **§7 Entrance animation system**. This §1 documents how the source project did it, and is the reference for hover, menu and other component motion.

### 1.1 Methods and where they're set up

| Method | Used for | Set up in |
|---|---|---|
| **CSS `@keyframes`** (play once on load) | Hero intro, nav intro, scroll reveal, modal open/close, live-dot pulse | `src/components/home/Hero.astro`, `src/components/layout/Nav.astro`, `src/styles/global.css`, `src/components/home/ProjectModal.astro`, `src/components/ui/LiveDot.astro` |
| **CSS transitions** | Every hover/focus state, mobile menu, card hover, filter fades, modal gallery cross-fade | each component's `<style>` |
| **IntersectionObserver** (vanilla) | Scroll reveal trigger, lazy video load + pause offscreen, lazy 3rd-party embed load | `src/scripts/reveal.ts`, `src/scripts/videos.ts`, `src/components/home/BookCall.astro` |
| **Scroll listener + `requestAnimationFrame` → CSS var** | Hero scroll parallax, nav "scrolled" state | `src/components/home/Hero.astro`, `src/components/layout/Nav.astro` |
| **Lenis** (`lenis`) | Smooth scrolling, anchor offset, scroll lock | `src/scripts/scroll.ts` (called from `src/layouts/Base.astro`) |
| **Embla Carousel** (`embla-carousel` + `embla-carousel-autoplay`) | Showcase sliders, modal thumbnail strip | `src/components/home/ShowcaseGallery.astro`, `src/components/home/ProjectModal.astro` |
| **Native `<dialog>`** | Modal (focus trap, Esc, backdrop) | `src/components/home/ProjectModal.astro` |

Not used: GSAP, Motion/Framer Motion, View Transitions, page transitions. The source brief forbids GSAP and heavy animation libraries ("CSS plus a little vanilla JS is enough"), and no React runs on public pages.

**Rule: animations are CMS-tunable.** Each named animation reads its easing, time and delay from CSS custom properties `--m-<name>-ease`, `--m-<name>-time`, `--m-<name>-delay`. Every use has a hard-coded fallback: `var(--m-reveal-time, 0.8s)`. The values come from Keystatic "Motion" singletons, are converted to CSS by `src/lib/motion.ts`, and are injected as an inline `<style>` in `Base.astro`. See §1.10.

### 1.2 Duration and easing tokens

The source never defines named easing tokens in CSS. The curves are repeated inline as fallbacks. Grouped here as proposed tokens, with what each one is used for:

| Proposed token | Value | Used for | Count in code |
|---|---|---|---|
| `--ease-smooth` | `cubic-bezier(.22, 1, .36, 1)` | **Default for everything that moves**: reveal, hero text, buttons, text roll, menu panel + items, modal, arrow button, menu icon, Showcase dots. It is also `DEFAULT_EASE` in `src/lib/motion.ts` and the "Smooth" preset. | ~27 |
| `--ease-arc` | `cubic-bezier(.15, .32, .1, .93)` | Large hero shapes (arc reveal, portrait rise) | 2 (+ CMS) |
| `--ease-nav` | `cubic-bezier(0, .77, .56, 1)` | Nav intro drop-in | 1 (+ CMS) |
| `ease` (keyword) | browser `ease` | Simple colour/opacity changes (link colour, chip bg, filter fade, gallery cross-fade, placeholder fade) | ~15 |
| `ease-out` (keyword) | `0, 0, .58, 1` | Work card hover (fallback + CMS preset "easeOut"), live-dot pulse | 6 |

| Proposed token | Value | Used for |
|---|---|---|
| `--dur-fast` | `150ms` | Text link colour (nav, footer) |
| `--dur-base` | `200ms` | Chip/social/AI button background, nav background on scroll, filter fade, arrow scale |
| `--dur-menu-icon` | `250ms` | Hamburger → × morph |
| `--dur-modal` | `300ms` | Modal open/close, gallery cross-fade, placeholder fade |
| `--dur-card` | `350ms` (fallback) | Work card hover, Arrow Button |
| `--dur-button` | `450ms` | Button hover (colour + chip move + label slide) |
| `--dur-roll` | `500ms` + `20ms`/letter | Text roll |
| `--dur-reveal` | `600ms` (CMS) / `800ms` (CSS fallback) | Scroll reveal |
| `--dur-menu` | `600ms` open / `300ms` close | Mobile menu panel |
| `--dur-hero-text` | `700ms` | Hero copy |
| `--dur-hero-shape` | `1.2s` arc / `1.4s` portrait | Hero shapes |

⚠ **Inconsistency: colour-hover durations** are 150ms (nav, footer links), 200ms (chips, socials, AI buttons) and 350ms (Arrow Button). 200ms is the most common.

⚠ **Inconsistency: CSS fallback ≠ CMS value.** The CMS value wins at runtime, but the fallback is what you get without the CMS.

| Animation | CSS fallback | CMS file value | Keystatic default |
|---|---|---|---|
| Reveal time | 0.8s | 0.6 | — |
| Nav intro time | 1s | 0.6 | — |
| Nav intro distance | 150px | 24 | 150 |
| Card hover time | 350ms | 0.3 | 0.35 |

In the new project, make the CSS fallback, the CMS default and the seed file agree.

**Rule (source behaviour):** use `--ease-smooth` for anything that travels (translate, clip-path, width, position). Use the plain `ease` keyword only for short colour or opacity changes.

### 1.3 Entrance: hero intro (plays once per page load, CSS only)

Rules:

- **Pure CSS keyframes**, starting on first paint, with no JS. Each element has its own animation with `both` fill.
- Layers (bottom → top): portrait (z 1) → arc (z 2) → content (z 3) → nav (z 4).
- **Order and delays** (s): arc 0 (1.2s, `--ease-arc`) → portrait 0.1 (1.4s, `--ease-arc`) → pill 0.45 → title 0.52 → subtitle 0.59 → button 1 0.66 → button 2 0.73.
  - The text items each take 0.7s with `--ease-smooth`.
  - The text stagger is **0.07s**.
- **Text:** opacity 0.001 → 1, `translateY(20px)` → 0.
- **Portrait:** rises from `translateY(portrait size × 1.667)` → 0, clipped by its wrapper's `overflow: hidden`.
- **Arc:** `clip-path: ellipse()` animates from a huge ellipse covering the hero to the resting ellipse. Mobile and desktop have separate keyframes, swapped with `animation-name` at 1024px.
- Start at `opacity: 0.001`, not 0, for anything that might be the LCP element. The browser ignores fully transparent text for Largest Contentful Paint.

Source: `src/components/home/Hero.astro`

```css
/* Timings come from the CMS (fallbacks = design spec). */
.hero__pill  { animation: hero-text var(--m-hero-pill-time, 0.7s)  var(--m-hero-pill-ease, var(--ease-text))  var(--m-hero-pill-delay, 0.45s) both; }
.hero__title { animation: hero-text var(--m-hero-title-time, 0.7s) var(--m-hero-title-ease, var(--ease-text)) var(--m-hero-title-delay, 0.52s) both; }
/* …one line per element… */

@keyframes hero-text {
  from { opacity: 0.001; transform: translateY(20px); } /* 0.001, not 0: browsers ignore fully invisible text for LCP */
  to   { opacity: 1;     transform: translateY(0); }
}
@keyframes hero-portrait {
  from { transform: translateY(var(--portrait-from)); }
  to   { transform: translateY(0); }
}
@keyframes hero-arc-mobile {
  from { clip-path: ellipse(4000px 1500px at 50% 1480px); }
  to   { clip-path: ellipse(var(--arc-rx) var(--arc-ry) at 50% calc(var(--nav-h) + var(--hero-gap-top) + var(--hero-portrait) + var(--arc-ry))); }
}
@media (min-width: 1024px) { .hero__arc { animation-name: hero-arc-desktop; } }
```

Skin: all delays, durations, the 20px distance, the ellipse sizes, the portrait size.

### 1.4 Entrance: nav intro (Home only, CSS only)

Rules:

- Enabled with a `nav--intro` class, which is set only when the nav overlays the hero (Home).
- **Sequence:** logo first, then each link `--m-nav-stagger` (0.05s) apart, then the CTA button / menu button `--m-nav-button-gap` (0.1s) after the last link.
- Movement: opacity 0.001 → 1, translate from `-distance` (from above) → 0.
- Easing `--ease-nav` `cubic-bezier(0, .77, .56, 1)`.
- The stagger index comes from an inline `style="--i:N"` on each item.

Source: `src/components/layout/Nav.astro`

```css
.nav__brand, .nav__item, .nav__actions, .nav__menu { --nav-delay: var(--m-nav-delay, 0.1s); }
.nav__item { --nav-delay: calc(var(--m-nav-delay, 0.1s) + var(--i) * var(--m-nav-stagger, 0.05s)); }
.nav__actions, .nav__menu {
  --nav-delay: calc(var(--m-nav-delay, 0.1s) + 5 * var(--m-nav-stagger, 0.05s) + var(--m-nav-button-gap, 0.1s));
}
.nav--intro :is(.nav__brand, .nav__item, .nav__actions, .nav__menu) {
  animation: nav-in var(--m-nav-time, 1s) var(--m-nav-ease, cubic-bezier(0, .77, .56, 1)) var(--nav-delay) both;
}
@keyframes nav-in {
  from { opacity: 0.001; translate: 0 calc(var(--m-nav-distance, 150px) * -1); }
  to   { opacity: 1;     translate: 0 0; }
}
```

⚠ **Inconsistency:** the `5 *` in the CTA delay is a hard-coded item count, while the nav has 4 links (indices 1–4). The CTA therefore waits one stagger longer than "right after the last link". Use `(linkCount + 1)` or pass the count as a variable.

### 1.5 Scroll reveal (site-wide)

Rules:

- **Mark-up:**
  - Add `data-reveal` to any element that should rise and fade in.
  - Add `data-reveal-group` to a container (e.g. a carousel row). The whole group reveals at once when the container enters, and its children are ordered left → right.
- **What animates:** opacity 0.001 → 1, `translate: 0 24px` → 0.
  - Time 0.6s (CMS) / 0.8s fallback, `--ease-smooth`.
  - Distance `--m-reveal-distance` (24px).
- **Stagger:** `--m-reveal-stagger` (0.05s) between elements that enter **in the same IntersectionObserver batch**.
  - Order = position on screen: top → bottom, then left → right.
  - Elements outside the screen horizontally (carousel slides) get delay 0.
- **Trigger:** `rootMargin: '0px 0px -40px 0px'`, `threshold: 0.01`. An element reveals when 1% of it is 40px above the bottom edge of the viewport.
- **Plays once:** elements are unobserved after they reveal.
- **Armed only when motion is allowed:** an inline script in `<head>` adds `.reveal-on` to `<html>` before paint. Without that class nothing is hidden, so there's no flash and no hidden content under reduced motion.
- Uses the individual **`translate` property and an animation**, not `transform`/transition, so it never collides with a component's own `transform` transitions.

Sources: `src/scripts/reveal.ts`, `src/styles/global.css`, `src/layouts/Base.astro`

```html
<!-- Base.astro <head>: arm reveals before first paint -->
<script is:inline>
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('reveal-on');
</script>
```

```css
/* global.css */
/* 0.001 instead of 0 looks the same, but lets the browser count the content as painted (LCP). */
.reveal-on [data-reveal] { opacity: 0.001; }
.reveal-on [data-reveal].is-revealed {
  opacity: 1;
  animation: reveal-in var(--m-reveal-time, 0.8s) var(--m-reveal-ease, cubic-bezier(.22, 1, .36, 1)) var(--reveal-delay, 0s) both;
}
@keyframes reveal-in {
  from { opacity: 0.001; translate: 0 var(--m-reveal-distance, 24px); }
  to   { opacity: 1;     translate: 0 0; }
}
```

```ts
// src/scripts/reveal.ts
export function initReveal() {
  const root = document.documentElement;
  if (!root.classList.contains('reveal-on')) return;

  const stagger = () => parseFloat(getComputedStyle(root).getPropertyValue('--m-reveal-stagger')) || 0.05;

  const show = (els: HTMLElement[]) => {
    const s = stagger();
    els
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .sort((a, b) => Math.round(a.r.top - b.r.top) || a.r.left - b.r.left)
      .forEach(({ el, r }, i) => {
        // Items outside the screen horizontally (carousel slides) don't wait their turn.
        const offscreen = r.right < 0 || r.left > window.innerWidth;
        el.style.setProperty('--reveal-delay', `${offscreen ? 0 : i * s}s`);
        el.classList.add('is-revealed');
      });
  };

  const io = new IntersectionObserver(
    (entries) => {
      const batch: HTMLElement[] = [];
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        if (el.hasAttribute('data-reveal-group')) {
          batch.push(...el.querySelectorAll<HTMLElement>('[data-reveal]'));
        } else {
          batch.push(el);
        }
      }
      if (batch.length) show(batch);
    },
    { rootMargin: '0px 0px -40px 0px', threshold: 0.01 },
  );

  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((g) => io.observe(g));
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (!el.closest('[data-reveal-group]')) io.observe(el);
  });
}
```

**Where reveals are placed (pattern):** section titles, each filter chip, each card tile, card title and each tag separately, each list item, each footer link. Reveals are fine-grained: one `data-reveal` per visual item, not one per section.

### 1.6 Scroll-linked motion

**Hero parallax.** The hero is `position: sticky; top: 0` and later sections scroll over it.

- A scroll listener, throttled with rAF, writes `--scroll` (px, capped at `hero height + viewport height`) onto the hero.
- CSS turns it into `translate` + `scale` per layer.
- Speeds come from the CMS as per-pixel factors.
- Off under reduced motion: the script doesn't attach.

Source: `src/components/home/Hero.astro`, `src/styles/global.css`

```ts
const hero = document.querySelector<HTMLElement>('.hero');
if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let ticking = false;
  const update = () => {
    ticking = false;
    const limit = hero.offsetHeight + window.innerHeight; // only while the hero can still be seen
    hero.style.setProperty('--scroll', String(Math.min(window.scrollY, limit)));
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}
```

```css
.hero { position: sticky; top: 0; z-index: 0; isolation: isolate; }
.hero ~ * { position: relative; z-index: 1; } /* global.css: everything after the hero scrolls over it */
.hero__arc, .hero__content {
  translate: 0 calc(var(--scroll, 0) * var(--m-parallax-content, -0.1085) * 1px);
  scale: calc(1 + var(--scroll, 0) * var(--m-parallax-content-scale, 0.000016));
}
.hero__portrait-clip {
  translate: 0 calc(var(--scroll, 0) * var(--m-parallax-portrait, 0.016) * 1px);
  scale: calc(1 + var(--scroll, 0) * var(--m-parallax-portrait-scale, -0.000032));
}
```

Rule: parallax uses the individual `translate`/`scale` properties, so it doesn't conflict with the intro keyframes, which use `transform`.

**Nav on scroll.** The nav is sticky. It does **not** hide or show. After `scrollY > 4` it gets `.is-scrolled`: a frosted background (`--surface-overlay` + `backdrop-filter: blur(12px)`), transitioning `background-color 200ms ease`. The listener is rAF-throttled and passive. See §2.3.

### 1.7 Interaction animations

**Global rules (used in every component):**

1. **Hover styles only on real pointers.** Wrap them in `@media (hover: hover) and (pointer: fine) { … }`. Touch devices never get "sticky" hover.
2. **Every hover state has an identical `:focus-visible` state**, written outside the media query so keyboards always get it.
3. **Focus ring**, global: `:focus { outline: none; } :focus-visible { outline: 2px solid var(--text-primary); outline-offset: 2px; }`. Skin: colour, 2px width, 2px offset.
4. **No press/`:active` animations exist** in the source. The only `:active` style is `cursor: grabbing` on draggable carousels.

**Button — "Chip Sweep"** (`src/components/ui/Button.astro`). All parts use `--m-button-time` (0.45s) and `--m-button-ease` (`--ease-smooth`).

- Primary:
  - Background → `--button-primary-bg-hover`.
  - The square chip (holding a chevron) moves from the left edge to the right edge by transitioning `left` to `calc(100% - <chip + inset>)`.
  - On `hug` layout the label slides left by the chip width (`translate: -32px 0`, sm `-28px`).
  - On `fill` layout the label stays centred.
- Secondary-chip: the chip grows to fill the button (`width: calc(100% - 6px)`) and the label slides left 24px.
- Plain secondary: background, border and text colours change.
- Rule: the chip always keeps the same inset (4px in the source) to every button edge it touches, in every state.

**Arrow Button** (`src/components/ui/ArrowButton.astro`). A circle holding two stacked copies of the same arrow icon in one grid cell.

- Rest: arrow A in place, arrow B offset `translate(-18px, 18px)` (outside, clipped by `overflow: hidden`).
- Active: the fill changes, A exits to `translate(18px, -18px)`, B enters to `translate(0, 0)`.
- Timing: 350ms `--ease-smooth`, hard-coded, not CMS.
- **Triggered by any ancestor with class `.arrow-trigger`** being hovered or focused, e.g. the whole card.

```css
.arrow-btn :global(svg) { grid-area: 1 / 1; transition: transform 350ms cubic-bezier(.22, 1, .36, 1); }
.arrow-btn :global(.arrow-btn__b) { transform: translate(-18px, 18px); }
.arrow-btn:focus-visible :global(.arrow-btn__a),
:global(.arrow-trigger:focus-visible) .arrow-btn :global(.arrow-btn__a) { transform: translate(18px, -18px); }
.arrow-btn:focus-visible :global(.arrow-btn__b),
:global(.arrow-trigger:focus-visible) .arrow-btn :global(.arrow-btn__b) { transform: translate(0, 0); }
@media (hover: hover) and (pointer: fine) {
  .arrow-btn:hover :global(.arrow-btn__a),
  :global(.arrow-trigger:hover) .arrow-btn :global(.arrow-btn__a) { transform: translate(18px, -18px); }
  .arrow-btn:hover :global(.arrow-btn__b),
  :global(.arrow-trigger:hover) .arrow-btn :global(.arrow-btn__b) { transform: translate(0, 0); }
}
```

**Text-link roll** (`src/components/ui/RollText.astro` + `src/styles/global.css`). Used on nav links and every footer link.

- The text is rendered twice, one `<span>` per letter. The second row (the clone) sits right below the first, at `top: 100%`, inside an `overflow: hidden` box.
- On hover or focus of the nearest `.roll-trigger`, every letter moves `translateY(-100%)`. Letters are staggered by `--i × --m-roll-stagger` (0.02s), take 0.5s each, and use `--ease-smooth`.
- The clone row has its own colour (skin: `--text-accent`).
- Screen readers get the text once, through `.sr-only`. Both visual rows are `aria-hidden`.

```astro
---
interface Props { text: string }
const { text } = Astro.props;
const chars = [...text];
---
<span class="roll"
  ><span class="roll__row" aria-hidden="true"
    >{chars.map((c, i) => <span class="roll__char" style={`--i:${i}`}>{c === ' ' ? ' ' : c}</span>)}</span
  ><span class="roll__row roll__row--clone" aria-hidden="true"
    >{chars.map((c, i) => <span class="roll__char" style={`--i:${i}`}>{c === ' ' ? ' ' : c}</span>)}</span
  ><span class="sr-only">{text}</span></span
>
```

```css
.roll { position: relative; display: inline-block; overflow: hidden; vertical-align: top; }
.roll__row { display: block; white-space: pre; }
.roll__row--clone { position: absolute; left: 0; top: 100%; color: var(--text-accent); }
.roll__char {
  display: inline-block;
  transition: transform var(--m-roll-time, 0.5s) var(--m-roll-ease, cubic-bezier(.22, 1, .36, 1));
  transition-delay: calc(var(--i, 0) * var(--m-roll-stagger, 0.02s));
}
@media (hover: hover) and (pointer: fine) {
  .roll-trigger:hover .roll__char { transform: translateY(-100%); }
}
.roll-trigger:focus-visible .roll__char { transform: translateY(-100%); }
```

(The whitespace-free JSX formatting, with `>` at the start of lines, is deliberate: it stops Astro inserting spaces between the spans.)

**Card hover** (`src/components/home/WorkCard.astro`). All parts use `--m-card-time` (350ms fallback) and `--m-card-ease` (`ease-out`).

1. The image wrapper's `inset` animates from `var(--inset-y) var(--inset-x)` to `0`, so the image grows to fill the tile. This is the "zoom".
   - The padding is CMS-controlled (`--card-pad-{y,x}-{m,d}`).
   - When both paddings are 0, there is nothing to grow into, so the wrapper `scale`s to `--zoom` (1.05) instead.
2. A 1px inset outline (`::after` with `box-shadow: inset`) fades in.
3. A frosted overlay fades in (`backdrop-filter: blur(18px)`). It exists only on hover-capable devices (`display: none` otherwise).
4. The overlay's label + Arrow Button rise 16px (`translateY(16px)` → none).
5. The card has class `arrow-trigger`, so its Arrow Button plays too.

```css
.work-card__image {
  position: absolute;
  inset: var(--inset-y) var(--inset-x);
  transition: inset var(--m-card-time, 350ms) var(--m-card-ease, ease-out),
    scale var(--m-card-time, 350ms) var(--m-card-ease, ease-out);
}
@media (hover: hover) and (pointer: fine) {
  .work-card__overlay { display: grid; }
  .work-card:hover .work-card__image,
  .work-card:focus-visible .work-card__image { inset: 0; scale: var(--zoom); }
  .work-card:hover .work-card__tile::after,
  .work-card:focus-visible .work-card__tile::after,
  .work-card:hover .work-card__overlay,
  .work-card:focus-visible .work-card__overlay { opacity: 1; }
  .work-card:hover .work-card__view,
  .work-card:focus-visible .work-card__view { transform: none; }
}
```

⚠ **Inconsistency:** in the card, the `:focus-visible` rules sit *inside* the hover media query, unlike rule 2. Keyboard focus therefore shows no overlay on touch-only devices.

**Other small interactions:**

| Element | Effect | Source |
|---|---|---|
| Nav / footer link | colour → primary text, 150ms `ease` (+ roll) | `Nav.astro`, `Footer.astro` |
| Filter chip (inactive) | background → tertiary, 200ms `ease` | `WorkSection.astro` |
| Social box, AI icon button | background change, 200ms `ease` | `Nav.astro`, `Footer.astro` |
| Carousel arrow buttons | `scale: 1.05`, 200ms `ease` | `ShowcaseGallery.astro`, `ProjectModal.astro` |
| Inline text link | `text-decoration: underline` on hover, no transition | `Pricing.astro` |
| Carousel viewport | `cursor: grab` / `grabbing` while dragging | `ShowcaseGallery.astro` |

### 1.8 Mobile menu, step by step

Source: `src/components/layout/Nav.astro` (the menu lives inside the nav component; there is no separate file).

**Opening (tap the menu button):**

1. JS `setOpen(true)` runs. It:
   - adds `.is-open` on the `<header>`;
   - sets `aria-expanded="true"` and `aria-label="Close menu"` on the toggle;
   - removes `inert` from the panel;
   - calls `lockScroll(true)`;
   - moves focus to the first link in the panel.
2. **Icon:** two 1.5px lines (gap 5px) morph into ×. Both move to `top: 2.5px` and rotate ±45°: `transform` + `top`, 250ms `--ease-smooth`.
3. **Header background** switches to solid `--bg-primary` (from transparent or frosted).
4. **Panel:** positioned `absolute; top: 100%` under the header, full width, `height: calc(100dvh - <nav height>)`. It **unrolls from the top**: `clip-path: inset(0 0 100% 0)` → `inset(0 0 0 0)`, `--m-menu-time` (0.6s), `--ease-smooth`. `visibility` flips to visible immediately.
5. **There is no background overlay or scrim.** The panel covers the whole screen below the nav.
6. **Items come in one after another.** Stagger index `--i` = position in DOM order: links 0…n-1, then the CTA, then each social link, then the copyright line.
   - Delay = `--m-menu-item-delay` (0.15s) + `--i × --m-menu-item-stagger` (0.05s).
   - Time `--m-menu-item-time` (0.5s), `--ease-smooth`.
   - **Links** slide in from the **left** (`translate: -12px 0` → 0). The **CTA, social links and copyright** rise from **below** (`translate: 0 12px` → 0, class `nav__anim--up`). All fade from opacity 0 → 1.

**Closing:**

- Triggers: the toggle, a tap on any panel link (it closes without returning focus, so navigation proceeds), **Escape**, or the window growing to desktop width (`matchMedia('(min-width: 1024px)')` change).
- The panel rolls back up in **half** the open time (`--menu-close: calc(var(--m-menu-time) * 0.5)`). `visibility: hidden` is delayed until the roll finishes.
- Items all fade and slide out **together** (no stagger), over `--menu-close` with `ease`.
- Focus returns to the toggle (except after a link tap). `inert` is restored and the scroll unlocked.

**Tap outside:** there is no handler, because there's no outside area: the panel fills the viewport under the nav.

**Keyboard:** Escape closes. **Tab is trapped** inside the header (nav + panel) while open: the first and last focusables wrap around. The closed panel is `inert`, so it can't be tabbed into.

**Scroll lock:** `lockScroll()` adds `html.is-locked { overflow: hidden }` and stops Lenis. The panel has `data-lenis-prevent`, so it can still scroll internally.

```html
<button class="nav__menu" type="button" aria-label="Open menu" aria-expanded="false"
        aria-controls="mobile-menu" data-menu-toggle>
  <span class="nav__menu-icon" aria-hidden="true"><span></span><span></span></span>
</button>
<div class="nav__panel" id="mobile-menu" data-menu-panel data-lenis-prevent inert>
  <nav aria-label="Mobile">
    <ul role="list"><li class="nav__anim" style="--i:0"><a …>…</a></li> …</ul>
    <div class="nav__anim nav__anim--up" style="--i:N">…CTA…</div>
  </nav>
  <div>…social links (nav__anim--up), copyright (nav__anim--up)…</div>
</div>
```

```css
.nav__menu-icon { position: relative; width: 12px; height: 6.5px; }
.nav__menu-icon span {
  position: absolute; left: 0; width: 12px; height: 1.5px; border-radius: 1px; background: currentColor;
  transition: transform 250ms cubic-bezier(.22, 1, .36, 1), top 250ms cubic-bezier(.22, 1, .36, 1);
}
.nav__menu-icon span:first-child { top: 0; }
.nav__menu-icon span:last-child  { top: 5px; }
.is-open .nav__menu-icon span:first-child { top: 2.5px; transform: rotate(45deg); }
.is-open .nav__menu-icon span:last-child  { top: 2.5px; transform: rotate(-45deg); }

.nav__panel {
  position: absolute; top: 100%; left: 0; right: 0;
  height: calc(100dvh - 64px);              /* skin: nav height */
  display: flex; flex-direction: column; justify-content: space-between; gap: 20px;
  padding: 20px 20px calc(20px + env(safe-area-inset-bottom));
  background: var(--bg-primary);
  --menu-close: calc(var(--m-menu-time, 0.6s) * 0.5);
  clip-path: inset(0 0 100% 0);
  visibility: hidden;
  transition:
    clip-path var(--menu-close) var(--m-menu-ease, cubic-bezier(.22, 1, .36, 1)),
    visibility 0s linear var(--menu-close);
}
.is-open .nav__panel {
  clip-path: inset(0 0 0 0);
  visibility: visible;
  transition: clip-path var(--m-menu-time, 0.6s) var(--m-menu-ease, cubic-bezier(.22, 1, .36, 1)), visibility 0s;
}
.nav__anim {
  opacity: 0;
  translate: calc(var(--m-menu-item-distance, 12px) * -1) 0;
  transition: opacity var(--menu-close) ease, translate var(--menu-close) ease;
}
.nav__anim--up { translate: 0 var(--m-menu-item-distance, 12px); }
.is-open .nav__anim {
  opacity: 1;
  translate: 0 0;
  --d: calc(var(--m-menu-item-delay, 0.15s) + var(--i, 0) * var(--m-menu-item-stagger, 0.05s));
  transition:
    opacity var(--m-menu-item-time, 0.5s) var(--m-menu-item-ease, cubic-bezier(.22, 1, .36, 1)) var(--d),
    translate var(--m-menu-item-time, 0.5s) var(--m-menu-item-ease, cubic-bezier(.22, 1, .36, 1)) var(--d);
}
```

```ts
const setOpen = (open: boolean, returnFocus = true) => {
  nav.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  panel.inert = !open;
  lockScroll(open);
  if (open) panel.querySelector<HTMLElement>('a')?.focus();
  else if (returnFocus) toggle.focus();
};
toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false, false)));
nav.addEventListener('keydown', (e) => {
  if (!nav.classList.contains('is-open')) return;
  if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
  else if (e.key === 'Tab') {
    const items = focusables(); const first = items[0]; const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }
});
desktop.addEventListener('change', (e) => e.matches && nav.classList.contains('is-open') && setOpen(false, false));
```

⚠ **Inconsistency:** the header comment in `Nav.astro` (and the design spec text) still says the menu "fades in + moves 8px down over 250ms". The code does the clip-path unroll described above. Trust the code.

### 1.9 Other components with motion

**Modal** (`src/components/home/ProjectModal.astro`), native `<dialog>`:

- **Open:** `showModal()`, `lockScroll(true)`, the URL hash is set to `#project-<slug>` (`history.replaceState`), and the gallery starts.
  - Mobile: bottom sheet `translateY(100%)` → none.
  - Desktop (≥1024): opacity 0 → 1 + `translateY(8px)` → none.
  - Backdrop: fade in, plus `backdrop-filter: blur(12px)` on `::backdrop`.
  - All use `--m-modal-time` (0.3s) and `--m-modal-ease` (`--ease-smooth`).
- **Close (animated):** `closeAnimated()` adds `.is-closing`, which plays reversed keyframes with `forwards`. On `animationend` it calls `dialog.close()`. A safety `setTimeout` (modal time + 100ms) closes it if `animationend` never fires. Under reduced motion it closes instantly.
- **Close triggers:**
  - The close button (it has `autofocus`, so it gets focus on open).
  - **Esc**, by intercepting the `cancel` event and calling `preventDefault()` so the close animates.
  - **A click on the backdrop**: a click whose target is the dialog element itself, with coordinates outside its box.
- **After close (`close` event):** unlock scroll, clear the hash, stop the slideshow and videos. The browser returns focus to the opener.
- **Deep links:** `/#project-<slug>` opens that modal on load and on `hashchange`.
- **Gallery inside:**
  - The main image cross-fades: opacity 300ms `ease`, plus a `visibility` delay so hidden slides can't be focused.
  - Endless 3s slideshow (`setTimeout`). It pauses while the strip is dragged or the tab is hidden, and restarts after a thumbnail or arrow click.
  - Thumbnail strip = Embla `{ align: 'start', loop: true, active: n > 5 }`. The selected thumbnail is scrolled to the left end.
  - Strip arrows render only when there are more than 5 items.

```ts
const closeAnimated = (dialog: HTMLDialogElement) => {
  if (!dialog.open || dialog.classList.contains('is-closing')) return;
  if (reduceMotion()) return dialog.close();
  dialog.classList.add('is-closing');
  const done = () => { dialog.classList.remove('is-closing'); dialog.close(); };
  dialog.addEventListener('animationend', done, { once: true });
  const ms = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--m-modal-time')) || 0.3) * 1000;
  window.setTimeout(() => dialog.classList.contains('is-closing') && done(), ms + 100); // safety net
};
dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeAnimated(dialog); });
dialog.addEventListener('click', (e) => {
  if (e.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  if (!inside) closeAnimated(dialog);
});
dialog.addEventListener('close', () => { lockScroll(false); /* clear hash, stop gallery */ });
```

```css
.modal[open]            { animation: modal-sheet-in  var(--m-modal-time, 300ms) var(--m-modal-ease, cubic-bezier(.22, 1, .36, 1)); }
.modal[open]::backdrop  { animation: modal-fade-in   var(--m-modal-time, 300ms) var(--m-modal-ease, cubic-bezier(.22, 1, .36, 1)); }
.modal.is-closing       { animation: modal-sheet-out var(--m-modal-time, 300ms) var(--m-modal-ease, cubic-bezier(.22, 1, .36, 1)) forwards; }
.modal.is-closing::backdrop { animation: modal-fade-out var(--m-modal-time, 300ms) var(--m-modal-ease, cubic-bezier(.22, 1, .36, 1)) forwards; }
@media (min-width: 1024px) {
  .modal[open]      { animation-name: modal-pop-in; }
  .modal.is-closing { animation-name: modal-pop-out; }
}
@keyframes modal-sheet-in  { from { transform: translateY(100%); } to { transform: none; } }
@keyframes modal-sheet-out { from { transform: none; } to { transform: translateY(100%); } }
@keyframes modal-pop-in    { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes modal-pop-out   { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(8px); } }
@keyframes modal-fade-in   { from { opacity: 0; } to { opacity: 1; } }
@keyframes modal-fade-out  { from { opacity: 1; } to { opacity: 0; } }
```

**Slider / carousel** (`src/components/home/ShowcaseGallery.astro`). Two Embla carousels (top + bottom rows):

- **Options:** both rows `loop: true`, `duration: 38`, `skipSnaps: false`. The top row uses `align: 'center'`. The bottom row uses a custom align function that puts two half-width cards under the centred top slide.
- Embla cannot take a CSS easing curve. `duration: 38` approximates a ~1s slide.
- **Autoplay** (`embla-carousel-autoplay`): `delay: 4000` (4s hold + ~1s slide ≈ one move every 5s), `playOnInit: !reduceMotion`, and `stopOnInteraction`, `stopOnMouseEnter` and `stopOnFocusIn` all `false`.
- **Pausing:** autoplay pauses only while a row is being dragged (native `pointerdown` → `pointerup`/`pointercancel` on `window`) and while the tab is hidden (`visibilitychange`). **No pause on hover.**
- **Arrows** move both rows one step and reset both autoplay timers.
- **Dots** (top row only, one per unique slide):
  - Clicking jumps to the nearest copy of that slide and moves the bottom row the same number of steps.
  - The active dot gets `aria-current="true"` and stretches to a pill (a `width` transition).
- **Filling:** slides are repeated until there are at least 5 (top) / 12 (bottom). Embla silently disables `loop` when the content isn't wider than the viewport.
- **Before JS runs**, a CSS rule centres the first slide so there's no layout jump. It is removed once `.is-ready` is added.
- Each slide's gap is a `margin-right`, because Embla measures margins, not `gap`.

```ts
const autoplayOptions = { delay: 4000, playOnInit: !reduceMotion, stopOnInteraction: false, stopOnMouseEnter: false, stopOnFocusIn: false };
const autoplayTop = Autoplay(autoplayOptions);
const featured = EmblaCarousel(featuredEl, { loop: true, align: 'center', duration: 38, skipSnaps: false }, [autoplayTop]);

// pause only while dragged
viewport.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return;
  autoplay.stop();
  viewport.classList.add('is-dragging');
  const end = () => {
    viewport.classList.remove('is-dragging');
    if (canPlay()) autoplay.play();
    window.removeEventListener('pointerup', end);
    window.removeEventListener('pointercancel', end);
  };
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
});
document.addEventListener('visibilitychange', () => {
  for (const [, autoplay] of rows) document.hidden ? autoplay.stop() : canPlay() && autoplay.play();
});
```

```css
.showcase__track { display: flex; touch-action: pan-y pinch-zoom; }
.showcase__slide { flex: none; margin-right: var(--gap); } /* Embla measures margins */
.showcase:not(.is-ready) .showcase__track { margin-left: calc(50% - var(--slide-w) / 2); } /* no jump before JS */
```

**Filter fade** (`src/components/home/WorkSection.astro`):

1. Items that should leave fade out (`.is-fading` → opacity 0, 200ms `ease`).
2. After 200ms they get `hidden`, removing them from the layout. Items that should appear get `hidden = false` while still `.is-fading`.
3. Two `requestAnimationFrame`s later `.is-fading` is removed, so they fade in.
4. Under reduced motion the delay is 0.
5. Chips use `aria-pressed`.

**Live Dot** (`src/components/ui/LiveDot.astro`): an infinite pulse. The halo scales 1 → 2.4 while fading 0.45 → 0, over 1.4s `ease-out`. The reduced-motion global rule stops the loop (iteration count 1).

**Lazy embed** (`src/components/home/BookCall.astro`): a 3rd-party script (Cal.com) is injected only when its box comes within 600px of the viewport (IntersectionObserver, `rootMargin: '600px 0px'`, disconnected after the first hit). A placeholder fades out (300ms) when the embed reports ready.

**Background videos** (`src/scripts/videos.ts`):

- Videos have no `src` until their group (the nearest `[data-video-group]`, or the video itself) is within 400px of the viewport.
- They play while on screen and pause when off screen.
- They never autoplay under reduced motion.

**Not present in the source:** accordion/FAQ, tabs, marquee, page transitions, nav hide-on-scroll.

### 1.10 CMS-driven motion values (pattern)

Rules:

- One Keystatic singleton per component ("Hero intro", "Nav intro", "Scroll reveal", "Buttons", "Work card hover", "Text link roll", "Project modal", "Mobile menu", "Hero parallax"). Each is a YAML file in `src/content/motion/`.
- Each animation block has:
  - **Easing**: a conditional field, either `ease` (a preset or a custom Bézier string) or `spring` (stiffness / damping / mass);
  - `time` (s);
  - an optional `delay` (s);
  - optional extras (`distance`, `stagger`, …).
- `src/lib/motion.ts` merges all files and emits `:root{--m-<name>-ease:…;--m-<name>-time:…s;--m-<name>-delay:…s;}`.
  - **Springs are converted to a CSS `linear()` curve** sampled from a simulated damped spring (48 samples). Their duration is the spring's settle time; the Time field is ignored.
- `Base.astro` injects the result with `<style is:inline set:html={motionVars}>`.
- Keep `keystatic.config.ts` and `src/content.config.ts` schemas **exactly in sync**: same collections, same field names.

```ts
// src/lib/motion.ts (core)
const PRESETS: Record<string, [number, number, number, number]> = {
  linear: [0, 0, 1, 1], ease: [0.25, 0.1, 0.25, 1], easeIn: [0.42, 0, 1, 1], easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1], expoOut: [0.16, 1, 0.3, 1], smooth: [0.22, 1, 0.36, 1],
};

/** Damped spring from 0 → 1. Returns sampled positions and the time it takes to settle. */
function spring(stiffness: number, damping: number, mass: number) {
  const k = Math.max(1, stiffness), c = Math.max(0, damping), m = Math.max(0.1, mass);
  const dt = 1 / 600;
  let x = 0, v = 0, t = 0, settledFor = 0;
  const trace: [number, number][] = [[0, 0]];
  while (t < 10) {
    const a = (-k * (x - 1) - c * v) / m;
    v += a * dt; x += v * dt; t += dt;
    trace.push([t, x]);
    settledFor = Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.01 ? settledFor + dt : 0;
    if (settledFor > 0.05) break;
  }
  const duration = t, samples = 48, points: number[] = [];
  for (let i = 0; i <= samples; i++) {
    const target = (duration * i) / samples;
    const p = trace.find(([tt]) => tt >= target) ?? trace[trace.length - 1]!;
    points.push(i === samples ? 1 : Math.round(p[1] * 1e4) / 1e4);
  }
  return { css: `linear(${points.join(', ')})`, duration: Math.round(duration * 1e3) / 1e3 };
}

export async function motionCss(): Promise<string> {
  const entries = await getCollection('motion');
  if (!entries.length) return '';
  const m = Object.assign({}, ...entries.map((e) => e.data)) as Record<string, any>;
  const vars: string[] = [];
  const add = (name: string, anim: Anim | undefined, fallbackEase = DEFAULT_EASE) => {
    if (!anim) return;
    const { ease, time } = easingToCss(anim.easing, fallbackEase, anim.time);
    vars.push(`--m-${name}-ease: ${ease};`, `--m-${name}-time: ${time}s;`);
    if (anim.delay != null) vars.push(`--m-${name}-delay: ${anim.delay}s;`);
  };
  add('reveal', m.reveal);
  if (m.reveal) vars.push(`--m-reveal-distance: ${m.reveal.distance ?? 24}px;`, `--m-reveal-stagger: ${m.reveal.stagger ?? 0.05}s;`);
  // …one add() per animation…
  return `:root{${vars.join('')}}`;
}
```

The same pattern is used for **design values** (`src/lib/design.ts`): colours, border weights, hero layout and card padding go from Keystatic "Design" singletons to `:root:root{…}`. The doubled selector raises specificity so it always beats `tokens.css`. Values are validated before output: a colour regex, and numbers clamped to a min/max.

### 1.11 Desktop vs mobile differences

| Thing | Mobile / touch | Desktop / fine pointer |
|---|---|---|
| All hover effects | off (media query) | on |
| Card hover overlay | not rendered (`display: none`) | shown on hover/focus |
| Hero arc intro | mobile keyframes (smaller ellipse) | desktop keyframes |
| Nav | menu button + unrolling panel | inline links + CTA; the menu closes automatically if resized to desktop |
| Modal | bottom sheet slides up; sticky action bar with a fade | centred panel, fade + 8px rise |
| Text roll | only on `:focus-visible` | hover + focus |
| Showcase | same behaviour, smaller slide width | same |

Nothing is turned off purely for small screens. Everything that's off on mobile is off because of `hover: hover`/`pointer: fine`.

### 1.12 Reduced motion

Layers (all present in the source):

1. **Global CSS kill switch** (`src/styles/global.css`): every animation and transition is reduced to 0.01ms with no delay and one iteration, so elements show their end state at once. Smooth scroll is off.
2. **Reveal never armed**: the `.reveal-on` class isn't added (`Base.astro`), so nothing starts hidden.
3. **JS checks `matchMedia('(prefers-reduced-motion: reduce)')`** in each script:
   - Hero parallax doesn't attach.
   - Embla autoplay `playOnInit: false` and timers aren't reset.
   - The modal slideshow doesn't schedule.
   - The modal closes without animation.
   - The filter delay is 0.
   - Videos have `autoplay` removed and are paused.
4. **Lenis:** the source comment states "Lenis respects prefers-reduced-motion by itself". This was not verified in the source; see Open questions.

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transition-delay: 0s !important;
    scroll-behavior: auto !important;
  }
}
```

### 1.13 Smooth scroll and scroll lock (shared)

Source: `src/scripts/scroll.ts`

```ts
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenis: Lenis | null = null;
const navHeight = () => (window.matchMedia('(min-width: 1024px)').matches ? 85 : 64); // skin: nav heights

export function initScroll() {
  if (lenis) return lenis;
  lenis = new Lenis({
    autoRaf: true,
    anchors: { offset: -navHeight() }, // land below the sticky nav
    allowNestedScroll: true,
    stopInertiaOnNavigate: true,
  });
  return lenis;
}

/** Lock / unlock page scrolling (modal, mobile menu). */
export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle('is-locked', locked);
  if (locked) lenis?.stop();
  else lenis?.start();
}
```

```css
html { scroll-behavior: smooth; scroll-padding-top: 64px; }        /* skin: nav height */
@media (min-width: 1024px) { html { scroll-padding-top: 85px; } }
html.is-locked { overflow: hidden; }
```

Rule: any scrollable overlay (modal, menu panel) gets `data-lenis-prevent` so it scrolls natively while Lenis is stopped.

---

## 2. Component skeletons

General component rules:

- Components are `.astro` files with scoped `<style>` and, if needed, a vanilla `<script>`. Scripts are bundled and run once per page, so they loop over every instance (`for (const root of document.querySelectorAll('[data-x]'))`).
- **JS hooks are `data-*` attributes**, never classes: `data-nav`, `data-menu-toggle`, `data-reveal`, `data-open-project`, `data-close`, `data-filter`, `data-dot`…
- State goes in ARIA where one exists: `aria-expanded`, `aria-pressed`, `aria-current`, `aria-hidden`. Otherwise it's an `is-*` class (`is-open`, `is-scrolled`, `is-ready`, `is-dragging`, `is-closing`, `is-loaded`, `is-revealed`, `is-fading`).
- Styling a child component's inner elements uses `:global(...)` inside the scoped style.
- Every top-level JSDoc comment lists the spec section and the Figma component name. Keep this habit.

### 2.1 Button — `src/components/ui/Button.astro`

**Props:**

| Prop | Type | Default |
|---|---|---|
| `label` | `string` (required) | — |
| `variant` | `'primary' \| 'secondary' \| 'secondary-chip'` | `'primary'` |
| `size` | `'md' \| 'sm'` | `'md'` |
| `layout` | `'hug' \| 'fill'` | `'hug'` |
| `count` | `string?`, a small number after the label | — |
| `href` | `string?`: renders `<a>`, otherwise `<button>` | — |
| `external` | `boolean`, adds `target="_blank" rel="noopener noreferrer"` | `false` |
| `type` | `'button' \| 'submit'` | `'button'` |
| `class` | `string?` | — |
| `...rest` | passed to the element | — |

**Structure:** `<Tag class="btn btn--{variant} btn--{size} btn--{layout}">` contains:

- `<span class="btn__chip" aria-hidden="true">` with a chevron icon (primary and secondary-chip only);
- `<span class="btn__label">`;
- optional `<span class="btn__count">`.

**Behaviour:** see §1.7. The chip is absolutely positioned and the label sits above it at `z-index: 1`. The button has `overflow: hidden` and `-webkit-tap-highlight-color: transparent`.

**Accessibility:** a real `<a>` or `<button>`, with the visible label as its name. The chip is `aria-hidden`.

**Skin:**
- Heights (md / sm).
- Radius (button and chip).
- Padding: left padding = chip width + inset + gap.
- Chip width and inset.
- Label slide distance.
- Font size, weight and letter-spacing.
- All colours (`--button-*`).
- Border width (`--border-width`, `--border-width-thin`).

```astro
---
import Icon from './Icon.astro';
interface Props {
  label: string; variant?: 'primary' | 'secondary' | 'secondary-chip'; size?: 'md' | 'sm';
  layout?: 'hug' | 'fill'; count?: string; href?: string; external?: boolean;
  type?: 'button' | 'submit'; class?: string; [key: string]: unknown;
}
const { label, variant = 'primary', size = 'md', layout = 'hug', count, href, external = false,
        type = 'button', class: className, ...rest } = Astro.props;
const hasChip = variant === 'primary' || variant === 'secondary-chip';
const classes = ['btn', `btn--${variant}`, `btn--${size}`, `btn--${layout}`, className];
const Tag = href ? 'a' : 'button';
const tagProps = href ? { href, ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}) } : { type };
---
<Tag class:list={classes} {...tagProps} {...rest}>
  {hasChip && <span class="btn__chip" aria-hidden="true"><Icon name="chevron-right" /></span>}
  <span class="btn__label">{label}</span>
  {count && <span class="btn__count">{count}</span>}
</Tag>
```

Note: the `secondary-chip` variant exists but is unused in the source pages.

### 2.2 Arrow Button — `src/components/ui/ArrowButton.astro`

- **Props:** `href?`, `label?`, `class?`.
  - With `href`: an `<a aria-label={label}>`.
  - Without: a decorative `<span aria-hidden="true">`, used inside a card that is itself the button.
- **Structure:** a circle containing two copies of the same icon in one grid cell.
- **Behaviour:** see §1.7. Triggered by its own hover/focus or by any `.arrow-trigger` ancestor.
- **Skin:** diameter, border width and colour, fill colours, the icon, the 18px travel distance (≈ icon size).

### 2.3 Nav — `src/components/layout/Nav.astro`

**Props:**
- `overlay?: boolean`: Home only. The nav overlaps the hero via a negative `margin-bottom` equal to its height, starts transparent, and enables the intro animation.
- Plus any data the links need (the source passes a `worksCount` string shown after one link).

**Structure:** a `<header class="nav" data-nav>` containing:

- `.nav__row`, a 3-column grid on desktop (`1fr auto 1fr`, so the links stay centred):
  - brand (`Logo`);
  - `<nav aria-label="Main"><ul role="list">` of links, each wrapped in `RollText`;
  - the CTA `Button size="sm"`;
  - the menu button (mobile only).
- `.nav__panel#mobile-menu`, the mobile menu (§1.8).

**Behaviour:**
- `position: sticky; top: 0; z-index: <above page, below modal>`.
- `.is-scrolled` (frosted) after 4px of scroll.
- `.is-open` gives a solid background.
- The current page link gets `aria-current="page"` (`Astro.url.pathname` with the trailing slash stripped).

**Accessibility:**
- Two `<nav>` landmarks with distinct `aria-label`s ("Main", "Mobile").
- The menu button has `aria-expanded`, `aria-controls` and a dynamic `aria-label`.
- The closed panel is `inert`. Focus is trapped while open. Esc closes it.
- External social links get `target="_blank" rel="noopener noreferrer"` and a `.sr-only` " (opens in a new tab)".
- Links without a URL render as a `<span>`, not a dead link.

**Responsive:** below 1024 the inline links and CTA are hidden and the menu button is shown; at ≥1024 the opposite.

**Skin:** nav height (mobile / desktop) and padding, the border-bottom, link font size, gap and padding, the menu button size and radius, the blur amount, the panel padding, the social grid (2×2 below a narrow width, otherwise 4 across), copy.

⚠ **Inconsistency:** the nav height appears hard-coded in four places that must agree: `Nav.astro` (height + overlay negative margin), `Hero.astro` (`--nav-h`), `global.css` (`scroll-padding-top`) and `scroll.ts` (`navHeight()`). In a new project make it one token (e.g. `--nav-h`), and read it in JS with `getComputedStyle`.

### 2.4 Footer — `src/components/layout/Footer.astro`

- **Structure:** `<footer>` with a top border, containing:
  - `.container .footer__content`: the brand block (logo, blurb, location, optional icon-button row) and `<nav aria-label="Footer">` with columns, each an `<h2>` + `<ul role="list">`;
  - a full-width decorative logo graphic (`aria-hidden`, a `<picture>` with desktop and mobile sources);
  - `.footer__bottom`: copyright + legal links + "Back to top" (`href="#top"`, where `<body id="top">`).
- **Behaviour:**
  - Every link uses `RollText` + `.roll-trigger`.
  - Items without a destination render as `<span class="footer__link--static">`, which still rolls on hover.
  - Every item has `data-reveal`.
- **Layout:** columns wrap on mobile and sit in one row with a fixed large gap on desktop. Brand and columns stack on mobile and form a row at ≥1024.
  - The bottom row's hairline is a `::before` positioned inside the container's side padding, so it lines up with the content, not the screen edge.
- **Accessibility:**
  - Icon-only buttons have an `aria-label` that includes "(opens in a new tab)", plus `title`.
  - External links get the `.sr-only` suffix.
  - Flex `li`s avoid line-height struts, so gaps are exact.
- **Skin:** padding top (mobile / desktop), column widths and gaps, icon button size, copy, the logo graphic.

### 2.5 Section wrapper, container, inner — `src/styles/global.css`

Rules:

- Each section is a `<section class="section <name>" id="<anchor>" aria-labelledby="<title-id>">`.
- `.section` adds vertical padding (mobile → desktop).
- `.container` adds max-width + side padding and centres the content.
- `.container--full` removes the max-width and uses the nav's side padding instead. Used for full-bleed grids.
- `.section__inner` is a flex column with the standard header → content gap.
- Each section sets its own background colour.

```css
.container {
  width: 100%;
  max-width: calc(<CONTENT_MAX>px + 2 * <SIDE_PAD_DESKTOP>px);
  margin-inline: auto;
  padding-inline: <SIDE_PAD_MOBILE>px;
}
@media (min-width: 1024px) { .container { padding-inline: <SIDE_PAD_DESKTOP>px; } }
.container--full { max-width: none; }
@media (min-width: 1024px) { .container--full { padding-inline: <NAV_SIDE_PAD_DESKTOP>px; } }

.section { padding-block: <SECTION_PAD_MOBILE>px; }
.section__inner { display: flex; flex-direction: column; gap: <HEADER_GAP_MOBILE>px; }
@media (min-width: 1024px) {
  .section { padding-block: <SECTION_PAD_DESKTOP>px; }
  .section__inner { gap: <HEADER_GAP_DESKTOP>px; }
}
```

```astro
<section id="pricing" class="section pricing" aria-labelledby="pricing-title">
  <div class="container section__inner">
    <SectionHeader title="…" id="pricing-title" />
    …content…
  </div>
</section>
```

### 2.6 Section header (heading block) — `src/components/ui/SectionHeader.astro`

- **Props:**
  - `title: string`;
  - `id?: string`, the heading id for `aria-labelledby`;
  - `stackUntilXl?: boolean`, which keeps the stacked layout up to 1279px when the side slot is too wide for one row at 1024.
  - A default slot holds the optional right-side content (filters, meta list).
- **Structure:** `<h2 class="t-display" data-reveal>`, plus `.section-header__aside` only if the slot has content (`Astro.slots.has('default')`).
- **Layout:**
  - Mobile: a column, left-aligned, small gap.
  - Desktop: a row, `space-between`, `align-items: flex-end` (bottom-aligned).
- **Rule from the source:** there are no subheadings.
- **Skin:** the type role, the gaps.

```astro
---
interface Props { title: string; id?: string; stackUntilXl?: boolean }
const { title, id, stackUntilXl = false } = Astro.props;
const hasAside = Astro.slots.has('default');
---
<div class:list={['section-header', { 'section-header--stack-xl': stackUntilXl }]}>
  <h2 class="t-display section-header__title" id={id} data-reveal>{title}</h2>
  {hasAside && <div class="section-header__aside"><slot /></div>}
</div>
<style>
  .section-header { display: flex; flex-direction: column; align-items: flex-start; gap: 20px; }
  @media (min-width: 1024px) {
    .section-header { flex-direction: row; align-items: flex-end; justify-content: space-between; gap: 32px; }
  }
  @media (min-width: 1024px) and (max-width: 1279px) {
    .section-header--stack-xl { flex-direction: column; align-items: flex-start; justify-content: flex-start; gap: 20px; }
  }
</style>
```

### 2.7 Card (clickable media card) — `src/components/home/WorkCard.astro`

- **Props:** `project` (a content entry with `title`, `tags[]`, `thumbnail` media, `category`).
- **Structure:** the whole card is **one `<button type="button" aria-haspopup="dialog" data-open-project={id} class="work-card arrow-trigger">`** containing:
  - `.work-card__tile`: a fixed aspect-ratio box with `overflow: hidden`, holding:
    - `.work-card__image` (absolute, inset = padding), which wraps `<Media>`;
    - the hover overlay (`aria-hidden`);
  - `.work-card__meta`: the title + tags. Tags are separated by a 1px divider drawn with `::before`.
- **Behaviour:** see §1.7. The click is handled by the modal script (`[data-open-project]`).
- **Accessibility:**
  - **No `aria-label`**, so the accessible name equals the visible title + tags. This avoids Lighthouse's "label-content-name-mismatch".
  - The overlay is `aria-hidden`.
- **Skin:** the tile aspect ratio, the tile background, the image padding (CMS), the overlay blur and colour, the label size, the 16px rise, the meta gap, the divider size.

### 2.8 Filter chips — `src/components/home/WorkSection.astro`

- **Structure:** a `<div role="group" aria-label="Filter projects">` of `<button class="chip" aria-pressed data-filter="<value>">`. The first is "All". Grid items carry `data-category`.
- **Behaviour:** see §1.9 (filter fade).
- **Style rule:** the active state is `[aria-pressed='true']`, so state and style share one source.
- **Skin:** height, padding, radius, colours.

### 2.9 Modal — `src/components/home/ProjectModal.astro`

- **Props:** `project`, `index`, `total`.
  - One `<dialog>` per item, rendered at build time.
  - Given `id="project-<slug>"`, `aria-labelledby` pointing to its `<h2>`, and `data-lenis-prevent`.
- **Structure:**
  - grabber (mobile only);
  - a top row with a counter and a close button (`aria-label="Close"`, `autofocus`);
  - the gallery (main slides + thumbnail strip);
  - the body (title, summary, tags list, spacer, `<dl>` of stats, CTA);
  - a mobile sticky action bar.
- **Layout:**
  - Mobile: a bottom sheet (`position: fixed; inset: <top gap> 0 0 0`, `overflow-y: auto`, `overscroll-behavior: contain`).
  - Desktop (≥1024): a two-column grid (gallery | details). Widths are computed in CSS variables so a height-capped gallery never leaves a gap.
  - A spacer (`flex: 1`) pushes the stats and button to the bottom of the details column.
- **Behaviour:** see §1.9.
- **Accessibility:**
  - Native dialog: focus is trapped, the page is made inert, Esc closes, focus returns to the opener.
  - Gallery slides that aren't active get `aria-hidden="true"` and `visibility: hidden`.
  - Thumbnails are `<button aria-pressed aria-label="Show item i of n">` inside `role="group" aria-label="Gallery"`.
  - Missing data hides its row (stats are filtered by value; the CTA only renders when `show && url`).
- **Skin:** the scrim colour and blur, the sheet top gap, padding, column widths, gallery ratio, thumbnail count, slide interval (3s), stat layout.

### 2.10 Carousel — `src/components/home/ShowcaseGallery.astro`

- **Props:** `featured[]`, `more[]`.
- **Structure:**
  - `<section aria-roledescription="carousel" aria-label="…" data-showcase>`;
  - per row: `.showcase__viewport` > `.showcase__track` > slides (`role="group" aria-roledescription="slide"`);
  - prev/next `<button aria-label>`;
  - a dots group (`<button aria-label="Go to slide n" aria-current>`).
- **Behaviour:** see §1.9.
- **Accessibility:** the arrows and dots are real buttons. Each dot gets an enlarged invisible hit area through `::after` with a negative inset. Slide media is decorative (`alt=""`).
- **Skin:** slide widths (mobile / desktop), gap, arrow size and offset, dot size, gap and active width, autoplay delay.

### 2.11 Media (image / video switch) — `src/components/ui/Media.astro`

- **Props:**
  - `media`: `{ discriminant: 'image', value: ImageMetadata } | { discriminant: 'video', value: { file, poster? } }`;
  - `alt`, `widths`, `sizes`, `loading`, `fetchpriority`, `class`;
  - `autoplay` (video only, default `true`).
- **Rules:**
  - Image: Astro `<Image>` with explicit `widths`/`sizes`.
  - GIF: a plain `<img>` with the original file, because optimisation would kill the animation.
  - Video: `muted loop playsinline`, `disablepictureinpicture`.
    - Real `autoplay` only when `loading="eager"`. Otherwise `data-autoplay` + `data-lazy-video` with `<source data-src>`, so `src/scripts/videos.ts` loads and plays it when near the screen.
    - `aria-hidden` when there's no alt.
    - The poster (optional) is converted with `getImage()` to WebP at the largest width.

### 2.12 Live Dot — `src/components/ui/LiveDot.astro`

- **Props:** `tone?: 'green' | 'dark'`, `class?`. `aria-hidden`.
- **Structure:** a core dot plus a halo dot stacked in one grid cell. The halo pulses (§1.9).
- **Skin:** sizes, colours, scale factor, duration.

### 2.13 Icon — `src/components/ui/Icon.astro`

- **Rule:** inline SVG from a typed map `{ name: { size, view, stroke, body } }`, drawn in `currentColor`, so it inherits text colour.
- Paths are copied exactly from the design file (Lucide shapes in the source). Icons are decorative (`aria-hidden`) unless they stand alone, in which case the parent gets the label.
- Inside flex rows, icons get `flex: none` so they never shrink. The source had a bug where icons shrank to 0 near 1230px.

### 2.14 Logo — `src/components/ui/Logo.astro`

- **Props:** `href?` (renders `<a>`, otherwise `<div>`), `class?`.
- The mark is an inline SVG with `fill="currentColor"`. As a link it gets `aria-label="<Name> — home"`.

### 2.15 Lazy third-party embed — `src/components/home/BookCall.astro`

- **Pattern:**
  - A box with `data-<embed>-link` holds a placeholder plus an empty target `div`.
  - IntersectionObserver (600px margin) injects the vendor's official loader snippet once.
  - The vendor's "ready" event adds `.is-loaded`, which fades the placeholder out.
  - The box has a `min-height` so the layout doesn't shift, and grows with the embed.

### 2.16 Not present in the source

There are no accordion/FAQ, form inputs, tabs or marquee components. Booking uses the 3rd-party embed, and contact uses a `mailto:` link. Don't copy a pattern for these from this file; design them fresh.

---

## 3. Layout and responsive rules

**Rules:**

1. **Mobile-first.** Base styles = the mobile design (the source was designed at 390). Use `min-width` queries going up.
2. **Breakpoints:**

   | Breakpoint | What changes |
   |---|---|
   | `768px` | Tablet tweaks only: 2-column grids where they fit; mobile type and spacing stay. |
   | `1024px` | **The main switch**: desktop type scale, desktop spacing, nav links instead of the menu, desktop modal, section header in one row. |
   | Component-specific | Allowed when a layout needs them. The source uses 810 / 1601 for a 1→2→3 column grid, 1279 (max) for header stacking, and 389 (max) for a 2×2 social grid. |
   | Interaction | Hover queries use `(hover: hover) and (pointer: fine)`, never width. |

   The source hard-codes these numbers in each media query; CSS custom properties can't be used inside media queries.
3. **Container:** content max-width + side padding, centred. Above the design width the content stays centred and doesn't grow. A `--full` variant removes the max-width for full-bleed grids and aligns them to the nav's side padding.
4. **Section spacing:** one vertical padding value for mobile and one for desktop, applied by `.section`. One header → content gap for mobile and one for desktop, from `.section__inner`. Sections that need different padding (hero, showcase, footer, about intro) set their own.
5. **Spacing scale:** the source uses a fixed list of pixel steps from the design file and doesn't create spacing tokens. Values are written in each component. Rule: only use values from the project's scale.
6. **Grids:** CSS Grid with `fr` columns. Gaps use separate `column-gap`/`row-gap` where they differ. Use `grid-auto-flow: dense` for mixed-size galleries (wide items `span 2`).
7. **Carousels** use flex + `margin-right` per slide, not `gap` (Embla measures margins).
8. **Always reserve media space** with `aspect-ratio` on the wrapper, so CLS stays near zero.
9. **Viewport units:** `100dvh` for full-height panels; `env(safe-area-inset-bottom)` on bottom-anchored bars and panels.
10. **Anchors** land below the sticky nav (`scroll-padding-top` + the Lenis anchor offset).
11. **Stacking order** (z-index): page sections 1 → nav 4 → dialog (top layer). The hero is 0 with `isolation: isolate`, so its internal layers (1–3) never escape it.
12. **Radius:** the source rule is "only buttons are rounded" (cards, images and containers have radius 0). Treat this as skin, but decide it explicitly.
13. **Effects:** no drop shadows. Backdrop blur only on overlays: card overlay, modal scrim, scrolled nav, carousel arrows.

```css
/* Reset used in the source (global.css) */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
img, picture, svg, video { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; color: inherit; }
button { background: none; border: 0; padding: 0; cursor: pointer; }
a { color: inherit; }
ul[role="list"], ol[role="list"] { list-style: none; padding: 0; }
p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
body { min-height: 100dvh; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}
```

Rule: lists that are semantically lists but visually unstyled get `role="list"`. This keeps Safari/VoiceOver announcing them as lists after `list-style: none`.

---

## 4. Project setup

### 4.0 Defaults for every new project (decided, don't ask)

These were added by hand after the first project built from this file. They apply unless a project's own brief says otherwise.

| Topic | Default |
|---|---|
| Page language | `<html lang="en-US">` |
| Deploy target | **Netlify**. Static output, so no adapter is needed unless the site has server routes (a CMS admin, forms handled by a function). Add `netlify.toml` (§4.11) during QA. Never deploy or push until the owner says so. |
| Visual checks | **Playwright** is allowed as a dev dependency (it's never shipped to the site). Use it to screenshot pages at 390 / 768 / 1024 / 1280 / 1440 and compare them with the Figma screenshots. |
| Favicon and OG image | Until the client supplies them, generate placeholders from `site.ts`: a favicon with the brand's first letter on the ink colour (SVG + 32px ICO + 180px Apple touch icon), and a 1200 × 630 OG image built from the hero image plus the business name. List both as "replace per client". |
| Where values live | **All design values are tokens in `tokens.css`, so a reskin touches one file.** This includes component sizes (e.g. `--btn-h-md: 52px`, `--tag-h: 28px`) and the motion control panel from §7.2 (easings, times, delays, staggers, distances). The `--space-*` scale is only for general gaps and padding; don't add odd one-off values to it. A value used by one component only becomes a component token named after that component. |
| CSS files | `tokens.css` (values) → `typography.css` (role classes) → `global.css` (reset, layout helpers, focus, utilities) → `motion.css` (keyframes, reveal, reduced motion). Imported in that order. |
| Type roles | A size/style that appears **2+ times** becomes a role in `typography.css` (with its tokens in `tokens.css`). A one-off uses the nearest role and is logged in the decisions log. |
| Weight modifiers | `.t-light`, `.t-regular`, `.t-medium` may override a role's weight when the design uses the same size in two weights. Don't create a new role just for a weight change. |
| Nav link colours | Non-current links use the same colour on every page. The current page uses the primary text colour plus `aria-current="page"`. Inactive links must still meet 4.5:1 contrast. |

### 4.1 Stack and packages

| Package | Why |
|---|---|
| `astro` (^7.4.7) | Framework. Static output; requires Node ≥ 22.23.4 (`engines` in package.json). |
| `@astrojs/netlify` | Deploy adapter. Pages stay prerendered; only the CMS admin + its API run as a Netlify Function. |
| `@astrojs/sitemap` | `/sitemap-index.xml`; private pages filtered out. |
| `@keystatic/core`, `@keystatic/astro` | Git-based CMS with its admin at `/keystatic`. |
| `@astrojs/react`, `react`, `react-dom`, `@types/react`, `@types/react-dom` | **Only** because the Keystatic admin is a React app. No React on public pages. |
| `@astrojs/markdoc` | Required by Keystatic. |
| `embla-carousel`, `embla-carousel-autoplay` | Vanilla carousels (no framework). |
| `lenis` | Smooth scroll + scroll lock. |

TypeScript: `tsconfig.json` extends `astro/tsconfigs/strict` with `"jsx": "react-jsx", "jsxImportSource": "react"`, needed for the Keystatic React code.

No CSS framework (plain CSS, no Tailwind), no GSAP, no jQuery. "No new libraries without asking the project owner" was a standing rule in the source.

**JS budget rule:** public pages ship almost no JS. Only interactive components have a `<script>`: carousel, filters, modal, menu, embed loader, plus the global scroll / reveal / video scripts. The hero intro is pure CSS.

### 4.2 Folder structure (as built)

```
public/
  favicon.ico, favicon.svg, robots.txt
  media/<collection>/<slug>/…        ← videos (served as-is, written by the CMS)
src/
  assets/
    brand/                            ← logo, portrait, icons (optimised by Astro)
    <collection>/<slug>/…             ← CMS images (optimised by Astro)
  components/
    ui/        Button, ArrowButton, Icon, LiveDot, Logo, Media, RollText, SectionHeader
    layout/    Nav (incl. mobile menu), Footer
    home/      page sections for Home
    about/     page sections for About
  content/
    <collection>/<slug>/index.yaml    ← collection entries
    settings/settings.yaml, pricing/pricing.yaml   ← singletons
    motion/*.yaml                     ← one per Motion page
    design/*.yaml                     ← one per Design page
  content.config.ts                   ← Zod schemas (mirror of keystatic.config.ts)
  layouts/Base.astro
  lib/          content.ts (data helpers), motion.ts, design.ts (CMS → CSS vars)
  pages/        index.astro, about.astro, styleguide.astro (private)
  scripts/      scroll.ts, reveal.ts, videos.ts (global, loaded by Base)
  styles/       tokens.css, typography.css, global.css
astro.config.mjs, keystatic.config.ts, netlify.toml, tsconfig.json
CLAUDE.md, DESIGN_SYSTEM.md, BUILD_PROMPT.md   ← agent instructions + spec
```

### 4.3 `astro.config.mjs`

```js
// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: '<https://SITE_DOMAIN>',

  // Inline the (small) CSS in each page: no extra requests before first paint.
  build: { inlineStylesheets: 'always' },

  // Self-hosted font via Astro's fonts API (downloaded at build time).
  fonts: [
    {
      name: '<FONT_FAMILY>',
      cssVariable: '--font-<name>',
      provider: fontProviders.fontsource(),
      weights: [<WEIGHTS>],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
    },
  ],

  // Pages prerendered; only /keystatic + /api/keystatic run on demand.
  adapter: netlify(),

  integrations: [
    react(),      // Keystatic admin only
    markdoc(),    // Keystatic requirement
    keystatic(),
    sitemap({ filter: (page) => !page.includes('/<private-page>') }),
  ],

  vite: { plugins: [cleanStaleContentAssets()] }, // dev-only workaround, see below
});
```

**Dev-only workaround worth copying:** `cleanStaleContentAssets()` in `astro.config.mjs` (`apply: 'serve'`).

- **Problem:** Astro keeps `.astro/content-assets.mjs`, a generated list of images used by content. When the CMS deletes an image (e.g. switching a field from Image to Video), the stale import causes `ImageNotFound` until the dev server restarts.
- **Fix:** the plugin watches `unlink` events in `src/assets/`, removes list entries whose file is gone, invalidates the module and sends a full reload.
- Copy the function from the source file as-is. It has no effect on builds.

Also from the source notes: after adding a **new** content collection, restart the dev server.

### 4.4 Global styles and tokens

Three global files in the source project, imported in this order in `Base.astro`. **New projects add a fourth, `motion.css`, and keep motion tokens in `tokens.css` (see §4.0).** Everything else lives in component `<style>` blocks.

1. **`src/styles/tokens.css`**: colour tokens on `:root` (+ border widths). Rule: never hard-code a colour anywhere else; add a token first. Token names should map 1:1 to the design file's variable names.
   - Groups: `--text-*` (primary/secondary/tertiary/inverse/accent), `--bg-*` (primary/secondary/tertiary), `--border-*` (primary/secondary/subtle), `--button-primary-*`, `--button-secondary-*`, `--surface-*` (overlay/scrim), `--status-*`, `--border-width`, `--border-width-thin`.
2. **`src/styles/typography.css`**: the font stack var, then size/line-height pairs per role (`--font-size-<role>` / `--line-height-<role>`), overridden at 1024px. Then one utility class per role (`.t-display … .t-caption`) that sets size, line-height, weight and letter-spacing, plus a weight modifier `.t-medium`.
   - Roles in the source: display, h1–h5, body-lg, body, body-sm, label, caption.
   - Rule: never hard-code a font size; use the role class or the role variables.
3. **`src/styles/global.css`**: reset, page defaults, scroll lock, container/section helpers, scroll reveal, text roll, focus ring, `.sr-only`, reduced motion.

```css
/* tokens.css shape */
:root {
  --text-primary: <COLOR>;   --text-secondary: <COLOR>;  --text-tertiary: <COLOR>;
  --text-inverse: <COLOR>;   --text-accent: <COLOR>;
  --bg-primary: <COLOR>;     --bg-secondary: <COLOR>;    --bg-tertiary: <COLOR>;
  --border-primary: <COLOR>; --border-secondary: <COLOR>; --border-subtle: <COLOR>;
  --button-primary-bg: <COLOR>; --button-primary-text: <COLOR>; --button-primary-chip: <COLOR>;
  --button-primary-bg-hover: <COLOR>;
  --button-secondary-bg: <COLOR>; --button-secondary-bg-hover: <COLOR>;
  --button-secondary-text: <COLOR>; --button-secondary-border: <COLOR>;
  --surface-overlay: <COLOR>; --surface-scrim: <COLOR>;
  --status-live: <COLOR>;
  --border-width: <PX>; --border-width-thin: <PX>;
}

/* typography.css shape */
:root {
  --font-sans: var(--font-<name>, "<Family>"), system-ui, -apple-system, sans-serif;
  --font-size-<role>: <PX>; --line-height-<role>: <PX>;   /* × each role, mobile values */
}
@media (min-width: 1024px) { :root { /* desktop values per role */ } }
.t-<role> { font-size: var(--font-size-<role>); line-height: var(--line-height-<role>); font-weight: <W>; letter-spacing: <EM>; }
.t-medium { font-weight: <MEDIUM_WEIGHT>; }
```

**CMS overrides:** `src/lib/design.ts` outputs `:root:root{…}` from the Design singletons (colours, border weights, layout numbers). `Base.astro` injects it after the motion vars. Components read those values with a fallback, e.g. `var(--card-pad-y-m, 16px)`.

### 4.5 Fonts

- Astro's built-in fonts API (`fonts` in `astro.config.mjs`) with the Fontsource provider. The font is downloaded at build time and self-hosted. Only the weights in use are listed.
- `<Font cssVariable="--font-<name>" preload={[{ weight, style: 'normal', subset: 'latin' }, …]} />` goes in `<head>`, and preloads only the weights used.
- `--font-sans` falls back to `system-ui` if the variable is missing.

### 4.6 Images and media

- All images live in `src/assets/…` and render with `<Image>` / `getImage()` from `astro:assets`, with explicit `widths` and `sizes`. The output is responsive AVIF/WebP `srcset`.
- Above-the-fold media gets `loading="eager"` + `fetchpriority="high"`; everything else is lazy.
- GIFs bypass optimisation (they'd lose their animation).
- Videos live in `public/media/…` (served as-is), are lazy-loaded by script, and are paused when offscreen.
- CMS image fields store **relative paths** (`publicPath: '../../../assets/<folder>/'`) so Astro's `image()` schema helper can optimise them.
- The CMS media field is a conditional **Image/Video switch**, defined in `keystatic.config.ts` (`media()`) and mirrored in `content.config.ts` (`z.discriminatedUnion('discriminant', …)`).
- Until real assets exist, use labelled grey placeholders at the correct aspect ratio, never stock images.
- Targets from the source brief: Lighthouse Performance ≥ 95, Accessibility 100, CLS < 0.05.

### 4.7 SEO / meta layout — `src/layouts/Base.astro`

**Props:** `title`, `description?`, `noindex?`.

**`<head>` contents, in order:**
1. charset and viewport;
2. `<title>`;
3. meta description (if given);
4. `robots noindex, nofollow` if `noindex`;
5. SVG + ICO favicons;
6. the inline reveal-arming script;
7. inline motion CSS vars;
8. inline design CSS vars;
9. `<Font>`.

**`<body id="top">`** contains `<slot />` plus one bundled script that runs `initScroll()`, `initReveal()` and `initVideos()`.

**Pages** compose `Base > Nav + <main>…sections…</main> + modals + Footer`, with one `<h1>` per page.

```astro
---
import { Font } from 'astro:assets';
import '../styles/tokens.css';
import '../styles/typography.css';
import '../styles/global.css';
import { motionCss } from '../lib/motion';
import { designCss } from '../lib/design';
interface Props { title: string; description?: string; noindex?: boolean }
const { title, description, noindex = false } = Astro.props;
const motionVars = await motionCss();
const designVars = await designCss();
---
<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    {noindex && <meta name="robots" content="noindex, nofollow" />}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" />
    <script is:inline>
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('reveal-on');
    </script>
    <style is:inline set:html={motionVars}></style>
    <style is:inline set:html={designVars}></style>
    <Font cssVariable="--font-<name>" preload={[{ weight: <W>, style: 'normal', subset: 'latin' }]} />
  </head>
  <body id="top">
    <slot />
    <script>
      import { initScroll } from '../scripts/scroll';
      import { initReveal } from '../scripts/reveal';
      import { initVideos } from '../scripts/videos';
      initScroll(); initReveal(); initVideos();
    </script>
  </body>
</html>
```

⚠ **Missing in the source** (required by its own brief, BUILD_PROMPT §8, but not built): Open Graph / Twitter tags, OG image, canonical URL. Add them in the new project.

**Private pages:** a reference/styleguide page is kept at `/styleguide`. It is not linked anywhere, has `noindex`, and is excluded from the sitemap.

### 4.8 404 page

**Not present in the source.** There is no `src/pages/404.astro`, so Netlify shows its default 404. Create one in the new project, using `Base` + `Nav` + `Footer`.

### 4.9 Sitemap and robots

- `@astrojs/sitemap` with `site` set in the config. It produces `/sitemap-index.xml`, and a `filter` drops private pages.
- `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://<SITE_DOMAIN>/sitemap-index.xml
```

### 4.10 CMS (Keystatic) setup

- **Storage switch** (`keystatic.config.ts`): local files in dev, GitHub commits in production. On the live site, a save commits to the repo, which triggers a rebuild.

  ```ts
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : { kind: 'github', repo: { owner: '<GITHUB_OWNER>', name: '<REPO>' } },
  ```

- **Sidebar groups** via `ui.navigation` (Content / Settings / Design / Motion).
- **Collections:** `<collection>/<slug>/index.yaml`. In `content.config.ts`, `glob({ pattern: '*/index.yaml', generateId: folderId })` makes the folder name the id. Singletons are single YAML files.
- **Schema hygiene:**
  - Optional CMS text fields become `''`: `z.string().nullish().transform(v => v ?? '')`. Keystatic omits empty fields or saves `null`.
  - Booleans default explicitly.
  - Lists have `.max()` limits that match the design.
  - Enum values are lowercase, with display labels in `src/lib/content.ts`.
  - Every entry has `order` + `draft`. Helpers sort by `order` and drop drafts.
- **Data helpers** (`src/lib/content.ts`): `getX()` functions sort and filter. Singletons throw a clear error if missing ("open /keystatic → Settings and save once"). Derived values (counts, zero-padding) are computed once here.
- **Hidden fields for layout toggles:** per-item show/hide checkboxes (e.g. `liveSite.show`, `showPriceRange`). Components hide the whole row when a value is empty.
- **Production env vars** (Netlify → Environment variables; never commit them): `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`. They are created by Keystatic's GitHub App setup flow on the deployed `/keystatic`.

### 4.11 Deploy (Netlify)

`netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "24"   # Astro 7 needs Node 22.23+
```

`.gitignore` also ignores `.netlify/`, `.astro/`, `dist/` and `.env*`.

Workflow: push to `main` → Netlify builds → live in ~1–2 minutes. A failed build keeps the previous version live. Content edits made on the live `/keystatic` arrive as commits, so pull before local work.

---

## 5. Conventions

**CSS custom properties**

| Prefix | Meaning | Example |
|---|---|---|
| `--text-* --bg-* --border-* --button-* --surface-* --status-*` | Colour tokens (tokens.css) | `--bg-secondary` |
| `--fs-<role>` / `--lh-<role>` / `--ls-<role>` | Type tokens (new projects, §6). The source project used `--font-size-<role>` / `--line-height-<role>`. | `--fs-h3` |
| `--m-<name>-ease/-time/-delay/-distance/-stagger` | Motion values from the CMS | `--m-reveal-stagger` |
| `--<thing>-<prop>-<m\|d>` | CMS layout values, `m` = mobile, `d` = desktop | `--hero-portrait-size-d`, `--card-pad-y-m` |
| `--i` | Stagger index, set inline in markup | `style="--i:3"` |
| local, unprefixed | Component-internal variables | `--inset-y`, `--slide-w`, `--menu-close` |

**Classes**
- **BEM-like:** `.block`, `.block__element`, `.block--modifier` (`.btn--primary`, `.nav__panel-link`, `.modal--no-bar`).
- State classes: `is-*` (`is-open`, `is-scrolled`, `is-ready`, `is-dragging`, `is-closing`, `is-loaded`, `is-revealed`, `is-fading`).
- Typography utilities: `.t-<role>` + weight modifiers `.t-light` / `.t-regular` / `.t-medium`.
- Behaviour hooks shared across components: `.roll-trigger`, `.arrow-trigger`.
- Global helpers: `.container`, `.container--full`, `.section`, `.section__inner`, `.sr-only`.

**JS hooks:** `data-*` attributes only (see §2). Scripts query by attribute and loop over every instance.

**Files:** `PascalCase.astro` components grouped by role (`ui/`, `layout/`, page folders), `camelCase.ts` scripts and libs, `kebab-case` content slugs and YAML files.

**Patterns followed throughout:**
1. Every hover has a `:focus-visible` twin. Hovers only apply on `(hover: hover) and (pointer: fine)`.
2. Animations read `var(--m-…, <fallback>)`, so they are CMS-tunable and safe without the CMS.
3. Entrance animations start at `opacity: 0.001` (LCP-safe), and use `translate`/`scale` properties where they might combine with `transform` transitions.
4. No hard-coded colours or font sizes in components. ⚠ Exceptions in the source: the nav link size is hard-coded to 16/24 in `Nav.astro`, and the embed brand colour `'#162026'` in `BookCall.astro`.
5. Real elements for interaction (`<button>`, `<a>`, `<dialog>`). ARIA state attributes are both the state and the style hook (`[aria-pressed='true']`, `[aria-current='true']`).
6. Empty CMS values hide their UI; no empty rows or dead links (`<span>` instead of `<a>` without an href).
7. External links: `target="_blank" rel="noopener noreferrer"` + `.sr-only` "(opens in a new tab)".
8. `flex: none` on icons and fixed-size children inside flex rows.
9. Comments explain *why* in plain language, and date the owner's decisions (e.g. "(Owner, 2026-11-10)"). Each component's header comment links to the spec section.
10. Keep `keystatic.config.ts` and `content.config.ts` in sync; change both together.
11. Agent working rules from the source (put them in the new project's `CLAUDE.md`):
    - read the spec files first;
    - never invent: check the design file, then ask;
    - one phase at a time, wait for OK;
    - commit after each phase;
    - no new libraries without asking;
    - no push/deploy until the deploy phase and an explicit go-ahead;
    - keep a decisions log in `CLAUDE.md`.

---

## 6. Typography system (generic, all projects)

This section was **added by hand**, not extracted from the source project. It is the default type scale for every new project. The source project (§4.4) switches sizes in one step at 1024px; new projects use the **fluid** method below instead.

### 6.1 Rules

1. **Roles, not sizes.** Components use a role (`.t-h2`, `--fs-h2`), never a pixel value. A role is the same everywhere it appears.
2. **Fluid between the two design frames.** Display and heading sizes scale smoothly with `clamp()` from the mobile frame (390px) to the desktop frame (1440px). Nothing jumps at a breakpoint.
3. **Big text shrinks a lot, small text barely shrinks.** The mobile size is a ratio of the desktop size, and the ratio depends on the tier:

   | Tier | Mobile ≈ desktop × |
   |---|---|
   | Display (96px and up) | 0.45–0.55 |
   | H1–H2 (56–72px) | 0.6–0.65 |
   | H3 (32–40px) | 0.75 |
   | H4–H5 (20–28px) | 0.85–0.9 |
   | Body and smaller | 0.95–1 (body stays 16) |

4. **Line height gets tighter as text gets bigger.** Display ≈ 0.92–1.0, headings 1.05–1.2, body 1.5–1.6. On mobile, headings get **slightly looser** line height (+0.05 to +0.1), because they wrap onto more lines. Line height is unitless.
5. **Letter spacing gets tighter as text gets bigger.** Display −4% to −5%, H2 −3%, H3 −2%, H4/H5 −1%, body 0 to −0.5%. Uppercase labels go positive (+4% to +8%). Write it in `em` so it scales with the size.
6. **Weight goes down as size goes up.** Large display text reads best in Light/Regular, small text in Regular/Medium. Use at most three weights per project.
7. **Hard limits:**
   - Body text never below 16px.
   - Nothing on the page below 12px.
   - Form inputs at least 16px, so iOS doesn't zoom in on focus.
   - Body line length max ~65ch (`max-width: 65ch`).
   - Headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty`.
8. **One family.** One type family per project. Use weight and size for hierarchy, not a second font.

### 6.2 Default chart

Desktop = 1440 frame, mobile = 390 frame. Letter-spacing values are tuned for neo-grotesk sans fonts (Inter, Geist, SF-like). See §6.5 for other fonts.

| Role | Used for | Desktop px | Mobile px | Weight | Line height desktop / mobile | Letter spacing |
|---|---|---|---|---|---|---|
| `display-xl` | One oversized statement, footer wordmark | 128 | 56 | Light | 0.92 / 1.0 | −0.045em |
| `display` | Home hero headline | 96 | 48 | Light | 0.95 / 1.05 | −0.04em |
| `h1` | Inner-page hero, small hero | 72 | 44 | Light/Regular | 1.0 / 1.1 | −0.035em |
| `h2` | Section titles | 56 | 36 | Light/Regular | 1.05 / 1.15 | −0.03em |
| `h3` | Sub-section titles, large quotes, big numbers | 40 | 30 | Regular | 1.15 / 1.2 | −0.02em |
| `h4` | Large card titles | 28 | 24 | Regular | 1.2 / 1.25 | −0.015em |
| `h5` | Card titles, list titles, stats | 22 | 20 | Medium | 1.3 / 1.3 | −0.01em |
| `body-lg` | Intro paragraphs under headings | 18 | 17 | Regular | 1.55 / 1.55 | −0.005em |
| `body` | Default text | 16 | 16 | Regular | 1.55 / 1.55 | −0.003em |
| `body-sm` | Meta, bullets, nav links | 14 | 14 | Regular/Medium | 1.5 / 1.5 | 0 |
| `label` | Eyebrows, small uppercase labels | 12 | 12 | Medium, UPPERCASE | 1.2 / 1.2 | +0.06em |
| `caption` | Fine print, legal | 12 | 12 | Regular | 1.4 / 1.4 | 0 |
| `button` | Button labels | 15 (sm 14) | 15 (sm 14) | Medium | 1.0 | −0.002em |
| `input` | Form field text | 16–17 | 16 | Regular | 1.4 | −0.003em |

Worked example: an H2 of 64px on desktop → 64 × 0.64 ≈ 40px on mobile. Line height 1.06 on desktop (68px) and 1.15 on mobile (46px). Letter spacing −0.03em.

### 6.3 Adapting the chart to a design

Most projects only need these steps:

1. Read the **hero headline** and **section title (H2)** sizes from the design. Replace those two desktop values.
2. Get each mobile value with the tier ratio from §6.1 rule 3, unless the mobile design shows a different one.
3. Keep the other roles as they are, unless the design clearly uses different sizes.
4. Recompute each fluid size with this formula (min/max in px, frames 390 → 1440):

   ```
   slope     = (max − min) / (1440 − 390)
   intercept = min − slope × 390
   font-size: clamp(min/16 rem, intercept/16 rem + slope×100 vw, max/16 rem)
   ```

   A role whose mobile and desktop sizes are equal just uses a fixed `rem` value.

### 6.4 Implementation (`src/styles/typography.css`)

```css
:root {
  --font-sans: var(--font-<name>, "<Family>"), system-ui, -apple-system, sans-serif;

  /* Sizes: fluid 390 → 1440 */
  --fs-display-xl: clamp(3.5rem, 1.8286rem + 6.8571vw, 8rem);      /* 56 → 128 */
  --fs-display:    clamp(3rem, 1.8857rem + 4.5714vw, 6rem);        /* 48 → 96 */
  --fs-h1:         clamp(2.75rem, 2.1rem + 2.6667vw, 4.5rem);      /* 44 → 72 */
  --fs-h2:         clamp(2.25rem, 1.7857rem + 1.9048vw, 3.5rem);   /* 36 → 56 */
  --fs-h3:         clamp(1.875rem, 1.6429rem + 0.9524vw, 2.5rem);  /* 30 → 40 */
  --fs-h4:         clamp(1.5rem, 1.4071rem + 0.381vw, 1.75rem);    /* 24 → 28 */
  --fs-h5:         clamp(1.25rem, 1.2036rem + 0.1905vw, 1.375rem); /* 20 → 22 */
  --fs-body-lg:    clamp(1.0625rem, 1.0393rem + 0.0952vw, 1.125rem); /* 17 → 18 */
  --fs-body:       1rem;
  --fs-body-sm:    0.875rem;
  --fs-label:      0.75rem;
  --fs-caption:    0.75rem;
  --fs-button:     0.9375rem;
  --fs-button-sm:  0.875rem;

  /* Line heights: mobile values first */
  --lh-display-xl: 1;    --lh-display: 1.05; --lh-h1: 1.1; --lh-h2: 1.15;
  --lh-h3: 1.2;          --lh-h4: 1.25;      --lh-h5: 1.3;
  --lh-body: 1.55;       --lh-body-sm: 1.5;  --lh-label: 1.2; --lh-caption: 1.4; --lh-button: 1;

  /* Letter spacing */
  --ls-display-xl: -0.045em; --ls-display: -0.04em; --ls-h1: -0.035em; --ls-h2: -0.03em;
  --ls-h3: -0.02em; --ls-h4: -0.015em; --ls-h5: -0.01em;
  --ls-body-lg: -0.005em; --ls-body: -0.003em; --ls-label: 0.06em;
}
@media (min-width: 1024px) {
  :root {
    --lh-display-xl: 0.92; --lh-display: 0.95; --lh-h1: 1; --lh-h2: 1.05;
    --lh-h3: 1.15; --lh-h4: 1.2;
  }
}

/* One class per role */
.t-display { font-size: var(--fs-display); line-height: var(--lh-display); letter-spacing: var(--ls-display); font-weight: 300; text-wrap: balance; }
.t-h2      { font-size: var(--fs-h2);      line-height: var(--lh-h2);      letter-spacing: var(--ls-h2);      font-weight: 300; text-wrap: balance; }
/* …one class per role in the chart… */
.t-label   { font-size: var(--fs-label);   line-height: var(--lh-label);   letter-spacing: var(--ls-label);   font-weight: 500; text-transform: uppercase; }
.t-body    { font-size: var(--fs-body);    line-height: var(--lh-body);    letter-spacing: var(--ls-body);    text-wrap: pretty; }
```

Rules for the code:
- The `rem` parts of `clamp()` keep browser zoom and user font settings working. Never use `vw` alone.
- Semantic tag and visual role are separate. An `<h2>` can use `.t-h3` when the design needs it; the document outline stays correct.
- Figma text style names map 1:1 to the roles: `Desktop/H2` + `Mobile/H2` → `.t-h2`.

### 6.5 Per-font adjustments

- The letter-spacing values above fit Inter, Geist and similar fonts. **Wider fonts** (e.g. Satoshi, General Sans) need about half the negative tracking. **Serif display fonts** usually need −0.01em to −0.02em at most.
- For fonts with a **large x-height** (Inter), body can stay at 16. For fonts with a **small x-height**, use 17–18 for body.
- If the font has a variable `opsz` axis, leave `font-optical-sizing: auto` on.
- Always check the hero headline at 390px with the longest real headline. If one word doesn't fit on a line, lower the mobile display size, never the desktop one.

---

## 7. Entrance animation system (generic, all projects)

This section was **added by hand**. It turns the source project's entrance animations (§1.3 hero intro, §1.4 nav intro, §1.5 scroll reveal, §1.10 motion controls) into one reusable system that doesn't depend on the CMS or on any one hero design. **New projects build their entrance animations from this section.** §1.3–1.5 stay as reference for how the source did it.

The default values are the ones the live source site uses (its CMS values), not its CSS fallbacks.

### 7.1 The feel: subtle

- **Only two things move: opacity and a short rise.** Opacity goes 0.001 → 1 while the element moves up from 16–24px below its resting place.
- **No scale, blur, rotate, clip-path or letter-by-letter effects** in the default system. Signature effects (like the source's arc and portrait) are per-project extras, added on top.
- **One easing for everything that moves:** `smooth` (`cubic-bezier(.22, 1, .36, 1)`), a soft ease-out that starts quickly and settles gently.
- **Short and quick:** 0.6–0.7s per element, 0.05–0.07s apart.
- **Plays once.** Nothing animates again when you scroll back up.
- **Content is never lost:**
  - without JS, or with reduced motion on, everything is simply visible;
  - elements start at `opacity: 0.001`, not 0, so the browser still counts them for LCP.

### 7.2 The control panel (motion tokens in `tokens.css`)

All entrance motion reads from these tokens. **To change the feel of the whole site, edit only this block.** The `--m-` names are the same ones the source CMS writes (§1.10). A project that adds a CMS later can override them without touching any component.

```css
:root {
  /* Easing presets: pick one per animation */
  --ease-linear:   linear;
  --ease-standard: cubic-bezier(.25, .1, .25, 1);   /* CSS "ease" */
  --ease-in:       cubic-bezier(.42, 0, 1, 1);      /* CSS "ease-in": slow start (exits only) */
  --ease-out:      cubic-bezier(0, 0, .58, 1);      /* CSS "ease-out" */
  --ease-in-out:   cubic-bezier(.42, 0, .58, 1);    /* CSS "ease-in-out": things that move and stop on screen */
  --ease-expo-out: cubic-bezier(.16, 1, .3, 1);     /* stronger, snappier ease-out */
  --ease-smooth:   cubic-bezier(.22, 1, .36, 1);    /* DEFAULT for entrances */
  --ease-drop:     cubic-bezier(0, .77, .56, 1);    /* nav drop-in */

  /* Page-load intro (hero content) */
  --m-intro-ease:     var(--ease-smooth);
  --m-intro-time:     0.7s;
  --m-intro-delay:    0.1s;   /* wait before the first item */
  --m-intro-stagger:  0.07s;  /* gap between items */
  --m-intro-distance: 20px;   /* how far each item rises */

  /* Nav intro (home page only) */
  --m-nav-ease:       var(--ease-drop);
  --m-nav-time:       0.6s;
  --m-nav-delay:      0.1s;
  --m-nav-stagger:    0.05s;
  --m-nav-button-gap: 0.1s;   /* extra wait before the CTA after the last link */
  --m-nav-distance:   24px;   /* drops in from above */

  /* Scroll reveal (everything below the fold) */
  --m-reveal-ease:     var(--ease-smooth);
  --m-reveal-time:     0.6s;
  --m-reveal-stagger:  0.05s;
  --m-reveal-distance: 24px;
  --m-reveal-stagger-max: 0.4s; /* the last item in a batch never waits longer than this */
}
```

**What each control does, and safe ranges:**

| Control | Effect | Subtle range | Feels wrong when… |
|---|---|---|---|
| `-ease` | Speed curve: how the motion starts and stops | `smooth` or `expo-out` for entrances | `ease-in` or `linear` on an entrance: the item starts slowly and stops abruptly |
| `-time` | How long one item takes | 0.5–0.8s | under 0.4s feels jumpy; over 1s feels slow |
| `-delay` | Wait before the first item starts | 0–0.2s (intro), 0 (reveal) | over 0.3s on page load feels like lag |
| `-stagger` | Gap between items in the same group | 0.04–0.08s | over 0.1s and the page feels like it's loading one piece at a time |
| `-distance` | How far an item rises | 12–24px | over 40px stops feeling subtle |

**Which easing to use when:**

| Easing | Use for |
|---|---|
| `smooth` / `expo-out` | Anything **appearing** or travelling (entrances, panels opening) |
| `in-out` | Something that moves **from one place to another** on screen and stops (a slider track, an indicator moving between tabs) |
| `ease-in` | Things **leaving** (closing a panel, an exit fade). Never entrances. |
| `standard` / `ease-out` | Short colour and opacity changes (hover), with 150–250ms |
| `linear` | Only for constant motion (marquees, progress bars, spinners) |

### 7.3 One shared keyframe

Every entrance uses the same keyframe. Each system only sets its distance and timing.

```css
/* motion.css */
@keyframes rise-in {
  from { opacity: 0.001; translate: 0 var(--rise-from, 20px); }
  to   { opacity: 1;     translate: 0 0; }
}
```

- Use the individual `translate` property, not `transform`, so an entrance never fights a component's own hover `transform`.
- Use `animation` with `both` fill, not `transition`, so the start state applies from the first frame.

### 7.4 Page-load intro (hero)

Plays once on first paint, CSS only, no JS. Add `data-intro` to each item, in reading order, and pass its position with an inline `--i` (0, 1, 2…).

```astro
<p class="t-label" data-intro style="--i:0">Scottsdale · By appointment only</p>
<h1 class="t-hero"  data-intro style="--i:1">Your paint, exactly as it left the factory.</h1>
<p class="t-body-lg" data-intro style="--i:2">…</p>
<div class="buttons" data-intro style="--i:3">…</div>
<img … data-intro style="--i:4" />
```

```css
[data-intro] {
  --rise-from: var(--m-intro-distance);
  animation: rise-in var(--m-intro-time) var(--m-intro-ease)
             calc(var(--m-intro-delay) + var(--i, 0) * var(--m-intro-stagger)) both;
}
```

Rules:
- **Order = reading order:** eyebrow → headline → text → buttons → image. Two buttons side by side can share one index (animate the pair together) or take two indices.
- **Large images** in the intro: use opacity only, or a smaller rise (`style="--i:4; --rise-from: 12px"`), so the big block doesn't visibly slide.
- **Items in the intro never also get `data-reveal`.** One element gets one entrance.
- The whole intro (last item's delay + its time) should finish within about **1.2s**.

### 7.5 Nav intro (home page only)

The nav drops in from above. Enable it with a `nav--intro` class on Home only; inner pages show the nav instantly.

```css
.nav--intro [data-nav-intro] {
  --rise-from: calc(var(--m-nav-distance) * -1); /* negative = from above */
  animation: rise-in var(--m-nav-time) var(--m-nav-ease)
             calc(var(--m-nav-delay) + var(--i, 0) * var(--m-nav-stagger)) both;
}
.nav--intro [data-nav-intro="cta"] {
  animation-delay: calc(var(--m-nav-delay) + var(--link-count) * var(--m-nav-stagger) + var(--m-nav-button-gap));
}
```

- Logo `--i:0`; links `--i:1…n`.
- The nav component sets `--link-count` from its links array, so the CTA always follows the last link. **Never hard-code the count** (the source did, see §1.4).
- If the nav and the hero intro play together, start the hero intro after the nav's first items (e.g. `--m-intro-delay: 0.2s`) so the two don't compete.

### 7.6 Scroll reveal

Use the code in §1.5 unchanged (the script, the `.reveal-on` arming in `<head>`, `data-reveal` / `data-reveal-group`). Only two changes for new projects:

1. The CSS reads the §7.2 tokens and uses the shared keyframe:
   ```css
   .reveal-on [data-reveal] { opacity: 0.001; }
   .reveal-on [data-reveal].is-revealed {
     --rise-from: var(--m-reveal-distance);
     opacity: 1;
     animation: rise-in var(--m-reveal-time) var(--m-reveal-ease) var(--reveal-delay, 0s) both;
   }
   ```
2. **Cap the stagger** so a big batch (e.g. 12 footer links) doesn't trickle in. In `reveal.ts`, use `Math.min(i * s, max)` with `max = --m-reveal-stagger-max`.

Where to put `data-reveal`: one per visual item, not one per section.

| Gets a reveal | No reveal |
|---|---|
| Section index/label, section title, intro paragraph | The nav |
| Each card, each list row, each stat, each FAQ item | Anything with `data-intro` |
| Images (opacity only or smaller rise for very large ones) | Text inside an element that already reveals (don't reveal parent and child) |
| Each button group, each text link | Sticky or fixed elements |
| Footer columns and links | Anything inside an open modal or menu (they have their own motion) |

### 7.7 Reduced motion and no JS

- **Reduced motion:** the global kill switch (§1.12) shows every element in its end state at once, and `.reveal-on` is never added, so nothing starts hidden.
- **No JS:** the intro is CSS only, so it still plays. Reveals never arm (no `.reveal-on` class), so all content is visible.
- Never hide content with CSS that only JS can undo, except behind `.reveal-on`.

### 7.8 Checklist before signing off motion

- [ ] Hard reload Home: the nav, then the hero, play once and finish within about 1.2s. No flash of content before the animation starts.
- [ ] Scroll slowly: every section's items rise in order, top → bottom, left → right.
- [ ] Scroll fast to the bottom, and jump with an anchor link: nothing stays invisible.
- [ ] Scroll back up: nothing animates again.
- [ ] Reduced motion on (macOS: System Settings › Accessibility › Display › Reduce motion): everything is visible instantly.
- [ ] JS disabled: everything is visible.
- [ ] Lighthouse: LCP not delayed by the hero animation (the 0.001 start).
- [ ] Changing one token in §7.2 (e.g. `--m-reveal-time`) changes it everywhere.

---

## Per-project inputs

Everything a new project must fill in before or while using this skeleton:

**Brand and skin**
- [ ] Colour token values (all of `tokens.css`, including button hover and accent).
- [ ] Border widths (`--border-width`, `--border-width-thin`).
- [ ] Font family, weights, subsets; Fontsource availability.
- [ ] Type scale: start from the §6 default chart. Change only the roles the design changes (usually the hero/H1 size, weights and letter-spacing for the chosen font). Recompute the `clamp()` values with the §6.3 formula.
- [ ] Radius policy (which elements are rounded, and how much).
- [ ] Spacing scale.
- [ ] Focus ring colour, width, offset.
- [ ] Blur amounts for overlays (nav, card overlay, scrim, arrows).

**Layout**
- [ ] Design frame widths (mobile, desktop).
- [ ] Content max-width, side padding (mobile / desktop), full-width side padding.
- [ ] Section padding and header → content gap (mobile / desktop).
- [ ] Nav height (mobile / desktop); use it everywhere listed in §2.3.
- [ ] Any component-specific breakpoints and grid column counts.
- [ ] z-index order if the layers differ.

**Motion values** (CMS defaults, CSS fallbacks and seed YAML, all made equal)
- [ ] Default easing curve and any special curves (hero shapes, nav).
- [ ] Durations: link colour, base, button, card, roll (+ letter stagger), reveal (+ distance, stagger), menu (panel, items, delay, distance, stagger), modal, hero items + delays, nav intro (distance, stagger, button gap).
- [ ] Reveal trigger margin (source: −40px) and threshold.
- [ ] Carousel autoplay delay, Embla `duration`, minimum fill counts.
- [ ] Modal slideshow interval, visible thumbnail count.
- [ ] Parallax factors (if a sticky hero is used).
- [ ] Card hover: image padding and zoom scale.

**Components**
- [ ] Button heights, padding, chip size and inset, label slide distance; which variants are used.
- [ ] Arrow Button size and icon travel.
- [ ] Nav links, CTA label and target, social links, mobile menu copy.
- [ ] Footer columns, links, legal links, decorative graphic.
- [ ] Card aspect ratio, overlay label.
- [ ] Modal fields and layout widths.
- [ ] Icon set (SVG paths, sizes, stroke widths).
- [ ] Logo mark SVG + wordmark.

**Setup**
- [ ] `site` URL. (`<html lang>` defaults to `en-US`; change it only for a non-US or non-English site.)
- [ ] Netlify site, `NODE_VERSION`, domain.
- [ ] GitHub owner and repo for Keystatic storage; the 4 Keystatic env vars.
- [ ] Content collections, singletons and their schemas.
- [ ] Private pages to exclude from the sitemap.
- [ ] Third-party embed (vendor, link, theme options), if any.
- [ ] SEO: titles, descriptions, OG image, canonical (missing in the source; add it).
- [ ] 404 page content (missing in the source; add it).
- [ ] Favicons.

---

## Open questions

Things that were unclear or inconsistent in the source code:

1. **Fallback vs CMS mismatches:**
   - Reveal 0.8s fallback vs 0.6s in the CMS.
   - Nav intro 1s / 150px fallback vs 0.6s / 24px in the CMS (the Keystatic default distance is also 150).
   - Card hover 350ms fallback and Keystatic default vs 0.3s in the seed file.

   Which set is intended as the boilerplate default?
2. **Colour-hover durations** vary: 150ms (links), 200ms (chips, socials), 350ms (Arrow Button, which is also not CMS-controlled). 200ms is the most common. Standardise on one?
3. **No easing tokens in CSS.** `cubic-bezier(.22, 1, .36, 1)` is repeated ~27 times as a fallback, written in two notations (`.22` and `0.22`). The proposed tokens in §1.2 don't exist in the source yet.
4. **`opacity: 0.001` vs `0`:** reveal, hero and nav intro use 0.001 (LCP-safe). The mobile menu items, modal pop and gallery slides use 0. Fine where the element isn't the LCP candidate, but it is not a stated rule.
5. **`transform` vs individual `translate`/`scale`:** reveal, nav intro, menu items and parallax use the individual properties; hero text, portrait, modal and card label use `transform`. The source only explains the choice for reveal and parallax.
6. **Nav height duplicated** in 4 places (§2.3), and the nav-intro CTA delay hard-codes `5 *` for 4 links (§1.4).
7. **Work card `:focus-visible` rules sit inside the hover media query**, unlike the global rule. On touch-only devices, keyboard focus shows no overlay.
8. **Stale comments:**
   - The `Nav.astro` header (and the design spec) describes the menu as "fades in + moves 8px down over 250ms"; the code is a 0.6s clip-path unroll.
   - The `ProjectModal.astro` header says "80% of the screen wide (min 900, max 1600)"; the code uses ~86.875vw with computed columns.
   - The Keystatic nav-intro field is labelled '"Hire Me" extra delay', but the button is "Book a call".
9. **Hard-coded skin values in components:**
   - The nav link font size (16/24) bypasses the type tokens.
   - The Cal.com brand colour `#162026` in `BookCall.astro` bypasses the colour tokens.
   - Arrow Button timing (350ms).
10. **Mobile menu panel has no `overflow` rule.** On very short screens its contents could be cut off. It has `data-lenis-prevent`, which suggests it was meant to scroll.
11. **No "tap outside to close" for the mobile menu** (the panel covers the whole viewport, so there's no outside). Intended?
12. **Lenis + reduced motion:** the source comment claims Lenis respects `prefers-reduced-motion` on its own. This was not verified; check the Lenis docs for the version you install.
13. **Missing pieces the source brief asked for:** a 404 page; Open Graph / Twitter tags; an OG image; a canonical URL.
14. **The brief's folder plan differs from the build:** `BUILD_PROMPT.md` §3 lists `layout/MobileMenu.astro`, `layout/DottedLogo.astro` and `scripts/generate-dotted-logo.mjs`, none of which exist. The menu lives in `Nav.astro`, and the dotted logo is a static SVG in `src/assets/brand/`.
15. **Unused code:**
    - The `secondary-chip` button variant (kept, not used).
    - Empty rule blocks in `Hero.astro` (`.hero__portrait-clip {}`, `.hero__arc {}` inside the last desktop media query).
    - The `WorkSection` `columns: 2` default path; only `columns={3}` is used.
16. **Showcase dot target size:** the dots are 20px centre-to-centre. Lighthouse's target-size rule wants 24px, and the owner accepted the trade-off. Keep the 24px rule in a new project?

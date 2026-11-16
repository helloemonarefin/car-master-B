# Reskin Master B for a new client

Master B is a template: the layout, components and motion stay; brand values, copy and images change. A reskin touches the files below and nothing else.

1. **Brand colours.** In `src/styles/tokens.css`, edit the "Brand" block: `--brand-ink`, `--brand-paper`, `--brand-accent` and their `-rgb` versions (`--brand-ink-rgb`, `--brand-on-dark-rgb`). Every text, background, border and button colour derives from these. Keep `--text-tertiary` at 4.5:1 or better on the light backgrounds.

2. **Font.** In `astro.config.mjs` change the `fonts` entry (name, `cssVariable`, weights 300/400/500) and the `--font-sans` stack in `tokens.css`. Re-check letter spacing (BOILERPLATE §6.5) and the longest headline at 390px; if a word doesn't fit, lower that role's *mobile* size in `tokens.css`, never the desktop one.

3. **Logo.** Replace `src/assets/brand/logo.svg` with one SVG that has two paths, `class="logo__main"` (word mark, uses `currentColor`) and `class="logo__sub"` (sub-line, tertiary). If the proportions change, update `--logo-w`.

4. **Client facts.** Fill in `src/content/site.ts`: business name, short name, tagline, city/region, phone (+ `tel:` form), email, address, hours, service area, founding year, rating, review count/source/URL, SEO defaults, and `site` in `astro.config.mjs` (the real domain). These values appear everywhere (nav, hero eyebrow, trust strip, FAQ phone, contact details, footer, wordmark) — never retype them in page content.

5. **Navigation and footer.** Edit `src/content/layout.ts` (nav links, nav CTA, footer links, footer info labels). A link with `href: ''` renders as plain text until it has a destination.

6. **Home page sections.** Edit `src/content/home.ts`. The `sections` array *is* the page: reorder or delete entries and the page follows; the `(01)`, `(02)`… indexes renumber themselves. Copy-length limits are written next to every field in `src/content/types.ts` — stay inside them so the layout holds.

7. **Inner pages.** Each page is `src/content/pages/<page>.ts` (its own `sections` array + `seo`) rendered by a two-line file in `src/pages/`. Sections shared with Home use `fromHome('type')`, so shared copy lives once. To add a page: copy one of these pairs and add it to `nav.links`.

8. **Images.** Put photos in `src/assets/` and import them in the content files (with real `alt` text). Any size works — Astro generates responsive WebP/AVIF; frames crop with `object-fit: cover`. Use at least 2400px wide for hero and wide images.

9. **Replace per client — generated placeholders.** The favicon set (`/favicon.svg`, `/favicon.ico`, `/apple-touch-icon.png`) is generated from the first letter of the business name on the ink colour, and the 1200 × 630 Open Graph image (`/og.png`) from `src/assets/home/hero.jpg` + the business name (`src/lib/brandImages.ts`, `src/pages/og.png.ts`). Replace them with the client's real favicon and share image when available.

10. **Check, then hand over.** Run `npm run check` and `npm run build` (no warnings), then the dev tools in `tools/`: `responsive-check.mjs` (360–1440), `motion-check.mjs` (entrance animations, keyboard), `audit.mjs` (contrast, alt text, CLS). Deploy target is Netlify (`netlify.toml`); the consultation form is a Netlify form named `consultation`.

Motion feel for the whole site lives in one block of `tokens.css` (the §7.2 "motion control panel": `--m-intro-*`, `--m-nav-*`, `--m-reveal-*`). Don't edit components to change timing.

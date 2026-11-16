# Master B (Astro) — agent instructions

Pixel-accurate Astro build of the Figma page **Master B** (file `FFs05OacP9URxrCuYpT1fT`, page `24:24`), built as a reusable template.

Spec files (read before working):
- `BUILD_PROMPT.md` — phases and fixed decisions.
- `DESIGN_SYSTEM.md` — wins on **how things look**.
- `tokens.css` — every design value (copied to `src/styles/tokens.css`; extended with type, component and motion tokens per the decisions log, original values never edited).
- `BOILERPLATE-GUIDELINES.md` — wins on **how things are built**. Read sections only when building the thing they describe.

If something is still unclear after those files: ask. Never guess.

---

## Agent working rules (BOILERPLATE §5 rule 11)

- Read the spec files first.
- Never invent: check the design file (Figma), then ask.
- One phase at a time; wait for the owner's OK before the next phase.
- Commit after each phase, with a clear message.
- No new libraries without asking.
- No push or deploy until the deploy phase **and** an explicit go-ahead.
- Keep the decisions log below up to date (every choice not in the spec files, dated).

Credit-saving rules:
- Read Figma one section node at a time (`get_design_context` + `get_screenshot`). Never request a whole page.
- Don't re-read files already read in the session unless they changed.
- Summarise; don't paste large files back.

---

## Fixed decisions (from BUILD_PROMPT §3)

**Stack**
- Latest stable Astro (7.4.12 at Phase 0; Node ≥ 22.23.4). Static output, plain CSS (no Tailwind), TypeScript strict.
- No React or any UI framework on the site. No CMS in this build: content lives in typed TS files, structured so a CMS can be added later.
- Packages: `astro`, `@astrojs/sitemap`, `lenis`. Nothing else without asking. Dev-only screenshot tools (e.g. Playwright) are OK, but tell the owner before installing.
- Font: Inter, self-hosted via Astro's fonts API with the Fontsource provider. Weights 300, 400, 500 only.

**Images**
- Export from Figma with the MCP asset tools into `src/assets/`; render with `<Image>` from `astro:assets` with proper `widths`/`sizes`.
- Above the fold: `loading="eager"` + `fetchpriority="high"`. Everything else lazy.
- If an image can't be exported: grey placeholder at the exact aspect ratio, labelled with its name. Never stock images.
- Icons: inline SVG in `currentColor`, 1.5px stroke, paths copied from Figma. Logo: one SVG.

**Code rules**
- BOILERPLATE §5 conventions: BEM-like classes, `data-*` JS hooks, `is-*` states, ARIA state as the style hook.
- Never hard-code a colour, font size, spacing value or radius in a component. Tokens and `.t-<role>` classes only.
- One `.t-<role>` class per DESIGN_SYSTEM §3 role, using `--fs-` / `--lh-` / `--ls-` tokens, in `src/styles/typography.css`.
- 12-column grid helper (DESIGN_SYSTEM §4), built once and reused. Signature layout: label cols 1–4, content cols 6–12.
- Semantic HTML: one `<h1>` per page, sections with `aria-labelledby`, real `<button>`/`<a>`, lists with `role="list"`.

**Motion / interaction defaults**
- Easing and duration tokens: `--ease-smooth: cubic-bezier(.22, 1, .36, 1)`, `--dur-fast`, `--dur-base`, … Never write a cubic-bezier inline.
- Colour hover transitions: 200ms everywhere.
- Entrance animations start at `opacity: 0.001`.
- Use individual `translate` / `scale` properties, not `transform`.
- Nav height is one token (`--nav-h`); JS reads it with `getComputedStyle`.
- `:focus-visible` styles sit outside the hover media query.
- Scrollable panels get `overflow-y: auto`. Tap targets ≥ 24px.
- Motion is quiet: scroll reveal on headings, cards, rows, stats (BOILERPLATE §1.5); button hover = colour change (no chip sweep); text-link hover = underline fades to full ink; mobile menu per BOILERPLATE §1.8; FAQ accordion with animated height (propose first); reduced motion per BOILERPLATE §1.12.
- Not used: hero parallax, hero arc, text roll, carousels, modals.

**Mobile**
- No mobile frames. Use DESIGN_SYSTEM §3–4 "proposed" values and BOILERPLATE §6. Any undocumented layout decision goes in the phase report and the log below.

**Template structure (BUILD_PROMPT §4)**
- `src/content/site.ts` (client facts), `src/content/home.ts` (one object per section + the section-order array), `src/content/pages/*.ts`.
- `src/components/ui/`, `layout/`, `sections/`; `src/layouts/Base.astro`; `src/styles/` (tokens, typography, global).
- Every section takes its content as props; no copy in components.
- Section order = one array in `home.ts`; `(01)`, `(02)`… generated from that order.
- Client facts only from `site.ts`. Figma `#` layers are the data-driven fields.
- Copy-length limits (DESIGN_SYSTEM §8) written as comments next to each content field.

---

## Decisions log

<!-- Format: - YYYY-MM-DD — decision — reason -->

Owner answers to Phase 0 questions (2026-11-16):

- 2026-11-16 — **Type roles:** a type size/style used 2+ times becomes a real role in `typography.css`, with its tokens added to `tokens.css`. A one-off uses the nearest existing role, and every one-off is logged here. (Owner)
- 2026-11-16 — **Component tokens** live in `tokens.css` in a "Component tokens" block, named after the component (`--btn-h-md: 52px`, `--btn-h-sm: 40px`, `--tag-h: 28px`…). `--space-*` stays for general gaps/padding only; no odd values added to it. All values live in `tokens.css` so a reskin touches one file. (Owner) → `tokens.css` is therefore extended, not kept byte-for-byte unchanged; the original values are never edited.
- 2026-11-16 — **Motion tokens** (easings, durations) in `tokens.css`. Animation rules (keyframes, reveal, reduced motion) in `src/styles/motion.css`. Import order: tokens → typography → global → motion. (Owner)
- 2026-11-16 — **Nav links:** non-current = `--text-nav` (82%) on every page; current = `--text-primary` + `aria-current="page"`. DESIGN_SYSTEM §2 updated. (Owner)
- 2026-11-16 — **Weight modifiers:** `.t-light`, `.t-regular`, `.t-medium`. (Owner)
- 2026-11-16 — **Backgrounds:** keep both `#FFFFFF` (`--bg-raised`) and `#FCFCFC` (`--bg-primary`) exactly as in Figma. (Owner)
- 2026-11-16 — **Why indents:** 176px via `--method-indent` (0 below 1024). Row n indented by n × indent. (Owner)
- 2026-11-16 — **Hero "★ 4.9"** stays ink. `--brand-accent` only for the Testimonial 5-star row. (Owner)
- 2026-11-16 — **Dark section:** headings/titles use `--text-on-dark` (#FCFCFC), including point titles that are #FFFFFF in Figma. Muted text uses the #F2F1ED tints. (Owner)
- 2026-11-16 — **Favicon / OG:** generated placeholders from `site.ts` — favicon = first letter of business name on ink (SVG + 32px ICO + 180px Apple touch icon); OG = 1200×630 from hero image + business name. Both marked "replace per client" in TEMPLATE.md. `<html lang="en-US">`. (Owner)
- 2026-11-16 — **Playwright** approved as a dev dependency for screenshot checks. (Owner)
- 2026-11-16 — **Deploy:** Netlify, static output. `netlify.toml` added in Phase 7 (BOILERPLATE §4.11). No deploy/push until the owner says so. (Owner)

Phase 1 (2026-11-16):

- 2026-11-16 — **Versions:** astro 7.4.12, @astrojs/sitemap 3.7.5, lenis 1.3.27; dev: @playwright/test 1.65.1 (Chromium headless). Node ≥ 22.23.4 in `engines`.
- 2026-11-16 — **New type roles** (each used 2+ times per DESIGN_SYSTEM §3): `.t-body-strong` (16 Medium / 1.4 — names, card & point titles), `.t-small-strong` (14 Medium / 1.4 — nav links, text links). `.t-tag`, `.t-input`, `.t-button-sm` got their missing `--lh-`/`--ls-` tokens. `--lh-ui` (1.4) is reused for input / body-strong / small-strong. DS §10.7: 14 Medium merged to 1.4.
- 2026-11-16 — **Component tokens** added to `tokens.css` from DESIGN_SYSTEM §6 desktop values. Mobile values marked "proposed": `--nav-pad-y` 12 (= (64 − 40)/2), `--split-stack-gap` 20 (DS §4), `--card-gap` 16, `--gallery-row-gap` 40, `--guarantee-pad` = `--section-pad` (80), `--footer-pad-top` = `--section-pad` (80), `--method-indent` 0. `--tag-h` 28 (owner).
- 2026-11-16 — **Focus ring** (not designed, proposed): 2px solid `--text-primary`, offset 3px; on the dark section it uses `--text-on-dark`.
- 2026-11-16 — **Motion values** (BOILERPLATE fallbacks, calm): reveal 800ms / 24px / 0.05s stagger, `--ease-smooth` for travel, `ease` for colour; `--dur-fast` 200ms (all colour hovers), `--dur-base` 300ms, `--dur-icon` 250ms, `--dur-menu` 600ms, `--dur-accordion` 450ms (to be confirmed with the FAQ proposal).
- 2026-11-16 — **Lenis under reduced motion** is not started at all (native scroll); scroll lock then falls back to `html.is-locked { overflow: hidden }`. Resolves BOILERPLATE open question 12 without relying on Lenis' own behaviour.
- 2026-11-16 — **Grid helper:** `.grid` (12 cols ≥ 1024, 4 below; children full-width below 1024), `.span-N` / `.start-N` utilities ≥ 1024, `.split` + `.split__aside` (cols 1–4) / `.split__main` (cols 6–12), stacked with a 20px gap below 1024.
- 2026-11-16 — **Section backgrounds** via modifiers: `.section` (primary), `--raised`, `--secondary`, `--tertiary`, `--inverse`.
- 2026-11-16 — **Favicon / OG** generated by build-time endpoints (`src/pages/favicon.svg.ts`, `favicon.ico.ts`, `apple-touch-icon.png.ts`, `og.png.ts`) via `src/lib/brandImages.ts`, using `sharp` that Astro already ships (no new package). Colours read from `tokens.css`. OG uses plain ink until the hero image is exported in Phase 3. The favicon letter renders in a system sans (Inter isn't available to sharp's SVG renderer).
- 2026-11-16 — **Default `<title>`** = business name only until the owner confirms an SEO title (`site.seo.defaultTitle`). Inner pages: "<Page> — <Business name>". Canonical omitted on `noindex` pages.
- 2026-11-16 — **Dev tool:** `tools/screenshot.mjs` (Playwright) screenshots a URL at given widths and reports horizontal overflow.

Phase 2 (2026-11-16):

- 2026-11-16 — **Nav/footer copy** lives in `src/content/layout.ts` (links, CTA, footer info labels); client facts still only in `site.ts`. `site.ts` filled from the Figma footer (address, phone, email, hours, service area, tagline) + new `region` field ("AZ") for "Scottsdale, AZ".
- 2026-11-16 — **Nav is sticky** with a solid `--bg-primary` background, no border, no blur (proposed; Figma shows a static bar). Pending owner confirmation.
- 2026-11-16 — **Nav link gap** 24 between 1024–1279 (`--nav-link-gap`), 32 from 1280, so links never hit the logo/CTA. Between 1024 and ~1054 the links sit up to 24px left of true centre (the CTA needs its width); centred from ~1054 up.
- 2026-11-16 — **Nav CTA** links to `/contact`.
- 2026-11-16 — **Mobile menu** (proposed, BOILERPLATE §1.8 skeleton): links in `.t-h3`, `--text-nav` (current = primary), as an open list (DS §5 top borders + last bottom border, 16px row padding); footer of the panel = full-width md primary CTA + "City, ST · phone" in `.t-small` tertiary. Hamburger: two 1.5px lines, 18 wide, 5 apart, in a 40 × 40 button whose icon aligns with the content edge.
- 2026-11-16 — **Tag height** comes from padding 6/12 + line height, giving filled 28 / outline 30 exactly as in Figma. `--tag-h` was replaced by `--tag-pad-y` (the owner's `--tag-h: 28px` example would have made the outline tag 2px shorter than Figma).
- 2026-11-16 — **Icons** use `--icon-stroke` (1.5px, DS §2). Figma draws arrowR at 1.125 and arrowUR at 1 — pending owner confirmation.
- 2026-11-16 — **Logo** = `src/assets/brand/logo.svg` (the two outlined text paths from Figma "Logo / Northvale"); main word `currentColor`, sub-line `--text-tertiary`.
- 2026-11-16 — **Footer**: the "Privacy" link has no page in Figma → renders as plain text (no dead link) until a URL exists. Phone/email are `tel:`/`mailto:` links. "© {year}" uses the build year. Info columns are a `<dl>`. Mobile (proposed): top row stacks (gap 32), links wrap (12/24), info = 1 column below 480 (the email doesn't fit a half column at 390), 2 × 2 from 480, 4 across from 1024; row gap 48 (`--footer-gap`, desktop 72); bottom bar stacks (gap 8).
- 2026-11-16 — **Form field** focus (proposed): the underline turns full ink (no outline box). Error text sits under the input in `.t-small` ink (the palette has no error colour).
- 2026-11-16 — **Split layout** also exists as `src/components/layout/Split.astro` (slots `aside` + default) on top of the `.grid.split` classes; `SectionHeader` uses it.
- 2026-11-16 — **Styleguide states**: components accept `data-force="hover|focus"` to show states statically.
- 2026-11-16 — **Known render difference**: Inter text renders ~1% narrower than in Figma (e.g. nav link row 531 vs 536px, wordmark ~8px shorter at 104px). Same font family/weights/tracking; a font-build difference, not a token issue.
- 2026-11-16 — **To check in Phase 3**: Final CTA layer names mention a different city ("Southlake", "Tue–Sat 8am–5pm") — verify the real text before wiring it to `site.ts`.

Phase 3 — Hero, Problem, Services (2026-11-16):

- 2026-11-16 — **Owner defaults pending answers** (Phase 2 questions not yet answered; easy to change): (1) headings use `text-wrap: balance` below 1024 only, so desktop keeps Figma's line breaks; (2) icons keep the 1.5px spec stroke; (3) nav stays sticky; (4) "Privacy" stays plain text; (5) `site.ts` wins over other copies of client facts.
- 2026-11-16 — **Section architecture**: `src/content/types.ts` (one interface per section type, copy limits as comments), `home.ts` exports the ordered `sections` array, `src/components/sections/Sections.astro` maps `type` → component, `src/lib/sections.ts` generates (01), (02)… (hero not counted). Section ids: `<id>-title` for `aria-labelledby`.
- 2026-11-16 — **Client facts in copy**: hero eyebrow uses `site.city`, trust "Rating" value is built from `site.rating/reviewCount/reviewSource`, "Since {site.foundedYear}" (new `foundedYear` field). Hero primary CTA reuses `nav.cta`.
- 2026-11-16 — **Hero headline is 54 chars**, over the DS §8 limit (≤ 45). Kept as in Figma; limit comment left on the type.
- 2026-11-16 — **Images** saved from Figma's original fills (2400px) to `src/assets/home/`; `Media.astro` renders them with `object-fit: cover; object-position: center` (verified: Figma crops are centred). Hero eager + `fetchpriority="high"`, rest lazy.
- 2026-11-16 — **Hero image tone** — CORRECTION: the earlier "Figma is ~13% darker" finding was a measuring error (it compared the cropped Figma render with the full, uncropped photo). Same crop: Figma export mean 105.4/109.2/116.0 vs site render 105.6/109.6/116.0 — identical. No darkening applied; owner told.
- 2026-11-16 — **Service "Details →" links**: PPF → `/protection`, Ceramic → `/coatings`, Track & Partial → `/protection`. Link text gets an sr-only ": {title}" so the three links have distinct names. The "→" is text, as in Figma.
- 2026-11-16 — **Service cards**: number "01"… generated from order; title is an `<h3>` holding number + `.t-h4`; a flex spacer pushes the price row down (Figma uses a fixed 351px text block, 4px taller than its content — not copied).
- 2026-11-16 — **Font: keep the Fontsource provider with the static Inter 300/400/500 files** (owner, 2026-11-16: works on Netlify, looks right; sub-pixel differences from Figma accepted). Do not self-host Inter 3.x.
- 2026-11-16 — **Service "Details →" hover** (owner request): text → full ink + 1px underline fades in (offset `--link-underline-gap`), 200ms; same on focus-visible. No layout shift.
- 2026-11-16 — **Font build**: tested Fontsource's variable Inter (with the `opsz` axis). It made 64px headings narrower than Figma ("The desert is hard on paint." fit on one line; Figma wraps). Reverted to the static 300/400/500 files, which match Figma's line breaks. Residual: Figma appears to use an older Inter build — large text renders ~1.8% narrower here (hero line 1: 1240 vs ~1263px), small text ~0.3% wider; so the 2nd PPF bullet wraps (390.3px needed, 389 available) and the "→" glyph is longer. Only fix would be self-hosting Inter 3.x (owner decision).
- 2026-11-16 — **Mobile (proposed, refine in Phase 4)**: hero padding 32/40, gap 20; hero image 4:3 below 768; trust items stacked below 768, 3 across from 768; stats stacked (gap 40) below 768, 3 across from 768; service cards 1 col, 2 from 768 (DS §4), row gap 56.
- 2026-11-16 — **OG image** now generated from `src/assets/home/hero.jpg` + business name.

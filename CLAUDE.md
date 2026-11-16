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
- Packages: `astro`, `@astrojs/sitemap`, `lenis`. Nothing else without asking. Playwright is approved as a dev dependency for screenshot comparisons.
- Page language `en-US`. Deploy target Netlify (static); see BOILERPLATE §4.0 for project defaults.
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
- Motion control panel from BOILERPLATE §7.2 (easing presets + `--m-*` time/delay/stagger/distance tokens) in `tokens.css`, plus `--dur-fast` / `--dur-base` for hovers. Never write a cubic-bezier or a duration inline.
- Colour hover transitions: 200ms everywhere.
- Entrance animations start at `opacity: 0.001`.
- Use individual `translate` / `scale` properties, not `transform`.
- Nav height is one token (`--nav-h`); JS reads it with `getComputedStyle`.
- `:focus-visible` styles sit outside the hover media query.
- Scrollable panels get `overflow-y: auto`. Tap targets ≥ 24px.
- Motion is quiet: subtle entrances exactly as in BOILERPLATE §7 — hero page-load intro (§7.4), nav intro on Home (§7.5), scroll reveal on headings, cards, rows, stats (§7.6), all driven by the §7.2 tokens; run the §7.8 checklist in Phase 5. Button hover = colour change (no chip sweep); text-link hover = underline fades to full ink; mobile menu per BOILERPLATE §1.8; FAQ accordion with animated height (propose first); reduced motion per BOILERPLATE §1.12.
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

- 2026-11-16 — **Owner answers (Phase 2 questions)**: (1) heading wrapping left to agent judgment → `text-wrap: balance` below 1024 only, desktop keeps Figma's line breaks; (2) icons stay at the 1.5px spec stroke; (3) nav stays sticky; (4) "Privacy" stays plain text, no link; (5) not important → `site.ts` wins over other copies of client facts. (Owner)
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

Phase 3 — Signature offer, Guarantee, Process (2026-11-16):

- 2026-11-16 — **Signature offer** has 7 included rows in Figma, over the DS §8 limit (3–6). Kept as in Figma; the type comment keeps the limit. Row numbers generated from order. CTA label is "Reserve a Consultation" (differs from the nav CTA, as in Figma) → `/contact`.
- 2026-11-16 — **List row** (DS §6): number + `.t-h5.t-regular` title in cols 1–5, description from col 6 (max 500, `--row-desc-max`), tag in cols 11–12 right-aligned. Below 1024 (proposed): stacked, gap 12, tag left.
- 2026-11-16 — **Offer note**: `.t-h3` price line + `.t-body-sm` note (max 640) gap 10, button right on desktop; stacked below 1024 (gap 32, proposed).
- 2026-11-16 — **Guarantee**: the promise title ("The Flawless Edge Promise") is the section's `<h2>`, styled `.t-h5`. Figma sets the detail paragraph at 18px with −0.3% tracking (DS body-lg is −0.5%) — one-off, uses `.t-body-lg`.
- 2026-11-16 — **Process**: steps are an `<ol>`; the big number is `aria-hidden` and each title carries an sr-only "Step n:". Image stretches to the steps' height on desktop (`--ratio-process: auto`), 4:5 portrait below 1024 (proposed), above the steps (DS §4).
- 2026-11-16 — **Verification**: Signature/Guarantee/Process heights within 1–4px of Figma at 1440 (sub-pixel line-height rounding); a few body lines break one word differently (accepted font difference).

Phase 3 — Portfolio, Why, Testimonial (2026-11-17):

- 2026-11-17 — **Grid helper fix**: `.span-N` now sets `grid-column: auto / span N` (was `span N`, which overrode a `.start-N` start column). Found when the Why points (`.start-6.span-7`) collapsed to one column.
- 2026-11-17 — **New `site.ts` fields**: `shortName` ("Northvale", used in "Why Northvale") and `reviewsUrl` (empty → the Testimonial reviews link renders as plain text, no dead link). `TextLink` renders a non-link `<span>` when `href` is empty.
- 2026-11-17 — **Portfolio**: 6 work cards, not links (Figma shows no destinations). 6th image is the same photo as the Track service card (same Figma fill) → reuses `service-track.jpg`. "See the full portfolio" → `/portfolio`.
- 2026-11-17 — **Why**: the index label "(07) Why Northvale" is the section `<h2>` (`SectionIndex as="h2" flush`). Words are an `<ol>`; their "(01)" indexes are `aria-hidden`. Point titles render "01  Title" with the two spaces from Figma (`white-space: pre-wrap`). Figma's #FFFFFF / white 60% / 14% / F2F1ED 50% values folded into `--text-on-dark`, `--text-on-dark-secondary`, `--border-on-dark`, `--text-on-dark-tertiary` (owner decision + DS §10.5).
- 2026-11-17 — **Why staircase indent**: the step is `min(--method-indent, room left ÷ (rows − 1))` via a container query, where "room" = list width − 5.75 × display-xl size (≈ a 12-char word, the DS §8 limit) − gap − index. Exactly 176/352/528 at ≥ 1440 (Figma); evenly smaller steps below (1024: 86/172/258); a shrinkable spacer is the last safety net. Without this the last row overflowed by up to 198px between 1024 and 1439.
- 2026-11-17 — **Testimonial**: index "(08) Reviews" is the section `<h2>`. Quotes are `<figure><blockquote>` + `<figcaption>`. Stars = new filled `star` icon (Figma path) ×5 in `--text-accent`, `role="img"` "Rated 5 out of 5". Quotes keep Figma's mix of curly outer quotes and straight apostrophes. Small-review names are 15 Medium / 1.4 in Figma → one-off, uses `.t-body-sm.t-medium` (line height 1.5). Name → car gap 2px → `--review-author-gap`.
- 2026-11-17 — **Open**: at 390 the word "Documented." (64px, 365px wide) overflows the 350px content width by ~40px — needs a smaller mobile `display-xl` (owner question, Phase 4).

Phase 3 — FAQ, Final CTA, Footer (2026-11-17):

- 2026-11-17 — **Mobile `display-xl` 64 → 56** (owner: "use your best judgement"): `--fs-display-xl` is now `clamp(3.5rem, 1.8286rem + 6.8571vw, 8rem)` — the one original token value changed (BOILERPLATE §6.5: lower the mobile size when a word doesn't fit). DESIGN_SYSTEM §3 and the styleguide updated. Below 1024 the Why "(01)" index sits absolutely at the row's right edge (row padding-right 28). No horizontal scroll from 360 to 1440.
- 2026-11-17 — **Reviews URL**: none yet (owner) → link stays plain text until `site.reviewsUrl` is set.
- 2026-11-17 — **Final CTA facts**: Figma's real text matches `site.ts` (the "Southlake" values were stale layer names only). Service area shows "A, B, … and F" via `joinAnd()` (no serial comma, as in Figma); the footer keeps " · ".
- 2026-11-17 — **FAQ**: question = `<h3><button aria-expanded aria-controls>`, answer = `role="region"` with `hidden`; plus/minus icons from Figma; first item open on load (`openIndex: 0`, as in Figma). Instant open/close for now — animated height proposed in Phase 5. No hover style yet (to propose with the accordion). Phone link: icon + `.t-body-strong`, `tel:` from `site.ts`, underline fades in on hover/focus (same as "Details →").
- 2026-11-17 — **FAQ answers 2–6 are placeholders** "[Answer needed — not in Figma]" — Figma only shows the first answer. Owner to supply copy.
- 2026-11-17 — **Final CTA form** (proposed): Netlify Forms (`data-netlify`, `form-name`, honeypot "company"); fields from content; Name + Email `required`; "What are you interested in?" = radio group styled as chips (single choice), "Concours Shield" pre-selected as in Figma (`defaultValue`). Fields 2 per row from 768, 1 column below. No success page / client-side validation messages yet (Phase 7 with Netlify).
- 2026-11-17 — **Choice chip**: 14 Medium in Figma at line height 1.2 → `.t-small-strong` (1.4, DS §10.7 merge) with `--chip-pad-y: 9px` so the chip stays ≈ 39px tall (Figma 39). Selected = ink fill; hover (proposed) = `--button-outline-bg-hover`.
- 2026-11-17 — **Detail row** values are 16 Medium in Figma (DS said `body`) → `.t-body-strong`.
- 2026-11-17 — **Home page total** at 1440: 13,685px vs Figma 13,669 (+16 = the wrapped Services bullet). FAQ, Final CTA and Footer heights match Figma.

Spec update — entrance animation system (2026-11-17):

- 2026-11-17 — **Owner updated BOILERPLATE (new §7 Entrance animation system) and BUILD_PROMPT §3/§5/§7.** "Fixed decisions" above synced: §7.2 control panel in `tokens.css`, entrances exactly as §7 (hero intro §7.4, Home nav intro §7.5, scroll reveal §7.6), §7.8 checklist in Phase 5; Playwright approved; `en-US`; Netlify; `robots.txt` + `netlify.toml` in Phase 7. (Owner)
- 2026-11-17 — **§7.2 motion tokens added to `tokens.css`** (verbatim): easing presets `--ease-linear/-standard/-in/-out/-in-out/-expo-out/-smooth/-drop`; `--m-intro-*` (0.7s / 0.1s / 0.07s / 20px); `--m-nav-*` (0.6s / 0.1s / 0.05s / button gap 0.1s / 24px); `--m-reveal-*` (0.6s / 0.05s / 24px / stagger-max 0.4s). (Owner)
- 2026-11-17 — **Replaced** the Phase 1 reveal tokens `--dur-reveal` (800ms), `--reveal-distance`, `--reveal-stagger` with the `--m-reveal-*` ones (reveal time is now 0.6s per §7.2). `motion.css` and `reveal.ts` re-pointed to the new names only; `--ease-color` now = `var(--ease-standard)`. Kept for interactions: `--dur-fast` 200ms (hovers), `--dur-base`, `--dur-icon`, `--dur-accordion`, `--dur-menu`. The shared `rise-in` keyframe, hero intro, nav intro, reveal placement and the stagger cap are built in Phase 5 from §7 (no `data-reveal`/`data-intro` markup exists yet, so nothing animates today).

Phase 4 — Responsive (2026-11-17):

- 2026-11-17 — **QA tool** `tools/responsive-check.mjs`: every 50px from 360 to 1440 (+ 390/768/1024/1280) checks horizontal overflow, elements wider than the viewport, text overflowing its box, single-word last lines in headings (≤ 430), tap targets < 24px, inputs < 16px. Final run: **all widths ok**. `screenshot.mjs` and `compare.mjs` now load lazy images before capturing.
- 2026-11-17 — **Tap targets**: new `--tap-min: 24px` + `.tap` utility (padding-block out, equal negative margin back, using `1lh`) — hit area ≥ 24px with zero layout shift (1440 page height unchanged at 13,685). Applied to nav links, footer links/phone/email, service "Details →", FAQ phone, Final CTA contact links, form inputs. Footer list links became `inline-block` so the padding counts.
- 2026-11-17 — **Inputs**: 16px at 390 (`--fs-input` clamp) — no iOS zoom. Their own `padding: 0` changed to `padding-inline: 0` so `.tap` applies.
- 2026-11-17 — **Mobile layout decisions (proposed)**: trust items `--trust-pad` 16/0 stacked below 768 (desktop 28/32/36/0 from 768); process step number column `--step-num-w` 40 + `--step-gap` 16 below 768 (64 / 24 from 768); process image 4:5 below 768, 4:3 at 768–1023 (4:5 full-width was ~900px tall), stretches beside the steps from 1024. Service cards follow DS §4 (1 col, 2 from 768) — at 768–1023 the third card sits alone in its row (kept per DS).
- 2026-11-17 — **Mobile layout decisions carried from Phase 3** (all proposed, all verified 360–1023): hero padding 32/40, gap 20, buttons wrap; hero image 4:3 below 768; stats stacked below 768, 3 across from 768; signature list rows stack (title, description, tag); offer note stacks; Why words 56px with the index at the row's right edge and no indent below 1024; testimonial small reviews stack below 768; FAQ intro above the list (gap = section gap); Final CTA fields 1 per row below 768, chips wrap, visit details below the form; footer per Phase 2; mobile menu below 1024.

Phase 5 — Motion (2026-11-17):

- 2026-11-17 — **Entrances built from BOILERPLATE §7**: one `rise-in` keyframe (`motion.css`); hero intro `[data-intro]` CSS-only, eyebrow → h1 → sub-headline → buttons → image (`--i` 0–4); Home-only nav intro (`<Nav intro />` → `.nav--intro`, logo `--i:0`, links 1–6, `.nav__end` = `data-nav-intro="cta"` timed from `--link-count`, set from the links array); scroll reveal with the §7.6 CSS and the stagger cap (`Math.min(i * s, --m-reveal-stagger-max)`).
- 2026-11-17 — **New token `--m-media-distance: 12px`** (not in the §7.2 block): smaller rise for large images, used by `[data-intro="media"]` (hero image) and `[data-reveal="media"]` (process + final CTA images) instead of inline `--rise-from` values.
- 2026-11-17 — **Nav + hero together**: on Home `body:has(.nav--intro)` sets `--m-intro-delay` to `--m-nav-delay + 2 × --m-nav-stagger` (= 0.2s, §7.5 example) — derived, no number written. Intro ends at 1.18s (§7.4 ≤ ~1.2s).
- 2026-11-17 — **Reveal placement (§7.6)**: section index, h2, intro paragraph; trust items; stats; service cards; signature list label, each row, offer note text, its button; guarantee title, promise, details; process image (media) and each step; work cards and the portfolio link; Why index, each word row, note copy, each point; testimonial index, stars, featured quote, each small review, link; FAQ index, h2, intro, phone, each item; final CTA image (media), h2, intro, form (one block), note, each detail row; footer brand, each link, each info column, wordmark, bottom bar. Never on the nav, intro items, or inside another reveal (96 reveals on Home).
- 2026-11-17 — **Reveal on focus** (accessibility, not in §7): `reveal.ts` reveals a `[data-reveal]` immediately (no stagger) when something inside it receives focus, so keyboard focus never lands on an invisible element.
- 2026-11-17 — **Mobile menu focus fix**: focus moves to the first link on the next frame (double rAF). Under reduced motion the global 0.01ms transition left the panel's `visibility` hidden at the instant of `focus()`, so focus stayed on the toggle.
- 2026-11-17 — **Checks**: `tools/motion-check.mjs` runs the §7.8 checklist (intro timing, once-only, no flash, slow scroll order + 96/96 reveals, no replay on scroll-up, fast scroll + `#faq` anchor, reduced motion, JS disabled, LCP 36ms, one-token change, nesting rules) and a Tab pass at 1440/390 (39 / 33 stops, each visible with a focus style) — all 18 PASS. Mobile menu + FAQ verified by keyboard with and without reduced motion. Responsive check and 1440 Figma comparisons unchanged.
- 2026-11-17 — **FAQ accordion (approved by owner)**: button `aria-expanded` → `role="region"`; height via grid rows 0fr ↔ 1fr (no measuring JS). Open: `--dur-accordion` 450ms + `--ease-smooth`, text fades in and rises `--faq-answer-rise` (8px, new token). Close: `--dur-base` 300ms + `--ease-in` (§7.2 "leaving"); `visibility: hidden` after the close so closed answers are out of the tab order and accessibility tree. Several can be open; first open on load. Icon: one plus whose vertical stroke rotates 90° and fades (`--dur-icon`). Hover/focus: question → `--text-nav`. No JS: all answers shown — closed styles only apply under `html.js` (set by the inline head script before paint, so no flash or layout shift). Reduced motion: instant. Verified: open/close heights over time, a11y tree, hover, reduced motion, no-JS, keyboard, FAQ still matches Figma (633 at compare scale).

Phase 6 — Inner pages (2026-11-17):

- 2026-11-17 — **Owner: run all remaining phases to (not including) deployment without stopping or asking; decide with best judgement and log it.** (Owner)
- 2026-11-17 — **Page architecture**: `src/content/pages/<page>.ts` exports `seo` + an ordered `sections` array; `src/layouts/SectionsPage.astro` (Base + Nav + Sections + Footer) renders any page (Home passes `navIntro`). Repeated sections reuse Home's content via `fromHome(type)` in `src/content/pages/shared.ts`, so shared copy lives once. Indexes renumber per page from the array (Figma's inner-page index numbers are stale/inconsistent, e.g. two "(06)").
- 2026-11-17 — **Hero `variant: 'page'`**: `.t-page-hero` (96) + image ratio `--ratio-page-hero` 1312/520 (4:3 below 768, like Home). Inner pages keep the hero page-load intro; only Home has the nav intro.
- 2026-11-17 — **Current nav link**: Figma underlines it (font underline) → `text-decoration: underline from-font` on `[aria-current=page]`, plus full ink (owner rule).
- 2026-11-17 — **Protection** (303:1999): hero, Problem (= Home), Services "Coverage", Signature, Guarantee, Portfolio (= Home, pixel-diff 0.01), FAQ (= Home with Q4 "Can I choose satin instead of gloss?"), Final CTA (= Home). Hero secondary CTA "See the Concours Shield" → `#signature` (the Concours Shield section on the same page). **Coatings** (303:2553): hero, Services "Coatings", Why (= Home), Testimonial (= Home), FAQ (own 6 questions, first answer from Figma), Final CTA (= Home). Images: reused existing assets where Figma uses the same fill (matched by Figma asset hash); two new photos `coat-over-paint.jpg`, `coat-wheels-glass.jpg`.
- 2026-11-17 — **Service "Details →" on Protection/Coatings** have no destination in Figma → `href: ''` renders plain text (no dead link). Owner to supply targets.
- 2026-11-17 — **Service text block min-height** `--service-text-min: 351px` (≥1024): Figma uses a fixed 351px text block (Home, Coatings), so cards with less content keep Figma's height; taller content (Protection, 376) still grows. Coatings services now match Figma exactly.
- 2026-11-17 — **Verification (1440)**: page heights Home 13,685 (Figma 13,669), Protection 10,048 (10,034), Coatings 8,003 (7,999) — residual = the known wrapped bullet + sub-pixel line heights. Heros match. Responsive check 360–1440: all widths ok.

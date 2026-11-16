# Build prompt — Master B (Astro)

You are building a marketing website in Astro that must be an **exact, pixel-accurate copy** of a Figma design called **Master B**. The site is also a **template**: after this build, it will be reused for other clients by changing brand values, copy and images only. Build it so that's easy.

Work in phases. **Stop at the end of every phase**, report what you did, and wait for my OK before starting the next one.

---

## 1. The files you have

Read these before you do anything else:

| File | What it is | How to read it |
|---|---|---|
| `DESIGN_SYSTEM.md` | How Master B looks: colours, type roles, grid, spacing, components, section order, copy limits, and a list of known Figma inconsistencies | **Read it all.** It is the source of truth for design decisions. |
| `tokens.css` | Every design value as CSS custom properties | **Read it all.** Copy it to `src/styles/tokens.css` unchanged. |
| `BOILERPLATE-GUIDELINES.md` | My standard build rules from a previous Astro project: setup, animation, components, accessibility, conventions, typography method | It's long. **Read now:** Overview, §3 Layout, §4 Project setup, §5 Conventions, §6 Typography, Per-project inputs. **Read the other sections only when you build the thing they describe** (e.g. read §1.8 when you build the mobile menu). |

Where the files disagree:
- `DESIGN_SYSTEM.md` wins on **how things look**.
- `BOILERPLATE-GUIDELINES.md` wins on **how things are built**.
- If something is still unclear, ask me. Never guess.

---

## 2. The Figma design

- File: https://www.figma.com/design/FFs05OacP9URxrCuYpT1fT/My-Portfolio
- Page: **Master B** (page id `24:24`)
- All frames are desktop, 1440 wide. **There are no mobile frames.**

| Frame | Node id |
|---|---|
| Home | `24:596` |
| Protection | `303:1999` |
| Coatings | `303:2553` |
| The Process | `304:121` |
| Portfolio | `304:636` |
| Journal | `304:3045` |
| Contact | `304:3606` |

Home sections, in order:

| Section | Node id |
|---|---|
| Hero + trust strip (`#export`) | `24:597` |
| Problem | `292:121` |
| Services | `24:648` |
| Signature offer | `24:2245` |
| Guarantee | `295:184` |
| Process | `24:799` |
| Portfolio | `297:121` |
| Why Northvale (dark) | `24:695` |
| Testimonial | `24:854` |
| FAQ | `24:875` |
| Final CTA | `24:912` |
| Footer | `24:934` |

**How to read Figma:** use the Figma MCP tools if they are connected.
- Use `get_design_context` and `get_screenshot` on **one section node at a time**. Never request a whole page: the output is too large and wastes credits.
- If the Figma MCP is not connected, tell me in Phase 0 and stop.

**How to use what Figma returns:**
- Treat the code Figma returns as a **reference for measurements**, not code to paste. Rebuild every value with the tokens and role classes from `tokens.css` / `DESIGN_SYSTEM.md`.
- If Figma shows a value that has no token, don't add a random number. Check whether `DESIGN_SYSTEM.md` §10 already explains it (several values are deliberately merged, e.g. text opacities). If it doesn't, **list it and ask me**.
- Copy every text **exactly** as it is in Figma: same words, punctuation, typographic quotes (“ ”), en dashes, `·` separators and `°`.

---

## 3. Fixed decisions (don't ask about these)

**Stack**
- Latest stable Astro. Check the current version and its Node requirement first, and tell me both.
- Static output, plain CSS (no Tailwind), TypeScript strict.
- No React or any UI framework on the site.
- **No CMS in this build.** Content lives in typed files (see §4), structured so a CMS can be added later.
- Packages: `astro`, `@astrojs/sitemap`, `lenis` (smooth scroll + scroll lock). Nothing else without asking me. **Playwright is approved** as a dev dependency for the screenshot comparisons.
- Page language `en-US`. Deploy target **Netlify** (static). See BOILERPLATE §4.0 for these and the other project defaults.
- Font: **Inter**, self-hosted through Astro's fonts API with the Fontsource provider. Weights 300, 400 and 500 only.

**Images**
- Export images from Figma with the MCP asset tools into `src/assets/`, and render them with `<Image>` from `astro:assets` with proper `widths`/`sizes`.
- Above-the-fold images: eager + `fetchpriority="high"`. Everything else: lazy.
- If an image can't be exported, use a grey placeholder at the **exact aspect ratio**, labelled with its name. Never use stock images.
- Icons: inline SVG drawn in `currentColor`, 1.5px stroke, paths copied from Figma.
- Logo: one SVG.

**Code rules**
- Follow the conventions in BOILERPLATE §5 (BEM-like classes, `data-*` JS hooks, `is-*` states, ARIA state as the style hook).
- Never hard-code a colour, font size, spacing value or radius in a component. Use tokens and `.t-<role>` classes only.
- Type role classes: one `.t-<role>` class per role in DESIGN_SYSTEM §3, using the `--fs-` / `--lh-` / `--ls-` tokens. Put them in `src/styles/typography.css`.
- Use a **12-column grid helper** (DESIGN_SYSTEM §4). The signature layout is label in columns 1–4 and content in columns 6–12. Build it once as a utility or component and reuse it. Don't hand-place each section.
- Semantic HTML: one `<h1>` per page, sections with `aria-labelledby`, real `<button>`s and `<a>`s, lists with `role="list"`.

**Defaults for the open questions in BOILERPLATE "Open questions"**
- Put the motion control panel from BOILERPLATE §7.2 (easing presets + `--m-*` time/delay/stagger/distance tokens) in `tokens.css`, plus `--dur-fast` / `--dur-base` for hovers. Never write a cubic-bezier or a duration inline.
- Colour hover transitions are 200ms everywhere.
- Every entrance animation starts at `opacity: 0.001`.
- Use the individual `translate` / `scale` properties for motion, not `transform`.
- The nav height is a single token (`--nav-h`). JS reads it with `getComputedStyle`.
- `:focus-visible` styles always sit **outside** the hover media query.
- Scrollable panels get `overflow-y: auto`.
- Tap targets are at least 24px.

**Motion (keep it quiet; this is a calm, Apple-like design)**
- Subtle entrances exactly as in BOILERPLATE **§7**: hero page-load intro (§7.4), nav intro on Home (§7.5), scroll reveal on headings, cards, rows and stats (§7.6), all driven by the §7.2 tokens.
- Button hover: colour change, no chip sweep. Text-link hover: underline fades to full ink.
- Mobile menu: BOILERPLATE §1.8.
- FAQ: an accordion with animated height. This is a new pattern, so propose the build to me first.
- Reduced motion handled as in BOILERPLATE §1.12.
- Not used: hero parallax, hero arc, text roll, carousels, modals.

**Mobile.** No mobile frames exist. Use the "proposed" mobile values and rules in DESIGN_SYSTEM §3–4 and the typography method in BOILERPLATE §6. Wherever you have to make a layout decision that isn't written down, list it in your phase report.

---

## 4. Template structure

The site must be easy to reskin. Set it up like this:

```
src/
  content/
    site.ts          ← client facts used in many places: business name, phone, email,
                       address, city, hours, service area, rating, review count, social links
    home.ts          ← one object per section, with that section's copy and image references
    pages/*.ts       ← the same pattern for each inner page
  components/
    ui/              ← Button, TextLink, Tag, SectionIndex, SectionHeader, Icon, Logo, FormField…
    layout/          ← Nav (includes the mobile menu), Footer, Grid helpers
    sections/        ← one component per section (Hero, TrustStrip, Problem, Services, …)
  layouts/Base.astro
  pages/
  styles/            ← tokens.css, typography.css, global.css
```

Rules:
- **Every section is a component that takes its content as props.** No copy is hard-coded in a component.
- **Section order lives in a single array** in `home.ts`. Removing or reordering an item must just work.
- **Section index numbers `(01)`, `(02)`… are generated from the array order.** Never type them.
- Client facts (phone, city, name…) come **only** from `site.ts`. The Figma layers starting with `#` (e.g. `#phone`, `#city`, `#business-name`, `#headline`) are the fields that must be data-driven.
- Respect the copy-length limits in DESIGN_SYSTEM §8. Write them as comments next to each content field.

---

## 5. Phases

### Phase 0 — Read and plan (no code)
1. Read the files as described in §1.
2. Confirm Figma MCP access by taking a screenshot of the Hero node `24:597`.
3. Create `CLAUDE.md` in the project root with:
   - the agent working rules from BOILERPLATE §5 rule 11;
   - the "fixed decisions" above;
   - a **Decisions log** section, empty for now.
4. Give me:
   - your build plan;
   - the component list;
   - anything in the three files that is unclear or contradicts itself;
   - questions, as a numbered list.

**Stop.**

### Phase 1 — Project setup
Do the following:
- Create the Astro project.
- Install only the approved packages.
- Set up the config, fonts and sitemap (`site` set to a placeholder URL).
- Add `.gitignore`, then `git init` and make the first commit.
- Add `tokens.css` unchanged.
- Build `typography.css` with every role.
- Build `global.css`: reset, container, 12-column grid helper, section spacing, focus ring, `.sr-only`, reduced motion, scroll lock, reveal.
- Create `Base.astro` with full meta (title, description, canonical, Open Graph and Twitter tags, favicon set).

Then build a private `/styleguide` page (`noindex`, excluded from the sitemap) that shows:
- every colour token as a swatch with its name;
- every type role at its real size, with the name and its desktop and mobile sizes;
- the spacing scale;
- the grid, overlaid.

**Stop.** I'll check the styleguide against Figma.

### Phase 2 — Core components
Build these components:
- Logo, Icon
- Button (primary/outline, md/sm), button pair
- TextLink with arrow
- Tag (outline/filled)
- SectionIndex `(01) LABEL`
- SectionHeader (4 + 7 columns)
- FormField (underline style)
- Nav with the mobile menu
- Footer

Add every component to `/styleguide` in all its variants and states (hover, focus).

**Stop.**

### Phase 3 — Home page, section by section
Build the sections in the order from §2.

For **each** section:
1. `get_design_context` + `get_screenshot` for that node only.
2. Build it with the core components, tokens and grid.
3. **Verify at 1440:** screenshot your section at a 1440px viewport and compare it with the Figma screenshot. Check:
   - every font size, weight, line height and colour;
   - every gap and padding;
   - the alignment to the grid;
   - the image ratios;
   - the line breaks of headings.
   Fix every difference, then compare again.
4. Write a short list of anything you couldn't match exactly and why.

Report to me after every **3 sections** (Hero–Services, Signature–Process, Portfolio–FAQ, Final CTA–Footer), with your screenshots next to the Figma ones. **Stop** at each report.

### Phase 4 — Responsive
Check and fix Home at 390, 768, 1024, 1280 and 1440, using the proposed mobile rules. Also check that nothing breaks between those widths: drag across, or screenshot every 50px between 360 and 1440.

At each width check for:
- no horizontal scroll;
- no text overflow, and no single-word lines in headings at 390;
- tap targets ≥ 24px;
- form inputs ≥ 16px.

Send me screenshots at 390 and 768, plus your list of mobile layout decisions.

**Stop.**

### Phase 5 — Motion
Add the motion listed in §3. Run the BOILERPLATE §7.8 checklist. Show me the FAQ accordion approach before you build it.

Test:
- with reduced motion turned on;
- keyboard only (Tab through the whole page, open and close the menu and the FAQ).

**Stop.**

### Phase 6 — Inner pages
Build Protection, Coatings, The Process, Portfolio, Journal and Contact.

- Reuse the section components wherever the design repeats one. Only build a new component when the design really has a new block, and tell me which ones are new.
- The current page's nav link gets `aria-current="page"`.
- Verify each page at 1440 and 390, the same way as Phase 3.

**Stop** after every 2 pages.

### Phase 7 — QA and launch prep
- Lighthouse on every page. Targets: Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100, CLS < 0.05.
- Run `astro check` and a production build with no warnings.
- Add a 404 page (Base + Nav + Footer).
- Add `robots.txt` and `netlify.toml` (BOILERPLATE §4.11).
- Check every link and image. Add proper alt text, except decorative images, which get `alt=""`.
- Write a short `TEMPLATE.md`: how to reskin for a new client (brand tokens, font, logo, `site.ts`, section array, images), in 10 steps or fewer.

**Stop.** Don't deploy or push anywhere until I say so.

---

## 6. Working rules

- **One phase at a time.** Wait for my OK between phases. Commit at the end of every phase with a clear message.
- **Never invent design.** If Figma doesn't show it and the files don't say it, ask me.
- **Keep the decisions log in `CLAUDE.md` up to date:** every choice you made that isn't in the files, with the date.
- **Save credits:**
  - read Figma one section at a time;
  - read BOILERPLATE sections only when needed;
  - don't re-read files you've already read in this session unless they changed;
  - don't paste large files back to me; summarise.
- When you report:
  - say what's done;
  - say what doesn't match Figma yet, and why;
  - list your questions;
  - keep it short.

Start with Phase 0.

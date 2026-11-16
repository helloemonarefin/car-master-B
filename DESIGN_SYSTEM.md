# Master B — Design System (template edition)

**Source:** Figma file "My Portfolio" › page **Master B**. Seven desktop frames at 1440: Home, Protection, Coatings, The Process, Portfolio, Journal, Contact. Sample brand in the file: "Northvale Atelier" (car paint protection).

**Purpose:** Master B is a **template**. Each new client gets the same layout and components with new copy, images, and a few brand values. This file says what's fixed and what changes per client.

**Files that go with it:**
- `tokens.css`: every value below as CSS custom properties.
- `BOILERPLATE-GUIDELINES.md`: the build rules (setup, animation, accessibility, typography method). This file only covers how Master B looks.

**Labels used here:**
- **Figma** = measured from the file.
- **Proposed** = not in the file, decided here. The file has no mobile frames and no hover states.
- ⚠ = an inconsistency in the Figma file. They're collected in §10.

---

## 1. Template model: what changes per client

| Layer | What it includes | Per client? |
|---|---|---|
| **Brand slot** | `--brand-ink`, `--brand-paper`, `--brand-accent`, font family, logo SVG | Yes, 3 colours + 1 font + logo |
| **Content** | All copy, images, phone, address, hours, prices, reviews, FAQ | Yes, from one content file |
| **Section list** | Which sections appear and in what order | Yes: on/off and reorder only |
| **Skeleton** | Grid, spacing, type scale, components, animation | No, never edited per client |

**Content slots.** In Figma, layers whose name starts with `#` are already content slots: `#headline`, `#subheadline`, `#cta`, `#rating`, `#years`, `#certification`, `#city`, `#phone`, `#business-name`, `#hero-image`, `#accent`. Keep this convention:
- every `#` layer maps to one field in `src/content/site.ts` (brand facts) or in the section's content entry;
- client facts used in several places (business name, phone, city, address, hours, service area, rating) live **once** in `site.ts` and are reused everywhere;
- section numbers `(01)`, `(02)`… are **generated from the section order**, never typed. Reordering or removing a section renumbers the rest automatically.

**Reskin checklist for a new client:**
1. Set the 3 brand colours (+ their `-rgb` versions) in `tokens.css`.
2. Swap the font, then re-check letter spacing (boilerplate §6.5).
3. Replace the logo SVG.
4. Fill in `site.ts` and each section's content.
5. Turn sections on or off.
6. Check the copy-length limits in §8.

---

## 2. Colour

Nine values in total. The whole palette is one ink colour at different opacities on near-white backgrounds, with one accent.

### Brand slot (change per client)

| Token | Value | Use |
|---|---|---|
| `--brand-ink` | `#141414` | Text, primary button, dark section |
| `--brand-paper` | `#FCFCFC` | Main background |
| `--brand-accent` | `#8C6A43` | Rating stars only. Keep it rare: it's the only colour on the page. |

### Text

| Token | Value | Use |
|---|---|---|
| `--text-primary` | ink 100% | Headings, values, button labels |
| `--text-nav` | ink 82% | Nav and footer links, footer info |
| `--text-secondary` | ink 66% | Paragraphs, descriptions |
| `--text-tertiary` | ink 46% | Labels, `(01)` indexes, meta, fine print |
| `--text-placeholder` | ink 35% | Input placeholders, decorative dashes |
| `--text-inverse` | `#FFFFFF` | On the primary button |
| On dark: `--text-on-dark` / `-secondary` / `-tertiary` | paper / `#F2F1ED` 66% / 46% | "Why" section |

⚠ Figma uses 7 ink opacities (100, 82, 66, 55, 46, 35, 30).
- 55% appears on the logo sub-line and on inner-page nav links (likely the non-current ones). Logo sub-line: use `--text-tertiary`. Nav links: non-current use `--text-nav` (82%) on every page, same as Home; the current page link is `--text-primary` with `aria-current="page"` (owner decision, 2026-11-16).
- 30% appears only on the "—" bullet dashes. It folds into 35% (`--text-placeholder`).

### Backgrounds

| Token | Value | Sections |
|---|---|---|
| `--bg-primary` | `#FCFCFC` | Hero, Services, Signature offer, Process, FAQ |
| `--bg-raised` | `#FFFFFF` | Problem, Portfolio, Testimonial |
| `--bg-secondary` | `#F5F5F5` | Guarantee, Final CTA |
| `--bg-tertiary` | `#EEEEEE` | Footer |
| `--bg-inverse` | `#141414` | Why section (the one dark band) |

⚠ `#FFFFFF` vs `#FCFCFC` is almost invisible on screen. Either make the difference intentional (for example `#F8F8F6` for paper) or merge them.

### Borders (all 1px)

| Token | Value | Use |
|---|---|---|
| `--border-subtle` | ink 12% | Row dividers: list rows, steps, FAQ, footer |
| `--border-default` | ink 20% | Form-field underlines, tags, stat top rules |
| `--border-strong` | ink 30% | Outline button |
| `--border-link` | ink 40% | Text-link underline |
| `--border-on-dark` | `#F2F1ED` 12% | Dividers in the dark section |

Icons are outline style with a 1.5px stroke, drawn in `currentColor`.

---

## 3. Typography

One family, **Inter**, in three weights: Light 300 for large text, Regular 400, Medium 500. Sizes are fluid from 390 to 1440 (see boilerplate §6 for the method). Desktop values are measured from Figma. Mobile values come from the file's `Mobile/*` text styles where they exist; the rest are proposed.

| Role (`.t-…`) | Used for | Desktop | Mobile | Weight | Line height (desktop) | Letter spacing |
|---|---|---|---|---|---|---|
| `display-xl` | "Why" statement words | 128 | 64 | Light | 0.90 | −5% |
| `hero` | Home hero headline | 112 | 48 | Light | 0.94 | −4.5% |
| `wordmark` | Footer business name | 104 | 48 (proposed) | Light | 0.96 | −4% |
| `page-hero` | Inner-page hero headline | 96 | 44 (proposed) | Light | 0.94 | −4.5% |
| `stat` | Big numbers (115°F, $4,000+) | 80 | 48 | Light | 0.96 | −4% |
| `h2` | Section titles | 64 | 38 | Light | 1.04 | −3% |
| `quote` | Testimonial, guarantee text | 40 | 26 | Light | 1.22 | −2% |
| `h3` | Sub-heads, price line | 32 | 24 (proposed) | Light | 1.2 | −2% |
| `step` | Process step numbers | 28 | 22 | Regular | 1.2 | −1.5% |
| `h4` | Service card titles | 24 | 20 (proposed) | Regular | 1.25 | −1.5% |
| `h5` | Trust values, row titles, prices | 20 | 18 (proposed) | Medium (rows: Regular) | 1.3 | −1% |
| `quote-sm` | Small review cards | 20 | 18 (proposed) | Light | 1.4 | −1% |
| `body-lg` | Intro paragraphs | 18 | 18 | Regular | 1.55 | −0.5% |
| `input` | Form field text | 17 | 16 | Regular | 1.4 | −0.3% |
| `body` | Descriptions | 16 | 16 | Regular (Medium for names) | 1.55 (Medium 1.4) | −0.3% |
| `body-sm` | Bullets, small notes | 15 | 15 | Regular | 1.5 | −0.3% |
| `small` | Nav links, meta, links | 14 | 14 | Regular / Medium | 1.5 / 1.4 | 0 |
| `tag` | Tags ("Included", "Bonus") | 13 | 13 | Medium | 1.2 | 0 |
| `label` | Eyebrows, small labels | 12 | 12 | Medium, UPPERCASE | 1.2 | +6% |
| `button` / `button-sm` | Button labels | 15 / 14 | 15 / 14 | Medium | 1.0 | −0.2% |

**Rules specific to Master B:**
- Headings are Light. Hierarchy comes from size and colour, not weight.
- Every heading gets `text-wrap: balance`. Paragraphs max out around 65ch (the Figma paragraphs are 528–752px wide).
- Line heights in `tokens.css` are mobile-first; display and heading lines get slightly looser below 1024.
- The logo is "NORTHVALE" (16 Medium, +24%) over "ATELIER" (9 Regular, +62%). Export it as one SVG rather than rebuilding it as text.

---

## 4. Layout and grid

**A 12-column grid sits under every section.** The Figma widths all fit it exactly:

| Item | Value |
|---|---|
| Frame | 1440 |
| Side margins | 64 |
| Content width | 1312 |
| Columns × width | 12 × 80 |
| Gutter | 32 |

Common spans, all measured in the file:

| Span | Width | Where |
|---|---|---|
| 4 columns | 416 | Section label, cards (3 across), FAQ intro, footer brand |
| 5 columns | 528 | Process image, hero sub-headline |
| 7 columns | 752 | Section title column, FAQ list, quote, steps |
| 12 columns | 1312 | Images, lists, gallery rows |
| 1 column + 2 gutters | 144 | Gap between the label (cols 1–4) and the title (cols 6–12) |

**The signature layout** (used in almost every section): label in columns 1–4, title and content in columns 6–12, column 5 left empty.

**Vertical rhythm:**

| Item | Desktop (Figma) | Mobile (proposed) |
|---|---|---|
| Section padding | 160 top/bottom (Guarantee 140; Footer 96/40) | 80 |
| Header → content gap | 80 (Why 96, Final CTA 72) | 48 |
| Card grid gap | 32 | 16 |
| Gallery row gap | 56 | 40 |
| Nav height | 88 (24 vertical padding) | 64 |

**Mobile (proposed; the file has no mobile frames):**
- 4 columns, 16 gutter, 20 side padding.
- Label/title layouts stack (label on top, gap 20).
- Cards: 1 column, 2 columns from 768.
- The process image sits above the steps.
- The "Why" word indents are removed; the rows become left-aligned.
- Footer info becomes 2 × 2.
- The nav switches to the mobile menu (boilerplate §1.8).

---

## 5. Radius, borders, effects

- **Radius:** images 4px, buttons and tags 999px (pill). Everything else 0.
- **Lists are open:** rows are separated by a top border (`--border-subtle`), and the **last row gets a bottom border too**. No boxes or cards with backgrounds.
- **No shadows, no gradients, no blur** in the design.

---

## 6. Components

All sizes are desktop. Each component is an Astro component with skeleton rules from the boilerplate.

| Component | Spec |
|---|---|
| **Nav** | Height 88, padding 24/64. Logo left (cols 1–4), links centred (gap 32, `small` Medium, `--text-nav`), small primary button right. The 340/536/340 split keeps the links centred. |
| **Button / Primary** | md: height 52, padding 0/24, `button` 15 Medium. sm: height 40, padding 0/20, 14 Medium. Pill, `--button-primary-bg`, white text. |
| **Button / Outline** | Same sizes as primary. Transparent fill, 1px `--border-strong`, ink text, optional arrow icon (gap 10). |
| **Button pair** | Gap 12. Primary first. |
| **Hover states** | Not designed (**proposed**): primary darkens to `--button-primary-bg-hover`; outline fills `--button-outline-bg-hover`. Use the boilerplate's button motion. |
| **Text link** | `small` Medium, ink, 1px `--border-link` underline with 6px gap, 16px arrow-up-right icon (gap 8). |
| **Tag** | Height 28–30, padding 6/12, pill, `tag` 13 Medium. Outline variant: 1px `--border-default`. Filled variant: ink background, white text. |
| **Section index** | `(01)` in `--text-tertiary` + LABEL in `--text-primary`, both `label` 12, gap 12, padding-top 14 (lines up with the title's cap height). |
| **Section header** | Index (4 columns) + title column (7 columns): `h2` + optional `body-lg` intro, gap 24. |
| **Trust item** | 3 across. `label` (tertiary) over `h5` value, gap 12, padding 28/32/36/0. |
| **Stat** | Top border `--border-default`, padding-top 28, `stat` number, `body` caption (secondary), gap 16. 3 across. |
| **Service card** | 4-column image 416 × 440 (r4); then title row (`(01)` small tertiary + `h4`), description (`body`, secondary), bullet list (`body-sm` with a dash marker, gap 10), spacer, price row (top border subtle, padding-top 20, `h5` price + "Details →" link). Cards in a row share a height; the spacer pushes the price to the bottom. |
| **List row** | Padding 24/0, top border subtle. Number (`small` tertiary) + title (`h5` Regular) in cols 1–5; description (`body` secondary) in the middle; tag aligned right. |
| **Offer note** | `h3` price line + `body-sm` note (secondary) on the left, primary button on the right. |
| **Guarantee / Quote** | Index left; right column: `h5` title, `quote` text, `body-lg` + `small` details, gap 40. |
| **Process step** | Padding 28/0, top border subtle, `step` number (tertiary, 64 wide) + text block (gap 6). |
| **Work card** | Image 416 × 312 (r4), then title (`body` Medium) + meta (`small` secondary), gap 20. |
| **Method row (dark)** | `display-xl` word + `(01)` index (`small`, on-dark tertiary), bottom border on-dark. Rows step right by a fixed indent. |
| **Point row (dark)** | Padding 16/0, top border, `body` Medium title + `body-sm` text (on-dark secondary), gap 4. |
| **Testimonial** | Stars: 5 × 16px in `--brand-accent`, gap 4. Then `quote`, author (`body` Medium + `small` secondary), two smaller review cards (`quote-sm`, top border), and a text link. Gap 40. |
| **FAQ item** | Padding 28/0, top border subtle. Question row (`h5`-sized text + plus/minus icon, gap 24); the answer (`body-lg` secondary, max width 600) opens below with gap 14. Build it as an accordion; boilerplate §2.16 notes there's no source pattern yet. |
| **Form field** | Label (`label`, tertiary), input (`input`, placeholder `--text-placeholder`), 1px `--border-default` underline, padding-bottom 14. Fields sit two per row with gap 32. |
| **Detail row** | Padding 20/0, top border subtle, `label` tertiary over `body` value, gap 8. |
| **Footer** | `--bg-tertiary`, padding 96/64/40, gap 72. Top row: brand + links. Then 4 info columns (`label` + `body-sm` in `--text-nav`). Then the `wordmark`. Then the bottom bar (top border, `small` tertiary). |

---

## 7. Landing-page section order (Home)

| # | Section | Background | Content |
|---|---|---|---|
| — | Hero + trust strip | primary | Eyebrow, `hero` headline, intro + 2 buttons, full-width image (1312 × 600), 3 trust items |
| 01 | Problem | raised | Header + 3 stats |
| 02 | Services | primary | Header + 3 service cards |
| 03 | Signature offer | primary | Header + included list (3–6 rows) + offer note |
| 04 | Guarantee | secondary | Quote layout |
| 05 | Process | primary | Header + image (5 cols) + steps (7 cols) |
| 06 | Portfolio | raised | Header + 2 × 3 work cards + text link |
| 07 | Why | **inverse** | 4 method rows + intro + 4 points |
| 08 | Testimonial | raised | Stars, quote, 2 small reviews, text link |
| 09 | FAQ | primary | Intro + phone link (4 cols), accordion (7 cols) |
| — | Final CTA | secondary | Wide image (1312 × 520), heading, form, details column |
| — | Footer | tertiary | |

Inner pages reuse the same blocks with a `page-hero` (96) at the top.

---

## 8. Copy-length limits (template safety)

These keep the layout intact when the copy changes:

| Slot | Limit |
|---|---|
| Hero headline | ≤ 45 characters (2 lines at 112 on desktop) |
| Section title (`h2`) | ≤ 2 lines in 752px, about 40 characters |
| Intro paragraph | ≤ 3 lines, about 220 characters |
| Service cards | Exactly 3; 3–5 bullets each; title ≤ 32 characters |
| Included list | 3–6 rows |
| Process steps | 4–6 |
| Why words | 3–4 rows, each ≤ 12 characters at 128px |
| FAQ | 4–8 questions |
| Trust items and stats | Exactly 3 each |

---

## 9. Motion

The Figma file has no motion. Use the boilerplate defaults:
- scroll reveal on every heading, card, row and stat (§1.5);
- button and text-link hover (§1.7);
- mobile menu (§1.8);
- FAQ accordion as a new pattern.

Keep motion quiet so it matches the calm, Apple-like layout.

---

## 10. Figma clean-up list (fix in the file before the next template use)

1. **563 of about 1,000 text layers have no text style.** Mostly the 15/14/20 Regular text, the 17px inputs, the 24px card titles, the 112px hero and the 96px page heroes. Create styles for every role in §3 and apply them.
2. **The hero headline (112) matches no style.** The existing Display styles are 128, 104 and 88. Add a `Hero` style.
3. **The "Why" words use 128 / 90% / −5%**, but the `Desktop/Display XL` style says 128 / 94% / −4.5%. Pick one.
4. **Seven text opacities**, reduced to five in §2.
5. **The dark section mixes two off-whites:** `#FFFFFF` at 60% and 14% next to `#F2F1ED` at 66%, 50% and 12%, plus `#FFFFFF` vs `#FCFCFC` for headings. Use the warm `#F2F1ED` set throughout.
6. **`#FFFFFF` vs `#FCFCFC` section backgrounds** are nearly identical (§2).
7. **14px Medium is used at line height 1.2 and 1.4.** 15px Regular is used at −0.3% and 0% tracking. Merge each pair.
8. **The "Why" row indents (176 / 352 / 528) are off the grid.** Grid steps are 112 (1 column + gutter). Either align them to 112 / 224 / 336, or keep 176 as a deliberate exception.
9. **Stale layer names**, for example "Why Southlake trusts us", "15+", "Daniel R." holding other text, and a duplicated "05" step layer. Rename them so the `#` content slots map cleanly to code.
10. **Master B uses no variables.** The file's "Portfolio / Color" and "Portfolio / Type" collections belong to a different design. Create a "Master B" variable collection with the tokens from `tokens.css`, so Figma and code share names.
11. **No mobile frames and no hover states.** Everything marked "proposed" above should be designed at 390 before the build.

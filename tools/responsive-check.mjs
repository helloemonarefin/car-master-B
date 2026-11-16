// Dev-only: responsive QA (BUILD_PROMPT Phase 4).
// Usage: node tools/responsive-check.mjs <url> [widths]   (default: 360…1440 every 50 + 390/768/1024/1280)
// Reports per width: horizontal overflow, elements wider than the viewport,
// text that overflows its own box, headings whose last line is a single word,
// tap targets < 24px, and form inputs with font-size < 16px.
import { chromium } from '@playwright/test';

const [url, widthsArg] = process.argv.slice(2);
const widths = widthsArg
  ? widthsArg.split(',').map(Number)
  : [...new Set([...Array.from({ length: 22 }, (_, i) => 360 + i * 50), 390, 768, 1024, 1280, 1440])].sort((a, b) => a - b);

const browser = await chromium.launch();
let problems = 0;
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const r = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const label = (el) => {
      const cls = typeof el.className === 'string' ? el.className.split(' ').filter((c) => !c.startsWith('astro-'))[0] : '';
      return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''} "${(el.textContent || '').trim().slice(0, 30)}"`;
    };
    const visible = (el) => {
      const s = getComputedStyle(el);
      if (s.visibility === 'hidden' || s.display === 'none') return false;
      if (el.closest('[hidden], [inert], .sr-only')) return false;
      const b = el.getBoundingClientRect();
      return b.width > 0 && b.height > 0;
    };
    const out = { overflow: document.documentElement.scrollWidth - vw, wide: [], textOverflow: [], orphans: [], tap: [], inputs: [] };

    for (const el of document.querySelectorAll('body *')) {
      if (!visible(el)) continue;
      const b = el.getBoundingClientRect();
      if (b.right > vw + 0.5 || b.left < -0.5) out.wide.push(`${label(el)} ${Math.round(b.left)}→${Math.round(b.right)}`);
      const s = getComputedStyle(el);
      if (/^(P|H[1-6]|SPAN|A|DT|DD|LI|BUTTON|LABEL)$/.test(el.tagName) && s.overflowX !== 'visible' ? false : el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0 && s.display !== 'inline') {
        if (/^(P|H[1-6]|DT|DD)$/.test(el.tagName)) out.textOverflow.push(`${label(el)} ${el.scrollWidth}>${el.clientWidth}`);
      }
    }

    // Headings: last line a single word?
    for (const h of document.querySelectorAll('h1, h2, h3, .t-hero, .t-h2, .t-h3, .t-quote, .t-stat, .t-display-xl, .t-page-hero, .t-wordmark')) {
      if (!visible(h)) continue;
      const text = (h.textContent || '').trim();
      if (text.split(/\s+/).length < 3) continue;
      const range = document.createRange();
      range.selectNodeContents(h);
      const lines = [];
      for (const rect of range.getClientRects()) {
        const last = lines[lines.length - 1];
        if (last && Math.abs(last.top - rect.top) < 2) last.right = Math.max(last.right, rect.right), last.left = Math.min(last.left, rect.left);
        else lines.push({ top: rect.top, left: rect.left, right: rect.right });
      }
      if (lines.length < 2) continue;
      // Find the words on the last line.
      const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      const lastTop = lines[lines.length - 1].top;
      let words = 0;
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const re = /\S+/g;
        let m;
        while ((m = re.exec(n.textContent))) {
          const rr = document.createRange();
          rr.setStart(n, m.index);
          rr.setEnd(n, m.index + m[0].length);
          const rect = rr.getClientRects()[0];
          if (rect && Math.abs(rect.top - lastTop) < 2) words++;
        }
      }
      if (words === 1) out.orphans.push(label(h));
    }

    // Tap targets (inline links inside running text are exempt, as in WCAG 2.5.8).
    for (const el of document.querySelectorAll('a[href], button, input, select, textarea, label.chip')) {
      if (!visible(el) && !(el.matches('input') && el.closest('label.chip'))) continue;
      const target = el.matches('input') && el.closest('label.chip') ? el.closest('label.chip') : el;
      if (el.matches('input[type=hidden]') || el.closest('.sr-only')) continue;
      const b = target.getBoundingClientRect();
      const inline = getComputedStyle(target).display === 'inline' && target.closest('p');
      if (!inline && (b.width < 23.5 || b.height < 23.5)) out.tap.push(`${label(target)} ${Math.round(b.width)}×${Math.round(b.height)}`);
    }

    for (const el of document.querySelectorAll('input:not([type=hidden]):not([type=radio]), select, textarea')) {
      if (el.closest('.sr-only')) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 16) out.inputs.push(`${label(el)} ${fs}px`);
    }
    return out;
  });

  const issues = [];
  if (r.overflow > 0) issues.push(`horizontal overflow ${r.overflow}px`);
  if (r.wide.length) issues.push(`wider than viewport: ${r.wide.slice(0, 4).join('; ')}`);
  if (r.textOverflow.length) issues.push(`text overflow: ${r.textOverflow.slice(0, 4).join('; ')}`);
  if (r.orphans.length && width <= 430) issues.push(`single-word last line: ${r.orphans.join('; ')}`);
  if (r.tap.length) issues.push(`tap < 24: ${r.tap.slice(0, 6).join('; ')}`);
  if (r.inputs.length) issues.push(`input < 16px: ${r.inputs.join('; ')}`);
  problems += issues.length;
  console.log(`${String(width).padStart(4)}  ${issues.length ? issues.join('\n      ') : 'ok'}`);
  await page.close();
}
await browser.close();
console.log(problems ? `\n${problems} issue group(s)` : '\nall widths ok');

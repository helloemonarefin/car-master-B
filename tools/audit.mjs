// Dev-only: page audit standing in for Lighthouse (Phase 7).
// Usage: node tools/audit.mjs <baseUrl> [paths]
// Per page, at 390 and 1440: CLS, LCP; images (alt present, width/height);
// unnamed links/buttons; duplicate ids; head basics; text contrast < 4.5:1
// (3:1 for large text) measured on computed colours against the real backdrop.
import { chromium } from '@playwright/test';

const [base = 'http://localhost:4321', pathsArg] = process.argv.slice(2);
const paths = pathsArg ? pathsArg.split(',') : ['/', '/protection', '/coatings', '/process', '/portfolio', '/journal', '/contact', '/404'];
const browser = await chromium.launch();
let fails = 0;

for (const path of paths) {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
    await page.addInitScript(() => {
      window.__cls = 0;
      window.__lcp = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((l) => { const e = l.getEntries().at(-1); window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // Scroll through so lazy images load and reveals settle, then back.
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 700) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(80); }
    await page.waitForTimeout(1200);

    const r = await page.evaluate(() => {
      const out = { issues: [] };
      const push = (s) => out.issues.push(s);
      out.cls = window.__cls;
      out.lcp = window.__lcp;

      // Head basics
      const d = document;
      if (d.documentElement.lang !== 'en-US') push('html lang');
      if (!d.title) push('no <title>');
      if (!d.querySelector('meta[name=description]')?.content) push('no meta description');
      if (!d.querySelector('meta[name=viewport]')) push('no viewport');
      const robots = d.querySelector('meta[name=robots]')?.content || '';
      if (!robots.includes('noindex') && !d.querySelector('link[rel=canonical]')) push('no canonical');
      if (d.querySelectorAll('h1').length !== 1) push(`h1 count ${d.querySelectorAll('h1').length}`);

      // Images
      for (const img of d.querySelectorAll('img')) {
        if (!img.hasAttribute('alt')) push(`img without alt: ${img.src.slice(-40)}`);
        if (!img.getAttribute('width') || !img.getAttribute('height')) push(`img without width/height: ${img.src.slice(-40)}`);
        if (img.complete && img.naturalWidth === 0) push(`broken img: ${img.src.slice(-40)}`);
      }
      // Names
      const name = (el) => (el.getAttribute('aria-label') || el.textContent || el.querySelector('img')?.alt || '').trim();
      for (const el of d.querySelectorAll('a[href], button')) if (!name(el)) push(`unnamed ${el.tagName.toLowerCase()}`);
      // Duplicate ids
      const ids = {};
      for (const el of d.querySelectorAll('[id]')) ids[el.id] = (ids[el.id] || 0) + 1;
      for (const [id, n] of Object.entries(ids)) if (n > 1) push(`duplicate id #${id} ×${n}`);
      // Form labels
      for (const inp of d.querySelectorAll('input:not([type=hidden]):not([type=radio]), textarea, select')) {
        if (inp.closest('.sr-only')) continue;
        if (!(inp.id && d.querySelector(`label[for="${inp.id}"]`)) && !inp.closest('label') && !inp.getAttribute('aria-label')) push(`input without label: ${inp.name}`);
      }

      // Contrast
      const parse = (c) => { const m = c.match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 0]; };
      const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      const bgOf = (el) => {
        let layers = [];
        for (let e = el; e; e = e.parentElement) {
          const c = parse(getComputedStyle(e).backgroundColor);
          const a = c[3] ?? 1;
          if (a > 0) { layers.push([c[0], c[1], c[2], a]); if (a >= 1) break; }
          if (getComputedStyle(e).backgroundImage !== 'none') return null; // over an image: skip
        }
        let col = [255, 255, 255];
        for (const [r, g, b, a] of layers.reverse()) col = [r * a + col[0] * (1 - a), g * a + col[1] * (1 - a), b * a + col[2] * (1 - a)];
        return col;
      };
      const seen = new Set();
      const walker = d.createTreeWalker(d.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (!n.textContent.trim()) continue;
        const el = n.parentElement;
        if (seen.has(el)) continue;
        seen.add(el);
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || el.closest('[aria-hidden="true"], .sr-only, [hidden], [inert]')) continue;
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        const bg = bgOf(el);
        if (!bg) continue;
        const fg = parse(cs.color);
        const a = fg[3] ?? 1;
        const fgc = [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a)];
        const [x, y] = [lum(fgc), lum(bg)].sort((p, q) => q - p);
        const ratio = (x + 0.05) / (y + 0.05);
        const size = parseFloat(cs.fontSize);
        const large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
        if (ratio < (large ? 3 : 4.5) - 0.01) push(`contrast ${ratio.toFixed(2)} "${el.textContent.trim().slice(0, 28)}" (${size}px)`);
      }
      return out;
    });

    const problems = [...r.issues];
    if (r.cls >= 0.05) problems.push(`CLS ${r.cls.toFixed(3)}`);
    fails += problems.length;
    console.log(`${(path + ' @' + width).padEnd(20)} CLS ${r.cls.toFixed(3)}  LCP ${Math.round(r.lcp)}ms  ${problems.length ? '\n    ' + [...new Set(problems)].slice(0, 12).join('\n    ') : 'ok'}`);
    await page.close();
  }
}
await browser.close();
console.log(fails ? `\n${fails} problem(s)` : '\nall pages ok');

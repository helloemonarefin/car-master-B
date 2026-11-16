// Dev-only: BOILERPLATE §7.8 motion checklist + keyboard pass (BUILD_PROMPT Phase 5).
// Usage: node tools/motion-check.mjs <url>
import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://localhost:4321/';
const browser = await chromium.launch();
const results = [];
const check = (name, ok, detail = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);

// Elements that are in the viewport but still (nearly) invisible.
const hiddenInView = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('[data-reveal], [data-intro], [data-nav-intro]')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        const inView = r.bottom > 0 && r.top < innerHeight && r.width > 0 && getComputedStyle(el).display !== 'none';
        return inView && parseFloat(getComputedStyle(el).opacity) < 0.99;
      })
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`),
  );

// 1. Hard reload: nav then hero, once, done within ~1.2s; no flash before start.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const t = await page.evaluate(() => {
    const anims = document.getAnimations().filter((a) => a.animationName === 'rise-in');
    const intro = anims.filter((a) => a.effect.target.closest('[data-intro]'));
    const nav = anims.filter((a) => a.effect.target.matches('[data-nav-intro]'));
    const end = (list) => Math.max(...list.map((a) => { const t = a.effect.getComputedTiming(); return t.delay + t.duration; }));
    const firstFrameOpacity = [...document.querySelectorAll('[data-intro]')].map((e) => parseFloat(getComputedStyle(e).opacity));
    const navStart = Math.min(...nav.map((a) => a.effect.getComputedTiming().delay));
    const heroStart = Math.min(...intro.map((a) => a.effect.getComputedTiming().delay));
    return { introEnd: end(intro), navEnd: end(nav), introCount: intro.length, navCount: nav.length, firstFrameOpacity, navStart, heroStart, iterations: anims.map((a) => a.effect.getComputedTiming().iterations) };
  });
  check('hero intro plays (5 items) and finishes within ~1.2s', t.introCount === 5 && t.introEnd <= 1250, `${t.introCount} items, ends at ${Math.round(t.introEnd)}ms`);
  check('nav intro plays on Home (logo + 6 links + CTA)', t.navCount === 8, `${t.navCount} items, ends at ${Math.round(t.navEnd)}ms`);
  check('nav starts before hero', t.navStart < t.heroStart, `nav ${t.navStart}ms, hero ${t.heroStart}ms`);
  check('plays once (iterations = 1)', t.iterations.every((n) => n === 1));
  check('no flash: intro items start near-invisible', t.firstFrameOpacity.every((o) => o < 0.05), t.firstFrameOpacity.map((o) => o.toFixed(3)).join(','));
  await page.waitForTimeout(1500);
  const left = await hiddenInView(page);
  check('after the intro everything in the first screen is visible', left.length === 0, left.join(', '));
  await page.close();
}

// 2. Scroll slowly: every reveal fires, in order top → bottom.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  const order = [];
  await page.exposeFunction('logReveal', (y) => order.push(y));
  await page.evaluate(() => {
    new MutationObserver((ms) => ms.forEach((m) => m.target.classList.contains('is-revealed') && window.logReveal(m.target.getBoundingClientRect().top + scrollY)))
      .observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
  });
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += 300) { await page.mouse.wheel(0, 300); await page.waitForTimeout(60); }
  await page.waitForTimeout(800);
  const stats = await page.evaluate(() => ({
    total: document.querySelectorAll('[data-reveal]').length,
    revealed: document.querySelectorAll('[data-reveal].is-revealed').length,
  }));
  const sorted = order.every((y, i) => i === 0 || y >= order[i - 1] - 400);
  check('slow scroll: every reveal fires', stats.revealed === stats.total, `${stats.revealed}/${stats.total}`);
  check('slow scroll: reveals go top → bottom', sorted);

  // 4. Scroll back up: nothing animates again.
  const before = await page.evaluate(() => document.getAnimations().length);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  const after = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length);
  check('scroll back up: nothing re-animates', after === 0, `running animations: ${after} (finished before: ${before})`);
  await page.close();
}

// 3. Fast scroll to the bottom + anchor jump: nothing stays invisible.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1200);
  const bottom = await hiddenInView(page);
  check('fast scroll to bottom: nothing stays invisible', bottom.length === 0, bottom.join(', '));
  await page.goto(url + '#faq', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const anchor = await hiddenInView(page);
  check('anchor jump (#faq): nothing stays invisible', anchor.length === 0, anchor.join(', '));
  await page.close();
}

// 5. Reduced motion: everything visible instantly.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(50);
  const r = await page.evaluate(() => ({
    armed: document.documentElement.classList.contains('reveal-on'),
    dim: [...document.querySelectorAll('[data-reveal], [data-intro], [data-nav-intro]')].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length,
  }));
  check('reduced motion: reveals never armed, all visible at once', !r.armed && r.dim === 0, `armed=${r.armed}, dim=${r.dim}`);
  await page.close();
}

// 6. JS disabled: everything visible.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500); // let the CSS-only intro finish
  const dim = await page.evaluate(() => [...document.querySelectorAll('[data-reveal], [data-intro], [data-nav-intro]')].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length);
  check('JS disabled: everything visible', dim === 0, `dim=${dim}`);
  await ctx.close();
}

// 7. LCP not delayed by the intro (0.001 start).
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  const lcp = await page.evaluate(() => new Promise((res) => {
    new PerformanceObserver((l) => { const e = l.getEntries().at(-1); res({ t: Math.round(e.startTime), el: e.element?.tagName }); }).observe({ type: 'largest-contentful-paint', buffered: true });
  }));
  check('LCP recorded early (not held back to the end of the animation)', lcp.t < 1000, `${lcp.t}ms on <${lcp.el}>`);
  await page.close();
}

// 8. One token changes it everywhere.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  const d = await page.evaluate(async () => {
    document.documentElement.style.setProperty('--m-reveal-time', '1.234s');
    const el = document.querySelector('.footer [data-reveal]');
    el.scrollIntoView();
    await new Promise((r) => setTimeout(r, 300));
    return getComputedStyle(el).animationDuration;
  });
  check('changing --m-reveal-time changes reveals', d === '1.234s', d);
  await page.close();
}

// 9. Nesting rules: no reveal inside a reveal; nothing with both intro and reveal.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const n = await page.evaluate(() => ({
    nested: [...document.querySelectorAll('[data-reveal] [data-reveal]')].length,
    both: [...document.querySelectorAll('[data-intro][data-reveal], [data-intro] [data-reveal]')].length,
    navReveal: document.querySelectorAll('.nav [data-reveal]').length,
  }));
  check('no reveal nested in a reveal, none on intro items or the nav', n.nested + n.both + n.navReveal === 0, JSON.stringify(n));
  await page.close();
}

// 10. Keyboard: Tab through the page; every focused element is visible and shows a focus style.
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1300);
  const seen = new Set();
  const problems = [];
  for (let i = 0; i < 200; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(width === 1440 ? 30 : 30);
    const f = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const ring = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
      const chip = el.matches('.chip__input') && getComputedStyle(el.nextElementSibling).outlineStyle !== 'none';
      const field = el.matches('.field__input');
      if (!el.dataset.tabK) el.dataset.tabK = String(document.querySelectorAll('[data-tab-k]').length);
      return { key: `${el.dataset.tabK} ${el.tagName}:${(el.textContent || el.getAttribute('aria-label') || el.name || '').trim().slice(0, 24)}`, ring: ring || chip || field };
    });
    if (!f) break;
    if (seen.has(f.key)) break;
    seen.add(f.key);
    if (!f.ring) problems.push(f.key);
    await page.waitForTimeout(150); // focus reveals at once; only the 0.6s fade remains
    const dim = await page.evaluate(() => { let e = document.activeElement; while (e && e !== document.body) { const r = e.closest('[data-reveal]'); if (r && !r.classList.contains('is-revealed')) return true; e = e.parentElement; } return false; });
    if (dim) problems.push(`${f.key} (still invisible after focus)`);
  }
  check(`keyboard @${width}: ${seen.size} stops, each visible with a focus style`, problems.length === 0, problems.slice(0, 5).join('; '));
  await page.close();
}

await browser.close();
console.log(results.join('\n'));

// Dev-only: screenshot a page at one or more widths.
// Usage: node tools/screenshot.mjs <url> <outPrefix> [width,width…] [--grid]
import { chromium } from '@playwright/test';

const [url, out, widthsArg = '1440', ...flags] = process.argv.slice(2);
if (!url || !out) {
  console.error('Usage: node tools/screenshot.mjs <url> <outPrefix> [widths] [--grid]');
  process.exit(1);
}
const widths = widthsArg.split(',').map(Number);
const browser = await chromium.launch();
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  await page.goto(url, { waitUntil: 'networkidle' });
  if (flags.includes('--grid')) await page.check('#sg-grid-toggle').catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  // Load lazy images so full-page captures show them.
  await page.evaluate(async () => {
    const imgs = [...document.querySelectorAll('img')];
    imgs.forEach((i) => (i.loading = 'eager'));
    await Promise.all(imgs.map((i) => (i.complete ? i.decode().catch(() => {}) : new Promise((r) => { i.onload = i.onerror = r; }))));
  });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  await page.screenshot({ path: `${out}-${width}.png`, fullPage: true });
  console.log(`${width}px → ${out}-${width}.png  (horizontal overflow: ${overflow}px)`);
  await page.close();
}
await browser.close();

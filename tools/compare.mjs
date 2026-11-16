// Dev-only: screenshot a page region at 1440 and stack it under a Figma screenshot.
// Usage: node tools/compare.mjs <url> <selector|y0:y1> <figma.png> <out.png>
import { chromium } from '@playwright/test';
import sharp from 'sharp';
const [url, target, figma, out] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// Section crops: keep the sticky nav from overlapping the capture.
await page.addStyleTag({ content: '.nav{position:relative!important}' });
// Load lazy images before capturing.
await page.evaluate(async () => {
  const imgs = [...document.querySelectorAll('img')];
  imgs.forEach((i) => (i.loading = 'eager'));
  await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
  await Promise.all(imgs.map((i) => i.decode().catch(() => {})));
});
let buf;
if (/^\d+:\d+$/.test(target)) {
  const [y0, y1] = target.split(':').map(Number);
  buf = await page.screenshot({ fullPage: true, clip: { x: 0, y: y0, width: 1440, height: y1 - y0 } });
} else {
  buf = await page.locator(target).first().screenshot();
}
await browser.close();
const W = 1024;
const a = await sharp(figma).resize({ width: W }).png().toBuffer();
const b = await sharp(buf).resize({ width: W }).png().toBuffer();
const ha = (await sharp(a).metadata()).height, hb = (await sharp(b).metadata()).height;
await sharp({ create: { width: W * 2 + 16, height: Math.max(ha, hb), channels: 3, background: '#ff00ff' } })
  .composite([{ input: a, left: 0, top: 0 }, { input: b, left: W + 16, top: 0 }]).png().toFile(out);
console.log(`figma h=${ha}  build h=${hb} (at ${W}px wide)`);

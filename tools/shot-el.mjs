// Dev-only: screenshot one element at a given width.
// Usage: node tools/shot-el.mjs <url> <selector> <out.png> [width=1440] [--hover] [--focus]
import { chromium } from '@playwright/test';
const [url, selector, out, width = '1440', ...flags] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(width), height: 1000 }, reducedMotion: 'reduce' });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const el = page.locator(selector).first();
await el.scrollIntoViewIfNeeded();
if (flags.includes('--hover')) await el.hover();
if (flags.includes('--focus')) await el.focus();
await page.waitForTimeout(300);
await el.screenshot({ path: out });
console.log(`${selector} @${width} → ${out}`, await el.boundingBox());
await browser.close();

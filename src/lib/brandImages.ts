/**
 * Placeholder favicon + OG image, generated at build time from site.ts
 * (owner decision 2026-11-16). Replace per client — see TEMPLATE.md.
 *
 * Uses `sharp`, which Astro already ships for image optimisation
 * (no extra package installed).
 */
import sharp from 'sharp';
import { site, brandInitial } from '../content/site';

/** Read a CSS token's literal value from tokens.css so colours stay token-driven. */
import tokensCss from '../styles/tokens.css?raw';
function token(name: string): string {
  const m = tokensCss.match(new RegExp(`${name}:\\s*([^;]+);`));
  if (!m?.[1]) throw new Error(`Token ${name} not found in tokens.css`);
  return m[1].replace(/\/\*.*?\*\//g, '').trim();
}
export const INK = token('--brand-ink');
export const PAPER = token('--brand-paper');

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Square SVG: initial letter on ink. */
export function faviconSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${INK}"/>
  <text x="32" y="44" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-size="34" font-weight="500" fill="${PAPER}">${escape(brandInitial)}</text>
</svg>`;
}

export async function faviconPng(size: number): Promise<Buffer> {
  return sharp(Buffer.from(faviconSvg())).resize(size, size).png().toBuffer();
}

/** Minimal ICO container holding one PNG image. */
export async function faviconIco(size = 32): Promise<Buffer> {
  const png = await faviconPng(size);
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size % 256, 0);
  entry.writeUInt8(size % 256, 1);
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(6 + 16, 12); // offset
  return Buffer.concat([header, entry, png]);
}

/**
 * 1200×630 OG image: hero image (cover) + business name.
 * `heroPath` is the local file of the hero image; until it is exported
 * from Figma (Phase 3) the background is plain ink.
 */
export async function ogImage(heroPath?: string): Promise<Buffer> {
  const W = 1200;
  const H = 630;
  const base = heroPath
    ? sharp(heroPath).resize(W, H, { fit: 'cover' })
    : sharp({ create: { width: W, height: H, channels: 3, background: INK } });

  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect x="0" y="${H - 180}" width="${W}" height="180" fill="${INK}" fill-opacity="0.72"/>
  <text x="64" y="${H - 72}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="64" font-weight="300" letter-spacing="-2" fill="${PAPER}">${escape(site.businessName)}</text>
</svg>`;

  return base.composite([{ input: Buffer.from(overlay), top: 0, left: 0 }]).png().toBuffer();
}

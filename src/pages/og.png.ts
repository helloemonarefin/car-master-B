import type { APIRoute } from 'astro';
import { resolve } from 'node:path';
import { ogImage } from '../lib/brandImages';

// Source photo for the generated OG image (replace per client — see TEMPLATE.md).
const OG_SOURCE = resolve('src/assets/home/hero.jpg');

export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await ogImage(OG_SOURCE)), { headers: { 'Content-Type': 'image/png' } });

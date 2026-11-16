import type { APIRoute } from 'astro';
import { ogImage } from '../lib/brandImages';

// TODO Phase 3: pass the exported hero image path once it exists in src/assets/.
export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await ogImage()), { headers: { 'Content-Type': 'image/png' } });

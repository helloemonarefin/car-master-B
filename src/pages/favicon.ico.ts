import type { APIRoute } from 'astro';
import { faviconIco } from '../lib/brandImages';

export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await faviconIco(32)), { headers: { 'Content-Type': 'image/x-icon' } });

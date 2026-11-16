import type { APIRoute } from 'astro';
import { faviconPng } from '../lib/brandImages';

export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await faviconPng(180)), { headers: { 'Content-Type': 'image/png' } });

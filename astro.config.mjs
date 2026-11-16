// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Private pages: never in the sitemap (they also carry noindex).
const PRIVATE_PAGES = ['/styleguide', '/404'];

export default defineConfig({
  // Placeholder until the client domain is known (replace per client).
  site: 'https://example.com',
  output: 'static',

  // Pages build as /protection.html → served at /protection on Netlify, so
  // internal links, canonical URLs and the sitemap all use one form (no
  // trailing slash, no redirect hop).
  trailingSlash: 'never',
  // Inline the (small) CSS in each page: no extra requests before first paint.
  build: { inlineStylesheets: 'always', format: 'file' },

  // Inter, self-hosted via Astro's fonts API (downloaded at build time).
  fonts: [
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.fontsource(),
      weights: [300, 400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
    },
  ],

  integrations: [
    sitemap({ filter: (page) => !PRIVATE_PAGES.some((p) => new URL(page).pathname.startsWith(p)) }),
  ],
});

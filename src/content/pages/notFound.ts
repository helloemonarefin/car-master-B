/**
 * 404 page copy. Not in Figma (BUILD_PROMPT Phase 7 asks for the page) —
 * minimal copy written in the site's voice; replace per client.
 */
import type { Cta } from '../types';
import { nav } from '../layout';

export const notFound: {
  /** .t-label */
  eyebrow: string;
  /** h1, .t-page-hero, ≤ 2 lines */
  title: string;
  /** .t-body-lg */
  text: string;
  primary: Cta;
  secondary: Cta;
} = {
  eyebrow: '404',
  title: 'This page isn’t here.',
  text: 'The link may be old or mistyped. Everything else is one click away.',
  primary: { label: 'Back to the home page', href: '/' },
  secondary: { label: nav.cta.label, href: nav.cta.href },
};

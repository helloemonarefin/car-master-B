/**
 * Content types shared by every page. One interface per section type.
 * Copy-length limits from DESIGN_SYSTEM §8 sit next to each field.
 * Shaped so a CMS schema can mirror it later.
 */
import type { ImageMetadata } from 'astro';

export interface Cta {
  /** ≤ 24 chars */
  label: string;
  href: string;
}

export interface Picture {
  src: ImageMetadata;
  /** Describe the photo; "" only if purely decorative. */
  alt: string;
}

/* ---------- Hero + trust strip ---------- */
export interface TrustItem {
  /** .t-label, ≤ 20 chars */
  label: string;
  /** .t-h5, ≤ 34 chars */
  value: string;
}

export interface HeroContent {
  type: 'hero';
  /** Anchor id. */
  id: string;
  /** .t-label eyebrow, ≤ 40 chars */
  eyebrow: string;
  /** #headline. ≤ 45 chars (2 lines at 112 on desktop). */
  headline: string;
  /** #subheadline. ≤ 3–4 lines in 528px, ~180 chars. */
  subheadline: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
  /** #hero-image, shown at 1312 × 600. */
  image: Picture;
  /** Exactly 3. */
  trust: [TrustItem, TrustItem, TrustItem];
}

/* ---------- Problem ---------- */
export interface StatItem {
  /** .t-stat, ≤ 8 chars (e.g. "115°F", "$4,000+") */
  value: string;
  /** .t-body, ≤ 70 chars */
  caption: string;
}

export interface ProblemContent {
  type: 'problem';
  id: string;
  /** Section index label, ≤ 28 chars */
  label: string;
  /** h2, ≤ 2 lines in 752px (~40 chars) */
  title: string;
  /** ≤ 3 lines, ~220 chars (Figma uses ~250) */
  intro?: string;
  /** Exactly 3. */
  stats: [StatItem, StatItem, StatItem];
}

/* ---------- Services ---------- */
export interface ServiceItem {
  /** h4, ≤ 32 chars */
  title: string;
  /** .t-body, ≤ 2 lines (~110 chars) */
  description: string;
  /** 3–5 bullets, each ≤ 55 chars */
  bullets: string[];
  /** .t-h5, e.g. "From $6,800" */
  price: string;
  /** "Details →" link. */
  link: Cta;
  /** 416 × 440 */
  image: Picture;
}

export interface ServicesContent {
  type: 'services';
  id: string;
  label: string;
  title: string;
  intro?: string;
  /** Exactly 3. */
  items: [ServiceItem, ServiceItem, ServiceItem];
}

/** Every section type a page can list. Extend as sections are built. */
export type SectionContent = HeroContent | ProblemContent | ServicesContent;

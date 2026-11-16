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

/* ---------- Signature offer ---------- */
export interface IncludedItem {
  /** .t-h5 Regular, ≤ 44 chars */
  title: string;
  /** .t-body, ≤ 2 lines in 500px (~100 chars) */
  description: string;
  /** Tag text, ≤ 20 chars (e.g. "Included", "Bonus · $600 value") */
  tag: string;
  /** Filled tag for bonuses, outline otherwise. */
  tagVariant: 'outline' | 'filled';
}

export interface SignatureContent {
  type: 'signature';
  id: string;
  label: string;
  title: string;
  intro?: string;
  /** Small label above the list, ≤ 24 chars */
  listLabel: string;
  /** 3–6 rows (DESIGN_SYSTEM §8; Figma shows 7) */
  items: IncludedItem[];
  /** .t-h3, one line, ≤ 52 chars */
  priceLine: string;
  /** .t-body-sm, ≤ 2 lines in 640px (~130 chars) */
  note?: string;
  cta: Cta;
}

/* ---------- Guarantee ---------- */
export interface GuaranteeContent {
  type: 'guarantee';
  id: string;
  label: string;
  /** .t-h5, ≤ 36 chars — the section's heading */
  title: string;
  /** .t-quote, ≤ 3 lines in 752px (~130 chars) */
  promise: string;
  /** .t-body-lg secondary, ≤ 2 lines */
  detail?: string;
  /** .t-small tertiary fine print, 1 line */
  fineprint?: string;
}

/* ---------- Process ---------- */
export interface ProcessStep {
  /** .t-h5, ≤ 28 chars */
  title: string;
  /** .t-body, ≤ 2 lines in 664px (~140 chars) */
  description: string;
}

export interface ProcessContent {
  type: 'process';
  id: string;
  label: string;
  title: string;
  intro?: string;
  /** 5 columns wide, stretches to the steps' height on desktop. */
  image: Picture;
  /** 4–6 steps */
  steps: ProcessStep[];
}

/* ---------- Portfolio ---------- */
export interface WorkItem {
  /** .t-body-strong, one line, ≤ 32 chars */
  title: string;
  /** .t-small secondary, one line, ≤ 44 chars */
  meta: string;
  /** 416 × 312 */
  image: Picture;
}

export interface PortfolioContent {
  type: 'portfolio';
  id: string;
  label: string;
  title: string;
  intro?: string;
  /** 3 or 6 (rows of 3) */
  items: WorkItem[];
  link?: Cta;
}

/* ---------- Why (dark) ---------- */
export interface WhyPoint {
  /** .t-body-strong, ≤ 30 chars (the number is added automatically) */
  title: string;
  /** .t-body-sm, one line in 752px, ≤ 60 chars */
  text: string;
}

export interface WhyContent {
  type: 'why';
  id: string;
  /** Index label, also the section heading, e.g. "Why Northvale" */
  label: string;
  /** 3–4 statement words/phrases, each ≤ 12 chars at 128px */
  words: string[];
  /** .t-h3, ≤ 24 chars */
  noteTitle: string;
  /** .t-body-lg, ≤ 4 lines in 416px (~200 chars) */
  noteText: string;
  /** 3–4 points */
  points: WhyPoint[];
}

/* ---------- Testimonial ---------- */
export interface Review {
  /** Include the typographic quotes “ ”. */
  quote: string;
  /** .t-body-strong / .t-body-sm Medium, ≤ 24 chars */
  name: string;
  /** e.g. the car, ≤ 28 chars */
  detail: string;
}

export interface TestimonialContent {
  type: 'testimonial';
  id: string;
  label: string;
  /** Main quote: .t-quote, ≤ 4 lines in 752px (~140 chars) */
  featured: Review;
  /** Exactly 2 small review cards (.t-quote-sm, ≤ 3 lines ~120 chars) */
  more: [Review, Review];
  link?: Cta;
}

/** Every section type a page can list. Extend as sections are built. */
export type SectionContent =
  | HeroContent
  | ProblemContent
  | ServicesContent
  | SignatureContent
  | GuaranteeContent
  | ProcessContent
  | PortfolioContent
  | WhyContent
  | TestimonialContent;

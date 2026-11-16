/** Portfolio page — Figma "Master B — Portfolio" (304:636). Section order = this array. */
import type { SectionContent } from '../types';
import { nav } from '../layout';
import { site } from '../site';
import { fromHome } from './shared';

import heroImage from '../../assets/home/work-huracan-sto.jpg';
import workTurbo from '../../assets/home/work-911-turbo-996.png';
import workFordGt from '../../assets/home/work-ford-gt.jpg';
import workCobra from '../../assets/home/work-shelby-cobra.jpg';

export const seo = {
  title: 'Portfolio',
  description:
    'Exotic, collector and restored cars protected at the atelier. Every car on this page went home with its own 120-photo report.',
};

const homePortfolio = fromHome('portfolio');

export const sections: SectionContent[] = [
  {
    type: 'hero',
    variant: 'page',
    id: 'top-hero',
    eyebrow: 'Portfolio',
    headline: 'Recent work, documented panel by panel.',
    subheadline:
      'Exotic, collector and restored cars protected at the atelier. Every car on this page went home with its own 120-photo report.',
    primaryCta: nav.cta,
    secondaryCta: { label: 'Read the Journal', href: '/journal' },
    image: { src: heroImage, alt: 'Yellow Lamborghini with doors up in a lit garage' },
    trust: [
      { label: `Since ${site.foundedYear}`, value: '1,400+ cars protected' },
      { label: 'Most requested', value: 'Full-body satin PPF' },
      { label: 'Capacity', value: 'Six cars a month' },
    ],
  },
  {
    ...homePortfolio,
    id: 'work',
    title: 'Selected cars, 2024–2026',
    items: [
      ...homePortfolio.items,
      { title: 'Porsche 911 Turbo (996)', meta: 'Full-body gloss PPF · Ceramic over film', image: { src: workTurbo, alt: 'Rear three-quarter view of a black Porsche 911 on white' } },
      { title: 'Ford GT', meta: 'Full-body gloss PPF · Hand-wrapped edges', image: { src: workFordGt, alt: 'Three Ford GTs lined up in a dark studio' } },
      { title: 'Shelby Cobra 427 (restoration)', meta: 'Full-body clear PPF', image: { src: workCobra, alt: 'Blue Shelby Cobra with white stripes in a dark studio' } },
    ],
    link: undefined, // the full-portfolio page has no "see more" link
  },
  fromHome('testimonial'),
  fromHome('final-cta'),
];

/** Protection page — Figma "Master B — Protection" (303:1999). Section order = this array. */
import type { SectionContent } from '../types';
import { nav } from '../layout';
import { fromHome, ANSWER_NEEDED } from './shared';

import heroImage from '../../assets/home/process.jpg';
import imgFullBody from '../../assets/home/service-ppf.jpg';
import imgFullFront from '../../assets/home/hero.jpg';
import imgTrackPack from '../../assets/home/work-750s.jpg';

export const seo = {
  title: 'Protection',
  description:
    'Self-healing paint protection film over every painted panel, fitted by one master installer in a filtered, 72°F bay. Full body, full front or track packages.',
};

const homeFaq = fromHome('faq');

export const sections: SectionContent[] = [
  {
    type: 'hero',
    variant: 'page',
    id: 'top-hero',
    eyebrow: 'Protection · Paint protection film',
    headline: 'Invisible film. Hand-wrapped edges. Ten years.',
    subheadline:
      'Self-healing paint protection film over every painted panel, fitted by one master installer in a filtered, 72°F bay. Full body, full front or track packages.',
    primaryCta: nav.cta,
    secondaryCta: { label: 'See the Concours Shield', href: '#signature' },
    image: { src: heroImage, alt: 'Car wrapped in protection film during installation in a bright studio bay' },
    trust: [
      { label: 'Film warranty', value: '10 years, registered in your name' },
      { label: 'Install promise', value: '12 months, Flawless Edge' },
      { label: 'Pricing', value: 'Full front from $2,900 · Full body from $6,800' },
    ],
  },
  fromHome('problem'),
  {
    type: 'services',
    id: 'coverage',
    label: 'Coverage',
    title: 'Choose how much of the car we cover.',
    items: [
      {
        title: 'Full Body',
        description: 'Every painted panel, from the nose to the rear diffuser. The car looks unwrapped from any normal viewing distance.',
        bullets: [
          'Self-healing: light swirls disappear in the sun',
          'Hand-wrapped edges, no visible seams on front panels',
          'Gloss or satin finish',
          '10-year film warranty, registered in your name',
          'No blades on your paint, ever',
        ],
        price: 'From $6,800',
        link: { label: 'Details →', href: '' }, // TODO(owner): no destination in Figma
        image: { src: imgFullBody, alt: 'Installer smoothing clear protection film over a white car’s headlight' },
      },
      {
        title: 'Full Front',
        description: 'The panels that take the hits on Loop 101 and I-17. The right start for most daily-driven exotics.',
        bullets: ['Hood, bumper, fenders and mirrors', 'Same hand-wrapped edges as full body', 'Gloss or satin finish', '10-year film warranty'],
        price: 'From $2,900',
        link: { label: 'Details →', href: '' },
        image: { src: imgFullFront, alt: 'Silver Porsche 911 in profile in a clean white studio garage' },
      },
      {
        title: 'Track Pack',
        description: 'For cars that see the track or long drives. Adds the panels that catch debris from your own tires.',
        bullets: ['Everything in Full Front', 'Rocker panels and rear quarters', 'Rear haunches on mid-engine cars', 'Same hand-wrapped edges as full body'],
        price: 'Exact price at consultation',
        link: { label: 'Details →', href: '' },
        image: { src: imgTrackPack, alt: 'Blue supercar under a single light strip in a dark studio' },
      },
    ],
  },
  fromHome('signature'),
  fromHome('guarantee'),
  fromHome('portfolio'),
  {
    ...homeFaq,
    items: homeFaq.items.map((it, i) => (i === 3 ? { question: 'Can I choose satin instead of gloss?', answer: ANSWER_NEEDED } : it)),
  },
  fromHome('final-cta'),
];

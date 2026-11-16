/** Coatings page — Figma "Master B — Coatings" (303:2553). Section order = this array. */
import type { SectionContent } from '../types';
import { nav } from '../layout';
import { fromHome, ANSWER_NEEDED } from './shared';

import heroImage from '../../assets/home/service-ceramic.jpg';
import imgOverPaint from '../../assets/home/coat-over-paint.jpg';
import imgOverFilm from '../../assets/home/service-ppf.jpg';
import imgWheelsGlass from '../../assets/home/coat-wheels-glass.jpg';

export const seo = {
  title: 'Coatings',
  description:
    'A hard, glass-like ceramic layer over paint, film, wheels and glass. Every coating starts with paint correction, so nothing gets sealed in.',
};

export const sections: SectionContent[] = [
  {
    type: 'hero',
    variant: 'page',
    id: 'top-hero',
    eyebrow: 'Coatings · Ceramic',
    headline: 'Gloss you can rinse clean. Up to seven years.',
    subheadline:
      'A hard, glass-like ceramic layer over paint, film, wheels and glass. Every coating starts with paint correction, so nothing gets sealed in.',
    primaryCta: nav.cta,
    secondaryCta: { label: 'View the Portfolio', href: '/portfolio' },
    image: { src: heroImage, alt: 'Gloved hand applying ceramic coating with a yellow pad to a headlight' },
    trust: [
      { label: 'Protection', value: 'Up to 7 years' },
      { label: 'Preparation', value: 'Paint correction before every coating' },
      { label: 'Pricing', value: 'From $1,900' },
    ],
  },
  {
    type: 'services',
    id: 'coatings',
    label: 'Coatings',
    title: 'One coating, three surfaces.',
    items: [
      {
        title: 'Over Paint',
        description: 'For cars without film. We correct the paint first, then lock the gloss in.',
        bullets: ['Single-stage or multi-stage paint correction', 'Deeper, wetter gloss', 'Water and dust slide off', 'Up to 7-year protection'],
        price: 'From $1,900',
        link: { label: 'Details →', href: '' }, // TODO(owner): no destination in Figma
        image: { src: imgOverPaint, alt: 'Detailer machine-polishing the paint of a black car' },
      },
      {
        title: 'Over Film',
        description: 'The finishing step on any PPF install. The film gets easier to clean and picks up depth.',
        bullets: ['Bonds to self-healing film', 'Stops film from staining', 'Keeps satin film looking even', 'Included in the Concours Shield'],
        price: 'From $1,900',
        link: { label: 'Details →', href: '' },
        image: { src: imgOverFilm, alt: 'Installer smoothing clear protection film over a white car’s headlight' },
      },
      {
        title: 'Wheels & Glass',
        description: 'Brake dust and rain need somewhere to go. Coated wheels and glass shed both.',
        bullets: ['Wheel faces and barrels', 'Windshield and side glass', 'Calipers on request', 'Added to any coating'],
        price: 'Included with coating',
        link: { label: 'Details →', href: '' },
        image: { src: imgWheelsGlass, alt: 'Soapy black Mercedes front end during a wash' },
      },
    ],
  },
  fromHome('why'),
  fromHome('testimonial'),
  {
    ...fromHome('faq'),
    items: [
      { question: 'How long does a coating last?', answer: 'Up to 7 years, depending on how the car is driven and washed. Your care card shows exactly how to keep it working.' },
      { question: 'Do you correct the paint first?', answer: ANSWER_NEEDED },
      { question: 'Can you coat over the film?', answer: ANSWER_NEEDED },
      { question: 'Will a coating stop rock chips?', answer: ANSWER_NEEDED },
      { question: 'How do I wash a coated car?', answer: ANSWER_NEEDED },
      { question: 'Do you offer payment plans?', answer: ANSWER_NEEDED },
    ],
  },
  fromHome('final-cta'),
];

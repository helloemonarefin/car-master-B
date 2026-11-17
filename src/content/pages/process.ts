/** The Process page — Figma "Master B — The Process" (304:121). Section order = this array. */
import type { SectionContent } from '../types';
import { nav } from '../layout';
import { fromHome } from './shared';
import { faq } from '../faqAnswers';

import heroImage from '../../assets/home/process-hero.jpg';

export const seo = {
  title: 'The Process',
  description:
    'From the first call to the day it comes home covered, here is exactly what happens to your car at the atelier.',
};

export const sections: SectionContent[] = [
  {
    type: 'hero',
    variant: 'page',
    id: 'top-hero',
    eyebrow: 'The Process',
    headline: 'Ten days. One installer. Every step documented.',
    subheadline:
      'From the first call to the day it comes home covered, here is exactly what happens to your car at the atelier.',
    primaryCta: nav.cta,
    secondaryCta: { label: 'See the Concours Shield', href: '#signature' },
    image: { src: heroImage, alt: 'Black Porsche 911 lit low in a dark studio' },
    trust: [
      { label: 'Turnaround', value: '7–10 days, door to door' },
      { label: 'Installer', value: 'One per car, start to finish' },
      { label: 'Bay', value: 'Filtered air, held at 72°F' },
    ],
  },
  fromHome('process'),
  fromHome('signature'),
  fromHome('guarantee'),
  fromHome('why'),
  {
    ...fromHome('faq'),
    items: [
      {
        question: 'How long will you have my car?',
        answer: 'About 7–10 days for full-body PPF, including prep and curing. The Concours Shield is 10 days, door to door.',
      },
      faq('Do you collect the car?'),
      faq('Can I visit during the install?'),
      faq('What’s in the intake report?'),
      faq('How long does the film need to cure?'),
      faq('Do you offer payment plans?'),
    ],
  },
  fromHome('final-cta'),
];

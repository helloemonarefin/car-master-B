/** Contact page — Figma "Master B — Contact" (304:3606). Section order = this array. */
import type { SectionContent } from '../types';
import { nav } from '../layout';
import { site } from '../site';
import { fromHome } from './shared';
import { faq } from '../faqAnswers';

import heroImage from '../../assets/home/visit.jpg';

export const seo = {
  title: 'Contact',
  description:
    'One conversation and one exact price. We reply within one business day with a time to talk, by phone or at the studio.',
};

/** The nav CTA on this page calls the studio (Figma). */
export const navCta = { label: `Call ${site.phone}`, href: site.phoneHref };

const homeCta = fromHome('final-cta');

export const sections: SectionContent[] = [
  {
    type: 'hero',
    variant: 'page',
    id: 'top-hero',
    eyebrow: 'Contact · North Scottsdale, near the Airpark',
    headline: 'Tell us what you drive.',
    subheadline:
      'One conversation and one exact price. We reply within one business day with a time to talk, by phone or at the studio.',
    primaryCta: { label: nav.cta.label, href: '#contact' },
    secondaryCta: { label: 'Email the studio', href: `mailto:${site.email}` },
    image: { src: heroImage, alt: 'Matte black wagon parked in a clean white detailing studio' },
    trust: [
      { label: 'Reply time', value: 'Within one business day' },
      { label: 'Studio', value: site.address[0] ?? '' },
      { label: 'Hours', value: site.hours[0] ?? '' },
    ],
  },
  {
    ...homeCta,
    image: undefined,
    title: 'Request a consultation.',
  },
  {
    ...fromHome('faq'),
    items: [
      { question: 'Do I need an appointment to visit?', answer: 'Yes. We work on six cars a month, so every visit is booked. Most consultations take 20 minutes.' },
      faq('Can we talk by phone first?'),
      faq('Do you collect the car?'),
      faq('How far ahead should I book?'),
      faq('What should I bring to the consultation?'),
      faq('Do you offer payment plans?'),
    ],
  },
];

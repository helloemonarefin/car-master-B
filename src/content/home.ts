/**
 * Home page content. `sections` is the single source of section ORDER:
 * remove or reorder entries and the page (and the (01), (02)… indexes)
 * follow automatically. Copy-length limits are on the types in ./types.ts.
 * Client facts come from site.ts — never retype them here.
 */
import type { SectionContent } from './types';
import { site } from './site';
import { nav } from './layout';

import heroImage from '../assets/home/hero.jpg';
import servicePpf from '../assets/home/service-ppf.jpg';
import serviceCeramic from '../assets/home/service-ceramic.jpg';
import serviceTrack from '../assets/home/service-track.jpg';
import processImage from '../assets/home/process.jpg';

export const seo = {
  /** Leave empty to use site.seo.defaultTitle. */
  title: '',
  description: site.seo.defaultDescription,
};

export const sections: SectionContent[] = [
  {
    type: 'hero',
    id: 'top-hero',
    eyebrow: `${site.city} · By appointment only`,
    headline: 'Your paint, exactly as it left the factory. For years.',
    subheadline:
      'Full-body paint protection film and ceramic coatings for exotic and collector cars. Six cars a month. Each one handled by the same master installer from intake to delivery.',
    primaryCta: nav.cta,
    secondaryCta: { label: 'View the Portfolio', href: '/portfolio' },
    image: { src: heroImage, alt: 'Silver Porsche 911 in profile in a clean white studio garage' },
    trust: [
      { label: 'Rating', value: `★ ${site.rating} · ${site.reviewCount} ${site.reviewSource} reviews` },
      { label: `Since ${site.foundedYear}`, value: '1,400+ cars protected' },
      { label: 'Capacity', value: 'Six cars a month, by appointment' },
    ],
  },
  {
    type: 'problem',
    id: 'problem',
    label: 'The Arizona problem',
    title: 'The desert is hard on paint.',
    intro:
      'Loop 101 and I-17 throw sand and gravel at highway speed. The sun bakes clear coat at 115°F. One rock chip on a hand-painted hood can cost $4,000 to repaint, and a repaint never quite matches. The original factory paint is part of what your car is worth.',
    stats: [
      { value: '115°F', caption: 'Phoenix summer days that bake unprotected clear coat' },
      { value: '$4,000+', caption: 'What one exotic hood can cost to repaint' },
      { value: 'Original', caption: 'Factory paint: the first thing collectors check before they buy' },
    ],
  },
  {
    type: 'services',
    id: 'services',
    label: 'What we do',
    title: 'Three services. One standard.',
    items: [
      {
        title: 'Full-Body Paint Protection Film',
        description: 'Invisible, self-healing film over every painted panel. Edges wrapped by hand, not cut on the car.',
        bullets: [
          'Self-healing: light swirls disappear in the sun',
          'Hand-wrapped edges, no visible seams on front panels',
          'Gloss or satin finish',
          '10-year film warranty, registered in your name',
          'No blades on your paint, ever',
        ],
        price: 'From $6,800',
        link: { label: 'Details →', href: '/protection' },
        image: { src: servicePpf, alt: 'Installer smoothing clear protection film over a white car’s headlight' },
      },
      {
        title: 'Ceramic Coating',
        description: 'A hard glass-like layer over film or paint that makes the car easier to clean and deepens the gloss.',
        bullets: [
          'Paint correction before every coating',
          'Coats paint, film, wheels and glass',
          'Water and dust slide off',
          'Up to 7-year protection',
        ],
        price: 'From $1,900',
        link: { label: 'Details →', href: '/coatings' },
        image: { src: serviceCeramic, alt: 'Gloved hand applying ceramic coating with a yellow pad to a headlight' },
      },
      {
        title: 'Track & Partial Packages',
        description: 'For cars that see the track or long drives. Full front, rocker panels and rear haunches.',
        bullets: [
          'Full front: hood, bumper, fenders, mirrors',
          'Track pack adds rockers and rear quarters',
          'Same hand-wrapped edges as full body',
        ],
        price: 'From $2,900',
        link: { label: 'Details →', href: '/protection' },
        image: { src: serviceTrack, alt: 'Silver convertible lit dramatically in a dark studio' },
      },
    ],
  },
  {
    type: 'signature',
    id: 'signature',
    label: 'The Signature Program',
    title: 'The 10-Day Concours Shield',
    intro: 'Full-body film, ceramic over the film, and a fully documented car, returned to your garage in 10 days.',
    listLabel: 'What’s included',
    items: [
      { title: 'Full-body self-healing PPF', description: 'Every painted panel, edges hand-wrapped.', tag: 'Included', tagVariant: 'outline' },
      { title: 'Ceramic coating over film, wheels and glass', description: 'So it stays clean with a rinse.', tag: 'Included', tagVariant: 'outline' },
      { title: 'Single-stage paint correction', description: 'We remove light swirls first, so nothing gets sealed under film.', tag: 'Included', tagVariant: 'outline' },
      { title: 'Enclosed transport both ways', description: 'We collect from your garage and return it covered. You never drive it dirty to a shop.', tag: 'Bonus · $600 value', tagVariant: 'filled' },
      { title: 'The 120-Photo Intake Report', description: 'Every panel photographed and measured before we touch it. Yours to keep for insurance and resale.', tag: 'Bonus · $250 value', tagVariant: 'filled' },
      { title: 'First-Year Care Visit', description: 'A full decontamination wash and inspection at month 12.', tag: 'Bonus · $450 value', tagVariant: 'filled' },
      { title: 'The 5-Minute Care Card', description: 'Exactly how to wash it, what to never use. Fits in your glovebox.', tag: 'Included', tagVariant: 'outline' },
    ],
    priceLine: 'Program from $8,900 · Pay over 12 months available',
    note: 'We accept six cars a month so every car gets one installer from start to finish. December has two openings left.',
    cta: { label: 'Reserve a Consultation', href: '/contact' },
  },
  {
    type: 'guarantee',
    id: 'guarantee',
    label: 'The guarantee',
    title: 'The Flawless Edge Promise',
    promise: 'If any edge lifts, bubbles or shows dust under the film in the first 12 months, we redo that panel at no cost.',
    detail: 'We collect your car and return it, too. You never pay for our mistake, and you never have to argue about it.',
    fineprint: 'Covers installation for 12 months. Film warranty covers the material for 10 years.',
  },
  {
    type: 'process',
    id: 'process',
    label: 'The Process',
    title: 'How a car moves through the atelier.',
    image: { src: processImage, alt: 'Car wrapped in protection film during installation in a bright studio bay' },
    steps: [
      { title: 'Consultation', description: 'A 20-minute call or studio visit. We look at the car, talk about how you drive it, and give you one exact price.' },
      { title: 'Intake', description: 'We collect your car in an enclosed trailer. Every panel is photographed, measured and logged.' },
      { title: 'Preparation', description: 'Decontamination wash, clay, and paint correction. The film only goes on clean, flawless paint.' },
      { title: 'Installation', description: 'One installer. Hand-wrapped edges. Filtered, climate-controlled bay at 72°F.' },
      { title: 'Curing & inspection', description: '48 hours to cure, then a 3-light inspection of every panel.' },
      { title: 'Delivery', description: 'Returned to your garage, covered. You get your photo report and care card.' },
    ],
  },
];

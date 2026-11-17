/**
 * Home page content. `sections` is the single source of section ORDER:
 * remove or reorder entries and the page (and the (01), (02)… indexes)
 * follow automatically. Copy-length limits are on the types in ./types.ts.
 * Client facts come from site.ts — never retype them here.
 */
import type { SectionContent } from './types';
import { site } from './site';
import { nav } from './layout';
import { faq } from './faqAnswers';

import heroImage from '../assets/home/hero.jpg';
import servicePpf from '../assets/home/service-ppf.jpg';
import serviceCeramic from '../assets/home/service-ceramic.jpg';
import serviceTrack from '../assets/home/service-track.jpg';
import processImage from '../assets/home/process.jpg';
import work911Gt3Rs from '../assets/home/work-911-gt3-rs.png';
import work296Gtb from '../assets/home/work-296-gtb.jpg';
import work750s from '../assets/home/work-750s.jpg';
import work911CarreraRs from '../assets/home/work-911-carrera-rs.png';
import workHuracanSto from '../assets/home/work-huracan-sto.jpg';
import visitImage from '../assets/home/visit.jpg';

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
  {
    type: 'portfolio',
    id: 'portfolio',
    label: 'Portfolio',
    title: 'Recent work',
    items: [
      { title: '2025 Porsche 911 GT3 RS', meta: 'Full-body satin PPF · Ceramic over film', image: { src: work911Gt3Rs, alt: 'Dark green Porsche 911 GT3 RS on a pale grey studio floor' } },
      { title: 'Ferrari 296 GTB', meta: 'Full-body gloss PPF · Hand-wrapped edges', image: { src: work296Gtb, alt: 'Black supercar against a deep red studio backdrop' } },
      { title: 'McLaren 750S', meta: 'Track package · Wheel coating', image: { src: work750s, alt: 'Blue supercar under a single light strip in a dark studio' } },
      { title: '1973 Porsche 911 Carrera RS', meta: 'Restoration · Full-body clear PPF', image: { src: work911CarreraRs, alt: 'Silver classic Porsche in close side profile' } },
      { title: 'Lamborghini Huracán STO', meta: 'Full front + rocker panels', image: { src: workHuracanSto, alt: 'Yellow Lamborghini with doors up in a lit garage' } },
      { title: 'Mercedes-AMG G 63', meta: 'Full-body satin PPF', image: { src: serviceTrack, alt: 'Silver car lit dramatically in a dark studio' } },
    ],
    link: { label: 'See the full portfolio', href: '/portfolio' },
  },
  {
    type: 'why',
    id: 'why',
    label: `Why ${site.shortName}`,
    words: ['One installer.', 'No blades.', '72°F bay.', 'Documented.'],
    noteTitle: 'Small on purpose.',
    noteText:
      "Big shops run ten cars a day through the bay. We run six a month. That's the whole difference. The person who meets your car is the person who wraps it, inspects it, and hands you the keys.",
    points: [
      { title: 'One installer per car.', text: 'No hand-offs between techs.' },
      { title: 'No blades on paint.', text: 'Every pattern is pre-cut and wrapped by hand.' },
      { title: 'Climate-controlled bay.', text: 'Dust-filtered air, held at 72°F year-round.' },
      { title: 'Documented everything.', text: 'Photo intake and delivery reports for every car.' },
    ],
  },
  {
    type: 'testimonial',
    id: 'reviews',
    label: 'Reviews',
    featured: {
      quote: "“I've had three cars done at shops in LA and Scottsdale. This is the first time I couldn't find a single edge. Worth the wait.”",
      name: 'Daniel R.',
      detail: 'Porsche 911 GT3',
    },
    more: [
      { quote: "“They picked the car up, sent me photos every day, and dropped it back covered. I didn't have to do anything.”", name: 'Priya S.', detail: 'Ferrari Roma' },
      { quote: '“The intake report alone was worth it. When I sold the car, the buyer asked for paint readings and I had them.”', name: 'Marcus T.', detail: 'McLaren 720S' },
    ],
    link: { label: `★ ${site.rating} average from ${site.reviewCount} ${site.reviewSource} reviews`, href: site.reviewsUrl },
  },
  {
    type: 'faq',
    id: 'faq',
    label: 'FAQ',
    title: 'Straight answers.',
    intro: 'Something we didn’t cover? Call the studio and ask for the installer.',
    showPhone: true,
    openIndex: 0,
    items: [
      { question: 'How long does full-body PPF take?', answer: 'About 7–10 days, including prep and curing. The Concours Shield is 10 days, door to door.' },
      // Answers 2–6 written from site facts (owner OK); see faqAnswers.ts.
      faq('Will I see the film?'),
      faq('Do you cut film on the car?'),
      faq('Can you coat over the film?'),
      faq('What if I sell the car?'),
      faq('Do you offer payment plans?'),
    ],
  },
  {
    type: 'final-cta',
    id: 'contact',
    image: { src: visitImage, alt: 'Matte black wagon parked in a clean white detailing studio' },
    title: 'Six cars a month. Is yours next?',
    intro: "Tell us what you drive. We'll reply within one business day with a time to talk.",
    form: {
      name: 'consultation',
      items: [
        { kind: 'field', label: 'Name', name: 'name', type: 'text', placeholder: 'Your full name', autocomplete: 'name', required: true, width: 'half' },
        { kind: 'field', label: 'Phone', name: 'phone', type: 'tel', placeholder: '(480) 555-0000', autocomplete: 'tel', width: 'half' },
        { kind: 'field', label: 'Email', name: 'email', type: 'email', placeholder: 'you@email.com', autocomplete: 'email', required: true, width: 'half' },
        { kind: 'field', label: 'Year / Make / Model', name: 'car', type: 'text', placeholder: 'e.g. 2025 Porsche 911 GT3', width: 'half' },
        { kind: 'choice', label: 'What are you interested in?', name: 'interest', options: ['Full-body PPF', 'Concours Shield', 'Ceramic', 'Not sure yet'], defaultValue: 'Concours Shield' },
        { kind: 'field', label: 'Preferred contact time', name: 'contact-time', type: 'text', placeholder: 'Weekday mornings', width: 'full' },
      ],
      submitLabel: 'Request a Consultation',
    },
    note: 'No pressure, no sales calls. One conversation and one exact price.',
    detailLabels: { visit: 'Visit', contact: 'Contact', hours: 'Hours', serviceArea: 'Service area' },
  },
];

/** Journal page — Figma "Master B — Journal" (304:3045). Section order = this array. */
import type { SectionContent } from '../types';
import { nav } from '../layout';
import { fromHome } from './shared';

import heroImage from '../../assets/home/work-911-carrera-rs.png';
import imgWash from '../../assets/home/work-911-gt3-rs.png';
import imgBlade from '../../assets/home/service-ppf.jpg';
import imgHeat from '../../assets/home/article-silhouette.png';
import imgResale from '../../assets/home/article-headlight.png';
import imgCeramic from '../../assets/home/service-ceramic.jpg';
import imgIntake from '../../assets/home/process.jpg';

export const seo = {
  title: 'Journal',
  description:
    'Care guides, install notes and straight answers from the atelier, written by the installers who do the work.',
};

const READ = 'Read article →';

export const sections: SectionContent[] = [
  {
    type: 'hero',
    variant: 'page',
    id: 'top-hero',
    eyebrow: 'Journal',
    headline: 'Notes on keeping original paint original.',
    subheadline:
      'Care guides, install notes and straight answers from the atelier, written by the installers who do the work.',
    primaryCta: nav.cta,
    // No Care Card page/file in Figma → points to the consultation form on this page.
    secondaryCta: { label: 'Get the Care Card', href: '#contact' },
    image: { src: heroImage, alt: 'Silver classic Porsche in close side profile' },
    trust: [
      { label: 'Latest', value: 'Washing satin PPF: the 5-minute routine' },
      { label: 'Topics', value: 'Care · Film · Coatings · Collecting' },
      { label: 'Published', value: 'Once a month' },
    ],
  },
  {
    type: 'articles',
    id: 'articles',
    label: 'Articles',
    title: 'Latest from the atelier.',
    items: [
      { meta: 'Care guide · 5 min read', title: 'How to wash satin PPF without dulling it', excerpt: 'Two buckets, one pH-neutral soap and no brushes. The routine we hand every owner, step by step.', link: { label: READ, href: '' }, image: { src: imgWash, alt: 'Dark green Porsche 911 GT3 RS on a pale grey studio floor' } },
      { meta: 'Install notes · 4 min read', title: 'Why we never cut film on the car', excerpt: "A blade near paint is a risk you can't undo. How plotter-cut patterns and hand-wrapped edges work instead.", link: { label: READ, href: '' }, image: { src: imgBlade, alt: 'Installer smoothing clear protection film over a white car’s headlight' } },
      { meta: 'Arizona · 6 min read', title: 'What 115°F does to clear coat', excerpt: 'Heat, UV and highway sand: what actually happens to unprotected paint in a Phoenix summer.', link: { label: READ, href: '' }, image: { src: imgHeat, alt: 'Silhouette of a sports car against a sunset gradient' } },
      { meta: 'Collecting · 7 min read', title: 'Original paint and resale: what buyers check', excerpt: "Paint readings, panel history and documentation. Why original paint carries so much of a car's value.", link: { label: READ, href: '' }, image: { src: imgResale, alt: 'Close-up of a classic silver car’s headlight and grille' } },
      { meta: 'Coatings · 5 min read', title: 'Ceramic over film: is it worth it?', excerpt: 'What a coating adds on top of PPF, and when we tell owners to skip it.', link: { label: READ, href: '' }, image: { src: imgCeramic, alt: 'Gloved hand applying ceramic coating with a yellow pad to a headlight' } },
      { meta: 'Process · 4 min read', title: 'Inside the 120-photo intake report', excerpt: 'Every panel photographed and measured before we touch it. Here is what the report shows and why it matters.', link: { label: READ, href: '' }, image: { src: imgIntake, alt: 'Car wrapped in protection film during installation in a bright studio bay' } },
    ],
  },
  fromHome('final-cta'),
];

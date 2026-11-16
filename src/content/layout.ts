/**
 * Site-wide copy for the Nav (incl. mobile menu) and Footer.
 * Client facts (phone, address, hours…) are NOT here — they come from site.ts.
 */

export interface Link {
  label: string;
  /** Empty string = no destination yet: renders as plain text, not a dead link. */
  href: string;
}

export interface NavContent {
  /** 4–6 links; each label ≤ 14 chars so the desktop row stays centred. */
  links: Link[];
  /** #cta in the nav (small primary button). Label ≤ 24 chars. */
  cta: Link;
  /** Accessible label for the logo link, e.g. "Northvale Atelier — home". Built from site.ts if empty. */
  homeLabel: string;
}

export interface FooterContent {
  /** 3–6 links. */
  links: Link[];
  /** Labels above the four info columns (values come from site.ts). Each ≤ 12 chars. */
  infoLabels: {
    studio: string;
    contact: string;
    hours: string;
    serving: string;
  };
}

export const nav: NavContent = {
  links: [
    { label: 'Protection', href: '/protection' },
    { label: 'Coatings', href: '/coatings' },
    { label: 'The Process', href: '/process' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Journal', href: '/journal' },
    { label: 'Contact', href: '/contact' },
  ],
  cta: { label: 'Request a Consultation', href: '/contact' },
  homeLabel: '',
};

export const footer: FooterContent = {
  links: [
    { label: 'Protection', href: '/protection' },
    { label: 'Coatings', href: '/coatings' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Journal', href: '/journal' },
    { label: 'Privacy', href: '' }, // no Privacy frame in Figma yet — see decisions log
  ],
  infoLabels: {
    studio: 'Studio',
    contact: 'Contact',
    hours: 'Hours',
    serving: 'Serving',
  },
};

/**
 * Client facts — the ONLY place these values live (BUILD_PROMPT §4).
 * Every Figma layer named `#business-name`, `#city`, `#phone`, `#rating`…
 * maps to a field here. Replace this whole object per client.
 *
 * Empty strings hide their UI (no empty rows or dead links).
 * Fields marked "TODO Phase 2/3" are filled from Figma when their section is built.
 */

export interface SocialLink {
  label: string; // e.g. "Instagram"
  href: string;
}

export interface SiteFacts {
  /** #business-name. Also drives the favicon letter and the OG image. ≤ 24 chars. */
  businessName: string;
  /** Short line under the logo / in meta. */
  tagline: string;
  /** #city */
  city: string;
  /** #phone, as displayed. */
  phone: string;
  /** tel: href form of the phone, digits only with country code. */
  phoneHref: string;
  email: string;
  /** Street address lines. */
  address: string[];
  /** Opening hours lines. */
  hours: string[];
  serviceArea: string;
  /** #rating, e.g. 4.9 */
  rating: number;
  /** Number of reviews behind the rating. */
  reviewCount: number;
  /** Where the reviews live, e.g. "Google". */
  reviewSource: string;
  social: SocialLink[];
  /** Default SEO. Title ≤ 60 chars, description ≤ 160 chars. */
  seo: {
    defaultTitle: string;
    defaultDescription: string;
  };
}

export const site: SiteFacts = {
  businessName: 'Northvale Atelier',
  tagline: '', // TODO Phase 2/3: from Figma if shown
  city: 'Scottsdale',
  phone: '', // TODO Phase 2/3: from Figma footer / FAQ
  phoneHref: '',
  email: '', // TODO Phase 2/3
  address: [], // TODO Phase 2/3
  hours: [], // TODO Phase 2/3
  serviceArea: '', // TODO Phase 2/3
  rating: 4.9,
  reviewCount: 212,
  reviewSource: 'Google',
  social: [], // TODO Phase 2/3
  seo: {
    defaultTitle: 'Northvale Atelier', // TODO: confirm SEO title with owner
    defaultDescription:
      'Full-body paint protection film and ceramic coatings for exotic and collector cars. Six cars a month. Each one handled by the same master installer from intake to delivery.',
  },
};

/** First letter of the business name: favicon placeholder (replace per client). */
export const brandInitial = site.businessName.trim().charAt(0).toUpperCase();

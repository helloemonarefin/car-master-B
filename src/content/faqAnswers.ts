/**
 * FAQ answer bank — one answer per question, reused on every page that asks
 * it, so answers stay consistent. Figma only showed each page's first answer;
 * the rest were written from facts already on the site (owner OK, 2026-11-17).
 * Client facts come from site.ts. Each answer ≤ 3 lines in 600px (~200 chars).
 */
import { site } from './site';
import type { FaqItem } from './types';

const answers: Record<string, string> = {
  'Will I see the film?':
    'Not from any normal viewing distance. Edges are wrapped by hand around each panel, so there are no visible seams on the front of the car.',
  'Do you cut film on the car?':
    'Never. Every pattern is pre-cut on a plotter, then wrapped around the panel edges by hand. No blade ever touches your paint.',
  'Can you coat over the film?':
    'Yes, and we recommend it. Ceramic over film makes it easier to clean and stops it staining. It’s included in the Concours Shield.',
  'What if I sell the car?':
    'Your 120-photo intake report documents the paint for the next owner. When a buyer asks for paint readings, you have them.',
  'Do you offer payment plans?':
    'Yes. The Concours Shield can be paid over 12 months. We’ll walk you through the options at your consultation.',
  'Can I choose satin instead of gloss?':
    'Yes. Full Body and Full Front are available in gloss or satin film. We’ll show you both on a sample panel at the consultation.',
  'Do you correct the paint first?':
    'Always. Every coating starts with single-stage or multi-stage paint correction, so swirls never get sealed in.',
  'Will a coating stop rock chips?':
    'No. A coating adds gloss and makes the car easier to clean, but it can’t stop a stone. For chips, you need paint protection film.',
  'How do I wash a coated car?':
    'Two buckets, a pH-neutral soap and no brushes. Your 5-Minute Care Card shows the full routine and what never to use.',
  'Do you collect the car?':
    'Yes. We collect your car from your garage in an enclosed trailer and return it covered, so it never travels dirty to a shop.',
  'Can I visit during the install?':
    'Yes, by appointment. Your installer will show you the car in the bay while the work is underway.',
  'What’s in the intake report?':
    '120 photos of every panel, plus paint measurements taken before we touch the car. It’s yours to keep for insurance and resale.',
  'How long does the film need to cure?':
    '48 hours in our climate-controlled bay, then a 3-light inspection of every panel. Your care card tells you when the first wash is safe.',
  'Can we talk by phone first?':
    `Of course. Call the studio at ${site.phone} and ask for the installer, or leave your number in the form and we’ll call within one business day.`,
  'How far ahead should I book?':
    'We take six cars a month, so most months fill early. Get in touch as soon as you know your dates and we’ll hold a slot.',
  'What should I bring to the consultation?':
    'Just the car, if you can. If not, a few photos and its year, make and model are enough for an exact price.',
};

/** FAQ item for a question from the bank (throws if a question has no answer). */
export function faq(question: string): FaqItem {
  const answer = answers[question];
  if (!answer) throw new Error(`No FAQ answer for "${question}" — add it to src/content/faqAnswers.ts`);
  return { question, answer };
}

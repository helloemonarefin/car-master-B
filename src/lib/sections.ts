/**
 * Section numbering: (01), (02)… are generated from the order of the
 * section array, never typed. Only section types that show an index
 * are counted (the hero and final CTA have none).
 */
import type { SectionContent } from '../content/types';

const UNNUMBERED: ReadonlySet<SectionContent['type']> = new Set(['hero', 'final-cta']);

export type Numbered<T extends SectionContent = SectionContent> = { content: T; index: number };

export function numberSections(sections: SectionContent[]): Numbered[] {
  let n = 0;
  return sections.map((content) => ({
    content,
    index: UNNUMBERED.has(content.type) ? 0 : ++n,
  }));
}

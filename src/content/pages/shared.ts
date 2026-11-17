/**
 * Inner pages reuse Home's sections where the design repeats one. Pull them
 * from home.ts by type so the copy lives in one place.
 */
import { sections as homeSections } from '../home';
import type { SectionContent } from '../types';

type Of<T extends SectionContent['type']> = Extract<SectionContent, { type: T }>;

/** The Home section of a given type (each type appears once on Home). */
export function fromHome<T extends SectionContent['type']>(type: T): Of<T> {
  const found = homeSections.find((s) => s.type === type);
  if (!found) throw new Error(`Home has no "${type}" section to reuse.`);
  return found as Of<T>;
}


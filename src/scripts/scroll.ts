// Smooth scroll + scroll lock (BOILERPLATE §1.13).
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenis: Lenis | null = null;

/** Nav height from the single --nav-h token (64 mobile / 88 desktop). */
export const navHeight = () =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 0;

export function initScroll() {
  if (lenis) return lenis;
  // Reduced motion: native scrolling, no smoothing.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  lenis = new Lenis({
    autoRaf: true,
    anchors: { offset: -navHeight() }, // land below the sticky nav
    allowNestedScroll: true,
    stopInertiaOnNavigate: true,
  });
  return lenis;
}

/** Lock / unlock page scrolling (mobile menu). */
export function lockScroll(locked: boolean) {
  document.documentElement.classList.toggle('is-locked', locked);
  if (locked) lenis?.stop();
  else lenis?.start();
}

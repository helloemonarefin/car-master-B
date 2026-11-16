// Scroll reveal (BOILERPLATE §1.5). Elements with [data-reveal] rise and fade
// in once; [data-reveal-group] reveals its children together, left → right.
export function initReveal() {
  const root = document.documentElement;
  if (!root.classList.contains('reveal-on')) return;

  const stagger = () => parseFloat(getComputedStyle(root).getPropertyValue('--m-reveal-stagger')) || 0.05;

  const show = (els: HTMLElement[]) => {
    const s = stagger();
    els
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .sort((a, b) => Math.round(a.r.top - b.r.top) || a.r.left - b.r.left)
      .forEach(({ el, r }, i) => {
        const offscreen = r.right < 0 || r.left > window.innerWidth;
        el.style.setProperty('--reveal-delay', `${offscreen ? 0 : i * s}s`);
        el.classList.add('is-revealed');
      });
  };

  const io = new IntersectionObserver(
    (entries) => {
      const batch: HTMLElement[] = [];
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        if (el.hasAttribute('data-reveal-group')) {
          batch.push(...el.querySelectorAll<HTMLElement>('[data-reveal]'));
        } else {
          batch.push(el);
        }
      }
      if (batch.length) show(batch);
    },
    { rootMargin: '0px 0px -40px 0px', threshold: 0.01 },
  );

  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((g) => io.observe(g));
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (!el.closest('[data-reveal-group]')) io.observe(el);
  });
}

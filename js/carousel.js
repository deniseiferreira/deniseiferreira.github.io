/* Hero "Why Denise" carousel: native scroll-snap for swipe, buttons and dots for pointer/keyboard. */
(function () {
  const root = document.querySelector('.why');
  if (!root) return;

  const track = root.querySelector('.why-track');
  const slides = Array.from(track.querySelectorAll('.why-slide'));
  const dots = Array.from(root.querySelectorAll('.why-dot'));
  const prev = root.querySelector('.why-arrow[data-dir="-1"]');
  const next = root.querySelector('.why-arrow[data-dir="1"]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = -1;

  function setActive(i) {
    if (i === current) return;
    current = i;
    slides.forEach((s, n) => { s.inert = n !== i; });
    dots.forEach((d, n) => {
      if (n === i) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
    prev.disabled = i === 0;
    next.disabled = i === slides.length - 1;
  }

  function goTo(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({
      left: i * track.clientWidth,
      behavior: reduceMotion.matches ? 'auto' : 'smooth'
    });
    setActive(i);
  }

  let raf = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      setActive(Math.round(track.scrollLeft / track.clientWidth));
    });
  }, { passive: true });

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, n) => d.addEventListener('click', () => goTo(n)));

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
  });

  /* Always open on slide 1: browsers restore the track's scroll position on reload
     and on back/forward navigation, so reset it after load and when restored from cache. */
  function reset() {
    track.scrollTo({ left: 0, behavior: 'auto' });
    current = -1;
    setActive(0);
  }

  reset();
  window.addEventListener('load', reset);
  window.addEventListener('pageshow', (e) => { if (e.persisted) reset(); });
})();

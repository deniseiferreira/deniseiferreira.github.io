/* Hero "Why Denise" carousel: buttons, dots and arrow keys move the slides; touch keeps native swipe.
   Only the visible slide is reachable (others are inert); a polite status announces user-driven changes. */
(function () {
  const root = document.querySelector('.why');
  if (!root) return;

  const track = root.querySelector('.why-track');
  const slides = Array.from(track.querySelectorAll('.why-slide'));
  const dots = Array.from(root.querySelectorAll('.why-dot'));
  const prev = root.querySelector('.why-arrow[data-dir="-1"]');
  const next = root.querySelector('.why-arrow[data-dir="1"]');
  const status = document.getElementById('why-status');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = -1;
  let target = null;   /* slide a button/dot/key is scrolling to; ignore the slides passed on the way */
  let announceTimer = 0;
  let targetTimer = 0;

  /* One short message after the slide settles, e.g. "Slide 2 of 5: Better products, better ways of working." */
  function announce(i) {
    if (!status) return;
    clearTimeout(announceTimer);
    announceTimer = setTimeout(() => {
      const heading = slides[i].querySelector('h2');
      const title = heading ? ': ' + heading.textContent.replace(/\s+/g, ' ').trim() : '';
      status.textContent = 'Slide ' + (i + 1) + ' of ' + slides.length + title;
    }, 400);
  }

  function setActive(i, speak) {
    if (i === current) return;
    current = i;
    slides.forEach((s, n) => { s.inert = n !== i; });
    dots.forEach((d, n) => {
      if (n === i) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
    /* aria-disabled (not the disabled attribute) keeps the arrow focusable and visible at the
       first/last slide, so keyboard focus is never left on an invisible control */
    prev.setAttribute('aria-disabled', String(i === 0));
    next.setAttribute('aria-disabled', String(i === slides.length - 1));
    if (speak) announce(i);
  }

  function goTo(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    if (i !== current) {
      target = i;
      /* if the scroll is interrupted (e.g. a swipe mid-way), go back to following the track */
      clearTimeout(targetTimer);
      targetTimer = setTimeout(() => { target = null; }, 1000);
    }
    track.scrollTo({
      left: i * track.clientWidth,
      behavior: reduceMotion.matches ? 'auto' : 'smooth'
    });
    setActive(i, true);
  }

  let raf = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      if (target !== null) {          /* programmatic scroll: wait until it arrives */
        if (i === target) target = null;
        return;
      }
      setActive(i, true);             /* touch swipe */
    });
  }, { passive: true });

  function onArrow(btn, dir) {
    btn.addEventListener('click', () => {
      if (btn.getAttribute('aria-disabled') === 'true') return;
      goTo(current + dir);
    });
  }
  onArrow(prev, -1);
  onArrow(next, 1);
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
    target = null;
    setActive(0, false);
  }

  reset();
  window.addEventListener('load', reset);
  window.addEventListener('pageshow', (e) => { if (e.persisted) reset(); });
})();

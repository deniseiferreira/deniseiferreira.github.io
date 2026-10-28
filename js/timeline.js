/* Career timeline: start the rocket's short launch animation once, when it scrolls into view.
   The animation lasts under 5 s and doesn't loop; reduced-motion users get none (see home.css). */
(function () {
  const tl = document.querySelector('.tl');
  if (!tl || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      tl.classList.add('is-animating');
      io.disconnect();
    }
  }, { threshold: 0.4 });
  io.observe(tl);
})();

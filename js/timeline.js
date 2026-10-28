/* Career timeline: the rocket animates while the About section is on screen and stops when
   it leaves. Reduced-motion users get no animation (see home.css). */
(function () {
  const tl = document.querySelector('.tl');
  const about = document.getElementById('about');
  if (!tl || !about || !('IntersectionObserver' in window)) return;

  new IntersectionObserver((entries) => {
    tl.classList.toggle('is-animating', entries[entries.length - 1].isIntersecting);
  }).observe(about);
})();

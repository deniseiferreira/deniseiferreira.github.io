/* Mobile navigation: disclosure button (aria-expanded) that shows/hides the menu panel.
   Closes on Escape (focus back to the button), on a tap outside, and after choosing a link. */
(function () {
  const button = document.querySelector('.hamburger');
  const menu = document.getElementById('m-menu');
  const overlay = document.querySelector('.m-menu-overlay');
  if (!button || !menu) return;

  const desktop = window.matchMedia('(min-width: 769px)');

  function isOpen() {
    return button.getAttribute('aria-expanded') === 'true';
  }

  function setOpen(open) {
    button.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  }

  button.addEventListener('click', () => setOpen(!isOpen()));

  if (overlay) overlay.addEventListener('click', () => setOpen(false));

  /* Let the link navigate as usual (anchor or page), just close the panel */
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });

  /* The mobile bar is hidden on desktop: don't leave the panel open behind it */
  desktop.addEventListener('change', (e) => { if (e.matches) setOpen(false); });
})();

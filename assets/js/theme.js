// Light/dark toggle.
//
// The CSS does the actual work: `color-scheme: light dark` on :root means an
// unmarked page already follows the OS, live, with nothing listening. So this
// file has one job, which is to record a choice that differs from the OS.
//
// Choosing the theme the OS is already on clears the record instead of pinning
// it, so a reader who toggles twice is back to following their system.
(function () {
  var root = document.documentElement;
  var button = document.querySelector('.theme-toggle');
  if (!button) return;

  var media = window.matchMedia('(prefers-color-scheme: dark)');

  button.addEventListener('click', function () {
    var showing = root.getAttribute('data-theme') || (media.matches ? 'dark' : 'light');
    var next = showing === 'dark' ? 'light' : 'dark';
    var system = media.matches ? 'dark' : 'light';

    try {
      if (next === system) {
        root.removeAttribute('data-theme');
        localStorage.removeItem('theme');
      } else {
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      }
    } catch (e) {
      root.setAttribute('data-theme', next);
    }
  });
})();

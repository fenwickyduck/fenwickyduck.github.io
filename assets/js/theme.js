// Light/dark toggle. The initial value is set inline in <head> to avoid a
// flash; this only handles clicks and keeps following the OS until the user
// makes an explicit choice.
(function () {
  var root = document.documentElement;
  var button = document.querySelector('.theme-toggle');
  if (!button) return;

  button.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    root.setAttribute('theme-source', 'user');
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
  });

  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var onChange = function (event) {
    if (root.getAttribute('theme-source') === 'user') return;
    root.setAttribute('data-theme', event.matches ? 'dark' : 'light');
  };

  if (media.addEventListener) {
    media.addEventListener('change', onChange);
  } else if (media.addListener) {
    media.addListener(onChange);
  }
})();

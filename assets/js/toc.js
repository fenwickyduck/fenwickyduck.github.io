// Marks the section you're currently reading in the contents list.
//
// The rule is the one that holds at every scroll position: the current section
// is the last heading that has passed the top of the reading area. Deciding
// from what happens to be on screen is where this kind of script usually goes
// wrong, because a section taller than the window puts no heading on screen at
// all and there is nothing to point at.
//
// Two things follow from the rule and are worth keeping:
//
//   The line it measures against is the heading's own scroll-margin, which is
//   the number the browser uses to park a heading you jump to. Following a link
//   to a section and reading down into it therefore agree by construction, and
//   the sticky header is already accounted for, since accounting for it is what
//   the scroll-margin is for.
//
//   At the foot of the page the remaining headings can never reach that line,
//   because there is no scrolling left to do. Without the last clause in
//   update(), the final section or two on every long post would be unmarkable.
//
// Positions are measured once and cached, so scrolling compares numbers and
// reads no layout. They are measured again whenever anything could have moved
// them: the window resizing, late images or fonts arriving, or the list itself
// being folded away above the article on a narrow screen.
(function () {
  var toc = document.querySelector('.toc');
  if (!toc) return;

  var links = [];
  var headings = [];

  Array.prototype.forEach.call(toc.querySelectorAll('a[href^="#"]'), function (a) {
    var id = a.getAttribute('href').slice(1);
    var heading = document.getElementById(decodeURIComponent(id)) || document.getElementById(id);
    if (!heading) return;
    links.push(a);
    headings.push(heading);
  });

  if (!headings.length) return;

  var tops = [];
  var current = -1;

  function measure() {
    var offset = window.pageYOffset;
    tops = headings.map(function (h) {
      return h.getBoundingClientRect().top + offset;
    });
  }

  function edge() {
    var margin = parseFloat(window.getComputedStyle(headings[0]).scrollMarginTop);
    // A few pixels of slack, so a heading resting exactly on the line counts as
    // arrived rather than falling a rounding error short of it.
    return (margin || 0) + 4;
  }

  function update() {
    var y = window.pageYOffset;
    var found = -1;
    var i;

    for (i = 0; i < tops.length; i++) {
      if (tops[i] > y + edge()) break;
      found = i;
    }

    // Scrolled as far as the page goes: whatever is still below the line is as
    // read as it is ever going to be, so the last heading on screen takes it.
    if (y + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      for (i = tops.length - 1; i > found; i--) {
        if (tops[i] < y + window.innerHeight) { found = i; break; }
      }
    }

    if (found === current) return;
    current = found;

    for (i = 0; i < links.length; i++) {
      if (i === found) {
        links[i].classList.add('is-current');
        links[i].setAttribute('aria-current', 'location');
        keepInView(links[i]);
      } else {
        links[i].classList.remove('is-current');
        links[i].removeAttribute('aria-current');
      }
    }
  }

  // A contents list long enough to scroll inside the margin shouldn't park the
  // live entry out of sight. Only the list moves; the page never does.
  function keepInView(link) {
    if (toc.scrollHeight <= toc.clientHeight) return;
    var box = link.getBoundingClientRect();
    var rail = toc.getBoundingClientRect();
    if (box.top < rail.top) {
      toc.scrollTop -= rail.top - box.top + 8;
    } else if (box.bottom > rail.bottom) {
      toc.scrollTop += box.bottom - rail.bottom + 8;
    }
  }

  var queued = false;
  function schedule(remeasure) {
    if (remeasure) measure();
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () {
      queued = false;
      update();
    });
  }

  window.addEventListener('scroll', function () { schedule(false); }, { passive: true });
  window.addEventListener('resize', function () { schedule(true); }, { passive: true });
  window.addEventListener('load', function () { schedule(true); });
  toc.addEventListener('toggle', function () { schedule(true); });

  // The measurement that matters most. This script runs before the serif has
  // arrived, and swapping it in moves every heading down the page by more than
  // the slack in edge(): measured on a long page here, about thirty pixels. Any
  // position taken before that is of a layout the reader never sees.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { schedule(true); });
  }

  measure();
  update();
})();

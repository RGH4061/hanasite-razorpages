/* about-heritage.js — decade timeline + sticky decade bar (vanilla, extracted) */
document.documentElement.style.setProperty('--topbar-h','0px');

// Decade bar shares the hero flow at rest; goes solid once it pins over the timeline.
  (function () {
    var nav = document.querySelector('.decade-nav');
    var sentinel = document.querySelector('.decade-stick-sentinel');
    if (!nav || !sentinel || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        nav.classList.toggle('is-stuck', !e.isIntersecting && e.boundingClientRect.top <= 0);
      });
    }, { threshold: [0, 1] });
    io.observe(sentinel);
  })();

// Vertical timeline (.tl-v): milestones rise in once, each dot lights as it reaches the
// middle of the screen, the rail fills with scroll, and the current decade's label and
// chip highlight. Decade chips scroll to their decade.
(function () {
  var root = document.querySelector('.tl-v');
  if (!root) return;
  var items = Array.prototype.slice.call(root.querySelectorAll('.tl-item'));
  var decades = Array.prototype.slice.call(root.querySelectorAll('.tl-decade'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('.decade-chip'));
  var rail = root.querySelector('.tl-rail');
  var fill = root.querySelector('.tl-rail-fill');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.hana-header');
  var nav = document.querySelector('.decade-nav');

  // On phones the site header is pinned; park the decade buttons just below it (they
  // otherwise slide under the header) and offset decade jumps by both bars.
  function offsets() {
    var hdr = header && getComputedStyle(header).position === 'sticky' ? header.offsetHeight : 0;
    if (nav) nav.style.top = hdr + 'px';
    document.documentElement.style.setProperty('--tl-offset', (hdr + (nav ? nav.offsetHeight : 0) + 16) + 'px');
  }
  offsets();
  window.addEventListener('resize', offsets);

  if (!reduced && 'IntersectionObserver' in window) {
    root.classList.add('tl-anim');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (it) { io.observe(it); });
  }

  function update() {
    var mid = window.innerHeight * 0.55;
    var r = rail.getBoundingClientRect();
    var p = r.height > 0 ? Math.min(1, Math.max(0, (mid - r.top) / r.height)) : 0;
    fill.style.transform = 'scaleY(' + p.toFixed(4) + ')';
    items.forEach(function (it) { it.classList.toggle('is-lit', it.getBoundingClientRect().top + 10 < mid); });
    var current = decades[0];
    decades.forEach(function (d) { if (d.getBoundingClientRect().top < mid) current = d; });
    decades.forEach(function (d) { d.classList.toggle('is-current', d === current); });
    chips.forEach(function (c) { c.classList.toggle('is-active', c.dataset.decade === current.dataset.decade); });
  }
  var raf = null;
  window.addEventListener('scroll', function () {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = null; update(); });
  }, { passive: true });
  window.addEventListener('resize', update);

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var target = document.getElementById('decade-' + chip.dataset.decade);
      if (target) target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });
  update();
})();

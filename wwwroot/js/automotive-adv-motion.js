/* automotive-adv-motion.js — Automotive hub advantage band: the cyan crosshairs
   pulse slowly, each on its own delay.
   Re-applies when hana-backgrounds.js re-renders the SVG on resize. Visitors who turn
   off motion in their device settings see the static pattern. */
(function () {
  var band = document.querySelector('.auto-advantage');
  if (!band || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function decorate() {
    var svg = band.querySelector('.hana-bg-layer > svg');
    if (!svg || svg.getAttribute('data-adv')) return;
    svg.setAttribute('data-adv', '1');
    svg.classList.add('adv-pulse');
    // Group the accent crosshair lines and rings by position so each fiducial pulses as one
    var groups = {};
    Array.prototype.forEach.call(svg.querySelectorAll('[stroke="#19C6E6"]'), function (el) {
      var key = el.tagName === 'circle'
        ? el.getAttribute('cx') + ',' + el.getAttribute('cy')
        : (el.getAttribute('x1') === el.getAttribute('x2') ? el.getAttribute('x1') + ',' + ((+el.getAttribute('y1') + +el.getAttribute('y2')) / 2)
                                                            : ((+el.getAttribute('x1') + +el.getAttribute('x2')) / 2) + ',' + el.getAttribute('y1'));
      (groups[key] = groups[key] || []).push(el);
    });
    Object.keys(groups).forEach(function (k, i) {
      var delay = -((i * 1.7) % 5.5).toFixed(2) + 's';
      groups[k].forEach(function (el) { el.classList.add('adv-hot'); el.style.animationDelay = delay; });
    });
  }

  var layerObs = new MutationObserver(decorate);
  (function wait(n) {
    var layer = band.querySelector('.hana-bg-layer');
    if (layer) { layerObs.observe(layer, { childList: true }); decorate(); return; }
    if (n < 120) requestAnimationFrame(function () { wait(n + 1); });
  })(0);

  new IntersectionObserver(function (es) {
    es.forEach(function (e) { band.classList.toggle('is-live', e.isIntersecting); });
  }).observe(band);
})();

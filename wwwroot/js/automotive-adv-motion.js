/* automotive-adv-motion.js — motion demo for the Automotive hub advantage band.
   Default: the cyan crosshairs pulse slowly, each on its own delay.
   ?adv=scan adds a faint light band that sweeps left to right across the grid.
   Re-applies when hana-backgrounds.js re-renders the SVG on resize. Visitors who turn
   off motion in their device settings see the static pattern. */
(function () {
  var band = document.querySelector('.auto-advantage');
  if (!band || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var scan = /[?&]adv=scan/.test(location.search);
  var NS = 'http://www.w3.org/2000/svg';

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
    if (scan) {
      var w = svg.getBoundingClientRect().width, h = svg.getBoundingClientRect().height, id = 'advBeam' + Date.now();
      svg.classList.add('adv-scan');
      svg.style.setProperty('--adv-w', w + 'px');
      var defs = svg.querySelector('defs') || svg.insertBefore(document.createElementNS(NS, 'defs'), svg.firstChild);
      var g = document.createElementNS(NS, 'linearGradient');
      g.setAttribute('id', id);
      [['0%', 0], ['50%', 0.10], ['100%', 0]].forEach(function (s) {
        var st = document.createElementNS(NS, 'stop');
        st.setAttribute('offset', s[0]); st.setAttribute('stop-color', '#19C6E6'); st.setAttribute('stop-opacity', s[1]);
        g.appendChild(st);
      });
      defs.appendChild(g);
      var r = document.createElementNS(NS, 'rect');
      r.setAttribute('class', 'adv-beam'); r.setAttribute('x', 0); r.setAttribute('y', 0);
      r.setAttribute('width', 220); r.setAttribute('height', h); r.setAttribute('fill', 'url(#' + id + ')');
      svg.appendChild(r);
    }
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

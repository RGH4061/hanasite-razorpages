/* automotive-cutaway.js — the interactive vehicle cutaway on the Automotive hub.
   - Hovering or focusing a "Parts we produce" item highlights its markers (data-fam="n"
     ties the small sensor-location dots to item n).
   - Filter chips above the vehicle (built here, so nothing shows without the script) dim the
     other families and open a detail card with a link to the product page.
   - Guided tour: on first view the markers appear in turn, then the cutaway steps through each
     family once and returns to "All". Any hover, click or key press in the hero ends it.
   Visitors who turn off motion in their device settings get the chips and hover, with no tour. */
(function () {
  var LINKS = { '1': '/markets/automotive/power-modules', '2': '/markets/automotive/automotive-pcba',
                '3': '/markets/automotive/led-lighting', '4': '/markets/automotive/rfid-tire-tags',
                '5': '/markets/automotive/sensor-assembly' };
  var STEP = 3200;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    document.querySelectorAll('.auto-cutaway').forEach(function (root) {
      var stage = root.querySelector('.auto-stage');
      var markers = Array.prototype.slice.call(root.querySelectorAll('.auto-marker'));
      var items = Array.prototype.slice.call(root.querySelectorAll('.auto-legitem'));
      function txt(el, sel) { return ((el.querySelector(sel) || {}).textContent || '').trim(); }
      function fam(mk) { return mk.getAttribute('data-fam') || txt(mk, '.dot'); }
      var fams = items.map(function (item) {
        var n = txt(item, '.n'), lead = markers.filter(function (m) { return txt(m, '.dot') === n; })[0];
        return { n: n, item: item, lead: lead, color: item.querySelector('.n').style.background,
                 tag: lead ? txt(lead, '.tag') : txt(item, '.nm'), nm: txt(item, '.nm'),
                 ds: txt(item, '.ds'), ms: markers.filter(function (m) { return fam(m) === n; }) };
      });

      // Pulse rings take each marker's own colour
      markers.forEach(function (m, i) {
        var d = m.querySelector('.dot');
        m.style.setProperty('--mc', d.style.background);
        m.style.setProperty('--md', (-(i * 1.1) % 5.5).toFixed(2) + 's');
      });

      // Hover/focus on the legend
      fams.forEach(function (f) {
        function on() { f.ms.forEach(function (m) { m.classList.add('is-active'); }); f.item.classList.add('is-active'); }
        function off() { f.ms.forEach(function (m) { m.classList.remove('is-active'); }); f.item.classList.remove('is-active'); }
        f.item.addEventListener('mouseenter', on); f.item.addEventListener('mouseleave', off);
        f.item.addEventListener('focus', on); f.item.addEventListener('blur', off);
        f.item.setAttribute('tabindex', '0');
      });

      // Detail card
      var card = document.createElement('div');
      card.className = 'auto-card';
      card.setAttribute('aria-live', 'polite');
      stage.appendChild(card);

      // Filter chips
      var bar = document.createElement('div');
      bar.className = 'auto-chips';
      bar.innerHTML = '<span class="lbl">Show on vehicle</span>';
      var chips = [];
      function chip(label, n, color) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'auto-chip'; b.setAttribute('data-f', n);
        b.innerHTML = (color ? '<i style="background:' + color + '"></i>' : '') + label;
        b.addEventListener('click', function () { stopTour(); select(n === 'all' ? null : n); });
        bar.appendChild(b); chips.push(b);
      }
      chip('All parts', 'all');
      fams.forEach(function (f) { chip(f.tag, f.n, f.color); });
      root.parentNode.insertBefore(bar, root);

      function select(n) {
        var f = fams.filter(function (x) { return x.n === n; })[0];
        root.classList.toggle('is-filtered', !!f);
        markers.forEach(function (m) { m.classList.toggle('is-sel', !!f && fam(m) === n); });
        items.forEach(function (it) { it.classList.toggle('is-sel', !!f && it === f.item); });
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-f') === (n || 'all'))); });
        if (!f) { card.classList.remove('is-show'); return; }
        var extra = f.ms.length > 1 ? '<span class="cnt">' + f.ms.length + ' locations shown on the vehicle</span>' : '';
        card.innerHTML = '<span class="tag" style="color:' + f.color + '">' + f.tag + '</span>' +
          '<span class="nm">' + f.nm + '</span><span class="ds">' + f.ds + '</span>' + extra +
          '<a class="cta" href="' + LINKS[n] + '">Explore product <i data-lucide="arrow-right" style="width:12px;height:12px;"></i></a>';
        if (window.lucide && lucide.createIcons) lucide.createIcons();
        card.classList.add('is-show');
      }
      select(null);

      // Guided tour
      var timers = [], touring = false;
      function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
      function stopTour() {
        if (!touring) return;
        touring = false;
        timers.forEach(clearTimeout); timers = [];
        stage.classList.remove('is-intro');
        markers.forEach(function (m) { m.classList.add('is-in'); });
        select(null);
      }
      function startTour() {
        touring = true;
        var lead = markers.filter(function (m) { return !m.hasAttribute('data-fam'); });
        var locs = markers.filter(function (m) { return m.hasAttribute('data-fam'); });
        lead.forEach(function (m, i) { later(function () { m.classList.add('is-in'); }, 200 + i * 160); });
        var t0 = 200 + lead.length * 160 + 150;
        locs.forEach(function (m, i) { later(function () { m.classList.add('is-in'); }, t0 + i * 60); });
        var t1 = t0 + locs.length * 60 + 700;
        fams.forEach(function (f, i) { later(function () { select(f.n); }, t1 + i * STEP); });
        later(function () { select(null); touring = false; stage.classList.remove('is-intro'); }, t1 + fams.length * STEP);
      }
      ['pointerdown', 'keydown', 'wheel'].forEach(function (ev) {
        root.addEventListener(ev, stopTour, { passive: true });
        bar.addEventListener(ev, stopTour, { passive: true });
      });
      stage.addEventListener('mouseenter', stopTour);
      root.querySelector('.auto-legend').addEventListener('mouseenter', stopTour);

      if (still || !('IntersectionObserver' in window)) return;
      stage.classList.add('is-intro');
      var io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return;
        io.disconnect(); startTour();
      }, { threshold: 0.4 });
      io.observe(stage);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

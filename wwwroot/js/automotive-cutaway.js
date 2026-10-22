/* automotive-cutaway.js — the interactive vehicle cutaway on the Automotive hub.
   - Hovering or focusing a "Parts we produce" item highlights its markers (data-fam="n"
     ties the small sensor-location dots to item n).
   - Clicking a legend item dims the other families and opens a detail card with a link to the
     product page; clicking it again returns to all parts.
   - Guided tour: on first view the markers appear in turn, then the cutaway steps through each
     family once and returns to "All". Any hover, click or key press in the hero ends it.
   Visitors who turn off motion in their device settings get the hover and click selection, with no tour. */
(function () {
  var LINKS = { '1': '/markets/automotive/power-modules', '2': '/markets/automotive/automotive-pcba',
                '3': '/markets/automotive/led-lighting', '4': '/markets/rfid/rfid-tire-tags',
                '5': '/markets/automotive/sensor-assembly' };
  var STEP = 3200;
  var narrow = window.matchMedia('(max-width: 900px)');   // phones and tablets: card below the car, no tooltips
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
                 ds: item.getAttribute('data-long') || txt(item, '.ds'), ms: markers.filter(function (m) { return fam(m) === n; }) };
      });

      // Keep each tooltip inside the photo: shift it sideways when its marker sits near an edge
      function fitTips() {
        var W = stage.clientWidth;
        markers.forEach(function (m) {
          var tip = m.querySelector('.tip'); if (!tip) return;
          var half = tip.offsetWidth / 2, cx = m.offsetLeft, pad = 10;
          var tx = Math.max(pad + half - cx, Math.min(0, W - pad - half - cx));
          m.style.setProperty('--tx', Math.round(tx) + 'px');
        });
      }
      fitTips();
      window.addEventListener('resize', fitTips);

      // Clicking or tapping a marker selects it: the product card opens with the connector line, and
      // a sensor-location dot leads the card with its own name. Clicking it again clears the selection.
      markers.forEach(function (m) {
        m.setAttribute('tabindex', '0');
        m.setAttribute('role', 'button');
        m.setAttribute('aria-label', txt(m, '.nm') || txt(m, '.tag'));
        function pick(e) {
          e.stopPropagation();
          stopTour();
          select(current === fam(m) && linkFrom === m ? null : fam(m), m);
        }
        m.addEventListener('click', pick);
        m.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(e); } });
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
      root.insertBefore(card, stage.nextSibling);   // overlays the photo on desktop; sits below it on phones

      // Clicking a legend item selects its family (dims the rest, opens the detail card);
      // clicking it again returns to all parts
      var current = null;
      fams.forEach(function (f) {
        function pick() { stopTour(); select(current === f.n ? null : f.n); }
        f.item.addEventListener('click', pick);
        f.item.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
        f.item.setAttribute('role', 'button');
      });

      // A line from the selected marker to the product card: on desktop the card sits over the
      // photo, so the line runs at an angle to the nearest card edge; on phones the card is below
      // the car, so the line drops straight down to it.
      var link = document.createElement('span');
      link.className = 'auto-link';
      link.setAttribute('aria-hidden', 'true');
      root.appendChild(link);
      var linkFrom = null;
      function drawLink() {
        var f = fams.filter(function (x) { return x.n === current; })[0];
        if (!f || !linkFrom || !card.classList.contains('is-show')) { link.classList.remove('is-show'); return; }
        var R = root.getBoundingClientRect(), m = linkFrom.getBoundingClientRect(), c = card.getBoundingClientRect();
        var mx = m.left + m.width / 2 - R.left, my = m.top + m.height / 2 - R.top;
        var cl = c.left - R.left, ct = c.top - R.top, cr = cl + c.width, cb = ct + c.height;
        // nearest point on the card's edge to the marker
        var ax = Math.max(cl, Math.min(mx, cr)), ay = Math.max(ct, Math.min(my, cb));
        var dx = ax - mx, dy = ay - my, len = Math.sqrt(dx * dx + dy * dy), gap = m.width / 2 + 3;
        if (len <= gap + 6) { link.classList.remove('is-show'); return; }
        // colour accent on the card edge the line arrives at
        var edge = Math.abs(dy) >= Math.abs(dx) ? (ay <= ct ? 'top' : 'bottom') : (ax <= cl ? 'left' : 'right');
        card.setAttribute('data-edge', edge);
        var ang = Math.atan2(dy, dx);
        link.style.left = (mx + Math.cos(ang) * gap) + 'px';
        link.style.top = (my + Math.sin(ang) * gap) + 'px';
        link.style.width = (len - gap) + 'px';
        link.style.transform = 'rotate(' + ang + 'rad)';
        link.style.setProperty('--lc', f.color);
        card.style.setProperty('--lc', f.color);
        link.classList.add('is-show');
      }
      window.addEventListener('resize', drawLink);
      card.addEventListener('transitionend', drawLink);   // the card eases into place; redraw once it settles

      function select(n, from) {
        var f = fams.filter(function (x) { return x.n === n; })[0];
        linkFrom = f ? (from || f.lead) : null;
        root.classList.toggle('is-filtered', !!f);
        markers.forEach(function (m) { m.classList.toggle('is-sel', !!f && fam(m) === n); });
        items.forEach(function (it) { it.classList.toggle('is-sel', !!f && it === f.item); });
        current = f ? n : null;
        fams.forEach(function (x) { x.item.setAttribute('aria-pressed', String(!!f && x === f)); });
        if (!f) { markers.forEach(function (m) { m.classList.remove('is-picked'); }); card.classList.remove('is-show'); drawLink(); return; }
        var extra = f.ms.length > 1 ? '<span class="cnt">' + f.ms.length + ' sensor types shown on the vehicle</span>' : '';
        // A tapped sensor-location dot leads the card with its own name; the family stays in the label
        var picked = from && from.hasAttribute('data-fam') ? from : null;
        markers.forEach(function (m) { m.classList.toggle('is-picked', m === picked); });
        card.innerHTML = '<span class="tag" style="color:' + f.color + '">' + f.tag + '</span>' +
          '<span class="nm">' + (picked ? txt(picked, '.nm') : f.nm) + '</span><span class="ds">' + f.ds + '</span>' + extra +
          '<a class="cta" href="' + LINKS[n] + '">Explore product <i data-lucide="arrow-right" style="width:12px;height:12px;"></i></a>';
        if (window.lucide && lucide.createIcons) lucide.createIcons();
        card.classList.add('is-show');
        drawLink();
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

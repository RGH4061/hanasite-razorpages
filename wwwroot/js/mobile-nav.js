/*!
 * mobile-nav.js — Hana mobile header (≤900px only) — "Option C" dark slide-in
 * ---------------------------------------------------------------------------
 * Progressive enhancement over the shared desktop header. Above 900px this is
 * inert (all injected chrome is display:none via _components.css). At ≤900px it:
 *   • injects a hamburger into the header CTA cluster (Contact stays visible)
 *   • builds a half-width, right-docked DARK accordion panel from the EXISTING
 *     markup — each <a.hana-nav-link[data-menu]> becomes a row whose name links
 *     to its hub and whose chevron expands a clone of the matching
 *     <div.hana-mega[data-panel]> content (markets / capability pillars / IR
 *     groups / locations). Content is cloned, so it never drifts from desktop.
 *   • relocates Search / Careers / News / EN to the panel foot
 *   • single section open at a time; closes on link tap, ×, backdrop, Escape
 *
 * No dependencies. Auto-inits on DOMContentLoaded.
 */
(function () {
  'use strict';

  var MQ = '(max-width: 900px)';
  function svg(p) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  }
  var I = {
    burger: '<path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/>',
    close:  '<path d="M18 6 6 18"/><path d="M6 6l12 12"/>',
    chev:   '<path d="m6 9 6 6 6-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    globe:  '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>'
  };
  function cssEsc(s) { return s.replace(/"/g, '\\"'); }
  function findUtilHref(header, kw) {
    var as = header.querySelectorAll('.hana-util-bar a');
    for (var i = 0; i < as.length; i++) {
      if ((as[i].textContent || '').trim().toLowerCase() === kw) return as[i].getAttribute('href');
    }
    return '#';
  }

  function init() {
    var header = document.querySelector('.hana-header');
    if (!header || header.querySelector('.hana-mnav-burger')) return;
    var navWrap = document.getElementById('hana-nav-wrap');
    var nav = header.querySelector('nav[aria-label="Primary navigation"]');
    if (!navWrap || !nav) return;
    var cta = nav.parentElement.querySelector('[style*="margin-left:auto"]') || nav.parentElement.lastElementChild;

    /* hamburger */
    var burger = document.createElement('button');
    burger.type = 'button';
    burger.className = 'hana-mnav-burger';
    burger.setAttribute('aria-label', 'Open menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = svg(I.burger);
    cta.appendChild(burger);

    /* backdrop + panel */
    var backdrop = document.createElement('div');
    backdrop.className = 'hana-mnav-backdrop';
    backdrop.hidden = true;

    var panel = document.createElement('aside');
    panel.className = 'hana-mnav-panel';
    panel.setAttribute('aria-label', 'Site menu');
    panel.hidden = true;

    /* slim head — close only */
    var head = document.createElement('div');
    head.className = 'hana-mnav-head';
    head.innerHTML = '<button type="button" class="hana-mnav-close" aria-label="Close menu">' + svg(I.close) + '</button>';
    panel.appendChild(head);

    var scroll = document.createElement('div');
    scroll.className = 'hana-mnav-scroll';
    var acc = document.createElement('ul');
    acc.className = 'hana-macc';

    nav.querySelectorAll('a.hana-nav-link[data-menu]').forEach(function (link) {
      var name = link.getAttribute('data-menu');
      var hub = link.getAttribute('href') || '#';
      var mega = navWrap.querySelector('.hana-mega[data-panel="' + cssEsc(name) + '"]');

      var li = document.createElement('li');
      li.className = 'hana-macc-item';

      var row = document.createElement('div');
      row.className = 'hana-macc-row';
      var a = document.createElement('a');
      a.className = 'hana-macc-name';
      a.href = hub;
      a.textContent = name;
      row.appendChild(a);

      if (mega && mega.querySelector('.hana-wrap')) {
        var tog = document.createElement('button');
        tog.type = 'button';
        tog.className = 'hana-macc-tog';
        tog.setAttribute('aria-label', 'Expand ' + name);
        tog.setAttribute('aria-expanded', 'false');
        tog.innerHTML = svg(I.chev);
        row.appendChild(tog);
        li.appendChild(row);

        var body = document.createElement('div');
        body.className = 'hana-macc-body';
        body.hidden = true;
        body.appendChild(mega.querySelector('.hana-wrap').cloneNode(true));
        li.appendChild(body);

        tog.addEventListener('click', function () {
          var open = !li.classList.contains('is-open');
          acc.querySelectorAll('.hana-macc-item.is-open').forEach(function (o) {
            o.classList.remove('is-open');
            o.querySelector('.hana-macc-body').hidden = true;
            o.querySelector('.hana-macc-tog').setAttribute('aria-expanded', 'false');
          });
          if (open) { li.classList.add('is-open'); body.hidden = false; tog.setAttribute('aria-expanded', 'true'); }
        });
      } else {
        li.appendChild(row);
      }
      acc.appendChild(li);
    });
    scroll.appendChild(acc);
    panel.appendChild(scroll);

    /* foot — search label + icon field + util links */
    var foot = document.createElement('div');
    foot.className = 'hana-mnav-foot';
    foot.innerHTML =
      '<div class="hana-mnav-slabel">Search capabilities, markets</div>' +
      '<a class="hana-mnav-search" href="#" aria-label="Search">' + svg(I.search) + '</a>' +
      '<div class="hana-mnav-utrow">' +
        '<a href="' + findUtilHref(header, 'careers') + '">Careers</a>' +
        '<a href="' + findUtilHref(header, 'news') + '">News</a>' +
        '<a href="#" class="hana-mnav-lang">' + svg(I.globe) + ' EN</a>' +
      '</div>';
    panel.appendChild(foot);

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);

    /* open / close */
    function isOpen() { return panel.classList.contains('is-open'); }
    function open() {
      panel.hidden = false; backdrop.hidden = false;
      void panel.offsetWidth;
      panel.classList.add('is-open'); backdrop.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true'); burger.innerHTML = svg(I.close);
      document.body.style.overflow = 'hidden';
    }
    function close() {
      panel.classList.remove('is-open'); backdrop.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false'); burger.innerHTML = svg(I.burger);
      document.body.style.overflow = '';
      var onEnd = function () { panel.hidden = true; backdrop.hidden = true; panel.removeEventListener('transitionend', onEnd); };
      panel.addEventListener('transitionend', onEnd);
    }
    burger.addEventListener('click', function () { isOpen() ? close() : open(); });
    head.querySelector('.hana-mnav-close').addEventListener('click', close);
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) close(); });
    panel.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a && a.getAttribute('href') && a.getAttribute('href') !== '#') close();
    });
    var mql = window.matchMedia(MQ);
    (mql.addEventListener ? mql.addEventListener.bind(mql, 'change') : mql.addListener.bind(mql))(function () {
      if (!mql.matches && isOpen()) close();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());

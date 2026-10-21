/*!
 * mega-menu.js — Hana site header mega-menu
 * Hover open / 130ms delayed close, chevron rotation.
 * No dependencies. Auto-initialises on DOMContentLoaded.
 *
 * Expected markup contract:
 *   <nav id="hana-nav">
 *     <a data-menu="About"   class="hana-nav-link"> … <span class="hana-nav-chevron">…</span></a>
 *     <a data-menu="Markets" class="hana-nav-link"> … </a>
 *     …
 *   </nav>
 *   <div id="hana-mega" data-panel="About"   class="hana-mega" hidden> … </div>
 *   <div id="hana-mega" data-panel="Markets" class="hana-mega" hidden> … </div>
 *   …
 *   <div id="hana-nav-wrap"> <!-- wraps nav bar + mega panels for mouseleave detection --> </div>
 */

(function () {
  'use strict';

  var CLOSE_DELAY = 130; // ms

  function init() {
    var navWrap = document.getElementById('hana-nav-wrap');
    if (!navWrap) return;

    var navLinks = navWrap.querySelectorAll('[data-menu]');
    var panels   = navWrap.querySelectorAll('[data-panel]');
    var closeTimer = null;

    function openPanel(name) {
      clearTimeout(closeTimer);
      panels.forEach(function (p) {
        var isTarget = p.getAttribute('data-panel') === name;
        if (isTarget) {
          p.removeAttribute('hidden');
          p.classList.add('hana-mega');
        } else {
          p.setAttribute('hidden', '');
          p.classList.remove('hana-mega');
        }
      });
      navLinks.forEach(function (l) {
        if (l.getAttribute('data-menu') === name) {
          l.classList.add('is-open');
        } else {
          l.classList.remove('is-open');
        }
      });
    }

    function closeAll() {
      closeTimer = setTimeout(function () {
        panels.forEach(function (p) {
          p.setAttribute('hidden', '');
          p.classList.remove('hana-mega');
        });
        navLinks.forEach(function (l) { l.classList.remove('is-open'); });
      }, CLOSE_DELAY);
    }

    /* Nav link hover */
    navLinks.forEach(function (link) {
      var menuName = link.getAttribute('data-menu');
      link.addEventListener('mouseenter', function () {
        openPanel(menuName);
      });
    });

    /* Keep open when hovering over a panel */
    panels.forEach(function (p) {
      var menuName = p.getAttribute('data-panel');
      p.addEventListener('mouseenter', function () {
        clearTimeout(closeTimer);
        openPanel(menuName);
      });
      p.addEventListener('mouseleave', function () {
        closeAll();
      });
    });

    /* Close when leaving the nav wrapper */
    navWrap.addEventListener('mouseleave', function () {
      closeAll();
    });

    /* Keyboard: a focused nav item opens its panel. Arrow Down (or Enter/Space on Markets, which
       has no hub page) moves into the panel; Escape closes it and returns to the nav item. Focus
       moving anywhere outside the nav items and panels closes it. */
    var quietFocus = false;   // set while Escape hands focus back, so the panel stays closed
    navLinks.forEach(function (link) {
      var menuName = link.getAttribute('data-menu');
      link.addEventListener('focus', function () { if (!quietFocus) openPanel(menuName); });
      link.addEventListener('keydown', function (e) {
        var enter = (e.key === 'Enter' || e.key === ' ') && !link.getAttribute('href');
        if (!enter && e.key !== 'ArrowDown') return;
        e.preventDefault();
        openPanel(menuName);
        var panel = navWrap.querySelector('[data-panel="' + menuName + '"]');
        var first = panel && panel.querySelector('a[href]');
        if (first) first.focus();
      });
    });
    navWrap.addEventListener('focusin', function (e) {
      if (!e.target.closest('[data-menu], [data-panel]')) closeAll();
    });
    navWrap.addEventListener('focusout', function (e) {
      if (!navWrap.contains(e.relatedTarget)) closeAll();
    });
    navWrap.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = navWrap.querySelector('[data-menu].is-open');
      clearTimeout(closeTimer);
      panels.forEach(function (p) { p.setAttribute('hidden', ''); p.classList.remove('hana-mega'); });
      navLinks.forEach(function (l) { l.classList.remove('is-open'); });
      if (open) { quietFocus = true; open.focus({ preventScroll: true }); quietFocus = false; }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());

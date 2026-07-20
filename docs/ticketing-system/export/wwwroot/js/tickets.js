/* ============================================================
   tickets.js — admin ticket list interactions (vanilla JS).
   No framework, no bundler. Handles: row expand/collapse, the
   "more actions" dropdowns, the Closed/Spam section collapses,
   and client-side filtering of the rendered rows.
   Server-side actions (Claim, Mark responded, etc.) POST to
   page handlers via their own <form> elements.
   ============================================================ */
(function () {
  'use strict';

  function closeAllMenus(except) {
    document.querySelectorAll('.dropdown.is-open').forEach(function (m) {
      if (m !== except) m.classList.remove('is-open');
    });
  }

  document.addEventListener('click', function (e) {
    var expandToggle = e.target.closest('[data-expand]');
    if (expandToggle) {
      var id = expandToggle.getAttribute('data-expand');
      var panel = document.getElementById('expand-' + id);
      var btn = document.getElementById('exp-' + id);
      if (panel) panel.classList.toggle('is-open');
      if (btn) btn.classList.toggle('is-open');
      return;
    }

    var menuBtn = e.target.closest('[data-menu]');
    if (menuBtn) {
      e.stopPropagation();
      var menu = document.getElementById('menu-' + menuBtn.getAttribute('data-menu'));
      var willOpen = menu && !menu.classList.contains('is-open');
      closeAllMenus(menu);
      if (menu) menu.classList.toggle('is-open', willOpen);
      return;
    }

    var collapse = e.target.closest('[data-collapse]');
    if (collapse) {
      var body = document.getElementById(collapse.getAttribute('data-collapse'));
      collapse.classList.toggle('is-open');
      if (body) body.classList.toggle('is-open');
      return;
    }

    // Click anywhere else closes open menus.
    if (!e.target.closest('.menu-wrap')) closeAllMenus(null);
  });

  // ── Client-side filtering over the rendered rows ──────────
  var filterBar = document.querySelector('[data-filters]');
  if (filterBar) {
    var controls = filterBar.querySelectorAll('select, input');
    controls.forEach(function (c) {
      c.addEventListener('input', applyFilters);
      c.addEventListener('change', applyFilters);
    });
  }

  function val(sel) { var el = document.querySelector(sel); return el ? el.value : ''; }

  function applyFilters() {
    var fStatus = val('[data-f="status"]');
    var fMarket = val('[data-f="market"]');
    var fService = val('[data-f="service"]');
    var fReason = val('[data-f="reason"]');
    var fOwner = val('[data-f="owner"]');
    var q = (val('[data-f="q"]') || '').trim().toLowerCase();

    document.querySelectorAll('.ticket-entry').forEach(function (entry) {
      var d = entry.dataset;
      var show = true;

      if (fStatus && fStatus !== 'All open' && fStatus !== 'Closed' && fStatus !== 'Spam') {
        if (d.status !== fStatus.toLowerCase()) show = false;
      }
      if (fMarket && fMarket !== 'All markets' && d.market !== fMarket) show = false;
      if (fService && fService !== 'All services' && d.service !== fService) show = false;
      if (fReason && fReason !== 'All reasons' && d.reason !== fReason) show = false;
      if (fOwner === 'Unassigned') { if (d.owner) show = false; }
      else if (fOwner && fOwner !== 'Anyone' && d.owner !== fOwner) show = false;
      if (q && (d.haystack || '').indexOf(q) === -1) show = false;

      entry.style.display = show ? '' : 'none';
    });
  }
})();

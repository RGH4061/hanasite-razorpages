/* ============================================================
   careers-admin.js — job listings admin (vanilla JS).
   Enhancement only: client-side filtering over the rendered rows
   and the repeatable job-board link rows. Saving is a normal
   form POST, so the page works if this script fails to load.
   ============================================================ */
(function () {
  'use strict';

  // ── Client-side filtering ─────────────────────────────────
  var filterBar = document.querySelector('[data-filters]');
  if (filterBar) {
    filterBar.querySelectorAll('select, input').forEach(function (c) {
      c.addEventListener('input', applyFilters);
      c.addEventListener('change', applyFilters);
    });
  }

  function val(sel) { var el = document.querySelector(sel); return el ? el.value : ''; }

  function applyFilters() {
    var fPlant = val('[data-f="plant"]');
    var fDept = val('[data-f="dept"]');
    var fStatus = val('[data-f="status"]');
    var q = (val('[data-f="q"]') || '').trim().toLowerCase();

    document.querySelectorAll('.job-row').forEach(function (row) {
      var d = row.dataset;
      var show = true;

      if (fPlant && fPlant !== 'All plants' && d.plant !== fPlant) show = false;
      if (fDept && fDept !== 'All departments' && d.dept !== fDept) show = false;

      if (fStatus === 'Live only' && d.status !== 'live' && d.status !== 'closing') show = false;
      else if (fStatus === 'Draft only' && d.status !== 'draft') show = false;
      else if (fStatus === 'Expired' && d.status !== 'expired') show = false;
      else if (fStatus === 'Live & draft' && d.status === 'expired') show = false;

      if (q && (d.haystack || '').indexOf(q) === -1) show = false;

      row.style.display = show ? '' : 'none';
    });
  }

  // ── Repeatable job-board link rows ────────────────────────
  var repeat = document.querySelector('[data-repeat="links"]');
  if (!repeat) return;

  var rows = repeat.querySelector('[data-repeat-rows]');

  repeat.addEventListener('click', function (e) {
    if (e.target.closest('[data-repeat-add]')) {
      var first = rows.querySelector('[data-repeat-row]');
      if (!first) return;
      var clone = first.cloneNode(true);
      clone.querySelectorAll('input').forEach(function (i) { i.value = ''; });
      rows.appendChild(clone);
      renumber();
      return;
    }
    if (e.target.closest('[data-repeat-remove]')) {
      var row = e.target.closest('[data-repeat-row]');
      if (rows.querySelectorAll('[data-repeat-row]').length > 1) {
        row.remove();
      } else {
        row.querySelectorAll('input').forEach(function (i) { i.value = ''; });
      }
      renumber();
    }
  });

  // Model binding needs contiguous indices: Input.Links[0], [1], …
  function renumber() {
    rows.querySelectorAll('[data-repeat-row]').forEach(function (row, i) {
      row.querySelectorAll('[name]').forEach(function (field) {
        field.name = field.name.replace(/Links\[\d+\]/, 'Links[' + i + ']');
      });
    });
  }
})();

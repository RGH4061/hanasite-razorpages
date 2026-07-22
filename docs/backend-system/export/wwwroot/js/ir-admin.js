/* ============================================================
   ir-admin.js — Investor Relations admin form interactions.
   Vanilla JS, no framework, no bundler (matches tickets.js).
   Handles the three form behaviours that are purely client-side:
     1. Publish now / publish at a set time toggle
     2. Repeatable attachment rows (add / remove)
     3. Show the "Period" field only for Financial Information
   The actual save is a normal <form> POST to the page handler,
   so nothing here is required for data to persist.
   ============================================================ */
(function () {
  'use strict';

  // ── 1. Publish now / schedule ─────────────────────────────
  function wirePublishChoice() {
    var opts = document.querySelectorAll('[data-pub-opt]');
    if (!opts.length) return;
    var goLive = document.getElementById('ir-golive-field');
    var hidden = document.getElementById('ir-publish-mode');

    opts.forEach(function (opt) {
      opt.addEventListener('click', function () {
        opts.forEach(function (o) { o.classList.remove('is-on'); });
        opt.classList.add('is-on');
        var mode = opt.getAttribute('data-pub-opt'); // "now" | "later"
        if (hidden) hidden.value = mode;
        if (goLive) goLive.classList.toggle('is-hidden', mode !== 'later');
      });
    });
  }

  // ── 2. Repeatable rows (attachments, job-board links) ─────
  function wireRepeatables() {
    document.querySelectorAll('[data-repeat]').forEach(function (group) {
      var rows = group.querySelector('[data-repeat-rows]');
      var tmpl = group.querySelector('template[data-repeat-tmpl]');
      var addBtn = group.querySelector('[data-repeat-add]');

      function renumber() {
        rows.querySelectorAll('[data-repeat-row]').forEach(function (row, i) {
          row.querySelectorAll('[name]').forEach(function (field) {
            // Rewrite indexed names: Attachments[0].Label -> Attachments[i].Label
            field.name = field.name.replace(/\[\d+\]/, '[' + i + ']');
          });
        });
      }

      if (addBtn && tmpl) {
        addBtn.addEventListener('click', function () {
          var frag = tmpl.content.cloneNode(true);
          rows.appendChild(frag);
          renumber();
        });
      }

      rows.addEventListener('click', function (e) {
        var rm = e.target.closest('[data-repeat-rm]');
        if (!rm) return;
        var all = rows.querySelectorAll('[data-repeat-row]');
        if (all.length > 1) {
          rm.closest('[data-repeat-row]').remove();
        } else {
          // Keep one empty row rather than removing the last
          all[0].querySelectorAll('input').forEach(function (i) { i.value = ''; });
        }
        renumber();
      });

      // Reflect the chosen file name into the label affordance
      rows.addEventListener('change', function (e) {
        var file = e.target.closest('input[type="file"]');
        if (!file) return;
        var face = file.closest('[data-repeat-row]').querySelector('[data-file-face]');
        if (face && file.files && file.files.length) {
          face.textContent = file.files[0].name;
          face.classList.add('has-file');
        }
      });
    });
  }

  // ── 3. Period field only for Financial Information ────────
  function wirePeriodField() {
    var typeSel = document.getElementById('ir-news-type');
    var period = document.getElementById('ir-period-field');
    if (!typeSel || !period) return;
    function sync() { period.style.display = typeSel.value === 'fin' ? '' : 'none'; }
    typeSel.addEventListener('change', sync);
    sync();
  }

  document.addEventListener('DOMContentLoaded', function () {
    wirePublishChoice();
    wireRepeatables();
    wirePeriodField();
  });
})();

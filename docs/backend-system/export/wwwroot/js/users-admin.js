/* ============================================================
   users-admin.js — user management interactions (vanilla JS).
   Enhancement only: every action on the page is a normal form
   POST that works with JavaScript disabled. Handles the invite
   card open/close, row expand/collapse (same pattern as
   tickets.js), the tick dependencies, and the deactivate
   confirmation.
   ============================================================ */
(function () {
  'use strict';

  var card = document.getElementById('invite-card');

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-invite-open]')) { if (card) card.classList.add('is-open'); return; }
    if (e.target.closest('[data-invite-close]')) { if (card) card.classList.remove('is-open'); return; }

    var toggle = e.target.closest('[data-expand]');
    if (toggle) {
      var id = toggle.getAttribute('data-expand');
      var panel = document.getElementById('expand-' + id);
      var btn = document.getElementById('exp-' + id);
      if (panel) {
        var open = panel.classList.toggle('is-open');
        if (btn) btn.textContent = open ? 'Close' : 'Expand';
      }
    }
  });

  // Keyboard equivalent for the clickable row.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var row = e.target.closest('.user-row[data-expand]');
    if (!row) return;
    e.preventDefault();
    row.click();
  });

  // Tick dependencies: approver implies Insights; dropping Insights drops the
  // approver tick; SuperAdmin reaches everything, so the section ticks go
  // read-only while it is held.
  document.addEventListener('change', function (e) {
    var input = e.target;
    if (!input.matches('[data-tick]')) return;
    var group = input.closest('[data-ticks]');
    if (!group) return;

    var insights = group.querySelector('[data-tick="section"][value="insights"]');
    var approver = group.querySelector('[data-tick="approver"]');
    var superTick = group.querySelector('[data-tick="super"]');
    var kind = input.getAttribute('data-tick');

    if (kind === 'approver' && input.checked && insights) insights.checked = true;
    if (kind === 'section' && input.value === 'insights' && !input.checked && approver) approver.checked = false;

    if (kind === 'super' && superTick) {
      var on = superTick.checked;
      group.querySelectorAll('[data-tick="section"], [data-tick="approver"]').forEach(function (t) {
        t.disabled = on;
        if (on) t.checked = true;
      });
      if (on && approver) approver.checked = false;
    }
  });

  // Confirm before deactivating, naming the person.
  document.addEventListener('submit', function (e) {
    var msg = e.target.getAttribute('data-confirm');
    if (msg && !window.confirm(msg)) e.preventDefault();
  });
})();

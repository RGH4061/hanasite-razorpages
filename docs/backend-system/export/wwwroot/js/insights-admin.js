/* insights-admin.js — enhancement only.
   Everything here has a server equivalent: the filters narrow rows that are
   already rendered, the checklist groups are <details>, the FAQ / entity /
   source rows post as arrays, and the publish gate is enforced again in
   ArticleFormModel.OnPost. With JS off the page still works: the body is a
   plain textarea, and Save / Send for review / Approve are normal submits.
   Vanilla JS only — no framework, no bundler. */
(function () {
  'use strict';

  /* ── List filters ─────────────────────────────────────── */
  function initFilters() {
    var bar = document.getElementById('ins-filters');
    var list = document.getElementById('ins-list');
    if (!bar || !list) return;

    var rows = Array.prototype.slice.call(list.querySelectorAll('.ins-row'));
    var out = document.getElementById('ins-count');
    var none = document.getElementById('ins-noresults');
    var clear = document.getElementById('ins-f-clear');
    var controls = Array.prototype.slice.call(bar.querySelectorAll('[data-filter]'));

    function apply() {
      var want = {};
      controls.forEach(function (c) { want[c.getAttribute('data-filter')] = (c.value || '').trim().toLowerCase(); });
      var shown = 0;

      rows.forEach(function (row) {
        var ok = true;
        if (want.status && row.getAttribute('data-status') !== want.status) ok = false;
        if (ok && want.category && (row.getAttribute('data-category') || '').toLowerCase() !== want.category) ok = false;
        if (ok && want.author && (row.getAttribute('data-author') || '').toLowerCase() !== want.author) ok = false;
        if (ok && want.q && (row.getAttribute('data-haystack') || '').indexOf(want.q) < 0) ok = false;
        row.hidden = !ok;
        if (ok) shown++;
      });

      if (out) out.textContent = shown + ' of ' + rows.length + ' articles';
      if (none) none.hidden = shown !== 0 || rows.length === 0;
      var active = controls.some(function (c) { return (c.value || '').length > 0; });
      if (clear) clear.hidden = !active;
    }

    controls.forEach(function (c) {
      c.addEventListener('change', apply);
      c.addEventListener('input', apply);
    });
    if (clear) clear.addEventListener('click', function () {
      controls.forEach(function (c) { c.value = ''; });
      apply();
    });
    apply();
  }

  /* ── Rich-text surface over the bound textarea ─────────── */
  function initBodyEditor() {
    var source = document.getElementById('ins-body-source');
    var surface = document.getElementById('ins-body-surface');
    var toolbar = document.getElementById('ins-toolbar');
    if (!source || !surface || !toolbar) return;

    surface.innerHTML = source.value;
    surface.hidden = false;
    toolbar.hidden = false;
    source.hidden = true;

    function sync() {
      source.value = surface.innerHTML;
      updateWordMeter();
    }

    surface.addEventListener('input', sync);
    document.getElementById('ins-form').addEventListener('submit', sync);

    Array.prototype.forEach.call(toolbar.querySelectorAll('.ins-tool'), function (btn) {
      btn.addEventListener('click', function () {
        var cmd = btn.getAttribute('data-cmd');
        var arg = btn.getAttribute('data-arg');
        surface.focus();
        if (cmd === 'createLink') {
          var url = window.prompt('Link to');
          if (!url) return;
          document.execCommand('createLink', false, url);
        } else if (cmd === 'formatBlock') {
          document.execCommand('formatBlock', false, '<' + arg + '>');
        } else {
          document.execCommand(cmd, false, null);
        }
        sync();
      });
    });

    updateWordMeter();
  }

  function words(text) {
    var t = (text || '').replace(/\s+/g, ' ').trim();
    return t ? t.split(' ').length : 0;
  }

  /* Word count excludes the FAQ and Sources zones, as the server does. */
  function bodyWords() {
    var surface = document.getElementById('ins-body-surface');
    var source = document.getElementById('ins-body-source');
    var html = surface && !surface.hidden ? surface.innerHTML : (source ? source.value : '');
    var probe = document.createElement('div');
    probe.innerHTML = html;
    var total = 0, zone = 'body';
    Array.prototype.forEach.call(probe.children, function (n) {
      var tag = n.tagName.toLowerCase();
      var text = n.textContent || '';
      if (tag === 'h2') {
        var t = text.trim().toLowerCase();
        if (/^(faq|frequently asked questions)/.test(t)) { zone = 'faq'; return; }
        if (/^sources?$/.test(t)) { zone = 'sources'; return; }
        zone = 'body';
      }
      if (zone === 'body') total += words(text);
    });
    return total;
  }

  function updateWordMeter() {
    var meter = document.getElementById('ins-wordmeter');
    if (!meter) return;
    var type = document.getElementById('ins-contenttype');
    var min = parseInt(meter.getAttribute('data-min'), 10);
    var max = parseInt(meter.getAttribute('data-max'), 10);
    var label = meter.getAttribute('data-type');

    if (type && type.selectedIndex >= 0) {
      var opt = type.options[type.selectedIndex];
      min = parseInt(opt.getAttribute('data-min'), 10) || min;
      max = parseInt(opt.getAttribute('data-max'), 10) || max;
      label = type.value;
    }

    var n = bodyWords();
    meter.textContent = n + ' words · ' + min.toLocaleString() + '–' + max.toLocaleString() + ' for ' + label;
    meter.classList.toggle('is-ok', n >= min && n <= max);
    meter.classList.toggle('is-warn', !(n >= min && n <= max));
  }

  /* ── Character counters ───────────────────────────────── */
  function initCounters() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-counter]'), function (field) {
      var max = parseInt(field.getAttribute('data-counter'), 10);
      var out = field.parentNode.querySelector('[data-counter-out]');
      if (!out) return;
      var min = max === 60 ? 35 : 120;

      function paint() {
        var n = (field.value || '').length;
        out.textContent = n + '/' + max;
        out.classList.toggle('is-over', n > max);
        out.classList.toggle('is-short', n > 0 && n < min);
        out.classList.toggle('is-ok', n >= min && n <= max);
      }
      field.addEventListener('input', paint);
      paint();
    });
  }

  /* ── Word counters on FAQ answers ─────────────────────── */
  function initWordCounts() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-wordcount]'), function (field) {
      var max = parseInt(field.getAttribute('data-wordcount'), 10);
      var row = field.closest('[data-row]');
      var out = row ? row.querySelector('[data-wordcount-out]') : null;
      if (!out) return;
      function paint() {
        var n = words(field.value);
        out.textContent = n + ' of ' + max + ' words';
        out.classList.toggle('is-over', n > max);
      }
      field.addEventListener('input', paint);
      paint();
    });
  }

  /* ── Repeatable rows: add / remove + reindex ───────────── */
  function reindex(container) {
    var rows = container.querySelectorAll('[data-row]');
    Array.prototype.forEach.call(rows, function (row, i) {
      Array.prototype.forEach.call(row.querySelectorAll('[name]'), function (field) {
        field.name = field.name.replace(/\[\d+\]/, '[' + i + ']');
      });
      var n = row.querySelector('.ins-faq-n');
      if (n) n.textContent = String(i + 1);
    });
  }

  function initRepeatables() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-add]'), function (btn) {
      btn.addEventListener('click', function () {
        var container = document.querySelector(btn.getAttribute('data-add'));
        if (!container) return;
        var rows = container.querySelectorAll('[data-row]');
        if (!rows.length) return;
        var copy = rows[rows.length - 1].cloneNode(true);
        Array.prototype.forEach.call(copy.querySelectorAll('input, textarea'), function (f) { f.value = ''; });
        container.appendChild(copy);
        reindex(container);
        initWordCounts();
      });
    });

    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-remove]') : null;
      if (!btn) return;
      var row = btn.closest('[data-row]');
      if (!row) return;
      var container = row.parentNode;
      row.parentNode.removeChild(row);
      reindex(container);
    });
  }

  /* ── Small editor conveniences ────────────────────────── */
  function initForm() {
    var title = document.getElementById('Input_Title');
    var echo = document.getElementById('ins-title-echo');
    if (title && echo) {
      title.addEventListener('input', function () {
        echo.textContent = title.value || 'Untitled insight';
      });
    }

    var slugBtn = document.getElementById('ins-slug-from-title');
    var slug = document.getElementById('Input_Slug');
    if (slugBtn && slug && title) {
      slugBtn.addEventListener('click', function () {
        var stop = ['a', 'an', 'the', 'and', 'of', 'for', 'to', 'in'];
        slug.value = (title.value || '').toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim().split(/\s+/)
          .filter(function (w) { return w && stop.indexOf(w) < 0; })
          .slice(0, 7).join('-');
      });
    }

    var timing = document.getElementById('ins-timing');
    var schedule = document.getElementById('ins-schedule-field');
    if (timing && schedule) {
      function paint() { schedule.hidden = timing.value !== 'date'; }
      timing.addEventListener('change', paint);
      paint();
    }

    var type = document.getElementById('ins-contenttype');
    if (type) type.addEventListener('change', updateWordMeter);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initFilters();
    initBodyEditor();
    initCounters();
    initWordCounts();
    initRepeatables();
    initForm();
  });
})();

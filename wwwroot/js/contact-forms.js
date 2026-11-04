/* contact-forms.js — chip counts, reCAPTCHA gate, file list, field validation,
   Contact page tabs and copy button, demo submit.
   Replace the submit handler with a real Razor Pages OnPost / fetch when wiring
   the backend. Pure vanilla, no framework. */
(function () {
  function updateCounts() {
    document.querySelectorAll('details.cf-ms').forEach(function (d) {
      var n = d.querySelectorAll('input:checked').length;
      var c = d.querySelector('.chip-count');
      if (c) { c.textContent = n; c.style.display = n ? '' : 'none'; }
    });
  }
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('details.cf-ms input[type=checkbox]')) updateCounts();
    if (t.matches('.cf-recaptcha input[type=checkbox]')) {
      var form = t.closest('form'); var btn = form && form.querySelector('.cf-btn-submit');
      if (btn) { btn.disabled = !t.checked; btn.style.opacity = t.checked ? '' : '0.5'; btn.style.cursor = t.checked ? '' : 'not-allowed'; }
    }
    if (t.matches('.cf-upload input[type=file]')) {
      var field = t.closest('.cf-field'); var list = field && field.querySelector('.cf-filelist');
      var MAX_BYTES = 10 * 1024 * 1024, ALLOWED = ['.pdf', '.zip'];
      var dt = new DataTransfer(); var rejected = [];
      Array.prototype.forEach.call(t.files, function (f) {
        var ext = '.' + f.name.split('.').pop().toLowerCase();
        var okType = ALLOWED.indexOf(ext) !== -1;
        var okSize = f.size <= MAX_BYTES;
        if (okType && okSize) { dt.items.add(f); }
        else { rejected.push(f.name + (!okType ? ' \u2014 only PDF or ZIP allowed' : ' \u2014 exceeds 10\u00a0MB')); }
      });
      t.files = dt.files;
      if (list) {
        list.innerHTML = '';
        Array.prototype.forEach.call(t.files, function (f) {
          var s = document.createElement('span'); s.className = 'cf-filechip'; s.textContent = '\u203a ' + f.name; list.appendChild(s);
        });
        if (rejected.length) {
          var err = document.createElement('div'); err.className = 'cf-file-error';
          err.style.cssText = 'font-size:12px;color:var(--danger,#B42318);margin-top:8px;';
          err.textContent = 'Not attached: ' + rejected.join('; ');
          list.appendChild(err);
        }
      }
    }
  });
  /* ---- Field validation (forms carry novalidate so these messages replace the browser's) ---- */
  /* Messages follow the page language (<html lang="th"> on /th/ pages). */
  var TH = /^th/i.test(document.documentElement.lang || '');
  var MSG = TH ? {
    choose: 'กรุณาเลือก 1 รายการ',
    fill: 'กรุณากรอกข้อมูลในช่องนี้',
    email: 'กรุณากรอกอีเมลให้ถูกต้อง เช่น name@company.com',
    check: 'กรุณาตรวจสอบข้อมูลในช่องนี้',
    copied: 'คัดลอกแล้ว',
    copyFailed: 'คัดลอกไม่สำเร็จ'
  } : {
    choose: 'Please choose an option.',
    fill: 'Please fill in this field.',
    email: 'Enter a valid email address, such as name@company.com.',
    check: 'Please check this field.',
    copied: 'Copied',
    copyFailed: 'Copy failed'
  };
  function fieldMessage(el) {
    var blank = el.required && !String(el.value || '').trim();
    if (blank) return el.tagName === 'SELECT' ? MSG.choose : MSG.fill;
    if (el.validity.typeMismatch && el.type === 'email') return MSG.email;
    if (!el.checkValidity()) return MSG.check;
    return null;
  }
  function setError(el, msg) {
    var field = el.closest('.cf-field'); if (!field) return;
    var id = (el.id || el.name) + '-error';
    var p = field.querySelector('.cf-field-error');
    if (msg) {
      if (!p) { p = document.createElement('p'); p.className = 'cf-field-error'; p.id = id; field.appendChild(p); }
      p.textContent = msg;
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', id);
    } else {
      if (p) p.remove();
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
    }
  }
  function validate(form) {
    var first = null;
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      if (el.type === 'checkbox' || el.type === 'file' || el.type === 'hidden') return;
      var msg = fieldMessage(el);
      setError(el, msg);
      if (msg && !first) first = el;
    });
    if (first) first.focus();
    return !first;
  }
  ['input', 'change'].forEach(function (type) {
    document.addEventListener(type, function (e) {
      var el = e.target;
      if (el.getAttribute && el.getAttribute('aria-invalid') === 'true' && !fieldMessage(el)) setError(el, null);
    });
  });

  document.querySelectorAll('form.cf-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();   // demo: show success. Wire to a server handler for production.
      if (!validate(form)) return;
      var card = form.closest('.cf-card');
      var ok = card && card.querySelector('.cf-success');
      if (ok) {
        form.style.display = 'none'; var rn = card.querySelector('.cf-required-note'); if (rn) rn.style.display = 'none'; ok.hidden = false;
        var top = card.getBoundingClientRect().top;
        if (top < 0 || top > window.innerHeight * 0.6) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- Tabs (Contact page "Other inquiries"); #panel-id in the URL opens that tab ---- */
  document.querySelectorAll('[data-tabs]').forEach(function (tabs) {
    var btns = Array.prototype.slice.call(tabs.querySelectorAll('[role="tab"]'));
    function select(btn, focus) {
      btns.forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(b.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) btn.focus();
    }
    function fromHash() {
      var id = location.hash.slice(1); if (!id) return;
      var btn = btns.filter(function (b) { return b.getAttribute('aria-controls') === id; })[0];
      if (btn) { select(btn); tabs.closest('section').scrollIntoView({ block: 'start' }); }
    }
    tabs.classList.add('is-ready');
    select(btns.filter(function (b) { return b.getAttribute('aria-selected') === 'true'; })[0] || btns[0]);
    fromHash();
    window.addEventListener('hashchange', fromHash);
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        select(b);
        if (history.replaceState) history.replaceState(null, '', '#' + b.getAttribute('aria-controls'));
      });
      b.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = btns[(i + 1) % btns.length];
        else if (e.key === 'ArrowLeft') n = btns[(i - 1 + btns.length) % btns.length];
        else if (e.key === 'Home') n = btns[0];
        else if (e.key === 'End') n = btns[btns.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  /* ---- Copy email address ---- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    var label = btn.textContent;
    btn.addEventListener('click', function () {
      var done = function (msg) { btn.textContent = msg; setTimeout(function () { btn.textContent = label; }, 2000); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () { done(MSG.copied); }, function () { done(MSG.copyFailed); });
      } else { done(MSG.copyFailed); }
    });
  });

  updateCounts();
})();

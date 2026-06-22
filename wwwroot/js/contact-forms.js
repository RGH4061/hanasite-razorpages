/* contact-forms.js — chip counts, reCAPTCHA gate, file list, demo submit.
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
      if (list) { list.innerHTML = ''; Array.prototype.forEach.call(t.files, function (f) {
        var s = document.createElement('span'); s.className = 'cf-filechip'; s.textContent = '\u203a ' + f.name; list.appendChild(s);
      }); }
    }
  });
  document.querySelectorAll('form.cf-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();   // demo: show success. Wire to a server handler for production.
      var card = form.closest('.cf-card');
      var ok = card && card.querySelector('.cf-success');
      if (ok) { form.style.display = 'none'; var rn = card.querySelector('.cf-required-note'); if (rn) rn.style.display = 'none'; ok.hidden = false; }
    });
  });
  updateCounts();
})();

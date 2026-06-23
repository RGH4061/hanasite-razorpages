/* automotive.js — FAQ accordion for the Automotive market + sub-market pages.
   Click a question to expand; first item starts open (markup sets .is-open). */
(function () {
  function init() {
    document.querySelectorAll('.auto-faq').forEach(function (faq) {
      faq.addEventListener('click', function (e) {
        var btn = e.target.closest('button.q');
        if (!btn) return;
        var item = btn.closest('.item');
        var open = item.classList.contains('is-open');
        faq.querySelectorAll('.item').forEach(function (it) { it.classList.remove('is-open'); });
        if (!open) item.classList.add('is-open');
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

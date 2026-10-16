/* automotive.js — FAQ accordion + collapsible component rail for the
   Automotive market + sub-market pages. Click a question to expand
   (first item starts open via .is-open); the rail toggle collapses
   the far-left "Automotive components" sidebar. */
(function () {
  function init() {
    document.querySelectorAll('.side-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var grid = btn.closest('.auto-spoke-grid');
        if (!grid) return;
        var collapsed = grid.classList.toggle('is-collapsed');
        btn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
      });
    });
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

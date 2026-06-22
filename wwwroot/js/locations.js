/* ============================================================================
   locations.js — horizontal card carousels (plant pages + hub).
   Wires prev/next buttons to the nearest [data-scroller] inside a
   [data-carousel] section, and disables buttons at the ends.
   No framework — auto-inits on load.
   ========================================================================== */
(function () {
  function wire(scroller) {
    var sec = scroller.closest('[data-carousel]');
    if (!sec) return;
    var prev = sec.querySelector('[data-scroll-prev]');
    var next = sec.querySelector('[data-scroll-next]');
    function update() {
      var atStart = scroller.scrollLeft <= 2;
      var atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2;
      if (prev) { prev.disabled = atStart; prev.style.opacity = atStart ? 0.35 : 1; }
      if (next) { next.disabled = atEnd; next.style.opacity = atEnd ? 0.35 : 1; }
    }
    function go(dir) { scroller.scrollBy({ left: dir * scroller.clientWidth * 0.85, behavior: 'smooth' }); }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    scroller.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    update();
  }
  function init() { document.querySelectorAll('[data-scroller]').forEach(wire); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

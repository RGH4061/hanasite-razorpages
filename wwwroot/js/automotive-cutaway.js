/* automotive-cutaway.js — hovering or focusing a "Parts we produce" item highlights its marker
   on the vehicle. Markers with data-fam="n" (the small sensor-location dots) light up with item n. */
(function () {
  function init() {
    document.querySelectorAll('.auto-cutaway').forEach(function (root) {
      var markers = Array.prototype.slice.call(root.querySelectorAll('.auto-marker'));
      var items = Array.prototype.slice.call(root.querySelectorAll('.auto-legitem'));
      function num(el, sel) { var t = (el.querySelector(sel) || {}).textContent || ''; return t.trim(); }
      items.forEach(function (item) {
        var n = num(item, '.n');
        var ms = markers.filter(function (mk) { return num(mk, '.dot') === n || mk.getAttribute('data-fam') === n; });
        if (!ms.length) return;
        function on() { ms.forEach(function (m) { m.classList.add('is-active'); }); item.classList.add('is-active'); }
        function off() { ms.forEach(function (m) { m.classList.remove('is-active'); }); item.classList.remove('is-active'); }
        item.addEventListener('mouseenter', on); item.addEventListener('mouseleave', off);
        item.addEventListener('focus', on); item.addEventListener('blur', off);
        item.setAttribute('tabindex', '0');
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

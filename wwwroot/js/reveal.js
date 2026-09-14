/* reveal.js — homepage scroll-triggered entrance animations.
   Pairs with the .hrv / .hrw-* CSS in _Homepage_Hero.cshtml.

   [data-reveal-root]        fires once when the wrapper scrolls into view
   [data-reveal-hold="ms"]   on a root: if the page has not been scrolled yet, wait until
                             ms after load (lets the hero entrance finish first)
   [data-stagger="base,step"] auto-applies .hrv + an incrementing --d to direct children
   [data-reveal-after="#id"] + [data-reveal-gap="ms"]  chain a root behind another root

   Roots already scrolled past on load reveal immediately, so nothing can render blank. */
(function () {
  var st = document.querySelectorAll('[data-stagger]');
  Array.prototype.forEach.call(st, function (c) {
    var p = (c.getAttribute('data-stagger') || '0,60').split(','),
        b = parseInt(p[0], 10) || 0,
        s = parseInt(p[1], 10) || 60;
    Array.prototype.forEach.call(c.children, function (el, i) {
      el.classList.add('hrv');
      el.style.setProperty('--d', (b + i * s) + 'ms');
    });
  });

  var rs = document.querySelectorAll('[data-reveal-root]');
  if (!rs.length) return;
  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(rs, function (r) { r.classList.add('rv-on'); });
    return;
  }

  function fire(t, tries) {
    tries = tries || 0;
    var hold = parseInt(t.getAttribute('data-reveal-hold'), 10) || 0,
        sel  = t.getAttribute('data-reveal-after'),
        dep  = sel && document.querySelector(sel);
    if (dep && dep.getBoundingClientRect().bottom < 0) {
      dep.classList.add('rv-on');
      return t.classList.add('rv-on');
    }
    if (dep && !dep.classList.contains('rv-on')) {
      if (tries < 9) { return setTimeout(function () { fire(t, tries + 1); }, 140); }
      return t.classList.add('rv-on');
    }
    var wait = dep ? (parseInt(t.getAttribute('data-reveal-gap'), 10) || 0)
                   : ((hold && window.scrollY < 60) ? Math.max(0, hold - (performance.now() || 0)) : 0);
    wait > 0 ? setTimeout(function () { t.classList.add('rv-on'); }, wait)
             : t.classList.add('rv-on');
  }

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { var t = e.target; io.unobserve(t); fire(t); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });

  Array.prototype.forEach.call(rs, function (r) {
    if (r.getBoundingClientRect().bottom < 0) { r.classList.add('rv-on'); }
    else { io.observe(r); }
  });
})();

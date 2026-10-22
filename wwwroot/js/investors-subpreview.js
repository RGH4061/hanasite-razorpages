/* investors-subpreview.js — PREVIEW ONLY (pairs with css/investors-subpreview.css). Loaded by
   _Layout on /investor-relations/* subpages when ?irs=a|b|c is set. Adds the Flow backgrounds
   the mock-ups use: the Hana-blue Flow card for the closing call-to-action on every variant, and
   the hub's light Flow lines behind the body on b and c. Remove once a direction is chosen. */
(function () {
  if (!window.HanaBG) return;
  var html = document.documentElement;
  // Annual Reports has no .layout-bg wrapper around .layout; add one so every subpage has the same body band
  var lay = document.querySelector('.layout');
  if (lay && !lay.closest('.layout-bg')) {
    var wrap = document.createElement('div');
    wrap.className = 'layout-bg';
    lay.parentNode.insertBefore(wrap, lay);
    wrap.appendChild(lay);
  }
  var end = document.querySelector('.page-end');
  if (end) window.HanaBG.apply(end, { pattern: 'flow', variant: 'dark', accent: '', fade: 'none' });
  if (html.classList.contains('irs-b') || html.classList.contains('irs-c')) {
    var body = document.querySelector('.layout-bg');
    if (body) window.HanaBG.apply(body, { pattern: 'flow', variant: 'light', accent: 'cyan', fade: 'none' });
  }
  // keep the links inside the preview, so moving between subpages keeps the same variant
  var v = (location.search.match(/[?&]irs=([abc])/) || [])[1];
  if (v) Array.prototype.forEach.call(document.querySelectorAll('a[href^="/investor-relations/"]'), function (a) {
    if (a.getAttribute('href').indexOf('irs=') === -1) a.setAttribute('href', a.getAttribute('href').replace(/(#|$)/, (a.getAttribute('href').indexOf('?') > -1 ? '&' : '?') + 'irs=' + v + '$1'));
  });
})();

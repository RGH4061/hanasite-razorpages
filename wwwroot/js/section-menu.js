/* Section menus on phones and tablets (22 Oct 2026).
   One fold behaviour for the Markets and Automotive side menus (≤980px), the Capabilities
   selector (≤900px) and the header menu accordion: the list slides open and closed under a
   bar that stays where it is. Desktop rails are left to market-sidebar.js / automotive.js. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var stacked = window.matchMedia('(max-width: 980px)');

  /* Slide el's height open (from 0) or closed (to 0). Open: make el visible first. */
  function fold(el, open, done) {
    if (!el.animate || reduce.matches) { if (done) done(); return; }
    var h = el.scrollHeight;
    el.style.overflow = 'hidden';
    var frames = [{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }];
    var a = el.animate(open ? frames : frames.slice().reverse(), { duration: 220, easing: 'cubic-bezier(.2,.7,.2,1)' });
    a.onfinish = a.oncancel = function () { el.style.overflow = ''; if (done) done(); };
  }
  window.hanaFold = fold;

  /* Markets and Automotive side menus. Stacked (≤980px) they start folded; .is-expanded opens
     them. The desktop rail keeps its own .is-collapsed state, so the two never interfere. */
  function initSide(grid) {
    var side = grid.querySelector(':scope > .mk-side, :scope > .auto-side');
    var head = side && side.querySelector('.side-head');
    var tog = head && head.querySelector('button');
    if (!tog || side.querySelector('.side-body')) return;
    var body = document.createElement('div');
    body.className = 'side-body';
    while (head.nextSibling) body.appendChild(head.nextSibling);
    side.appendChild(body);

    function label() {
      if (!stacked.matches) return;
      var open = grid.classList.contains('is-expanded');
      tog.setAttribute('aria-expanded', String(open));
      tog.setAttribute('aria-label', open ? 'Hide menu' : 'Show menu');
    }
    label();
    stacked.addEventListener('change', function () {
      if (stacked.matches) label();
      else {
        tog.removeAttribute('aria-expanded');
        tog.setAttribute('aria-label', grid.classList.contains('is-collapsed') ? 'Expand sidebar' : 'Collapse sidebar');
      }
    });

    /* Capture on the bar so the whole bar is the tap target and the desktop handler on the
       button does not also run. */
    head.addEventListener('click', function (e) {
      if (!stacked.matches) return;
      e.preventDefault();
      e.stopPropagation();
      if (grid.classList.contains('is-expanded')) {
        grid.classList.remove('is-expanded');
        body.style.display = 'block';
        fold(body, false, function () { body.style.display = ''; });
      } else {
        grid.classList.add('is-expanded');
        fold(body, true);
      }
      label();
    }, true);
  }

  /* Capabilities selector (<details>): slide instead of snapping open and shut. */
  function initCapNav(d) {
    var sum = d.querySelector('summary');
    var list = d.querySelector('.cap-mobnav-list');
    if (!sum || !list) return;
    sum.addEventListener('click', function (e) {
      if (!list.animate || reduce.matches) return;
      e.preventDefault();
      if (d.open) {
        d.classList.add('is-closing');
        fold(list, false, function () { d.open = false; d.classList.remove('is-closing'); });
      } else {
        d.open = true;
        fold(list, true);
      }
    });
  }

  function init() {
    document.querySelectorAll('.mk-spoke-grid, .auto-spoke-grid').forEach(initSide);
    document.querySelectorAll('details.cap-mobnav').forEach(initCapNav);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

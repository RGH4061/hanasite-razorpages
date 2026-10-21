/* motion.js — site-wide entrance motion. Pairs with css/motion.css.

   A page opts in with ViewData["Motion"] = "<profile>", which the layout writes to
   <html data-motion="...">. The profile picks the tagging rules below, so pages need no
   per-element markup. Tags:
     data-m          element rises in when it enters the viewport
     data-m="img"    image settles in (fade + 103% → 100%)
     .m-words        page title, revealed word by word (English only; Thai has no spaces,
                     so Thai titles rise as one line)
   Each element animates once. Elements already on screen at load animate straight away. */
(function () {
  var html = document.documentElement;
  var profile = html.getAttribute('data-motion');
  function done() { html.classList.remove('m-pre'); }
  if (!profile || !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) { done(); return; }

  var STEP = 70, MAX_STEPS = 5;   // stagger gap, and the cap so long grids do not drag

  function tagged(el) { return el.closest('[data-m], .m-words'); }
  function tag(el, delay, kind) {
    if (!el || el.tagName === 'STYLE' || el.tagName === 'SCRIPT' || tagged(el)) return;
    el.setAttribute('data-m', kind || '');
    if (delay) el.style.setProperty('--m-d', delay + 'ms');
  }
  function stagger(container, step, base) {
    if (!container) return;
    var kids = Array.prototype.filter.call(container.children, function (c) {
      return c.tagName !== 'STYLE' && c.tagName !== 'SCRIPT';
    });
    kids.forEach(function (c, i) { tag(c, (base || 0) + Math.min(i, MAX_STEPS) * (step || STEP)); });
  }
  function words(h) {
    if (!h || tagged(h)) return;
    if ((html.lang || '').indexOf('th') === 0) { tag(h); return; }
    var i = 0;
    (function split(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span');
            w.className = 'm-w';
            w.style.setProperty('--m-d', (i++ * 50) + 'ms');
            w.textContent = part;
            frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') {
          split(n);
        }
      });
    })(h);
    h.classList.add('m-words');
  }

  var PROFILES = {
    // Capability sub-pages (Pages/Capabilities/*): hero, then each .cap-section in turn
    capability: function (main) {
      var hero = main.querySelector('.cap-section--hero');
      if (hero) {
        var inner = hero.firstElementChild;
        words(inner && inner.querySelector('h1'));
        if (inner) Array.prototype.forEach.call(inner.children, function (c, i) {
          if (c.tagName !== 'H1') tag(c, 120 + i * 80);
        });
      }
      Array.prototype.forEach.call(main.querySelectorAll('.cap-section:not(.cap-section--hero)'), function (sec) {
        var h2 = sec.querySelector('h2');
        var head = h2 && h2.parentElement;
        if (head && head !== sec && head.children.length <= 4) stagger(head, 60);
        else tag(h2);
        Array.prototype.forEach.call(sec.querySelectorAll('.why-grid img'), function (img) { tag(img, 0, 'img'); });
        Array.prototype.forEach.call(sec.querySelectorAll('.sc-stack'), function (g) { stagger(g, 110); });
        Array.prototype.forEach.call(sec.querySelectorAll('.why-grid, .cap-grid-4, .cap-grid-3, .cap-grid-2s, .cap-row-2'), function (g) { stagger(g); });
        // FAQ list and anything else left in the section rise as blocks
        var body = head && head.parentElement;
        if (body) Array.prototype.forEach.call(body.children, function (c) {
          if (c !== head && !c.querySelector('[data-m]') && !c.hasAttribute('data-m')) {
            if (c.children.length > 2 && c.querySelector('details, .sc-faq-q, .sc-faq-a')) stagger(c, 50);
            else tag(c);
          }
        });
      });
    }
  };

  var main = document.getElementById('main-content');
  var run = PROFILES[profile];
  if (!main || !run) { done(); return; }
  run(main);
  html.classList.add('m-on');
  done();

  var targets = main.querySelectorAll('[data-m], .m-words');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('m-in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  Array.prototype.forEach.call(targets, function (t) { io.observe(t); });
})();

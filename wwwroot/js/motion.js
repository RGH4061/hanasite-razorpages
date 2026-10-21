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

  // Never animated: side menus, breadcrumbs, the Automotive cutaway, heroes that already
  // animate (Markets hub), and canvases
  var SKIP = 'aside, .mk-crumbbar, .auto-crumb, .auto-cutaway, .mkt-hero, .mkt-orbit, .mkt-hero-bg, canvas';
  function tagged(el) { return el.closest('[data-m], .m-words'); }
  function tag(el, delay, kind) {
    if (!el || el.tagName === 'STYLE' || el.tagName === 'SCRIPT' || tagged(el) || el.closest(SKIP)) return;
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

  function each(root, sel, fn) { Array.prototype.forEach.call(root.querySelectorAll(sel), fn); }

  // Page title word by word, then the elements beside it in turn. A title that already
  // animates (the Markets hub's .hha wipe) is left alone, and so is its hero.
  function hero(h1) {
    if (!h1 || h1.querySelector('.hha-line, .hha-in')) return;
    words(h1);
    Array.prototype.forEach.call(h1.parentElement.children, function (c, i) {
      if (c !== h1) tag(c, 120 + i * 80);
    });
  }

  // A content section: its heading block (label, h2, intro) rises in steps, then its grids
  // stagger, then anything left (FAQ lists stagger, other blocks rise whole).
  function section(sec, grids, imgs) {
    if (sec.querySelector('h1') || sec.querySelector(SKIP) || sec.closest(SKIP)) return;
    var h2 = sec.querySelector('h2');
    var head = h2 && h2.parentElement;
    if (head && head !== sec && head.children.length <= 4) stagger(head, 60);
    else tag(h2);
    if (imgs) each(sec, imgs, function (img) { tag(img, 0, 'img'); });
    each(sec, '.sc-stack', function (g) { stagger(g, 110); });
    each(sec, '.auto-faq', function (g) { stagger(g, 50); });
    each(sec, grids, function (g) { stagger(g); });
    var body = head && head !== sec ? head.parentElement : sec;
    Array.prototype.forEach.call(body.children, function (c) {
      if (c === head || c.hasAttribute('data-m') || c.querySelector('[data-m]')) return;
      if (c.children.length > 2 && c.querySelector('details, .sc-faq-q, .sc-faq-a')) stagger(c, 50);
      else tag(c);
    });
  }

  // General pages (About, Locations, Careers, Insights): no page-specific class list.
  // Heading groups rise; card grids are found from the layout itself (a grid or a row of
  // flex items with at least two card-sized children) and stagger, innermost first;
  // large in-flow photos settle. Reading text, tools and interactive parts stay still.
  var PAGE_SKIP = 'table, form, nav, aside, details, .ins-article, .ins-toc, .ins-subbar, .subbar, ' +
    '.anchor-nav, .decade-nav, .tl-v, .progress, .filter-row, .story-lightbox, ' +
    '.life-section, .lc-map-block, [class*="carousel"], [class*="slide"]';
  // Anything holding form fields, a table or a canvas stays still (forms, IR document lists,
  // topography backgrounds), as does anything already tagged.
  function gtag(el, delay, kind) {
    if (!el.closest(PAGE_SKIP) && !el.querySelector('[data-m], .m-words, input, select, textarea, table, canvas'))
      tag(el, delay, kind);
  }
  function cardGrid(el) {
    var cs = getComputedStyle(el);
    var grid = cs.display === 'grid' || cs.display === 'inline-grid' ||
               (cs.display === 'flex' && cs.flexDirection.indexOf('column') !== 0);
    if (!grid || el.getBoundingClientRect().width < 300) return null;
    var kids = Array.prototype.filter.call(el.children, function (c) {
      if (c.tagName === 'STYLE' || c.tagName === 'SCRIPT') return false;
      var r = c.getBoundingClientRect();
      return r.height >= 56 && r.width >= 120;
    });
    if (kids.length >= 3) return kids;
    if (kids.length === 2 && kids.every(function (c) { return c.getBoundingClientRect().height >= 140; })) return kids;
    return null;
  }

  var PROFILES = {
    page: function (main) {
      hero(main.querySelector('h1'));
      // IR group structure: the org chart fades in as one piece (its own script scales it)
      each(main, 'figure.gs', function (fig) { tag(fig); });
      each(main, 'h2', function (h2) {
        if (h2.closest(PAGE_SKIP)) return;
        var head = h2.parentElement;
        if (head && head !== main && head.children.length <= 4 && head.querySelectorAll('h2').length === 1 &&
            !head.querySelector('img, ul, ol, table, form, a.card'))
          Array.prototype.forEach.call(head.children, function (c, i) { gtag(c, i * 60); });
        else gtag(h2);
      });
      var grids = [];
      each(main, '*', function (el) {
        if (el.closest(PAGE_SKIP) || el.closest('[data-m]')) return;
        // horizontal scrollers (plant-page carousels) rise as one block: cards off to the
        // side would otherwise fade in mid-swipe
        if (/auto|scroll/.test(getComputedStyle(el).overflowX) && el.scrollWidth > el.clientWidth + 8) { gtag(el); return; }
        var kids = cardGrid(el);
        if (kids) { var d = 0, p = el; while ((p = p.parentElement)) d++; grids.push({ kids: kids, depth: d }); }
      });
      grids.sort(function (a, b) { return b.depth - a.depth; }).forEach(function (g) {
        g.kids.forEach(function (c, i) { gtag(c, Math.min(i, MAX_STEPS) * STEP); });
      });
      each(main, 'img', function (img) {
        if (img.getBoundingClientRect().width < 260 || getComputedStyle(img).position !== 'static' ||
            parseFloat(getComputedStyle(img).opacity) < 1) return;
        gtag(img, 0, 'img');
      });
    },


    // Capabilities (Pages/Capabilities/*): hero, then each .cap-section in turn
    capability: function (main) {
      var hero1 = main.querySelector('.cap-section--hero h1');
      hero(hero1);
      each(main, '.cap-section:not(.cap-section--hero)', function (sec) {
        section(sec, '.why-grid, .cap-grid-4, .cap-grid-3, .cap-grid-2s, .cap-row-2', '.why-grid img');
      });
    },

    // Markets (Pages/Markets/*): three page families share these rules —
    //   hub (.mkt-*: its hero already animates), market hubs and sub-pages (.mk-*),
    //   and the Automotive pages (.auto-*: the interactive cutaway is left alone)
    market: function (main) {
      hero(main.querySelector('h1'));
      each(main, '.mk-hero-media img', function (img) { tag(img, 200, 'img'); });
      each(main, '.mk-strip, .auto-spec.is-hero', function (g) { stagger(g, 70, 300); });
      each(main, '.mkt-grid-section, .mkt-cta, main > section:not(.mk-hero), ' +
                 '.mk-spoke-main > section:not(.mk-hero), .auto-page > div, .auto-spoke-grid main > *',
        function (sec) {
          section(sec, '.mk-points, .mk-cards, .mk-locs, .mkt-bento, .auto-subgrid, .auto-plants, ' +
                       '.auto-spec, .wr-stats, .mma-grid', '.mk-plate .art img');
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

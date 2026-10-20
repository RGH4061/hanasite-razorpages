/* Hana geometric motion backgrounds — adds the shape layer to every
   [data-hana-geo] element. Styles and options: css/hana-geo-motion.css. */
(function () {
  var SHAPES = {
    tri:    '0,100 50,0 100,100',
    triInv: '0,0 100,0 50,100',
    para:   '18,0 100,0 82,100 0,100',
    wedge:  '0,0 100,50 0,100'
  };
  // Folded surface: each shape split into two facets. White lifts a facet towards
  // the light, black takes it into shadow; the 1px line is the crease.
  var SURFACE = {
    fold: {
      tri:    { light: '0,100 50,0 60,100',    dark: '50,0 100,100 60,100',   line: 'M50 0L60 100' },
      triInv: { light: '0,0 40,0 50,100',      dark: '40,0 100,0 50,100',     line: 'M40 0L50 100' },
      para:   { light: '18,0 100,0 82,100',    dark: '18,0 82,100 0,100',     line: 'M18 0L82 100' },
      wedge:  { light: '0,0 100,50 0,42',      dark: '0,42 100,50 0,100',     line: 'M0 42L100 50' }
    }
  };
  // Drawing order and shape per slot (geo-4 sits at the back, geo-5 at the front)
  var LAYER = [['geo-4', 'triInv'], ['geo-3', 'para'], ['geo-1', 'tri'], ['geo-2', 'triInv'], ['geo-5', 'wedge']];
  // Side-layout variants: shape and tone for each slot (positions are in the CSS).
  // Third value: '' light, 'dark' or 'darker'.
  var VARIANTS = {
    '1': [['geo-4', 'triInv', 'dark'], ['geo-3', 'para', ''], ['geo-1', 'tri', ''], ['geo-2', 'triInv', 'darker'], ['geo-6', 'triInv', 'darker'], ['geo-5', 'wedge', '']],
    '2': [['geo-4', 'para', 'dark'], ['geo-3', 'tri', ''], ['geo-1', 'tri', 'darker'], ['geo-2', 'wedge', ''], ['geo-5', 'triInv', '']],
    '3': [['geo-4', 'wedge', 'dark'], ['geo-3', 'wedge', ''], ['geo-1', 'triInv', ''], ['geo-2', 'para', 'darker'], ['geo-5', 'tri', '']],
    '4': [['geo-4', 'para', 'dark'], ['geo-3', 'para', ''], ['geo-1', 'para', ''], ['geo-2', 'tri', 'darker'], ['geo-5', 'wedge', '']]
  };

  function addSprite() {
    if (document.getElementById('hana-geo-sprite')) return;
    var defs = Object.keys(SHAPES).map(function (k) {
      return '<symbol id="hana-geo-' + k + '" viewBox="0 0 100 100" preserveAspectRatio="none">' +
             '<polygon points="' + SHAPES[k] + '" fill="currentColor"/></symbol>';
    }).join('') + ['fold'].map(function (style) {
      return Object.keys(SHAPES).map(function (k) {
        var base = '<polygon points="' + SHAPES[k] + '" fill="currentColor"/>', extra = '';
        var sf = (SURFACE[style] || {})[k] || {};
        if (style === 'fold') {
          extra = '<polygon points="' + sf.light + '" fill="#fff" fill-opacity=".14"/>' +
                  '<polygon points="' + sf.dark + '" fill="#000" fill-opacity=".24"/>';
        }
        if (sf.line) extra += '<path d="' + sf.line + '" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1" vector-effect="non-scaling-stroke"/>';
        return '<symbol id="hana-geo-' + k + '-' + style + '" viewBox="0 0 100 100" preserveAspectRatio="none" style="overflow:visible">' +
               base + extra + '</symbol>';
      }).join('');
    }).join('');
    var holder = document.createElement('div');
    holder.innerHTML = '<svg id="hana-geo-sprite" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' + defs + '</defs></svg>';
    document.body.insertBefore(holder.firstChild, document.body.firstChild);
  }

  function decorate(el) {
    if (el.querySelector(':scope > .hana-geo')) return;
    var scale = parseFloat(el.getAttribute('data-geo-scale'));
    if (!isNaN(scale)) el.style.setProperty('--geo-s', scale);
    var layer = document.createElement('div');
    layer.className = 'hana-geo';
    layer.setAttribute('aria-hidden', 'true');
    // Section blocks (side layout) use the folded surface unless data-geo-style says otherwise
    var style = el.getAttribute('data-geo-style') || (el.getAttribute('data-hana-geo') === 'side' ? 'fold' : 'flat');
    var suffix = style === 'fold' ? '-fold' : '';
    var set = el.getAttribute('data-hana-geo') === 'side' ? (VARIANTS[el.getAttribute('data-geo-variant')] || VARIANTS['1']) : LAYER;
    layer.innerHTML = set.map(function (s) {
      return '<svg class="geo-s ' + s[0] + (s[2] ? ' geo-' + s[2] : '') + '" focusable="false"><use href="#hana-geo-' + s[1] + suffix + '"/></svg>';
    }).join('');
    el.insertBefore(layer, el.firstChild);
  }

  function init(root) {
    var els = (root || document).querySelectorAll('[data-hana-geo]');
    if (!els.length) return;
    addSprite();
    Array.prototype.forEach.call(els, decorate);
  }

  window.HanaGeo = { init: init };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();
})();

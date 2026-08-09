/* ============================================================================
   locations-map.js — interactive world map for the Locations hub.
   Reads plant data from <script id="lc-map-data" type="application/json"> and
   renders a dotted-world-map with one pin per plant + a floating callout that
   follows the active pin (hover / click a pin or a selector chip below).
   Pure vanilla JS — progressive enhancement over #lc-worldmap.
   ========================================================================== */
(function () {
  var MAP_W = 1000, MAP_H = 352;
  var POS = {
    ohio: [269, 68], jiaxing: [766, 122], cheongju: [805, 120],
    lamphun: [737, 178], ayutthaya: [741, 189], 'koh-kong': [746, 200]
  };
  var LINE = '#FFFFFF', PIN = '#FF883E';
  var FLAG = { Thailand: 'th', China: 'cn', USA: 'us', Cambodia: 'kh', 'South Korea': 'kr' };
  var cardW = 258, cardH = 150, cardX = 312, cardY = 44;

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function viewLabel(p) { return p.linkLabel || (p.status === 'affiliate' ? 'Visit Cheongju site' : 'View ' + String(p.city).split(',')[0] + ' plant'); }

  function calloutHTML(p, accent) {
    var code = FLAG[p.country];
    return '<div style="font-family:var(--font-text);background:#fff;border:1px solid var(--line);border-radius:10px;box-shadow:0 18px 44px -16px rgba(0,0,0,0.6);height:100%;box-sizing:border-box;padding:14px 16px;display:flex;flex-direction:column;">'
      + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:7px;">'
      + (code ? '<img src="https://flagcdn.com/w40/' + code + '.png" alt="" width="22" style="width:22px;height:auto;display:block;flex-shrink:0;border-radius:2px;border:1px solid var(--line);">' : '')
      + '<span style="font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-3);">' + esc(p.country) + (p.status === 'affiliate' ? ' &middot; Affiliate' : '') + '</span></div>'
      + '<div style="font-family:var(--font-display);font-size:18px;font-weight:600;color:var(--ink);letter-spacing:-0.01em;line-height:1.1;margin-bottom:5px;">' + esc(p.city) + '</div>'
      + '<div style="font-size:11.5px;color:var(--ink-2);line-height:1.45;margin-bottom:8px;flex:1;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;">' + esc(p.summary) + '</div>'
      + '<a href="' + esc(p.url) + '" style="font-size:11px;font-weight:700;letter-spacing:0.04em;color:' + accent + ';text-decoration:none;display:inline-flex;align-items:center;gap:5px;">' + esc(viewLabel(p))
      + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="' + accent + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></a></div>';
  }

  function build(container, plants, accent) {
    var active = Math.max(0, plants.findIndex(function (p) { return p.slug === 'jiaxing'; }));

    var svgNS = 'http://www.w3.org/2000/svg';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;width:100%;border-radius:12px;overflow:hidden;border:1px solid var(--line);background:#05101f;aspect-ratio:940 / 352;';
    wrap.innerHTML = '<svg viewBox="0 0 ' + MAP_W + ' 310" preserveAspectRatio="xMidYMid slice" style="display:block;width:100%;height:100%;">'
      + '<image href="images/world-map3.png" x="0" y="0" width="' + MAP_W + '" height="' + MAP_H + '" preserveAspectRatio="none"></image>'
      + '<defs><marker id="loc-arrow" markerWidth="9" markerHeight="9" refX="6.5" refY="4.2" orient="auto"><path d="M1,1 L7.5,4.2 L1,7.4" fill="none" stroke="' + LINE + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></marker></defs>'
      + '<line class="lc-leader" stroke="' + LINE + '" stroke-width="1.6" stroke-dasharray="2 4" marker-end="url(#loc-arrow)" opacity="0.95"></line>'
      + '<g class="lc-pins"></g>'
      + '<foreignObject class="lc-callout" x="' + cardX + '" y="' + cardY + '" width="' + cardW + '" height="' + cardH + '"></foreignObject>'
      + '</svg>';
    container.appendChild(wrap);

    var chips = document.createElement('div');
    chips.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;';
    container.appendChild(chips);

    var svg = wrap.querySelector('svg');
    var leader = svg.querySelector('.lc-leader');
    var pinsG = svg.querySelector('.lc-pins');
    var callout = svg.querySelector('.lc-callout');

    plants.forEach(function (p, i) {
      var pos = POS[p.slug]; if (!pos) return;
      var g = document.createElementNS(svgNS, 'g');
      g.setAttribute('style', 'cursor:pointer;');
      g.dataset.idx = i;
      pinsG.appendChild(g);

      var chip = document.createElement('button');
      chip.type = 'button';
      chip.dataset.idx = i;
      chips.appendChild(chip);

      function activate() { setActive(i); }
      g.addEventListener('mouseenter', activate);
      g.addEventListener('click', activate);
      chip.addEventListener('mouseenter', activate);
      chip.addEventListener('click', activate);
    });

    function setActive(idx) {
      active = idx;
      var ap = plants[active];
      var pos = POS[ap.slug] || [MAP_W / 2, MAP_H / 2];
      var px = pos[0], py = pos[1];
      var cx = cardX + cardW / 2, cy = cardY + cardH / 2;
      var dx = px - cx, dy = py - cy;
      var tb = 1 / Math.max(Math.abs(dx) / (cardW / 2), Math.abs(dy) / (cardH / 2));
      var anchorX = cx + dx * tb, anchorY = cy + dy * tb;
      var len = Math.hypot(dx, dy) || 1;
      var endX = px - dx / len * 13, endY = py - dy / len * 13;
      leader.setAttribute('x1', anchorX); leader.setAttribute('y1', anchorY);
      leader.setAttribute('x2', endX); leader.setAttribute('y2', endY);
      callout.innerHTML = calloutHTML(ap, accent);

      // redraw pins
      pinsG.querySelectorAll('g').forEach(function (g) {
        var i = +g.dataset.idx, p = plants[i], pos = POS[p.slug]; if (!pos) return;
        var x = pos[0], y = pos[1], on = i === active;
        g.innerHTML = on
          ? '<circle cx="' + x + '" cy="' + y + '" r="15" fill="' + PIN + '" opacity="0.3"></circle><circle cx="' + x + '" cy="' + y + '" r="5.8" fill="' + PIN + '" stroke="#fff" stroke-width="1.7"></circle><circle cx="' + x + '" cy="' + y + '" r="2" fill="#fff"></circle>'
          : '<circle cx="' + x + '" cy="' + y + '" r="9" fill="' + PIN + '" opacity="0.18"></circle><circle cx="' + x + '" cy="' + y + '" r="4" fill="#0b1f38" stroke="' + PIN + '" stroke-width="2"></circle>';
      });

      // redraw chips
      chips.querySelectorAll('button').forEach(function (chip) {
        var i = +chip.dataset.idx, p = plants[i], on = i === active;
        chip.style.cssText = 'display:inline-flex;align-items:center;gap:8px;padding:7px 13px;cursor:pointer;border:1px solid ' + (on ? accent : 'var(--line)') + ';border-radius:999px;background:' + (on ? 'var(--hana-blue-tint)' : '#fff') + ';font-family:var(--font-text);font-size:12px;font-weight:600;color:' + (on ? 'var(--hana-blue-deep)' : 'var(--ink-2)') + ';transition:all 140ms ease;';
        chip.innerHTML = '<span style="width:7px;height:7px;border-radius:50%;background:' + accent + ';opacity:' + (on ? 1 : 0.4) + ';"></span>' + esc(p.city) + '<span style="font-size:10px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-3);">' + esc(p.country) + '</span>';
      });
    }

    setActive(active);
  }

  function init() {
    var container = document.getElementById('lc-worldmap');
    if (!container) return;
    var dataEl = document.getElementById('lc-map-data');
    if (!dataEl) return;
    var plants = JSON.parse(dataEl.textContent);
    build(container, plants, 'var(--hana-blue)');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

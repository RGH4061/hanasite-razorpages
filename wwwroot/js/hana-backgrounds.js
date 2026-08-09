/* ============================================================================
   Hana Backgrounds — reusable SVG section backgrounds
   ----------------------------------------------------------------------------
   Eight digital-graphic patterns (topo, flow, pcb, grid, halftone, wafer,
   hex, globe), each in a `light` or `dark` variant, with an optional 3rd-color
   accent (`cyan` by default) that lights a few nodes for vibrancy.

   Patterns render as inline SVG sized to the host element's real pixel box and
   re-render on resize, so motifs fill the section without distortion.

   ── USAGE ──────────────────────────────────────────────────────────────────
   1. Declarative (auto-scanned on load):

        <section data-hana-bg="pcb" data-variant="light" data-accent="cyan">
          …your content…
        </section>

      Attributes:
        data-hana-bg   pattern name (required)
        data-variant   "light" | "dark"          (default "light")
        data-accent    "cyan" | "amber" | "emerald" | "" (default "" = none)
        data-fade      "left" | "none"           (default "left" — text veil)

   2. Imperative:

        HanaBG.apply(el, { pattern: 'topo', variant: 'dark', accent: '', fade: 'left' });

   The host element gets position:relative (if static) and an absolutely
   positioned SVG layer at z-index 0. Put your content at z-index ≥ 1.

   Patterns: topo · flow · pcb · grid · halftone · wafer · hex · globe
   Note: `topo` ignores the accent — accent contour lines hurt its readability.
   ========================================================================== */
(function () {
  'use strict';

  var _id = 0;
  function uid() { return 'hbg' + (++_id); }
  function seedFn(a, b, c) { return function (n) { return Math.abs(Math.sin(n * a + b) * c % 1); }; }

  // ── Palettes ───────────────────────────────────────────────────────────
  var PAL = {
    light: { base: '#0E4A7C', mid: '#1283DD', t1: '#E8F1F9', t2: '#d0e2f0', t3: '#b8d4eb', page: '#f5f7fa' },
    dark:  { base: '#1283DD', bright: '#4E9BDA', mid: '#1283DD', deep: '#0E4A7C', night: '#030a17' }
  };
  var ACCENTS = { cyan: '#19C6E6', amber: '#FF883E', emerald: '#12B886' };

  // Background gradient + veil color (rgb triplet) per pattern × variant.
  function veilRGB(v) { return v === 'dark' ? '13,53,96' : '245,247,250'; }

  // ── Pattern generators ─────────────────────────────────────────────────
  // Each returns { bg, inner } where `bg` is a CSS background string and
  // `inner` is SVG markup generated for the W×H box.
  var GEN = {};

  // 1 · TOPO — flowing iso-lines (no accent: lines hurt readability)
  GEN.topo = function (W, H, v) {
    var stroke = v === 'dark' ? '#1283DD' : PAL.light.base;
    var n = Math.ceil(H / 14) + 8, m = '';
    for (var i = 0; i < n; i++) {
      var offset = i * 18, yBase = -20 + i * 14, d = 'M -50 ' + yBase;
      for (var x = 0; x <= W + 50; x += 25) {
        var y = yBase + Math.sin((x + offset) * 0.008) * 24 + Math.sin((x + offset) * 0.018) * 14;
        d += ' L ' + x.toFixed(1) + ' ' + y.toFixed(1);
      }
      var op = 0.08 + (i % 4) * 0.06;
      m += '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="0.9" stroke-opacity="' + op + '"/>';
    }
    var bg = v === 'dark'
      ? 'linear-gradient(135deg,#0D3560 0%,#0E4070 65%,#0D3560 100%)'
      : 'linear-gradient(135deg,#ffffff 0%,#e8f0f8 65%,#f4f7fc 100%)';
    return { bg: bg, inner: m };
  };

  // 2 · FLOW — airy flowing streamlines (soft companion to topo)
  //   Denser line field, optional cyan accent strands, and a masked top-right
  //   "clear zone" so a logo/eyebrow can sit there. The fade-left veil keeps
  //   the text area legible, so lines stay gentle on the left.
  GEN.flow = function (W, H, v, ac) {
    var dark = v === 'dark', m = '';
    var stroke = dark ? '#4E9BDA' : '#1283DD';
    var lines = Math.max(15, Math.round(H / 14));
    function field(x, y) {
      return Math.sin(x * 0.0042 + y * 0.0061) * 0.95 + Math.sin(x * 0.0115 - y * 0.0039) * 0.45;
    }
    var mid = uid(), grad = uid();
    m += '<defs>'
       + '<radialGradient id="' + grad + '" cx="87%" cy="2%" r="48%">'
       + '<stop offset="0%" stop-color="#000"/>'
       + '<stop offset="50%" stop-color="#000"/>'
       + '<stop offset="100%" stop-color="#fff"/></radialGradient>'
       + '<mask id="' + mid + '">'
       + '<rect width="' + W + '" height="' + H + '" fill="#fff"/>'
       + '<rect width="' + W + '" height="' + H + '" fill="url(#' + grad + ')"/></mask></defs>';
    m += '<g mask="url(#' + mid + ')">';
    var dots = '';
    for (var i = 0; i < lines; i++) {
      var x = -50, y = (i + 0.5) * (H / lines) + Math.sin(i * 1.3) * 9;
      var d = 'M ' + x.toFixed(1) + ' ' + y.toFixed(1);
      var sampled = false, sx = 0, sy = 0;
      for (var step = 0; step < 240 && x < W + 50; step++) {
        var a = field(x, y);
        x += Math.cos(a) * 12 + 12;
        y += Math.sin(a) * 12;
        d += ' L ' + x.toFixed(1) + ' ' + y.toFixed(1);
        if (!sampled && x > W * 0.52) { sampled = true; sx = x; sy = y; }
      }
      var hot = ac && (i % 4 === 2);
      var col = hot ? ac : stroke;
      // Gentle on the left text zone; hot strands a touch brighter for vibrancy.
      var op = hot ? (0.20 + (i % 3) * 0.05) : (0.05 + (i % 5) * 0.028);
      var sw = hot ? 1.1 : (0.8 + (i % 3) * 0.5);
      m += '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + sw + '" stroke-opacity="' + op.toFixed(3) + '" stroke-linecap="round"/>';
      if (hot && sampled) dots += '<circle cx="' + sx.toFixed(1) + '" cy="' + sy.toFixed(1) + '" r="2.1" fill="' + ac + '" fill-opacity="0.85"/>';
    }
    m += dots + '</g>';
    var bg = dark
      ? 'linear-gradient(135deg,#0D3560 0%,#0E4070 60%,#0a2c50 100%)'
      : 'linear-gradient(135deg,#ffffff 0%,#eaf1f8 60%,#f4f7fc 100%)';
    return { bg: bg, inner: m };
  };

  // 3 · PCB — orthogonal traces + pads
  GEN.pcb = function (W, H, v, ac) {
    var seed = seedFn(9301, 49297, 233280);
    var COLS = Math.max(6, Math.round(W / 75)), ROWS = Math.max(3, Math.round(H / 60));
    var gw = W / COLS, gh = H / ROWS, dark = v === 'dark';
    var traces = [], pads = [], k = 0;
    for (var r = 0; r <= ROWS; r++) {
      for (var c = 0; c <= COLS; c++) {
        if (seed(r * 47 + c * 13) < 0.55) continue;
        var x = c * gw, y = r * gh;
        pads.push({ x: x, y: y, via: seed(c + r * 99) < 0.3, hot: false, hs: seed(c * 5 + r * 23), k: k++ });
        if (c < COLS && seed(c * 7 + r * 31) > 0.5) traces.push({ x1: x, y1: y, x2: x + gw, y2: y });
        if (r < ROWS && seed(c * 13 + r * 17) > 0.55) traces.push({ x1: x, y1: y, x2: x, y2: y + gh });
      }
    }
    if (ac && pads.length) {
      // Light a proportional set of the highest-scoring pads, guaranteeing
      // at least one even when the grid is small (narrow sections).
      var nHot = Math.max(1, Math.round(pads.length * 0.16));
      pads.slice().sort(function (a, b) { return b.hs - a.hs; }).slice(0, nHot)
        .forEach(function (p) { p.hot = true; });
    }
    var gid = uid(), m = '';
    m += '<defs><radialGradient id="' + gid + '" cx="50%" cy="50%" r="60%">'
       + '<stop offset="0%" stop-color="' + (dark ? '#0E4A7C' : '#E8F1F9') + '" stop-opacity="' + (dark ? 0.45 : 0.9) + '"/>'
       + '<stop offset="100%" stop-color="' + (dark ? '#030a17' : '#f5f7fa') + '" stop-opacity="0"/></radialGradient></defs>';
    m += '<rect width="' + W + '" height="' + H + '" fill="url(#' + gid + ')"/>';
    var gridOp = dark ? 0.06 : 0.08;
    for (var gc = 0; gc <= COLS; gc++) m += '<line x1="' + (gc * gw) + '" y1="0" x2="' + (gc * gw) + '" y2="' + H + '" stroke="#1283DD" stroke-width="0.4" stroke-opacity="' + gridOp + '"/>';
    for (var gr = 0; gr <= ROWS; gr++) m += '<line x1="0" y1="' + (gr * gh) + '" x2="' + W + '" y2="' + (gr * gh) + '" stroke="#1283DD" stroke-width="0.4" stroke-opacity="' + gridOp + '"/>';
    traces.forEach(function (t) { m += '<line x1="' + t.x1 + '" y1="' + t.y1 + '" x2="' + t.x2 + '" y2="' + t.y2 + '" stroke="#1283DD" stroke-width="1.4" stroke-opacity="' + (dark ? 0.28 : 0.22) + '"/>'; });
    pads.forEach(function (p) {
      if (p.hot) {
        m += p.via
          ? '<circle cx="' + p.x + '" cy="' + p.y + '" r="3.2" fill="none" stroke="' + ac + '" stroke-width="1.6" stroke-opacity="0.95"/>'
          : '<rect x="' + (p.x - 3.2) + '" y="' + (p.y - 3.2) + '" width="6.4" height="6.4" fill="' + ac + '" fill-opacity="0.9"/>';
      } else if (p.via) {
        m += '<circle cx="' + p.x + '" cy="' + p.y + '" r="2.6" fill="none" stroke="' + (dark ? '#4E9BDA' : '#0E4A7C') + '" stroke-width="1.4" stroke-opacity="' + (dark ? 0.7 : 0.45) + '"/>';
      } else {
        m += '<rect x="' + (p.x - 3) + '" y="' + (p.y - 3) + '" width="6" height="6" fill="#1283DD" fill-opacity="' + (dark ? 0.85 : 0.55) + '"/>';
      }
    });
    return { bg: dark ? '#030a17' : '#f5f7fa', inner: m };
  };

  // 4 · GRID — CAD/blueprint registration grid with crosshair fiducials
  GEN.grid = function (W, H, v, ac) {
    var dark = v === 'dark', m = '', col = '#1283DD';
    var minor = 22, major = 110, gid = uid();
    m += '<defs><radialGradient id="' + gid + '" cx="80%" cy="45%" r="65%">'
       + '<stop offset="0%" stop-color="' + (dark ? '#0E4A7C' : '#d8e6f3') + '" stop-opacity="' + (dark ? 0.55 : 0.8) + '"/>'
       + '<stop offset="100%" stop-color="' + (dark ? '#030a17' : '#f5f7fa') + '" stop-opacity="0"/></radialGradient></defs>';
    m += '<rect width="' + W + '" height="' + H + '" fill="url(#' + gid + ')"/>';
    for (var x = 0; x <= W; x += minor) m += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + H + '" stroke="' + col + '" stroke-width="0.4" stroke-opacity="' + (dark ? 0.07 : 0.06) + '"/>';
    for (var y = 0; y <= H; y += minor) m += '<line x1="0" y1="' + y + '" x2="' + W + '" y2="' + y + '" stroke="' + col + '" stroke-width="0.4" stroke-opacity="' + (dark ? 0.07 : 0.06) + '"/>';
    for (var x2 = 0; x2 <= W; x2 += major) m += '<line x1="' + x2 + '" y1="0" x2="' + x2 + '" y2="' + H + '" stroke="' + col + '" stroke-width="0.7" stroke-opacity="' + (dark ? 0.16 : 0.12) + '"/>';
    for (var y2 = 0; y2 <= H; y2 += major) m += '<line x1="0" y1="' + y2 + '" x2="' + W + '" y2="' + y2 + '" stroke="' + col + '" stroke-width="0.7" stroke-opacity="' + (dark ? 0.16 : 0.12) + '"/>';
    var seed = seedFn(7.3, 2.1, 911.7);
    for (var gx = major; gx < W; gx += major) {
      for (var gy = major; gy < H; gy += major) {
        var hot = ac && seed(gx * 3 + gy * 7) > 0.7;
        var c = hot ? ac : (dark ? '#4E9BDA' : '#0E4A7C'), o = hot ? 0.9 : (dark ? 0.5 : 0.4), L = hot ? 9 : 6;
        m += '<line x1="' + (gx - L) + '" y1="' + gy + '" x2="' + (gx + L) + '" y2="' + gy + '" stroke="' + c + '" stroke-width="' + (hot ? 1.3 : 0.9) + '" stroke-opacity="' + o + '"/>';
        m += '<line x1="' + gx + '" y1="' + (gy - L) + '" x2="' + gx + '" y2="' + (gy + L) + '" stroke="' + c + '" stroke-width="' + (hot ? 1.3 : 0.9) + '" stroke-opacity="' + o + '"/>';
        if (hot) m += '<circle cx="' + gx + '" cy="' + gy + '" r="3.2" fill="none" stroke="' + ac + '" stroke-width="1.1" stroke-opacity="0.85"/>';
      }
    }
    return { bg: dark ? '#030a17' : '#f5f7fa', inner: m };
  };

  // 5 · HALFTONE — dot grid sized toward a light source
  GEN.halftone = function (W, H, v, ac) {
    var SP = 14, cx = W * 0.79, cy = H * 0.26, dark = v === 'dark', m = '';
    var R = Math.hypot(W, H) * 0.62;
    for (var y = 0; y <= H; y += SP) {
      for (var x = 0; x <= W; x += SP) {
        var d = Math.hypot(x - cx, y - cy), t = Math.max(0, 1 - d / R);
        if (t < 0.04) continue;
        var hot = ac && t > 0.72;
        var col = hot ? ac : (dark ? '#1283DD' : '#0E4A7C');
        var op = hot ? Math.min(0.9, (0.12 + t * 0.55) + 0.18) : (0.12 + t * 0.55) * (dark ? 1.1 : 1);
        m += '<circle cx="' + x + '" cy="' + y + '" r="' + (0.4 + t * 3.8).toFixed(2) + '" fill="' + col + '" fill-opacity="' + op.toFixed(3) + '"/>';
      }
    }
    var bg = dark
      ? 'radial-gradient(ellipse 70% 80% at 78% 22%, #0E4A7C 0%, #051023 60%, #030a17 100%)'
      : 'radial-gradient(ellipse 70% 80% at 78% 22%, #d8e6f3 0%, #eef2f7 60%, #f5f7fa 100%)';
    return { bg: bg, inner: m };
  };

  // 6 · WAFER — silicon die grid
  GEN.wafer = function (W, H, v, ac) {
    var DW = 56, DH = 56, GAP = 2, seed = seedFn(73.13, 5.7, 3987.31), dark = v === 'dark';
    var X0 = W * 0.30, cols = Math.ceil((W - X0) / (DW + GAP)) + 1, rows = Math.ceil(H / (DH + GAP)) + 1;
    var gid = uid(), m = '';
    m += '<defs><radialGradient id="' + gid + '" cx="80%" cy="50%" r="55%">'
       + '<stop offset="0%" stop-color="' + (dark ? '#0E4A7C' : '#d8e6f3') + '" stop-opacity="0.8"/>'
       + '<stop offset="100%" stop-color="' + (dark ? '#030a17' : '#f5f7fa') + '" stop-opacity="0"/></radialGradient></defs>';
    m += '<rect width="' + W + '" height="' + H + '" fill="url(#' + gid + ')"/>';
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var s = seed(r * 31 + c * 7), x = X0 + c * (DW + GAP), y = r * (DH + GAP);
        var rightBias = Math.max(0, (x - W * 0.42) / (W * 0.58));
        var lit = s > (0.88 - rightBias * 0.35);
        var hot = ac && lit && seed(r * 17 + c * 91) > 0.6;
        if (lit) {
          m += '<rect x="' + x + '" y="' + y + '" width="' + DW + '" height="' + DH + '" fill="' + (hot ? '#D6F5FB' : (dark ? '#0E4A7C' : '#E8F1F9')) + '" fill-opacity="0.95" stroke="' + (hot ? ac : '#1283DD') + '" stroke-width="' + (hot ? 1.0 : 0.7) + '" stroke-opacity="' + (hot ? 0.9 : 0.65) + '"/>';
          m += '<rect x="' + (x + 18) + '" y="' + (y + 18) + '" width="' + (DW - 36) + '" height="' + (DH - 36) + '" fill="none" stroke="' + (hot ? ac : (dark ? '#1283DD' : '#0E4A7C')) + '" stroke-width="0.6" stroke-opacity="' + (hot ? 0.8 : 0.5) + '"/>';
          m += '<circle cx="' + (x + DW / 2) + '" cy="' + (y + DH / 2) + '" r="2" fill="' + (hot ? ac : (dark ? '#1283DD' : '#0E4A7C')) + '" fill-opacity="' + (hot ? 0.9 : 0.6) + '"/>';
        } else {
          m += '<rect x="' + x + '" y="' + y + '" width="' + DW + '" height="' + DH + '" fill="none" stroke="#1283DD" stroke-width="0.7" stroke-opacity="0.15"/>';
          if (s > 0.3) {
            m += '<rect x="' + (x + 4) + '" y="' + (y + DH / 2 - 1) + '" width="4" height="2" fill="#1283DD" fill-opacity="0.3"/>';
            m += '<rect x="' + (x + DW - 8) + '" y="' + (y + DH / 2 - 1) + '" width="4" height="2" fill="#1283DD" fill-opacity="0.3"/>';
          }
        }
      }
    }
    return { bg: dark ? '#030a17' : '#f5f7fa', inner: m };
  };

  // 7 · HEX — honeycomb mesh
  GEN.hex = function (W, H, v, ac) {
    var R = 22, dx = R * Math.sqrt(3), dy = R * 1.5, seed = seedFn(49.71, 9.4, 4831.71), dark = v === 'dark';
    var cols = Math.ceil(W / dx) + 2, rows = Math.ceil(H / dy) + 2, fx = W * 0.87, fy = H * 0.48, fr = Math.hypot(W, H) * 0.63, m = '';
    function hexPath(x, y) {
      var d = '';
      for (var i = 0; i < 6; i++) {
        var a = (Math.PI / 3) * i + Math.PI / 6;
        d += (i === 0 ? 'M' : 'L') + ' ' + (x + R * Math.cos(a)).toFixed(1) + ' ' + (y + R * Math.sin(a)).toFixed(1) + ' ';
      }
      return d + 'Z';
    }
    for (var r = -1; r < rows; r++) {
      for (var c = -1; c < cols; c++) {
        var x = c * dx + (r % 2 === 0 ? 0 : dx / 2), y = r * dy, s = seed(r * 41 + c * 13);
        var dim = Math.max(0.04, Math.min(0.8, 1 - Math.hypot(x - fx, y - fy) / fr));
        var lit = s > 0.85, hot = ac && lit && seed(r * 11 + c * 29) > 0.45;
        var fill = lit ? (hot ? '#C8F2FA' : (dark ? '#0E4A7C' : '#d0e2f0')) : 'none';
        var fop = lit ? dim * (hot ? 0.95 : 0.8) : 0;
        var stroke = hot ? ac : (dark ? '#1283DD' : '#0E4A7C');
        var sop = dim * (lit ? (hot ? 0.95 : 0.55) : 0.22);
        m += '<path d="' + hexPath(x, y) + '" fill="' + fill + '" fill-opacity="' + fop.toFixed(3) + '" stroke="' + stroke + '" stroke-width="' + (hot ? 1.0 : 0.6) + '" stroke-opacity="' + sop.toFixed(3) + '"/>';
      }
    }
    var bg = dark
      ? 'linear-gradient(120deg, #030a17 35%, #0E4A7C 100%)'
      : 'linear-gradient(120deg, #f5f7fa 35%, #d8e6f3 100%)';
    return { bg: bg, inner: m };
  };

  // 8 · GLOBE — wireframe dotted sphere
  GEN.globe = function (W, H, v, ac) {
    var R = Math.min(H * 0.52, 220), cx = W - R - 60, cy = H / 2, N = 800, dark = v === 'dark', m = '';
    var col = dark ? '#1283DD' : '#0E4A7C';
    for (var i = 0; i < N; i++) {
      var phi = Math.acos(1 - 2 * (i + 0.5) / N), theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      var x3 = Math.sin(phi) * Math.cos(theta), y3 = Math.sin(phi) * Math.sin(theta), z3 = Math.cos(phi);
      var tilt = 20 * Math.PI / 180;
      var yT = y3 * Math.cos(tilt) - z3 * Math.sin(tilt), zT = y3 * Math.sin(tilt) + z3 * Math.cos(tilt);
      if (zT < -0.05) continue;
      var hot = ac && i % 11 === 0 && zT > 0.2;
      var op = 0.12 + Math.max(0, zT) * 0.75, sz = 0.6 + Math.max(0, zT) * 1.4;
      m += '<circle cx="' + (cx + x3 * R).toFixed(1) + '" cy="' + (cy + yT * R).toFixed(1) + '" r="' + (hot ? sz + 1.2 : sz).toFixed(2) + '" fill="' + (hot ? ac : col) + '" fill-opacity="' + (hot ? Math.min(0.95, op + 0.2) : op).toFixed(3) + '"/>';
    }
    m += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + R + '" ry="' + (R * 0.96) + '" fill="none" stroke="#1283DD" stroke-width="0.5" stroke-opacity="0.22"/>';
    var bg = dark
      ? 'radial-gradient(ellipse 80% 100% at 80% 50%, #072c4d 0%, #030a17 65%)'
      : 'radial-gradient(ellipse 80% 100% at 80% 50%, #d8e6f3 0%, #f0f4f8 65%)';
    return { bg: bg, inner: m };
  };

  // ── Renderer ───────────────────────────────────────────────────────────
  function render(el, opts) {
    var pattern = opts.pattern, gen = GEN[pattern];
    if (!gen) { console.warn('[HanaBG] unknown pattern:', pattern); return; }
    var variant = opts.variant === 'dark' ? 'dark' : 'light';
    var accent = '';
    if (opts.accent) accent = ACCENTS[opts.accent] || opts.accent; // name or raw hex
    if (pattern === 'topo') accent = ''; // topo never takes the accent
    var fade = opts.fade === 'none' ? 'none' : 'left';

    var W = Math.max(1, Math.round(el.clientWidth));
    var H = Math.max(1, Math.round(el.clientHeight));
    var out = gen(W, H, variant, accent);

    var inner = out.inner;
    if (fade === 'left') {
      var fid = uid(), rgb = veilRGB(variant);
      inner += '<defs><linearGradient id="' + fid + '" x1="0" x2="1" y1="0" y2="0">'
             + '<stop offset="0%" stop-color="rgb(' + rgb + ')" stop-opacity="0.82"/>'
             + '<stop offset="55%" stop-color="rgb(' + rgb + ')" stop-opacity="0"/>'
             + '</linearGradient></defs>'
             + '<rect width="' + W + '" height="' + H + '" fill="url(#' + fid + ')"/>';
    }

    var layer = el.querySelector(':scope > .hana-bg-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'hana-bg-layer';
      layer.setAttribute('aria-hidden', 'true');
      layer.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;';
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.insertBefore(layer, el.firstChild);
    }
    layer.style.background = out.bg;
    layer.innerHTML = '<svg width="100%" height="100%" viewBox="0 0 ' + W + ' ' + H
      + '" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="display:block">' + inner + '</svg>';
  }

  // Debounced resize re-render via a shared ResizeObserver
  var RO = (typeof ResizeObserver !== 'undefined') ? new ResizeObserver(function (entries) {
    entries.forEach(function (e) {
      var el = e.target, opts = el.__hanaBG;
      if (!opts) return;
      clearTimeout(el.__hanaBGT);
      el.__hanaBGT = setTimeout(function () { render(el, opts); }, 80);
    });
  }) : null;

  // Registry of every element with an applied background, so a window-level
  // resize can re-render each one even where ResizeObserver is unavailable or
  // throttled. SVGs use preserveAspectRatio="none", so the geometry must be
  // regenerated to the new size — otherwise the pattern stretches.
  var APPLIED = [];
  function rerenderAll() {
    for (var i = APPLIED.length - 1; i >= 0; i--) {
      var el = APPLIED[i];
      if (!el.isConnected || !el.__hanaBG) { APPLIED.splice(i, 1); continue; }
      render(el, el.__hanaBG);
    }
  }
  var winT;
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', function () {
      clearTimeout(winT);
      winT = setTimeout(rerenderAll, 120);
    });
  }

  // ── Public API ─────────────────────────────────────────────────────────
  var HanaBG = {
    patterns: Object.keys(GEN),
    accents: ACCENTS,
    apply: function (el, opts) {
      if (typeof el === 'string') el = document.querySelector(el);
      if (!el) return;
      opts = opts || {};
      el.__hanaBG = opts;
      render(el, opts);
      if (APPLIED.indexOf(el) === -1) APPLIED.push(el);
      if (RO) { RO.unobserve(el); RO.observe(el); }
      return el;
    },
    refresh: function (el) { if (el && el.__hanaBG) render(el, el.__hanaBG); },
    scan: function (root) {
      root = root || document;
      root.querySelectorAll('[data-hana-bg]').forEach(function (el) {
        HanaBG.apply(el, {
          pattern: el.getAttribute('data-hana-bg'),
          variant: el.getAttribute('data-variant') || 'light',
          accent: el.getAttribute('data-accent') || '',
          fade: el.getAttribute('data-fade') || 'left'
        });
      });
    }
  };

  window.HanaBG = HanaBG;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { HanaBG.scan(); });
  } else {
    HanaBG.scan();
  }
})();

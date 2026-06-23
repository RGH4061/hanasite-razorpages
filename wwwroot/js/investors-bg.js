/* ============================================================================
   investors-bg.js — canvas backgrounds for the Investor Relations pages.
   Three self-guarding routines (each no-ops if its target isn't on the page):
     · #hero-topo       light topographic contour wash behind the hero band
     · #stock-chart     HANA SET price sparkline (IR hub only)
     · #enquiries-topo  dark-blue topographic wash behind the page-end band
   Pure vanilla JS — progressive enhancement. Loaded per-page via @@section Scripts.
   ========================================================================== */
'use strict';

/* ── Hero topo canvas ── */
(function () {
  var hero = document.querySelector('.hero-band');
  var cvs  = document.getElementById('hero-topo');
  if (!hero || !cvs) return;
  var ctx = cvs.getContext('2d'), W, H;
  function resize() { W = cvs.width = hero.offsetWidth; H = cvs.height = hero.offsetHeight; }
  function draw() {
    var grd = ctx.createLinearGradient(0, 0, W * 0.85, H);
    grd.addColorStop(0, '#ffffff'); grd.addColorStop(0.65, '#e8f0f8'); grd.addColorStop(1, '#f4f7fc');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 0.9;
    for (var i = 0; i < 28; i++) {
      var offset = i * 18, yBase = 80 + i * 14, op = 0.08 + (i % 4) * 0.06;
      ctx.globalAlpha = op; ctx.strokeStyle = '#0E4A7C'; ctx.beginPath();
      for (var x = -50; x <= W + 50; x += 25) {
        var y = yBase + Math.sin((x + offset) * 0.008) * 24 + Math.sin((x + offset) * 0.018) * 14;
        if (x === -50) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    var veil = ctx.createLinearGradient(0, 0, Math.min(W * 0.42, 500), 0);
    veil.addColorStop(0, 'rgba(220,230,240,.48)'); veil.addColorStop(1, 'rgba(220,230,240,0)');
    ctx.fillStyle = veil; ctx.fillRect(0, 0, W, H);
  }
  resize(); draw();
  window.addEventListener('resize', function () { resize(); draw(); });
  if (window.ResizeObserver) new ResizeObserver(function () { resize(); draw(); }).observe(hero);
})();

/* ── HANA sparkline (IR hub) ── */
(function () {
  var wrap = document.querySelector('.sp-chart-wrap');
  var cvs  = document.getElementById('stock-chart');
  if (!wrap || !cvs) return;
  var ctx = cvs.getContext('2d');
  var data = [21.4,21.7,21.5,22.1,22.8,22.4,23.0,22.6,23.4,24.1,23.7,24.5,25.0,24.8,25.6,26.2,25.8,26.5,27.0,26.8,27.5,28.1,27.9,28.4,28.8,29.2,28.9,29.6,30.1,30.4,30.8,30.2,31.0,31.5,31.2,32.0,32.4,31.8,32.8,33.2,33.6,34.0,33.5,34.2,34.8,35.0,34.6,35.3,35.8,36.2,35.7,36.5,37.0,36.8,37.4,38.0,37.6,38.3,38.8,39.2];
  function draw() {
    var W = wrap.offsetWidth, H = wrap.offsetHeight;
    if (!W || !H) return;
    cvs.width = W; cvs.height = H;
    var min = Math.min.apply(null, data), max = Math.max.apply(null, data);
    var pad = 4;
    var xs = data.map(function (_, i) { return pad + (i / (data.length - 1)) * (W - pad * 2); });
    var ys = data.map(function (v) { return pad + (1 - (v - min) / (max - min)) * (H - pad * 2); });
    var grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(18,131,221,.22)');
    grad.addColorStop(1, 'rgba(18,131,221,.02)');
    ctx.beginPath();
    xs.forEach(function (x, i) { if (i === 0) ctx.moveTo(x, ys[i]); else ctx.lineTo(x, ys[i]); });
    ctx.lineTo(xs[xs.length - 1], H); ctx.lineTo(xs[0], H); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath();
    xs.forEach(function (x, i) { if (i === 0) ctx.moveTo(x, ys[i]); else ctx.lineTo(x, ys[i]); });
    ctx.strokeStyle = '#1283DD'; ctx.lineWidth = 1.75;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
    var lx = xs[xs.length - 1], ly = ys[ys.length - 1];
    ctx.beginPath(); ctx.arc(lx, ly, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#1283DD'; ctx.fill();
  }
  draw();
  if (window.ResizeObserver) new ResizeObserver(draw).observe(wrap);
})();

/* ── Enquiries topo (page-end band) ── */
(function () {
  var band = document.querySelector('.page-end');
  var cvs  = document.getElementById('enquiries-topo');
  if (!band || !cvs) return;
  var ctx = cvs.getContext('2d'), W, H;
  function resize() { W = cvs.width = band.offsetWidth; H = cvs.height = band.offsetHeight; }
  function draw() {
    var grd = ctx.createLinearGradient(0, 0, W * 0.85, H);
    grd.addColorStop(0, '#0D3560'); grd.addColorStop(0.65, '#0E4070'); grd.addColorStop(1, '#0D3560');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 0.9;
    for (var i = 0; i < 20; i++) {
      var offset = i * 18, yBase = -10 + i * 14, op = 0.10 + (i % 4) * 0.07;
      ctx.globalAlpha = op; ctx.strokeStyle = '#1283DD'; ctx.beginPath();
      for (var x = -50; x <= W + 50; x += 25) {
        var y = yBase + Math.sin((x + offset) * 0.008) * 24 + Math.sin((x + offset) * 0.018) * 14;
        if (x === -50) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    var veil = ctx.createLinearGradient(0, 0, Math.min(W * 0.42, 500), 0);
    veil.addColorStop(0, 'rgba(13,53,96,.78)'); veil.addColorStop(1, 'rgba(13,53,96,0)');
    ctx.fillStyle = veil; ctx.fillRect(0, 0, W, H);
  }
  resize(); draw();
  window.addEventListener('resize', function () { resize(); draw(); });
  if (window.ResizeObserver) new ResizeObserver(function () { resize(); draw(); }).observe(band);
})();

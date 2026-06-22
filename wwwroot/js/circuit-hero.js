/*!
 * circuit-hero.js — Hana Microelectronics
 * Animated PCB circuit canvas for the homepage hero section.
 * Extracted from v1b-circuit.jsx. Vanilla JS IIFE — no dependencies.
 *
 * Usage:
 *   <canvas id="circuit-canvas"></canvas>
 *   <script src="/js/circuit-hero.js"></script>
 *   <script>CircuitHero.init(document.getElementById('circuit-canvas'));</script>
 *
 * Or auto-init via data attribute:
 *   <canvas data-circuit-hero></canvas>
 *   (script will auto-find the canvas on DOMContentLoaded)
 */

(function (root) {
  'use strict';

  /* ── Configuration ──────────────────────────────────────── */
  var DEFAULTS = {
    gw:   90,      // horizontal grid cell size px
    gh:   68,      // vertical grid cell size px
    fill: 0.60,    // fraction of grid cells populated
    maxP: 210,     // max simultaneous pulses
    rate: 0.00042, // random fire rate per frame per node
    spd:  195,     // pulse travel speed px/s
    trl:  15,      // trail length (frames)
    dcy:  0.948,   // node activation decay per frame
    mR:   135,     // mouse influence radius px
    mS:   0.44,    // mouse influence strength
    cP:   0.62,    // pulse chain propagation probability
    cD:   6,       // max chain depth
    cF:   2,       // max fan-out per fire
    rb:   200      // rebuild connections every N frames
  };

  /* ── Colour helpers ─────────────────────────────────────── */
  function BLUE(a) { return 'rgba(18,131,221,'  + (+a.toFixed(4)) + ')'; }
  function SOFT(a) { return 'rgba(78,155,218,'  + (+a.toFixed(4)) + ')'; }
  function TINT(a) { return 'rgba(229,238,245,' + (+a.toFixed(4)) + ')'; }
  function DEEP(a) { return 'rgba(14,74,124,'   + (+a.toFixed(4)) + ')'; }

  var T = { VIA: 0, PAD: 1, HUB: 2 };

  /* ── Node ───────────────────────────────────────────────── */
  function Node(gx, gy, cfg) {
    this.gx = gx;
    this.gy = gy;
    this.x  = gx * cfg.gw + (Math.random() - 0.5) * 3;
    this.y  = gy * cfg.gh + (Math.random() - 0.5) * 3;
    var r = Math.random();
    this.type = r < 0.05 ? T.HUB : r < 0.22 ? T.PAD : T.VIA;
    this.r    = this.type === T.HUB ? 5.0 : this.type === T.PAD ? 3.5 : 2.0;
    this.a    = 0;
    this.nb   = [];
  }

  Node.prototype.activate = function (s) {
    s = s === undefined ? 1 : s;
    this.a = Math.min(1, this.a + s);
  };

  Node.prototype.fire = function (depth, fans, pulses, sparks, cfg) {
    this.activate();
    if (depth >= cfg.cD || pulses.length >= cfg.maxP || !this.nb.length) return;
    var f = fans !== null && fans !== undefined ? fans : 1 + Math.floor(Math.random() * cfg.cF);
    var shuffled = this.nb.slice().sort(function () { return Math.random() - 0.5; });
    var self = this;
    shuffled.slice(0, f).forEach(function (nb) {
      pulses.push(new Pulse(self, nb, depth, cfg, pulses, sparks));
    });
  };

  Node.prototype.draw = function (ctx) {
    var a = this.a, x = this.x, y = this.y;
    if (a > 0.008) {
      var gr = this.r * (3 + a * 9);
      var g  = ctx.createRadialGradient(x, y, 0, x, y, gr);
      g.addColorStop(0,    BLUE(0.06 + a * 0.46));
      g.addColorStop(0.38, BLUE(a * 0.14));
      g.addColorStop(1,    BLUE(0));
      ctx.beginPath();
      ctx.arc(x, y, gr, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
    if (this.type === T.PAD || this.type === T.HUB) {
      var s = this.r * (1 + a * 0.42);
      ctx.fillStyle = BLUE(0.30 + a * 0.68);
      ctx.fillRect(x - s, y - s, s * 2, s * 2);
      if (a > 0.22) {
        ctx.fillStyle = TINT(a * 0.88);
        ctx.fillRect(x - s * 0.44, y - s * 0.44, s * 0.88, s * 0.88);
      }
    } else {
      ctx.beginPath();
      ctx.arc(x, y, this.r * (1 + a * 0.38), 0, Math.PI * 2);
      ctx.strokeStyle = BLUE(0.38 + a * 0.60);
      ctx.lineWidth   = 1.3 + a * 0.8;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, this.r * 0.38, 0, Math.PI * 2);
      ctx.fillStyle = a > 0.18 ? TINT(a * 0.88) : BLUE(0.45 + a * 0.45);
      ctx.fill();
    }
  };

  /* ── Pulse ──────────────────────────────────────────────── */
  function Pulse(from, to, depth, cfg, pulses, sparks) {
    this.fx     = from.x;
    this.fy     = from.y;
    this.to     = to;
    this.t      = 0;
    this.depth  = depth;
    this.done   = false;
    this.trail  = [];
    this._cfg    = cfg;
    this._pulses = pulses;
    this._sparks = sparks;
    var dx = to.x - from.x, dy = to.y - from.y;
    this.horiz = Math.abs(dx) >= Math.abs(dy);
  }

  Object.defineProperty(Pulse.prototype, 'x', {
    get: function () { return this.fx + (this.to.x - this.fx) * this.t; }
  });
  Object.defineProperty(Pulse.prototype, 'y', {
    get: function () { return this.fy + (this.to.y - this.fy) * this.t; }
  });

  Pulse.prototype.update = function (dt) {
    var cfg = this._cfg;
    var dx = this.to.x - this.fx, dy = this.to.y - this.fy;
    var d  = Math.hypot(dx, dy);
    if (d < 1) { this.done = true; return; }
    this.trail.unshift({ x: this.x, y: this.y });
    if (this.trail.length > cfg.trl) this.trail.pop();
    this.t += cfg.spd * dt / d;
    if (this.t >= 1) {
      this.t    = 1;
      this.done = true;
      this.to.activate(1);
      var sc = this.to.type === T.HUB ? 10 : this.to.type === T.PAD ? 6 : 4;
      for (var i = 0; i < sc; i++) this._sparks.push(new Spark(this.to.x, this.to.y));
      if (Math.random() < cfg.cP) {
        this.to.fire(this.depth + 1, null, this._pulses, this._sparks, cfg);
      }
    }
  };

  Pulse.prototype.draw = function (ctx) {
    if (this.trail.length < 2) return;
    ctx.lineCap  = 'butt';
    ctx.lineJoin = 'miter';
    for (var i = 0; i < this.trail.length - 1; i++) {
      var t = 1 - i / this.trail.length;
      ctx.beginPath();
      ctx.moveTo(this.trail[i].x,     this.trail[i].y);
      ctx.lineTo(this.trail[i + 1].x, this.trail[i + 1].y);
      ctx.strokeStyle = SOFT(t * 0.70);
      ctx.lineWidth   = 1.4 + t * 0.9;
      ctx.stroke();
    }
    var x = this.x, y = this.y;
    ctx.save();
    if (this.horiz) {
      ctx.transform(1.65, 0, 0, 0.72, x - x * 1.65, y - y * 0.72);
    } else {
      ctx.transform(0.72, 0, 0, 1.65, x - x * 0.72, y - y * 1.65);
    }
    var grd = ctx.createRadialGradient(x, y, 0, x, y, 11);
    grd.addColorStop(0,    'rgba(255,255,255,1)');
    grd.addColorStop(0.25, SOFT(0.90));
    grd.addColorStop(0.60, BLUE(0.40));
    grd.addColorStop(1,    BLUE(0));
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.arc(x, y, 1.9, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fill();
  };

  /* ── Spark ──────────────────────────────────────────────── */
  function Spark(x, y) {
    this.x    = x;
    this.y    = y;
    var angles = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2, Math.PI / 4, 3 * Math.PI / 4, 5 * Math.PI / 4, 7 * Math.PI / 4];
    var θ = angles[Math.floor(Math.random() * (Math.random() < 0.6 ? 4 : 8))];
    var s = 0.5 + Math.random() * 2.8;
    this.vx   = Math.cos(θ) * s;
    this.vy   = Math.sin(θ) * s;
    this.life = 0.82 + Math.random() * 0.18;
    this.dcy  = 0.035 + Math.random() * 0.055;
    this.r    = 0.6 + Math.random() * 1.5;
  }

  Spark.prototype.update = function () {
    this.x    += this.vx;
    this.y    += this.vy;
    this.vx   *= 0.88;
    this.vy   *= 0.88;
    this.life -= this.dcy;
  };

  Spark.prototype.draw = function (ctx) {
    if (this.life <= 0) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0, this.r * this.life), 0, Math.PI * 2);
    ctx.fillStyle = SOFT(Math.max(0, this.life * 0.84));
    ctx.fill();
  };

  /* ── Ripple ─────────────────────────────────────────────── */
  function Ripple(x, y) {
    this.x    = x;
    this.y    = y;
    this.r    = 0;
    this.maxR = 240;
    this.life = 1;
    this.spd  = 430;
  }

  Ripple.prototype.update = function (dt) {
    this.r    += this.spd * dt;
    this.life  = Math.max(0, 1 - this.r / this.maxR);
  };

  Ripple.prototype.draw = function (ctx) {
    if (this.life <= 0) return;
    ctx.strokeStyle = BLUE(this.life * 0.44);
    ctx.lineWidth   = 1.5;
    ctx.strokeRect(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
    var ir = this.r * 0.50;
    if (ir > 20) {
      var il = Math.max(0, 1 - ir / this.maxR);
      ctx.strokeStyle = SOFT(il * 0.28);
      ctx.lineWidth   = 1;
      ctx.strokeRect(this.x - ir, this.y - ir, ir * 2, ir * 2);
    }
  };

  /* ── Main init ──────────────────────────────────────────── */
  function init(canvas, options) {
    if (!canvas) return;
    var cfg       = Object.assign({}, DEFAULTS, options || {});
    var ctx       = canvas.getContext('2d');
    var container = canvas.parentElement;
    var mouse     = { x: -9999, y: -9999 };

    var W = 0, H = 0;
    var nodes = [], grid = {}, pulses = [], sparks = [], ripples = [], frameN = 0;

    function resize() {
      W = canvas.width  = container.offsetWidth  || 1280;
      H = canvas.height = container.offsetHeight || 550;
    }

    function buildGrid() {
      grid = {}; nodes = [];
      var cols = Math.ceil(W / cfg.gw) + 1;
      var rows = Math.ceil(H / cfg.gh) + 1;
      for (var c = 0; c <= cols; c++) {
        for (var r = 0; r <= rows; r++) {
          if (Math.random() < cfg.fill) {
            var n = new Node(c, r, cfg);
            nodes.push(n);
            grid[c + ',' + r] = n;
          }
        }
      }
    }

    function buildConnections() {
      nodes.forEach(function (n) { n.nb = []; });
      nodes.forEach(function (n) {
        var R = grid[(n.gx + 1) + ',' + n.gy];
        if (R && n.nb.indexOf(R) === -1) { n.nb.push(R); R.nb.push(n); }
        var D = grid[n.gx + ',' + (n.gy + 1)];
        if (D && n.nb.indexOf(D) === -1) { n.nb.push(D); D.nb.push(n); }
      });
    }

    function initScene() {
      pulses = []; sparks = []; ripples = []; frameN = 0;
      buildGrid();
      buildConnections();
      setTimeout(function () {
        for (var i = 0; i < 10; i++) {
          var n = nodes[Math.floor(Math.random() * nodes.length)];
          if (n) n.fire(0, 2 + Math.floor(Math.random() * 2), pulses, sparks, cfg);
        }
      }, 80);
    }

    function onMouseMove(e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function onClick(e) {
      var rect = canvas.getBoundingClientRect();
      var cx = e.clientX - rect.left;
      var cy = e.clientY - rect.top;
      ripples.push(new Ripple(cx, cy));
      for (var i = 0; i < 20; i++) sparks.push(new Spark(cx, cy));
      var nearby = nodes
        .map(function (n) { return { n: n, d: Math.hypot(n.x - cx, n.y - cy) }; })
        .filter(function (o) { return o.d < 160; })
        .sort(function (a, b) { return a.d - b.d; })
        .slice(0, 8)
        .map(function (o) { return o.n; });
      nearby.forEach(function (n) { pulses.push(new Pulse({ x: cx, y: cy }, n, 0, cfg, pulses, sparks)); });
      if (nearby.length) { nearby[0].activate(1); nearby[0].fire(1, cfg.cF + 2, pulses, sparks, cfg); }
    }

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click',     onClick);

    var lastT = 0, frameId;

    function tick(now) {
      frameId = requestAnimationFrame(tick);
      var dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      frameN++;

      /* 1. Background */
      ctx.fillStyle = 'rgba(3,10,23,1)';
      ctx.fillRect(0, 0, W, H);

      /* 2. Breathing central vignette */
      var br   = 0.5 + 0.5 * Math.sin(now * 0.00072);
      var cGrd = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.min(W, H) * 0.58);
      cGrd.addColorStop(0, DEEP(0.058 + br * 0.040));
      cGrd.addColorStop(1, 'rgba(3,10,23,0)');
      ctx.fillStyle = cGrd;
      ctx.fillRect(0, 0, W, H);

      /* 3. Grid lines */
      ctx.save();
      ctx.strokeStyle = BLUE(0.055);
      ctx.lineWidth   = 0.5;
      for (var x = 0; x < W; x += cfg.gw) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (var y = 0; y < H; y += cfg.gh) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.restore();

      /* Periodically rebuild connections */
      if (frameN % cfg.rb === 0) buildConnections();

      /* 4. Edges */
      ctx.save();
      ctx.lineCap = 'butt';
      var seen = new Set ? new Set() : { _m: {}, has: function(k){return !!this._m[k];}, add: function(k){this._m[k]=1;} };
      nodes.forEach(function (n) {
        n.nb.forEach(function (nb) {
          var key = (n.gx < nb.gx || (n.gx === nb.gx && n.gy < nb.gy))
            ? n.gx  + ',' + n.gy  + '-' + nb.gx + ',' + nb.gy
            : nb.gx + ',' + nb.gy + '-' + n.gx  + ',' + n.gy;
          if (seen.has(key)) return;
          seen.add(key);
          var act = Math.max(n.a, nb.a);
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.strokeStyle = BLUE(0.085 + act * 0.32);
          ctx.lineWidth   = 0.9 + act * 1.1;
          ctx.stroke();
        });
      });
      ctx.restore();

      /* 5. Node decay + mouse influence */
      nodes.forEach(function (n) { n.a *= cfg.dcy; });
      nodes.forEach(function (n) {
        var d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        if (d < cfg.mR) n.activate((1 - d / cfg.mR) * cfg.mS * dt * 3.5);
      });

      /* 6. Draw nodes + random fire */
      nodes.forEach(function (n) { n.draw(ctx); });
      nodes.forEach(function (n) {
        if (n.a < 0.08 && Math.random() < cfg.rate && n.nb.length > 0) {
          n.fire(0, 1 + Math.floor(Math.random() * cfg.cF), pulses, sparks, cfg);
        }
      });

      /* 7. Pulses */
      pulses = pulses.filter(function (p) { return !p.done; });
      pulses.forEach(function (p) { p.update(dt); p.draw(ctx); });

      /* 8. Ripples */
      ripples = ripples.filter(function (r) { return r.life > 0; });
      ripples.forEach(function (r) { r.update(dt); r.draw(ctx); });

      /* 9. Sparks */
      sparks = sparks.filter(function (s) { return s.life > 0; });
      sparks.forEach(function (s) { s.update(); s.draw(ctx); });
    }

    /* Handle resize */
    var ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(function () { resize(); buildGrid(); buildConnections(); })
      : null;
    if (ro) ro.observe(container);

    resize();
    initScene();
    frameId = requestAnimationFrame(tick);

    /* Return a destroy handle */
    return {
      destroy: function () {
        cancelAnimationFrame(frameId);
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('click',     onClick);
        if (ro) ro.disconnect();
      }
    };
  }

  /* ── Auto-init ──────────────────────────────────────────── */
  function autoInit() {
    var canvases = document.querySelectorAll('[data-circuit-hero]');
    canvases.forEach(function (c) { init(c); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  root.CircuitHero = { init: init };

}(window));

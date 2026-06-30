// Group-structure org chart — renders #gsTree nodes and #gsConn connectors.
  // ── Group-structure org chart ──────────────────────────────
  (function () {
    var W = 150;                          // card width
    var H = 86, H3 = 88;                  // card heights

    // cx = horizontal center; y = top. Tiers laid out on a 1020×556 canvas.
    var N = [
      { id:'root', cx:520, y:6, w:300, h:62, root:true, pct:'100%', cur:'THB',
        name:'Hana Microelectronics Public Co., Ltd.' },

      // Tier 1 — direct subsidiaries
      { id:'omac', cx:140, y:128, pct:'100%', cur:'HKD', name:'Omac Sales Ltd.',                               fn:'Purchasing', loc:'Hong Kong' },
      { id:'inv',  cx:330, y:128, pct:'100%', cur:'USD', name:'Hana Microelectronics Investments Co., Ltd.',   fn:'Holding',    loc:'BVI' },
      { id:'cam',  cx:520, y:128, pct:'100%', cur:'USD', name:'Hana Microelectronics (Cambodia) Co., Ltd.',    fn:'Mfg & Trade', loc:'Cambodia' },
      { id:'bkk',  cx:710, y:128, pct:'100%', cur:'THB', name:'Hana Semiconductor (BKK) Co., Ltd.',            fn:'Holding',    loc:'Thailand' },
      { id:'intl', cx:900, y:128, pct:'100%', cur:'USD', name:'Hana Microelectronics International Co., Ltd.', fn:'Holding',    loc:'BVI' },

      // Tier 2
      { id:'ent',   cx:250, y:284, pct:'100%', cur:'USD', name:'Hana Microelectronics Enterprises Co., Ltd.',  fn:'Holding',       loc:'BVI' },
      { id:'macao', cx:410, y:284, pct:'100%', cur:'MOP', name:'Hana Macao Co., Ltd.',                         fn:'Customer Svc',  loc:'Macao' },
      { id:'ayut',  cx:710, y:284, pct:'100%', cur:'THB', name:'Hana Semiconductor (Ayutthaya) Co., Ltd.',     fn:'Mfg & Trade',   loc:'Thailand' },
      { id:'semi',  cx:900, y:284, pct:'100%', cur:'USD', name:'Hana Semiconductor International Ltd.',         fn:'Trading',       loc:'BVI' },

      // Tier 3
      { id:'pm',    cx:168, y:444, t3:true, pct:'100%', cur:'KRW', name:'Power Master Semiconductor Co., Ltd.', fn:'Mfg & Trade', loc:'Korea' },
      { id:'jiax',  cx:332, y:444, t3:true, pct:'100%', cur:'CNY', name:'Hana Microelectronics (Jiaxing) Co., Ltd.', fn:'Mfg & Trade', loc:'China' },
      { id:'hmi',   cx:490, y:444, t3:true, pct:'100%', cur:'USD', name:'Hana Microelectronics, Inc.',          fn:'Agent / Svc', loc:'USA' },
      { id:'tech',  cx:650, y:444, t3:true, pct:'100%', cur:'USD', name:'Hana Technologies, Inc.',              fn:'Mfg & Trade', loc:'USA' },
      { id:'ft1',   cx:900, y:444, t3:true, assoc:true, pct:'49%', cur:'THB', name:'FT1 Corporation Ltd.',      fn:'Mfg & Trade', loc:'Thailand' }
    ];

    var by = {};
    N.forEach(function (n) {
      n.w = n.w || W;
      n.h = n.h || (n.t3 ? H3 : H);
      n.left = n.cx - n.w / 2;
      by[n.id] = n;
    });

    // render cards
    var tree = document.getElementById('gsTree');
    N.forEach(function (n) {
      var el = document.createElement('div');
      el.className = 'gs-node' + (n.root ? ' root' : '') + (n.assoc ? ' assoc' : '');
      el.style.left = n.left + 'px';
      el.style.top = n.y + 'px';
      el.style.width = n.w + 'px';
      el.style.height = n.h + 'px';
      var meta = n.fn ? '<div class="gs-meta"><span>' + n.fn + '</span><span class="loc">' + n.loc + '</span></div>' : '';
      el.innerHTML =
        '<div class="gs-row"><span class="gs-pct">' + n.pct + '</span><span class="gs-cur">' + n.cur + '</span></div>' +
        '<div class="gs-nm">' + n.name + '</div>' + meta;
      tree.appendChild(el);
    });

    // connectors
    var NS = 'http://www.w3.org/2000/svg';
    var conn = document.getElementById('gsConn');
    function P(d, cls) {
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      if (cls) p.setAttribute('class', cls);
      conn.appendChild(p);
    }
    function bot(n) { return { x: n.cx, y: n.y + n.h }; }
    function top(n) { return { x: n.cx, y: n.y }; }

    function fork(parent, ids, busY) {
      var p = bot(parent);
      var ks = ids.map(function (id) { return top(by[id]); });
      var xs = ks.map(function (k) { return k.x; }).concat(p.x);
      P('M ' + p.x + ' ' + p.y + ' L ' + p.x + ' ' + busY);
      P('M ' + Math.min.apply(null, xs) + ' ' + busY + ' L ' + Math.max.apply(null, xs) + ' ' + busY);
      ks.forEach(function (k) { P('M ' + k.x + ' ' + busY + ' L ' + k.x + ' ' + k.y); });
    }
    function drop(parentId, childId, cls) {
      var p = bot(by[parentId]), c = top(by[childId]);
      var m = (p.y + c.y) / 2;
      P('M ' + p.x + ' ' + p.y + ' L ' + p.x + ' ' + m + ' L ' + c.x + ' ' + m + ' L ' + c.x + ' ' + c.y, cls);
    }

    // root → tier 1
    fork(by.root, ['omac','inv','cam','bkk','intl'], 100);
    // Investments → Enterprises + Macao
    fork(by.inv, ['ent','macao'], 248);
    // Enterprises → Power Master + Jiaxing
    fork(by.ent, ['pm','jiax'], 414);
    // Investments → US pair (routed right of Macao, through the empty gap under Cambodia)
    P('M 330 214 L 330 236 L 490 236');   // step out above tier 2, into the clear gap
    P('M 490 236 L 490 414');             // long drop in the gap
    P('M 490 414 L 650 414');             // tier-3 bus
    P('M 490 414 L 490 444');             // → HMI
    P('M 650 414 L 650 444');             // → Technologies
    // BKK → Ayutthaya
    drop('bkk','ayut');
    // International → Semiconductor International → FT1 (associate)
    drop('intl','semi');
    drop('semi','ft1','assoc');

    // edge ownership tags on Ayutthaya (split holding)
    var canvas = document.getElementById('gsCanvas');
    [{ x:710, y:250, t:'42%' }].forEach(function (g) {
      var d = document.createElement('div');
      d.className = 'gs-tag';
      d.style.left = g.x + 'px';
      d.style.top = g.y + 'px';
      d.textContent = g.t;
      canvas.appendChild(d);
    });

    // scale-to-fit the available column width
    var fit = document.querySelector('.gs-fit');
    var scale = document.getElementById('gsScale');
    var CW = 1020, CH = 556;
    function resize() {
      var avail = fit.clientWidth - 32;            // minus gs-fit horizontal padding
      var s = Math.min(avail / CW, 1.5);           // scale up to fill the full width
      scale.style.transform = 'scale(' + s + ')';
      scale.style.height = (CH * s) + 'px';
    }
    if (window.ResizeObserver) { new ResizeObserver(resize).observe(fit); }
    window.addEventListener('resize', resize);
    resize();
  })();

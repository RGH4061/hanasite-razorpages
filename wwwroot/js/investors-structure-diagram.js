// Group-structure org chart — renders #gsTree nodes and #gsConn connectors.
// Source: "HANA_Group Structure EN  TH.pptx" (Thai Translation folder, 10 Nov 2026).
// English and Thai pages share this file; <div id="gsTree" data-lang="th"> selects the Thai text.
  (function () {
    var tree = document.getElementById('gsTree');
    if (!tree) return;
    var TH = tree.getAttribute('data-lang') === 'th';

    // Six columns, as on the slide. Thai cards are taller: the names run to three lines.
    var W = 150, H = TH ? 126 : 86;
    var C = [90, 258, 426, 594, 762, 930];
    var CW = 1040;
    var Y1 = 128, Y2 = Y1 + H + 70, Y3 = Y2 + H + 72;
    var CH = Y3 + H + 34;

    // English: name, currency, function, country. Functions are shortened to fit the card.
    var N = [
      { id:'root', cx:510, y:6, w:300, h:62, root:true, pct:'100%', cur:'THB',
        name:'Hana Microelectronics Public Co., Ltd.' },

      // Tier 1: held directly by the parent
      { id:'omac', col:0, y:Y1, pct:'100%', cur:'HKD', name:'Omac Sales Ltd.',                               fn:'Purchasing',  loc:'Hong Kong' },
      { id:'inv',  col:1, y:Y1, pct:'100%', cur:'USD', name:'Hana Microelectronics Investments Co., Ltd.',   fn:'Holding',     loc:'BVI' },
      { id:'cam',  cx:510, y:Y1, pct:'100%', cur:'USD', name:'Hana Microelectronics (Cambodia) Co., Ltd.',   fn:'Mfg & Trade', loc:'Cambodia' },
      { id:'bkk',  col:4, y:Y1, pct:'100%', cur:'THB', name:'Hana Semiconductor (BKK) Co., Ltd.',            fn:'Holding',     loc:'Thailand' },
      { id:'intl', col:5, y:Y1, pct:'100%', cur:'USD', name:'Hana Microelectronics International Co., Ltd.', fn:'Holding',     loc:'BVI' },

      // Tier 2
      { id:'ent',   col:0, y:Y2, pct:'100%', cur:'USD', name:'Hana Microelectronics Enterprises Co., Ltd.', fn:'Holding',       loc:'BVI' },
      { id:'macao', col:1, y:Y2, pct:'100%', cur:'MOP', name:'Hana Macao Co., Ltd.',                        fn:'Customer Svc',  loc:'Macau' },
      { id:'hmi',   col:2, y:Y2, pct:'100%', cur:'USD', name:'Hana Microelectronics, Inc.',                 fn:'Agent & Svc',   loc:'USA' },
      { id:'tech',  col:3, y:Y2, pct:'100%', cur:'USD', name:'Hana Technologies, Inc.',                     fn:'Mfg & Trade',   loc:'USA' },
      { id:'ayut',  col:4, y:Y2, pct:'100%', cur:'THB', name:'Hana Semiconductor (Ayutthaya) Co., Ltd.',    fn:'Mfg & Trade',   loc:'Thailand' },
      { id:'semi',  col:5, y:Y2, pct:'100%', cur:'USD', name:'Hana Semiconductor International Ltd.',        fn:'Trading',       loc:'BVI' },

      // Tier 3
      { id:'pm',   col:0, y:Y3, pct:'100%', cur:'KRW', name:'Power Master Semiconductor Co., Ltd.',      fn:'Mfg & Trade', loc:'Korea' },
      { id:'jiax', col:1, y:Y3, pct:'100%', cur:'USD', name:'Hana Microelectronics (Jiaxing) Co., Ltd.', fn:'Mfg & Trade', loc:'China' },
      { id:'sha',  col:3, y:Y3, pct:'100%', cur:'CNY', name:'Hana (Shanghai) Technologies Co., Ltd.',    fn:'Trading',     loc:'China' },
      { id:'ft1',  col:5, y:Y3, assoc:true, pct:'49%', cur:'THB', name:'FT1 Corporation Ltd.',           fn:'Mfg & Trade', loc:'Thailand' }
    ];

    // Thai: approved text from slide 2 of the same deck.
    var T = {
      root:  { name:'บริษัท ฮานา ไมโครอิเล็คโทรนิคส จำกัด (มหาชน)', cur:'บาท' },
      omac:  { name:'บริษัท โอแมค เซลล์ จํากัด', cur:'เหรียญฮ่องกง', fn:'จัดซื้อ', loc:'ฮ่องกง' },
      inv:   { name:'บริษัท ฮานา ไมโครอิเล็คโทรนิคส อินเวสเมนท์ จำกัด', cur:'เหรียญสหรัฐ', fn:'ลงทุน', loc:'หมู่เกาะบริติชเวอร์จิน' },
      cam:   { name:'บริษัท ฮานา ไมโครอิเล็คโทรนิคส (กัมพูชา) จำกัด', cur:'เหรียญสหรัฐ', fn:'ผลิตและจำหน่าย', loc:'กัมพูชา' },
      bkk:   { name:'บริษัท ฮานา เซมิคอนดักเตอร์ (กรุงเทพ) จำกัด', cur:'บาท', fn:'ลงทุน', loc:'ประเทศไทย' },
      intl:  { name:'บริษัท ฮานา ไมโครอิเล็คโทรนิคส อินเตอร์เนชั่นแนล จำกัด', cur:'เหรียญสหรัฐ', fn:'ลงทุน', loc:'หมู่เกาะบริติชเวอร์จิน' },
      ent:   { name:'บริษัท ฮานา ไมโครอิเล็คโทรนิคส เอ็นเตอร์ไพรส์ จำกัด', cur:'เหรียญสหรัฐ', fn:'ลงทุน', loc:'หมู่เกาะบริติชเวอร์จิน' },
      macao: { name:'บริษัท ฮานา มาเก๊า จํากัด', cur:'ปาตากา', fn:'บริการลูกค้า', loc:'มาเก๊า' },
      hmi:   { name:'บริษัท ฮานา ไมโครอิเล็คโทรนิคส อิงค์ จำกัด', cur:'เหรียญสหรัฐ', fn:'ตัวแทนจำหน่ายและบริการลูกค้า', loc:'สหรัฐอเมริกา' },
      tech:  { name:'บริษัท ฮานา เทคโนโลยี อิงค์ จํากัด', cur:'เหรียญสหรัฐ', fn:'ผลิตและจำหน่าย', loc:'สหรัฐอเมริกา' },
      ayut:  { name:'บริษัท ฮานา เซมิคอนดักเตอร์ (อยุธยา) จำกัด', cur:'บาท', fn:'ผลิตและจำหน่าย', loc:'ประเทศไทย' },
      semi:  { name:'บริษัท ฮานา เซมิคอนดักเตอร์ อินเตอร์เนชั่นแนล จำกัด', cur:'เหรียญสหรัฐ', fn:'จัดจำหน่าย', loc:'หมู่เกาะบริติชเวอร์จิน' },
      pm:    { name:'บริษัท พาวเวอร์ มาสเตอร์ เซมิคอนดักเตอร์ จำกัด', cur:'วอน', fn:'ผลิตและจำหน่าย', loc:'เกาหลี' },
      jiax:  { name:'บริษัท ฮานา ไมโครอิเล็คโทรนิคส (เจียซิง) จำกัด', cur:'เหรียญสหรัฐ', fn:'ผลิตและจำหน่าย', loc:'จีน' },
      sha:   { name:'บริษัท ฮานา (เซี่ยงไฮ้) เทคโนโลยี จํากัด', cur:'หยวน', fn:'จัดจำหน่าย', loc:'จีน' },
      ft1:   { name:'บริษัท เอฟทีวัน คอร์เปอเรชั่น จำกัด', cur:'บาท', fn:'ผลิตและจำหน่าย', loc:'ประเทศไทย' }
    };
    var NOTE_AYUT = TH ? 'สัดส่วนการถือหุ้นรวมของกลุ่ม: 100%' : 'Total group interest: 100%';
    var NOTE_FT1  = TH ? 'บริษัท ฮานา ไมโครอิเล็คโทรนิคส จำกัด (มหาชน) ถือหุ้นโดยตรง 49%' : '49% held directly by Hana PCL';

    var by = {};
    N.forEach(function (n) {
      if (TH && T[n.id]) for (var k in T[n.id]) n[k] = T[n.id][k];
      if (n.cx == null) n.cx = C[n.col];
      n.w = n.w || W;
      n.h = n.h || H;
      n.left = n.cx - n.w / 2;
      by[n.id] = n;
    });

    // canvas size follows the layout
    var canvas = document.getElementById('gsCanvas');
    var conn = document.getElementById('gsConn');
    canvas.style.width = CW + 'px';
    canvas.style.height = CH + 'px';
    conn.style.width = CW + 'px';
    conn.style.height = CH + 'px';
    conn.setAttribute('viewBox', '0 0 ' + CW + ' ' + CH);

    // render cards
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
    function P(d, cls) {
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      if (cls) p.setAttribute('class', cls);
      conn.appendChild(p);
    }
    function L(pts, cls) {
      P('M ' + pts.map(function (q) { return q[0] + ' ' + q[1]; }).join(' L '), cls);
    }
    function bot(n) { return n.y + n.h; }
    function fork(parentId, ids, busY) {
      var p = by[parentId];
      var xs = ids.map(function (id) { return by[id].cx; }).concat(p.cx);
      L([[p.cx, bot(p)], [p.cx, busY]]);
      L([[Math.min.apply(null, xs), busY], [Math.max.apply(null, xs), busY]]);
      ids.forEach(function (id) { L([[by[id].cx, busY], [by[id].cx, by[id].y]]); });
    }
    function drop(parentId, childId) {
      L([[by[parentId].cx, bot(by[parentId])], [by[childId].cx, by[childId].y]]);
    }

    // parent → tier 1
    fork('root', ['omac', 'inv', 'cam', 'bkk', 'intl'], 100);
    // Investments → Enterprises, Macao, Hana Microelectronics Inc., Hana Technologies
    fork('inv', ['ent', 'macao', 'hmi', 'tech'], Y2 - 36);
    // Enterprises → Power Master, Jiaxing
    fork('ent', ['pm', 'jiax'], Y3 - 30);
    // Hana Technologies → Hana (Shanghai) Technologies
    drop('tech', 'sha');
    // International → Semiconductor International
    drop('intl', 'semi');
    // Ayutthaya: 42% through BKK, 58% held directly by the parent
    drop('bkk', 'ayut');
    var gapX = 636, ayIn = by.ayut.cx - 21;
    L([[gapX, 100], [gapX, Y2 - 22], [ayIn, Y2 - 22], [ayIn, Y2]]);
    // FT1 (associate): 49% held directly by the parent, routed down the right edge
    var edgeX = 1024;
    L([[by.intl.cx, 100], [edgeX, 100], [edgeX, Y3 - 30], [by.ft1.cx, Y3 - 30], [by.ft1.cx, Y3]], 'assoc');

    // ownership tags on the two Ayutthaya lines
    function tag(x, y, t) {
      var d = document.createElement('div');
      d.className = 'gs-tag';
      d.style.left = x + 'px';
      d.style.top = y + 'px';
      d.textContent = t;
      canvas.appendChild(d);
    }
    tag(by.ayut.cx, Y1 + H + 34, '42%');
    tag(gapX, Y1 + H + 10, '58%');

    // notes under Ayutthaya and FT1
    function note(n, t) {
      var d = document.createElement('div');
      d.className = 'gs-note';
      d.style.left = (n.cx - 90) + 'px';
      d.style.top = (bot(n) + 7) + 'px';
      d.textContent = t;
      canvas.appendChild(d);
    }
    note(by.ayut, NOTE_AYUT);
    note(by.ft1, NOTE_FT1);

    // scale-to-fit the available column width
    var fit = document.querySelector('.gs-fit');
    var scale = document.getElementById('gsScale');
    function resize() {
      var avail = fit.clientWidth - 32;            // minus gs-fit horizontal padding
      var s = Math.min(avail / CW, 1.5);           // scale up to fill the full width
      // Below a readable floor the chart scrolls sideways instead of shrinking further.
      var MIN = 0.62;
      if (s < MIN) { s = MIN; fit.style.overflowX = 'auto'; }
      else { fit.style.overflowX = 'hidden'; }
      scale.style.transform = 'scale(' + s + ')';
      scale.style.width = (CW * s) + 'px';
      scale.style.height = (CH * s) + 'px';
    }
    if (window.ResizeObserver) { new ResizeObserver(resize).observe(fit); }
    window.addEventListener('resize', resize);
    resize();
  })();

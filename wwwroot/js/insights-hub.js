// Insights hub: Format + Topic filters, featured article, latest industry updates box.
// Industry updates appear only in the updates box, never in the grid or filters.
// Filter state mirrors to ?topic=…&format=… (canonical stays /insights).
(function () {
  var FORMATS = [
    { id: 'guide', name: 'Guides', one: 'Guide', hint: 'What to check, how to choose' },
    { id: 'explainer', name: 'Explainers', one: 'Explainer', hint: 'How a process or technology works' },
    { id: 'site', name: 'Hana profiles', one: 'Hana profile', hint: 'A look inside Hana\u2019s manufacturing ecosystem' }
  ];
  var TOPICS = [
    { id: 'automotive', name: 'Automotive & electrification', desc: 'Vehicle electronics, EV power and charging, sensors and RFID in automotive programs.', links: [['Automotive market', '/markets/automotive'], ['Automotive power modules', '/markets/automotive/power-modules']] },
    { id: 'power', name: 'Power electronics', desc: 'SiC and GaN devices, power modules, power packaging and power management.', links: [['Power packages', '/capabilities/osat/power-packages'], ['Power management market', '/markets/power-management']] },
    { id: 'datacenter', name: 'AI data-center infrastructure', desc: 'The hardware around AI compute: power delivery, thermal management, optical interconnect and test.', links: [['Data centers market', '/markets/data-centers']] },
    { id: 'optical', name: 'Optical & sensors', desc: 'Optical components and transceivers, camera modules, MEMS and sensor packaging.', links: [['Optical packaging', '/capabilities/osat/optical-packaging'], ['Optical & sensors market', '/markets/optical-sensors']] },
    { id: 'rfid', name: 'RFID & access control', desc: 'RFID inlays, cards and tags, and electronics for access control and smart locks.', links: [['RFID & smart tags', '/capabilities/rfid-smart-tags'], ['Access control market', '/markets/access-control']] },
    { id: 'industrial', name: 'Industrial & IoT', desc: 'Industrial controllers, connected devices and their board and box-build assembly.', links: [['Industrial & IoT market', '/markets/industrial-iot']] },
    { id: 'packaging', name: 'Packaging & assembly', desc: 'OSAT and PCBA processes, test and traceability, and how to choose between them.', links: [['OSAT capabilities', '/capabilities/osat'], ['PCBA & box build', '/capabilities/pcba-box-build']] },
    { id: 'sourcing', name: 'Sourcing & supply chain', desc: 'Component supply, Asian manufacturing policy, dual-sourcing and Hana sites.', links: [['Locations', '/locations']] }
  ];
  var P = 'images/photos/';
  var ARTICLES = [
    { t: 'Thailand\u2019s semiconductor strategy: real foundations, open questions', f: 'update', tp: 'sourcing', d: '2026-10-06', r: 4, href: '/insights/commentary/thailand-semiconductor-strategy' },
    { t: 'External laser source modules for co-packaged optics: what to watch', f: 'update', tp: 'datacenter', d: '2026-10-08', r: 3, href: '/insights/commentary/external-laser-source-co-packaged-optics' },
    { t: 'Global vehicle sales forecast: what a hybrid-weighted mix means for electronics', f: 'update', tp: 'automotive', d: '2026-10-08', r: 3, href: '/insights/commentary/global-vehicle-sales-forecast' },
    { t: 'Memory contract prices in 4Q26: what rising DRAM and NAND costs mean for PCBA', f: 'update', tp: 'sourcing', d: '2026-10-08', r: 3, href: '/insights/commentary/memory-contract-prices-pcba' },
    { t: 'Power GaN market forecast: what the 2031 outlook means for packaging', f: 'update', tp: 'power', d: '2026-10-08', r: 3, href: '/insights/commentary/power-gan-market-forecast' },
    { t: 'SiC substrate market recovery: what it means for power packaging', f: 'update', tp: 'power', d: '2026-10-08', r: 3, href: '/insights/commentary/sic-substrate-market-recovery' },
                { t: 'How RFID inlays are manufactured and tested', f: 'explainer', tp: 'rfid', s: 'From antenna and chip attach to conversion and testing, the process behind high-volume RFID inlays.', r: 6, featured: true, img: P + 'mk-rfid-hero.webp' },
    { t: 'PCB Assembly for Automotive Electronics', f: 'explainer', tp: 'automotive', s: 'Fine-pitch SMT, inspection on every board, and IATF 16949 discipline across Thailand and China.', r: 5, href: '/insights/automotive-pcba-assembly', img: P + 'homepage-markets-automotive.webp' },
  ];

  var state = { format: 'all', topic: 'all' };
  function find(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function esc(x) { return String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function fmtDate(d) { return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
  function pill(f) { return '<span class="ins-cpill' + (f === 'site' ? ' ins-cpill--site' : '') + '">' + find(FORMATS, f).one + '</span>'; }
  function tags(a) { return '<div class="ins-tags">' + pill(a.f) + '<span class="ins-topic-tag">' + esc(find(TOPICS, a.tp).name) + '</span></div>'; }
  function card(a) {
    return '<a class="ins-card" href="' + (a.href || '#') + '"><div class="thumb">' + (a.img ? '<img src="' + a.img + '" alt="" loading="lazy"/>' : '') + '</div>' +
      '<div class="body">' + tags(a) + '<h3>' + esc(a.t) + '</h3><p>' + esc(a.s) + '</p><div class="ins-meta">' + a.r + ' min read</div></div></a>';
  }
  var evergreen = ARTICLES.filter(function (a) { return a.f !== 'update'; });

  function buildNav(el, list, key, stateKey, allName) {
    function count(id) { return evergreen.filter(function (a) { return id === 'all' || a[key] === id; }).length; }
    var items = [{ id: 'all', name: allName }].concat(list).filter(function (x) { return count(x.id) > 0; });
    el.innerHTML = items.map(function (x) {
      return '<li><button type="button" data-id="' + x.id + '">' + esc(x.name) + ' <span class="count">' + count(x.id) + '</span>' + (x.hint ? '<span class="hint">' + x.hint + '</span>' : '') + '</button></li>';
    }).join('');
    el.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { state[stateKey] = b.getAttribute('data-id'); apply(true); }); });
  }

  function apply(push) {
    var vis = evergreen.filter(function (a) { return (state.format === 'all' || a.f === state.format) && (state.topic === 'all' || a.tp === state.topic); });
    document.getElementById('insGrid').innerHTML = vis.map(card).join('');
    document.getElementById('insEmpty').style.display = vis.length ? 'none' : 'block';
    document.getElementById('riCount').textContent = vis.length + (vis.length === 1 ? ' article' : ' articles');
    document.getElementById('insReset').hidden = state.format === 'all' && state.topic === 'all';
    document.querySelectorAll('#insFormatNav button').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-id') === state.format); });
    document.querySelectorAll('#insTopicNav button').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-id') === state.topic); });
    var th = document.getElementById('insTopicHead'), t = find(TOPICS, state.topic);
    th.classList.toggle('show', !!t);
    th.innerHTML = t ? '<h2>' + esc(t.name) + '</h2><p>' + t.desc + '</p><div class="links">' + t.links.map(function (l) { return '<a href="' + l[1] + '">' + esc(l[0]) + ' &rarr;</a>'; }).join('') + '</div>' : '';
    if (push) {
      var q = new URLSearchParams();
      if (state.topic !== 'all') q.set('topic', state.topic);
      if (state.format !== 'all') q.set('format', state.format);
      try { history.replaceState(null, '', q.toString() ? '?' + q : location.pathname); } catch (e) {}
    }
  }

  var feat = ARTICLES.filter(function (a) { return a.featured; })[0];
  var fe = document.getElementById('insFeatured');
  fe.href = feat.href || '#';
  fe.innerHTML = '<div class="img">' + (feat.img ? '<img src="' + feat.img + '" alt=""/>' : '') + '</div><div class="body">' + tags(feat) + '<h2>' + esc(feat.t) + '</h2><p>' + esc(feat.s) + '</p><div class="ins-meta">' + feat.r + ' min read</div></div>';

  var UPDATES = ARTICLES.filter(function (a) { return a.f === 'update'; }).sort(function (a, b) { return b.d.localeCompare(a.d); });
  var shown = 4, more = document.getElementById('insAllUpdates');
  function renderUpdates() {
    document.getElementById('insUpdList').innerHTML = UPDATES.slice(0, shown).map(function (a) {
      return '<a class="ins-upd-item" href="' + (a.href || '#') + '"><div class="ins-meta">' + fmtDate(a.d) + ' &middot; ' + esc(find(TOPICS, a.tp).name) + '</div><h3>' + esc(a.t) + '</h3></a>';
    }).join('');
    more.hidden = shown >= UPDATES.length;
  }
  more.addEventListener('click', function () { shown += 6; renderUpdates(); });
  renderUpdates();

  document.getElementById('insReset').addEventListener('click', function () { state.format = 'all'; state.topic = 'all'; apply(true); });
  buildNav(document.getElementById('insFormatNav'), FORMATS, 'f', 'format', 'All formats');
  buildNav(document.getElementById('insTopicNav'), TOPICS, 'tp', 'topic', 'All topics');
  var q = new URLSearchParams(location.search);
  if (find(TOPICS, q.get('topic'))) state.topic = q.get('topic');
  if (find(FORMATS, q.get('format'))) state.format = q.get('format');
  apply(false);
})();

/* Site search — header field + dropdown, and the /search page renderer.
   Plain JS. Requires js/search/data.js and js/search/engine.js, and css/search.css. */
(function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const SEC_ABBR = { "Investor Relations": "Investors" };

  /* ── page URL map ──────────────────────────────────────────────
     The index carries the URL tracker's addresses; this export serves Razor routes, and
     32 of them differ. Built from the @page directives under Pages/ at export time — when
     a route is renamed, regenerate this map rather than hand-patching links. Anything not
     listed already matches its route once the trailing slash is dropped. */
  const ROUTE = {
    "/about/why-hana": "/about",
    "/about/heritage": "/about/history",
    "/about/awards": "/about/quality",
    "/capabilities/pcba-box-build/chip-on-board": "/capabilities/pcba-box-build/cob-assembly",
    /* Renamed in the Aug 2026 restructure — the index address is /clear-mold-packaging,
       the Razor page is /optical-packaging (site owner, 14 Aug 2026). */
    "/capabilities/osat/clear-mold-packaging": "/capabilities/osat/optical-packaging",
    "/capabilities/microelectronic-assembly/flip-chip": "/capabilities/microelectronic-assembly/precision-flip-chip",
    "/capabilities/microelectronic-assembly/interconnect-solutions": "/capabilities/microelectronic-assembly/precision-interconnect",
    "/capabilities/rfid": "/capabilities/rfid-smart-tags",
    "/capabilities/dfx-jdm/design-for-excellence": "/capabilities/dfx-jdm/dfx-dfm",
    "/capabilities/dfx-jdm/joint-development-model": "/capabilities/dfx-jdm/jdm",
    "/capabilities/dfx-jdm/new-product-introduction": "/capabilities/dfx-jdm/npi",
    "/markets/automotive/pcba": "/markets/automotive/automotive-pcba",
    "/markets/consumer-electronics": "/markets/consumer",
    "/markets/consumer-electronics/smt-sensors": "/markets/consumer/smt-sensors",
    "/markets/consumer-electronics/wireless-charging": "/markets/consumer/wireless-charging",
    "/markets/telecommunications": "/markets/telecom",
    "/markets/telecommunications/rf-assembly": "/markets/telecom/rf-assembly",
    "/locations/thailand/ayutthaya": "/locations/ayutthaya",
    "/locations/thailand/lamphun": "/locations/lamphun",
    "/locations/china/jiaxing": "/locations/jiaxing",
    "/locations/cambodia/koh-kong": "/locations/koh-kong",
    "/locations/usa/ohio": "/locations/ohio",
    "/investor-relations/investor-news": "/investor-relations/news",
    "/investor-relations/annual-report": "/investor-relations/annual",
    "/investor-relations/governance-documents": "/investor-relations/governance",
    "/investor-relations/group-structure-shareholders": "/investor-relations/structure",
    "/investor-relations/sustainability": "/investor-relations/esg",
    "/investor-relations/events-contact": "/investor-relations/contact",
    "/investor-relations/faqs": "/investor-relations/faq",
    "/news": "/insights"
  };
  /* Index address -> Razor route. Trailing slashes are dropped (the homepage keeps its
     single slash); an #anchor is carried through. null means no page, so the row renders
     unlinked rather than 404ing. */
  function href(u) {
    const hash = (String(u).match(/#.+$/) || [""])[0];
    const path = String(u).replace(/#.+$/, "");
    const key = path.length > 1 ? path.replace(/\/+$/, "") : "/";
    if (key in ROUTE) return ROUTE[key] ? ROUTE[key] + hash : null;
    return key + hash;
  }

  function query(q, opts) {
    const res = window.HS.search(q, opts);
    res.groups = res.groups
      .map(g => ({ section: g.section, items: g.items.filter(r => !r.p.anchor) }))
      .filter(g => g.items.length);
    res.total = res.groups.reduce((n, g) => n + g.items.length, 0);
    return res;
  }

  function resultRow(r) {
    const p = r.p;
    /* Anchor results need ids that this export's pages don't carry yet — the
       design for them lives in the placement concepts, not in this build. */
    const f = href(p.u);
    const dead = !f;
    const tag = dead ? "span" : "a";
    return `<${tag}${dead ? "" : ` href="${esc(f)}"`} class="hs-res${dead ? " hs-res--dead" : ""}">
      <span class="hs-res-b">
        <span class="hs-res-t">${esc(p.n)}
          ${dead ? `<span class="hs-chip warm">${p.miss ? "Page not yet written" : "Not in this export"}</span>` : ""}</span>
        <span class="hs-res-d">${esc(p.k || "")}</span>
        <span class="hs-res-u">${esc(p.u)}</span>
      </span>
      ${dead ? "" : `<span class="hs-res-go">&rarr;</span>`}</${tag}>`;
  }

  function certCard(c) {
    const S = window.HS.SITES, total = Object.keys(S).length;
    const open = c.sites.filter(s => s.unconfirmed).length;
    const none = c.sites.length - open === 0;
    const line = none
      ? `Stated in the 2026 deck for ${c.sites.length} of ${total} sites. No certificate supplied for any of them — not publishable yet.`
      : `Held at ${c.sites.length} of ${total} Hana sites` + (open ? ` · ${open} awaiting certificate detail from the plant` : "");
    const rows = c.sites.map(s => {
      const st = S[s.s], tbc = !!s.unconfirmed;
      return `<a href="${esc(href(st.u))}" class="hs-cert-r${tbc ? " tbc" : ""}">
        <span class="hs-c-site"><b>${esc(st.n)}</b><small>${esc(st.c)}</small></span>
        ${tbc
          ? `<span class="hs-c-tbc"><span class="hs-chip warm">To confirm</span></span>`
          : `<span class="hs-c-num">${esc(s.num)}</span><span class="hs-c-body">${esc(s.date)}</span>`}
        <span class="hs-c-go">&rarr;</span>
        ${s.note ? `<span class="hs-c-note">${esc(s.note)}</span>` : ""}</a>`;
    }).join("");
    return `<section class="hs-cert${none ? " hs-cert--none" : ""}">
      <div class="hs-cert-h">
        <div class="hs-cert-lb">Direct answer · certification</div>
        <h2 class="hs-cert-n">${esc(c.full)}</h2>
        <p class="hs-cert-s">${esc(c.scope)}</p>
        <div class="hs-cert-c"><span class="hs-dot${none ? " warm" : ""}"></span><span>${esc(line)}</span></div>
      </div>
      <div class="hs-cert-tb">
        <div class="hs-cert-hr"><span>Site</span><span>Certificate</span><span>Date</span><span></span></div>
        ${rows}
      </div>
      <div class="hs-cert-f">
        <p>Each site links to its location page, where the certificate PDF can be downloaded.</p>
        <p class="hs-src">Sourced from the current quality pages and the 2026 company overview deck.</p>
      </div></section>`;
  }

  /* ── package card ─────────────────────────────────────────────
     The parametric handoff. A query that reads as a package — a real dimension, a known
     family, an automotive grade — is answered with rows rather than pages, and hands off
     to the finder pre-filtered. No status column: the card says what a package is, not
     whether it is available. */
  /* Thickness, worked out the way the package finder does it: a row's own figure where the
     reference gives one (sometimes inside a note, e.g. "Clear transfer mold 0.60 mm"); an LGA's
     third body dimension; and for DFN and QFN bodies the thickness ladder, since those are built
     to set classes (uDFN = 0.50 mm and so on). Everything else has no published thickness. */
  const THK_NUM = s => { const n = /(\d+(?:\.\d+)?)\s*mm/.exec(String(s || "")); return n ? parseFloat(n[1]) : null; };
  let ladder = null;
  function thkSteps() {
    if (!ladder) ladder = [...new Set((window.HS_PACKAGES || []).filter(r => r.t === "Package thickness")
      .map(r => THK_NUM(r.thk)).filter(v => v !== null))].sort((a, b) => a - b);
    return ladder;
  }
  const fmt = v => v.toFixed(2);
  function thkCell(r) {
    const own = THK_NUM(r.thk);
    if (own !== null) return (/minimum/i.test(r.thk) ? "min " : "") + fmt(own) + " mm";
    if (r.z) return fmt(parseFloat(r.z)) + " mm";
    const s = thkSteps();
    /* The leadless ladder is for standard DFN/QFN bodies; sensor packages are custom builds. */
    if (s.length && /DFN|QFN/i.test(r.pkg) && r.t !== "Sensor packages") return fmt(s[0]) + "&ndash;" + fmt(s[s.length - 1]) + " mm";
    return "—";
  }
  function thkOptions(rows) {
    const s = thkSteps();
    if (!s.length || !rows.some(r => /DFN|QFN/i.test(r.pkg) && r.t !== "Sensor packages")) return "";
    return `<p class="hs-pkg-thk"><b>Leadless thickness options</b>${s.map(v => `<span>${fmt(v)}</span>`).join("")}<em>mm</em></p>`;
  }

  /* A bare "sensor(s)" search: sensor packages as one category, broken down by sensor type,
     each type linking to its filtered finder view. Types past three rows collapse behind a
     "Show more" row (23 Oct 2026). */
  const SENSOR_TYPES = [
    { label: "LiDAR (ADAS)", qs: "q=lidar", test: r => /lidar/i.test(r.pkg + " " + r.st) },
    { label: "Pressure", qs: "cat=Sensor%20packages&q=pressure", test: r => /pressure/i.test(r.pkg) },
    { label: "Humidity &amp; temperature", qs: "cat=Sensor%20packages&q=humidity", test: r => /humidity/i.test(r.pkg) },
    { label: "Optical", qs: "cat=Optical%20package%20dimensions", test: r => r.t === "Optical package dimensions" || /time-of-flight/i.test(r.pkg) }
  ];
  const SENSOR_SHOW = 3;
  function sensorCard(m, mobile) {
    const finder = qs => "/capabilities/osat/package-finder" + (qs ? "?" + qs : "");
    /* "automotive sensors" narrows the rows in the engine; here it only renames the card and
       points the Optical type at the one automotive optical part, the time-of-flight package. */
    const auto = !!m.autoSensor;
    const types = SENSOR_TYPES.map(g => ({ ...g, rows: m.rows.filter(g.test) })).filter(g => g.rows.length)
      .map(g => auto && g.label === "Optical" ? { ...g, label: "Optical (time-of-flight)", qs: "q=time-of-flight" } : g);
    /* Each row links to the page that owns it, under a short name — the column heading
       ("Sensor page") carries the context. Unlisted owners fall back to the index name. */
    const PAGE_SHORT = {
      "/markets/automotive/sensor-assembly": "Automotive Sensors",
      "/capabilities/microelectronic-assembly/mems-sensor-assembly": "MEMS &amp; Sensor",
      "/capabilities/osat/ultra-small-packages": "Ultra-small",
      "/capabilities/osat/hermetic-ceramic": "Hermetic &amp; Ceramic",
      "/capabilities/osat/clear-mold-packaging": "Clear &amp; Optical"
    };
    const pageCell = r => {
      const name = PAGE_SHORT[r.own] || esc((window.HS.PAGES.find(pg => pg.u === r.own + "/") || {}).n || "");
      const h = href(r.own + "/");
      return h && name ? `<a class="hs-sens-pg" href="${esc(h)}">${name} &rarr;</a>` : "—";
    };
    const build = r => esc(r.grade ? "Automotive-qualified, " + r.grade : (r.detail || r.thk || "—"));
    return `<section class="hs-pkg hs-pkg--sensor${mobile ? " hs-pkg--m" : ""}">
      <div class="hs-pkg-h">
        <div class="hs-cert-lb">Direct answer &middot; ${auto ? "automotive sensors" : "sensor packages"}</div>
        <h2 class="hs-cert-n">${auto ? "Automotive sensor packages" : "Sensor packages"}</h2>
        <p class="hs-cert-s">${m.rows.length} packages across ${types.length} sensor types</p>
        <div class="hs-sens-types">${types.map(g => `<a href="${finder(g.qs)}">${g.label}<span>${g.rows.length}</span></a>`).join("")}</div>
      </div>
      <table class="hs-pkg-t">
        <thead><tr><th>Package</th><th>Body size</th><th>Leads</th><th>Construction</th><th>Sensor page</th></tr></thead>
        ${types.map(g => `<tbody><tr class="hs-sens-grp"><th colspan="5">${g.label}<span>${g.rows.length}</span></th></tr>${g.rows.map((r, i) => `<tr${i >= SENSOR_SHOW ? ' class="hs-sens-x"' : ""}>
          <td class="hs-pkg-n">${esc(r.pkg)}</td>
          <td class="hs-pkg-num">${esc(r.bs || "—")}</td>
          <td class="hs-pkg-num">${r.leads.length ? esc(r.leads.join(", ")) : "—"}</td>
          <td>${build(r)}</td>
          <td>${pageCell(r)}</td></tr>`).join("")}${g.rows.length > SENSOR_SHOW
            ? `<tr class="hs-sens-more-r"><td colspan="5"><button type="button" class="hs-sens-more" data-more="${g.rows.length - SENSOR_SHOW}">Show ${g.rows.length - SENSOR_SHOW} more</button></td></tr>` : ""}</tbody>`).join("")}
      </table>
      <div class="hs-cert-f">
        <p><a href="${finder("cat=Sensor%20packages")}">Open sensor packages in the package finder &rarr;</a></p>
        <p class="hs-src">Packages from our OSAT reference. Tell us the sensor and package you are working to.</p>
      </div></section>`;
  }
  /* One delegated listener: the card is redrawn on every keystroke. */
  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest(".hs-sens-more");
    if (!b) return;
    e.preventDefault();
    const body = b.closest("tbody");
    const open = body.classList.toggle("is-open");
    b.textContent = open ? "Show fewer" : `Show ${b.dataset.more} more`;
  });

  function pkgCard(m, mobile) {
    if (m.sensor === "sensor") return sensorCard(m, mobile);
    const shown = m.rows.slice(0, 6);
    const read = [m.fam ? `family <b>${esc(m.fam.toUpperCase())}</b>` : null,
      m.dims ? `body <b>${esc(m.dims[0])} &times; ${esc(m.dims[1])} mm</b>` : null,
      m.leads ? `leads <b>${m.leads}</b>` : null,
      m.grade ? `<b>Grade ${esc(m.grade)}</b>` : null,
      m.sensor ? `sensor packages <b>${esc(m.sensor === "lidar" ? "LiDAR" : m.sensor === "adas" ? "ADAS" : m.sensor)}</b>` : null,
      m.aec ? `<b>AEC-Q100</b> graded packages` : null,
      m.aec101 ? `<b>AEC-Q101</b> qualified power packages` : null].filter(Boolean).join(" &middot; ");
    const finder = "/capabilities/osat/package-finder?" + (m.qs || "q=" + encodeURIComponent(m.raw || ""));
    return `<section class="hs-pkg${mobile ? " hs-pkg--m" : ""}">
      <div class="hs-pkg-h">
        <div class="hs-cert-lb">Direct answer &middot; package sizes</div>
        <h2 class="hs-cert-n">${m.rows.length} package${m.rows.length === 1 ? "" : "s"} match</h2>
        <p class="hs-cert-s">${read}</p>
      </div>
      <table class="hs-pkg-t">
        <thead><tr><th>Package</th><th>Body size</th><th>Leads</th><th>Thickness</th></tr></thead>
        <tbody>${shown.map(r => `<tr>
          <td class="hs-pkg-n">${esc(r.pkg)}</td>
          <td class="hs-pkg-num">${esc(r.bs || "—")}</td>
          <td class="hs-pkg-num">${r.leads.length ? esc(r.leads.join(", ")) : "—"}</td>
          <td class="hs-pkg-num">${thkCell(r)}</td></tr>`).join("")}</tbody>
      </table>
      ${thkOptions(m.rows)}
      <div class="hs-cert-f">
        <p>${m.rows.length > 6 ? `Showing 6 of ${m.rows.length}. ` : ""}<a href="${esc(finder)}">Open in the package finder &rarr;</a></p>
        <p class="hs-src">Filter the full reference by size, category and thickness.</p>
      </div>
      <div class="hs-pkg-band" data-hana-geo="band" data-geo-theme="midnight">
        <div><b>Don&rsquo;t see the size you need? We can customize packaging sizes.</b>
        <span class="hs-pkg-band-s">Tell us the body size, lead count and thickness you&rsquo;re working to, and we&rsquo;ll come back on whether it&rsquo;s in our window.</span></div>
        <a class="hs-pkg-cta" href="/contact">Tell us your target package specification</a>
      </div></section>`;
  }

  function emptyState(q) {
    return `<section class="hs-empty">
      <h2>No page matches &ldquo;${esc(q)}&rdquo;.</h2>
      <p>Nothing in the index carries that term. Start from a capability or a market, or ask us directly.</p>
      <div class="hs-empty-g">
        <a href="/capabilities" class="hs-empty-c"><span class="hs-empty-l">Browse</span><b>Capabilities</b><small>Six groups of processes</small></a>
        <a href="/markets" class="hs-empty-c"><span class="hs-empty-l">Browse</span><b>Markets</b><small>The industries we build for</small></a>
        <a href="/contact" class="hs-empty-c hs-empty-c--cta"><span class="hs-empty-l">Ask an engineer</span><b>Contact us</b><small>We answer process questions directly</small></a>
      </div></section>`;
  }

  /* ── header dropdown ─────────────────────────────────────────── */
  function initHeader() {
    const box = document.querySelector('.hana-util-bar [style*="min-width:220px"], .hana-util-bar .hs-hdr-box');
    const header = document.querySelector(".hana-header");
    if (!box || !header || !window.HS) return;

    const span = box.querySelector("span");
    if (span) span.remove();
    const input = document.createElement("input");
    input.type = "search";
    input.className = "hs-hdr-input";
    /* The bar is the only search entry on phones, so it names the package finder there. */
    const TH = document.documentElement.lang === "th";
    const DESKTOP_PH = TH ? "ค้นหาความสามารถ ขนาดแพ็กเกจ ใบรับรอง และอื่น ๆ…" : (box.dataset.placeholder || "Search capabilities, package sizes, certs and more…");
    const MOBILE_PH = TH ? "ค้นหาแพ็กเกจ ความสามารถ…" : "Search packages, capabilities…";
    const narrow = window.matchMedia("(max-width: 900px)");
    const setPh = () => { input.placeholder = narrow.matches ? MOBILE_PH : DESKTOP_PH; };
    setPh();
    if (narrow.addEventListener) narrow.addEventListener("change", setPh);
    else if (narrow.addListener) narrow.addListener(setPh);
    input.setAttribute("aria-label", TH ? "ค้นหาในเว็บไซต์" : "Search this site");
    box.appendChild(input);
    box.classList.add("hs-hdr-box");

    const panel = document.createElement("div");
    panel.className = "hs-ac";
    panel.hidden = true;
    header.appendChild(panel);

    const close = () => { panel.hidden = true; box.classList.remove("on"); };

    function draw() {
      const q = input.value.trim();
      if (!q) return close();
      const res = query(q);
      const top = res.groups.map(g => ({ section: g.section, items: g.items.slice(0, 3) }));
      const shown = top.reduce((n, g) => n + g.items.length, 0);
      panel.innerHTML = `<div class="hs-ac-in">
        ${res.cert ? certCard(res.cert) : ""}
        ${res.pkg ? pkgCard(res.pkg) : ""}
        ${shown === 0 && !res.cert && !res.pkg ? `<p class="hs-ac-none">No page matches &ldquo;${esc(q)}&rdquo;. <a href="/contact">Contact us</a> and we will answer directly.</p>` : ""}
        ${top.map(g => `<section class="hs-group">
            <h2 class="hs-group-h">${esc(SEC_ABBR[g.section] || g.section)}<span>${g.items.length}</span></h2>
            <div class="hs-group-b">${g.items.map(resultRow).join("")}</div></section>`).join("")}
        ${res.total > shown || res.pkg ? `<a class="hs-ac-all" href="/search?q=${encodeURIComponent(q)}">See all ${res.total} results<span>&rarr;</span></a>` : ""}
      </div>`;
      if (window.HanaGeo) window.HanaGeo.init(panel);
      panel.hidden = false;
      box.classList.add("on");
    }

    input.addEventListener("input", draw);
    input.addEventListener("focus", draw);
    input.addEventListener("keydown", e => {
      if (e.key === "Escape") { input.blur(); close(); }
      if (e.key === "Enter" && input.value.trim()) location.href = "/search?q=" + encodeURIComponent(input.value.trim());
    });
    document.addEventListener("click", e => { if (!box.contains(e.target) && !panel.contains(e.target)) close(); });
  }

  /* ── /search page ────────────────────────────────────────────── */
  function initPage() {
    const root = document.getElementById("hs-search-page");
    if (!root || !window.HS) return;
    const field = root.querySelector("#hs-q");
    let sec = null;

    function draw() {
      const q = field.value.trim();
      const res = q ? query(q) : { groups: [], total: 0, cert: null, pkg: null };
      const groups = sec ? res.groups.filter(g => g.section === sec) : res.groups;
      const shown = groups.reduce((n, g) => n + g.items.length, 0);
      const answers = (res.cert ? 1 : 0) + (res.pkg ? 1 : 0);
      root.querySelector("#hs-body").innerHTML = !q ? "" : `
        <div class="hs-countline">${res.total === 0 && answers
          ? `<b>${answers}</b> direct answer${answers === 1 ? "" : "s"} for &ldquo;${esc(q)}&rdquo;<span class="hs-countline-x">· no page carries that term</span>`
          : `<b>${res.total}</b> ${res.total === 1 ? "result" : "results"} for &ldquo;${esc(q)}&rdquo;${answers ? `<span class="hs-countline-x">· ${answers} direct answer${answers === 1 ? "" : "s"}</span>` : ""}`}</div>
        ${res.groups.length > 1 ? `<div class="hs-filters">
          <button class="hs-fchip${sec === null ? " on" : ""}" data-sec="">All<span>${res.total}</span></button>
          ${res.groups.map(g => `<button class="hs-fchip${sec === g.section ? " on" : ""}" data-sec="${esc(g.section)}">${esc(SEC_ABBR[g.section] || g.section)}<span>${g.items.length}</span></button>`).join("")}
        </div>` : ""}
        ${res.cert && !sec ? certCard(res.cert) : ""}
        ${res.pkg && !sec ? pkgCard(res.pkg) : ""}
        ${shown === 0 && !res.cert && !res.pkg ? emptyState(q) : ""}
        ${groups.map(g => `<section class="hs-group">
            <h2 class="hs-group-h">${esc(g.section)}<span>${g.items.length}</span></h2>
            <div class="hs-group-b">${g.items.map(resultRow).join("")}</div></section>`).join("")}
        ${shown ? `<p class="hs-noindex">This page is no-indexed. Searches are logged so we can see what buyers look for and which pages are missing.</p>` : ""}`;
      if (window.HanaGeo) window.HanaGeo.init(root.querySelector("#hs-body"));
      root.querySelectorAll(".hs-fchip").forEach(b => b.addEventListener("click", () => { sec = b.dataset.sec || null; draw(); }));
      const url = q ? "?q=" + encodeURIComponent(q) : location.pathname;
      history.replaceState(null, "", url);
      document.title = q ? `${q} — search — Hana Microelectronics` : "Search — Hana Microelectronics";
    }

    field.value = new URLSearchParams(location.search).get("q") || "";
    field.addEventListener("input", () => { sec = null; draw(); });
    root.querySelector("#hs-clear").addEventListener("click", () => { field.value = ""; sec = null; draw(); field.focus(); });
    draw();
    field.focus();
  }

  /* ── mobile: the burger panel's search field ──────────────────
     At ≤900px the util bar's right cluster (and so the desktop field) is hidden
     by the site's own CSS, and mobile-nav.js ships the panel's search box as a
     dead placeholder. Wire it: suggestions inline, full answers on /search. */
  function initMobile() {
    /* the field sits at the top of the panel (.hana-mnav-top); older builds had it in the foot */
    const foot = document.querySelector(".hana-mnav-top") || document.querySelector(".hana-mnav-foot");
    if (!foot || foot.querySelector(".hs-mnav-input") || !window.HS) return false;
    const old = foot.querySelector(".hana-mnav-search");
    if (!old) return false;

    const slabel = foot.querySelector(".hana-mnav-slabel");
    if (slabel) slabel.remove();

    const box = document.createElement("div");
    box.className = "hana-mnav-search hs-mnav-box";
    box.innerHTML = old.innerHTML;
    const input = document.createElement("input");
    input.type = "search";
    input.className = "hs-mnav-input";
    const TH = document.documentElement.lang === "th";
    /* no placeholder: a short hint under the field says what can be searched */
    input.setAttribute("aria-label", TH ? "ค้นหาในเว็บไซต์" : "Search this site");
    input.setAttribute("aria-describedby", "hs-mnav-hint");
    box.appendChild(input);
    old.replaceWith(box);
    const hint = document.createElement("div");
    hint.className = "hana-mnav-hint";
    hint.id = "hs-mnav-hint";
    hint.textContent = TH ? "ค้นหาขนาดและประเภทแพ็กเกจ ความสามารถ และอื่น ๆ" : "Search for package sizes and types, capabilities and more.";
    box.after(hint);

    /* The foot is flex:0 0 auto — a list inside it steals height from the nav.
       Suggestions live at the top of the scroll region instead. */
    const scroll = document.querySelector(".hana-mnav-scroll") || foot;
    const list = document.createElement("div");
    list.className = "hs-mnav-sugg";
    list.hidden = true;
    scroll.prepend(list);

    const go = q => { location.href = "/search?q=" + encodeURIComponent(q); };

    input.addEventListener("input", () => {
      const q = input.value.trim();
      if (!q) { list.hidden = true; return; }
      const res = query(q);
      const top = res.groups.flatMap(g => g.items.map(r => ({ r, section: g.section })))
        .sort((a, b) => b.r.s - a.r.s).slice(0, 6);
      list.innerHTML = (res.cert ? `<a class="hs-mnav-s hs-mnav-s--cert" href="/search?q=${encodeURIComponent(q)}">
          <b>${esc(res.cert.full)}</b><small>Direct answer · which plants hold it</small></a>` : "")
        + (res.pkg ? `<a class="hs-mnav-s hs-mnav-s--cert" href="/capabilities/osat/package-finder?q=${encodeURIComponent(q)}">
          <b>${res.pkg.rows.length} package${res.pkg.rows.length === 1 ? "" : "s"} match</b><small>Direct answer · open in the package finder</small></a>` : "")
        + top.map(({ r, section }) => {
            const f = href(r.p.u);
            return `<a class="hs-mnav-s" ${f ? `href="${esc(f)}"` : `href="/search?q=${encodeURIComponent(q)}"`}>
              <b>${esc(r.p.n)}</b><small>${esc(SEC_ABBR[section] || section)}${f ? "" : " · not in this export"}</small></a>`;
          }).join("")
        + (res.total || res.cert ? `<a class="hs-mnav-all" href="/search?q=${encodeURIComponent(q)}">See all ${res.total} results &rarr;</a>`
            : `<p class="hs-mnav-none">No page matches &ldquo;${esc(q)}&rdquo;.</p>`);
      list.hidden = false;
    });
    input.addEventListener("keydown", e => { if (e.key === "Enter" && input.value.trim()) go(input.value.trim()); });
    return true;
  }

  function watchMobile() {
    if (initMobile()) return;
    const mo = new MutationObserver(() => { if (initMobile()) mo.disconnect(); });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ── scoped field on the capabilities hub ─────────────────────
     Capabilities only, framed as "find a process" rather than site search. */
  /* Package rows inside the scoped field. The homepage field is labelled "capabilities &
     packaging sizes", so a dimension or family query has to answer with packages, not with
     "no capability page carries that term". Compact — the finder holds the full table. */
  function capPkg(m) {
    if (!m) return "";
    const shown = m.rows.slice(0, 4);
    const read = [m.fam ? esc(m.fam.toUpperCase()) : null,
      m.dims ? `${esc(m.dims[0])} &times; ${esc(m.dims[1])} mm` : null,
      m.leads ? `${m.leads} leads` : null,
      m.grade ? `Grade ${esc(m.grade)}` : null,
      m.sensor ? `${esc(m.sensor === "lidar" ? "LiDAR" : m.sensor === "adas" ? "ADAS" : m.sensor)} sensor packages` : null,
      m.aec ? "AEC-Q100 graded" : null,
      m.aec101 ? "AEC-Q101 qualified" : null].filter(Boolean).join(" &middot; ");
    const finder = "/capabilities/osat/package-finder?" + (m.qs || "q=" + encodeURIComponent(m.raw || ""));
    return `<div class="cap-find-pkg">
      <div class="cap-find-h">Package sizes${read ? " &middot; " + read : ""}</div>
      <div class="cap-find-pkgs">${shown.map(r => `<a class="cap-find-pkgr" href="${esc(finder)}">
        <b>${esc(r.pkg)}</b><span>${esc(r.bs || "—")}</span>
        <small>${r.leads.length ? esc(r.leads.slice(0, 3).join(", ")) + (r.leads.length > 3 ? "+" : "") + "L" : ""}${r.grade ? (r.leads.length ? " &middot; " : "") + esc(r.grade) : ""}</small></a>`).join("")}</div>
      <a class="cap-find-all" href="${esc(finder)}">${m.rows.length > 4 ? `All ${m.rows.length} matching packages` : "Open"} in the package finder &rarr;</a></div>`;
  }

  function initScoped() {
    const wrap = document.getElementById("cap-find");
    if (!wrap || !window.HS) return;
    const input = wrap.querySelector("#cap-find-q");
    const out = wrap.querySelector("#cap-find-out");
    const meta = wrap.querySelector("#cap-find-meta");
    const total = window.HS.CAP_TREE.reduce((n, g) => n + g.children.length, 0);
    const rest = wrap.dataset.rest || `Searches the ${total} processes below. Type the shorthand — the index carries it or search by our categories below.`;
    meta.textContent = rest;

    const parentOf = u => (window.HS.CAP_TREE.find(g => u !== g.parent.u && u.startsWith(g.parent.u)) || {}).parent;

    input.addEventListener("input", () => {
      const q = input.value.trim();
      if (!q) { out.hidden = true; meta.textContent = rest; return; }
      const res = query(q, { section: "Capabilities", noCert: true });
      const pkg = res.pkg;
      const items = res.groups.flatMap(g => g.items).slice(0, 8);
      const groups = new Set(items.map(r => (parentOf(r.p.u) || r.p).n));
      const pkgLine = pkg ? `<b>${pkg.rows.length}</b> package${pkg.rows.length === 1 ? "" : "s"} match` : "";
      meta.innerHTML = items.length
        ? `${pkg ? pkgLine + " &middot; " : ""}<b>${items.length}</b> of ${total} processes match, across <b>${groups.size}</b> ${groups.size === 1 ? "group" : "groups"}`
        : (pkg ? pkgLine + ` in the package reference` : `Nothing in capabilities matches “${esc(q)}”`);
      out.innerHTML = capPkg(pkg) + (items.length
        ? `<div class="cap-find-g">${items.map(r => {
              const f = href(r.p.u), par = parentOf(r.p.u);
              return `<a class="cap-find-r${f ? "" : " dead"}" ${f ? `href="${esc(f)}"` : `href="/search?q=${encodeURIComponent(q)}"`}>
                <b>${esc(r.p.n)}</b><small>${esc(par ? par.n : "Capability group")}${f ? "" : " · not yet written"}</small></a>`;
            }).join("")}</div>
           <a class="cap-find-all" href="/search?q=${encodeURIComponent(q)}">Search the whole site for “${esc(q)}” &rarr;</a>`
        : (pkg ? `<a class="cap-find-all" href="/search?q=${encodeURIComponent(q)}">Search the whole site for “${esc(q)}” &rarr;</a>`
          : `<p class="cap-find-none">No capability page carries that term. <a href="/search?q=${encodeURIComponent(q)}">Search the whole site</a> or <a href="/contact">contact us</a>.</p>`));
      out.hidden = false;
    });
    input.addEventListener("keydown", e => {
      if (e.key === "Escape") { input.value = ""; out.hidden = true; meta.textContent = rest; }
    });
    document.addEventListener("click", e => { if (!wrap.contains(e.target)) out.hidden = true; });
  }

  document.addEventListener("DOMContentLoaded", () => { initHeader(); initPage(); initScoped(); watchMobile(); });
})();

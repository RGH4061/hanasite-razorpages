/* Site search — header field + dropdown, and the /search page renderer.
   Plain JS. Requires js/search/data.js and js/search/engine.js, and css/search.css. */
(function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const SEC_ABBR = { "Investor Relations": "Investors" };

  /* ── page URL map ──────────────────────────────────────────────
     The index carries live site paths; this export is flat files whose names
     don't always match. Explicit map — null means the page has no destination
     in this export, so the row renders unlinked rather than 404ing. */
  const FILE = {
    "/": "index.html",
    "/about/why-hana": "about.html", "/about/heritage": "about-history.html",
    "/about/leadership": "about-leadership.html", "/about/awards": "about-quality.html",
    "/markets/": null,
    "/markets/automotive/pcba/": "markets-automotive-automotive-pcba.html",
    "/markets/telecommunications/pcba/": null,
    "/capabilities/pcba-box-build/chip-on-board/": "capabilities-pcba-box-build-cob-assembly.html",
    "/capabilities/osat/system-in-package/": "capabilities-osat-system-in-package.html",
    "/capabilities/microelectronic-assembly/flip-chip/": "capabilities-microelectronic-assembly-flip-chip-micro.html",
    "/capabilities/microelectronic-assembly/interconnect-solutions/": "capabilities-microelectronic-assembly-precision-interconnect.html",
    "/capabilities/rfid/": "capabilities-rfid-smart-tags.html",
    "/capabilities/rfid/rfid-tire-tags/": "capabilities-rfid-smart-tags-rfid-tire-tags.html",
    "/capabilities/rfid/rfid-inlay/": "capabilities-rfid-smart-tags-rfid-inlays.html",
    "/capabilities/automation/robotic-smart-manufacturing/": "capabilities-automation-robotic-smart-manufacturing.html",
    "/capabilities/dfx-jdm/design-for-excellence/": "capabilities-dfx-jdm-dfx-dfm.html",
    "/capabilities/dfx-jdm/joint-development-model/": "capabilities-dfx-jdm-jdm.html",
    "/capabilities/dfx-jdm/new-product-introduction/": "capabilities-dfx-jdm-npi.html",
    "/capabilities/osat/ultra-small-packages/": "capabilities-osat-ultra-small-packages.html",
    "/capabilities/osat/qfn-dfn-lga/": "capabilities-osat-qfn-dfn-lga.html",
    "/capabilities/osat/package-finder/": "capabilities-osat-package-finder.html",
    /* Renamed in the Aug 2026 restructure — the URL is now /clear-mold-packaging, but the
       file keeps the old slug by decision (Rupert, 14 Aug 2026). This line is the bridge. */
    "/capabilities/osat/clear-mold-packaging/": "capabilities-osat-optical-packaging.html",
    "/locations/thailand/ayutthaya/": "locations-ayutthaya.html",
    "/locations/thailand/lamphun/": "locations-lamphun.html",
    "/locations/china/jiaxing/": "locations-jiaxing.html",
    "/locations/cambodia/koh-kong/": "locations-koh-kong.html",
    "/locations/usa/ohio/": "locations-ohio.html",
    "/investor-relations/investor-news": "investor-relations-news.html",
    "/investor-relations/group-structure-shareholders": "investor-relations-structure.html",
    "/investor-relations/annual-report": "investor-relations-annual.html",
    "/investor-relations/sustainability": "investor-relations-esg.html",
    "/investor-relations/governance-documents": "investor-relations-governance.html",
    "/investor-relations/events-contact": "investor-relations-contact.html",
    "/investor-relations/faqs": "investor-relations-faq.html",
    "/careers/bangkok": null, "/careers/ayutthaya": null, "/careers/lamphun": null, "/careers/cambodia": null,
    "/news/": "insights.html", "/faq/": null, "/code-of-conduct": null
  };
  function href(u) {
    if (u in FILE) return FILE[u];
    const clean = u.replace(/#.+$/, "").replace(/^\/|\/$/g, "");
    if (!clean) return "index.html";
    const f = clean.replace(/\//g, "-") + ".html";
    return f;
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
  function pkgCard(m, mobile) {
    const shown = m.rows.slice(0, 6);
    const read = [m.fam ? `family <b>${esc(m.fam.toUpperCase())}</b>` : null,
      m.dims ? `body <b>${esc(m.dims[0])} &times; ${esc(m.dims[1])} mm</b>` : null,
      m.leads ? `leads <b>${m.leads}</b>` : null,
      m.grade ? `<b>Grade ${esc(m.grade)}</b>` : null].filter(Boolean).join(" &middot; ");
    const finder = "capabilities-osat-package-finder.html?q=" + encodeURIComponent(m.raw || "");
    return `<section class="hs-pkg${mobile ? " hs-pkg--m" : ""}">
      <div class="hs-pkg-h">
        <div class="hs-cert-lb">Direct answer &middot; package sizes</div>
        <h2 class="hs-cert-n">${m.rows.length} package${m.rows.length === 1 ? "" : "s"} match</h2>
        <p class="hs-cert-s">${read}</p>
      </div>
      <table class="hs-pkg-t">
        <thead><tr><th>Package</th><th>Body size</th><th>Leads</th><th>Auto grade</th></tr></thead>
        <tbody>${shown.map(r => `<tr>
          <td class="hs-pkg-n">${esc(r.pkg)}</td>
          <td class="hs-pkg-num">${esc(r.bs || "—")}</td>
          <td class="hs-pkg-num">${r.leads.length ? esc(r.leads.join(", ")) : "—"}</td>
          <td>${r.grade ? `<span class="hs-grade">${esc(r.grade)}</span>` : "—"}</td></tr>`).join("")}</tbody>
      </table>
      <div class="hs-cert-f">
        <p>${m.rows.length > 6 ? `Showing 6 of ${m.rows.length}. ` : ""}<a href="${esc(finder)}">Open in the package finder &rarr;</a></p>
        <p class="hs-src">Filter the full reference by size, category and automotive grade.</p>
      </div>
      <div class="hs-pkg-band">
        <b>Don&rsquo;t see the size you need? We can customize packaging sizes.</b>
        <a class="hs-pkg-cta" href="contact.html">Tell us what you&rsquo;re building</a>
      </div></section>`;
  }

  function emptyState(q) {
    return `<section class="hs-empty">
      <h2>No page matches &ldquo;${esc(q)}&rdquo;.</h2>
      <p>Nothing in the index carries that term. Start from a capability or a market, or ask us directly.</p>
      <div class="hs-empty-g">
        <a href="capabilities.html" class="hs-empty-c"><span class="hs-empty-l">Browse</span><b>Capabilities</b><small>Six groups of processes</small></a>
        <a href="markets.html" class="hs-empty-c"><span class="hs-empty-l">Browse</span><b>Markets</b><small>The industries we build for</small></a>
        <a href="contact.html" class="hs-empty-c hs-empty-c--cta"><span class="hs-empty-l">Ask an engineer</span><b>Contact us</b><small>We answer process questions directly</small></a>
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
    const DESKTOP_PH = box.dataset.placeholder || "Search capabilities, package sizes, certs and more…";
    const MOBILE_PH = "Search package sizes, capabilities and more..";
    const narrow = window.matchMedia("(max-width: 900px)");
    const setPh = () => { input.placeholder = narrow.matches ? MOBILE_PH : DESKTOP_PH; };
    setPh();
    if (narrow.addEventListener) narrow.addEventListener("change", setPh);
    else if (narrow.addListener) narrow.addListener(setPh);
    input.setAttribute("aria-label", "Search this site");
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
        ${shown === 0 && !res.cert && !res.pkg ? `<p class="hs-ac-none">No page matches &ldquo;${esc(q)}&rdquo;. <a href="contact.html">Contact us</a> and we will answer directly.</p>` : ""}
        ${top.map(g => `<section class="hs-group">
            <h2 class="hs-group-h">${esc(SEC_ABBR[g.section] || g.section)}<span>${g.items.length}</span></h2>
            <div class="hs-group-b">${g.items.map(resultRow).join("")}</div></section>`).join("")}
        ${res.total > shown || res.pkg ? `<a class="hs-ac-all" href="search.html?q=${encodeURIComponent(q)}">See all ${res.total} results<span>&rarr;</span></a>` : ""}
      </div>`;
      panel.hidden = false;
      box.classList.add("on");
    }

    input.addEventListener("input", draw);
    input.addEventListener("focus", draw);
    input.addEventListener("keydown", e => {
      if (e.key === "Escape") { input.blur(); close(); }
      if (e.key === "Enter" && input.value.trim()) location.href = "search.html?q=" + encodeURIComponent(input.value.trim());
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

  /* ── mobile: the burger panel's search foot ───────────────────
     At ≤900px the util bar's right cluster (and so the desktop field) is hidden
     by the site's own CSS, and mobile-nav.js ships the panel's search box as a
     dead placeholder. Wire it: suggestions inline, full answers on search.html. */
  function initMobile() {
    const foot = document.querySelector(".hana-mnav-foot");
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
    input.placeholder = "Search package sizes, capabilities and more..";
    input.setAttribute("aria-label", "Search this site");
    box.appendChild(input);
    old.replaceWith(box);

    /* The foot is flex:0 0 auto — a list inside it steals height from the nav.
       Suggestions live at the top of the scroll region instead. */
    const scroll = document.querySelector(".hana-mnav-scroll") || foot;
    const list = document.createElement("div");
    list.className = "hs-mnav-sugg";
    list.hidden = true;
    scroll.prepend(list);

    const go = q => { location.href = "search.html?q=" + encodeURIComponent(q); };

    input.addEventListener("input", () => {
      const q = input.value.trim();
      if (!q) { list.hidden = true; return; }
      const res = query(q);
      const top = res.groups.flatMap(g => g.items.map(r => ({ r, section: g.section })))
        .sort((a, b) => b.r.s - a.r.s).slice(0, 6);
      list.innerHTML = (res.cert ? `<a class="hs-mnav-s hs-mnav-s--cert" href="search.html?q=${encodeURIComponent(q)}">
          <b>${esc(res.cert.full)}</b><small>Direct answer · which plants hold it</small></a>` : "")
        + (res.pkg ? `<a class="hs-mnav-s hs-mnav-s--cert" href="capabilities-osat-package-finder.html?q=${encodeURIComponent(q)}">
          <b>${res.pkg.rows.length} package${res.pkg.rows.length === 1 ? "" : "s"} match</b><small>Direct answer · open in the package finder</small></a>` : "")
        + top.map(({ r, section }) => {
            const f = href(r.p.u);
            return `<a class="hs-mnav-s" ${f ? `href="${esc(f)}"` : `href="search.html?q=${encodeURIComponent(q)}"`}>
              <b>${esc(r.p.n)}</b><small>${esc(SEC_ABBR[section] || section)}${f ? "" : " · not in this export"}</small></a>`;
          }).join("")
        + (res.total || res.cert ? `<a class="hs-mnav-all" href="search.html?q=${encodeURIComponent(q)}">See all ${res.total} results &rarr;</a>`
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
      m.grade ? `Grade ${esc(m.grade)}` : null].filter(Boolean).join(" &middot; ");
    const finder = "capabilities-osat-package-finder.html?q=" + encodeURIComponent(m.raw || "");
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
              return `<a class="cap-find-r${f ? "" : " dead"}" ${f ? `href="${esc(f)}"` : `href="search.html?q=${encodeURIComponent(q)}"`}>
                <b>${esc(r.p.n)}</b><small>${esc(par ? par.n : "Capability group")}${f ? "" : " · not yet written"}</small></a>`;
            }).join("")}</div>
           <a class="cap-find-all" href="search.html?q=${encodeURIComponent(q)}">Search the whole site for “${esc(q)}” &rarr;</a>`
        : (pkg ? `<a class="cap-find-all" href="search.html?q=${encodeURIComponent(q)}">Search the whole site for “${esc(q)}” &rarr;</a>`
          : `<p class="cap-find-none">No capability page carries that term. <a href="search.html?q=${encodeURIComponent(q)}">Search the whole site</a> or <a href="contact.html">contact us</a>.</p>`));
      out.hidden = false;
    });
    input.addEventListener("keydown", e => {
      if (e.key === "Escape") { input.value = ""; out.hidden = true; meta.textContent = rest; }
    });
    document.addEventListener("click", e => { if (!wrap.contains(e.target)) out.hidden = true; });
  }

  document.addEventListener("DOMContentLoaded", () => { initHeader(); initPage(); initScoped(); watchMobile(); });
})();

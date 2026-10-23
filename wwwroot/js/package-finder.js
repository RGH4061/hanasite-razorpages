/* Package finder — the second search surface. Filters the OSAT package reference
   (js/search/packages.js) by category, automotive grade, largest body edge and maximum thickness, plus a
   paste field that parses "QFN32 5x5" into family + leads + size.

   Two modes, one implementation:
   · full page  — <div data-pkgfinder> on /capabilities/osat/package-finder.
                  Reads and writes ?q= ?cat= ?grade= ?max= ?thk= so a filtered view is linkable
                  and the handoff from site search lands pre-filtered.
   · embedded   — <div data-pkgfinder data-embed data-own="/capabilities/osat/qfn-dfn-lga">
                  on the pages that own those rows, so their tables are live, not static.
                  No URL writing, no category chips for rows outside the page's scope.

   A table, not cards: engineers compare numbers down a column. No status column —
   availability is a conversation with the customer, so every route out goes to us. */
(function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* The rows carry the URL tracker's addresses; this export serves Razor routes. Each
     value is the route in that page's @page directive. Clear-mold is the one address that
     differs from its route: the rows say clear-mold-packaging, the page is optical-packaging. */
  const OWN = {
    "/capabilities/osat/ultra-small-packages": "/capabilities/osat/ultra-small-packages",
    "/capabilities/osat/qfn-dfn-lga": "/capabilities/osat/qfn-dfn-lga",
    "/capabilities/osat/power-packages": "/capabilities/osat/power-packages",
    "/capabilities/osat/clear-mold-packaging": "/capabilities/osat/optical-packaging",
    "/capabilities/osat/hermetic-ceramic": "/capabilities/osat/hermetic-ceramic",
    "/capabilities/osat/system-in-package": "/capabilities/osat/system-in-package",
    "/markets/automotive/sensor-assembly": "/markets/automotive/sensor-assembly"
  };
  const MAX_EDGE = 41;
  /* Body-size pair. The leading delimiter group keeps the digits from being read out of a
     package name — SOT5X3 and SOT9X3 are family names, not 5 x 3 and 9 x 3 mm bodies.
     Used by both parse() and the text-remainder strip in render(); they must not diverge. */
  const DIMS = /(^|[^a-z0-9.])(\d+(?:\.\d+)?)\s*[x\u00d7]\s*(\d+(?:\.\d+)?)/;
  /* Hyphen-minus plus the en and em dashes that arrive when a part number is pasted
     out of a datasheet or a Word document. */
  const DASH = /[-\u2010-\u2015]/g;
  /* Six rows in the reference are dimensioned in inches. Anything that compares a body
     size has to convert first, or 0.07 x 0.07 in sorts below 0.6 x 1.0 mm while being
     three times the area. The "closest sizes" fallback sidesteps this by skipping the
     inch rows outright; the sort and the body-edge ceiling convert instead. */
  const MM = r => r.u === "in" ? [r.x * 25.4, r.y * 25.4] : [r.x, r.y];
  const AREA = r => { if (!r.x) return 1e9; const [a, b] = MM(r); return a * b; };
  /* A thickness in millimetres out of a reference cell, which may be a bare value
     ("0.90 mm") or carry a process note ("Clear transfer mold 0.50 mm"). */
  const THK_NUM = s => { const m = String(s || "").match(/(\d+(?:\.\d+)?)\s*mm/); return m ? parseFloat(m[1]) : null; };

  function parse(raw) {
    const s = raw.toLowerCase(), o = { dims: null, leads: null, txt: s.trim() };
    const d = s.match(DIMS);
    if (d) o.dims = [parseFloat(d[2]), parseFloat(d[3])];
    /* SOT is deliberately absent: in SOT23 / SOT223 / SOT89 the number is part of the
       JEDEC family name, not a lead count. Including it made "SOT23" mean "SOT with 23
       leads", which matches nothing. */
    const l = s.match(/\b(?:qfn|dfn|lga|soic|msop)\s*-?(\d{1,3})\b/) || s.match(/\b(\d{1,3})\s*l\b/);
    if (l) o.leads = parseInt(l[1]);
    return o;
  }

  function build(root) {
    const ALL = window.HS_PACKAGES || [];
    if (!ALL.length) return;
    const embed = root.hasAttribute("data-embed");
    const own = root.dataset.own || null;
    const base = own ? ALL.filter(r => r.own === own) : ALL;
    /* The thickness ladder (deck p73) is a property of a family, not a package row —
       it has no body size, leads or grade, so it renders as a row of dashes in the main
       table. Held out of the searchable scope and shown as its own table below instead. */
    const LADDER = base.filter(r => r.t === "Package thickness");
    const scope = base.filter(r => r.t !== "Package thickness");
    if (!scope.length) return;
    /* An embedded table whose packages carry no lead counts (Power Packages) drops the
       Leads column rather than showing a column of dashes. */
    const hasLeads = scope.some(r => r.leads.length);
    /* Package names with dashes removed, so a query that IS a name can be told apart
       from one that describes a size. */
    const PKGNAMES = new Set(base.map(r => (r.pkg || "").toLowerCase().replace(DASH, "")));

    /* The ladder is the only thickness Hana publishes at any scale — just 8 of the 109
       package rows carry one of their own. So a DFN or QFN row takes its floor from the
       ladder, an LGA row from the third dimension in its body size, and everything else
       has no published thickness and cannot honestly be filtered on one. */
    const THK_STEPS = [...new Set(LADDER.map(r => THK_NUM(r.thk)).filter(v => v !== null))].sort((a, b) => a - b);
    const LADDER_MIN = THK_STEPS.length ? THK_STEPS[0] : null;
    const rowThkMin = r => {
      const own = THK_NUM(r.thk);
      if (own !== null) return own;
      if (r.z) return r.z;
      if (LADDER_MIN !== null && /DFN|QFN/i.test(r.pkg)) return LADDER_MIN;
      return null;
    };

    function thkPanel(ceiling) {
      const show = ceiling === null ? LADDER
        : LADDER.filter(r => { const v = THK_NUM(r.thk); return v !== null && v <= ceiling; });
      if (!show.length) return "";
      return `<section class="pf-thk">
      <h3 class="pf-thk-h">Leadless package thickness</h3>
      <p class="pf-thk-s">DFN and QFN bodies are built to a thickness ladder, and the class
        prefix is part of the package name &mdash; a uDFN is a 0.50&nbsp;mm DFN.</p>
      <div class="pf-tablewrap"><table class="pf-table pf-table--thk"><thead><tr>
        <th>Family</th><th>Nominal thickness</th></tr></thead><tbody>
        ${show.map(r => `<tr>
          <td class="pf-pk">${esc(r.pkg)}</td>
          <td class="pf-num" data-l="Thickness">${esc(r.thk || "\u2014")}</td>
        </tr>`).join("")}</tbody></table></div>
      <p class="pf-thk-n">${ceiling === null
        ? "Nominal thickness by family, from our OSAT package reference."
        : `The classes at or below ${ceiling.toFixed(2)}&nbsp;mm, from our OSAT package reference.`}
        Not every body size is offered in every thickness &mdash; tell us the height
        you&rsquo;re working to and we&rsquo;ll come back on it.</p>
    </section>`;
    }

    const CATS = [...new Set(scope.map(r => r.t))];
    const GRADES = [...new Set(scope.map(r => r.grade).filter(Boolean))].sort();
    const pickCat = new Set(), pickGrade = new Set();
    let maxEdge = MAX_EDGE, maxThk = null, sortKey = "area", sortDir = 1;
    /* Embedded tables open long categories on request (Rupert, 23 Oct 2026): a category
       with more than SHOW_ROWS rows shows its first SHOW_ROWS and a toggle for the rest. */
    const SHOW_ROWS = 3, opened = new Set();

    root.className = "pf" + (embed ? " pf--embed" : "");
    root.innerHTML = `
      <div class="pf-controls">
        <div class="pf-paste">
          <span class="pf-ico"><i data-lucide="search" style="width:18px;height:18px"></i></span>
          <input class="pf-q" type="search" spellcheck="false" autocomplete="off"
            placeholder="${embed ? "Filter these packages — 3x3, QFN32, Grade 0" : "QFN32 5x5 · 3x3 · TO247 · Grade 0 · SOT23"}"
            aria-label="Filter packages">
          <span class="pf-hint">try <b>Grade 0</b> or <b>3x3</b></span>
        </div>
        <div class="pf-parse"></div>
        <div class="pf-filters">
          ${CATS.length > 1 ? `<div class="pf-fgroup pf-fgroup--wide"><span class="pf-label">Category</span><div class="pf-chips pf-cats"></div></div>` : ""}
          <div class="pf-fside">
          ${GRADES.length ? `<div class="pf-fgroup"><span class="pf-label">Automotive grade</span><div class="pf-chips pf-grades"></div></div>` : ""}
          <div class="pf-fgroup"><span class="pf-label">Largest body edge</span>
            <div class="pf-range"><input class="pf-size" type="range" min="1" max="${MAX_EDGE}" step="0.5" value="${MAX_EDGE}" aria-label="Largest body edge">
            <span class="pf-rv">any</span></div></div>
          ${THK_STEPS.length ? `<div class="pf-fgroup"><span class="pf-label">Maximum thickness</span>
            <div class="pf-range"><input class="pf-thkr" type="range" min="0" max="${THK_STEPS.length}" step="1" value="${THK_STEPS.length}" aria-label="Maximum thickness">
            <span class="pf-rv pf-thkv">any</span></div></div>` : ""}
          <button class="pf-clear" type="button">Clear all</button>
          </div>
        </div>
      </div>
      <div class="pf-count"></div>
      <div class="pf-out"></div>`;

    const q = root.querySelector(".pf-q"), parseEl = root.querySelector(".pf-parse");
    const catsEl = root.querySelector(".pf-cats"), gradesEl = root.querySelector(".pf-grades");
    const sizeEl = root.querySelector(".pf-size"), rvEl = root.querySelector(".pf-rv");
    const thkEl = root.querySelector(".pf-thkr"), thkvEl = root.querySelector(".pf-thkv");
    const thkLabel = () => maxThk === null ? "any" : "\u2264 " + maxThk.toFixed(2) + " mm";
    const countEl = root.querySelector(".pf-count"), outEl = root.querySelector(".pf-out");

    if (catsEl) catsEl.innerHTML = CATS.map(c => `<button type="button" class="pf-chip" data-c="${esc(c)}">${esc(c)}</button>`).join("");
    if (gradesEl) gradesEl.innerHTML = GRADES.map(g => `<button type="button" class="pf-chip" data-g="${esc(g)}">${esc(g)}</button>`).join("");

    const askBar = `<div class="pf-ask" data-hana-geo="band" data-geo-theme="midnight">
      <div><div class="pf-ask-t">Don&rsquo;t see the size you need? We can customize packaging sizes.</div>
      <div class="pf-ask-s">Tell us the body size, lead count and thickness you&rsquo;re working to, and we&rsquo;ll come back on whether it&rsquo;s in our window.</div></div>
      <a class="pf-btn" href="/contact">Tell us your target package specification</a></div>`;

    function nearest(dims) {
      if (!dims) return "";
      const [ta, tb] = [...dims].sort((a, b) => a - b);
      const d = r => { const [a, b] = [r.x, r.y].sort((m, n) => m - n); return Math.hypot(a - ta, b - tb); };
      const near = scope.filter(r => r.x && r.u === "mm").sort((m, n) => d(m) - d(n)).slice(0, 3);
      if (!near.length) return "";
      return `<div class="pf-near"><span class="pf-label">Closest sizes we list</span>
        ${near.map(r => { const [a, b] = [r.x, r.y].sort((m, n) => m - n);
          return `<div class="pf-nearrow"><b>${esc(r.pkg)}</b><span class="pf-num">${esc(r.bs)}</span>
          <span class="pf-cat">${esc(r.t)}</span>
          <span class="pf-d">${(a - ta >= 0 ? "+" : "")}${(a - ta).toFixed(1)} / ${(b - tb >= 0 ? "+" : "")}${(b - tb).toFixed(1)} mm from yours</span></div>`; }).join("")}</div>`;
    }

    /* The Midnight gradient is radial, so giving each header cell its own copy restarts it
       per cell and the label row stops matching its bar. Instead one gradient is sized to
       the whole block (bar + label row, or the thickness header) and each cell shows its
       own slice of it, so the bar and the labels read as one continuous Midnight band.
       The gradient itself is read from the geo theme, so it tracks the package. */
    let GRAD = null;
    function midnight() {
      if (GRAD !== null) return GRAD;
      const probe = document.createElement("div");
      probe.setAttribute("data-geo-theme", "midnight");
      probe.style.cssText = "position:absolute;width:0;height:0;visibility:hidden";
      root.appendChild(probe);
      GRAD = getComputedStyle(probe).backgroundImage;
      probe.remove();
      if (!GRAD || GRAD === "none") GRAD = "radial-gradient(80% 100% at 80% 50%, #072c4d 0%, #030a17 65%)";
      return GRAD;
    }
    function paintMidnight() {
      const img = midnight();
      const set = (el, x, y, w, h) => Object.assign(el.style, {
        backgroundImage: img, backgroundRepeat: "no-repeat",
        backgroundSize: w + "px " + h + "px", backgroundPosition: -x + "px " + -y + "px" });
      outEl.querySelectorAll(".pf-table").forEach(t => {
        const w = Math.max(t.offsetWidth, t.scrollWidth);
        if (!w) return;
        t.querySelectorAll("tbody, thead").forEach(g => {
          const bar = g.querySelector(".pf-grp th");
          const cells = g.querySelectorAll(".pf-cols th, thead th");
          const tl = t.getBoundingClientRect().left;
          const bh = bar ? bar.getBoundingClientRect().height : 0;
          const ch = cells.length ? Math.max(...[...cells].map(c => c.getBoundingClientRect().height)) : 0;
          if (bar) set(bar, 0, 0, w, bh + ch);
          cells.forEach(th => set(th, th.getBoundingClientRect().left - tl, bh, w, bh + ch));
        });
      });
    }
    /* Slices are measured in pixels, so they must be re-cut whenever the table reflows —
       not only on window resize but when the web fonts land and the columns redistribute.
       A slice cut before that falls outside the gradient and shows as a black block. */
    let paintQueued = false;
    const repaint = () => {
      if (paintQueued) return; paintQueued = true;
      requestAnimationFrame(() => { paintQueued = false; paintMidnight(); });
    };
    window.addEventListener("resize", repaint);
    /* Watching outEl is not enough: columns can redistribute, or the table can widen inside
       its scrolling wrapper, without outEl changing size. So each render re-observes the
       tables and every painted header cell. */
    const ro = window.ResizeObserver ? new ResizeObserver(repaint) : null;
    const watch = () => {
      if (!ro) return;
      ro.disconnect();
      outEl.querySelectorAll(".pf-table, .pf-cols th, .pf-grp th, .pf-table--thk thead th").forEach(el => ro.observe(el));
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(repaint);
    window.addEventListener("load", repaint);

    function writeURL() {
      if (embed) return;
      const u = new URLSearchParams();
      const v = q.value.trim();
      if (v) u.set("q", v);
      if (pickCat.size) u.set("cat", [...pickCat].join("|"));
      if (pickGrade.size) u.set("grade", [...pickGrade].join("|"));
      if (maxEdge < MAX_EDGE) u.set("max", maxEdge);
      if (maxThk !== null) u.set("thk", maxThk);
      const qs = u.toString();
      /* Guarded — replaceState throws in a sandboxed or file:// context, and keeping the
         URL in sync must never stop the results rendering. */
      try { history.replaceState(null, "", qs ? location.pathname + "?" + qs : location.pathname); } catch (e) {}
    }

    function render() {
      writeURL();
      const raw = q.value.trim(), p = parse(raw);
      /* If the whole query is a package name we carry, trust the name and do not
         re-read parts of it as a size or a lead count. Queries that genuinely combine
         a family with a spec — "QFN-3x3", "SOT23 8L", "SOIC8" — are not names, so they
         are unaffected. */
      if ((p.dims || p.leads) && PKGNAMES.has(raw.toLowerCase().replace(DASH, ""))) {
        p.dims = null;
        p.leads = null;
      }
      /* Strip what has already been parsed into structured filters, so "QFN32" searches
         the family QFN with 32 leads rather than the literal string. */
      let rest = p.dims ? p.txt.replace(DIMS, "$1") : p.txt;
      if (p.leads) rest = rest.replace(/\b(qfn|dfn|lga|soic|msop)\s*-?\d{1,3}\b/, "$1").replace(/\b\d{1,3}\s*l\b/, "");
      const words = rest.split(/\s+/).filter(w => w.length > 1);
      const needles = words.map(w => w.replace(DASH, ""));

      const bits = [];
      if (p.dims) bits.push(`<span class="pf-tok">body <b>${p.dims[0]} &times; ${p.dims[1]} mm</b> either orientation</span>`);
      if (p.leads) bits.push(`<span class="pf-tok">leads <b>${p.leads}</b></span>`);
      if (words.length) bits.push(`<span class="pf-tok">text <b>${esc(words.join(" "))}</b></span>`);
      parseEl.innerHTML = bits.length ? `<span class="pf-label">Read as</span>${bits.join("")}` : "";
      parseEl.classList.toggle("on", !!bits.length);

      const preThk = scope.filter(r => {
        if (pickCat.size && !pickCat.has(r.t)) return false;
        if (pickGrade.size && !pickGrade.has(r.grade)) return false;
        if (p.leads && !r.leads.includes(p.leads)) return false;
        if (p.dims) {
          if (!r.x) return false;
          const [a, b] = p.dims, t = 0.06, [mx, my] = MM(r);
          const hit = (x, y) => (Math.abs(x - a) < t && Math.abs(y - b) < t)
                             || (Math.abs(x - b) < t && Math.abs(y - a) < t);
          /* A typed size is read as millimetres. The inch rows print their size in
             inches, so a figure copied straight off the table matches as well. */
          if (!(hit(mx, my) || (r.u === "in" && hit(r.x, r.y)))) return false;
        }
        if (words.length) {
          const hay = (r.pkg + " " + r.fam + " " + r.t + " " + r.grade + " " + r.detail)
            .toLowerCase().replace(DASH, "");
          if (!needles.every(w => hay.includes(w))) return false;
        }
        return true;
      });

      /* A ceiling can only speak for rows that publish the measurement. The rest are
         set aside and counted. Body size and thickness are handled the same way. */
      const edgeOn = maxEdge < MAX_EDGE;
      const noSize = edgeOn ? preThk.filter(r => !r.x) : [];
      const afterEdge = edgeOn
        ? preThk.filter(r => { if (!r.x) return false; const [a, b] = MM(r); return Math.max(a, b) <= maxEdge; })
        : preThk;
      const noThk = maxThk === null ? [] : afterEdge.filter(r => rowThkMin(r) === null);
      const rows = maxThk === null ? afterEdge
        : afterEdge.filter(r => { const t = rowThkMin(r); return t !== null && t <= maxThk; });

      rows.sort((m, n) => {
        const k = sortKey, v = k === "area" ? AREA(m) - AREA(n)
          : k === "pkg" ? m.pkg.localeCompare(n.pkg)
          : k === "grade" ? (m.grade || "zz").localeCompare(n.grade || "zz") : 0;
        return v * sortDir;
      });

      const aside = (num, what) => num
        ? `<span class="pf-aside">${num} package${num === 1 ? "" : "s"} without a published ${what} not shown</span>`
        : "";
      countEl.innerHTML = (rows.length ? `<b>${rows.length}</b> package${rows.length === 1 ? "" : "s"} <span>of ${scope.length}</span>` : "")
        + aside(noSize.length, "body size") + aside(noThk.length, "thickness");

      if (!rows.length) {
        outEl.innerHTML = `<div class="pf-empty"><b>Nothing in the reference matches that</b>
          <p>Which doesn&rsquo;t mean no. Molded bodies go down to 0.6 &times; 1.0 mm, and leadless packages from 0.37 mm thick.</p></div>
          ${nearest(p.dims)}${askBar}`;
        if (window.HanaGeo) window.HanaGeo.init(outEl);
        return;
      }

      const arr = k => sortKey === k ? `<span class="pf-arr">${sortDir > 0 ? "▲" : "▼"}</span>` : `<span class="pf-arr">↕</span>`;
      const showThk = LADDER.length && rows.some(r => /DFN|QFN/i.test(r.pkg));
      /* One <tbody> per category, in reference order; the sort applies within each.
         A single category in scope gets no bar — it would only repeat the page. */
      /* Column labels repeat under each category bar, so they stay in view with it. */
      const cols = solo => `<tr class="pf-cols${solo ? " pf-cols--solo" : ""}">
        <th scope="col" data-k="pkg">Package ${arr("pkg")}</th>
        <th scope="col" data-k="area">Body size ${arr("area")}</th>
        ${hasLeads ? `<th scope="col">Leads</th>` : ""}
        <th scope="col" data-k="grade">Auto grade ${arr("grade")}</th>
        ${hasGo ? `<th scope="col"></th>` : ""}</tr>`;
      /* A row links to the page that owns it, except on that page itself, where the
         link would only reload it. With no links left, the column goes too. */
      const goHref = r => OWN[r.own] && r.own !== own ? OWN[r.own] : "";
      const hasGo = rows.some(goHref);
      const span = 3 + (hasLeads ? 1 : 0) + (hasGo ? 1 : 0);
      /* Typed filters show every match, so nothing is folded while a query is active. */
      const folding = embed && !raw && !pickCat.size && !pickGrade.size && maxEdge >= MAX_EDGE && maxThk === null;
      const groups = CATS.map(c => ({ cat: c, items: rows.filter(r => r.t === c) })).filter(g => g.items.length);
      /* Only tables split into category bars fold (the power reference); a single-category
         table such as QFN, DFN & LGA stays whole. */
      const fold = folding && groups.length > 1;
      const row = r => `<tr>
          <td class="pf-pk">${esc(r.pkg)}${r.detail ? `<span class="pf-det">${esc(r.detail)}</span>` : ""}</td>
          <td class="pf-num" data-l="Body size">${esc(r.bs || "—")}${r.die ? `<span class="pf-die">Max die ${esc(r.die)}</span>` : ""}</td>
          ${hasLeads ? `<td class="pf-num" data-l="Leads">${r.leads.length ? esc(r.leads.join(", ")) : "—"}</td>` : ""}
          <td data-l="Auto grade">${r.grade ? `<span class="pf-grade">${esc(r.grade)}</span>` : "—"}</td>
          ${hasGo ? `<td>${goHref(r) ? `<a class="pf-go" href="${esc(goHref(r))}">Page &rarr;</a>` : ""}</td>` : ""}
        </tr>`;
      const body = g => {
        if (!fold || g.items.length <= SHOW_ROWS) return g.items.map(row).join("");
        const open = opened.has(g.cat);
        const shown = open ? g.items : g.items.slice(0, SHOW_ROWS);
        return shown.map(row).join("") + `<tr class="pf-more"><td colspan="${span}">
          <button type="button" class="pf-more-b" data-more="${esc(g.cat)}" aria-expanded="${open}">${open
            ? "Show fewer"
            : `Show all ${g.items.length} packages`} <span aria-hidden="true">${open ? "&uarr;" : "&darr;"}</span></button></td></tr>`;
      };
      outEl.innerHTML = askBar + `<div class="pf-tablewrap"><table class="pf-table">
        ${groups.map(g => `<tbody>${groups.length > 1
          ? `<tr class="pf-grp"><th colspan="${span}" data-geo-theme="midnight">${esc(g.cat)}<span>${g.items.length}</span></th></tr>` : ""}
        ${cols(groups.length < 2)}
        ${body(g)}</tbody>`).join("")}</table></div>`
        /* Power rows carry a maximum die size (PM package capabilities deck, Oct 2026). */
        + (rows.some(r => r.die) ? `<p class="pf-die-n">Maximum die size can be adjusted after design and process evaluation.</p>` : "")
        + (showThk ? thkPanel(maxThk) : "");
      if (window.HanaGeo) window.HanaGeo.init(outEl);
      paintMidnight();
      watch();

      outEl.querySelectorAll("[data-more]").forEach(b => b.onclick = () => {
        const c = b.dataset.more;
        opened.has(c) ? opened.delete(c) : opened.add(c);
        render();
      });
      outEl.querySelectorAll("th[data-k]").forEach(th => th.onclick = () => {
        const k = th.dataset.k;
        if (sortKey === k) sortDir *= -1; else { sortKey = k; sortDir = 1; }
        render();
      });
      if (window.lucide) window.lucide.createIcons();
    }

    if (catsEl) catsEl.addEventListener("click", e => {
      const b = e.target.closest("[data-c]"); if (!b) return;
      const c = b.dataset.c;
      pickCat.has(c) ? pickCat.delete(c) : pickCat.add(c);
      b.classList.toggle("on", pickCat.has(c));
      render();
    });
    if (gradesEl) gradesEl.addEventListener("click", e => {
      const b = e.target.closest("[data-g]"); if (!b) return;
      const g = b.dataset.g;
      pickGrade.has(g) ? pickGrade.delete(g) : pickGrade.add(g);
      b.classList.toggle("on", pickGrade.has(g));
      render();
    });
    sizeEl.addEventListener("input", e => {
      maxEdge = parseFloat(e.target.value);
      rvEl.textContent = maxEdge >= MAX_EDGE ? "any" : "≤ " + maxEdge + " mm";
      render();
    });
    if (thkEl) thkEl.addEventListener("input", e => {
      const i = parseInt(e.target.value, 10);
      maxThk = i >= THK_STEPS.length ? null : THK_STEPS[i];
      thkvEl.textContent = thkLabel();
      render();
    });
    q.addEventListener("input", render);
    root.querySelector(".pf-clear").addEventListener("click", () => {
      pickCat.clear(); pickGrade.clear(); maxEdge = MAX_EDGE;
      q.value = ""; sizeEl.value = MAX_EDGE; rvEl.textContent = "any";
      maxThk = null; if (thkEl) { thkEl.value = THK_STEPS.length; thkvEl.textContent = "any"; }
      root.querySelectorAll(".pf-chip").forEach(c => c.classList.remove("on"));
      render();
    });

    /* Arriving state: ?q= from the site-search package card, or data-q on an embed. */
    if (embed) {
      if (root.dataset.q) q.value = root.dataset.q;
    } else {
      const u = new URLSearchParams(location.search);
      if (u.get("q")) q.value = u.get("q");
      (u.get("cat") || "").split("|").filter(Boolean).forEach(c => { if (CATS.includes(c)) pickCat.add(c); });
      (u.get("grade") || "").split("|").filter(Boolean).forEach(g => { if (GRADES.includes(g)) pickGrade.add(g); });
      if (u.get("max")) {
        maxEdge = parseFloat(u.get("max")); sizeEl.value = maxEdge;
        rvEl.textContent = maxEdge >= MAX_EDGE ? "any" : "≤ " + maxEdge + " mm";
      }
      if (thkEl && u.get("thk")) {
        const i = THK_STEPS.indexOf(parseFloat(u.get("thk")));
        if (i >= 0) { maxThk = THK_STEPS[i]; thkEl.value = i; thkvEl.textContent = thkLabel(); }
      }
      root.querySelectorAll("[data-c]").forEach(b => b.classList.toggle("on", pickCat.has(b.dataset.c)));
      root.querySelectorAll("[data-g]").forEach(b => b.classList.toggle("on", pickGrade.has(b.dataset.g)));
    }
    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-pkgfinder]").forEach(build);
  });
})();

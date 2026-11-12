/* Package finder — the second search surface. Filters the OSAT package reference
   (js/search/packages.js) by category, automotive grade, largest body edge and maximum thickness, plus a
   paste field that parses "QFN32 5x5" into family + leads + size.

   Two modes, one implementation:
   · full page  — <div data-pkgfinder> on /capabilities/osat/package-finder.
                  Reads and writes ?q= ?cat= ?fam= ?app= ?grade= ?max= ?thk= so a filtered view
                  is linkable and the handoff from site search lands pre-filtered.
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
    "/markets/automotive/sensor-assembly": "/markets/automotive/sensor-assembly",
    "/capabilities/microelectronic-assembly/mems-sensor-assembly": "/capabilities/microelectronic-assembly/mems-sensor-assembly"
  };
  const MAX_EDGE = 41;
  /* Owner pages with a package table at #package-reference; "Details" links land there. */
  const ANCHORED = new Set(["/capabilities/osat/ultra-small-packages", "/capabilities/osat/qfn-dfn-lga", "/capabilities/osat/power-packages"]);
  const SALES = "info-request@hanaus.com";
  /* On Thai pages (/th/…) links go to the Thai versions; every page the finder links to
     has one. The finder's own labels stay English. */
  const TH = document.documentElement.lang === "th";
  const L = p => TH ? "/th" + p : p;
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
    /* What the Thickness column shows (Rupert, 2 Nov 2026: thickness is one of the first
       things a buyer checks). A row's own figure or range ("1.52–1.74 mm", "max 0.40 mm");
       an LGA's third dimension; for standard DFN/QFN bodies the span of the ladder classes. */
    const LADDER_MAX = THK_STEPS.length ? THK_STEPS[THK_STEPS.length - 1] : null;
    const thkText = r => {
      const own = String(r.thk || "");
      if (/\d\s*[–-]\s*\d/.test(own) || /^max /i.test(own)) return own;
      const n = THK_NUM(own);
      if (n !== null) return (/minimum/i.test(own) ? "min " : "") + n.toFixed(2) + " mm";
      if (r.z) return Number(r.z).toFixed(2) + " mm";
      if (LADDER_MIN !== null && /DFN|QFN/i.test(r.pkg) && /^(Leadless packages|Automotive-qualified packages)$/.test(r.t))
        return LADDER_MIN.toFixed(2) + "–" + LADDER_MAX.toFixed(2) + " mm";
      return "";
    };

    function thkPanel(ceiling) {
      const show = ceiling === null ? LADDER
        : LADDER.filter(r => { const v = THK_NUM(r.thk); return v !== null && v <= ceiling; });
      if (!show.length) return "";
      return `<section class="pf-thk">
      <h3 class="pf-thk-h">Leadless package thickness</h3>
      <p class="pf-thk-s">DFN and QFN bodies are built to a thickness ladder, and the class prefix is part of the package name: a uDFN is a 0.50&nbsp;mm DFN.</p>
      <div class="pf-tablewrap"><table class="pf-table pf-table--thk"><thead><tr>
        <th>Family</th><th>Nominal thickness</th><th>Range</th></tr></thead><tbody>
        ${show.map(r => `<tr>
          <td class="pf-pk">${esc(r.pkg)}</td>
          <td class="pf-num" data-l="Thickness">${esc(r.thk || "\u2014")}</td>
          <td class="pf-num" data-l="Range">${esc(r.detail || "\u2014")}</td>
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
    /* Every finder (full page and the tables embedded on capability pages) uses the same
       filter rows (Nov 2026): an "All" chip and a count on every chip, package-type chips,
       an Automotive / Non-automotive switch, body-edge presets, Reset and a line of active
       filters. A row shows only where it offers a choice for the packages in scope.
       FULL marks what only the finder page has: tick boxes and the corner card, the pinned
       filter line and the filters in the address bar. */
    const FULL = !embed;
    const AUTO_CAT = "Automotive-qualified packages";
    const isAuto = r => !!r.grade && r.grade !== "Industrial";
    const CAT_SHORT = {
      "Leaded packages": "Leaded", "Leadless packages": "Leadless",
      "Top-side cooling power packages": "Top-side cooling", "GaN power packages": "GaN power",
      "Dual-cool power packages": "Dual-cool", "Optical package dimensions": "Optical",
      "Ceramic packages": "Ceramic", "TO-can packages": "TO-can",
      "Hermetic RF & ceramic diode packages": "Hermetic RF & diode",
      "SiP \u2014 leadframe base": "SiP leadframe", "SiP \u2014 substrate base": "SiP substrate",
      "Sensor packages": "Sensor" };
    /* Package families buyers search by. Only families the reference carries are shown. */
    const FAM_RX = [
      ["QFN", r => /QFN/i.test(r.pkg)], ["DFN", r => /DFN/i.test(r.pkg)], ["LGA", r => /LGA/i.test(r.pkg)],
      ["SOT", r => /^(SOT|SC70)/i.test(r.pkg)], ["SOIC", r => /SOIC/i.test(r.pkg)],
      ["SOP / MSOP", r => /SOP/i.test(r.pkg)], ["TO", r => /^(TO|D2PAK)/i.test(r.pkg)],
      ["SiP", r => /^SiP/.test(r.t)]];
    /* Power device materials sit after a divider on the same row: they describe the die,
       not the outline, so a GaN or SiC device can come in several outlines. */
    const devText = r => [r.pkg, r.fam, r.t, r.detail].join(" ");
    const DEV_RX = [["GaN", r => /\bGaN\b/i.test(devText(r))], ["SiC", r => /\bSiC\b/i.test(devText(r))]];
    const FAMS = FAM_RX.filter(([, f]) => scope.filter(f).length >= 2);
    const DEVS = DEV_RX.filter(([, f]) => scope.some(f));
    const famTest = Object.fromEntries([...FAMS, ...DEVS]);
    const isDev = f => DEVS.some(([d]) => d === f);
    /* Within a group any pick matches; across the two groups both must, so QFN + GaN
       finds GaN QFNs rather than every QFN and every GaN package. */
    const pickFam = new Set();
    let app = "all";
    let maxEdge = MAX_EDGE, maxThk = null, sortKey = "area", sortDir = 1;
    /* The reference files its 18 automotive packages under their own category. With the
       Automotive switch replacing that chip, the full page files each one under Leaded or Leadless by
       outline as well, so Automotive + Leadless finds the automotive QFNs and DFNs. */
    const catOf = r => r.t === AUTO_CAT ? (/QFN|DFN|LGA/i.test(r.pkg) ? "Leadless packages" : "Leaded packages") : r.t;
    const appOK = (r, a) => a === "all" || (a === "auto") === isAuto(r);
    /* Every chip filter. `skip` leaves groups out, which is how a chip's count is taken:
       the rows it would show if it were the only pick in its own group. */
    const facetOK = (r, ...skip) => {
      const outl = [...pickFam].filter(f => !isDev(f)), dev = [...pickFam].filter(isDev);
      return (skip.includes("cat") || !pickCat.size || pickCat.has(catOf(r)))
        && (skip.includes("grade") || !pickGrade.size || pickGrade.has(r.grade))
        && (skip.includes("outl") || !outl.length || outl.some(f => famTest[f](r)))
        && (skip.includes("dev") || !dev.length || dev.some(f => famTest[f](r)))
        && (skip.includes("app") || appOK(r, app));
    };
    const edgeOK = (r, lim = maxEdge) => lim >= MAX_EDGE || (!!r.x && Math.max(...MM(r)) <= lim);
    const thkOK = r => { if (maxThk === null) return true; const t = rowThkMin(r); return t !== null && t <= maxThk; };
    const EDGE_PRESETS = [MAX_EDGE, 2, 3, 5, 8, 12, 20];
    /* Tables open long categories on request (Rupert, 23 Oct 2026): a category with more
       than SHOW_ROWS rows shows its first SHOW_ROWS and a toggle for the rest. The full
       finder page shows 7 (Rupert, 30 Oct 2026), embedded tables 5. */
    const SHOW_ROWS = embed ? 5 : 7, opened = new Set();

    /* Which rows offer a choice here. The automotive category chip is replaced by the
       Application switch, so it never counts towards the Category row. */
    const CAT_CHIPS = CATS.filter(c => c !== AUTO_CAT);
    const SHOW_CAT = CAT_CHIPS.length > 1;
    const SHOW_FAM = FAMS.length + DEVS.length > 1;
    const SHOW_APP = scope.some(isAuto) && scope.some(r => !isAuto(r));
    root.className = "pf" + (embed ? " pf--embed" : "") + (FULL ? " pf--page" : "");
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
        <button type="button" class="pf-ftoggle" aria-expanded="false"><i data-lucide="sliders-horizontal" style="width:15px;height:15px"></i> Filters<span class="pf-fcount"></span><span class="pf-fchev" aria-hidden="true">&#9662;</span></button>
        <div class="pf-filters pf-rows">
          ${SHOW_CAT ? `<div class="pf-row"><span class="pf-label">Category</span><div class="pf-chips pf-cats"></div></div>` : ""}
          ${SHOW_FAM ? `<div class="pf-row"><span class="pf-label">Package type</span><div class="pf-chips pf-fams"></div></div>` : ""}
          ${SHOW_APP ? `<div class="pf-row"><span class="pf-label">Application</span>
            <div class="pf-seg" role="radiogroup" aria-label="Application">
              <button type="button" role="radio" data-app="all">All<span class="pf-n"></span></button>
              <button type="button" role="radio" data-app="auto">Automotive<span class="pf-n"></span></button>
              <button type="button" role="radio" data-app="non">Non-automotive<span class="pf-n"></span></button></div>
            <div class="pf-chips pf-grades pf-grades--app" aria-label="Automotive grade"></div></div>` : ""}
          <div class="pf-row pf-row--size"><span class="pf-label">Size</span>
            <div class="pf-sz"><span class="pf-szl">Largest body edge, mm</span>
              <div class="pf-chips pf-edges" role="group" aria-label="Largest body edge">${EDGE_PRESETS.map(v =>
                `<button type="button" class="pf-chip" data-edge="${v}">${v >= MAX_EDGE ? "Any" : "\u2264 " + v}</button>`).join("")}</div></div>
            ${THK_STEPS.length ? `<div class="pf-sz"><span class="pf-szl">Max thickness</span>
              <div class="pf-range"><input class="pf-thkr" type="range" min="0" max="${THK_STEPS.length}" step="1" value="${THK_STEPS.length}" aria-label="Maximum thickness">
              <span class="pf-rv pf-thkv">any</span></div></div>` : ""}
            <button class="pf-clear pf-reset" type="button"><i data-lucide="rotate-ccw" style="width:13px;height:13px"></i> Reset filters</button>
          </div>
        </div>
      </div>
      <div class="pf-status"><div class="pf-count"></div><div class="pf-active" hidden></div></div>
      <div class="pf-out"></div>
      ${FULL ? `<div class="pf-tray" hidden role="region" aria-label="Selected packages"></div>` : ""}`;

    const q = root.querySelector(".pf-q"), parseEl = root.querySelector(".pf-parse");
    const catsEl = root.querySelector(".pf-cats"), gradesEl = root.querySelector(".pf-grades");
    const sizeEl = root.querySelector(".pf-size"), rvEl = root.querySelector(".pf-rv");
    const thkEl = root.querySelector(".pf-thkr"), thkvEl = root.querySelector(".pf-thkv");
    const thkLabel = () => maxThk === null ? "any" : "\u2264 " + maxThk.toFixed(2) + " mm";
    const countEl = root.querySelector(".pf-count"), outEl = root.querySelector(".pf-out");
    /* Full page: buyers tick packages across searches and send one enquiry naming them all.
       Ticks survive filter changes; they are held for this visit only. */
    const KEY = new Map(scope.map((r, i) => [r, i]));
    const picked = new Set();
    const trayEl = root.querySelector(".pf-tray");
    const pkgLine = r => [r.pkg, r.bs, thkText(r) ? thkText(r) + " thick" : "",
      r.leads.length ? r.leads.join("/") + " leads" : "", r.grade].filter(Boolean).join(", ");
    const mailto = rows => {
      const subject = "Package inquiry: " + rows.slice(0, 3).map(r => r.pkg + (r.bs ? " " + r.bs : "")).join("; ")
        + (rows.length > 3 ? " and " + (rows.length - 3) + " more" : "");
      const body = "Hello,\n\nWe would like to discuss these packages from your package finder:\n\n"
        /* Mail links much over 2,000 characters fail in some clients, so long lists are cut. */
        + rows.slice(0, 15).map(r => "- " + pkgLine(r)).join("\n")
        + (rows.length > 15 ? "\n- and " + (rows.length - 15) + " more packages" : "")
        + "\n\nApplication:\nEstimated annual volume:\nTarget timing:\n\nThank you.";
      return "mailto:" + SALES + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    };
    const tray = () => {
      if (!trayEl) return;
      const rows = scope.filter(r => picked.has(KEY.get(r)));
      trayEl.hidden = !rows.length;
      document.body.classList.toggle("pf-tray-on", !!rows.length);
      if (!rows.length) { trayEl.innerHTML = ""; setSt(); return; }
      const SHOW = 6, n = rows.length;
      trayEl.innerHTML = `<div class="pf-tray-in" data-geo-theme="midnight">
        <div class="pf-tray-n"><b class="pf-tray-badge">${n}</b> package${n === 1 ? "" : "s"} selected</div>
        <div class="pf-tray-list">${rows.slice(0, SHOW).map(r =>
          `<button type="button" class="pf-tokx" data-unsel="${KEY.get(r)}" aria-label="Remove ${esc(r.pkg)}">${esc(r.pkg)}${r.bs ? ` <span class="pf-tray-bs">${esc(r.bs)}</span>` : ""}<span aria-hidden="true">&times;</span></button>`).join("")}
          ${n > SHOW ? `<span class="pf-tray-more">+${n - SHOW} more</span>` : ""}</div>
        <button type="button" class="pf-xall pf-tray-clear">Clear</button>
        <a class="pf-tray-go" href="${esc(mailto(rows))}">Email us about ${n === 1 ? "this package" : "these " + n} &rarr;</a>
      </div>`;
      setSt();
    };
    /* --pf-st: height of the pinned line, so the table's sticky bars sit under it.
       --pf-hdr: height of the site header where it is pinned (phones), so the line sits under that. */
    const setSt = () => requestAnimationFrame(() => {
      const st = root.querySelector(".pf-status"); if (st) root.style.setProperty("--pf-st", st.offsetHeight + "px");
      const h = document.querySelector(".hana-header");
      root.style.setProperty("--pf-hdr", (h && getComputedStyle(h).position === "sticky" ? h.offsetHeight : 0) + "px");
    });
    if (FULL) window.addEventListener("resize", setSt);
    const setPick = (k, on) => {
      on ? picked.add(k) : picked.delete(k);
      outEl.querySelectorAll(`[data-sel="${k}"]`).forEach(c => { c.checked = on; c.closest("tr").classList.toggle("is-sel", on); });
      tray();
    };
    if (FULL) {
      outEl.addEventListener("change", e => {
        const c = e.target.closest("[data-sel]"); if (c) setPick(+c.dataset.sel, c.checked);
      });
      trayEl.addEventListener("click", e => {
        if (e.target.closest(".pf-tray-clear")) { [...picked].forEach(k => setPick(k, false)); return; }
        const b = e.target.closest("[data-unsel]"); if (b) setPick(+b.dataset.unsel, false);
      });
    }

    const famsEl = root.querySelector(".pf-fams");
    const N = `<span class="pf-n"></span>`;
    const allChip = k => `<button type="button" class="pf-chip pf-all" data-all="${k}">All${N}</button>`;
    if (catsEl) catsEl.innerHTML = allChip("cat") + CAT_CHIPS
      .map(c => `<button type="button" class="pf-chip" data-c="${esc(c)}"${CAT_SHORT[c] ? ` title="${esc(c)}"` : ""}>${esc(CAT_SHORT[c] || c)}${N}</button>`).join("");
    if (gradesEl) gradesEl.innerHTML = GRADES.filter(g => g !== "Industrial").map(g => `<button type="button" class="pf-chip" data-g="${esc(g)}">${esc(g)}${N}</button>`).join("");
    if (famsEl) famsEl.innerHTML = allChip("fam") + FAMS.map(([f]) => `<button type="button" class="pf-chip" data-f="${esc(f)}">${esc(f)}${N}</button>`).join("")
      + (DEVS.length ? `<span class="pf-div" aria-hidden="true"></span><span class="pf-sub">Power device</span>`
        + DEVS.map(([f]) => `<button type="button" class="pf-chip" data-f="${esc(f)}">${esc(f)}${N}</button>`).join("") : "");
    /* Chip and switch states follow the filter state, so URL arrival, Reset and the "All"
       chips all stay in step. */
    const sync = () => {
      root.querySelectorAll("[data-c]").forEach(b => b.classList.toggle("on", pickCat.has(b.dataset.c)));
      root.querySelectorAll("[data-g]").forEach(b => b.classList.toggle("on", pickGrade.has(b.dataset.g)));
      root.querySelectorAll("[data-f]").forEach(b => b.classList.toggle("on", pickFam.has(b.dataset.f)));
      root.querySelectorAll("[data-all]").forEach(b => b.classList.toggle("on", !(b.dataset.all === "cat" ? pickCat : pickFam).size));
      root.querySelectorAll("[data-app]").forEach(b => { const on = b.dataset.app === app; b.classList.toggle("on", on); b.setAttribute("aria-checked", on); });
      root.querySelectorAll("[data-edge]").forEach(b => b.classList.toggle("on", parseFloat(b.dataset.edge) === maxEdge));
      if (gradesEl) gradesEl.hidden = app !== "auto";
    };
    /* Counts on every chip; a chip that would empty the list is greyed out unless it is
       already picked, so it can still be switched off. */
    const setN = (b, n) => {
      const el = b.querySelector(".pf-n"); if (el) el.textContent = n;
      b.disabled = !n && !b.classList.contains("on") && !b.dataset.all;
    };
    const counts = pool => {
      const n = (skip, test) => pool.filter(r => facetOK(r, ...skip) && test(r) && edgeOK(r) && thkOK(r)).length;
      root.querySelectorAll("[data-c]").forEach(b => setN(b, n(["cat"], r => catOf(r) === b.dataset.c)));
      root.querySelectorAll("[data-f]").forEach(b => setN(b, n([isDev(b.dataset.f) ? "dev" : "outl"], famTest[b.dataset.f])));
      root.querySelectorAll("[data-g]").forEach(b => setN(b, n(["grade"], r => r.grade === b.dataset.g)));
      root.querySelectorAll("[data-app]").forEach(b => setN(b, n(["app", "grade"], r => appOK(r, b.dataset.app))));
      root.querySelectorAll("[data-all]").forEach(b => setN(b, n(b.dataset.all === "cat" ? ["cat"] : ["outl", "dev"], () => true)));
      root.querySelectorAll("[data-edge]").forEach(b => {
        const lim = parseFloat(b.dataset.edge);
        b.disabled = lim < MAX_EDGE && lim !== maxEdge && !pool.some(r => facetOK(r) && thkOK(r) && edgeOK(r, lim));
      });
    };
    /* The filters in force, each removable, above the results. It sticks to the top of
       the window, so a buyer far down a long table can still see and undo them. */
    const active = raw => {
      const el = root.querySelector(".pf-active"); if (!el) return;
      const t = [];
      if (raw) t.push(["q", "", "\u201c" + raw + "\u201d"]);
      pickCat.forEach(c => t.push(["cat", c, CAT_SHORT[c] || c]));
      pickFam.forEach(f => t.push(["fam", f, f]));
      if (app !== "all") t.push(["app", "", app === "auto" ? "Automotive" : "Non-automotive"]);
      pickGrade.forEach(g => t.push(["grade", g, g]));
      if (maxEdge < MAX_EDGE) t.push(["edge", "", "Body edge \u2264 " + maxEdge + " mm"]);
      if (maxThk !== null) t.push(["thk", "", "Thickness \u2264 " + maxThk.toFixed(2) + " mm"]);
      el.hidden = !t.length;
      const fc = root.querySelector(".pf-fcount"), nf = t.filter(([k]) => k !== "q").length;
      if (fc) fc.textContent = nf ? " \u00b7 " + nf + " active" : "";
      /* The table's own sticky bars sit under this line, so they are offset by its height. */
      setSt();
      el.innerHTML = t.map(([k, v, l]) => `<button type="button" class="pf-tokx" data-x="${k}" data-v="${esc(v)}" aria-label="Remove filter: ${esc(l)}">${esc(l)}<span aria-hidden="true">&times;</span></button>`).join("")
        + (t.length > 1 ? `<button type="button" class="pf-xall">Clear all</button>` : "");
    };

    /* One contact line under any searched or filtered list, with the packages named in the email. */
    /* Up to 10 rows the subject names the packages; above that it names the search or filters. */
    const foundBar = (rows, raw) => {
      const names = [...new Set(rows.map(r => r.pkg + (r.bs ? " " + r.bs : "")))];
      const scope = [raw, ...pickCat, ...pickFam, app === "auto" ? "automotive" : app === "non" ? "non-automotive" : "", ...pickGrade,
        maxEdge < MAX_EDGE ? "max edge " + maxEdge + " mm" : "", maxThk !== null ? "max " + maxThk + " mm thick" : ""].filter(Boolean).join(", ");
      const subject = "Package inquiry: " + (rows.length <= 10
        ? names.slice(0, 5).join(", ") + (names.length > 5 ? " and " + (names.length - 5) + " more" : "")
        : scope + " (" + rows.length + " packages)");
      const n = rows.length;
      return `<div class="pf-found"><span>Found what you need?</span>
        <a href="mailto:${SALES}?subject=${encodeURIComponent(subject)}">Email us about ${n === 1 ? "this package" : "these " + n + " packages"} &rarr;</a></div>`;
    };
    const askBar = `<div class="pf-ask" data-hana-geo="band" data-geo-theme="midnight">
      <div><div class="pf-ask-t">Don&rsquo;t see the size you need? We can customize packaging sizes.</div>
      <div class="pf-ask-s">Tell us the body size, lead count and thickness you&rsquo;re working to, and we&rsquo;ll come back on whether it&rsquo;s in our window.</div></div>
      <a class="pf-btn" href="${L("/contact")}">Email your target package specification</a></div>`;

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
      if (pickFam.size) u.set("fam", [...pickFam].join("|"));
      if (app !== "all") u.set("app", app);
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

      const textOK = r => {
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
      };
      const pool = scope.filter(textOK);
      const preThk = pool.filter(r => facetOK(r));

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
      counts(pool); active(raw);

      if (!rows.length) {
        outEl.innerHTML = `<div class="pf-empty"><b>No standard package matches that</b>
          <p>We recommend contacting us, as we also build to custom dimensions. Molded bodies go down to 0.6 &times; 1.0 mm, and leadless packages from 0.37 mm thick.</p></div>
          ${nearest(p.dims)}${askBar}`;
        if (window.HanaGeo) window.HanaGeo.init(outEl);
        /* The panel icons are drawn here too, or a page that opens on an empty result has none. */
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      const arr = k => sortKey === k ? `<span class="pf-arr">${sortDir > 0 ? "▲" : "▼"}</span>` : `<span class="pf-arr">↕</span>`;
      const showThk = LADDER.length && rows.some(r => /DFN|QFN/i.test(r.pkg));
      /* One <tbody> per category, in reference order; the sort applies within each.
         A single category in scope gets no bar — it would only repeat the page. */
      /* Column labels repeat under each category bar, so they stay in view with it. */
      const cols = solo => `<tr class="pf-cols${solo ? " pf-cols--solo" : ""}">
        ${FULL ? `<th scope="col" class="pf-sel-h"><span class="pf-sr">Select</span></th>` : ""}
        <th scope="col" data-k="pkg">Package ${arr("pkg")}</th>
        <th scope="col" data-k="area">Body size ${arr("area")}</th>
        ${hasThk ? `<th scope="col">Thickness</th>` : ""}
        ${hasLeads ? `<th scope="col">Leads</th>` : ""}
        <th scope="col" data-k="grade">Auto grade ${arr("grade")}</th>
        ${hasGo ? `<th scope="col"></th>` : ""}</tr>`;
      /* A row links to the page that owns it, except on that page itself, where the
         link would only reload it. With no links left, the column goes too. */
      const goHref = r => OWN[r.own] && r.own !== own ? L(OWN[r.own]) : "";
      const hasGo = rows.some(goHref);
      const hasThk = rows.some(r => thkText(r));
      const span = 3 + (FULL ? 1 : 0) + (hasThk ? 1 : 0) + (hasLeads ? 1 : 0) + (hasGo ? 1 : 0);
      /* Typed filters show every match, so nothing is folded while a query is active. */
      const folding = !raw && !pickCat.size && !pickGrade.size && !pickFam.size && app === "all" && maxEdge >= MAX_EDGE && maxThk === null;
      const groups = CATS.map(c => ({ cat: c, items: rows.filter(r => r.t === c) })).filter(g => g.items.length);
      /* Every table folds, including single-category ones such as QFN, DFN & LGA
         (Rupert, 24 Oct 2026). */
      const fold = folding;
      const row = r => `<tr${FULL && picked.has(KEY.get(r)) ? ` class="is-sel"` : ""}>
          ${FULL ? `<td class="pf-sel"><input type="checkbox" data-sel="${KEY.get(r)}"${picked.has(KEY.get(r)) ? " checked" : ""} aria-label="Select ${esc(r.pkg + (r.bs ? " " + r.bs : ""))}"></td>` : ""}
          <td class="pf-pk">${esc(r.pkg)}${r.detail ? `<span class="pf-det">${esc(r.detail)}</span>` : ""}</td>
          <td class="pf-num" data-l="Body size">${esc(r.bs || "—")}${r.die ? `<span class="pf-die">Max die ${esc(r.die)}</span>` : ""}</td>
          ${hasThk ? `<td class="pf-num" data-l="Thickness">${esc(thkText(r) || "—")}</td>` : ""}
          ${hasLeads ? `<td class="pf-num" data-l="Leads">${r.leads.length ? esc(r.leads.join(", ")) : "—"}</td>` : ""}
          <td data-l="Auto grade">${r.grade ? `<span class="pf-grade">${esc(r.grade)}</span>` : "—"}</td>
          ${hasGo ? `<td>${goHref(r) ? `<a class="pf-go" href="${esc(goHref(r) + (ANCHORED.has(r.own) ? "#package-reference" : ""))}">Details &rarr;</a>` : ""}</td>` : ""}
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
        + (!folding ? foundBar(rows, raw) : "")
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

    if (famsEl) famsEl.addEventListener("click", e => {
      const b = e.target.closest("[data-f], [data-all]"); if (!b) return;
      if (b.dataset.all) pickFam.clear();
      else { const f = b.dataset.f; pickFam.has(f) ? pickFam.delete(f) : pickFam.add(f); }
      sync(); render();
    });
    root.querySelectorAll("[data-app]").forEach(b => b.addEventListener("click", () => {
      app = b.dataset.app;
      if (app !== "auto") pickGrade.clear();
      sync(); render();
    }));
    if (catsEl) catsEl.addEventListener("click", e => {
      const all = e.target.closest("[data-all]");
      if (all) { pickCat.clear(); sync(); render(); return; }
      const b = e.target.closest("[data-c]"); if (!b) return;
      const c = b.dataset.c;
      pickCat.has(c) ? pickCat.delete(c) : pickCat.add(c);
      b.classList.toggle("on", pickCat.has(c));
      sync(); render();
    });
    if (gradesEl) gradesEl.addEventListener("click", e => {
      const b = e.target.closest("[data-g]"); if (!b) return;
      const g = b.dataset.g;
      pickGrade.has(g) ? pickGrade.delete(g) : pickGrade.add(g);
      b.classList.toggle("on", pickGrade.has(g));
      render();
    });
    const edgesEl = root.querySelector(".pf-edges");
    if (edgesEl) edgesEl.addEventListener("click", e => {
      const b = e.target.closest("[data-edge]"); if (!b || b.disabled) return;
      maxEdge = parseFloat(b.dataset.edge);
      sync(); render();
    });
    if (sizeEl) sizeEl.addEventListener("input", e => {
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
    const clearThk = () => { maxThk = null; if (thkEl) { thkEl.value = THK_STEPS.length; thkvEl.textContent = "any"; } };
    const clearEdge = () => { maxEdge = MAX_EDGE; if (sizeEl) { sizeEl.value = MAX_EDGE; rvEl.textContent = "any"; } };
    const resetAll = () => {
      pickCat.clear(); pickGrade.clear(); clearEdge();
      q.value = ""; clearThk();
      pickFam.clear(); app = "all";
      root.querySelectorAll(".pf-chip").forEach(c => c.classList.remove("on"));
      sync(); render();
    };
    root.querySelector(".pf-clear").addEventListener("click", resetAll);
    /* Phones: the filter rows fold behind a "Filters" button; the search field stays open. */
    const ftog = root.querySelector(".pf-ftoggle");
    if (ftog) ftog.addEventListener("click", () => {
      const open = root.classList.toggle("pf-fopen");
      ftog.setAttribute("aria-expanded", open);
    });
    const activeEl = root.querySelector(".pf-active");
    if (activeEl) activeEl.addEventListener("click", e => {
      if (e.target.closest(".pf-xall")) return resetAll();
      const b = e.target.closest("[data-x]"); if (!b) return;
      const k = b.dataset.x, v = b.dataset.v;
      if (k === "q") q.value = "";
      else if (k === "cat") pickCat.delete(v);
      else if (k === "fam") pickFam.delete(v);
      else if (k === "grade") pickGrade.delete(v);
      else if (k === "app") { app = "all"; pickGrade.clear(); }
      else if (k === "edge") clearEdge();
      else if (k === "thk") clearThk();
      sync(); render();
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
        maxEdge = parseFloat(u.get("max"));
        if (sizeEl) { sizeEl.value = maxEdge; rvEl.textContent = maxEdge >= MAX_EDGE ? "any" : "≤ " + maxEdge + " mm"; }
      }
      if (thkEl && u.get("thk")) {
        const i = THK_STEPS.indexOf(parseFloat(u.get("thk")));
        if (i >= 0) { maxThk = THK_STEPS[i]; thkEl.value = i; thkvEl.textContent = thkLabel(); }
      }
      if (FULL) {
        (u.get("fam") || "").split("|").filter(Boolean).forEach(f => { if (famTest[f]) pickFam.add(f); });
        if (["auto", "non"].includes(u.get("app"))) app = u.get("app");
        /* The old automotive category link (?cat=Automotive-qualified packages) lands on the switch. */
        if (pickCat.delete(AUTO_CAT)) app = "auto";
        if (pickGrade.size && app === "all") app = "auto";
      }
    }
    sync();
    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-pkgfinder]").forEach(build);
  });
})();

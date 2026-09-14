/* Package finder — the second search surface. Filters the OSAT package reference
   (js/search/packages.js) by category, automotive grade and largest body edge, plus a
   paste field that parses "QFN32 5x5" into family + leads + size.

   Two modes, one implementation:
   · full page  — <div data-pkgfinder> on capabilities-osat-package-finder.html.
                  Reads and writes ?q= ?cat= ?grade= ?max= so a filtered view is linkable
                  and the handoff from site search lands pre-filtered.
   · embedded   — <div data-pkgfinder data-embed data-own="/capabilities/osat/qfn-dfn-lga">
                  on the pages that own those rows, so their tables are live, not static.
                  No URL writing, no category chips for rows outside the page's scope.

   A table, not cards: engineers compare numbers down a column. No status column —
   availability is a conversation with the customer, so every route out goes to us. */
(function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* The rows carry live site URLs; this export is flat files. */
  const OWN = {
    "/capabilities/osat/ultra-small-packages": "capabilities-osat-ultra-small-packages.html",
    "/capabilities/osat/qfn-dfn-lga": "capabilities-osat-qfn-dfn-lga.html",
    "/capabilities/osat/power-packages": "capabilities-osat-power-packages.html",
    "/capabilities/osat/clear-mold-packaging": "capabilities-osat-optical-packaging.html",
    "/capabilities/osat/hermetic-ceramic": "capabilities-osat-hermetic-ceramic.html",
    "/capabilities/osat/system-in-package": "capabilities-osat-system-in-package.html"
  };
  const MAX_EDGE = 41;
  /* Body-size pair. The leading delimiter group keeps the digits from being read out of a
     package name — SOT5X3 and SOT9X3 are family names, not 5 x 3 and 9 x 3 mm bodies.
     Used by both parse() and the text-remainder strip in render(); they must not diverge. */
  const DIMS = /(^|[^a-z0-9.])(\d+(?:\.\d+)?)\s*[x\u00d7]\s*(\d+(?:\.\d+)?)/;

  function parse(raw) {
    const s = raw.toLowerCase(), o = { dims: null, leads: null, txt: s.trim() };
    const d = s.match(DIMS);
    if (d) o.dims = [parseFloat(d[2]), parseFloat(d[3])];
    /* SOT is deliberately absent: in SOT23 / SOT223 / SOT89 the number is part of the
       JEDEC family name, not a lead count. Including it made "SOT23" mean "SOT with 23
       leads", which matches nothing. */
    const l = s.match(/(?:qfn|dfn|lga|soic|msop)\s*-?(\d{1,3})\b/) || s.match(/\b(\d{1,3})\s*l\b/);
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

    const THK_PANEL = LADDER.length ? `<section class="pf-thk">
      <h3 class="pf-thk-h">Leadless package thickness</h3>
      <p class="pf-thk-s">DFN and QFN bodies are built to a thickness ladder, and the class
        prefix is part of the package name &mdash; a uDFN is a 0.50&nbsp;mm DFN.</p>
      <div class="pf-tablewrap"><table class="pf-table pf-table--thk"><thead><tr>
        <th>Family</th><th>Nominal thickness</th></tr></thead><tbody>
        ${LADDER.map(r => `<tr>
          <td class="pf-pk">${esc(r.pkg)}</td>
          <td class="pf-num" data-l="Thickness">${esc(r.thk || "\u2014")}</td>
        </tr>`).join("")}</tbody></table></div>
      <p class="pf-thk-n">Nominal thickness by family, from our OSAT package reference.
        Not every body size is offered in every thickness &mdash; tell us the height
        you&rsquo;re working to and we&rsquo;ll come back on it.</p>
    </section>` : "";

    const CATS = [...new Set(scope.map(r => r.t))];
    const GRADES = [...new Set(scope.map(r => r.grade).filter(Boolean))].sort();
    const pickCat = new Set(), pickGrade = new Set();
    let maxEdge = MAX_EDGE, sortKey = "area", sortDir = 1;

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
          ${GRADES.length ? `<div class="pf-fgroup"><span class="pf-label">Automotive grade</span><div class="pf-chips pf-grades"></div></div>` : ""}
          <div class="pf-fgroup"><span class="pf-label">Largest body edge</span>
            <div class="pf-range"><input class="pf-size" type="range" min="1" max="${MAX_EDGE}" step="0.5" value="${MAX_EDGE}" aria-label="Largest body edge">
            <span class="pf-rv">any</span></div></div>
          <button class="pf-clear" type="button">Clear all</button>
        </div>
      </div>
      <div class="pf-count"></div>
      <div class="pf-out"></div>`;

    const q = root.querySelector(".pf-q"), parseEl = root.querySelector(".pf-parse");
    const catsEl = root.querySelector(".pf-cats"), gradesEl = root.querySelector(".pf-grades");
    const sizeEl = root.querySelector(".pf-size"), rvEl = root.querySelector(".pf-rv");
    const countEl = root.querySelector(".pf-count"), outEl = root.querySelector(".pf-out");

    if (catsEl) catsEl.innerHTML = CATS.map(c => `<button type="button" class="pf-chip" data-c="${esc(c)}">${esc(c)}</button>`).join("");
    if (gradesEl) gradesEl.innerHTML = GRADES.map(g => `<button type="button" class="pf-chip" data-g="${esc(g)}">${esc(g)}</button>`).join("");

    const askBar = `<div class="pf-ask">
      <div><div class="pf-ask-t">Don&rsquo;t see the size you need? We can customize packaging sizes.</div>
      <div class="pf-ask-s">Tell us the body size, lead count and thickness you&rsquo;re working to, and we&rsquo;ll come back on whether it&rsquo;s in our window.</div></div>
      <a class="pf-btn" href="contact.html">Tell us what you&rsquo;re building</a></div>`;

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

    function writeURL() {
      if (embed) return;
      const u = new URLSearchParams();
      const v = q.value.trim();
      if (v) u.set("q", v);
      if (pickCat.size) u.set("cat", [...pickCat].join("|"));
      if (pickGrade.size) u.set("grade", [...pickGrade].join("|"));
      if (maxEdge < MAX_EDGE) u.set("max", maxEdge);
      const qs = u.toString();
      /* Guarded — replaceState throws in a sandboxed or file:// context, and keeping the
         URL in sync must never stop the results rendering. */
      try { history.replaceState(null, "", qs ? location.pathname + "?" + qs : location.pathname); } catch (e) {}
    }

    function render() {
      writeURL();
      const raw = q.value.trim(), p = parse(raw);
      /* Strip what has already been parsed into structured filters, so "QFN32" searches
         the family QFN with 32 leads rather than the literal string. */
      let rest = p.dims ? p.txt.replace(DIMS, "$1") : p.txt;
      if (p.leads) rest = rest.replace(/(qfn|dfn|lga|soic|msop)\s*-?\d{1,3}\b/, "$1").replace(/\b\d{1,3}\s*l\b/, "");
      const words = rest.split(/\s+/).filter(w => w.length > 1);

      const bits = [];
      if (p.dims) bits.push(`<span class="pf-tok">body <b>${p.dims[0]} &times; ${p.dims[1]} mm</b> either orientation</span>`);
      if (p.leads) bits.push(`<span class="pf-tok">leads <b>${p.leads}</b></span>`);
      if (words.length) bits.push(`<span class="pf-tok">text <b>${esc(words.join(" "))}</b></span>`);
      parseEl.innerHTML = bits.length ? `<span class="pf-label">Read as</span>${bits.join("")}` : "";
      parseEl.classList.toggle("on", !!bits.length);

      let rows = scope.filter(r => {
        if (pickCat.size && !pickCat.has(r.t)) return false;
        if (pickGrade.size && !pickGrade.has(r.grade)) return false;
        if (r.x && Math.max(r.x, r.y) > maxEdge) return false;
        if (p.leads && !r.leads.includes(p.leads)) return false;
        if (p.dims) {
          if (!r.x) return false;
          const [a, b] = p.dims, t = 0.06;
          if (!((Math.abs(r.x - a) < t && Math.abs(r.y - b) < t) || (Math.abs(r.x - b) < t && Math.abs(r.y - a) < t))) return false;
        }
        if (words.length) {
          const hay = (r.pkg + " " + r.fam + " " + r.t + " " + r.grade + " " + r.detail).toLowerCase();
          if (!words.every(w => hay.includes(w))) return false;
        }
        return true;
      });

      rows.sort((m, n) => {
        const k = sortKey, v = k === "area" ? (m.x ? m.x * m.y : 1e9) - (n.x ? n.x * n.y : 1e9)
          : k === "pkg" ? m.pkg.localeCompare(n.pkg)
          : k === "cat" ? m.t.localeCompare(n.t)
          : k === "grade" ? (m.grade || "zz").localeCompare(n.grade || "zz") : 0;
        return v * sortDir;
      });

      countEl.innerHTML = rows.length ? `<b>${rows.length}</b> package${rows.length === 1 ? "" : "s"} <span>of ${scope.length}</span>` : "";

      if (!rows.length) {
        outEl.innerHTML = `<div class="pf-empty"><b>Nothing in the reference matches that</b>
          <p>Which doesn&rsquo;t mean no. Molded bodies go down to 0.6 &times; 1.0 mm, and leadless packages from 0.37 mm thick.</p></div>
          ${nearest(p.dims)}${askBar}`;
        return;
      }

      const arr = k => sortKey === k ? `<span class="pf-arr">${sortDir > 0 ? "▲" : "▼"}</span>` : `<span class="pf-arr">↕</span>`;
      const showThk = !!THK_PANEL && rows.some(r => /DFN|QFN/i.test(r.pkg));
      outEl.innerHTML = askBar + `<div class="pf-tablewrap"><table class="pf-table"><thead><tr>
        <th data-k="pkg">Package ${arr("pkg")}</th>
        <th data-k="area">Body size ${arr("area")}</th>
        <th>Leads</th>
        <th data-k="grade">Auto grade ${arr("grade")}</th>
        <th data-k="cat">Category ${arr("cat")}</th>
        <th></th></tr></thead><tbody>
        ${rows.map(r => `<tr>
          <td class="pf-pk">${esc(r.pkg)}${r.detail ? `<span class="pf-det">${esc(r.detail)}</span>` : ""}</td>
          <td class="pf-num" data-l="Body size">${esc(r.bs || "—")}</td>
          <td class="pf-num" data-l="Leads">${r.leads.length ? esc(r.leads.join(", ")) : "—"}</td>
          <td data-l="Auto grade">${r.grade ? `<span class="pf-grade">${esc(r.grade)}</span>` : "—"}</td>
          <td class="pf-cat" data-l="Category">${esc(r.t)}</td>
          <td>${OWN[r.own] ? `<a class="pf-go" href="${esc(OWN[r.own])}">Page &rarr;</a>` : ""}</td>
        </tr>`).join("")}</tbody></table></div>` + (showThk ? THK_PANEL : "");

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
    q.addEventListener("input", render);
    root.querySelector(".pf-clear").addEventListener("click", () => {
      pickCat.clear(); pickGrade.clear(); maxEdge = MAX_EDGE;
      q.value = ""; sizeEl.value = MAX_EDGE; rvEl.textContent = "any";
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
      root.querySelectorAll("[data-c]").forEach(b => b.classList.toggle("on", pickCat.has(b.dataset.c)));
      root.querySelectorAll("[data-g]").forEach(b => b.classList.toggle("on", pickGrade.has(b.dataset.g)));
    }
    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-pkgfinder]").forEach(build);
  });
})();

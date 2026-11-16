/* inquiry-tray.js — the package inquiry on every page, and the "Copy email" button beside
   every email button (Rupert, 16 Nov 2026). Loaded site-wide from _Layout.

   Packages added with "+ Add" in a package table (package-finder.js) are kept for the visit
   in sessionStorage. On pages with a package table the finder draws its own card. On every
   other page this script shows a small "Package inquiry" tab in the bottom-right corner,
   which opens the same card: the list, Email us, Copy email, Clear, and a link back to the
   package finder, so a visitor who browses on is reminded of the packages they picked.
   The list stays until the visitor clears it or closes the tab.

   The finder saves the card's contents (package names and sizes, and the finished mailto
   link) under hana-pf-inquiry-card, so the email wording is written only in
   package-finder.js. */
(function () {
  "use strict";
  const STORE = "hana-pf-inquiry", CARD = "hana-pf-inquiry-card";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const COPY_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  const COPY_BTN = `<button type="button" class="pf-copy">${COPY_ICON}<span>Copy email</span></button>`;

  /* ── Copy email ──────────────────────────────────────────────
     The email buttons are mailto: links, which open the visitor's email program and do
     nothing where there is none (webmail-only users, in-app browsers). The copy button
     beside each one (always in a .pf-mailrow with its email link) copies the same email
     as text. It replaced a help line that appeared only when no email program seemed to
     open, which visitors could not find again. */
  const mailParts = href => {
    const u = new URL(href);
    return { to: decodeURIComponent(u.pathname), subject: u.searchParams.get("subject") || "", body: u.searchParams.get("body") || "" };
  };
  /* Copies the email as formatted text where the browser allows it, so the "Send to" line
     pastes in bold into Outlook or Gmail; plain text otherwise. The ClipboardItem is built
     inside the click, which Safari requires. Resolves false if every method is blocked. */
  const copyText = (t, html) => {
    const legacy = () => {
      const ta = document.createElement("textarea");
      ta.value = t; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {} finally { ta.remove(); }
      return ok;
    };
    if (!navigator.clipboard || !window.isSecureContext) return Promise.resolve(legacy());
    const plain = () => navigator.clipboard.writeText(t).then(() => true, () => legacy());
    if (html && window.ClipboardItem && navigator.clipboard.write) {
      try {
        return navigator.clipboard.write([new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([t], { type: "text/plain" })
        })]).then(() => true, plain);
      } catch (e) { return plain(); }
    }
    return plain();
  };
  /* Delegated, so it covers buttons that are redrawn on every filter change. */
  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest(".pf-copy");
    if (!b) return;
    const row = b.closest(".pf-mailrow"), a = row && row.querySelector("a.pf-mail");
    if (!a) return;
    const d = mailParts(a.href), label = b.querySelector("span");
    /* "Send to" first, in bold, so the address stands out once pasted (Rupert, 16 Nov 2026). */
    const text = "Send to: " + d.to + "\nSubject: " + d.subject + "\n\n" + d.body;
    const html = '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px">'
      + "<b>Send to: " + esc(d.to) + "</b><br>Subject: " + esc(d.subject) + "<br><br>"
      + esc(d.body).replace(/\n/g, "<br>") + "</div>";
    copyText(text, html).then(ok => {
      if (ok) {
        label.textContent = "Copied";
        b.classList.add("on");
        clearTimeout(b._t);
        b._t = setTimeout(() => { label.textContent = "Copy email"; b.classList.remove("on"); }, 2500);
        /* Where to send it stays in view under the buttons until the card is redrawn. */
        if (!row.querySelector(".pf-copied")) row.insertAdjacentHTML("beforeend",
          `<div class="pf-copied" role="status">Copied. Paste it into a new email and send it to <b>${esc(d.to)}</b>.</div>`);
        return;
      }
      /* Copying blocked by the browser: show the text, selected, for the visitor to copy. */
      let ta = row.parentNode.querySelector(".pf-copytext");
      if (!ta) {
        ta = document.createElement("textarea");
        ta.className = "pf-copytext"; ta.readOnly = true; ta.setAttribute("aria-label", "Email text");
        row.insertAdjacentElement("afterend", ta);
      }
      ta.value = text; ta.focus(); ta.select();
      label.textContent = "Press ⌘C or Ctrl+C";
    });
  });

  /* ── Inquiry tab on pages without a package table ──────────── */
  /* The header's own Package Finder link, so the address is right on every build (Razor
     routes, or the HTML preview's flat files and th/ folder). */
  const finderHref = () => {
    const a = document.querySelector('header a[href*="package-finder"], a[href*="package-finder"]');
    return a ? a.getAttribute("href") : "/capabilities/osat/package-finder";
  };
  function render() {
    if (document.querySelector("[data-pkgfinder]")) return;
    let card = null;
    try { card = JSON.parse(sessionStorage.getItem(CARD) || "null"); } catch (e) {}
    if (!card || !Array.isArray(card.rows) || !card.rows.length || !/^mailto:/.test(card.mailto || "")) return;
    const n = card.rows.length, SHOW = 6;
    const el = document.createElement("div");
    el.className = "inq";
    el.innerHTML = `<button type="button" class="inq-tab" aria-expanded="false" aria-controls="inq-card">
        <b class="inq-badge">${n}</b><span>Package inquiry</span><span class="inq-chev" aria-hidden="true">&#9652;</span></button>
      <div class="inq-card" id="inq-card" role="region" aria-label="Package inquiry" tabindex="-1" hidden>
        <div class="inq-head"><span><b class="inq-badge">${n}</b> package${n === 1 ? "" : "s"} in your inquiry</span>
          <button type="button" class="inq-min" aria-label="Minimize">&#9662;</button></div>
        <div class="inq-list">${card.rows.slice(0, SHOW).map(r =>
          `<span class="inq-chip">${esc(r.pkg)}${r.bs ? ` <span class="inq-bs">${esc(r.bs)}</span>` : ""}</span>`).join("")}
          ${n > SHOW ? `<span class="inq-more">+${n - SHOW} more</span>` : ""}</div>
        <div class="pf-mailrow inq-mail"><a class="inq-go pf-mail" href="${esc(card.mailto)}">Email us about ${n === 1 ? "this package" : "these " + n} &rarr;</a>${COPY_BTN}</div>
        <div class="inq-foot"><a href="${esc(finderHref())}">Add or remove packages &rarr;</a><button type="button" class="inq-clear">Clear</button></div>
      </div>`;
    document.body.appendChild(el);
    const tab = el.querySelector(".inq-tab"), box = el.querySelector(".inq-card");
    const open = on => {
      box.hidden = !on; tab.hidden = on; tab.setAttribute("aria-expanded", on);
      (on ? box : tab).focus({ preventScroll: true });
    };
    tab.addEventListener("click", () => open(true));
    el.querySelector(".inq-min").addEventListener("click", () => open(false));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !box.hidden) open(false); });
    el.querySelector(".inq-clear").addEventListener("click", () => {
      try { sessionStorage.removeItem(STORE); sessionStorage.removeItem(CARD); } catch (e) {}
      el.remove();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();

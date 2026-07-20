# Razor Pages — issue log

List anything you see wrong in the **rendered Razor site** here (not the HTML prototypes).
I work through this list directly against the `.cshtml` / CSS / JS in `exports/razor-pages/`,
then move fixed items to the "Fixed" section with a date.

**How to write an entry** — one bullet each. Include, where you can:
- **Page / route** — e.g. `/locations/ayutthaya` or the file `Pages/Locations/Ayutthaya.cshtml`
- **What's wrong** — what you see vs. what the HTML prototype shows
- **Where** — which section/component (hero, spec block, footer, mega-menu, etc.)

A screenshot or the prototype filename it should match is ideal but not required.

---

## Open

- [ ] **Dead-asset re-cleanup (done in this repo, NOT yet in Design source — every
  export re-adds these; re-deleted 3 Jul, again 13 Jul).**
  - Delete 14 dead `wwwroot` assets (~8 MB) the export keeps re-adding: 7 byte-identical
    duplicates of images used under other names (`Hana_bkk.jpg`, `automotive.jpeg` ×2,
    `medical.jpeg`, `rfid-tire.jpeg`, `telecommunications.jpeg`,
    `video-placeholder-factory.jpg`, `photos/homepage-markets-industrial.png`), plus
    genuinely unused `world-map.png`, `photos/homepage-what-sets-apart.png`,
    `cleanroom-smt-line.png`, and 3 white logo variants. Also `README 2.md` (stale macOS dup).
  - **Note:** `Hana_bkk.jpg` is byte-identical to canonical `hana-bkk.jpg`, but the export's
    `Pages/Investors/EventsContact.cshtml` re-points the head-office photo at the uppercase
    duplicate — re-point it to `~/images/hana-bkk.jpg` before deleting, each export.
  - ✅ **WebP conversion is now at source** (13 Jul export): the 6 photo PNGs
    (`ayutthaya-facility`, `ohio-facility`, `automotive-cutaway`, `photos/power-module-ecu`,
    `photo-cleanroom`, `jiaxing-facility`) ship as `.webp` and pages reference `.webp`. No
    longer needs re-applying.
- [ ] **Razor `@` escaping — export generator emits bare `@` in inline `<style>` at-rules
  (build breaker; needs fixing at source).** `dotnet build` fails on any unescaped `@media`
  etc. Re-fixed each export in: `Pages/Locations/Index.cshtml` (`@media` → `@@media`),
  `Pages/Capabilities/SmtAssembly.cshtml` (text `±20 µm @ 6σ` → `&#64;`), and — new in the
  13 Jul export — `Pages/Careers/Stories.cshtml` (`@media` → `@@media` in the hero-card
  `<style>`). The generator escapes `@media` correctly in most files but keeps missing some;
  grep `[^@]@media` across `Pages/` after every export.
- [ ] **Section-body mobile optimisation — Locations / Investors / About / Capabilities
  (done in this repo, NOT yet in Design source).** The mobile *header/footer* is now
  handled at source (see Fixed, 2 Jul). These are the remaining PAGE-BODY mobile fixes,
  which still live only as repo-side retrofit stylesheets loaded per page via `@section
  Head`. Each export overwrites the ~16 link tags (the CSS files themselves survive as
  untracked extras), so they must be re-applied after every export — or, better, built
  into the Design source so they export everywhere:
  - `wwwroot/css/locations-mobile.css` (7 pages) — inline-styled grids collapse (2-col
    splits → 1, stat strips 4 → 2×2, card grids → 1), spec-row labels stack above values,
    plant hero 440 → 380px.
  - `wwwroot/css/investors-mobile.css` (8 pages) — group-structure org chart (inline
    `width:1100px` figure + 1020px canvas) → 70%-zoom horizontal touch-scroller;
    `.section-head .intro` inline `width:593px` released; hub's decorative 480px pseudo-
    circles clipped. Also a genuine all-widths bug: `.page-end`/`#enquiries-topo`
    containment existed in only 3 of 8 IR CSS files — the other five lost the navy topo
    band; investors-mobile.css restores it.
  - `wwwroot/css/capabilities-mobile.css` (1 page) — the radial-wheel node script bails
    below `innerWidth < 980`, piling all six capability cards on one spot; below 980px the
    wheel retires and the six cards stack as a full-width list.
  - About pages needed no section file — clean once the chrome reflows.

---

## Fixed

### 20 Jul 2026 — export sync ("Hana Site (13).zip")

- **Synced the 20 Jul Design export into the repo** and re-applied the three repo-side
  retrofits (all reverted by the export, as usual):
  - **Dead-asset re-cleanup** — deleted the same 14 dead/duplicate `wwwroot` assets the
    export re-added (~8 MB); re-pointed `Investors/EventsContact.cshtml` head-office photo
    from the uppercase `Hana_bkk.jpg` duplicate back to canonical `~/images/hana-bkk.jpg`.
  - **`@`-escaping build breakers ×3** — `@media` → `@@media` in `Careers/Stories.cshtml`
    and `Locations/Index.cshtml`; text `±20 µm @ 6σ` → `&#64;` in `Capabilities/SmtAssembly.cshtml`.
  - **Mobile CSS link tags ×16** — restored the `-mobile.css` `<link>` tags:
    `capabilities-mobile.css` (Capabilities/Index), `locations-mobile.css` (7 Locations pages),
    `investors-mobile.css` (8 Investors pages). The 3 repo-only mobile stylesheets themselves
    survived the export untouched.
  - `dotnet build` clean afterwards (0 warnings, 0 errors).
- Genuine content changes at source this export (kept as-is): **Careers** — new `JobPost.cshtml`
  content, `Careers/Index.cshtml` + `careers.css` updates, new `careers-hero.jpg` hero image;
  **Contact** — `Index.cshtml` / `Rfq.cshtml` tweaks; assorted `investors-*.css` refinements
  (annual-report, events-contact, faq, news, sustainability, structure-shareholders). No new or
  removed pages this export. The investor hero `z-index` fix and footer LinkedIn SVG remain baked
  into source.

### 13 Jul 2026 — export sync ("Hana Site (12).zip")

- **Synced the 10 Jul Design export into the repo** and re-applied the three repo-side
  retrofits above (dead-asset re-cleanup, `@`-escaping build fixes ×3 files, and the ~16
  `-mobile.css` link tags across Capabilities / Locations ×7 / Investors ×8). WebP is now
  baked into source, so that item is retired.
- New at source in this export (kept as-is):
  - **Industrial & IoT market hub** — `Pages/Markets/IndustrialIot.cshtml`
    (`@page "/markets/industrial-iot"`), previously 404'ing; added to the sitemap. Ships
    `industrial-iot-hero.webp` + `wire-bond-line.jpg`.
  - **OSAT sub-capability sidebar** restored in the static HTML export (Razor already had it).
  - New Careers story photos and Annual-Report cover images; assorted cshtml/CSS content
    updates across About, Careers, Investors, Locations, Sitemap.

### 2 Jul 2026 — mobile header & footer (built at source ✅)

- **Mobile header + footer** — the shared chrome was desktop-only. Design added, at source:
  `wwwroot/js/mobile-nav.js` (dependency-free) + a `@media (max-width:900px)` block in
  `wwwroot/css/_components.css`, wired via one `<script>` tag in `_Layout.cshtml`.
  Below 900px: compact one-row header (logo · Contact · hamburger), util bar trimmed to the
  ticker, and a right-docked dark accordion panel **cloned at runtime from the existing
  desktop mega-menus** (so sub-links never drift) with Search/Careers/News/EN in the panel
  foot; footer columns stack. Desktop (>900px) is fully inert. Verified working at 390px and
  desktop. This replaced the earlier `site-mobile.css` repo stopgap, which has been deleted.

### 1 Jul 2026 — batch (mapped production routes → export files)

The production route names below map to these export files (the export uses
`Investors/…` and `Markets/Automotive…` naming).

- **Investor hero titles missing** — Annual, Sustainability, Investor Events,
  FAQ/Knowledge Hub, Investor News (`Pages/Investors/{Annual,Sustainability,EventsContact,Faq,News}.cshtml`).
  Root cause: each page's `.hero-inner` had no stacking context, so the white
  `<h1>` painted *behind* the `#hero-topo` canvas. Added `position: relative;
  z-index: 2` to `.hero-inner` in the five `investors-*.css` files (matches the
  working Governance page).
- **Nav label** — `_Header.cshtml` IR mega-menu: "Investor News" → **"Investor Financial News"**.
- **Footer LinkedIn icon invisible** — `_Footer.cshtml` used `<i data-lucide="linkedin">`,
  but Lucide dropped its brand icons from `@latest`, so nothing rendered. Replaced
  with an inline LinkedIn SVG (`fill: currentColor`).
- **Automotive hub watermark missing** (`Markets/Automotive.cshtml`) — the hero's
  `globe` background lost its faint Hana-mark watermark. The deployed
  `wwwroot/js/hana-backgrounds.js` globe generator was an older copy missing the
  mark block that `hana-backgrounds-v2.js` added. Ported the inline-SVG watermark
  block into the globe generator.
- **Power-module sub-market sidebar** (`Markets/Automotive*` sub-pages) — sidebar
  didn't collapse, showed per-item icons, and wasn't flush to the far left.
  Rebuilt to match the design source (`MidSidebar`): `.auto-spoke-grid` is now
  full-bleed / left-anchored with a `56px`↔`264px` collapse; per-item Lucide
  icons hidden; added a header collapse toggle + 2-letter initials for the
  collapsed rail (via `automotive.css` + `automotive.js`, no per-page markup edits).
- **Homepage bottom CTA** (`_Homepage_Cta.cshtml`) — removed the "Request a quote"
  ghost button. Background is `--hana-blue-deep` (dark) as intended.

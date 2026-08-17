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

- [ ] **Dead-asset re-cleanup — ⚠️ LIST STALE, RE-SCOPE BEFORE NEXT RUN (see 9 Aug Fixed).**
  As of the 9 Aug export, `world-map.png`, `rfid-tire.jpeg` and `hana-mark-white.svg` are now
  LIVE (referenced by the Insights pages and `Capabilities/RfidSmartTags.cshtml`) — do NOT delete
  them. Re-verify every remaining candidate with a fresh `grep -rl` across `Pages/` before deleting.
  (done in this repo historically, NOT yet in Design source — every export re-adds these.)
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
  grep `[^@]@media` across `Pages/` after every export. **Use a line-start-aware grep** — a bare
  `@` can sit at column 0, which `[^@]@media` misses (bit us on `Capabilities/PackageDesign.cshtml`
  `@supports`/`@media`, 17 Aug): `grep -rnE '(^|[^@])@(media|supports|keyframes|font-face)' Pages/ | grep -vE '@@'`.
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

### 17 Aug 2026 — export sync ("razor pages - Hana Site.zip")

- **Synced the 17 Aug Razor export.** No structural change — same page set (62 pages changed,
  no adds/removes). 26 new image assets: plant-floor photos for Ayutthaya / Jiaxing / Koh Kong /
  Lamphun, li-fi module images, IGBT/SiC power-module photos, and 5 access-control product photos.
  `ISSUES.md` excluded; `README.md` taken from export; `Directory.Build.props` + 3 mobile CSS preserved.
- **`@`-escaping breakers — MORE than usual this export (6 files + a NEW line-start variant):**
  the usual `Careers/Stories.cshtml` and `Locations/Index.cshtml`, PLUS four plant pages
  (`Locations/{Lamphun,Ayutthaya,Jiaxing,KohKong}.cshtml`) whose new photo-grid inline `<style>`
  carried `@media(max-width:900px)`. **New trap:** `Capabilities/PackageDesign.cshtml` had
  `@supports` and `@media` at *column 0* (line start), which the old `grep '[^@]@media'` misses
  because there's no preceding char — the build caught them (CS0103 'supports'/'media'). Now escaped
  with a line-start-aware pass: `grep -rnE '(^|[^@])@(media|supports|keyframes|font-face)' Pages/`.
- **Standalone-HTML build breakers — same 5 pages again** (`Insights/{Index,AutomotivePcbaAssembly}`,
  `Legal/{PrivacyPolicy,TermsOfUse,CookiePolicy}`): repaired as before (strip `ang="en">`→`</header>`,
  `<main …ins-page>` → `<div class="ins-page">` + closing `</div>`). Runtime-verified: one
  `hana-header`/`hana-footer`/`<!DOCTYPE` per page, all routes 200.
- **Standing retrofits re-applied:** 16 `-mobile.css` `<link>` tags (cap 1 / loc 7 / inv 8);
  `Hana_bkk.jpg` re-pointed to canonical `~/images/hana-bkk.jpg` in `Investors/EventsContact.cshtml`
  — and this round the byte-identical `Hana_bkk.jpg` dup was actually **deleted** (0 refs, verified
  `cmp`-identical). Broader dead-asset cleanup still deferred pending list re-scope (see Open).
- `dotnet build` clean afterwards: 0 warnings, 0 errors.

### 9 Aug 2026 — export sync ("razor pages 9-8 Hana Site.zip") + backend update

- **Synced the 9 Aug Razor export.** Large Capabilities restructure: **8 new sub-pillar
  pages** (`HermeticCeramic`, `OpticalPackaging`, `PackageDesign`, `PowerPackages`,
  `QfnDfnLga`, `SystemInPackage`, `UltraSmallPackages` under `/capabilities/osat/…`, plus
  `RoboticSmartManufacturing` under `/capabilities/automation/…`) and **4 superseded pages
  deleted** (`DieAttachWireBond`, `FlipChipSip`, `InlineAoiSpi`, `RoboticHandlingTest`).
  New **site search** feature shipped at source (`wwwroot/css/search.css`, `js/site-search.js`,
  `js/search-shell.js`, `js/search/*`). ~101 files changed overall.
- **`ISSUES.md` excluded from the sync** (repo-maintained); `README.md` taken from export
  (identical this time). `Directory.Build.props` and the 3 repo-only `-mobile.css` files preserved.
- **Standalone-HTML build breakers recurred (RZ1034) — same 5 pages as 30 Jul.** Repaired
  `Insights/{Index,AutomotivePcbaAssembly}.cshtml` and `Legal/{PrivacyPolicy,TermsOfUse,
  CookiePolicy}.cshtml`: stripped the mangled `ang="en">` doc opener through the duplicate
  `</header>`, swapped `<main id="main-content" class="ins-page">` for `<div class="ins-page">`
  + closing `</div>`. Verified at runtime: every page renders one `hana-header` / `hana-footer` /
  `<!DOCTYPE`, all routes 200.
- **Re-applied the standing retrofits:**
  - **Mobile CSS `<link>` tags ×16** — capabilities 1, locations 7, investors 8 (all stripped by export).
  - **`@`-escaping ×2** — `@media` → `@@media` in `Careers/Stories.cshtml` and `Locations/Index.cshtml`.
  - **`Hana_bkk.jpg`** — re-pointed to canonical `~/images/hana-bkk.jpg` in `Investors/EventsContact.cshtml`.
- **Dead-asset cleanup NOT run this round — list has drifted.** Three of the 14 formerly-dead
  assets are now genuinely referenced by the restructured export: `world-map.png` (Insights hub +
  article thumbs), `rfid-tire.jpeg` (`Capabilities/RfidSmartTags.cshtml`), `hana-mark-white.svg`
  (`Insights/AutomotivePcbaAssembly.cshtml`). Deleting the old list wholesale would now 404 live
  images. The Open item needs re-scoping before the next cleanup. (The `Hana_bkk.jpg` byte-dup is
  still safe to remove — done via the re-point above; other genuinely-dead files left in place pending
  a corrected list.)
- **Backend system export updated** (`docs/backend-system/export/`, design source, build-excluded):
  new `Services/AssignmentMailer.cs` + `emails/assignment-summary.html(.preview.html)` (ticket
  assignment email), updated Tickets list/store/row UI, `admin.css`, `tickets.js`, `README.md`,
  and a `hana-logo-full-white.png` asset. No files removed.
- `dotnet build` clean afterwards: 0 warnings, 0 errors.

### 30 Jul 2026 — export sync ("razor 30-7 Hana Site.zip")

- **Synced the 30 Jul export.** Large: 134 files, +6149/-775. New pages — Insights (hub +
  Automotive PCBA article), Legal (Privacy, Terms, Cookies), `Markets/DataCenters`, the
  Capabilities process pages, and an Industrial & IoT re-export.
- **`ISSUES.md` deliberately EXCLUDED from the sync.** The export ships its own 73-line copy;
  this file is 138 lines and is repo-maintained. Syncing it would have destroyed the whole
  Open section. **Always `rsync --exclude 'ISSUES.md'`.** (`README.md` was taken from the
  export — that one *is* newer, and carries the export's own 30 Jul sync notes.)
- **NEW BUG CLASS — five pages exported as complete standalone HTML documents.** Build broke
  with 5× `RZ1034: Found a malformed 'body' tag helper`. `Legal/{CookiePolicy,PrivacyPolicy,
  TermsOfUse}.cshtml` and `Insights/{Index,AutomotivePcbaAssembly}.cshtml` each contained a
  mangled `<html>` opener (the literal line `ang="en"><head>…`, i.e. `<!DOCTYPE html><html l`
  had been eaten), their own `<head>`, `<body>`, and a full duplicate `<header class=
  "hana-header">` — 314-371 lines of chrome the layout already provides. Body content itself
  was complete; only the closing `</main></body></html>` was absent.
  **Repo-side repair:** removed everything from the `ang="en">` line through `</header>`, and
  replaced `<main id="main-content" class="ins-page">` with `<div class="ins-page">` + a
  closing `</div>`, since `_Layout.cshtml` already supplies `<main id="main-content">` and
  `.ins-page` carries real styling (`insights.css:8`). Verified: one `<html>`/`<head>`/
  `<body>` per rendered page, header and footer once each, all routes 200.
- **Re-applied the three standing retrofits, all reverted by this export as usual:**
  - **Mobile CSS `<link>` tags ×16** — this export stripped *all* of them (locations 7,
    investors 8, capabilities 1; only `homepage-mobile.css` survived, being at source).
  - **`@`-escaping build breakers ×2** — `@media` → `@@media` in `Careers/Stories.cshtml`
    and `Locations/Index.cshtml`. (`Capabilities/SmtAssembly.cshtml` is now clean at source.)
  - **`Hana_bkk.jpg`** — re-pointed to canonical `~/images/hana-bkk.jpg` in
    `Investors/EventsContact.cshtml`.
- `dotnet build` clean afterwards: 0 warnings, 0 errors.

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

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

- [ ] **Dead-asset re-cleanup — ✅ LARGELY RESOLVED BY THE 8 SEP SYNC; keep watching.**
  The 8 Sep export renamed almost every legacy asset to a `-hero`/`mk-`/`svc-`/`hp-` name and
  shipped WebP versions, so the sync was run with `rsync --delete` and removed **46 superseded
  assets** after verifying each was unreferenced across the export's `Pages/`, `css/` and `js/`.
  The old duplicate-name problem is gone at source: `Hana_bkk.webp` is now the single canonical
  head-office photo (no `hana-bkk.jpg` / `Hana_bkk.jpg` pair), so **the standing `Hana_bkk`
  re-point retrofit is retired**.
  - **Method for future syncs:** run `rsync --delete` with the exclusion list below, then
    re-verify with a basename `grep -rl` across the export before accepting deletions.
    **Watch for substring false positives** — `osat.png` matches `svc-osat.png`,
    `hero-loop.mp4` matches `hp-hero-loop.mp4`. Match on the full `~/images/...` path.
  - **Permanent exclusions (must survive every sync):** `ISSUES.md`, `Directory.Build.props`,
    `docs/`, the 3 repo-only `-mobile.css` files, `Pages/Locations/Cheongju.cshtml` **and its
    `wwwroot/images/cheongju-facility.jpg`** (the page is dormant but kept re-linkable — the
    export deletes the image if you don't exclude it).
- [ ] **Razor `@` escaping — export generator emits bare `@` in inline `<style>` at-rules
  (build breaker; needs fixing at source).** `dotnet build` fails on any unescaped `@media`
  etc. Re-fixed each export in: `Pages/Locations/Index.cshtml` (`@media` → `@@media`),
  `Pages/Capabilities/SmtAssembly.cshtml` (text `±20 µm @ 6σ` → `&#64;`), and — new in the
  13 Jul export — `Pages/Careers/Stories.cshtml` (`@media` → `@@media` in the hero-card
  `<style>`). The generator escapes `@media` correctly in most files but keeps missing some;
  grep `[^@]@media` across `Pages/` after every export. **Use a line-start-aware grep** — a bare
  `@` can sit at column 0, which `[^@]@media` misses (bit us on `Capabilities/PackageDesign.cshtml`
  `@supports`/`@media`, 17 Aug): use a **broad at-rule alternation** — the 8 Sep export added a
  brand-new variant, `@container` in `Capabilities/PackageDesign.cshtml`, which the old
  four-keyword grep missed and which broke the build (CS0103 'container'). Current sweep:
  `grep -rnE '(^|[^@[:alnum:]_])@(media|supports|keyframes|font-face|container|layer|scope|property)\b' Pages/ | grep -vE '@@'`
  (ignore the legitimate Razor `@page` directives and `_ViewImports.cshtml`'s `@namespace`).
- [ ] **Section-body mobile optimisation — Locations / Investors / About / Capabilities
  (done in this repo, NOT yet in Design source).** The mobile *header/footer* is now
  handled at source (see Fixed, 2 Jul). These are the remaining PAGE-BODY mobile fixes,
  which still live only as repo-side retrofit stylesheets loaded per page via `@section
  Head`. Each export overwrites the ~17 link tags (the CSS files themselves survive as
  untracked extras), so they must be re-applied after every export — or, better, built
  into the Design source so they export everywhere:
  - `wwwroot/css/locations-mobile.css` (7 pages) — inline-styled grids collapse (2-col
    splits → 1, stat strips 4 → 2×2, card grids → 1), spec-row labels stack above values,
    plant hero 440 → 380px.
  - `wwwroot/css/investors-mobile.css` (9 pages — the 8 English IR pages plus, from the
    8 Sep export, the Thai twin `Pages/ThaiPages/Investors/Index.cshtml`, which loads the
    same `investors.css` and therefore inherits the same defects) — group-structure org chart (inline
    `width:1100px` figure + 1020px canvas) → 70%-zoom horizontal touch-scroller;
    `.section-head .intro` inline `width:593px` released; hub's decorative 480px pseudo-
    circles clipped. Also a genuine all-widths bug: `.page-end`/`#enquiries-topo`
    containment existed in only 3 of 8 IR CSS files — the other five lost the navy topo
    band; investors-mobile.css restores it.
  - `wwwroot/css/capabilities-mobile.css` (1 page) — the radial-wheel node script bails
    below `innerWidth < 980`, piling all six capability cards on one spot; below 980px the
    wheel retires and the six cards stack as a full-width list.
  - About pages needed no section file — clean once the chrome reflows.
- [ ] **Thai font — `Sarabun-*.woff2` 404s on every `/th/` page (source-side, non-breaking).**
  `wwwroot/css/_components.css` declares `@font-face` with `url(../fonts/Sarabun-Regular.woff2)
  format('woff2')` first and the `.ttf` as fallback, but the export ships **only** the two
  `.ttf` files. Every Thai page therefore fires 2 failed requests before falling back; the
  text renders correctly, so this is a performance/console-noise issue, not a visual bug.
  **Fix at source** — either ship the `.woff2` pair or drop the `woff2` entries from the two
  `@font-face` rules. Deliberately NOT patched repo-side (the next export would overwrite it).

---

## Fixed

### 8 Sep 2026 — export sync ("razor pages 8-9 Hana Site.zip")

- **Synced the 8 Sep Razor export** (`rsync --delete`): 118 files added, 119 modified,
  47 removed. `dotnet build` clean afterwards (0 warnings, 0 errors) and **all 102 routes
  verified 200 at runtime**.
- **Page set — 3 in, 3 out (net 119, unchanged).**
  - **New:** `Contact/Anonymous.cshtml` (`/contact/anonymous` — anonymous Code-of-Conduct
    communication form) and the **first two Thai twins**, `ThaiPages/Investors/Index.cshtml`
    (`/th/investor-relations`) and `ThaiPages/Legal/PrivacyPolicy.cshtml` (`/th/privacy-policy`).
    Ships the Sarabun Thai font pair + `OFL.txt`, and
    `wwwroot/documents/data-subject-right-request-form.pdf`.
  - **Removed at source (verified unreferenced anywhere in the new export, both arrived via
    earlier exports — not repo-side work):** `Markets/IndustrialIotPowerModules.cshtml` and
    `Markets/OpticalSensorsMicrodisplay.cshtml`.
  - **`Locations/Cheongju.cshtml` deliberately preserved** (excluded from the sync), together
    with its `wwwroot/images/cheongju-facility.jpg` — the export would have deleted the image
    and left the dormant page with a broken hero.
- **Large asset pass — 46 superseded files deleted.** Wholesale renames plus WebP conversion:
  `icons/*.png` → `icons/svc-*.png`, `photos/homepage-markets-*` → `photos/mk-*-hero.webp`,
  `videos/hero-loop.mp4` → `videos/hp-hero-loop.mp4`, and jpg/png → webp for `careers-hero`,
  `hana-team-heart`, `hero-bg`, `hq-cover`, `koh-kong-facility`, `lamphun-facility`, `lifi-*`,
  `vertical-integration-bg`, `wire-bond-line`, `world-map`, `world-map3`, `DSC_5075`, `Hana_bkk`.
  Each deletion was checked against the export's `Pages/` + `css/` + `js/` first. Also lands
  ~19 Jiaxing "life at Hana" photos and a batch of new capability/market hero photography.
- **`@`-escaping breakers — 9 files, and a NEW at-rule keyword.** The usual six
  (`Careers/Stories`, `Locations/Index`, and the four plant pages) plus
  `Capabilities/RfidTireTags.cshtml`. Then the build still failed on
  `Capabilities/PackageDesign.cshtml` line 230: **`@container`** at column 0 — a keyword the
  established four-word grep (`media|supports|keyframes|font-face`) does not match. The Open
  item's sweep has been widened accordingly.
- **Standalone-HTML build breakers — the same 5 pages AGAIN, plus a Thai variant (6 total).**
  `Insights/{Index,AutomotivePcbaAssembly}` and `Legal/{PrivacyPolicy,TermsOfUse,CookiePolicy}`
  as before, and now `ThaiPages/Legal/PrivacyPolicy.cshtml` — whose mangled opener reads
  **`ang="th">`**, not `ang="en">`, so a literal `ang="en"` grep misses it. Repaired as usual
  (strip the `ang="…">` line through the first following `</header>`; `<main id="main-content"
  class="ins-page">` → `<div class="ins-page">` with a matching close, reusing the page's own
  `</main>` where one existed). Verified at runtime: one `<!DOCTYPE>` / `<html>` / `hana-header`
  / `hana-footer` / `<main>` per page.
  **Note for `Insights/AutomotivePcbaAssembly.cshtml`:** it has a *second*, legitimate
  `</header>` inside the article body — always cut to the FIRST `</header>` after the opener.
- **Standing retrofits re-applied:** 17 `-mobile.css` `<link>` tags (capabilities 1 /
  locations 6 + Cheongju's preserved / investors 8 + the new Thai IR twin). Confirmed loading
  at runtime and no horizontal overflow at 375px on the IR group-structure org chart.
- **`Hana_bkk` re-point retrofit RETIRED** — source now ships a single `Hana_bkk.webp`; the
  byte-identical `hana-bkk.jpg` / `Hana_bkk.jpg` pair no longer exists.
- **New open item logged:** `Sarabun-*.woff2` 404s on every `/th/` page (see Open).

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

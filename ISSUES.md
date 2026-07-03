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

- [ ] **Asset cleanup + WebP conversion (done in this repo 3 Jul, NOT yet in Design
  source — next export will revert it unless synced with exclusions).**
  - Deleted 14 dead `wwwroot` assets (~8 MB): 7 were byte-identical duplicates of images
    used under other names (`Hana_bkk.jpg`, `automotive.jpeg` ×2, `medical.jpeg`,
    `rfid-tire.jpeg`, `telecommunications.jpeg`, `video-placeholder-factory.jpg`,
    `photos/homepage-markets-industrial.png`), plus genuinely unused `world-map.png`,
    `photos/homepage-what-sets-apart.png`, `cleanroom-smt-line.png`, and 3 white logo
    variants. Also deleted `README 2.md` (stale macOS duplicate).
  - Converted 6 photo PNGs → WebP at q82 (~13 MB → ~1.2 MB): `ayutthaya-facility`,
    `ohio-facility`, `automotive-cutaway`, `photos/power-module-ecu`, `photo-cleanroom`,
    `jiaxing-facility`; updated the 9 referencing pages. **The Design source still holds
    the PNGs and `.png` references** — ideally swap them there too, otherwise re-apply
    after each export (same drill as the mobile link tags below).
- [ ] **Razor `@` escaping — export generator emits bare `@` in two places (build
  breaker; fixed in repo 3 Jul, needs fixing at source).** `dotnet build` failed on:
  `Pages/Locations/Index.cshtml` inline `<style>` had `@media` (must be `@@media` in
  Razor — the export escapes it correctly in 3 other files but missed this one), and
  `Pages/Capabilities/SmtAssembly.cshtml` had the literal text `±20 µm @ 6σ` (bare `@`
  before a space; now `&#64;`). If the site "ran fine" before, it was a stale build —
  HEAD did not compile until these fixes.
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

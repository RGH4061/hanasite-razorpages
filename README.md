# Hana — corporate site (ASP.NET Core Razor Pages export)

**Format:** ASP.NET Core 8 · Razor Pages (`.cshtml`) · vanilla CSS · vanilla JS
**No JSX. No React. No build step.** Every page is server-rendered HTML that runs in your existing .NET environment.

This is the single Razor Pages project the whole marketing site is being exported into. It replaces the earlier prototype, where pages rendered through React/Babel at runtime and shipped `.jsx` files your environment can't execute. Here, each page is a plain `.cshtml` view; the only JavaScript is small, framework-free progressive enhancement (canvas hero, mega-menu, carousels, the locations map).

---

## Run it

```bash
cd exports/razor-pages
dotnet run
```

Then browse to the root. Static assets (CSS, JS, fonts, images) serve from `wwwroot/` via `app.UseStaticFiles()`.

`preview-locations.html` and `preview-capabilities.html` are **static, no-.NET previews** (header + footer + page) — open either directly in a browser to see the rendered output without installing the SDK. They are not part of the app; delete them before deploying.

---

## Project layout

```
exports/razor-pages/
├── HanaSite.csproj                 ← net8.0 web project
├── Program.cs                      ← minimal Razor Pages host
├── preview-locations.html          ← static preview (not deployed)
├── Pages/
│   ├── _ViewImports.cshtml         ← namespace + tag helpers
│   ├── _ViewStart.cshtml           ← applies _Layout to every page
│   ├── Index.cshtml (+ .cs)        ← homepage
│   ├── Locations/
│   │   ├── Index.cshtml            ← /locations   (hub + world map)
│   │   ├── Ayutthaya.cshtml        ← /locations/ayutthaya
│   │   ├── Lamphun.cshtml          ← /locations/lamphun
│   │   ├── Jiaxing.cshtml          ← /locations/jiaxing
│   │   ├── KohKong.cshtml          ← /locations/koh-kong
│   │   ├── Ohio.cshtml             ← /locations/ohio
│   │   └── Cheongju.cshtml         ← /locations/cheongju
│   ├── Markets/
│   │   ├── Automotive.cshtml              ← /markets/automotive
│   │   └── AutomotivePowerModules.cshtml  ← /markets/automotive/power-modules
│   └── Shared/
│       ├── _Layout.cshtml          ← host layout: <head>, header, footer, global JS
│       ├── _Header.cshtml          ← global header + mega-menus
│       ├── _Footer.cshtml          ← global footer
│       ├── _Homepage_*.cshtml      ← homepage sections
│       └── _Icon_*.cshtml          ← inline SVG icon partials
└── wwwroot/
    ├── css/
    │   ├── site.css                ← @import entry (tokens → base → layout → components)
    │   ├── _tokens.css             ← all design tokens (:root custom properties)
    │   ├── _base.css               ← design-system primitives (type, buttons, cards, spec blocks)
    │   ├── _layout.css             ← page wrap, grid + section helpers
    │   └── _components.css         ← site chrome + homepage-specific components
    ├── fonts/                      ← Geist · Inter · IBM Plex Mono (TTF, self-hosted)
    ├── images/                     ← logos, photos, world map
    └── js/
        ├── hana-backgrounds.js     ← renders [data-hana-bg] section art (auto-scan)
        ├── mega-menu.js            ← header mega-menu hover logic
        ├── circuit-hero.js         ← homepage hero canvas
        ├── capability-carousel.js  ← homepage capability carousel
        ├── locations.js            ← plant-page card carousels
        └── locations-map.js        ← locations hub interactive world map
```

### How a page works

`_ViewStart.cshtml` applies `_Layout.cshtml` to every page. The layout draws the `<head>`, the shared `<partial name="_Header" />`, the page body via `@RenderBody()`, and the shared `<partial name="_Footer" />`, then loads the global JS. A page only contains its own `<main>` content plus, optionally, a `@section Scripts { … }` block for page-specific scripts.

Routes are set with an explicit `@page "/locations/ayutthaya"` directive so URLs match the nav exactly, independent of the file name.

---

## Conventions (carried over from the homepage export)

| Rule | Where |
|---|---|
| No JSX / React / build step | All files — plain HTML + vanilla JS |
| Design tokens only in `:root` | `wwwroot/css/_tokens.css` |
| `@font-face` local, never a font CDN | `_components.css` (fonts in `wwwroot/fonts/`) |
| Section backgrounds are **declarative** | `data-hana-bg="grid" data-variant="dark" …` → `hana-backgrounds.js` renders them (no baked SVG in the markup) |
| `~/` prefix for static asset paths | All partials and pages |
| `data-lucide` + Lucide UMD for UI icons | header, footer; `lucide.createIcons()` runs once in `_Layout` |
| Per-page SEO via `ViewData` | `ViewData["Title"]`, `["Description"]`, `["Canonical"]` |

The Locations data (specs, certifications, addresses, capability lists) is **hard-coded directly in each page's HTML**, as requested — no model binding, nothing to wire up. To edit a plant's facts, edit that one `.cshtml`.

---

## Status

### Re-export — 25 Jun 2026 (changes since the 23 Jun export)
- **Header.** `_Header.cshtml` re-synced to the live homepage chrome: switched the logo to the trimmed PNG lockup (`~/images/hana-logo-full-trimmed.png`, 200×65, also in `_Footer`), simplified the **About** mega-menu to two columns (Company · Connect), and synced menu copy (Markets blurbs, Automation → "Manufacturing Traceability", DFx/JDM/NPI labels, "Investor FAQ & Knowledge Hub").
- **Capabilities hub redesign.** `Capabilities/Index.cshtml` replaced the card grid with the new **radial diagram** hero — a dark globe-backed section with the six capability nodes arranged around the Hana mark (vanilla JS positions nodes + draws connector lines, re-renders on resize). The six parent-capability hubs and their sub-cards were already in sync.
- **Markets / Automotive — all five sub-markets now live.** The hub (`Markets/Automotive.cshtml`) cards link through to live spokes (no more "Soon"). Added the four remaining lite-spoke pages alongside Power Modules:
  - `Markets/AutomotiveSensorAssembly.cshtml` (`/markets/automotive/sensor-assembly`) — with the interactive vehicle-cutaway hero + sensor legend.
  - `Markets/AutomotiveLedLighting.cshtml` (`/markets/automotive/led-lighting`).
  - `Markets/AutomotiveRfidTireTags.cshtml` (`/markets/automotive/rfid-tire-tags`).
  - `Markets/AutomotivePcba.cshtml` (`/markets/automotive/automotive-pcba`).
  - `Markets/AutomotivePowerModules.cshtml` rebuilt to the current lite-spoke template (simplified capability cross-link block, dark "Where we build it" band, all-five-live sidebar, 3-item FAQ).
  Each spoke carries self-referencing SEO + `FAQPage` JSON-LD and cross-links to the capability that executes the work. Sitemap Markets section now lists all five.
- **Investor Relations.** Verified all eight IR pages against the current prototypes (in sync); corrected the hub feature-banner label to "Investor Financial News".

### Re-export — 23 Jun 2026 (changes since the prior export)
- **New — Markets / Automotive.** `Pages/Markets/Automotive.cshtml` (`/markets/automotive`, Direction A: editorial cutaway hero + interactive component markers, the automotive advantage grid, sub-market cards, plants band, FAQ, CTA) and `Pages/Markets/AutomotivePowerModules.cshtml` (`/markets/automotive/power-modules` — the worked "lite spoke", with sidebar, capability cross-link, and `FAQPage` JSON-LD). The other four sub-markets are anchors until they have real content. CSS: `wwwroot/css/automotive.css`; interactions: `wwwroot/js/automotive.js`. Header mega-menu + footer Markets → Automotive now resolve. Sitemap gains a Markets section.
- **Fixed — Locations world map.** `wwwroot/js/locations-map.js` now nests the map image inside the SVG (`viewBox 0 0 1000 310`, `preserveAspectRatio="xMidYMid slice"`, `940/352` wrapper) so the empty bottom band is cropped — matching the prototype.
- **Fixed — IR hero backgrounds.** The IR pages had the `#hero-topo` / `#enquiries-topo` / `#stock-chart` canvases but no script to paint them. Added `wwwroot/js/investors-bg.js` (three self-guarding routines) and referenced it from all 8 IR pages via `@@section Scripts`.
- **Header / footer.** Header now carries a single **Contact** CTA (the redundant "Talk to engineering" button removed); footer Investors column gains **FAQ & Knowledge Hub**.
- *Note:* the Capabilities hub was reviewed and left unchanged — no specific fix was identified for it in this pass.

**Done and verified**
- Project shell — `_Layout`, `_ViewStart`, `_ViewImports`, `Program.cs`, `HanaSite.csproj`, full `wwwroot` (css/fonts/images/js).
- **Homepage** (`Index.cshtml`) — carried over from the prior homepage export, now hosted by the shared layout.
- **Locations — complete**: hub (`/locations`) with the interactive world map, plus all six plant pages (Ayutthaya, Lamphun, Jiaxing, Koh Kong, Ohio, Cheongju).
- **Capabilities — complete**: overview (`/capabilities`), all six parent-capability hubs (`/capabilities/pcba-box-build`, `/osat`, `/microelectronic-assembly`, `/rfid-smart-tags`, `/automation`, `/dfx-jdm`), and the five worked sub-capability detail pages (SMT assembly, COB assembly, box build, chip-on-flex under PCBA; flip chip under OSAT). Sub-capabilities without authored content show a “Page in progress” card, exactly as the prototype did.
- **About — complete**: Why Hana (`/about`), Leadership (`/about/leadership`), Our heritage (`/about/history`, with the interactive decade timeline), Quality & awards (`/about/quality`). Each page's bespoke CSS is externalized to `wwwroot/css/about*.css`.
- **Contact — complete**: Contact (`/contact`, general enquiry form + sales-offices accordion) and Plant RFQ (`/contact/rfq`). Forms are native HTML with a small vanilla helper (`~/js/contact-forms.js`) for the chip multiselects, reCAPTCHA gate and file list; submit currently shows the success panel client-side — wire an `OnPost` handler (or `fetch`) for the backend.
- **Careers — complete**: landing (`/careers`, with job filters, life-at-Hana location tabs + image carousels, and the topographic canvas band), open role (`/careers/job-post`), apply (`/careers/apply`, with CV upload), stories (`/careers/stories`, filterable), and data consent (`/careers/consent`). Per-page CSS in `wwwroot/css/careers*.css`; interactions in `wwwroot/js/careers*.js`.
- **Investor Relations — complete**: hub (`/investor-relations`) plus News, Annual Report (`/annual`), Governance, Group Structure & Shareholders (`/structure`), Investor FAQ, Investor Events & Contact (`/contact`), and Sustainability (`/esg`). Page CSS in `wwwroot/css/investors*.css`; hero canvas backgrounds run inline.
- **Sitemap — complete** (`/sitemap`): a static, route-accurate index of every page, rebuilt to use the shared chrome.

**The full site is now converted.** Every page in the marketing site exists as a plain `.cshtml` under `Pages/` with matching assets under `wwwroot/`. There are no `.jsx` files, no React/Babel runtime, and no build step anywhere in this project.

---

## Open items before go-live

- [ ] **SET ticker** — static (`฿24.50 / +1.24%`) in `_Header` / `_Footer`. Wire to your SET feed.
- [ ] **Photography** — plant pages and cards use labeled engineering placeholders. Drop approved images into `wwwroot/images/` and swap the placeholder `<div>`s for `<img>`.
- [ ] **Search + language toggle** — visual placeholders in the header.
- [ ] **Lucide** — loaded from unpkg CDN. If you prefer no runtime CDN dependency, vendor `lucide.min.js` into `wwwroot/js/` and update the `<script>` in `_Layout`.
- [ ] **Map flags** — the world-map callout pulls country flags from `flagcdn.com`; vendor them locally if external calls aren't allowed.

---

*Generated from the Hana design prototype. Design system: Hana Microelectronics Group.*

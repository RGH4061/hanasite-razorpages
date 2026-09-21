## Latest changes (21 Sep 2026 — real IR documents replace the placeholder rows)

The five IR document pages listed invented placeholder rows from the wireframe. They now
carry the 349 documents that actually exist, from *IR document mapping (21 Sep 2026) v6.xlsx*,
every ID verified against the live site. Both `Pages/Investors/` and `Pages/ThaiPages/Investors/` are updated.
Full notes: `notes/IR document lists — real documents (21 Sep 2026).md`.

- **Row format** — each row is `<a href="/File/ViewDoc/6074" data-doc-id="6074" target="_blank">`.
  The attribute repeats the ID in the URL so the hard-coded link can be swapped for a database
  query without rebuilding the markup. Keep it on every row. Thai pages carry the Thai label
  and the Thai link; the two languages often have different IDs.
- **Counts** — Investor News 301 (SET announcements 155, press releases 51, financial
  information 95), Annual Reports 15, Governance 28, Sustainability 2, Group Structure &
  Shareholders 2.
- **Investor News** — year selector rebuilt to 2026–2016 with real per-year counts. The
  Investor Presentation and Financial Highlights rows are gone (no such documents exist) and
  the Financial Information intro no longer mentions them, in both languages.
- **Annual Reports** — one list of 15 under `#annual-report`; the `#56-1-report` section and
  its sidebar entry are removed. 2021 onward is the 56-1 One Report, which replaced the
  separate annual report and Form 56-1. Cover images were carried across by year.
- **Governance** — the "Show 6 earlier documents" archive expander is gone; all 18 policies
  sit in one list. The Anti-Corruption Policy and Brochure appear under Anti-corruption only,
  so Corporate governance policies has 18 rows, not 20.
- **Group Structure** — the section had only the org chart; a document table was added below
  it, built to match `#major-shareholders`.
- **Date columns removed** from every document table on these pages.
- **Year-switching script restored** on the news pages — it had been lost in export, and the
  year buttons did nothing. Eleven years now depend on it.

Known gaps: the 17 October 2023 private-placement announcement has no working link in either
language (document 4590 is broken on the live site) and renders as plain text; six documents
are broken live and both languages point at the working file until they are restored; 62
documents show the same link in both languages because only one was filed.

## Earlier changes (14 Sep 2026 — package finder and site search wired for Razor)

The finder and the search surfaces were written for the static export and copied across
unchanged, so they linked to flat `.html` files and looked for data no Razor page loaded.
Fixed at source (details in `ISSUES.md`):

- `_Layout.cshtml` loads `js/search/packages.js` before `search/engine.js`, so
  `window.HS_PACKAGES` exists site-wide — the finder renders, and the package card works
  in the header dropdown, the mobile menu and on `/search`. It is ~35 KB on every page; if
  that matters, load it on first keystroke instead, but keep it ahead of `engine.js`, which
  reads it once at load. The finder pages must not load it a second time.
- `js/site-search.js` — `FILE`/`href()` replaced by a `ROUTE` map of the 32 index addresses
  whose Razor route differs, plus a trailing-slash-dropping fallback that keeps `#anchors`.
  **The map is generated from the `@page` directives under `Pages/`** — regenerate it when a
  route is renamed instead of hand-patching links. No `.html` anywhere in the file.
- `js/search/data.js` — 11 entries for pages that don't exist removed; the index is 93 pages.
- `js/package-finder.js` — `OWN` map points at Razor routes; clear-mold rows resolve to
  `/capabilities/osat/optical-packaging`; the CTA goes to `/contact`.
- `Capabilities/QfnDfnLga.cshtml` and `Capabilities/UltraSmallPackages.cshtml` regained the
  embedded "Package reference · live" section they were missing.

Fixed in the same pass, same class of bug (index addresses used as links): the new
`Capabilities/DieAttachWireBond.cshtml` (the sidebar linked it on every capability page but
it had never been exported), the plant pages' "Explore" lists, the two Markets hub tiles,
and `/about/why-hana` on the homepage band. `Locations/Index.cshtml` now carries an explicit
`@@page "/locations"`. Removed: `wwwroot/js/search-shell.js` and the `preview-*.html` files.

Anything added to a Razor page must escape `@` as `@@` in inline `<style>` (`@@media`,
`@@supports`) and in visible text, or the build fails.

## Earlier changes (14 Sep 2026 — brought level with the static export)

The static export had drifted ahead of this project. Ported in:

- **New `Pages/Search.cshtml`** (`/search`) — the search results page. The search JS and CSS
  were already deployed in `wwwroot/`; there was no page.
- **New `Pages/Capabilities/PackageFinder.cshtml`** (`/capabilities/osat/package-finder`) —
  the 117-row package finder. Added `wwwroot/js/package-finder.js`,
  `wwwroot/js/search/packages.js` and `wwwroot/css/package-finder.css`.
- **Seven new Thai IR pages** under `Pages/ThaiPages/Investors/` — Annual, EventsContact,
  Sustainability, Faq, Governance, News, Structure (`/th/investor-relations/*`), each with
  canonical + hreflang and `ViewData["Lang"] = "th"`. Thai now covers the eight IR pages and
  the privacy policy, matching the static export.
- **Six pages repaired** — Legal (privacy / terms / cookies), Insights (hub + article) and the
  Thai privacy policy each contained a full second HTML document (`<html>`, `<head>`, its own
  header and footer) inside the layout, so they rendered doubled chrome. Rebuilt as
  content-only pages using `ViewData` and `@@section Head`.
- **Assets synced** from the static export: `site.css` (was missing the `_mobile.css` import,
  so the whole mobile pass was absent), `_mobile.css`, `locations-mobile.css`, `search.css`,
  `market-page.css`, `site-search.js`, `search-shell.js`, `search/data.js`, `search/engine.js`.
- **Shared chrome** — footer Why Hana / Sustainability / Investor news links wired; Markets nav
  label converted to a menu trigger (no markets hub page exists); Insights links removed
  sitewide while the section is held back; sitemap page rebuilt with all ten market hubs, their
  24 sub-market pages and a Legal section.

**Still drifting, flagged not fixed** — `_components.css`, `about.css`, `automotive.css`,
`contact-forms.css`, `homepage-mobile.css`, `investors*.css`, `automotive.js`,
`contact-forms.js` and `investors-structure-diagram.js` differ between this project and the
static export, in both directions. They need a file-by-file diff, not a blind copy.

**Thai page titles are English** in `ThaiPages/Investors/*` (carried over from the static
export, e.g. "Group Structure & Shareholders"). Thai titles need to come from Corporate Affairs.

## Earlier changes (13 Aug 2026 — Korea detached)
Korea / Cheongju is unlinked site-wide: mega-menu Korea column, homepage location
card and Place schema, locations hub plant card, world-map marker and map data,
sitemap entry (locations branch now 5 pages), search index and search-shell header.
Footprint copy now reads "four countries" and omits Korea from the country lists.

**Kept, but unlinked** — Pages/Locations/Cheongju.cshtml is untouched and can be re-linked as-is if the
direction reverses. Nothing else references it.

**Left in place on purpose** — About / History milestone "Power Master
Semiconductor, in Korea", the PMS Korea commentary on the IR FAQ, and the Korea
entity in the IR group-structure diagram (corporate record, not location marketing).

## Sync — 30 Jul 2026 (parity sweep against exports/site-html)
- **New page** — `Markets/DataCenters.cshtml` (`/markets/data-centers`). The route was already
  linked from the header mega-menu, footer and homepage tile but had no page behind it.
- **Industrial & IoT re-exported** — hub + all four spokes re-synced to the current static HTML
  (section headings and copy had drifted; the hub's C# data arrays are replaced by the exported
  markup). Spoke pages carry the `.mk-caplinks .pending` styles from the HTML head.
- **IR events & contact** — closing CTA now "FAQ & Presentations" + "Contact Hana" (both primary);
  the `mailto:` "Email IR" button is gone, matching the HTML.
- **About / Quality** — the Impinj-NXP and ARC cert cards now use the partner logos
  (`wwwroot/images/partners/*.png`) instead of text codes.
- **Investors hub** — feature-banner label back to "Investor news"; **Capabilities hub** regained
  its closing "Tell us what you're building" band; **Sitemap** rebuilt (adds the four Industrial
  & IoT spokes).
- **CSS re-synced** from `site-html/css` (11 files, incl. `market-page.css`, `investors*.css`,
  `about*.css`, `careers-job-post.css`, `_components.css` — the razor-only `.hana-cap-icon` rule
  is preserved).
- *Left divergent on purpose:* `automotive.css` / `automotive.js` (Razor build has the extra
  collapsible spoke-sidebar), the Automotive FAQ blocks (Razor renders them from a C# array),
  `careers-stories.js` and `hana-backgrounds.js` (Razor copies are ahead of the static export),
  and the homepage, which is composed from `_Homepage_*` partials.

## Sync — 27 Jul 2026 (parity with exports/site-html)
- **New pages** — `Insights/Index`, `Insights/AutomotivePcbaAssembly`, `Legal/PrivacyPolicy`,
  `Legal/TermsOfUse`, `Legal/CookiePolicy` (+ `wwwroot/css/insights.css`); footer legal links
  now resolve. Utility bar is **Careers + Insights** (News removed).
- **17 new sub-capability pages** under `Pages/Capabilities/` — OSAT (5), Microelectronic
  Assembly (4), DFx & JDM (3), Automation (3), RFID & Smart Tags (2). Routes follow
  `/capabilities/{group}/{slug}`.
- **Six capability hub pages rebuilt** — nested inset blue "choose a detailed capability"
  panel, every card links through, "Page in progress" badges and closing CTA removed.
- **CTA labels synced** — sub-capability BOM band "Start a program"; capability closing CTA
  a single "Work with us"; sidebar nudge "Work with us"; automotive hub + five sub-markets
  "Start a program" / "Work with us". Contact and RFQ pages keep "Request a quote".
- **Nav fixed** — mega-menu sub-capability routes were stubs (`/osat/sip`, `/automation/mes`…)
  and now point at the real pages; `_CapabilitySidebar` group key for Microelectronic
  Assembly corrected to `microelectronic-assembly`; "Box Build" → "Box Build Assembly";
  Overview no longer highlighted on hub pages.

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

The `preview-*.html` no-.NET previews have been removed (14 Sep 2026) — they carried a stale copy of the header and footer with flat `.html` links, and drifted every time the chrome changed. Use `dotnet run`.

---

## Project layout

```
exports/razor-pages/
├── HanaSite.csproj                 ← net8.0 web project
├── Program.cs                      ← minimal Razor Pages host
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

### Fix — 25 Jun 2026 (Automotive hub re-synced to prototype)
- **Markets / Automotive hub** (`Markets/Automotive.cshtml`) re-synced to the current "Hana Automotive Hub" prototype: the hero now uses the dotted-**globe** background (`data-hana-bg="globe" data-variant="light"`), the cutaway is the interactive **side-by-side** stage + legend (15 numbered markers with hover tips, "Parts we produce" legend of the 5 components), and the hero copy matches the prototype ("Markets we serve" / "…manufacturing service" / "Explore automotive components" · "Start a conversation"). The earlier plain-image hero variant has been removed. `preview-automotive.html` and the static `site-html/markets-automotive.html` are now exact copies of the prototype.

### Re-export — 25 Jun 2026 (changes since the 23 Jun export)
- **Header.** `_Header.cshtml` re-synced to the live homepage chrome: switched the logo to the trimmed PNG lockup (`~/images/hana-logo-full-trimmed.webp`, 200×65, also in `_Footer`), simplified the **About** mega-menu to two columns (Company · Connect), and synced menu copy (Markets blurbs, Automation → "Manufacturing Traceability", DFx/JDM/NPI labels, "Investor FAQ & Knowledge Hub").
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
- **Contact — complete**: Contact (`/contact`, general enquiry form + sales-offices accordion, with a link to the Anonymous Communication Form), Plant RFQ (`/contact/rfq`), and Anonymous Communication Form (`/contact/anonymous`). Forms are native HTML with a small vanilla helper (`~/js/contact-forms.js`) for the chip multiselects, reCAPTCHA gate and file list; submit currently shows the success panel client-side — wire an `OnPost` handler (or `fetch`) for the backend.
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

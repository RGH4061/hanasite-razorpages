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

- [ ] **Share price is static — go-live blocker (IR / Finance).** The header and footer show
  "฿24.50 +1.24%" on every page and never change; the IR hub panel shows 39.20 on the same page.
  Wire both to one live SET feed (or remove the figure) before launch.
- [ ] **Cross-page sweep, 26 Oct 2026: open items** (report: `5. Website Redesign/SEO & AEO/Website
  sweep - overlap, duplication and search pathways (26 Oct 2026).md`).
  - **Plant × process table.** Capability "Where we run" lists and plant pages disagree in 26 pairs
    (COB and flip chip each name "China and Thailand" and show a Koh Kong card). Needs a table
    confirmed by the plants before any plant-link work.
  - **Facts to confirm:** Lamphun flip chip (GGI or C4), ISO 27001 scope, ISO 14064-1 plant, Koh Kong
    IATF, RFID ARC scope.
  - **Thai menu labels** for the renamed flip chip and RFID pages.
  - **Insights draft** `/insights/automotive-pcba-assembly` is noindexed; re-angle it as an IATF 16949
    explainer. Its "more" cards are placeholders that link to `/insights`.

- [ ] **Search and AI-search sweep, 24 Oct 2026: items for the developer.** The metadata layer
  (`Services/Seo.cs`, `_Layout.cshtml`, `/sitemap.xml`, `wwwroot/robots.txt`, `wwwroot/llms.txt`)
  is described under Fixed, 24 Oct.
  - **Insights hub (`/insights`) is drawn by JavaScript.** The server HTML has no article links, so
    crawlers that do not run JavaScript (most AI crawlers) see an empty blog index. A `<noscript>`
    list of the seven article links was added on 24 Oct as a stopgap (keep it in step with
    `ARTICLES` in `insights-hub.js`). Render the cards server-side in Razor and let
    `insights-hub.js` filter them.
  - **Package finder data is JavaScript-only** (`js/search/packages.js`). Consider a server-rendered
    package table (or `<noscript>` table) so package families and sizes are readable without JS.
  - **robots.txt is for production only.** Staging and preview hosts must serve `Disallow: /`.
  - **Hosting/CDN AI-bot blocking:** check the production host or CDN does not block AI crawlers by
    default (some CDNs now ship a "block AI bots" setting switched on). robots.txt allows them.
  - **After launch:** submit sitemap.xml in Google Search Console and Bing Webmaster Tools (Bing's
    index feeds ChatGPT search and Copilot) and turn on IndexNow if the host supports it.
- [ ] **Search and AI-search sweep, 24 Oct 2026: copy decisions for Rupert.**
  - **LED Lighting hero stat** says "AEC-Q · Qualified"; AEC-Q for automotive LEDs is still on the
    unconfirmed list.
  - **Koh Kong** uses Phnom Penh as a distance reference ("~300 km W of Phnom Penh").
  - **Screen printing accuracy:** SMT Assembly says ±25 µm; the 2026 EMS deck (EMS PAGE 6) says
    ±20 µm @ 6 sigma. (Placement accuracy was aligned to ±18 µm on 24 Oct; see Fixed.)
  - **"Indicative quote within two business days"** appears on 13 capability pages (check against
    the no-published-lead-times rule).
  - **Unsourced claims:** PPAP/APQP on Automotive PCBA and the Automotive hub; "over 600 test
    systems" on Ayutthaya (a capacity-type figure).
  - **JDM name:** the JDM page and sidebar say "Joint Development Model"; the tracker name is
    "Joint Development Manufacturing".
  - **Lamphun** lists "Die Attach & Wire Bond"; the link now goes to the
    `/capabilities/osat/flip-chip#die-attach-wire-bond` section, so only the plant-list question remains
    (see the plant × process item below).
  - **Koh Kong ISO 13485:** the Koh Kong page lists it; the Locations hub's Koh Kong list does not.
  - **Data Centers hero chip** "Thermoelectric coolers (TEC)" (the Optical test chip was corrected).
  - **Thai homepage and Thai IR pages** use English meta descriptions.
  - **Long meta description** (169 characters, so search results may cut it): the Thailand
    semiconductor strategy article. The four long capability descriptions were shortened on 24 Oct.
- [ ] **Plant pages, 21 Oct 2026 — waiting on a decision or photos.**
  - **Hero layout:** choose between the current veil, `?hero=split` and `?hero=photo` (see Fixed,
    21 Oct (2nd)). The veil currently covers most of the photo below ~1270 px and all of it on phones.
  - **Ohio intro photo** is a stand-in (an RFID converting line from the Industrial IoT RFID page,
    not confirmed to be Ohio). Needs a real Solon production-floor photo.
  - **Product placeholders still showing:** Ohio "Infrared lens housings" and Koh Kong
    "Cable & wire harnesses" product cards have no photo.
- [ ] **Link and button audit, 21 Oct 2026 — still open after Rupert's answers (22 Oct).**
  See Fixed, 22 Oct for what his answers changed.
  - **Job post:** "recruit@hanabk.th.com" and the five job-board buttons stay `href="#"` until the
    real vacancies exist; Rupert will supply the recruitment address.
  - **Insights:** the "How RFID inlays are manufactured and tested" card (featured) is kept as the
    template for SEO work and still has no article page.
  - **Ohio placeholder photo:** "Infrared lens housings" uses the Ayutthaya lens-housing product
    photo (also the Sensors & Optical card image) until an Ohio photo is available.
  - Prototype-only by decision: all vacancies open one sample job post; related-article cards open
    the hub. IR document links stay pointed at hanagroup.com (correct at go-live).
- [ ] **Desktop page widths differ by section (decision).** Header, About, IR, Careers, Insights
  and Contact use a 1080 px column; Markets and Locations use 1240 px. At 1440 px the header logo
  starts at x = 212 and Markets/Locations content at x = 132. Consistent within each section, so
  left as designed; aligning them would reflow every market and plant page.
- [ ] **Visual QA sweep 21 Oct 2026 — items that need a decision, new assets or copy.**
  Found in the full sweep (126 routes at 1440, 1280, 1024, 768, 390 and 360 px; fixes are logged
  under Fixed, 21 Oct). Not changed repo-side:
  - **Low-resolution images, shown up to 2.6× their pixel size:** `photos/mk-rfid-tire-warehouse.webp`
    (600 × 400; RFID tire tag pages), `automotive.webp` (427 × 640; Global vehicle sales commentary),
    `cap-rfid-smart-tags-hero.webp` (640 × 568), `photos/mk-automotive-power-modules-placement.webp`
    (520 × 293; Industrial IoT power modules), and two Careers "Life at Koh Kong" photos
    (`life-kohkong-celebrations-1` 331 × 202, `life-kohkong-community-outreach-1` 293 × 165).
    Need larger source files.
  - **`/investor-relations/annual`:** the 2025, 2024, 2023 and Form 56-1 2020 tiles are still
    wireframe placeholders reading "[ Report cover image ]".
  - **Optical & sensors hub, "Always at the forefront" timeline (phones):** the 238 px label column
    leaves about one year of the timeline visible inside a sideways scroller with no scroll cue.
    Needs a phone layout (design call).
  - **Careers "Life at" photo cards:** each card shows an 8 % sliver of the next photo plus an
    arrow; in a three-column grid this reads as a cropping fault. Design call.
  - **Insights hub:** topic counts ignore the active format filter, so a topic showing "2" can
    return "0 articles". Counts should follow the format filter, or the format should reset.
  - **Copy:** RFQ hero sentence is garbled ("…be in touch within two business days route it to the
    right facility and team"); Ayutthaya location table reads "Don Mueang Airport International
    (Bangkok)~40km" (missing separator); Thai contact page still has the English RFQ box text and
    "Anonymous Communication Form" paragraph; IR FAQ says "Page updated 12 Jun 2026" above an
    Aug 2026 presentation.
  - **Cheongju (dormant):** overflows 104 px at 390 px. Left alone while the page is dormant.
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
    export deletes the image if you don't exclude it), and the 3 OSAT wafer images listed under
    "Images the Razor export references but does not ship" below.
  - **14 Sep:** a further **69 superseded assets** removed (the export's second jpg/png → webp
    pass), each verified unreferenced by full-path match first.
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
  **14 Oct — a variant the at-rule grep cannot catch:** `Capabilities/PackageDesign.cshtml` line
  236 carried a stray `@` before a plain class selector,
  `@.lcs[data-impact="tint"] .lcs-impact{…}`. That is invalid CSS as well as a Razor breaker
  (RZ1005 / CS1501), so the tint variant was dead on the live page too. Fixed by **deleting** the
  `@` rather than escaping it — escaping would compile but leave the rule inert. Sweep for it with
  `grep -rnoE '(^|[^@[:alnum:]_"])@[.#][a-zA-Z]' Pages/`.
  **Also escape `@` in prose.** 14 Sep: `Pages/Sitemap.cshtml` intro text mentions "the Razor
  `<span …>@page</span>` directive" — Razor parsed it as a second `@page` directive (RZ2001 /
  RZ2005 / RZ1011). Fixed as `@@page`. The at-rule grep can't see this; the build will.
- [x] **CLOSED 20 Oct 2026 — `investors-mobile.css` and `capabilities-mobile.css` deleted;
  `locations-mobile.css` replaced with the HTML site's copy and linked only on the five plant pages,
  as in the HTML site. The page CSS now handles all of this itself: every IR (EN/TH), Locations and
  Capabilities page measures 0px overflow at 375px, the IR navy end band is contained on all seven
  sub-pages, and the Capabilities hub cards stack. The notes below are kept for history.**
  ~~Section-body mobile optimisation — Locations / Investors / About / Capabilities
  (done in this repo, NOT yet in Design source).** The mobile *header/footer* is now
  handled at source (see Fixed, 2 Jul). These are the remaining PAGE-BODY mobile fixes,
  which still live only as repo-side retrofit stylesheets loaded per page via `@section
  Head`. Each export overwrites the link tags (the CSS files themselves survive as
  untracked extras), so they must be re-applied after every export — or, better, built
  into the Design source so they export everywhere. **21 Sep: 23 tags re-applied again**
  (6 Locations + 16 Investors + 1 Capabilities; Cheongju keeps its own, being excluded
  from the sync), and the export still ships `locations-mobile.css` unlinked and still
  shorter than the repo-merged copy — re-diffed, no new matching rules to fold in:
  - `wwwroot/css/locations-mobile.css` (7 pages) — **⚠️ REPO-MERGED FILE, EXCLUDE FROM SYNC.**
    From 14 Sep the Design export ships its OWN `locations-mobile.css` (unlinked). Most of it
    targets `.lc-certs` / `.lc-caps` / `.lc-split` / `.lc-photos`, class hooks that exist in the
    HTML prototype but **not** in the Razor markup — taking it as-is would silently drop every
    grid/spec-row rule. The repo file now = repo rules + the export's rules that DO match
    (≤1270px full-frame hero scrim, hero heights 400/360 px, h1 46/36 px, 1240px wrap padding).
    Re-diff against each export's copy and fold in any new matching rules. Original scope — inline-styled grids collapse (2-col
    splits → 1, stat strips 4 → 2×2, card grids → 1), spec-row labels stack above values,
    plant hero 440 → 380px.
  - `wwwroot/css/investors-mobile.css` (16 pages — the 8 English IR pages plus all 8 Thai
    twins under `Pages/ThaiPages/Investors/`, which load the same `investors-*.css` files and
    so inherit the same defects; Rupert confirmed keeping the Thai tags, 10 Sep) — group-structure org chart (inline
    `width:1100px` figure + 1020px canvas) → 70%-zoom horizontal touch-scroller;
    `.section-head .intro` inline `width:593px` released; hub's decorative 480px pseudo-
    circles clipped. Also a genuine all-widths bug: `.page-end`/`#enquiries-topo`
    containment existed in only 3 of 8 IR CSS files — the other five lost the navy topo
    band; investors-mobile.css restores it.
  - `wwwroot/css/capabilities-mobile.css` (1 page) — the radial-wheel node script bails
    below `innerWidth < 980`, piling all six capability cards on one spot; below 980px the
    wheel retires and the six cards stack as a full-width list.
  - About pages needed no section file — clean once the chrome reflows.
- [ ] **Metadata defects found in the 15 Oct review — all need fixing at source.** Two were
  patched repo-side (and so join the re-apply list); the rest are content or convention decisions.
  - **36 pages share one meta description** — the generic "Hana is the leading independent EMS and
    OSAT company in Southeast Asia". Every Capabilities page, the homepage, `/search` and `/th`.
    Each needs its own. This is the largest SEO defect on the site.
  - **75 of 126 pages have no `<link rel="canonical">`**; 51 do (Markets, Careers, the Thai pages,
    the IR hub). Decide the convention and apply it in `_Layout.cshtml` so every page gets one.
  - **Four Thai pages serve English metadata:** `/th` (description), and
    `/th/investor-relations/{annual,esg,structure}` (both title and description).
  - **`/search` has no `<h1>` in the server HTML.** The page heading ("Six plants. Four countries.")
    is drawn by `js/search/` after load, so it exists in the browser. The page is `noindex`, so this
    is accessibility only. (`/about/history` and `/th/about/history` were fixed; see Fixed, 26 Oct.)
  - **PATCHED REPO-SIDE 15 Oct, fix at source:** 21 pages set `ViewData["Title"]` already ending
    in "— Hana Microelectronics" while `_Layout.cshtml:26` appends it again, so the title read
    "… — Hana Microelectronics — Hana Microelectronics" — the homepage included. Also the
    decorative `circuit-board-blue.webp` on 20 Capabilities pages had `aria-hidden="true"` but no
    `alt`; given `alt=""`.
- [ ] **The geo-motion package ships but nothing references it.** The 20 Oct export added 18
  files under `wwwroot/images/backgrounds/geo/` (blue / midnight / navy × band / section / strip,
  each as `.svg` and `.webp`) plus `css/hana-geo-motion.css` and `js/hana-geo-motion.js`. The CSS
  and JS load on all 127 pages, but **neither references any of the 18 images**, and no page
  references them either — so they are dead weight until something uses them. Confirm whether the
  images are meant to be wired up or whether only the CSS/JS treatment is in use.
- [ ] **`<!-- VERIFY: … -->` comment shipped in a published page.**
  `Pages/Insights/Commentary/MemoryContractPricesPcba.cshtml` carries
  `<!-- VERIFY: DFM review scope covering memory… -->` in the rendered HTML. A VERIFY comment is a
  Block in the Insights editor checklist, so this should not have published — and it flags a claim
  nobody has confirmed. Resolve the claim, then remove the comment at source.
- [ ] **The Thai Sustainability `Hana` edit is a standing repo-side retrofit (source-side fix
  wanted).** 5 Oct, commit `39f220c`: Rupert changed the transliterated ฮานา to Latin **Hana** in
  the two `.intro` paragraphs of `Pages/ThaiPages/Investors/Sustainability.cshtml`. Both 7 Oct
  exports reverted it, so it is re-applied after every sync — add it to the mobile-link-tag and
  `@`-escaping chores until it is fixed in Claude Design.
  - **RESOLVED 7 Oct 2026 — ฮานา stays everywhere else.** Rupert confirmed the transliteration is
    intentional in the sections that carry it: `Investors/Faq.cshtml` (13),
    `Legal/PrivacyPolicy.cshtml` (24), `Investors/News.cshtml` (2),
    `Investors/EventsContact.cshtml` (1). **Do not normalise these to Latin "Hana", and do not
    reopen the question.** The company name is not a blanket stays-in-English term the way SET,
    process names and job titles are; it is per-section. Only those two Sustainability paragraphs
    use the Latin form.
- [x] **CLOSED 21 Oct 2026 — no longer reproduces: `_components.css` now loads only the two `.ttf` files, and the 21 Oct sweep found no failed requests on any `/th/` page. Notes kept for history.**
  ~~Thai font — `Sarabun-*.woff2` 404s on every `/th/` page (source-side, non-breaking).~~
  `wwwroot/css/_components.css` declares `@font-face` with `url(../fonts/Sarabun-Regular.woff2)
  format('woff2')` first and the `.ttf` as fallback, but the export ships **only** the two
  `.ttf` files. Every Thai page therefore fires 2 failed requests before falling back; the
  text renders correctly, so this is a performance/console-noise issue, not a visual bug.
  **Still present in the 14 Sep (2nd) export.** **Fix at source** — either ship the `.woff2` pair or drop the `woff2` entries from the two
  `@font-face` rules. Deliberately NOT patched repo-side (the next export would overwrite it).
---

## Fixed

### 26 Oct 2026 (2nd) — cross-page sweep, section 7.1 fixes

- **Links:** LED Lighting buttons now go to COB and SMT Assembly; Data Centers high-density PCBA
  links to Industrial PCBA; Insights in-text links point to the market sub-pages (power modules,
  sensor assembly, automotive PCBA) and to the Ayutthaya and Lamphun plants; the dead "MLCC supply"
  link is plain text; "traceability" on the Automotive hub, Automotive PCBA and five medical pages
  links to MES & Traceability; Package Design ↔ DFx / DFM and JDM cross-link.
- **Navigation:** header "Markets" links to `/markets` (EN and TH; the mobile menu picks it up);
  homepage "View all markets" link; About sub-page breadcrumbs link "About"; "More about Hana" row
  on `/about`; word spacing restored in split homepage headings.
- **Contact form:** Service = the six capability groups + Other; Industry adds Data Centers (EN, TH).
- **Accessibility:** market sidebar links carry `aria-label` (abbreviation `aria-hidden`), active
  link `aria-current="page"`.
- **Metadata:** JSON-LD breadcrumb leaf comes from the visible breadcrumb (`Seo.VisibleLeaf`);
  distinct titles for Consumer and Medical Wireless Charging; `/insights` without trailing slash in
  JSON-LD; `/careers/apply`, `/consent`, `/job-post` noindexed; 301s `/index` → `/`,
  `/insights/commentary` → `/insights`.
- **Insights pills** use Format · Topic ("Industry update · Power electronics"); Article JSON-LD
  carries `articleSection` (topic) and `genre` (format).
- **Tracker:** Redirect Map rows #41, #42, #49, #65 corrected and the nine Program.cs redirects added
  (#97–105); URL Structure row 32 (Medical Wireless Charging) canonical = self.
- **Closed as stale:** "Die Attach & Wire Bond page is back" (page removed; links go to the Flip Chip
  section) and "41 titles contain Hana twice" (5 remain, each where Hana is part of the page name).
- **Copy:** COB "where we run" sentence, Capabilities hub search hint, Leadership lede (four countries).

### 26 Oct 2026 — stale Open items confirmed resolved and closed

Checked against the current code; each had already been fixed by an earlier sync.

- **Hotlinked images on Leadership and Quality.** Both pages now load local files from
  `/images/leadership/` and `/images/awards/`. The only `hanagroup.com/images` links left are the
  JSON-LD publisher logo on 7 Insights articles, which points at `/images/hana-logo-full.svg` (shipped
  in `wwwroot/images/`), so it resolves once the new site is live.
- **IR FAQ `[Placeholder]` dividend answers.** No `[Placeholder]` text remains in
  `Investors/Faq.cshtml`, its Thai twin, or any other page.
- **Duplicate Flip Chip `<title>`.** The pages now read "Flip Chip & Interconnect | Capabilities"
  and "Precision Flip Chip | Capabilities".
- **No `<h1>` on History.** `/about/history` and `/th/about/history` each have an `<h1>`.

### 24 Oct 2026 — repetition sweep and search / AI-search (AEO) layer

**Repetition.** Measured across all 120 routes (shared sentences, repeated 8-word phrases per page,
near-duplicate sentences). Market hubs rewritten so the intro, dark panel, "Where it's made" and
FAQ each carry different information (Medical, RFID, Consumer, Industrial & IoT, Power Management,
Telecommunications, Data Centers, Automotive). Twelve sub-pages tightened the same way (RF Modules
& Power Amplifiers, Consumer SMT & Sensors, IoT Device Assembly, RFID Asset Tracking, Industrial
PCBA & Box Build, Medical MEMS & Sensors, Medical PCBA, Automotive Sensor Assembly, Automotive
PCBA, SMT Assembly, NPI, Box Build). Medical PCBA no longer repeats the hub's FDA question.

**Dual-source rule.** "Transfer / move between sites / receiving site" wording rewritten as
dual-sourcing on SMT Assembly (body, bullets, FAQ), NPI (FAQ), Automotive PCBA (FAQ) and the
Automotive hub (FAQ).

**Metadata layer (Services/Seo.cs, called from _Layout.cshtml).**
- Canonical tag on every page (68 pages had none); default is the route on www.hanagroup.com.
- hreflang en / th / x-default generated for every page with a Thai twin (the English Contact
  and IR sub-pages had none); the 72 hand-written hreflang tags were removed.
- Open Graph and Twitter card tags on every page (none before); share image = first content photo.
- One JSON-LD graph per page: Corporation (full record on `/`, `/th` and `/about`), WebSite with
  SearchAction, the page (WebPage / CollectionPage / AboutPage / ContactPage, plus FAQPage when the
  page has FAQs), BreadcrumbList from the route, a Place with address on each plant page and a
  Service (provider: Hana) on each capability page.
  FAQ structured data is read from the page's own FAQ markup (`details` with a "faq" class, the
  Insights `.ins-faq` section, the Automotive `h3.qt` accordion), so it always matches the copy.
  Hand-written FAQPage blocks (10 pages) and the homepage Organization blocks were removed.
  Insights articles and Automotive Sensor Assembly keep their own blocks.
- `ViewData["Robots"]` support; `/locations/cheongju` (dormant) now carries noindex.
- **Before you start:** `RenderSectionAsync` writes straight to the output, so the layout captures
  the Head section with `PushWriter`/`PopWriter` before `<html>` is written. Calling it in a code
  block without the writer swap puts the whole Head section above `<html>`.
- `/sitemap.xml` (Program.cs → `Seo.SitemapXml`): every public route with Thai alternates; leaves
  out `/search` and Cheongju. Program.cs changes need a server restart (hot reload does not
  re-run top-level statements), and so does a new static field in `Seo.cs` (it stays null).
- `wwwroot/robots.txt` (allows search and AI crawlers by name, excludes `/admin/`, lists the
  sitemap) and `wwwroot/llms.txt` (plain-language site summary for AI tools).

**Meta.** 61 meta descriptions written or rewritten (30 pages shared one default; several
sub-pages used dramatic opening lines) and 4 long ones shortened. Duplicate titles fixed: OSAT "Flip Chip & Interconnect",
Microelectronic "Precision Flip Chip", Insights "PCB Assembly for Automotive Electronics".

**AEO copy.** Twelve capability intros now name Hana in the first sentence (they were verb-less
fragments). New FAQ sections: the five plant pages (what the plant makes, certifications,
location) and Why Hana (company facts). RF Modules & Power Amplifiers gained a frequency-doubler
item (OSAT deck p68) to match the hub card.

**HTML preview.** `publish-preview.py` now adds `noindex, nofollow` to every generated page so the
public GitHub Pages copy cannot compete with hanagroup.com in search or AI answers.

**Rupert's decisions, 24 Oct.** Footer line changed from "The leading independent EMS and OSAT
company…" to "A world-class independent EMS and OSAT company…" to match the homepage. The three
"[Placeholder]" dividend answers on the Investor FAQ (EN and TH) lost their tags (the 16 Oct edit had
removed one of four). Kept as they are: the homepage "world-class" line, the "$700M+" revenue
figure on Why Hana, the "market leading" claims (Ohio, Lamphun, QFN, Access Control) and the Tire
Tags "Why Hana RFID?" paragraph, which is quoted from the Hana Technologies USA site.
SMT Assembly placement accuracy changed from ±35 µm to ±18 µm (spec block and the component
mounting step) to match Consumer SMT & Sensor Assembly. Source: EMS PAGE 6, "Pick and place
accuracy: +/-18 µm" (noted in a Razor comment beside the value). The ±35 µm figure was the
hearing-aid line's machine spec (Hearing Aids deck page 7).

### 22 Oct 2026 (2nd) — RFID pages merged (Markets = product, Capabilities = process)

- **One RFID capability page.** `/capabilities/rfid-smart-tags` now covers the shared process
  (antenna and chip attach, reel-to-reel and encapsulation, encode and test) and links to the
  Markets product pages. The two capability sub-pages are gone.
- **One tire-tag page.** `/markets/rfid/rfid-tire-tags` is the only tire-tag page. It absorbed
  the Automotive page's specifics (cure above 150°C, ISO 18000-63, antenna co-design FAQ) and the
  capability page's quality FAQ. Tire tags are built in Lamphun and Ohio only (Rupert, 22 Oct).
- **Permanent (301) redirects, new in `Program.cs`** — the developer must keep this block:
  - `/capabilities/rfid-smart-tags/rfid-tire-tags` → `/markets/rfid/rfid-tire-tags`
  - `/capabilities/rfid-smart-tags/rfid-inlays` → `/markets/rfid/rfid-tags-inlays`
  - `/markets/automotive/rfid-tire-tags` → `/markets/rfid/rfid-tire-tags`
- **Links updated:** header menu (EN/TH), Capabilities sidebar (RFID group now has one link,
  "RFID Inlays & Tags"), Ohio/Jiaxing/Lamphun capability cards (Jiaxing's tire-tag link removed),
  the process notes on four Markets RFID pages, the Automotive hub card, cutaway hotspot and
  sub-page nav, the RFID hub FAQ, the site map and the search index.
- **Thai menu label** "อินเลย์และแท็ก RFID" is new and has not been checked by a Thai reader.

### 22 Oct 2026 — Rupert's answers to the link audit

- **Insights hub:** the ten cards for unwritten articles (and the MLCC update) are removed from
  `insights-hub.js` (Razor and the preview's own copy); the featured RFID inlays card stays as the
  SEO template.
- **Koh Kong:** the two capability cards (one with a dead "In-line AOI & SPI" link) are replaced by
  one wide card, "PCBA, Box Build & Micro-Assembly", linking SMT, COB, Box build, Micro-assembly
  and NPI, with the green PCB photo; photo above the text on phones. "Work with us" opens
  `/contact` like the market pages.
- **Thai IR Events:** the "ลงทะเบียนเข้าร่วม" (register) link is removed; registrations are by
  invitation.
- **Jiaxing:** "Ultra-small Packages & SiP" is split into two links, Ultra-small Packages and
  System-in-Package (SiP).
- **Ohio:** hero button replaced by two labelled buttons, "Hana Technologies — RFID"
  (hanarfid.com) and "Hana Technologies — EMS" (hana-micro.com); the Sensors & Optical card opens
  Camera modules; "Infrared lens housings" has a photo (see Open).
- **IR contact (EN/TH):** addresses now `jirapak@hanabk.th.com` and `penpimol_k@hanabk.th.com`,
  as on the live site.
- **Contact, RFQ, Thai Contact:** the Germany office now shows Frank's number, +49 172 3830507.
- **Thai pages stay in Thai (Rupert, 22 Oct):** on Thai pages the header menu, logo, phone menu,
  breadcrumbs, in-page links and footer open the Thai version wherever one exists (16 pages);
  only the "EN" switch opens English. Footer uses a small `L()` helper keyed on
  `ViewData["Lang"]`; `_HeaderTh` and `Pages/ThaiPages` links are written as `/th/…`.
- **Thailand semiconductor strategy article:** "Manufacturing in Thailand" opens `/locations`
  (was Ayutthaya only).

### 21 Oct 2026 (3rd) — link and button audit + Careers "Life at" tabs

Every link on the 126 routes was collected (header, mega menu, phone menu, footer, page body and
side menus), every internal path and `#fragment` requested, external links fetched, IR document
IDs checked against hanagroup.com, and every button, tab, accordion, carousel arrow and
`href="#"` link clicked at 1440 px and 390 px (2,306 controls on 252 page loads). After the fixes
below, all 126 page paths linked anywhere on the site return 200, all 132 in-page fragment links
land on an existing id, the language switch is correct on all 32 paired pages, site search
returns the right page for every index entry, and the four IR YouTube videos match their labels.
Items that need a decision are under Open.

- **Capability pages (Flip chip, Box build, COB assembly, SMT assembly):** the 13 plant cards
  opened the Locations hub; each now opens its own plant page.
- **Industrial & IoT hub:** the "Power modules" card opened RFID asset tracking; it now opens
  Power modules.
- **About:** the ten market rows were `href="#"`; each now opens its market hub.
- **Careers (EN/TH):** the breadcrumb "Home" was `href="#"` on seven pages; it now opens the
  homepage.
- **Careers "Life at" tabs:** five equal boxes in one row from 768 px (when a label wraps, every
  box in the row takes the same height) and one full-width box per row on phones. Before, they
  wrapped unevenly into rows of different widths. "Bangkok (HQ)" and "Koh Kong" no longer split
  across lines. `careers.css`, `Pages/Careers/Index.cshtml`.
- **Ayutthaya:** the "Sensors & Optical" card title and the MEMS Sensors, Joint Development (JDM),
  NPI and Design for Excellence links were `href="#"`; they now open their capability pages (the
  card title opens MEMS sensor assembly, as on Lamphun). **Koh Kong:** "Micro-assembly" now opens
  its capability page.
- **Insights hub:** the cards for the seven published articles linked to `insights/….html` (the
  preview's file names) and returned 404 here; `wwwroot/js/insights-hub.js` now uses routes. The
  preview keeps its own copy of this file, which already uses the `.html` names.
- **Insights articles (7):** the LinkedIn, Email and Copy link share links were `href="#"`. New
  `wwwroot/js/share.js` (loaded in `_Layout.cshtml`; does nothing on pages without a share row)
  opens LinkedIn's share dialog in a new tab, builds a `mailto:` with the article title and
  address, and copies the address with a "Link copied" confirmation. It shares the address the
  page was opened at.
- **Investors (EN/TH):** "View HANA on SET" opened SET's not-found page (the
  `…/HANA/price.html` address is retired). Now `…/en/…/hana/price`; the Thai page uses SET's
  Thai version.
- **Contact, RFQ and Thai Contact:** the German sales office dial link had an extra digit
  (`tel:+4930756576690`); it now matches the number shown, +49 30 75657690.
- **Footer:** LinkedIn now points directly at `linkedin.com/company/hana-microelectronics-group/`
  (the old address redirected there).

### 21 Oct 2026 (2nd) — alignment pass (phones and tablets) + plant pages

- **One page edge on phones and tablets.** Header, breadcrumb, headings, body copy and footer now
  share one left/right edge: 20 px on phones (≤640 px) and 32 px on tablets (641–900 px). Before,
  the edge was 16, 18, 20, 24 or 32 px depending on the section (capability breadcrumbs sat at
  32 px over content at 20 px; plant pages put content at 20 px under a 32 px header; Markets and
  IR sub-pages used 24 px; the Automotive pages moved the header itself to 20 px). Rule block in
  `_components.css` ("Page gutters"); `locations-mobile.css` and `automotive.css` follow it.
  Floating CTA cards use the same edge. Desktop hubs (Markets, Capabilities) moved from 40 to
  32 px side padding so their content starts under the header logo.
- **Contact (EN/TH) and Anonymous form, phones:** "Send enquiry" was pushed to the right edge
  under the reCAPTCHA box; both are now centred.
- **Homepage (EN/TH):** the decorative 1 px blue line down the left of the Why, Markets and
  Capabilities bands is removed at all widths (it read as a crack in the screen).
- **Ohio:** the five "Key services and capabilities" cards and the intro photo were wireframe
  placeholders; they now use the capability images the other plant pages use. The intro photo
  is a stand-in RFID production-line photo already on the site (see Open). The location section
  was missing its `lc-split` hook, so the map sat beside the address table on phones and ran off
  the right edge; it now stacks like the other plant pages.
- **Capability pages, phones:** pillar bullet lists are one column (two left each item ~100 px
  wide, one or two words per line); the wafer process step cards get ~150 px each in their
  sideways scroller (were 93 px); the "Key capability" tag no longer splits across lines.
- **Careers:** the CEO message block now follows the page edge (it was 20 px further in).
- **Automotive sub-pages, tablets:** the 264 px component menu stayed beside the content down to
  681 px, so at 768 px the headline wrapped one word per line and the stats read "AEC- Q". The menu
  now moves above the content below 980 px and the hero stacks, as on the other market sub-pages.
  On both page types the stacked menu, CTA card and footer strip follow the page edge (the menu
  sat 8 px left of it; market sub-page content was 24 px under a 32 px header at 901–980 px).
- **Links:** plain links inside page copy use the brand blue (FAQ answers and the Lamphun intro
  showed the browser's default blue).
- **Plant page hero options (preview only, nothing changes by default):** add `?hero=split` or
  `?hero=photo` to any plant page URL. Split keeps a navy text panel and shows the photo clear
  beside it (tablets) or under it (phones); Photo first puts the clear photo on top with the
  title and intro on navy below. Rules at the end of `locations-mobile.css`, switch in
  `js/locations.js`. Once one is chosen it becomes the default and the switch is removed.

### 21 Oct 2026 — visual QA sweep (126 routes × 6 widths, interactions)

Every route rendered at 1440, 1280, 1024, 768, 390 and 360 px, scrolled through so lazy images and
entrance motion fire, then checked for horizontal overflow, clipped, overlapping or spilling text,
broken, distorted or upscaled images, console errors and failed requests (none of the last two in
756 page loads). Menus, search, carousels, tabs, filters, accordions, the Automotive cutaway, the
Locations map, form gating and success states were exercised on desktop and phone.
- **Automotive sub-pages (all 5), phones:** the inline two-column hero never collapsed, so the
  headline and intro sat in a ~140 px column beside a thumbnail. `automotive.css` now collapses the
  inline grids, gives the sensor list two columns and 20 px side padding at ≤680 px. The hub's stat
  strip stacks cleanly (it left stray dividers), the back link arrow points left, and a hovered
  legend item's tooltip shows above the detail card. FAQ buttons expose `aria-expanded`.
- **Industrial IoT › PCBA & Box Build, phones:** hero was 680 px wide (text and second button cut
  off). `.mk-hero-in` phone column is now `minmax(0,1fr)`.
- **Capability pages, phones:** the circuit-board corner graphic sat behind the H1 and intro on
  19 pages; hidden at ≤640 px. **Package Design:** the before / development / after case-study
  stages stack on phones (three ~90 px columns broke the text one word per line and the
  "Constraints" label ran into the next column).
- **About, phones/tablets:** the "DFx & JDM feedback loop" line and label were fixed at desktop
  coordinates, so they crossed the step cards and did not scroll with them. Both now sit inside
  `.vi-flow` (desktop position unchanged to the pixel).
- **History (EN + TH):** the decade chip row was centred inside a scroller, so 1970s was cut off and
  unreachable on phones (and on the Thai page at 768 px).
- **Contact (EN + TH):** the intro, RFQ and form panels carried fixed inline sizes from the design
  tool (500 × 707, 495 × 212, 500 × 818), so the right column overran the grid by ~55 px on desktop
  and the page scrolled sideways at 1024 px. Inline sizes removed.
- **Careers:** hero stats now two by two (one stat sat alone on a second row); "Life at" tabs wrap
  two per row below 960 px (labels were clipped and overlapping); stories header and vacancy meta
  wrap on phones. **Stories:** the hero `<figure>` kept the browser's 40 px margins (photo pushed off
  the right edge on phones); story photos use a 10:7 frame so the quote text burned into the images
  is no longer cropped (also on /careers).
- **Investor Relations:** page-end CTA buttons and their labels wrap inside the card on phones
  (they overran it, worst in Thai); "On this page" lists are one column on phones; Group Structure chart no longer
  80 px narrower than its column (`<figure>` margins); Governance hero uses `min-height` so the
  intro is not clipped; the hub's watermark no longer shows as stray bars between cards on phones
  or widens the page at 1024 px.
- **Site-wide:** footer is the same light grey on every page (IR and Careers stylesheets redefine
  `--bg` as white); the cyan accent dots in the light "flow" backgrounds no longer land on hero
  text (sampled further right, none on phone-width bands); inline body links on market pages use
  brand colours (one on a dark band was default blue and almost invisible); `/sitemap` no longer
  scrolls sideways at 768 px.
- **Phone menu:** Thai pages showed English top-level labels (the script used the `data-menu` key);
  it now uses the link text, without letter-spacing for Thai. The OSAT "Wafer, assembly & test" label
  has its group spacing, and the search placeholder fits (was cut off and ended "..").
- **Desktop menu:** keyboard support (it was hover-only). A focused nav item opens its panel; Arrow
  Down, or Enter on Markets (no hub page), moves into the panel; Escape closes it and returns to the
  nav item; moving focus past the nav items closes it.
- **Homepage:** decorative 1 px left hairlines hidden below 1180 px, where they crossed the content.
  The market mosaic switches to its two-column layout below 1000 px (was 760 px; at 761–999 px
  tile titles such as "Telecommunications" were clipped), and the capability carousel shows three
  cards across at 761–999 px (five were too narrow for "Microelectronic Assembly").
- **Medical PCBA turnkey plate:** the full-frame photo is wider than the space beside the text below
  about 1540 px, so the copy ran onto it (65 px at 1440 px, 220 px at 1100 px) and the photo caption
  sat on the closing note. Below that width the photo now starts 32 px after the text column at
  full plate height, cropped from the right; above it nothing changes.
- **Image:** `ayutthaya-facility.webp` had a white "›" carousel arrow from the old site burned into
  the photo (Ayutthaya hero, Locations hub, History); retouched out.
- **Typos:** "Kok Kong" → "Koh Kong" (Flip Chip, COB Assembly); homepage "our customer's with end to
  end solutions" → "our customers with end-to-end solutions", "Work along us" → "Work alongside
  us", "Full Inspection, handling, and" → "Full inspection, handling and"; RFQ "a idea" → "an idea".
- **Closed:** the Thai `Sarabun-*.woff2` 404 entry under Open no longer reproduces (no failed
  requests on any `/th/` page).

### 20 Oct 2026 — export sync ("20-10 razor pages Hana Site.zip")

- **⚠️ Removed 84 duplicate `<Name> 2.cshtml` files that this repo's own 16 Oct sync introduced
  and committed (`8320bd9`).** They were byte-identical copies carrying the same `@page` route as
  their originals, so **every one of those 84 routes returned HTTP 500** — `/`, `/about`,
  `/markets`, `/capabilities`, `/investor-relations`, `/careers` among them. They were almost
  certainly created by iCloud/Finder conflict-copying the Desktop while the rsync rewrote the
  tree (timestamps 16:14–16:19 on 16 Oct, inside the sync window). This sync's `rsync --delete`
  removed all 84; routes verified back to 127/127.
  - **Why the 16 Oct verification missed it:** the route-extraction script collects `@page`
    templates into a `set()`, so two files claiming one route collapse to a single entry and the
    check still reported 127/127. **A duplicate-route-template guard is now part of the sync**
    — group `@page` templates by value and fail on any with more than one file. It also needs a
    plain `find Pages -name '* 2.cshtml'` check, since the conflict copies can reappear.
- **The malformed `Markets/IndustrialIotPowerModules.cshtml` is back** — the same unterminated
  `@section Head` + `<style>` as 16 Oct, so the source fix has not landed. The repair is now a
  **general** one: scan every page for a `<style>` opened inside `@section Head {` that never
  closes before body markup starts, and insert `</style>` + `}`. Still needs fixing at source.
- **Resolved at source and closed:** the broken `/insights/mlcc-supply-shift-pcba` link is gone
  from the rendered output.
- **Re-applied:** 23 mobile-retrofit link tags, the doubled-site-name title fix (22 pages),
  `alt=""` on the decorative circuit image (20 pages), and the Thai Sustainability `Hana` edit.
  No `@`-escaping fixes were needed this time — the generator now emits them correctly.
- **C2PA:** 0 to strip; all 371 WebP files were already clean, so the export has stopped
  embedding manifests. Keep running it, but it may now be a no-op.
- **Verification passes:** 127 routes all 200; 308 rendered assets all 200; **123 of 123**
  non-document internal links 200 (no broken links at all for the first time).


### 16 Oct 2026 — export sync ("16-10 razor pages - Hana Site.zip")

- **New market page** `Pages/Markets/IndustrialIotPowerModules.cshtml`
  (`/markets/industrial-iot/power-modules`), plus 34 new images and a large asset refresh across
  Markets, Capabilities and Locations. Route count 126 → 127.
- **⚠️ The export shipped that new page malformed and HEAD would not compile.** Its
  `@section Head {` opened a `<style>` at line 9, wrote one CSS rule, then dropped straight into
  the page body with no `</style>` and no closing `}` (RZ1006 + RZ2002). Repaired by inserting
  `</style>` and `}`, matching its sibling market pages. **Fix at source** — a page emitted this
  way is a generator fault, not a one-off.
- **Two standing items are now fixed at source and have been closed:** the Jiaxing "two decade"
  typo and the Koh Kong distance wording (the source now reads "~400 km SE of Bangkok", which is
  correct), and the three OSAT wafer images the export used to reference without shipping — they
  now ship, so they came off the sync exclusion list.
- **Two orphans deleted** by `rsync --delete`: `images/stories/thanawat-phromchai.webp` and
  `images/photos/loc-lamphun-compact-sensor-assembly.jpg` (the export moved that one to `.webp`
  and repointed Lamphun at it). Both verified unreferenced first.
- **C2PA stripped again** — 181 files / 1019 KB. The export re-adds the manifests every time, so
  this stays a per-sync step.
- **Re-applied:** 1 `@`-escaping fix (down from 10 — the generator has fixed most at source),
  23 mobile-retrofit link tags, the Thai Sustainability `Hana` edit, the doubled-site-name title
  fix (22 pages this time) and `alt=""` on the decorative circuit image (19 pages).
- **Two retrofits had to be generalised**, having been written too narrowly on 15 Oct: the title
  fix only matched an em-dash separator and the export now also uses `|`; the `alt` fix only
  matched `~/images/…` and 19 pages now use `/images/…`. Both now match either form.
- **Verification passes:** 127 routes all 200; 306 rendered assets all 200; 117 of 118
  non-document internal links 200 (the outstanding one is the MLCC link already logged).
- **Process fix:** the dry-run deletion check used `rsync --delete --dry-run | grep '^deleting'`
  **without `-v`**, so rsync printed nothing and the check always reported zero deletions. It has
  reported "zero deletions" vacuously since 21 Sep. Git confirms no sync actually deleted
  anything in that period, so nothing was lost. **Always pass `-v`.**


### 14 Oct 2026 — export sync ("14-10-razor-Hana Site.zip")

- **Six Insights commentary pages** under `Pages/Insights/Commentary/` plus `js/insights-hub.js`
  and a reworked Insights hub — the Format/Topic taxonomy. **Three Thai About pages**
  (History, Leadership, Quality) with their own `*-th.css`. Every Markets page changed alongside
  `_Header.cshtml`. Route count 117 → 126.
- **Two broken hero images fixed** (export path bug). Five commentary pages referenced
  `~/images/cap-osat-optical-packaging-hero.webp` and `~/images/cap-osat-power-packages-hero.webp`
  without the `photos/` segment; the files ship at `wwwroot/images/photos/`, which is what every
  other reference uses. Corrected repo-side — **fix at source**, the next export will reintroduce it.
- **Stray `@` build breaker removed** — see the `@` escaping item above for the new variant.
- **C2PA manifests stripped from this repo for the first time.** The standing step was written for
  the previews repo, but this repo is equally public and ships the same staff portraits, so the
  same reasoning applies. `tools/strip-c2pa.py` cleaned **161 files / 906 KB**; a re-run reports 0,
  and all 327 WebP files are now clean. **Add this to the sync order here too**, after the rsync
  and before `git add`.
- **Re-applied as usual:** 10 `@`-escaping fixes (KohKong no longer needs one — fixed at source),
  23 mobile-retrofit link tags, and the Thai Sustainability `Hana` edit.
- **`locations-mobile.css` re-diffed:** the export's copy carries `.lc-hero-veil` rules that the
  repo-merged file already has, plus `.lc-photos` / `.lc-split` rules whose hooks do not exist in
  the Razor markup. Nothing to fold in; repo copy kept.
- **Verification passes:** 126 routes all 200; 267 rendered assets all 200; 116 of 117
  non-document internal links 200 — the one failure is the MLCC link logged as open above.


### 7 Oct 2026 (2nd) — export sync ("07-10-Razor-Site.zip")

- **Thai careers-stories photos wired.** 15 new `wwwroot/images/stories/*-th.webp`, named after
  the person in each caption, now used by `ThaiPages/CareersStories.cshtml`. All 15 render and
  serve. **This also surfaced the cross-language photo mismatch logged as an open item above.**
- **Story-card location tags corrected** on both the English and Thai stories pages
  (`data-loc` values reassigned), and `careers-stories.css` drops the sticky `.filter-row`
  (confirmed a deliberate source change — the sticky rule came from the original V2 export
  `a613186`, not a repo-side hand edit, so the export's version was taken).
- **Everything else in the diff was this repo's own retrofits being stripped** — the 23 mobile
  link tags, the `@@` escaping and the Thai `Hana` fix. Normalising those out left only the
  files above, so the IR, Capabilities and Locations pages are substantively unchanged from the
  first 7 Oct export.
- **Re-applied for the second time today:** 11 `@`-escaping breakers, 23 mobile-retrofit link
  tags, and the 5 Oct Thai `Hana` fix (`39f220c`) — the export reverted ฮานา again.
- **Verification passes:** 117 routes all 200; 243 rendered assets all 200; 108 non-document
  internal links all 200. `rsync --delete` under the standing exclusion list proposed zero
  deletions.


### 7 Oct 2026 — export sync ("razor - 07:10 - Hana Site.zip")

- **Thai site expands to the public pages.** Three new routes — `/th` (Thai homepage),
  `/th/contact`, `/th/careers/stories` — with `careers-stories-th.css` and
  `contact-forms-th.css`. `_Header.cshtml` and `_Homepage_Locations.cshtml` changed with them.
  Route count 114 → 117. All three render with Thai text.
- **Contact and RFQ forms reworked** (`Contact/Index.cshtml`, `Contact/Rfq.cshtml`,
  `contact-forms.css`, `contact-forms.js`) and the site-search index regenerated
  (`js/search/data.js`).
- **The eight IR stylesheets changed** alongside the Investors pages — document lists again.
- **Razor `@` escaping — 11 breakers re-fixed**, the standing nine plus a new one: the new
  `ThaiPages/CareersStories.cshtml` carries the same inline `@media` as its English twin.
  HEAD did not compile without these.
- **23 mobile-retrofit link tags re-applied** (6 Locations + 16 Investors + 1 Capabilities).
  The export's `locations-mobile.css` is still unlinked and still shorter than the repo-merged
  copy — re-diffed, nothing new to fold in.
- **Verification passes:** 117 routes all 200; 229 rendered assets all 200; 108 non-document
  internal links all 200 (684 `/File/ViewDoc/{id}` links excluded — no handler in this repo by
  design). `rsync --delete` under the standing exclusion list proposed zero deletions.


### 21 Sep 2026 (3rd) — export sync ("razor pages 21-9-3 Hana Site.zip")

- **The IR document work landed at source.** Every document row on the IR pages now links
  `/File/ViewDoc/{id}` with a `data-doc-id` on the title anchor, generated from the mapping
  workbook rather than the old placeholder rows. 694 title anchors across the 8 English and
  8 Thai IR pages; the second anchor per row is the "Download ↓" action and carries no
  `data-doc-id` by design.
  - **These links 404 on this prototype and that is expected.** There is no `/File/ViewDoc`
    handler in this repo — the route is served by the existing production application and its
    database. 682 distinct document IDs are referenced. Do not report them as broken links;
    filter them out of the internal-link pass.
- **Five IR page items from the 21 Sep mapping decisions are now resolved in the export**, all
  verified on the running site: Annual is one `#annual-report` list of 15 (was two sections plus
  20 placeholder cards); Governance has lost the `#cg-archive` expander and runs as one policies
  list; Structure no longer shows "As at" in either language, which also clears the Thai twin's
  English header; Sustainability has lost its Effective/Period columns in both languages; and the
  News financial rows no longer read a bare "Financial Statements".
- **New:** `Pages/ThaiPages/Careers.cshtml` + `wwwroot/css/careers-th.css` — a Thai careers page,
  taking the route count from 113 to 114.
- **Razor `@` escaping — 10 breakers re-fixed** (see the standing item above). `@supports` and
  `@container` in `Capabilities/PackageDesign.cshtml`; `@media` in `Capabilities/RfidTireTags.cshtml`,
  `Careers/Stories.cshtml`, `Locations/Index.cshtml` and the Ayutthaya / Jiaxing / KohKong / Lamphun
  plant pages; and the prose `@page` in `Sitemap.cshtml`. HEAD did not compile before these.
- **Verification passes:** 114 routes all 200; 227 rendered assets all 200; 105 non-document
  internal links all 200; the three retrofit stylesheets link and serve on their pages.
- **No assets retired** — `rsync --delete` with the standing exclusion list proposed zero deletions.


### 14 Sep 2026 (2nd) — export sync ("14-9-2 razor Hana Site.zip")

- **Package Finder + site search FIXED AT SOURCE** (from the 14 Sep Claude Design fix note).
  All runnable checks from that note pass on the running site: finder renders 117 rows, parses
  "QFN32 5x5" and writes `?q=`; "Page →" links hit Razor routes (clear-mold →
  `/capabilities/osat/optical-packaging`); CTA → `/contact`; QFN/DFN/LGA (25 rows) and
  Ultra-small (35 rows) regained their embedded "Package reference · live" tables; `packages.js`
  loads once per page from `_Layout`. Search: `/search?q=qfn` and "rfid", "ayutthaya",
  "annual report", "npi", "telecom" all land on real pages; none of the 11 removed entries
  surfaces; Enter and "See all" go to `/search?q=`; the package card hands off to
  `/capabilities/osat/package-finder?q=QFN32%205x5`; mobile-menu search and the Capabilities hub
  finder box link to real pages; no `.html` in `package-finder.js` / `site-search.js`. The index
  still stores 76 slashed addresses but `href()` drops the slash at runtime (results are clean) —
  regenerate the index slashless at launch as already planned. (Check 14, the static export,
  belongs to the preview repo and was not run here.)
- **Synced** (`rsync --delete`): 7 added, 47 changed, 9 removed — the 8 `preview-*.html` static
  previews and the unused `js/search-shell.js`, both retired at source. Build clean
  (0 warnings, 0 errors); **113 routes 200**; **224 rendered assets resolve**; and — new check
  this sync — **all 104 distinct internal links resolve** (this would have caught the dead Die
  Attach links last time).
- **New page:** `Capabilities/DieAttachWireBond.cshtml` — see Open (conflicts with the 6 Aug
  merge decision). Also new: `optical-sensors.css`, MEMS why-panel photos, OSAT flip-chip hero,
  package-design thermal-simulation image, Optical SOT-packages photo.
- **Retrofits re-applied:** `@`-escaping ×8 files + Sitemap prose `@page`; 23 mobile `<link>` tags.
  Standalone-HTML chrome still fixed at source. `locations-mobile.css` merge kept (the export's copy
  is unchanged and the `.lc-*` class hooks are still absent from the Razor markup).
- **3 OSAT wafer images still not shipped** — kept via new sync exclusions (see Open).

### 14 Sep 2026 — export sync ("14-9 razor pages Hana Site.zip")

- **Synced the 14 Sep Razor export** (`rsync --delete`): 84 added, 107 modified, 69 removed.
  `dotnet build` clean (0 warnings, 0 errors); **all 112 routes 200** with one header /
  `<!DOCTYPE>` each; **all 216 local assets the rendered pages request resolve**.
- **10 new pages, none removed** (119 → 129 incl. dormant Cheongju): `Markets/Index`
  (`/markets` hub — `markets-hub.css`), `Capabilities/PackageFinder`
  (`/capabilities/osat/package-finder` — see Open, renders blank), `Search` (`/search`), and the
  remaining **7 Thai IR twins** (`ThaiPages/Investors/{Annual,EventsContact,Faq,Governance,News,
  Structure,Sustainability}`). New `wwwroot/css/_mobile.css` (site-wide small-screen type scale +
  tap targets, imported from `site.css`), `reveal.js`, `yt-facade.js`, `oppday-tabs.js`,
  `ir/oppday-*.webp` (the old `set-oppday-q1-2026.*` pair retired).
- **69 superseded assets deleted** — second WebP pass (icons, partner logos, Jiaxing life
  photos, product shots, QFN images, logo lockups, etc.), each verified unreferenced.
- **Standalone-HTML chrome bug: FIXED AT SOURCE.** 0 pages carried a mangled `ang="…">` opener
  this export — the Insights / Legal / Thai-privacy repair was not needed.
- **`@`-escaping ×9:** the usual 8 files (incl. `PackageDesign` `@supports` + `@container`) plus a
  **new prose variant** — `Sitemap.cshtml` text "the Razor `@page` directive" → `@@page`.
- **`locations-mobile.css` merged** (export now ships its own; see Open item for why it could not
  be taken as-is). Verified at 375px: hero 360px / h1 36px / full-width vertical scrim (export
  rules) + spec rows wrap + stat strip 2×2 (repo rules), 0px horizontal overflow.
- **4 missing images copied** from the static-preview repo (see Open).
- **Mobile `<link>` tags ×23** — capabilities 1, locations 6 (+ Cheongju's preserved), investors
  8 + all 8 Thai IR twins. Thai `/th/investor-relations/structure` verified 0px overflow at 375px.
- **Found, logged, NOT patched (awaiting Rupert):** Package finder blank + site-search links to
  `*.html` 404 on Razor (see Open).

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

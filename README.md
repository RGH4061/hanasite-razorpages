# Hana — corporate site (ASP.NET Core Razor Pages)

**Format:** ASP.NET Core 8 · Razor Pages (`.cshtml`) · vanilla CSS · vanilla JS
**No JSX. No React. No build step.** Every page is server-rendered HTML that runs in an ordinary .NET environment.

This is the Razor Pages project for the Hana Microelectronics marketing site. Each page is a plain `.cshtml` view; the only JavaScript is small, framework-free progressive enhancement (canvas hero, mega-menu, carousels, the locations map, site search and the package finder).

## Where to find things

| File | What it is |
|---|---|
| `README.md` | This overview: how to run the site and how it is laid out |
| `CHANGELOG.md` | Every dated change, newest first |
| `ISSUES.md` | Open bugs and fixes, and how to log a new one |
| `CLAUDE.md` | Working rules for Claude Code in this repo |
| `docs/backend-system/` | Design-complete admin area, not wired up yet (see its README) |

## Run it

```bash
dotnet run
```

Run it from the repo root, then browse to the address it prints. Static assets (CSS, JS, fonts, images) serve from `wwwroot/`.

## Project layout

```
HanaSite.csproj          net8.0 web project
Directory.Build.props    keeps docs/ out of the build (read the comment inside)
Program.cs               minimal Razor Pages host + redirects for retired pages
Services/                C# helpers (Seo.cs: titles, meta tags, sitemap)
Pages/
  _ViewStart.cshtml      applies _Layout to every page
  Index.cshtml           homepage
  About/ Capabilities/ Careers/ Contact/ Insights/ Investors/
  Legal/ Locations/ Markets/
  ThaiPages/             Thai-language versions
  Shared/                _Layout, _Header, _HeaderTh, _Footer, partials
wwwroot/
  css/                   _tokens.css (design tokens) → _base → _layout → _components, plus page CSS
  js/                    small vanilla scripts, one job each
  images/ fonts/ videos/ documents/
  robots.txt  llms.txt
docs/                    design source and specs, never compiled
```

### How a page works

`_ViewStart.cshtml` applies `_Layout.cshtml` to every page. The layout draws the `<head>`, the shared header, the page body via `@RenderBody()` and the shared footer, then loads the global JS. A page contains only its own `<main>` content plus, optionally, `@section Head { … }` and `@section Scripts { … }` blocks.

Routes are set with an explicit `@page "/locations/ayutthaya"` directive so URLs match the nav exactly, independent of the file name.

## Conventions

| Rule | Where |
|---|---|
| No JSX / React / build step | All files: plain HTML + vanilla JS |
| Design tokens only in `:root` | `wwwroot/css/_tokens.css` |
| `@font-face` local, never a font CDN | fonts in `wwwroot/fonts/` |
| Section backgrounds are declarative | `data-hana-bg="grid" data-variant="dark"` → `hana-backgrounds.js` renders them |
| `~/` prefix for static asset paths | All partials and pages |
| Icons via self-hosted Lucide | `js/vendor/lucide.min.js`; `lucide.createIcons()` runs once in `_Layout` |
| Per-page SEO via `ViewData` | `ViewData["Title"]`, `["Description"]`, `["Canonical"]` |
| `@` in page text is written `@@` | Razor treats a single `@` as code |

Plant data (specs, certifications, addresses) is hard-coded in each page's HTML. To edit a plant's facts, edit that one `.cshtml`.

## How changes get made

`main` is the version the developer deploys, so it should always be in a working state. New work happens on a branch, is opened as a pull request, reviewed, then merged into `main`. Each merged change gets a dated entry at the top of `CHANGELOG.md`.

## Open items before go-live

- [ ] **SET ticker**: static (`฿24.50`) in `_Header`, `_HeaderTh` and `_Footer`. Wire to the SET feed.
- [ ] **Map flags**: the world-map callout pulls country flags from `flagcdn.com` (`js/locations-map.js`). Vendor them locally if external calls aren't allowed.
- [ ] **Developer items from the search and AI-search sweep**: see the first entry under Open in `ISSUES.md`.

---

*Design system: Hana Microelectronics Group.*

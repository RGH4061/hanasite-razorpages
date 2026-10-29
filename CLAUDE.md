# CLAUDE.md

Working rules for Claude Code in this repo. Read this before changing anything.

## What this repo is

The ASP.NET Core 8 Razor Pages version of the Hana Microelectronics marketing site. Rupert edits it with Claude Code; Hana's IT team builds and deploys it. Read `README.md` for layout and conventions.

## Sources of truth

- **Page content and design**: since 21 Oct 2026 this repo is the source. The static preview site (`Hana-Site-previews`) is generated from it by `publish-preview.py` in Rupert's workspace, so changes made only in those HTML files are overwritten. Before "fixing" a difference, check `CHANGELOG.md` for decisions that were kept on purpose.
- **IR documents**: the real document IDs in the IR pages were verified against the live site. Never invent a document, ID or link.
- **Facts about Hana** (plant counts, staff numbers, certifications, years): only from existing pages or from Rupert. Never guess a number.

## How to work

1. Work on a branch, never directly on `main`. Name it for the change, e.g. `fix-thai-header`.
2. Keep each commit to one change, with a message that names the page or area first: `MEMS & Sensor: cut repetition`.
3. Open a pull request into `main` and let Rupert review and merge it.
4. Add a dated entry at the top of `CHANGELOG.md` for anything a developer would need to know.
5. When fixing an item from `ISSUES.md`, move it from Open to Fixed with the date.

## Rules that break things if ignored

- `docs/` is excluded from the build by `Directory.Build.props`. Never put live code there, and never move that exclusion into `HanaSite.csproj` (Design exports overwrite it).
- A literal `@` in page text must be written `@@`, or the page fails to compile.
- Static asset paths use the `~/` prefix.
- Design tokens live only in `wwwroot/css/_tokens.css`. No hard-coded colours elsewhere.
- No React, JSX, npm or build step. Vanilla JS only, one small script per job.
- No external CDNs for fonts or scripts; self-host in `wwwroot/`.
- When a page is retired, add a permanent redirect in `Program.cs` and remove its links from the header, footer and sidebars.
- Every English page with a Thai version (`Pages/ThaiPages/`) needs the same structural change in both.
- Markets, Capabilities and Locations pages get their Thai version from `Data/thai-drafts.json` (`Services/ThaiDrafts.cs`), not from a copied page: `/th/<route>` runs the English page with a Thai H1, blurb, SEO title and description and Thai breadcrumb/sidebar labels. When you change the H1 or opening blurb of one of those pages, update its `"en"` and `"th"` in the JSON, or the Thai page shows that line in English. Check with `/th/<route>?review=1`.

## Checking your work

- Run `dotnet build` before opening a pull request when .NET is available, and say in the PR if it was not run.
- Check any changed page at 375px wide as well as desktop.
- Check links you added resolve to real routes (`@page` directives) and real files in `wwwroot/`.

## Writing style for copy and docs

Plain British English, short sentences, specific numbers and names, no marketing filler. Change only what was asked; leave the rest of a page's wording as it is.

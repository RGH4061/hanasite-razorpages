# Hana Ticketing System — Claude Design project instructions

Paste this into the Claude Design project for the ticketing system. It is a
**separate Design project** from the main Hana website, but it exports into the
same ASP.NET Core repo, so it has to match the main site's brand system and obey
the same build constraints.

---

## What this is

An internal tool for the Hana sales team to see, claim, and close out enquiries
submitted through the website contact forms. It lives inside the main website as
a password-protected admin section at `/admin/tickets/`, not as a separate app.

Users: four people (Sanjay, Mark, Thang, Rupert). All have full edit access.
The public never sees these pages.

Full spec — data model, statuses, spam handling, GDPR, build phases — is in
`Plan.md` alongside this file.

---

## Terminology — do not mix these up

| Context | Word | Used in |
|---|---|---|
| Customer-facing | **request** | the two public forms, the customer confirmation email |
| Internal | **inquiry** | the admin pages, the internal notification email |

American English throughout (**inquiry**, not *enquiry*; *color*, not *colour*).
Public form naming is still being finalised — don't hard-code form names into
shared components.

---

## Brand system — match the main site exactly

Do not introduce colors or fonts outside this set.

### Palette

```
--hana-blue:       #1F5BA6    /* primary actions, links, section labels */
--hana-blue-deep:  #0E3A66    /* headers, dark strips */
--hana-blue-soft:  #3A7DC4    /* focus rings, accents */
--hana-blue-tint:  #E8EFF7    /* chip fills, hover states */
--off-white:       #FBFBFA    /* page background */
--surface:         #F2F4F6    /* panels, muted fills */
--line:            #E6E8EB    /* borders, dividers */
--ink:             #0E1116    /* primary text */
--ink-2:           #444B54    /* body text */
--ink-3:           #6B7280    /* labels, meta */
--warm-accent:     #FF883E
--error:           #B42318
--success:         #0A7C3F
```

### Status colors (functional — keep consistent across every view)

| Status | Background | Foreground | Border |
|---|---|---|---|
| New | `#FFF2F0` | `#B42318` | `#E05A4A` |
| Claimed | `#FFF8E6` | `#7A4F01` | `#E6A817` |
| Responded | `#E8EFF7` | `#0E3A66` | `#3A7DC4` |
| Closed | `#E6F4EC` | `#0A7C3F` | `#0A7C3F` |
| Spam | `#F2F4F6` | `#6B7280` | `#9BA3AF` |

### Form-type pills

- Detailed/project form — background `#0E3A66`, text `#FFFFFF`
- General form — background `#F2F4F6`, text `#6B7280`

### Typography

- **Geist** (400/600/700) — headings and section labels
- **Inter** (400/500/600/800) — body text, buttons, form labels
- **IBM Plex Mono** (500) — dates, reference numbers, and data values only

---

## Build constraints — ignoring these breaks the Razor build

The export is converted to `.cshtml` files. In Razor, `@` is a control character.
The exact behaviour below was tested against this repo — not assumed.

### Email addresses are fine — no escaping needed

`karl.becker@schliesstech.de` and `info-request@hanaus.com` build cleanly. Razor
recognises the email pattern and treats it as literal text. **Verified: builds
with 0 warnings.** Write email addresses normally.

### `@` breaks everywhere else

Three failure modes, all confirmed:

| Pattern | Example | Error |
|---|---|---|
| At-rule in an inline `<style>` | `@media (max-width: 600px)` | `CS0103: The name 'media' does not exist` |
| `@` followed by a space | `20 um @ 6 sigma`, `50 @ 100 units` | `RZ1003: A space or line break was encountered after the "@"` |
| `@` followed by a word | `Ping @rupert` | `CS0103: The name 'rupert' does not exist` |

The rule: **`@` is safe only when it looks like an email address.** Anywhere else,
write it as `&#64;` in text, or `@@` in a stylesheet.

### Avoid inline `<style>` blocks — use external stylesheets

The at-rule case above is the single most frequent build breaker on the main
site. It has had to be hand-fixed after almost every export (`@media` →
`@@media`), because the export generator escapes it correctly in most files but
keeps missing some.

Putting CSS in an external stylesheet avoids the problem completely — the rule
only applies inside `.cshtml`. Do that unless there's a strong reason not to.

---

## Responsive — handle it here, not later

Design every view mobile-responsive **at source**. On the main site, mobile fixes
were retrofitted in the repo as separate stylesheets, and because each export
overwrites the page files, those fixes have to be re-applied by hand every single
time. Don't repeat that pattern.

Specific traps from the main site:
- Don't set fixed pixel widths on containers (`width: 1100px`) — use `max-width`
  and let it collapse.
- Wide data tables must scroll inside their own container, never force the page
  to scroll sideways.
- Multi-column grids should collapse to one column on narrow screens.

The ticket list is a wide table. Decide deliberately how it behaves on a phone —
horizontal scroll within the table, or reflow to stacked cards.

---

## Sample data rules

- **Never use real customer names.** This is a firm content rule across all Hana
  material. All sample companies must be invented — the existing mockups use
  SchliessTech GmbH, Helios Medical Devices, Volterra Mobility, NordicSense AB,
  Iberian IoT, Meridian Capital.
- Sample contacts, emails, and phone numbers must be fictional too.
- Keep sample messages realistic in length. Real enquiries run several sentences,
  and the layout needs to survive that.
- **No file attachments anywhere.** The forms do not accept uploads. Don't design
  upload controls, paperclip icons, or attachment lists.

---

## Pages in scope

1. **Ticket list** (`/admin/tickets/`) — the main view. Filterable by status,
   owner, date, form type, market, capability. Default view is "unclaimed and
   open". Three sections: Open, Closed (collapsible), Spam (separate, muted).
2. **Enquiry detail** (`/admin/tickets/{id}`) — full record, claim button,
   editable status / routed-to / notes / date responded, and an audit trail.
   **This is the main page still to design.**
3. **Login** — ASP.NET Core Identity. Simple, on-brand.

Already designed as static mockups (match their visual language):
`Admin Page Mockup.html`, the two form mockups, and the two email templates.

---

## How the export is used

The export is unzipped into `docs/ticketing-system/export/` in the
`hanasite-razorpages` repo. That folder is excluded from the build, so nothing
in it affects the running site until it is deliberately merged.

Two things follow from that:

- **Every export contains a full project** — its own `Program.cs`,
  `HanaSite.csproj`, `_Layout.cshtml` and `wwwroot`. Only the page files and
  page-specific CSS get merged into the real site; the project shell is discarded.
- **Keep page files self-contained and clearly named** so they're easy to lift
  out. Avoid depending on a custom `_Layout` — the ticketing pages will be
  re-parented onto the main site's admin layout during the merge.

---

## Export rules — inherited from the main Hana design system

These carry over unchanged from §7.3 of `hana-design-system.md`. The ticketing
system merges into the same repo as the marketing site, so it must follow the
same conventions.

### Output format — always `.cshtml`, never JSX

- Page structure → `.cshtml` files and partial views
- Styles → plain CSS files
- Scripts → **vanilla JavaScript only** — no React, no bundler, no JSX

Prototyping in React/JSX is fine for exploration, but nothing may be handed off
as `.jsx` or `.tsx`. When converting: strip all React syntax (`import`,
`export default`, hooks, JSX tags), move event handlers into a separate `.js`
file, and extract inline SVGs into their own icon partials.

### Do not bundle or inline

Every block of UI is a separate named file. Styles and scripts stay in their own
files, not inlined into the page. (This also sidesteps the `@media` build breaker
described above.)

### Semantic HTML

Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
rather than generic `<div>`s wherever the content type is clear. On the admin
side this is for structure and accessibility rather than SEO, but the convention
is the same.

### Naming conventions

| Thing | Convention | Ticketing examples |
|---|---|---|
| Global partial | `_ComponentName.cshtml` | `_AdminHeader.cshtml` |
| Page-specific block | `_pagename_BlockName.cshtml` | `_tickets_FilterBar.cshtml`, `_tickets_StatusPill.cshtml`, `_ticket_AuditTrail.cshtml` |
| Model | `PageNameBlockNameModel.cs` | `TicketListModel.cs`, `TicketDetailModel.cs` |
| Asset filenames | lowercase, hyphen-separated | `icon-claim.svg` — no spaces, no camelCase |

Page name lowercase, block name PascalCase. All partials live in `Pages/Shared/`.

### CSS structure

Tokens live in their own file and are imported first:

```
wwwroot/css/
├── _tokens.css      ← :root custom properties (the palette above)
├── _components.css  ← buttons, cards, pills
├── _layout.css      ← page-wrap, grid
└── site.css         ← @import order: _tokens → _layout → _components
```

Reuse the existing `_tokens.css` rather than redefining the palette. Ticketing
additions (status colors, form-type pills) belong in a dedicated `admin.css`,
loaded after `site.css`.

### Static assets

```
wwwroot/images/
├── bg/       bg-[descriptor].svg
├── icons/    icon-[descriptor].svg
└── photos/   raster images (JPEG / WebP)
```

Always reference static paths with the `~/` prefix — `~/images/icons/icon-claim.svg`.
It resolves to `wwwroot/`.

### Expected file layout for this project

```
Pages/Admin/Tickets/
├── Index.cshtml + Index.cshtml.cs        ← ticket list
└── Detail.cshtml + Detail.cshtml.cs      ← enquiry detail

Pages/Shared/
├── _tickets_FilterBar.cshtml
├── _tickets_StatusPill.cshtml
└── _ticket_AuditTrail.cshtml

Models/Admin/
├── TicketListModel.cs
└── TicketDetailModel.cs

wwwroot/css/admin.css
```

---

## Rules from the design system that do NOT apply here

The main design system is written for public marketing pages. These pages sit
behind a login and are never indexed, so the following are deliberately excluded.
Do not add them.

| Rule | Why not |
|---|---|
| **Schema markup** — Organization, `FAQPage`, Person JSON-LD | Admin pages are not indexed. Structured data here is dead weight. |
| **`dateModified` / `datePublished`** | Same — that's for News & Insights content. |
| **AI crawler access** (`GPTBot`, `ClaudeBot`, `PerplexityBot`) | Inverted here. The design system explicitly says to *restrict* admin paths and form submission endpoints. `/admin/tickets/` must be blocked in `robots.txt`, not allowed. |
| **SEO/AEO copywriting patterns** | No keyword targeting, no answer-shaped headings. Labels should be short and functional. |
| **Decorative canvas backgrounds** (`hana-backgrounds.js` — topo, pcb, globe, etc.) | These are marketing chrome. An admin tool needs density and fast scanning, not texture. The login page is the one reasonable exception. |

### Register — this is a tool, not a brochure

The brand voice rules in §5 of the design system still apply to any prose, but
admin UI is mostly labels, not copy. Keep them short, plain, and consistent:
"Claim", "Mark as spam", "Routed to", "Date responded". No marketing tone, no
persuasive language, no exclamation marks.

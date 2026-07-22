# Hana Ticketing System — Razor Pages export

Handoff package for the internal inquiry ticketing tool. Converted from the
Design Component prototypes (`Hana CRM - Inquiry Tickets.dc.html`,
`Hana CRM - Login.dc.html`) into ASP.NET Core Razor Pages, following the project
build constraints: `.cshtml` + plain CSS + vanilla JS, no React/JSX/bundler, no
inline `<style>`, semantic HTML, one named file per UI block, `~/` static paths.

## File layout

```
export/
├── Pages/
│   ├── _ViewImports.cshtml                     @using / @addTagHelper
│   ├── Admin/Tickets/
│   │   ├── Index.cshtml                        ticket list page (/admin/tickets/)
│   │   └── Index.cshtml.cs                     TicketListModel + action handlers
│   ├── Admin/InvestorRelations/               IR admin hub (/admin/investor-relations/)
│   │   ├── Index.cshtml(.cs)                   tabbed lists: news/events/reports/presentations
│   │   ├── NewsForm.cshtml(.cs)                new/edit news item (also events via ?kind=event)
│   │   ├── ReportForm.cshtml(.cs)              new/edit report + cover
│   │   └── PresentationForm.cshtml(.cs)        new/edit Opportunity Day presentation
│   ├── Account/
│   │   ├── Login.cshtml                        sign-in page
│   │   └── Login.cshtml.cs                     LoginModel (Identity stub)
│   └── Shared/
│       ├── _AdminHeader.cshtml                 CRM topbar
│       ├── _tickets_FilterBar.cshtml
│       ├── _tickets_StatusPill.cshtml
│       ├── _tickets_TicketRow.cshtml
│       ├── _icon_Chevron.cshtml
│       ├── _icon_Dots.cshtml
│       ├── _IrAdminHeader.cshtml               IR topbar (same style, own title)
│       ├── _ir_TabBar.cshtml                   IR section tabs
│       ├── _ir_StatusPill.cshtml               shared publishing-status badge
│       ├── _ir_NewsRow / _ir_EventRow / _ir_ReportRow / _ir_PresRow.cshtml
│       ├── _ir_AttachmentEditor.cshtml         repeatable attachment rows
│       └── _ir_PublishBlock.cshtml             publish now / at a set time
├── Models/Admin/
│   ├── Ticket.cs                               inquiry model + view helpers
│   └── TicketStore.cs                          in-memory seed (replace on merge)
├── Models/Ir/
│   ├── Attachment.cs                           attachment + IrStatus enum/helpers
│   ├── IrRecords.cs                            NewsItem / IrEvent / Report / Presentation / FaqCategory
│   └── IrStore.cs                              in-memory seed (replace on merge)
└── wwwroot/
    ├── css/_tokens.css                         palette — reuse the site's copy
    ├── css/admin.css                           ticket list styles
    ├── css/ir-admin.css                        IR hub styles
    ├── css/login.css                           sign-in styles
    ├── js/tickets.js                           expand / menu / collapse / filter
    ├── js/ir-admin.js                          publish toggle / repeatable rows / period field
    ├── js/hana-backgrounds.js                  login-only decorative background
    ├── images/hana-logo-full.svg, hana-mark.svg
    └── robots.txt                              blocks /admin/tickets/ + /admin/investor-relations/
```

## Merge notes

- **Lift page content, drop the shell.** `Index.cshtml` and `Login.cshtml` set
  `Layout = null` and carry their own `<!DOCTYPE>` so the export renders
  standalone. On merge, move the `<main>` block onto the site's admin `_Layout`
  and delete the surrounding document + the font `<link>` (the main site's
  `site.css` already loads Geist / Inter / IBM Plex Mono).
- **Tokens.** `_tokens.css` duplicates the site palette so the export renders on
  its own. Reuse the existing `wwwroot/css/_tokens.css` instead of adding a
  second copy; keep only `admin.css` / `login.css`.
- **Data layer.** `TicketStore` is an in-memory seed for the prototype. Replace
  with the real repository / EF Core context; the page handlers only touch
  `Find` and the list, so the swap is localized.
- **Auth.** `LoginModel.OnPost` is a stub that accepts any input and redirects.
  Wire `SignInManager.PasswordSignInAsync` during merge. All four users
  (Sanjay, Mark, Thang, Rupert) have full access.
- **Filtering** runs client-side in `tickets.js` over the rendered rows
  (`data-*` attributes). If the dataset grows, move it to a server-side query on
  `OnGet`.
- **No full-record page.** The sales team works inquiries from their own email;
  the CRM only routes tickets to the correct owner, so the expand panel is the
  full view. A dedicated record/audit page is deferred as possible future work.
  (Honeypot spam rows keep a "View raw data" action that opens the expand panel.)

## Investor Relations hub (`/admin/investor-relations/`)

- **One page, four tabs.** `Index.cshtml` renders news / events / reports /
  presentations by `?tab=`. The tab bar (`_ir_TabBar`) also links straight into
  the three form pages. Tables scroll inside `.ir-listwrap` and the form grids
  collapse to one column below 820px.
- **Forms use model binding + validation.** Each form page has an `InputModel`
  with `[Required]` attributes (plus a server rule: Financial Information items
  must carry a Period). Invalid posts return the page with `asp-validation-for`
  messages; valid posts write to `IrStore` and redirect (PRG).
- **Client-side JS (`ir-admin.js`) is enhancement only.** It drives the publish
  now/schedule toggle, the repeatable attachment rows (add/remove + filename
  reflect), and the Period field that appears only for Financial Information.
  The save itself is a normal form POST, so it works if JS fails.
- **Attachments** are one record with many files (EN + TH + statements), bound
  as `Input.Attachments[i]` and rendered by `_ir_AttachmentEditor`; the JS
  renumbers indices as rows are added/removed.
- **Header named per dashboard.** `_IrAdminHeader` shares the CRM header's
  visual language but carries the title "Investor relations" — the CRM keeps
  `_AdminHeader`. 150px logo kept to match the prototypes.
- **Same in-memory-store caveat as the CRM.** `IrStore` is a seed; swap for the
  real repository on merge (page models only touch `Find*` + the lists).
- **Content rules preserved from the wireframe:** transcripts published verbatim,
  written summaries with customer names removed, and the SET-filing scheduler
  note that files stay unreachable until go-live.

## Razor build safety

- `@@` is used for literal `@` in the Google Fonts URLs (`wght@@400`) — the only
  place `@` appears outside an email in these views.
- Email addresses (`you@hanagroup.com`, sample contacts) are written normally —
  Razor treats the email pattern as literal text.
- No inline `<style>` blocks anywhere, so the `@media` build-breaker cannot
  occur. All CSS lives in external `.css` files.

## What changed from the earlier mockup

- Palette uses the bound **Hana design system** (`--hana-blue: #1283DD` family),
  not the older `#1F5BA6` mockup values.
- The **Form / Plant-Inquiry column and filter were removed** — individual plant
  inquiry forms no longer exist.
- Responsive: the wide ticket table reflows to stacked cards below 760px; the
  login page adapts below 480px.
- The hero bar shows a **stats dashboard** (Last 30 days / New / In progress /
  Closed), computed in `_AdminHeader` from `TicketStore`, hidden below 1024px.
- The hero bar carries the **Flow** background (`hana-backgrounds.js`, light) —
  set via `data-hana-bg` on the header. To turn it off, remove that attribute;
  to change pattern, swap the value (grid / pcb / hex / wafer / flow / topo).
- Prototype default signed-in user is Sanjay (fallback only; real value comes
  from Identity).

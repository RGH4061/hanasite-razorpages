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
│   ├── Account/
│   │   ├── Login.cshtml                        sign-in page
│   │   └── Login.cshtml.cs                     LoginModel (Identity stub)
│   └── Shared/
│       ├── _AdminHeader.cshtml
│       ├── _tickets_FilterBar.cshtml
│       ├── _tickets_StatusPill.cshtml
│       ├── _tickets_TicketRow.cshtml
│       ├── _icon_Chevron.cshtml
│       └── _icon_Dots.cshtml
├── Models/Admin/
│   ├── Ticket.cs                               inquiry model + view helpers
│   └── TicketStore.cs                          in-memory seed (replace on merge)
└── wwwroot/
    ├── css/_tokens.css                         palette — reuse the site's copy
    ├── css/admin.css                           ticket list styles
    ├── css/login.css                           sign-in styles
    ├── js/tickets.js                           expand / menu / collapse / filter
    ├── js/hana-backgrounds.js                  login-only decorative background
    ├── images/hana-logo-full.svg, hana-mark.svg
    └── robots.txt                              blocks /admin/tickets/
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

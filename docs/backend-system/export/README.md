# Hana backend system — Razor Pages export

Handoff package for the whole password-protected admin area: one sign-in page,
a section hub at `/admin`, and four sections — inquiry tickets, investor
relations, job listings and insights. Converted from the Design Component
prototypes into ASP.NET Core Razor Pages, following the project
build constraints: `.cshtml` + plain CSS + vanilla JS, no React/JSX/bundler, no
inline `<style>`, semantic HTML, one named file per UI block, `~/` static paths.

## File layout

```
export/
├── Pages/
│   ├── _ViewImports.cshtml                     @using / @addTagHelper
│   ├── Admin/
│   │   ├── Index.cshtml                        section hub (/admin)
│   │   └── Index.cshtml.cs                     AdminHubModel — cards + live stats
│   ├── Admin/Tickets/
│   │   ├── Index.cshtml                        ticket list page (/admin/tickets/)
│   │   └── Index.cshtml.cs                     TicketListModel + action handlers
│   ├── Admin/InvestorRelations/               IR admin hub (/admin/investor-relations/)
│   │   ├── Index.cshtml(.cs)                   tabbed lists: news/events/reports/presentations
│   │   ├── NewsForm.cshtml(.cs)                new/edit news item (also events via ?kind=event)
│   │   ├── ReportForm.cshtml(.cs)              new/edit report + cover
│   │   └── PresentationForm.cshtml(.cs)        new/edit Opportunity Day presentation
│   ├── Admin/Careers/                      job listings (/admin/careers/)
│   │   ├── Index.cshtml(.cs)                filterable listing table
│   │   └── JobForm.cshtml(.cs)              new/edit a role
│   ├── Admin/Insights/                     insight articles (/admin/insights/)
│   │   ├── Index.cshtml(.cs)                article list + checklist state
│   │   └── ArticleForm.cshtml(.cs)          write, run the checks, approve
│   ├── Account/
│   │   ├── Login.cshtml                        sign-in page
│   │   └── Login.cshtml.cs                     LoginModel (Identity stub)
│   └── Shared/
│       ├── _AdminHeader.cshtml                 CRM topbar
│       ├── _AdminSectionNav.cshtml             header section switcher (all topbars)
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
│       ├── _ir_PublishBlock.cshtml             publish now / at a set time
│       ├── _InsightsHeader.cshtml              insights topbar (same style, own title)
│       ├── _insights_FilterBar.cshtml
│       ├── _insights_ArticleRow.cshtml
│       ├── _insights_StatusPill.cshtml
│       ├── _insights_Checklist.cshtml          grouped publish checklist
│       ├── _insights_CheckPill.cshtml          one check result
│       └── _insights_SourceEditor / _insights_EntityEditor / _insights_FaqEditor.cshtml
├── Models/Admin/
│   ├── AdminSections.cs                        the four sections, their roles and routing
│   ├── Ticket.cs                               inquiry model + view helpers
│   └── TicketStore.cs                          in-memory seed (replace on merge)
├── Models/Careers/
│   ├── Job.cs                                  listing model; status derived from the closing date
│   └── JobStore.cs                             in-memory seed (replace on merge)
├── Models/Insights/
│   ├── Article.cs                              article model + view helpers
│   ├── ArticleChecks.cs                        the publish checklist (block / warn / auto)
│   └── ArticleStore.cs                         in-memory seed (replace on merge)
├── Models/Ir/
│   ├── Attachment.cs                           attachment + IrStatus enum/helpers
│   ├── IrRecords.cs                            NewsItem / IrEvent / Report / Presentation / FaqCategory
│   └── IrStore.cs                              in-memory seed (replace on merge)
└── wwwroot/
    ├── css/_tokens.css                         palette — reuse the site's copy
    ├── css/admin.css                           ticket list styles
    ├── css/ir-admin.css                        IR hub styles (also the careers shell)
    ├── css/careers-admin.css                   job-listing specifics
    ├── css/insights-admin.css                  article list, editor and checklist
    ├── css/admin-hub.css                       section hub cards
    ├── css/section-nav.css                     header section switcher
    ├── css/login.css                           sign-in styles
    ├── js/tickets.js                           expand / menu / collapse / filter
    ├── js/ir-admin.js                          publish toggle / repeatable rows / period field
    ├── js/careers-admin.js                     listing filters / repeatable job-board links
    ├── js/insights-admin.js                    editor toolbar / filters / repeatable rows
    ├── js/hana-backgrounds.js                  login-only decorative background
    ├── images/hana-logo-full.svg, hana-mark.svg
    └── robots.txt                              blocks every /admin/ section and /account/login
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
  Wire `SignInManager.PasswordSignInAsync` during merge. Access is by role, not
  by section — see *Section hub* below. Note that the `[Authorize]` attributes
  on the admin page models need an authentication scheme registered in
  `Program.cs`; without one every admin page throws at request time.
- **Assignment emails.** Claim / Assign send the inquiry summary to the owner's
  mailbox via `Services/AssignmentMailer.cs` (`IAssignmentMailer`), which also
  stamps `NotifiedName / NotifiedEmail / NotifiedAt / NotifiedSubject` on the
  ticket — shown in the expand panel and re-sendable from the row menu
  ("Resend summary email"). Register the transport in `Program.cs`:
  `builder.Services.AddSingleton<IAssignmentMailer, SmtpAssignmentMailer>();`
  and pass real host / port / from-address, or implement the interface against
  the site's existing mail sender. The email body is the Hana-branded HTML
  template at `export/emails/assignment-summary.html` (tables + inline styles,
  `{{Token}}` placeholders, palette and 4px button radius per the design
  system); the mailer fills it and attaches a plain-text alternate view. Keep
  the file deployed alongside the app or point `templatePath` at its location. Mailboxes live in `TicketStore.OwnerMailboxes`
  — move them to the Identity user records on merge. Delivery failures are
  swallowed so an SMTP outage cannot block an assignment.
- **Open inquiries are tabbed.** Four queues — sales & support, investor
  relations, careers, supplier & vendor — derived from `Ticket.Bucket`
  (`_tickets_OpenTabs.cshtml` renders the bar with a live count per tab; zero
  counts render gray). Sales & support is the catch-all: sales, customer
  support, capability and technical questions, "other", and inquiries with no
  reason set. Switching is client-side in `tickets.js` — all four panels are
  rendered, so filters and expand state survive a tab change. `TicketStore.Open`
  and `.Closed` no longer exclude supplier tickets; `TicketStore.Supplier` is
  retained but unused by the page.
- **Reason pill by queue.** `.reason-tag--ir` (deep blue) and
  `.reason-tag--careers` (warm accent) separate those two from the blue sales
  pill.
- **Filtering** runs client-side in `tickets.js` over the rendered rows
  (`data-*` attributes). If the dataset grows, move it to a server-side query on
  `OnGet`.
- **No full-record page.** The sales team works inquiries from their own email;
  the CRM only routes tickets to the correct owner, so the expand panel is the
  full view. A dedicated record/audit page is deferred as possible future work.
  (Honeypot spam rows keep a "View raw data" action that opens the expand panel.)

## Section hub (`/admin`)

- **One section = one Identity role.** `Models/Admin/AdminSections.cs` holds the
  four sections (Tickets, InvestorRelations, Careers, Insights), each with its
  role name, title, route and description. `SuperAdmin` reaches all four. The
  page attributes read `[Authorize(Roles = "<Section>,SuperAdmin")]`, so a role
  assignment is the only thing that grants access.
- **Where sign-in lands you.** `AdminSections.LandingPage(User)` sends a user who
  holds one section straight into it and a user who holds several to the hub. An
  explicit local `returnUrl` wins over both, so a deep link survives sign-in.
- **The hub is skipped when it has nothing to offer.** `AdminHubModel.OnGet`
  forwards a single-section user into their section and returns `Forbid()` for a
  user with no sections. It lists the sections the user cannot reach by title
  only, so they can see what exists without a route to it.
- **Card figures come from the same stores the sections use** (`StatsFor`) —
  open and unclaimed tickets, scheduled and draft IR news, articles in review
  and in draft, live and closing job listings. They move to the real repositories
  with everything else on merge.
- **The header switcher** (`_AdminSectionNav`) renders in all four topbars and
  outputs nothing for a user with one section, so single-section users see no
  extra UI. Styles are in `section-nav.css`; the hub itself uses `admin-hub.css`.

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
- Responsive: the wide ticket table reflows to stacked cards below 760px, the
  tab bar scrolls sideways with 44px targets, and the topbar wraps with a
  smaller logo. The IR lists reflow the same way (`ir-admin.css`, 760px): row
  grids stack, column headers hide, section tabs scroll sideways, attachment
  rows go single-column. The login page adapts below 480px.
- Careers admin (`/admin/careers/`) ships with the same mobile treatment.
- The hero bar shows a **stats dashboard** (Last 30 days / New / In progress /
  Closed), computed in `_AdminHeader` from `TicketStore`, hidden below 1024px.
- The hero bar carries the **Flow** background (`hana-backgrounds.js`, light) —
  set via `data-hana-bg` on the header. To turn it off, remove that attribute;
  to change pattern, swap the value (grid / pcb / hex / wafer / flow / topo).
- Prototype default signed-in user is Sanjay (fallback only; real value comes
  from Identity).

## Careers admin (`/admin/careers/`)

- **Two pages.** `Index.cshtml` is the filterable listing table;
  `JobForm.cshtml` creates and edits a role in four numbered sections (role
  details, the advert, centrally-managed sections, publishing).
- **Status is derived, not stored.** `Job.Status` reads the closing date and
  the published flag: live, closing soon (under 7 days), draft, expired. An
  expired role leaves the public careers page on its own and stays in the admin
  list for `Repost`, which opens a fresh listing pre-filled from it.
  `Job.Today` is a prototype clock — swap it for `DateTime.Today` on merge.
- **Reference code and page address are generated**, from the plant and
  department (`AYT-ENG-0143`) and from plant + title respectively.
- **Drafts can be saved incomplete.** Publishing runs the full validation set;
  `Save as draft` only requires a title. The footer buttons post an `action`
  value (`publish` / `draft` / `preview` / `unpublish`) to one handler.
- **Job board links** are repeatable rows bound as `Input.Links[i]`;
  `careers-admin.js` renumbers the indices so model binding stays contiguous.
  They are a record of where else the role was posted — candidates still apply
  through the Hana form.
- **Shares the IR shell.** The careers pages load `ir-admin.css` for the topbar,
  tabs, cards and fields, then `careers-admin.css` for the listing grid, status
  pills and form specifics. If the two dashboards ever diverge, split the shared
  block out of `ir-admin.css` rather than duplicating it.
- **Same in-memory-store caveat.** `JobStore` is a seed; swap for the real
  repository on merge.

## Insights (`/admin/insights/`)

- **Two pages.** `Index.cshtml` is the article list with the checklist state per
  row; `ArticleForm.cshtml` is the editor — body, metadata, sources, entities and
  FAQs, with the publish checklist alongside.
- **The publish checklist is the control.** `Models/Insights/ArticleChecks.cs`
  runs grouped checks at three levels: `Block` refuses publication, `Warn` is
  shown to whoever publishes and left to their judgement, `Auto` is informational.
  `CheckResult.CanPublish` is simply "no blocking failures". The percentage score
  (1 per pass, 0.5 per warning) is guidance and never blocks. Banned terms and
  customer-name checks are deliberately not in this file — that review happens on
  the writing side.
- **Writing and approving are separate.** An agency or staff account writes and
  uses *Send for review*; only an account in `InsightsApprover` can publish.
  `OnPostApprove` re-runs the checks before it writes, so a stale page cannot
  publish an article that has since failed one.
- **Approve with a scheduled date sets `scheduled` rather than `published`** —
  the record is approved and waits. Taking an article down sets `archived`
  rather than deleting it.
- **Every state change appends to `Article.Audit`** with who did it, which is what
  the editor shows as history.
- **Shares the IR shell**, the same way careers does: `ir-admin.css` for the
  topbar, tabs, cards and fields, then `insights-admin.css` for the list, editor
  toolbar and checklist.
- **Same in-memory-store caveat.** `ArticleStore` is a seed; swap for the real
  repository on merge.

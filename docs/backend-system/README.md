# Hana — backend system

Everything for the password-protected admin area of the website: the internal
tools Hana staff sign in to, as opposed to the public pages the rest of this
repo serves.

**Nothing in this folder is wired up yet.** It is design-complete Razor Pages
plus the specs behind them, for a developer to merge into the main project. See
*What is missing* below — the short version is that the site currently has no
database, no authentication and no email sending, and all three are needed
before any of this runs.

---

## The tools

| Tool | Route | Who uses it | Status |
|---|---|---|---|
| **Inquiry tickets** | `/admin/tickets/` | Sales — Sanjay, Mark, Thang, Rupert | Design complete |
| **Investor Relations** | `/admin/investor-relations/` | Corporate Affairs / finance, Bangkok | Design complete |
| Careers (job listings) | `/admin/jobs/` | HR — Lamphun, Ayutthaya, Koh Kong | Planned, not yet built |

All three are sections of **one admin area behind one login**, not separate
applications. A person's account decides which tools they can reach: sign in
once, see only what you have a role for, and a direct link to a tool you don't
hold returns not-found rather than a password prompt.

Why one login rather than three: several people (Rupert, Thang) need more than
one tool, so separate logins would mean separate passwords for the same person
and several places to disable an account when somebody leaves. The separation
between tools is a permissions question, and it is answered by roles.

---

## Layout

```
docs/backend-system/
├── export/                     Razor Pages source — BOTH tools, one package
├── ticketing/                  spec, mockups and email templates for tickets
│   ├── Plan.md                 data model, statuses, spam handling, GDPR, phases
│   ├── Claude Design — Project Instructions.md
│   ├── Email Copy — Both Emails.md
│   ├── email-templates/        the two HTML emails
│   └── *.html                  original static mockups (superseded by export/)
└── investor-relations/
    └── Plan.md                 what the IR tool does and why, plus open questions
```

`export/` has its own README with the file-by-file layout and merge notes. It is
a single package covering both tools because they share the login page, the
header treatment, the design tokens and the `Pages/Shared/` partials — merge it
once, not twice.

*Note:* `export/README.md` is still titled "Hana Ticketing System" from when the
package covered only that tool. The contents are current; the heading is not.

---

## What is missing before any of this runs

None of the following exists in the repo today. This is the developer's first
job, and it is shared groundwork — whichever tool is built first pays for it,
and the others inherit it.

1. **A database.** `HanaSite.csproj` has no EF Core, no packages at all. There is
   no `appsettings.json` and no connection string.
2. **Authentication.** `Program.cs` is `AddRazorPages()` and nothing else.
   `Login.cshtml.cs` is an honest stub — it accepts any email and password and
   redirects. Needs ASP.NET Core Identity, and `[Authorize]` per admin folder
   with a role for each tool (`Tickets`, `Careers`, `IR`).
3. **Email sending.** The ticketing tool sends two emails (internal notification,
   customer confirmation). No SMTP configuration exists.
4. **The public form handler.** `Pages/Contact/Index.cshtml` has a
   `<form method="post">` but no `.cshtml.cs` behind it. That form is the
   ticketing system's front door — submissions currently go nowhere.
5. **File storage** for the IR tool — annual reports run to tens of megabytes.
   Store uploads outside the web root and serve them through a handler, so an
   unpublished document cannot be reached by guessing its address.
6. **A hosting decision**, including *where the data physically lives* — that
   determines the GDPR / PDPA answers in both plans.

## User accounts

Stock ASP.NET Core Identity: a users table, a roles table with one row per tool,
and a join table saying who holds what. That join table *is* the permissions —
there is nothing custom to design.

No screen for managing users at launch. Across all three tools this is roughly
eight to twelve people changing a couple of times a year, so accounts are added
by the developer; a management screen is worth building only if that becomes
frequent. **Deactivate accounts, never delete them** — the audit trail names who
published each item, and deleting the user orphans that history.

## Suggested build order

Tickets first, on its own. It is the tool whose spec has been settled longest,
and building it forces the groundwork above into place. Investor Relations then
becomes a much smaller job: same database, same login, one more section.

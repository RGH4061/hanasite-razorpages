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

| Tool | Route | Role | Who uses it | Status |
|---|---|---|---|---|
| **Inquiry tickets** | `/admin/tickets/` | `Tickets` | Sales — Sanjay, Mark, Thang, Rupert | Design complete |
| **Investor Relations** | `/admin/investor-relations/` | `InvestorRelations` | Corporate Affairs / finance, Bangkok | Design complete |
| **Careers (job listings)** | `/admin/careers/` | `Careers` | HR — Lamphun, Ayutthaya, Koh Kong | Design complete |
| **Insights** | `/admin/insights/` | `Insights` | Corporate Affairs, plus agency writers | Design complete |

All four are sections of **one admin area behind one login**, not separate
applications. A person's account decides which tools they can reach: sign in
once, see only what you have a role for, and a direct link to a tool you don't
hold returns not-found rather than a password prompt.

A **section hub at `/admin`** sits behind the login. Someone holding one section
is sent straight into it and never sees the hub; someone holding several lands
there, and can move between sections from the header afterwards without signing
in again. The `SuperAdmin` role reaches all four. The sections, their roles and
their routes are defined in one place, `export/Models/Admin/AdminSections.cs`.

Why one login rather than three: several people (Rupert, Thang) need more than
one tool, so separate logins would mean separate passwords for the same person
and several places to disable an account when somebody leaves. The separation
between tools is a permissions question, and it is answered by roles.

---

## Layout

```
docs/backend-system/
├── export/                     Razor Pages source — ALL four sections, one package
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
a single package covering all four sections because they share the login page,
the section hub, the header treatment, the design tokens and the
`Pages/Shared/` partials — merge it once, not four times.

---

## What is missing before any of this runs

None of the following exists in the repo today. This is the developer's first
job, and it is shared groundwork — whichever tool is built first pays for it,
and the others inherit it.

1. **A database.** `HanaSite.csproj` has no EF Core, no packages at all. There is
   no `appsettings.json` and no connection string.
2. **Authentication.** `Program.cs` is `AddRazorPages()` and nothing else.
   `Login.cshtml.cs` is an honest stub — it accepts any email and password and
   redirects. Needs ASP.NET Core Identity with one role per section (`Tickets`,
   `InvestorRelations`, `Careers`, `Insights`, plus `SuperAdmin` and the
   `InsightsApprover` role that gates publishing). The `[Authorize]` attributes
   are already on the page models; until an authentication scheme is registered
   in `Program.cs` they throw rather than redirect to the login page.
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

Roughly fifteen accounts across the four sections: about 6 in tickets (sales),
5 in careers (HR, across plants), 3 in investor relations, and 2 in insights.
Some people hold more than one. **SuperAdmin is Rupert, Sanjay and Wichet (IT);**
Thang holds `Tickets` only.

The two insights accounts are one internal account holding `Insights` and
`InsightsApprover`, and **one shared login for the SEO agency** holding
`Insights` alone. The agency writes and sends for review; publishing is internal.
That makes the approver tick load-bearing from day one rather than a placeholder.

**Decision (21 Sep 2026): build a user management screen** at `/admin/users`,
SuperAdmin only, after Identity is in place and the first section has shipped.
It supersedes the earlier decision to leave accounts to the developer. Turnover
is low and the developer is internal, so the screen is not urgent and blocks
nothing; it exists to keep routine access requests off IT's queue and to record
who granted which access. Scope is five actions — list, invite, set roles,
deactivate/reactivate, resend invitation — with no profile editing and no
per-record permissions. Full spec in `5. Website Redesign/Backend Systems/User
Management/Plan.md` in the workspace.

Wire **self-service password reset** through Identity at the same time, using
the mail sending the ticketing system already needs. Resets are the most frequent
account event at this headcount, and handling them without an administrator is
what keeps the screen small.

**Deactivate accounts, never delete them** — the audit trail names who
published each item, and deleting the user orphans that history.

## Suggested build order

Tickets first, on its own. It is the tool whose spec has been settled longest,
and building it forces the groundwork above into place. Each section after it is
a much smaller job: same database, same login, one more role and one more set of
pages.

# Ticketing system — design source

Design mockups and specs for the website enquiry ticketing system. **Nothing in
this folder is live code** — these are self-contained static HTML files you can
open directly in a browser to see the intended design. No server needed.

| File | What it is |
|---|---|
| `Plan.md` | The spec — data model, forms in scope, logins, spam handling, GDPR, build phases |
| `Admin Page Mockup.html` | Internal ticket list view (`/admin/tickets/`) |
| `Plant Inquiry Form Mockup.html` | Public detailed project form |
| `General Inquiry Form Mockup.html` | Public general contact form |
| `email-templates/` | The two transactional emails sent on submission |

## Terminology (decided July 2026)

- **Customer-facing → "request"** — what the visitor submits
- **Internal → "inquiry"** — the record the team works

The two email templates sit on opposite sides of that line and are worded
accordingly. Don't normalise them to a single word. Public form naming is being
finalised separately, so the mockups may still carry older labels.

## Why this folder is at `docs/`, not under `Pages/` or `wwwroot/`

The Design export overwrites `Pages/` and `wwwroot/` on every sync. Anything
placed there that collides with an export output gets clobbered — see the repo
root `ISSUES.md` for the running list of fixes that have to be re-applied after
each export.

`docs/` is not an export target, so this folder is safe. Keep it that way: when
these templates become live code, the `.cshtml` versions go under `Pages/`, but
these design-source files stay here.

## Dropping a raw Claude Design export in here

You can unzip a ticketing-system Design export into `docs/ticketing-system/export/`
and it will not affect the running site. `Directory.Build.props` at the repo root
excludes `docs/**` from the build, so the export's own `Program.cs`, `.cshtml`
files and `.csproj` are ignored rather than compiled.

**Do not unzip a ticketing export over the repo root.** Every Design export
contains a full project — its own `Program.cs`, `HanaSite.csproj`,
`Pages/Shared/_Layout.cshtml` and `wwwroot/css/site.css`. Landing a second one
at the root would overwrite the main site's shell with the ticketing project's
version. Always extract into `docs/`, then copy across only the pages you want.

Verified: with a rogue `Program.cs` and an invalid `.cshtml` sitting under
`docs/`, `dotnet build` succeeds with 0 warnings. Without the exclusion the same
files fail the build with `CS8802`.

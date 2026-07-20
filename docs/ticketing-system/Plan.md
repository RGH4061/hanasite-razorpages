# Ticketing System — Plan

A simple internal tool for the sales team to see, claim, and close out
website inquiries. Lives inside the main website (ASP.NET Core / Razor Pages),
behind a login.

## What it solves
Today, contact form submissions land in a marketing inbox, get forwarded to
the marketing director, and from there are distributed to the right
salesperson. One promising inquiry was missed in this chain. Spam volume
adds noise. The system needs to make sure every inquiry is **seen,
claimed, and accounted for**, with a clear record of who responded and
where it was routed.

---

## How it fits with the website

**Recommendation: build it as part of the same ASP.NET Core project, not a separate app.**

Why:
- The two contact forms are already on the website. The form posts
  directly into the same database the ticketing pages read from — no
  forwarding, no email parsing, no integration risk.
- One thing to host, one thing to deploy, one set of users.
- Same C# / Razor Pages stack Rupert is already learning.

The ticketing pages sit under a route like `/admin/tickets/` and require
login. Public visitors never see them.

---

## Forms in scope

Two distinct forms, both flowing into one ticket queue. The ticket list
shows a **Form** column so the team can tell them apart at a glance, and
filter by form type.

### 1. Plant Inquiry (detailed project inquiry)
The "weighty" form — for prospects ready to discuss a project. Existing
website already has a version of this. Fields:
- Standard contact + company + country
- Market + Capability dropdowns
- Estimated volume / value
- Project description

### 2. General Inquiry
The lighter form — for everything else (questions, partnership
conversations, general contact). Shorter form.

Both forms appear on multiple pages (Markets, Capabilities, Locations,
Why Hana, Contact) — the form records *which page it was submitted from*
so the team can see context.

Careers / investor forms are out of scope.

---

## What gets captured per inquiry

**From the visitor (the form):**
- Name
- Company
- Email
- Phone (optional)
- Country
- Message
- **Form type** — Plant Inquiry or General Inquiry (auto-captured from which form)
- Market served (dropdown)
- Capability requested (dropdown)
- Estimated value / volume *(Plant Inquiry only — optional)*
- Source page (auto-captured — e.g. `/capabilities/rfid-inlay/`)
- Submitted at (auto-captured)

**Added by the team in the ticketing system:**
- Status — New / Claimed / Responded / Closed / Spam
- Owner — which salesperson picked it up (auto-set when claimed)
- Routed to — free text conclusion box (e.g. "Lamphun PCBA team",
  "Frank — Germany", "ASSA Abloy China account team")
- Notes — running notes from the salesperson
- Date responded
- Closed at + closed by

---

## Logins and access

**Individual logins for:** Sanjay, Mark, Thang, Rupert.

Built using ASP.NET Core Identity (the framework's built-in login system —
no third-party service, no extra cost). Each person has their own email +
password. Passwords are hashed; no plain-text storage.

**Permissions for v1:** everyone has full edit access. We can add
read-only or admin tiers later if the team grows.

Self-service password reset can come in a later phase — for v1, Rupert (or
whoever has admin access to the database) can reset passwords manually.

---

## The ticket list page

A single table view, by default showing all open tickets, sortable and
filterable by:
- Status
- Owner
- Date submitted
- Source form (Plant Inquiry vs General)

Each row shows: date, name, company, country, source page, status, owner.
Click a row → inquiry detail page.

Default view: **"Unclaimed and open"** so nothing falls through the cracks.

---

## The inquiry detail page

Shows everything submitted by the visitor at the top. Below it:
- **Claim button** → sets Owner = current user, Status = Claimed
- Editable fields: Status, Routed to, Notes, Date responded
- Audit trail: a small log at the bottom showing "Sanjay claimed this on
  2026-05-09" / "Mark added a note" — so the team can see history

---

## Notifications

Three emails in total — two sent instantly on submission, one scheduled.

> **Terminology (decided July 2026):** customer-facing wording is
> **"request"** — what the visitor submits. Internal wording is
> **"inquiry"** — the record the team works. The two instant emails sit on
> opposite sides of that line and are worded accordingly. Website form
> naming is being finalised separately.

### 1. Internal notification (instant)
Sent to the team the moment a form is submitted. Contains the full inquiry
so it can be triaged without logging in, plus a button through to
`/admin/tickets/{id}` to claim it. Reply-To is set to the sender, so
hitting Reply goes straight to them rather than into a dead no-reply box.

Template: `Inquiry Email — Internal Notification.html`

### 2. Customer confirmation (instant)
Sent to the person who filled the form in. Confirms receipt, sets the
one-business-day expectation, and gives them a written copy of what they
sent plus a reference number. Says "request" throughout, never "inquiry".

**Must not send from a `no-reply@` address** — the email invites the
customer to reply with more detail, so replies have to reach a person.
Sender address still to be decided.

Template: `Request Email — Customer Confirmation.html`

### 3. Daily digest (scheduled)
Sent once per day at a fixed time (e.g. 09:00 UK) as a safety net, so
nothing sits unclaimed unnoticed.

Contents: list of new inquiries from the last 24 hours, with a link to the
ticketing page. If there are zero new inquiries, no email is sent.

Implemented as a scheduled background job in ASP.NET Core
(`IHostedService` / `BackgroundService`) — no third-party scheduler needed.

No urgent-escalation rules in v1, per Rupert.

---

## Spam handling

This matters because the missed inquiry may have looked like spam. Two
layers:

1. **Honeypot field** on every form — an invisible field that real users
   leave blank but bots auto-fill. Submissions where the honeypot is
   filled go straight to a hidden Spam queue, not the main list. Free, no
   user friction.

2. **Cloudflare Turnstile** (or Google reCAPTCHA v3) — a challenge that
   most users never see, but blocks the obvious bot traffic. Turnstile is
   free, privacy-friendly, and Hana's preferred option if hosting permits.

Anything that gets through and looks spammy can be marked **Status:
Spam** by the team in one click. We can review the spam queue periodically
in case something legitimate ended up there.

---

## Hosting

To be confirmed by Rupert (likely the same host as the new website).

Most likely path, if the website is going on Azure (typical for
ASP.NET Core):
- **Azure App Service** for the website + ticketing app
- **Azure SQL Database** for storage (or **SQLite** if costs need to stay
  near zero — fine for this scale)
- **Azure SendGrid** or **Microsoft 365 SMTP** for the daily digest email

If the website is going somewhere else (AWS, on-prem, another provider),
the design still works — ASP.NET Core runs anywhere — we just swap the
database and email providers.

---

## GDPR — light but not zero

Rupert's note: "no GDPR concerns at the moment, but please elaborate."

GDPR **does apply** because the system collects and stores personal data
(name, email, phone, company) from UK/EU residents. The good news is that
the obligations for a B2B inquiry system like this are light:

- **Privacy notice on the form** — one short line: "We use your details
  to respond to your inquiry. Stored on our internal system. Email
  [contact] to request deletion." Already standard practice.
- **Data residency** — if hosted in EU/UK Azure region, no transfer
  issues. If hosted elsewhere, we'd need a sentence in the privacy policy.
- **Retention** — keep inquiries for a default period (suggest 24 months),
  then auto-archive or anonymize. Not urgent for v1, but worth deciding now.
- **Right to deletion** — if someone asks to be forgotten, the team needs
  to be able to delete their record. Built into the admin pages from day one.

Nothing here changes the architecture — it's just things to bake into the
forms and database design from the start.

---

## Build phases

### Phase 1 — MVP (the smallest thing that solves the problem)
- Database tables: Inquiries, Users
- ASP.NET Core Identity wired up with the four logins
- Two forms (Plant Inquiry + General) on the website, posting to the database
- `/admin/tickets` list view with filters
- `/admin/tickets/{id}` detail view with claim, notes, status, routed-to
- Honeypot spam protection
- Privacy notice on forms

**Deliverable:** the team can log in, see all inquiries, claim them,
record where they sent each one, and close them out.

### Phase 2 — operational polish
- Daily digest email
- Cloudflare Turnstile / reCAPTCHA
- Spam queue + spam-marking workflow
- Audit log on the detail page (who did what when)
- Service-requested dropdown (list to be defined)

### Phase 3 — nice-to-haves (only if needed)
- Read-only role for visibility-only users
- Simple reporting (inquiries per month, response time, conversion to "routed")
- Email-based password reset
- Archive view for closed tickets older than X months

---

## Decisions confirmed (May 2026)

1. **Hosting** — same site as the new website. The ticketing system is a
   password-protected admin section (`/admin/tickets/`), not a separate app
   or subdomain. Not visible or linked from the public site.
2. **Daily digest recipients** — Thang + Rupert (while Rupert is helping
   get things running). Easy to change later.
3. **Form dropdowns — two separate dropdowns on every form:**
   - **Capability requested** (mapped to website Capabilities):
     - PCBA & Box Build
     - IC Assembly & Test (OSAT)
     - RFID & Smart Tags
     - Sensors & Optical
     - Power Solutions
     - DFM / NPI support
     - Other
   - **Market served** (mapped to website Markets):
     - Automotive
     - Industrial & IoT
     - Telecommunications
     - RFID
     - Optical & Sensors
     - Consumer Electronics
     - Medical
     - Access Control
     - Power Management
     - Other

   Both dropdowns are also filters on the admin ticket list, so the team
   can quickly slice "all RFID inquiries" or "all Automotive PCBA leads".
4. **Retention period** — 24 months. After that, records are auto-archived.
5. **No file uploads (July 2026)** — neither form accepts attachments.
   Supporting documents (BOM, drawings, specs, gerbers) are requested by
   email once a salesperson picks the inquiry up. This removes the upload
   handling, virus scanning, and file storage work from the build entirely.
6. **Privacy contact** — `info-request@hanaus.com`. One-line privacy notice
   on every form: *"We use your details to respond to your inquiry. Stored
   on our internal system. Email info-request@hanaus.com to request
   deletion."* A delete button is built into the admin detail page from
   day one.

## Visual design

Two static HTML mockups have been built and are in this folder. Open either
in a browser to preview — no server needed, they're self-contained.

### Admin Page Mockup.html
The internal ticketing list view (`/admin/tickets/`). Key details:

- **Layout:** 7-column grid — Date, Form type, Name, Company/message preview,
  Source page, Status, Owner. Each row is clickable to expand an inline
  detail panel (no separate page needed for the mockup).
- **Expand panel:** left side shows message body + source page; right sidebar
  shows full contact details + action buttons (Claim, View, Mark as Spam).
- **Form type pill:** Plant Inquiry = dark navy pill; General Inquiry = light
  grey pill. Visible on every row so the team can tell them apart at a glance.
- **Three sections:** Open tickets (default view), Closed inquiries
  (collapsible), Spam (separate collapsible, muted styling). Spam is kept
  separate from Closed so real opportunities stay clean.
- **Status colors:** New = red, Claimed = amber, Responded = Hana Blue Soft,
  Closed = green, Spam = neutral grey.
- **Row actions:** expand/collapse toggle (▸/▾) + ··· context menu dropdown
  with Mark as Spam. Spam rows animate out on click.
- **Styling:** Hana brand palette throughout. White topbar, logo directly on
  white (transparent PNG). Geist for headings, Inter for body/buttons,
  IBM Plex Mono for dates and data values.

### Plant Inquiry Form Mockup.html
The public-facing detailed (Plant Inquiry) form. Key details:

- **Cards layout:** each section (Contact Details, Address, Market &
  Capability, Project Details, Submit) is a white card with a blue Geist
  uppercase section label.
- **Contact Details:** Name + Position, Company + Company website, Email +
  Phone — all in two-column pairs. Required fields marked with `*`.
- **Address:** compressed to two rows — Address + City (2-col), then
  State/Province + Zip/Postal code + Country (3-col). All optional except
  Country.
- **Market & Capability:** side-by-side collapsed toggle dropdowns. Each
  expands to reveal pill chip multi-selects. Count badge shows how many are
  selected. Both support multiple selections.
- **Project Details:** Description (full-width textarea, required) +
  Estimated quantities + Estimated start date (2-col, both optional).
- **Submit:** reCAPTCHA mock + one-line privacy notice + Submit Inquiry
  button — all in one card to minimize vertical footprint.
- **Privacy notice:** "We use your details to respond to your inquiry. Stored
  on our internal system. Email info-request@hanaus.com to request deletion."
- **reCAPTCHA:** shown as a mock visual. Swap in the real Google script +
  site key when building the live form.
- **Styling:** same brand palette and fonts as the admin mockup.

### General Inquiry Form Mockup.html
The public-facing general contact form. Same structure as the Plant Inquiry but
stripped back — no project details, no quantities.

- Same Contact Details and Address sections as the Plant Inquiry form
- Market & Capability toggles present but optional (no asterisk) — useful
  context but not required for a general question
- Single "Your message" card with a required textarea replacing the project
  details section
- Submit card: reCAPTCHA + privacy notice + "Send Inquiry" button

### Inquiry Email — Internal Notification.html
The instant notification to the team. Dense triage readout — navy alert strip
with the form-type pill, two-column contact grid, market/capability chips,
message body, then a "View & claim this inquiry" button through to the ticket.
Footer line confirms a confirmation has already gone to the customer.

### Request Email — Customer Confirmation.html
The instant confirmation to the person who submitted. Deliberately lighter and
warmer than the internal one — soft blue tint hero instead of the navy alert
strip, a three-step "What happens next", a muted recap card of what they sent
with a reference number, and a short company line. No ticket link, no status,
no internal data. Customer-facing, so it says "request" throughout.

**Both email templates:** table-based layout with inline styles throughout.
This looks dated next to the form mockups, and is deliberate — Outlook renders
HTML through Microsoft Word, which ignores `<style>` blocks and modern CSS
layout. Placeholders are `{{double_brace}}`; the logo needs a hosted URL, not
a local file path. Verified at desktop and mobile widths.

### Still to design
- Inquiry detail page (`/admin/tickets/{id}`) — full record view with claim,
  notes, status, routed-to, and audit trail
- Daily digest email template

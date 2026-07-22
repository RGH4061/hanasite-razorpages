# IR Admin — Plan

A self-serve tool for the Investor Relations / finance team to publish investor
news, events and reports to the website themselves. Lives inside the main
website (ASP.NET Core / Razor Pages), behind a login — the same pattern and the
same set of accounts as the ticketing system and Careers Admin.

## What it solves

Investor Relations is the fastest-moving section of the site. Careers gets a
handful of new roles a month; IR gets SET announcements, press releases,
quarterly financial statements, MD&A, investor presentations, analyst meeting
dates, Opportunity Day recordings and the annual report — much of it on a
regulatory clock. Some of it has to appear on the website the same day it is
filed with the Stock Exchange of Thailand.

None of that can wait behind a developer or behind Hana EU. This tool puts the
people who already produce those documents in direct control of publishing them.

---

## Scope — four sections

**In scope:**

| Section | Public page | Why it's in |
|---|---|---|
| Investor News | `/investor-relations/investor-news` | SET announcements, press releases, quarterly financial information — the highest-volume page on the site |
| Investor Events | `/investor-relations/events-contact` (events half) | Analyst meetings and SET Opportunity Days — dates change every quarter |
| Reports | `/investor-relations/annual-report` | Annual Report and 56-1 One Report, plus their supporting files |
| FAQ & Presentations | `/investor-relations/faq` | Updated quarterly — each Opportunity Day adds a video, summary and transcript (Rupert, July 2026) |

**Explicitly out of scope** — these change once a year or less, and a developer
edit is cheaper than a form:

- Governance documents (`/investor-relations/governance-documents`)
- Sustainability (`/investor-relations/sustainability`)
- Group structure & shareholders (`/investor-relations/group-structure-shareholders`)
- The IR contact details on the events page — names, emails and the registered
  office. These almost never change.

If any of those turn out to move more than expected, they slot into the same
document model later without a rebuild.

---

## How it fits with the website

Same ASP.NET Core project as the website, the ticketing system and Careers
Admin. Documents and events live in the website's database; the public IR pages
read from it on each request. Pressing **Publish** puts a file on the site
within seconds, with no developer step and no deployment.

Admin pages sit under `/admin/ir/` and require login.

---

## The content model — one document, many files

This is the one place where IR Admin is genuinely different from Careers Admin,
and it is worth getting right.

A job listing is a single thing. An IR item usually is not. "Annual Report 2025"
is really a set of files: the English report, the Thai report, the 56-1 One
Report, sometimes the financial statements as a separate PDF. "Q1 2026 results"
is the statement, the MD&A, and the investor presentation deck.

So the model is:

**One record = one item as an investor thinks about it.**
**Each record holds any number of attachments.**

Each attachment carries its own label, language, file type and file size — which
is exactly what the wireframes already display next to the download button. Add
a row, choose the file, name it. No limit, no fixed slots.

That means when finance are handed six files after a board meeting, they create
one record and attach six files, rather than creating six near-identical entries.

---

## 1 · News items

Covers all three sections of the Investor News page. The subsection is a
dropdown, so the same form serves all of them.

**Entered by finance:**
- Type — a dropdown with exactly three options, matching the three sections on
  the public page:
  - **SET Announcement**
  - **Press Release & Financial News**
  - **Financial Information**
- Title
- Document date
- Period — e.g. Q2 2026, FY 2025. This field only appears when the type is
  Financial Information, since that is the only section with a Period column.
- Summary — one line, optional
- Attachments — one or more files, each with a label and language

**Set automatically:**
- Year — from the document date. This is what drives the year selector in the
  sidebar and the per-year document counts, so nobody maintains those by hand.
- File type and file size badges, read from each uploaded file
- "Page updated" date on the page

---

## 2 · Events

**Entered by finance:**
- Event kind — Analyst Meeting / SET Opportunity Day
- Title — e.g. "Q2/2026 Results"
- Date, or **Date to be confirmed** tick box
- Start and end time
- Format — Online / In person / Hybrid
- Link (optional) — join link, SET recording, or materials
- Attachments (optional) — presentation deck, materials pack

**Set automatically:**
- Status pill — Upcoming / Past / To be confirmed, computed by comparing the
  event date to today. Nobody has to remember to move a meeting to "past".
- Which action button shows, based on kind and status

This removes the whole class of problem where the IR page still advertises a
meeting that happened in March.

---

## 3 · Reports

Annual Report and 56-1 One Report. Low volume — a handful of records a year —
but the most visible, and the only ones with a cover image.

**Entered by finance:**
- Report type — Annual Report / 56-1 One Report
- Year
- Title and short description
- Cover thumbnail — see below
- Attachments — one or more files, each labelled and language-tagged

**Set automatically:**
- Position in the report grid, newest first
- File type and size badges

---

## 4 · Presentations & FAQs

The FAQ & Presentations page has two halves, and only one of them moves.

### Presentations — quarterly

Every SET Opportunity Day adds a presentation record. The newest one gets the
featured treatment on the page (video, key takeaways, and a tabbed summary /
transcript pane); older ones drop back to cards automatically, so nobody has to
demote last quarter's by hand.

**Entered by finance:**
- Period — e.g. Q1 2026
- Event kind — SET Opportunity Day / Analyst Meeting
- Presentation date
- **YouTube link** — see below
- Key takeaways — one per line, becomes the always-visible bullet list
- Full summary — the longer editorial summary
- Transcript — long text, with a Thai field alongside the English
- Attachments — the deck as PDF, transcript PDF, anything else

**Set automatically:**
- The embedded video player, built from the YouTube link
- The video thumbnail, taken from YouTube
- Which record is featured (newest) and which become cards
- `VideoObject` + transcript schema markup

Two things carry over from the wireframe decisions and are worth keeping in
front of whoever uses this: transcripts are published **verbatim**, and the
editorial summary has **customer names removed** — the same content rule that
applies everywhere else on the site. The form carries that as a note above the
summary field rather than relying on memory.

### The video — one pasted YouTube link

The Opportunity Day recordings are on YouTube, so the form takes a single
field: paste the ordinary link from the browser address bar.

Any of the usual forms work — `youtube.com/watch?v=…`, the short `youtu.be/…`,
or a link copied with a start time on it. The system pulls the video ID out of
whatever is pasted and builds the embed itself, so nobody has to find an
"embed code" or handle any HTML.

**The thumbnail comes with it.** YouTube already holds a still image for every
video, so the picture shown before the video plays is fetched automatically —
no upload step at all. An override field exists for the occasional case where
YouTube's auto-chosen frame is a poor one, but it should rarely be needed.
(This is the opposite way round from annual reports, where the upload is the
main route and the auto-render is the fallback.)

Two build notes for the developer:

- Embed through `youtube-nocookie.com` rather than the standard embed, so the
  page sets no YouTube cookie until a visitor actually presses play. That keeps
  the video out of the cookie-consent problem.
- The preview in the form should show the real thumbnail as soon as the link is
  pasted. That is the check that the right video has been linked — far more
  reliable than reading a URL back.

*Note for the public page:* the FAQ & Presentations wireframe currently
describes these as SET embeds with a "View on SET ↗" link. That wants updating
to YouTube on the wireframe as well — same layout, different source.

### FAQs — occasional

A simple list: question, answer, and which of the three categories it belongs
to, with drag-to-reorder. These change rarely, but they live on the same page
and cost almost nothing to include once the rest is built. Powers the
`FAQPage` schema, which is the AEO reason the page exists.

---

## Thumbnails for annual reports

The annual report page shows a grid of report cards, each with a cover image.
Those covers are currently placeholders.

**How it works in the form:** an *upload cover image* field, shown only for
report records. Recommended size is displayed next to the field, and the
uploaded image is cropped and resized on the server so a large scan doesn't slow
the page down. A preview appears immediately so the person uploading can see the
card as visitors will.

**If no cover is uploaded:** the system renders page 1 of the first PDF
attachment and uses that. This is a genuinely small addition — one PDF library
on the server — and it means a report is never sitting on the live site with a
grey placeholder because someone was in a hurry. The upload field then becomes
an override for when the report's own cover page isn't the right image.

*Recommendation: build the auto-render. It costs very little and removes the
one step most likely to get skipped.* If it turns out to be awkward, the manual
upload alone is a complete solution and the page still works.

---

## Scheduled publishing — the IR-specific requirement

Careers Admin publishes instantly and that is fine. IR needs one more option.

Results and SET announcements often cannot appear on the website before they
are disclosed to the Exchange, and they are frequently prepared the day before.
So every record gets a **Publish now** or **Publish at** choice, with a date and
time. Until that moment the record is invisible to the public site; at that
moment it appears on its own, with no one needing to be at a desk.

This is the single most useful thing in the tool for a finance team working to
a disclosure calendar, and it is a small build — one date field and one check on
the public query.

---

## One login, three tools — not three logins

There are now three admin tools in the same website: tickets (`/admin/tickets/`),
careers (`/admin/jobs/`) and this one (`/admin/ir/`). They serve different
people, and the separation matters — HR have no business in SET filings, and
the IR team should not be able to open candidate applications.

That separation is a **permissions** question, not a login question. The two get
confused easily, so to be explicit:

**One login page for the whole admin area.** One account per person. After
signing in, you see only the tools you have a role for. Someone with a single
role lands straight in that tool and never learns the others exist; a direct
link to a tool they don't have returns "not found", not a password prompt.

Roles are per tool — Tickets, Careers, IR — and a person can hold one, two or
all three. Thang and Rupert hold all three; the Bangkok IR team hold IR only;
the HR teams hold Careers only.

**Why not three login pages:**

- Rupert and Thang are in all three. Three login pages means three passwords, or
  the same password entered in three places — which is worse, not better.
- **Offboarding.** When someone leaves, there is one account to disable. With
  three separate logins, the one everybody forgets is the one that stays live.
- Password resets, lockout, and two-factor get built and tested once instead of
  three times, and cannot drift out of step.
- It is one ASP.NET Core application. Three login systems inside one app is more
  code doing the same job, not stronger security.

Separate login pages would look like separation while providing none: the same
Identity database sits behind all three either way. What actually keeps HR out
of the IR files is the role check on the page, and that works identically
whether there is one login page or three.

**What the user sees:** the tool name in the top bar (as in the mockups —
"Investor Relations", "Job Listings"), and a switcher beside it listing only the
tools that person can reach. If they can only reach one, no switcher appears.

*Separate point, easily confused with this one:* which **notification emails**
go where — a new inquiry to sales, a new application to HR — is per-tool
configuration and has nothing to do with how people sign in.

### What an account actually is, and who builds it

Nothing custom. ASP.NET Core Identity ships this out of the box — three tables:

- **Users** — email, hashed password, active or not
- **Roles** — three rows: `Tickets`, `Careers`, `IR`
- **UserRoles** — which people hold which roles. This table *is* the permissions;
  a person's access is simply which of the three they appear in.

Password hashing, lockout after failed attempts, and password reset come with
the framework. **The developer builds all of this. It is not something to design
or specify beyond the list of people.**

**Decision needed: is there a screen for managing users?**

- **No screen (recommended for launch).** The developer adds an account when
  someone joins — a couple of minutes, documented so any developer can do it.
  Across all three tools this is perhaps eight to twelve people, changing maybe
  twice a year. Building a whole administration screen to do something twice a
  year is the same over-engineering the Indeed feed decision avoided.
- **A user screen (later, if needed).** A fourth admin section: a list of people,
  three tick boxes each, add and deactivate. Worth building only once account
  changes become frequent enough to be annoying, or once someone in IT rather
  than the developer should be doing them.

The honest cost of deferring: Rupert cannot add a user himself — it is an email
to the developer. At this volume that is the cheaper trade.

**Deactivate, never delete.** The audit line on each item names who published it.
Deleting a user orphans that history; marking the account inactive keeps it
readable and stops the login working, which is the actual requirement.

**What Rupert supplies:** a list of names, email addresses, and which of the
three tools each person needs — a short table, not a design. Plus the rule for
who tells the developer when somebody leaves.

---

## Logins and access

Built on ASP.NET Core Identity, the same accounts as the ticketing system and
Careers Admin.

Users: the Corporate Affairs / IR team in Bangkok (the two named contacts on the
current IR contact page), plus whoever in finance prepares the quarterly files,
plus Rupert and Thang for oversight.

**Approval step — this one deserves a different answer to Careers.** In Careers
Admin, publish-goes-live-immediately was the right call: low stakes, four HR
teams, a typo is embarrassing and nothing more. IR content is filed material for
a listed company. A wrong figure on hanagroup.com is a different category of
problem.

Two ways to handle it, and this is a decision for Rupert and IR, not a technical
one:

1. **No approval, restricted access** — only two or three trusted IR people have
   accounts at all. Same as Careers. Simplest.
2. **Two roles** — *contributor* can prepare and attach, *publisher* can push
   live. Costs perhaps a day of build.

*Recommendation: option 1, on the grounds that the people producing these
documents are already the people accountable for them, and that scheduled
publishing plus draft/preview covers the realistic mistakes.* But option 2 is
cheap here, and unlike Careers, it is defensible.

---

## The list pages

Four tabs at `/admin/ir/` — **News**, **Events**, **Reports** and
**Presentations** — because they have genuinely different columns and four
focused tables are easier to scan than one merged one.

- **News:** title, type, date, year, attachment count, status, actions.
  Filters for type and year, plus a search box.
- **Events:** title, kind, date, time, computed status, actions. Upcoming
  events pinned to the top.
- **Reports:** year, type, cover thumbnail, attachment count, status, actions.
- **Presentations:** period, kind, date, thumbnail, whether the summary and
  transcript are filled in, featured marker, status, actions. FAQs sit on the
  same tab as a short second table.

Status colours match Careers Admin: Live = green, Scheduled = blue,
Draft = grey, Archived = red.

---

## The edit page

One form, three variants driven by which tab you came from. Sections:

1. **Item details** — the type-specific fields above
2. **Attachments** — the repeatable file block, with drag-to-reorder, a label
   and language per file, and the auto-detected type and size shown greyed out
3. **Cover image** — reports only
4. **Publishing** — publish now or publish at, plus **Preview** which shows the
   public page exactly as it will look

Actions: **Publish**, **Save as draft**, **Preview**. Drafts autosave. An audit
line records who published or edited an item and when — worth more here than in
Careers, given the material.

### Editing something already published

**Edit opens the same form the item was created in, filled in.** There is no
separate editing screen to learn — the difference is what surrounds the fields:

- A bar across the top naming the item, its current status, when it was
  published and by whom, and a link to view it on the live site.
- The publish controls disappear, because the item is already public. In their
  place: **Save changes**, **Preview**, **Unpublish**, **Archive**.
- **Save changes updates the live page immediately.** No second step. Adding a
  file to a published record works the same way — it appears as a new download
  button as soon as you save.
- **Unpublish** takes it off the page but keeps the record, for when something
  needs correcting properly rather than in place.
- **Archive** retires an item without destroying it.

A record still in draft behaves differently: editing it keeps the publish
controls, because it has never been public.

**Recommendation: no hard delete anywhere in this tool.** Archive removes an
item from the page and from view; the record and its files stay in the
database. For SET filings and financial statements, being able to show what was
published and when is worth more than tidiness, and an accidental permanent
deletion of a filed document is a bad afternoon. If a genuine delete is ever
needed, it should be a developer action, not a button.

---

## What the system maintains on its own

Everything on the public IR pages that would otherwise be someone's job to
remember:

- The **year selector** on Investor News, and the document counts beside each
  year and section
- The **event status pills**, from the date
- The **"Page updated"** date in the subbar of each page
- **File type and size** badges on every download
- The **report grid order**, newest first
- **Schema markup** — `CollectionPage` item lists on Investor News, `Event`
  items on the events page — regenerated as records change, so the structured
  data never goes stale relative to the visible page

---

## Data protection

Materially lighter than Careers Admin. Everything published here is public
disclosure material by definition, and the only personal data involved is the
IR team's own business contact details, which are already on the live site.

The real risk is not privacy but **premature disclosure** — a file going live
before it should. That is what scheduled publishing and the draft state exist
to prevent.

One practical note: uploaded files should be stored outside the web root and
served through a controller, so a draft PDF cannot be reached by guessing its
URL before it is published.

---

## Storage

Annual reports run to tens of megabytes. A year of quarterly filings, MD&A,
presentations and press releases in both languages adds up faster than job
listings ever will, and the archive goes back to 2020.

Nothing complicated is needed — but the hosting conversation should include
document storage and a sensible upload size limit (say 50 MB per file), rather
than discovering the limit when someone tries to upload the annual report.

---

## Build phases

### Phase 1 — MVP
- Database tables: IrDocuments, IrAttachments, IrEvents, IrPresentations, IrFaqs
  (Users already exist)
- `/admin/ir/` list views with the four tabs and filters
- Create and edit forms for news, events, reports and presentations
- Repeatable attachments with label, language, auto type and size
- Cover image upload for reports, thumbnail upload for presentations
- Draft / publish / schedule / preview
- Public Investor News, Events, Annual Report and FAQ & Presentations pages
  reading from the database
- Automatic year selector, counts, event status, featured presentation and
  page-updated dates

**Deliverable:** the IR and finance team can publish everything on those four
pages themselves, on the day it is needed, including out of hours.

### Phase 2 — polish
- Auto-render of the PDF first page as a fallback report cover
- Audit log surfaced on the edit page
- Contributor / publisher roles, if that decision goes that way
- Bulk upload — drop ten files, get ten draft records to title
- Schema markup regeneration

### Phase 3 — only if needed
- Governance documents and the remaining IR pages folded into the same model
- Email alert to a subscriber list when a new item publishes
- Thai-language field pairs rather than language-tagged attachments

---

## Decisions confirmed (July 2026)

1. **FAQ & Presentations is in scope** — it updates quarterly, so it gets a
   form like the other three.
2. **Build the PDF first-page auto-render** as the fallback report cover, with
   manual upload as the override.
3. **Thai and English are two attachments on one record**, not two records —
   matching how the files actually arrive from the translators.
4. **SET announcements are typed in manually.** No feed integration with the SET
   disclosure system, for the same reason Careers has no Indeed feed: it is a
   few minutes per item against a build that has to be maintained.
5. **One record, many attachments** is the data model throughout.
6. **Scheduled publishing** ("publish at") is in Phase 1, not a later addition.

## Open questions

- **How many accounts, and who** — Rupert is confirming with IR / finance
  (July 2026). This also settles the approval question below.
- **Approval step or not.** Still open, and it follows from the account count:
  with two or three trusted uploaders, no approval step is the right call and
  matches Careers Admin. If the list runs to six or eight people, the
  contributor / publisher split becomes worth the day it costs.
- **How far back the archive goes** — the wireframe floors at 2020. Someone has
  to load the back catalogue once; worth confirming the cut-off before that
  work starts.

---

## Visual design

`IR Admin Mockup.html` is in this folder — open it in a browser, it is
self-contained and needs no server. Same palette, fonts and components as the
Careers Admin and ticketing system mockups, so the three read as one tool.

Seven screens on tabs: the four list views (News, Events, Reports,
Presentations) and three forms.

- **News form** — the one used most. The three-option type dropdown, document
  date with the year filled in automatically beside it, the Period field that
  appears only for Financial Information, four attachments including a Thai one,
  and scheduled publishing set to a go-live time.
- **Report form** — adds the cover thumbnail, with both preview states shown
  side by side.
- **Presentation form** — the quarterly one: the pasted YouTube link with its
  thumbnail preview, key takeaways, summary, and the English / Thai transcript
  pair.

Between them they cover every component. The event form is the only one not
drawn — it is the news form with date, time and format in place of attachments,
so event rows in the mockup open the news form instead.

**The list rows are live.** Clicking any row, or its Edit button, opens that
record in its form — filled in, with the edit bar at the top and the publish
controls swapped for save / unpublish / archive. Try the draft row in the news
list to see the difference: a draft keeps its publish controls, because it has
never been public.

## Still to design

- The event form (news form, with date / time / format instead of attachments)
- Whether the transcript field needs a rich-text editor or plain text is enough
- Updating the public FAQ & Presentations wireframe from SET embeds to YouTube

# Email copy — both templates

Every piece of visible text in the two email templates, in the order it appears.
Edit here, and the changes get applied back into the HTML.

`{{double_brace}}` items are filled in automatically from the submitted form —
leave the braces alone, but the words around them are yours to change.

---

# 1. Internal notification

Goes to the Hana team. Internal wording — says **inquiry**.

### Subject line
```
New {{form_type}} — {{company}} ({{country}})
```

### Preheader (grey preview text in the inbox list)
```
{{name}} at {{company}} · {{market}} / {{capability}} · submitted from {{source_page}}
```

### Header
| Location | Text |
|---|---|
| Top right | `Internal · Website Inquiry` |

### Alert strip
| Location | Text |
|---|---|
| Pill | `{{form_type}}` |
| Headline | `New inquiry received` |
| Line 1 | `{{submitted_at}}` |
| Line 2 | `Submitted from {{source_page}}` |

### Section labels and fields
| Location | Text |
|---|---|
| Section label | `Contact details` |
| Field labels | `Name` · `Company` · `Email` · `Phone` · `Country` · `Est. volume / value` |
| Section label | `Market & capability` |
| Field labels | `Market served` · `Capability requested` |
| Section label | `Project description` *(use `Message` for the general form)* |

### Buttons and links
| Location | Text |
|---|---|
| Primary button | `View & claim this inquiry →` |
| Status line | `Status New · Unclaimed · Ref {{ticket_ref}}` |
| Secondary link | `Open the ticketing hub →` |

### Footer
```
Automated notification from the hanagroup.com inquiry forms.
Replying to this email goes directly to {{name}} at {{company}}.
A confirmation has already been sent to the customer.
```

---

# 2. Customer confirmation

Goes to the person who submitted the form. Customer-facing — says **request**.
This is the first thing a prospect ever receives from Hana.

### Subject line
```
We've received your request — Hana Microelectronics
```

### Preheader (grey preview text in the inbox list)
```
Thanks for getting in touch. We'll route your request to the right team and reply within one business day.
```

### Hero
| Location | Text |
|---|---|
| Headline | `Thanks for getting in touch` |


### Opening
```
Hi {{first_name}},

Thank you for contacting Hana Microelectronics. Your request has been received by our team, and we'll make sure it reaches the correct channels to help —
whether that's a specific Hana site, a technical process specialist, or one of our
sales offices.
```

### What happens next
Section label: `What happens next`

**Step 1**
```
We review and route your enquiry to the suitable team or any named persons in your enquiry.
```

**Step 2**
```
A member of our team will respond and request any required details (e.g. RFQ material)
```
**Step 3**
```
Schedule an introduction call or emailed response to speak.
```

### Recap card
| Location | Text |
|---|---|
| Section label | `A copy of what you sent` |
| Field labels | `Name` · `Company` · `Email` · `Country` · `Market` · `Service` |
| Message label | `Your message` *(use `Project description` for the detailed form)* |
| Below the card | `Reference {{ticket_ref}} — quote this if you need to follow up.` |

### Sign-off
```
If anything changes in the meantime, or you have more detail to add, just reply
to this email and it will reach the same team.

Best regards,
The team at Hana Microelectronics
```

### Company strip (navy band)
```
Link: Visit `hanagroup.com →`

### Footer
```
You're receiving this because you submitted a request on hanagroup.com. We use
your details only to respond to your request and do not share them with third
parties. Email info-request@hanaus.com to request deletion, or read our privacy
policy.
```

---

## Notes on editing

- **Keep the two vocabularies separate.** The internal email says *inquiry*; the
  customer email says *request*. That split is deliberate.
- **American English** — inquiry, color, organize.
- **Brand voice** — no exclamation marks, no emoji, no "get a quote today". Avoid
  "world-class", "cutting-edge", "seamless", "solutions provider", "no handoffs".
- **The one-business-day promise appears twice** in the customer email (preheader
  and Step 2). Change both together, and make sure the team can actually meet it —
  the Plant form mockup currently promises *two* business days, which needs
  reconciling.
- **Company strip** omits Korea deliberately; it's peripheral to the EMS story.
  Solon, Ohio runs its own site, so "United States" covers it without linking out.

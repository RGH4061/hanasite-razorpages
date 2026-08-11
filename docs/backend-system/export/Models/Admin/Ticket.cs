namespace HanaSite.Models.Admin
{
    /// <summary>
    /// A single website inquiry (internal term). Customer-facing forms call
    /// these "requests"; inside the admin tool they are "inquiries".
    /// No file attachments exist anywhere — the forms take no uploads.
    /// </summary>
    public class Ticket
    {
        public string Id { get; set; } = "";

        // new | claimed | responded | closed | spam
        public string Status { get; set; } = "new";

        public string Date { get; set; } = "";   // yyyy-MM-dd
        public string Time { get; set; } = "";    // HH:mm

        public string Name { get; set; } = "";
        public string Company { get; set; } = "";
        public string Market { get; set; } = "";
        public string Service { get; set; } = "";
        public string Reason { get; set; } = "";
        public string Source { get; set; } = "";  // originating page path

        // customer | supplier — supplier/vendor offers sit in their own queue
        public string Kind { get; set; } = "customer";

        public string? Owner { get; set; }

        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Address { get; set; } = "";
        public string Message { get; set; } = "";

        // Closed-only
        public string? ClosedDate { get; set; }
        public string? ClosedBy { get; set; }
        public string? RoutedTo { get; set; }

        // Assignment notification — set when the summary email is sent
        public string? NotifiedName { get; set; }
        public string? NotifiedEmail { get; set; }
        public string? NotifiedAt { get; set; }     // yyyy-MM-dd HH:mm
        public string? NotifiedSubject { get; set; }

        public bool WasNotified => !string.IsNullOrEmpty(NotifiedEmail);

        // Spam-only
        public string? SpamDate { get; set; }
        public string? FlaggedBy { get; set; }
        public bool Auto { get; set; }
        public string? Footer { get; set; }

        // ── Derived helpers for the view ──────────────────────
        public bool IsOpen => Status is "new" or "claimed" or "responded";

        public bool IsSupplier => Kind == "supplier";

        // Which open-inquiry tab this ticket belongs to. Sales & support is
        // the catch-all: sales, customer support, capability and technical
        // questions, "other", and inquiries submitted without a reason.
        public string Bucket =>
            IsSupplier || Reason == "Supplier / vendor inquiry" ? "supplier" :
            Reason == "Investor relations" ? "ir" :
            Reason == "Careers" ? "careers" : "sales";

        public string StatusLabel => Status switch
        {
            "new" => "New",
            "claimed" => "Claimed",
            "responded" => "Responded",
            "closed" => "Closed",
            "spam" => "Spam",
            _ => Status
        };

        public string OwnerDisplay => Status switch
        {
            "closed" => RoutedTo ?? "—",
            "spam" => FlaggedBy ?? "—",
            _ => string.IsNullOrEmpty(Owner) ? "— unassigned —" : Owner
        };

        public string HaystackLower =>
            (Name + " " + Company + " " + Message + " " + Email).ToLowerInvariant();
    }
}

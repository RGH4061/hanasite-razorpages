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

        public string? Owner { get; set; }

        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Address { get; set; } = "";
        public string Message { get; set; } = "";

        // Closed-only
        public string? ClosedDate { get; set; }
        public string? ClosedBy { get; set; }
        public string? RoutedTo { get; set; }

        // Spam-only
        public string? SpamDate { get; set; }
        public string? FlaggedBy { get; set; }
        public bool Auto { get; set; }
        public string? Footer { get; set; }

        // ── Derived helpers for the view ──────────────────────
        public bool IsOpen => Status is "new" or "claimed" or "responded";

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

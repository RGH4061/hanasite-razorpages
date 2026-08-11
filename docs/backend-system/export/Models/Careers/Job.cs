using System;

namespace HanaSite.Models.Careers
{
    /// <summary>
    /// One job listing. Status is derived from the closing date and whether the
    /// role has been published, so an expired role comes off the public careers
    /// page without anyone touching it.
    /// </summary>
    public class Job
    {
        public string Id { get; set; } = "";

        public string Title { get; set; } = "";
        public string Reference { get; set; } = "";     // AYT-ENG-0143
        public string Plant { get; set; } = "";
        public string Department { get; set; } = "";
        public string EmploymentType { get; set; } = "Full time";

        public string About { get; set; } = "";
        public string Responsibilities { get; set; } = "";  // one per line
        public string Requirements { get; set; } = "";      // one per line

        public string? Closes { get; set; }             // yyyy-MM-dd, null for drafts
        public string? Posted { get; set; }             // display date
        public bool Published { get; set; }

        public int Applications { get; set; }
        public string Slug { get; set; } = "";

        public System.Collections.Generic.List<JobLink> Links { get; set; } = new();

        // Audit — shown on the edit form.
        public string? PublishedBy { get; set; }
        public string? CreatedBy { get; set; }

        /// <summary>live | closing | draft | expired</summary>
        public string Status
        {
            get
            {
                if (!Published) return "draft";
                if (string.IsNullOrEmpty(Closes)) return "live";
                if (!DateTime.TryParse(Closes, out var d)) return "live";
                var days = (d.Date - Today).TotalDays;
                if (days < 0) return "expired";
                return days < 7 ? "closing" : "live";
            }
        }

        // Prototype clock. On merge, use DateTime.Today.
        public static DateTime Today { get; set; } = new DateTime(2026, 7, 20);

        public string StatusLabel => Status switch
        {
            "live" => "Live",
            "closing" => "Closing soon",
            "draft" => "Draft",
            "expired" => "Expired",
            _ => Status
        };

        public bool IsLive => Status is "live" or "closing";

        public string ClosesDisplay => string.IsNullOrEmpty(Closes) ? "—" : Closes;
        public string ApplicationsDisplay => Status == "draft" ? "—" : Applications.ToString();

        public string PublicUrl => "hanagroup.com/careers/jobs/" + Slug + "/";

        public string HaystackLower =>
            (Title + " " + Reference + " " + Department + " " + Plant).ToLowerInvariant();
    }

    public class JobLink
    {
        public string Board { get; set; } = "Indeed";
        public string Url { get; set; } = "";
    }
}

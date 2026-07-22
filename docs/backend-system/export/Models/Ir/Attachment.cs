using System.Collections.Generic;

namespace HanaSite.Models.Ir
{
    /// <summary>
    /// A file attached to an IR record (report, news item, presentation).
    /// One record can carry many — English + Thai + statements — each shown
    /// as a separate download button on the live page. No uploads elsewhere.
    /// </summary>
    public class Attachment
    {
        public string Label { get; set; } = "";
        public string Language { get; set; } = "English"; // English | ไทย (Thai) | Bilingual
        public string FileName { get; set; } = "";
        public string Meta { get; set; } = "—";           // "PDF · 1.2 MB"
        public bool HasFile => !string.IsNullOrEmpty(FileName);
    }

    /// <summary>Publishing state shared across all IR record types.</summary>
    public enum IrStatus { Live, Scheduled, Draft, Archived, ToBeConfirmed }

    public static class IrStatusExtensions
    {
        // CSS suffix used by ir-admin.css (.ir-pill--x / .ir-row--x).
        public static string Css(this IrStatus s) => s switch
        {
            IrStatus.Live => "live",
            IrStatus.Scheduled => "sched",
            IrStatus.Draft => "draft",
            IrStatus.Archived => "archived",
            IrStatus.ToBeConfirmed => "tbc",
            _ => "draft"
        };

        public static string Label(this IrStatus s) => s switch
        {
            IrStatus.Live => "Live",
            IrStatus.Scheduled => "Scheduled",
            IrStatus.Draft => "Draft",
            IrStatus.Archived => "Past",
            IrStatus.ToBeConfirmed => "To be confirmed",
            _ => "Draft"
        };

        public static bool IsPublic(this IrStatus s) => s is IrStatus.Live or IrStatus.Archived;
    }
}

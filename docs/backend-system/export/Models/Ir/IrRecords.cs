using System.Collections.Generic;

namespace HanaSite.Models.Ir
{
    /// <summary>An investor-news item — SET announcement, press release, or
    /// financial information. Filed under a year derived from DocumentDate.</summary>
    public class NewsItem
    {
        public string Id { get; set; } = "";
        public string Title { get; set; } = "";
        public string TitleTh { get; set; } = "";
        public string? Subtitle { get; set; }
        public string? SubtitleTh { get; set; }
        public string Type { get; set; } = "set";        // set | press | fin
        public string DocumentDate { get; set; } = "";    // display string, e.g. "14 Jul 2026"
        public string? Period { get; set; }               // Financial Information only
        public string? SourceUrl { get; set; }
        public IrStatus Status { get; set; } = IrStatus.Draft;
        public string? GoLive { get; set; }               // "Goes live 12 Aug, 08:00"
        public List<Attachment> Attachments { get; set; } = new();

        public string TypeLabel => Type switch
        {
            "set" => "SET Announcement",
            "press" => "Press Release & Financial News",
            "fin" => "Financial Information",
            _ => Type
        };
        public int FileCount => Attachments.Count;
    }

    /// <summary>An investor event — Opportunity Day or analyst meeting.
    /// Flips Scheduled → Archived on its own once the date passes.</summary>
    public class IrEvent
    {
        public string Id { get; set; } = "";
        public string Title { get; set; } = "";
        public string? Subtitle { get; set; }
        public string Kind { get; set; } = "SET Opportunity Day";
        public string Date { get; set; } = "";            // "26 Aug 2026" or "TBC"
        public string? Time { get; set; }
        public string Format { get; set; } = "Online";
        public IrStatus Status { get; set; } = IrStatus.Scheduled;
        public bool Upcoming { get; set; }
    }

    /// <summary>An annual report or 56-1 One Report. The only IR record with a
    /// cover image; when none is uploaded, page 1 of the PDF is used.</summary>
    public class Report
    {
        public string Id { get; set; } = "";
        public string Title { get; set; } = "";
        public string TitleTh { get; set; } = "";
        public string? Subtitle { get; set; }
        public string? SubtitleTh { get; set; }
        public string Type { get; set; } = "Annual Report"; // Annual Report | 56-1 One Report
        public string Year { get; set; } = "";
        public bool HasCover { get; set; }                   // false => auto from PDF p.1
        public string CoverEyebrow { get; set; } = "Annual Report";
        public IrStatus Status { get; set; } = IrStatus.Draft;
        public List<Attachment> Attachments { get; set; } = new();
        public int FileCount => Attachments.Count;
    }

    /// <summary>An Opportunity Day presentation — YouTube video + bilingual
    /// summary/transcript. Newest is featured automatically.</summary>
    public class Presentation
    {
        public string Id { get; set; } = "";
        public string Title { get; set; } = "";
        public string? Subtitle { get; set; }
        public string Date { get; set; } = "";
        public bool Featured { get; set; }
        public bool HasTranscript { get; set; }
        public string YouTubeId { get; set; } = "";
    }

    /// <summary>A grouping of investor FAQs by category.</summary>
    public class FaqCategory
    {
        public string Id { get; set; } = "";
        public string Title { get; set; } = "";
        public string Subtitle { get; set; } = "";
        public string Count { get; set; } = "";
    }
}

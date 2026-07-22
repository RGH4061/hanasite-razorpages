using System.Collections.Generic;
using System.Linq;

namespace HanaSite.Models.Ir
{
    /// <summary>
    /// In-memory seed store for the IR admin export. Replace with the real
    /// data layer on merge — the page models only touch Find*/list surfaces.
    /// All sample content is invented; no customer names appear anywhere.
    /// </summary>
    public static class IrStore
    {
        public static List<NewsItem> News { get; } = new()
        {
            new NewsItem { Id = "n1", Title = "Q2/2026 Financial Statements & MD&A", Subtitle = "Period: Q2 2026", Type = "fin", DocumentDate = "12 Aug 2026", Period = "Q2 2026", Status = IrStatus.Scheduled, GoLive = "Goes live 12 Aug, 08:00",
                Attachments = new() {
                    new Attachment { Label = "Financial Statements Q2/2026", Language = "English", FileName = "hana-fs-q2-2026-en.pdf", Meta = "PDF · 1.2 MB" },
                    new Attachment { Label = "งบการเงิน ไตรมาส 2/2569", Language = "ไทย (Thai)", FileName = "hana-fs-q2-2026-th.pdf", Meta = "PDF · 1.3 MB" },
                    new Attachment { Label = "MD&A Q2/2026", Language = "English", FileName = "hana-mdna-q2-2026.pdf", Meta = "PDF · 640 KB" },
                    new Attachment { Label = "Investor presentation Q2/2026", Language = "English" }
                } },
            new NewsItem { Id = "n2", Title = "Notification of Board of Directors' Meeting No. 3/2026", Type = "set", DocumentDate = "14 Jul 2026", SourceUrl = "/investor-relations/investor-news/", Status = IrStatus.Live,
                Attachments = new() { new Attachment { Label = "SET filing (EN)", Language = "English", FileName = "set-bod-3-2026-en.pdf", Meta = "PDF · 210 KB" }, new Attachment { Label = "SET filing (TH)", Language = "ไทย (Thai)", FileName = "set-bod-3-2026-th.pdf", Meta = "PDF · 224 KB" } } },
            new NewsItem { Id = "n3", Title = "Hana Microelectronics reports Q1 2026 results", Type = "press", DocumentDate = "21 May 2026", Status = IrStatus.Live,
                Attachments = new() { new Attachment { Label = "Press release", Language = "English", FileName = "pr-q1-2026.pdf", Meta = "PDF · 180 KB" }, new Attachment { Label = "ข่าวประชาสัมพันธ์", Language = "ไทย (Thai)", FileName = "pr-q1-2026-th.pdf", Meta = "PDF · 190 KB" } } },
            new NewsItem { Id = "n4", Title = "Q1/2026 Financial Statements & MD&A", Subtitle = "Period: Q1 2026", Type = "fin", DocumentDate = "14 May 2026", Period = "Q1 2026", Status = IrStatus.Live,
                Attachments = new() { new Attachment { Label = "Financial Statements Q1/2026", Language = "English", FileName = "hana-fs-q1-2026-en.pdf", Meta = "PDF · 1.1 MB" }, new Attachment { Label = "MD&A Q1/2026", Language = "English", FileName = "hana-mdna-q1-2026.pdf", Meta = "PDF · 610 KB" } } },
            new NewsItem { Id = "n5", Title = "Resolutions of the 2026 Annual General Meeting of Shareholders", Type = "set", DocumentDate = "24 Apr 2026", Status = IrStatus.Live,
                Attachments = new() { new Attachment { Label = "AGM resolutions (EN)", Language = "English", FileName = "agm-2026-en.pdf", Meta = "PDF · 300 KB" } } },
            new NewsItem { Id = "n6", Title = "Interim dividend payment 2026", Subtitle = "Awaiting board confirmation", Type = "set", DocumentDate = "—", Status = IrStatus.Draft }
        };

        public static List<IrEvent> Events { get; } = new()
        {
            new IrEvent { Id = "e1", Title = "Q2/2026 results", Subtitle = "hanagroup.com/investor-relations/events-contact", Kind = "SET Opportunity Day", Date = "26 Aug 2026", Time = "11:15 – 12:00", Status = IrStatus.Scheduled, Upcoming = true },
            new IrEvent { Id = "e2", Title = "Q3/2026 results", Kind = "SET Opportunity Day", Date = "25 Nov 2026", Time = "11:15 – 12:00", Status = IrStatus.Scheduled, Upcoming = true },
            new IrEvent { Id = "e3", Title = "Q2/2026 analyst meeting", Subtitle = "Date not yet confirmed", Kind = "Analyst Meeting", Date = "TBC", Status = IrStatus.ToBeConfirmed },
            new IrEvent { Id = "e4", Title = "Q3/2026 analyst meeting", Subtitle = "Date not yet confirmed", Kind = "Analyst Meeting", Date = "TBC", Status = IrStatus.ToBeConfirmed },
            new IrEvent { Id = "e5", Title = "Q1/2026 results", Subtitle = "Recording linked · shown on FAQ & Presentations", Kind = "SET Opportunity Day", Date = "28 May 2026", Time = "11:15 – 12:00", Status = IrStatus.Archived },
            new IrEvent { Id = "e6", Title = "Q1/2026 analyst meeting", Subtitle = "Materials attached", Kind = "Analyst Meeting", Date = "21 May 2026", Time = "14:30", Status = IrStatus.Archived },
            new IrEvent { Id = "e7", Title = "FY2025 & Q4/2025 results", Kind = "SET Opportunity Day", Date = "13 Mar 2026", Time = "16:15 – 17:00", Status = IrStatus.Archived },
            new IrEvent { Id = "e8", Title = "FY2025 & Q4/2025 analyst meeting", Kind = "Analyst Meeting", Date = "6 Mar 2026", Time = "15:00", Status = IrStatus.Archived }
        };

        public static List<Report> Reports { get; } = new()
        {
            new Report { Id = "r1", Title = "Annual Report 2026", Subtitle = "No cover uploaded — page 1 of the PDF will be used", Type = "Annual Report", Year = "2026", HasCover = false, CoverEyebrow = "No cover", Status = IrStatus.Draft,
                Attachments = new() { new Attachment { Label = "Annual Report 2026 (draft)", Language = "English", FileName = "hana-ar-2026-draft.pdf", Meta = "PDF · 7.1 MB" } } },
            new Report { Id = "r2", Title = "Annual Report 2025", Subtitle = "English · ไทย · financial statements", Type = "Annual Report", Year = "2025", HasCover = true, CoverEyebrow = "Annual Report", Status = IrStatus.Live,
                Attachments = new() { new Attachment { Label = "Annual Report 2025", Language = "English", FileName = "hana-ar-2025-en.pdf", Meta = "PDF · 8.4 MB" }, new Attachment { Label = "รายงานประจำปี 2568", Language = "ไทย (Thai)", FileName = "hana-ar-2025-th.pdf", Meta = "PDF · 8.9 MB" }, new Attachment { Label = "Financial Statements 2025", Language = "English", FileName = "hana-fs-2025.pdf", Meta = "PDF · 2.0 MB" } } },
            new Report { Id = "r3", Title = "56-1 One Report 2025", Subtitle = "English · ไทย", Type = "56-1 One Report", Year = "2025", HasCover = true, CoverEyebrow = "56-1", Status = IrStatus.Live,
                Attachments = new() { new Attachment { Label = "56-1 One Report 2025 (EN)", Language = "English", FileName = "hana-561-2025-en.pdf", Meta = "PDF · 6.2 MB" }, new Attachment { Label = "56-1 One Report 2025 (TH)", Language = "ไทย (Thai)", FileName = "hana-561-2025-th.pdf", Meta = "PDF · 6.6 MB" } } },
            new Report { Id = "r4", Title = "Annual Report 2024", Subtitle = "English · ไทย", Type = "Annual Report", Year = "2024", HasCover = true, CoverEyebrow = "Annual Report", Status = IrStatus.Live,
                Attachments = new() { new Attachment { Label = "Annual Report 2024 (EN)", Language = "English", FileName = "hana-ar-2024-en.pdf", Meta = "PDF · 8.0 MB" }, new Attachment { Label = "Annual Report 2024 (TH)", Language = "ไทย (Thai)", FileName = "hana-ar-2024-th.pdf", Meta = "PDF · 8.3 MB" } } },
            new Report { Id = "r5", Title = "56-1 One Report 2024", Subtitle = "English · ไทย", Type = "56-1 One Report", Year = "2024", HasCover = true, CoverEyebrow = "56-1", Status = IrStatus.Live,
                Attachments = new() { new Attachment { Label = "56-1 One Report 2024 (EN)", Language = "English", FileName = "hana-561-2024-en.pdf", Meta = "PDF · 5.9 MB" }, new Attachment { Label = "56-1 One Report 2024 (TH)", Language = "ไทย (Thai)", FileName = "hana-561-2024-th.pdf", Meta = "PDF · 6.1 MB" } } }
        };

        public static List<Presentation> Presentations { get; } = new()
        {
            new Presentation { Id = "p1", Title = "Q1/2026 Opportunity Day", Subtitle = "Period: Q1 2026", Date = "28 May 2026", Featured = true, HasTranscript = true, YouTubeId = "hQ2mE4rNc8A" },
            new Presentation { Id = "p2", Title = "FY2025 & Q4/2025 Opportunity Day", Subtitle = "Period: FY 2025", Date = "13 Mar 2026", Featured = false, HasTranscript = true, YouTubeId = "kLp9Rt2xY7Q" },
            new Presentation { Id = "p3", Title = "Q3/2025 Opportunity Day", Subtitle = "Period: Q3 2025", Date = "26 Nov 2025", Featured = false, HasTranscript = false, YouTubeId = "Bd8sN1wQ0aE" }
        };

        public static List<FaqCategory> Faqs { get; } = new()
        {
            new FaqCategory { Id = "f1", Title = "Shares & dividends", Subtitle = "Dividend policy, payment dates, DRP", Count = "6 questions" },
            new FaqCategory { Id = "f2", Title = "Results & reporting", Subtitle = "Reporting calendar, where to find statements", Count = "5 questions" },
            new FaqCategory { Id = "f3", Title = "Company & listing", Subtitle = "Listing date, group structure, contacts", Count = "3 questions" }
        };

        public static NewsItem? FindNews(string id) => News.FirstOrDefault(x => x.Id == id);
        public static Report? FindReport(string id) => Reports.FirstOrDefault(x => x.Id == id);
        public static Presentation? FindPresentation(string id) => Presentations.FirstOrDefault(x => x.Id == id);
    }
}

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using HanaSite.Models.Ir;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HanaSite.Pages.Admin.InvestorRelations
{
    /// <summary>
    /// Create / edit an investor-news item (also used for events via ?kind=event).
    /// Model-binds the Input object with validation attributes; persists to the
    /// in-memory store on a valid POST, then redirects (PRG).
    /// </summary>
    public class NewsFormModel : PageModel
    {
        [BindProperty(SupportsGet = true)] public string? Id { get; set; }
        [BindProperty(SupportsGet = true)] public string? Kind { get; set; } // "event" reuses this form

        [BindProperty] public InputModel Input { get; set; } = new();

        public NewsItem? Existing { get; private set; }
        public bool Editing => Existing != null;
        public bool IsEvent => Kind == "event";
        public bool IsLive => Existing?.Status == IrStatus.Live;

        [TempData] public string? Toast { get; set; }

        public class InputModel
        {
            [Required] public string Type { get; set; } = "set";
            [Required(ErrorMessage = "Give the item its document title.")]
            public string Title { get; set; } = "";
            [Required(ErrorMessage = "Enter the Thai title.")]
            public string TitleTh { get; set; } = "";
            [Required(ErrorMessage = "Enter the document date.")]
            public string DocumentDate { get; set; } = "";
            public string? Period { get; set; }
            public string? Summary { get; set; }
            public string? SummaryTh { get; set; }

            public List<Attachment> Attachments { get; set; } = new();

            public string PublishMode { get; set; } = "later"; // now | later
            public string? GoLiveAt { get; set; }
        }

        public void OnGet()
        {
            if (!string.IsNullOrEmpty(Id))
            {
                Existing = IrStore.FindNews(Id);
                if (Existing != null)
                {
                    Input = new InputModel
                    {
                        Type = Existing.Type,
                        Title = Existing.Title,
                        TitleTh = Existing.TitleTh,
                        DocumentDate = Existing.DocumentDate,
                        Period = Existing.Period,
                        Summary = Existing.Subtitle,
                        SummaryTh = Existing.SubtitleTh,
                        Attachments = new List<Attachment>(Existing.Attachments),
                        PublishMode = Existing.Status == IrStatus.Scheduled ? "later" : "now"
                    };
                }
            }
            if (Input.Attachments.Count == 0)
                Input.Attachments.Add(new Attachment());
        }

        public IActionResult OnPost()
        {
            Existing = string.IsNullOrEmpty(Id) ? null : IrStore.FindNews(Id);

            if (Input.Type == "fin" && string.IsNullOrWhiteSpace(Input.Period))
                ModelState.AddModelError("Input.Period", "Financial Information items need a period.");

            if (!ModelState.IsValid)
            {
                if (Input.Attachments.Count == 0) Input.Attachments.Add(new Attachment());
                return Page();
            }

            // Persist. On merge this maps onto the real repository.
            if (Existing != null)
            {
                Existing.Title = Input.Title;
                Existing.TitleTh = Input.TitleTh;
                Existing.Type = Input.Type;
                Existing.DocumentDate = Input.DocumentDate;
                Existing.Period = Input.Period;
                Existing.Subtitle = Input.Summary;
                Existing.SubtitleTh = Input.SummaryTh;
                Existing.Attachments = Input.Attachments;
                Toast = "Changes saved to the live page";
            }
            else
            {
                Toast = Input.PublishMode == "later" ? "Scheduled — will appear at the set time" : "Published to the website";
            }
            return RedirectToPage("/Admin/InvestorRelations/Index", new { tab = IsEvent ? "events" : "news" });
        }
    }
}

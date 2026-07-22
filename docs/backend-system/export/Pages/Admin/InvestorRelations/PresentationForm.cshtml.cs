using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using HanaSite.Models.Ir;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HanaSite.Pages.Admin.InvestorRelations
{
    /// <summary>Create / edit an Opportunity Day presentation.</summary>
    public class PresentationFormModel : PageModel
    {
        [BindProperty(SupportsGet = true)] public string? Id { get; set; }
        [BindProperty] public InputModel Input { get; set; } = new();

        public Presentation? Existing { get; private set; }
        public bool Editing => Existing != null;

        [TempData] public string? Toast { get; set; }

        public class InputModel
        {
            [Required] public string Kind { get; set; } = "SET Opportunity Day";
            [Required(ErrorMessage = "Enter the period, e.g. Q2 2026.")]
            public string Period { get; set; } = "";
            [Required] public string Date { get; set; } = "";
            [Required(ErrorMessage = "Paste the YouTube link.")]
            public string YouTubeUrl { get; set; } = "";
            [Required(ErrorMessage = "Add the key takeaways.")]
            public string KeyTakeaways { get; set; } = "";
            [Required(ErrorMessage = "Add the full summary (customer names removed).")]
            public string Summary { get; set; } = "";
            public string? TranscriptEn { get; set; }
            public string? TranscriptTh { get; set; }
            public List<Attachment> Attachments { get; set; } = new();
        }

        public void OnGet()
        {
            if (!string.IsNullOrEmpty(Id))
            {
                Existing = IrStore.FindPresentation(Id);
                if (Existing != null)
                {
                    Input.Period = Existing.Subtitle?.Replace("Period: ", "") ?? "";
                    Input.Date = Existing.Date;
                    Input.YouTubeUrl = "https://www.youtube.com/watch?v=" + Existing.YouTubeId;
                }
            }
            if (Input.Attachments.Count == 0) Input.Attachments.Add(new Attachment());
        }

        public IActionResult OnPost()
        {
            Existing = string.IsNullOrEmpty(Id) ? null : IrStore.FindPresentation(Id);
            if (!ModelState.IsValid)
            {
                if (Input.Attachments.Count == 0) Input.Attachments.Add(new Attachment());
                return Page();
            }
            Toast = Editing ? "Changes saved to the live page" : "Published to the website";
            return RedirectToPage("/Admin/InvestorRelations/Index", new { tab = "presentations" });
        }
    }
}

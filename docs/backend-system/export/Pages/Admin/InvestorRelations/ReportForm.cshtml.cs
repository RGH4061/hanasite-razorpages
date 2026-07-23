using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using HanaSite.Models.Ir;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HanaSite.Pages.Admin.InvestorRelations
{
    /// <summary>Create / edit an annual report or 56-1 One Report.</summary>
    public class ReportFormModel : PageModel
    {
        [BindProperty(SupportsGet = true)] public string? Id { get; set; }
        [BindProperty] public InputModel Input { get; set; } = new();

        public Report? Existing { get; private set; }
        public bool Editing => Existing != null;
        public bool IsLive => Existing?.Status == IrStatus.Live;

        [TempData] public string? Toast { get; set; }

        public class InputModel
        {
            [Required] public string Type { get; set; } = "Annual Report";
            [Required] public string Year { get; set; } = "2026";
            [Required(ErrorMessage = "Give the report a title.")]
            public string Title { get; set; } = "";
            [Required(ErrorMessage = "Enter the Thai title.")]
            public string TitleTh { get; set; } = "";
            public string? Description { get; set; }
            public string? DescriptionTh { get; set; }
            public List<Attachment> Attachments { get; set; } = new();
            public string PublishMode { get; set; } = "now";
            public string? GoLiveAt { get; set; }
        }

        public void OnGet()
        {
            if (!string.IsNullOrEmpty(Id))
            {
                Existing = IrStore.FindReport(Id);
                if (Existing != null)
                {
                    Input = new InputModel
                    {
                        Type = Existing.Type,
                        Year = Existing.Year,
                        Title = Existing.Title,
                        TitleTh = Existing.TitleTh,
                        Description = Existing.Subtitle,
                        DescriptionTh = Existing.SubtitleTh,
                        Attachments = new List<Attachment>(Existing.Attachments)
                    };
                }
            }
            if (Input.Attachments.Count == 0) Input.Attachments.Add(new Attachment());
        }

        public IActionResult OnPost()
        {
            Existing = string.IsNullOrEmpty(Id) ? null : IrStore.FindReport(Id);
            if (!ModelState.IsValid)
            {
                if (Input.Attachments.Count == 0) Input.Attachments.Add(new Attachment());
                return Page();
            }
            if (Existing != null)
            {
                Existing.Title = Input.Title;
                Existing.TitleTh = Input.TitleTh;
                Existing.Type = Input.Type;
                Existing.Year = Input.Year;
                Existing.Subtitle = Input.Description;
                Existing.SubtitleTh = Input.DescriptionTh;
                Existing.Attachments = Input.Attachments;
                Toast = "Changes saved to the live page";
            }
            else
            {
                Toast = "Published to the website";
            }
            return RedirectToPage("/Admin/InvestorRelations/Index", new { tab = "reports" });
        }
    }
}

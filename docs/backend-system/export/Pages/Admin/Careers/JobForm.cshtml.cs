using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using HanaSite.Models.Careers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HanaSite.Pages.Admin.Careers
{
    /// <summary>
    /// Create / edit a job listing. Model-binds the Input object with
    /// validation attributes; persists to the in-memory store on a valid POST,
    /// then redirects (PRG). The footer buttons post an "action" value.
    /// </summary>
    public class JobFormModel : PageModel
    {
        [BindProperty(SupportsGet = true)] public string? Id { get; set; }
        [BindProperty(SupportsGet = true)] public string? RepostOf { get; set; }

        [BindProperty] public InputModel Input { get; set; } = new();

        public Job? Existing { get; private set; }
        public bool Editing => Existing != null;
        public bool IsLive => Existing?.IsLive == true;

        public string CurrentUser => User?.Identity?.Name ?? "Somchai P. · HR, Ayutthaya";

        [TempData] public string? Toast { get; set; }

        public class InputModel
        {
            [Required(ErrorMessage = "Give the role its job title.")]
            public string Title { get; set; } = "";

            [Required(ErrorMessage = "Choose a plant.")]
            public string Plant { get; set; } = "";

            [Required(ErrorMessage = "Choose a department.")]
            public string Department { get; set; } = "";

            public string EmploymentType { get; set; } = "Full time";

            [Required(ErrorMessage = "Write a short paragraph about the role.")]
            public string About { get; set; } = "";

            [Required(ErrorMessage = "List the responsibilities, one per line.")]
            public string Responsibilities { get; set; } = "";

            [Required(ErrorMessage = "List the requirements, one per line.")]
            public string Requirements { get; set; } = "";

            [Required(ErrorMessage = "Enter the closing date.")]
            public string Closes { get; set; } = "";

            public List<JobLink> Links { get; set; } = new();
        }

        public string SubHeading => Editing
            ? (IsLive ? "Changes save straight to the live page" : "Not visible to the public")
            : "Draft — not visible to the public";

        public string AuditLine => Existing == null ? "" : Existing.Status switch
        {
            "expired" => "Expired " + Existing.ClosesDisplay + " · came down automatically",
            "draft" => "Draft · created by " + (Existing.CreatedBy ?? CurrentUser),
            _ => "Published " + (Existing.Posted ?? "—") + " by " + (Existing.PublishedBy ?? "—")
                 + " · " + Existing.Applications + " applications"
        };

        public string SaveHint => IsLive
            ? "Every change is recorded against your name"
            : "Draft saved automatically";

        public string ReferencePreview => Existing?.Reference ?? BuildReference();

        public string PostedPreview => Existing?.Posted ?? "Set when you publish";

        public string UrlPreview => Existing?.PublicUrl
            ?? "hanagroup.com/careers/jobs/" + Slugify(Input.Plant) + "/" + Slugify(Input.Title) + "/";

        public void OnGet()
        {
            var source = !string.IsNullOrEmpty(Id) ? JobStore.Find(Id)
                       : !string.IsNullOrEmpty(RepostOf) ? JobStore.Find(RepostOf)
                       : null;

            if (source != null)
            {
                // A repost starts a fresh listing pre-filled from the expired one.
                if (string.IsNullOrEmpty(Id)) Existing = null; else Existing = source;

                Input = new InputModel
                {
                    Title = source.Title,
                    Plant = source.Plant,
                    Department = source.Department,
                    EmploymentType = source.EmploymentType,
                    About = source.About,
                    Responsibilities = source.Responsibilities,
                    Requirements = source.Requirements,
                    Closes = string.IsNullOrEmpty(Id) ? "" : (source.Closes ?? ""),
                    Links = new List<JobLink>(source.Links)
                };
            }

            if (Input.Links.Count == 0) Input.Links.Add(new JobLink());
        }

        public IActionResult OnPost(string action)
        {
            Existing = string.IsNullOrEmpty(Id) ? null : JobStore.Find(Id);

            if (action == "preview")
            {
                Toast = "Preview opened";
                return Page();
            }

            if (action == "unpublish")
            {
                if (Existing != null) Existing.Published = false;
                Toast = "Taken off the website";
                return RedirectToPage("/Admin/Careers/Index");
            }

            var draft = action == "draft";

            // A draft can be saved incomplete; publishing cannot.
            if (draft)
            {
                foreach (var key in ModelState.Keys.ToList())
                {
                    if (key != "Input.Title") ModelState.Remove(key);
                }
            }

            if (!ModelState.IsValid)
            {
                if (Input.Links.Count == 0) Input.Links.Add(new JobLink());
                return Page();
            }

            var job = Existing ?? new Job { Id = "j" + (JobStore.All.Count + 1) };

            job.Title = Input.Title;
            job.Plant = Input.Plant;
            job.Department = Input.Department;
            job.EmploymentType = Input.EmploymentType;
            job.About = Input.About;
            job.Responsibilities = Input.Responsibilities;
            job.Requirements = Input.Requirements;
            job.Closes = string.IsNullOrWhiteSpace(Input.Closes) ? null : Input.Closes;
            job.Links = Input.Links.Where(l => !string.IsNullOrWhiteSpace(l.Url)).ToList();
            if (string.IsNullOrEmpty(job.Reference)) job.Reference = BuildReference();
            if (string.IsNullOrEmpty(job.Slug)) job.Slug = Slugify(Input.Plant) + "/" + Slugify(Input.Title);

            if (draft)
            {
                job.Published = false;
                job.CreatedBy ??= CurrentUser;
                Toast = "Saved as draft";
            }
            else
            {
                job.Published = true;
                job.Posted ??= "20 Jul 2026";
                job.PublishedBy = CurrentUser;
                Toast = Existing != null && IsLive ? "Changes saved to the live page" : "Published to website";
            }

            if (Existing == null) JobStore.All.Add(job);

            return RedirectToPage("/Admin/Careers/Index");
        }

        /// <summary>Plant + department prefix, e.g. AYT-ENG-0143.</summary>
        private string BuildReference()
        {
            var plant = Input.Plant switch
            {
                var p when p.StartsWith("Ayutthaya") => "AYT",
                var p when p.StartsWith("Lamphun") => "LPN",
                var p when p.StartsWith("Koh Kong") => "KKG",
                _ => "HNA"
            };
            var dept = Input.Department switch
            {
                "Engineering" => "ENG",
                "Production" => "PRD",
                "Quality" => "QLT",
                "Supply Chain" => "SCM",
                "Facilities" => "FAC",
                "Finance & Admin" => "FIN",
                "Human Resources" => "HR",
                _ => "GEN"
            };
            return plant + "-" + dept + "-" + (140 + JobStore.All.Count).ToString("0000");
        }

        private static string Slugify(string s)
        {
            if (string.IsNullOrEmpty(s)) return "";
            var cut = s.Split(',')[0].Trim().ToLowerInvariant();
            var chars = cut.Select(c => char.IsLetterOrDigit(c) ? c : '-').ToArray();
            return string.Join("-", new string(chars).Split('-', System.StringSplitOptions.RemoveEmptyEntries));
        }
    }
}

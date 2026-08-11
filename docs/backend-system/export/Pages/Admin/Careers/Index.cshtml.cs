using System.Collections.Generic;
using System.Linq;
using HanaSite.Models.Careers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HanaSite.Pages.Admin.Careers
{
    /// <summary>
    /// Job listings hub (/admin/careers/). Filtering runs client-side in
    /// careers-admin.js over the rendered rows; row actions POST here (PRG).
    /// </summary>
    public class JobListModel : PageModel
    {
        public IReadOnlyList<Job> Jobs { get; private set; } = new List<Job>();
        public int LiveCount => JobStore.LiveCount;

        // Signed-in user — supplied by ASP.NET Core Identity in the real site.
        public string CurrentUser => User?.Identity?.Name ?? "Somchai P. · HR, Ayutthaya";

        [TempData] public string? Toast { get; set; }

        public void OnGet() => Load();

        private void Load() => Jobs = JobStore.Listings.ToList();

        public IActionResult OnPostPublish(string id)
        {
            var j = JobStore.Find(id);
            if (j != null)
            {
                j.Published = true;
                j.Posted ??= "20 Jul 2026";
                Toast = "Published to website";
            }
            return RedirectToPage();
        }

        public IActionResult OnPostUnpublish(string id)
        {
            var j = JobStore.Find(id);
            if (j != null) { j.Published = false; Toast = "Taken off the website"; }
            return RedirectToPage();
        }

        /// <summary>Reposting opens a fresh listing pre-filled from the expired one.</summary>
        public IActionResult OnPostRepost(string id)
            => RedirectToPage("/Admin/Careers/JobForm", new { repostOf = id });
    }
}

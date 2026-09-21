using System.Collections.Generic;
using System.Linq;
using HanaSite.Models.Insights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HanaSite.Pages.Admin.Insights
{
    /// <summary>
    /// Insight article list. Filtering runs client-side over the rendered rows
    /// (insights-admin.js) in the same way as the ticket and job lists; the row
    /// actions are real POSTs so the workflow works with JS disabled.
    /// </summary>
    [Authorize(Roles = "Insights,SuperAdmin")]
    public class ArticleListModel : PageModel
    {
        public List<Article> Articles { get; private set; } = new();
        public Dictionary<string, CheckResult> Checks { get; private set; } = new();

        public string CurrentUser => User?.Identity?.Name ?? "Jirapa K. · Corporate Affairs";

        /// <summary>Only an approver publishes. Agency accounts write and send for review.</summary>
        public bool IsApprover => User?.IsInRole("InsightsApprover") ?? true;

        [TempData] public string? Toast { get; set; }

        public int PublishedCount => ArticleStore.CountByStatus("published");
        public int ReviewCount => ArticleStore.CountByStatus("review");
        public int DraftCount => ArticleStore.CountByStatus("draft");
        public int ScheduledCount => ArticleStore.CountByStatus("scheduled");

        public void OnGet()
        {
            // Sort on the ISO field — ModifiedAt is a display string and does not sort.
            Articles = ArticleStore.All.OrderByDescending(a => a.ModifiedOn).ToList();
            Checks = Articles.ToDictionary(a => a.Id, ArticleChecks.Run);
        }

        public IActionResult OnPostSendForReview(string id)
        {
            var a = ArticleStore.Find(id);
            if (a != null)
            {
                a.Status = "review";
                a.SentForReviewBy = CurrentUser;
                a.Audit.Insert(0, new AuditEntry { When = "now", What = "Sent for review by " + CurrentUser });
                Toast = "Sent for review";
            }
            return RedirectToPage();
        }

        public IActionResult OnPostApprove(string id)
        {
            var a = ArticleStore.Find(id);
            if (a == null) return RedirectToPage();

            if (!IsApprover)
            {
                Toast = "Only an approver can publish";
                return RedirectToPage();
            }

            var checks = ArticleChecks.Run(a);
            if (!checks.CanPublish)
            {
                Toast = checks.Blocking + " blocking issue(s) must be fixed first";
                return RedirectToPage();
            }

            if (!string.IsNullOrEmpty(a.ScheduledFor))
            {
                a.Status = "scheduled";
                Toast = "Approved — publishes " + a.ScheduledDisplay;
            }
            else
            {
                a.Status = "published";
                a.PublishedAt = "18 Sep 2026";
                Toast = "Published";
            }

            a.ApprovedBy = CurrentUser;
            a.Audit.Insert(0, new AuditEntry { When = "now", What = "Approved by " + CurrentUser });
            return RedirectToPage();
        }

        public IActionResult OnPostUnpublish(string id)
        {
            var a = ArticleStore.Find(id);
            if (a != null)
            {
                a.Status = "archived";
                a.Audit.Insert(0, new AuditEntry { When = "now", What = "Taken off the website by " + CurrentUser });
                Toast = "Taken off the website";
            }
            return RedirectToPage();
        }
    }
}

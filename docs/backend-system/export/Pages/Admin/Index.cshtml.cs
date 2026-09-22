using System.Collections.Generic;
using System.Linq;
using HanaSite.Models.Admin;
using HanaSite.Models.Careers;
using HanaSite.Models.Insights;
using HanaSite.Models.Ir;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HanaSite.Pages.Admin
{
    /// <summary>
    /// Section hub at /admin. Reached after sign-in by any user who holds more
    /// than one section role (a single-section user is redirected straight into
    /// their section by LoginModel). A user who somehow lands here with one
    /// section is forwarded on.
    /// </summary>
    [Authorize]
    public class AdminHubModel : PageModel
    {
        public IReadOnlyList<AdminSection> Sections { get; private set; } = new List<AdminSection>();
        public List<string> Missing { get; private set; } = new();
        public string UserLine { get; private set; } = "";

        /// <summary>Users is not a section; the button is shown to SuperAdmin only.</summary>
        public bool IsSuperAdmin => User.IsInRole(AdminSections.SuperAdmin);

        public record Stat(string Value, string Label, string Color);

        public IActionResult OnGet()
        {
            Sections = AdminSections.For(User);
            if (Sections.Count == 1) return RedirectToPage(Sections[0].Page);
            if (Sections.Count == 0) return Forbid();

            Missing = AdminSections.All.Where(s => !Sections.Contains(s)).Select(s => s.Title).ToList();
            UserLine = User.Identity?.Name ?? "Signed in";
            return Page();
        }

        /// <summary>Two live figures per card, read from the same stores the sections use.</summary>
        public IEnumerable<Stat> StatsFor(AdminSection s)
        {
            if (s.Key == AdminSections.Tickets.Key)
            {
                var open = TicketStore.Open.Count();
                var unanswered = TicketStore.Open.Count(t => t.Status == "new");
                return new[] { new Stat(open.ToString(), "Open", "#B42318"), new Stat(unanswered.ToString(), "Unanswered", "#7A4F01") };
            }
            if (s.Key == AdminSections.InvestorRelations.Key)
            {
                var scheduled = IrStore.News.Count(n => n.Status == IrStatus.Scheduled);
                var drafts = IrStore.News.Count(n => n.Status == IrStatus.Draft);
                return new[] { new Stat(scheduled.ToString(), "Scheduled", "#0E4A7C"), new Stat(drafts.ToString(), "Draft", "#6B7280") };
            }
            if (s.Key == AdminSections.Insights.Key)
            {
                var review = ArticleStore.CountByStatus("review");
                var drafts = ArticleStore.CountByStatus("draft");
                return new[] { new Stat(review.ToString(), "In review", "#7A4F01"), new Stat(drafts.ToString(), "Draft", "#6B7280") };
            }
            var live = JobStore.All.Count(j => j.Status == "live");
            var closing = JobStore.All.Count(j => j.Status == "closing");
            return new[] { new Stat(live.ToString(), "Live", "#0A7C3F"), new Stat(closing.ToString(), "Closing soon", "#7A4F01") };
        }

        /// <summary>Wire to SignInManager.SignOutAsync during merge.</summary>
        public IActionResult OnPostSignOut() => RedirectToPage("/Account/Login");
    }
}

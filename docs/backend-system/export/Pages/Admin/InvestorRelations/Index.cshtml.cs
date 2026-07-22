using System.Collections.Generic;
using System.Linq;
using HanaSite.Models.Ir;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HanaSite.Pages.Admin.InvestorRelations
{
    /// <summary>
    /// Investor Relations landing page. One page, four tabs (news / events /
    /// reports / presentations) chosen by ?tab=. Action handlers mutate the
    /// store then redirect (PRG). Filtering is left to a client-side pass on
    /// the rendered rows in the real build; the seed set is small enough to
    /// render whole here.
    /// </summary>
    public class IndexModel : PageModel
    {
        [BindProperty(SupportsGet = true)] public string Tab { get; set; } = "news";

        public IReadOnlyList<NewsItem> News => IrStore.News;
        public IReadOnlyList<IrEvent> Events => IrStore.Events;
        public IReadOnlyList<Report> Reports => IrStore.Reports;
        public IReadOnlyList<Presentation> Presentations => IrStore.Presentations;
        public IReadOnlyList<FaqCategory> Faqs => IrStore.Faqs;

        public string CurrentUser => User?.Identity?.Name ?? "Jirapa K. · Corporate Affairs";

        [TempData] public string? Toast { get; set; }

        public int NewsLiveCount => News.Count(n => n.Status == IrStatus.Live);
        public int NewsScheduledCount => News.Count(n => n.Status == IrStatus.Scheduled);
        public int EventsUpcomingCount => Events.Count(e => e.Upcoming);
        public int ReportsDraftCount => Reports.Count(r => r.Status == IrStatus.Draft);

        public void OnGet()
        {
            var valid = new[] { "news", "events", "reports", "presentations" };
            if (!valid.Contains(Tab)) Tab = "news";
        }

        // Publish a draft news item or report straight from its list row.
        public IActionResult OnPostPublish(string id, string kind)
        {
            if (kind == "report")
            {
                var r = IrStore.FindReport(id);
                if (r != null) { r.Status = IrStatus.Live; Toast = "Published to the website"; }
                return RedirectToPage(new { tab = "reports" });
            }

            var n = IrStore.FindNews(id);
            if (n != null) { n.Status = IrStatus.Live; Toast = "Published to the website"; }
            return RedirectToPage(new { tab = "news" });
        }
    }
}

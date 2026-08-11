using System.Collections.Generic;
using System.Linq;
using HanaSite.Models.Admin;
using HanaSite.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HanaSite.Pages.Admin.Tickets
{
    /// <summary>
    /// Ticket list page (/admin/tickets/). Default view is open + unclaimed.
    /// Action handlers mutate the store then redirect (PRG). Filtering is done
    /// client-side in tickets.js over the rendered rows.
    /// </summary>
    public class TicketListModel : PageModel
    {
        public IReadOnlyList<Ticket> Open { get; private set; } = new List<Ticket>();
        public IReadOnlyList<Ticket> Closed { get; private set; } = new List<Ticket>();
        public IReadOnlyList<Ticket> Spam { get; private set; } = new List<Ticket>();

        public IReadOnlyList<string> Owners => TicketStore.Owners;

        /// <summary>Open inquiries in one tab bucket — see Ticket.Bucket.</summary>
        public IReadOnlyList<Ticket> OpenIn(string bucket) =>
            Open.Where(t => t.Bucket == bucket).ToList();

        private readonly IAssignmentMailer _mailer;

        public TicketListModel(IAssignmentMailer mailer) => _mailer = mailer;

        // Signed-in user — supplied by ASP.NET Core Identity in the real site.
        public string CurrentUser => User?.Identity?.Name ?? "Sanjay";

        // One-line confirmation surfaced as a toast after an action.
        [TempData] public string? Toast { get; set; }

        public void OnGet() => Load();

        private void Load()
        {
            Open = TicketStore.Open.ToList();
            Closed = TicketStore.Closed.ToList();
            Spam = TicketStore.Spam.ToList();
        }

        public IActionResult OnPostClaim(string id)
        {
            var t = TicketStore.Find(id);
            if (t != null)
            {
                t.Status = "claimed"; t.Owner = CurrentUser;
                var to = _mailer.SendAssignmentSummary(t, CurrentUser, CurrentUser);
                Toast = $"Claimed — summary emailed to {to}";
            }
            return RedirectToPage();
        }

        public IActionResult OnPostAssign(string id, string owner)
        {
            var t = TicketStore.Find(id);
            if (t != null)
            {
                if (t.Status == "new") t.Status = "claimed";
                t.Owner = owner;
                var to = _mailer.SendAssignmentSummary(t, owner, CurrentUser);
                Toast = $"Assigned to {owner} — summary emailed to {to}";
            }
            return RedirectToPage();
        }

        public IActionResult OnPostStatus(string id, string status)
        {
            var t = TicketStore.Find(id);
            if (t != null)
            {
                t.Status = status;
                if (status == "responded") Toast = "Marked as responded — waiting on customer";
                else if (status == "closed")
                {
                    t.ClosedDate = "2026-05-10"; t.ClosedBy = CurrentUser;
                    t.RoutedTo ??= t.Owner ?? CurrentUser;
                    Toast = "Closed and archived";
                }
            }
            return RedirectToPage();
        }

        public IActionResult OnPostResendSummary(string id)
        {
            var t = TicketStore.Find(id);
            if (t != null && !string.IsNullOrEmpty(t.Owner))
            {
                var to = _mailer.SendAssignmentSummary(t, t.Owner, CurrentUser);
                Toast = $"Summary emailed again to {to}";
            }
            return RedirectToPage();
        }

        public IActionResult OnPostReopen(string id)
        {
            var t = TicketStore.Find(id);
            if (t != null) { t.Status = "claimed"; t.Owner ??= CurrentUser; Toast = "Reopened — back in the open queue"; }
            return RedirectToPage();
        }

        public IActionResult OnPostSpam(string id)
        {
            var t = TicketStore.Find(id);
            if (t != null) { t.Status = "spam"; t.SpamDate = "2026-05-10"; t.FlaggedBy = CurrentUser; Toast = "Flagged as spam"; }
            return RedirectToPage();
        }

        public IActionResult OnPostRestore(string id)
        {
            var t = TicketStore.Find(id);
            if (t != null) { t.Status = "new"; t.Owner = null; Toast = "Restored to the open queue as new"; }
            return RedirectToPage();
        }

        public IActionResult OnPostDelete(string id)
        {
            var t = TicketStore.Find(id);
            if (t != null) { TicketStore.All.Remove(t); Toast = "Deleted permanently"; }
            return RedirectToPage();
        }
    }
}

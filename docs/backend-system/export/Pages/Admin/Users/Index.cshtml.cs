using System;
using System.Collections.Generic;
using System.Linq;
using HanaSite.Models.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HanaSite.Pages.Admin.Users
{
    /// <summary>
    /// User management at /admin/users. SuperAdmin only. Five actions: list,
    /// invite, set roles, deactivate/reactivate, resend an invitation (plus a
    /// password reset link). No password is ever typed or shown here, and there
    /// is no delete action. Every change is written to the account's history.
    /// </summary>
    [Authorize(Roles = AdminSections.SuperAdmin)]
    public class UserListModel : PageModel
    {
        public IReadOnlyList<AdminUser> Accounts { get; private set; } = new List<AdminUser>();

        // Signed-in user — supplied by ASP.NET Core Identity in the real site.
        public string CurrentUser => User?.Identity?.Name ?? "Rupert Han · SuperAdmin";
        public string CurrentUserEmail => User?.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value ?? "rupert@hanabk.th.com";
        private string Actor => CurrentUser.Split('·')[0].Trim();

        public RoleTicks BlankTicks => new() { Scope = "invite" };

        [TempData] public string? Toast { get; set; }

        public void OnGet() => Load();

        private void Load()
        {
            Accounts = AdminUserStore.All;
            ViewData["CurrentUserEmail"] = CurrentUserEmail;
        }

        public IActionResult OnPostInvite(string name, string email, string[]? sections, bool insightsApprover, bool superAdmin)
        {
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(email))
            {
                Toast = "A name and an email address are both needed.";
                return RedirectToPage();
            }
            if (AdminUserStore.ByEmail(email) != null)
            {
                Toast = "That address already has an account.";
                return RedirectToPage();
            }
            var u = AdminUserStore.Invite(name, email, sections, insightsApprover, superAdmin, Actor);
            Toast = "Invitation sent to " + u.Email + ".";
            return RedirectToPage();
        }

        public IActionResult OnPostSaveRoles(string id, string[]? sections, bool insightsApprover, bool superAdmin)
        {
            var u = AdminUserStore.Find(id);
            if (u == null) return RedirectToPage();

            // Nobody edits their own roles — the tick is disabled in the view and
            // refused again here.
            if (IsMe(u)) { Toast = "You cannot change your own access. Ask another SuperAdmin."; return RedirectToPage(); }

            // Never remove the last SuperAdmin.
            if (!superAdmin && AdminUserStore.IsLastSuperAdmin(u))
            {
                Toast = "The only active SuperAdmin cannot lose the role. Give SuperAdmin to someone else first.";
                return RedirectToPage();
            }

            u.SetRoles(sections, insightsApprover, superAdmin);
            AdminUserStore.Log(u, Actor, "changed sections");
            Toast = "Roles updated. " + u.Name + " sees the change next time they open a page.";
            return RedirectToPage();
        }

        public IActionResult OnPostDeactivate(string id)
        {
            var u = AdminUserStore.Find(id);
            if (u == null) return RedirectToPage();
            if (IsMe(u)) { Toast = "You cannot deactivate your own account. Ask another SuperAdmin."; return RedirectToPage(); }
            if (AdminUserStore.IsLastSuperAdmin(u))
            {
                Toast = "The only active SuperAdmin cannot be deactivated. Give SuperAdmin to someone else first.";
                return RedirectToPage();
            }
            AdminUserStore.Deactivate(u, Actor);
            Toast = u.Name + " can no longer sign in. Their name stays on anything they published.";
            return RedirectToPage();
        }

        public IActionResult OnPostReactivate(string id)
        {
            var u = AdminUserStore.Find(id);
            if (u == null) return RedirectToPage();
            AdminUserStore.Reactivate(u, Actor);
            Toast = u.Name + " can sign in again. Set their sections on the row.";
            return RedirectToPage();
        }

        /// <summary>Wire to UserManager.GenerateInvitationToken + the mailer on merge.</summary>
        public IActionResult OnPostResend(string id)
        {
            var u = AdminUserStore.Find(id);
            if (u == null) return RedirectToPage();
            AdminUserStore.Log(u, Actor, "resent the invitation");
            Toast = "Invitation resent to " + u.Email + ".";
            return RedirectToPage();
        }

        /// <summary>Wire to UserManager.GeneratePasswordResetTokenAsync on merge. No administrator ever sees the password.</summary>
        public IActionResult OnPostResetPassword(string id)
        {
            var u = AdminUserStore.Find(id);
            if (u == null) return RedirectToPage();
            AdminUserStore.Log(u, Actor, "sent a password reset link");
            Toast = "Password reset link sent to " + u.Email + ". It expires in 24 hours.";
            return RedirectToPage();
        }

        private bool IsMe(AdminUser u) => string.Equals(u.Email, CurrentUserEmail, StringComparison.OrdinalIgnoreCase);
    }
}

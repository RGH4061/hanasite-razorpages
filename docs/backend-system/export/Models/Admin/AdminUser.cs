using System.Collections.Generic;
using System.Linq;

namespace HanaSite.Models.Admin
{
    public enum AdminUserStatus { Active, Invited, Deactivated }

    /// <summary>
    /// One admin account. Sections are AdminSection.Key values; InsightsApprover
    /// and SuperAdmin are separate roles, not sections. Deactivating never
    /// deletes: IR records, job listings and articles name the person who
    /// published or approved them, so the record and the name stay.
    /// </summary>
    public sealed class AdminUser
    {
        public string Id { get; init; } = "";
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public AdminUserStatus Status { get; set; } = AdminUserStatus.Invited;
        public HashSet<string> Sections { get; set; } = new();
        public bool InsightsApprover { get; set; }
        public bool SuperAdmin { get; set; }
        public string AddedBy { get; set; } = "";
        public string AddedOn { get; set; } = "";
        public List<AdminUserChange> History { get; set; } = new();

        public string StatusKey => Status switch
        {
            AdminUserStatus.Active => "active",
            AdminUserStatus.Invited => "invited",
            _ => "deactivated"
        };

        public bool Holds(AdminSection s) => SuperAdmin || Sections.Contains(s.Key);

        /// <summary>Chips shown in the list. SuperAdmin replaces the four sections.</summary>
        public IEnumerable<string> ChipLabels()
        {
            if (Status == AdminUserStatus.Deactivated) return new[] { "No sections" };
            if (SuperAdmin) return new[] { "SuperAdmin" };
            var chips = AdminSections.All.Where(s => Sections.Contains(s.Key)).Select(s => s.Title).ToList();
            if (InsightsApprover) chips.Add("Insights approver");
            if (chips.Count == 0) chips.Add("None");
            return chips;
        }

        /// <summary>Applies the tick dependencies the screen enforces.</summary>
        public void SetRoles(IEnumerable<string>? sections, bool insightsApprover, bool superAdmin)
        {
            var set = new HashSet<string>(sections ?? Enumerable.Empty<string>());
            if (insightsApprover) set.Add(AdminSections.Insights.Key);
            if (!set.Contains(AdminSections.Insights.Key)) insightsApprover = false;
            if (superAdmin) { set.Clear(); insightsApprover = false; }
            Sections = set;
            InsightsApprover = insightsApprover;
            SuperAdmin = superAdmin;
        }
    }

    /// <summary>Append-only audit entry. Has no screen of its own; the row expand reads it back.</summary>
    public sealed record AdminUserChange(string When, string What);

    /// <summary>View model for _users_RoleTicks — used by the invite card and by each row.</summary>
    public sealed class RoleTicks
    {
        /// <summary>Unique per instance so the checkbox ids do not collide.</summary>
        public string Scope { get; init; } = "invite";
        public ISet<string> Sections { get; init; } = new HashSet<string>();
        public bool InsightsApprover { get; init; }
        public bool SuperAdmin { get; init; }
        public bool SectionsLocked { get; init; }
        public bool SuperDisabled { get; init; }
        public string SuperReason { get; init; } =
            "Reaches every section, and is the only role that can open this page.";
    }
}

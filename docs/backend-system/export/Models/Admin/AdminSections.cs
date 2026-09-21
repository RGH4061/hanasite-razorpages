using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace HanaSite.Models.Admin
{
    /// <summary>
    /// One admin section = one Identity role. A user holding several roles can
    /// switch between sections from the header; a user holding one is sent
    /// straight into it at sign-in.
    /// </summary>
    public sealed class AdminSection
    {
        public string Key { get; init; } = "";
        public string Role { get; init; } = "";
        public string Title { get; init; } = "";
        public string Page { get; init; } = "";
        public string Description { get; init; } = "";
    }

    public static class AdminSections
    {
        public const string SuperAdmin = "SuperAdmin";

        public static readonly AdminSection Tickets = new()
        {
            Key = "tickets", Role = "Tickets", Title = "Tickets",
            Page = "/Admin/Tickets/Index",
            Description = "Website inquiries routed to an owner — sales and support, investor relations, careers, supplier and vendor."
        };

        public static readonly AdminSection InvestorRelations = new()
        {
            Key = "ir", Role = "InvestorRelations", Title = "Investor relations",
            Page = "/Admin/InvestorRelations/Index",
            Description = "News, events, financial reports and Opportunity Day presentations published to the IR pages."
        };

        public static readonly AdminSection Careers = new()
        {
            Key = "careers", Role = "Careers", Title = "Job listings",
            Page = "/Admin/Careers/Index",
            Description = "Roles on the careers page — publish, schedule, repost an expired listing and record where else it ran."
        };

        public static readonly AdminSection Insights = new()
        {
            Key = "insights", Role = "Insights", Title = "Insights",
            Page = "/Admin/Insights/Index",
            Description = "Insight articles on the website — write, run the publish checklist, approve and schedule."
        };

        /// <summary>Display order, used by the hub and the header switcher.</summary>
        public static readonly AdminSection[] All = { Tickets, InvestorRelations, Careers, Insights };

        /// <summary>Authorize policy strings for the page attributes.</summary>
        public static string RolesFor(AdminSection s) => s.Role + "," + SuperAdmin;

        public static bool CanReach(ClaimsPrincipal user, AdminSection s)
            => user.IsInRole(SuperAdmin) || user.IsInRole(s.Role);

        public static IReadOnlyList<AdminSection> For(ClaimsPrincipal user)
            => All.Where(s => CanReach(user, s)).ToList();

        /// <summary>Landing page after sign-in: the single section, or the hub.</summary>
        public static string LandingPage(ClaimsPrincipal user)
        {
            var reachable = For(user);
            return reachable.Count == 1 ? reachable[0].Page : "/Admin/Index";
        }

        public static AdminSection? ByKey(string? key)
            => All.FirstOrDefault(s => s.Key == key);
    }
}

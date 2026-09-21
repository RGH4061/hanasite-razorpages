using System;
using System.Collections.Generic;
using System.Linq;

namespace HanaSite.Models.Admin
{
    /// <summary>
    /// In-memory seed for the prototype — replace with the Identity user store
    /// on merge. The page model only touches Find, All, Invite and the mutators.
    /// </summary>
    public static class AdminUserStore
    {
        private static readonly List<AdminUser> _users = new()
        {
            New("u1",  "Rupert H.",              "rupert.h@hanagroup.com",          AdminUserStatus.Active,      super: true,  addedBy: "Sanjay P.", on: "4 Feb 2025"),
            New("u2",  "Sanjay P.",              "sanjay.p@hanagroup.com",          AdminUserStatus.Active,      super: true,  addedBy: "Rupert H.", on: "4 Feb 2025"),
            New("u3",  "Wichet S.",              "wichet.s@hanagroup.com",          AdminUserStatus.Active,      super: true,  addedBy: "Rupert H.", on: "19 Jun 2025"),
            New("u4",  "Areenee K.",             "areenee.k@hanagroup.com",         AdminUserStatus.Active,      super: true,  addedBy: "Wichet S.", on: "11 Sep 2025"),
            New("u5",  "Patrick P.",             "patrick.p@hanagroup.com",         AdminUserStatus.Active,      sections: new[]{ "tickets" }, addedBy: "Sanjay P.", on: "3 Mar 2025"),
            New("u6",  "Mike G.",                "mike.g@hanagroup.com",            AdminUserStatus.Active,      sections: new[]{ "tickets" }, addedBy: "Sanjay P.", on: "3 Mar 2025"),
            New("u7",  "Thang N.",               "thang.n@hanagroup.com",           AdminUserStatus.Active,      sections: new[]{ "tickets" }, addedBy: "Rupert H.", on: "14 Apr 2025"),
            New("u8",  "Mark T.",                "mark.t@hanagroup.com",            AdminUserStatus.Active,      sections: new[]{ "tickets", "careers" }, addedBy: "Wichet S.", on: "2 Sep 2025"),
            New("u9",  "Former colleague",       "former.colleague@hanagroup.com",  AdminUserStatus.Deactivated, addedBy: "Sanjay P.", on: "17 Mar 2025"),
            New("u10", "Careers — HQ, Bangkok",  "careers.bangkok@hanagroup.com",   AdminUserStatus.Active,      sections: new[]{ "careers" }, addedBy: "Rupert H.", on: "30 Jul 2025"),
            New("u11", "Careers — Lamphun",      "careers.lamphun@hanagroup.com",   AdminUserStatus.Active,      sections: new[]{ "careers" }, addedBy: "Wichet S.", on: "30 Jul 2025"),
            New("u12", "Careers — Ayutthaya",    "careers.ayutthaya@hanagroup.com", AdminUserStatus.Active,      sections: new[]{ "careers" }, addedBy: "Wichet S.", on: "30 Jul 2025"),
            New("u13", "Careers — Koh Kong",     "careers.kohkong@hanagroup.com",   AdminUserStatus.Active,      sections: new[]{ "careers" }, addedBy: "Areenee K.", on: "12 Nov 2025"),
            New("u14", "Careers — Jiaxing",      "careers.jiaxing@hanagroup.com",   AdminUserStatus.Invited,     sections: new[]{ "careers" }, addedBy: "Rupert H.", on: "16 Sep 2026"),
            New("u15", "Jirapa K.",              "jirapa.k@hanagroup.com",          AdminUserStatus.Active,      sections: new[]{ "ir", "insights" }, approver: true, addedBy: "Sanjay P.", on: "22 May 2025"),
            New("u16", "Penpimol K.",            "penpimol.k@hanagroup.com",        AdminUserStatus.Active,      sections: new[]{ "ir" }, addedBy: "Rupert H.", on: "8 Oct 2025"),
            New("u17", "Sopida K.",              "sopida.k@hanagroup.com",          AdminUserStatus.Active,      sections: new[]{ "ir" }, addedBy: "Rupert H.", on: "8 Oct 2025"),
            New("u18", "SEO agency (shared)",    "agency@seo-partner.example",      AdminUserStatus.Active,      sections: new[]{ "insights" }, addedBy: "Wichet S.", on: "2 Mar 2026")
        };

        private static AdminUser New(string id, string name, string email, AdminUserStatus status,
            string[]? sections = null, bool super = false, bool approver = false,
            string addedBy = "", string on = "")
        {
            var u = new AdminUser
            {
                Id = id, Name = name, Email = email, Status = status,
                Sections = new HashSet<string>(sections ?? Array.Empty<string>()),
                InsightsApprover = approver, SuperAdmin = super,
                AddedBy = addedBy, AddedOn = on
            };
            u.History.Add(new AdminUserChange(on, (status == AdminUserStatus.Invited ? addedBy + " sent the invitation" : addedBy + " created the account")));
            return u;
        }

        /// <summary>Deactivated accounts sort to the bottom; the list never pages.</summary>
        public static IReadOnlyList<AdminUser> All => _users
            .OrderBy(u => u.Status == AdminUserStatus.Active ? 0 : u.Status == AdminUserStatus.Invited ? 1 : 2)
            .ThenBy(u => u.Name, StringComparer.CurrentCulture)
            .ToList();

        public static AdminUser? Find(string? id) => _users.FirstOrDefault(u => u.Id == id);
        public static AdminUser? ByEmail(string? email)
            => _users.FirstOrDefault(u => string.Equals(u.Email, email, StringComparison.OrdinalIgnoreCase));

        public static int ActiveCount => _users.Count(u => u.Status == AdminUserStatus.Active);
        public static int InvitedCount => _users.Count(u => u.Status == AdminUserStatus.Invited);
        public static int DeactivatedCount => _users.Count(u => u.Status == AdminUserStatus.Deactivated);

        public static int ActiveSuperAdmins => _users.Count(u => u.Status == AdminUserStatus.Active && u.SuperAdmin);

        /// <summary>True when removing SuperAdmin from, or deactivating, this account would leave none.</summary>
        public static bool IsLastSuperAdmin(AdminUser u)
            => u.SuperAdmin && u.Status == AdminUserStatus.Active && ActiveSuperAdmins == 1;

        public static string Today => DateTime.Now.ToString("d MMM yyyy");
        public static string Stamp => DateTime.Now.ToString("dd MMM yy");

        public static void Log(AdminUser u, string actor, string what)
            => u.History.Insert(0, new AdminUserChange(Stamp, actor + " " + what));

        public static AdminUser Invite(string name, string email, IEnumerable<string>? sections,
            bool approver, bool superAdmin, string actor)
        {
            var u = new AdminUser
            {
                Id = "u" + (_users.Count + 1),
                Name = name.Trim(), Email = email.Trim(),
                Status = AdminUserStatus.Invited,
                AddedBy = actor, AddedOn = Today
            };
            u.SetRoles(sections, approver, superAdmin);
            u.History.Add(new AdminUserChange(Stamp, actor + " sent the invitation"));
            _users.Add(u);
            return u;
        }

        public static void Deactivate(AdminUser u, string actor)
        {
            u.Status = AdminUserStatus.Deactivated;
            u.Sections.Clear();
            u.InsightsApprover = false;
            u.SuperAdmin = false;
            Log(u, actor, "deactivated the account");
        }

        public static void Reactivate(AdminUser u, string actor)
        {
            u.Status = AdminUserStatus.Active;
            Log(u, actor, "reactivated the account");
        }
    }
}

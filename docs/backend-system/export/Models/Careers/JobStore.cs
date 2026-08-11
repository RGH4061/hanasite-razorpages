using System.Collections.Generic;
using System.Linq;

namespace HanaSite.Models.Careers
{
    /// <summary>
    /// In-memory seed for the prototype. Replace with the real repository /
    /// EF Core context on merge — the page models only touch Find and All.
    /// </summary>
    public static class JobStore
    {
        public static IReadOnlyList<string> Plants { get; } = new[]
        {
            "Lamphun, Thailand", "Ayutthaya, Thailand", "Koh Kong, Cambodia"
        };

        public static IReadOnlyList<string> Departments { get; } = new[]
        {
            "Engineering", "Production", "Quality", "Supply Chain",
            "Facilities", "Finance & Admin", "Human Resources"
        };

        public static IReadOnlyList<string> Boards { get; } = new[]
        {
            "Indeed", "LinkedIn", "JobsDB", "CamHR", "Other"
        };

        public static List<Job> All { get; } = Seed();

        public static Job? Find(string id) => All.FirstOrDefault(j => j.Id == id);

        public static IEnumerable<Job> Listings =>
            All.OrderByDescending(j => j.IsLive).ThenBy(j => j.Closes);

        public static int LiveCount => All.Count(j => j.IsLive);

        private static List<Job> Seed() => new()
        {
            new Job
            {
                Id = "j1", Title = "Pre-Assembly Engineer", Reference = "AYT-ENG-0141",
                Plant = "Ayutthaya, Thailand", Department = "Engineering",
                Closes = "2026-08-28", Posted = "20 Jun 2026", Published = true,
                Applications = 12, Slug = "ayutthaya/pre-assembly-engineer",
                PublishedBy = "Somchai P.",
                About = "Support the pre-assembly line at Ayutthaya, working alongside process and quality engineering on yield and throughput.",
                Responsibilities = "Own day-to-day process control for the pre-assembly cells\nInvestigate yield excursions with the quality team\nQualify new tooling and fixtures",
                Requirements = "Degree in engineering or a related field\nThree years in electronics assembly\nWorking English"
            },
            new Job
            {
                Id = "j2", Title = "SMT Process Technician", Reference = "LPN-PRD-0138",
                Plant = "Lamphun, Thailand", Department = "Production",
                Closes = "2026-09-15", Posted = "12 Jun 2026", Published = true,
                Applications = 34, Slug = "lamphun/smt-process-technician",
                PublishedBy = "Somchai P.",
                About = "Run and maintain SMT lines at Lamphun across two shifts.",
                Responsibilities = "Set up and change over SMT lines\nFirst-off inspection and documentation\nRoutine preventive maintenance",
                Requirements = "Vocational certificate or above\nExperience with pick-and-place equipment"
            },
            new Job
            {
                Id = "j3", Title = "Procurement Officer", Reference = "KKG-SCM-0136",
                Plant = "Koh Kong, Cambodia", Department = "Supply Chain",
                Closes = "2026-07-24", Posted = "02 Jun 2026", Published = true,
                Applications = 7, Slug = "koh-kong/procurement-officer",
                PublishedBy = "Somchai P.",
                About = "Buy indirect materials and services for the Koh Kong plant.",
                Responsibilities = "Source and negotiate with local suppliers\nMaintain the approved vendor list\nTrack delivery performance",
                Requirements = "Two years in purchasing\nKhmer and English"
            },
            new Job
            {
                Id = "j4", Title = "Test Development Engineer", Reference = "LPN-ENG-0140",
                Plant = "Lamphun, Thailand", Department = "Engineering",
                Closes = "2026-09-30", Posted = "18 Jun 2026", Published = true,
                Applications = 0, Slug = "lamphun/test-development-engineer",
                PublishedBy = "Somchai P.",
                About = "Develop test programs and fixtures for new microelectronics builds.",
                Responsibilities = "Write and debug test programs\nDesign test fixtures with the NPI team\nHand over to production test",
                Requirements = "Degree in electronics engineering\nTest program development experience"
            },
            new Job
            {
                Id = "j5", Title = "Quality Engineer", Reference = "LPN-QLT-0142",
                Plant = "Lamphun, Thailand", Department = "Quality",
                Closes = null, Posted = null, Published = false,
                Applications = 0, Slug = "lamphun/quality-engineer",
                CreatedBy = "Somchai P.",
                About = "",
                Responsibilities = "",
                Requirements = ""
            },
            new Job
            {
                Id = "j6", Title = "Maintenance Supervisor", Reference = "AYT-FAC-0129",
                Plant = "Ayutthaya, Thailand", Department = "Facilities",
                Closes = "2026-06-30", Posted = "01 May 2026", Published = true,
                Applications = 21, Slug = "ayutthaya/maintenance-supervisor",
                PublishedBy = "Somchai P.",
                About = "Lead the facilities maintenance team at Ayutthaya.",
                Responsibilities = "Plan preventive maintenance\nSupervise a team of eight\nManage contractors on site",
                Requirements = "Five years in plant maintenance\nSupervisory experience"
            }
        };
    }
}

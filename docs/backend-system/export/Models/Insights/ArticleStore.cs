using System.Collections.Generic;
using System.Linq;

namespace HanaSite.Models.Insights
{
    /// <summary>
    /// In-memory seed for the prototype. Swap for the real repository / EF Core
    /// context on merge — the page models only touch Find, All and Add.
    /// Sample companies are invented; no real customer is named.
    /// </summary>
    public static class ArticleStore
    {
        /// <summary>The six capability pages on hanagroup.com.</summary>
        public static readonly string[] Capabilities =
        {
            "PCBA and box build", "OSAT", "Microelectronic assembly",
            "RFID and smart tags", "Automation and smart manufacturing", "DFX and JDM"
        };

        /// <summary>Category = the market or capability page an article supports.</summary>
        public static string[] Categories => Markets.Concat(Capabilities).ToArray();
        public static readonly string[] ContentTypes = { "Standard", "Listicle", "How-to", "Announcement" };
        public static readonly string[] BuyerTypes = { "EMS", "Technical", "Regionality" };

        /// <summary>The ten market pages on hanagroup.com.</summary>
        public static readonly string[] Markets =
        {
            "Automotive", "Industrial and IoT", "Telecommunications", "RFID", "Optical and sensors",
            "Consumer electronics", "Access control", "Data centers", "Power management", "Medical"
        };

        /// <summary>Capability pages, then market pages — the valid internal link targets.</summary>
        public static readonly (string Label, string Url)[] LinkTargets =
        {
            ("PCBA and box build", "/capabilities/pcba-and-box-build"),
            ("OSAT", "/capabilities/osat"),
            ("Microelectronic assembly", "/capabilities/microelectronic-assembly"),
            ("RFID and smart tags", "/capabilities/rfid-and-smart-tags"),
            ("Automation and smart manufacturing", "/capabilities/automation-and-smart-manufacturing"),
            ("DFX and JDM", "/capabilities/dfx-and-jdm"),
            ("Automotive market", "/markets/automotive"),
            ("Industrial and IoT market", "/markets/industrial-and-iot"),
            ("Telecommunications market", "/markets/telecommunications"),
            ("RFID market", "/markets/rfid"),
            ("Optical and sensors market", "/markets/optical-and-sensors"),
            ("Consumer electronics market", "/markets/consumer-electronics"),
            ("Access control market", "/markets/access-control"),
            ("Data centers market", "/markets/data-centers"),
            ("Power management market", "/markets/power-management"),
            ("Medical market", "/markets/medical")
        };

        public static readonly string[] Bylines =
        {
            "Hana Engineering Team", "Dr. Anya Sirikul", "Jirapa K.", "Northlight SEO"
        };

        private const string FlipChipBody = @"<p>Flip chip assembly moves the die face down onto the substrate and joins it through bumps rather than wire. For engineering teams weighing it against wire bond, the decision usually comes down to three things: thermal path, footprint, and what the test yield looks like at volume.</p>
<h2>What flip chip changes about the thermal path</h2>
<p>With the die inverted, heat leaves through the bumps and the substrate rather than travelling the length of a wire. On power-dense parts that shortens the path considerably, and it is the reason most high-current designs arrive at flip chip eventually.</p>
<p>The trade is underfill. Every flip chip part needs it, and underfill adds a cure step with its own process window. That step is where most early yield problems show up.</p>
<h2>Where wire bond still wins</h2>
<p>Low pin counts, wide pads and cost-sensitive volumes still favor wire bond. It tolerates substrate variation better, the equipment base is larger, and rework is possible in a way it rarely is once underfill has cured.</p>
<ul><li>Under about 80 interconnects, the footprint gain is usually not worth the process addition</li><li>Mixed-technology boards can carry both on the same substrate</li><li>Qualification data from an existing wire bond part does not transfer</li></ul>
<h2>How should you decide between them?</h2>
<p>Start with the thermal budget and the footprint constraint, because those are the two that cannot be engineered around later. If both point to flip chip, the remaining question is whether your volume supports the underfill process window.</p>
<p>We run both technologies in Thailand and in China, on the same campuses, which means a part can be prototyped one way and moved to the other without changing supplier. Read more on our <a href=""/capabilities/microelectronic-assembly"">microelectronic assembly capability</a>.</p>
<h2>Choosing a path</h2>
<p>Flip chip earns its place on power-dense, space-constrained parts at volumes that justify the underfill step. Wire bond remains the right answer for lower pin counts and cost-led programs. Most portfolios end up running both, and the useful decision is per-part rather than per-platform.</p>
<p>Talk to our engineering team through the <a href=""/contact/rfq"">quote request form</a>.</p>
<h2>FAQ</h2>
<h3>Is flip chip always smaller than wire bond?</h3>
<p>Usually, because the interconnect sits under the die rather than beside it. The gain shrinks at low pin counts.</p>
<h3>Can underfill be skipped?</h3>
<p>No. Underfill carries the thermal and mechanical stress between die and substrate, and parts without it fail early in temperature cycling.</p>
<h3>Does flip chip need different test equipment?</h3>
<p>The test itself is similar, but access changes. Probe points that sat on the die surface have to move to the substrate.</p>
<h2>Sources</h2>
<p><a href=""https://en.wikipedia.org/wiki/Flip_chip"">Flip chip — Wikipedia</a></p>";

        public static readonly List<Article> All = new()
        {
            new Article
            {
                Id = "a1",
                Title = "Flip chip or wire bond: how to choose",
                Slug = "flip-chip-or-wire-bond",
                Summary = "Flip chip shortens the thermal path and the footprint; wire bond stays cheaper and easier to rework. This sets out how to decide per part rather than per platform.",
                BodyHtml = FlipChipBody,
                Category = "Microelectronic assembly", ContentType = "Standard", BuyerType = "Technical",
                CapabilityLink = "/capabilities/microelectronic-assembly",
                MetaTitle = "Flip chip or wire bond: how to choose | Hana",
                MetaDescription = "Flip chip assembly shortens the thermal path and the footprint, but adds underfill. Here is how to weigh it against wire bond, per part and at volume.",
                PrimaryKeyphrase = "flip chip assembly",
                SecondaryKeyphrases = new() { "underfill process window", "wire bond alternative" },
                HeroImage = "flip-chip-underfill-02.jpg",
                HeroAlt = "Underfill dispense head above a flip chip part on a substrate carrier",
                Entities = new()
                {
                    new ArticleEntity { Name = "Flip chip", Url = "https://en.wikipedia.org/wiki/Flip_chip" },
                    new ArticleEntity { Name = "Wire bonding", Url = "https://en.wikipedia.org/wiki/Wire_bonding" },
                    new ArticleEntity { Name = "Underfill", Url = "https://en.wikipedia.org/wiki/Underfill" }
                },
                Tags = new() { "flip chip", "wire bond", "packaging" },
                RelatedIds = new() { "a7", "a4" },
                Status = "review", Author = "Hana Engineering Team",
                ModifiedOn = "2026-09-15", ModifiedAt = "15 Sep 2026 14:22",
                CreatedBy = "Northlight SEO", SentForReviewBy = "Northlight SEO",
                Audit = new()
                {
                    new AuditEntry { When = "15 Sep 14:22", What = "Sent for review by Northlight SEO" },
                    new AuditEntry { When = "15 Sep 11:04", What = "Hero image replaced · flip-chip-underfill-02.jpg" },
                    new AuditEntry { When = "12 Sep 16:47", What = "Search description rewritten by Northlight SEO" },
                    new AuditEntry { When = "08 Sep 09:15", What = "Draft created by Northlight SEO" }
                }
            },
            Seed("a2", "Reading a photonics datasheet without getting burned", "reading-a-photonics-datasheet", "Optical and sensors", "How-to", "Northlight SEO", "draft", "2026-09-12", "photonics datasheet"),
            Seed("a3", "What changed in our supplier audits after the Volterra recall", "supplier-audits-after-volterra", "OSAT", "Standard", "Jirapa K.", "published", "2026-09-08", "supplier audit"),
            Seed("a4", "Five questions to ask before moving an SMT line", "questions-before-moving-an-smt-line", "PCBA and box build", "Listicle", "Northlight SEO", "scheduled", "2026-09-04", "smt line relocation", "2026-09-22T09:00"),
            Seed("a5", "Scope 2 emissions at a contract manufacturer, honestly accounted", "scope-2-emissions-contract-manufacturing", "Automation and smart manufacturing", "Standard", "Jirapa K.", "published", "2026-08-28", "scope 2 emissions"),
            Seed("a6", "NordicSense opens a test cell on our Lamphun campus", "nordicsense-test-cell-lamphun", "Industrial and IoT", "Announcement", "Jirapa K.", "published", "2026-08-21", "test engineering"),
            Seed("a7", "Humidity, warpage and the boards nobody wants in July", "humidity-warpage-pcb-assembly", "PCBA and box build", "Standard", "Hana Engineering Team", "review", "2026-08-14", "pcb warpage"),
            Seed("a8", "A plain explanation of lead times in microelectronics", "lead-times-in-microelectronics", "DFX and JDM", "Standard", "Northlight SEO", "draft", "2026-08-06", "component lead times"),
            Seed("a9", "Why medical sensor builds move to Southeast Asia", "medical-sensor-builds-southeast-asia", "Medical", "Standard", "Jirapa K.", "archived", "2026-07-30", "medical sensor manufacturing")
        };

        /// <param name="modifiedOn">ISO yyyy-MM-dd; the display string is derived from it.</param>
        private static Article Seed(string id, string title, string slug, string category, string ctype,
                                    string author, string status, string modifiedOn, string keyphrase, string? scheduled = null) =>
            new()
            {
                Id = id, Title = title, Slug = slug, Category = category, ContentType = ctype,
                Author = author, Status = status,
                ModifiedOn = modifiedOn, ModifiedAt = Display(modifiedOn),
                PrimaryKeyphrase = keyphrase,
                ScheduledFor = scheduled,
                MetaTitle = title + " | Hana",
                Summary = "",
                BodyHtml = "",
                BuyerType = "Technical",
                Audit = new() { new AuditEntry { When = Display(modifiedOn), What = "Last edited by " + author } }
            };

        /// <summary>yyyy-MM-dd to "15 Sep 2026" for display.</summary>
        public static string Display(string iso) =>
            System.DateTime.TryParse(iso, out var d) ? d.ToString("dd MMM yyyy") : iso;

        public static Article? Find(string? id) => All.FirstOrDefault(a => a.Id == id);

        public static int CountByStatus(string status) => All.Count(a => a.Status == status);

        /// <summary>Highest existing id + 1, so a deletion cannot cause a collision.</summary>
        public static string NextId()
        {
            var highest = All
                .Select(a => int.TryParse(a.Id.TrimStart('a'), out var n) ? n : 0)
                .DefaultIfEmpty(0)
                .Max();
            return "a" + (highest + 1);
        }

        public static IEnumerable<Article> Related(Article a) =>
            a.RelatedIds.Select(Find).Where(x => x != null)!;
    }
}

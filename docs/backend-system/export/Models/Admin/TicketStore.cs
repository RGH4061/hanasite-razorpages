using System.Collections.Generic;
using System.Linq;

namespace HanaSite.Models.Admin
{
    /// <summary>
    /// In-memory seed store for the prototype export. In the merged site this
    /// is replaced by the real data layer (EF Core / repository) — the page
    /// handlers only depend on the Find / mutate surface below.
    /// All sample companies, contacts and messages are invented.
    /// </summary>
    public static class TicketStore
    {
        public static readonly List<string> Owners = new() { "Sanjay", "Mark", "Thang", "Rupert" };

        /// <summary>Mailbox per team member — the assignment summary is sent here.</summary>
        public static readonly Dictionary<string, string> OwnerMailboxes = new()
        {
            ["Sanjay"] = "sanjay.p@hanagroup.com",
            ["Mark"] = "mark.t@hanagroup.com",
            ["Thang"] = "thang.n@hanagroup.com",
            ["Rupert"] = "rupert.h@hanagroup.com"
        };

        public static string MailboxFor(string owner) =>
            OwnerMailboxes.TryGetValue(owner, out var mail) ? mail : owner.ToLowerInvariant() + "@hanagroup.com";

        public static List<Ticket> All { get; } = Seed();

        public static Ticket? Find(string id) => All.FirstOrDefault(t => t.Id == id);

        public static IEnumerable<Ticket> Open =>
            All.Where(t => t.IsOpen && !t.IsSupplier)
               .OrderByDescending(t => t.Date).ThenByDescending(t => t.Time);

        // Supplier / vendor offers — parts, tooling, equipment, services.
        // Routed to procurement, so they are kept out of the sales queues.
        public static IEnumerable<Ticket> Supplier =>
            All.Where(t => t.IsSupplier && t.Status != "spam")
               .OrderByDescending(t => t.Date).ThenByDescending(t => t.Time);

        public static IEnumerable<Ticket> Closed =>
            All.Where(t => t.Status == "closed" && !t.IsSupplier)
               .OrderByDescending(t => t.ClosedDate);

        public static IEnumerable<Ticket> Spam =>
            All.Where(t => t.Status == "spam")
               .OrderByDescending(t => t.SpamDate);

        private static List<Ticket> Seed() => new()
        {
            new Ticket {
                Id = "t6", Status = "new", Date = "2026-05-10", Time = "10:05",
                Name = "James Whitfield", Company = "Meridian Capital · UK",
                Reason = "Investor relations", Source = "/about/",
                Email = "j.whitfield@meridiancap.co.uk", Phone = "+44 20 7946 0312",
                Address = "Meridian Capital Partners, London, UK",
                Message = "I am a portfolio analyst at Meridian Capital in London. We have been following Hana Microelectronics Group on the Stock Exchange of Thailand and are interested in requesting the latest annual report and any available investor presentation materials. Could you also advise on the best point of contact for investor relations inquiries going forward?"
            },
            new Ticket {
                Id = "t1", Status = "new", Date = "2026-05-09", Time = "09:42",
                Name = "Karl Becker", Company = "SchliessTech GmbH · Germany",
                Market = "Access Control", Service = "RFID & Smart Tags", Source = "/capabilities/rfid-inlay/",
                Email = "karl.becker@schliesst.de", Phone = "+49 89 4521 7730",
                Address = "SchliessTech GmbH, Munich, Germany",
                Message = "We are currently evaluating suppliers for a new access control product line using RFID technology. Our estimated annual volume is 50,000 units initially, scaling to 150,000 within 18 months. I can send our preliminary BOM once we have a contact. Could you confirm your RFID inlay capabilities and typical lead times? We'd like to arrange a call next week if possible."
            },
            new Ticket {
                Id = "t2", Status = "new", Date = "2026-05-09", Time = "08:15",
                Name = "Anita Patel", Company = "Helios Medical Devices · UK",
                Market = "Medical", Service = "PCBA & Box Build", Reason = "Sales & customer support", Source = "/markets/medical/",
                Email = "a.patel@heliosmed.co.uk", Phone = "+44 7712 334 890",
                Address = "Helios Medical Devices Ltd, Bristol, UK",
                Message = "Hi, I came across Hana via a recommendation from a colleague. We're a UK-based medical device startup looking for an EMS partner for our first production run — approximately 500 units of a wearable patient monitoring device. Could you tell me more about your medical PCBA capabilities and whether you hold ISO 13485 certification?"
            },
            new Ticket {
                Id = "t3", Status = "claimed", Date = "2026-05-08", Time = "16:30", Owner = "Sanjay",
                Name = "Pierre Lambert", Company = "Volterra Mobility · France",
                Market = "Automotive", Service = "IC Assembly & Test (OSAT)", Source = "/capabilities/ic-assembly/",
                Email = "p.lambert@volterra-mobility.fr", Phone = "+33 1 44 82 3300",
                Address = "Volterra Mobility SAS, Paris, France",
                NotifiedName = "Sanjay", NotifiedEmail = "sanjay.p@hanagroup.com", NotifiedAt = "2026-05-08 16:31",
                NotifiedSubject = "[T3] Pierre Lambert · Volterra Mobility · France",
                Message = "We are a French EV mobility company looking for an OSAT partner to support our power module assembly. We currently use a European supplier but need to diversify our manufacturing base. Annual volume is approximately 200,000 units. We can share our initial product specs, preferred test protocols, and a draft supply agreement."
            },
            new Ticket {
                Id = "t4", Status = "claimed", Date = "2026-05-08", Time = "11:02", Owner = "Mark",
                Name = "Lisa Andersson", Company = "NordicSense AB · Sweden",
                Market = "Optical & Sensors", Service = "Sensors & Optical", Reason = "Capability / technical question", Source = "/markets/optical-sensors/",
                Email = "lisa.andersson@nordicsense.se", Phone = "+46 8 555 7842",
                Address = "NordicSense AB, Stockholm, Sweden",
                NotifiedName = "Mark", NotifiedEmail = "mark.t@hanagroup.com", NotifiedAt = "2026-05-08 11:04",
                NotifiedSubject = "[T4] Lisa Andersson · NordicSense AB · Sweden",
                Message = "We design optical sensor modules for industrial inspection systems and are looking for a manufacturing partner in Asia who can support low to medium volume production with high accuracy requirements. We'd be interested in learning more about Hana's Sensors & Optical capabilities and experience with camera module assembly."
            },
            new Ticket {
                Id = "t5", Status = "responded", Date = "2026-05-07", Time = "14:18", Owner = "Rupert",
                Name = "Diego Ferreira", Company = "Iberian IoT · Portugal",
                Market = "Industrial & IoT", Service = "PCBA & Box Build", Source = "/capabilities/pcba/",
                Email = "d.ferreira@iberian-iot.pt", Phone = "+351 21 300 4420",
                Address = "Iberian IoT Lda, Lisbon, Portugal",
                NotifiedName = "Rupert", NotifiedEmail = "rupert.h@hanagroup.com", NotifiedAt = "2026-05-07 14:20",
                NotifiedSubject = "[T5] Diego Ferreira · Iberian IoT · Portugal",
                Message = "Following our initial conversation last week, I wanted to formally submit our inquiry for review. As discussed, we need PCBA assembly for our industrial IoT gateway — 2,000 units in the first run with a target of 10,000 per year. We have the Gerber files and BOM ready to send. Please confirm receipt and advise on next steps."
            },
            new Ticket {
                Id = "c1", Status = "closed", Date = "2026-05-02", Time = "10:11", Owner = "Sanjay",
                Name = "Hannah Müller", Company = "KeyLogic Systems · Germany",
                Market = "Access Control", Service = "RFID & Smart Tags", Source = "/capabilities/rfid-inlay/",
                ClosedDate = "2026-05-06", ClosedBy = "Sanjay", RoutedTo = "Lamphun PCBA team",
                Email = "h.muller@keylogic.de", Address = "KeyLogic Systems, Berlin, Germany",
                Message = "We are looking for a manufacturer to support a new RFID-enabled access control reader. Volumes are 30,000 units per year. We can send the product brief and preliminary BOM."
            },
            new Ticket {
                Id = "c2", Status = "closed", Date = "2026-05-01", Time = "09:30", Owner = "Mark",
                Name = "Tomás Silva", Company = "DriveCircuit Ltd · UK",
                Market = "Automotive", Service = "PCBA & Box Build", Reason = "Sales & customer support", Source = "/markets/automotive/",
                ClosedDate = "2026-05-05", ClosedBy = "Mark", RoutedTo = "Jiaxing (China) team",
                Email = "t.silva@drivecircuit.co.uk", Address = "DriveCircuit Ltd, Birmingham, UK",
                Message = "General question about Hana's automotive PCBA capabilities. We're a UK electronics company with a new EV charging controller design and are exploring manufacturing options in Asia."
            },
            new Ticket {
                Id = "c3", Status = "closed", Date = "2026-04-29", Time = "15:47", Owner = "Rupert",
                Name = "Sara Lindqvist", Company = "Aurora Imaging · Sweden",
                Market = "Optical & Sensors", Service = "Sensors & Optical", Source = "/capabilities/sensors/",
                ClosedDate = "2026-05-03", ClosedBy = "Rupert", RoutedTo = "Ayutthaya (Thailand)",
                Email = "s.lindqvist@aurora-imaging.se", Address = "Aurora Imaging AB, Gothenburg, Sweden",
                Message = "We design camera modules for industrial inspection and are looking for a manufacturing partner. Volume is small initially — 500 units — but we expect to scale to 5,000+ within two years."
            },
            new Ticket {
                Id = "v1", Kind = "supplier", Status = "new", Date = "2026-05-09", Time = "13:20",
                Name = "Wanchai Rattanakorn", Company = "Thai Precision Tooling · Thailand",
                Reason = "Supplier / vendor inquiry", Source = "/contact/",
                Email = "wanchai@thaiprecision.example", Phone = "+66 38 771 220",
                Address = "Thai Precision Tooling Co., Chonburi, Thailand",
                Message = "We manufacture precision jigs and fixtures in Chonburi and would like to be considered as a tooling supplier for your Lamphun and Ayutthaya plants. We hold ISO 9001 and already supply two other electronics manufacturers in Thailand. I can send our capability statement and a list of the machines on our floor."
            },
            new Ticket {
                Id = "v2", Kind = "supplier", Status = "new", Date = "2026-05-08", Time = "09:05",
                Name = "Grace Lim", Company = "Eastgate Components · Singapore",
                Reason = "Supplier / vendor inquiry", Source = "/contact/",
                Email = "g.lim@eastgatecomp.example", Phone = "+65 6221 8830",
                Address = "Eastgate Components Pte Ltd, Singapore",
                Message = "We are an authorized distributor for several passive component and connector lines across Southeast Asia. I wanted to introduce ourselves as a second source for your Thailand plants, particularly where allocation is tight. Happy to share our franchise line card and current stock positions."
            },
            new Ticket {
                Id = "v3", Kind = "supplier", Status = "claimed", Date = "2026-05-06", Time = "15:40", Owner = "Thang",
                Name = "Ruben Ortiz", Company = "Vertex Test Systems · Malaysia",
                Reason = "Supplier / vendor inquiry", Source = "/contact/",
                Email = "r.ortiz@vertextest.example", Phone = "+60 4 226 7710",
                Address = "Vertex Test Systems Sdn Bhd, Penang, Malaysia",
                NotifiedName = "Thang", NotifiedEmail = "thang.n@hanagroup.com", NotifiedAt = "2026-05-06 15:42",
                NotifiedSubject = "[V3] Ruben Ortiz · Vertex Test Systems · Malaysia",
                Message = "We supply and service test handlers and ATE interface hardware from Penang. We understand Hana runs test operations in Thailand and China and would like to discuss a preventive maintenance agreement, along with spare handler capacity we can offer at short notice."
            },
            new Ticket {
                Id = "v4", Kind = "supplier", Status = "closed", Date = "2026-04-30", Time = "11:26", Owner = "Thang",
                Name = "Kanya Srisuk", Company = "Siam Packaging Group · Thailand",
                Reason = "Supplier / vendor inquiry", Source = "/contact/",
                ClosedDate = "2026-05-04", ClosedBy = "Thang", RoutedTo = "Procurement — Bangkok",
                Email = "kanya@siampackaging.example", Phone = "+66 2 660 4412",
                Address = "Siam Packaging Group, Bangkok, Thailand",
                Message = "Following up on our quotation for ESD trays and moisture barrier bags. We have sent revised pricing for the twelve-month volume discussed and can hold it until the end of the quarter. Please let me know if you need samples before deciding."
            },
            new Ticket {
                Id = "s1", Status = "spam", Date = "2026-05-07", Time = "03:14",
                Name = "(honeypot triggered)", Company = "—",
                SpamDate = "2026-05-07", FlaggedBy = "auto-flagged", Auto = true,
                Message = "No message stored — bot submission detected at ingestion.",
                Footer = "IP: 185.220.101.47 · 2026-05-07 03:14 UTC"
            },
            new Ticket {
                Id = "s2", Status = "spam", Date = "2026-05-05", Time = "12:40",
                Name = "SEO services offer", Company = "unknowndomain.biz",
                SpamDate = "2026-05-05", FlaggedBy = "Sanjay", Owner = "Sanjay",
                Email = "info@unknowndomain.biz", Address = "Marked spam by Sanjay · 2026-05-05",
                Message = "Hi, I noticed your website could benefit from our premium SEO services. We can get you to the top of Google in 30 days — guaranteed. Please reply for a free audit."
            }
        };
    }
}

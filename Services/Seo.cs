// =============================================================
//  Services/Seo.cs — search and AI-search metadata for every page
//
//  _Layout.cshtml calls Seo.ForPage() once per request. It returns the
//  canonical URL, hreflang pairs, Open Graph values and one JSON-LD graph
//  (organization, website, web page, breadcrumb trail and FAQ questions).
//  Program.cs maps /sitemap.xml to Seo.SitemapXml().
//
//  Everything is derived from the page as rendered — its route, ViewData
//  and its own FAQ markup — so the structured data cannot drift away from
//  the visible copy. A page only needs ViewData overrides for exceptions:
//    ViewData["Canonical"]  full canonical URL (default: this route)
//    ViewData["Robots"]     e.g. "noindex" (default: none, or NoIndex below)
//    ViewData["OgImage"]    share image path (default: first content photo)
// =============================================================

using System.Net;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Routing;

namespace HanaSite.Services;

public static class Seo
{
    public const string SiteUrl = "https://www.hanagroup.com";
    public const string SiteName = "Hana Microelectronics";
    public const string DefaultDescription =
        "Hana Microelectronics provides EMS and semiconductor assembly and test (OSAT) from plants in Thailand, China, Cambodia and the USA.";

    const string OrgId = SiteUrl + "/#organization";
    const string WebsiteId = SiteUrl + "/#website";
    const string DefaultImage = "/images/photos/hp-hero-poster.webp";

    // Routes kept out of search indexes and out of sitemap.xml.
    public static readonly HashSet<string> NoIndex = new(StringComparer.OrdinalIgnoreCase)
    {
        "/search",
        "/locations/cheongju",   // dormant since 20 Aug 2026: not linked, not indexed
        "/insights/automotive-pcba-assembly",   // draft example (tracker); to be rewritten as an IATF 16949 explainer
    };

    // Visible names of section pages, used for the breadcrumb trail of the pages below them.
    static readonly Dictionary<string, string> SectionNames = new(StringComparer.OrdinalIgnoreCase)
    {
        ["/about"] = "About",
        ["/capabilities"] = "Capabilities",
        ["/capabilities/automation"] = "Automation & Smart Manufacturing",
        ["/capabilities/dfx-jdm"] = "DFx & JDM Collaboration",
        ["/capabilities/microelectronic-assembly"] = "Microelectronic Assembly",
        ["/capabilities/osat"] = "OSAT & IC Packaging",
        ["/capabilities/pcba-box-build"] = "PCBA & Box Build",
        ["/careers"] = "Careers",
        ["/contact"] = "Contact",
        ["/insights"] = "Insights",
        ["/investor-relations"] = "Investor Relations",
        ["/locations"] = "Locations",
        ["/markets"] = "Markets",
        ["/markets/access-control"] = "Access Control",
        ["/markets/automotive"] = "Automotive",
        ["/markets/consumer"] = "Consumer Electronics",
        ["/markets/data-centers"] = "Data Centers",
        ["/markets/industrial-iot"] = "Industrial & IoT",
        ["/markets/medical"] = "Medical",
        ["/markets/optical-sensors"] = "Optical & Sensors",
        ["/markets/power-management"] = "Power Management",
        ["/markets/rfid"] = "RFID",
        ["/markets/telecom"] = "Telecommunications",
        ["/th/careers"] = "ร่วมงานกับเรา",
        ["/th/investor-relations"] = "นักลงทุนสัมพันธ์",
    };

    public sealed class PageMeta
    {
        public string Canonical { get; init; } = "";
        public string? Robots { get; init; }
        public IReadOnlyList<(string Lang, string Href)> Alternates { get; init; } = Array.Empty<(string, string)>();
        public string OgType { get; init; } = "website";
        public string OgTitle { get; init; } = "";
        public string OgImage { get; init; } = "";
        public string OgLocale { get; init; } = "en_US";
        public string JsonLd { get; init; } = "";
    }

    // ---------------------------------------------------------------- per page

    public static PageMeta ForPage(HttpContext http, string? shortTitle, string fullTitle, string description,
        string? canonical, string? robots, string? ogImage, string lang,
        string bodyHtml, string headHtml, IEnumerable<EndpointDataSource> sources)
    {
        var path = Normalize(http.Request.Path.Value);
        var routes = RouteSet(sources);
        var url = canonical ?? Abs(path);
        var name = PageName(shortTitle ?? fullTitle);

        // A page that writes its own robots or hreflang tags keeps them.
        if (robots == null && NoIndex.Contains(path) && !headHtml.Contains("name=\"robots\"")) robots = "noindex";
        if (headHtml.Contains("name=\"robots\"")) robots = null;
        var alternates = headHtml.Contains("hreflang=") ? new List<(string, string)>() : Alternates(path, routes);

        var image = Abs(ogImage ?? FirstContentImage(bodyHtml) ?? DefaultImage);

        return new PageMeta
        {
            Canonical = url,
            Robots = robots,
            Alternates = alternates,
            OgType = path.StartsWith("/insights/", StringComparison.OrdinalIgnoreCase) ? "article" : "website",
            OgTitle = name,
            OgImage = image,
            OgLocale = lang == "th" ? "th_TH" : "en_US",
            JsonLd = Graph(path, url, name, description, lang, image, bodyHtml, headHtml, routes),
        };
    }

    public static string ToHtml(IHtmlContent? content)
    {
        if (content == null) return "";
        using var sw = new StringWriter();
        content.WriteTo(sw, HtmlEncoder.Default);
        return sw.ToString();
    }

    // ---------------------------------------------------------------- JSON-LD

    static string Graph(string path, string url, string name, string description, string lang, string image,
        string bodyHtml, string headHtml, HashSet<string> routes)
    {
        var isHome = path is "/" or "/th";
        var graph = new JsonArray
        {
            isHome || path == "/about" ? Organization()
                : new JsonObject { ["@type"] = "Corporation", ["@id"] = OrgId, ["name"] = SiteName, ["url"] = SiteUrl + "/" },
            Website(isHome),
        };

        var type = isHome ? "WebPage"
            : path.StartsWith("/about", StringComparison.OrdinalIgnoreCase) ? "AboutPage"
            : path.StartsWith("/contact", StringComparison.OrdinalIgnoreCase) ? "ContactPage"
            : SectionNames.ContainsKey(path) ? "CollectionPage"
            : "WebPage";

        var page = new JsonObject
        {
            ["@type"] = type,
            ["@id"] = url + "#webpage",
            ["url"] = url,
            ["name"] = name,
            ["description"] = description,
            ["inLanguage"] = lang,
            ["isPartOf"] = new JsonObject { ["@id"] = WebsiteId },
            ["publisher"] = new JsonObject { ["@id"] = OrgId },
            ["primaryImageOfPage"] = new JsonObject { ["@type"] = "ImageObject", ["url"] = image },
        };

        // FAQ questions come from the page's own FAQ markup. Pages that still carry a
        // hand-written FAQPage block (Insights articles) keep theirs instead.
        var faqs = headHtml.Contains("FAQPage") ? new List<(string, string)>() : Faqs(bodyHtml);
        if (faqs.Count > 0)
        {
            page["@type"] = type == "WebPage" ? (JsonNode)"FAQPage" : new JsonArray(type, "FAQPage");
            var questions = new JsonArray();
            foreach (var (q, a) in faqs)
                questions.Add(new JsonObject
                {
                    ["@type"] = "Question",
                    ["name"] = q,
                    ["acceptedAnswer"] = new JsonObject { ["@type"] = "Answer", ["text"] = a },
                });
            page["mainEntity"] = questions;
        }

        if (Plant(path) is { } plant) page["about"] = plant;

        // Each capability page describes one manufacturing service that Hana provides.
        if (path.StartsWith("/capabilities/", StringComparison.OrdinalIgnoreCase)
            && !SectionNames.ContainsKey(path) && path != "/capabilities/osat/package-finder")
        {
            graph.Add(new JsonObject
            {
                ["@type"] = "Service",
                ["@id"] = url + "#service",
                ["name"] = name,
                ["serviceType"] = name,
                ["description"] = description,
                ["provider"] = new JsonObject { ["@id"] = OrgId },
                ["url"] = url,
            });
            page["about"] = new JsonObject { ["@id"] = url + "#service" };
        }

        if (!isHome && !headHtml.Contains("BreadcrumbList"))
        {
            var crumbs = Breadcrumbs(path, name, routes);
            if (crumbs.Count > 1)
            {
                page["breadcrumb"] = new JsonObject { ["@id"] = url + "#breadcrumb" };
                graph.Add(new JsonObject
                {
                    ["@type"] = "BreadcrumbList",
                    ["@id"] = url + "#breadcrumb",
                    ["itemListElement"] = crumbs,
                });
            }
        }

        graph.Add(page);
        var root = new JsonObject { ["@context"] = "https://schema.org", ["@graph"] = graph };
        // The default encoder escapes < > & ' so the JSON is safe inside a <script> element.
        return root.ToJsonString(new JsonSerializerOptions { Encoder = JavaScriptEncoder.Default });
    }

    static JsonObject Organization() => new()
    {
        ["@type"] = "Corporation",
        ["@id"] = OrgId,
        ["name"] = SiteName,
        ["legalName"] = "Hana Microelectronics Public Company Limited",
        ["alternateName"] = new JsonArray("Hana", "Hana Group", "HANA"),
        ["url"] = SiteUrl + "/",
        ["logo"] = new JsonObject { ["@type"] = "ImageObject", ["url"] = SiteUrl + "/images/hana-logo-full.svg" },
        ["description"] = "Electronics manufacturing services (EMS) and outsourced semiconductor assembly and test (OSAT) company, founded in Bangkok in 1978 and listed on the Stock Exchange of Thailand since 1993, with manufacturing plants in Thailand, China, Cambodia and the USA.",
        ["foundingDate"] = "1978",
        ["foundingLocation"] = new JsonObject { ["@type"] = "Place", ["name"] = "Bangkok, Thailand" },
        ["tickerSymbol"] = "SET HANA",
        ["numberOfEmployees"] = new JsonObject { ["@type"] = "QuantitativeValue", ["value"] = 7500 },
        ["address"] = new JsonObject
        {
            ["@type"] = "PostalAddress",
            ["streetAddress"] = "65/98 Soi Vibhavadi-Rangsit 64 Junction 2, Kwang Talad Bangkhen, Khet Laksi",
            ["addressLocality"] = "Bangkok",
            ["postalCode"] = "10210",
            ["addressCountry"] = "TH",
        },
        ["telephone"] = "+66 2 551 1297",
        ["contactPoint"] = new JsonArray(
            new JsonObject { ["@type"] = "ContactPoint", ["contactType"] = "sales", ["url"] = SiteUrl + "/contact", ["availableLanguage"] = new JsonArray("en", "th") },
            new JsonObject { ["@type"] = "ContactPoint", ["contactType"] = "investor relations", ["url"] = SiteUrl + "/investor-relations/contact" }),
        ["sameAs"] = new JsonArray(
            "https://www.linkedin.com/company/hana-microelectronics/",
            "https://market.sec.or.th/public/idisc/en/companyprofile/listed/HANA"),
        ["knowsAbout"] = new JsonArray(
            "Electronics manufacturing services (EMS)", "Printed circuit board assembly (PCBA)", "Box build assembly",
            "Outsourced semiconductor assembly and test (OSAT)", "IC packaging", "System in package (SiP)",
            "Flip chip assembly", "Chip on board (COB)", "Wafer level packaging (WLCSP)", "MEMS and sensor assembly",
            "Hermetic and ceramic packaging", "Power module packaging (IGBT, SiC and GaN)", "RFID inlays and tags",
            "Design for manufacturability (DFM)"),
        ["subOrganization"] = new JsonArray(
            new JsonObject { ["@type"] = "Organization", ["name"] = "Hana Semiconductor (Ayutthaya) Co., Ltd.", ["url"] = SiteUrl + "/locations/ayutthaya" },
            new JsonObject { ["@type"] = "Organization", ["name"] = "Hana Technologies, Inc.", ["url"] = SiteUrl + "/locations/ohio" }),
        ["location"] = new JsonArray(Plants.Keys.Select(k => (JsonNode?)Plant(k)).ToArray()),
    };

    static JsonObject Website(bool withSearch)
    {
        var site = new JsonObject
        {
            ["@type"] = "WebSite",
            ["@id"] = WebsiteId,
            ["url"] = SiteUrl + "/",
            ["name"] = SiteName,
            ["publisher"] = new JsonObject { ["@id"] = OrgId },
            ["inLanguage"] = new JsonArray("en", "th"),
        };
        if (withSearch)
            site["potentialAction"] = new JsonObject
            {
                ["@type"] = "SearchAction",
                ["target"] = new JsonObject { ["@type"] = "EntryPoint", ["urlTemplate"] = SiteUrl + "/search?q={search_term_string}" },
                ["query-input"] = "required name=search_term_string",
            };
        return site;
    }

    // Plant pages describe one manufacturing site each.
    static readonly Dictionary<string, (string Name, string? Street, string? Locality, string Region, string? Postcode, string Country)> Plants = new()
    {
        ["/locations/lamphun"] = ("Hana Microelectronics, Lamphun plant", "Northern Region Industrial Estate", "Lamphun", "Lamphun", null, "TH"),
        ["/locations/ayutthaya"] = ("Hana Semiconductor (Ayutthaya), Ayutthaya plant", "Hi-Tech Industrial Estate, Bang Pa-in", "Bang Pa-in", "Ayutthaya", null, "TH"),
        ["/locations/jiaxing"] = ("Hana Microelectronics, Jiaxing plant", null, "Jiaxing", "Zhejiang", null, "CN"),
        ["/locations/koh-kong"] = ("Hana Microelectronics, Koh Kong plant", null, null, "Koh Kong", null, "KH"),
        ["/locations/ohio"] = ("Hana Technologies, Ohio plant", "29000 Aurora Road", "Solon", "OH", "44139", "US"),
    };

    static JsonObject? Plant(string path)
    {
        if (!Plants.TryGetValue(path, out var p)) return null;
        var address = new JsonObject { ["@type"] = "PostalAddress" };
        if (p.Street != null) address["streetAddress"] = p.Street;
        if (p.Locality != null) address["addressLocality"] = p.Locality;
        address["addressRegion"] = p.Region;
        if (p.Postcode != null) address["postalCode"] = p.Postcode;
        address["addressCountry"] = p.Country;
        return new JsonObject
        {
            ["@type"] = "Place",
            ["@id"] = Abs(path) + "#plant",
            ["name"] = p.Name,
            ["url"] = Abs(path),
            ["address"] = address,
        };
    }

    static JsonArray Breadcrumbs(string path, string name, HashSet<string> routes)
    {
        var thai = path == "/th" || path.StartsWith("/th/", StringComparison.OrdinalIgnoreCase);
        var list = new JsonArray { Crumb(1, thai ? "หน้าแรก" : "Home", Abs(thai ? "/th" : "/")) };
        var segments = path.Trim('/').Split('/');
        var prefix = "";
        for (var i = 0; i < segments.Length - 1; i++)
        {
            prefix += "/" + segments[i];
            if (prefix == "/th" || !routes.Contains(prefix) || !SectionNames.TryGetValue(prefix, out var section)) continue;
            list.Add(Crumb(list.Count + 1, section, Abs(prefix)));
        }
        list.Add(Crumb(list.Count + 1, SectionNames.TryGetValue(path, out var own) ? own : name, Abs(path)));
        return list;
    }

    static JsonObject Crumb(int position, string name, string url) => new()
    {
        ["@type"] = "ListItem",
        ["position"] = position,
        ["name"] = name,
        ["item"] = url,
    };

    // ---------------------------------------------------------------- FAQ markup

    // The site has four FAQ patterns: <details> blocks whose class contains "faq"
    // (Markets, Capabilities, Investor FAQ), unclassed <details> inside an Insights
    // ".ins-faq" section, and the Automotive accordion (h3.qt + div.panel).
    static readonly Regex DetailsRx = new(@"<details\b([^>]*)>(.*?)</details>", RegexOptions.Singleline | RegexOptions.IgnoreCase | RegexOptions.Compiled);
    static readonly Regex SummaryRx = new(@"<summary\b[^>]*>(.*?)</summary>(.*)", RegexOptions.Singleline | RegexOptions.IgnoreCase | RegexOptions.Compiled);
    static readonly Regex MarkerRx = new(@"<span\b[^>]*class=""[^""]*(?:-mk|chev)[^""]*""[^>]*>.*?</span>", RegexOptions.Singleline | RegexOptions.IgnoreCase | RegexOptions.Compiled);
    static readonly Regex AutoFaqRx = new(@"<h3 class=""qt"">(.*?)</h3>.*?<div class=""panel"">(.*?)</div>", RegexOptions.Singleline | RegexOptions.Compiled);
    static readonly Regex BlockEndRx = new(@"</(?:p|li|div|h\d)>|<br\s*/?>", RegexOptions.IgnoreCase | RegexOptions.Compiled);
    static readonly Regex TagRx = new(@"<[^>]+>", RegexOptions.Compiled);
    static readonly Regex SpaceRx = new(@"\s+", RegexOptions.Compiled);
    static readonly Regex ImgRx = new(@"<img\b[^>]*>", RegexOptions.IgnoreCase | RegexOptions.Compiled);
    static readonly Regex SrcRx = new(@"\bsrc=""(/images/[^""]+\.(?:webp|jpe?g|png))""", RegexOptions.IgnoreCase | RegexOptions.Compiled);

    static List<(string Q, string A)> Faqs(string html)
    {
        var list = new List<(string, string)>();
        var insStart = html.IndexOf("class=\"ins-faq\"", StringComparison.Ordinal);
        var insEnd = insStart < 0 ? -1 : html.IndexOf("</section>", insStart, StringComparison.Ordinal);
        if (insStart >= 0 && insEnd < 0) insEnd = html.Length;

        foreach (Match m in DetailsRx.Matches(html))
        {
            var isFaq = m.Groups[1].Value.Contains("faq", StringComparison.OrdinalIgnoreCase)
                        || (insStart >= 0 && m.Index > insStart && m.Index < insEnd);
            if (!isFaq) continue;
            var s = SummaryRx.Match(m.Groups[2].Value);
            if (s.Success) Add(list, Text(MarkerRx.Replace(s.Groups[1].Value, "")), Text(s.Groups[2].Value));
        }
        foreach (Match m in AutoFaqRx.Matches(html))
            Add(list, Text(m.Groups[1].Value), Text(m.Groups[2].Value));
        return list;
    }

    static void Add(List<(string, string)> list, string q, string a)
    {
        // Placeholder answers are not published as structured data.
        if (q.Length < 8 || a.Length < 2 || a.StartsWith("[Placeholder]", StringComparison.OrdinalIgnoreCase)) return;
        if (list.Any(x => x.Item1 == q)) return;
        list.Add((q, a));
    }

    static string Text(string html) =>
        SpaceRx.Replace(WebUtility.HtmlDecode(TagRx.Replace(BlockEndRx.Replace(html, " "), "")), " ").Trim();

    // The first photo on the page that is not decoration (alt="" or aria-hidden), a logo, an icon or a partner logo.
    static string? FirstContentImage(string html)
    {
        foreach (Match m in ImgRx.Matches(html))
        {
            var tag = m.Value;
            var src = SrcRx.Match(tag);
            if (!src.Success || tag.Contains("aria-hidden=\"true\"") || tag.Contains("alt=\"\"")) continue;
            var path = src.Groups[1].Value;
            if (!path.Contains("logo", StringComparison.OrdinalIgnoreCase) && !path.Contains("icon", StringComparison.OrdinalIgnoreCase)
                && !path.Contains("/partners/", StringComparison.OrdinalIgnoreCase))
                return path;
        }
        return null;
    }

    // ---------------------------------------------------------------- routes, hreflang, sitemap

    public static string Normalize(string? path) =>
        string.IsNullOrEmpty(path) || path == "/" ? "/" : path.TrimEnd('/').ToLowerInvariant();

    static string Abs(string pathOrUrl) =>
        pathOrUrl.StartsWith("http", StringComparison.OrdinalIgnoreCase) ? pathOrUrl : SiteUrl + (pathOrUrl.StartsWith('/') ? pathOrUrl : "/" + pathOrUrl);

    // "RF Modules & Power Amplifiers | Telecommunications" -> "RF Modules & Power Amplifiers"
    static string PageName(string title)
    {
        var bar = title.IndexOf(" | ", StringComparison.Ordinal);
        return (bar > 0 ? title[..bar] : title).Trim();
    }

    public static HashSet<string> RouteSet(IEnumerable<EndpointDataSource> sources)
    {
        var set = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var e in sources.SelectMany(s => s.Endpoints).OfType<RouteEndpoint>())
        {
            var raw = e.RoutePattern.RawText;
            if (raw == null || raw.Contains('{') || raw.Contains('.')) continue;
            var route = Normalize("/" + raw.Trim('/'));
            // Razor Pages also registers "/Index" aliases for index pages.
            if (route.EndsWith("/index", StringComparison.OrdinalIgnoreCase) || route.StartsWith("/admin", StringComparison.OrdinalIgnoreCase)) continue;
            set.Add(route);
        }
        return set;
    }

    // English and Thai twins point at each other; English is the x-default.
    public static List<(string Lang, string Href)> Alternates(string path, HashSet<string> routes)
    {
        var thai = path == "/th" || path.StartsWith("/th/", StringComparison.OrdinalIgnoreCase);
        var en = thai ? (path == "/th" ? "/" : path[3..]) : path;
        var th = path == "/" ? "/th" : thai ? path : "/th" + path;
        if (!routes.Contains(en) || !routes.Contains(th) || NoIndex.Contains(en)) return new();
        return new() { ("en", Abs(en)), ("th", Abs(th)), ("x-default", Abs(en)) };
    }

    public static string SitemapXml(IEnumerable<EndpointDataSource> sources)
    {
        var routes = RouteSet(sources);
        var sb = new StringBuilder();
        sb.Append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        sb.Append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">\n");
        foreach (var route in routes.Where(r => !NoIndex.Contains(r)).OrderBy(r => r, StringComparer.Ordinal))
        {
            sb.Append("  <url>\n    <loc>").Append(Abs(route)).Append("</loc>\n");
            foreach (var (lang, href) in Alternates(route, routes))
                sb.Append("    <xhtml:link rel=\"alternate\" hreflang=\"").Append(lang).Append("\" href=\"").Append(href).Append("\"/>\n");
            sb.Append("  </url>\n");
        }
        sb.Append("</urlset>\n");
        return sb.ToString();
    }
}

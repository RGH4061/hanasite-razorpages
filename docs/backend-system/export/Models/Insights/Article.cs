using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace HanaSite.Models.Insights
{
    public class FaqPair
    {
        public string Question { get; set; } = "";
        public string Answer { get; set; } = "";
        public int AnswerWords => Body.Words(Answer);
    }

    public class ArticleEntity
    {
        public string Name { get; set; } = "";
        public string Url { get; set; } = "";
        public bool IsWikipedia => Url.Contains("wikipedia.org", StringComparison.OrdinalIgnoreCase);
    }

    public class AuditEntry
    {
        public string When { get; set; } = "";
        public string What { get; set; } = "";
    }

    /// <summary>
    /// One insight article. Publishing state is stored (unlike careers, where it
    /// is derived) because an article moves Draft -> In review -> Published
    /// through an approval step rather than on a date.
    /// </summary>
    public class Article
    {
        public string Id { get; set; } = "";

        // Copy
        public string Title { get; set; } = "";
        public string Slug { get; set; } = "";
        public string Summary { get; set; } = "";          // key takeaways
        public string BodyHtml { get; set; } = "";

        // Classification
        public string Category { get; set; } = "";              // one of ArticleStore.Categories (market or capability page)
        public string ContentType { get; set; } = "Standard";   // Standard | Listicle | How-to | Announcement
        public string BuyerType { get; set; } = "Technical";    // EMS | Technical | Regionality
        public string? CapabilityLink { get; set; }             // /markets/... or /capabilities/...

        // Search listing
        public string MetaTitle { get; set; } = "";
        public string MetaDescription { get; set; } = "";
        public string PrimaryKeyphrase { get; set; } = "";
        public List<string> SecondaryKeyphrases { get; set; } = new();
        public string? Canonical { get; set; }

        // Media
        public string? HeroImage { get; set; }
        public string? HeroAlt { get; set; }
        public string? ShareImage { get; set; }

        // Structured pieces
        public List<FaqPair> Faq { get; set; } = new();
        public List<ArticleEntity> Entities { get; set; } = new();
        public List<string> Sources { get; set; } = new();
        public List<string> RelatedIds { get; set; } = new();
        public List<string> Tags { get; set; } = new();

        // Workflow
        public string Status { get; set; } = "draft";      // draft | review | scheduled | published | archived
        public string Author { get; set; } = "Hana Engineering Team";
        public string? ScheduledFor { get; set; }          // yyyy-MM-ddTHH:mm, Indochina Time
        public string? PublishedAt { get; set; }
        /// <summary>Sortable ISO date (yyyy-MM-dd). ModifiedAt is display only.</summary>
        public string ModifiedOn { get; set; } = "";
        public string ModifiedAt { get; set; } = "";
        public string? CreatedBy { get; set; }
        public string? SentForReviewBy { get; set; }
        public string? ApprovedBy { get; set; }
        public List<AuditEntry> Audit { get; set; } = new();

        // ── derived ─────────────────────────────────────────────
        public int WordCount => Body.Parse(BodyHtml).Words;
        public int ReadTimeMinutes => Math.Max(1, (int)Math.Ceiling(WordCount / 200.0));
        public string PublicUrl => "hanagroup.com/insights/" + Slug + "/";
        public string CanonicalOrDefault =>
            string.IsNullOrWhiteSpace(Canonical) ? "https://" + PublicUrl.TrimEnd('/') : Canonical!;

        public string StatusLabel => Status switch
        {
            "draft" => "Draft",
            "review" => "In review",
            "scheduled" => "Scheduled",
            "published" => "Published",
            "archived" => "Archived",
            _ => Status
        };

        public bool IsLive => Status == "published";

        /// <summary>Article, BreadcrumbList always; FAQPage and HowTo when they apply.</summary>
        public string StructuredDataTypes
        {
            get
            {
                var types = new List<string> { "Article", "BreadcrumbList" };
                if (Faq.Count > 0) types.Add("FAQPage");
                if (ContentType == "How-to") types.Add("HowTo");
                return string.Join(" · ", types);
            }
        }

        public string ScheduledDisplay =>
            string.IsNullOrEmpty(ScheduledFor) ? "—" : ScheduledFor!.Replace("T", " ");

        public string HaystackLower =>
            (Title + " " + Slug + " " + PrimaryKeyphrase + " " + Summary).ToLowerInvariant();
    }

    /// <summary>
    /// Body text helpers. The body is stored as simple HTML (h2/h3/p/ul/blockquote),
    /// so the checks parse it rather than re-implementing a Markdown pipeline.
    /// </summary>
    public static class Body
    {
        public static readonly string[] StopWords = { "a", "an", "the", "and", "of", "for", "to", "in" };

        public class Section
        {
            public string Heading { get; set; } = "";
            public string Text { get; set; } = "";
            public bool IsQuestion => Heading.TrimEnd().EndsWith("?");
            public int Words => Body.Words(Text);
            public string FirstSentence => Sentences(Text).FirstOrDefault() ?? "";
        }

        public class Model
        {
            public bool HasH1 { get; set; }
            public string Opening { get; set; } = "";
            public string Text { get; set; } = "";
            public List<Section> Sections { get; set; } = new();
            public List<string> Paragraphs { get; set; } = new();
            public List<(string Href, string Text)> Links { get; set; } = new();
            public List<FaqPair> FaqInBody { get; set; } = new();
            public List<string> SourceLinksInBody { get; set; } = new();
            public int Words => Body.Words(Text);
            public int OpeningWords => Body.Words(Opening);
            public Section? Closing => Sections.Count > 0 ? Sections[^1] : null;
        }

        public static int Words(string? s) =>
            string.IsNullOrWhiteSpace(s) ? 0 : Regex.Split(s.Trim(), @"\s+").Count(w => w.Length > 0);

        public static List<string> Sentences(string? s) =>
            string.IsNullOrWhiteSpace(s)
                ? new List<string>()
                : Regex.Split(s, @"(?<=[.!?])\s+").Select(x => x.Trim()).Where(x => x.Length > 0).ToList();

        public static string Strip(string html) =>
            Regex.Replace(Regex.Replace(html ?? "", "<[^>]+>", " "), @"\s+", " ").Trim();

        private static List<string> ContentWords(string phrase) =>
            Regex.Split((phrase ?? "").ToLowerInvariant().Trim(), @"\s+")
                 .Where(w => w.Length > 0 && !StopWords.Contains(w)).ToList();

        /// <summary>
        /// A phrase counts as present when it appears exactly, or when one
        /// sentence carries every content word of the phrase. Without the second
        /// rule a phrase like "flip chip assembly Thailand" never matches prose.
        /// </summary>
        public static bool PhraseIn(string? phrase, string? text)
        {
            if (string.IsNullOrWhiteSpace(phrase) || string.IsNullOrWhiteSpace(text)) return false;
            var t = text!.ToLowerInvariant();
            if (t.Contains(phrase!.ToLowerInvariant())) return true;
            var cw = ContentWords(phrase!);
            if (cw.Count == 0) return false;
            return Sentences(t).Any(s => cw.All(w => s.Contains(w)));
        }

        public static int PhraseCount(string? phrase, string? text)
        {
            if (string.IsNullOrWhiteSpace(phrase) || string.IsNullOrWhiteSpace(text)) return 0;
            return Regex.Matches(text!.ToLowerInvariant(), Regex.Escape(phrase!.ToLowerInvariant())).Count;
        }

        /// <summary>Splits stored body HTML into opening, H2 sections, FAQ zone and Sources zone.</summary>
        public static Model Parse(string? html)
        {
            var m = new Model();
            if (string.IsNullOrWhiteSpace(html)) return m;

            var blocks = Regex.Matches(html!, @"<(h1|h2|h3|p|ul|ol|blockquote|figure)\b[^>]*>(.*?)</\1>",
                                       RegexOptions.Singleline | RegexOptions.IgnoreCase);
            var zone = "body";
            Section? cur = null;

            foreach (Match b in blocks)
            {
                var tag = b.Groups[1].Value.ToLowerInvariant();
                var inner = b.Groups[2].Value;
                var text = Strip(inner);

                if (tag == "h1") { m.HasH1 = true; continue; }

                if (tag == "h2")
                {
                    var t = text.ToLowerInvariant();
                    if (Regex.IsMatch(t, "^(faq|frequently asked questions)")) { zone = "faq"; cur = null; continue; }
                    if (Regex.IsMatch(t, "^sources?$")) { zone = "sources"; cur = null; continue; }
                    zone = "body";
                    cur = new Section { Heading = text };
                    m.Sections.Add(cur);
                    continue;
                }

                if (zone == "faq")
                {
                    if (tag == "h3") m.FaqInBody.Add(new FaqPair { Question = text });
                    else if (m.FaqInBody.Count > 0)
                    {
                        var last = m.FaqInBody[^1];
                        last.Answer = string.IsNullOrEmpty(last.Answer) ? text : last.Answer + " " + text;
                    }
                    continue;
                }

                if (zone == "sources")
                {
                    foreach (Match a in Regex.Matches(inner, @"href=[""'](?<h>[^""']+)"))
                        m.SourceLinksInBody.Add(a.Groups["h"].Value);
                    continue;
                }

                if (tag == "p") m.Paragraphs.Add(text);
                foreach (Match a in Regex.Matches(inner, @"<a[^>]*href=[""'](?<h>[^""']+)[""'][^>]*>(?<t>.*?)</a>",
                                                  RegexOptions.Singleline | RegexOptions.IgnoreCase))
                    m.Links.Add((a.Groups["h"].Value, Strip(a.Groups["t"].Value)));

                if (cur == null) m.Opening += " " + text; else cur.Text += " " + text;
                m.Text += " " + text;
            }

            foreach (var s in m.Sections) m.Text += " " + s.Heading;
            m.Opening = m.Opening.Trim();
            m.Text = m.Text.Trim();
            return m;
        }

        /// <summary>Removes the FAQ zone (heading and everything under it until the next zone).</summary>
        public static string RemoveZone(string html, string zone)
        {
            if (string.IsNullOrWhiteSpace(html)) return html ?? "";
            var pattern = zone == "faq"
                ? @"<h2\b[^>]*>\s*(faq|frequently asked questions)[^<]*</h2>"
                : @"<h2\b[^>]*>\s*sources?\s*</h2>";
            var start = Regex.Match(html, pattern, RegexOptions.IgnoreCase);
            if (!start.Success) return html;

            var rest = html.Substring(start.Index + start.Length);
            var next = Regex.Match(rest, @"<h2\b", RegexOptions.IgnoreCase);
            var tail = next.Success ? rest.Substring(next.Index) : "";
            return (html.Substring(0, start.Index) + tail).Trim();
        }
    }
}

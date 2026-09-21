using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace HanaSite.Models.Insights
{
    public enum CheckLevel { Block, Warn, Auto }

    public class CheckItem
    {
        public string Label { get; set; } = "";
        public string Detail { get; set; } = "";
        public CheckLevel Level { get; set; } = CheckLevel.Warn;
        public bool Pass { get; set; }

        public string State => Pass ? "pass" : (Level == CheckLevel.Block ? "block" : "warn");
        public string Mark => Pass ? "✓" : (Level == CheckLevel.Block ? "■" : "!");
    }

    public class CheckGroup
    {
        public string Key { get; set; } = "";
        public string Label { get; set; } = "";
        public List<CheckItem> Items { get; set; } = new();

        public int Blocking => Items.Count(i => !i.Pass && i.Level == CheckLevel.Block);
        public int Warnings => Items.Count(i => !i.Pass && i.Level == CheckLevel.Warn);
        public string State => Blocking > 0 ? "block" : (Warnings > 0 ? "warn" : "pass");
        public string CountLabel => Blocking > 0
            ? Blocking + " blocking · " + Warnings + " warn"
            : (Warnings > 0 ? Warnings + " warnings" : "all passed");
    }

    public class CheckResult
    {
        public List<CheckGroup> Groups { get; set; } = new();
        public IEnumerable<CheckItem> Failed => Groups.SelectMany(g => g.Items).Where(i => !i.Pass);
        public List<CheckItem> BlockingItems => Failed.Where(i => i.Level == CheckLevel.Block).ToList();
        public int Blocking => BlockingItems.Count;
        public int Warnings => Failed.Count(i => i.Level == CheckLevel.Warn);
        public int Total => Groups.Sum(g => g.Items.Count);

        /// <summary>1 per pass, 0.5 per warning. Guidance only — it never blocks.</summary>
        public double Score => Groups.SelectMany(g => g.Items).Sum(i => i.Pass ? 1.0 : (i.Level == CheckLevel.Warn ? 0.5 : 0.0));
        public int ScorePercent => Total == 0 ? 0 : (int)Math.Round(Score / Total * 100);
        public bool CanPublish => Blocking == 0;
        public string Summary => Blocking > 0
            ? Blocking + " blocking"
            : (Warnings > 0 ? Warnings + " warnings" : "All passed");
    }

    /// <summary>
    /// The publish checklist. Runs on every editor POST and again before publish.
    /// Block = publication is refused (Save as draft still works).
    /// Warn  = shown to whoever publishes; they decide.
    /// Word lists (banned terms, customer names) are deliberately NOT here —
    /// that review happens on the writing side, outside this tool.
    /// </summary>
    public static class ArticleChecks
    {
        public static readonly Dictionary<string, (int Min, int Max)> Bands = new()
        {
            ["Standard"] = (800, 1500),
            ["Listicle"] = (1500, 2500),
            ["How-to"] = (2000, 2800),
            ["Announcement"] = (300, 500)
        };

        private static readonly string[] Openers = { "in this article", "this article explains", "in today" };
        private static readonly string[] Recaps = { "in conclusion", "in summary", "to recap", "as we've seen" };
        private static readonly string[] WeakLinks = { "click here", "learn more", "read more", "here", "this article" };

        private static CheckItem C(string label, string detail, CheckLevel level, bool pass) =>
            new() { Label = label, Detail = detail, Level = level, Pass = pass };

        public static CheckResult Run(Article a)
        {
            var m = Body.Parse(a.BodyHtml);
            var kw = a.PrimaryKeyphrase;
            var band = Bands.TryGetValue(a.ContentType, out var b) ? b : Bands["Standard"];
            var body = m.Text;
            var opening = m.Opening;
            var first100 = string.Join(" ", Regex.Split(opening, @"\s+").Take(100));
            var allSentences = Body.Sentences(body);
            var avgSentence = allSentences.Count == 0 ? 0
                : (int)Math.Round(allSentences.Average(s => Body.Words(s)));
            var kwWords = Regex.Split(kw ?? "", @"\s+").Count(w => w.Length > 0 && !Body.StopWords.Contains(w.ToLowerInvariant()));
            var density = m.Words == 0 ? 0 : Math.Round(Body.PhraseCount(kw, body) * (double)Math.Max(1, kwWords) / m.Words * 100, 2);
            var internalLinks = m.Links.Where(l => Regex.IsMatch(l.Href, @"^/(markets|capabilities)/")).ToList();
            var ctaLinks = m.Links.Where(l => l.Href.StartsWith("/contact")).ToList();
            var vague = m.Links.Where(l => WeakLinks.Contains(l.Text.ToLowerInvariant())).ToList();
            var closing = m.Closing;

            bool SentenceCase(string h) =>
                !Regex.Split(h, @"\s+").Skip(1).Any(w => Regex.IsMatch(w, "^[A-Z]{2,}"));

            var result = new CheckResult();

            result.Groups.Add(new CheckGroup { Key = "search", Label = "Search listing", Items = new()
            {
                C("Search title length", a.MetaTitle.Length + " of 60 characters", CheckLevel.Warn,
                  a.MetaTitle.Length > 0 && a.MetaTitle.Length <= 60),
                C("Key phrase in the first half of the title", string.IsNullOrEmpty(kw) ? "Set a key phrase first" : "Checked against the first half", CheckLevel.Warn,
                  !string.IsNullOrEmpty(kw) && Body.PhraseIn(kw, a.MetaTitle.Substring(0, (int)Math.Ceiling(a.MetaTitle.Length / 2.0)))),
                C("Description length", a.MetaDescription.Length + " characters · 120–155", CheckLevel.Warn,
                  a.MetaDescription.Length >= 120 && a.MetaDescription.Length <= 155),
                C("Description carries the phrases", "Key phrase and at least one secondary", CheckLevel.Warn,
                  Body.PhraseIn(kw, a.MetaDescription) && a.SecondaryKeyphrases.Any(s => Body.PhraseIn(s, a.MetaDescription))),
                C("Address format", "/insights/" + a.Slug + " · lowercase, hyphens, no trailing slash", CheckLevel.Block,
                  Regex.IsMatch(a.Slug ?? "", "^[a-z0-9]+(-[a-z0-9]+)*$")),
                C("Address carries the key phrase", "No stop words in the address", CheckLevel.Warn,
                  Body.PhraseIn(kw, (a.Slug ?? "").Replace("-", " ")) &&
                  !(a.Slug ?? "").Split('-').Any(w => Body.StopWords.Contains(w))),
                C("Share image set", string.IsNullOrEmpty(a.ShareImage) ? (string.IsNullOrEmpty(a.HeroImage) ? "Nothing to share" : "Using the hero image") : a.ShareImage!, CheckLevel.Warn,
                  !string.IsNullOrEmpty(a.ShareImage) || !string.IsNullOrEmpty(a.HeroImage)),
                C("Key takeaways written", Body.Words(a.Summary) + " words", CheckLevel.Warn, a.Summary.Length >= 60)
            }});

            result.Groups.Add(new CheckGroup { Key = "phrase", Label = "Key phrase", Items = new()
            {
                C("Key phrase set", string.IsNullOrEmpty(kw) ? "Empty" : kw, CheckLevel.Block, !string.IsNullOrEmpty(kw)),
                C("Four content words at most", kwWords + " content words", CheckLevel.Warn, kwWords > 0 && kwWords <= 4),
                C("In the headline", a.Title, CheckLevel.Warn, Body.PhraseIn(kw, a.Title)),
                C("In the first 100 words", "Opening before the first H2", CheckLevel.Warn, Body.PhraseIn(kw, first100)),
                C("In a subheading", "At least one H2", CheckLevel.Warn, m.Sections.Any(s => Body.PhraseIn(kw, s.Heading))),
                C("In the closing section", closing?.Heading ?? "No sections yet", CheckLevel.Warn,
                  closing != null && Body.PhraseIn(kw, closing.Heading + " " + closing.Text)),
                C("Secondary phrases used", a.SecondaryKeyphrases.Count + " set", CheckLevel.Warn,
                  a.SecondaryKeyphrases.Count > 0 && a.SecondaryKeyphrases.All(s => Body.PhraseIn(s, body))),
                C("Density under 2%", density + "%", CheckLevel.Warn, density <= 2)
            }});

            result.Groups.Add(new CheckGroup { Key = "structure", Label = "Structure", Items = new()
            {
                C("Word count in band", m.Words + " words · " + band.Min.ToString("N0") + "–" + band.Max.ToString("N0") + " for " + a.ContentType, CheckLevel.Warn,
                  m.Words >= band.Min && m.Words <= band.Max),
                C("Body starts at H2", m.HasH1 ? "An H1 was found in the body" : "No H1 in the body", CheckLevel.Warn, !m.HasH1),
                C("Opening length", m.OpeningWords + " words · 50–100", CheckLevel.Warn, m.OpeningWords >= 50 && m.OpeningWords <= 100),
                C("Opening wording", "No \"In this article\", \"This article explains\", \"In today's\"", CheckLevel.Warn,
                  !Openers.Any(p => opening.ToLowerInvariant().Contains(p))),
                C("No statistic in the first sentence", "Percentages and cited figures", CheckLevel.Warn,
                  !Regex.IsMatch(Body.Sentences(opening).FirstOrDefault() ?? "", @"\d+(\.\d+)?\s*%")),
                C("First H2 arrives early", "Within the first 540 words", CheckLevel.Warn, m.Sections.Count > 0 && m.OpeningWords <= 540),
                C("Section lengths", m.Sections.Count > 0 ? "120–450 words each, closing section exempt" : "No sections yet", CheckLevel.Warn,
                  m.Sections.Count > 0 && m.Sections.Take(Math.Max(0, m.Sections.Count - 1)).All(s => s.Words >= 120 && s.Words <= 450)),
                C("Section opening sentences", "30 words at most", CheckLevel.Warn, m.Sections.All(s => Body.Words(s.FirstSentence) <= 30)),
                C("One heading asks a question", m.Sections.Any(s => s.IsQuestion) ? "Found" : "None end with a question mark", CheckLevel.Warn,
                  m.Sections.Any(s => s.IsQuestion)),
                C("Headings in sentence case", "Only the first word and proper nouns", CheckLevel.Warn, m.Sections.All(s => SentenceCase(s.Heading))),
                C("Closing section length", closing != null ? closing.Words + " words · 50–100" : "No closing section", CheckLevel.Warn,
                  closing != null && closing.Words >= 50 && closing.Words <= 100),
                C("Closing does not recap", "No \"In conclusion\", \"In summary\", \"To recap\"", CheckLevel.Warn,
                  closing == null || !Recaps.Any(p => closing.Text.Trim().ToLowerInvariant().StartsWith(p)))
            }});

            result.Groups.Add(new CheckGroup { Key = "faq", Label = "FAQ", Items = new()
            {
                C("Count", a.Faq.Count + " pairs · 0, or 3 to 5", CheckLevel.Warn,
                  a.Faq.Count == 0 || (a.Faq.Count >= 3 && a.Faq.Count <= 5)),
                C("Answer length", a.Faq.Count > 0 ? "50 words at most each" : "No FAQ", CheckLevel.Warn,
                  a.Faq.All(p => p.AnswerWords <= 50)),
                C("FAQ lifted out of the body", m.FaqInBody.Count > 0 ? m.FaqInBody.Count + " questions still in the body" : "Nothing left in the body", CheckLevel.Warn,
                  m.FaqInBody.Count == 0)
            }});

            result.Groups.Add(new CheckGroup { Key = "links", Label = "Links and call to action", Items = new()
            {
                C("One internal link", internalLinks.Count + " link(s) to /markets or /capabilities", CheckLevel.Warn, internalLinks.Count == 1),
                C("Internal link target set", a.CapabilityLink ?? "Not set", CheckLevel.Warn, !string.IsNullOrEmpty(a.CapabilityLink)),
                C("Link wording", vague.Count > 0 ? "\"" + vague[0].Text + "\" is too vague" : "No vague link text", CheckLevel.Warn, vague.Count == 0),
                C("Quote links use /contact/rfq", "A bare /rfq is flagged", CheckLevel.Warn, !m.Links.Any(l => l.Href == "/rfq")),
                C("Ends with a call to action", ctaLinks.Count > 0 ? "Links to " + ctaLinks[^1].Href : "No /contact link", CheckLevel.Warn, ctaLinks.Count > 0)
            }});

            result.Groups.Add(new CheckGroup { Key = "entities", Label = "Entities and images", Items = new()
            {
                C("Entity count", a.Entities.Count + " · 3 to 4", CheckLevel.Warn, a.Entities.Count >= 3 && a.Entities.Count <= 4),
                C("Wikipedia URLs", "Each entity links to wikipedia.org", CheckLevel.Warn,
                  a.Entities.Count > 0 && a.Entities.All(e => e.IsWikipedia)),
                C("Entities appear in the body", "Each name mentioned at least once", CheckLevel.Warn,
                  a.Entities.Count > 0 && a.Entities.All(e => !string.IsNullOrWhiteSpace(e.Name) &&
                       body.Contains(e.Name, StringComparison.OrdinalIgnoreCase))),
                C("Image description", string.IsNullOrEmpty(a.HeroImage) ? "No hero image" : (string.IsNullOrEmpty(a.HeroAlt) ? "Missing" : "Set"), CheckLevel.Warn,
                  string.IsNullOrEmpty(a.HeroImage) || !string.IsNullOrEmpty(a.HeroAlt)),
                C("Byline", string.IsNullOrEmpty(a.Author) ? "Not set" : a.Author, CheckLevel.Block, !string.IsNullOrEmpty(a.Author))
            }});

            result.Groups.Add(new CheckGroup { Key = "read", Label = "Readability", Items = new()
            {
                C("Paragraph length", "2 to 4 sentences each", CheckLevel.Warn,
                  m.Paragraphs.Count > 0 && m.Paragraphs.All(p => { var n = Body.Sentences(p).Count; return n >= 1 && n <= 4; })),
                C("Average sentence length", avgSentence + " words · 15–20", CheckLevel.Warn, avgSentence >= 15 && avgSentence <= 20),
                C("Repeated openings", "No three consecutive sentences starting the same way", CheckLevel.Warn,
                  !allSentences.Where((s, i) => i >= 2 &&
                      FirstWord(s) == FirstWord(allSentences[i - 1]) &&
                      FirstWord(s) == FirstWord(allSentences[i - 2]) &&
                      FirstWord(s).Length > 0).Any())
            }});

            return result;
        }

        private static string FirstWord(string s) =>
            Regex.Split(s ?? "", @"\s+").FirstOrDefault()?.ToLowerInvariant() ?? "";
    }
}

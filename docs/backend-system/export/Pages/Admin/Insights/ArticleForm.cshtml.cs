using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using HanaSite.Models.Insights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HanaSite.Pages.Admin.Insights
{
    /// <summary>
    /// Create / edit an insight article.
    ///
    /// The footer buttons post an "action" value:
    ///   draft        save without validation beyond a headline
    ///   review       agency sends it to an approver
    ///   publish      approver publishes (refused while blocking checks fail)
    ///   preview      re-render with the checklist, save nothing
    ///   liftfaq      move the FAQ section out of the body into the FAQ rows
    ///   liftsources  move the Sources section out of the body into the source rows
    ///
    /// The checks run here on every POST, so the gate holds with JS disabled.
    /// </summary>
    [Authorize(Roles = "Insights,SuperAdmin")]
    public class ArticleFormModel : PageModel
    {
        [BindProperty(SupportsGet = true)] public string? Id { get; set; }

        [BindProperty] public InputModel Input { get; set; } = new();

        public Article? Existing { get; private set; }
        public bool Editing => Existing != null;

        public CheckResult Checks { get; private set; } = new();
        public Body.Model Parsed { get; private set; } = new();

        public string CurrentUser => User?.Identity?.Name ?? "Jirapa K. · Corporate Affairs";
        public bool IsApprover => User?.IsInRole("InsightsApprover") ?? true;

        [TempData] public string? Toast { get; set; }

        public class InputModel
        {
            [Required(ErrorMessage = "Give the article a headline.")]
            public string Title { get; set; } = "";

            [Required(ErrorMessage = "Set the page address.")]
            [RegularExpression("^[a-z0-9]+(-[a-z0-9]+)*$", ErrorMessage = "Lowercase letters, numbers and hyphens only.")]
            public string Slug { get; set; } = "";

            [Required(ErrorMessage = "Write the key takeaways.")]
            public string Summary { get; set; } = "";

            [Required(ErrorMessage = "Paste the article body.")]
            public string BodyHtml { get; set; } = "";

            [Required] public string Category { get; set; } = "Technical";
            [Required] public string ContentType { get; set; } = "Standard";
            [Required] public string BuyerType { get; set; } = "Technical";

            [Required(ErrorMessage = "Choose the market or capability page this article links to.")]
            public string CapabilityLink { get; set; } = "";

            [Required(ErrorMessage = "Write the search title.")]
            public string MetaTitle { get; set; } = "";

            [Required(ErrorMessage = "Write the search description.")]
            public string MetaDescription { get; set; } = "";

            [Required(ErrorMessage = "Set the focus key phrase.")]
            public string PrimaryKeyphrase { get; set; } = "";

            /// <summary>One phrase per line.</summary>
            public string SecondaryKeyphrases { get; set; } = "";

            public string? Canonical { get; set; }
            public string? HeroImage { get; set; }
            public string? HeroAlt { get; set; }
            public string? ShareImage { get; set; }

            [Required(ErrorMessage = "Set the byline.")]
            public string Author { get; set; } = "Hana Engineering Team";

            public string? ScheduledFor { get; set; }
            public string Timing { get; set; } = "now";      // now | date

            public List<FaqPair> Faq { get; set; } = new();
            public List<ArticleEntity> Entities { get; set; } = new();
            public List<string> Sources { get; set; } = new();
            public string Tags { get; set; } = "";           // comma separated
        }

        public string ReadTime => Math.Max(1, (int)Math.Ceiling(Parsed.Words / 200.0)) + " min";
        public (int Min, int Max) Band =>
            ArticleChecks.Bands.TryGetValue(Input.ContentType, out var b) ? b : ArticleChecks.Bands["Standard"];
        public bool WordsInBand => Parsed.Words >= Band.Min && Parsed.Words <= Band.Max;
        public string CanonicalPreview =>
            string.IsNullOrWhiteSpace(Input.Canonical) ? "https://hanagroup.com/insights/" + Input.Slug : Input.Canonical!;

        public int FaqInBody => Parsed.FaqInBody.Count;
        public int SourcesInBody => Parsed.SourceLinksInBody.Count;
        public bool HasLift => FaqInBody > 0 || SourcesInBody > 0;

        public void OnGet()
        {
            Existing = ArticleStore.Find(Id);
            if (Existing != null) Input = ToInput(Existing);
            if (Input.Faq.Count == 0) Input.Faq.Add(new FaqPair());
            if (Input.Entities.Count == 0) Input.Entities.Add(new ArticleEntity());
            Recalculate();
        }

        public IActionResult OnPost(string action)
        {
            Existing = ArticleStore.Find(Id);

            // Lifting FAQ / Sources out of the body edits the draft in place and
            // returns the page — no validation, nothing published.
            if (action == "liftfaq" || action == "liftsources")
            {
                var parsed = Body.Parse(Input.BodyHtml);
                if (action == "liftfaq" && parsed.FaqInBody.Count > 0)
                {
                    Input.Faq = Input.Faq.Where(f => !string.IsNullOrWhiteSpace(f.Question)).ToList();
                    Input.Faq.AddRange(parsed.FaqInBody);
                    Input.BodyHtml = Body.RemoveZone(Input.BodyHtml, "faq");
                    Toast = parsed.FaqInBody.Count + " question(s) moved into the FAQ block";
                }
                else if (action == "liftsources" && parsed.SourceLinksInBody.Count > 0)
                {
                    Input.Sources = Input.Sources.Where(s => !string.IsNullOrWhiteSpace(s)).ToList();
                    Input.Sources.AddRange(parsed.SourceLinksInBody);
                    Input.BodyHtml = Body.RemoveZone(Input.BodyHtml, "sources");
                    Toast = parsed.SourceLinksInBody.Count + " link(s) moved into Sources";
                }
                ModelState.Clear();
                Recalculate();
                return Page();
            }

            if (action == "preview")
            {
                Recalculate();
                Toast = "Preview opened";
                return Page();
            }

            var draft = action == "draft";

            // A draft can be saved incomplete; sending for review or publishing cannot.
            if (draft)
            {
                foreach (var key in ModelState.Keys.ToList())
                    if (key != "Input.Title") ModelState.Remove(key);
            }

            if (!ModelState.IsValid)
            {
                Recalculate();
                return Page();
            }

            var article = Existing ?? new Article { Id = ArticleStore.NextId(), CreatedBy = CurrentUser };
            Apply(article);

            Checks = ArticleChecks.Run(article);

            if (action == "publish")
            {
                if (!IsApprover)
                {
                    Toast = "Only an approver can publish";
                    Recalculate();
                    return Page();
                }
                if (!Checks.CanPublish)
                {
                    // The gate: publication is refused and the draft is still saved.
                    // Id is carried back into the hidden field so a second attempt
                    // updates this record instead of adding another one.
                    Persist(article);
                    Existing = article;
                    Id = article.Id;
                    Toast = Checks.Blocking + " blocking issue(s) must be fixed before publishing";
                    Recalculate();
                    return Page();
                }

                if (Input.Timing == "date" && !string.IsNullOrEmpty(Input.ScheduledFor))
                {
                    article.Status = "scheduled";
                    article.ScheduledFor = Input.ScheduledFor;
                    Toast = "Approved — publishes " + article.ScheduledDisplay;
                }
                else
                {
                    article.Status = "published";
                    article.ScheduledFor = null;
                    article.PublishedAt = "18 Sep 2026";
                    Toast = "Published";
                }
                article.ApprovedBy = CurrentUser;
                article.Audit.Insert(0, new AuditEntry { When = "now", What = "Approved by " + CurrentUser });
            }
            else if (action == "review")
            {
                article.Status = "review";
                article.SentForReviewBy = CurrentUser;
                article.Audit.Insert(0, new AuditEntry { When = "now", What = "Sent for review by " + CurrentUser });
                Toast = "Sent for review";
            }
            else
            {
                if (article.Status != "published" && article.Status != "scheduled") article.Status = "draft";
                article.Audit.Insert(0, new AuditEntry { When = "now", What = "Draft saved by " + CurrentUser });
                Toast = "Saved as draft";
            }

            Persist(article);
            return RedirectToPage("/Admin/Insights/Index");
        }

        private void Persist(Article article)
        {
            article.ModifiedOn = "2026-09-18";
            article.ModifiedAt = "18 Sep 2026 10:42";
            if (ArticleStore.Find(article.Id) == null) ArticleStore.All.Add(article);
        }

        private void Apply(Article a)
        {
            a.Title = Input.Title;
            a.Slug = Input.Slug;
            a.Summary = Input.Summary;
            a.BodyHtml = Input.BodyHtml;
            a.Category = Input.Category;
            a.ContentType = Input.ContentType;
            a.BuyerType = Input.BuyerType;
            a.CapabilityLink = Input.CapabilityLink;
            a.MetaTitle = Input.MetaTitle;
            a.MetaDescription = Input.MetaDescription;
            a.PrimaryKeyphrase = Input.PrimaryKeyphrase;
            a.SecondaryKeyphrases = SplitLines(Input.SecondaryKeyphrases);
            a.Canonical = Input.Canonical;
            a.HeroImage = Input.HeroImage;
            a.HeroAlt = Input.HeroAlt;
            a.ShareImage = Input.ShareImage;
            a.Author = Input.Author;
            a.ScheduledFor = Input.Timing == "date" ? Input.ScheduledFor : null;
            a.Faq = Input.Faq.Where(f => !string.IsNullOrWhiteSpace(f.Question)).ToList();
            a.Entities = Input.Entities.Where(e => !string.IsNullOrWhiteSpace(e.Name)).ToList();
            a.Sources = Input.Sources.Where(s => !string.IsNullOrWhiteSpace(s)).ToList();
            a.Tags = Input.Tags.Split(',').Select(t => t.Trim()).Where(t => t.Length > 0).ToList();
        }

        private InputModel ToInput(Article a) => new()
        {
            Title = a.Title, Slug = a.Slug, Summary = a.Summary, BodyHtml = a.BodyHtml,
            Category = a.Category, ContentType = a.ContentType, BuyerType = a.BuyerType,
            CapabilityLink = a.CapabilityLink ?? "",
            MetaTitle = a.MetaTitle, MetaDescription = a.MetaDescription,
            PrimaryKeyphrase = a.PrimaryKeyphrase,
            SecondaryKeyphrases = string.Join("\n", a.SecondaryKeyphrases),
            Canonical = a.Canonical, HeroImage = a.HeroImage, HeroAlt = a.HeroAlt, ShareImage = a.ShareImage,
            Author = a.Author,
            Timing = string.IsNullOrEmpty(a.ScheduledFor) ? "now" : "date",
            ScheduledFor = a.ScheduledFor,
            Faq = new List<FaqPair>(a.Faq),
            Entities = new List<ArticleEntity>(a.Entities),
            Sources = new List<string>(a.Sources),
            Tags = string.Join(", ", a.Tags)
        };

        /// <summary>Runs the checklist against the current form values, saved or not.</summary>
        private void Recalculate()
        {
            var probe = new Article { Id = Existing?.Id ?? "new", Status = Existing?.Status ?? "draft" };
            Apply(probe);
            Checks = ArticleChecks.Run(probe);
            Parsed = Body.Parse(Input.BodyHtml);
        }

        private static List<string> SplitLines(string? s) =>
            (s ?? "").Split('\n').Select(x => x.Trim()).Where(x => x.Length > 0).ToList();
    }
}

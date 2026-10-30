// =============================================================
//  Services/ThaiDrafts.cs — Thai draft pages built over the English pages
//
//  Data/thai-drafts.json lists English routes that also render at /th/<route>.
//  The Thai route runs the same English page; _Layout.cshtml then swaps in the
//  Thai header and footer, the Thai H1 and opening blurb, the Thai SEO title and
//  description, and Thai labels in the breadcrumb, eyebrow and sidebar (the part
//  of the page above the H1). The rest of the page stays English until it is
//  translated. When the English page changes, it reaches the Thai page too.
//
//  Each H1/blurb entry keeps the English it was translated from ("en"). If the
//  English page no longer matches, that line stays English so a stale Thai line
//  is never shown; /th/<route>?review=1 marks every line by status.
//
//  New routes in the JSON need a restart (routes are registered at startup);
//  text changes are picked up on the next request.
// =============================================================
using System.Net;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace HanaSite.Services;

public static class ThaiDrafts
{
    public sealed record Line(string En, string Th, string Status);
    public sealed record Page(string Title, string Description, Line? H1, Line? Lede);
    sealed record Data(Dictionary<string, string> Labels, Dictionary<string, Page> Pages);

    static string _file = "";
    static DateTime _stamp;
    static Data _data = new(new(), new());
    static readonly object Gate = new();

    public static void Init(string contentRoot)
    {
        _file = Path.Combine(contentRoot, "Data", "thai-drafts.json");
        Current();
    }

    static Data Current()
    {
        lock (Gate)
        {
            var stamp = File.Exists(_file) ? File.GetLastWriteTimeUtc(_file) : DateTime.MinValue;
            if (stamp == _stamp) return _data;
            _stamp = stamp;
            _data = stamp == DateTime.MinValue ? new(new(), new()) : Parse(File.ReadAllText(_file));
            return _data;
        }
    }

    static Data Parse(string json)
    {
        using var doc = JsonDocument.Parse(json);
        var labels = new Dictionary<string, string>(StringComparer.Ordinal);
        if (doc.RootElement.TryGetProperty("labels", out var l))
            foreach (var p in l.EnumerateObject()) labels[p.Name] = p.Value.GetString() ?? "";
        var pages = new Dictionary<string, Page>(StringComparer.OrdinalIgnoreCase);
        if (doc.RootElement.TryGetProperty("pages", out var ps))
            foreach (var p in ps.EnumerateObject())
            {
                var v = p.Value;
                pages[Seo.Normalize(p.Name)] = new Page(Str(v, "title"), Str(v, "description"), LineOf(v, "h1"), LineOf(v, "lede"));
            }
        return new(labels, pages);
    }

    static string Str(JsonElement e, string name) => e.TryGetProperty(name, out var v) ? v.GetString() ?? "" : "";
    static Line? LineOf(JsonElement e, string name) =>
        e.TryGetProperty(name, out var v) ? new Line(Str(v, "en"), Str(v, "th"), Str(v, "status")) : null;

    /// English routes that have a Thai draft.
    public static IEnumerable<string> Routes => Current().Pages.Keys;

    /// The Thai draft for a /th/ request path, with its English route.
    public static bool TryGetForThaiPath(string path, out string enPath, out Page page)
    {
        enPath = "";
        page = null!;
        path = Seo.Normalize(path);
        if (!path.StartsWith("/th/", StringComparison.OrdinalIgnoreCase)) return false;
        enPath = path[3..];
        return Current().Pages.TryGetValue(enPath, out page!);
    }

    public static bool HasThai(string enPath) => Current().Pages.ContainsKey(Seo.Normalize(enPath));

    // ---------------------------------------------------------------- page body

    static readonly Regex H1Rx = new(@"<h1\b[^>]*>(.*?)</h1>", RegexOptions.Singleline | RegexOptions.IgnoreCase | RegexOptions.Compiled);
    static readonly Regex ParaRx = new(@"<p\b[^>]*>(.*?)</p>", RegexOptions.Singleline | RegexOptions.IgnoreCase | RegexOptions.Compiled);
    static readonly Regex AnimLineRx = new(@"<span class=""hha-line""[^>]*><span class=""hha-in"">.*?</span><span class=""hha-edge""[^>]*></span></span>", RegexOptions.Singleline | RegexOptions.Compiled);
    static readonly Regex TextRx = new(@">([^<>]+)<", RegexOptions.Compiled);
    static readonly Regex TagRx = new(@"<[^>]+>", RegexOptions.Compiled);
    static readonly Regex SkipRx = new(@"<(script|style)\b.*?</\1>", RegexOptions.Singleline | RegexOptions.IgnoreCase | RegexOptions.Compiled);

    /// Applies the Thai H1, blurb and labels to the rendered English page body.
    public static string Apply(string html, Page page, bool review)
    {
        var notes = new List<(string Item, string Status)>();
        var h1 = H1Rx.Match(html);
        if (!h1.Success) return html;

        // Opening blurb: the first paragraph after the H1 whose text is the English it was translated from.
        if (page.Lede != null)
        {
            Match? hit = null;
            var p = ParaRx.Match(html, h1.Index + h1.Length);
            for (var i = 0; p.Success && i < 6; i++, p = p.NextMatch())
                if (Norm(p.Groups[1].Value) == Norm(page.Lede.En)) { hit = p; break; }
            if (hit != null)
                html = Splice(html, hit.Groups[1], Mark(page.Lede, review, hit.Groups[1].Value));
            notes.Add(("Blurb", hit != null ? page.Lede.Status : "out of date"));
        }

        // H1: the animated hub headings split the title over two wiped lines; Thai uses one.
        if (page.H1 != null)
        {
            var inner = h1.Groups[1].Value;
            var matches = Norm(inner) == Norm(page.H1.En);
            if (matches)
            {
                var th = Mark(page.H1, review, inner);
                string replaced;
                if (AnimLineRx.IsMatch(inner))
                {
                    var first = true;
                    replaced = AnimLineRx.Replace(inner, m =>
                    {
                        if (!first) return "";
                        first = false;
                        var inStart = m.Value.IndexOf("<span class=\"hha-in\">", StringComparison.Ordinal) + "<span class=\"hha-in\">".Length;
                        var inEnd = m.Value.IndexOf("</span>", inStart, StringComparison.Ordinal);
                        return m.Value[..inStart] + th + m.Value[inEnd..];
                    }).Trim();
                }
                else replaced = th;
                html = Splice(html, h1.Groups[1], replaced);
            }
            notes.Add(("H1", matches ? page.H1.Status : "out of date"));
        }

        // Breadcrumb, eyebrow and sidebar labels: whole text nodes above the H1 only.
        var top = H1Rx.Match(html).Index;
        html = TranslateLabels(html[..top]) + html[top..];

        if (review) html = ReviewPanel(notes) + html;
        return html;
    }

    static string Splice(string html, Group g, string replacement) =>
        html[..g.Index] + replacement + html[(g.Index + g.Length)..];

    static readonly Regex LinkRx = new(@"\[([^\]]+)\]\((/[^)\s]*)\)", RegexOptions.Compiled);

    // Thai text is encoded; "\n" becomes a line break and [words](/address) a link that
    // reuses the matching <a> tag from the English, so it keeps the same styling.
    static string Mark(Line line, bool review, string englishHtml)
    {
        var text = LinkRx.Replace(WebUtility.HtmlEncode(line.Th).Replace("\n", "<br>"), m =>
        {
            var tag = Regex.Match(englishHtml, $@"<a\b[^>]*href=""{Regex.Escape(m.Groups[2].Value)}""[^>]*>");
            return (tag.Success ? tag.Value : $"<a href=\"{m.Groups[2].Value}\">") + m.Groups[1].Value + "</a>";
        });
        return review ? $"<span class=\"thd-mark thd-{Slug(line.Status)}\" title=\"{WebUtility.HtmlEncode(line.Status)}\">{text}</span>" : text;
    }

    static string Slug(string status) => Regex.Replace(status.ToLowerInvariant(), "[^a-z]+", "-").Trim('-');

    static string TranslateLabels(string html)
    {
        var labels = Current().Labels;
        var sb = new StringBuilder();
        var last = 0;
        // Leave script and style blocks alone.
        var skips = SkipRx.Matches(html).Select(m => (m.Index, End: m.Index + m.Length)).ToList();
        foreach (Match m in TextRx.Matches(html))
        {
            if (skips.Any(s => m.Index >= s.Index && m.Index < s.End)) continue;
            var raw = m.Groups[1].Value;
            var text = Collapse(WebUtility.HtmlDecode(raw));
            if (text.Length == 0) continue;
            string? th = labels.TryGetValue(text, out var t) ? t : null;
            if (th == null && text.Contains(" · "))
            {
                var parts = text.Split(" · ");
                if (parts.Any(labels.ContainsKey))
                    th = string.Join(" · ", parts.Select(x => labels.TryGetValue(x, out var y) ? y : x));
            }
            if (th == null) continue;
            var g = m.Groups[1];
            var lead = raw[..(raw.Length - raw.TrimStart().Length)];
            var trail = raw[raw.TrimEnd().Length..];
            sb.Append(html, last, g.Index - last).Append(lead).Append(WebUtility.HtmlEncode(th)).Append(trail);
            last = g.Index + g.Length;
        }
        sb.Append(html, last, html.Length - last);
        return sb.ToString();
    }

    static string ReviewPanel(List<(string Item, string Status)> notes)
    {
        var rows = string.Concat(notes.Select(n => $"<span class=\"thd-mark thd-{Slug(n.Status)}\">{n.Item}: {n.Status}</span> "));
        return "<style>.thd-panel{position:fixed;right:16px;bottom:16px;z-index:999;background:#fff;border:1px solid #d0d5dd;border-radius:8px;padding:10px 12px;font:13px/1.6 var(--font-thai);box-shadow:0 8px 24px rgba(3,10,23,.15);display:flex;gap:6px;flex-wrap:wrap;max-width:360px}"
             + ".thd-mark{border-radius:3px;box-decoration-break:clone;-webkit-box-decoration-break:clone}"
             + ".thd-approved{background:rgba(46,160,67,.22)}.thd-adjusted{background:rgba(9,105,218,.2)}.thd-draft{background:rgba(212,167,44,.35)}"
             + ".thd-proposed{background:rgba(219,109,40,.3)}.thd-out-of-date{background:rgba(207,34,46,.3)}</style>"
             + $"<div class=\"thd-panel\" lang=\"en\"><strong style=\"width:100%\">Thai draft review</strong>{rows}</div>";
    }

    static string Norm(string html) => Collapse(WebUtility.HtmlDecode(TagRx.Replace(html, "")));
    static string Collapse(string s) => Regex.Replace(s, @"\s+", " ").Trim();

    // ---------------------------------------------------------------- links

    static readonly Regex HrefRx = new(@"href=""(/[^""#?]*)([^""]*)""(?![^>]*\bhana-lang\b)", RegexOptions.Compiled);

    /// On Thai pages, internal links open the Thai version where one exists.
    /// The header's EN switch (class hana-lang, written after href) keeps its English address.
    public static string ThaiLinks(string html, HashSet<string> routes) =>
        HrefRx.Replace(html, m =>
        {
            var path = Seo.Normalize(m.Groups[1].Value);
            if (path == "/th" || path.StartsWith("/th/", StringComparison.OrdinalIgnoreCase)) return m.Value;
            var th = path == "/" ? "/th" : "/th" + path;
            return routes.Contains(th) ? $"href=\"{th}{m.Groups[2].Value}\"" : m.Value;
        });
}

/// Registers /th/<route> for every English page listed in Data/thai-drafts.json.
public sealed class ThaiDraftRoutes : IPageRouteModelConvention
{
    public void Apply(PageRouteModel model)
    {
        var routes = new HashSet<string>(ThaiDrafts.Routes, StringComparer.OrdinalIgnoreCase);
        var added = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var selector in model.Selectors.ToList())
        {
            var template = selector.AttributeRouteModel?.Template?.Trim('/');
            if (template == null || !routes.Contains("/" + template) || !added.Add(template)) continue;
            model.Selectors.Add(new SelectorModel
            {
                AttributeRouteModel = new AttributeRouteModel { Template = "/th/" + template },
            });
        }
    }
}

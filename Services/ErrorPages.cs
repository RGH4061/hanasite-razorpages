// =============================================================
//  Services/ErrorPages.cs — what the 404 and error pages show (23 Nov 2026)
//
//  Pages/NotFound.cshtml (/404) and Pages/Error.cshtml (/error) both render
//  Pages/Shared/_ErrorPage.cshtml with an ErrorPageInfo. Program.cs sends every
//  empty error response (UseStatusCodePagesWithReExecute) and every unhandled
//  exception outside Development (UseExceptionHandler) to /error.
//  /404 is also published as 404.html, which GitHub Pages serves for missing files.
// =============================================================
namespace HanaSite.Services;

/// <param name="Code">HTTP status code shown on the page.</param>
/// <param name="Thai">True when the missing address was under /th/.</param>
/// <param name="Words">Search words taken from the missing address, used to pre-fill the search box.</param>
public record ErrorPageInfo(int Code, bool Thai, string Words);

public static class ErrorPages
{
    /// <summary>Words from the last part of an address: "/markets/rfid/tire-tags.html" → "tire tags".</summary>
    public static string WordsFrom(string? path)
    {
        if (string.IsNullOrEmpty(path)) return "";
        var last = path.TrimEnd('/').Split('/').LastOrDefault() ?? "";
        var dot = last.LastIndexOf('.');
        if (dot > 0) last = last[..dot];
        var words = System.Text.RegularExpressions.Regex.Replace(Uri.UnescapeDataString(last), @"[-_+]+", " ").Trim();
        // Numbers alone and "index" carry no meaning as a search.
        return words.Length < 2 || words.All(char.IsDigit) || words.Equals("index", StringComparison.OrdinalIgnoreCase) ? "" : words;
    }

    /// <summary>Page settings shared by /error and /404: title, noindex, language and the language switch.</summary>
    public static void Apply(Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary v, ErrorPageInfo info)
    {
        var th = info.Thai;
        v["Title"] = info.Code == 404 ? (th ? "ไม่พบหน้านี้" : "Page not found") : (th ? "ไม่สามารถโหลดหน้านี้ได้" : "Page could not be loaded");
        v["Description"] = th ? "ไม่พบหน้าที่ต้องการบนเว็บไซต์ Hana Microelectronics" : "The requested page is not available on the Hana Microelectronics website.";
        v["Robots"] = "noindex";
        // The language switch goes to the other language's home page.
        if (th) { v["Lang"] = "th"; v["AltLang"] = "en"; v["AltLangUrl"] = "/"; }
        else { v["AltLang"] = "th"; v["AltLangUrl"] = "/th/"; }
    }

    public static bool IsThai(string? path) =>
        path != null && (path.Equals("/th", StringComparison.OrdinalIgnoreCase) || path.StartsWith("/th/", StringComparison.OrdinalIgnoreCase));
}

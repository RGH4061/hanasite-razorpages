// =============================================================
//  Program.cs — minimal ASP.NET Core 8 host (Razor Pages)
//  Run with:  dotnet run
// =============================================================

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorPages();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

// Permanent redirects for retired pages (old address -> page that replaced it).
// RFID merge, 22 Oct 2026: one RFID capability page; tire tags have one page under Markets.
var redirects = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
{
    ["/capabilities/rfid-smart-tags/rfid-tire-tags"] = "/markets/rfid/rfid-tire-tags",
    ["/capabilities/rfid-smart-tags/rfid-inlays"]    = "/markets/rfid/rfid-tags-inlays",
    ["/markets/automotive/rfid-tire-tags"]           = "/markets/rfid/rfid-tire-tags",
    // Power merge, 23 Oct 2026: the two Power Management sub-pages fold into Power Packages;
    // the Power Management hub stays as the market page.
    ["/markets/power-management/igbt-sic-modules"]   = "/capabilities/osat/power-packages#power-modules",
    ["/markets/power-management/power-discrete"]     = "/capabilities/osat/power-packages#power-discretes",
    // Sensor merge, 23 Oct 2026: MEMS & Optical Sensor Packages folds into the MEMS & Sensor
    // Assembly capability page; the Optical & Sensors hub stays as the market page.
    ["/markets/optical-sensors/mems-sensors"]        = "/capabilities/microelectronic-assembly/mems-sensor-assembly",
    // RFID review, 26 Oct 2026: industrial asset-tracking tags fold into RFID Tags & Inlays.
    ["/markets/industrial-iot/rfid-asset-tracking"]  = "/markets/rfid/rfid-tags-inlays#asset-tracking",
};
app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value?.TrimEnd('/') ?? "";
    if (redirects.TryGetValue(path, out var target))
    {
        // Any query string goes before the #section, not after it.
        var hash = target.IndexOf('#');
        var location = hash < 0 ? target + context.Request.QueryString
            : target[..hash] + context.Request.QueryString + target[hash..];
        context.Response.Redirect(location, permanent: true);
        return;
    }
    await next();
});
app.UseStaticFiles();   // serves /wwwroot (css, js, fonts, images, robots.txt, llms.txt)
app.UseRouting();
app.MapRazorPages();

// sitemap.xml lists every public page with its Thai twin, built from the Razor Pages routes
// (Services/Seo.cs keeps noindex pages such as /search and dormant Cheongju out of it).
app.MapGet("/sitemap.xml", (IEnumerable<EndpointDataSource> sources) =>
    Results.Content(HanaSite.Services.Seo.SitemapXml(sources), "application/xml; charset=utf-8"));

app.Run();

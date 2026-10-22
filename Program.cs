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
};
app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value?.TrimEnd('/') ?? "";
    if (redirects.TryGetValue(path, out var target))
    {
        context.Response.Redirect(target + context.Request.QueryString, permanent: true);
        return;
    }
    await next();
});
app.UseStaticFiles();   // serves /wwwroot (css, js, fonts, images)
app.UseRouting();
app.MapRazorPages();

app.Run();

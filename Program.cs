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
app.UseStaticFiles();   // serves /wwwroot (css, js, fonts, images)
app.UseRouting();
app.MapRazorPages();

app.Run();

// =============================================================
//  Services/Certifications.cs — the plant certificate register
//
//  Reads Data/certifications.json: the standards (name and area) and, per plant,
//  each site's certificates (certification body, certificate number and the old
//  site's document ID, served at /File/ViewDoc/<id> like the IR documents, and the
//  certification mark cut from the old site's banner, under wwwroot/images/certifications).
//  Used by Pages/Shared/_PlantCertifications.cshtml for the five plant
//  certification pages. The file is re-read when it changes, so an edit (a new
//  document ID, say) shows on the next request without a restart.
// =============================================================
using System.Text.Json;

namespace HanaSite.Services;

public static class Certifications
{
    /// Short and Label: the location page tile; Chip: the Locations hub chip where it differs from
    /// Short; Status: the word the search card shows for a row with no certificate number.
    public sealed record Standard(string Name, string Area, string? Short, string? Label, string? Chip, string? Status);
    public sealed record Cert(string Std, string? Body, string? Number, int? Doc, string? Logo);
    public sealed record Site(string Name, List<Cert> Certs);
    public sealed record Plant(string Name, string Region, string Location, string Page, List<Site> Sites);
    sealed record Data(Dictionary<string, Standard> Standards, Dictionary<string, Plant> Plants);

    static readonly JsonSerializerOptions Options = new()
    {
        PropertyNameCaseInsensitive = true,
        ReadCommentHandling = JsonCommentHandling.Skip,
        AllowTrailingCommas = true,
    };

    static string _file = "";
    static DateTime _stamp;
    static Data _data = new(new(), new());
    static readonly object Gate = new();

    public static void Init(string contentRoot)
    {
        _file = Path.Combine(contentRoot, "Data", "certifications.json");
        Current();
    }

    static Data Current()
    {
        lock (Gate)
        {
            var stamp = File.Exists(_file) ? File.GetLastWriteTimeUtc(_file) : DateTime.MinValue;
            if (stamp == _stamp) return _data;
            _stamp = stamp;
            _data = stamp == DateTime.MinValue
                ? new(new(), new())
                : JsonSerializer.Deserialize<Data>(File.ReadAllText(_file), Options) ?? new(new(), new());
            return _data;
        }
    }

    /// The plant under its register key ("lamphun", "koh-kong"), or null.
    public static Plant? Get(string key) => Current().Plants.TryGetValue(key, out var p) ? p : null;

    /// Every plant in register order, with its key.
    public static IReadOnlyList<KeyValuePair<string, Plant>> All => Current().Plants.ToList();

    public static Standard Std(string key) =>
        Current().Standards.TryGetValue(key, out var s) ? s : new Standard(key, "", key, "", null, null);

    /// The standards held at a plant (all its sites), in register order, each once.
    public static IReadOnlyList<Standard> StandardsAt(string key)
    {
        var plant = Get(key);
        if (plant == null) return Array.Empty<Standard>();
        return plant.Sites.SelectMany(s => s.Certs).Select(c => c.Std).Distinct().Select(Std).ToList();
    }

    /// The meta description for a plant's certification page, listing its standards.
    public static string Description(string key)
    {
        var plant = Get(key);
        if (plant == null) return "";
        var names = plant.Sites.SelectMany(s => s.Certs).Select(c => Std(c.Std).Name).Distinct().ToList();
        var list = names.Count > 1 ? string.Join(", ", names.Take(names.Count - 1)) + " and " + names[^1] : names.FirstOrDefault() ?? "";
        return $"Certificates held by Hana's {plant.Name} plant{(plant.Sites.Count > 1 ? "s" : "")}: {list}, with the certificate PDFs.";
    }
}

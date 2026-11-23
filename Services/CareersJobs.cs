// =============================================================
//  Services/CareersJobs.cs — open roles for the Careers pages
//
//  Reads Data/careers-jobs.json: the plants (location line and recruitment
//  inbox) and the open roles. Used by the Careers list (Pages/Careers/Index),
//  each role page (Pages/Careers/Jobs/*.cshtml → _JobPost.cshtml) and the
//  consent and application pages, which show the role the applicant came from.
//  The file is re-read when it changes, so an edit shows on the next request.
//  Placeholder until the Careers Admin tool supplies roles.
// =============================================================
using System.Globalization;
using System.Text.Json;

namespace HanaSite.Services;

public static class CareersJobs
{
    public sealed record Plant(string Name, string Location, string Email);
    public sealed record Board(string Name, string Url);
    public sealed record Job(
        string Slug, int? SourceJobId, string Title, string Plant, string Department,
        string Type, string PayBasis, string Posted, string? About,
        List<string> Responsibilities, List<string> Qualifications,
        List<string>? Benefits, List<Board>? Boards)
    {
        public string Url => "/careers/jobs/" + Slug;
        public DateTime PostedDate => DateTime.ParseExact(Posted, "yyyy-MM-dd", CultureInfo.InvariantCulture);
        public string PostedText => PostedDate.ToString("d MMM yyyy", CultureInfo.InvariantCulture);
        /// data-type value used by the Careers filter (fulltime, parttime, internship).
        public string TypeKey => Type.Replace(" ", "").Replace("-", "").ToLowerInvariant();
    }
    sealed record Data(Dictionary<string, Plant> Plants, List<Job> Jobs);

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
        _file = Path.Combine(contentRoot, "Data", "careers-jobs.json");
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

    /// Open roles, newest first.
    public static IReadOnlyList<Job> All => Current().Jobs.OrderByDescending(j => j.PostedDate).ToList();

    public static Job? Get(string slug) => Current().Jobs.FirstOrDefault(j => j.Slug == slug);

    /// Slug → title, location, plant and page URL, for js/careers-role.js on the consent and application pages.
    public static string ClientJson() => JsonSerializer.Serialize(
        Current().Jobs.ToDictionary(j => j.Slug, j => new
        {
            title = j.Title,
            location = PlantOf(j).Location,
            plant = j.Plant,
            url = j.Url,
        })).Replace("</", "<\\/");

    public static Plant PlantOf(Job job) =>
        Current().Plants.TryGetValue(job.Plant, out var p) ? p : new(job.Plant, job.Plant, "");
}

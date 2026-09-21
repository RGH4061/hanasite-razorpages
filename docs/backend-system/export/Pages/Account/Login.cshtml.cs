using HanaSite.Models.Admin;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace HanaSite.Pages.Account
{
    /// <summary>
    /// Sign-in page. In the merged site this is backed by ASP.NET Core Identity
    /// (SignInManager). The scaffold below models the fields and validation
    /// surface only; wire the real sign-in during merge.
    /// </summary>
    public class LoginModel : PageModel
    {
        [BindProperty] public InputModel Input { get; set; } = new();
        [BindProperty(SupportsGet = true)] public string? ReturnUrl { get; set; }
        public string? ErrorMessage { get; set; }

        public class InputModel
        {
            public string Email { get; set; } = "";
            public string Password { get; set; } = "";
            public bool RememberMe { get; set; } = true;
        }

        public void OnGet() { }

        public IActionResult OnPost()
        {
            // Replace with SignInManager.PasswordSignInAsync during merge.
            // Prototype: accept any input, then route by section role.
            if (string.IsNullOrWhiteSpace(Input.Email) || string.IsNullOrWhiteSpace(Input.Password))
            {
                ErrorMessage = "Enter your email and password.";
                return Page();
            }

            // 1. An explicit returnUrl wins, so deep links survive sign-in.
            if (!string.IsNullOrEmpty(ReturnUrl) && Url.IsLocalUrl(ReturnUrl)) return LocalRedirect(ReturnUrl);

            // 2. One section role -> straight into that section.
            // 3. Several (or SuperAdmin) -> the section hub at /admin.
            return RedirectToPage(AdminSections.LandingPage(User));
        }
    }
}

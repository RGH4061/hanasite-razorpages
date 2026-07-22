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
            // Prototype: accept any input and route to the ticket list.
            if (string.IsNullOrWhiteSpace(Input.Email) || string.IsNullOrWhiteSpace(Input.Password))
            {
                ErrorMessage = "Enter your email and password.";
                return Page();
            }
            return RedirectToPage("/Admin/Tickets/Index");
        }
    }
}

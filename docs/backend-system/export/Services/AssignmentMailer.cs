using System;
using System.IO;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using HanaSite.Models.Admin;

namespace HanaSite.Services
{
    /// <summary>
    /// Sends the inquiry summary to whoever an inquiry is assigned to.
    /// Called from the Claim and Assign handlers on the ticket list page.
    /// Swap SmtpAssignmentMailer for the site's existing mail transport on
    /// merge — the page only depends on the interface below.
    /// </summary>
    public interface IAssignmentMailer
    {
        /// <summary>Sends the summary and stamps the ticket. Returns the mailbox used.</summary>
        string SendAssignmentSummary(Ticket ticket, string owner, string assignedBy = "");
    }

    public class SmtpAssignmentMailer : IAssignmentMailer
    {
        private readonly string _host;
        private readonly int _port;
        private readonly string _from;
        private readonly string _templatePath;
        private readonly string _adminUrl;
        private readonly string _logoUrl;

        public SmtpAssignmentMailer(
            string host = "localhost",
            int port = 25,
            string from = "no-reply@hanagroup.com",
            string templatePath = "emails/assignment-summary.html",
            string adminUrl = "https://hanagroup.com/admin/tickets",
            string logoUrl = "https://hanagroup.com/images/hana-logo-full-white.png")
        {
            _host = host; _port = port; _from = from;
            _templatePath = templatePath; _adminUrl = adminUrl; _logoUrl = logoUrl;
        }

        public string SendAssignmentSummary(Ticket t, string owner, string assignedBy = "")
        {
            var to = TicketStore.MailboxFor(owner);
            var subject = BuildSubject(t);

            // Both views go out: the HTML template for reading, plain text as
            // the fallback for clients that refuse HTML.
            var mail = new MailMessage(_from, to) { Subject = subject };
            var text = BuildBody(t, owner, assignedBy);
            mail.Body = text;
            mail.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(text, null, MediaTypeNames.Text.Plain));
            mail.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(BuildHtmlBody(t, owner, assignedBy), null, MediaTypeNames.Text.Html));
            mail.IsBodyHtml = false;
            if (!string.IsNullOrEmpty(t.Email)) mail.ReplyToList.Add(new MailAddress(t.Email));

            try
            {
                using var client = new SmtpClient(_host, _port);
                client.Send(mail);
            }
            catch (Exception)
            {
                // Delivery failure must not block the assignment — the stamp
                // below records the attempt and the row shows it in the UI.
            }

            t.NotifiedName = owner;
            t.NotifiedEmail = to;
            t.NotifiedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
            t.NotifiedSubject = subject;
            return to;
        }

        /// <summary>
        /// Fills emails/assignment-summary.html — the Hana-branded email
        /// template. Designers edit that file; nothing here needs changing.
        /// </summary>
        public string BuildHtmlBody(Ticket t, string owner, string assignedBy = "")
        {
            var rows = new StringBuilder();
            void Row(string label, string? value, bool mono = false, string? href = null)
            {
                if (string.IsNullOrEmpty(value)) return;
                var shown = Esc(value);
                if (href != null) shown = "<a href=\"" + href + Esc(value) + "\" style=\"color:#1283DD;text-decoration:none;\">" + shown + "</a>";
                rows.Append(
                    "<tr>" +
                    "<td width=\"34%\" style=\"padding:11px 14px;border-bottom:1px solid #E6E8EB;font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:#6B7280;vertical-align:top;\">" + Esc(label) + "</td>" +
                    "<td style=\"padding:11px 14px;border-bottom:1px solid #E6E8EB;font-family:" + (mono ? "'Courier New',Courier,monospace" : "Helvetica,Arial,sans-serif") + ";font-size:13px;color:#0E1116;\">" + shown + "</td>" +
                    "</tr>");
            }

            Row("Ticket number", t.Id.ToUpperInvariant(), mono: true);
            Row("Received", (t.Date + " " + t.Time).Trim(), mono: true);
            Row("Name", t.Name);
            Row("Company", t.Company);
            Row("Email", t.Email, href: "mailto:");
            Row("Phone", t.Phone);
            Row("Market", t.Market);
            Row("Service", t.Service);
            Row("Reason", t.Reason);
            Row("Page", t.Source);

            var html = LoadTemplate();
            return html
                .Replace("{{OwnerName}}", Esc(owner))
                .Replace("{{AssignedBy}}", Esc(string.IsNullOrEmpty(assignedBy) ? "the sales team" : assignedBy))
                .Replace("{{Subject}}", Esc(BuildSubject(t)))
                .Replace("{{DetailRows}}", rows.ToString())
                .Replace("{{Message}}", Esc(t.Message).Replace("\n", "<br />"))
                .Replace("{{LogoUrl}}", _logoUrl)
                .Replace("{{Url}}", _adminUrl + "#" + t.Id)
                .Replace("{{Year}}", DateTime.Now.Year.ToString());
        }

        private string LoadTemplate()
        {
            try { return File.ReadAllText(_templatePath); }
            catch (Exception)
            {
                // Missing template must not stop the notification going out.
                return "<html><body style=\"font-family:Helvetica,Arial,sans-serif;color:#0E1116;\">" +
                       "<p>{{OwnerName}}, this inquiry is now assigned to you.</p>" +
                       "<table>{{DetailRows}}</table><p>{{Message}}</p>" +
                       "<p><a href=\"{{Url}}\">Open the inquiry</a></p></body></html>";
            }
        }

        private static string Esc(string s) => s
            .Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace("\"", "&quot;");

        public static string BuildSubject(Ticket t) =>
            "[" + t.Id.ToUpperInvariant() + "] " + t.Name + (string.IsNullOrEmpty(t.Company) ? "" : " · " + t.Company);

        /// <summary>Plain-text summary. Kept plain on purpose: it is read on phones.</summary>
        public static string BuildBody(Ticket t, string owner, string assignedBy = "")
        {
            var b = new StringBuilder();
            b.AppendLine("Hi " + owner + ",");
            b.AppendLine();
            b.AppendLine("This ticket was assigned to you.");
            b.AppendLine("Reply directly to " + (string.IsNullOrEmpty(assignedBy) ? "the sales team" : assignedBy) + " if you have any questions rather than the ticketing system.");
            b.AppendLine();
            b.AppendLine("Ticket number:  " + t.Id.ToUpperInvariant());
            b.AppendLine("Received:       " + t.Date + " " + t.Time);
            b.AppendLine("Name:           " + t.Name);
            if (!string.IsNullOrEmpty(t.Company)) b.AppendLine("Company:        " + t.Company);
            if (!string.IsNullOrEmpty(t.Email)) b.AppendLine("Email:          " + t.Email);
            if (!string.IsNullOrEmpty(t.Phone)) b.AppendLine("Phone:          " + t.Phone);
            if (!string.IsNullOrEmpty(t.Market)) b.AppendLine("Market:         " + t.Market);
            if (!string.IsNullOrEmpty(t.Service)) b.AppendLine("Service:        " + t.Service);
            if (!string.IsNullOrEmpty(t.Reason)) b.AppendLine("Reason:         " + t.Reason);
            if (!string.IsNullOrEmpty(t.Source)) b.AppendLine("Page:           " + t.Source);
            b.AppendLine();
            b.AppendLine("Message");
            b.AppendLine("-------");
            b.AppendLine(t.Message);
            b.AppendLine();
            b.AppendLine("Open the inquiry: https://hanagroup.com/admin/tickets#" + t.Id);
            return b.ToString();
        }
    }
}

/* Contact page: adds the page the visitor came from to the sales email subject.
   Reads document.referrer only. Stores nothing, sets no cookies.
   Used by Pages/Contact/Index.cshtml and Pages/ThaiPages/Contact.cshtml. */
(function () {
  var from = "";
  try {
    var ref = new URL(document.referrer);
    if (ref.hostname === location.hostname) {
      var path = ref.pathname.replace(/\/+$/, "") || "/";
      if (path === "/") from = "home page";
      else if (path === "/th") from = "Thai home page";
      else if (!/^\/(th\/)?contact(\/|$)/i.test(path)) from = path;
    }
  } catch (e) { /* no previous page: typed address, bookmark, search engine, email link */ }
  if (!from) return;

  document.querySelectorAll('a[href^="mailto:info-request@hanaus.com"]').forEach(function (link) {
    var parts = link.getAttribute("href").split("?subject=");
    var subject = decodeURIComponent(parts[1] || "");
    if (subject.indexOf("(from ") !== -1) return;
    link.setAttribute("href", parts[0] + "?subject=" + encodeURIComponent(subject + " (from " + from + ")"));
  });
})();

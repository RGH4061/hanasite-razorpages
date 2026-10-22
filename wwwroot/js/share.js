/* share.js — Insights article share links (.ins-share-row): LinkedIn, Email, Copy link.
   The links are written as href="#" in the pages; this gives them their destinations.
   It uses the address the page was opened at, so a link shared from the preview site points
   at the preview page and one shared from hanagroup.com points at the live article.
   Does nothing on pages without a share row. */
(function () {
  var rows = document.querySelectorAll('.ins-share-row');
  if (!rows.length) return;
  var url = location.href.split('#')[0];
  var h1 = document.querySelector('main h1');
  var title = ((h1 && h1.textContent) || document.title).replace(/\s+/g, ' ').trim();

  function copied(a) {
    var label = a.textContent;
    a.textContent = 'Link copied';
    setTimeout(function () { a.textContent = label; }, 1800);
  }

  Array.prototype.forEach.call(rows, function (row) {
    Array.prototype.forEach.call(row.querySelectorAll('a'), function (a) {
      var kind = (a.textContent || '').trim().toLowerCase();
      if (kind === 'linkedin') {
        a.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
        a.target = '_blank';
        a.rel = 'noopener';
      } else if (kind === 'email') {
        a.href = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(url);
      } else if (kind === 'copy link') {
        a.setAttribute('role', 'button');
        a.addEventListener('click', function (e) {
          e.preventDefault();
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () { copied(a); }, function () { copied(a); });
          } else {
            var field = document.createElement('input');
            field.value = url;
            document.body.appendChild(field);
            field.select();
            try { document.execCommand('copy'); } catch (err) { /* nothing else to try */ }
            field.remove();
            copied(a);
          }
        });
      }
    });
  });
})();

// Click-to-play for YouTube videos. Nothing loads from YouTube
// until the visitor presses play.
(function () {
  function videoId(v) {
    if (!v) return null;
    var m = v.match(/(?:youtu\.be\/|[?&]v=|\/live\/|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    return /^[A-Za-z0-9_-]{11}$/.test(v) ? v : null;
  }

  function play(btn) {
    var id = videoId(btn.getAttribute('data-yt'));
    if (!id) return;

    // Keep the frame's box and size; drop the poster/facade classes.
    var box = document.createElement('div');
    box.className = btn.className
      .replace(/\byt-facade\b|\bhas-poster\b/g, '').trim() + ' is-playing';

    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id +
                 '?autoplay=1&rel=0';
    iframe.title = btn.getAttribute('aria-label') || 'YouTube video';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;

    box.appendChild(iframe);
    btn.replaceWith(box);
    iframe.focus();
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.yt-facade');
    if (btn) { e.preventDefault(); play(btn); }
  });
})();

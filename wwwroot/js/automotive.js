/* automotive.js — FAQ accordion + collapsible sub-market sidebar.
   FAQ: click a question to expand; first item starts open (markup sets .is-open).
   Sidebar: enhances .auto-side into a collapsible rail (toggle + initials),
   matching the design source. Removes reliance on per-item icons. */
(function () {
  function initFaq() {
    document.querySelectorAll('.auto-faq').forEach(function (faq) {
      faq.addEventListener('click', function (e) {
        var btn = e.target.closest('button.q');
        if (!btn) return;
        var item = btn.closest('.item');
        var open = item.classList.contains('is-open');
        faq.querySelectorAll('.item').forEach(function (it) { it.classList.remove('is-open'); });
        if (!open) item.classList.add('is-open');
      });
    });
  }

  function initials(text) {
    return (text || '').trim().split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
  }

  function initSidebar() {
    document.querySelectorAll('.auto-spoke-grid').forEach(function (grid) {
      var side = grid.querySelector('.auto-side');
      var head = side && side.querySelector('.side-head');
      if (!side || !head || head.querySelector('.auto-side-toggle')) return;

      // Wrap the head's label text so it can be hidden when collapsed.
      var label = document.createElement('span');
      label.className = 'side-head-label';
      label.textContent = head.textContent.trim();
      head.textContent = '';
      head.appendChild(label);

      // Collapse/expand toggle.
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'auto-side-toggle';
      btn.setAttribute('aria-label', 'Collapse sidebar');
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
      btn.addEventListener('click', function () {
        var collapsed = grid.classList.toggle('cpsb-col');
        btn.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
      });
      head.appendChild(btn);

      // Give each item a 2-letter initials badge for the collapsed rail.
      side.querySelectorAll('.s').forEach(function (item) {
        var lbl = item.querySelector('span:not(.soon)');
        var name = lbl ? lbl.textContent : item.textContent;
        item.setAttribute('title', name.trim());
        var ini = document.createElement('span');
        ini.className = 'ini';
        ini.textContent = initials(name);
        item.appendChild(ini);
      });
    });
  }

  function init() {
    initFaq();
    initSidebar();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

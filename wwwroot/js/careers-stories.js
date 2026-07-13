/* careers-stories.js — page interactions (vanilla, extracted) */

const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('#stories-grid .story-card');
  const countEl = document.getElementById('visible-count');
  const emptyEl = document.getElementById('stories-empty');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.loc;
      let visible = 0;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.loc === filter;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (countEl) countEl.textContent = visible;
      emptyEl.style.display = visible === 0 ? 'block' : 'none';
    });
  });

// ── Story photo lightbox (baked testimonials, click to expand) ──
(function(){
  const lb = document.getElementById('story-lightbox');
  if (!lb) return;
  const lbImg = lb.querySelector('img');
  function open(u){ lbImg.src = u; lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close(){ lb.classList.remove('open'); lbImg.removeAttribute('src'); document.body.style.overflow = ''; }
  document.querySelectorAll('.story-photo .zoom-btn').forEach(btn => {
    btn.addEventListener('click', ev => {
      ev.preventDefault(); ev.stopPropagation();
      const img = btn.parentElement.querySelector('img.story-img');
      const url = img && (img.currentSrc || img.getAttribute('src'));
      if (url) open(url);
    });
  });
  lb.addEventListener('click', ev => { if (ev.target === lb || ev.target.closest('.story-lightbox-close')) close(); });
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && lb.classList.contains('open')) close(); });
})();
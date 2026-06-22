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
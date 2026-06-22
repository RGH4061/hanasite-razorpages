/* about-heritage.js — decade timeline + sticky decade bar (vanilla, extracted) */
document.documentElement.style.setProperty('--topbar-h','0px');

// Decade bar shares the hero flow at rest; goes solid once it pins over the timeline.
  (function () {
    var nav = document.querySelector('.decade-nav');
    var sentinel = document.querySelector('.decade-stick-sentinel');
    if (!nav || !sentinel || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        nav.classList.toggle('is-stuck', !e.isIntersecting && e.boundingClientRect.top <= 0);
      });
    }, { threshold: [0, 1] });
    io.observe(sentinel);
  })();

(function () {
    const track = document.getElementById('timeline');
    const slots = Array.from(track.querySelectorAll('.t-slot'));
    const chips = Array.from(document.querySelectorAll('.decade-chip'));
    const fill = document.querySelector('.progress-fill');
    const currentYear = document.querySelector('.progress-label .current');
    const currentCount = document.getElementById('current-count');
    const totalCount = document.getElementById('total-count');
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    totalCount.textContent = slots.length;

    let scrollTimer = null;
    function scrollToSlot(slot) {
      const trackRect = track.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      const target = track.scrollLeft + (slotRect.left - trackRect.left)
                   - (track.clientWidth - slotRect.width) / 2;
      if (reduced) { track.scrollLeft = target; update(); return; }
      // JS-driven smooth scroll using setInterval (more reliable than rAF in some embeds).
      const start = track.scrollLeft;
      const delta = target - start;
      if (Math.abs(delta) < 1) { update(); return; }
      const duration = 480;
      const t0 = Date.now();
      if (scrollTimer) clearInterval(scrollTimer);
      scrollTimer = setInterval(() => {
        const t = Math.min(1, (Date.now() - t0) / duration);
        const eased = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2; // easeInOutQuad
        track.scrollLeft = start + delta * eased;
        update();
        if (t >= 1) { clearInterval(scrollTimer); scrollTimer = null; }
      }, 16);
    }

    function activeIndex() {
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0, bestDist = Infinity;
      slots.forEach((s, i) => {
        const c = s.offsetLeft + s.offsetWidth / 2;
        const d = Math.abs(c - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    }

    function update() {
      const idx = activeIndex();
      slots.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      const active = slots[idx];

      // chips
      chips.forEach(c => c.classList.toggle('is-active', c.dataset.decade === active.dataset.decade));

      // progress
      const max = track.scrollWidth - track.clientWidth;
      const pct = max > 0 ? (track.scrollLeft / max) * 100 : 0;
      fill.style.width = pct + '%';

      // labels
      currentYear.textContent = active.dataset.year;
      currentCount.textContent = idx + 1;

      // button enabled state
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx === slots.length - 1;
    }

    let raf = null;
    track.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = null; update(); });
    });
    window.addEventListener('resize', update);

    prevBtn.addEventListener('click', () => {
      const idx = activeIndex();
      if (idx > 0) scrollToSlot(slots[idx - 1]);
    });
    nextBtn.addEventListener('click', () => {
      const idx = activeIndex();
      if (idx < slots.length - 1) scrollToSlot(slots[idx + 1]);
    });

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const decade = chip.dataset.decade;
        const target = slots.find(s => s.dataset.decade === decade);
        if (target) scrollToSlot(target);
      });
    });

    window.addEventListener('keydown', (e) => {
      // only when user has interacted with timeline area
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); nextBtn.click(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prevBtn.click(); }
    });

    // Initial: snap to first slot and paint state immediately.
    track.scrollLeft = slots[0].offsetLeft - (track.clientWidth - slots[0].offsetWidth) / 2;
    update();
  })();
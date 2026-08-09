/* careers.js — life-at-Hana tabs + carousels, job filters, topo canvas (vanilla, extracted) */

'use strict';

// ── Life-at-Hana image carousels (re-runs on each render) ──
function initCarousels(root) {
  root.querySelectorAll('.life-img-scroll').forEach(scroll => {
    if (scroll.dataset.carouselReady) return;
    scroll.dataset.carouselReady = '1';

    const wrap = document.createElement('div');
    wrap.className = 'life-img-scroll-wrap';
    scroll.parentNode.insertBefore(wrap, scroll);
    wrap.appendChild(scroll);

    const left  = document.createElement('button');
    const right = document.createElement('button');
    left.className  = 'scroll-arrow scroll-arrow-left hidden';
    right.className = 'scroll-arrow scroll-arrow-right';
    left.setAttribute('aria-label',  'Previous image');
    right.setAttribute('aria-label', 'Next image');
    left.textContent  = '‹';
    right.textContent = '›';
    wrap.appendChild(left);
    wrap.appendChild(right);

    const slideWidth = () => scroll.clientWidth * 0.92;
    const update = () => {
      left.classList.toggle('hidden',  scroll.scrollLeft < 4);
      right.classList.toggle('hidden', scroll.scrollLeft >= scroll.scrollWidth - scroll.clientWidth - 4);
    };
    left.addEventListener('click',  () => { scroll.scrollBy({ left: -slideWidth(), behavior: 'smooth' }); });
    right.addEventListener('click', () => { scroll.scrollBy({ left:  slideWidth(), behavior: 'smooth' }); });
    scroll.addEventListener('scroll', update);
    update();
  });
}

// ── Life at Hana — per-location content ─────────────
//  Six core sections per site. Edit the text here to change what each
//  plant shows; the same six titles run across every location.
const LIFE_DATA = {
  ayutthaya: [
    { title: "Annual company days",         desc: "The Ayutthaya site comes together each year to celebrate its work in IC assembly and test." },
    { title: "Celebrations",                desc: "Songkran, New Year, and team milestones marked across the Ayutthaya campus." },
    { title: "Community outreach",          desc: "Supporting schools and families throughout Ayutthaya province." },
    { title: "Technical training programme", desc: "Hands-on training in semiconductor packaging, assembly, and test." },
    { title: "Health and wellbeing",        desc: "On-site clinic, sports facilities, and wellbeing programmes across every shift." },
    { title: "Student scholarship",         desc: "Sponsoring local students into careers in semiconductor manufacturing." }
  ],
  bangkok: [
    { title: "Annual company days",         desc: "Group-wide company days bringing our head-office teams together." },
    { title: "Celebrations",                desc: "Festivals, awards, and milestones marked at our Bangkok headquarters." },
    { title: "Community outreach",          desc: "Group CSR programmes coordinated from Bangkok across all Hana sites." },
    { title: "Technical training programme", desc: "Leadership, commercial, and customer-management development." },
    { title: "Health and wellbeing",        desc: "Modern offices, flexible working, and wellbeing support." },
    { title: "Student scholarship",         desc: "Running Hana's group scholarship and graduate-intake programmes." }
  ],
  lamphun: [
    { title: "Annual company days",         desc: "Celebrating the Lamphun site's PCBA and box-build achievements each year." },
    { title: "Celebrations",                desc: "Northern Thai festivals and team milestones across the Lamphun site." },
    { title: "Community outreach",          desc: "Deep local roots — many of our team are from Lamphun itself." },
    { title: "Technical training programme", desc: "SMT, PCBA, and box-build skills training at every level." },
    { title: "Health and wellbeing",        desc: "Canteen, transport support, and health programmes for all employees." },
    { title: "Student scholarship",         desc: "Investing in young manufacturing talent across the Lamphun region." }
  ],
  kohkong: [
    { title: "Annual company days",         desc: "Marking the growth of our newest site with the whole Koh Kong team." },
    { title: "Celebrations",                desc: "Khmer New Year and team achievements celebrated at Koh Kong." },
    { title: "Community outreach",          desc: "Creating local jobs and supporting families across Koh Kong province." },
    { title: "Technical training programme", desc: "Building assembly and manufacturing skills from the ground up." },
    { title: "Health and wellbeing",        desc: "A safe, supportive workplace with on-site welfare facilities." },
    { title: "Student scholarship",         desc: "Opening pathways into electronics manufacturing for Cambodian students." }
  ]
};

const lifeGrid = document.getElementById('life-grid');
const lifeSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="14" rx="1.5"/><circle cx="8" cy="9" r="2"/><path d="M3 17l4-4 3 3 4-5 7 6"/></svg>';

function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

// Life-at-Hana photos that exist as files under images/life/. Slides without
// a photo fall back to the placeholder icon.
const LIFE_PHOTOS = new Set([
  "life-ayutthaya-annual-company-days-1","life-ayutthaya-annual-company-days-2",
  "life-ayutthaya-celebrations-1","life-ayutthaya-celebrations-2",
  "life-ayutthaya-community-outreach-1",
  "life-ayutthaya-technical-training-programme-1","life-ayutthaya-technical-training-programme-2",
  "life-ayutthaya-health-and-wellbeing-1","life-ayutthaya-health-and-wellbeing-2",
  "life-ayutthaya-student-scholarship-1",
  "life-bangkok-annual-company-days-1",
  "life-bangkok-celebrations-1","life-bangkok-celebrations-2",
  "life-bangkok-community-outreach-1",
  "life-bangkok-technical-training-programme-1",
  "life-bangkok-health-and-wellbeing-1","life-bangkok-health-and-wellbeing-2",
  "life-bangkok-student-scholarship-1","life-bangkok-student-scholarship-2",
  "life-lamphun-annual-company-days-1","life-lamphun-annual-company-days-2",
  "life-lamphun-celebrations-1","life-lamphun-celebrations-2","life-lamphun-celebrations-3",
  "life-lamphun-community-outreach-1","life-lamphun-community-outreach-2",
  "life-lamphun-technical-training-programme-1","life-lamphun-technical-training-programme-2",
  "life-lamphun-health-and-wellbeing-1","life-lamphun-health-and-wellbeing-2","life-lamphun-health-and-wellbeing-3",
  "life-lamphun-student-scholarship-1","life-lamphun-student-scholarship-2","life-lamphun-student-scholarship-3",
  "life-kohkong-annual-company-days-1","life-kohkong-celebrations-1",
  "life-kohkong-community-outreach-1","life-kohkong-technical-training-programme-1",
  "life-kohkong-health-and-wellbeing-1","life-kohkong-student-scholarship-1"
]);

function lifeCard(card, loc) {
  const base = 'life-' + loc + '-' + slugify(card.title) + '-';
  let slides = '';
  for (let n = 1; n <= 6; n++) {
    const id = base + n;
    if (!LIFE_PHOTOS.has(id)) continue;
    slides += '<div class="life-img-slide"><img class="life-photo" loading="lazy" ' +
              'src="images/life/' + id + '.webp" alt="' + card.title + ' at Hana ' + loc + '" /></div>';
  }
  if (!slides) {
    slides = '<div class="life-img-slide">' + lifeSvg + '<span>Photo coming soon</span></div>';
  }
  return '<div class="life-img">' +
           '<div class="life-img-scroll">' + slides + '</div>' +
           '<div class="life-img-cap">' +
             '<div class="cap-title">' + card.title + '</div>' +
             '<p class="cap-desc">' + card.desc + '</p>' +
           '</div>' +
         '</div>';
}

function renderLife(loc) {
  lifeGrid.innerHTML = LIFE_DATA[loc].map(card => lifeCard(card, loc)).join('');
  initCarousels(lifeGrid);
}

document.querySelectorAll('.life-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.life-tab').forEach(t => {
      const on = t === tab;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    renderLife(tab.dataset.loc);
  });
});

renderLife('ayutthaya');

// ── Filter logic ────────────────────────────────────
const checkboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"]');
const cards = document.querySelectorAll('.job-card');
const countEl = document.getElementById('job-count');

const locMap  = { 'f-bkk': 'bangkok', 'f-ayt': 'ayutthaya', 'f-lpn': 'lamphun', 'f-kk': 'kohkong' };
const typeMap = { 'f-ft': 'fulltime', 'f-pt': 'parttime', 'f-int': 'internship' };

function applyFilters() {
  const activeLocs  = Object.entries(locMap).filter(([id]) => document.getElementById(id).checked).map(([,v]) => v);
  const activeTypes = Object.entries(typeMap).filter(([id]) => document.getElementById(id).checked).map(([,v]) => v);
  let visible = 0;
  cards.forEach(card => {
    const show = activeLocs.includes(card.dataset.location) && activeTypes.includes(card.dataset.type);
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  countEl.textContent = visible + (visible === 1 ? ' role' : ' roles');
}
function clearFilters() {
  checkboxes.forEach(cb => cb.checked = true);
  applyFilters();
}
checkboxes.forEach(cb => cb.addEventListener('change', applyFilters));

// ═══════════════════════════════════════════════════
//  TOPOGRAPHIC CONTOURS — light variant (Life + Stories band)
// ═══════════════════════════════════════════════════
(function () {
  const band = document.querySelector('.life-double-band');
  const cvs  = document.getElementById('life-topo');
  const ctx  = cvs.getContext('2d');
  let W, H;

  function resize() {
    W = cvs.width  = band.offsetWidth;
    H = cvs.height = band.offsetHeight;
  }

  function draw() {
    const grd = ctx.createLinearGradient(0, 0, W * 0.85, H);
    grd.addColorStop(0,    '#ffffff');
    grd.addColorStop(0.65, '#e8f0f8');
    grd.addColorStop(1,    '#f4f7fc');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 0.9;
    for (let i = 0; i < 28; i++) {
      const offset = i * 18;
      const yBase  = 80 + i * 14;
      const op     = 0.08 + (i % 4) * 0.06;
      ctx.globalAlpha = op;
      ctx.strokeStyle = '#0E4A7C';
      ctx.beginPath();
      for (let x = -50; x <= W + 50; x += 25) {
        const y = yBase
          + Math.sin((x + offset) * 0.008) * 24
          + Math.sin((x + offset) * 0.018) * 14;
        if (x === -50) ctx.moveTo(x, y);
        else           ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    const veil = ctx.createLinearGradient(0, 0, Math.min(W * 0.42, 500), 0);
    veil.addColorStop(0,   'rgba(255,255,255,0.78)');
    veil.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = veil;
    ctx.fillRect(0, 0, W, H);
  }

  resize();
  draw();
  window.addEventListener('resize', () => { resize(); draw(); });
})();
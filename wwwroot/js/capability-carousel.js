/*!
 * capability-carousel.js — Hana site capability carousel
 * Horizontal scroll track with prev/next arrow buttons.
 * No dependencies. Auto-initialises on DOMContentLoaded.
 *
 * Expected markup:
 *   <div class="hana-carousel" data-carousel>
 *     <div class="hana-carousel__controls">
 *       <button class="hana-carousel-btn" data-carousel-prev>…left arrow…</button>
 *       <button class="hana-carousel-btn" data-carousel-next>…right arrow…</button>
 *     </div>
 *     <div class="hana-carousel__track" data-carousel-track>
 *       <!-- cards -->
 *     </div>
 *   </div>
 */

(function () {
  'use strict';

  function initCarousel(carousel) {
    var track   = carousel.querySelector('[data-carousel-track]');
    var btnPrev = carousel.querySelector('[data-carousel-prev]');
    var btnNext = carousel.querySelector('[data-carousel-next]');
    if (!track || !btnPrev || !btnNext) return;

    function getCardWidth() {
      var firstCard = track.firstElementChild;
      if (!firstCard) return track.clientWidth / 5;
      var style = window.getComputedStyle(track);
      var gap   = parseFloat(style.columnGap || style.gap || '12') || 12;
      return firstCard.offsetWidth + gap;
    }

    function syncButtons() {
      var atStart = track.scrollLeft <= 4;
      var atEnd   = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;

      if (atStart) {
        btnPrev.classList.remove('is-active');
        btnPrev.setAttribute('disabled', '');
      } else {
        btnPrev.classList.add('is-active');
        btnPrev.removeAttribute('disabled');
      }

      if (atEnd) {
        btnNext.classList.remove('is-active');
        btnNext.setAttribute('disabled', '');
      } else {
        btnNext.classList.add('is-active');
        btnNext.removeAttribute('disabled');
      }
    }

    btnPrev.addEventListener('click', function () {
      track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
    });

    btnNext.addEventListener('click', function () {
      track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', syncButtons, { passive: true });

    /* Initial state */
    syncButtons();
  }

  function init() {
    var carousels = document.querySelectorAll('[data-carousel]');
    carousels.forEach(initCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());

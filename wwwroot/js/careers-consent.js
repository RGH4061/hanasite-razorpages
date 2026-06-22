/* careers-consent.js — page interactions (vanilla, extracted) */

const check = document.getElementById('consent-check');
  const btn   = document.getElementById('accept-btn');
  const block = document.getElementById('confirm-block');

  function sync() {
    const on = check.checked;
    block.classList.toggle('checked', on);
    btn.setAttribute('aria-disabled', on ? 'false' : 'true');
    if (on) { btn.removeAttribute('tabindex'); }
    else    { btn.setAttribute('tabindex', '-1'); }
  }
  // visually disable until checked
  btn.style.pointerEvents = 'none';
  btn.style.opacity = '0.45';
  check.addEventListener('change', () => {
    sync();
    if (check.checked) { btn.style.pointerEvents = ''; btn.style.opacity = ''; }
    else { btn.style.pointerEvents = 'none'; btn.style.opacity = '0.45'; }
  });
  sync();
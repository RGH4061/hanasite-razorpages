/* careers-apply.js — page interactions (vanilla, extracted) */

const cvArea = document.getElementById('cv-area');
  const cvInput = cvArea.querySelector('input[type="file"]');
  const cvLabel = cvArea.querySelector('.upload-text strong');
  cvInput.addEventListener('change', () => {
    if (cvInput.files.length) {
      cvLabel.textContent = cvInput.files[0].name;
      cvArea.style.borderColor = 'var(--hana-blue)';
      cvArea.style.background  = 'var(--hana-blue-tint)';
    }
  });

  const presentCheck = document.getElementById('emp1-present');
  const toField = document.getElementById('emp1-to');
  presentCheck.addEventListener('change', () => {
    toField.disabled = presentCheck.checked;
    toField.placeholder = presentCheck.checked ? 'Present' : 'dd/mm/yyyy';
    toField.style.background = presentCheck.checked ? 'var(--surface)' : '';
  });

  /* Education: add another qualification */
  const eduBlocks = document.getElementById('edu-blocks');
  const addEduBtn = document.getElementById('add-edu');
  let eduCount = eduBlocks.querySelectorAll('.edu-block').length;
  addEduBtn.addEventListener('click', () => {
    eduCount++;
    const clone = eduBlocks.querySelector('.edu-block').cloneNode(true);
    clone.querySelectorAll('input').forEach(i => i.value = '');
    clone.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
    clone.querySelectorAll('[required]').forEach(e => e.removeAttribute('required'));
    const head = clone.querySelector('.emp-block-head');
    head.innerHTML = 'Education ' + eduCount + ' — Additional / เพิ่มเติม' +
      '<button type="button" class="block-remove">Remove</button>';
    head.querySelector('.block-remove').addEventListener('click', () => clone.remove());
    eduBlocks.appendChild(clone);
  });

  /* Language: add another language */
  const langBody = document.getElementById('lang-body');
  const addLangBtn = document.getElementById('add-lang');
  addLangBtn.addEventListener('click', () => {
    const clone = langBody.querySelector('tr').cloneNode(true);
    clone.querySelectorAll('input').forEach(i => { i.value = ''; i.placeholder = 'e.g. Mandarin'; });
    clone.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
    const cell = clone.querySelector('.lang-remove-cell');
    cell.innerHTML = '<button type="button" class="lang-remove" aria-label="Remove language">×</button>';
    cell.querySelector('.lang-remove').addEventListener('click', () => clone.remove());
    langBody.appendChild(clone);
  });

  /* Submit → success state */
  const form = document.getElementById('application-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    document.getElementById('form-header').style.display = 'none';
    form.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
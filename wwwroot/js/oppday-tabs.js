// Summary / Transcript tab switch on the results-presentation block.
document.querySelectorAll('.detail .tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    var detail = tab.closest('.detail');
    detail.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
    detail.querySelectorAll('.detail-panel').forEach(function (p) { p.classList.remove('active'); });
    tab.classList.add('active');
    var panel = detail.querySelector('#' + tab.dataset.panel);
    if (panel) panel.classList.add('active');
  });
});

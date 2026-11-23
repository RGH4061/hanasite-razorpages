/* careers-role.js — consent and application pages: show the role the applicant came from.
   The role page's Apply button links here with ?job=<slug>; the roles are in #careers-jobs
   (written by the page from Data/careers-jobs.json). Without a known role the role line and
   breadcrumb stay hidden and the form still works. */
(function () {
  var data = document.getElementById('careers-jobs');
  var slug = new URLSearchParams(location.search).get('job');
  var jobs = {};
  try { jobs = JSON.parse(data ? data.textContent : '{}'); } catch (e) { jobs = {}; }
  var job = slug && Object.prototype.hasOwnProperty.call(jobs, slug) ? jobs[slug] : null;
  if (!job) return;

  document.querySelectorAll('[data-role-title]').forEach(function (el) { el.textContent = job.title; });
  document.querySelectorAll('[data-role-loc]').forEach(function (el) { el.textContent = job.location; });
  document.querySelectorAll('[data-role-link]').forEach(function (el) { el.setAttribute('href', job.url); });
  document.querySelectorAll('[data-role-line], [data-role-crumb]').forEach(function (el) { el.hidden = false; });

  // Keep the role on the next step (consent → application form, and back).
  document.querySelectorAll('a[data-keep-job]').forEach(function (a) {
    a.setAttribute('href', a.getAttribute('href').split('?')[0] + '?job=' + encodeURIComponent(slug));
  });

  // Application form: preselect the employment location for the role's plant.
  var sel = document.getElementById('location');
  if (sel && !sel.value) {
    var opt = sel.querySelector('option[data-plant="' + job.plant + '"]');
    if (opt) opt.selected = true;
  }
})();

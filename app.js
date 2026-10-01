/* Renders data.js: full project blocks on the home page, one row
   per project on the archive. */

const q = (sel) => document.querySelector(sel);

function yearOf(p) {
  const src = String(p.added || p.timeframe || '');
  const m = src.match(/\b(19|20)\d{2}\b/);
  return m ? m[0] : '';
}

function mediaHTML(p) {
  return p.video
    ? `<video autoplay muted loop playsinline preload="metadata" poster="${p.poster}"><source src="${p.video}" type="video/mp4"></video>`
    : `<img src="${p.poster}" alt="${p.title}" loading="lazy" decoding="async">`;
}

function fact(label, value) {
  if (!value) return '';
  return `<div class="fact"><dt>${label}</dt><dd>${value}</dd></div>`;
}

const MEDAL = '<svg class="medal" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"></circle><path d="M9 9.5 6.5 3M15 9.5 17.5 3M9.5 4h5"></path></svg>';

function projectHTML(p) {
  const facts = [
    fact('Engine', p.engine),
    fact('Team size', p.teamSize),
    fact('Genre', p.genre),
    fact('Platform', (p.platforms || []).join(', ')),
    fact('Timeframe', p.timeframe),
  ].filter(Boolean).join('');

  const highlights = (p.responsibilities || []).length
    ? `<div class="project-section">
         <h3>Responsibility highlights</h3>
         <ul class="highlights">${p.responsibilities.map((r) => `<li>${r}</li>`).join('')}</ul>
       </div>`
    : '';

  const awards = (p.awards || []).length
    ? `<ul class="awards">${p.awards.map((a) => `<li>${MEDAL}<span>${a}</span></li>`).join('')}</ul>`
    : '';
  const action = p.link
    ? `<a class="btn btn-primary project-action" href="${p.link}" target="_blank" rel="noopener">Read more ↗</a>`
    : '';

  return `
    <article class="project reveal" id="${p.slug}">
      <div class="project-top">
        <h2 class="project-title">${p.title}</h2>
        ${p.role ? `<p class="project-role">${p.role}</p>` : ''}
        ${p.description ? `<p class="project-lede">${p.description}</p>` : ''}
      </div>
      <div class="project-cols">
        ${highlights}
        <div class="project-section">
          <h3>Project information</h3>
          <dl class="project-facts">${facts}</dl>
        </div>
      </div>
      ${action}
      <div class="project-side">
        <div class="project-media">${mediaHTML(p)}</div>
        ${awards}
      </div>
    </article>`;
}

function archiveRowHTML(p) {
  const year = yearOf(p);
  return `
    <div class="arch-row reveal" id="${p.slug}">
      <div class="arch-thumb">${mediaHTML(p)}</div>
      <div class="arch-meta">
        <span class="meta">${year}</span>
        <h2 class="arch-title">${p.title}</h2>
      </div>
      <p class="arch-desc">${p.description || ''}</p>
      ${p.link ? `<a class="btn btn-ghost btn-sm" href="${p.link}" target="_blank" rel="noopener">Read more ↗</a>` : ''}
    </div>`;
}

// Newest first, by `added`, else the year in `timeframe`.
function byNewest(list) {
  return list.map((p, i) => ({ p, i })).sort((a, b) => {
    const ka = String(a.p.added || yearOf(a.p) || '0');
    const kb = String(b.p.added || yearOf(b.p) || '0');
    if (ka !== kb) return kb.localeCompare(ka);
    return a.i - b.i;
  }).map((x) => x.p);
}

function initReveal() {
  if (!window.IntersectionObserver) return;
  if (window.matchMedia && !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  // Failsafe so content is never left hidden.
  setTimeout(() => document.querySelectorAll('.reveal:not(.in)').forEach((el) => el.classList.add('in')), 1600);
}

// Header gets its blurred ground once the page scrolls.
function initHeadBar() {
  const bar = q('.head-bar');
  if (!bar) return;
  const onScroll = () => bar.classList.toggle('stuck', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initTheme() {
  const sync = () => document.querySelectorAll('[role="switch"].theme-toggle')
    .forEach((s) => s.setAttribute('aria-checked', document.documentElement.dataset.theme === 'light'));
  sync();
  document.querySelectorAll('.theme-toggle').forEach((btn) => btn.addEventListener('click', () => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('theme-anim');
      clearTimeout(initTheme.t);
      initTheme.t = setTimeout(() => root.classList.remove('theme-anim'), 450);
    }
    root.dataset.theme = next;
    sync();
    try { localStorage.setItem('theme', next); } catch (e) {}
  }));
}

function initMenu() {
  const bar = q('.head-bar'), btn = q('.menu-toggle');
  if (!bar || !btn) return;
  const set = (open) => {
    bar.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  btn.addEventListener('click', () => set(!bar.classList.contains('open')));
  bar.querySelectorAll('.head-nav a').forEach((l) => l.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  matchMedia('(min-width: 641px)').addEventListener('change', (e) => { if (e.matches) set(false); });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMenu();
  const main = q('#mainProjects');
  if (main && window.PROJECTS) main.innerHTML = byNewest(PROJECTS.filter((p) => p.showOnHome)).map(projectHTML).join('');

  const arch = q('#archive');
  if (arch && window.PROJECTS) arch.innerHTML = byNewest(PROJECTS.filter((p) => !p.showOnHome)).map(archiveRowHTML).join('');

  initHeadBar();
  initReveal();
});

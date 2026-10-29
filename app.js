/* Renders data.js on the home page: full blocks for main projects,
   one row per archived project. */

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

const AWARD = '<svg class="award-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"></circle><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"></path></svg>';

function awardsHTML(p) {
  return (p.awards || []).length
    ? `<ul class="awards">${p.awards.map((x) => `<li>${AWARD}<span>${x}</span></li>`).join('')}</ul>`
    : '';
}

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

  const action = p.page
    ? `<a class="project-more project-action" href="${p.page}">Read more<span aria-hidden="true">→</span></a>`
    : p.link
    ? `<a class="btn btn-primary project-action" href="${p.link}" target="_blank" rel="noopener">${p.linkLabel || 'Read more'} ↗</a>`
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
        ${awardsHTML(p)}
      </div>
    </article>`;
}

function archiveRowHTML(p) {
  const year = yearOf(p);
  const context = [p.teamSize, p.engine].filter(Boolean).join(' · ');
  return `
    <div class="arch-row reveal" id="${p.slug}">
      <div class="arch-thumb">${mediaHTML(p)}</div>
      <div class="arch-meta">
        <h2 class="arch-title">${p.title}</h2>
        ${year ? `<span class="meta">${year}</span>` : ''}
      </div>
      <div class="arch-body">
        <p class="arch-desc">${p.description || ''}</p>
        ${context ? `<p class="arch-context">${context}</p>` : ''}
        ${awardsHTML(p)}
      </div>
      ${p.link ? `<a class="btn btn-ghost btn-sm" href="${p.link}" target="_blank" rel="noopener">${p.linkLabel || 'Read more'} ↗</a>` : ''}
    </div>`;
}

// Table of contents. Each section switches on at a scroll position: when its
// top reaches a third of the way down the screen. Sections near the end that
// the page can't scroll that far for share out the last stretch of scroll
// evenly, so every one gets a turn. Clicking a link scrolls to that same
// position, so the click and the highlight always agree.
function initToc() {
  const links = [...document.querySelectorAll('.case-toc a[href^="#"]')];
  const secs = links.map((l) => q(l.getAttribute('href')));
  if (!links.length || secs.some((x) => !x)) return;
  let stops = [];
  const measure = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    stops = secs.map((x) => Math.max(0, x.getBoundingClientRect().top + scrollY - innerHeight / 3));
    const u = stops.findIndex((t) => t > max);
    if (u > -1) {
      const base = u ? Math.min(stops[u - 1], max) : 0, n = stops.length - u;
      for (let i = 0; i < n; i++) stops[u + i] = base + (max - base) * (i + 1) / n;
    }
  };
  let frame;
  const update = () => {
    frame = null;
    let i = 0;
    stops.forEach((t, k) => { if (scrollY >= t - 2) i = k; });
    links.forEach((l, k) => l.toggleAttribute('aria-current', k === i));
  };
  links.forEach((l, k) => l.addEventListener('click', (ev) => {
    ev.preventDefault();
    measure();
    scrollTo({ top: stops[k] });
    history.replaceState(null, '', l.getAttribute('href'));
  }));
  const refresh = () => { measure(); update(); };
  refresh();
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  addEventListener('resize', refresh);
  addEventListener('load', refresh);
  if (window.ResizeObserver) new ResizeObserver(refresh).observe(document.body);
}

// Newest first, by `added`, else the year in `timeframe`.
// Array.sort is stable, so equal keys keep their data.js order.
function byNewest(list) {
  const key = (p) => String(p.added || yearOf(p));
  return [...list].sort((a, b) => key(b).localeCompare(key(a)));
}

function initReveal() {
  if (!window.IntersectionObserver) return;
  if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  // Failsafe so content is never left hidden.
  setTimeout(() => document.querySelectorAll('.reveal:not(.in)').forEach((el) => el.classList.add('in')), 1600);
}

// Projects are rendered by script, so the browser's own jump to #slug runs
// before they exist. Jump again once rendered and once images have loaded,
// unless the visitor has already scrolled.
function initHashScroll() {
  const el = location.hash && q(location.hash);
  if (!el) return;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  let moved = false;
  const go = () => {
    if (moved) return;
    const top = el.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(el).scrollMarginTop || 0);
    scrollTo({ top, behavior: 'instant' });
  };
  go();
  requestAnimationFrame(go);
  addEventListener('load', () => { go(); setTimeout(() => { moved = true; }, 50); });
  ['wheel', 'touchstart', 'keydown'].forEach((t) => addEventListener(t, () => { moved = true; }, { once: true, passive: true }));
}

// Home page: the nav link for the section in view lights up. A section is
// in view once its top passes a third of the way down the screen; at the
// very bottom, the last section. Nothing is lit over the hero.
function initNavSpy() {
  const links = [...document.querySelectorAll('.head-nav a')].filter((l) => {
    const h = l.getAttribute('href').split('#')[1];
    return h && q('#' + h);
  });
  if (!links.length) return;
  const secs = links.map((l) => q('#' + l.getAttribute('href').split('#')[1]));
  let frame;
  const update = () => {
    frame = null;
    const line = innerHeight / 3;
    let i = -1;
    secs.forEach((s, k) => { if (s.getBoundingClientRect().top <= line) i = k; });
    if (scrollY > 0 && innerHeight + scrollY >= document.documentElement.scrollHeight - 2) i = secs.length - 1;
    links.forEach((l, k) => k === i ? l.setAttribute('aria-current', 'location') : l.removeAttribute('aria-current'));
  };
  update();
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  addEventListener('resize', update);
  addEventListener('load', update);
}

// Videos load only their first frame up front, so every frame shows a
// picture straight away. Each one fully loads and starts playing once it is
// within a screen of the viewport, so it is already running when it scrolls
// into view, and pauses again once it is well out of view.
function initLazyVideos() {
  const vids = document.querySelectorAll('video[data-lazy]');
  if (!vids.length) return;
  const play = (v) => { v.preload = 'auto'; const p = v.play(); if (p) p.catch(() => {}); };
  if (!window.IntersectionObserver) { vids.forEach(play); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.isIntersecting ? play(e.target) : e.target.pause());
  }, { rootMargin: '100% 0px' });
  vids.forEach((v) => io.observe(v));
}

// Header gets its blurred ground once the page scrolls.
function initHeadBar() {
  const bar = q('.head-bar');
  if (!bar) return;
  const cue = q('.hero-scroll');
  const onScroll = () => {
    bar.classList.toggle('stuck', window.scrollY > 24);
    if (cue) cue.classList.toggle('gone', window.scrollY > 80);
  };
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
  let t;
  window.addEventListener('resize', () => {
    document.documentElement.classList.add('resizing');
    clearTimeout(t);
    t = setTimeout(() => document.documentElement.classList.remove('resizing'), 200);
  });
}

// Links are written clean (/zima). Only the live host maps those to .html
// files, so when the page itself was opened as a .html file (preview, local
// copy), point links at the files instead.
function fixLocalLinks() {
  if (!/\.html$/.test(location.pathname) && location.protocol !== 'file:') return;
  const pages = { '/': 'index.html', '/zima': 'zima.html' };
  document.querySelectorAll('a[href^="/"]').forEach((el) => {
    const [path, hash] = el.getAttribute('href').split('#');
    if (pages[path]) el.setAttribute('href', pages[path] + (hash ? '#' + hash : ''));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMenu();
  const render = (sel, home, tpl) => {
    const el = q(sel);
    if (el && window.PROJECTS) el.innerHTML = byNewest(PROJECTS.filter((p) => !!p.showOnHome === home)).map(tpl).join('');
  };
  render('#mainProjects', true, projectHTML);
  render('#archiveList', false, archiveRowHTML);
  fixLocalLinks();
  initToc();
  initNavSpy();
  initLazyVideos();
  initHeadBar();
  initReveal();
  initHashScroll();
});

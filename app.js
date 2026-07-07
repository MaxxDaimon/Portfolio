/* ============================================================
   PORTFOLIO — ENGINE
   ------------------------------------------------------------
   Renders whatever is in data.js. Shared by both pages:
   index.html (home) and project.html (a single project).
   This file does not normally need editing.
   ============================================================ */

const $ = (sel) => document.querySelector(sel);


/* ---------- Tags ---------- */

// All tag labels for a project, in TAG_TYPES order.
function tagLabels(tags) {
  const out = [];
  for (const type in TAG_TYPES) {
    const val = tags && tags[type];
    if (!val) continue;
    const opts = TAG_TYPES[type].options;
    (Array.isArray(val) ? val : [val]).forEach((k) => out.push(opts[k] || k));
  }
  return out;
}

// The label for one specific type (first value if it's a list).
function typeLabel(tags, type) {
  const val = tags && tags[type];
  if (!val) return '';
  const k = Array.isArray(val) ? val[0] : val;
  return (TAG_TYPES[type].options[k]) || '';
}

function tagChips(tags, cls) {
  return tagLabels(tags).map((label) => `<span class="${cls}">${label}</span>`).join('');
}


/* ---------- Media + links ---------- */

function media(project) {
  const source = project.video ? `<source src="${project.video}" type="video/mp4">` : '';
  return `<video autoplay muted loop playsinline poster="${project.poster}">${source}</video>`;
}

// Where a project's external link points (used for the block button).
function projectLink(p) {
  return p.link || '';
}

// Home cards scroll to the project's block on the projects page.
function homeCardLink(p) {
  return p.slug ? `projects.html#${encodeURIComponent(p.slug)}` : 'projects.html';
}


/* ---------- Card builders (shared by home + all-projects page) ---------- */

function featuredCardHTML(p) {
  return `
    <a class="featured" href="${homeCardLink(p)}">
      ${media(p)}
      <div class="card-scrim"></div>
      <div class="caption">
        <div class="kicker">FEATURED</div>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
      </div>
    </a>`;
}

function gridCardHTML(p) {
  return `
    <a class="card" href="${homeCardLink(p)}">
      <div class="card-media">
        ${media(p)}
      </div>
      <div class="card-body">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
      </div>
    </a>`;
}


/* ---------- Home page: project cards ---------- */
// Shows only projects marked showOnHome. The "VIEW ALL" button links
// to projects.html, which lists everything.

function renderProjects() {
  if (!$('#projectGrid')) return; // not on the home page

  const shown    = PROJECTS.filter((p) => p.showOnHome);
  const featured = shown.filter((p) => p.featured);
  const regular  = shown.filter((p) => !p.featured);

  const countEl = $('#projectCount');
  if (countEl) countEl.textContent = String(PROJECTS.length).padStart(3, '0') + ' PROJECTS';

  $('#featuredSlot').innerHTML = featured.map(featuredCardHTML).join('');
  $('#projectGrid').innerHTML  = regular.map(gridCardHTML).join('');
}


/* ---------- All-projects page (projects.html) ---------- */
// Every project renders as a full expanded block with all its info.

function factRow(label, value) {
  if (!value) return '';
  return `<div class="fact"><dt>${label}</dt><dd>${value}</dd></div>`;
}

function projectBlockHTML(p, num) {
  const facts = [
    factRow('Role', p.role),
    factRow('Timeframe', p.timeframe),
    factRow('Team Size', p.teamSize),
    factRow('Genre', p.genre),
    factRow('Platforms', (p.platforms && p.platforms.length) ? p.platforms.join(', ') : ''),
    factRow('Engine', typeLabel(p.tags, 'engine')),
  ].join('');

  const medal = '<svg class="medal" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"></circle><path d="M9 9.5 6.5 3M15 9.5 17.5 3M9.5 4h5"></path></svg>';

  const awards = (p.awards && p.awards.length)
    ? `<div class="proj-awards">${p.awards.map((a) => `<div class="award">${medal}<span>${a}</span></div>`).join('')}</div>`
    : '';

  const resp = (p.responsibilities && p.responsibilities.length)
    ? `<h3 class="eyebrow proj-sub">RESPONSIBILITY HIGHLIGHTS</h3>
       <ul class="proj-list">${p.responsibilities.map((r) => `<li>${r}</li>`).join('')}</ul>`
    : '';

  const button = p.link
    ? `<a class="btn btn-primary proj-btn" href="${p.link}" target="_blank" rel="noopener">VISIT PROJECT ↗</a>`
    : '';

  const numStr = String(num).padStart(2, '0');

  return `
    <article class="proj" id="${p.slug}">
      <header class="proj-head">
        <div class="proj-titlerow">
          <h2 class="proj-title">${p.title}</h2>
          ${p.featured ? '<span class="proj-flag">FEATURED</span>' : ''}
          <span class="proj-num">${numStr}</span>
        </div>
      </header>

      <div class="proj-media">${media(p)}</div>

      <div class="proj-summary">${p.description || p.summary || ''}</div>

      <aside class="proj-facts">${facts}</aside>

      <div class="proj-resp">${resp}</div>

      <div class="proj-rest">${awards}${button}</div>
    </article>`;
}

/* Order for the projects page: featured first, then newest first.
   "Newest" uses the optional `added` field (e.g. '2026-03' or '2026'),
   falling back to a year parsed from `timeframe`. Ties keep data.js order. */
function addedKey(p) {
  if (p.added) return String(p.added);
  const m = String(p.timeframe || '').match(/\b(19|20)\d{2}\b/);
  return m ? m[0] : '0';
}

function sortedProjects(list) {
  return list
    .map((p, i) => ({ p, i }))
    .sort((a, b) => {
      const fa = a.p.featured ? 0 : 1, fb = b.p.featured ? 0 : 1;
      if (fa !== fb) return fa - fb;                 // featured first
      const ka = addedKey(a.p), kb = addedKey(b.p);
      if (ka !== kb) return kb.localeCompare(ka);    // newest first
      return a.i - b.i;                              // stable: keep data.js order
    })
    .map((x) => x.p);
}

function renderAllProjects() {
  const root = $('#allProjects');
  if (!root) return; // not on the all-projects page

  const ordered = sortedProjects(PROJECTS);

  // Chronological numbering: oldest project = 01 (independent of display order).
  const byAge = [...PROJECTS].sort((a, b) => addedKey(a).localeCompare(addedKey(b)));
  const numberOf = new Map(byAge.map((p, i) => [p.slug, i + 1]));

  root.innerHTML = ordered.map((p) => projectBlockHTML(p, numberOf.get(p.slug))).join('');

  const count = $('#allProjectsCount');
  if (count) count.textContent = String(ordered.length).padStart(3, '0') + ' PROJECTS LISTED';

  // If the URL has #slug, scroll that block into view below the fixed header.
  if (location.hash) {
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (el) {
      requestAnimationFrame(() => {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo(0, y);
      });
    }
  }
}


/* ---------- Hero background ---------- */
// Honors the HERO settings in data.js: static vs rotate, poster vs
// video, which projects, and the interval.

function resolveHeroProjects() {
  const slugs = (typeof HERO !== 'undefined' && HERO.projects) || [];
  if (slugs.length) {
    return slugs
      .map((s) => PROJECTS.find((p) => p.slug === s))
      .filter(Boolean);
  }
  return PROJECTS.filter((p) => p.poster);
}

function heroLayer(item, useVideo, visible) {
  const v = document.createElement('video');
  v.className = 'hero-media hero-layer';
  v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
  if (item.poster) v.setAttribute('poster', item.poster);
  // Fade between poster images; hard-cut between videos.
  v.style.transition = useVideo ? 'none' : 'opacity 1.1s ease';
  v.style.opacity = visible ? '1' : '0';
  v.style.zIndex = visible ? '1' : '0';
  if (useVideo && item.video) {
    const s = document.createElement('source');
    s.src = item.video; s.type = 'video/mp4';
    v.appendChild(s);
  }
  return v;
}

function renderHero() {
  const hero = document.querySelector('.hero');
  if (!hero || typeof HERO === 'undefined') return;   // not on the home page

  const useVideo = HERO.media === 'video';
  let items = resolveHeroProjects();
  if (!items.length) return;

  // Static mode: only the first item, no rotation.
  if (HERO.mode !== 'rotate') items = items.slice(0, 1);

  const oldMedia = hero.querySelector('.hero-media');
  if (oldMedia) oldMedia.remove();

  const layers = items.map((it, i) => {
    const layer = heroLayer(it, useVideo, i === 0);
    hero.insertBefore(layer, hero.firstChild);
    return layer;
  });

  try { layers[0].play(); } catch (e) {}

  if (layers.length < 2) return;                       // nothing to rotate

  let idx = 0;
  setInterval(() => {
    const next = (idx + 1) % layers.length;
    layers[idx].style.opacity = '0'; layers[idx].style.zIndex = '0';
    layers[next].style.opacity = '1'; layers[next].style.zIndex = '1';
    try { layers[next].currentTime = 0; layers[next].play(); } catch (e) {}
    idx = next;
  }, (HERO.intervalSeconds || 6) * 1000);
}


/* ---------- Ticker ---------- */

function renderTicker() {
  if (!$('#tickerTrack')) return;
  const one = TICKER_WORDS.map((w) => `<span>${w}</span><span class="sep">·</span>`).join('');
  $('#tickerTrack').innerHTML = one + one + one + one;
}


/* ---------- Theme (shared by both pages) ---------- */

const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  del: (k) => { try { localStorage.removeItem(k); } catch (e) {} },
};

function currentTheme() {
  return {
    accent: store.get('mw_accent') || ACCENTS[0],
    mood:   store.get('mw_mood')   || Object.keys(MOODS)[0],
    ticker: Number(store.get('mw_ticker') || 40),
  };
}

function applyTheme() {
  const t = currentTheme();
  const m = MOODS[t.mood] || MOODS[Object.keys(MOODS)[0]];
  const r = document.documentElement.style;
  r.setProperty('--accent', t.accent);
  r.setProperty('--bg', m.bg);
  r.setProperty('--surface', m.surface);
  r.setProperty('--surface2', m.surface2);
  r.setProperty('--text', m.text);
  r.setProperty('--muted', m.muted);
  r.setProperty('--line', m.line);
  r.setProperty('--header-bg', m.header);
  r.setProperty('--ticker', t.ticker + 's');
}

function renderThemePanel() {
  const panel = $('#themePanel');
  if (!panel) return;
  const t = currentTheme();

  const swatches = ACCENTS.map((c) =>
    `<button class="swatch ${c === t.accent ? 'on' : ''}" data-accent="${c}" style="background:${c}" aria-label="Accent ${c}"></button>`
  ).join('');
  const moods = Object.keys(MOODS).map((name) =>
    `<button class="mood ${name === t.mood ? 'on' : ''}" data-mood="${name}">${name}</button>`
  ).join('');

  panel.innerHTML = `
    <div class="tp-head"><span>SITE THEME</span><button class="tp-close" aria-label="Close">×</button></div>
    <div class="tp-body">
      <div class="tp-label">ACCENT</div>
      <div class="tp-row">${swatches}</div>
      <div class="tp-label">BACKDROP</div>
      <div class="tp-row">${moods}</div>
      <button class="tp-reset">RESET TO DEFAULT</button>
    </div>`;

  panel.querySelectorAll('.swatch').forEach((b) =>
    b.addEventListener('click', () => { store.set('mw_accent', b.dataset.accent); applyTheme(); renderThemePanel(); }));
  panel.querySelectorAll('.mood').forEach((b) =>
    b.addEventListener('click', () => { store.set('mw_mood', b.dataset.mood); applyTheme(); renderThemePanel(); }));
  panel.querySelector('.tp-close').addEventListener('click', closePanel);
  panel.querySelector('.tp-reset').addEventListener('click', () => {
    ['mw_accent', 'mw_mood', 'mw_ticker'].forEach(store.del); applyTheme(); renderThemePanel();
  });
}

function openPanel()  { renderThemePanel(); $('#themePanel').hidden = false; }
function closePanel() { if ($('#themePanel')) $('#themePanel').hidden = true; }


/* ---------- Boot ---------- */

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  renderProjects();
  renderAllProjects();
  renderHero();
  renderTicker();

  const btn = $('#themeBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      $('#themePanel').hidden ? openPanel() : closePanel();
    });
    document.addEventListener('click', (e) => {
      const panel = $('#themePanel');
      if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) closePanel();
    });
  }
});

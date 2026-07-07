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

// Where a project card points: an external link if given, else its detail page.
function projectLink(p) {
  if (p.link) return p.link;
  return p.slug ? `project.html?id=${encodeURIComponent(p.slug)}` : '#';
}


/* ---------- Home page: project cards ---------- */

function renderProjects() {
  if (!$('#projectGrid')) return; // not on the home page

  const featured = PROJECTS.filter((p) => p.featured);
  const regular  = PROJECTS.filter((p) => !p.featured);

  $('#projectCount').textContent =
    String(PROJECTS.length).padStart(3, '0') + ' PROJECTS';

  // Featured banners
  $('#featuredSlot').innerHTML = featured.map((p) => {
    const team = typeLabel(p.tags, 'team');
    const kicker = 'FEATURED' + (team ? ' · ' + team.toUpperCase() : '');
    return `
      <a class="featured" href="${projectLink(p)}">
        ${media(p)}
        <div class="card-scrim"></div>
        <div class="caption">
          <div>
            <div class="kicker">${kicker}</div>
            <h3>${p.title}</h3>
            <p>${p.description}</p>
          </div>
          <div class="tags">${tagChips(p.tags, 'tag')}</div>
        </div>
      </a>`;
  }).join('');

  // Grid cards — 16:9 media, compact body with tags beside the text
  $('#projectGrid').innerHTML = regular.map((p) => `
    <a class="card" href="${projectLink(p)}">
      <div class="card-media">
        ${media(p)}
      </div>
      <div class="card-body">
        <div class="card-text">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
        </div>
        <div class="card-tags">${tagChips(p.tags, 'tag')}</div>
      </div>
    </a>`).join('');
}


/* ---------- Hero background rotator ---------- */

function renderHeroRotator() {
  const hero = document.querySelector('.hero');
  if (!hero) return;                                   // not on the home page
  if (typeof HERO === 'undefined' || !HERO.rotate) return;

  const items = PROJECTS.filter((p) => p.poster).map((p) => ({ poster: p.poster, video: p.video }));
  if (items.length < 2) return;                        // nothing to cycle

  const oldMedia = hero.querySelector('.hero-media');
  if (oldMedia) oldMedia.remove();

  const layers = items.map((it, i) => {
    const v = document.createElement('video');
    v.className = 'hero-media hero-layer';
    v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
    v.setAttribute('poster', it.poster);
    v.style.opacity = i === 0 ? '1' : '0';
    v.style.zIndex = i === 0 ? '1' : '0';
    if (it.video) {
      const s = document.createElement('source');
      s.src = it.video; s.type = 'video/mp4';
      v.appendChild(s);
    }
    hero.insertBefore(v, hero.firstChild);
    return v;
  });

  try { layers[0].play(); } catch (e) {}

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


/* ---------- Detail page ---------- */

function renderDetail() {
  const root = $('#projectDetail');
  if (!root) return; // not on the detail page

  const id = new URLSearchParams(location.search).get('id');
  const p = PROJECTS.find((x) => x.slug === id);

  if (!p) {
    root.innerHTML = `
      <div class="pd-missing">
        <h1>Project not found</h1>
        <p><a href="index.html">← Back to all projects</a></p>
      </div>`;
    return;
  }

  document.title = p.title + ' — Maxx Wever';

  const meta = [p.year, typeLabel(p.tags, 'team'), typeLabel(p.tags, 'engine')]
    .filter(Boolean)
    .map((m) => `<span>${m}</span>`)
    .join('<span class="pd-dot">·</span>');

  const contributions = (p.contributions && p.contributions.length)
    ? `<div class="pd-block">
         <h2 class="eyebrow">CONTRIBUTIONS</h2>
         <ul class="pd-list">${p.contributions.map((c) => `<li>${c}</li>`).join('')}</ul>
       </div>` : '';

  const body = (p.body && p.body.length)
    ? `<div class="pd-block pd-body">${p.body.map((par) => `<p>${par}</p>`).join('')}</div>` : '';

  const gallery = (p.gallery && p.gallery.length)
    ? `<div class="pd-gallery">${p.gallery.map((src) => `<img src="${src}" alt="">`).join('')}</div>` : '';

  root.innerHTML = `
    <section class="pd-hero">
      ${media(p)}
      <div class="hero-scrim"></div>
      <div class="pd-hero-content">
        <a class="pd-back" href="index.html">← ALL PROJECTS</a>
        <h1 class="pd-title">${p.title}</h1>
        <div class="pd-meta">${meta}</div>
        <div class="tags pd-tags">${tagChips(p.tags, 'tag')}</div>
      </div>
    </section>

    <div class="pd-content">
      ${p.summary ? `<p class="pd-summary">${p.summary}</p>` : ''}
      ${contributions}
      ${body}
      ${gallery}
      ${p.link ? `<a class="btn btn-primary" href="${p.link}">VISIT PROJECT ↗</a>` : ''}
    </div>`;
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
  renderHeroRotator();
  renderTicker();
  renderDetail();

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

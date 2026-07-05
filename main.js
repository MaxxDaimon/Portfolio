/* ============================================================
   MAXX WEVER — PORTFOLIO LOGIC
   ------------------------------------------------------------
   You only need to touch the three CONFIG blocks below to keep
   the site up to date. Everything under "ENGINE" just renders
   what you put in the config — you can leave it alone.
   ============================================================ */


/* ============================================================
   1) TAG CATALOG
   ------------------------------------------------------------
   Your master list of tags. Left side = short key you use in a
   project's "tags" list. Right side = the label shown on screen.
   Add a new line to create a new tag. Example:
       audio: 'Audio Design',
   ============================================================ */
const TAGS = {
  systems:      'Systems Design',
  combat:       'Combat',
  threeCs:      '3Cs',
  systemic:     'Systemic Gameplay',
  unreal:       'Unreal',
  unity:        'Unity',
  csharp:       'C#',
  visualScript: 'Visual Scripting',
  prototyping:  'Rapid Prototyping',
  tools:        'Tools',
  solo:         'Solo',
  team:         'Team Project',
  gamejam:      'Game Jam',
  placeholder:  'Placeholder',
};


/* ============================================================
   2) PROJECTS
   ------------------------------------------------------------
   The FIRST project in this list is shown big (the featured
   16:9 banner). Every project after it becomes a card in the
   grid below.

   To ADD a project: copy one { ... } block, paste it, and edit
   the values. To REMOVE one: delete its block. To REORDER:
   move blocks up/down (first = featured).

   Fields:
     title        heading text
     kicker        small label above the title
     description   one or two sentences
     tags          list of keys from the TAG CATALOG above
     poster        image shown in the card  (put file in assets/)
     video         OPTIONAL — a video that plays over the poster.
                   Leave as '' if you only have an image for now.
                   Drop the .mp4 in assets/ later and fill this in.
     link          where clicking the card goes ('#' = nowhere yet)
   ============================================================ */
const PROJECTS = [
  {
    title:       'ZIMA',
    kicker:      'FEATURED · TEAM PROJECT',
    description: 'Play as a pacifist windsurfing cowboy and save corrupted creatures using your trusty lasso.',
    tags:        ['systems', 'combat', 'unreal'],
    poster:      'assets/zima-poster.png',
    video:       'assets/zima.mp4',
    link:        '#',
  },
  {
    title:       'Project Title',
    kicker:      '02 · SOLO',
    description: 'One-line description of the project and your contribution.',
    tags:        ['placeholder'],
    poster:      'assets/project-02-poster.png',
    video:       'assets/project-02.mp4',
    link:        '#',
  },
  {
    title:       'Project Title',
    kicker:      '03 · GAME JAM',
    description: 'One-line description of the project and your contribution.',
    tags:        ['placeholder'],
    poster:      'assets/project-03-poster.png',
    video:       'assets/project-03.mp4',
    link:        '#',
  },
];


/* ============================================================
   3) SKILLS TICKER
   ------------------------------------------------------------
   The words that scroll across the strip under the hero.
   Add / remove / reorder freely.
   ============================================================ */
const TICKER_WORDS = [
  'RESEARCHING', 'CONCEPTING', 'RAPID PROTOTYPING',
  'VISUAL SCRIPTING', '3CS', 'COMBAT SYSTEMS',
];


/* ============================================================
   4) THEME OPTIONS  (the visitor THEME panel)
   ------------------------------------------------------------
   Accent colours and backdrop moods offered to visitors.
   ============================================================ */
const ACCENTS = ['#E5484D', '#C6F24E', '#38E1FF', '#FF6B3D', '#C9A227'];
const MOODS = {
  'Void':     { bg: '#0B0B0D', surface: '#101013', surface2: '#0f0f12', text: '#F2F2F0', muted: '#9a9a95', line: '#1e1e22', header: 'rgba(11,11,13,.72)' },
  'Charcoal': { bg: '#141414', surface: '#1a1a1a', surface2: '#181818', text: '#F2F2F0', muted: '#9a9a95', line: '#2a2a2a', header: 'rgba(20,20,20,.72)' },
  'Deep Sea': { bg: '#0A0F14', surface: '#0F1620', surface2: '#0C121A', text: '#EAF1F6', muted: '#9aa5b0', line: '#1a2430', header: 'rgba(10,15,20,.72)' },
  'Paper':    { bg: '#EFEBE2', surface: '#F6F3EC', surface2: '#E7E2D6', text: '#1A1A17', muted: '#6b665c', line: '#DCD6C8', header: 'rgba(239,235,226,.85)' },
  'Fog':      { bg: '#EDEFF2', surface: '#F8F9FB', surface2: '#E3E6EA', text: '#14171B', muted: '#5c626b', line: '#D6DADF', header: 'rgba(237,239,242,.88)' },
};


/* ============================================================
   ============  ENGINE — you can leave this alone  ===========
   ============================================================ */

const $ = (sel) => document.querySelector(sel);

/* ---- helper: build a tag chip ---- */
function tagChips(keys, cls) {
  return (keys || [])
    .map((k) => `<span class="${cls}">${TAGS[k] || k}</span>`)
    .join('');
}

/* ---- helper: video-with-poster markup ---- */
function media(project) {
  const source = project.video ? `<source src="${project.video}" type="video/mp4">` : '';
  return `<video autoplay muted loop playsinline poster="${project.poster}">${source}</video>`;
}

/* ---- render the projects ---- */
function renderProjects() {
  const [featured, ...rest] = PROJECTS;

  $('#projectCount').textContent =
    String(PROJECTS.length).padStart(3, '0') + ' PROJECTS';

  if (featured) {
    $('#featuredSlot').innerHTML = `
      <a class="featured" href="${featured.link}">
        ${media(featured)}
        <div class="card-scrim"></div>
        <div class="caption">
          <div>
            <div class="kicker">${featured.kicker}</div>
            <h3>${featured.title}</h3>
            <p>${featured.description}</p>
          </div>
          <div class="tags">${tagChips(featured.tags, 'tag')}</div>
        </div>
      </a>`;
  }

  $('#projectGrid').innerHTML = rest.map((p) => `
    <a class="card" href="${p.link}">
      ${media(p)}
      <div class="card-body">
        <div class="card-kicker">${p.kicker}</div>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="tags">${tagChips(p.tags, 'tag')}</div>
      </div>
    </a>`).join('');
}

/* ---- render the ticker (doubled so the loop is seamless) ---- */
function renderTicker() {
  const one = TICKER_WORDS.map((w) => `<span>${w}</span><span class="sep">·</span>`).join('');
  $('#tickerTrack').innerHTML = one + one + one + one;
}

/* ---- THEME: read/apply/save visitor preferences ---- */
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  del: (k) => { try { localStorage.removeItem(k); } catch (e) {} },
};

function currentTheme() {
  return {
    accent: store.get('mw_accent') || ACCENTS[0],
    mood:   store.get('mw_mood')   || 'Void',
    ticker: Number(store.get('mw_ticker') || 40),
  };
}

function applyTheme() {
  const t = currentTheme();
  const m = MOODS[t.mood] || MOODS['Void'];
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
  const t = currentTheme();
  const swatches = ACCENTS.map((c) =>
    `<button class="swatch ${c === t.accent ? 'on' : ''}" data-accent="${c}" style="background:${c}" aria-label="Accent ${c}"></button>`
  ).join('');
  const moods = Object.keys(MOODS).map((name) =>
    `<button class="mood ${name === t.mood ? 'on' : ''}" data-mood="${name}">${name}</button>`
  ).join('');

  $('#themePanel').innerHTML = `
    <div class="tp-head"><span>SITE THEME</span><button class="tp-close" aria-label="Close">×</button></div>
    <div class="tp-body">
      <div class="tp-label">ACCENT</div>
      <div class="tp-row">${swatches}</div>
      <div class="tp-label">BACKDROP</div>
      <div class="tp-row">${moods}</div>
      <div class="tp-label" style="display:flex;justify-content:space-between">
        <span>MOTION</span><span style="color:#6d6d68">${t.ticker}s / loop</span>
      </div>
      <input class="tp-slider" type="range" min="12" max="80" step="2" value="${t.ticker}">
      <button class="tp-reset">RESET TO DEFAULT</button>
    </div>`;

  // wire up controls
  $('#themePanel').querySelectorAll('.swatch').forEach((b) =>
    b.addEventListener('click', () => { store.set('mw_accent', b.dataset.accent); applyTheme(); renderThemePanel(); }));
  $('#themePanel').querySelectorAll('.mood').forEach((b) =>
    b.addEventListener('click', () => { store.set('mw_mood', b.dataset.mood); applyTheme(); renderThemePanel(); }));
  $('#themePanel').querySelector('.tp-slider').addEventListener('input', (e) => {
    store.set('mw_ticker', e.target.value); applyTheme();
    e.target.previousElementSibling.querySelector('span:last-child').textContent = e.target.value + 's / loop';
  });
  $('#themePanel').querySelector('.tp-close').addEventListener('click', closePanel);
  $('#themePanel').querySelector('.tp-reset').addEventListener('click', () => {
    ['mw_accent', 'mw_mood', 'mw_ticker'].forEach(store.del); applyTheme(); renderThemePanel();
  });
}

function openPanel()  { renderThemePanel(); $('#themePanel').hidden = false; }
function closePanel() { $('#themePanel').hidden = true; }

/* ---- boot ---- */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  renderProjects();
  renderTicker();

  $('#themeBtn').addEventListener('click', () => {
    $('#themePanel').hidden ? openPanel() : closePanel();
  });
  // click outside the panel closes it
  document.addEventListener('click', (e) => {
    const panel = $('#themePanel'), btn = $('#themeBtn');
    if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) closePanel();
  });
});

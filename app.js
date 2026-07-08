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
  return `<video autoplay muted loop playsinline preload="none" poster="${project.poster}">${source}</video>`;
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
    ? `<a class="proj-media-btn" href="${p.link}" target="_blank" rel="noopener">VISIT PROJECT ↗</a>`
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

      <div class="proj-media">${media(p)}${button}</div>

      <aside class="proj-facts">
        ${(p.description || p.summary) ? `<p class="fact-desc">${p.description || p.summary}</p>` : ''}
        ${facts}
      </aside>

      <div class="proj-resp">${resp}</div>

      <div class="proj-rest">${awards}</div>
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

let activeFilter = null; // tag key currently filtering the projects page, or null = All

// All distinct tag keys a project carries, across every type.
function projectTagKeys(p) {
  const out = [];
  const t = p.tags || {};
  Object.keys(TAG_TYPES).forEach((type) => {
    const v = t[type];
    if (!v) return;
    (Array.isArray(v) ? v : [v]).forEach((k) => out.push(k));
  });
  return out;
}

// Distinct tag keys of one type used across all projects (in TAG_TYPES order).
function usedKeysForType(type) {
  const opts = TAG_TYPES[type].options;
  const used = new Set();
  PROJECTS.forEach((p) => {
    const v = p.tags && p.tags[type];
    if (!v) return;
    (Array.isArray(v) ? v : [v]).forEach((k) => used.add(k));
  });
  return Object.keys(opts).filter((k) => used.has(k));
}

function renderFilters() {
  const bar = $('#projectFilters');
  if (!bar) return;

  // Build one group per tag TYPE that mirrors the info card, but only when the
  // type actually divides the work (≥2 of its options are used) — so a category
  // where every project is unique (or all share one value) never clutters the bar.
  const groups = Object.keys(TAG_TYPES).map((type) => {
    const keys = usedKeysForType(type);
    return { type, label: TAG_TYPES[type].label, keys };
  }).filter((g) => g.keys.length >= 2);

  if (!groups.length) { bar.innerHTML = ''; return; }

  bar.innerHTML = `
    <button class="filter-chip filter-all ${activeFilter === null ? 'on' : ''}" data-key="">All work</button>
    ${groups.map((g) => `
      <div class="filter-group">
        <span class="filter-group-label">${g.label}</span>
        <div class="filter-chips">
          ${g.keys.map((k) =>
            `<button class="filter-chip ${k === activeFilter ? 'on' : ''}" data-key="${k}">${TAG_TYPES[g.type].options[k]}</button>`
          ).join('')}
        </div>
      </div>`).join('')}`;

  bar.querySelectorAll('.filter-chip').forEach((b) =>
    b.addEventListener('click', () => {
      const k = b.dataset.key || null;
      activeFilter = (k === activeFilter) ? null : k; // click active chip again = clear
      renderFilters();
      renderAllProjects();
    }));
}

function renderAllProjects() {
  const root = $('#allProjects');
  if (!root) return; // not on the all-projects page

  let ordered = sortedProjects(PROJECTS);
  if (activeFilter) ordered = ordered.filter((p) => projectTagKeys(p).includes(activeFilter));

  // Chronological numbering: oldest project = 01 (independent of display order/filter).
  const byAge = [...PROJECTS].sort((a, b) => addedKey(a).localeCompare(addedKey(b)));
  const numberOf = new Map(byAge.map((p, i) => [p.slug, i + 1]));

  root.innerHTML = ordered.map((p) => projectBlockHTML(p, numberOf.get(p.slug))).join('');

  const count = $('#allProjectsCount');
  if (count) count.textContent = String(ordered.length).padStart(3, '0')
    + (activeFilter ? ' SHOWN' : ' PROJECTS LISTED');

  // If the URL has #slug, scroll that block into view below the fixed header.
  if (!activeFilter && location.hash) {
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
  // Poster mode: a plain background-image div. This is far more reliable across
  // browsers than a <video> with a poster but no source (Safari often paints
  // that black), which caused the hero to sometimes fade to black.
  if (!useVideo || !item.video) {
    const d = document.createElement('div');
    d.className = 'hero-media hero-layer';
    if (item.poster) {
      d.style.backgroundImage = `url("${item.poster}")`;
      d.style.backgroundSize = 'cover';
      d.style.backgroundPosition = 'center';
    }
    d.style.transition = 'opacity 1.1s ease';
    d.style.opacity = visible ? '1' : '0';
    d.style.zIndex = visible ? '1' : '0';
    return d;
  }

  // Video mode: real <video> with a poster fallback while it buffers.
  const v = document.createElement('video');
  v.className = 'hero-media hero-layer';
  v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
  if (item.poster) v.setAttribute('poster', item.poster);
  v.style.transition = 'none'; // hard-cut between videos
  v.style.opacity = visible ? '1' : '0';
  v.style.zIndex = visible ? '1' : '0';
  const s = document.createElement('source');
  s.src = item.video; s.type = 'video/mp4';
  v.appendChild(s);
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

  try { if (layers[0].play) layers[0].play(); } catch (e) {}

  if (layers.length < 2) return;                       // nothing to rotate

  let idx = 0;
  setInterval(() => {
    const next = (idx + 1) % layers.length;
    layers[idx].style.opacity = '0'; layers[idx].style.zIndex = '0';
    layers[next].style.opacity = '1'; layers[next].style.zIndex = '1';
    try { if (layers[next].play) { layers[next].currentTime = 0; layers[next].play(); } } catch (e) {}
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
  // Arcade mode keeps its neon accent regardless of the chosen theme.
  if (typeof arcadeIsOn === 'function' && arcadeIsOn()) r.setProperty('--accent', ARCADE_GREEN);
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

  // The Arcade toggle only appears once the Konami code has been discovered.
  const arcadeRow = arcadeUnlocked() ? `
      <div class="tp-switchrow">
        <span class="tp-label" style="margin:0">KONAMI MODE</span>
        <button class="tp-toggle ${arcadeIsOn() ? 'on' : ''}" id="tpArcade" role="switch" aria-checked="${arcadeIsOn()}" aria-label="Konami mode">
          <span class="tp-toggle-knob"></span>
        </button>
      </div>` : '';

  panel.innerHTML = `
    <div class="tp-head"><span>SITE THEME</span><button class="tp-close" aria-label="Close">×</button></div>
    <div class="tp-body">
      <div class="tp-label">ACCENT</div>
      <div class="tp-row">${swatches}</div>
      <div class="tp-label">BACKDROP</div>
      <div class="tp-row">${moods}</div>
      ${arcadeRow}
      <button class="tp-reset">RESET TO DEFAULT</button>
    </div>`;

  const arcadeBtn = panel.querySelector('#tpArcade');
  if (arcadeBtn) arcadeBtn.addEventListener('click', () => setArcade(!arcadeIsOn(), false));

  panel.querySelectorAll('.swatch').forEach((b) =>
    b.addEventListener('click', () => {
      const pr = panel.getBoundingClientRect();
      const or = b.getBoundingClientRect();
      const x = or.left - pr.left + or.width / 2;
      const y = or.top - pr.top + or.height / 2;
      const color = b.dataset.accent;
      pulseThemeAnim();
      store.set('mw_accent', color); applyTheme(); renderThemePanel();
      spawnRipple(panel, x, y, color);
    }));
  panel.querySelectorAll('.mood').forEach((b) =>
    b.addEventListener('click', () => {
      pulseThemeAnim();
      store.set('mw_mood', b.dataset.mood); applyTheme(); renderThemePanel();
    }));
  panel.querySelector('.tp-close').addEventListener('click', closePanel);
  panel.querySelector('.tp-reset').addEventListener('click', () => {
    pulseThemeAnim();
    if (arcadeIsOn()) setArcade(false, false); // reset also exits Konami mode
    ['mw_accent', 'mw_mood', 'mw_ticker'].forEach(store.del); applyTheme(); renderThemePanel();
  });
}

// Briefly enable a global color transition so the new theme eases in.
let _themeAnimTimer = null;
function pulseThemeAnim() {
  const el = document.documentElement;
  el.classList.add('theme-anim');
  clearTimeout(_themeAnimTimer);
  _themeAnimTimer = setTimeout(() => el.classList.remove('theme-anim'), 550);
}

// A soft wash of the chosen accent radiating from the clicked swatch.
// Called AFTER the panel re-renders (its innerHTML is rebuilt), so it appends
// to the surviving panel element using coordinates captured before the render.
function spawnRipple(panel, x, y, color) {
  if (window.matchMedia && !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  const rip = document.createElement('span');
  rip.className = 'tp-ripple';
  rip.style.left = x + 'px';
  rip.style.top = y + 'px';
  rip.style.width = rip.style.height = '80px';
  rip.style.background = color;
  panel.appendChild(rip);
  rip.addEventListener('animationend', () => rip.remove());
}

function openPanel()  { renderThemePanel(); $('#themePanel').hidden = false; }
function closePanel() { if ($('#themePanel')) $('#themePanel').hidden = true; }


/* ---------- Portrait carousel ---------- */
// Swaps the About portrait between a set of photos via arrows / dots.
// Add or remove file paths here to change the set.
const PORTRAITS = ['assets/portraits/portrait-2.jpg', 'assets/portraits/portrait-1.jpg'];

function initPortraitCarousel() {
  const box = document.querySelector('[data-portrait]');
  if (!box || PORTRAITS.length < 2) return;

  const img = box.querySelector('.portrait');
  const dots = box.querySelector('.portrait-dots');
  let i = 0;

  PORTRAITS.forEach((src) => { const im = new Image(); im.src = src; }); // preload

  if (dots) {
    dots.innerHTML = PORTRAITS.map((_, n) =>
      `<button type="button" aria-label="Photo ${n + 1}"${n === 0 ? ' class="on"' : ''}></button>`).join('');
  }

  function show(n) {
    i = (n + PORTRAITS.length) % PORTRAITS.length;
    img.style.opacity = '0';
    setTimeout(() => { img.src = PORTRAITS[i]; img.style.opacity = '1'; }, 180);
    if (dots) [...dots.children].forEach((d, n2) => d.classList.toggle('on', n2 === i));
  }

  box.querySelector('.portrait-next').addEventListener('click', () => { show(i + 1); resetAuto(); });
  box.querySelector('.portrait-prev').addEventListener('click', () => { show(i - 1); resetAuto(); });
  if (dots) [...dots.children].forEach((d, n) => d.addEventListener('click', () => { show(n); resetAuto(); }));

  // Slow auto-advance; pauses on hover, resumes on leave.
  let timer = setInterval(() => show(i + 1), 8000);
  function resetAuto() { clearInterval(timer); timer = setInterval(() => show(i + 1), 8000); }
  box.addEventListener('mouseenter', () => clearInterval(timer));
  box.addEventListener('mouseleave', resetAuto);
}


/* ---------- Articles page (articles.html) ---------- */

function renderArticles() {
  const root = $('#articleList');
  if (!root) return; // not on the articles page

  const list = (typeof ARTICLES !== 'undefined' ? ARTICLES : []).slice()
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

  if (!list.length) {
    root.innerHTML = `
      <div class="articles-empty">
        <div class="constr-icon">✎</div>
        <h2>This page is currently under construction.</h2>
        <p>Write-ups and articles on design, prototyping and process are on the way. Check back soon.</p>
        <a class="btn btn-ghost" href="projects.html">VIEW PROJECTS →</a>
      </div>`;
    return;
  }

  const fmtDate = (d) => {
    if (!d) return '';
    const [y, m] = String(d).split('-');
    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return m ? `${months[+m]} ${y}` : y;
  };

  root.innerHTML = `<div class="article-grid">${list.map((a) => {
    const inner = `
      <div class="article-meta">
        <span class="article-date">${fmtDate(a.date)}</span>
        ${a.tag ? `<span class="article-tag">${a.tag}</span>` : ''}
      </div>
      <h2 class="article-title">${a.title || 'Untitled'}</h2>
      ${a.summary ? `<p class="article-summary">${a.summary}</p>` : ''}
      ${a.link ? '<span class="article-more">READ →</span>' : ''}`;
    return a.link
      ? `<a class="article-card" href="${a.link}" target="_blank" rel="noopener">${inner}</a>`
      : `<article class="article-card">${inner}</article>`;
  }).join('')}</div>`;
}


/* ---------- Scroll reveal ---------- */
// Gently fades/rises elements as they scroll into view.
// Skipped entirely for visitors who prefer reduced motion.
function initReveal() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;

  const sel = '.featured, .card, .proj, .article-card, .articles-empty,'
    + ' .about-grid, .exp-row, .skill-col, .section-head, .hero-cta, .contact-title, .contact-links';
  const targets = document.querySelectorAll(sel);
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px 12% 0px' });

  targets.forEach((el, n) => {
    el.classList.add('reveal');
    el.style.transitionDelay = Math.min(n % 3, 2) * 50 + 'ms'; // slight stagger within a group
    io.observe(el);
  });

  // Failsafe: whatever hasn't revealed after 1.2s (observer glitch, odd
  // Safari timing, etc.) is shown anyway, so content can never get stuck hidden.
  setTimeout(() => {
    targets.forEach((el) => el.classList.add('is-visible'));
  }, 1200);
}


/* ---------- Nav: current-page + scroll-spy highlighting ---------- */
// Adds .nav-active to the nav link matching the current page, and (on the home
// page) tracks which section is in view. The RESUME link keeps its own accent
// styling and is never touched here.
function initNavActive() {
  const links = [...document.querySelectorAll('.nav a')];
  if (!links.length) return;
  const path = (location.pathname.split('/').pop() || 'index.html');

  // Static highlight for full-page links (projects.html, about.html, articles.html)
  links.forEach((a) => {
    const href = (a.getAttribute('href') || '');
    if (/\.html$/.test(href) && href.split('#')[0] === path) a.classList.add('nav-active');
  });

  // Scroll-spy on the home page: highlight whichever section currently fills
  // the most of the viewport (HOME → PROJECTS → ABOUT → CONTACT). This is
  // determined by visible area, so it's correct everywhere — including the
  // bottom of the page, where CONTACT can't reach the top but still dominates
  // the visible space.
  const isHome = (path === 'index.html' || path === '');
  if (!isHome) return;

  const nav = (href) => document.querySelector('.nav a[href="' + href + '"]');
  const spy = [
    { el: document.querySelector('.hero'),    link: nav('#top') },
    { el: document.getElementById('work'),    link: nav('projects.html') },
    { el: document.getElementById('about'),   link: nav('about.html') },
    { el: document.getElementById('contact'), link: nav('#contact') },
  ].filter((s) => s.el && s.link);
  if (!spy.length) return;

  let current = null;
  const update = () => {
    const vh = window.innerHeight;
    let best = spy[0];
    let bestVisible = -1;
    for (const s of spy) {
      const r = s.el.getBoundingClientRect();
      const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      if (visible > bestVisible) { bestVisible = visible; best = s; }
    }
    // Bottom-of-page exception: once the page is scrolled to (or very near) the
    // end, force the last section. A short final section like CONTACT can never
    // fill more of the viewport than the tall one above it, so pure coverage
    // would never select it — but reaching the bottom clearly means you're there.
    const docH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    if (window.innerHeight + window.scrollY >= docH - 2) {
      best = spy[spy.length - 1];
    }
    if (best !== current) {
      current = best;
      spy.forEach((s) => s.link.classList.toggle('nav-active', s === best));
    }
  };

  // Throttled with a trailing call, and NOT using requestAnimationFrame (which
  // browsers pause in background/offscreen frames, freezing the highlight).
  let scheduled = false;
  const onScroll = () => {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => { scheduled = false; update(); }, 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update);
  update();
}


/* ---------- Copy-email-to-clipboard ---------- */
// Clicking a mailto link copies the address and briefly shows "COPIED".
// The default mailto still fires, so visitors with a mail app get both.
function initCopyEmail() {
  document.querySelectorAll('a[href^="mailto:"]').forEach((a) => {
    a.addEventListener('click', () => {
      const email = a.getAttribute('href').replace('mailto:', '').split('?')[0];
      copyText(email);
      flashCopied(a);
    });
  });
}

// Copy with a clipboard-API path and an execCommand fallback for non-secure
// contexts / older browsers.
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => legacyCopy(text));
  } else {
    legacyCopy(text);
  }
}
function legacyCopy(text) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  } catch (e) { /* no-op */ }
}
function flashCopied(a) {
  if (a.dataset.flashing) return;
  a.dataset.flashing = '1';
  const original = a.textContent;
  a.textContent = 'COPIED ✓';
  a.classList.add('copied');
  setTimeout(() => {
    a.textContent = original;
    a.classList.remove('copied');
    delete a.dataset.flashing;
  }, 1500);
}


/* ---------- Konami code easter egg (Arcade Mode) ---------- */
// ↑ ↑ ↓ ↓ ← → ← → B A  →  toggles a CRT "arcade" theme. Persists across pages
// via localStorage; Esc (or entering the code again) exits.
const ARCADE_GREEN = '#39FF14';

function arcadeIsOn() { return document.documentElement.classList.contains('arcade'); }
function arcadeUnlocked() { return store.get('mw_arcade_unlocked') === '1'; }

function setArcade(on, announce) {
  store.set('mw_arcade', on ? '1' : '0');

  if (on) {
    ensurePixelFont();
    powerOnReveal(); // wipes the theme in behind a downward sweep, then commits
  } else {
    document.documentElement.classList.remove('arcade');
    if (typeof applyTheme === 'function') applyTheme();
  }

  if (announce) arcadeToast(on
    ? ['KONAMI MODE UNLOCKED', 'PRESS ESC TO EXIT']
    : ['KONAMI MODE OFF', '']);
  // Keep the THEME panel's toggle in sync if it's open (reflect the target state).
  if (typeof renderThemePanel === 'function' && !document.getElementById('themePanel').hidden) {
    renderThemePanel();
  }
}

// Actually apply the arcade theme (class + neon accent) and sync the panel.
function commitArcade() {
  document.documentElement.classList.add('arcade');
  document.documentElement.style.setProperty('--accent', ARCADE_GREEN);
  if (typeof renderThemePanel === 'function' && !document.getElementById('themePanel').hidden) {
    renderThemePanel();
  }
}

// Load the arcade display font once, only when the mode is first used.
function ensurePixelFont() {
  if (document.getElementById('mw-pixel-font')) return;
  const l = document.createElement('link');
  l.id = 'mw-pixel-font';
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
  document.head.appendChild(l);
}

// CRT power-on. A green scanline overlay wipes in from top to bottom (clip-path)
// led by a bright sweep bar, and the real theme is committed just as the sweep
// nears the bottom — so nothing arcade appears ahead of the bar. Reduced-motion
// users skip the animation and get the theme instantly.
function powerOnReveal() {
  const reveal = document.createElement('div');
  reveal.className = 'crt-reveal';
  const bar = document.createElement('div');
  bar.className = 'crt-poweron';
  document.body.appendChild(reveal);
  document.body.appendChild(bar);

  // Commit the real theme while the sweep is near the bottom and the overlay
  // still covers the page, so the swap is hidden under the green wash.
  setTimeout(commitArcade, 600);
  setTimeout(() => { reveal.remove(); bar.remove(); }, 780);
}

function arcadeToast(lines) {
  const prev = document.querySelector('.arcade-toast');
  if (prev) prev.remove();
  const t = document.createElement('div');
  t.className = 'arcade-toast';
  t.innerHTML = lines[0] + (lines[1] ? `<span class="sub">${lines[1]}</span>` : '');
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 400);
  }, 2600);
}

function initKonami() {
  const SEQ = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown',
               'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  let pos = 0;

  // Re-apply a previously unlocked arcade state on load (no toast/animation).
  if (store.get('mw_arcade') === '1') {
    document.documentElement.classList.add('arcade');
    document.documentElement.style.setProperty('--accent', ARCADE_GREEN);
    ensurePixelFont();
  }

  document.addEventListener('keydown', (e) => {
    const key = (e.key || '').toLowerCase();

    // Esc exits arcade if it's on.
    if (key === 'escape' && arcadeIsOn()) {
      setArcade(false, true);
      pos = 0;
      return;
    }

    // Ignore typing in inputs/textareas.
    const tag = (e.target && e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    if (key === SEQ[pos]) {
      pos++;
      if (pos === SEQ.length) {
        pos = 0;
        store.set('mw_arcade_unlocked', '1'); // permanently reveal the panel toggle
        setArcade(!arcadeIsOn(), true);
      }
    } else {
      // Allow a mistaken key to still start a fresh match if it equals SEQ[0].
      pos = (key === SEQ[0]) ? 1 : 0;
    }
  });
}


/* ---------- Page transitions ---------- */
// The quick fade-IN is handled by a tiny inline <head> script on each page (so
// it works even before app.js loads). There is intentionally no fade-OUT —
// clicking a link navigates instantly, avoiding any fade-to-black between pages.
//
// Prefetch-on-intent: when the cursor touches (or a finger taps toward) an
// internal link, fetch that page in the background so it's cached and loads
// near-instantly on click. This is what makes navigation feel premium — the
// next page is already in memory before the click completes.
function initPrefetch() {
  const done = new Set();
  const prefetch = (href) => {
    if (!href || done.has(href)) return;
    if (/^https?:\/\//i.test(href) || href.startsWith('#') ||
        href.startsWith('mailto:') || href.startsWith('tel:')) return;
    done.add(href);
    const l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = href;
    document.head.appendChild(l);
  };
  document.querySelectorAll('.nav a, a.btn, a.card, .featured').forEach((a) => {
    const href = a.getAttribute && a.getAttribute('href');
    if (!href) return;
    let hovered = false;
    const trigger = () => { if (!hovered) { hovered = true; prefetch(href); } };
    a.addEventListener('mouseenter', trigger);
    a.addEventListener('touchstart', trigger, { passive: true });
    a.addEventListener('focus', trigger);
  });
}


/* ---------- Boot ---------- */

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  renderProjects();
  renderFilters();
  renderAllProjects();
  renderArticles();
  renderHero();
  renderTicker();
  initPortraitCarousel();
  initReveal();
  initNavActive();
  initCopyEmail();
  initKonami();
  initPrefetch();

  // Mobile nav toggle
  const navToggle = $('#navToggle');
  const nav = $('#mainNav');
  if (navToggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    navToggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    // Close after tapping a link (but not the THEME button)
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  }

  const btn = $('#themeBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      $('#themePanel').hidden ? openPanel() : closePanel();
    });
    // Close on outside-click. Uses the CAPTURE phase so it evaluates before the
    // swatch/mood handlers rebuild the panel's innerHTML — otherwise the clicked
    // element would already be detached and every in-panel click would close it.
    document.addEventListener('click', (e) => {
      const panel = $('#themePanel');
      if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) closePanel();
    }, true);
  }
});

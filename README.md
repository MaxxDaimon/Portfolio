# Portfolio — Editing Guide

A hand-editable static website: plain HTML, CSS and JavaScript. No build step,
no framework, nothing to install. Files can be edited in any text editor or
directly on GitHub.

---

## Files

```
index.html     Home page (hero, projects preview, about preview, contact)
projects.html  Every project as a full expanded block
about.html     About page (intro, skills & tools, experience)
articles.html  Articles / write-ups (data-driven; shows a placeholder when empty)
data.js        ALL content that changes: projects, tags, articles, ticker, theme
app.js         The engine that renders data.js. Normally left alone
styles.css     All styling. Default colours live at the top under :root
assets/        All images and videos
```

Almost all content editing happens in **`data.js`**. A small file count is
normal for a site like this.

---

## How the pages fit together

- `index.html` is the landing page. Its Projects section shows a chosen few
  projects; its About section is a short intro with a link to the full about page.
- `projects.html` lists **every** project as a full block (media, description,
  facts panel, responsibilities, accolades). Home cards deep-link to the matching
  block here.
- `about.html` holds the full intro, the skills lists, and the experience timeline.
- `articles.html` is built from the `ARTICLES` list in `data.js`. While that list
  is empty it shows an "under construction" note.
- Every page loads `data.js` (content) and `app.js` (engine) and shares the same
  header, theme system and footer.

---

## Projects

### Add or edit a project

In `data.js`, copy any `{ ... }` block inside `PROJECTS`, paste it, and edit the
values:

```js
{
  slug:        'game-name',            // unique id; home cards link to projects.html#game-name
  title:       'Game Name',
  featured:    false,                  // true = big banner, false = grid card
  showOnHome:  true,                   // true = appears on the home page
  description: 'One or two sentences, shown on the card and the project block.',
  tags:        { team: 'solo', engine: 'unity', focus: ['systems'] },
  poster:      'assets/game-name.jpg', // still image (file goes in assets/)
  video:       '',                     // '' = image only; add an .mp4 path to play video
  link:        '',                     // itch.io / external URL — adds a VISIT button

  // Expanded-block content (all optional — leave empty to skip that part)
  summary:          'Short intro paragraph.',
  role:             'Technical Game Designer',
  added:            '2026-06',         // 'YYYY' or 'YYYY-MM' — controls ordering (newest first)
  timeframe:        '8 weeks · 2026',
  teamSize:         '12 developers',
  genre:            'Action-Adventure',
  platforms:        ['Itch.io', 'Windows'],
  awards:           ['Some Jam — Placed 1st'],
  responsibilities: ['What was done…', 'And more…'],
},
```

Remove a project by deleting its block. Each `slug` must be unique — it is the
anchor the home cards link to.

### Ordering

The projects page orders itself automatically: **featured first, then newest
first**. "Newest" uses `added` (falling back to the year in `timeframe`).

### Featured vs. regular, and what shows on the home page

Two independent switches per project:

- **`featured`** — `true` shows it large as the wide 16:9 banner; `false` shows
  it as a grid card.
- **`showOnHome`** — `true` includes it in the home page's Projects section;
  `false` hides it there (it still appears on the projects page).

For the "1 featured + 2 smaller" home layout: one project gets
`featured: true, showOnHome: true`, two get `featured: false, showOnHome: true`,
and the rest get `showOnHome: false`. The projects page always lists everything.

---

## Tags

Tags live in `data.js` under `TAG_TYPES`, grouped into **types**. Each type sets
how many tags of that type one project may carry:

- `multiple: false` → pick **one** (e.g. **Engine**: Unreal *or* Unity).
- `multiple: true`  → pick **any number** (e.g. **Focus**).

Add an option by adding a line inside a type's `options`; add a whole type by
copying a type block. In each option the left side is the short key a project
uses, the right side is the on-screen label. A project sets its tags per type:

```js
tags: { team: 'team', engine: 'unreal', focus: ['systems', 'combat'] }
```

Tags are currently kept in the data but not shown on the cards — the system is
ready if they are ever wanted back.

---

## Articles

Blog posts / write-ups live in the `ARTICLES` list in `data.js`. An empty list
shows the "under construction" placeholder on `articles.html`. Add a post block:

```js
{
  title:   'What I learned tuning ZIMA\u2019s camera',
  date:    '2026-07',            // 'YYYY' or 'YYYY-MM' — newest first, automatically
  summary: 'One or two sentences shown on the card.',
  link:    'https://…',          // '' = no link yet
  tag:     'Design',             // optional small label
},
```

---

## About page

The intro paragraphs, skills lists and experience timeline are plain HTML in
`about.html`, each under a labelled comment:

- **Skills** — three columns (Software / Design / Professional). Software uses
  labelled sub-groups; the other two are bullet lists. Add or remove `<li>` items.
- **Experience** — `<div class="exp-row">…</div>` blocks. Copy one to add an
  entry, edit the text, or delete a block to remove it.

The short about intro also appears on the home page (`index.html`) — update both
if the wording changes.

---

## Portrait

The About portrait is a small carousel. Its image set is the `PORTRAITS` list at
the top of the carousel section in `app.js`. Add or remove `assets/…` paths to
change the photos; the first one is the default. It auto-advances slowly and
pauses on hover. Portraits are square (1:1).

---

## Images and video

Every image uses `object-fit: cover`, so it fills its frame and crops the
overflow — matching the **aspect ratio** matters, exact pixels are flexible.
Keep files reasonably small for fast loading.

| Where | Aspect ratio | Recommended size |
|---|---|---|
| Hero background | 16:9 | 2560 × 1440 |
| Featured / grid / project media | 16:9 | up to 2560 × 1440 |
| Portrait photos | 1:1 (square) | 1000 × 1000 |

- A project shows its `poster` until a `video` is supplied, then the `.mp4`
  plays muted and looping over it. Videos follow the same 16:9 ratio.
- GitHub rejects single files over 100 MB, so clips should be short and
  compressed.
- The hero fills the whole screen; keep the important part centred as the edges
  crop on different screen shapes.

---

## Resume

The RESUME button opens `assets/resume.pdf`. Dropping a file with that exact
name into `assets/` makes the button work.

---

## Theme

Default colours are the `:root` variables at the top of `styles.css` (`--accent`,
`--bg`, …). Visitors can also pick their own via the THEME button; the accent and
backdrop options offered there are `ACCENTS` and `MOODS` in `data.js` (the first
accent is the default).

---

## Other details

- **Ticker** — the scrolling words under the hero are the `TICKER_WORDS` list in
  `data.js`.
- **Scroll reveal** — sections fade and rise in on scroll. This is disabled
  automatically for visitors whose device has "reduce motion" enabled.
- **Social share** — each page's `<head>` has Open Graph / Twitter tags for link
  previews. Once the site has a real domain, the `og:image` / `twitter:image`
  paths should be changed to the full `https://…` address so previews resolve.

# Portfolio — Editing Guide

A hand-editable static website: plain HTML, CSS and JavaScript. No build step,
no framework, nothing to install. Files can be edited in any text editor or
directly on GitHub.

---

## Files

```
index.html     The home page (hero, about, experience, contact)
projects.html  The projects page — every project as a full expanded block
data.js        ALL content that changes: tags, projects, ticker words, theme
app.js         The engine that renders data.js. Normally left alone
styles.css     All styling. Default colours live at the top under :root
assets/        All images and videos
```

Almost all editing happens in **`data.js`**. A small file count is normal here.

---

## How the pages fit together

- `index.html` is the home page. Its Projects section shows a few chosen
  projects as cards.
- `projects.html` lists **every** project as a full expanded block (media,
  summary, responsibilities, and a facts panel).
- Clicking a card on the home page scrolls to that project's block on
  `projects.html`. Adding a project never means creating a new page.
- Both pages load `data.js` (the content) and `app.js` (the engine).

---

## Tags — how the type system works

Tags live in `data.js` under `TAG_TYPES` and are grouped into **types**. Each
type sets how many tags of that type a single project may carry:

- `multiple: false` → pick **one**. Example: **Engine** — a project is either
  Unreal *or* Unity, never both.
- `multiple: true`  → pick **any number**. Example: **Focus**.

Built-in types: **Team Size** (Solo / Team / Game Jam), **Engine**
(Unreal / Unity / Godot), **Focus** (Systems Design, Combat, …).

Add an option by adding a line inside a type's `options`. Add a whole new type
by copying a type block. In every option the left side is the short key used by
a project; the right side is the label shown on screen.

A project chooses its tags per type:

```js
tags: { team: 'team', engine: 'unreal', focus: ['systems', 'combat'] }
```

Single-choice types take one key; multiple-choice types take a list. Leave a
type out to show none of it.

---

## Featured vs. regular, and what shows on the home page

Each project has two independent switches:

**`featured`** — the card's size/style:
- `featured: true`  → shown large as the wide 16:9 banner.
- `featured: false` → shown as a card in the grid.

**`showOnHome`** — whether it appears on the home page at all:
- `showOnHome: true`  → included in the home page's Projects section.
- `showOnHome: false` → hidden from the home page.

The **all-projects page** (`projects.html`, reached by the "VIEW ALL PROJECTS"
button and the PROJECTS nav link) always lists **every** project regardless of
these switches.

So for the classic "1 featured + 2 smaller" home layout: give one project
`featured: true, showOnHome: true`, give two others `featured: false,
showOnHome: true`, and set every remaining project to `showOnHome: false`. Change
those switches at any time to swap what the home page shows — full control, no
other edits needed. The count shown is the total number of projects.

---

## Common tasks

### Add a project

In `data.js`, copy any `{ ... }` block inside `PROJECTS`, paste it, and edit the
values:

```js
{
  slug:        'game-name',            // unique id; home cards link to projects.html#game-name
  title:       'Game Name',
  featured:    false,                  // true = big banner, false = grid card
  showOnHome:  true,                   // true = show on the home page
  description: 'One or two sentences shown on the home card.',
  tags:        { team: 'solo', engine: 'unity', focus: ['systems'] },
  poster:      'assets/game-name.png', // image (place the file in assets/)
  video:       '',                     // '' = image only; add an .mp4 path later
  link:        '',                     // '' = no button; a URL adds a VISIT button

  // Expanded-block content (all optional — leave empty to skip that part)
  summary:          'One intro paragraph.',
  role:             'Technical Game Designer',
  timeframe:        '3 months · 2025',
  teamSize:         '6 developers',
  genre:            'Action-Adventure',
  platforms:        ['PC'],
  awards:           ['Best Game — Some Jam'],
  responsibilities: ['What was done…', 'And more…'],
},
```

Remove a project by deleting its block. Reorder by moving blocks up or down.

Each `slug` must be unique — it is the anchor the home cards link to. Set `link`
to an external URL (e.g. an itch.io page) to add a VISIT button on that
project's block.

### Add an image

1. Place the file in the `assets/` folder.
2. Point a project's `poster` at it, e.g.
   `poster: 'assets/game-name.png'`.

Keep images small (around 1600px wide, ideally under ~500 KB) for fast loading.

### Add a video

A project shows its poster image until a video is supplied, then the video plays
automatically (muted, looping) over the poster.

1. Place the `.mp4` in `assets/` (e.g. `assets/zima.mp4`).
2. Set that project's `video` to the path, e.g. `video: 'assets/zima.mp4'`.

Leave `video: ''` to keep showing only the poster. GitHub rejects single files
larger than 100 MB, so keep clips short and compressed.

### Edit fixed text (hero, about, experience)

These are plain HTML in `index.html`, each under a labelled comment banner. The
experience entries are `<div class="exp-row">…</div>` blocks — copy one to add
another entry, edit the text between the tags, or delete a block to remove it.

### Change the ticker words

In `data.js`, edit the `TICKER_WORDS` list. Add, remove, or reorder freely.

### Hero background

The large background behind the hero is controlled by the `HERO` block in
`data.js`, with four settings:

- `mode` — `'static'` holds on one item; `'rotate'` cycles through them.
- `media` — `'poster'` always shows the still image; `'video'` plays the
  project's `.mp4` (falling back to the poster until a video is added).
- `intervalSeconds` — how long each item stays, in rotate mode.
- `projects` — a list of project slugs deciding **which** projects appear in the
  hero, in order. Leave as `[]` to use all of them. In static mode the first
  slug is the one shown.

Example: `mode:'static', media:'poster', projects:['zima']` shows just ZIMA's
still image; `mode:'rotate', media:'video', projects:['zima','azura']` cycles
those two as video.

### Change default colours

In `styles.css`, edit the variables at the top under `:root` (`--accent`, `--bg`
and so on). Visitors can also pick their own via the THEME button; the options
offered there are `ACCENTS` and `MOODS` in `data.js` (the first accent is the
default).

---

## Editing directly on GitHub (no setup needed)

1. Open the file on github.com and click the pencil icon (top right of the file).
2. Make the edits.
3. Click **Commit changes**. The live site updates in about a minute.

To upload images or videos: open the `assets` folder → **Add file → Upload
files** → drag the files in → **Commit**.

---

## Hosting (GitHub Pages)

GitHub Pages serves the site for free, no domain required.

1. In the repository, go to **Settings → Pages**.
2. Under **Source**, choose **Deploy from a branch**.
3. Set the branch to **`main`** and the folder to **`/ (root)`**, then **Save**.
4. Wait about a minute and refresh. A banner shows the live address, in the form
   `https://<username>.github.io/<repository>/`.

All files (`index.html`, `project.html`, `data.js`, `app.js`, `styles.css` and
`assets/`) must sit at the level Pages serves from — with the `/ (root)` option
that means the top level of the repository, not nested in another folder. A
blank page almost always means the files are not at that level.

A custom domain can be added later under **Settings → Pages → Custom domain**.

---

## Tips

- Preview locally by double-clicking `index.html`; it opens in a browser.
- Every commit is a restore point — the repository is the backup.
- Keep `assets/` filenames lowercase and consistent to avoid broken links.

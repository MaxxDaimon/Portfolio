# Maxx Wever — Portfolio

A small, hand-editable static website. No build step, no framework, no
dependencies to install. Just plain HTML, CSS and JavaScript that you can
edit in any text editor or directly in GitHub's web interface.

---

## The files

```
site/
├── index.html      ← page structure (text you rarely change: hero, about, experience, contact)
├── styles.css      ← all the styling (colours, spacing, fonts)
├── main.js         ← the parts you'll edit most: PROJECTS, TAGS, ticker words, theme options
├── README.md       ← this file
└── assets/         ← all images and videos live here
    ├── portrait.png
    ├── hero-poster.png
    ├── zima-poster.png
    ├── project-02-poster.png
    └── project-03-poster.png
```

That's the whole site. More files aren't better — this is complete.

---

## How everything fits together

- **`index.html`** is the skeleton. It has the fixed sections (hero, about,
  experience, contact) written as normal HTML you can edit by hand. It has a
  few empty "slots" that get filled in by `main.js`.
- **`main.js`** holds your **content data** (your projects, your tags, the
  ticker words) and builds the project cards + ticker from it. This is where
  you'll spend 90% of your editing time.
- **`styles.css`** controls how it all looks. The colours and animation speed
  are defined once at the very top (`:root`) as variables.

---

## Common tasks

### ➊ Add a new project

Open **`main.js`**, find the `PROJECTS` list, copy one `{ ... }` block, paste
it, and edit the values:

```js
{
  title:       'My New Game',
  kicker:      '04 · SOLO',
  description: 'A short sentence about what it is and what you did.',
  tags:        ['systems', 'unity'],          // keys from the TAGS list
  poster:      'assets/my-new-game.png',       // put this image in assets/
  video:       '',                             // '' = image only for now
  link:        '#',                            // where clicking it goes
},
```

- The **first** project in the list is always the big featured banner.
- Everything after it becomes a card in the grid.
- To reorder, move blocks up/down. To delete, remove the block.

### ➋ Add or rename a tag

In **`main.js`**, edit the `TAGS` list at the top:

```js
const TAGS = {
  systems: 'Systems Design',
  audio:   'Audio Design',   // ← new tag; now you can use 'audio' in a project
  ...
};
```

Then reference the key (`audio`) in any project's `tags` list.

### ➌ Add an image

1. Put the image file in the **`assets/`** folder (drag it into the `assets`
   folder in GitHub, or copy it there on your computer).
2. Point a project's `poster` at it, e.g. `poster: 'assets/my-image.png'`.

Keep images reasonably small (ideally under ~500 KB, width around 1600px) so
the site loads fast.

### ➍ Add a video

Videos are optional. A project shows its **poster image** until you give it a
video, then the video plays automatically (muted, looping) over the poster.

1. Put the `.mp4` in **`assets/`** (e.g. `assets/zima.mp4`).
2. In that project, set `video: 'assets/zima.mp4'`.

If you don't have a video yet, leave `video: ''` and only the poster shows.
GitHub blocks single files larger than 100 MB, so keep clips short/compressed.

### ➎ Edit the fixed text (about, experience, hero)

These are plain HTML in **`index.html`**. Find the section (they're labelled
with big comment banners) and edit the text between the tags. For example the
experience rows are just `<div class="exp-row">…</div>` blocks — copy one to
add another job/education entry.

### ➏ Change the ticker words

In **`main.js`**, edit the `TICKER_WORDS` list.

### ➐ Change colours

In **`styles.css`**, edit the variables at the top under `:root`
(`--accent`, `--bg`, etc.). These are the site's defaults. Visitors can also
pick their own via the THEME button — those options live in `main.js`
(`ACCENTS` and `MOODS`).

---

## Editing directly on GitHub (no computer setup needed)

1. Go to your repo on github.com and click the file you want to change
   (e.g. `main.js`).
2. Click the ✏️ **pencil** icon (top right of the file).
3. Make your edits.
4. Scroll down and click **Commit changes**.
5. Your live site updates automatically in ~1 minute.

To upload images/videos: open the `assets` folder → **Add file → Upload files**
→ drag them in → **Commit**.

---

## Hosting (GitHub Pages)

1. In your repo, go to **Settings → Pages**.
2. Source: **Deploy from a branch**, branch **`main`**, folder **`/ (root)`**.
   *(If your files are inside a `site/` folder, either move them to the repo
   root, or set the folder to `/site` if GitHub offers it — root is simplest.)*
3. Save. Your site goes live at `https://<username>.github.io/<repo>/`.

---

## Tips

- **Test locally** by just double-clicking `index.html` — it opens in your
  browser. (Videos referenced by path will load once they exist.)
- **Back up** by keeping the repo — every commit is a restore point.
- Keep the `assets/` filenames tidy and lowercase to avoid confusion.

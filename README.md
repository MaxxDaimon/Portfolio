# Portfolio Editing Guide

A static website built with plain HTML, CSS and JavaScript. No build step and
nothing to install. Edit the files in any text editor or directly on GitHub.

Almost everything you will want to change lives in `data.js`.

## Files

```
index.html       Home page (hero, projects preview, about preview, contact)
projects.html    Every project as a full block
about.html       About page (intro, skills, experience)
articles.html    Articles, built from data.js (shows a placeholder when empty)
styleguide.html  Visual reference for the design system (not linked in the nav)
404.html         Shown for broken links
data.js          The content you edit: projects, tags, articles, ticker, theme
app.js           The engine that renders data.js. Leave this alone
styles.css       All styling. Default colors are the :root variables at the top
assets/          Images, video and documents (see subfolders below)
```

Asset subfolders:

```
assets/projects/posters/   project poster images
assets/projects/videos/    project gameplay clips (.mp4)
assets/articles/           images for articles
assets/portraits/          about-page portrait photos
assets/hero/               hero background poster and optional hero.mp4
assets/brand/              favicon and touch icons
assets/documents/          resume.pdf
```

When you add a file, put it in the matching subfolder and reference it by its
full path, for example `assets/projects/posters/game-name.jpg`.

## Add or edit a project

In `data.js`, copy any block inside `PROJECTS`, paste it, and change the values:

```js
{
  slug:        'game-name',      // unique id. Home cards link to projects.html#game-name
  title:       'Game Name',
  featured:    false,            // true = large banner, false = grid card
  showOnHome:  true,             // true = appears on the home page
  description: 'One or two sentences, shown on the card and the block.',
  tags:        { team: 'solo', engine: 'unity', focus: ['systems'] },
  poster:      'assets/projects/posters/game-name.jpg',
  video:       '',               // empty = image only, else assets/projects/videos/game-name.mp4
  link:        '',               // itch.io or external URL. Adds a VISIT button

  // All fields below are optional. Leave a field empty to skip it.
  summary:          'Short intro paragraph.',
  role:             'Technical Game Designer',
  added:            '2026-06',    // 'YYYY' or 'YYYY-MM'. Controls ordering
  timeframe:        '8 weeks, 2026',
  teamSize:         '12 developers',
  genre:            'Action-Adventure',
  platforms:        ['Itch.io', 'Windows'],
  awards:           ['Some Jam, placed 1st'],
  responsibilities: ['What you did', 'And more'],
},
```

Delete a block to remove that project. Every `slug` must be unique.

The projects page sorts itself: featured projects first, then newest first.
"Newest" uses `added`, and falls back to the year in `timeframe`.

Two switches control where a project appears:

- `featured`: `true` shows it as the wide banner, `false` as a grid card.
- `showOnHome`: `true` shows it on the home page, `false` hides it there. It
  always appears on the projects page.

For a home layout of one banner plus two cards, give one project
`featured: true` and `showOnHome: true`, give two projects `featured: false` and
`showOnHome: true`, and set `showOnHome: false` on the rest.

## Tags and filters

Tags live in `data.js` under `TAG_TYPES`, grouped into types. Each type sets how
many tags a project may carry:

- `multiple: false` means pick one (for example Engine: Unreal or Unity).
- `multiple: true` means pick any number (for example Focus).

In each option the left side is the short key a project uses and the right side
is the label shown on screen. A project sets its tags per type:

```js
tags: { team: 'medium', engine: 'unreal', focus: ['threeCs', 'combat'] }
```

The projects page shows filter chips grouped by type. A type only appears as a
filter once at least two of its options are used across your projects.

## Articles

Articles live in the `ARTICLES` list in `data.js`. While the list is empty the
articles page shows an under-construction note. Add a post:

```js
{
  title:   'What I learned tuning a camera system',
  date:    '2026-07',        // 'YYYY' or 'YYYY-MM'. Newest first
  summary: 'One or two sentences shown on the card.',
  link:    'https://...',    // empty = no link yet
  tag:     'Design',         // optional label
},
```

## About page

The intro, skills and experience are plain HTML in `about.html`, each under a
labelled comment.

- Skills: three columns (Software, Design, Professional). Add or remove `<li>`
  items.
- Experience: copy a `<div class="exp-row">` block to add an entry, or delete one
  to remove it.

The short intro also appears on the home page. Update both if you change it.

## Portrait

The about portrait is a small carousel. Its images are the `PORTRAITS` list at
the top of the carousel section in `app.js`. Add or remove `assets/portraits/...`
paths to change them. The first one is the default. Portraits are square.

## Resume

The RESUME button opens `assets/documents/resume.pdf`. Put a file with that exact
name in that folder to make the button work.

## Theme

Default colors are the `:root` variables at the top of `styles.css`. Visitors can
pick their own accent and backdrop through the THEME button. Those options are
the `ACCENTS` and `MOODS` lists in `data.js`, and the first accent is the default.

## Images and video

Images use `object-fit: cover`, so they fill their frame and crop the overflow.
Match the aspect ratio and the exact pixel size is flexible.

```
Hero background                 16:9   2560 x 1440
Project posters and cards       16:9   up to 2560 x 1440
Portrait photos                 1:1    1000 x 1000
```

A project shows its poster until you add a `video`, then the `.mp4` plays muted
and looping over it. Keep clips short and compressed, since GitHub rejects files
over 100 MB.

## When the site gets a domain

In each page's `<head>`, change the `og:image` and `twitter:image` paths to the
full `https://...` address so link previews resolve. The `sitemap.xml` and
`robots.txt` URLs should be updated to the new domain too.

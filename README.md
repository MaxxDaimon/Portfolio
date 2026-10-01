# Portfolio

Static site: plain HTML, CSS and JavaScript. No build step.

## Files

```
index.html     Home: hero and main projects
archive.html   Other projects, one row each
about.html     Intro, portrait, skills
404.html       Broken links
data.js        Project content
app.js         Renders data.js into the pages
styles.css     All styling
sitemap.xml    Page list for search engines
robots.txt     Crawler rules
CNAME          Custom domain for GitHub Pages. Do not delete.
assets/
  brand/       favicon, touch icon
  documents/   resume.pdf
  hero/        hero-poster.jpg (optional hero.mp4)
  portraits/   portrait.jpg (hero card and about)
  projects/    posters/ and videos/
```

## Projects

Each block in `PROJECTS` in `data.js` is one project. Copy a block to add one.

```js
{
  slug:        'game-name',     // unique, used as the anchor #game-name
  title:       'Game Name',
  showOnHome:  true,            // true = home page, false = archive
  description: 'What it is and what you owned.',
  engine:      'Unreal Engine',
  poster:      'assets/projects/posters/game-name.jpg',
  video:       '',              // optional .mp4, plays over the poster
  link:        '',              // optional, adds a button

  role:             'Technical Designer',
  added:            '2026-06',  // sort order, newest first
  timeframe:        '8 weeks · 2026',
  teamSize:         '12 developers',
  genre:            'Action-Adventure',
  platforms:        ['itch.io', 'Windows'],
  awards:           [],
  responsibilities: ['What you did'],
},
```

Empty fields are skipped. Keep `showOnHome: true` to two or three projects.
Don't repeat engine, team size or timeframe in the description; the facts list
already shows them.

## Page copy

The hero intro is in `index.html`. The about intro and skills are in
`about.html`. The header and footer are repeated in each page; edit all four
when they change. The 404 page has no footer.

## Images

Media is cropped to fill its frame.

```
Hero       16:9   2560 x 1440
Posters    16:9   up to 2560 x 1440
Portrait   1:1    1000 x 1000
```

Keep videos short and compressed. GitHub rejects files over 100 MB.

## Design

Tokens are the `:root` variables at the top of `styles.css`; light mode
overrides them under `[data-theme="light"]`. The header toggle saves the
visitor's choice; first visit follows their system setting.

## Domain

The site runs on https://maxxwever.com. If the domain changes, update `CNAME`,
`sitemap.xml`, `robots.txt`, and the `og:`, `twitter:` and canonical URLs
in each page's `<head>`.

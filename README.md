# Portfolio

## Files

```
index.html     Home page: projects, archive and about
zima.html      ZIMA project page
404.html       Page not found
data.js        All project content
app.js         Builds the project sections from data.js
styles.css     All styling
CNAME          Custom domain, don't delete
assets/        Images, icons and resume
```

## Adding a project

Copy a block in `data.js` and edit it. Leave out any field you don't need.

```js
{
  slug:        'game-name',
  title:       'Game Name',
  showOnHome:  true,   // false puts it in the archive
  description: 'I was the [role] on [Game], a [genre] where [premise].',
  engine:      'Unreal Engine',
  poster:      'assets/projects/posters/game-name.jpg',
  video:       '',     // optional .mp4
  link:        '',     // optional, adds a button
  linkLabel:   '',     // button text, default "Read more"
  page:        '',     // optional project page, e.g. '/zima'; adds a Read more button

  role:        'Technical Designer',
  added:       '2026-06',   // newest shows first
  timeframe:   '8 weeks · 2026',
  teamSize:    '12 developers',
  genre:       'Action-Adventure',
  platforms:   ['itch.io', 'Windows'],
  awards:      [],
  responsibilities: ['What I did'],
},
```

Home projects start the description with my role. Archive projects say what the game is, then why or how it was made. Archive rows only show the title, year, description, team size, engine, awards and link.

## Images

Posters are 16:9, the portrait is square. Videos should stay small, GitHub rejects files over 100 MB.

## Editing

- Hero and about text are in `index.html`.
- The header and footer are copied into every page, so change all of them.
- A new project page: copy `zima.html`, set `page` in `data.js`, and add the page to `fixLocalLinks` in `app.js` and to `sitemap.xml`.
- Link to pages without `.html` (`/zima`, `/`). GitHub Pages serves them that way.
- Colors are at the top of `styles.css`.
- When replacing the favicon, bump the `?v=` number in each page's `<head>`.
- If the domain changes, update `CNAME`, `sitemap.xml`, `robots.txt` and the URLs in each page's `<head>`.

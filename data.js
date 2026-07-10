/* ============================================================
   PORTFOLIO — CONTENT
   ------------------------------------------------------------
   This is the only file that needs editing to keep the site
   current. It holds the tags, the projects, the ticker words
   and the theme options. The engine (app.js) renders whatever
   is written here and does not need to be touched.
   ============================================================ */


/* ============================================================
   1) TAG TYPES
   ------------------------------------------------------------
   Tags are grouped into TYPES. Each type decides how many tags
   of that type a project may have:

     multiple: false  → a project may have ONE  (e.g. Engine:
                        a project is either Unreal OR Unity).
     multiple: true   → a project may have MANY (e.g. Focus).

   To add a new option, add a line inside that type's "options".
   To add a whole new type, copy a type block and edit it.

   In each option, the left side is the short key used by a
   project below; the right side is the label shown on screen.
   ============================================================ */
const TAG_TYPES = {

  team: {
    label: 'Team Size',
    multiple: false,
    options: {
      solo:   'Solo',
      small:  'Small team',
      medium: 'Medium team',
      aaa:    'AAA',
    },
  },

  engine: {
    label: 'Engine',
    multiple: false,
    options: {
      unreal: 'Unreal Engine',
      unity:  'Unity',
      godot:  'Godot',
    },
  },

  focus: {
    label: 'Focus',
    multiple: true,
    options: {
      systems:     'Systems Design',
      combat:      'Combat',
      threeCs:     '3Cs',
      systemic:    'Systemic Gameplay',
      tools:       'Tools',
      prototyping: 'Rapid Prototyping',
      placeholder: 'Placeholder',
    },
  },

};


/* ============================================================
   2) PROJECTS
   ------------------------------------------------------------
   Each { ... } block is one project.

   featured: true  → shown BIG as the wide 16:9 banner up top.
   featured: false → shown as a card in the grid below.
   (Set one project to featured for the classic look; more than
    one is allowed and each becomes its own banner.)

   showOnHome: true  → the project appears in the home page's
                       Projects section.
   showOnHome: false → hidden from the home page but still shown
                       on the all-projects page (projects.html).
   This is the control for what the home page displays: for the
   classic "1 featured + 2 smaller" look, mark the featured
   project and two others as showOnHome: true, and the rest false.
   The all-projects page always lists every project.

   Clicking a card on the home page scrolls to that project's
   expanded block on the projects page (projects.html). All the
   fields below fill that block; the optional ones are simply
   skipped when left empty.

   Fields
   ------
   slug         unique short id (letters/dashes). Home cards link
                to projects.html#<slug>.
   title        project name
   featured     true or false (see above)
   showOnHome   true or false (see above)
   description  one or two sentences, shown on the home card
   tags         an object keyed by TAG TYPE. Single-choice types
                take one key; multiple-choice types take a list:
                    tags: { team:'team', engine:'unreal', focus:['systems','combat'] }
   poster       image shown for the project (assets/projects/posters/)
   video        OPTIONAL .mp4 that plays over the poster (assets/projects/videos/); '' = image only
   link         OPTIONAL external URL (e.g. an itch.io page) shown
                as a button on the project block. '' = no button.

   Expanded-block fields (all optional)
   ------------------------------------
   summary          one intro paragraph
   role             your role, e.g. 'Technical Game Designer'
   added            OPTIONAL date this was made, 'YYYY' or 'YYYY-MM'.
                    Controls ordering on the projects page (newest
                    first). If omitted, the year in `timeframe` is used.
   timeframe        e.g. '3 months · 2025'
   teamSize         e.g. 'Solo' or '6 developers'
   genre            e.g. 'Action-Adventure'
   platforms        a list, e.g. ['PC'] or ['PC','Switch']
   awards           a list of accolades, e.g. ['Best Game — X Jam']
   responsibilities a list of bullet points ("what I did")
   ============================================================ */
const PROJECTS = [

  {
    slug:        'zima',
    title:       'ZIMA',
    featured:    true,
    showOnHome:  true,
    description: 'Play as a pacifist windsurfing cowboy and save corrupted creatures using your trusty lasso.',
    tags:        { team: 'medium', engine: 'unreal', focus: ['threeCs', 'combat'] },
    poster:      'assets/projects/posters/zima-poster.jpg',
    video:       '',   // add assets/projects/videos/zima.mp4 here when the clip is ready
    link:        'https://buas.itch.io/zima',

    year:         '2025',
    summary:      'A short intro paragraph about ZIMA — the pitch and what made it interesting to build. Replace with the real story.',
    role:         '3Cs Designer',
    added:        '2026-06',
    timeframe:    '8 weeks · 2026',
    teamSize:     '16 developers',
    genre:        'Action-Adventure',
    platforms:    ['Itch.io', 'Windows'],
    awards:       ['BUAS (In-house) — Won Year 2 Best Art 2026'],
    responsibilities: [
      'Created initial gameplay prototype and iterated on character movement.',
      'Created and tweaked camera system and all of its modifiers.',
      'Created and tweaked control scheme.',
    ],
  },

  {
    slug:        'azura',
    title:       'Azura',
    featured:    false,
    showOnHome:  true,
    description: 'A beautiful, minimal RTS game.',
    tags:        { team: 'medium', engine: 'unreal', focus: ['combat'] },
    poster:      'assets/projects/posters/azura-poster.jpg',
    video:       '',   // add assets/projects/videos/azura-video.mp4 here when the clip is ready
    link:        'https://buas.itch.io/team-gotham',

    year:    '',
    summary: 'A short intro paragraph about Azura. Replace with the real story.',
    role:         'Producer',
    added:        '2025-06',
    timeframe:    '8 weeks · 2025',
    teamSize:     '13 developers',
    genre:        'Real-Time Strategy',
    platforms:    ['Itch.io', 'Windows'],
    awards:       [],
    responsibilities: [
      'Created team contract and planning.',
      'Set-up team scrum processes on Trello and Miro.',
      'Balanced player and enemy combat.',
    ],
  },

  {
    slug:        'adrift',
    title:       'Adrift',
    featured:    false,
    showOnHome:  false,
    description: 'A short, action packed co-op rafting game.',
    tags:        { team: 'medium', engine: 'unreal', focus: [] },
    poster:      'assets/projects/posters/adrift-poster.jpg',
    video:       '',   // add assets/projects/videos/adrift-video.mp4 here when the clip is ready
    link:        'https://twenmod.itch.io/adrift',

    year:    '',
    summary: 'A short intro paragraph about Adrift. Replace with the real story.',
    role:         'Generalist',
    added:        '2024-06',
    timeframe:    '80 hours · CMGT Game Jam 2024',
    teamSize:     '10 developers',
    genre:        'Co-op Action',
    platforms:    ['Itch.io', 'Windows'],
    awards:       [],
    responsibilities: [
      'Created character and raft movement.',
      'Helped shape character design and environment mood with artists.',
    ],
  },

  {
    slug:        'tabletop-tumble',
    title:       'Tabletop Tumble',
    featured:    false,
    showOnHome:  true,
    description: 'A physics based deck building tower stacker.',
    tags:        { team: 'small', engine: 'unity', focus: [] },
    poster:      'assets/projects/posters/tabletoptumble-poster.jpg',
    video:       '',   // add assets/projects/videos/tabletoptumble-video.mp4 here when the clip is ready
    link:        'https://twenmod.itch.io/tabletop-tumble',

    year:    '',
    summary: 'A short intro paragraph about Tabletop Tumble. Replace with the real story.',
    role:         'Game Designer',
    added:        '2024-01',
    timeframe:    '96 hours · GMTK Game Jam 2024',
    teamSize:     '8 developers',
    genre:        'Physics Deckbuilder Roguelike',
    platforms:    ['Itch.io', 'Windows'],
    awards:       ['GMTK Gamejam 2024 — Placed 90th of 7,523 for enjoyment'],
    responsibilities: [
      'Shaped initial design direction and game vision.',
      'Designed card abilities.',
      'Worked with artists to create necessary art assets.',
    ],
  },

];


/* ============================================================
   3) HERO BACKGROUND
   ------------------------------------------------------------
   The large background behind the hero reuses each project's
   poster/video — nothing extra to fill in. Four settings:

     mode     'static' = show one item and hold on it
              'rotate' = cycle through the chosen projects
     media    'poster' = always show the still image
              'video'  = play the .mp4 (shows the poster until a
                         video file is added for that project)
     intervalSeconds  how long each item stays (rotate mode only)
     projects a list of project slugs to use, in order. This is
              the control for WHICH projects appear in the hero.
              Leave as [] to use every project.
              In 'static' mode the first slug in the list is shown.

   Examples
     Static poster of ZIMA:
       mode:'static', media:'poster', projects:['zima']
     Rotating videos of two projects every 8s:
       mode:'rotate', media:'video', intervalSeconds:8,
       projects:['zima','azura']
   ============================================================ */
const HERO = {
  mode:            'rotate',        // 'static' | 'rotate'
  media:           'poster',        // 'poster' | 'video'
  intervalSeconds: 6,
  projects:        ['zima', 'azura'],
};


/* ============================================================
   3b) ARTICLES  (the Articles page)
   ------------------------------------------------------------
   Blog posts / write-ups. Leave the list EMPTY ([]) to show a
   friendly "under construction" placeholder on articles.html.
   Add a post by adding a block:

     {
       title:   'What I learned tuning ZIMA's camera',
       date:    '2026-07',                 // 'YYYY' or 'YYYY-MM'
       summary: 'One or two sentences shown on the card.',
       link:    'https://…',               // '' = no link yet
       tag:     'Design',                  // optional small label
     }

   Newest first is handled automatically (by date).
   ============================================================ */
const ARTICLES = [
  // No articles yet — the page shows an "under construction" note.
];


/* ============================================================
   4) SKILLS TICKER
   ------------------------------------------------------------
   The words that scroll across the strip under the hero.
   Add, remove, or reorder freely.
   ============================================================ */
const TICKER_WORDS = [
  'RESEARCHING', 'CONCEPTING', 'RAPID PROTOTYPING',
  'VISUAL SCRIPTING', '3CS', 'COMBAT SYSTEMS',
];


/* ============================================================
   5) THEME OPTIONS  (the visitor THEME panel)
   ------------------------------------------------------------
   The first accent in the list is the default. MOODS are the
   backdrops offered; each carries a full palette so light and
   dark backdrops both stay readable.
   ============================================================ */
const ACCENTS = ['#E5484D', '#FF6B3D', '#C9A227', '#C6F24E', '#38E1FF', '#9B5DE5'];

const MOODS = {
  'Void':     { bg: '#0B0B0D', surface: '#101013', surface2: '#0f0f12', text: '#F2F2F0', muted: '#9a9a95', line: '#1e1e22', header: 'rgba(11,11,13,.72)' },
  'Charcoal': { bg: '#141414', surface: '#1a1a1a', surface2: '#181818', text: '#F2F2F0', muted: '#9a9a95', line: '#2a2a2a', header: 'rgba(20,20,20,.72)' },
  'Deep Sea': { bg: '#0A0F14', surface: '#0F1620', surface2: '#0C121A', text: '#EAF1F6', muted: '#9aa5b0', line: '#1a2430', header: 'rgba(10,15,20,.72)' },
  'Paper':    { bg: '#EFEBE2', surface: '#F6F3EC', surface2: '#E7E2D6', text: '#1A1A17', muted: '#6b665c', line: '#DCD6C8', header: 'rgba(239,235,226,.85)' },
  'Fog':      { bg: '#EDEFF2', surface: '#F8F9FB', surface2: '#E3E6EA', text: '#14171B', muted: '#5c626b', line: '#D6DADF', header: 'rgba(237,239,242,.88)' },
  'Sky':      { bg: '#E9EFF4', surface: '#F5F9FC', surface2: '#DCE6EE', text: '#12181E', muted: '#586675', line: '#CBD8E2', header: 'rgba(233,239,244,.88)' },
};

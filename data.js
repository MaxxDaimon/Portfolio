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
      solo:    'Solo',
      team:    'Team',
      gamejam: 'Game Jam',
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

   Clicking a card opens its own detail page automatically at
   project.html — no separate file to create. The extra detail
   fields (summary, contributions, body, gallery) fill that page
   and are all OPTIONAL; leave any of them out and that part of
   the page is simply skipped.

   Fields
   ------
   slug         short id used in the page address (letters/dashes,
                must be unique). The card links to project.html?id=<slug>.
   title        project name
   featured     true or false (see above)
   description  one or two sentences, shown on the card
   tags         an object keyed by TAG TYPE. Single-choice types
                take one key; multiple-choice types take a list:
                    tags: { team:'team', engine:'unreal', focus:['systems','combat'] }
   poster       image shown for the project (file goes in assets/)
   video        OPTIONAL .mp4 that plays over the poster; '' = image only
   link         OPTIONAL external URL to open instead of the detail
                page (e.g. an itch.io page). '' = use the detail page.

   Detail-page fields (all optional)
   ---------------------------------
   year          e.g. '2025'
   summary       one intro paragraph at the top of the detail page
   contributions a list of bullet points ("what I did")
   body          a list of paragraphs of longer write-up
   gallery       a list of image paths shown in a grid
   ============================================================ */
const PROJECTS = [

  {
    slug:        'zima',
    title:       'ZIMA',
    featured:    true,
    description: 'Play as a pacifist windsurfing cowboy and save corrupted creatures using your trusty lasso.',
    tags:        { team: 'team', engine: 'unreal', focus: ['threeCs', 'combat'] },
    poster:      'assets/zima-poster.png',
    video:       'assets/zima.mp4',
    link:        '',

    year:         '2025',
    summary:      'A short intro paragraph about ZIMA — the pitch, the team, and the role held on the project. Replace with the real story.',
    contributions: [
      'Owned a core gameplay system from concept to shipping.',
      'Built designer-facing tools for fast iteration.',
      'Tuned the 3Cs (character, camera, controls) for game feel.',
    ],
    body: [
      'A longer paragraph describing the design problem, the approach taken, and what was learned. Replace this placeholder with real detail.',
    ],
    gallery: [],
  },

  {
    slug:        'azura',
    title:       'Azura',
    featured:    false,
    description: 'A beautiful, minimal RTS game.',
    tags:        { team: 'team', engine: 'unreal', focus: [] },
    poster:      'assets/azura-poster.png',
    video:       'assets/azura-video.mp4',
    link:        '',

    year:    '',
    summary: 'A short intro paragraph about Azura. Replace with the real story.',
    contributions: [],
    body:    [],
    gallery: [],
  },

  {
    slug:        'adrift',
    title:       'Adrift',
    featured:    false,
    description: 'A short, action packed co-op rafting game.',
    tags:        { team: 'gamejam', engine: 'unreal', focus: [] },
    poster:      'assets/adrift-poster.png',
    video:       'assets/adrift-video.mp4',
    link:        '',

    year:    '',
    summary: 'A short intro paragraph about Adrift. Replace with the real story.',
    contributions: [],
    body:    [],
    gallery: [],
  },

  {
    slug:        'tabletop-tumble',
    title:       'Tabletop Tumble',
    featured:    false,
    description: 'A physics based deck building tower stacker.',
    tags:        { team: 'gamejam', engine: 'unity', focus: [] },
    poster:      'assets/tabletoptumble-poster.png',
    video:       'assets/tabletoptumble-video.mp4',
    link:        '',

    year:    '',
    summary: 'A short intro paragraph about Tabletop Tumble. Replace with the real story.',
    contributions: [],
    body:    [],
    gallery: [],
  },

];


/* ============================================================
   3) HERO BACKGROUND
   ------------------------------------------------------------
   The large background behind the hero can cycle through the
   project media (each project's poster now, or its video once
   added). This reuses the poster/video already set on each
   project above — nothing extra to fill in.
     rotate           true  = cycle through the projects
                      false = just show the first project's media
     intervalSeconds  how long each one stays before switching
   ============================================================ */
const HERO = {
  rotate: true,
  intervalSeconds: 6,
};


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
const ACCENTS = ['#E5484D', '#C6F24E', '#38E1FF', '#FF6B3D', '#C9A227'];

const MOODS = {
  'Void':     { bg: '#0B0B0D', surface: '#101013', surface2: '#0f0f12', text: '#F2F2F0', muted: '#9a9a95', line: '#1e1e22', header: 'rgba(11,11,13,.72)' },
  'Charcoal': { bg: '#141414', surface: '#1a1a1a', surface2: '#181818', text: '#F2F2F0', muted: '#9a9a95', line: '#2a2a2a', header: 'rgba(20,20,20,.72)' },
  'Deep Sea': { bg: '#0A0F14', surface: '#0F1620', surface2: '#0C121A', text: '#EAF1F6', muted: '#9aa5b0', line: '#1a2430', header: 'rgba(10,15,20,.72)' },
  'Paper':    { bg: '#EFEBE2', surface: '#F6F3EC', surface2: '#E7E2D6', text: '#1A1A17', muted: '#6b665c', line: '#DCD6C8', header: 'rgba(239,235,226,.85)' },
  'Fog':      { bg: '#EDEFF2', surface: '#F8F9FB', surface2: '#E3E6EA', text: '#14171B', muted: '#5c626b', line: '#D6DADF', header: 'rgba(237,239,242,.88)' },
  'Sky':      { bg: '#E9EFF4', surface: '#F5F9FC', surface2: '#DCE6EE', text: '#12181E', muted: '#586675', line: '#CBD8E2', header: 'rgba(233,239,244,.88)' },
};

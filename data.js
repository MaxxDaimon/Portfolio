/* Site content. Add, edit or remove projects here.
   Field reference: README.md. */

var PROJECTS = [

  {
    slug:        'zima',
    title:       'ZIMA',
    showOnHome:  true,
    description: 'I owned the 3Cs on ZIMA, a third-person action-adventure built on traversal and a lasso instead of a kill loop. Character, camera and controls were mine from first prototype to final build.',
    engine:      'Unreal Engine',
    poster:      'assets/projects/posters/zima-poster.jpg',
    video:       '',
    link:        '',

    role:         'Technical Designer',
    added:        '2026-06',
    timeframe:    '8 weeks · 2026',
    teamSize:     '16 developers',
    genre:        'Action-Adventure',
    platforms:    ['itch.io', 'Windows'],
    awards:       ['BUAS, Year 2 Best Art 2026'],
    responsibilities: [
      'Character: built the first gameplay prototype and iterated movement and traversal around the lasso.',
      'Camera: built the camera system and every modifier, tuned for traversal and lasso aiming.',
      'Controls: designed and tuned the control scheme so the full moveset stays readable.',
    ],
  },

  {
    slug:        'azura',
    title:       'Azura',
    showOnHome:  true,
    description: 'I produced Azura, a real-time strategy game with a deliberately small unit and control set. I also balanced its player and enemy combat.',
    engine:      'Unreal Engine',
    poster:      'assets/projects/posters/azura-poster.jpg',
    video:       '',
    link:        '',

    role:         'Producer',
    added:        '2025-06',
    timeframe:    '8 weeks · 2025',
    teamSize:     '13 developers',
    genre:        'Real-Time Strategy',
    platforms:    ['itch.io', 'Windows'],
    awards:       [],
    responsibilities: [
      'Team contract &amp; planning',
      'Scrum processes on Trello &amp; Miro',
      'Combat balancing',
    ],
  },

  {
    slug:        'adrift',
    title:       'Adrift',
    showOnHome:  false,
    description: 'Adrift is a co-op rafting game made in a jam. I built its character and raft movement.',
    engine:      'Unreal Engine',
    poster:      'assets/projects/posters/adrift-poster.jpg',
    video:       '',
    link:        '',

    role:         'Generalist',
    added:        '2024-06',
    timeframe:    '80 hours · CMGT Game Jam 2024',
    teamSize:     '10 developers',
    genre:        'Co-op Action',
    platforms:    ['itch.io', 'Windows'],
    awards:       [],
    responsibilities: [
      'Created character and raft movement.',
      'Helped shape character design and environment mood with artists.',
    ],
  },

  {
    slug:        'tabletop-tumble',
    title:       'Tabletop Tumble',
    showOnHome:  false,
    description: 'Tabletop Tumble is a physics deckbuilder where you stack a tower from a hand of cards. I set its design direction and designed the card abilities.',
    engine:      'Unity',
    poster:      'assets/projects/posters/tabletoptumble-poster.jpg',
    video:       '',
    link:        '',

    role:         'Game Designer',
    added:        '2024-01',
    timeframe:    '96 hours · GMTK Game Jam 2024',
    teamSize:     '8 developers',
    genre:        'Physics Deckbuilder Roguelike',
    platforms:    ['itch.io', 'Windows'],
    awards:       ['GMTK Game Jam 2024, placed 90th of 7,523 for enjoyment'],
    responsibilities: [
      'Shaped initial design direction and game vision.',
      'Designed card abilities.',
      'Worked with artists to create necessary art assets.',
    ],
  },

];

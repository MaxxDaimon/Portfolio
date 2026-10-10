/* Site content. Add, edit or remove projects here.
   Field reference: README.md. */

var PROJECTS = [

  {
    slug:        'zima',
    title:       'ZIMA',
    showOnHome:  true,
    description: 'I was the 3Cs designer on ZIMA, a third-person boss-rush adventure where you play as a windsurfing cowboy saving a giant corrupted creature.',
    engine:      'Unreal Engine',
    poster:      'assets/projects/posters/zima-poster.jpg',

    role:        'Technical Designer',

    added:       '2026-06',
    timeframe:   '8 weeks · 2026',
    teamSize:    '16 developers',
    genre:       'Action-Adventure',
    platforms:   ['itch.io', 'Windows'],
    awards:      ['BUAS, Year 2 Best Art 2026'],
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
    description: 'I was the producer on Azura, a real-time strategy game where you defend sky islands against hordes of enemies.',
    engine:      'Unreal Engine',
    poster:      'assets/projects/posters/azura-poster.jpg',

    role:        'Producer',

    added:       '2025-06',
    timeframe:   '8 weeks · 2025',
    teamSize:    '13 developers',
    genre:       'Real-Time Strategy',
    platforms:   ['itch.io', 'Windows'],
    awards:      [],
    responsibilities: [
      'Team contract & planning',
      'Scrum processes on Trello & Miro',
      'Combat balancing',
    ],
  },

  {
    slug:        'adrift',
    title:       'Adrift',
    showOnHome:  false,
    description: 'A short co-op rafting adventure. Made in 48 hours for the Global Game Jam 2024.',
    engine:      'Unreal Engine',
    poster:      'assets/projects/posters/adrift-poster.jpg',

    added:       '2024-06',
    timeframe:   '48 hours · Global Game Jam 2024',
    teamSize:    'Small game jam team',
  },

  {
    slug:        'tabletop-tumble',
    title:       'Tabletop Tumble',
    showOnHome:  false,
    description: 'A physics based deck building tower stacker. Made in 96 hours for the GMTK Game Jam 2024.',
    engine:      'Unity',
    poster:      'assets/projects/posters/tabletoptumble-poster.jpg',

    added:       '2024-01',
    timeframe:   '96 hours · GMTK Game Jam 2024',
    teamSize:    'Small game jam team',
    awards:      ['GMTK Game Jam 2024, placed 90th of 7,523 for enjoyment'],
  },

  {
    slug:        'soul-reaper',
    title:       'Soul Reaper',
    showOnHome:  false,
    description: 'A horde survival game inspired by Vampire Survivors, built to expand my knowledge on progression and upgrade systems.',
    engine:      'Unreal Engine',
    poster:      'assets/projects/posters/soulreaper-poster.jpg',
    link:        'https://www.youtube.com/watch?v=G9dI4CBWYRU',
    linkLabel:   'Watch video',

    added:       '2025-01',
    timeframe:   '2025',
    teamSize:    'Solo',
  },

];

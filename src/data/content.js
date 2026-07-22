// Content van de live-site. Tijdelijk als data; wordt in de CMS-stap Sanity-collecties
// (Nieuws, Agenda) zodat vrijwilligers ze zonder code kunnen beheren.

// Uitgelichte voorstelling op de homepage. Wisselt per productie —
// wordt in de CMS-stap een Sanity-singleton die vrijwilligers zonder code aanpassen.
// Zet `actief: false` om het blok te verbergen als er even geen productie loopt.
export const hero = {
  eyebrow: 'Javaanse podiumkunsten',
  titel: 'Ontdek de schoonheid van de Javaanse cultuur.',
  titelAccent: 'Javaanse cultuur',
  tekst:
    'Welkom bij Stichting Gema Rasa, waar de betoverende klanken van het gamelanorkest en de sierlijke bewegingen van de Javaanse dans samenkomen voor een fascinerende culturele beleving.',
  afbeelding: '/assets/perf-wayang.jpg',
  knopLabel: 'Doe mee',
  knopUrl: '/de-stichting',
};

export const productie = {
  actief: true,
  kicker: 'Theaterproductie',
  titel: 'Andhe Andhe Lumut: een Javaans sprookje vol wijsheid',
  datumLabel: 'Zo 12 juli 2026 · Goudse Schouwburg',
  intro:
    'Een sprankelende vertelling uit de Javaanse verhaaltraditie — over geduld, oprechtheid en de kracht van wie je werkelijk bent — tot leven gebracht in muziek, dans en verhaal.',
  beschrijving:
    'Met tientallen uitvoerenden op het podium, waaronder gamelanspelers, dansers uit Nederland en Indonesië, en een Javaanse artistiek leider, verbindt deze voorstelling eeuwenoude traditie met hedendaagse zeggingskracht — voor jong en oud.',
  citaat:
    'Andhe Andhe Lumut leert ons dat ware schoonheid niet aan de buitenkant zit, maar in de zuiverheid van het hart. Een boodschap die juist nu weer gehoord mag worden.',
  afbeelding: '/assets/perf-wayang.jpg',
  knopLabel: 'Tickets',
  knopUrl: '/contact',
};

export const nieuws = [
  {
    slug: 'onzichtbare-verhalen',
    categorie: 'Nieuws',
    titel: 'Stichting Gema Rasa start project Onzichtbare Verhalen in Den Haag',
    intro:
      'Stichting Gema Rasa start dit voorjaar het project Onzichtbare Verhalen: een serie van zes mini-documentaires en fotoportretten van Hagenaars met Javaanse roots. De portretten worden in augustus 2026 vertoond tijdens drie publieke avonden in Den Haag, gevolgd door begeleide gesprekken met deelnemers en publiek.',
    afbeelding: '/assets/perf-expo.jpg',
  },
  {
    slug: 'cultural-homecoming',
    categorie: 'Nieuws',
    titel: 'Cultural Homecoming',
    intro:
      'In the summer of 2024, Melissa Sokromo experienced a transformative journey to Indonesia, reconnecting with her ancestral roots through immersive dance and gamelan workshops, cultural exchanges, and the warm hospitality of the local community.',
    afbeelding: '/assets/perf-gamelan.jpg',
  },
  {
    slug: 'reis-van-ference',
    categorie: 'Nieuws',
    titel: 'De Reis van Ference Jenilee Wongsokario-Nojotaroeno, Voorzitter van Stichting Gema Rasa',
    intro:
      'In mijn leven vervul ik vele rollen: partner, moeder, hypnotherapeut en sinds enkele jaren ook de trotse voorzitter van Stichting Gema Rasa (SGR). Elk van deze rollen heeft me gevormd en geleid naar wie ik vandaag de dag ben, en hoe ik mijn verantwoordelijkheid binnen SGR invul.',
    afbeelding: '/assets/perf3.jpg',
  },
];

export const agenda = [
  { titel: 'De Zuiverheid van Dewi Shinta', locatie: 'Isala Theater, Capelle aan den IJssel', datum: '2025-11-30', datumLabel: '30 nov 2025' },
  { titel: 'Cara Jawa — Bahasa, Budaya & Brein: Javaanse Taal en Cultuur in Beweging', locatie: 'Sliedrecht', datum: '2025-10-05', datumLabel: '5 okt 2025' },
  { titel: "Echo's van Java — 135 Jaar Surinaams-Javaanse Geschiedenis", locatie: 'Museum Sophiahof', datum: '2025-08-09', datumLabel: '9 aug 2025' },
  { titel: 'Ramayana Epos', locatie: 'Isala Theater', datum: '2025-02-16', datumLabel: '16 feb 2025' },
  { titel: 'Dewi Sri', locatie: 'Podiumschip De Fighter', datum: '2024-09-08', datumLabel: '8 sep 2024' },
  { titel: 'ABC Evenement', locatie: 'Zalencentrum De Brug, Reeuwijk', datum: '2024-09-07', datumLabel: '7 sep 2024' },
];

export const bestuur = [
  { naam: 'Ference Wongsokario-Nojotaroeno', rol: 'Voorzitter' },
  { naam: 'Jerrenice Karyopawiro-Ardjosentono', rol: 'Secretaris' },
  { naam: 'Renold Sokromo', rol: 'Penningmeester' },
];

export const leden = [
  { naam: 'Faye-Lynn Wongsokario', rol: 'Peking' },
  { naam: 'Nurreach Karijopawiro', rol: 'Bonang Penerus' },
  { naam: 'Melissa Sokromo', rol: 'Saron' },
  { naam: 'Roel Karijopawiro', rol: 'Bonang Barong' },
  { naam: 'Milton Madijokromo', rol: 'Ketuk Kenong' },
  { naam: 'Manik Kharismayekti', rol: 'Peking / Sinden' },
  { naam: 'Lureace Karijopawiro', rol: 'Saron' },
  { naam: 'Lionel Madijokromo', rol: 'Peking' },
  { naam: 'Alice Setrosentono', rol: 'Saron' },
  { naam: 'Ivana Martoredjo', rol: 'Bonang Barong' },
  { naam: 'Jean-Tristan Wongsokario', rol: 'Gong' },
  { naam: 'Dien Somohardjo', rol: 'Ketuk Kenong' },
  { naam: 'Doninho Donopawiro', rol: 'Saron' },
  { naam: 'Romi Madijokromo', rol: 'Bonang Barong' },
  { naam: 'Virgil Wongsokario', rol: 'Marketing & Communicatie' },
  { naam: 'Emily Clark', rol: 'Vrijwilliger' },
  { naam: 'Ine Hardjo', rol: 'Vrijwilliger' },
];

export const vrienden = [
  { naam: 'TPP Kodent', type: 'Sponsor', omschrijving: 'Tandtechnisch laboratorium' },
  { naam: 'Redinggo', type: 'Partner', omschrijving: 'Webdesign & digitale marketing' },
  { naam: 'Stichting BARR', type: 'Partner', omschrijving: 'Javaans-Surinaams gemeenschapswelzijn' },
  { naam: 'Jawamix', type: 'Partner', omschrijving: 'Dansgroep' },
  { naam: 'Being Sadar', type: 'Partner', omschrijving: 'Hypnotherapie' },
];

// Publieke social-profielen. LET OP: de LinkedIn-link op de oude Webflow-site
// was een /admin/feed/posts/-URL — die werkt alleen voor beheerders.
export const socials = [
  { naam: 'YouTube',   url: 'https://www.youtube.com/@StichtingGemaRasa',      kleur: '#ff0000' },
  { naam: 'Instagram', url: 'https://www.instagram.com/stichtinggemarasa',      kleur: '#e1306c' },
  { naam: 'Facebook',  url: 'https://www.facebook.com/stichtinggemarasa',       kleur: '#1877f2' },
  { naam: 'LinkedIn',  url: 'https://www.linkedin.com/company/102107834/',      kleur: '#0a66c2' },
];

export const contact = {
  email: 'info@stichtinggemarasa.com',
  telefoon: '+31 (0)6 15045418',
  adres: 'Aan de Botersloot 2, Ammerstol — Nederland',
  kvk: '92665381',
  btw: 'NL866133197B01',
  locaties: [
    { plaats: 'Ammerstol', adres: 'Aan de Botersloot 2, Ammerstol' },
    { plaats: 'Rotterdam', adres: 'Dempostraat 143, Rotterdam' },
  ],
};

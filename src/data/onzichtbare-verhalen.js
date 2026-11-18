/**
 * De zes portretten van Onzichtbare Verhalen.
 *
 * Eén plek, want ze worden op drie schermen gebruikt: de projectpagina, de
 * eigen pagina per portret, en de onderlinge verwijzingen daartussen.
 *
 * DE PADEN LIGGEN VAST. In Suwara Jawa editie 01 staat op bladzijde 23 een
 * QR-code per portret. Die gaan via canvaqr.com naar
 * stichtinggemarasa.com/haagse-onzichtbare-verhalen/<slug>. Het magazine is
 * gedrukt en rondgegaan, dus een slug hier veranderen maakt een gedrukte
 * QR-code stuk. Niet doen.
 *
 * De teksten zijn Nederlands en blijven Nederlands, ook op de Engelse en
 * Indonesische versie van de site: het zijn de eigen woorden van de mensen in
 * de films, en die machinaal vertalen levert iets op wat net niet klopt. De
 * omlijsting eromheen is wél vertaald.
 */

/** Van '4:58' naar 298 seconden, voor een link die middenin de video begint. */
export function naarSeconden(tijd) {
  const delen = String(tijd).split(':').map(Number);
  return delen.reduce((totaal, deel) => totaal * 60 + deel, 0);
}

export const portretten = [
  {
    slug: 'roesman',
    naam: 'Roesman Tamin',
    thema: 'Verbinding',
    leeftijd: 41,
    video: 'x-lvwkzE3yQ',
    plek: 'Op het bankje in de Haagse wijk waar hij opgroeide',
    samenvatting:
      'Hoe pas je je aan, hoe maak je contact, en hoe zorg je voor een goede verbinding, zonder jezelf daarin te verliezen?',
    tekst: [
      'Roesman Tamin (41) groeide op in de Haagse wijk waar hij nu op het bankje zit. Hij is tweede generatie Surinaams-Javaans en vertelt over eten als taal van liefde, over <em>“Wis mangan?”</em> van zijn oma, over een moeder die niet uitpraat maar met een tas boodschappen op de stoep staat, en over zijn zoontje van vier dat al durft te zeggen: “Papa, ik vind dat spannend.”',
      'Dragen, verdragen, uitdragen.',
    ],
    hoofdstukken: [
      ['0:00', 'Verbinding zonder jezelf te verliezen'],
      ['0:43', 'Deze plek'],
      ['1:12', 'Tweede generatie'],
      ['1:55', 'Javaans zijn is samen eten'],
      ['2:19', "Wat de oma's meegaven"],
      ['3:49', 'Wat niet wordt uitgesproken'],
      ['4:12', 'Een zoon die het wél zegt'],
      ['4:28', 'Respect en hiërarchie'],
      ['4:59', 'Zichtbaarheid'],
      ['5:17', 'De batik'],
      ['6:27', 'Wat hij wil meegeven'],
    ],
  },
  {
    slug: 'errol',
    naam: 'Errol Wikarta',
    thema: 'Zichtbaar',
    leeftijd: null,
    video: 'yp07CfpmEg4',
    plek: 'Den Haag',
    samenvatting:
      'Binnen tien jaar zou hij teruggaan naar Suriname. Eenenvijftig jaar later woont hij nog steeds in Den Haag.',
    tekst: [
      'In 1975 kwam Errol Wikarta op zijn negentiende naar Nederland. Hij noemt zichzelf de tussengeneratie. Met RBO zette hij Javaanse taal-, dans- en gamelanlessen op, verbouwde hij met vrijwilligers een eigen gebouw en kreeg hij te horen dat hij “on-Javaans” was, omdat hij de beuk erin wilde gooien.',
      'Een portret over bescheidenheid, zichtbaarheid en jezelf aan je eigen haren uit het moeras trekken.',
    ],
    hoofdstukken: [
      ['0:00', 'De tussengeneratie'],
      ['0:54', 'Paranam, Paramaribo en de taal'],
      ['2:11', 'Opbouwen met RBO'],
      ['4:50', 'Waarom Javanen zo weinig zichtbaar zijn'],
      ['5:58', "'On-Javaans'"],
      ['6:48', 'Wat hij de volgende generatie meegeeft'],
      ['8:50', 'Errol én Sairan'],
    ],
  },
  {
    slug: 'renell',
    naam: 'Renell Kromopawiro',
    thema: 'Lef',
    leeftijd: 29,
    video: 'TFDO7ASjFWk',
    plek: 'Het huis in Den Haag waar ze opgroeide',
    samenvatting:
      'Elke dinsdag mee naar dansles terwijl haar vader gamelan speelde. Toen had ze er geen zin in; nu begrijpt ze waarom.',
    tekst: [
      'Renell Kromopawiro (29) is geboren en getogen in Den Haag, vierde generatie van moederskant, vijfde van vaderskant.',
      'Een portret over liefde die je laat zien in plaats van zegt, over in papa’s schoenen gaan staan met Sendang Melati, en over een generatie met meer lef.',
    ],
    hoofdstukken: [
      ['0:00', 'Opgegroeid in dit huis'],
      ['0:55', 'Mijn ouders'],
      ['1:31', 'Welke generatie ben ik?'],
      ['2:11', 'Dansles op dinsdagavond'],
      ['3:10', 'In papa’s schoenen'],
      ['4:58', 'Liefde zonder woorden'],
      ['5:58', 'Nederlands opgevoed'],
      ['6:41', 'Javanen en de voorgrond'],
      ['7:23', 'Sendang Melati'],
      ['7:51', 'Wat Javaan zijn voor haar is'],
      ['8:09', 'Haar boodschap: liefde'],
    ],
  },
  {
    slug: 'shinta',
    naam: 'Shinta Noorsyahbani',
    thema: 'Nieuw',
    leeftijd: 25,
    video: '_1ZZwtUon7g',
    plek: 'Den Haag',
    samenvatting:
      'Tot haar negende in Surabaya, in een huis vol familie. Daarna Den Haag, en daar moest ze vooral integreren.',
    tekst: [
      'Shinta Noorsyahbani (25) studeerde culturele antropologie en deed onderzoek naar Surinaams-Javaanse jongeren en hun roots.',
      'Een portret over de cultuurshock, over het gevoel nergens helemaal bij te horen, over de Pasar Malam als medicijn tegen heimwee, en over een nieuwe vorm van Javaanse identiteit.',
    ],
    citaat:
      'Dat betekent niet dat ik minder Javaans ben. Eigenlijk maak ik een nieuwe vorm van mijn Javaanse identiteit.',
    hoofdstukken: [
      ['0:00', 'Van Surabaya naar Den Haag'],
      ['1:12', 'De cultuurshock'],
      ['1:40', 'Integreren'],
      ['2:34', 'Nergens helemaal bij horen'],
      ['3:34', 'Wat de archieven niet bewaarden'],
      ['4:33', 'Heimwee helen'],
      ['5:39', 'Eten als liefde'],
      ['6:38', '‘Vergeet me niet’'],
      ['6:49', 'Een nieuwe vorm van Javaans zijn'],
    ],
  },
  {
    slug: 'sharona',
    naam: 'Sharona Martowirono',
    thema: 'Uitgepakt',
    leeftijd: 36,
    video: '5068sSNMhtI',
    plek: null,
    samenvatting:
      'Op straat werd ze voor Chinees aangezien. Op haar zestiende zette ze per se iets Javaans op het podium.',
    tekst: [
      'Sharona Martowirono (36) groeide op in Meppel, in een gezin waar Nederlands de voertaal was. Ze won Miss Putri Holland, en toch voelt ze zich soms “vernederlandst”.',
      'Een eerlijk portret over schaamte en twee stemmetjes, over de ketting van haar oma, en over het gevoel van een cadeautje dat nog maar half is uitgepakt.',
    ],
    hoofdstukken: [
      ['0:00', 'Opgegroeid in Meppel'],
      ['1:00', '‘Ben ik Chinees?’'],
      ['1:17', 'Zoeken naar je identiteit'],
      ['2:05', 'Twee stemmetjes'],
      ['3:24', 'Theater en Miss Putri Holland'],
      ['5:02', 'Wat ze bij zich draagt'],
      ['6:32', 'Half uitgepakt'],
      ['6:54', 'Een plek om samen te komen'],
      ['7:36', 'Wat ze wil meegeven'],
      ['8:00', 'Waarom ze meedoet'],
    ],
  },
  {
    slug: 'raoul',
    naam: 'Raoul Tirtosentono',
    thema: 'Samen',
    leeftijd: null,
    video: 'BJ8LAq8Fhn4',
    plek: 'De Blauwe Brug in Den Haag',
    samenvatting:
      'Hij had geen voorwerp nodig om herinneringen te bewaren. Hij nam ons mee naar de brug bij zijn ouderlijk huis.',
    tekst: [
      'Het ouderlijk huis van Raoul Tirtosentono droeg ooit de bijnaam Hotel California. Zijn vader hoorde bij de eerste golf Surinaamse Javanen in Den Haag.',
      'Raoul vertelt over de warmte van gemeenschap, over emoties die je als Javaanse man niet snel laat zien, over gesprekken met zijn zoon in de auto, en over het besef dat zijn generatie nu de verhalen moet maken.',
    ],
    hoofdstukken: [
      ['0:00', 'De Blauwe Brug'],
      ['1:31', 'Hotel California'],
      ['2:25', 'Wat zijn vader meegaf'],
      ['2:54', 'De verhalen van zijn oma'],
      ['3:49', 'Emoties'],
      ['5:32', 'Wij zijn het nu'],
      ['5:59', 'Samen rond het eten'],
      ['6:57', 'Praten in de auto'],
      ['8:15', 'Zichtbaarheid'],
      ['9:02', 'De zoektocht naar zijn roots'],
    ],
  },
];

/** De drie avonden van augustus en september 2026, elk met twee portretten. */
export const koppels = [
  { thema: 'Zichtbaarheid', slugs: ['errol', 'renell'] },
  { thema: 'Van buitenaf', slugs: ['sharona', 'shinta'] },
  { thema: 'Wat niet wordt uitgesproken', slugs: ['roesman', 'raoul'] },
];

export const bijSlug = (slug) => portretten.find((p) => p.slug === slug);

/**
 * Het dagprogramma van de educatiereis, dag voor dag.
 *
 * Hier en niet in de taalbestanden, omdat dit een tabel is en geen losse
 * zinnen: vijftien dagen met per dag een rij of zes. Als losse sleutels waren
 * dat er ruim honderd, en dan is één dag verschuiven een middag werk.
 *
 * Per regel staat de tekst in het Nederlands en het Engels. De plaatsnamen
 * blijven zoals ze zijn — die vertaal je niet.
 *
 * De Indonesische pagina toont de Engelse tekst. Vertalen hoefde niet van het
 * bestuur; Engels is voor een Indonesische lezer bruikbaarder dan Nederlands.
 */

export interface Dagregel {
  /** Bijvoorbeeld '09.00–15.00'. Leeg als er geen tijd bij hoort. */
  tijd?: string
  nl: string
  en: string
  /** De plek. Blijft in elke taal hetzelfde. */
  waar?: string
}

export interface Dag {
  dag: number
  weekdag: { nl: string; en: string }
  titel: { nl: string; en: string }
  regels: Dagregel[]
}

const zo = { nl: 'zondag', en: 'Sunday' }
const ma = { nl: 'maandag', en: 'Monday' }
const di = { nl: 'dinsdag', en: 'Tuesday' }
const wo = { nl: 'woensdag', en: 'Wednesday' }
const do_ = { nl: 'donderdag', en: 'Thursday' }
const vr = { nl: 'vrijdag', en: 'Friday' }
const za = { nl: 'zaterdag', en: 'Saturday' }

/** De workshopdag komt vier keer terug; alleen het nummer verschilt. */
const workshopdag = (dag: number, weekdag: { nl: string; en: string }, nummer: number): Dag => ({
  dag,
  weekdag,
  titel: { nl: `Workshop ${nummer}`, en: `Workshop ${nummer}` },
  regels: [
    { tijd: '08.30–09.00', nl: 'Naar AKN', en: 'Trip to AKN' },
    {
      tijd: '09.00–15.00',
      nl: `Dans- en gamelanworkshop ${nummer}. De kinderen kleuren wayang en doen traditionele spelletjes.`,
      en: `Dance & gamelan workshop ${nummer}. Children colour wayang and play traditional games.`,
      waar: 'AKN Yogyakarta',
    },
  ],
})

export const PROGRAMMA: Dag[] = [
  {
    dag: 1,
    weekdag: zo,
    titel: { nl: 'Aankomst en kennismaking', en: 'Arrival and orientation' },
    regels: [
      { tijd: '14.00\u201317.00', nl: 'Inchecken in het hotel', en: 'Hotel check-in', waar: 'Puri Pangeran Hotel' },
      {
        tijd: '18.00\u201320.30',
        nl: 'Slametan: samen bidden om zegen, veiligheid en voorspoed voor de reis',
        en: 'Slametan: praying together for blessing, safety and prosperity for the journey',
        waar: 'Puri Pangeran Hotel',
      },
    ],
  },
  workshopdag(2, ma, 1),
  {
    dag: 3,
    weekdag: di,
    titel: { nl: 'Museumexcursie', en: 'Museum excursion' },
    regels: [
      { tijd: '07.00\u201309.00', nl: 'Naar Museum Sangiran', en: 'Trip to Museum Sangiran' },
      {
        tijd: '09.00\u201311.30',
        nl: 'De Javamens, met een archeoloog langs de fossielen en vondsten',
        en: 'Java Man, walking the fossils and finds with an archaeologist',
        waar: 'Museum Sangiran',
      },
      { tijd: '12.30\u201313.30', nl: 'Lunch', en: 'Lunch', waar: 'Kampung Kecil, Solo' },
      {
        tijd: '13.45\u201316.00',
        nl: 'Batik uit alle streken en tijden, met een eigen batikworkshop',
        en: 'Batik from every region and period, plus a batik workshop of your own',
        waar: 'Museum Danar Hadi',
      },
      { tijd: '16.30\u201318.00', nl: 'Diner', en: 'Dinner', waar: 'Sate Pak Manto' },
      { tijd: '18.30\u201320.30', nl: 'Terug naar het hotel', en: 'Back to the hotel' },
    ],
  },
  workshopdag(4, wo, 2),
  {
    dag: 5,
    weekdag: do_,
    titel: { nl: 'Cultuur en spiritualiteit', en: 'Culture and spirituality' },
    regels: [
      { tijd: '07.00\u201309.00', nl: 'Naar Bhumibanten', en: 'Trip to Bhumibanten' },
      {
        tijd: '09.00\u201317.00',
        nl: 'Yatra Kawitan \u2014 een tocht langs tempels, inscripties, heilige bronnen en rituelen van de oude Javaanse beschaving, op zoek naar de band tussen mens, land en voorouders',
        en: 'Yatra Kawitan \u2014 a journey past temples, inscriptions, sacred springs and rituals of ancient Javanese civilisation, exploring the bond between people, land and ancestors',
        waar: 'Candi Umbul & Candi Gunung Wukir',
      },
      { tijd: '18.00\u201319.00', nl: 'Diner', en: 'Dinner', waar: 'Pringsewu / Raminten' },
      { tijd: '19.30\u201320.30', nl: 'Terug naar het hotel', en: 'Back to the hotel' },
    ],
  },
  {
    dag: 6,
    weekdag: vr,
    titel: { nl: 'Educatieve excursie', en: 'Education excursion' },
    regels: [
      {
        tijd: '10.00\u201312.00',
        nl: 'Gesprek over de slametan bij de opleiding Javaanse letterkunde',
        en: 'A discussion on the slametan at the Department of Javanese Literature',
        waar: 'Universitas Gadjah Mada',
      },
      { tijd: '12.00\u201313.00', nl: 'Lunch', en: 'Lunch', waar: 'Universitas Gadjah Mada' },
      {
        tijd: '13.00\u201318.00',
        nl: 'Workshop Javaanse klederdracht: de stoffen, de motieven en hoe je ze draagt',
        en: 'Javanese clothes workshop: the fabrics, the motifs and how to wear them',
        waar: 'Museum Sonobudoyo',
      },
      { tijd: '18.00\u201319.00', nl: 'Diner', en: 'Dinner', waar: 'Bale Raos' },
    ],
  },
  {
    dag: 7,
    weekdag: za,
    titel: { nl: 'Dorpsbezoek', en: 'Village experience' },
    regels: [
      {
        tijd: '07.00\u201317.00',
        nl: 'Een dag dorpsbewoner: rijst planten in de sawah, sarasehan met de kunstenaarsgemeenschap, een rit op de gerobak en samen eten (kembulan)',
        en: 'Be a local for a day: planting padi in the sawah, sarasehan with the art community, a ride on the gerobak and eating together (kembulan)',
        waar: 'Madurejo, Prambanan',
      },
    ],
  },
  {
    dag: 8,
    weekdag: zo,
    titel: { nl: 'Vrije dag', en: 'Free day' },
    regels: [
      {
        nl: 'Geen programma. Uitrusten bij het zwembad, zelf de stad in, of je eigen plan trekken.',
        en: 'No programme. Rest by the pool, head into town, or make your own plans.',
      },
    ],
  },
  workshopdag(9, ma, 3),
  {
    dag: 10,
    weekdag: di,
    titel: { nl: 'Keuze: educatie of cultuur', en: 'Your choice: education or culture' },
    regels: [
      { tijd: '09.30\u201310.00', nl: 'Vertrek, elke groep naar zijn eigen bestemming', en: 'Departure, each group to its own destination' },
      {
        tijd: '10.00\u201311.00',
        nl: 'Groep 1: het kunstinstituut, en hoe kunst de Indonesische identiteit weerspiegelt',
        en: 'Group 1: the arts institute, and how art reflects Indonesian identity',
        waar: 'ISI Surakarta',
      },
      {
        tijd: '10.00\u201311.00',
        nl: 'Groep 2: rondleiding door het paleis',
        en: 'Group 2: a guided tour of the palace',
        waar: 'Kraton Jogja',
      },
      { tijd: '12.00\u201313.00', nl: 'Lunch', en: 'Lunch', waar: 'Sendang Ayu' },
      {
        tijd: '14.00\u201316.00',
        nl: 'Groep 1: op zoek naar het echte eten van Solo',
        en: 'Group 1: hunting for the real flavours of Solo',
        waar: 'Pasar Klewer, Solo',
      },
      {
        tijd: '14.00\u201316.00',
        nl: 'Groep 2: rondleiding door de tempel',
        en: 'Group 2: a guided tour of the temple',
        waar: 'Prambanan',
      },
      { tijd: '18.00\u201320.00', nl: 'Diner', en: 'Dinner' },
    ],
  },
  workshopdag(11, wo, 4),
  {
    dag: 12,
    weekdag: do_,
    titel: { nl: 'Het optreden', en: 'The performance' },
    regels: [
      { tijd: '09.30\u201310.30', nl: 'Naar het Ramayana-podium', en: 'Trip to the Ramayana stage' },
      { tijd: '10.30\u201312.00', nl: 'Generale repetitie', en: 'Final rehearsal' },
      { tijd: '12.00\u201313.00', nl: 'Lunch', en: 'Lunch' },
      { tijd: '13.00\u201315.00', nl: 'Rust', en: 'Break' },
      { tijd: '15.00\u201318.00', nl: 'Klaarmaken: kostuums aan en alles nog een keer na', en: 'Getting ready: costumes on and one last check' },
      { tijd: '18.00\u201319.00', nl: 'Diner', en: 'Dinner' },
      {
        tijd: '19.30\u201321.00',
        nl: 'Jullie optreden, met Prambanan als achtergrond',
        en: 'Your performance, with Prambanan behind you',
        waar: 'Ramayana-podium',
      },
    ],
  },
  {
    dag: 13,
    weekdag: vr,
    titel: { nl: 'Keuze: school of tempel', en: 'Your choice: school or temple' },
    regels: [
      { tijd: '08.30\u201310.00', nl: 'Vertrek, elke groep naar zijn eigen bestemming', en: 'Departure, each group to its own destination' },
      {
        tijd: '10.00\u201312.00',
        nl: 'Groep 1: kijken hoe de lessen gaan op de kunstvakschool',
        en: 'Group 1: seeing how classes are taught at the arts high school',
        waar: 'SMKI',
      },
      {
        tijd: '10.00\u201312.00',
        nl: 'Groep 2: de tempel en zijn reli\u00ebfs',
        en: 'Group 2: the temple and its reliefs',
        waar: 'Borobudur',
      },
      { tijd: '12.00\u201313.00', nl: 'Lunch', en: 'Lunch', waar: 'Gala Rasa / Balkondes' },
      {
        tijd: '13.00\u201314.30',
        nl: 'De gamelansmederij en de salaktuinen',
        en: 'The gamelan forge and the salak gardens',
        waar: 'Turi',
      },
      { tijd: '14.30\u201315.30', nl: 'Vroeg diner', en: 'Early dinner', waar: 'Sate Kambing' },
    ],
  },
  {
    dag: 14,
    weekdag: za,
    titel: { nl: 'Museumbezoek en sum-suman', en: 'Museum visit and sum-suman' },
    regels: [
      { tijd: '09.00\u201310.00', nl: 'Naar Ullen Sentalu', en: 'Trip to Ullen Sentalu' },
      {
        tijd: '10.00\u201311.00',
        nl: 'Rondleiding door de tijdperken van Java',
        en: 'A guided journey through the eras of Java',
        waar: 'Museum Ullen Sentalu',
      },
      { tijd: '11.30\u201313.00', nl: 'Lunch', en: 'Lunch', waar: 'Mbak Pesta' },
      { tijd: '13.00\u201314.00', nl: 'Terug naar het hotel', en: 'Back to the hotel' },
      { tijd: '14.00\u201318.30', nl: 'Vrije tijd', en: 'Free time', waar: 'Puri Pangeran Hotel' },
      {
        tijd: '18.30\u201320.30',
        nl: 'Sum-suman: samen rijstepap eten als afsluiting, om op krachten te komen en dank te zeggen',
        en: 'Sum-suman: eating rice porridge together to close, to restore strength and give thanks',
        waar: 'Puri Pangeran Hotel',
      },
    ],
  },
  {
    dag: 15,
    weekdag: zo,
    titel: { nl: 'Vertrek', en: 'Departure' },
    regels: [{ nl: 'Uitchecken', en: 'Check-out', waar: 'Puri Pangeran Hotel' }],
  },
]

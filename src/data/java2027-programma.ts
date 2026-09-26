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
      { tijd: '14.00–17.00', nl: 'Inchecken in het hotel', en: 'Hotel check-in', waar: 'Puri Pangeran Hotel' },
      {
        tijd: '18.00–20.30',
        nl: 'Slametan en kennismaking met de groep',
        en: 'Slametan and orientation',
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
      { tijd: '07.00–09.00', nl: 'Naar Museum Sangiran', en: 'Trip to Museum Sangiran' },
      { tijd: '09.00–11.30', nl: 'Museum van de Vroege Mens', en: 'Museum of Early Man', waar: 'Sangiran' },
      { tijd: '12.30–13.30', nl: 'Lunch', en: 'Lunch', waar: 'Kampung Kecil, Solo' },
      { tijd: '13.45–16.00', nl: 'Batikcollectie', en: 'Batik collection', waar: 'Museum Danar Hadi' },
      { tijd: '16.30–18.00', nl: 'Diner', en: 'Dinner', waar: 'Sate Pak Manto' },
      { tijd: '18.30–19.30', nl: 'Terug naar het hotel', en: 'Back to the hotel' },
    ],
  },
  workshopdag(4, wo, 2),
  {
    dag: 5,
    weekdag: do_,
    titel: { nl: 'Naar het strand', en: 'Beach excursion' },
    regels: [
      { tijd: '09.30–12.00', nl: 'Naar het strand', en: 'Trip to the beach' },
      {
        tijd: '12.00–15.00',
        nl: 'Lunch en tijd aan zee',
        en: 'Lunch and time at the sea',
        waar: 'Pantai Ngrenehan of Pantai Mesra',
      },
      { tijd: '15.00–16.30', nl: 'Naar Obelix Sea View', en: 'Trip to Obelix Sea View' },
      { tijd: '16.30–18.00', nl: 'Dansoptreden', en: 'Dance performance', waar: 'Obelix Sea View' },
      { tijd: '18.00–19.30', nl: 'Diner', en: 'Dinner' },
      { tijd: '19.30–21.00', nl: 'Terug naar het hotel', en: 'Back to the hotel' },
    ],
  },
  {
    dag: 6,
    weekdag: vr,
    titel: { nl: 'Cultuur en ambacht', en: 'Culture and craft' },
    regels: [
      { tijd: '08.30–09.30', nl: 'Naar Ullen Sentalu', en: 'Trip to Ullen Sentalu' },
      { tijd: '09.30–11.00', nl: 'Rondleiding', en: 'Guided tour', waar: 'Museum Ullen Sentalu' },
      { tijd: '12.00–13.30', nl: 'Lunch', en: 'Lunch', waar: 'Poco, Turi' },
      {
        tijd: '14.00–16.00',
        nl: 'Bezoek aan een gamelanwerkplaats en de salakboomgaarden',
        en: 'Visit to a gamelan workshop and the salak orchards',
        waar: 'Turi',
      },
      { tijd: '18.00–19.00', nl: 'Diner', en: 'Dinner', waar: 'Jejamuran' },
    ],
  },
  {
    dag: 7,
    weekdag: za,
    titel: { nl: 'Dorpsbezoek', en: 'Village visit' },
    regels: [
      {
        nl: 'Een dag in het dorp: het leven van dichtbij, buiten de stad.',
        en: 'A day in the village: life up close, away from the city.',
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
        en: 'No programme. Rest by the pool, explore the city, or make your own plans.',
      },
    ],
  },
  workshopdag(9, ma, 3),
  {
    dag: 10,
    weekdag: di,
    titel: { nl: 'Borobudur', en: 'Borobudur' },
    regels: [
      { tijd: '08.30–10.00', nl: 'Naar Borobudur', en: 'Trip to Borobudur' },
      { tijd: '10.00–12.00', nl: 'Borobudur', en: 'Borobudur', waar: 'Borobudur' },
      {
        tijd: '12.30–14.30',
        nl: 'Racik rimpang (kruiden stampen) en lunch',
        en: 'Racik rimpang (pounding spices) and lunch',
        waar: 'Mbak Cemplon',
      },
      { tijd: '14.30–15.30', nl: 'Bezoek aan het dorpshuis', en: 'Visit to the village house', waar: 'Balkondes Karangrejo' },
      { tijd: '16.30–18.00', nl: 'Vroeg diner', en: 'Early dinner', waar: 'Mang Engking' },
    ],
  },
  {
    dag: 11,
    weekdag: wo,
    titel: { nl: 'Keraton en Kotagede', en: 'Keraton and Kotagede' },
    regels: [
      { tijd: '09.30–10.00', nl: 'Naar de Keraton', en: 'Trip to the Keraton' },
      { tijd: '10.00–11.00', nl: 'Rondleiding door het paleis', en: 'Palace tour', waar: 'Keraton Yogyakarta' },
      { tijd: '12.00–13.00', nl: 'Lunch', en: 'Lunch', waar: 'Loka Nusa' },
      { tijd: '13.00–14.00', nl: 'Workshop janur vlechten', en: 'Janur weaving workshop' },
      { tijd: '14.00–16.00', nl: 'Kotagede, met traditionele lekkernijen', en: 'Kotagede, with traditional snacks', waar: 'Kotagede' },
      { tijd: '16.00–16.30', nl: 'Bij de zilversmid', en: 'At the silversmith' },
      { tijd: '17.00–18.30', nl: 'Diner', en: 'Dinner', waar: 'Kampung Kecil' },
    ],
  },
  {
    dag: 12,
    weekdag: do_,
    titel: { nl: 'Water en Prambanan', en: 'Water and Prambanan' },
    regels: [
      { tijd: '10.00–11.00', nl: 'Naar Mbak Pesta', en: 'Trip to Mbak Pesta' },
      { tijd: '11.00–12.30', nl: 'Lunch', en: 'Lunch', waar: 'Mbak Pesta' },
      { tijd: '13.00–15.00', nl: 'Afkoelen aan de rivier', en: 'Cooling off at the river', waar: 'Ledok Sambi' },
      { tijd: '16.30–17.30', nl: 'Rondleiding Prambanan', en: 'Prambanan guided tour', waar: 'Prambanan' },
      { tijd: '18.00–19.00', nl: 'Diner', en: 'Dinner', waar: 'Bale Roso' },
    ],
  },
  workshopdag(13, vr, 4),
  {
    dag: 14,
    weekdag: za,
    titel: { nl: 'Het optreden', en: 'The performance' },
    regels: [
      { tijd: '09.30–10.30', nl: 'Naar het Ramayana-podium', en: 'Trip to the Ramayana stage' },
      { tijd: '10.30–12.00', nl: 'Generale repetitie', en: 'Final rehearsal' },
      { tijd: '12.00–13.00', nl: 'Lunch', en: 'Lunch' },
      { tijd: '13.00–15.00', nl: 'Rust', en: 'Break' },
      { tijd: '15.00–18.00', nl: 'Klaarmaken: kostuums en schmink', en: 'Getting ready: costumes and make-up' },
      { tijd: '18.00–19.00', nl: 'Diner', en: 'Dinner' },
      {
        tijd: '19.30–21.00',
        nl: 'Jullie optreden, met Prambanan als achtergrond',
        en: 'Your performance, with Prambanan behind you',
        waar: 'Ramayana-podium',
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

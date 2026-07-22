/**
 * Meertaligheid: Nederlands (standaard), Engels en Indonesisch.
 *
 * Nederlands staat op de gewone paden (/leden), de andere talen krijgen een
 * voorvoegsel (/en/leden, /id/leden). Ontbreekt een vertaling, dan valt de
 * tekst automatisch terug op het Nederlands — de site blijft dus altijd heel.
 */

export const talen = ['nl', 'en', 'id'] as const;
export type Taal = (typeof talen)[number];

export const taalNamen: Record<Taal, string> = {
  nl: 'Nederlands',
  en: 'English',
  id: 'Bahasa Indonesia',
};

/** Genereert de routes voor alle drie de talen; Nederlands zonder voorvoegsel. */
export function taalPaden() {
  return talen.map((taal) => ({
    params: { lang: taal === 'nl' ? undefined : taal },
    props: { taal },
  }));
}

/** Bouwt een pad in de juiste taal: pad('en', '/leden') -> '/en/leden' */
export function pad(taal: Taal, doelPad: string): string {
  const schoon = doelPad.startsWith('/') ? doelPad : `/${doelPad}`;
  if (taal === 'nl') return schoon;
  return schoon === '/' ? `/${taal}` : `/${taal}${schoon}`;
}

type Woordenboek = Record<string, string>;

const nl: Woordenboek = {
  // navigatie
  'nav.stichting': 'De Stichting',
  'nav.leden': 'De Leden',
  'nav.gamelan': 'De Gamelangroep',
  'nav.vrienden': 'De Vrienden van',
  'nav.contact': 'Contact',
  'nav.steun': 'Steun',
  'nav.home': 'Home',
  'nav.nieuws': 'Nieuws',

  // footer
  'footer.over': 'Een culturele organisatie die zich inzet voor de promotie van Javaanse muziek en dans. Met passie en toewijding brengen wij de rijke tradities van Java naar een breed publiek.',
  'footer.nieuwsbrief': 'Schrijf je in voor onze nieuwsbrief',
  'footer.emailPlaceholder': 'jouw@e-mail.nl',
  'footer.inschrijven': 'Inschrijven',
  'footer.akkoord': 'Ja, stuur mij de nieuwsbrief. Afmelden kan altijd.',
  'footer.links': 'Handige links',
  'footer.contactgegevens': 'Onze contactgegevens',
  'footer.rechten': '© Stichting Gema Rasa. Alle rechten voorbehouden 2026.',
  'footer.slogan': 'Bruggen bouwen met Javaanse podiumkunsten',

  // homepage
  'home.titel': 'Stichting Gema Rasa — Bruggen bouwen met Javaanse podiumkunsten',
  'home.omschrijving': 'De betoverende klanken van het gamelanorkest en de sierlijke bewegingen van de Javaanse dans, voor een fascinerende culturele beleving.',
  'home.bekijkNieuws': 'Bekijk nieuws',
  'home.strip1': 'Live gamelan — orkest Jiwa Manunggal',
  'home.strip2': 'Javaanse dans & theater',
  'home.strip3': 'Educatie & workshops',
  'home.strip4': 'Verhalen uit de Javaanse traditie',
  'home.merchKicker': 'SGR Merchandise',
  'home.merchTitel': 'Steun cultuur met een exclusief aandenken',
  'home.merchTekst1': 'Onze exclusieve merchandise is met zorg en creativiteit ontworpen door de jongeren van Stichting Gema Rasa.',
  'home.merchTekst2': 'Met jouw aankoop steun je niet alleen onze culturele projecten, maar draag je ook bij aan het behoud en de promotie van Javaanse muziek en dans.',
  'home.shop': 'Shop',
  'home.overKicker': 'De Stichting',
  'home.overTitel': 'Stichting Gema Rasa',
  'home.overTekst': 'Een culturele organisatie die zich met passie en toewijding inzet voor de promotie van Javaanse muziek en dans, en de rijke tradities van Java naar een breed publiek brengt.',
  'home.gemaTekst': 'Letterlijk vertaald betekent "gema" "echo" in het Javaans en Indonesisch. In de context van de stichting symboliseert dit de weerklank van de Javaanse cultuur en tradities die resoneren door de generaties heen.',
  'home.rasaTekst': '"Rasa" kan vertaald worden als "gevoel", "smaak" of "essentie". Het verwijst naar de diepe emotionele verbinding en het gevoel dat men krijgt bij het beoefenen en ervaren van Javaanse dans en muziek.',
  'home.fotoKicker': 'Impressie',
  'home.fotoTitel': 'Gema Rasa in beeld',
  'home.nieuwsKicker': "Foto's, Video's & Nieuws",
  'home.nieuwsTitel': 'Bekijk onze optredens en evenementen',
  'home.nieuwsTekst': 'Het laatste nieuws van het gamelanorkest en de projecten van Stichting Gema Rasa.',
  'home.alleBerichten': 'Alle berichten',
  'home.ctaTitel': 'Nodig Gema Rasa uit voor uw evenement',
  'home.ctaTekst': 'Beleef de betoverende muziek van de Gamelan Groep Jiwa Manunggal van Stichting Gema Rasa. Benieuwd wat we voor jou kunnen betekenen? Bekijk onze culturele menukaart.',
  'home.ctaKnop': 'Bekijk wat we bieden',
  'home.ctaContact': 'Direct contact',
  'home.agendaKicker': 'Agenda',
  'home.agendaTitel': 'Evenementen die wij ondersteunen',
  'home.agendaTekst': 'Evenementen waar onze gamelangroep Jiwa Manunggal optreedt of die helpen met het verspreiden van de Javaanse cultuur.',

  // algemeen
  'algemeen.leesMeer': 'Lees meer',
  'algemeen.tickets': 'Tickets',
  'algemeen.merk': 'Stichting Gema Rasa',

  // formuliermeldingen (worden door de JavaScript gebruikt)
  'form.bezig': 'Bezig…',
  'form.bedankt': 'Bedankt! We hebben je bericht ontvangen.',
  'form.bedanktNieuwsbrief': 'Bedankt! Je staat op de lijst.',
  'form.fout': 'Er ging iets mis. Probeer het later nog eens.',
  'form.offline': 'Geen verbinding. Controleer je internet en probeer het opnieuw.',
};

const en: Woordenboek = {
  'nav.stichting': 'The Foundation',
  'nav.leden': 'Our Members',
  'nav.gamelan': 'The Gamelan Group',
  'nav.vrienden': 'Friends Of',
  'nav.contact': 'Contact',
  'nav.steun': 'Support',
  'nav.home': 'Home',
  'nav.nieuws': 'News',

  'footer.over': 'A cultural organisation dedicated to promoting Javanese music and dance. With passion and commitment we bring the rich traditions of Java to a wide audience.',
  'footer.nieuwsbrief': 'Subscribe to our newsletter',
  'footer.emailPlaceholder': 'your@email.com',
  'footer.inschrijven': 'Subscribe',
  'footer.akkoord': 'Yes, send me the newsletter. You can unsubscribe at any time.',
  'footer.links': 'Quick links',
  'footer.contactgegevens': 'Our contact details',
  'footer.rechten': '© Stichting Gema Rasa. All rights reserved 2026.',
  'footer.slogan': 'Building bridges through Javanese performing arts',

  'home.titel': 'Stichting Gema Rasa — Building bridges through Javanese performing arts',
  'home.omschrijving': 'The enchanting sounds of the gamelan orchestra and the graceful movements of Javanese dance, for a captivating cultural experience.',
  'home.bekijkNieuws': 'Read our news',
  'home.strip1': 'Live gamelan — Jiwa Manunggal orchestra',
  'home.strip2': 'Javanese dance & theatre',
  'home.strip3': 'Education & workshops',
  'home.strip4': 'Stories from the Javanese tradition',
  'home.merchKicker': 'SGR Merchandise',
  'home.merchTitel': 'Support culture with an exclusive keepsake',
  'home.merchTekst1': 'Our exclusive merchandise is designed with care and creativity by the young people of Stichting Gema Rasa.',
  'home.merchTekst2': 'With your purchase you not only support our cultural projects, but you also help preserve and promote Javanese music and dance.',
  'home.shop': 'Shop',
  'home.overKicker': 'The Foundation',
  'home.overTitel': 'Stichting Gema Rasa',
  'home.overTekst': 'A cultural organisation devoted to promoting Javanese music and dance, bringing the rich traditions of Java to a wide audience.',
  'home.gemaTekst': 'Literally translated, "gema" means "echo" in Javanese and Indonesian. For the foundation it symbolises the resonance of Javanese culture and traditions echoing through the generations.',
  'home.rasaTekst': '"Rasa" can be translated as "feeling", "taste" or "essence". It refers to the deep emotional connection one experiences when practising and experiencing Javanese dance and music.',
  'home.fotoKicker': 'Impressions',
  'home.fotoTitel': 'Gema Rasa in pictures',
  'home.nieuwsKicker': 'Photos, Videos & News',
  'home.nieuwsTitel': 'See our performances and events',
  'home.nieuwsTekst': 'The latest news from the gamelan orchestra and the projects of Stichting Gema Rasa.',
  'home.alleBerichten': 'All articles',
  'home.ctaTitel': 'Invite Gema Rasa to your event',
  'home.ctaTekst': 'Experience the enchanting music of the Jiwa Manunggal Gamelan Group. Curious what we could do for you? Take a look at our cultural menu.',
  'home.ctaKnop': 'See what we offer',
  'home.ctaContact': 'Contact us',
  'home.agendaKicker': 'Agenda',
  'home.agendaTitel': 'Events we support',
  'home.agendaTekst': 'Events where our gamelan group Jiwa Manunggal performs, or that help spread Javanese culture.',

  'algemeen.leesMeer': 'Read more',
  'algemeen.tickets': 'Tickets',
  'algemeen.merk': 'Stichting Gema Rasa',

  'form.bezig': 'Sending…',
  'form.bedankt': 'Thank you! We have received your message.',
  'form.bedanktNieuwsbrief': "Thank you! You're on the list.",
  'form.fout': 'Something went wrong. Please try again later.',
  'form.offline': 'No connection. Please check your internet and try again.',
};

const id: Woordenboek = {
  'nav.stichting': 'Tentang Yayasan',
  'nav.leden': 'Anggota Kami',
  'nav.gamelan': 'Grup Gamelan',
  'nav.vrienden': 'Sahabat Kami',
  'nav.contact': 'Kontak',
  'nav.steun': 'Dukung Kami',
  'nav.home': 'Beranda',
  'nav.nieuws': 'Berita',

  'footer.over': 'Sebuah organisasi budaya yang berdedikasi untuk mempromosikan musik dan tari Jawa. Dengan penuh semangat kami menghadirkan kekayaan tradisi Jawa kepada khalayak luas.',
  'footer.nieuwsbrief': 'Berlangganan buletin kami',
  'footer.emailPlaceholder': 'email@anda.com',
  'footer.inschrijven': 'Berlangganan',
  'footer.akkoord': 'Ya, kirimkan buletin kepada saya. Anda dapat berhenti berlangganan kapan saja.',
  'footer.links': 'Tautan berguna',
  'footer.contactgegevens': 'Informasi kontak kami',
  'footer.rechten': '© Stichting Gema Rasa. Hak cipta dilindungi 2026.',
  'footer.slogan': 'Membangun jembatan melalui seni pertunjukan Jawa',

  'home.titel': 'Stichting Gema Rasa — Membangun jembatan melalui seni pertunjukan Jawa',
  'home.omschrijving': 'Alunan memikat orkestra gamelan dan gerak anggun tari Jawa, untuk pengalaman budaya yang memesona.',
  'home.bekijkNieuws': 'Lihat berita',
  'home.strip1': 'Gamelan langsung — orkestra Jiwa Manunggal',
  'home.strip2': 'Tari & teater Jawa',
  'home.strip3': 'Edukasi & lokakarya',
  'home.strip4': 'Cerita dari tradisi Jawa',
  'home.merchKicker': 'Merchandise SGR',
  'home.merchTitel': 'Dukung budaya dengan kenang-kenangan eksklusif',
  'home.merchTekst1': 'Merchandise eksklusif kami dirancang dengan penuh perhatian dan kreativitas oleh generasi muda Stichting Gema Rasa.',
  'home.merchTekst2': 'Dengan pembelian Anda, Anda tidak hanya mendukung proyek budaya kami, tetapi juga membantu melestarikan dan mempromosikan musik dan tari Jawa.',
  'home.shop': 'Toko',
  'home.overKicker': 'Tentang Yayasan',
  'home.overTitel': 'Stichting Gema Rasa',
  'home.overTekst': 'Organisasi budaya yang dengan penuh dedikasi mempromosikan musik dan tari Jawa, serta menghadirkan kekayaan tradisi Jawa kepada khalayak luas.',
  'home.gemaTekst': 'Secara harfiah, "gema" berarti "gaung" dalam bahasa Jawa dan Indonesia. Bagi yayasan, kata ini melambangkan gaung budaya dan tradisi Jawa yang bergema lintas generasi.',
  'home.rasaTekst': '"Rasa" dapat diterjemahkan sebagai "perasaan", "cita rasa" atau "esensi". Kata ini merujuk pada ikatan emosional mendalam yang muncul saat menekuni dan merasakan tari serta musik Jawa.',
  'home.fotoKicker': 'Dokumentasi',
  'home.fotoTitel': 'Gema Rasa dalam gambar',
  'home.nieuwsKicker': 'Foto, Video & Berita',
  'home.nieuwsTitel': 'Lihat pertunjukan dan acara kami',
  'home.nieuwsTekst': 'Berita terbaru dari orkestra gamelan dan proyek-proyek Stichting Gema Rasa.',
  'home.alleBerichten': 'Semua berita',
  'home.ctaTitel': 'Undang Gema Rasa ke acara Anda',
  'home.ctaTekst': 'Rasakan musik memikat dari Grup Gamelan Jiwa Manunggal. Penasaran apa yang bisa kami lakukan untuk Anda? Lihat menu budaya kami.',
  'home.ctaKnop': 'Lihat penawaran kami',
  'home.ctaContact': 'Hubungi kami',
  'home.agendaKicker': 'Agenda',
  'home.agendaTitel': 'Acara yang kami dukung',
  'home.agendaTekst': 'Acara tempat grup gamelan Jiwa Manunggal tampil, atau yang turut menyebarkan budaya Jawa.',

  'algemeen.leesMeer': 'Baca selengkapnya',
  'algemeen.tickets': 'Tiket',
  'algemeen.merk': 'Stichting Gema Rasa',

  'form.bezig': 'Mengirim…',
  'form.bedankt': 'Terima kasih! Pesan Anda telah kami terima.',
  'form.bedanktNieuwsbrief': 'Terima kasih! Anda telah terdaftar.',
  'form.fout': 'Terjadi kesalahan. Silakan coba lagi nanti.',
  'form.offline': 'Tidak ada koneksi. Periksa internet Anda dan coba lagi.',
};

import { paginaNL, paginaEN, paginaID } from './paginas.ts';

const woordenboeken: Record<Taal, Woordenboek> = {
  nl: { ...nl, ...paginaNL },
  en: { ...en, ...paginaEN },
  id: { ...id, ...paginaID },
};
const nlVolledig = woordenboeken.nl;

/** Haalt een tekst op; valt terug op Nederlands als de vertaling ontbreekt. */
export function t(taal: Taal, sleutel: string): string {
  return woordenboeken[taal]?.[sleutel] ?? nlVolledig[sleutel] ?? sleutel;
}

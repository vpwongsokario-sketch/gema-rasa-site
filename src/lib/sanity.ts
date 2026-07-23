import { sanityClient } from 'sanity:client';
import { createImageUrlBuilder } from '@sanity/image-url';
import * as local from '../data/content.js';
import { programmas as localProgrammas } from '../data/programmas.js';

const builder = createImageUrlBuilder({ projectId: '6q1rydes', dataset: 'production' });

/** Geeft een bruikbare afbeeldings-URL terug: Sanity-image → CDN-url, string → ongewijzigd, anders fallback. */
export function img(source: any, fallback = ''): string {
  if (!source) return fallback;
  if (typeof source === 'string') return source;
  try {
    return builder.image(source).width(1400).fit('max').auto('format').url();
  } catch {
    return fallback;
  }
}

/** Voert een query veilig uit; bij fouten (bv. CMS nog niet gevuld) → null zodat we terugvallen. */
async function safe<T>(q: string, params: Record<string, unknown> = {}): Promise<T | null> {
  try {
    return await sanityClient.fetch<T>(q, params);
  } catch {
    return null;
  }
}


/** Kiest het veld in de gevraagde taal; valt terug op Nederlands als de vertaling leeg is. */
function vertaald(doc: any, veld: string, taal: string = 'nl') {
  if (taal === 'nl') return doc?.[veld];
  return doc?.[`${veld}_${taal}`] || doc?.[veld];
}

const datumOpmaak: Record<string, Intl.DateTimeFormat> = {
  nl: new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }),
  en: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  id: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
};
const datumLabel = (d: string, taal = 'nl') => (d ? (datumOpmaak[taal] ?? datumOpmaak.nl).format(new Date(d)) : '');

/** Als er een afbeelding is: een gedeelde-URL; anders lege string. */
function beeldOfLeeg(bron: any) {
  if (!bron) return '';
  try { return builder.image(bron).width(1200).height(630).fit('crop').url(); } catch { return ''; }
}

/* ---------- Homepage ---------- */
export async function getHomepage(taal: string = 'nl') {
  const doc = await safe<any>('*[_type == "homepage"][0]');
  if (!doc) return { hero: local.hero, productie: local.productie, merch: { actief: true, kicker: '', titel: '', tekst1: '', tekst2: '', afbeelding: '', knopLabel: '', knopUrl: '/shop' }, seo: { titel: '', beschrijving: '', afbeelding: '' } };
  return {
    hero: {
      eyebrow: doc.heroEyebrow ?? local.hero.eyebrow,
      titel: vertaald(doc, 'heroTitel', taal) ?? local.hero.titel,
      titelAccent: vertaald(doc, 'heroTitelAccent', taal) ?? '',
      tekst: vertaald(doc, 'heroTekst', taal) ?? local.hero.tekst,
      afbeelding: img(doc.heroAfbeelding, local.hero.afbeelding),
      knopLabel: doc.heroKnopLabel ?? local.hero.knopLabel,
      knopUrl: doc.heroKnopUrl ?? local.hero.knopUrl,
    },
    productie: {
      actief: doc.productieActief ?? false,
      kicker: doc.productieKicker ?? '',
      titel: vertaald(doc, 'productieTitel', taal) ?? '',
      datumLabel: vertaald(doc, 'productieDatumLabel', taal) ?? '',
      intro: vertaald(doc, 'productieIntro', taal) ?? '',
      beschrijving: vertaald(doc, 'productieBeschrijving', taal) ?? '',
      citaat: vertaald(doc, 'productieCitaat', taal) ?? '',
      afbeelding: img(doc.productieAfbeelding, local.productie.afbeelding),
      knopLabel: vertaald(doc, 'productieKnopLabel', taal) ?? 'Tickets',
      knopUrl: doc.productieKnopUrl ?? '/contact',
    },
    // Merchandise-blok. Lege velden betekenen: gebruik de standaardtekst.
    merch: {
      actief: doc.merchActief ?? true,
      kicker: doc.merchKicker ?? '',
      titel: vertaald(doc, 'merchTitel', taal) ?? '',
      tekst1: vertaald(doc, 'merchTekst1', taal) ?? '',
      tekst2: vertaald(doc, 'merchTekst2', taal) ?? '',
      afbeelding: img(doc.merchAfbeelding, ''),
      knopLabel: vertaald(doc, 'merchKnopLabel', taal) ?? '',
      knopUrl: doc.merchKnopUrl ?? '/shop',
    },
    seo: {
      titel: doc.seo?.titel ?? '',
      beschrijving: doc.seo?.beschrijving ?? '',
      afbeelding: beeldOfLeeg(doc.seo?.afbeelding),
    },
  };
}

/* ---------- SEO-velden van een vaste pagina ---------- */
export async function getPaginaSeo(sleutel: string) {
  const doc = await safe<any>(
    '*[_type == "paginakop" && pagina == $sleutel][0]{ seo }',
    { sleutel },
  );
  return {
    titel: doc?.seo?.titel ?? '',
    beschrijving: doc?.seo?.beschrijving ?? '',
    afbeelding: beeldOfLeeg(doc?.seo?.afbeelding),
  };
}

/* ---------- Paginakop (hero-beeld per pagina) ---------- */
export async function getPaginakop(sleutel: string) {
  const doc = await safe<any>(
    '*[_type == "paginakop" && pagina == $sleutel][0]{ afbeelding, titel, tekst }',
    { sleutel },
  );
  if (!doc) return null;
  return {
    foto: img(doc.afbeelding, ''),
    titel: doc.titel ?? '',
    tekst: doc.tekst ?? '',
  };
}

/* ---------- Nieuws ---------- */
export async function getNieuws(taal: string = 'nl') {
  const docs = await safe<any[]>('*[_type == "nieuws"] | order(datum desc){ "slug": slug.current, categorie, titel, titel_en, titel_id, intro, intro_en, intro_id, afbeelding }');
  if (!docs || docs.length === 0) return local.nieuws;
  return docs.map((d) => ({
    slug: d.slug ?? '',
    categorie: d.categorie ?? 'Nieuws',
    titel: vertaald(d, 'titel', taal) ?? '',
    intro: vertaald(d, 'intro', taal) ?? '',
    afbeelding: img(d.afbeelding, '/assets/perf-gamelan.jpg'),
  }));
}

/* ---------- Nieuws: volledige artikelen (voor de detailpagina's) ---------- */
export async function getNieuwsArtikelen(taal: string = 'nl') {
  const docs = await safe<any[]>(
    '*[_type == "nieuws" && defined(slug.current)] | order(datum desc){ "slug": slug.current, categorie, titel, titel_en, titel_id, intro, intro_en, intro_id, datum, afbeelding, body, body_en, body_id, seo }',
  );
  if (!docs || docs.length === 0) {
    // Terugval: de artikelen die we lokaal kennen (nog zonder volledige tekst)
    return local.nieuws.map((n) => ({ ...n, datum: '', body: null }));
  }
  return docs.map((d) => ({
    slug: d.slug,
    categorie: d.categorie ?? 'Nieuws',
    titel: vertaald(d, 'titel', taal) ?? '',
    intro: vertaald(d, 'intro', taal) ?? '',
    datum: d.datum ?? '',
    datumLabel: d.datum ? datumLabel(d.datum, taal) : '',
    afbeelding: img(d.afbeelding, '/assets/perf-gamelan.jpg'),
    body: vertaald(d, 'body', taal) ?? null,
    seoTitel: d.seo?.titel ?? '',
    seoBeschrijving: d.seo?.beschrijving ?? '',
    seoAfbeelding: beeldOfLeeg(d.seo?.afbeelding),
  }));
}

/* ---------- Agenda ---------- */
export async function getAgenda(taal: string = 'nl') {
  const docs = await safe<any[]>('*[_type == "evenement"] | order(datum desc){ titel, titel_en, titel_id, locatie, locatie_en, locatie_id, datum }');
  if (!docs || docs.length === 0) return local.agenda;
  return docs.map((d) => ({
    titel: vertaald(d, 'titel', taal) ?? '',
    locatie: vertaald(d, 'locatie', taal) ?? '',
    datum: d.datum,
    datumLabel: datumLabel(d.datum, taal),
  }));
}

/* ---------- Leden ---------- */
export async function getLeden(taal: string = 'nl') {
  const docs = await safe<any[]>('*[_type == "lid"] | order(volgorde asc){ naam, rol, rol_en, rol_id, groep, rollen, ensembles, foto }');
  if (!docs || docs.length === 0) {
    const musici = ['Vrijwilliger', 'Marketing & Communicatie'];
    const leeg = (m: any) => ({ ...m, foto: '', rollen: [], ensembles: [] });
    const gamelanLokaal = local.leden.filter((m) => !musici.includes(m.rol)).map(leeg);
    return {
      bestuur: local.bestuur.map(leeg),
      leden: local.leden.map(leeg),
      gamelan: gamelanLokaal,
      ensembles: { young: [], silver: [], mix: [], overig: gamelanLokaal },
    };
  }
  // Nieuw veld 'rollen' (meerdere) met terugval op het oude 'groep' (één rol)
  const rollenVan = (d: any): string[] =>
    Array.isArray(d.rollen) && d.rollen.length ? d.rollen : d.groep ? [d.groep] : [];
  const map = (d: any) => ({
    naam: d.naam,
    rol: vertaald(d, 'rol', taal) ?? '',
    foto: img(d.foto, ''),
    rollen: rollenVan(d),
    ensembles: Array.isArray(d.ensembles) ? d.ensembles : [],
  });
  const alle = docs.map(map);
  // Speelt in de gamelangroep als de rol dat zegt, óf als er een ensemble is
  // aangevinkt. Dat laatste is immers óók een uitspraak dat iemand meespeelt —
  // anders zou wie als 'vrijwilliger' staat maar wel in Young Generation speelt
  // onbedoeld van de pagina verdwijnen.
  const gamelan = alle.filter((m) => m.rollen.includes('gamelan') || m.ensembles.length > 0);
  return {
    bestuur: alle.filter((m) => m.rollen.includes('bestuur')),
    // iedereen buiten het bestuur — iemand kan hier zowel speler als vrijwilliger zijn
    leden: alle.filter((m) => !m.rollen.includes('bestuur')),
    gamelan,
    // De drie ensembles binnen Jiwa Manunggal. Wie nog niet is ingedeeld,
    // verschijnt onder 'overig', zodat niemand van de pagina verdwijnt.
    ensembles: {
      young: gamelan.filter((m) => m.ensembles.includes('young')),
      silver: gamelan.filter((m) => m.ensembles.includes('silver')),
      mix: gamelan.filter((m) => m.ensembles.includes('mix')),
      overig: gamelan.filter((m) => m.ensembles.length === 0),
    },
  };
}

/* ---------- Magazine Suwara Jawa ---------- */
export async function getMagazines(taal: string = 'nl') {
  const docs = await safe<any[]>(
    '*[_type == "magazine"] | order(nummer desc){ titel, nummer, datum, cover, omschrijving, leesUrl, "pdfUrl": pdf.asset->url }',
  );
  if (!docs) return [];
  return docs.map((d) => ({
    titel: d.titel ?? '',
    nummer: d.nummer ?? null,
    datum: d.datum ?? '',
    datumLabel: d.datum ? datumLabel(d.datum, taal) : '',
    cover: img(d.cover, ''),
    omschrijving: d.omschrijving ?? '',
    // Voorkeur voor de online-leeslink; anders de geüploade PDF
    link: d.leesUrl || d.pdfUrl || '',
    isPdf: !d.leesUrl && !!d.pdfUrl,
  }));
}

/* ---------- Fotoalbums ---------- */
/** Bouwt een afbeeldings-URL op maat; scheelt bezoekers veel dataverbruik. */
function beeld(bron: any, breedte: number) {
  if (!bron) return '';
  try {
    return builder.image(bron).width(breedte).fit('max').auto('format').quality(78).url();
  } catch { return ''; }
}

export async function getAlbums(taal: string = 'nl') {
  const docs = await safe<any[]>(
    '*[_type == "album" && defined(slug.current)] | order(datum desc){ titel, "slug": slug.current, datum, omschrijving, cover, fotos, externeUrl, externeAantal, seo }',
  );
  if (!docs) return [];
  return docs.map((d) => {
    const fotos = Array.isArray(d.fotos) ? d.fotos : [];
    return {
      titel: d.titel ?? '',
      slug: d.slug,
      datum: d.datum ?? '',
      datumLabel: d.datum ? datumLabel(d.datum, taal) : '',
      omschrijving: d.omschrijving ?? '',
      // Zonder omslagfoto pakken we de eerste foto uit het album
      cover: beeld(d.cover ?? fotos[0], 900),
      aantal: fotos.length,
      externeUrl: d.externeUrl ?? '',
      externeAantal: d.externeAantal ?? null,
      seo: { titel: d.seo?.titel ?? '', beschrijving: d.seo?.beschrijving ?? '', afbeelding: beeldOfLeeg(d.seo?.afbeelding) },
      fotos: fotos.map((f: any) => ({
        tegel: beeld(f, 700),
        groot: beeld(f, 1800),
        bijschrift: f?.bijschrift ?? '',
      })).filter((f: any) => f.tegel),
    };
  });
}

/* ---------- Doneren ---------- */
export async function getDoneren() {
  const doc = await safe<any>('*[_type == "doneren"][0]');
  if (!doc) return null;
  return {
    actief: doc.actief ?? true,
    titel: doc.titel ?? '',
    tekst: doc.tekst ?? '',
    bestemming: doc.bestemming ?? '',
    bedragen: (Array.isArray(doc.bedragen) ? doc.bedragen : [])
      .filter((b: any) => b?.bedrag && b?.url)
      .map((b: any) => ({ bedrag: b.bedrag, url: b.url, toelichting: b.toelichting ?? '' })),
    vrijBedragUrl: doc.vrijBedragUrl ?? '',
    maandelijksUrl: doc.maandelijksUrl ?? '',
    maandelijksTekst: doc.maandelijksTekst ?? '',
    iban: doc.iban ?? '',
    tenaamstelling: doc.tenaamstelling ?? 'Stichting Gema Rasa',
    bankTekst: doc.bankTekst ?? '',
  };
}

/* ---------- Vrienden ---------- */
export async function getVrienden() {
  const docs = await safe<any[]>('*[_type == "vriend"]{ naam, type, omschrijving, logo, website }');
  if (!docs || docs.length === 0) return local.vrienden.map((v) => ({ ...v, logo: '', website: '' }));
  return docs.map((d) => ({
    naam: d.naam,
    type: d.type ?? 'Partner',
    omschrijving: d.omschrijving ?? '',
    logo: img(d.logo, ''),
    website: d.website ?? '',
  }));
}

/* ---------- Fotostrook ---------- */
export async function getGalerij() {
  const docs = await safe<any[]>('*[_type == "galerijfoto"] | order(volgorde asc){ afbeelding, bijschrift }');
  if (!docs || docs.length === 0) {
    // Terugval op de bestaande sfeerfoto's zolang er nog niets is geüpload
    return [
      { url: '/assets/perf-wayang.jpg', bijschrift: 'Wayang Kulit' },
      { url: '/assets/perf-gamelan.jpg', bijschrift: 'Gamelan' },
      { url: '/assets/perf2.jpg', bijschrift: 'Kuda Lumping' },
      { url: '/assets/perf-expo.jpg', bijschrift: 'Expositie' },
      { url: '/assets/perf3.jpg', bijschrift: 'Javaanse dans' },
      { url: '/assets/perf4.jpg', bijschrift: 'Workshop' },
    ];
  }
  return docs.map((d) => ({ url: img(d.afbeelding, ''), bijschrift: d.bijschrift ?? '' }));
}

/* ---------- Menukaart ---------- */
export async function getProgrammas() {
  const docs = await safe<any[]>('*[_type == "programma"] | order(volgorde asc){ naam, categorie, desc, perfect, dur, price, badge, label }');
  if (!docs || docs.length === 0) return localProgrammas;
  return docs.map((d) => ({
    cat: d.categorie, name: d.naam, desc: d.desc ?? '', perfect: d.perfect ?? '',
    dur: d.dur ?? '', price: d.price ?? '', badge: !!d.badge, label: d.label ?? '',
  }));
}

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
    '*[_type == "nieuws" && defined(slug.current)] | order(datum desc){ "slug": slug.current, categorie, titel, titel_en, titel_id, intro, intro_en, intro_id, datum, afbeelding, body, body_en, body_id, seo, nietIndexeren }',
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
    /**
     * Het SEO-veld geldt alleen op het Nederlands.
     *
     * Er is per artikel één titel en één omschrijving in de Studio, in het
     * Nederlands, en die won van de vertaalde kop die er wél is (titel_en,
     * titel_id). Daardoor stond er in Google een Nederlandse regel boven een
     * Engels artikel. Zelfde reden als in layouts/Base.astro; het beeld mag
     * wel overal gelden, want een foto heeft geen taal.
     */
    seoTitel: taal === 'nl' ? (d.seo?.titel ?? '') : '',
    seoBeschrijving: taal === 'nl' ? (d.seo?.beschrijving ?? '') : '',
    seoAfbeelding: beeldOfLeeg(d.seo?.afbeelding),
    nietIndexeren: d.nietIndexeren === true,
  }));
}

/* ---------- Agenda ---------- */
// Leidende bron voor de brede community-agenda is het Echo's van Java platform
// (§8.1/§8.2). Zo hoeven community-events niet dubbel te worden ingevoerd.
// LET OP: wijzig dit naar https://echosvanjava.com zodra dat domein aan het
// platform gekoppeld is.
const PLATFORM_API = 'https://echosvanjava.com';

const maandKort: Record<string, Intl.DateTimeFormat> = {
  nl: new Intl.DateTimeFormat('nl-NL', { month: 'short' }),
  en: new Intl.DateTimeFormat('en-GB', { month: 'short' }),
  id: new Intl.DateTimeFormat('id-ID', { month: 'short' }),
};
/** Splitst een datum in dag-nummer + korte maand (voor de datumbadge op de kaart). */
function dagMaand(datum: string, taal = 'nl') {
  if (!datum) return { dag: '', maand: '' };
  const d = new Date(datum);
  if (isNaN(d.getTime())) return { dag: '', maand: '' };
  return { dag: String(d.getDate()), maand: (maandKort[taal] ?? maandKort.nl).format(d).replace('.', '').toUpperCase() };
}

/** Haalt aankomende, goedgekeurde events op uit de platform-API (leeg bij fout). */
async function getPlatformEvents(taal: string) {
  try {
    const res = await fetch(`${PLATFORM_API}/api/events?upcoming=true`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [] as any[];
    const evs = await res.json();
    if (!Array.isArray(evs)) return [] as any[];
    return evs
      .map((e: any) => ({
        titel: e.title ?? '',
        locatie: [e.loc, e.country].filter(Boolean).join(', '),
        datum: e.date,
        datumLabel: e.date ? datumLabel(e.date, taal) : '',
        ...dagMaand(e.date, taal),
        foto: e.photo_url || '',
        cat: e.cat || '',
        gratis: !!e.free,
        prijs: e.price || '',
        ticketUrl: e.ticketUrl || '',
      }))
      .filter((e: any) => e.titel && e.datum);
  } catch {
    return [] as any[];
  }
}

export async function getAgenda(taal: string = 'nl') {
  const docs = await safe<any[]>('*[_type == "evenement"] | order(datum desc){ titel, titel_en, titel_id, locatie, locatie_en, locatie_id, datum }');
  const eigen = (docs && docs.length)
    ? docs.map((d) => ({
        titel: vertaald(d, 'titel', taal) ?? '',
        locatie: vertaald(d, 'locatie', taal) ?? '',
        datum: d.datum,
        datumLabel: datumLabel(d.datum, taal),
        ...dagMaand(d.datum, taal),
        foto: '', cat: '', gratis: false, prijs: '', ticketUrl: '',
      }))
    : (local.agenda as any[]).map((e: any) => ({ ...e, ...dagMaand(e.datum, taal), foto: '', cat: '', gratis: false, prijs: '', ticketUrl: '' }));
  // Community-events uit de platform-API erbij; ontdubbelen op titel+datum
  // (eigen/ondersteunde events uit Sanity hebben voorrang).
  const community = await getPlatformEvents(taal);
  const sleutel = (e: any) => `${String(e.titel || '').toLowerCase().trim()}|${e.datum}`;
  const gezien = new Set(eigen.map(sleutel));
  // Alleen aankomende events, chronologisch (soonest eerst) — zoals het platform.
  const vandaag = new Date().toISOString().slice(0, 10);
  const samen = [...eigen, ...community.filter((e: any) => !gezien.has(sleutel(e)))]
    .filter((e: any) => !e.datum || e.datum >= vandaag);
  samen.sort((a: any, b: any) => String(a.datum || '').localeCompare(String(b.datum || '')));
  return samen;
}

/* ---------- Leden ---------- */
export async function getLeden(taal: string = 'nl') {
  /**
   * Alleen de leden die op de teampagina horen.
   *
   * Sinds de administratie van de deelnemersbijdrage in het beheer zit, staan er
   * ook mensen als lid in de database die alleen meebetalen. Die horen hier niet
   * automatisch op te komen. Het vinkje staat standaard aan, dus de bestaande
   * leden blijven staan; alleen wie het uitzet verdwijnt van de site.
   */
  const docs = await safe<any[]>('*[_type == "lid" && opDeWebsite != false] | order(volgorde asc){ naam, rol, rol_en, rol_id, groep, rollen, ensembles, foto }');
  if (!docs || docs.length === 0) {
    const musici = ['Vrijwilliger', 'Marketing & Communicatie'];
    const leeg = (m: any) => ({ ...m, foto: '', rollen: [], ensembles: [] });
    const gamelanLokaal = local.leden.filter((m) => !musici.includes(m.rol)).map(leeg);
    return {
      bestuur: local.bestuur.map(leeg),
      leden: local.leden.map(leeg),
      gamelan: gamelanLokaal,
      // De terugval kent geen rollen, dus deze twee blijven leeg. De pagina
      // laat een leeg blok weg, dus dan staat er niets halfs.
      dans: [],
      vrijwilligers: [],
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
  /**
   * Speelt in de gamelangroep als de rol dat zegt, óf als er een ensemble is
   * aangevinkt — dat laatste is immers ook een uitspraak dat iemand meespeelt,
   * en zonder die terugval zou wie nog geen rol heeft van de pagina verdwijnen.
   *
   * Behalve als iemand danser is. Tot 28 oktober 2026 stonden de vier dansers
   * als 'vrijwilliger' met een gamelan-ensemble aangevinkt, en belandden ze
   * daardoor tussen de musici. De rol gaat voor: wie danst hoort bij de
   * dansgroep, ook als er nog een ensemble van vroeger aan hangt.
   */
  const danst = (m) => m.rollen.includes('dans');
  const gamelan = alle.filter(
    (m) => m.rollen.includes('gamelan') || (m.ensembles.length > 0 && !danst(m)),
  );
  return {
    bestuur: alle.filter((m) => m.rollen.includes('bestuur')),
    // iedereen buiten het bestuur — iemand kan hier zowel speler als vrijwilliger zijn
    leden: alle.filter((m) => !m.rollen.includes('bestuur')),
    gamelan,
    dans: alle.filter(danst),
    // Alleen wie helpt en niet meespeelt of danst; wie allebei doet staat al
    // bij zijn groep, met 'Vrijwilliger' achter zijn rol.
    vrijwilligers: alle.filter(
      (m) => m.rollen.includes('vrijwilliger') && !m.rollen.includes('gamelan') && !danst(m),
    ),
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
  /**
   * De edities komen van het magazineplatform.
   *
   * Deze pagina zocht naar documenten van de soort 'magazine', en die zijn er
   * nooit gekomen: de edities worden op suwarajawa.nl beheerd als 'edition',
   * in hetzelfde Sanity. Daardoor stond hier een lege pagina terwijl er twee
   * edities klaarstonden. Nu leest hij de echte bron, dus een nieuwe editie
   * verschijnt hier vanzelf zodra hij op het platform wordt gezet.
   */
  const docs = await safe<any[]>(
    `*[_type == "edition" && defined(slug.current)] | order(editionNumber desc){
      editionNumber, title, "slug": slug.current, publicationDate, shortPitch,
      pageCount, status, pricing, cover
    }`,
  );
  if (!docs) return [];

  const euro = (n: number) => `\u20ac\u00a0${n.toFixed(2).replace('.', ',')}`;

  return docs.map((d) => {
    const nr = typeof d.editionNumber === 'number' ? String(d.editionNumber).padStart(2, '0') : '';
    const p = d.pricing || {};
    // Wat het kost, in één regel. Gratis is ook een prijs en hoort er te staan.
    const prijs = p.isFree
      ? 'Gratis te lezen'
      : [
          typeof p.digital === 'number' ? `digitaal ${euro(p.digital)}` : '',
          typeof p.print === 'number' ? `op papier ${euro(p.print)}` : '',
        ].filter(Boolean).join(' \u00b7 ');

    return {
      titel: nr ? `Editie ${nr} \u2014 ${d.title ?? ''}` : (d.title ?? ''),
      nummer: d.editionNumber ?? null,
      datum: d.publicationDate ?? '',
      datumLabel: d.publicationDate ? datumLabel(d.publicationDate, taal) : '',
      cover: img(d.cover, ''),
      omschrijving: d.shortPitch ?? '',
      aantalPaginas: d.pageCount ?? null,
      prijsRegel: prijs,
      // Elke editie heeft een eigen pagina op het magazineplatform.
      link: `https://www.suwarajawa.nl/edities/${d.slug}`,
      isPdf: false,
      opVoorraad: d.status !== 'archived',
    };
  });
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
        // Vierkante, compacte miniatuur (past precies in het raster, scheelt data)
        tegel: (() => { try { return builder.image(f).width(500).height(500).fit('crop').auto('format').quality(66).url(); } catch { return ''; } })(),
        groot: (() => { try { return builder.image(f).width(1600).fit('max').auto('format').quality(74).url(); } catch { return ''; } })(),
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

/* ---------- Initiatieven (zusterprojecten) ---------- */
const INITIATIEVEN_FALLBACK = [
  { naam: 'Echo’s van Java', omschrijving: 'Communityplatform voor Javaans talent', url: 'https://echosvanjava.com', emoji: '🌐' },
  { naam: 'Haagse Onzichtbare Verhalen', omschrijving: 'Verhalen van Hagenaars met Javaanse roots', url: '/haagse-onzichtbare-verhalen', emoji: '🎬' },
  { naam: 'Echo’s van Java Festival', omschrijving: 'Jaarlijks cultureel festival', url: 'https://echosvanjava.nl', emoji: '🎪' },
  { naam: 'Cara Jawa', omschrijving: 'Javaanse taal- en cultuurlessen', url: 'https://carajawa.nl', emoji: '📚' },
  { naam: 'Cara Jawa Dictionary', omschrijving: 'Online Javaans woordenboek', url: 'https://dictionary.carajawa.nl', emoji: '📖' },
  { naam: 'Suwara Jawa', omschrijving: 'Magazine: verhalen & verdieping', url: 'https://suwarajawa.nl', emoji: '📰' },
];
export async function getInitiatieven() {
  const docs = await safe<any[]>('*[_type == "initiatief"] | order(volgorde asc){ naam, omschrijving, url, emoji }');
  if (!docs || docs.length === 0) return INITIATIEVEN_FALLBACK;
  return docs.map((d) => ({
    naam: d.naam ?? '',
    omschrijving: d.omschrijving ?? '',
    url: d.url ?? '#',
    emoji: d.emoji ?? '',
  }));
}

/* ---------- Teams wereldwijd ---------- */
export async function getVestigingen() {
  const docs = await safe<any[]>(
    '*[_type == "vestiging"] | order(volgorde asc){ land, stad, vlag, intro, foto, vertegenwoordigers }',
  );
  if (!docs || docs.length === 0) return [];
  return docs.map((d) => ({
    land: d.land ?? '',
    stad: d.stad ?? '',
    vlag: d.vlag ?? '',
    intro: d.intro ?? '',
    foto: img(d.foto, ''),
    reps: (Array.isArray(d.vertegenwoordigers) ? d.vertegenwoordigers : []).map((r: any) => ({
      naam: r?.naam ?? '',
      rol: r?.rol ?? '',
      email: r?.email ?? '',
      foto: img(r?.foto, ''),
    })),
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

/* ---------- Menukaart-video's ---------- */
/** Haalt de 11-teken YouTube-video-ID uit allerlei linkvormen (watch?v=, youtu.be/, embed/, shorts/) of een kale ID. */
function youtubeId(url: string): string {
  const s = String(url ?? '').trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/v\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : '';
}

export async function getMenukaartVideos() {
  const docs = await safe<any[]>('*[_type == "menukaartvideo"] | order(volgorde asc){ titel, kicker, youtube }');
  if (!docs || docs.length === 0) return [];
  return docs
    .map((d) => {
      const id = youtubeId(d.youtube);
      if (!id) return null;
      return {
        yt: id,
        // Echte thumbnail rechtstreeks van YouTube — altijd beschikbaar, altijd kloppend
        poster: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        kicker: d.kicker ?? '',
        title: d.titel ?? '',
      };
    })
    .filter(Boolean);
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

/**
 * De educatiereis, met de prijzen.
 *
 * De prijzen staan in Sanity en niet in de pagina, omdat ze op twee plekken
 * nodig zijn: hier om ze te tonen, en bij het platform dat de betaling
 * aanmaakt. Stonden ze op beide plekken los, dan verandert er ooit eentje en
 * staat er op de pagina een ander bedrag dan er wordt afgeschreven.
 *
 * Valt Sanity weg, dan geeft dit null terug en gebruikt de pagina de waarden
 * die er als terugval in staan. Beter een pagina met de bekende prijzen dan
 * een pagina die niet laadt.
 */
export async function getReis() {
  return await safe<any>(
    `*[_id == "reis.java2027"][0]{
      titel, open, vertrek, terug, reserverenTot,
      prijsVolwassene, prijsKind, kindVanaf, volwassenVanaf,
      termijnen[]{ deel, vervaldatum, omschrijving }
    }`,
  );
}

/* ---------- Nieuwsbriefarchief ---------- */

/**
 * De verstuurde nieuwsbrieven, om na te lezen op de site.
 *
 * Ze staan in hetzelfde Sanity als de rest, want het zijn de mailings die het
 * platform verstuurt. Alleen wat écht verstuurd is komt hier: een concept of
 * een halve verzending is geen nieuwsbrief.
 *
 * Waarom dit de moeite waard is: een nieuwsbrief leeft nu één ochtend in een
 * postvak en is daarna weg. Op de site blijft hij vindbaar -- voor wie hem
 * kwijt is, voor wie zich later aanmeldt, en voor zoekmachines.
 */
function slugVanNieuwsbrief(onderwerp: string, datum: string): string {
  const kaal = (onderwerp || 'nieuwsbrief')
    .toLowerCase()
    .replace(/[’']/g, '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
  return `${(datum || '').slice(0, 10)}-${kaal}`.replace(/^-+/, '')
}

/**
 * Een verstuurde mail bruikbaar maken op een webpagina.
 *
 * Wat er in het CMS staat is een compleet e-maildocument: eigen <head>, eigen
 * opmaak, eigen voet. Dat kun je niet zomaar in een pagina plakken -- een
 * document in een document geeft rommel, en de regels voor `body` zouden de
 * hele site overschrijven.
 *
 * Dus: de opmaak eruit halen en `body` daarin omschrijven naar het vak waar
 * de mail in staat, en alleen de inhoud van <body> overhouden. De gaatjes die
 * bij het versturen per persoon worden ingevuld staan er nog in; op een
 * archiefpagina is er geen persoon, dus die vervangen we door iets neutraals.
 */
function mailNaarPagina(html: string, nieuwsbriefPad: string): { stijl: string; inhoud: string } {
  const stijlen = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n')
  // `body` als losse kiezer wijst op een webpagina naar de hele site. Binnen
  // dit vak moet hij alleen over de mail gaan.
  const stijl = stijlen.replace(/(^|[,{}\s])body(?=[\s,{:])/g, '$1.nieuwsbriefmail')

  const body = (html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html)
    // Het onzichtbare regeltje dat alleen in een postvak iets doet.
    .replace(/<div[^>]*display:\s*none[\s\S]*?<\/div>/i, '')

  const inhoud = body
    .replace(/\{\{\s*(afmeldlink|unsubscribe_link)\s*\}\}/gi, nieuwsbriefPad)
    .replace(/\{\{\s*(voornaam|naam)\s*\}\}/gi, '')
    /**
     * Een h1 uit de mail wordt hier een h2.
     *
     * Op de pagina is het onderwerp van de nieuwsbrief de kop; wat daarbinnen
     * staat is een onderdeel daarvan. Lieten we de mail zijn eigen h1 houden,
     * dan stonden er twee bovenste koppen op één pagina -- en de ene mail die
     * geen h1 had, had er helemaal geen. Nu is het voor alle brieven gelijk.
     */
    .replace(/<(\/?)h1(\s|>)/gi, '<$1h2$2')

  return { stijl, inhoud }
}

export async function getNieuwsbrieven(nieuwsbriefPad = '/nieuwsbrief') {
  const docs = await safe<any[]>(
    `*[_type == "mailing" && status == "verzonden" && defined(html)]
     | order(verzondenOp desc){ _id, onderwerp, voorbeeldtekst, verzondenOp, afzender, html }`,
  )
  if (!docs || docs.length === 0) return []
  return docs.map((d) => {
    const datum = (d.verzondenOp || '').slice(0, 10)
    const { stijl, inhoud } = mailNaarPagina(d.html || '', nieuwsbriefPad)
    return {
      slug: slugVanNieuwsbrief(d.onderwerp, datum),
      onderwerp: d.onderwerp || 'Nieuwsbrief',
      samenvatting: d.voorbeeldtekst || '',
      datum,
      afzender: d.afzender === 'suwara-jawa' ? 'Suwara Jawa' : 'Stichting Gema Rasa',
      stijl,
      inhoud,
    }
  })
}

/* ---------- Wat we aanbieden ---------- */

/**
 * De vier dingen die je van de stichting kunt krijgen, voor de homepage.
 *
 * De prijzen komen uit dezelfde bronnen als de pagina's waar je ze koopt:
 * de kalender en het magazine uit hun eigen documenten, de reis uit die van
 * de reis. Zo staat er op de voorpagina nooit een ander bedrag dan bij het
 * afrekenen -- en dat is precies het soort verschil waar mensen op afhaken.
 *
 * Cara Jawa heeft geen document in dit Sanity: dat is een losse app. Die
 * staat daarom in de terugval hieronder, zonder bedrag, want een prijs die
 * nergens vandaan komt gaat ooit afwijken.
 *
 * Valt er iets weg, dan valt dat ene blok weg en blijven de andere staan.
 */
export async function getAanbod(taal: string = 'nl') {
  const euro = (n: number) => `\u20ac\u00a0${n.toFixed(2).replace('.', ',')}`;

  const [kalender, edities, reis] = await Promise.all([
    safe<any>(
      `*[_type == "kalender" && teKoop == true] | order(jaar desc)[0]{
        titel, jaar, ondertitel, prijs, bureauPrijs, digitalePrijs, bestellenTot,
        "beeld": coalesce(mockups[formaat == "beide"][0].asset->url, beelden[0].asset->url)
      }`,
    ),
    getMagazines(taal),
    getReis(),
  ]);

  const uit: Array<Record<string, unknown>> = [];

  if (kalender) {
    const vanaf = Math.min(
      ...[kalender.prijs, kalender.bureauPrijs, kalender.digitalePrijs].filter(
        (n: unknown): n is number => typeof n === 'number' && n > 0,
      ),
    );
    uit.push({
      sleutel: 'kalender',
      naam: `${kalender.titel} ${kalender.jaar}`,
      regel: kalender.ondertitel || 'Javaanse kalender met je weton bij elke dag',
      prijs: Number.isFinite(vanaf) ? `vanaf ${euro(vanaf)}` : '',
      beeld: kalender.beeld || '',
      url: 'https://winkel.stichtinggemarasa.com/kalender',
      extern: true,
    });
  }

  const editie = (edities || [])[0];
  if (editie) {
    uit.push({
      sleutel: 'magazine',
      naam: editie.titel,
      regel: 'Ons eigen cultureel magazine — verhalen uit de gemeenschap',
      prijs: editie.prijsRegel || '',
      /*
        Een staande omslag in een liggend vak: van bovenaf snijden, anders
        valt de titel van het magazine buiten beeld.

        Eerst de bestaande parameters eraf. getMagazines levert de omslag al
        met ?w=1400&fit=max; daar nog een vraagteken achter plakken geeft een
        adres met twee vraagtekens, en dan laadt het beeld helemaal niet.
      */
      beeld: editie.cover ? `${String(editie.cover).split('?')[0]}?w=900&h=675&fit=crop&crop=top` : '',
      url: '/suwara-jawa',
      extern: false,
    });
  }

  uit.push({
    sleutel: 'carajawa',
    naam: 'Cara Jawa',
    regel: 'Javaans leren, woord voor woord — met de uitspraak erbij',
    prijs: '',
    // Cara Jawa is een losse app zonder document hier. Het nieuwsbeeld dat we
    // elders gebruiken is 2048 bij 652 en wordt in dit vak een onherkenbare
    // streep; deze foto van de kaartenset laat zien waar het over gaat.
    beeld: 'https://dictionary.carajawa.nl/mockups/19-fanned5-realcards.jpg',
    url: 'https://dictionary.carajawa.nl/',
    extern: true,
  });

  if (reis) {
    /*
      Allebei de bedragen, niet alleen het laagste.
      "vanaf 750" is het kindertarief en leest als de prijs van de reis;
      wie dan op de pagina 1.000 ziet staan, voelt zich aan het lijntje
      gehouden. Twee bedragen is eerlijker en nog steeds één regel.
    */
    const volwassen = typeof reis.prijsVolwassene === 'number' ? reis.prijsVolwassene : null;
    const kind = typeof reis.prijsKind === 'number' ? reis.prijsKind : null;
    uit.push({
      sleutel: 'reis',
      naam: reis.titel || 'Educatiereis naar Java',
      regel: 'Vijftien dagen Yogyakarta — dans, gamelan, tempels en je eigen optreden',
      prijs: volwassen
        ? `${euro(volwassen)} p.p.${kind ? ` \u00b7 kinderen ${euro(kind)}` : ''}`
        : '',
      beeld: '/assets/java2027/ramayana.jpg',
      url: '/educatiereis-java-2027',
      extern: false,
    });
  }

  return uit;
}

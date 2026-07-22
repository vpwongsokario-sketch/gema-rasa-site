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

const nl = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
const datumLabel = (d: string) => (d ? nl.format(new Date(d)) : '');

/* ---------- Homepage ---------- */
export async function getHomepage() {
  const doc = await safe<any>('*[_type == "homepage"][0]');
  if (!doc) return { hero: local.hero, productie: local.productie };
  return {
    hero: {
      eyebrow: doc.heroEyebrow ?? local.hero.eyebrow,
      titel: doc.heroTitel ?? local.hero.titel,
      titelAccent: doc.heroTitelAccent ?? '',
      tekst: doc.heroTekst ?? local.hero.tekst,
      afbeelding: img(doc.heroAfbeelding, local.hero.afbeelding),
      knopLabel: doc.heroKnopLabel ?? local.hero.knopLabel,
      knopUrl: doc.heroKnopUrl ?? local.hero.knopUrl,
    },
    productie: {
      actief: doc.productieActief ?? false,
      kicker: doc.productieKicker ?? '',
      titel: doc.productieTitel ?? '',
      datumLabel: doc.productieDatumLabel ?? '',
      intro: doc.productieIntro ?? '',
      beschrijving: doc.productieBeschrijving ?? '',
      citaat: doc.productieCitaat ?? '',
      afbeelding: img(doc.productieAfbeelding, local.productie.afbeelding),
      knopLabel: doc.productieKnopLabel ?? 'Tickets',
      knopUrl: doc.productieKnopUrl ?? '/contact',
    },
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
export async function getNieuws() {
  const docs = await safe<any[]>('*[_type == "nieuws"] | order(datum desc){ "slug": slug.current, categorie, titel, intro, afbeelding }');
  if (!docs || docs.length === 0) return local.nieuws;
  return docs.map((d) => ({
    slug: d.slug ?? '',
    categorie: d.categorie ?? 'Nieuws',
    titel: d.titel ?? '',
    intro: d.intro ?? '',
    afbeelding: img(d.afbeelding, '/assets/perf-gamelan.jpg'),
  }));
}

/* ---------- Agenda ---------- */
export async function getAgenda() {
  const docs = await safe<any[]>('*[_type == "evenement"] | order(datum desc){ titel, locatie, datum }');
  if (!docs || docs.length === 0) return local.agenda;
  return docs.map((d) => ({ titel: d.titel ?? '', locatie: d.locatie ?? '', datum: d.datum, datumLabel: datumLabel(d.datum) }));
}

/* ---------- Leden ---------- */
export async function getLeden() {
  const docs = await safe<any[]>('*[_type == "lid"] | order(volgorde asc){ naam, rol, groep, foto }');
  if (!docs || docs.length === 0) {
    const musici = ['Vrijwilliger', 'Marketing & Communicatie'];
    const leeg = (m: any) => ({ ...m, foto: '' });
    return {
      bestuur: local.bestuur.map(leeg),
      leden: local.leden.map(leeg),
      gamelan: local.leden.filter((m) => !musici.includes(m.rol)).map(leeg),
    };
  }
  const map = (d: any) => ({ naam: d.naam, rol: d.rol, foto: img(d.foto, '') });
  return {
    bestuur: docs.filter((d) => d.groep === 'bestuur').map(map),
    leden: docs.filter((d) => d.groep !== 'bestuur').map(map),
    gamelan: docs.filter((d) => d.groep === 'gamelan').map(map),
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

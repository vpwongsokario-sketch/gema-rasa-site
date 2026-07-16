// Genereert seed.ndjson uit de bestaande site-content, zodat de CMS gevuld start.
// Gebruik:  node scripts/generate-seed.mjs   →  seed.ndjson
import { writeFileSync } from 'node:fs';
import { hero, productie, nieuws, agenda, bestuur, leden, vrienden } from '../src/data/content.js';
import { programmas } from '../src/data/programmas.js';

const docs = [];
const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 90);

// Homepage-singleton (tekstvelden; afbeeldingen voeg je later toe in Studio)
docs.push({
  _id: 'homepage', _type: 'homepage',
  heroEyebrow: hero.eyebrow, heroTitel: hero.titel, heroTitelAccent: hero.titelAccent,
  heroTekst: hero.tekst, heroKnopLabel: hero.knopLabel, heroKnopUrl: hero.knopUrl,
  productieActief: productie.actief, productieKicker: productie.kicker, productieTitel: productie.titel,
  productieDatumLabel: productie.datumLabel, productieIntro: productie.intro,
  productieBeschrijving: productie.beschrijving, productieCitaat: productie.citaat,
  productieKnopLabel: productie.knopLabel, productieKnopUrl: productie.knopUrl,
});

nieuws.forEach((n) => docs.push({
  _id: `nieuws-${n.slug}`, _type: 'nieuws', titel: n.titel,
  slug: { _type: 'slug', current: n.slug }, categorie: n.categorie, intro: n.intro,
}));

agenda.forEach((e, i) => docs.push({
  _id: `evenement-${i}`, _type: 'evenement', titel: e.titel, locatie: e.locatie, datum: e.datum,
}));

bestuur.forEach((m, i) => docs.push({
  _id: `lid-bestuur-${i}`, _type: 'lid', naam: m.naam, rol: m.rol, groep: 'bestuur', volgorde: i,
}));

const nietMusici = ['Vrijwilliger', 'Marketing & Communicatie'];
leden.forEach((m, i) => docs.push({
  _id: `lid-${slugify(m.naam)}`, _type: 'lid', naam: m.naam, rol: m.rol,
  groep: nietMusici.includes(m.rol) ? 'vrijwilliger' : 'gamelan', volgorde: 10 + i,
}));

vrienden.forEach((v, i) => docs.push({
  _id: `vriend-${slugify(v.naam)}`, _type: 'vriend', naam: v.naam, type: v.type, omschrijving: v.omschrijving,
}));

programmas.forEach((p, i) => docs.push({
  _id: `programma-${slugify(p.name)}`, _type: 'programma', naam: p.name, categorie: p.cat,
  desc: p.desc, perfect: p.perfect, dur: p.dur, price: p.price, badge: !!p.badge, label: p.label || '', volgorde: i,
}));

const ndjson = docs.map((d) => JSON.stringify(d)).join('\n') + '\n';
writeFileSync(new URL('../seed.ndjson', import.meta.url), ndjson);
console.log(`seed.ndjson geschreven: ${docs.length} documenten`);

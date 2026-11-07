/**
 * Weton: de Javaanse geboortedag.
 *
 * Een weton is de combinatie van een dag uit de zevendaagse week (Senin,
 * Selasa …) en een dag uit de vijfdaagse pasaran-week (Legi, Pahing, Pon,
 * Wage, Kliwon). Samen vormen ze een cyclus van 35 dagen; na 35 dagen komt je
 * weton terug (de wetonan).
 *
 * LET OP -- dit is een letterlijke kopie van lib/weton.js uit het
 * winkelplatform (suwarajawa-platform/frontend). Daar gebruiken de
 * productpagina, de bestelling en het drukbestand hem; hier de rekenaar op
 * /weton. Bewust kopieren en niet opnieuw opschrijven: twee eigen tellingen
 * die allebei "ongeveer" kloppen is erger dan een kopie die je bijwerkt.
 *
 * Wijzig je er een, werk dan ook de ander bij. Of de kopie nog gelijk is,
 * kun je nakijken met de ankerpunten onderaan deze kop: komen die drie
 * dagen eruit, dan telt dit bestand goed.
 *
 * De Javaanse dag begint bij zonsondergang, niet om middernacht. Wie op
 * donderdag na zonsondergang geboren is, heeft de weton van vrijdag
 * ("malam Jumat"). Daarom rekenen we met de echte zonsondergang op de
 * geboorteplaats: in Nederland valt die tussen ongeveer 16.30 en 22.00, dus
 * een vaste grens van 18.00 zou in de zomer en winter fout gaan.
 *
 * Controle van het anker: 17-08-1945 (Proklamasi) = Jumat Legi,
 * 06-06-1901 (Soekarno) = Kamis Pon, 08-06-1921 (Soeharto) = Rabu Kliwon.
 */

/**
 * De vijf pasaran met hun neptu, windrichting en kleur volgens
 * keblat papat lima pancer (vier richtingen, vijfde in het midden).
 */
export const PASARAN = [
  { naam: 'Legi',   neptu: 5, arah: 'wetan',  richting: 'oost',   warna: 'putih',       kleur: 'wit',         hex: '#ffffff' },
  { naam: 'Pahing', neptu: 9, arah: 'kidul',  richting: 'zuid',   warna: 'abang',       kleur: 'rood',        hex: '#c8372d' },
  { naam: 'Pon',    neptu: 7, arah: 'kulon',  richting: 'west',   warna: 'kuning',      kleur: 'geel',        hex: '#efc83e' },
  { naam: 'Wage',   neptu: 4, arah: 'lor',    richting: 'noord',  warna: 'ireng',       kleur: 'zwart',       hex: '#111111' },
  { naam: 'Kliwon', neptu: 8, arah: 'tengah', richting: 'midden', warna: 'manca warna', kleur: 'veelkleurig', hex: null },
];

/** De zevendaagse week, index 0 = zondag (zoals Date.getUTCDay()). */
export const DAGEN = [
  { naam: 'Minggu', jawa: 'Radite',  neptu: 5 },
  { naam: 'Senin',  jawa: 'Soma',    neptu: 4 },
  { naam: 'Selasa', jawa: 'Anggara', neptu: 3 },
  { naam: 'Rabu',   jawa: 'Buda',    neptu: 7 },
  { naam: 'Kamis',  jawa: 'Respati', neptu: 8 },
  { naam: 'Jumat',  jawa: 'Sukra',   neptu: 6 },
  { naam: 'Sabtu',  jawa: 'Tumpak',  neptu: 9 },
];

/**
 * Geboorteplaatsen waarvoor we de zonsondergang uitrekenen. De tijdzone is
 * een IANA-naam, zodat ook oude tijdzones kloppen (Suriname liep tot 1984
 * een half uur anders).
 */
export const PLAATSEN = {
  nl: { label: 'Nederland',          stad: 'Den Haag',   lat: 52.08, lon: 4.31,   tz: 'Europe/Amsterdam' },
  be: { label: 'België',             stad: 'Brussel',    lat: 50.85, lon: 4.35,   tz: 'Europe/Brussels' },
  sr: { label: 'Suriname',           stad: 'Paramaribo', lat: 5.85,  lon: -55.2,  tz: 'America/Paramaribo' },
  jv: { label: 'Java / Indonesië',   stad: 'Yogyakarta', lat: -7.8,  lon: 110.36, tz: 'Asia/Jakarta' },
  xx: { label: 'Elders (grens 18.00)', stad: null,       lat: null,  lon: null,   tz: null },
};

const DAG_MS = 86400000;
const ANKER = Date.UTC(1945, 7, 17); // Jumat Legi
const MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

const mod = (a, b) => ((a % b) + b) % b;
const twee = (n) => String(n).padStart(2, '0');

/** 'JJJJ-MM-DD' → UTC-middernacht in ms, of null. */
export function leesDatum(waarde) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(waarde || ''));
  if (!m) return null;
  const j = +m[1], mnd = +m[2] - 1, d = +m[3];
  const ms = Date.UTC(j, mnd, d);
  const terug = new Date(ms);
  if (terug.getUTCFullYear() !== j || terug.getUTCMonth() !== mnd || terug.getUTCDate() !== d) return null;
  if (j < 1900 || j > 2100) return null;
  return ms;
}

/** 'UU:MM' → minuten na middernacht, of null. */
export function leesTijd(waarde) {
  const m = /^(\d{2}):(\d{2})$/.exec(String(waarde || ''));
  if (!m || +m[1] > 23 || +m[2] > 59) return null;
  return +m[1] * 60 + +m[2];
}

export const uurMinuut = (min) => `${twee(Math.floor(min / 60))}.${twee(min % 60)}`;
export const datumPunten = (ms) => { const d = new Date(ms); return `${twee(d.getUTCDate())}·${twee(d.getUTCMonth() + 1)}·${d.getUTCFullYear()}`; };
export const datumLang = (ms) => { const d = new Date(ms); return `${d.getUTCDate()} ${MAANDEN[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };

/** Weton van een kalenderdag (UTC-middernacht in ms). */
export function wetonVanDag(ms) {
  const pasaran = PASARAN[mod(Math.round((ms - ANKER) / DAG_MS), 5)];
  const dag = DAGEN[new Date(ms).getUTCDay()];
  return { dag, pasaran, neptu: dag.neptu + pasaran.neptu, naam: `${dag.naam} ${pasaran.naam}` };
}

/** Tijdstip van zonsondergang in UTC-ms (NOAA-benadering, ± 2 minuten). */
export function zonsondergangUtc(j, m, d, lat, lon) {
  const r = Math.PI / 180;
  const JD = Date.UTC(j, m, d, 12) / DAG_MS + 2440587.5;
  const n = Math.round(JD - 2451545.0 + 0.0008);
  const Js = n - lon / 360;
  const M = (357.5291 + 0.98560028 * Js) % 360;
  const C = 1.9148 * Math.sin(M * r) + 0.02 * Math.sin(2 * M * r) + 0.0003 * Math.sin(3 * M * r);
  const L = (M + C + 180 + 102.9372) % 360;
  const Jt = 2451545 + Js + 0.0053 * Math.sin(M * r) - 0.0069 * Math.sin(2 * L * r);
  const dec = Math.asin(Math.sin(L * r) * Math.sin(23.44 * r));
  const cosW = (Math.sin(-0.833 * r) - Math.sin(lat * r) * Math.sin(dec)) / (Math.cos(lat * r) * Math.cos(dec));
  return (Jt + Math.acos(Math.max(-1, Math.min(1, cosW))) / (2 * Math.PI) - 2440587.5) * DAG_MS;
}

/** Klokminuten van een UTC-tijdstip in een tijdzone. */
function klokMinuten(ms, tz) {
  const delen = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(ms));
  const uur = +delen.find((p) => p.type === 'hour').value;
  const min = +delen.find((p) => p.type === 'minute').value;
  return uur * 60 + min;
}

/** Zonsondergang op een dag en plaats, in klokminuten. 'xx' = vaste grens 18.00. */
export function zonsondergangMinuten(datumMs, plaatsCode) {
  const p = PLAATSEN[plaatsCode];
  if (!p || p.lat === null) return 18 * 60;
  const d = new Date(datumMs);
  try {
    return klokMinuten(zonsondergangUtc(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), p.lat, p.lon), p.tz);
  } catch {
    return 18 * 60;
  }
}

/**
 * De volledige berekening voor een geboorte.
 * @param {{datum: string, tijd?: string|null, plaats?: string}} invoer
 */
export function berekenWeton({ datum, tijd = null, plaats = 'nl' }) {
  const datumMs = leesDatum(datum);
  if (datumMs === null) return null;
  const plaatsCode = PLAATSEN[plaats] ? plaats : 'nl';
  const geboorteMin = leesTijd(tijd);
  const ondergangMin = zonsondergangMinuten(datumMs, plaatsCode);
  const naOndergang = geboorteMin !== null && geboorteMin >= ondergangMin;
  const javaanseDagMs = naOndergang ? datumMs + DAG_MS : datumMs;
  const w = wetonVanDag(javaanseDagMs);
  return {
    ...w,
    datumMs,
    javaanseDagMs,
    plaats: plaatsCode,
    stad: PLAATSEN[plaatsCode].stad,
    geboorteMin,
    ondergangMin,
    naOndergang,
    dichtBijGrens: geboorteMin !== null && Math.abs(geboorteMin - ondergangMin) <= 20,
  };
}

/** Eerstvolgende wetonan (vandaag of later). */
export function volgendeWetonan(javaanseDagMs, nu = new Date()) {
  const vandaag = Date.UTC(nu.getFullYear(), nu.getMonth(), nu.getDate());
  if (javaanseDagMs >= vandaag) return javaanseDagMs;
  return javaanseDagMs + Math.ceil((vandaag - javaanseDagMs) / DAG_MS / 35) * 35 * DAG_MS;
}

/** Korte uitleg die op de print staat. Feitelijk, geen voorspelling. */
export function uitlegRegel(w) {
  return `${w.pasaran.naam} hoort bij ${w.pasaran.arah} (${w.pasaran.richting}) en de kleur ${w.pasaran.warna} (${w.pasaran.kleur}). Elke 35 dagen keert je weton terug.`;
}

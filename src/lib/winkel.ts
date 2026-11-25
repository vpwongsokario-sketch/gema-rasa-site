/**
 * Wat er in de winkel van de stichting ligt.
 *
 * De winkel draait op winkel.stichtinggemarasa.com, een andere applicatie met
 * een eigen database. Deze site toont dezelfde producten op /shop, en haalt ze
 * daarom daar op in plaats van ze over te tikken. Eén plek die weet wat er te
 * koop is en wat het kost -- twee lijsten lopen uiteen, en een prijs die hier
 * anders staat dan in de kassa is erger dan geen prijs.
 *
 * Dit gebeurt tijdens het bouwen van de site, niet in de browser van de
 * bezoeker. Verandert er een prijs, dan staat die hier pas na de eerstvolgende
 * bouw. Dat is het eerlijke verhaal: voor een etalage is dat goed genoeg, en
 * de knop gaat naar de winkel zelf, waar het bedrag altijd klopt.
 *
 * Lukt het ophalen niet -- de winkel ligt eruit, of er is geen netwerk tijdens
 * het bouwen -- dan geeft dit een lege lijst terug en valt /shop terug op haar
 * eigen tekst. Een pagina die de bouw laat klappen omdat een andere site even
 * niet antwoordt, is een pagina die je op het verkeerde moment kwijt bent.
 */

/**
 * Waar de winkel staat.
 *
 * Normaal het echte adres. Met WINKEL_ORIGIN kun je er tijdens het bouwen een
 * andere winkel voor zetten -- bij het ontwikkelen een winkel op je eigen
 * machine, zodat je kunt zien hoe de kaartjes eruitzien voordat er iets live
 * staat.
 */
const WINKEL =
  (typeof process !== 'undefined' && process.env?.WINKEL_ORIGIN) ||
  'https://winkel.stichtinggemarasa.com';

export interface WinkelProduct {
  id: string;
  naam: string;
  ondertitel: string | null;
  prijs: number;
  /** true = er zijn meer uitvoeringen; dan hoort er 'vanaf' voor de prijs. */
  vanaf: boolean;
  beeld: string | null;
  labels: string[];
  adres: string;
}

export function euro(bedrag: number): string {
  return `€ ${bedrag.toFixed(2).replace('.', ',')}`;
}

export async function getWinkelProducten(): Promise<WinkelProduct[]> {
  try {
    const antwoord = await fetch(`${WINKEL}/api/winkel.json`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!antwoord.ok) throw new Error(`winkel gaf ${antwoord.status}`);
    const data = (await antwoord.json()) as { producten?: WinkelProduct[] };
    return Array.isArray(data.producten) ? data.producten : [];
  } catch (fout) {
    console.warn('[shop] winkel niet bereikbaar, /shop valt terug op eigen tekst:', fout);
    return [];
  }
}

/**
 * Het slug-deel van een adres, als het onder een bekende map staat.
 *
 * '/boek/kleur-de-gamelan' -> 'kleur-de-gamelan'. Zo weet deze site welke twee
 * kaartjes over hetzelfde boek gaan, zonder dat de winkel daar iets extra's
 * voor hoeft mee te sturen: de koppeling zit al in het adres, en zo doet de
 * winkel het zelf ook.
 */
function slugOnder(adres: string, map: string): string | null {
  const merk = `/${map}/`;
  const i = adres.indexOf(merk);
  if (i === -1) return null;
  const rest = adres.slice(i + merk.length);
  return rest && !rest.includes('/') ? rest : null;
}

/**
 * Hetzelfde boek als één kaartje, gedrukt en als pdf bij elkaar.
 *
 * Drie titels zijn er in twee uitvoeringen: een gedrukt boek op /boek/x met
 * een voorraad en verzendkosten, en dezelfde inhoud als pdf op /winkel/x die
 * meteen in je mail komt. In de winkel zelf staan die in aparte vakken ('op de
 * post of ophalen' en 'meteen downloaden'), en daar leest het goed. Deze
 * etalage is één rooster zonder koppen, en dan zie je tweemaal hetzelfde
 * omslag met een andere prijs eronder -- dat leest als een fout.
 *
 * Daarom blijft hier het gedrukte kaartje staan, met de laagste prijs en
 * 'vanaf' ervoor, en een label dat zegt dat het ook een pdf kan zijn. Precies
 * zoals de kalender hier al staat. De keuze zelf valt op de pagina van het
 * boek, waar de pdf met prijs en al onder de bestelknop staat.
 *
 * Een pdf zonder gedrukte broer (de memory's, de poster, de bundel) blijft
 * gewoon een eigen kaartje. Komt er een vierde titel bij, dan gaat dit
 * vanzelf goed: er wordt niets opgesomd, er wordt op het adres gekeken.
 */
export function voegUitvoeringenSamen(producten: WinkelProduct[]): WinkelProduct[] {
  const pdfs = new Map<string, WinkelProduct>();
  for (const p of producten) {
    const slug = slugOnder(p.adres, 'winkel');
    if (slug) pdfs.set(slug, p);
  }

  const opgeslokt = new Set<string>();
  const uit: WinkelProduct[] = [];

  for (const p of producten) {
    const slug = slugOnder(p.adres, 'boek');
    const pdf = slug ? pdfs.get(slug) : undefined;

    if (!pdf) {
      uit.push(p);
      continue;
    }

    opgeslokt.add(pdf.id);

    // De twee bezorglabels horen bij elkaar, zoals bij de kalender.
    const labels = [...p.labels];
    const post = labels.findIndex((l) => l.includes('op de post'));
    labels.splice(post === -1 ? labels.length : post, 0, 'op papier of als pdf');

    uit.push({
      ...p,
      prijs: Math.min(p.prijs, pdf.prijs),
      vanaf: true,
      labels,
    });
  }

  return uit.filter((p) => !opgeslokt.has(p.id));
}

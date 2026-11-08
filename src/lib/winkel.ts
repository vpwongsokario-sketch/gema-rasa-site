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

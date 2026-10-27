/**
 * Haalt de nieuwste video's op van het YouTube-kanaal van Stichting Gema Rasa.
 *
 * Gebruikt de publieke RSS-feed van YouTube — geen API-sleutel nodig, dus niets
 * dat kan verlopen of geld kost. Het ophalen gebeurt tijdens het bouwen van de
 * site; nieuwe video's verschijnen dus bij de eerstvolgende herbouw.
 */

export const YT_KANAAL_ID = 'UCqc43qmiQYxselTYNfHxkeA';
export const YT_KANAAL_URL = 'https://www.youtube.com/@StichtingGemaRasa';

const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_KANAAL_ID}`;

export type Video = {
  id: string;
  titel: string;
  datum: string;
  datumLabel: string;
  /** Uit media:description. Google wil bij een video een omschrijving. */
  beschrijving: string;
  thumb: string;
  url: string;
};

const datumOpmaak: Record<string, Intl.DateTimeFormat> = {
  nl: new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }),
  en: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  id: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
};

const ontsnap = (s: string) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
   .replace(/&quot;/g, '"').replace(/&#39;/g, "'");

export async function getVideos(taal: string = 'nl', max = 12): Promise<Video[]> {
  try {
    const res = await fetch(FEED, { headers: { 'user-agent': 'gema-rasa-site' } });
    if (!res.ok) return [];
    const xml = await res.text();

    const items = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
    const opmaak = datumOpmaak[taal] ?? datumOpmaak.nl;

    return items.slice(0, max).map((blok) => {
      const pak = (tag: string) => {
        const m = blok.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
        return m ? ontsnap(m[1].trim()) : '';
      };
      const id = pak('yt:videoId');
      const datum = pak('published');
      return {
        id,
        titel: pak('media:title') || pak('title'),
        datum,
        datumLabel: datum ? opmaak.format(new Date(datum)) : '',
        // Eén alinea is genoeg; de hele YouTube-omschrijving staat vol links.
        beschrijving: (pak('media:description').split('\n')[0] || '').slice(0, 300),
        // maxresdefault bestaat niet altijd; hqdefault is er altijd
        thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${id}`,
      };
    }).filter((v) => v.id);
  } catch {
    // Feed onbereikbaar tijdens de build: liever een pagina zonder video's
    // dan een mislukte build.
    return [];
  }
}

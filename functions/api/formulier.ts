/**
 * Ontvangt de formulieren van de website en slaat ze op in Sanity.
 * Draait als Cloudflare Pages Function op /api/formulier.
 *
 * Vereist één geheim in Cloudflare: SANITY_WRITE_TOKEN (Editor-rechten).
 */

const PROJECT = '6q1rydes';
const DATASET = 'production';
const SANITY_API = `https://${PROJECT}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

const geldigEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
const kort = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
const isWaar = (v: unknown) => v === true || v === 'true' || v === 'on' || v === '1';

export const onRequestPost = async (context: any): Promise<Response> => {
  const { request, env } = context;

  let data: Record<string, unknown>;
  try {
    const type = request.headers.get('content-type') || '';
    data = type.includes('application/json')
      ? await request.json()
      : Object.fromEntries(await request.formData());
  } catch {
    return json({ ok: false, fout: 'Ongeldige invoer.' }, 400);
  }

  // Honeypot: een verborgen veld dat mensen nooit zien, maar bots wél invullen.
  // We doen alsof het gelukt is, zodat de bot niets leert.
  if (kort(data.website, 200)) return json({ ok: true });

  const soort = kort(data.soort, 20);
  const email = kort(data.email, 200).toLowerCase();
  if (!geldigEmail(email)) {
    return json({ ok: false, fout: 'Vul een geldig e-mailadres in.' }, 400);
  }

  let doc: Record<string, unknown>;

  if (soort === 'contact') {
    const bericht = kort(data.bericht, 5000);
    if (!bericht) return json({ ok: false, fout: 'Vul een bericht in.' }, 400);
    doc = {
      _type: 'bericht',
      naam: kort(data.naam, 120),
      email,
      onderwerp: kort(data.onderwerp, 200),
      bericht,
      ontvangen: new Date().toISOString(),
      afgehandeld: false,
    };
  } else if (soort === 'nieuwsbrief' || soort === 'vrijwilliger') {
    // AVG: zonder expliciete toestemming slaan we niets op
    if (!isWaar(data.toestemming)) {
      return json({ ok: false, fout: 'Zet een vinkje bij de toestemming om door te gaan.' }, 400);
    }
    doc = {
      _type: 'aanmelding',
      naam: kort(data.naam, 120),
      email,
      soort,
      toelichting: kort(data.toelichting, 2000),
      toestemming: true,
      ontvangen: new Date().toISOString(),
      verwerkt: false,
    };
  } else {
    return json({ ok: false, fout: 'Onbekend formulier.' }, 400);
  }

  if (!env?.SANITY_WRITE_TOKEN) {
    return json({ ok: false, fout: 'De server is nog niet volledig ingesteld.' }, 500);
  }

  try {
    const res = await fetch(SANITY_API, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${env.SANITY_WRITE_TOKEN}`,
      },
      body: JSON.stringify({ mutations: [{ create: doc }] }),
    });
    if (!res.ok) {
      return json({ ok: false, fout: 'Opslaan mislukt. Probeer het later nog eens.' }, 502);
    }
  } catch {
    return json({ ok: false, fout: 'Opslaan mislukt. Probeer het later nog eens.' }, 502);
  }

  // Nieuwsbrief-aanmelding ook doorzetten naar GoHighLevel (voor het versturen).
  // Gaat via een Inbound-Webhook van GHL; de workflow daar maakt/updatet het
  // contact. Lukt dit niet of ontbreekt de URL, dan blijft de aanmelding wél in
  // het CMS staan — nooit een fout richting de bezoeker.
  if (soort === 'nieuwsbrief' && env?.GHL_WEBHOOK_URL) {
    try {
      await fetch(String(env.GHL_WEBHOOK_URL), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email,
          naam: kort(data.naam, 120),
          bron: 'website-nieuwsbrief',
          toestemming: true,
          ontvangen: new Date().toISOString(),
        }),
      });
    } catch {
      // stil: de aanmelding staat al veilig in het CMS
    }
  }

  return json({ ok: true });
};

// Andere methodes netjes afwijzen
export const onRequest = async (context: any): Promise<Response> => {
  if (context.request.method === 'POST') return onRequestPost(context);
  return json({ ok: false, fout: 'Methode niet toegestaan.' }, 405);
};

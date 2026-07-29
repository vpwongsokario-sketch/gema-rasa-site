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
  } else if (soort === 'vertegenwoordiger') {
    const bericht = kort(data.bericht, 5000);
    if (!bericht) return json({ ok: false, fout: 'Vul een bericht in.' }, 400);
    const repNaam = kort(data.repNaam, 120);
    const team = kort(data.team, 160);
    doc = {
      _type: 'bericht',
      naam: kort(data.naam, 120),
      email,
      onderwerp: `Contact via wereldwijd-pagina${repNaam ? ' — ' + repNaam : ''}`,
      bestemming: [team, repNaam, kort(data.repEmail, 200)].filter(Boolean).join(' · '),
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

  // Contact ook naar GoHighLevel schrijven via de gewone API (gratis; géén
  // premium-webhook). We 'upserten' op e-mail: bestaat het contact al, dan wordt
  // het bijgewerkt, anders nieuw aangemaakt. De tag per soort maakt filteren
  // mogelijk én laat in GHL een gratis meldingsworkflow (trigger op tag) los.
  // Lukt dit niet, dan blijft alles gewoon in het CMS staan — nooit een fout
  // richting de bezoeker.
  const GHL_TAGS: Record<string, string> = {
    contact: 'website-bericht',
    nieuwsbrief: 'website-nieuwsbrief',
    vrijwilliger: 'website-vrijwilliger',
    vertegenwoordiger: 'website-vertegenwoordiger',
  };
  if (env?.GHL_API_TOKEN && env?.GHL_LOCATION_ID) {
    try {
      const naam = kort(data.naam, 120);
      const delen = naam.split(/\s+/).filter(Boolean);
      const voornaam = delen.shift() || '';
      await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${env.GHL_API_TOKEN}`,
          version: '2021-07-28',
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          locationId: String(env.GHL_LOCATION_ID),
          email,
          name: naam || undefined,
          firstName: voornaam || undefined,
          lastName: delen.join(' ') || undefined,
          source: 'website',
          tags: [GHL_TAGS[soort] || 'website'],
        }),
      });
    } catch {
      // stil: het bericht/de aanmelding staat al veilig in het CMS
    }
  }

  // Bericht voor een vertegenwoordiger ook rechtstreeks naar diens inbox mailen
  // (via Resend). De bezoeker staat als reply-to, zodat de vertegenwoordiger
  // meteen kan antwoorden. Lukt dit niet, dan staat het bericht al in het CMS
  // (+ GHL) — nooit een fout richting de bezoeker.
  if (soort === 'vertegenwoordiger' && env?.RESEND_API_KEY) {
    const repEmail = kort(data.repEmail, 200).toLowerCase();
    if (geldigEmail(repEmail)) {
      const naam = kort(data.naam, 120);
      const team = kort(data.team, 160);
      const tekst = kort(data.bericht, 5000);
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            authorization: `Bearer ${env.RESEND_API_KEY}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            from: String(env.RESEND_FROM || 'Stichting Gema Rasa <contact@stichtinggemarasa.com>'),
            to: [repEmail],
            reply_to: email,
            subject: `Nieuw bericht via de website${team ? ' — ' + team : ''}`,
            text:
              `Je hebt een bericht ontvangen via stichtinggemarasa.com.\n\n` +
              `Van: ${naam || 'Onbekend'} <${email}>\n` +
              (team ? `Team: ${team}\n` : '') +
              `\nBericht:\n${tekst}\n\n` +
              `— Antwoord rechtstreeks op deze e-mail om te reageren.`,
          }),
        });
      } catch {
        // stil: het bericht staat al veilig in het CMS (+ GHL)
      }
    }
  }

  return json({ ok: true });
};

// Andere methodes netjes afwijzen
export const onRequest = async (context: any): Promise<Response> => {
  if (context.request.method === 'POST') return onRequestPost(context);
  return json({ ok: false, fout: 'Methode niet toegestaan.' }, 405);
};

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

/**
 * Het afzenderadres.
 *
 * Moet op een domein staan dat bij Resend is geverifieerd, anders weigert
 * Resend het met een 403 en gaat er niets weg. Hier stond
 * contact@stichtinggemarasa.com, en dat domein is níet geverifieerd --
 * alleen send.stichtinggemarasa.com en carajawa.nl zijn dat. Omdat de
 * verzendfout stil wordt opgevangen (het bericht staat immers al in het
 * CMS) zag niemand ooit dat er niets uitging.
 *
 * Nagekeken op 28 oktober 2026 via de Resend-API.
 */
const AFZENDER = 'Stichting Gema Rasa <contact@send.stichtinggemarasa.com>';

/**
 * De online presentatie over de Educatiereis Java 2027 (pagina
 * /presentatie-java-2027). Wie zich aanmeldt krijgt meteen een mail met de
 * link hieronder. Staat de link er nog niet, dan zegt de mail dat hij later
 * komt -- en staat de aanmelding gewoon in de Studio onder Aanmeldingen.
 *
 * Na `sluit` neemt het formulier geen aanmeldingen meer aan.
 */
const PRESENTATIE = {
  link: 'https://us06web.zoom.us/j/89465422993?pwd=TjZDb7GJ8QubLyOyulEM4ArdRzTG5j.1',
  wanneer: 'zaterdag 14 november 2026 om 09.00 uur (Nederlandse tijd)',
  // Voor de knop 'Zet in je agenda': begin en eind in UTC (09.00–10.30 in Nederland).
  agendaVan: '20261114T080000Z',
  agendaTot: '20261114T093000Z',
  sluit: '2026-11-14T09:30:00Z',
};

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
  } else if (soort === 'verhaal') {
    // Oproep voor het boek van Murwin (pagina /verhalen-gezocht). Opgeslagen als
    // gewoon bericht, zodat het zonder schemawijziging in de Studio onder
    // Berichten verschijnt; de extra velden staan bovenaan in de tekst.
    if (!isWaar(data.toestemming)) {
      return json({ ok: false, fout: 'Zet een vinkje bij de toestemming om door te gaan.' }, 400);
    }
    const verhaal = kort(data.bericht, 5000);
    if (!verhaal) return json({ ok: false, fout: 'Vertel in een paar zinnen waar je verhaal over gaat.' }, 400);
    const regels = [
      ['Telefoon', kort(data.telefoon, 40)],
      ['Woonplaats', kort(data.woonplaats, 120)],
      ['Van wie komt het verhaal', kort(data.bron, 120)],
      ['Benaderen via', kort(data.contactwijze, 40)],
      ['Anoniem in het boek', isWaar(data.anoniem) || kort(data.anoniem, 5) === 'ja' ? 'ja' : 'nee'],
    ]
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    doc = {
      _type: 'bericht',
      naam: kort(data.naam, 120),
      email,
      onderwerp: 'Verhaal voor het boek van Murwin',
      bericht: `${regels}\n\nVerhaal:\n${verhaal}\n\n(Toestemming gegeven om gegevens te delen met Murwin voor dit boek.)`,
      ontvangen: new Date().toISOString(),
      afgehandeld: false,
    };
  } else if (soort === 'presentatie') {
    // Online presentatie Educatiereis Java 2027. Opgeslagen als aanmelding;
    // de bevestigingsmail met de link gaat verderop uit.
    if (Date.now() > Date.parse(PRESENTATIE.sluit)) {
      return json({ ok: false, fout: 'De presentatie is al geweest. Mail naar info@stichtinggemarasa.com als je meer wilt weten over de reis.' }, 400);
    }
    if (!isWaar(data.toestemming)) {
      return json({ ok: false, fout: 'Zet een vinkje bij de toestemming om door te gaan.' }, 400);
    }
    const vraag = kort(data.bericht, 2000);
    doc = {
      _type: 'aanmelding',
      naam: kort(data.naam, 120),
      email,
      soort: 'presentatie-java2027',
      toelichting: `Online presentatie Educatiereis Java 2027 (14 november)${vraag ? `\n\nVraag vooraf:\n${vraag}` : ''}`,
      toestemming: true,
      ontvangen: new Date().toISOString(),
      verwerkt: false,
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

  /**
   * Een nieuwsbrief-aanmelding ook op de nieuwsbrieflijst zetten.
   *
   * De lijst staat in hetzelfde Sanity-project, maar we schrijven er niet zelf
   * in: we geven het door aan suwarajawa.nl, waar de mailingtool woont. Daar
   * staan de regels over toestemming, dubbele adressen en testdomeinen — en
   * die wil je op één plek hebben, niet in twee websites die uit elkaar
   * groeien.
   *
   * Lukt het niet, dan gaat er niets verloren: de aanmelding staat hierboven
   * al in het CMS, met datum en toestemming. De bezoeker merkt er niets van.
   */
  if (soort === 'nieuwsbrief') {
    try {
      const basis = env?.MAILINGTOOL_URL || 'https://www.suwarajawa.nl';
      await fetch(`${basis}/api/nieuwsbrief/aanmelden`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email,
          naam: kort(data.naam, 120),
          lijst: 'gema-rasa',
          toestemming: true,
        }),
      });
    } catch {
      // stil: de aanmelding staat al veilig in het CMS
    }
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
    verhaal: 'website-verhaal',
  };
  if (soort !== 'presentatie' && env?.GHL_API_TOKEN && env?.GHL_LOCATION_ID) {
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

  /**
   * Melden dat er post is.
   *
   * Hier ging het mis: een bericht via het contactformulier kwam wél in het
   * CMS maar er ging geen mail uit, dus niemand wist dat het er was. Op 27
   * oktober 2026 stonden er negen berichten, allemaal onbeantwoord, waarvan
   * de oudste van juli — met daarbij een vraag over een optreden en een over
   * een standplaats. Voor berichten via de wereldwijd-pagina bestond deze
   * melding al; voor gewone berichten niet.
   *
   * De afzender staat als reply-to. Daardoor is antwoorden gewoon op Beantwoorden
   * drukken in je eigen mailprogramma — niets overtypen, en het antwoord komt
   * van de stichting en niet uit een CMS.
   *
   * Nieuwsbriefaanmeldingen krijgen geen melding: die regelen zichzelf en
   * zouden dit alleen maar vol laten lopen. Wie zich als vrijwilliger meldt
   * juist wel: daar wacht iemand op antwoord.
   */
  const meldAan = (env?.CONTACT_EMAIL as string) || 'info@stichtinggemarasa.com';
  const meldenOver = soort === 'contact' || soort === 'vrijwilliger' || soort === 'verhaal';
  if (meldenOver && env?.RESEND_API_KEY && geldigEmail(meldAan)) {
    const naam = kort(data.naam, 120) || 'Onbekend';
    const tekst = soort === 'verhaal' ? String(doc.bericht) : kort(data.bericht, 5000) || kort(data.toelichting, 2000);
    const onderwerp =
      soort === 'vrijwilliger'
        ? `Nieuwe aanmelding als vrijwilliger — ${naam}`
        : soort === 'verhaal'
          ? `Nieuw verhaal voor het boek van Murwin — ${naam}`
          : `Nieuw bericht via de website — ${kort(data.onderwerp, 120) || naam}`;
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${env.RESEND_API_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from: String(env.RESEND_FROM || AFZENDER),
          to: [meldAan],
          reply_to: email,
          subject: onderwerp,
          text:
            `Van: ${naam} <${email}>\n` +
            (kort(data.onderwerp, 200) ? `Onderwerp: ${kort(data.onderwerp, 200)}\n` : '') +
            `\n${tekst}\n\n` +
            `— Druk op Beantwoorden om ${naam} rechtstreeks te antwoorden.\n` +
            `Het bericht staat ook in de Studio onder Berichten; vink het daar af als het klaar is.`,
        }),
      });
    } catch {
      // Stil: het bericht staat al in het CMS. Een mislukte melding mag nooit
      // betekenen dat de bezoeker een foutmelding ziet.
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
            from: String(env.RESEND_FROM || AFZENDER),
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

  /**
   * Bevestiging voor de online presentatie, met de link.
   *
   * Gaat naar de aanmelder zelf; antwoorden komt bij info@ uit. Heeft iemand
   * vooraf een vraag gesteld, dan krijgt info@ die ook even te zien.
   */
  if (soort === 'presentatie' && env?.RESEND_API_KEY) {
    const naam = kort(data.naam, 120);
    const voornaam = naam.split(/\s+/)[0] || '';
    const vraag = kort(data.bericht, 2000);
    const link = PRESENTATIE.link.trim();
    const agenda =
      'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      `&text=${encodeURIComponent('Online presentatie Educatiereis Java 2027')}` +
      `&dates=${PRESENTATIE.agendaVan}/${PRESENTATIE.agendaTot}` +
      `&details=${encodeURIComponent(link ? `Link: ${link}` : 'De link staat in de mail van Stichting Gema Rasa.')}`;
    const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    const tekst =
      `${voornaam ? `Hoi ${voornaam},` : 'Hoi,'}\n\n` +
      `Fijn dat je erbij bent! Je bent aangemeld voor de online presentatie over de Educatiereis Java 2027, ${PRESENTATIE.wanneer}.\n\n` +
      `Wati van Budaya Jivana Yasa vertelt over het programma: vijftien dagen dans, gamelan, batik, musea en tempels in Yogyakarta, van 1 t/m 15 augustus 2027. Je kunt live vragen stellen.\n\n` +
      (link
        ? `Deelnemen via deze link:\n${link}\n\n`
        : `De link naar de presentatie sturen we je uiterlijk vrijdag 13 november.\n\n`) +
      `Zet hem alvast in je agenda:\n${agenda}\n\n` +
      `Meer lezen over de reis: https://www.stichtinggemarasa.com/educatiereis-java-2027/\n\n` +
      `Tot zaterdag!\n\nHartelijke groet,\nStichting Gema Rasa`;

    const html =
      `<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#1a1a31;max-width:560px">` +
      `<p>${voornaam ? `Hoi ${esc(voornaam)},` : 'Hoi,'}</p>` +
      `<p>Fijn dat je erbij bent! Je bent aangemeld voor de online presentatie over de <strong>Educatiereis Java 2027</strong>, ${PRESENTATIE.wanneer}.</p>` +
      `<p>Wati van Budaya Jivana Yasa vertelt over het programma: vijftien dagen dans, gamelan, batik, musea en tempels in Yogyakarta, van 1 t/m 15 augustus 2027. Je kunt live vragen stellen.</p>` +
      (link
        ? `<p style="margin:28px 0"><a href="${esc(link)}" style="background:#09351f;color:#f4f3e8;padding:14px 26px;border-radius:999px;text-decoration:none;font-weight:bold">Deelnemen aan de presentatie</a></p>` +
          `<p style="font-size:13px;color:#56604f">Werkt de knop niet? Gebruik deze link: <a href="${esc(link)}" style="color:#13663d">${esc(link)}</a></p>`
        : `<p><strong>De link naar de presentatie sturen we je uiterlijk vrijdag 13 november.</strong></p>`) +
      `<p><a href="${esc(agenda)}" style="color:#13663d">Zet hem in je agenda</a> · <a href="https://www.stichtinggemarasa.com/educatiereis-java-2027/" style="color:#13663d">Meer over de reis</a></p>` +
      `<p>Tot zaterdag!</p><p>Hartelijke groet,<br>Stichting Gema Rasa</p></div>`;

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          from: String(env.RESEND_FROM || AFZENDER),
          to: [email],
          reply_to: meldAan,
          subject: 'Je aanmelding: online presentatie Educatiereis Java 2027',
          text: tekst,
          html,
        }),
      });
    } catch {
      // stil: de aanmelding staat al in de Studio onder Aanmeldingen
    }

    if (vraag && geldigEmail(meldAan)) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
          body: JSON.stringify({
            from: String(env.RESEND_FROM || AFZENDER),
            to: [meldAan],
            reply_to: email,
            subject: `Vraag voor de presentatie Java 2027 — ${naam || email}`,
            text: `Van: ${naam || 'Onbekend'} <${email}>\n\n${vraag}\n\n— Aangemeld voor de online presentatie van 14 november. Druk op Beantwoorden om rechtstreeks te antwoorden, of bewaar de vraag voor Wati.`,
          }),
        });
      } catch {
        // stil
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

/**
 * Uitschrijven van de nieuwsbrief, op het domein van de stichting.
 *
 * Waarom deze pagina hier staat en niet alleen op suwarajawa.nl: de mailingtool
 * woont daar, maar de nieuwsbrief van de stichting komt van de stichting. Wie
 * zich hier heeft ingeschreven en in zo'n mail op 'uitschrijven' klikt, hoort
 * niet op de site van een tijdschrift te belanden dat hij misschien niet kent.
 * Bij een afmeldlink wil je geen enkele twijfel — twijfel eindigt in de
 * spamknop, en dat kost de hele lijst.
 *
 * Het uitschrijven zelf gebeurt nog steeds op één plek: deze functie geeft het
 * door aan de mailingtool. Zo staan de controle van de link en het bijwerken
 * van de lijst niet op twee plaatsen, want twee plaatsen lopen uit elkaar.
 *
 * Draait als Cloudflare Pages Function op /uitschrijven.
 */

const MAILINGTOOL = 'https://www.suwarajawa.nl'

const K = {
  groen: '#09351f',
  smaragd: '#13663d',
  goud: '#efc83e',
  oranje: '#fc8e44',
  oranjeInk: '#a84e18',
  creme: '#f4f3e8',
  ink: '#1a1a31',
  grijs: '#5e5e5e',
}

const ontsnap = (t: unknown) =>
  String(t ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/**
 * De pagina.
 *
 * Eén bestand, met de opmaak erin. Dit is een doodlopende pagina die iemand
 * één keer ziet; die hoeft niet de hele site met zijn menu en voettekst mee te
 * slepen, en zeker niet te wachten op een stylesheet.
 */
function pagina({
  kop,
  tekst,
  knop,
  email,
  token,
  soort,
}: {
  kop: string
  tekst: string
  knop?: string
  email?: string
  token?: string
  soort: 'vraag' | 'gelukt' | 'fout'
}) {
  const kleur = soort === 'fout' ? K.oranjeInk : K.smaragd
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${ontsnap(kop)} · Stichting Gema Rasa</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/png" href="/assets/icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Poppins:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 32px 20px;
    background: ${K.creme};
    color: ${K.ink};
    font-family: Poppins, -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 300;
    line-height: 1.7;
  }
  .kaart {
    width: 100%;
    max-width: 540px;
    background: #fff;
    border: 1px solid rgba(9, 53, 31, 0.14);
    border-radius: 18px;
    padding: 44px 40px 40px;
    box-shadow: 0 18px 40px rgba(9, 53, 31, 0.08);
  }
  .merk {
    font-family: 'Bricolage Grotesque', Poppins, sans-serif;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${K.oranjeInk};
    margin: 0 0 18px;
  }
  h1 {
    font-family: 'Bricolage Grotesque', Poppins, sans-serif;
    font-weight: 700;
    font-size: clamp(26px, 5vw, 34px);
    line-height: 1.15;
    color: ${kleur};
    margin: 0 0 16px;
  }
  p { margin: 0 0 18px; font-size: 16px; }
  .adres {
    font-weight: 500;
    color: ${K.groen};
    /* Alleen afbreken als een lang adres er anders niet in past — break-all
       knipte 'test@voorbeeld.nl' middenin een woord doormidden. */
    overflow-wrap: anywhere;
  }
  form { margin: 26px 0 0; }
  button {
    font-family: Poppins, sans-serif;
    font-weight: 500;
    font-size: 16px;
    color: #fff;
    background: ${K.smaragd};
    border: none;
    border-radius: 999px;
    padding: 15px 30px;
    min-height: 48px;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  button:hover { background: ${K.groen}; }
  button:disabled { opacity: 0.6; cursor: progress; }
  .terug {
    display: inline-block;
    margin-top: 26px;
    font-size: 14px;
    color: ${K.oranjeInk};
    text-decoration: none;
    border-bottom: 1px solid rgba(168, 78, 24, 0.35);
  }
  .klein { font-size: 13.5px; color: ${K.grijs}; margin-top: 22px; }
  /* Een streep in de huisstijlkleuren, als ondertoon van de kaart. */
  .streep {
    height: 4px;
    border-radius: 999px;
    margin: 0 0 26px;
    background: linear-gradient(90deg, ${K.groen} 0%, ${K.smaragd} 45%, ${K.goud} 72%, ${K.oranje} 100%);
  }
</style>
</head>
<body>
  <main class="kaart">
    <div class="streep"></div>
    <p class="merk">Stichting Gema Rasa</p>
    <h1>${ontsnap(kop)}</h1>
    <p>${tekst}</p>
    ${
      knop && email && token
        ? `<form method="POST" action="/uitschrijven">
      <input type="hidden" name="e" value="${ontsnap(email)}">
      <input type="hidden" name="t" value="${ontsnap(token)}">
      <button type="submit">${ontsnap(knop)}</button>
    </form>`
        : ''
    }
    <a class="terug" href="/">Naar stichtinggemarasa.com</a>
    ${
      soort === 'gelukt'
        ? `<p class="klein">Per ongeluk uitgeschreven? Je kunt je opnieuw aanmelden via het formulier op onze site.</p>`
        : ''
    }
  </main>
</body>
</html>`
}

const html = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // Een afmeldpagina hoort nergens bewaard te worden: hij hangt aan één
      // ondertekend adres en is voor niemand anders juist.
      'cache-control': 'no-store, max-age=0',
    },
  })

/** Het uitschrijven doorgeven aan de mailingtool. */
async function schrijfUit(basis: string, email: string, token: string) {
  const adres = `${basis}/api/uitschrijven?e=${encodeURIComponent(email)}&t=${encodeURIComponent(token)}`
  const antwoord = await fetch(adres, { method: 'POST' })
  let uitslag: { ok?: boolean; uitslag?: string; fout?: string } = {}
  try {
    uitslag = await antwoord.json()
  } catch {
    // Geen leesbaar antwoord: dan gaat het hieronder mis op ok !== true.
  }
  return { gelukt: antwoord.ok && uitslag.ok === true, uitslag }
}

export const onRequestGet = async (context: any): Promise<Response> => {
  const url = new URL(context.request.url)
  const email = (url.searchParams.get('e') || '').trim().toLowerCase()
  const token = (url.searchParams.get('t') || '').trim()

  if (!email || !token) {
    return html(
      pagina({
        soort: 'fout',
        kop: 'Deze link werkt niet',
        tekst:
          'Er mist iets in de link. Open hem opnieuw vanuit de mail die je van ons hebt gekregen, of stuur een berichtje naar <span class="adres">info@stichtinggemarasa.com</span> — dan halen we je er met de hand uit.',
      }),
      400
    )
  }

  /**
   * Eerst vragen, niet meteen uitschrijven.
   *
   * Mailprogramma's en spamfilters openen links in een mail soms zelf om ze te
   * controleren. Zou deze pagina bij het openen al uitschrijven, dan zou zo'n
   * controle iemand ongevraagd van de lijst halen. De knop hieronder verstuurt
   * een POST, en daar klikt alleen een mens op.
   */
  return html(
    pagina({
      soort: 'vraag',
      kop: 'Geen nieuwsbrief meer?',
      tekst: `Je staat ingeschreven met <span class="adres">${ontsnap(
        email
      )}</span>. Als je op de knop klikt, halen we dat adres van onze lijst en krijg je geen nieuwsbrief meer van ons.`,
      knop: 'Ja, schrijf mij uit',
      email,
      token,
    })
  )
}

export const onRequestPost = async (context: any): Promise<Response> => {
  const { request, env } = context
  const url = new URL(request.url)
  let email = (url.searchParams.get('e') || '').trim().toLowerCase()
  let token = (url.searchParams.get('t') || '').trim()

  if (!email || !token) {
    try {
      const soort = request.headers.get('content-type') || ''
      const gegevens = soort.includes('application/json')
        ? await request.json()
        : Object.fromEntries(await request.formData())
      email = email || String(gegevens.e || gegevens.email || '').trim().toLowerCase()
      token = token || String(gegevens.t || gegevens.token || '').trim()
    } catch {
      // geen leesbare inhoud: dan blijft het bij wat er in de link stond
    }
  }

  if (!email || !token) {
    return html(
      pagina({
        soort: 'fout',
        kop: 'Deze link werkt niet',
        tekst:
          'Er mist iets in de link. Stuur een berichtje naar <span class="adres">info@stichtinggemarasa.com</span>, dan halen we je er met de hand uit.',
      }),
      400
    )
  }

  const basis = env?.MAILINGTOOL_URL || MAILINGTOOL
  let gelukt = false
  try {
    const antwoord = await schrijfUit(basis, email, token)
    gelukt = antwoord.gelukt
  } catch (fout) {
    console.error('[uitschrijven] doorgeven mislukt', fout)
  }

  if (!gelukt) {
    /**
     * Mislukt: wel een fout laten zien, maar met een uitweg.
     *
     * Iemand die zich wil afmelden en een foutmelding krijgt, drukt anders op
     * de spamknop. Daarom staat hier een adres waar een mens antwoordt.
     */
    return html(
      pagina({
        soort: 'fout',
        kop: 'Het lukte net niet',
        tekst: `We konden <span class="adres">${ontsnap(
          email
        )}</span> nu niet van de lijst halen. Probeer het over een paar minuten nog eens, of mail <span class="adres">info@stichtinggemarasa.com</span> — dan doen we het met de hand, dezelfde dag.`,
      }),
      502
    )
  }

  return html(
    pagina({
      soort: 'gelukt',
      kop: 'Je bent uitgeschreven',
      tekst: `We sturen geen nieuwsbrief meer naar <span class="adres">${ontsnap(
        email
      )}</span>. Er kan nog één mail onderweg zijn die al verstuurd was; daarna is het stil.`,
    })
  )
}

/**
 * De afmeldknop die Gmail en Apple Mail zelf bovenaan een mail zetten.
 *
 * Die knop staat er door twee koppen in de nieuwsbrief: List-Unsubscribe en
 * List-Unsubscribe-Post. Het mailprogramma doet een POST naar dit adres, zonder
 * dat de ontvanger een pagina ziet. Dat is niet alleen netjes — mailprogramma's
 * kijken ernaar bij de vraag of onze post in de spammap hoort.
 *
 * Voor de nieuwsbrief van de stichting staat in die kop nu een adres op
 * stichtinggemarasa.com, en daarom bestaat deze functie. Hij geeft het verzoek
 * door aan de mailingtool op suwarajawa.nl, waar de link wordt gecontroleerd en
 * de lijst wordt bijgewerkt. Eén plek, zodat de twee niet uit elkaar lopen.
 *
 * Draait als Cloudflare Pages Function op /api/uitschrijven.
 */

const MAILINGTOOL = 'https://www.suwarajawa.nl'

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, max-age=0',
    },
  })

export const onRequestPost = async (context: any): Promise<Response> => {
  const { request, env } = context
  const url = new URL(request.url)
  let email = (url.searchParams.get('e') || '').trim().toLowerCase()
  let token = (url.searchParams.get('t') || '').trim()

  // Sommige mailprogramma's sturen het mee in de inhoud in plaats van in de link.
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
    return json({ ok: false, fout: 'Deze link is niet geldig' }, 400)
  }

  const basis = env?.MAILINGTOOL_URL || MAILINGTOOL
  const adres = `${basis}/api/uitschrijven?e=${encodeURIComponent(email)}&t=${encodeURIComponent(
    token
  )}`

  try {
    const antwoord = await fetch(adres, { method: 'POST' })
    const inhoud = await antwoord.text()
    /**
     * Het antwoord van de mailingtool onveranderd doorgeven.
     *
     * Ook de foutcode. Een mailprogramma dat een 500 terugkrijgt probeert het
     * later nog eens, en dat is precies wat we willen als het even niet lukte.
     */
    return new Response(inhoud, {
      status: antwoord.status,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store, max-age=0',
      },
    })
  } catch (fout) {
    console.error('[api/uitschrijven] doorgeven mislukt voor', email, fout)
    // Geen 200 bij een mislukking: dan denkt het mailprogramma dat het gelukt
    // is en probeert het nooit meer, terwijl deze persoon nog op de lijst staat.
    return json({ ok: false, fout: 'Kon het verzoek niet doorgeven' }, 502)
  }
}

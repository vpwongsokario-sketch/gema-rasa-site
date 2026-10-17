// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import sitemap from '@astrojs/sitemap';

// De live-URL. Nodig voor canonical-links, sitemap en Open Graph.
// Wijzig dit naar https://www.stichtinggemarasa.com zodra het domein gekoppeld is.
const SITE = 'https://stichtinggemarasa.com';

/** Het adres van de gamelancursus op het ledenportaal. */
const CURSUS =
  'https://leden.stichtinggemarasa.com/cursussen/javaanse-gamelan-solo-style-in-vogelvlucht'

// https://astro.build/config
export default defineConfig({
  site: SITE,

  /**
   * De gamelancursus is verhuisd naar het ledenportaal.
   *
   * Hij stond hier als testpagina met de inhoud in een json-bestand en de
   * voortgang in de browser van de bezoeker. Nu staat hij in de cursusmodule,
   * waar de voortgang bij de persoon hoort en de lessen in de Studio te
   * bewerken zijn.
   *
   * De pagina is weg maar het adres niet: de link is gedeeld om te testen, en
   * een gedeelde link hoort niet dood te lopen.
   *
   * Het eindadres is sinds 17 oktober 2026 het ledenportaal zelf, niet meer
   * suwarajawa.nl. Dat wees wel de goede kant op -- het magazine stuurt
   * /cursussen door naar het portaal -- maar dan sprong een bezoeker twee keer
   * en kwam de naam van een tijdschrift in de adresbalk voorbij voor een
   * cursus van de stichting. De cursus heet nu ook anders, op verzoek van de
   * voorzitter, dus de naam in het adres is mee veranderd.
   */
  redirects: {
    '/gamelan-cursus': CURSUS,
    '/en/gamelan-cursus': CURSUS,
    '/id/gamelan-cursus': CURSUS,
  },
  integrations: [
    sanity({
      projectId: '6q1rydes',
      dataset: 'production',
      /**
       * Geen Studio meer op deze site.
       *
       * Het bewerken gebeurt op één plek, onder de stichting:
       * nieuwsbrief.stichtinggemarasa.com/studio. Daarvoor stonden hier de
       * website-soorten en op het platform het magazine, de leden en de
       * nieuwsbrief — twee deuren naar dezelfde kamer. De leden en vrienden
       * stonden hier, de abonnees en de nieuwsbrieflezers daar, en de berichten
       * uit het contactformulier hier: zeven onafgehandeld, waarvan drie van
       * mensen die sinds juli op antwoord wachtten omdat niemand deze Studio
       * opendeed.
       *
       * Deze site blijft de gegevens gewoon ophalen. Daarvoor is de
       * projectsleutel en het leestoken nodig, geen veldbeschrijvingen.
       */
      useCdn: false,
      apiVersion: '2024-01-01',
      // Leessleutel. Nodig omdat de dataset op privé staat: in datzelfde
      // project zitten de leden-, bestel- en inzendgegevens van Suwara Jawa,
      // en die horen niet openbaar leesbaar te zijn. Zonder deze sleutel
      // bouwt deze site zonder content.
      //
      // Zet SANITY_API_READ_TOKEN in de omgevingsvariabelen van Cloudflare Pages.
      // Een token met alleen Viewer-rechten is genoeg.
      token: process.env.SANITY_API_READ_TOKEN,
    }),
    react(),
    sitemap({
      // De Studio en API-routes horen niet in de sitemap
      filter: (page) => !page.includes('/studio'),
      i18n: {
        defaultLocale: 'nl',
        locales: { nl: 'nl-NL', en: 'en-GB', id: 'id-ID' },
      },
    }),
  ],
});

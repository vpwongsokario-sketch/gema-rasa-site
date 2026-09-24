// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import sitemap from '@astrojs/sitemap';

// De live-URL. Nodig voor canonical-links, sitemap en Open Graph.
// Wijzig dit naar https://www.stichtinggemarasa.com zodra het domein gekoppeld is.
const SITE = 'https://stichtinggemarasa.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
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

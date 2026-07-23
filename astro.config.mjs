// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import sitemap from '@astrojs/sitemap';

// De live-URL. Nodig voor canonical-links, sitemap en Open Graph.
// Wijzig dit naar https://www.stichtinggemarasa.com zodra het domein gekoppeld is.
const SITE = 'https://gema-rasa-site.pages.dev';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [
    sanity({
      projectId: '6q1rydes',
      dataset: 'production',
      // Studio (bewerk-dashboard) draait op /studio
      studioBasePath: '/studio',
      useCdn: false,
      apiVersion: '2024-01-01',
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

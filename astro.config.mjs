// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sanity from '@sanity/astro';

// https://astro.build/config
export default defineConfig({
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
  ],
});

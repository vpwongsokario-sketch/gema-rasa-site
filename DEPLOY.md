# Deploy — Stichting Gema Rasa

De site is een **statische Astro-site** die z'n content bij het bouwen uit **Sanity** haalt.
Hosting: **Cloudflare Pages** (gratis). Bij publiceren in Sanity wordt de site automatisch
opnieuw gebouwd via een deploy hook.

## Cloudflare Pages — build-instellingen

| Instelling | Waarde |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 20 of hoger (env var `NODE_VERSION=20`) |

De Sanity Project ID (`6q1rydes`) en dataset (`production`) staan in `astro.config.mjs` —
geen geheimen nodig, want de dataset is publiek leesbaar.

## Stappen (eenmalig)

1. **GitHub**: maak een repo aan en push deze map.
2. **Cloudflare Pages**: *Create project → Connect to Git →* kies de repo. Vul de build-instellingen
   hierboven in. → geeft een `https://<project>.pages.dev` adres.
3. **Sanity CORS** (voor het Studio-dashboard op de live site):
   voeg de live-URL toe zodat je ook op `.../studio` kunt inloggen:
   ```
   npx sanity cors add https://<project>.pages.dev
   npx sanity cors add https://<eigen-domein>
   ```
   *(De publieke site zelf heeft geen CORS nodig — die haalt content op tijdens het bouwen.)*
4. **Eigen domein**: in Cloudflare Pages → *Custom domains* → domein toevoegen en de DNS-aanwijzing
   volgen (CNAME/A-record bij je domeinregistrar).

## Auto-rebuild bij publiceren (Sanity → Cloudflare)

1. Cloudflare Pages → project → *Settings → Builds & deployments → Deploy hooks* → maak een hook,
   kopieer de URL.
2. Sanity: [manage.sanity.io](https://manage.sanity.io) → project → *API → Webhooks → Create webhook*
   → plak de Cloudflare deploy hook URL, trigger op *Create / Update / Delete*.
   → Nu bouwt de site zichzelf opnieuw zodra iemand iets publiceert in het CMS.

## Lokaal

```
npm install
npm run dev      # site + Studio op http://localhost:4321  (Studio op /studio)
npm run build    # productie-build naar dist/
```

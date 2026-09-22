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

De Sanity Project ID (`6q1rydes`) en dataset (`production`) staan in `astro.config.mjs`.

**Let op — er is nu wél een geheim nodig.** De dataset staat op *private*, omdat er in
hetzelfde Sanity-project persoonsgegevens van Suwara Jawa staan (leden, bestellingen,
inzendingen). Stond die op publiek, dan kon iedereen die het project-ID kent die gegevens
uitlezen; het project-ID staat in de JavaScript van elke site.

Daarom heeft deze site een leessleutel nodig om te kunnen bouwen:

| Env var | Waarde |
|---|---|
| `SANITY_API_READ_TOKEN` | Sanity-token met **Viewer**-rechten |

Zet die in Cloudflare Pages → *Settings → Environment variables* (Production, en Preview als
die gebruikt wordt). Zonder deze variabele bouwt de site **zonder content** — en omdat er een
deploy hook op Sanity zit, gebeurt dat al bij de eerstvolgende publicatie in het CMS.

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

## Nieuwsbrief

Een aanmelding via het formulier onderaan de site komt op twee plekken terecht:

1. Als `aanmelding` in Sanity — met datum en toestemmingsvinkje. Dat is het bewijs
   dat iemand zich heeft opgegeven, en dat blijft hier staan.
2. Op de nieuwsbrieflijst van de mailingtool, via een aanroep naar
   `https://www.suwarajawa.nl/api/nieuwsbrief/aanmelden` met `lijst: "gema-rasa"`.

De regels over toestemming, dubbele adressen en testdomeinen staan alleen in de
mailingtool. Dat is bewust: twee websites die elk hun eigen versie van die regels
bijhouden, groeien uit elkaar.

Lukt de tweede stap niet, dan gaat er niets verloren — de aanmelding staat al in
Sanity en de bezoeker krijgt gewoon 'bedankt' te zien. Zet de aanmelding dan met
de hand op de lijst in de Studio onder Nieuwsbrief → Inschrijvingen.

Staat de mailingtool ooit op een ander adres, dan kun je dat in Cloudflare Pages
zetten als `MAILINGTOOL_URL`. Zonder die variabele gebruikt hij
`https://www.suwarajawa.nl`.

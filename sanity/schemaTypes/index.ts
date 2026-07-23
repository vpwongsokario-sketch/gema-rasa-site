import { defineType, defineField } from 'sanity';

/* ---------- Herbruikbaar SEO-blok ----------
   Vind-je-terug-velden. Laat je ze leeg, dan gebruikt de site automatisch de
   gewone titel en tekst — invullen is dus alleen nodig als je iets specifieks wilt. */
const seoVeld = defineField({
  name: 'seo',
  title: 'Vindbaarheid (SEO)',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  description: 'Bepaalt hoe deze pagina in Google en op social media verschijnt. Leeg laten mag.',
  fields: [
    defineField({ name: 'titel', title: 'Google-titel', type: 'string',
      validation: (r) => r.max(60).warning('Houd het onder ~60 tekens, anders kapt Google af.'),
      description: 'De blauwe klikbare titel in Google. Leeg = de gewone paginatitel.' }),
    defineField({ name: 'beschrijving', title: 'Google-omschrijving', type: 'text', rows: 2,
      validation: (r) => r.max(160).warning('Houd het onder ~160 tekens.'),
      description: 'Het grijze tekstje onder de titel in Google. Leeg = de intro van de pagina.' }),
    defineField({ name: 'afbeelding', title: 'Deelafbeelding', type: 'image',
      description: 'Verschijnt bij delen op WhatsApp, Facebook, LinkedIn. Liggend beeld werkt het best.' }),
  ],
});

/* ---------- Homepage (singleton) ---------- */
const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: '🇳🇱 Hero', default: true },
    { name: 'productie', title: '🇳🇱 Voorstelling' },
    { name: 'merch', title: '🇳🇱 Merchandise' },
    { name: 'en', title: '🇬🇧 English' },
    { name: 'id', title: '🇮🇩 Indonesia' },
  ],
  fields: [
    // Hero
    defineField({ name: 'heroEyebrow', title: 'Bovenkopje', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTitel', title: 'Titel', type: 'string', group: 'hero', validation: (r) => r.required() }),
    defineField({ name: 'heroTitelAccent', title: 'Accentwoord (goud)', type: 'string', group: 'hero', description: 'Een woord/zin uit de titel dat goud wordt gemarkeerd.' }),
    defineField({ name: 'heroTekst', title: 'Introtekst', type: 'text', rows: 3, group: 'hero' }),
    defineField({ name: 'heroAfbeelding', title: 'Achtergrondfoto', type: 'image', options: { hotspot: true }, group: 'hero' }),
    defineField({ name: 'heroKnopLabel', title: 'Knoptekst', type: 'string', group: 'hero' }),
    defineField({ name: 'heroKnopUrl', title: 'Knop-link', type: 'string', group: 'hero' }),
    // Uitgelichte voorstelling
    defineField({ name: 'productieActief', title: 'Voorstelling tonen op homepage', type: 'boolean', initialValue: true, group: 'productie' }),
    defineField({ name: 'productieKicker', title: 'Labeltje', type: 'string', group: 'productie' }),
    defineField({ name: 'productieTitel', title: 'Titel voorstelling', type: 'string', group: 'productie' }),
    defineField({ name: 'productieDatumLabel', title: 'Datum & locatie', type: 'string', description: 'Bijv. "Zo 12 juli 2026 · Goudse Schouwburg"', group: 'productie' }),
    defineField({ name: 'productieIntro', title: 'Intro', type: 'text', rows: 3, group: 'productie' }),
    defineField({ name: 'productieBeschrijving', title: 'Beschrijving', type: 'text', rows: 4, group: 'productie' }),
    defineField({ name: 'productieCitaat', title: 'Citaat', type: 'text', rows: 2, group: 'productie' }),
    defineField({ name: 'productieAfbeelding', title: 'Foto voorstelling', type: 'image', options: { hotspot: true }, group: 'productie' }),
    defineField({ name: 'productieKnopLabel', title: 'Knoptekst', type: 'string', initialValue: 'Tickets', group: 'productie' }),
    defineField({ name: 'productieKnopUrl', title: 'Knop-link', type: 'string', group: 'productie' }),

    // Merchandise-blok op de homepage
    defineField({ name: 'merchActief', title: 'Merchandise-blok tonen', type: 'boolean', initialValue: true, group: 'merch' }),
    defineField({ name: 'merchKicker', title: 'Labeltje', type: 'string', group: 'merch', description: 'Bijv. "SGR Merchandise"' }),
    defineField({ name: 'merchTitel', title: 'Titel', type: 'string', group: 'merch' }),
    defineField({ name: 'merchTekst1', title: 'Eerste alinea', type: 'text', rows: 3, group: 'merch' }),
    defineField({ name: 'merchTekst2', title: 'Tweede alinea', type: 'text', rows: 3, group: 'merch' }),
    defineField({ name: 'merchAfbeelding', title: 'Foto', type: 'image', options: { hotspot: true }, group: 'merch' }),
    defineField({ name: 'merchKnopLabel', title: 'Knoptekst', type: 'string', initialValue: 'Shop', group: 'merch' }),
    defineField({ name: 'merchKnopUrl', title: 'Knop-link', type: 'string', initialValue: '/shop', group: 'merch' }),

    // ---- Engels (leeg laten = Nederlandse tekst tonen) ----
    defineField({ name: 'heroTitel_en', title: 'Hero title', type: 'string', group: 'en' }),
    defineField({ name: 'heroTitelAccent_en', title: 'Accent word', type: 'string', group: 'en' }),
    defineField({ name: 'heroTekst_en', title: 'Hero intro', type: 'text', rows: 3, group: 'en' }),
    defineField({ name: 'productieTitel_en', title: 'Production title', type: 'string', group: 'en' }),
    defineField({ name: 'productieDatumLabel_en', title: 'Date & venue', type: 'string', group: 'en' }),
    defineField({ name: 'productieIntro_en', title: 'Intro', type: 'text', rows: 3, group: 'en' }),
    defineField({ name: 'productieBeschrijving_en', title: 'Description', type: 'text', rows: 4, group: 'en' }),
    defineField({ name: 'productieCitaat_en', title: 'Quote', type: 'text', rows: 2, group: 'en' }),
    defineField({ name: 'productieKnopLabel_en', title: 'Button label', type: 'string', group: 'en' }),
    defineField({ name: 'merchTitel_en', title: 'Merchandise title', type: 'string', group: 'en' }),
    defineField({ name: 'merchTekst1_en', title: 'Merchandise paragraph 1', type: 'text', rows: 3, group: 'en' }),
    defineField({ name: 'merchTekst2_en', title: 'Merchandise paragraph 2', type: 'text', rows: 3, group: 'en' }),
    defineField({ name: 'merchKnopLabel_en', title: 'Merchandise button', type: 'string', group: 'en' }),

    // ---- Indonesisch ----
    defineField({ name: 'heroTitel_id', title: 'Judul hero', type: 'string', group: 'id' }),
    defineField({ name: 'heroTitelAccent_id', title: 'Kata aksen', type: 'string', group: 'id' }),
    defineField({ name: 'heroTekst_id', title: 'Intro hero', type: 'text', rows: 3, group: 'id' }),
    defineField({ name: 'productieTitel_id', title: 'Judul pertunjukan', type: 'string', group: 'id' }),
    defineField({ name: 'productieDatumLabel_id', title: 'Tanggal & lokasi', type: 'string', group: 'id' }),
    defineField({ name: 'productieIntro_id', title: 'Intro', type: 'text', rows: 3, group: 'id' }),
    defineField({ name: 'productieBeschrijving_id', title: 'Deskripsi', type: 'text', rows: 4, group: 'id' }),
    defineField({ name: 'productieCitaat_id', title: 'Kutipan', type: 'text', rows: 2, group: 'id' }),
    defineField({ name: 'productieKnopLabel_id', title: 'Label tombol', type: 'string', group: 'id' }),
    defineField({ name: 'merchTitel_id', title: 'Judul merchandise', type: 'string', group: 'id' }),
    defineField({ name: 'merchTekst1_id', title: 'Paragraf 1', type: 'text', rows: 3, group: 'id' }),
    defineField({ name: 'merchTekst2_id', title: 'Paragraf 2', type: 'text', rows: 3, group: 'id' }),
    defineField({ name: 'merchKnopLabel_id', title: 'Tombol merchandise', type: 'string', group: 'id' }),
    { ...seoVeld, group: 'hero' },
  ],
  preview: { prepare: () => ({ title: 'Homepage' }) },
});

/* ---------- Nieuws ---------- */
const nieuws = defineType({
  name: 'nieuws',
  title: 'Nieuws',
  type: 'document',
  // Tabbladen per taal. Laat je Engels of Indonesisch leeg, dan toont de site
  // automatisch de Nederlandse tekst.
  groups: [
    { name: 'nl', title: '🇳🇱 Nederlands', default: true },
    { name: 'en', title: '🇬🇧 English' },
    { name: 'id', title: '🇮🇩 Indonesia' },
    { name: 'algemeen', title: 'Algemeen' },
  ],
  fields: [
    defineField({ name: 'titel', title: 'Titel', type: 'string', group: 'nl', validation: (r) => r.required() }),
    defineField({ name: 'intro', title: 'Samenvatting', type: 'text', rows: 3, group: 'nl' }),
    defineField({ name: 'body', title: 'Volledige tekst', type: 'array', of: [{ type: 'block' }, { type: 'image' }], group: 'nl' }),

    defineField({ name: 'titel_en', title: 'Title', type: 'string', group: 'en' }),
    defineField({ name: 'intro_en', title: 'Summary', type: 'text', rows: 3, group: 'en' }),
    defineField({ name: 'body_en', title: 'Full text', type: 'array', of: [{ type: 'block' }, { type: 'image' }], group: 'en' }),

    defineField({ name: 'titel_id', title: 'Judul', type: 'string', group: 'id' }),
    defineField({ name: 'intro_id', title: 'Ringkasan', type: 'text', rows: 3, group: 'id' }),
    defineField({ name: 'body_id', title: 'Teks lengkap', type: 'array', of: [{ type: 'block' }, { type: 'image' }], group: 'id' }),

    defineField({ name: 'slug', title: 'URL-slug', type: 'slug', options: { source: 'titel', maxLength: 96 }, group: 'algemeen', validation: (r) => r.required() }),
    defineField({ name: 'categorie', title: 'Categorie', type: 'string', initialValue: 'Nieuws', group: 'algemeen' }),
    defineField({ name: 'datum', title: 'Datum', type: 'date', group: 'algemeen', initialValue: () => new Date().toISOString().slice(0, 10) }),
    defineField({ name: 'afbeelding', title: 'Afbeelding', type: 'image', options: { hotspot: true }, group: 'algemeen' }),
    { ...seoVeld, group: 'algemeen' },
  ],
  orderings: [{ title: 'Datum, nieuwste eerst', name: 'datumDesc', by: [{ field: 'datum', direction: 'desc' }] }],
  preview: { select: { title: 'titel', subtitle: 'datum', media: 'afbeelding' } },
});

/* ---------- Agenda / evenement ---------- */
const evenement = defineType({
  name: 'evenement',
  title: 'Agenda',
  type: 'document',
  fields: [
    defineField({ name: 'titel', title: 'Titel (NL)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'locatie', title: 'Locatie (NL)', type: 'string' }),
    defineField({ name: 'titel_en', title: 'Title (EN)', type: 'string', description: 'Leeg laten = Nederlandse titel tonen.' }),
    defineField({ name: 'locatie_en', title: 'Location (EN)', type: 'string' }),
    defineField({ name: 'titel_id', title: 'Judul (ID)', type: 'string', description: 'Leeg laten = Nederlandse titel tonen.' }),
    defineField({ name: 'locatie_id', title: 'Lokasi (ID)', type: 'string' }),
    defineField({ name: 'datum', title: 'Datum', type: 'date', validation: (r) => r.required() }),
    defineField({ name: 'link', title: 'Link (optioneel)', type: 'url' }),
  ],
  orderings: [{ title: 'Datum, nieuwste eerst', name: 'datumDesc', by: [{ field: 'datum', direction: 'desc' }] }],
  preview: { select: { title: 'titel', subtitle: 'datum' } },
});

/* ---------- Lid ---------- */
const lid = defineType({
  name: 'lid',
  title: 'Leden',
  type: 'document',
  fields: [
    defineField({ name: 'naam', title: 'Naam', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'rol', title: 'Rol / instrument (NL)', type: 'string' }),
    defineField({ name: 'rol_en', title: 'Role / instrument (EN)', type: 'string', description: 'Leeg laten = Nederlandse tekst tonen.' }),
    defineField({ name: 'rol_id', title: 'Peran / instrumen (ID)', type: 'string', description: 'Leeg laten = Nederlandse tekst tonen.' }),
    defineField({
      name: 'rollen', title: 'Rollen', type: 'array', of: [{ type: 'string' }],
      description: 'Meerdere mogelijk — iemand kan bijvoorbeeld zowel gamelanspeler als vrijwilliger zijn.',
      options: {
        list: [
          { title: 'Bestuur', value: 'bestuur' },
          { title: 'Gamelangroep', value: 'gamelan' },
          { title: 'Vrijwilliger', value: 'vrijwilliger' },
        ],
        layout: 'grid',
      },
      initialValue: ['gamelan'],
    }),
    // Oud veld met één rol. Blijft bestaan zodat bestaande gegevens niet verloren
    // gaan; verdwijnt uit beeld zodra de nieuwe rollen zijn ingevuld.
    defineField({
      name: 'groep', title: 'Groep (oude versie)', type: 'string', readOnly: true,
      hidden: ({ parent }) => !parent?.groep || (parent?.rollen?.length ?? 0) > 0,
    }),
    defineField({
      name: 'ensembles', title: 'Ensemble(s) binnen Jiwa Manunggal', type: 'array', of: [{ type: 'string' }],
      description: 'Meerdere mogelijk — iemand kan bijvoorbeeld in Young Generation én in Mix spelen.',
      options: {
        list: [
          { title: 'Young Generation (3–30 jaar)', value: 'young' },
          { title: 'Silver Generation (30 jaar en ouder)', value: 'silver' },
          { title: 'Mix (beide generaties samen)', value: 'mix' },
        ],
        layout: 'grid',
      },
    }),
    defineField({ name: 'foto', title: 'Foto (optioneel)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'volgorde', title: 'Volgorde', type: 'number', initialValue: 50 }),
  ],
  orderings: [{ title: 'Volgorde', name: 'volgorde', by: [{ field: 'volgorde', direction: 'asc' }] }],
  preview: { select: { title: 'naam', subtitle: 'rol', media: 'foto' } },
});

/* ---------- Vriend / partner ---------- */
const vriend = defineType({
  name: 'vriend',
  title: 'Vrienden van',
  type: 'document',
  fields: [
    defineField({ name: 'naam', title: 'Naam', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'type', title: 'Type', type: 'string',
      options: { list: ['Partner', 'Sponsor', 'Supporter'], layout: 'radio' }, initialValue: 'Partner',
    }),
    defineField({ name: 'omschrijving', title: 'Omschrijving', type: 'string' }),
    defineField({ name: 'logo', title: 'Logo (optioneel)', type: 'image' }),
    defineField({ name: 'website', title: 'Website', type: 'url' }),
  ],
  preview: { select: { title: 'naam', subtitle: 'type', media: 'logo' } },
});

/* ---------- Programma (menukaart) ---------- */
const programma = defineType({
  name: 'programma',
  title: 'Menukaart',
  type: 'document',
  fields: [
    defineField({ name: 'naam', title: 'Naam', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'categorie', title: 'Categorie', type: 'string',
      options: { list: [
        { title: 'Meest geboekt', value: 'populair' },
        { title: 'Verhaal & keynote', value: 'verhalen' },
        { title: 'Optreden', value: 'optredens' },
        { title: 'Workshop & educatie', value: 'workshops' },
        { title: 'Extra beleving', value: 'extra' },
      ] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'desc', title: 'Omschrijving', type: 'text', rows: 3 }),
    defineField({ name: 'perfect', title: 'Perfect voor', type: 'string', description: 'Bijv. "festivals · scholen"' }),
    defineField({ name: 'dur', title: 'Duur', type: 'string' }),
    defineField({ name: 'price', title: 'Prijs', type: 'string' }),
    defineField({ name: 'badge', title: 'Badge tonen', type: 'boolean', initialValue: false }),
    defineField({ name: 'label', title: 'Badge-tekst', type: 'string', hidden: ({ parent }) => !parent?.badge }),
    defineField({ name: 'volgorde', title: 'Volgorde', type: 'number', initialValue: 50 }),
  ],
  orderings: [{ title: 'Volgorde', name: 'volgorde', by: [{ field: 'volgorde', direction: 'asc' }] }],
  preview: { select: { title: 'naam', subtitle: 'categorie' } },
});

/* ---------- Product (shop) ---------- */
const product = defineType({
  name: 'product',
  title: 'Shop',
  type: 'document',
  fields: [
    defineField({ name: 'naam', title: 'Naam', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'URL-slug', type: 'slug', options: { source: 'naam' } }),
    defineField({ name: 'prijs', title: 'Prijs (€)', type: 'number' }),
    defineField({ name: 'omschrijving', title: 'Omschrijving', type: 'text', rows: 3 }),
    defineField({ name: 'afbeelding', title: 'Afbeelding', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'beschikbaar', title: 'Beschikbaar', type: 'boolean', initialValue: true }),
  ],
  preview: { select: { title: 'naam', subtitle: 'prijs', media: 'afbeelding' } },
});

/* ---------- Galerijfoto (bewegende fotostrook) ---------- */
const galerijfoto = defineType({
  name: 'galerijfoto',
  title: 'Fotostrook',
  type: 'document',
  fields: [
    defineField({ name: 'afbeelding', title: 'Foto', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'bijschrift', title: 'Bijschrift (optioneel)', type: 'string', description: 'Verschijnt over de foto bij het zweven met de muis.' }),
    defineField({ name: 'volgorde', title: 'Volgorde', type: 'number', initialValue: 50 }),
  ],
  orderings: [{ title: 'Volgorde', name: 'volgorde', by: [{ field: 'volgorde', direction: 'asc' }] }],
  preview: { select: { title: 'bijschrift', media: 'afbeelding' }, prepare: ({ title, media }) => ({ title: title || 'Foto', media }) },
});

/* ---------- Paginakoppen (hero-beeld per pagina) ---------- */
const paginakop = defineType({
  name: 'paginakop',
  title: 'Paginakoppen',
  type: 'document',
  description: 'Het grote beeld bovenaan elke pagina.',
  fields: [
    defineField({
      name: 'pagina', title: 'Welke pagina', type: 'string', validation: (r) => r.required(),
      options: { list: [
        { title: 'De Stichting', value: 'de-stichting' },
        { title: 'De Leden', value: 'leden' },
        { title: 'De Gamelangroep', value: 'de-gamelan-groep' },
        { title: 'De Dansgroep', value: 'de-dansgroep' },
        { title: 'De Vrienden van', value: 'de-vrienden-van' },
        { title: 'Contact', value: 'contact' },
        { title: 'Steun ons', value: 'steun' },
        { title: 'Shop', value: 'shop' },
        { title: 'Menukaart', value: 'menukaart' },
        { title: 'Nieuws (overzicht)', value: 'nieuws' },
        { title: 'Magazine Suwara Jawa', value: 'suwara-jawa' },
        { title: "Video's", value: 'videos' },
        { title: 'Fotoalbums', value: 'albums' },
      ] },
    }),
    defineField({ name: 'afbeelding', title: 'Achtergrondfoto', type: 'image', options: { hotspot: true },
      description: 'Liggend beeld werkt het best. Sleep het bolletje naar het belangrijkste deel van de foto.' }),
    defineField({ name: 'titel', title: 'Titel (optioneel)', type: 'string',
      description: 'Laat leeg om de standaardtitel van de pagina te houden.' }),
    defineField({ name: 'tekst', title: 'Introtekst (optioneel)', type: 'text', rows: 3,
      description: 'Laat leeg om de standaardtekst te houden.' }),
    seoVeld,
  ],
  preview: { select: { title: 'pagina', media: 'afbeelding' } },
});

/* ---------- Magazine Suwara Jawa ---------- */
const magazine = defineType({
  name: 'magazine',
  title: 'Magazine',
  type: 'document',
  description: 'Edities van Suwara Jawa.',
  fields: [
    defineField({ name: 'titel', title: 'Titel van de editie', type: 'string', validation: (r) => r.required(),
      description: 'Bijv. "Editie 1 — Voorjaar 2026"' }),
    defineField({ name: 'nummer', title: 'Editienummer', type: 'number', description: 'Wordt gebruikt voor de volgorde.' }),
    defineField({ name: 'datum', title: 'Verschijningsdatum', type: 'date' }),
    defineField({ name: 'cover', title: 'Cover', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'omschrijving', title: 'Waar gaat deze editie over?', type: 'text', rows: 4 }),
    defineField({ name: 'leesUrl', title: 'Online lezen (link)', type: 'url',
      description: 'Link naar de online versie. Laat leeg als je hieronder een PDF uploadt.' }),
    defineField({ name: 'pdf', title: 'PDF (optioneel)', type: 'file',
      description: 'Upload de editie als PDF; bezoekers kunnen die openen of downloaden.' }),
    seoVeld,
  ],
  orderings: [{ title: 'Nieuwste eerst', name: 'nieuw', by: [{ field: 'nummer', direction: 'desc' }] }],
  preview: { select: { title: 'titel', subtitle: 'datum', media: 'cover' } },
});

/* ---------- Fotoalbum ---------- */
const album = defineType({
  name: 'album',
  title: 'Fotoalbums',
  type: 'document',
  description: 'Een selectie foto\'s per evenement. Upload bij voorkeur verkleinde foto\'s (max 2000px) — dat scheelt opslag en de site toont ze toch verkleind.',
  fields: [
    defineField({ name: 'titel', title: 'Titel', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'URL-slug', type: 'slug', options: { source: 'titel', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: 'datum', title: 'Datum van het evenement', type: 'date' }),
    defineField({ name: 'omschrijving', title: 'Korte omschrijving', type: 'text', rows: 3 }),
    defineField({ name: 'cover', title: 'Omslagfoto', type: 'image', options: { hotspot: true },
      description: 'Laat leeg om de eerste foto uit het album te gebruiken.' }),
    defineField({
      name: 'fotos', title: "Foto's", type: 'array',
      of: [{ type: 'image', options: { hotspot: true }, fields: [
        { name: 'bijschrift', title: 'Bijschrift', type: 'string' },
      ] }],
      options: { layout: 'grid' },
      description: 'Je kunt meerdere foto\'s tegelijk selecteren bij het uploaden.',
    }),
    defineField({ name: 'externeUrl', title: 'Link naar volledige galerij', type: 'url',
      description: 'Bijv. de Tyle-galerij met alle foto\'s. Verschijnt als knop onder het album.' }),
    defineField({ name: 'externeAantal', title: 'Aantal foto\'s in die galerij', type: 'number',
      description: 'Alleen voor de knoptekst, bijv. "Bekijk alle 556 foto\'s".' }),
    seoVeld,
  ],
  orderings: [{ title: 'Nieuwste eerst', name: 'datumDesc', by: [{ field: 'datum', direction: 'desc' }] }],
  preview: { select: { title: 'titel', subtitle: 'datum', media: 'cover' } },
});

/* ---------- Doneren (singleton) ---------- */
const doneren = defineType({
  name: 'doneren',
  title: 'Doneren',
  type: 'document',
  description: 'De donatiemogelijkheden op de Steun-pagina.',
  groups: [
    { name: 'algemeen', title: 'Algemeen', default: true },
    { name: 'bedragen', title: 'Bedragen' },
    { name: 'bank', title: 'Overschrijving' },
  ],
  fields: [
    defineField({ name: 'actief', title: 'Donatieblok tonen', type: 'boolean', initialValue: true, group: 'algemeen' }),
    defineField({ name: 'titel', title: 'Titel', type: 'string', group: 'algemeen' }),
    defineField({ name: 'tekst', title: 'Introtekst', type: 'text', rows: 3, group: 'algemeen' }),
    defineField({ name: 'bestemming', title: 'Waar gaat het geld naartoe?', type: 'text', rows: 3, group: 'algemeen',
      description: 'Kort en concreet, bijv. "Van €25 kopen we nieuwe snaren" — mensen geven meer als ze weten waarvoor.' }),

    defineField({
      name: 'bedragen', title: 'Eenmalige bedragen', type: 'array', group: 'bedragen',
      description: 'Elk bedrag krijgt een eigen knop. Maak in Stripe per bedrag een betaallink aan, of gebruik één link waarbij de donateur zelf het bedrag kiest.',
      of: [{
        type: 'object',
        fields: [
          { name: 'bedrag', title: 'Bedrag (€)', type: 'number', validation: (r: any) => r.required() },
          { name: 'url', title: 'Stripe-betaallink', type: 'url', validation: (r: any) => r.required() },
          { name: 'toelichting', title: 'Wat levert dit op? (optioneel)', type: 'string' },
        ],
        preview: { select: { title: 'bedrag', subtitle: 'toelichting' },
          prepare: ({ title, subtitle }: any) => ({ title: `€ ${title}`, subtitle }) },
      }],
    }),
    defineField({ name: 'vrijBedragUrl', title: 'Link voor een eigen bedrag', type: 'url', group: 'bedragen',
      description: 'Stripe-link waarbij de donateur zelf een bedrag invult.' }),

    defineField({ name: 'maandelijksUrl', title: 'Link voor maandelijkse donatie', type: 'url', group: 'bedragen',
      description: 'In Stripe aan te maken als terugkerende betaling (abonnement).' }),
    defineField({ name: 'maandelijksTekst', title: 'Tekst bij maandelijkse donatie', type: 'text', rows: 3, group: 'bedragen' }),

    defineField({ name: 'iban', title: 'IBAN', type: 'string', group: 'bank' }),
    defineField({ name: 'tenaamstelling', title: 'Ten name van', type: 'string', initialValue: 'Stichting Gema Rasa', group: 'bank' }),
    defineField({ name: 'bankTekst', title: 'Tekst bij overschrijving', type: 'text', rows: 2, group: 'bank' }),
  ],
  preview: { prepare: () => ({ title: 'Doneren' }) },
});

/* ---------- Binnengekomen berichten (contactformulier) ---------- */
const bericht = defineType({
  name: 'bericht',
  title: 'Berichten',
  type: 'document',
  // Alleen-lezen: deze documenten komen van de website, niet uit het Studio
  fields: [
    defineField({ name: 'naam', title: 'Naam', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'E-mailadres', type: 'string', readOnly: true }),
    defineField({ name: 'onderwerp', title: 'Onderwerp', type: 'string', readOnly: true }),
    defineField({ name: 'bericht', title: 'Bericht', type: 'text', rows: 6, readOnly: true }),
    defineField({ name: 'ontvangen', title: 'Ontvangen op', type: 'datetime', readOnly: true }),
    defineField({ name: 'afgehandeld', title: 'Afgehandeld', type: 'boolean', initialValue: false,
      description: 'Vink aan als dit bericht is beantwoord.' }),
  ],
  orderings: [{ title: 'Nieuwste eerst', name: 'nieuw', by: [{ field: 'ontvangen', direction: 'desc' }] }],
  preview: {
    select: { title: 'naam', subtitle: 'onderwerp', afgehandeld: 'afgehandeld' },
    prepare: ({ title, subtitle, afgehandeld }) => ({
      title: `${afgehandeld ? '✓ ' : ''}${title || 'Onbekend'}`,
      subtitle: subtitle || 'Geen onderwerp',
    }),
  },
});

/* ---------- Aanmeldingen (nieuwsbrief & vrijwilliger) ---------- */
const aanmelding = defineType({
  name: 'aanmelding',
  title: 'Aanmeldingen',
  type: 'document',
  fields: [
    defineField({ name: 'naam', title: 'Naam', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'E-mailadres', type: 'string', readOnly: true }),
    defineField({
      name: 'soort', title: 'Soort aanmelding', type: 'string', readOnly: true,
      options: { list: [
        { title: 'Nieuwsbrief', value: 'nieuwsbrief' },
        { title: 'Vrijwilliger / lid', value: 'vrijwilliger' },
      ] },
    }),
    defineField({ name: 'toelichting', title: 'Toelichting', type: 'text', rows: 4, readOnly: true,
      description: 'Waarmee wil deze persoon helpen / meespelen.' }),
    defineField({ name: 'toestemming', title: 'Toestemming gegeven', type: 'boolean', readOnly: true,
      description: 'AVG: heeft expliciet ingestemd met het ontvangen van e-mail.' }),
    defineField({ name: 'ontvangen', title: 'Ontvangen op', type: 'datetime', readOnly: true }),
    defineField({ name: 'verwerkt', title: 'Verwerkt', type: 'boolean', initialValue: false,
      description: 'Vink aan als deze persoon is toegevoegd aan de mailinglijst of benaderd is.' }),
  ],
  orderings: [{ title: 'Nieuwste eerst', name: 'nieuw', by: [{ field: 'ontvangen', direction: 'desc' }] }],
  preview: {
    select: { title: 'email', soort: 'soort', naam: 'naam', verwerkt: 'verwerkt' },
    prepare: ({ title, soort, naam, verwerkt }) => ({
      title: `${verwerkt ? '✓ ' : ''}${naam || title || 'Onbekend'}`,
      subtitle: soort === 'vrijwilliger' ? 'Vrijwilliger / lid' : 'Nieuwsbrief',
    }),
  },
});

export const schemaTypes = [
  homepage, doneren, paginakop, nieuws, evenement, lid, vriend, programma, product, galerijfoto, magazine, album,
  bericht, aanmelding,
];

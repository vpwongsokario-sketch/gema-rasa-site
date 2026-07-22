import { defineType, defineField } from 'sanity';

/* ---------- Homepage (singleton) ---------- */
const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: '🇳🇱 Hero', default: true },
    { name: 'productie', title: '🇳🇱 Voorstelling' },
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
      ] },
    }),
    defineField({ name: 'afbeelding', title: 'Achtergrondfoto', type: 'image', options: { hotspot: true },
      description: 'Liggend beeld werkt het best. Sleep het bolletje naar het belangrijkste deel van de foto.' }),
    defineField({ name: 'titel', title: 'Titel (optioneel)', type: 'string',
      description: 'Laat leeg om de standaardtitel van de pagina te houden.' }),
    defineField({ name: 'tekst', title: 'Introtekst (optioneel)', type: 'text', rows: 3,
      description: 'Laat leeg om de standaardtekst te houden.' }),
  ],
  preview: { select: { title: 'pagina', media: 'afbeelding' } },
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
  homepage, paginakop, nieuws, evenement, lid, vriend, programma, product, galerijfoto,
  bericht, aanmelding,
];

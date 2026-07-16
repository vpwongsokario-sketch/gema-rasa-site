import { defineType, defineField } from 'sanity';

/* ---------- Homepage (singleton) ---------- */
const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'productie', title: 'Uitgelichte voorstelling' },
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
  ],
  preview: { prepare: () => ({ title: 'Homepage' }) },
});

/* ---------- Nieuws ---------- */
const nieuws = defineType({
  name: 'nieuws',
  title: 'Nieuws',
  type: 'document',
  fields: [
    defineField({ name: 'titel', title: 'Titel', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'URL-slug', type: 'slug', options: { source: 'titel', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: 'categorie', title: 'Categorie', type: 'string', initialValue: 'Nieuws' }),
    defineField({ name: 'datum', title: 'Datum', type: 'date', initialValue: () => new Date().toISOString().slice(0, 10) }),
    defineField({ name: 'afbeelding', title: 'Afbeelding', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'intro', title: 'Samenvatting', type: 'text', rows: 3 }),
    defineField({ name: 'body', title: 'Volledige tekst', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }),
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
    defineField({ name: 'titel', title: 'Titel', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'datum', title: 'Datum', type: 'date', validation: (r) => r.required() }),
    defineField({ name: 'locatie', title: 'Locatie', type: 'string' }),
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
    defineField({ name: 'rol', title: 'Rol / instrument', type: 'string' }),
    defineField({
      name: 'groep', title: 'Groep', type: 'string',
      options: { list: [{ title: 'Bestuur', value: 'bestuur' }, { title: 'Gamelangroep', value: 'gamelan' }, { title: 'Vrijwilliger', value: 'vrijwilliger' }], layout: 'radio' },
      initialValue: 'gamelan',
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

export const schemaTypes = [homepage, nieuws, evenement, lid, vriend, programma, product];

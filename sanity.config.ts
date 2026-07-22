import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';

// Singletons (documenten waar er maar één van bestaat) — hier: de homepage
const singletons = [
  { type: 'homepage', title: 'Homepage', id: 'homepage' },
  { type: 'doneren', title: '💛 Doneren', id: 'doneren' },
];

export default defineConfig({
  name: 'gema-rasa',
  title: 'Stichting Gema Rasa',
  projectId: '6q1rydes',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Inhoud')
          .items([
            // Homepage als los, altijd-bewerkbaar document bovenaan
            ...singletons.map((s) =>
              S.listItem()
                .title(s.title)
                .id(s.id)
                .child(S.document().schemaType(s.type).documentId(s.id)),
            ),
            S.documentTypeListItem('paginakop').title('Paginakoppen (hero-beelden)'),
            S.divider(),
            // De overige collecties
            S.documentTypeListItem('nieuws').title('Nieuws'),
            S.documentTypeListItem('galerijfoto').title('Fotostrook'),
            S.documentTypeListItem('magazine').title('Magazine Suwara Jawa'),
            S.documentTypeListItem('album').title('Fotoalbums'),
            S.documentTypeListItem('evenement').title('Agenda'),
            S.documentTypeListItem('lid').title('Leden'),
            S.documentTypeListItem('vriend').title('Vrienden van'),
            S.documentTypeListItem('programma').title('Menukaart'),
            S.documentTypeListItem('product').title('Shop'),
            S.divider(),
            // Binnengekomen via de website (niet bewerkbaar, alleen inzien)
            S.documentTypeListItem('bericht').title('📥 Berichten'),
            S.documentTypeListItem('aanmelding').title('📥 Aanmeldingen'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    // Verberg 'nieuw document'-knop voor singletons
    templates: (templates) => templates.filter((t) => !singletons.some((s) => s.type === t.schemaType)),
  },
  document: {
    // Voorkom verwijderen/dupliceren van de homepage-singleton
    actions: (input, context) =>
      singletons.some((s) => s.id === context.documentId)
        ? input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
});

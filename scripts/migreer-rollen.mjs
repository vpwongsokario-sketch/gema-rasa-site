/**
 * Zet het oude veld 'groep' (één rol) om naar het nieuwe 'rollen' (meerdere).
 * Draai dit één keer; daarna kun je in de Studio per persoon rollen aanvinken.
 *
 * Gebruik:
 *   export SANITY_WRITE_TOKEN=jouw-token
 *   node scripts/migreer-rollen.mjs
 *
 * Het script raakt alleen mensen aan die nog géén 'rollen' hebben.
 */
const PROJECT = '6q1rydes';
const DATASET = 'production';
const TOKEN = process.env.SANITY_WRITE_TOKEN;

if (!TOKEN) {
  console.error('Geen SANITY_WRITE_TOKEN gevonden. Zet die eerst:');
  console.error('  export SANITY_WRITE_TOKEN=jouw-token');
  process.exit(1);
}

const query = encodeURIComponent(
  '*[_type == "lid" && !defined(rollen) && defined(groep)]{_id, naam, groep}',
);

const res = await fetch(
  `https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${query}`,
  { headers: { authorization: `Bearer ${TOKEN}` } },
);
const { result = [] } = await res.json();

if (!result.length) {
  console.log('Niets te migreren — alle leden hebben al rollen.');
  process.exit(0);
}

const mutations = result.map((d) => ({
  patch: { id: d._id, set: { rollen: [d.groep] } },
}));

const schrijf = await fetch(
  `https://${PROJECT}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`,
  {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations }),
  },
);

if (!schrijf.ok) {
  console.error('Mislukt:', await schrijf.text());
  process.exit(1);
}

console.log(`Klaar — ${result.length} leden bijgewerkt:`);
result.forEach((d) => console.log(`  ${d.naam} → ${d.groep}`));

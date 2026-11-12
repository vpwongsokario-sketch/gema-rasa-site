// Menukaart-items. Tijdelijk hier als data; wordt in stap 3 een Sanity-collectie
// zodat vrijwilligers programma's kunnen toevoegen/bewerken zonder code.
//
// De `slug` is de korte naam die in het webadres past. Hij bestaat zodat een
// kaart op de menukaart kan doorgeven welk programma iemand heeft aangeklikt:
// de knop verwijst naar /boeking/?programma=wayang-kulit, en het
// aanvraagformulier zet dat programma dan vast voor de bezoeker. Zonder dit
// zou iemand die net 'Wayang Kulit' heeft uitgekozen op een leeg formulier
// belanden en het opnieuw moeten uitleggen -- en daar haken mensen af.
//
// Verander een slug dus niet zomaar: hij staat in links die mensen al hebben
// gedeeld of gebookmarkt. Een nieuwe naam voor het programma mag, de slug mag
// gewoon blijven staan.
export const catName = {
  populair: 'Meest geboekt',
  verhalen: 'Verhaal & keynote',
  optredens: 'Optreden',
  workshops: 'Workshop & educatie',
  extra: 'Extra beleving',
};

export const filters = [
  { f: 'all', label: 'Alles' },
  { f: 'populair', label: 'Meest geboekt' },
  { f: 'verhalen', label: 'Verhalen & keynotes' },
  { f: 'optredens', label: 'Optredens' },
  { f: 'workshops', label: 'Workshops & educatie' },
  { f: 'extra', label: 'Extra beleving' },
];

export const programmas = [
  { cat: 'populair', name: 'Ceremoniële Opening + Gamelan', slug: 'ceremoniele-opening-gamelan', label: 'Meest geboekt', badge: true,
    desc: 'Muziek, ritueel en symboliek komen samen. Met live gamelan en traditionele gebaren wordt jouw evenement rustig maar krachtig geopend.',
    perfect: 'festivals · conferenties · openingen', dur: '± 15–25 min', price: 'vanaf €800' },
  { cat: 'populair', name: 'Lezing + Workshop', slug: 'lezing-workshop', label: 'Meest geboekt',
    desc: 'Eerst een inspirerend verhaal, gevolgd door een interactieve workshop waarin deelnemers zelf aan de slag gaan.',
    perfect: 'musea · scholen · community events', dur: '± 1,5 uur', price: 'vanaf €850' },
  { cat: 'populair', name: 'Complete Beleving', slug: 'complete-beleving', label: 'Aanrader', badge: true,
    desc: 'Een volledig programma waarin optreden, verhaal en interactie samenkomen. Voor wie het publiek echt wil meenemen in de cultuur.',
    perfect: 'dagprogramma’s · festivals · culturele events', dur: '± 2–2,5 uur', price: '€1100 – €1430' },
  { cat: 'verhalen', name: 'De Overtocht', slug: 'de-overtocht',
    desc: 'Een indringend verhaal over de reis van Java naar Suriname en Nederland, en hoe deze geschiedenis nog doorwerkt in identiteit en familie.',
    perfect: 'herdenkingen · educatie', dur: '30–45 min', price: '€440' },
  { cat: 'verhalen', name: 'De Stille Kracht van de Javaan', slug: 'de-stille-kracht-van-de-javaan',
    desc: 'Over de kracht van bescheidenheid en harmonie — en de keerzijde: jezelf soms onzichtbaar maken of aanpassen aan anderen.',
    perfect: 'diversiteit & inclusie · organisaties', dur: '30–45 min', price: '€440' },
  { cat: 'verhalen', name: 'Van Stilte naar Stem', slug: 'van-stilte-naar-stem',
    desc: 'Hoe de nieuwe generatie haar stem vindt en zich opnieuw verbindt met haar culturele roots via kunst en expressie.',
    perfect: 'jongeren · community events', dur: '30–45 min', price: '€440' },
  { cat: 'verhalen', name: 'Rituelen & Erfenis', slug: 'rituelen-en-erfenis',
    desc: 'Een verdiepende lezing over doorgegeven rituelen zoals sadjen, waarbij fysieke objecten het verhaal tastbaar maken.',
    perfect: 'kleine settings · verdieping', dur: '45 min', price: '€495' },
  { cat: 'verhalen', name: 'Gamelan Keynote', slug: 'gamelan-keynote',
    desc: 'Gamelan wordt niet alleen gespeeld maar uitgelegd als systeem van samenwerking, luisteren en balans binnen een groep.',
    perfect: 'bedrijven · teams · leiderschap', dur: '45 min', price: '€550' },
  { cat: 'verhalen', name: 'Javaanse Levenshouding Keynote', slug: 'javaanse-levenshouding-keynote',
    desc: 'Over rasa, rukun, sabar en narima — en hoe deze principes toepasbaar zijn in werk en dagelijks leven.',
    perfect: 'persoonlijke ontwikkeling · welzijn', dur: '45 min', price: '€550' },
  { cat: 'optredens', name: 'Jongeren Gamelan', slug: 'jongeren-gamelan',
    desc: 'Jonge muzikanten voeren traditionele gamelanmuziek uit met een frisse, eigentijdse energie.',
    perfect: 'festivals · openingen · brede doelgroepen', dur: '20 min', price: '€660' },
  { cat: 'optredens', name: 'Gamelan × Hiphop × Kendang', slug: 'gamelan-hiphop-kendang',
    desc: 'Traditionele gamelan ontmoet hiphopdans en percussie — oud en nieuw samen op het podium.',
    perfect: 'jong publiek · festivals', dur: '30 min', price: '€660' },
  { cat: 'optredens', name: 'Kuda Lumping (paardendans)', slug: 'kuda-lumping',
    desc: 'Een visueel sterk optreden met traditionele paardfiguren en ritmische muziek dat direct de aandacht trekt.',
    perfect: 'buitenevents · culturele dagen', dur: '20 min', price: '€660' },
  { cat: 'optredens', name: 'Wayang Kulit (schaduwspel)', slug: 'wayang-kulit',
    desc: 'Verhalen uitgebeeld met leren poppen en schaduwen, begeleid door live muziek. Betoverend en leerzaam.',
    perfect: 'educatie · culturele programmering', dur: '30 min', price: '€935' },
  { cat: 'optredens', name: 'Wayang Wong (dansdrama)', slug: 'wayang-wong',
    desc: 'Klassieke Javaanse dansvoorstelling waarin mythische verhalen worden uitgebeeld in traditionele kostuums.',
    perfect: 'theaters · grotere podia', dur: '20–30 min', price: '€935' },
  { cat: 'optredens', name: 'Ceremoniële Openingsact', slug: 'ceremoniele-openingsact',
    desc: 'Korte maar krachtige opening met muziek, beweging en symboliek die direct een bijzondere sfeer neerzet.',
    perfect: 'officiële openingen · ceremonies', dur: '10–15 min', price: '€440' },
  { cat: 'workshops', name: 'Gamelan Workshop', slug: 'gamelan-workshop',
    desc: 'Deelnemers spelen zelf gamelan en ervaren hoe muziek ontstaat door samenwerking. Verbindend en laagdrempelig.',
    perfect: 'groepen · scholen · teams', dur: '45 min', price: '€650' },
  { cat: 'workshops', name: 'Dansworkshop', slug: 'dansworkshop',
    desc: 'Kennismaking met de basis van Javaanse dans en beweging. Bewustwording van lichaam en expressie.',
    perfect: 'kleine groepen · families', dur: '30–45 min', price: '€650' },
  { cat: 'workshops', name: 'Storytelling / Lezing', slug: 'storytelling-lezing',
    desc: 'Toegankelijke presentatie over Javaanse geschiedenis, cultuur en migratie, aangepast aan het publiek.',
    perfect: 'educatie · musea', dur: '30 min', price: '€500' },
  { cat: 'workshops', name: 'Kinderprogramma — Spelen met Klanken', slug: 'kinderprogramma-spelen-met-klanken',
    desc: 'Kinderen maken spelenderwijs kennis met muziek, ritme en beweging. Plezier en ontdekking.',
    perfect: 'families · kinderprogramma’s', dur: '30 min', price: '€450' },
  { cat: 'workshops', name: 'Janur Kuning Workshop', slug: 'janur-kuning-workshop',
    desc: 'Maak traditionele decoraties van palmblad en leer over de betekenis ervan. Rustgevend, met tastbaar resultaat.',
    perfect: 'creatieve sessies · festivals', dur: '45–60 min', price: '€650' },
  { cat: 'workshops', name: 'Wayang Workshop — Maak je eigen schaduwpop', slug: 'wayang-workshop-schaduwpop',
    desc: 'Deelnemers maken hun eigen wayangpop van karton en brengen die tot leven achter een lichtbron.',
    perfect: 'scholen · musea · families', dur: '± 60–90 min', price: '€750' },
  { cat: 'workshops', name: 'Compleet Educatief Dagdeel', slug: 'compleet-educatief-dagdeel', label: 'Compleet', badge: true,
    desc: 'Optreden, verhaal en interactieve workshop in één zorgvuldig opgebouwd programma. Deelnemers ervaren cultuur actief.',
    perfect: 'scholen · musea · culturele instellingen', dur: '± 2–2,5 uur', price: '€1300 – €1650' },
  { cat: 'extra', name: 'Culturele Installatie', slug: 'culturele-installatie',
    desc: 'Een presentatie met instrumenten, objecten en visuele elementen die bezoekers zelfstandig kunnen ervaren.',
    perfect: 'doorlopende programma’s · tentoonstellingen', dur: 'doorlopend', price: 'vanaf €330' },
];

export const videos = [
  { yt: 'w0D9IK2gNYU', poster: '/assets/perf-wayang.jpg', kicker: 'Sfeerreel · klik om te spelen', title: 'Gema Rasa — een ervaring die bijblijft', big: true },
  { yt: 'w0D9IK2gNYU', poster: '/assets/perf-gamelan.jpg', kicker: 'Optreden', title: 'Gamelan' },
  { yt: 'w0D9IK2gNYU', poster: '/assets/perf2.jpg', kicker: 'Optreden', title: 'Kuda Lumping' },
  { yt: 'w0D9IK2gNYU', poster: '/assets/perf3.jpg', kicker: 'Schaduwspel', title: 'Wayang Kulit' },
  { yt: 'w0D9IK2gNYU', poster: '/assets/perf4.jpg', kicker: 'Workshop', title: 'Gamelan zelf spelen' },
];

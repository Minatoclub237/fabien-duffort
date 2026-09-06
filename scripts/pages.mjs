/* Génère la page portfolio et une page par projet.
   Lancé avant `vite dev` et `vite build` (voir package.json) : les fichiers
   doivent exister sur le disque pour que Vite les serve et les construise. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROJETS, SECTEURS } from '../src/projets.js';
import { agregats } from './cabinet.mjs';

const RACINE = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const e = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const TETE = (titre, desc, entree, extra = '') => `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${e(titre)}</title>
  <meta name="description" content="${e(desc)}" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%2354392E'/><text x='16' y='22' font-family='sans-serif' font-size='15' font-weight='700' fill='%23F2F0EE' text-anchor='middle'>FD</text></svg>" />
${extra}</head>
<body class="page">
<header class="nav nav--solid" id="nav">
  <a class="nav__brand" href="/">
    <span class="nav__mark">FD</span>
    <span class="nav__name">Fabien Duffort</span>
  </a>
  <nav class="nav__links">
    <a href="/cabinet/">Le cabinet</a>
    <a href="/#savoir-faire">Savoir-faire</a>
    <a href="/projets/">Projets</a>
    <a href="/#contact">Contact</a>
  </nav>
  <a class="btn btn--sm" href="/#contact"><span>Me contacter</span><i class="btn__arrow"></i></a>
</header>
<div class="curseur" id="curseur"><span>Voir</span></div>
`;

const PIED = `
<footer class="footer">
  <div class="wrap">
    <div class="footer__cols">
      <div class="footer__brand">
        <span class="nav__mark">FD</span>
        <p>Cabinet d'architecte d'intérieur &amp; designer.<br />Toulouse — Occitanie.</p>
      </div>
      <div>
        <h4>Navigation</h4>
        <a href="/cabinet/">Le cabinet</a><a href="/projets/">Tous les projets</a><a href="/#contact">Contact</a>
      </div>
      <div>
        <h4>Contact</h4>
        <a href="tel:+33661935426">+33 6 61 93 54 26</a>
        <a href="https://maps.app.goo.gl/xPREvm6N5rUHM2V18" target="_blank" rel="noopener">48 rue de Puymaurin<br />31400 Toulouse</a>
      </div>
    </div>
    <div class="footer__word"><span>DUFFORT</span></div>
  </div>
  <div class="footer__bar">
    <span>© <span id="year"></span> Fabien DUFFORT — Architecte d'intérieur &amp; Designer, Toulouse</span>
  </div>
</footer>
</body>
</html>
`;

const meta = (p) => [
  ['Maître d’ouvrage', p.mo], ['Mandataire', p.mandataire], ['Partenaires', p.partenaires],
  ['Mission', p.mission], ['Surface', p.surface], ['Montant', p.montant],
  ['Capacité', p.capacite], ['Label', p.label], ['Livraison', p.annee],
].filter(([, v]) => v);

/* ── page portfolio ─────────────────────────────────── */
const carte = (p, i) => `
    <article class="pj" data-secteur="${e(p.secteurKey)}" data-i="${i}">
      <a class="pj__lien" href="/projets/${p.slug}/" data-curseur>
        <span class="pj__media"><img src="/img/p/${p.img[0]}" alt="${e(p.titre)}" loading="lazy" /></span>
        <span class="pj__bas">
          <span class="pj__tag">${e(p.secteur)}${p.statut !== 'Livré' ? ' · ' + e(p.statut) : ''}</span>
          <span class="pj__titre">${e(p.titre)}</span>
          <span class="pj__lieu">${e([p.lieu, p.annee].filter(Boolean).join(' · '))}</span>
        </span>
      </a>
    </article>`;

const pagePortfolio = () => TETE(
  'Projets — Fabien DUFFORT | Architecte d’intérieur & Designer Toulouse',
  `${PROJETS.length} projets d'architecture intérieure et de design à Toulouse et en France : commerce, transport, santé, tertiaire, sport, enseignement, logement, signalétique.`,
  'portfolio',
  '  <script type="module" src="/src/portfolio.js"></script>\n',
) + `
<main class="pf">
  <section class="pf__tete">
    <div class="wrap">
      <span class="eyebrow"><i class="eyebrow__dot"></i> Projets</span>
      <h1 class="titre-geant" data-split>Quarante-neuf lieux,<br />onze programmes</h1>
      <p class="pf__lead">De la pharmacie de quartier au stade de 32 000 places, du salon d’aéroport au collège :
        chaque projet est mené du dessin à la conformité des travaux réalisés.</p>
    </div>
  </section>

  <section class="pf__filtres">
    <div class="wrap">
      <div class="chips" id="chips">
        <button class="chip is-on" data-f="tous">Tous <em id="cpt">${PROJETS.length}</em></button>
        ${SECTEURS.map((s) => {
          const k = PROJETS.find((p) => p.secteur === s).secteurKey;
          const n = PROJETS.filter((p) => p.secteur === s).length;
          return `<button class="chip" data-f="${k}">${e(s)} <em>${n}</em></button>`;
        }).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="pf__grille">
    <div class="wrap">
      <div class="grille" id="grille">${PROJETS.map(carte).join('')}
      </div>
      <p class="pf__vide" id="vide" hidden>Aucun projet dans ce programme.</p>
    </div>
  </section>
</main>
` + PIED;

/* ── page projet ────────────────────────────────────── */
const pageProjet = (p, suivant) => TETE(
  `${p.titre}${p.lieu ? ' — ' + p.lieu : ''} | Fabien DUFFORT, architecte d’intérieur Toulouse`,
  p.resume,
  'projet',
  `  <script type="module" src="/src/projet.js"></script>
  <script type="application/ld+json">
  ${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'CreativeWork',
    name: p.titre, about: p.secteur, dateCreated: p.annee, locationCreated: p.lieu || undefined,
    description: p.resume,
    creator: { '@type': 'Person', name: 'Fabien Duffort', jobTitle: 'Architecte d’intérieur & designer' },
  })}
  </script>\n`,
) + `
<main class="pr" data-slug="${p.slug}">
  <section class="pr__hero">
    <div class="pr__heroMedia"><img src="/img/p/${p.img[0]}" alt="${e(p.titre)}" fetchpriority="high" /></div>
    <div class="pr__heroVeil"></div>
    <div class="wrap pr__heroTexte">
      <span class="pill pill--light"><i class="dot"></i> ${e(p.secteur)}${p.statut !== 'Livré' ? ' — ' + e(p.statut) : ''}</span>
      <h1 class="titre-geant titre-geant--clair" data-split>${e(p.titre)}</h1>
      <p class="pr__lieu">${e([p.lieu, p.annee].filter(Boolean).join(' — '))}</p>
    </div>
    <div class="pr__scroll"><i></i> Défiler</div>
  </section>

  <section class="pr__infos">
    <div class="wrap pr__infosGrille">
      <p class="pr__resume" data-lignes>${e(p.resume)}</p>
      <dl class="pr__fiche">
        ${meta(p).map(([k, v]) => `<div><dt>${e(k)}</dt><dd>${e(v)}</dd></div>`).join('\n        ')}
      </dl>
    </div>
  </section>

  ${p.img.length > 2 ? `<section class="pr__piste">
    <div class="pr__pisteVue"><div class="pr__pisteRail" id="rail">
      ${p.img.slice(1).map((im, i) => `<figure class="pr__vign" data-i="${i}"><img src="/img/p/${im}" alt="" loading="lazy" /></figure>`).join('\n      ')}
    </div></div>
  </section>` : `<section class="pr__duo"><div class="wrap">
      ${p.img.slice(1).map((im) => `<figure class="pr__fig"><img src="/img/p/${im}" alt="" loading="lazy" /></figure>`).join('\n      ')}
    </div></section>`}

  <a class="pr__suivant" href="/projets/${suivant.slug}/" data-curseur>
    <div class="pr__suivantMedia"><img src="/img/p/${suivant.img[0]}" alt="" loading="lazy" /></div>
    <div class="wrap pr__suivantTexte">
      <span class="eyebrow">— Projet suivant</span>
      <h2 class="titre-geant titre-geant--clair">${e(suivant.titre)}</h2>
      <span class="pr__suivantLieu">${e([suivant.lieu, suivant.secteur].filter(Boolean).join(' · '))}</span>
    </div>
  </a>
</main>
` + PIED;

/* ── page « Le cabinet » ────────────────────────────── */
const A = agregats();

const pageCabinet = () => TETE(
  'Le cabinet — Fabien DUFFORT | Architecte d’intérieur & Designer Toulouse',
  `Vingt-cinq ans de projets, ${A.clients.length} maîtres d'ouvrage, ${A.concours.length} concours. Design d'espaces, mobilier spécifique, signalétique et space planning à Toulouse.`,
  'cabinet',
  '  <script type="module" src="/src/cabinet.js"></script>\n',
) + `
<main class="cb">
  <section class="cb__hero">
    <div class="wrap">
      <span class="eyebrow"><i class="eyebrow__dot"></i> Le cabinet</span>
      <h1 class="titre-geant" data-split>De ${A.de} à ${A.a},<br />sans changer de méthode</h1>
    </div>
    <div class="wrap cb__manifeste">
      <p data-mots>Dessiner un lieu, c’est d’abord comprendre comment on y entre, où l’on attend,
        ce que l’on cherche du regard. Le reste — la matière, la couleur, le mobilier, la lettre
        d’un panneau — vient répondre à ça. C’est vrai pour un stade de trente mille places
        comme pour une officine de quartier.</p>
    </div>
  </section>

  <section class="cb__chiffres">
    <div class="wrap cb__chiffresGrille">
      ${[[A.total, 'projets référencés'], [A.programmes, 'programmes'],
         [A.clients.length, 'maîtres d’ouvrage'], [A.partenaires.length, 'partenaires d’études'],
         [A.a - A.de, 'ans de pratique']]
        .map(([n, l]) => `<div class="cb__chiffre"><strong data-n="${n}">0</strong><span>${l}</span></div>`).join('\n      ')}
    </div>
  </section>

  <section class="cb__clients" id="clients">
    <div class="wrap">
      <span class="eyebrow">— Maîtres d’ouvrage</span>
      <h2 class="titre-moyen">Ils ont confié leurs lieux au projet</h2>
    </div>
    <div class="cb__liste" id="listeClients">
      ${A.clients.map((c, i) => `<a class="cb__ligne" href="/projets/${c.slug}/" data-img="/img/p/${c.img}" data-curseur>
        <span class="cb__no">${String(i + 1).padStart(2, '0')}</span>
        <span class="cb__nom">${e(c.nom)}</span>
        <span class="cb__n">${c.n} projet${c.n > 1 ? 's' : ''}</span>
      </a>`).join('\n      ')}
    </div>
    <figure class="cb__flotte" id="flotte"><img alt="" /></figure>
  </section>

  <section class="cb__concours">
    <div class="wrap">
      <span class="eyebrow">— Concours</span>
      <h2 class="titre-moyen">${A.concours.length} concours, ${A.laureats} remportés</h2>
      <div class="cb__cc">
        ${A.concours.map((p) => `<a class="cb__ccLigne${/Lauréat/.test(p.statut) ? ' is-laureat' : ''}" href="/projets/${p.slug}/" data-curseur>
          <span class="cb__ccAn">${e((String(p.annee || '').match(/\d{4}/) || ['—'])[0])}</span>
          <span class="cb__ccNom">${e(p.titre)}</span>
          <span class="cb__ccMo">${e(p.mo || '')}</span>
          <span class="cb__ccSt">${e(p.statut)}</span>
        </a>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="cb__part">
    <div class="wrap"><span class="eyebrow">— Partenaires d’études</span></div>
    <div class="cb__ruban" data-sens="1"><div class="cb__rubanRail">${
      A.partenaires.filter((_, i) => i % 2 === 0).map((p) => `<span>${e(p.nom)}</span>`).join('')
    }</div></div>
    <div class="cb__ruban" data-sens="-1"><div class="cb__rubanRail">${
      A.partenaires.filter((_, i) => i % 2 === 1).map((p) => `<span>${e(p.nom)}</span>`).join('')
    }</div></div>
  </section>

  <section class="cb__geo">
    <div class="wrap">
      <span class="eyebrow">— Où j’interviens</span>
      <h2 class="titre-moyen">${A.villes.length} villes, un ancrage</h2>
      <div class="cb__villes">
        ${A.villes.map((v) => `<span class="cb__ville" data-p="${v.n}"><em>${e(v.nom)}</em><i>${v.n}</i></span>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="cb__labels">
    <div class="wrap">
      <span class="eyebrow">— Démarches &amp; méthodes</span>
      <div class="cb__lb">
        ${[['HQE', 'Haute qualité environnementale', 'Les Terrasses de Badiou et le bâtiment de la direction des ressources humaines des Armées ont été menés sous label HQE.'],
           ['BREEAM', 'Very Good', 'L’extension du mail de Pau-Lescar a été conduite en démarche environnementale BREEAM Very Good.'],
           ['BIM', 'Maquette numérique', 'Méthodologie BIM sur les opérations de conception-réalisation, du logement social au bâtiment tertiaire d’État.'],
           ['MOP', 'Loi maîtrise d’ouvrage publique', 'Missions conduites dans le cadre réglementaire de la commande publique, de la faisabilité à la réception.']]
          .map(([t, s, d]) => `<article class="cb__lbCarte" data-tilt>
          <strong>${t}</strong><span>${s}</span><p>${d}</p>
        </article>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="cb__fin">
    <div class="wrap">
      <h2 class="titre-geant" data-split>Un lieu à dessiner ?</h2>
      <div class="cb__finCta">
        <a class="btn btn--lg" href="tel:+33661935426"><span>06 61 93 54 26</span><i class="btn__arrow"></i></a>
        <a class="btn btn--ghost btn--lg" href="/projets/"><span>Voir les 49 projets</span><i class="btn__arrow"></i></a>
      </div>
    </div>
  </section>
</main>
` + PIED;

/* ── écriture ───────────────────────────────────────── */
fs.mkdirSync(`${RACINE}/cabinet`, { recursive: true });
fs.writeFileSync(`${RACINE}/cabinet/index.html`, pageCabinet());
fs.mkdirSync(`${RACINE}/projets`, { recursive: true });
fs.writeFileSync(`${RACINE}/projets/index.html`, pagePortfolio());
PROJETS.forEach((p, i) => {
  const dir = `${RACINE}/projets/${p.slug}`;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/index.html`, pageProjet(p, PROJETS[(i + 1) % PROJETS.length]));
});
console.log(`${PROJETS.length + 1} pages générées dans /projets`);

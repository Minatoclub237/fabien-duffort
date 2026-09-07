/* La feuille de style et les polices sont déclarées dans le <head> de
   index.html, pas importées ici : sinon la page s'affiche en texte brut
   tant que ce module n'est pas chargé. */
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktop = () => window.innerWidth > 860;

/* ══════════════════════════════════════════
   1. Contenu injecté
   ══════════════════════════════════════════ */
const SECTEURS = [
  { k: 'commerce',     n: 'Commerce',      img: 'commerce-1' },
  { k: 'transport',    n: 'Transport',     img: 'transport-4' },
  { k: 'sante',        n: 'Santé',         img: 'sante-5' },
  { k: 'tertiaire',    n: 'Tertiaire',     img: 'tertiaire-5' },
  { k: 'culture',      n: 'Culture',       img: 'culture-2' },
  { k: 'enseignement', n: 'Enseignement',  img: 'enseignement-4' },
  { k: 'logement',     n: 'Logement',      img: 'logement-3' },
  { k: 'sport',        n: 'Sport',         img: 'sport-6' },
  { k: 'design',       n: 'Design mobilier', img: 'design-2' },
  { k: 'signaletique', n: 'Signalétique',  img: 'signaletique-6' },
  { k: 'urbanisme',    n: 'Urbanisme',     img: 'urbanisme-2' },
];

/* Les huit prestations nommées dans les fiches, avec le vocabulaire de mission
   d’origine : FAISA, ESQ, AVP, PRO, DET, OPR. */
const MISSIONS = [
  {
    "img": "design-2",
    "label": "Étude",
    "phase": "FAISA · ESQ",
    "titre": "Faisabilité & diagnostic",
    "pts": [
      "Relevé et analyse de l’existant",
      "Scénarios d’aménagement",
      "Estimation d’enveloppe",
      "Note de faisabilité illustrée"
    ]
  },
  {
    "img": "tertiaire-5",
    "label": "Conception",
    "phase": "AVP · PRO",
    "titre": "Aménagement & space planning",
    "pts": [
      "Programmation des surfaces",
      "Plans d’aménagement",
      "Définition des espaces d’accueil",
      "Dossier d’avant-projet"
    ]
  },
  {
    "img": "transport-6",
    "label": "Conception",
    "phase": "Design",
    "titre": "Mobilier spécifique",
    "pts": [
      "Dessin du mobilier sur mesure",
      "Choix des matériaux",
      "Suivi des études de fabrication",
      "Banques d’accueil et agencements"
    ]
  },
  {
    "img": "design-3",
    "label": "Conception",
    "phase": "Prototype",
    "titre": "Prototypage & mise au point",
    "pts": [
      "Fabrication d’un prototype",
      "Essais en situation",
      "Corrections avant série",
      "Luminaires et pièces uniques"
    ]
  },
  {
    "img": "enseignement-4",
    "label": "Conception",
    "phase": "Étude",
    "titre": "Étude chromatique",
    "pts": [
      "Palette par service et par usage",
      "Repérage des circulations",
      "Nuanciers et calepinage",
      "Applications murs, sols, mobilier"
    ]
  },
  {
    "img": "signaletique-6",
    "label": "Conception",
    "phase": "Étude",
    "titre": "Signalétique",
    "pts": [
      "Schéma directeur d’orientation",
      "Design des supports",
      "Signalétique événementielle",
      "Suivi de fabrication et pose"
    ]
  },
  {
    "img": "tertiaire-1",
    "label": "Représentation",
    "phase": "3D",
    "titre": "Représentation 3D",
    "pts": [
      "Vues d’ambiance",
      "Images de concours",
      "Validation des volumes",
      "Support de décision maître d’ouvrage"
    ]
  },
  {
    "img": "sante-6",
    "label": "Chantier",
    "phase": "DET · OPR",
    "titre": "Direction & suivi des études",
    "pts": [
      "Pilotage des études",
      "Coordination des partenaires",
      "Visites de chantier",
      "Conformité architecturale des travaux"
    ]
  }
];

/* Avis Google réels de Fabien Duffort, repris tels quels.
   Fiche : https://maps.app.goo.gl/xPREvm6N5rUHM2V18 */
const GOOGLE_URL = 'https://maps.app.goo.gl/xPREvm6N5rUHM2V18';

const AVIS = [
  { nom: 'Ingo D', profil: '1 avis', quand: 'il y a 2 mois', visite: 'Visité en juin', texte:
    "Une expérience tout simplement exceptionnelle ! Je n'aurais jamais imaginé qu'un projet avec un architecte puisse se dérouler aussi parfaitement. Du premier rendez-vous jusqu'à la livraison, tout a été irréprochable : écoute, professionnalisme, créativité et réactivité. Chaque détail a été pensé avec soin, et le résultat dépasse largement toutes mes attentes. On sent une véritable passion pour le métier et une volonté de satisfaire le client à 100 %. C'est sans aucun doute le meilleur service que j'aie reçu de toute ma vie. Je recommande les yeux fermés à toute personne qui recherche l'excellence. Un immense merci pour ce travail remarquable !" },
  { nom: 'Geraldine Laborie', profil: '8 avis · 1 photo', quand: 'il y a un mois', visite: 'Visité en juillet', texte:
    "Je recommande à 100 % ! Très à l'écoute, professionnel et créatif. Un vrai plaisir de travailler avec Fabien !" },
  { nom: 'Thierry Landi', profil: '3 avis', quand: 'il y a 2 mois', visite: 'Visité en juin', texte:
    "Un architecte d'intérieur très professionnel, installé à Toulouse. Une qualité d'écoute très appréciable pour arriver à une conception des aménagements et design qui m'a donné entière satisfaction. À recommander sans modération !" },
  { nom: 'Franck Arnal', profil: '2 avis · 1 photo', quand: 'il y a 2 mois', visite: 'Visité en juin', texte:
    "Un vrai professionnel avec un souci du détail et de la finition, sans parler de sa créativité qui nous pousse à grandir à ses côtés. Un plaisir de travailler en collaboration avec Fabien. Faites-en l'expérience, vous ne serez pas déçu !" },
  { nom: 'Cédric', profil: '4 avis', quand: 'il y a 2 mois', visite: 'Visité en avril 2024', texte:
    "Fabien a su dessiner et réaliser ce que je recherchais pour la rénovation de la maison. Il a su être très disponible et à l'écoute. Je recommande fortement les services de Fabien pour de la création ou de la rénovation." },
  { nom: 'Paul Burguière', profil: '3 avis', quand: 'il y a 2 semaines', visite: 'Visité en août', nouveau: true, texte:
    "Expériences diverses toutes particulièrement positives. Les grandes qualités d'écoute, de créativité et de rigueur sont propices à une collaboration enthousiasmante, efficace et des projets pleinement réussis, de la conception à la livraison. Relations constructives avec l'ensemble des acteurs des projets." },
  { nom: 'Béatrice Giuglardo', profil: '9 avis', quand: 'il y a 2 semaines', visite: 'Visité en août', nouveau: true, texte:
    "J'ai déjà eu l'occasion de collaborer à plusieurs reprises avec Fabien, et cela a toujours été un vrai plaisir. À l'écoute, créatif et fort d'une solide expérience acquise sur des sujets très variés, il sait apporter des réponses pertinentes et adaptées à chaque projet. Je ne peux que le recommander chaleureusement à Toulouse !" },
  { nom: 'Benoît Laborie', profil: '1 avis', quand: 'il y a un mois', visite: 'Visité en août', texte:
    "Très bonnes idées de design et de conception pour mon projet de rénovation à Barcelone. Créatif et à l'écoute de mes besoins, avec un nouvel angle apporté sur différents sujets. Et de la polyvalence." },
  { nom: 'S00999 SSX', profil: 'Local Guide · 17 avis', quand: 'il y a un mois', visite: 'Visité en juillet 2025', texte:
    "J'ai eu l'occasion de collaborer avec Fabien sur plusieurs projets et j'ai toujours apprécié son professionnalisme, sa disponibilité et la qualité de son travail. Il est à l'écoute, force de proposition et sait parfaitement concilier les contraintes techniques avec une vraie sensibilité au design. Son approche de la conception et son suivi de chantier sont rigoureux, ce qui permet d'aborder les projets avec confiance. Je recommande vivement Fabien à toute personne recherchant un architecte d'intérieur à Toulouse pour un projet de rénovation, d'aménagement ou de commerce." },
];


const TICKER = ['Design d\'espaces', 'Mobilier spécifique', 'Signalétique', 'Étude chromatique',
  'Space planning', 'Suivi des études', 'Prototype', 'Aménagement'];

const svcTrack = document.getElementById('svcTrack');
svcTrack.innerHTML = SECTEURS.map((s) => `
  <article class="svc">
    <figure class="svc__media"><img src="/img/${s.img}.webp" alt="${s.n}" loading="lazy" /></figure>
    <div class="svc__foot"><span class="svc__name">${s.n}</span><span class="svc__plus"></span></div>
  </article>`).join('');

document.getElementById('mTrack').innerHTML = MISSIONS.map((m) => `
  <article class="mcard">
    <figure class="mcard__media"><img src="/img/${m.img}.webp" alt="" loading="lazy" /></figure>
    <div class="mcard__body">
      <span class="mcard__label">${m.label}</span>
      <span class="mcard__phase">${m.phase}</span>
      <h3>${m.titre}</h3>
      <ul class="mcard__list">${m.pts.map((p) => `<li>${p}</li>`).join('')}</ul>
      <a class="btn" href="#contact"><span>Demander un devis</span><i class="btn__arrow"></i></a>
    </div>
  </article>`).join('');

const etoiles = '<span class="stars" aria-hidden="true">'
  + '<svg viewBox="0 0 20 20"><path d="m10 1.6 2.5 5.4 5.9.7-4.4 4 1.2 5.8L10 14.6 4.8 17.5 6 11.7 1.6 7.7l5.9-.7z"/></svg>'.repeat(5)
  + '</span>';

const carteAvis = (a) => `
  <article class="tcard">
    <div class="tcard__top">
      ${etoiles}<span class="tcard__note">5,0 / 5</span>
    </div>
    <p class="tcard__quote">${a.texte}</p>
    <a class="tcard__foot" href="${GOOGLE_URL}" target="_blank" rel="noopener">
      <span class="tcard__ava" aria-hidden="true">${a.nom.trim()[0].toUpperCase()}<i class="gbadge">G</i></span>
      <span class="tcard__who">
        <strong>${a.nom}${a.nouveau ? ' <em class="tag-new">Nouveau</em>' : ''}</strong>
        <span>${a.profil} · ${a.quand}</span>
      </span>
    </a>
  </article>`;

document.getElementById('temoins1').innerHTML = AVIS.slice(0, 5).map(carteAvis).join('');
document.getElementById('temoins2').innerHTML = AVIS.slice(5).concat(AVIS.slice(0, 1)).map(carteAvis).join('');

const tickerRow = document.getElementById('ticker');
tickerRow.innerHTML = [...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t) => `<span>${t}</span>`).join('');

document.getElementById('year').textContent = new Date().getFullYear();

/* ══════════════════════════════════════════
   2. Défilement fluide (natif, jamais capturé)
   ══════════════════════════════════════════ */
/* Profil mesuré sur la vidéo (deltas de scroll par pas de 100 ms, après la
   dernière impulsion de molette) : 40 → 20 → 10 → 5 → 2 → 1 → 0.
   Le reste est divisé par deux tous les 100 ms : demi-vie = 100 ms.
   Avec l'easing exponentiel de Lenis, la fraction restante vaut 2^(-10t/d),
   donc le ratio sur 100 ms est 2^(-1/d) ; ratio 0,5 ⇒ d = 1,0.
   Vérifié en lisant scrollY toutes les 100 ms sur ce site. */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ duration: 1.0, smoothWheel: true, touchMultiplier: 1.6 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const el = document.querySelector(a.getAttribute('href'));
    if (!el) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(el, { offset: -70 });
    else el.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════════
   3. Entrée du hero
   ══════════════════════════════════════════ */
const heroImg = document.querySelector('.hero__media img');

if (!reduced) {
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro
    .to('[data-hero="1"]', { opacity: 1, y: 0, duration: 1, startAt: { y: 16 } }, 0.15)
    .to('[data-hero="2"], [data-hero="3"]', { opacity: 1, duration: 0.01 }, 0.25)
    .fromTo('.hero__title .line > span',
      { yPercent: 106 },
      { yPercent: 0, duration: 1.25, stagger: 0.09 }, 0.25)
    .to('[data-hero="4"]', { opacity: 1, y: 0, duration: 1, startAt: { y: 18 } }, 0.62)
    .to('[data-hero="5"]', { opacity: 1, y: 0, duration: 1, startAt: { y: 18 } }, 0.74)
    .to('[data-hero="6"]', { opacity: 1, duration: 0.9 }, 0.95);

  // Ken Burns lent et continu sur l'image du hero
  gsap.to(heroImg, { scale: 1.09, duration: 22, ease: 'none', repeat: -1, yoyo: true });

  // parallaxe : le contenu monte et s'efface pendant que la section suivante recouvre
  gsap.to('.hero__inner', {
    yPercent: -22, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero-wrap', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero__scroll', {
    opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero-wrap', start: 'top top', end: '25% top', scrub: true },
  });
  gsap.to('.hero__veil', {
    opacity: 1.35, ease: 'none',
    scrollTrigger: { trigger: '.hero-wrap', start: 'top top', end: 'bottom top', scrub: true },
  });
} else {
  gsap.set('[data-hero]', { opacity: 1 });
}

/* ══════════════════════════════════════════
   4. Barre de navigation
   ══════════════════════════════════════════ */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  trigger: '.hero-wrap',
  start: 'bottom 90px',
  onEnter: () => nav.classList.add('nav--solid'),
  onLeaveBack: () => nav.classList.remove('nav--solid'),
});

/* ══════════════════════════════════════════
   5. Contenu des sections : AUCUNE animation d'entrée
   ══════════════════════════════════════════

   Mesuré image par image sur la vidéo de référence, sections « projets »,
   « work process », « témoignages », « articles », « à propos », « missions » :

   · positions x des images : figées (petite 279-346, grande 351-522 — 30 fps,
     aucune frame ne s'écarte) → pas de glissement latéral ;
   · largeurs et hauteurs : figées (67×80 et 171×166) → pas d'échelle, pas de
     volet qui s'ouvre ;
   · luminance / écart-type d'une image pendant toute son entrée :
     171,3 → 171,8 et 33,0 → 32,8 → pas de fondu, pleine opacité d'emblée ;
   · déplacement de chaque bloc = déplacement du scroll, au pixel près
     → pas de parallaxe, pas de décalage d'entrée ;
   · scroll à 0 pendant 1,3 s (23,4 → 24,7 s) : blocs strictement immobiles
     → rien ne s'anime tout seul.

   Ce qui donne l'impression de « cartes qui apparaissent » dans la vidéo est
   le défilement inertiel lui-même (§2), pas une animation d'élément.
   On ne rajoute donc rien ici.
   ══════════════════════════════════════════ */

document.querySelectorAll('.stat__num').forEach((el) => {
  el.textContent = el.dataset.count + (el.dataset.suffix || '');
});

/* ══════════════════════════════════════════
   7. Savoir-faire : piste horizontale épinglée
   ══════════════════════════════════════════ */
let svcST = null;
function buildServices() {
  if (svcST) { svcST.kill(); svcST = null; gsap.set(svcTrack, { x: 0 }); }
  if (reduced || !isDesktop()) return;

  const distance = () => Math.max(0, svcTrack.scrollWidth - window.innerWidth);

  const tween = gsap.to(svcTrack, {
    x: () => -distance(), ease: 'none',
    scrollTrigger: {
      trigger: '.services',
      start: 'top top',
      end: () => '+=' + (distance() + window.innerHeight * 0.35),
      pin: true,
      scrub: 0.7,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  svcST = tween.scrollTrigger;
}
buildServices();

/* ══════════════════════════════════════════
   8. Carrousel des missions
   ══════════════════════════════════════════ */
(() => {
  const track = document.getElementById('mTrack');
  const prev = document.getElementById('mPrev');
  const next = document.getElementById('mNext');
  let index = 0;

  const step = () => {
    const card = track.querySelector('.mcard');
    return card ? card.offsetWidth + 14 : 320;
  };
  const maxIndex = () => {
    const visible = Math.max(1, Math.floor(track.parentElement.offsetWidth / step()));
    return Math.max(0, track.children.length - visible);
  };
  const apply = () => {
    index = Math.min(index, maxIndex());
    track.style.transform = `translate3d(${-index * step()}px,0,0)`;
    prev.disabled = index === 0;
    next.disabled = index >= maxIndex();
  };
  prev.addEventListener('click', () => { index = Math.max(0, index - 1); apply(); });
  next.addEventListener('click', () => { index = Math.min(maxIndex(), index + 1); apply(); });
  window.addEventListener('resize', apply);
  apply();
})();

/* ══════════════════════════════════════════
   9. Comparateur étude / réalisation
   ══════════════════════════════════════════ */
(() => {
  const box = document.getElementById('compare');
  const clip = box.querySelector('.compare__clip');
  const handle = box.querySelector('.compare__handle');
  let target = 50, current = 50, raf = null;

  const draw = () => {
    current += (target - current) * 0.14;
    clip.style.width = current + '%';
    handle.style.left = current + '%';
    if (Math.abs(target - current) > 0.05) raf = requestAnimationFrame(draw);
    else raf = null;
  };
  const set = (clientX) => {
    const r = box.getBoundingClientRect();
    target = Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100));
    if (!raf) raf = requestAnimationFrame(draw);
  };

  box.addEventListener('pointermove', (e) => set(e.clientX));
  box.addEventListener('pointerdown', (e) => { box.setPointerCapture(e.pointerId); set(e.clientX); });
  box.addEventListener('pointerleave', () => {
    target = 50;
    if (!raf) raf = requestAnimationFrame(draw);
  });
  // Pas de balayage automatique : dans la vidéo, le volet ne bouge que sous le
  // curseur (18,2 → 21,5 s, le pointeur est visible sur chaque frame).
})();

/* ══════════════════════════════════════════
   10. Bandeau défilant + mot du pied de page
   ══════════════════════════════════════════ */
if (!reduced) {
  const row = document.getElementById('ticker');
  const loop = gsap.to(row, {
    xPercent: -50, duration: 34, ease: 'none', repeat: -1,
    modifiers: { xPercent: gsap.utils.unitize((x) => parseFloat(x) % 50) },
  });

  // le défilement de page oriente et accélère le bandeau
  ScrollTrigger.create({
    onUpdate: (self) => {
      const boost = Math.min(4, 1 + Math.abs(self.getVelocity()) / 1600);
      loop.timeScale(self.direction * boost);
      gsap.to(loop, { timeScale: self.direction, duration: 1.1, ease: 'power2.out', overwrite: true });
    },
  });

  /* Avis : les deux rangées glissent horizontalement, en sens opposés, au fil
     du défilement. Mesuré : à l'arrêt rien ne bouge (0,00 px/frame, erreur
     0,01-0,31), ce n'est donc pas un défilement automatique. Le sens et
     l'amplitude exacts ne sont pas mesurables sur une vidéo de 736 px de large. */
  gsap.utils.toArray('.temoins__row').forEach((row, i) => {
    const track = row.querySelector('.temoins__track');
    const sens = i % 2 === 0 ? 1 : -1;
    gsap.fromTo(track, { x: 110 * sens }, {
      x: -110 * sens, ease: 'none',
      scrollTrigger: { trigger: '.temoins', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  gsap.fromTo('.footer__word span',
    { xPercent: -6 },
    {
      xPercent: 4, ease: 'none',
      scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true },
    });
}

/* ══════════════════════════════════════════
   11. Recalculs
   ══════════════════════════════════════════ */
let rt;
window.addEventListener('resize', () => {
  clearTimeout(rt);
  rt = setTimeout(() => { buildServices(); ScrollTrigger.refresh(); }, 200);
});

document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());

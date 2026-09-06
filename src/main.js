import '@fontsource-variable/urbanist';
import '@fontsource-variable/inter';
import './style.css';

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

const MISSIONS = [
  {
    img: 'design-2', label: 'Mission courte', phase: 'Faisabilité',
    titre: 'Diagnostic & étude de faisabilité',
    pts: ['Relevé et analyse de l\'existant', 'Scénarios d\'aménagement', 'Estimation d\'enveloppe', 'Note de faisabilité illustrée'],
  },
  {
    img: 'tertiaire-5', label: 'Mission cadre', phase: 'AVP → PRO',
    titre: 'Aménagement & space planning',
    pts: ['Programmation des surfaces', 'Plans d\'aménagement', 'Étude chromatique', 'Représentation 3D'],
  },
  {
    img: 'transport-6', label: 'Mission spécifique', phase: 'Design',
    titre: 'Mobilier spécifique & prototype',
    pts: ['Dessin du mobilier', 'Choix des matériaux', 'Suivi des études de fabrication', 'Prototype et mise au point'],
  },
  {
    img: 'signaletique-6', label: 'Mission complète', phase: 'DET → OPR',
    titre: 'Direction & suivi des études',
    pts: ['Pilotage des études', 'Coordination des partenaires', 'Visites de chantier', 'Conformité architecturale'],
  },
];

const CLIENTS = [
  { n: 'Airbus', r: 'Space planning, ligne d\'assemblage A321', t: 'Blagnac' },
  { n: 'Aéroport Toulouse-Blagnac', r: 'Salon, zone commerciale, signalétique', t: '2004 — 2019' },
  { n: 'Klépierre', r: 'Rénovation de mails commerciaux', t: 'Portet · Blagnac' },
  { n: 'Toulouse Football Club', r: 'Extension sud du Stadium, vestiaires', t: '2006 · 2022' },
  { n: 'Ville de Toulouse', r: 'Projet urbain Garonne — diagnostic', t: 'Urbanisme' },
  { n: 'Toulouse Métropole', r: 'Signalétique du Quai des Savoirs', t: '2020' },
  { n: 'Carrefour Property & Carmila', r: 'Extension du mail de Pau-Lescar', t: 'Lauréat 2017' },
  { n: 'Institut Universitaire du Cancer', r: 'Mobilier, foyer et terrasse', t: 'Oncopôle' },
  { n: 'Région Occitanie', r: 'Lycée Nelson Mandela — Pibrac', t: '13 500 m²' },
  { n: 'Habitat Toulouse', r: 'Les Terrasses de Badiou — 94 logements', t: 'HQE · BIM' },
  { n: 'Mairie de Blagnac', r: 'Musée Aeroscopia', t: 'Lauréat 2015' },
  { n: 'Porcelanosa Grupo', r: 'Espace Auteur — L\'Antic Colonial', t: 'Showroom' },
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

document.getElementById('clients').innerHTML = CLIENTS.map((c) => `
  <article class="ccard">
    <span class="ccard__name">${c.n}</span>
    <span class="ccard__role">${c.r}</span>
    <span class="ccard__tag">${c.t}</span>
  </article>`).join('');

const tickerRow = document.getElementById('ticker');
tickerRow.innerHTML = [...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t) => `<span>${t}</span>`).join('');

document.getElementById('year').textContent = new Date().getFullYear();

/* ══════════════════════════════════════════
   2. Défilement fluide (natif, jamais capturé)
   ══════════════════════════════════════════ */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.6 });
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
  gsap.to(heroImg, { scale: 1.16, duration: 22, ease: 'none', repeat: -1, yoyo: true });

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
   5. Révélations
   ══════════════════════════════════════════ */
if (!reduced) {
  // titres : glissement vertical ligne par ligne
  document.querySelectorAll('.h2.reveal').forEach((h) => {
    gsap.from(h.querySelectorAll('.line > span'), {
      yPercent: 108, duration: 1.05, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: h, start: 'top 88%', once: true },
    });
  });

  // blocs de texte
  gsap.utils.toArray('.reveal-fade').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // cartes : apparition décalée
  [['.pcard', '.process__grid'], ['.ccard', '.clients__grid'], ['.acard', '.awards__grid']]
    .forEach(([sel, parent]) => {
      gsap.from(sel, {
        y: 34, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07,
        scrollTrigger: { trigger: parent, start: 'top 85%', once: true },
      });
    });

  gsap.from('.about__fig, .about__stats', {
    y: 44, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09,
    scrollTrigger: { trigger: '.about__grid', start: 'top 85%', once: true },
  });

  gsap.from('.project', {
    y: 40, opacity: 0, duration: 1.05, ease: 'expo.out',
    scrollTrigger: { trigger: '.projects__head', start: 'top 70%', once: true },
    stagger: 0.06,
  });
}

/* ── compteurs ─────────────────────────── */
document.querySelectorAll('.stat__num').forEach((el) => {
  const to = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  ScrollTrigger.create({
    trigger: el, start: 'top 92%', once: true,
    onEnter: () => {
      if (reduced) { el.textContent = to + suffix; return; }
      const o = { v: 0 };
      gsap.to(o, {
        v: to, duration: 1.6, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(o.v) + suffix; },
      });
    },
  });
});

/* ══════════════════════════════════════════
   6. Parallaxe d'images
   ══════════════════════════════════════════ */
if (!reduced) {
  gsap.utils.toArray('.parallax').forEach((fig) => {
    const img = fig.querySelector('img');
    if (!img) return;
    gsap.fromTo(img,
      { yPercent: -8, scale: 1.16 },
      {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true },
      });
  });
}

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

  // les cartes se redressent en entrant dans le cadre
  gsap.fromTo('.svc', { y: 26, opacity: 0 }, {
    y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06,
    scrollTrigger: { trigger: '.services', start: 'top 65%', once: true },
  });
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

  // balayage d'amorce quand la section entre à l'écran
  if (!reduced) {
    ScrollTrigger.create({
      trigger: box, start: 'top 75%', once: true,
      onEnter: () => {
        gsap.timeline()
          .to({ v: 50 }, { v: 78, duration: 1.1, ease: 'power2.inOut', onUpdate() { target = this.targets()[0].v; if (!raf) raf = requestAnimationFrame(draw); } })
          .to({ v: 78 }, { v: 32, duration: 1.2, ease: 'power2.inOut', onUpdate() { target = this.targets()[0].v; if (!raf) raf = requestAnimationFrame(draw); } })
          .to({ v: 32 }, { v: 50, duration: 0.9, ease: 'power2.inOut', onUpdate() { target = this.targets()[0].v; if (!raf) raf = requestAnimationFrame(draw); } });
      },
    });
  }
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

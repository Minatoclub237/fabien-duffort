/* Page portfolio : filtres animés par Flip, révélation des cartes,
   parallaxe interne des images. */
import { gsap, ScrollTrigger, Flip, defilement, revelerLignes, reveler, curseur, annee, reduit } from './commun.js';

defilement();
annee();
curseur();

const grille = document.getElementById('grille');
const cartes = [...grille.querySelectorAll('.pj')];
const chips = [...document.querySelectorAll('.chip')];
const cpt = document.getElementById('cpt');
const vide = document.getElementById('vide');

/* ── entrée de page ─────────────────────────────────── */
if (!reduit) {
  revelerLignes(document.querySelector('[data-split]'), { tout_de_suite: true, duree: 1.15, decalage: 0.09 });
  gsap.from('.pf__lead', { opacity: 0, y: 18, duration: 0.9, ease: 'expo.out', delay: 0.5, clearProps: 'all' });
  gsap.from('.chip', { opacity: 0, y: 14, duration: 0.7, ease: 'expo.out', stagger: 0.035, delay: 0.6, clearProps: 'all' });
}

/* ── révélation des cartes au défilement ────────────── */
if (!reduit) {
  reveler(cartes.map((c) => c.querySelector('.pj__bas')), { y: 16, duree: 0.85, decalage: 0.04 });
  cartes.forEach((c) => {
    const media = c.querySelector('.pj__media');
    const img = c.querySelector('img');
    gsap.fromTo(media,
      { clipPath: 'inset(14% 8% 14% 8% round 12px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 12px)', duration: 1.15, ease: 'expo.out',
        scrollTrigger: { trigger: c, start: 'top 92%', once: true },
      });
    // l'image glisse dans son cadre, à contresens du défilement
    gsap.fromTo(img, { yPercent: -2.5 }, {
      yPercent: 2.5, ease: 'none',
      scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ── filtres : les cartes rejoignent physiquement leur nouvelle place ── */
let filtreActif = 'tous';

function filtrer(f) {
  if (f === filtreActif) return;
  filtreActif = f;

  chips.forEach((c) => c.classList.toggle('is-on', c.dataset.f === f));

  const etat = Flip.getState(cartes, { props: 'opacity' });
  const gardees = [];
  cartes.forEach((c) => {
    const ok = f === 'tous' || c.dataset.secteur === f;
    c.style.display = ok ? '' : 'none';
    if (ok) gardees.push(c);
  });

  vide.hidden = gardees.length > 0;
  if (cpt) {
    const o = { v: +cpt.textContent };
    gsap.to(o, {
      v: gardees.length, duration: 0.5, ease: 'power2.out',
      onUpdate: () => { cpt.textContent = Math.round(o.v); },
    });
  }

  if (reduit) { ScrollTrigger.refresh(); return; }

  Flip.from(etat, {
    duration: 0.72,
    ease: 'power3.inOut',
    scale: true,
    absolute: true,
    stagger: 0.012,
    onEnter: (els) => gsap.fromTo(els,
      { opacity: 0, scale: 0.86 },
      { opacity: 1, scale: 1, duration: 0.55, ease: 'expo.out', stagger: 0.02 }),
    onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.32, ease: 'power2.in' }),
    onComplete: () => ScrollTrigger.refresh(),
  });
}

chips.forEach((c) => c.addEventListener('click', () => filtrer(c.dataset.f)));

/* le filtre survit au rechargement et alimente l'URL */
const dep = new URLSearchParams(location.search).get('p');
if (dep && chips.some((c) => c.dataset.f === dep)) filtrer(dep);
chips.forEach((c) => c.addEventListener('click', () => {
  const u = new URL(location.href);
  if (c.dataset.f === 'tous') u.searchParams.delete('p');
  else u.searchParams.set('p', c.dataset.f);
  history.replaceState(null, '', u);
}));

window.addEventListener('load', () => ScrollTrigger.refresh());
